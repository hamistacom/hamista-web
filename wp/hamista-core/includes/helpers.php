<?php
/**
 * Global helper functions (namespaced prefix `hamista_core_`).
 *
 * @package Hamista\Core
 */

defined( 'ABSPATH' ) || exit;

/**
 * Read a setting (theme + plugin share the `hamista_options` array).
 *
 * @param string $key     Setting key.
 * @param mixed  $default Fallback.
 * @return mixed
 */
function hamista_core_option( $key, $default = null ) {
	return \Hamista\Core\Settings\Settings::get( $key, $default );
}

/**
 * Whether the Hamista theme (or a child of it) is active.
 *
 * @return bool
 */
function hamista_core_theme_active() {
	return 'hamista' === get_template();
}

/**
 * Convert Persian/Arabic digits to Latin digits (for phone numbers, codes).
 *
 * @param string $value Input.
 * @return string
 */
function hamista_core_latin_digits( $value ) {
	return strtr(
		(string) $value,
		array(
			'۰' => '0', '۱' => '1', '۲' => '2', '۳' => '3', '۴' => '4', '۵' => '5', '۶' => '6', '۷' => '7', '۸' => '8', '۹' => '9',
			'٠' => '0', '١' => '1', '٢' => '2', '٣' => '3', '٤' => '4', '٥' => '5', '٦' => '6', '٧' => '7', '٨' => '8', '٩' => '9',
		)
	);
}

/**
 * Persian digits for display (when the site is Persian and the option is on).
 *
 * @param string|int $value Input.
 * @return string
 */
function hamista_core_digits( $value ) {
	if ( function_exists( 'hamista_digits' ) ) {
		return hamista_digits( $value );
	}
	$value = (string) $value;
	if ( 0 !== strpos( get_locale(), 'fa' ) ) {
		return $value;
	}
	return strtr( $value, array_combine( range( 0, 9 ), array( '۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹' ) ) );
}

/**
 * Inline SVG icon — uses the theme's set when available.
 *
 * @param string $name  Icon name.
 * @param array  $attrs Attributes.
 * @return string
 */
function hamista_core_icon( $name, $attrs = array() ) {
	if ( function_exists( 'hamista_get_icon' ) ) {
		$svg = hamista_get_icon( $name, $attrs );
		if ( $svg ) {
			return $svg;
		}
	}
	return \Hamista\Core\Icons::get( $name, $attrs );
}

/**
 * Turn `*word*` into a highlighted span, escaping everything else.
 *
 * @param string $text Text with optional *highlight* markers and line breaks.
 * @return string Safe HTML.
 */
function hamista_core_highlight( $text ) {
	$text = esc_html( (string) $text );
	$text = preg_replace( '/\*([^*]+)\*/u', '<span class="hm-hl">$1</span>', $text );
	return nl2br( $text, false );
}

/**
 * Render an image from an Elementor media control value (or an attachment ID).
 *
 * @param array|int $media Elementor media array [id,url] or attachment ID.
 * @param string    $size  Image size.
 * @param array     $attrs Extra attributes.
 * @return string
 */
function hamista_core_image( $media, $size = 'large', $attrs = array() ) {
	$id  = is_array( $media ) ? ( isset( $media['id'] ) ? (int) $media['id'] : 0 ) : (int) $media;
	$url = is_array( $media ) && ! empty( $media['url'] ) ? $media['url'] : '';

	$attrs = array_merge( array( 'loading' => 'lazy', 'decoding' => 'async' ), $attrs );

	if ( $id && wp_attachment_is_image( $id ) ) {
		return wp_get_attachment_image( $id, $size, false, $attrs );
	}
	if ( ! $url || false !== strpos( $url, 'placeholder.png' ) ) {
		return '';
	}

	$html = '<img src="' . esc_url( $url ) . '"';
	foreach ( $attrs as $name => $value ) {
		$html .= ' ' . esc_attr( $name ) . '="' . esc_attr( $value ) . '"';
	}
	if ( ! isset( $attrs['alt'] ) ) {
		$html .= ' alt=""';
	}
	return $html . '>';
}

/**
 * Render a template file from the plugin's templates/ folder, overridable from
 * the child/parent theme at hamista-core/{name}.php.
 *
 * @param string $name Template name without extension.
 * @param array  $args Variables.
 */
function hamista_core_template( $name, $args = array() ) {
	$file = locate_template( 'hamista-core/' . $name . '.php' );
	if ( ! $file ) {
		$file = HAMISTA_CORE_DIR . 'templates/' . $name . '.php';
	}
	if ( is_readable( $file ) ) {
		load_template( $file, false, $args );
	}
}
