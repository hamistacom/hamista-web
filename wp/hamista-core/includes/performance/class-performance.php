<?php
/**
 * Performance switches (Hamista → Performance). Each removes a WordPress
 * feature most sites never use; all are safe to toggle at any time.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Performance;

defined( 'ABSPATH' ) || exit;

/**
 * Performance.
 */
class Performance {

	/**
	 * Hooks.
	 */
	public static function init() {
		if ( hamista_core_option( 'perf_google_fonts' ) ) {
			add_filter( 'elementor/frontend/print_google_fonts', '__return_false' );
			add_filter( 'pre_option_elementor_google_font', array( __CLASS__, 'zero' ) );
		}

		if ( hamista_core_option( 'perf_emojis' ) ) {
			remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
			remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
			remove_action( 'wp_print_styles', 'print_emoji_styles' );
			remove_action( 'admin_print_styles', 'print_emoji_styles' );
			remove_action( 'wp_enqueue_scripts', 'wp_enqueue_emoji_styles' );
			remove_action( 'admin_enqueue_scripts', 'wp_enqueue_emoji_styles' );
			remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
			remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
			remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
			add_filter( 'emoji_svg_url', '__return_false' );
		}

		if ( hamista_core_option( 'perf_embeds' ) ) {
			remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
			remove_action( 'wp_head', 'wp_oembed_add_host_js' );
			add_action(
				'wp_footer',
				static function () {
					wp_dequeue_script( 'wp-embed' );
				}
			);
		}

		if ( hamista_core_option( 'perf_xmlrpc' ) ) {
			add_filter( 'xmlrpc_enabled', '__return_false' );
			remove_action( 'wp_head', 'rsd_link' );
			add_filter(
				'wp_headers',
				static function ( $headers ) {
					unset( $headers['X-Pingback'] );
					return $headers;
				}
			);
		}

		if ( hamista_core_option( 'perf_jquery_migrate' ) ) {
			add_action(
				'wp_default_scripts',
				static function ( $scripts ) {
					if ( ! is_admin() && isset( $scripts->registered['jquery'] ) ) {
						$scripts->registered['jquery']->deps = array_diff( $scripts->registered['jquery']->deps, array( 'jquery-migrate' ) );
					}
				}
			);
		}

		if ( hamista_core_option( 'perf_heartbeat' ) ) {
			add_filter(
				'heartbeat_settings',
				static function ( $settings ) {
					$settings['interval'] = 60;
					return $settings;
				}
			);
		}

		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'trim_assets' ), 100 );
	}

	/**
	 * Option value "0" (used to switch Elementor's Google Fonts off).
	 *
	 * @return string
	 */
	public static function zero() {
		return '0';
	}

	/**
	 * Dequeue assets the current page does not need.
	 */
	public static function trim_assets() {
		if ( hamista_core_option( 'perf_dashicons' ) && ! is_user_logged_in() && ! is_admin_bar_showing() ) {
			wp_dequeue_style( 'dashicons' );
		}

		if ( hamista_core_option( 'perf_heartbeat' ) && ! is_user_logged_in() ) {
			wp_deregister_script( 'heartbeat' );
		}

		if ( hamista_core_option( 'perf_block_css' ) && is_singular() && self::is_elementor_page() ) {
			foreach ( array( 'wp-block-library', 'wp-block-library-theme', 'global-styles', 'classic-theme-styles' ) as $handle ) {
				wp_dequeue_style( $handle );
			}
		}

		if ( hamista_core_option( 'perf_wc_fragments' ) && class_exists( 'WooCommerce' ) && ! is_woocommerce() && ! is_cart() && ! is_checkout() ) {
			wp_dequeue_script( 'wc-cart-fragments' );
		}
	}

	/**
	 * Whether the current singular page is built with Elementor.
	 *
	 * @return bool
	 */
	private static function is_elementor_page() {
		if ( function_exists( 'hamista_is_built_with_elementor' ) ) {
			return hamista_is_built_with_elementor( get_queried_object_id() );
		}
		if ( ! class_exists( '\Elementor\Plugin' ) ) {
			return false;
		}
		$document = \Elementor\Plugin::$instance->documents->get( get_queried_object_id() );
		return $document && $document->is_built_with_elementor();
	}
}
