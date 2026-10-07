<?php
/**
 * Plugin bootstrap: loads modules, translations, and handles activation.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Main plugin class.
 */
final class Plugin {

	/**
	 * Singleton.
	 *
	 * @var Plugin|null
	 */
	private static $instance = null;

	/**
	 * Get the instance.
	 *
	 * @return Plugin
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Wire modules. Each module registers its own hooks and stays idle when its feature is off.
	 */
	private function __construct() {
		add_action( 'init', array( $this, 'load_textdomain' ), 0 );

		$modules = array(
			'Settings\\Settings',
			'Fonts\\Fonts',
			'Frontend\\Frontend',
			'Layouts\\Layouts',
			'Forms\\Forms',
			'Portfolio\\Portfolio',
			'Booking\\Booking',
			'Auth\\Auth',
			'Jalali\\Jalali',
			'Performance\\Performance',
			'Admin\\Admin',
			'Demos\\Importer',
		);
		foreach ( apply_filters( 'hamista_core/modules', $modules ) as $module ) {
			$class = __NAMESPACE__ . '\\' . $module;
			if ( class_exists( $class ) ) {
				$class::init();
			}
		}

		// Elementor integration starts once Elementor itself has loaded.
		$elementor = __NAMESPACE__ . '\\Elementor\\Elementor';
		if ( did_action( 'elementor/loaded' ) ) {
			if ( class_exists( $elementor ) ) {
				$elementor::init();
			}
		} else {
			add_action(
				'elementor/loaded',
				static function () use ( $elementor ) {
					if ( class_exists( $elementor ) ) {
						$elementor::init();
					}
				}
			);
		}

		do_action( 'hamista_core/loaded', $this );
	}

	/**
	 * Translations.
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'hamista-core', false, dirname( plugin_basename( HAMISTA_CORE_FILE ) ) . '/languages' );

		// Hamista is written for Persian sites: keep its screens in Persian even when
		// the site or the user profile is set to another language (Settings → General).
		if ( hamista_core_option( 'ui_persian', true ) && 0 !== strpos( determine_locale(), 'fa' ) ) {
			unload_textdomain( 'hamista-core' );
			load_textdomain( 'hamista-core', HAMISTA_CORE_DIR . 'languages/hamista-core-fa_IR.mo', 'fa_IR' );
		}
	}

	/**
	 * Activation: register post types so rewrite rules include them, then flush.
	 */
	public static function activate() {
		foreach ( array( 'Layouts\\Layouts', 'Forms\\Forms', 'Portfolio\\Portfolio' ) as $module ) {
			$class = __NAMESPACE__ . '\\' . $module;
			if ( class_exists( $class ) ) {
				$class::register_post_type();
			}
		}
		if ( class_exists( __NAMESPACE__ . '\\Booking\\Booking' ) && Booking\Booking::enabled() ) {
			Booking\Booking::register_post_types();
		}
		flush_rewrite_rules();
		if ( ! get_option( 'hamista_core_activated' ) ) {
			update_option( 'hamista_core_activated', time(), false );
			set_transient( 'hamista_core_welcome', 1, 60 );
		}
	}

	/**
	 * Deactivation.
	 */
	public static function deactivate() {
		flush_rewrite_rules();
	}
}
