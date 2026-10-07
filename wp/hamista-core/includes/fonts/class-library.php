<?php
/**
 * Font library: licensed Persian families bundled with Hamista Core.
 *
 * Each family can be switched off, and each weight within it. Switched-on
 * families appear in the theme's font menus and in Elementor; a page only
 * downloads the families it actually uses (body, headings, numbers, or a
 * widget that picked the font in Elementor), and only their switched-on weights.
 *
 * Files live in assets/fonts/library/{slug}/{slug}-{weight}.woff2.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Fonts;

defined( 'ABSPATH' ) || exit;

/**
 * Library.
 */
class Library {

	/**
	 * Families whose @font-face rules this request already printed.
	 *
	 * @var array
	 */
	private static $printed = array();

	/**
	 * Hooks.
	 */
	public static function init() {
		// Before uploaded fonts (priority 10), so an upload with the same name replaces the bundled files.
		add_filter( 'hamista/font_families', array( __CLASS__, 'add_families' ), 5 );
		add_action( 'elementor/fonts/print_font_links/hamista', array( __CLASS__, 'print_for_elementor' ) );
		add_action( 'elementor/preview/enqueue_styles', array( __CLASS__, 'editor_preview' ) );
	}

	/**
	 * In the Elementor editor any switched-on family can be picked at any moment,
	 * so the preview declares them all (browsers still fetch only what is drawn).
	 */
	public static function editor_preview() {
		$css = '';
		foreach ( self::add_families( array() ) as $family ) {
			$css .= self::face_css( $family );
		}
		wp_register_style( 'hamista-font-library', false, array(), HAMISTA_CORE_VERSION );
		wp_enqueue_style( 'hamista-font-library' );
		wp_add_inline_style( 'hamista-font-library', $css );
	}

	/**
	 * Everything the library ships.
	 *
	 * @return array slug => [ label, family, desc, use (text|heading), weights, variable ]
	 */
	public static function catalog() {
		$catalog = array(
			'iranyekan'  => array(
				'label'   => __( 'IRANYekan', 'hamista-core' ),
				'family'  => 'IRANYekan',
				'desc'    => __( 'Very readable at small sizes; a safe choice for body text.', 'hamista-core' ),
				'use'     => 'text',
				'weights' => array( '100', '300', '400', '500', '700', '800', '900', '950' ),
			),
			'iransansx'  => array(
				'label'   => __( 'IRANSansX', 'hamista-core' ),
				'family'  => 'IRANSansX',
				'desc'    => __( 'Neutral and clear; suits text, forms and dashboards.', 'hamista-core' ),
				'use'     => 'text',
				'weights' => array( '400', '700', '900' ),
			),
			'peyda'      => array(
				'label'   => __( 'Peyda', 'hamista-core' ),
				'family'  => 'Peyda',
				'desc'    => __( 'Modern and clean; works for brands and shops.', 'hamista-core' ),
				'use'     => 'text',
				'weights' => array( '300', '700', '900' ),
			),
			'pinar'      => array(
				'label'    => __( 'Pinar', 'hamista-core' ),
				'family'   => 'Pinar',
				'desc'     => __( 'Modern and soft; one file covers text and headings.', 'hamista-core' ),
				'use'      => 'text',
				'weights'  => array( '300', '400', '500', '600', '700', '800', '900' ),
				'variable' => '300 900',
			),
			'doran'      => array(
				'label'   => __( 'Doran', 'hamista-core' ),
				'family'  => 'Doran',
				'desc'    => __( 'Bookish, high-contrast strokes; for refined and editorial sites.', 'hamista-core' ),
				'use'     => 'text',
				'weights' => array( '100', '300', '400', '500', '700', '800' ),
			),
			'ravagh'     => array(
				'label'   => __( 'Ravagh', 'hamista-core' ),
				'family'  => 'Ravagh',
				'desc'    => __( 'Tall and slender; suits corporate and luxury sites.', 'hamista-core' ),
				'use'     => 'text',
				'weights' => array( '400', '700' ),
			),
			'lahzeh'     => array(
				'label'   => __( 'Lahzeh', 'hamista-core' ),
				'family'  => 'Lahzeh',
				'desc'    => __( 'Wide and geometric; for modern headings.', 'hamista-core' ),
				'use'     => 'heading',
				'weights' => array( '400', '500', '600', '700', '900' ),
			),
			'modam'      => array(
				'label'   => __( 'Modam', 'hamista-core' ),
				'family'  => 'Modam',
				'desc'    => __( 'Geometric and firm, from medium upwards; for headings and buttons.', 'hamista-core' ),
				'use'     => 'heading',
				'weights' => array( '500', '700', '800', '900' ),
			),
			'hamrah'     => array(
				'label'   => __( 'Hamrah', 'hamista-core' ),
				'family'  => 'Hamrah',
				'desc'    => __( 'Condensed and heavy, one weight; for short, bold headings.', 'hamista-core' ),
				'use'     => 'heading',
				'weights' => array( '400' ),
			),
			'gramophone' => array(
				'label'   => __( 'Gramophone', 'hamista-core' ),
				'family'  => 'Gramophone',
				'desc'    => __( 'Display face with a worn texture, one weight; short headings only. A large file (600 KB).', 'hamista-core' ),
				'use'     => 'heading',
				'weights' => array( '400' ),
			),
		);

		/**
		 * Add or change bundled font families.
		 *
		 * @param array $catalog slug => definition.
		 */
		return apply_filters( 'hamista_core/font_library', $catalog );
	}

