<?php
/**
 * Self-hosted font system.
 *
 * Families come from three places, in this order:
 *  1. Font files dropped into the theme (or child theme) under assets/fonts/{slug}/
 *     e.g. assets/fonts/yekan-bakh/YekanBakhFaNum-Bold.woff2 — weight is read
 *     from the file name, so no configuration is needed.
 *  2. Fonts uploaded in Hamista → Typography (added through `hamista/font_families`).
 *  3. Vazirmatn, bundled as the always-available fallback.
 *
 * Nothing is loaded from Google: every byte is served from the site itself.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

/**
 * Map a font file name to a CSS font-weight.
 *
 * @param string $name File name.
 * @return string
 */
function hamista_font_weight_from_name( $name ) {
	$flat = strtolower( preg_replace( '/[^a-z]/i', '', $name ) );

	if ( false !== strpos( $flat, 'variable' ) || preg_match( '/(^|[^a-z])vf([^a-z]|$)/i', $name ) || false !== strpos( $name, '[wght]' ) ) {
		return '100 900';
	}

	$map = array(
		'extrablack' => 950,
		'ultrablack' => 950,
		'extrabold'  => 800,
		'ultrabold'  => 800,
		'semibold'   => 600,
		'demibold'   => 600,
		'extralight' => 200,
		'ultralight' => 200,
		'hairline'   => 100,
		'thin'       => 100,
		'light'      => 300,
		'regular'    => 400,
		'normal'     => 400,
		'book'       => 400,
		'medium'     => 500,
		'bold'       => 700,
		'heavy'      => 900,
		'black'      => 900,
		'fat'        => 950,
	);

	foreach ( $map as $token => $weight ) {
		if ( false !== strpos( $flat, $token ) ) {
			return (string) $weight;
		}
	}

	return '400';
}

/**
 * Scan a folder for font files and group them by weight.
 *
 * When a family ships both Persian-digit ("FaNum") and Latin-digit files, the
 * `persian_digits` option decides which set wins.
 *
 * @param string $dir Absolute folder path.
 * @param string $url Folder URL.
 * @return array List of faces: [ 'src' => [ format => url ], 'weight' => '400', 'style' => 'normal' ].
 */
function hamista_scan_font_dir( $dir, $url ) {
	if ( ! is_dir( $dir ) ) {
		return array();
	}

	$cache_key = 'hamista_fonts_' . md5( $dir . '|' . filemtime( $dir ) . '|' . (int) hamista_option( 'persian_digits' ) . '|' . HAMISTA_VERSION );
	$cached    = get_transient( $cache_key );
	if ( is_array( $cached ) ) {
		return $cached;
	}

	$files = array();
	foreach ( array( 'woff2', 'woff', 'ttf', 'otf' ) as $ext ) {
		$files = array_merge( $files, (array) glob( trailingslashit( $dir ) . '*.' . $ext ) );
	}

	$prefer_fanum = (bool) hamista_option( 'persian_digits' );
	$formats      = array(
		'woff2' => 'woff2',
		'woff'  => 'woff',
		'ttf'   => 'truetype',
		'otf'   => 'opentype',
	);
	$candidates   = array();

	foreach ( $files as $file ) {
		$base    = basename( $file );
		$ext     = strtolower( pathinfo( $base, PATHINFO_EXTENSION ) );
		$weight  = hamista_font_weight_from_name( $base );
		$style   = preg_match( '/italic|oblique/i', $base ) ? 'italic' : 'normal';
		$variant = preg_match( '/fa[\s_-]?num|farsi[\s_-]?digits|[-_]fd[-_.]/i', $base ) ? 'fa' : 'en';
		$key     = $weight . '|' . $style;

		$candidates[ $key ][ $variant ]['weight']                   = $weight;
		$candidates[ $key ][ $variant ]['style']                    = $style;
		$candidates[ $key ][ $variant ]['src'][ $formats[ $ext ] ] = trailingslashit( $url ) . rawurlencode( $base );
	}

	// One face per weight/style: the preferred digit set when both exist.
	$faces = array();
	foreach ( $candidates as $set ) {
		$first   = $prefer_fanum ? 'fa' : 'en';
		$second  = $prefer_fanum ? 'en' : 'fa';
		$faces[] = isset( $set[ $first ] ) ? $set[ $first ] : $set[ $second ];
	}

	// Most browsers pick the first matching src, so woff2 must come first.
	foreach ( $faces as &$face ) {
		uksort(
			$face['src'],
			static function ( $a, $b ) {
				$order = array( 'woff2', 'woff', 'truetype', 'opentype' );
				return array_search( $a, $order, true ) - array_search( $b, $order, true );
			}
		);
	}
	unset( $face );
	set_transient( $cache_key, $faces, DAY_IN_SECONDS );

	return $faces;
}

/**
 * All known font families.
 *
 * @return array slug => [ family, faces, fallback, label, bundled ]
 */
