<?php
/**
 * Sign in with Google (Google Identity Services).
 *
 * The login form shows a "Continue with Google" button; auth.js loads the
 * Google script only when such a button is on screen and posts the ID token
 * to /auth/google, where it is checked with Google before anyone is signed in.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth;

defined( 'ABSPATH' ) || exit;

/**
 * Google.
 */
class Google {

	/** Verified Google account id (the token's `sub`). */
	const META = 'hamista_google_sub';

	/**
	 * Hooks.
	 */
	public static function init() {
		if ( self::enabled() ) {
			add_filter( 'hamista_core/auth_script_data', array( __CLASS__, 'script_data' ) );
		}
	}

	/**
	 * Whether Google sign-in is on and configured.
	 *
	 * @return bool
	 */
	public static function enabled() {
		return Auth::enabled() && hamista_core_option( 'google_enabled', false ) && '' !== self::client_id();
	}

	/**
	 * OAuth client ID.
	 *
	 * @return string
	 */
	public static function client_id() {
		return trim( (string) hamista_core_option( 'google_client_id', '' ) );
	}

	/**
	 * Data for auth.js.
	 *
	 * @param array $data Script data.
	 * @return array
	 */
	public static function script_data( $data ) {
		$data['google']                    = array(
			'clientId' => self::client_id(),
			'src'      => 'https://accounts.google.com/gsi/client',
			'locale'   => str_replace( '_', '-', determine_locale() ),
		);
		$data['i18n']['googleUnavailable'] = __( 'Google sign-in isn’t available right now. Please use another way to sign in.', 'hamista-core' );
		return $data;
	}

	/**
	 * Button markup for the login form ('' when off).
	 *
	 * Google's own button is laid invisibly over ours once its script loads, so
	 * the click opens the real Google window while the look stays on brand.
	 *
	 * @return string
	 */
	public static function button() {
		if ( ! self::enabled() ) {
			return '';
		}
		$logo = '<svg class="hm-auth__google-logo" width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" focusable="false">'
			. '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>'
			. '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>'
			. '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>'
			. '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>'
			. '</svg>';

		return '<div class="hm-auth__alt" data-hm-google-wrap>'
			. '<p class="hm-auth__or"><span>' . esc_html__( 'or', 'hamista-core' ) . '</span></p>'
			. '<div class="hm-auth__google" data-hm-google>'
			. '<button type="button" class="hm-auth__google-btn" data-hm-google-btn>' . $logo . '<span>' . esc_html__( 'Continue with Google', 'hamista-core' ) . '</span></button>'
			. '<div class="hm-auth__google-gsi" data-hm-gsi></div>'
			. '</div>'
			. '<p class="hm-auth__msg" role="alert" data-hm-msg></p>'
			. '</div>';
	}

