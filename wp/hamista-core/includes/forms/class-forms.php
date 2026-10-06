<?php
/**
 * Form submissions (contact + newsletter): REST endpoint, spam protection,
 * storage in a private post type and email notification.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Forms;

use Hamista\Core\Elementor\Widgets\Contact_Form;
use Hamista\Core\Elementor\Widgets\Lead_Form;

defined( 'ABSPATH' ) || exit;

/**
 * Forms.
 */
class Forms {

	const POST_TYPE = 'hm_message';

	/**
	 * Hooks.
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_post_type' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
		add_filter( 'manage_' . self::POST_TYPE . '_posts_columns', array( __CLASS__, 'columns' ) );
		add_action( 'manage_' . self::POST_TYPE . '_posts_custom_column', array( __CLASS__, 'column' ), 10, 2 );
		add_action( 'add_meta_boxes', array( __CLASS__, 'meta_box' ) );
	}

	/**
	 * Private post type for received messages (Hamista → Form messages).
	 */
	public static function register_post_type() {
		register_post_type(
			self::POST_TYPE,
			array(
				'labels'          => array(
					'name'          => __( 'Form messages', 'hamista-core' ),
					'singular_name' => __( 'Form message', 'hamista-core' ),
					'menu_name'     => __( 'Form messages', 'hamista-core' ),
					'not_found'     => __( 'No messages yet.', 'hamista-core' ),
				),
				'public'          => false,
				'show_ui'         => true,
				'show_in_menu'    => false,
				'supports'        => array( 'title' ),
				'capability_type' => 'post',
				'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
				'map_meta_cap'    => true,
			)
		);
	}

