<?php
/**
 * Theme options: defaults and accessor.
 *
 * All settings live in one autoloaded option, `hamista_options`. The Hamista Core
 * plugin provides the settings screen and may extend the defaults through the
 * `hamista/option_defaults` filter; the theme works with these defaults alone.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

/**
 * Default values for every theme-level option.
 *
 * @return array
 */
function hamista_option_defaults() {
	static $defaults = null;

	if ( null === $defaults ) {
		$defaults = apply_filters(
			'hamista/option_defaults',
			array(
				// Style.
				'kit'                   => 'spark',
				'container_width'       => 1150,
				'density'               => 'compact',
				'section_height'        => 500,
				'sound_enabled'         => false,
				'ui_persian'            => true,
				'color_scheme'          => 'light',
				'dark_toggle'           => true,
				'accent'                => '',
				'accent_dark'           => '',
				'page_transitions'      => true,
				'back_to_top'           => true,
				'breadcrumbs'           => true,

				// Typography.
				'font_body'             => 'iranyekan',
				'font_body_weight'      => '',
				'font_heading'          => 'iranyekan',
				'font_heading_weight'   => '',
				'font_numbers'          => 'digits',
				'font_size'             => 16,
				'persian_digits'        => true,

				// Header.
				'logo_dark'             => 0,
				'logo_height'           => 40,
				'header_layout'         => 'split',
				'header_sticky'         => true,
				'header_hide_on_scroll' => true,
				'header_search'         => true,
				'header_account'        => true,
				'header_cart'           => true,
				'header_cta_text'       => '',
				'header_cta_url'        => '',
				'mobile_bar'            => false,
				'mobile_bar_text'       => '',
				'mobile_bar_url'        => '',
				'mobile_bar_phone'      => '',
				'mobile_bar_whatsapp'   => '',

				// Footer.
				'footer_about'          => '',
				'footer_copyright'      => '',
				'footer_social'         => array(),
				'footer_wordmark'       => true,
				'footer_columns'        => 3,

				// Blog.
				'blog_layout'           => 'grid',
				'blog_columns'          => 3,
				'blog_featured_first'   => true,
				'blog_sidebar'          => false,
				'reading_time'          => true,
				'single_progress'       => true,
				'single_share'          => true,
				'single_author'         => true,
				'single_nav'            => true,
				'single_related'        => true,

				// Shop.
				'shop_columns'          => 3,
				'shop_sidebar'          => false,
				'shop_hover_image'      => true,
			)
		);
	}

	return $defaults;
}

/**
 * Saved options merged over defaults (cached per request).
 *
 * @param bool $refresh Re-read from the database.
 * @return array
 */
function hamista_options( $refresh = false ) {
	static $options = null;

	if ( null === $options || $refresh ) {
		$saved   = get_option( 'hamista_options', array() );
		$options = array_merge( hamista_option_defaults(), is_array( $saved ) ? $saved : array() );
	}

	return $options;
}

/**
 * Read a single option.
 *
 * @param string $key     Option key.
 * @param mixed  $default Fallback when the key is unknown.
 * @return mixed
 */
function hamista_option( $key, $default = null ) {
	$options = hamista_options();
	$value   = array_key_exists( $key, $options ) ? $options[ $key ] : $default;

	return apply_filters( "hamista/option/{$key}", $value );
}

// Keep the per-request cache honest when options change mid-request (e.g. demo import).
add_action(
	'update_option_hamista_options',
	static function () {
		hamista_options( true );
	}
);
add_action(
	'add_option_hamista_options',
	static function () {
		hamista_options( true );
	}
);
