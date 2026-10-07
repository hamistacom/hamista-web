<?php
/**
 * Font manager: fonts uploaded in Hamista → Typography become font families for
 * the theme and appear in Elementor's font list (in a "Hamista" group, so
 * Elementor never tries to fetch them from Google).
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Fonts;

defined( 'ABSPATH' ) || exit;

/**
 * Fonts.
 */
class Fonts {

	/**
	 * Hooks.
	 */
	public static function init() {
		add_filter( 'hamista/font_families', array( __CLASS__, 'add_families' ) );
		add_filter( 'elementor/fonts/groups', array( __CLASS__, 'elementor_groups' ) );
		add_filter( 'elementor/fonts/additional_fonts', array( __CLASS__, 'elementor_fonts' ) );
		add_action( 'wp_head', array( __CLASS__, 'print_without_theme' ), 3 );
		add_action( 'hamista_core/settings_saved', array( __CLASS__, 'flush_cache' ) );
	}

	/**
	 * Slug for a family name ("Yekan Bakh" → yekan-bakh).
	 *
	 * @param string $name Family name.
	 * @return string
	 */
	public static function slug( $name ) {
		return sanitize_title( $name );
	}

	/**
	 * Uploaded families merged into the theme's list. A family named like a
	 * built-in one ("Yekan Bakh", "Digits") replaces its files.
	 *
	 * @param array $families Theme families.
	 * @return array
	 */
	public static function add_families( $families ) {
		foreach ( (array) hamista_core_option( 'custom_fonts', array() ) as $font ) {
			if ( empty( $font['family'] ) || empty( $font['files'] ) ) {
				continue;
			}
			$slug  = self::slug( $font['family'] );
			$faces = array();
			foreach ( $font['files'] as $file ) {
				$ext     = strtolower( pathinfo( wp_parse_url( $file['url'], PHP_URL_PATH ), PATHINFO_EXTENSION ) );
				$format  = array(
					'woff2' => 'woff2',
					'woff'  => 'woff',
					'ttf'   => 'truetype',
					'otf'   => 'opentype',
				);
				$faces[] = array(
					'src'    => array( $format[ $ext ] ?? 'woff2' => $file['url'] ),
					'weight' => $file['weight'] ? $file['weight'] : '400',
					'style'  => $file['style'] ? $file['style'] : 'normal',
				);
			}
			if ( isset( $families[ $slug ] ) ) {
				$families[ $slug ]['faces'] = $faces;
			} else {
				$families[ $slug ] = array(
					'label'    => $font['family'],
					'family'   => $font['family'],
					'fallback' => '"Vazirmatn", Tahoma, sans-serif',
					'faces'    => $faces,
				);
			}
		}
		return $families;
	}

	/**
	 * Elementor font group.
	 *
	 * @param array $groups Groups.
	 * @return array
	 */
	public static function elementor_groups( $groups ) {
		return array( 'hamista' => __( 'Hamista (self-hosted)', 'hamista-core' ) ) + $groups;
	}

	/**
	 * Elementor font list.
	 *
	 * @param array $fonts Fonts.
	 * @return array
	 */
	public static function elementor_fonts( $fonts ) {
		$families = function_exists( 'hamista_font_families' ) ? hamista_font_families() : self::add_families( array() );
		foreach ( $families as $family ) {
			$fonts[ $family['family'] ] = 'hamista';
		}
		return $fonts;
	}

	/**
	 * When another theme is active, print @font-face for uploaded fonts ourselves.
	 */
	public static function print_without_theme() {
		if ( function_exists( 'hamista_font_face_css' ) ) {
			return;
		}
		$css = '';
		foreach ( self::add_families( array() ) as $family ) {
			foreach ( $family['faces'] as $face ) {
				$src = array();
				foreach ( $face['src'] as $format => $url ) {
					$src[] = 'url(' . esc_url( $url ) . ') format("' . esc_attr( $format ) . '")';
				}
				$css .= '@font-face{font-family:"' . esc_attr( $family['family'] ) . '";src:' . implode( ',', $src ) . ';font-weight:' . esc_attr( $face['weight'] ) . ';font-style:' . esc_attr( $face['style'] ) . ';font-display:swap}';
			}
		}
		if ( $css ) {
			echo '<style id="hamista-core-fonts">' . $css . '</style>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped parts.
		}
	}

	/**
	 * Drop cached font scans after settings change.
	 */
	public static function flush_cache() {
		global $wpdb;
		$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s", $wpdb->esc_like( '_transient_hamista_fonts_' ) . '%', $wpdb->esc_like( '_transient_timeout_hamista_fonts_' ) . '%' ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	}
}
