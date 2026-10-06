<?php
/**
 * Maintenance tools for the admin app (REST).
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Admin;

defined( 'ABSPATH' ) || exit;

/**
 * Tools.
 */
class Tools {

	const REST_NS = 'hamista/v1';

	/**
	 * Hooks.
	 */
	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
	}

	/**
	 * Permission check shared by every tool.
	 *
	 * @return bool
	 */
	public static function can_manage() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Routes.
	 */
	public static function register_routes() {
		register_rest_route(
			self::REST_NS,
			'/tools/elementor-css',
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'elementor_css' ),
				'permission_callback' => array( __CLASS__, 'can_manage' ),
			)
		);

		register_rest_route(
			self::REST_NS,
			'/tools/flush-fonts',
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'flush_fonts' ),
				'permission_callback' => array( __CLASS__, 'can_manage' ),
			)
		);
	}

	/**
	 * Clear Elementor's generated CSS so it is rebuilt on the next page view.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public static function elementor_css() {
		if ( ! class_exists( '\Elementor\Plugin' ) || ! isset( \Elementor\Plugin::$instance->files_manager ) ) {
			return new \WP_Error( 'hamista_no_elementor', __( 'Elementor is not active.', 'hamista-core' ), array( 'status' => 400 ) );
		}

		\Elementor\Plugin::$instance->files_manager->clear_cache();

		return rest_ensure_response(
			array(
				'message' => __( 'Elementor CSS cleared. Pages rebuild their styles on the next visit.', 'hamista-core' ),
			)
		);
	}

	/**
	 * Drop the theme's cached font-folder scans (transients `hamista_fonts_*`).
	 *
	 * @return \WP_REST_Response
	 */
	public static function flush_fonts() {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
				$wpdb->esc_like( '_transient_hamista_fonts_' ) . '%',
				$wpdb->esc_like( '_transient_timeout_hamista_fonts_' ) . '%'
			)
		);

		// With a persistent object cache, transients never reach the options table.
		if ( wp_using_ext_object_cache() && function_exists( 'wp_cache_supports' ) && wp_cache_supports( 'flush_group' ) ) {
			wp_cache_flush_group( 'transient' );
		}

		/**
		 * Fires after the font cache is cleared.
		 */
		do_action( 'hamista_core/fonts_flushed' );

		return rest_ensure_response(
			array(
				'message' => __( 'Font cache cleared.', 'hamista-core' ),
			)
		);
	}
}
