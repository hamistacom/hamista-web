<?php
/**
 * Front-end: registers the motion engine and widget styles, prints the motion
 * config, custom CSS and custom head/footer code.
 *
 * The engine (≈9KB gzipped) loads only on pages that use a Hamista widget or a
 * "Hamista Motion" effect — widgets declare it as a dependency.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Frontend;

defined( 'ABSPATH' ) || exit;

/**
 * Frontend.
 */
class Frontend {

	/**
	 * Hooks.
	 */
	public static function init() {
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'register_assets' ), 5 );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'maybe_enqueue_globally' ), 20 );
		add_action( 'wp_head', array( __CLASS__, 'head_motion_flag' ), 1 );
		add_action( 'wp_head', array( __CLASS__, 'head_code' ), 99 );
		add_action( 'wp_footer', array( __CLASS__, 'footer_code' ), 99 );
	}

	/**
	 * Asset URL helper: minified file unless SCRIPT_DEBUG.
	 *
	 * @param string $relative Path under assets/.
	 * @return string
	 */
	public static function asset( $relative ) {
		if ( ! ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ) {
			$min = preg_replace( '/\.(css|js)$/', '.min.$1', $relative );
			if ( file_exists( HAMISTA_CORE_DIR . 'assets/' . $min ) ) {
				$relative = $min;
			}
		}
		return HAMISTA_CORE_URL . 'assets/' . $relative;
	}

	/**
	 * Register (not enqueue) the engine and widget styles.
	 */
	public static function register_assets() {
		wp_register_script(
			'hamista-motion',
			self::asset( 'js/hamista.js' ),
			array(),
			HAMISTA_CORE_VERSION,
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);
		wp_add_inline_script( 'hamista-motion', 'window.hamistaMotion=' . wp_json_encode( self::motion_config() ) . ';', 'before' );

		wp_register_script(
			'hamista-scroll-fx',
			self::asset( 'js/scroll-fx.js' ),
			array( 'hamista-motion' ),
			HAMISTA_CORE_VERSION,
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);

		wp_register_script(
			'hamista-lead-form',
			self::asset( 'js/lead-form.js' ),
			array( 'hamista-motion' ),
			HAMISTA_CORE_VERSION,
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);
		wp_add_inline_script(
			'hamista-lead-form',
			'window.hamistaLeadForm=' . wp_json_encode(
				array(
					'pick'    => __( 'Choose at least one option.', 'hamista-core' ),
					'pickOne' => __( 'Choose an option.', 'hamista-core' ),
					'field'   => __( 'This field is required.', 'hamista-core' ),
					'mobile'  => __( 'Enter a valid mobile number, e.g. 0912 345 6789.', 'hamista-core' ),
					'email'   => __( 'Enter a valid email address.', 'hamista-core' ),
					'consent' => __( 'Please accept to continue.', 'hamista-core' ),
				)
			) . ';',
			'before'
		);

		wp_register_style( 'hamista-widgets', self::asset( 'css/hamista-widgets.css' ), array(), HAMISTA_CORE_VERSION );
		wp_register_style( 'hamista-showcase', self::asset( 'css/showcase.css' ), array( 'hamista-widgets' ), HAMISTA_CORE_VERSION );

		$custom_css = trim( (string) hamista_core_option( 'custom_css' ) );
		if ( $custom_css ) {
			wp_register_style( 'hamista-custom', false, array(), HAMISTA_CORE_VERSION );
			wp_enqueue_style( 'hamista-custom' );
			wp_add_inline_style( 'hamista-custom', wp_strip_all_tags( $custom_css ) );
		}
	}

	/**
	 * Motion settings for the engine.
	 *
	 * @return array
	 */
	public static function motion_config() {
		$editor = class_exists( '\Elementor\Plugin' ) && isset( \Elementor\Plugin::$instance->preview ) && \Elementor\Plugin::$instance->preview->is_preview_mode();
		return array(
			'smooth'   => (bool) hamista_core_option( 'smooth_scroll' ),
			'lerp'     => (int) hamista_core_option( 'smooth_intensity', 10 ),
			'reveal'   => (bool) hamista_core_option( 'motion_reveal' ),
			'mobile'   => (bool) hamista_core_option( 'motion_mobile' ),
			'magnetic' => (bool) hamista_core_option( 'magnetic' ),
			'cursor'   => self::cursor_mode(),
			'sound'    => array(
				'enabled' => (bool) hamista_core_option( 'sound_enabled' ),
				'def'     => (bool) hamista_core_option( 'sound_default' ),
				'theme'   => (string) hamista_core_option( 'sound_theme', 'soft' ),
				'volume'  => (int) hamista_core_option( 'sound_volume', 40 ),
				'hover'   => (bool) hamista_core_option( 'sound_hover', true ),
			),
			'editor'   => $editor,
			'rest'     => esc_url_raw( rest_url( 'hamista/v1/' ) ),
			'i18n'     => array(
				'network' => __( 'Could not connect. Please try again.', 'hamista-core' ),
			),
		);
	}

	/**
	 * Cursor style; older installs stored a boolean.
	 *
	 * @return string
	 */
	public static function cursor_mode() {
		$mode = hamista_core_option( 'cursor', 'none' );
		if ( true === $mode || '1' === $mode ) {
			return 'dot';
		}
		return in_array( $mode, array( 'dot', 'ring', 'blend', 'glow' ), true ) ? $mode : 'none';
	}

	/**
	 * Smooth scroll, the cursor and sounds are site-wide, so their code loads everywhere when they are on.
	 */
	public static function maybe_enqueue_globally() {
		if ( hamista_core_option( 'smooth_scroll' ) || 'none' !== self::cursor_mode() ) {
			wp_enqueue_script( 'hamista-motion' );
			wp_enqueue_style( 'hamista-widgets' );
		}
		if ( hamista_core_option( 'sound_enabled' ) ) {
			wp_enqueue_script( 'hamista-motion' );
			wp_enqueue_script(
				'hamista-sound',
				self::asset( 'js/sound.js' ),
				array( 'hamista-motion' ),
				HAMISTA_CORE_VERSION,
				array(
					'strategy'  => 'defer',
					'in_footer' => true,
				)
			);
		}
	}

	/**
	 * Mark the document before first paint so reveal elements start hidden
	 * (no flash), with a safety net if the engine never arrives.
	 */
	public static function head_motion_flag() {
		if ( ! hamista_core_option( 'motion_reveal' ) ) {
			return;
		}
		$mobile = hamista_core_option( 'motion_mobile' ) ? 'true' : 'false';
		echo "<script>(function(r){if(matchMedia('(prefers-reduced-motion: reduce)').matches||(!" . $mobile . "&&matchMedia('(max-width: 767px)').matches))return;r.classList.add('hm-motion-on');setTimeout(function(){if(!window.Hamista||!Hamista.ready)r.classList.remove('hm-motion-on')},4000)})(document.documentElement);</script>\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static.
	}

	/**
	 * Custom code in <head> (saved only by users with unfiltered_html).
	 */
	public static function head_code() {
		$code = (string) hamista_core_option( 'head_code' );
		if ( '' !== trim( $code ) ) {
			echo "\n" . $code . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- admin-provided code.
		}
	}

	/**
	 * Custom code before </body>.
	 */
	public static function footer_code() {
		$code = (string) hamista_core_option( 'footer_code' );
		if ( '' !== trim( $code ) ) {
			echo "\n" . $code . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- admin-provided code.
		}
	}
}