	/**
	 * Persian names for weights.
	 *
	 * @return array weight => label
	 */
	public static function weight_labels() {
		return array(
			'100' => _x( 'Thin', 'font weight', 'hamista-core' ),
			'200' => _x( 'Extra light', 'font weight', 'hamista-core' ),
			'300' => _x( 'Light', 'font weight', 'hamista-core' ),
			'400' => _x( 'Regular', 'font weight', 'hamista-core' ),
			'500' => _x( 'Medium', 'font weight', 'hamista-core' ),
			'600' => _x( 'Semi bold', 'font weight', 'hamista-core' ),
			'700' => _x( 'Bold', 'font weight', 'hamista-core' ),
			'800' => _x( 'Extra bold', 'font weight', 'hamista-core' ),
			'900' => _x( 'Black', 'font weight', 'hamista-core' ),
			'950' => _x( 'Extra black', 'font weight', 'hamista-core' ),
		);
	}

	/**
	 * Saved switches merged over the defaults (every family and weight on).
	 *
	 * @return array slug => [ on => bool, weights => string[] ]
	 */
	public static function state() {
		$saved = (array) hamista_core_option( 'font_library', array() );
		$state = array();
		foreach ( self::catalog() as $slug => $font ) {
			$row     = isset( $saved[ $slug ] ) && is_array( $saved[ $slug ] ) ? $saved[ $slug ] : array();
			$weights = isset( $row['weights'] ) ? array_values( array_intersect( $font['weights'], (array) $row['weights'] ) ) : $font['weights'];

			$state[ $slug ] = array(
				'on'      => ! isset( $row['on'] ) || (bool) $row['on'],
				// A family needs at least one weight; an empty list means all of them.
				'weights' => $weights ? $weights : $font['weights'],
			);
		}
		return $state;
	}

	/**
	 * Base URL of a family's folder.
	 *
	 * @param string $slug Family slug.
	 * @return string
	 */
	private static function url( $slug ) {
		return HAMISTA_CORE_URL . 'assets/fonts/library/' . $slug . '/';
	}

