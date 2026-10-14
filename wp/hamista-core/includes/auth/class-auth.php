<?php
/**
 * Mobile OTP login module bootstrap.
 *
 * Idle (no front-end output, no public routes) while `otp_enabled` is off; the
 * admin-only test and SMS log endpoints, the admin data hook and the shop
 * notifications always register so the provider can be checked before going
 * live and used for WooCommerce messages on its own.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth;

use Hamista\Core\Auth\Gateways\Test;

defined( 'ABSPATH' ) || exit;

/**
 * Auth.
 */
class Auth {

	/**
	 * Wire the module.
	 */
	public static function init() {
		add_action( 'rest_api_init', array( Rest::class, 'register' ) );
		add_action( 'rest_api_init', array( Sms::class, 'register_routes' ) );
		add_filter( 'hamista_core/admin_data', array( __CLASS__, 'admin_data' ) );
		Account::register_shortcodes();

		// Shop notifications work with or without mobile login.
		if ( class_exists( 'WooCommerce' ) ) {
			Shop_Sms::init();
		}
		Captcha::init();

		if ( ! self::enabled() ) {
			return;
		}

		Account::init();
		Google::init();

		if ( class_exists( 'WooCommerce' ) && hamista_core_option( 'otp_woocommerce', true ) ) {
			WooCommerce::init();
		}
		if ( hamista_core_option( 'otp_wp_login', false ) ) {
			Wp_Login::init();
		}
	}

	/**
	 * Whether mobile login is on.
	 *
	 * @return bool
	 */
	public static function enabled() {
		return (bool) apply_filters( 'hamista_core/otp_enabled', (bool) hamista_core_option( 'otp_enabled', false ) );
	}

	/**
	 * Expose the latest test code to the admin app (test mode, administrators only).
	 *
	 * @param array $data Admin app data.
	 * @return array
	 */
	public static function admin_data( $data ) {
		if ( current_user_can( 'manage_options' ) && OTP::is_test_mode() ) {
			$data['lastTestCode'] = Test::last();
		}
		return $data;
	}
}