	/**
	 * REST route.
	 */
	public static function register_routes() {
		register_rest_route(
			'hamista/v1',
			'/forms/submit',
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'submit' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Handle a submission.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public static function submit( $request ) {
		$params = $request->get_params();

		// Honeypot: bots fill every field. Pretend success.
		if ( ! empty( $params['hm_hp'] ) ) {
			return rest_ensure_response( array( 'message' => __( 'Thanks!', 'hamista-core' ) ) );
		}

		// 6 submissions per IP per 10 minutes.
		$ip_key = 'hm_form_' . md5( self::ip() );
		$hits   = (int) get_transient( $ip_key );
		if ( $hits >= 6 ) {
			return new \WP_Error( 'hamista_rate', __( 'Too many messages. Please try again in a few minutes.', 'hamista-core' ), array( 'status' => 429 ) );
		}

		$form     = in_array( $params['form'] ?? '', array( 'newsletter', 'lead' ), true ) ? $params['form'] : 'contact';
		$settings = self::widget_settings( absint( $params['post_id'] ?? 0 ), sanitize_key( $params['element'] ?? '' ) );
		if ( null === $settings ) {
			return new \WP_Error( 'hamista_form', __( 'This form is no longer available. Please reload the page.', 'hamista-core' ), array( 'status' => 400 ) );
		}

		$values  = array();
		$invalid = array();

		if ( 'newsletter' === $form ) {
			$email = sanitize_email( $params['email'] ?? '' );
			if ( ! is_email( $email ) ) {
				$invalid[] = 'email';
			}
			$values['email'] = $email;
		} elseif ( 'lead' === $form ) {
			list( $values, $invalid ) = self::lead_values( $params, Lead_Form::normalize( $settings ) );
		} else {
			// Unset keys fall back to the widget defaults.
			$settings = array_merge(
				array(
					'show_name'    => 'yes',
					'show_email'   => 'yes',
					'show_message' => 'yes',
					'req_name'     => 'yes',
					'req_message'  => 'yes',
				),
				$settings
			);
			foreach ( Contact_Form::fields() as $key => $field ) {
				if ( empty( $settings[ 'show_' . $key ] ) || 'yes' !== $settings[ 'show_' . $key ] ) {
					continue;
				}
				$raw = isset( $params[ $key ] ) ? wp_unslash( $params[ $key ] ) : '';
				switch ( $key ) {
					case 'email':
						$value = sanitize_email( $raw );
						if ( '' !== $raw && ! is_email( $value ) ) {
							$invalid[] = $key;
						}
						break;
					case 'phone':
						$value = preg_replace( '/[^0-9+\-\s()]/', '', hamista_core_latin_digits( $raw ) );
						break;
					case 'message':
						$value = sanitize_textarea_field( $raw );
						break;
					default:
						$value = sanitize_text_field( $raw );
				}
				if ( ! empty( $settings[ 'req_' . $key ] ) && 'yes' === $settings[ 'req_' . $key ] && '' === trim( (string) $value ) ) {
					$invalid[] = $key;
				}
				$values[ $key ] = mb_substr( (string) $value, 0, 'message' === $key ? 5000 : 200 );
			}
			if ( ! empty( $settings['consent'] ) && empty( $params['consent'] ) ) {
				$invalid[] = 'consent';
			}
		}

		if ( $invalid ) {
			return new \WP_Error(
				'hamista_invalid',
				__( 'Please check the highlighted fields.', 'hamista-core' ),
				array(
					'status' => 422,
					'fields' => array_values( array_unique( $invalid ) ),
				)
			);
		}

		set_transient( $ip_key, $hits + 1, 10 * MINUTE_IN_SECONDS );

		if ( 'newsletter' === $form ) {
			/* translators: %s: email */
			$title = sprintf( __( 'Newsletter: %s', 'hamista-core' ), $values['email'] );
		} elseif ( 'lead' === $form ) {
			/* translators: %s: visitor name */
			$title = sprintf( __( 'Project request from %s', 'hamista-core' ), $values['name'] );
		} else {
			/* translators: %s: sender name or email */
			$title = sprintf( __( 'Message from %s', 'hamista-core' ), $values['name'] ?? ( $values['email'] ?? __( 'a visitor', 'hamista-core' ) ) );
		}

		$post_id = wp_insert_post(
			array(
				'post_type'   => self::POST_TYPE,
				'post_status' => 'private',
				'post_title'  => wp_strip_all_tags( $title ),
			)
		);
		if ( $post_id && ! is_wp_error( $post_id ) ) {
			update_post_meta( $post_id, '_hm_form', $form );
			update_post_meta( $post_id, '_hm_values', $values );
			update_post_meta( $post_id, '_hm_page', absint( $params['post_id'] ?? 0 ) );
		}

		if ( 'newsletter' !== $form ) {
			$to   = ! empty( $settings['to'] ) && is_email( $settings['to'] ) ? $settings['to'] : get_option( 'admin_email' );
			$body = '';
			$labels = self::labels();
			foreach ( $values as $key => $value ) {
				$body .= ( $labels[ $key ] ?? ucfirst( $key ) ) . ': ' . $value . "\n";
			}
			$body   .= "\n" . get_permalink( absint( $params['post_id'] ?? 0 ) );
			$headers = array();
			if ( ! empty( $values['email'] ) ) {
				$headers[] = 'Reply-To: ' . ( $values['name'] ?? '' ) . ' <' . $values['email'] . '>';
			}
			wp_mail( $to, '[' . wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES ) . '] ' . $title, $body, $headers );
		}

		/**
		 * After a form submission is stored.
		 *
		 * @param string $form   contact|lead|newsletter.
		 * @param array  $values Sanitised values.
		 * @param int    $post_id Stored message ID.
		 */
		do_action( 'hamista_core/form_submitted', $form, $values, $post_id );

		if ( 'lead' === $form ) {
			$message = ! empty( $settings['done_title'] ) ? $settings['done_title'] : __( 'Request received', 'hamista-core' );
		} elseif ( 'contact' === $form ) {
			$message = ! empty( $settings['success'] ) ? $settings['success'] : __( 'Thanks! Your message is on its way — we usually reply within a day.', 'hamista-core' );
		} else {
			$message = __( 'Thanks! You are on the list.', 'hamista-core' );
		}
		return rest_ensure_response( array( 'message' => $message ) );
	}

	/**
	 * Validate a multi-step lead form submission against the widget's own options,
	 * so only answers the form actually offered are accepted.
	 *
	 * @param array $params   Request parameters.
	 * @param array $settings Widget settings (normalised).
	 * @return array [ values, invalid field names ]
	 */
	private static function lead_values( $params, $settings ) {
		$values  = array();
		$invalid = array();

		$offered = array();
		foreach ( (array) $settings['choices'] as $choice ) {
			$label = trim( (string) ( $choice['label'] ?? '' ) );
			if ( '' !== $label ) {
				$offered[] = $label;
			}
		}
		$need = array_values( array_intersect( array_map( 'sanitize_text_field', array_map( 'wp_unslash', (array) ( $params['need'] ?? array() ) ) ), $offered ) );
		if ( ! $need ) {
			$invalid[] = 'need[]';
		}
		$values['need'] = implode( _x( ', ', 'list separator', 'hamista-core' ), 'yes' === $settings['multi'] ? $need : array_slice( $need, 0, 1 ) );

		if ( 'yes' === $settings['budget_on'] ) {
			$budget = sanitize_text_field( wp_unslash( $params['budget'] ?? '' ) );
			if ( ! in_array( $budget, Lead_Form::lines( $settings['budgets'] ), true ) ) {
				$invalid[] = 'budget';
			}
			$values['budget'] = $budget;
			if ( 'yes' === $settings['timeline_on'] ) {
				$timeline           = sanitize_text_field( wp_unslash( $params['timeline'] ?? '' ) );
				$values['timeline'] = in_array( $timeline, Lead_Form::lines( $settings['timelines'] ), true ) ? $timeline : '';
			}
		}

		foreach ( Lead_Form::contact_fields() as $key => $field ) {
			if ( 'yes' !== $settings[ 'show_' . $key ] ) {
				continue;
			}
			$raw      = isset( $params[ $key ] ) ? (string) wp_unslash( $params[ $key ] ) : '';
			$required = in_array( $key, array( 'name', 'phone' ), true ) || 'yes' === $settings[ 'req_' . $key ];
			switch ( $key ) {
				case 'phone':
					$value = class_exists( '\Hamista\Core\Auth\Otp' ) ? \Hamista\Core\Auth\Otp::normalize_mobile( $raw ) : preg_replace( '/[^0-9+]/', '', hamista_core_latin_digits( $raw ) );
					if ( '' === $value && '' !== trim( $raw ) ) {
						$invalid[] = $key;
					}
					break;
				case 'email':
					$value = sanitize_email( $raw );
					if ( '' !== trim( $raw ) && ! is_email( $value ) ) {
						$invalid[] = $key;
					}
					break;
				case 'message':
					$value = sanitize_textarea_field( $raw );
					break;
				default:
					$value = sanitize_text_field( $raw );
			}
			if ( $required && '' === trim( (string) $value ) ) {
				$invalid[] = $key;
			}
			$values[ $key ] = mb_substr( (string) $value, 0, 'message' === $key ? 5000 : 200 );
		}
		if ( ! empty( $settings['consent'] ) && empty( $params['consent'] ) ) {
			$invalid[] = 'consent';
		}
		return array( $values, $invalid );
	}

	/**
	 * Human labels for stored values (emails and the message screen).
	 *
	 * @return array
	 */
	public static function labels() {
		return array(
			'name'     => __( 'Name', 'hamista-core' ),
			'email'    => __( 'Email', 'hamista-core' ),
			'phone'    => __( 'Mobile', 'hamista-core' ),
			'subject'  => __( 'Subject', 'hamista-core' ),
			'message'  => __( 'Message', 'hamista-core' ),
			'need'     => __( 'Needs', 'hamista-core' ),
			'budget'   => __( 'Budget', 'hamista-core' ),
			'timeline' => __( 'Start', 'hamista-core' ),
			'company'  => __( 'Business', 'hamista-core' ),
		);
	}

	/**
	 * Find a widget's saved settings inside an Elementor page.
	 *
	 * @param int    $post_id    Page ID.
	 * @param string $element_id Element ID.
	 * @return array|null
	 */
	private static function widget_settings( $post_id, $element_id ) {
		if ( ! $post_id || ! $element_id || ! class_exists( '\Elementor\Plugin' ) ) {
			return null;
		}
		$document = \Elementor\Plugin::$instance->documents->get( $post_id );
		if ( ! $document ) {
			return null;
		}
		$found = null;
		$walk  = static function ( $elements ) use ( &$walk, &$found, $element_id ) {
			foreach ( (array) $elements as $element ) {
				if ( null !== $found ) {
					return;
				}
				if ( isset( $element['id'] ) && $element['id'] === $element_id ) {
					$found = $element;
					return;
				}
				if ( ! empty( $element['elements'] ) ) {
					$walk( $element['elements'] );
				}
			}
		};
		$walk( $document->get_elements_data() );

		if ( null === $found ) {
			return null;
		}
		// Let Elementor merge in control defaults (settings left untouched in the editor are not stored).
		$widget = \Elementor\Plugin::$instance->elements_manager->create_element_instance( $found );
		return $widget ? (array) $widget->get_settings() : (array) ( $found['settings'] ?? array() );
	}

	/**
	 * Visitor IP (best effort; proxies may hide it).
	 *
	 * @return string
	 */
	private static function ip() {
		return isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '0.0.0.0';
	}

	/**
	 * List table columns.
	 *
	 * @param array $columns Columns.
	 * @return array
	 */
	public static function columns( $columns ) {
		return array(
			'cb'       => $columns['cb'],
			'title'    => __( 'From', 'hamista-core' ),
			'hm_form'  => __( 'Form', 'hamista-core' ),
			'hm_email' => __( 'Email / Mobile', 'hamista-core' ),
			'date'     => $columns['date'],
		);
	}

	/**
	 * Column content.
	 *
	 * @param string $column  Column.
	 * @param int    $post_id Post ID.
	 */
	public static function column( $column, $post_id ) {
		$values = (array) get_post_meta( $post_id, '_hm_values', true );
		if ( 'hm_form' === $column ) {
			$types = array(
				'newsletter' => __( 'Newsletter', 'hamista-core' ),
				'lead'       => __( 'Project request', 'hamista-core' ),
				'contact'    => __( 'Contact', 'hamista-core' ),
			);
			$type  = (string) get_post_meta( $post_id, '_hm_form', true );
			echo esc_html( $types[ $type ] ?? $types['contact'] );
		}
		if ( 'hm_email' === $column ) {
			echo esc_html( trim( ( $values['email'] ?? '' ) . ' ' . ( $values['phone'] ?? '' ) ) );
		}
	}

	/**
	 * Read-only message view.
	 */
	public static function meta_box() {
		add_meta_box(
			'hm-message',
			__( 'Message', 'hamista-core' ),
			static function ( $post ) {
				$values = (array) get_post_meta( $post->ID, '_hm_values', true );
				$labels = self::labels();
				echo '<table class="widefat striped"><tbody>';
				foreach ( $values as $key => $value ) {
					echo '<tr><th style="width:140px">' . esc_html( $labels[ $key ] ?? ucfirst( $key ) ) . '</th><td>' . nl2br( esc_html( $value ) ) . '</td></tr>';
				}
				$page = (int) get_post_meta( $post->ID, '_hm_page', true );
				if ( $page ) {
					echo '<tr><th>' . esc_html__( 'Page', 'hamista-core' ) . '</th><td><a href="' . esc_url( get_permalink( $page ) ) . '">' . esc_html( get_the_title( $page ) ) . '</a></td></tr>';
				}
				echo '</tbody></table>';
			},
			self::POST_TYPE,
			'normal',
			'high'
		);
	}
}
