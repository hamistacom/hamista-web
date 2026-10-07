<?php
/**
 * Inline SVG icon set (24×24, 1.75 stroke). Inline SVGs avoid an icon font
 * request and inherit `currentColor`.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

/**
 * SVG path data per icon name.
 *
 * @return array
 */
function hamista_icon_paths() {
	return apply_filters(
		'hamista/icons',
		array(
			'search'    => '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
			'sun'       => '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
			'sound'     => '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
			'mute'      => '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5m0-5-5 5"/>',
			'moon'      => '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/>',
			'user'      => '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
			'bag'       => '<path d="M5 8h14l-1.2 11.2A2 2 0 0 1 15.8 21H8.2a2 2 0 0 1-2-1.8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
			'menu'      => '<path d="M4 7h16M4 12h16M4 17h10"/>',
			'close'     => '<path d="M6 6l12 12M18 6 6 18"/>',
			'arrow'     => '<path d="M19 12H5m6-6-6 6 6 6"/>',
			'arrow-up'  => '<path d="M12 19V5m-6 6 6-6 6 6"/>',
			'chevron'   => '<path d="m6 9 6 6 6-6"/>',
			'chevron-l' => '<path d="m15 6-6 6 6 6"/>',
			'chevron-r' => '<path d="m9 6 6 6-6 6"/>',
			'clock'     => '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
			'calendar'  => '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4m8-4v4"/>',
			'folder'    => '<path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z"/>',
			'tag'       => '<path d="M3.5 12.6V5.5a2 2 0 0 1 2-2h7.1l8 8a2 2 0 0 1 0 2.8l-7.1 7.1a2 2 0 0 1-2.8 0Z"/><circle cx="8" cy="8" r="1.4"/>',
			'link'      => '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
			'check'     => '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
			'plus'      => '<path d="M12 5v14M5 12h14"/>',
			'minus'     => '<path d="M5 12h14"/>',
			'mail'      => '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
			'phone'     => '<path d="M5 3.5h3.2l1.6 4.3-2.1 1.3a11 11 0 0 0 5.2 5.2l1.3-2.1 4.3 1.6V17a2.5 2.5 0 0 1-2.7 2.5A16.5 16.5 0 0 1 2.5 6.2 2.5 2.5 0 0 1 5 3.5Z"/>',
			'pin'       => '<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
			'heart'     => '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z"/>',
			'grid'      => '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
			'logout'    => '<path d="M14 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 16l-4-4 4-4M6 12h10"/>',
			'download'  => '<path d="M12 4v11m-4.5-4.5L12 15l4.5-4.5"/><path d="M5 19h14"/>',
			'card'      => '<rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="M3.5 10h17M7 14.5h4"/>',
			'receipt'   => '<path d="M6 3.5h12v17l-2.5-1.5-2 1.5-1.5-1.5-1.5 1.5-2-1.5L6 20.5Z"/><path d="M9 8h6M9 11.5h6M9 15h3.5"/>',
			'instagram' => '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>',
			'telegram'  => '<path d="m21 4.5-3 15.2c-.2 1-1 1.2-1.8.8l-4.6-3.4-2.2 2.1c-.3.3-.5.4-1 .4l.3-4.7 8.6-7.8c.4-.3-.1-.5-.6-.2L6.1 13.6 1.6 12.2c-1-.3-1-1 .2-1.5L19.6 3.8c.8-.3 1.6.2 1.4.7Z"/>',
			'whatsapp'  => '<path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.3 3.3Z"/><path d="M9 8.5c0 3.6 2.9 6.5 6.5 6.5l1-1.6-2-1-1 .9a5 5 0 0 1-2.8-2.8l.9-1-1-2Z"/>',
			'linkedin'  => '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13a2.5 2.5 0 0 1 5 0v3"/>',
			'x'         => '<path d="m4 4 16 16M20 4 4 20" stroke-width="2"/>',
			'youtube'   => '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10.5 9.5 4 2.5-4 2.5Z" fill="currentColor"/>',
			'eitaa'     => '<path d="M5 12c0-4 3.2-7 7.5-7S20 8 20 11.5 17 18 12.5 18c-1 0-2-.1-2.8-.4L5.5 19.5l1.2-3.6C5.6 14.9 5 13.6 5 12Z"/><path d="M9.5 11.5h6M9.5 14h3.5"/>',
			'bale'      => '<path d="M12 4.5c4.7 0 8 3 8 7s-3.3 7-8 7c-1 0-1.9-.1-2.7-.4L4.5 20l1.4-3.9C4.7 14.8 4 13.2 4 11.5c0-4 3.3-7 8-7Z"/><path d="m9 11.7 2.1 2.1L15.3 9.6"/>',
			'rubika'    => '<rect x="4" y="4" width="16" height="16" rx="5"/><path d="M9.5 15.5v-7h3.2a2.2 2.2 0 0 1 0 4.4H9.5m3 0 2.3 2.6"/>',
			'aparat'    => '<circle cx="12" cy="12" r="8.5"/><circle cx="9" cy="8.5" r="1.6"/><circle cx="15.5" cy="9" r="1.6"/><circle cx="8.5" cy="15" r="1.6"/><circle cx="15" cy="15.5" r="1.6"/>',
			'github'    => '<path d="M9 19c-4 1.3-4-2-6-2.5m12 4.5v-3.5a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6a4.7 4.7 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.5 2.8 5.5 3.1 5.5 3.1a4.3 4.3 0 0 0-.1 3.2A4.7 4.7 0 0 0 4 9.5c0 4.6 2.8 5.7 5.5 6a3 3 0 0 0-.8 2.3V21"/>',
			'dribbble'  => '<circle cx="12" cy="12" r="9"/><path d="M8.5 3.7c3.8 4.6 5.8 10 6.6 16.6M3.3 10c6.2.2 11.2-1.2 15-4.4M20.9 13c-5.3-1.3-10.6.5-15 5"/>',
			'behance'   => '<path d="M3 6.5h5a2.6 2.6 0 0 1 0 5.2H3Zm0 5.2h5.6a2.9 2.9 0 0 1 0 5.8H3ZM14.5 7.5h5M13.5 14h7a3.5 3.5 0 1 0-1 2.5"/>',
		)
	);
}

/**
 * Return an inline SVG icon.
 *
 * @param string $name  Icon name.
 * @param array  $attrs Extra attributes (class, width, height, aria-label).
 * @return string
 */
function hamista_get_icon( $name, $attrs = array() ) {
	$paths = hamista_icon_paths();
	if ( ! isset( $paths[ $name ] ) ) {
		return '';
	}

	$attrs = wp_parse_args(
		$attrs,
		array(
			'class'  => '',
			'width'  => 24,
			'height' => 24,
		)
	);

	$class = trim( 'hm-icon hm-i-' . $name . ' ' . $attrs['class'] );
	$label = isset( $attrs['aria-label'] ) ? ' role="img" aria-label="' . esc_attr( $attrs['aria-label'] ) . '"' : ' aria-hidden="true" focusable="false"';

	return sprintf(
		'<svg class="%1$s" width="%2$d" height="%3$d" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"%4$s>%5$s</svg>',
		esc_attr( $class ),
		(int) $attrs['width'],
		(int) $attrs['height'],
		$label,
		$paths[ $name ] // Trusted, static markup.
	);
}

/**
 * Echo an inline SVG icon.
 *
 * @param string $name  Icon name.
 * @param array  $attrs Extra attributes.
 */
function hamista_icon( $name, $attrs = array() ) {
	echo hamista_get_icon( $name, $attrs ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in hamista_get_icon().
}