function hamista_font_families() {
	static $families = null;
	if ( null !== $families ) {
		return $families;
	}

	$vazir_url = HAMISTA_URI . '/assets/fonts/vazirmatn/';
	$families  = array(
		'vazirmatn'  => array(
			'label'    => 'Vazirmatn',
			'family'   => 'Vazirmatn',
			'fallback' => 'Tahoma, system-ui, sans-serif',
			'faces'    => array(
				array(
					'src'     => array( 'woff2' => $vazir_url . 'vazirmatn-arabic.woff2' ),
					'weight'  => '100 900',
					'style'   => 'normal',
					'unicode' => 'U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC',
				),
				array(
					'src'     => array( 'woff2' => $vazir_url . 'vazirmatn-latin.woff2' ),
					'weight'  => '100 900',
					'style'   => 'normal',
					'unicode' => 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
				),
			),
		),
		'yekan-bakh' => array(
			'label'    => 'Yekan Bakh',
			'family'   => 'Yekan Bakh',
			'fallback' => '"Vazirmatn", Tahoma, system-ui, sans-serif',
			'faces'    => array(),
		),
		'digits'     => array(
			'label'    => 'Digits',
			'family'   => 'Digits',
			'fallback' => 'var(--hm-font-body)',
			'faces'    => array(),
		),
	);

	// Files dropped into the parent and child theme.
	$roots = array_unique( array( get_template_directory() => get_template_directory_uri(), get_stylesheet_directory() => get_stylesheet_directory_uri() ) );
	foreach ( array( 'yekan-bakh', 'digits' ) as $slug ) {
		foreach ( $roots as $root_dir => $root_url ) {
			$families[ $slug ]['faces'] = array_merge(
				$families[ $slug ]['faces'],
				hamista_scan_font_dir( $root_dir . '/assets/fonts/' . $slug, $root_url . '/assets/fonts/' . $slug )
			);
		}
	}

	/**
	 * Add or change font families (the Hamista Core font manager hooks in here).
	 *
	 * @param array $families slug => definition.
	 */
	$families = apply_filters( 'hamista/font_families', $families );

	return $families;
}

/**
 * CSS font stack for a family slug.
 *
 * @param string $slug Family slug.
 * @return string
 */
function hamista_font_stack( $slug ) {
	$families = hamista_font_families();
	if ( 'system' === $slug ) {
		return 'system-ui, -apple-system, "Segoe UI", Tahoma, sans-serif';
	}
	if ( ! isset( $families[ $slug ] ) ) {
		$slug = 'yekan-bakh';
	}
	$family = $families[ $slug ];

	return '"' . $family['family'] . '", ' . $family['fallback'];
}

/**
 * Build the @font-face rules for the families in use.
 *
 * @return array [ 'css' => string, 'preload' => string[] ]
 */
function hamista_font_face_css() {
	$families = hamista_font_families();
	$used     = array_unique( array( 'vazirmatn', hamista_option( 'font_body' ), hamista_option( 'font_heading' ), hamista_option( 'font_numbers' ) ) );
	$css      = '';
	$preload  = array();

	foreach ( $used as $slug ) {
		if ( empty( $families[ $slug ]['faces'] ) ) {
			continue;
		}
		foreach ( $families[ $slug ]['faces'] as $face ) {
			if ( empty( $face['src'] ) ) {
				continue;
			}
			$src = array();
			foreach ( $face['src'] as $format => $file_url ) {
				$src[] = 'url(' . esc_url( $file_url ) . ') format("' . esc_attr( $format ) . '")';
			}
			$css .= '@font-face{font-family:"' . esc_attr( $families[ $slug ]['family'] ) . '";';
			$css .= 'src:' . implode( ',', $src ) . ';';
			$css .= 'font-weight:' . esc_attr( $face['weight'] ) . ';font-style:' . esc_attr( $face['style'] ) . ';font-display:swap;';
			if ( ! empty( $face['unicode'] ) ) {
				$css .= 'unicode-range:' . esc_attr( $face['unicode'] ) . ';';
			}
			$css .= '}';
		}
	}

	// Preload the body font's regular face (or Vazirmatn's Arabic subset when it is the fallback).
	$body = hamista_option( 'font_body' );
	if ( ! empty( $families[ $body ]['faces'] ) ) {
		foreach ( $families[ $body ]['faces'] as $face ) {
			if ( isset( $face['src']['woff2'] ) && in_array( $face['weight'], array( '400', '100 900' ), true ) ) {
				$preload[] = $face['src']['woff2'];
				break;
			}
		}
	}
	if ( ! $preload ) {
		$preload[] = HAMISTA_URI . '/assets/fonts/vazirmatn/vazirmatn-arabic.woff2';
	}

	return array(
		'css'     => $css,
		'preload' => apply_filters( 'hamista/font_preload', $preload ),
	);
}

/**
 * Allow font uploads in the media library (admins only).
 *
 * @param array $mimes Allowed mime types.
 * @return array
 */
function hamista_font_mimes( $mimes ) {
	if ( current_user_can( 'manage_options' ) ) {
		$mimes['woff2'] = 'font/woff2';
		$mimes['woff']  = 'font/woff';
		$mimes['ttf']   = 'font/ttf';
	}
	return $mimes;
}
add_filter( 'upload_mimes', 'hamista_font_mimes' );

/**
 * WordPress checks real file types; fonts often report generic types, so accept them by extension.
 *
 * @param array  $data     File data.
 * @param string $file     Full path.
 * @param string $filename File name.
 * @return array
 */
function hamista_font_filetype( $data, $file, $filename ) {
	$ext = strtolower( pathinfo( $filename, PATHINFO_EXTENSION ) );
	if ( current_user_can( 'manage_options' ) && in_array( $ext, array( 'woff2', 'woff', 'ttf' ), true ) ) {
		$types = array(
			'woff2' => 'font/woff2',
			'woff'  => 'font/woff',
			'ttf'   => 'font/ttf',
		);
		$data['ext']  = $ext;
		$data['type'] = $types[ $ext ];
	}
	return $data;
}
add_filter( 'wp_check_filetype_and_ext', 'hamista_font_filetype', 10, 3 );
