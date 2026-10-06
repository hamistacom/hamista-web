<?php
/**
 * Settings store, sanitisation and REST API.
 *
 * One autoloaded option (`hamista_options`) shared with the theme. The schema
 * (schema.php) drives both the admin UI and server-side sanitisation, so a new
 * setting is added in exactly one place.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Settings;

defined( 'ABSPATH' ) || exit;

/**
 * Settings.
 */
class Settings {

	const OPTION    = 'hamista_options';
	const REST_NS   = 'hamista/v1';
	const CAPABILITY = 'manage_options';

	/**
	 * Cached merged values.
	 *
	 * @var array|null
	 */
	private static $values = null;

	/**
	 * Hooks.
	 */
	public static function init() {
		add_filter( 'hamista/option_defaults', array( __CLASS__, 'merge_theme_defaults' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
		add_action( 'update_option_' . self::OPTION, array( __CLASS__, 'flush' ) );
		add_action( 'add_option_' . self::OPTION, array( __CLASS__, 'flush' ) );
	}

	/**
	 * Default values (cheap: no translations).
	 *
	 * @return array
	 */
	public static function defaults() {
		static $defaults = null;
		if ( null === $defaults ) {
			$defaults = apply_filters( 'hamista_core/settings_defaults', require __DIR__ . '/defaults.php' );
		}
		return $defaults;
	}

	/**
	 * Theme defaults extended with the plugin's.
	 *
	 * @param array $defaults Theme defaults.
	 * @return array
	 */
	public static function merge_theme_defaults( $defaults ) {
		return array_merge( $defaults, self::defaults() );
	}

	/**
	 * All values (saved over defaults).
	 *
	 * @return array
	 */
	public static function all() {
		if ( null === self::$values ) {
			$saved        = get_option( self::OPTION, array() );
			self::$values = array_merge( self::defaults(), is_array( $saved ) ? $saved : array() );
		}
		return self::$values;
	}

	/**
	 * One value.
	 *
	 * @param string $key     Key.
	 * @param mixed  $default Fallback for unknown keys.
	 * @return mixed
	 */
	public static function get( $key, $default = null ) {
		$all = self::all();
		return array_key_exists( $key, $all ) ? $all[ $key ] : $default;
	}

	/**
	 * Drop the cache.
	 */
	public static function flush() {
		self::$values = null;
	}

	/**
	 * Full schema with dynamic choices resolved (admin/REST only).
	 *
	 * @return array
	 */
	public static function schema() {
		$schema = apply_filters( 'hamista_core/settings_schema', require __DIR__ . '/schema.php' );
		$fonts  = self::font_choices();

		foreach ( $schema as $section_id => $section ) {
			if ( empty( $section['fields'] ) ) {
				continue;
			}
			foreach ( $section['fields'] as $key => $field ) {
				if ( isset( $field['choices'] ) && 'font_families' === $field['choices'] ) {
					$schema[ $section_id ]['fields'][ $key ]['choices'] = $fonts;
				}
				$schema[ $section_id ]['fields'][ $key ]['default'] = self::defaults()[ $key ] ?? null;
			}
		}
		return $schema;
	}

	/**
	 * Flat map of field key => field definition.
	 *
	 * @return array
	 */
	public static function fields() {
		$fields = array();
		foreach ( self::schema() as $section ) {
			if ( ! empty( $section['fields'] ) ) {
				$fields += $section['fields'];
			}
		}
		return $fields;
	}

	/**
	 * Font family choices for select fields.
	 *
	 * @return array slug => label
	 */
	public static function font_choices() {
		$choices = array();
		if ( function_exists( 'hamista_font_families' ) ) {
			foreach ( hamista_font_families() as $slug => $family ) {
				$label = $family['label'];
				if ( empty( $family['faces'] ) && 'vazirmatn' !== $slug ) {
					/* translators: %s: font name */
					$label = sprintf( __( '%s (no files yet — falls back)', 'hamista-core' ), $label );
				}
				$choices[ $slug ] = $label;
			}
		} else {
			$choices = array(
				'yekan-bakh' => 'Yekan Bakh',
				'vazirmatn'  => 'Vazirmatn',
				'digits'     => 'Digits',
			);
		}
		$choices['system'] = __( 'System font', 'hamista-core' );
		return $choices;
	}

	/**
	 * Sanitise incoming values against the schema. Unknown keys are dropped.
	 *
	 * @param array $input Raw values.
	 * @return array Clean values (only keys present in $input).
	 */
	public static function sanitize( $input ) {
		$fields   = self::fields();
		$defaults = self::defaults();
		$clean    = array();

		foreach ( (array) $input as $key => $value ) {
			if ( ! isset( $fields[ $key ] ) || 'action' === $fields[ $key ]['type'] ) {
				continue;
			}
			$clean[ $key ] = self::sanitize_field( $value, $fields[ $key ], $defaults[ $key ] ?? null );
		}
		return $clean;
	}

	/**
	 * Sanitise a single value by field type.
	 *
	 * @param mixed $value   Raw value.
	 * @param array $field   Field definition.
	 * @param mixed $default Default.
	 * @return mixed
	 */
	public static function sanitize_field( $value, $field, $default ) {
		switch ( $field['type'] ) {
			case 'toggle':
				return (bool) filter_var( $value, FILTER_VALIDATE_BOOLEAN );

			case 'select':
			case 'cards':
				$choices = isset( $field['choices'] ) && is_array( $field['choices'] ) ? array_map( 'strval', array_keys( $field['choices'] ) ) : array();
				$value   = (string) $value;
				if ( ! in_array( $value, $choices, true ) ) {
					return $default;
				}
				return is_int( $default ) ? (int) $value : $value;

			case 'color':
				$value = sanitize_hex_color( (string) $value );
				return $value ? $value : '';

			case 'range':
			case 'number':
				$num = is_numeric( $value ) ? $value + 0 : $default;
				if ( isset( $field['min'] ) ) {
					$num = max( $field['min'], $num );
				}
				if ( isset( $field['max'] ) ) {
					$num = min( $field['max'], $num );
				}
				return is_int( $default ) ? (int) round( $num ) : (float) $num;

			case 'media':
				return absint( $value );

			case 'url':
				return esc_url_raw( (string) $value );

			case 'textarea':
				return wp_kses_post( (string) $value );

			case 'password':
			case 'text':
				return sanitize_text_field( (string) $value );

			case 'code':
				if ( isset( $field['mode'] ) && 'css' === $field['mode'] ) {
					return wp_strip_all_tags( (string) $value );
				}
				return current_user_can( 'unfiltered_html' ) ? (string) $value : wp_kses_post( (string) $value );

			case 'repeater':
				$rows = array();
				foreach ( (array) $value as $row ) {
					$clean_row = array();
					foreach ( $field['fields'] as $sub_key => $sub_field ) {
						$clean_row[ $sub_key ] = self::sanitize_field( isset( $row[ $sub_key ] ) ? $row[ $sub_key ] : '', $sub_field, '' );
					}
					if ( array_filter( $clean_row ) ) {
						$rows[] = $clean_row;
					}
				}
				return $rows;

			case 'fonts':
				return self::sanitize_fonts( $value );
		}
		return $default;
	}

	/**
	 * Font manager value: [ { family, files: [ { id, url, weight, style } ] } ].
	 *
	 * @param mixed $value Raw.
	 * @return array
	 */
	private static function sanitize_fonts( $value ) {
		$families = array();
		foreach ( (array) $value as $family ) {
			$name = isset( $family['family'] ) ? sanitize_text_field( $family['family'] ) : '';
			if ( '' === $name ) {
				continue;
			}
			$files = array();
			foreach ( isset( $family['files'] ) ? (array) $family['files'] : array() as $file ) {
				$url = isset( $file['url'] ) ? esc_url_raw( $file['url'] ) : '';
				if ( ! $url || ! preg_match( '/\.(woff2?|ttf|otf)(\?.*)?$/i', $url ) ) {
					continue;
				}
				$weight = isset( $file['weight'] ) ? preg_replace( '/[^0-9 ]/', '', (string) $file['weight'] ) : '400';
				$files[] = array(
					'id'     => isset( $file['id'] ) ? absint( $file['id'] ) : 0,
					'url'    => $url,
					'weight' => $weight ? $weight : '400',
					'style'  => isset( $file['style'] ) && 'italic' === $file['style'] ? 'italic' : 'normal',
				);
			}
			$families[] = array(
				'family' => $name,
				'files'  => $files,
			);
		}
		return $families;
	}

	/**
	 * Save values (merged over what is stored). Runs side effects through an action.
	 *
	 * @param array $values Raw values.
	 * @return array All values after saving.
	 */
	public static function save( $values ) {
		$old   = self::all();
		$clean = self::sanitize( $values );
		$saved = get_option( self::OPTION, array() );
		$saved = array_merge( is_array( $saved ) ? $saved : array(), $clean );

		update_option( self::OPTION, $saved, true );
		self::flush();

		// The logo lives in WordPress' own setting so other plugins and the Customizer see it.
		if ( array_key_exists( 'logo', $clean ) ) {
			set_theme_mod( 'custom_logo', $clean['logo'] );
		}

		/**
		 * Fires after settings are saved.
		 *
		 * @param array $new All new values.
		 * @param array $old All previous values.
		 * @param array $clean The values that were submitted.
		 */
		do_action( 'hamista_core/settings_saved', self::all(), $old, $clean );

		return self::all();
	}

	/**
	 * REST routes.
	 */
	public static function register_routes() {
		$permission = static function () {
			return current_user_can( self::CAPABILITY );
		};

		register_rest_route(
			self::REST_NS,
			'/settings',
			array(
				array(
					'methods'             => 'GET',
					'callback'            => static function () {
						return rest_ensure_response( self::admin_values() );
					},
					'permission_callback' => $permission,
				),
				array(
					'methods'             => 'POST',
					'callback'            => static function ( \WP_REST_Request $request ) {
						$values = $request->get_param( 'values' );
						if ( ! is_array( $values ) ) {
							return new \WP_Error( 'hamista_bad_request', __( 'Nothing to save.', 'hamista-core' ), array( 'status' => 400 ) );
						}
						self::save( $values );
						return rest_ensure_response(
							array(
								'values'  => self::admin_values(),
								'message' => __( 'Settings saved.', 'hamista-core' ),
							)
						);
					},
					'permission_callback' => $permission,
				),
			)
		);

		register_rest_route(
			self::REST_NS,
			'/settings/reset',
			array(
				'methods'             => 'POST',
				'callback'            => static function ( \WP_REST_Request $request ) {
					$section = sanitize_key( (string) $request->get_param( 'section' ) );
					$schema  = self::schema();
					$saved   = get_option( self::OPTION, array() );
					$keys    = $section && isset( $schema[ $section ]['fields'] ) ? array_keys( $schema[ $section ]['fields'] ) : array_keys( self::defaults() );
					foreach ( $keys as $key ) {
						unset( $saved[ $key ] );
					}
					update_option( self::OPTION, $saved, true );
					self::flush();
					do_action( 'hamista_core/settings_saved', self::all(), array(), array() );
					return rest_ensure_response( array( 'values' => self::admin_values() ) );
				},
				'permission_callback' => $permission,
			)
		);

		register_rest_route(
			self::REST_NS,
			'/settings/import',
			array(
				'methods'             => 'POST',
				'callback'            => static function ( \WP_REST_Request $request ) {
					$data = $request->get_param( 'data' );
					if ( is_string( $data ) ) {
						$data = json_decode( $data, true );
					}
					if ( ! is_array( $data ) || empty( $data['hamista'] ) || ! is_array( $data['values'] ?? null ) ) {
						return new \WP_Error( 'hamista_bad_file', __( 'This is not a Hamista settings file.', 'hamista-core' ), array( 'status' => 400 ) );
					}
					self::save( $data['values'] );
					return rest_ensure_response(
						array(
							'values'  => self::admin_values(),
							'message' => __( 'Settings imported.', 'hamista-core' ),
						)
					);
				},
				'permission_callback' => $permission,
			)
		);
	}

	/**
	 * Values for the admin app (adds media URLs for previews).
	 *
	 * @return array
	 */
	public static function admin_values() {
		$values = self::all();
		if ( ! $values['logo'] ) {
			$values['logo'] = (int) get_theme_mod( 'custom_logo' );
		}
		$values['_media'] = array();
		foreach ( array( 'logo', 'logo_dark' ) as $key ) {
			if ( $values[ $key ] ) {
				$values['_media'][ $values[ $key ] ] = wp_get_attachment_image_url( $values[ $key ], 'medium' );
			}
		}
		return $values;
	}
}