	/**
	 * @font-face entries for a family's switched-on weights.
	 *
	 * @param string $slug    Family slug.
	 * @param array  $font    Catalog entry.
	 * @param array  $weights Weights in use.
	 * @return array
	 */
	private static function faces( $slug, $font, $weights ) {
		if ( ! empty( $font['variable'] ) ) {
			return array(
				array(
					'src'    => array( 'woff2' => self::url( $slug ) . $slug . '-variable.woff2' ),
					'weight' => $font['variable'],
					'style'  => 'normal',
				),
			);
		}
		// One file only: stretch it across every weight so browsers never fake a bold.
		if ( 1 === count( $font['weights'] ) ) {
			return array(
				array(
					'src'    => array( 'woff2' => self::url( $slug ) . $slug . '-' . $font['weights'][0] . '.woff2' ),
					'weight' => '100 950',
					'style'  => 'normal',
				),
			);
		}
		$faces = array();
		foreach ( $weights as $weight ) {
			$faces[] = array(
				'src'    => array( 'woff2' => self::url( $slug ) . $slug . '-' . $weight . '.woff2' ),
				'weight' => $weight,
				'style'  => 'normal',
			);
		}
		return $faces;
	}

	/**
	 * Switched-on families, in the theme's family format.
	 *
	 * @param array $families Theme families.
	 * @return array
	 */
	public static function add_families( $families ) {
		$state = self::state();
		foreach ( self::catalog() as $slug => $font ) {
			if ( empty( $state[ $slug ]['on'] ) || isset( $families[ $slug ] ) ) {
				continue;
			}
			$families[ $slug ] = array(
				'label'    => $font['label'],
				'family'   => $font['family'],
				'fallback' => '"Vazirmatn", Tahoma, system-ui, sans-serif',
				'faces'    => self::faces( $slug, $font, $state[ $slug ]['weights'] ),
				'weights'  => ! empty( $font['variable'] ) ? $font['weights'] : $state[ $slug ]['weights'],
				'library'  => true,
			);
		}
		return $families;
	}

	/**
	 * Admin data: every family with its files, for previews and the switches.
	 *
	 * @return array
	 */
	public static function admin_data() {
		$out = array();
		foreach ( self::catalog() as $slug => $font ) {
			$files = array();
			foreach ( self::faces( $slug, $font, $font['weights'] ) as $face ) {
				$files[] = array(
					'url'    => $face['src']['woff2'],
					'weight' => $face['weight'],
				);
			}
			$out[ $slug ] = array(
				'label'    => $font['label'],
				'family'   => $font['family'],
				'desc'     => $font['desc'],
				'use'      => $font['use'],
				'weights'  => $font['weights'],
				'variable' => ! empty( $font['variable'] ),
				'files'    => $files,
			);
		}
		return $out;
	}

	/**
	 * Elementor reports each font a page uses; print the bundled or uploaded
	 * family it names, unless the theme already did (body, heading, numbers).
	 *
	 * @param string $name Font family name as stored in Elementor.
	 */
	public static function print_for_elementor( $name ) {
		$families = function_exists( 'hamista_font_families' ) ? hamista_font_families() : Fonts::add_families( self::add_families( array() ) );
		$in_theme = function_exists( 'hamista_option' ) ? array( hamista_option( 'font_body' ), hamista_option( 'font_heading' ), hamista_option( 'font_numbers' ) ) : array();

		foreach ( $families as $slug => $family ) {
			if ( $family['family'] !== $name || in_array( $slug, $in_theme, true ) || isset( self::$printed[ $slug ] ) || empty( $family['faces'] ) ) {
				continue;
			}
			self::$printed[ $slug ] = true;
			echo '<style id="hamista-font-' . esc_attr( $slug ) . '">' . self::face_css( $family ) . '</style>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in face_css().
		}
	}

	/**
	 * @font-face rules for one family.
	 *
	 * @param array $family Theme-format family.
	 * @return string
	 */
	public static function face_css( $family ) {
		$css = '';
		foreach ( $family['faces'] as $face ) {
			$src = array();
			foreach ( $face['src'] as $format => $url ) {
				$src[] = 'url(' . esc_url( $url ) . ') format("' . esc_attr( $format ) . '")';
			}
			$css .= '@font-face{font-family:"' . esc_attr( $family['family'] ) . '";src:' . implode( ',', $src ) . ';font-weight:' . esc_attr( $face['weight'] ) . ';font-style:' . esc_attr( $face['style'] ) . ';font-display:swap}';
		}
		return $css;
	}
}
