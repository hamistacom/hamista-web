<?php
/**
 * Form submissions (contact + newsletter): REST endpoint, spam protection,
 * storage in a private post type and email notification.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Forms;

use Hamista\Core\Elementor\Widgets\Contact_Form;

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

		$form     = 'newsletter' === ( $params['form'] ?? '' ) ? 'newsletter' : 'contact';
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
		} else {
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

		$title = 'newsletter' === $form
			? sprintf( /* translators: %s: email */ __( 'Newsletter: %s', 'hamista-core' ), $values['email'] )
			: sprintf( /* translators: %s: sender name or email */ __( 'Message from %s', 'hamista-core' ), $values['name'] ?? ( $values['email'] ?? __( 'a visitor', 'hamista-core' ) ) );

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

		if ( 'contact' === $form ) {
			$to   = ! empty( $settings['to'] ) && is_email( $settings['to'] ) ? $settings['to'] : get_option( 'admin_email' );
			$body = '';
			foreach ( $values as $key => $value ) {
				$body .= ucfirst( $key ) . ': ' . $value . "\n";
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
		 * @param string $form   contact|newsletter.
		 * @param array  $values Sanitised values.
		 * @param int    $post_id Stored message ID.
		 */
		do_action( 'hamista_core/form_submitted', $form, $values, $post_id );

		if ( 'contact' === $form ) {
			$message = ! empty( $settings['success'] ) ? $settings['success'] : __( 'Thanks! Your message is on its way — we usually reply within a day.', 'hamista-core' );
		} else {
			$message = __( 'Thanks! You are on the list.', 'hamista-core' );
		}
		return rest_ensure_response( array( 'message' => $message ) );
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
					$found = isset( $element['settings'] ) ? (array) $element['settings'] : array();
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
		// Unset keys fall back to the widget defaults.
		$defaults = array(
			'show_name'    => 'yes',
			'show_email'   => 'yes',
			'show_message' => 'yes',
			'req_name'     => 'yes',
			'req_message'  => 'yes',
		);
		return array_merge( $defaults, $found );
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
			echo esc_html( 'newsletter' === get_post_meta( $post_id, '_hm_form', true ) ? __( 'Newsletter', 'hamista-core' ) : __( 'Contact', 'hamista-core' ) );
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
				echo '<table class="widefat striped"><tbody>';
				foreach ( $values as $key => $value ) {
					echo '<tr><th style="width:140px">' . esc_html( ucfirst( $key ) ) . '</th><td>' . nl2br( esc_html( $value ) ) . '</td></tr>';
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