	/**
	 * Check an ID token with Google.
	 *
	 * @param mixed $credential ID token (JWT).
	 * @return array|\WP_Error Token claims.
	 */
	public static function verify( $credential ) {
		$failed     = new \WP_Error( 'hamista_google_failed', __( 'We couldn’t confirm your Google account. Please try again.', 'hamista-core' ), array( 'status' => 403 ) );
		$credential = is_string( $credential ) ? trim( $credential ) : '';
		if ( strlen( $credential ) > 4096 || ! preg_match( '/^[\w-]+\.[\w-]+\.[\w-]+$/', $credential ) ) {
			return $failed;
		}

		$response = wp_remote_get( 'https://oauth2.googleapis.com/tokeninfo?id_token=' . rawurlencode( $credential ), array( 'timeout' => 10 ) );
		if ( is_wp_error( $response ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( '[Hamista Google] ' . $response->get_error_message() ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			}
			return new \WP_Error( 'hamista_google_unavailable', __( 'Google sign-in isn’t available right now. Please use another way to sign in.', 'hamista-core' ), array( 'status' => 502 ) );
		}

		$claims = json_decode( (string) wp_remote_retrieve_body( $response ), true );
		if ( 200 !== (int) wp_remote_retrieve_response_code( $response ) || ! is_array( $claims ) ) {
			return $failed;
		}

		$valid = isset( $claims['aud'], $claims['iss'], $claims['exp'], $claims['sub'], $claims['email'] )
			&& hash_equals( self::client_id(), (string) $claims['aud'] )
			&& in_array( $claims['iss'], array( 'accounts.google.com', 'https://accounts.google.com' ), true )
			&& (int) $claims['exp'] > time()
			&& in_array( $claims['email_verified'] ?? false, array( true, 'true' ), true )
			&& is_email( $claims['email'] );

		return $valid ? $claims : $failed;
	}

	/**
	 * The account for a verified Google identity, created when allowed.
	 *
	 * @param array $claims Verified token claims.
	 * @return array|\WP_Error { user: \WP_User, is_new: bool }
	 */
	public static function user( array $claims ) {
		$email = sanitize_email( $claims['email'] );
		$ids   = get_users(
			array(
				'meta_key'    => self::META, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'meta_value'  => (string) $claims['sub'], // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
				'number'      => 1,
				'fields'      => 'ID',
				'count_total' => false,
				'blog_id'     => 0,
			)
		);
		$user  = $ids ? get_user_by( 'id', (int) $ids[0] ) : get_user_by( 'email', $email );

		if ( $user ) {
			update_user_meta( $user->ID, self::META, (string) $claims['sub'] );
			return array(
				'user'   => $user,
				'is_new' => false,
			);
		}

		if ( ! hamista_core_option( 'otp_register', true ) ) {
			return new \WP_Error( 'hamista_no_account', __( 'No account uses this Google address. Please sign in another way or contact us.', 'hamista-core' ), array( 'status' => 403 ) );
		}

		$base  = sanitize_user( strtolower( strstr( $email, '@', true ) ), true );
		$base  = '' !== $base ? substr( $base, 0, 50 ) : 'user';
		$login = $base;
		while ( username_exists( $login ) ) {
			$login = $base . random_int( 100, 99999 );
		}
		$role = get_option( 'default_role', 'subscriber' );
		if ( class_exists( 'WooCommerce' ) && get_role( 'customer' ) ) {
			$role = 'customer';
		}
		$first   = sanitize_text_field( (string) ( $claims['given_name'] ?? '' ) );
		$last    = sanitize_text_field( (string) ( $claims['family_name'] ?? '' ) );
		$display = sanitize_text_field( (string) ( $claims['name'] ?? '' ) );
		$display = '' !== $display ? $display : $login;

		$userdata = array(
			'user_login'    => $login,
			'user_pass'     => wp_generate_password( 24, true, true ),
			'user_email'    => $email,
			'user_nicename' => 'u' . strtolower( wp_generate_password( 10, false ) ),
			'display_name'  => $display,
			'nickname'      => $display,
			'first_name'    => $first,
			'last_name'     => $last,
			'role'          => $role,
		);
		/**
		 * Filter the data for an account created with Google.
		 *
		 * @param array $userdata wp_insert_user() data.
		 * @param array $claims   Verified token claims.
		 */
		$userdata = apply_filters( 'hamista_core/google_user_data', $userdata, $claims );

		$slashed              = wp_slash( $userdata );
		$slashed['user_pass'] = $userdata['user_pass'];
		$user_id              = wp_insert_user( $slashed );
		if ( is_wp_error( $user_id ) ) {
			return new \WP_Error( 'hamista_register_failed', __( 'Your account could not be created. Please try again or contact us.', 'hamista-core' ), array( 'status' => 500 ) );
		}
		update_user_meta( $user_id, self::META, (string) $claims['sub'] );

		/**
		 * Fires after an account is created with Google.
		 *
		 * @param int   $user_id User ID.
		 * @param array $claims  Verified token claims.
		 */
		do_action( 'hamista_core/google_registered', $user_id, $claims );

		return array(
			'user'   => get_user_by( 'id', $user_id ),
			'is_new' => true,
		);
	}
}
