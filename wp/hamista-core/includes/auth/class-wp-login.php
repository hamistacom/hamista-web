<?php
/**
 * wp-login.php: a "Log in with mobile" panel above the classic form, with a
 * switch back to username and password. Without JavaScript both are visible.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth;

defined( 'ABSPATH' ) || exit;

/**
 * Wp_Login.
 */
class Wp_Login {

	/**
	 * Hooks.
	 */
	public static function init() {
		add_action( 'login_enqueue_scripts', array( __CLASS__, 'enqueue' ) );
		add_filter( 'login_message', array( __CLASS__, 'panel' ) );
		add_filter( 'login_body_class', array( __CLASS__, 'body_class' ) );
	}

	/**
	 * Whether the current screen is the plain login screen.
	 *
	 * @return bool
	 */
	private static function is_login_screen() {
		$action = isset( $GLOBALS['action'] ) ? (string) $GLOBALS['action'] : 'login';
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return 'login' === $action && empty( $_REQUEST['interim-login'] );
	}

	/**
	 * Assets.
	 */
	public static function enqueue() {
		if ( self::is_login_screen() ) {
			Account::enqueue();
		}
	}

	/**
	 * Start on the classic form after a failed classic attempt.
	 *
	 * @param array $classes Body classes.
	 * @return array
	 */
	public static function body_class( $classes ) {
		if ( ! self::is_login_screen() ) {
			return $classes;
		}
		$classes[] = 'hm-auth-wplogin-screen';
		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		if ( isset( $_POST['log'] ) ) {
			$classes[] = 'hm-auth-classic';
		}
		return $classes;
	}

	/**
	 * Mobile panel before the form.
	 *
	 * @param string $message Login message.
	 * @return string
	 */
	public static function panel( $message ) {
		if ( ! self::is_login_screen() ) {
			return $message;
		}
		$redirect = '';
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( ! empty( $_REQUEST['redirect_to'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$redirect = wp_validate_redirect( esc_url_raw( wp_unslash( $_REQUEST['redirect_to'] ) ), '' );
		}
		if ( '' === $redirect ) {
			$redirect = admin_url();
		}

		$form = Account::render_form(
			array(
				'context'       => 'wp-login',
				'redirect'      => $redirect,
				'show_password' => false,
				'title'         => __( 'Log in with your mobile', 'hamista-core' ),
				'subtitle'      => __( 'We’ll text you a one-time code. No password needed.', 'hamista-core' ),
			)
		);
		if ( '' === $form ) {
			return $message;
		}

		$panel  = '<div class="hm-auth-wplogin">' . $form;
		$panel .= '<p class="hm-auth-wplogin__switch"><button type="button" class="hm-auth-wplogin__toggle" data-hm-wplogin-toggle>' . esc_html__( 'Use username and password instead', 'hamista-core' ) . '</button></p>';
		$panel .= '</div>';
		$panel .= '<p class="hm-auth-wplogin__back"><button type="button" class="hm-auth-wplogin__toggle" data-hm-wplogin-toggle>' . hamista_core_icon( 'mobile' ) . esc_html__( 'Log in with your mobile instead', 'hamista-core' ) . '</button></p>';

		return $message . $panel;
	}
}
