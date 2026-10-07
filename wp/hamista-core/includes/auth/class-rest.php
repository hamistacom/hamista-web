<?php
/**
 * REST routes for mobile login (namespace hamista/v1).
 *
 * Every response is JSON `{ ok, message, ... }`. Logged-out requests carry a
 * `hamista_auth` nonce; when it is stale (cached pages) the route answers 403
 * `hamista_bad_nonce` and the script fetches a fresh one from /auth/nonce.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth;

use Hamista\Core\Auth\Gateways\Test;

defined( 'ABSPATH' ) || exit;

/**
 * Rest.
 */
class Rest {

	const NS       = 'hamista/v1';
	const NONCE    = 'hamista_auth';
	const HONEYPOT = 'website';

	/**
	 * Register routes.
	 */
	public static function register() {
		register_rest_route(
			self::NS,
			'/auth/test',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'test' ),
				'permission_callback' => static function () {
					return current_user_can( 'manage_options' );
				},
				'args'                => array(
					'mobile' => array(
						'type'     => 'string',
						'required' => true,
					),
				),
			)
		);

		if ( ! Auth::enabled() ) {
			return;
		}

		$public = '__return_true';

		register_rest_route(
			self::NS,
			'/auth/nonce',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'nonce' ),
				'permission_callback' => $public,
			)
		);
		register_rest_route(
			self::NS,
			'/auth/send',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'send' ),
				'permission_callback' => $public,
			)
		);
		register_rest_route(
			self::NS,
			'/auth/verify',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'verify' ),
				'permission_callback' => $public,
			)
		);
		if ( hamista_core_option( 'login_password', true ) ) {
			register_rest_route(
				self::NS,
				'/auth/password',
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( __CLASS__, 'password' ),
					'permission_callback' => $public,
				)
			);
		}
		register_rest_route(
			self::NS,
			'/auth/profile',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'profile' ),
				'permission_callback' => 'is_user_logged_in',
			)
		);
	}

	/* ---------------------------------------------------------------------
	 * Handlers
	 * ------------------------------------------------------------------ */

	/**
	 * GET /auth/nonce — a fresh nonce for pages served from cache.
	 *
	 * @return \WP_REST_Response
	 */
	public static function nonce() {
		return self::ok( array( 'nonce' => wp_create_nonce( self::NONCE ) ) );
	}

	/**
	 * POST /auth/send { mobile, nonce }.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response
	 */
	public static function send( \WP_REST_Request $request ) {
		$guard = self::guard( $request );
		if ( $guard ) {
			return $guard;
		}

		$mobile = OTP::normalize_mobile( $request->get_param( 'mobile' ) );
		if ( '' === $mobile ) {
			return self::error( OTP::invalid_mobile() );
		}

		// Bots that fill the honeypot get a convincing answer and nothing is sent.
		if ( self::is_bot( $request ) ) {
			return self::sent_response(
				$mobile,
				array(
					'resend_in'  => OTP::resend_delay(),
					'expires_in' => OTP::expiry(),
					'length'     => OTP::length(),
				)
			);
		}

		$result = OTP::issue( $mobile );
		if ( is_wp_error( $result ) ) {
			return self::error( $result, array( 'mobile' => $mobile ) );
		}
		return self::sent_response( $mobile, $result );
	}

	/**
	 * POST /auth/verify { mobile, code, name?, redirect?, nonce }.
	 *
	 * New users with "ask for name" on get `{ ok: false, need_name: true }`
	 * after the code is confirmed; the code stays valid for the follow-up
	 * request that carries the name. Nobody learns whether a number has an
	 * account before proving they own it.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response
	 */
	public static function verify( \WP_REST_Request $request ) {
		$guard = self::guard( $request );
		if ( $guard ) {
			return $guard;
		}
		if ( self::is_bot( $request ) ) {
			return self::error( new \WP_Error( 'hamista_otp_wrong', __( 'That code isn’t right.', 'hamista-core' ), array( 'status' => 400 ) ) );
		}

		$mobile = OTP::normalize_mobile( $request->get_param( 'mobile' ) );
		if ( '' === $mobile ) {
			return self::error( OTP::invalid_mobile() );
		}

		$check = OTP::check( $mobile, (string) $request->get_param( 'code' ) );
		if ( is_wp_error( $check ) ) {
			return self::error( $check, array( 'resend_in' => OTP::cooldown_remaining( $mobile ) ) );
		}

		$user   = Account::find_user_by_mobile( $mobile );
		$is_new = false;

		if ( ! $user ) {
			if ( ! hamista_core_option( 'otp_register', true ) ) {
				OTP::consume( $mobile );
				// Shown only to someone who just proved they own the number.
				return self::error( new \WP_Error( 'hamista_no_account', __( 'No account is linked to this number. Please sign in another way or contact us.', 'hamista-core' ), array( 'status' => 403 ) ) );
			}

			$name = self::clean_name( $request->get_param( 'name' ) );
			if ( '' === $name && hamista_core_option( 'otp_ask_name', true ) ) {
				return new \WP_REST_Response(
					array(
						'ok'        => false,
						'need_name' => true,
						'code'      => 'hamista_need_name',
						'message'   => __( 'One last step: what should we call you?', 'hamista-core' ),
					),
					200
				);
			}

			$user = Account::create_user( $mobile, $name );
			if ( is_wp_error( $user ) ) {
				return self::error( $user );
			}
			$is_new = true;
		}

		$allowed = self::can_login( $user, $mobile );
		if ( is_wp_error( $allowed ) ) {
			OTP::consume( $mobile );
			return self::error( $allowed );
		}

		OTP::consume( $mobile );
		Account::set_mobile( $user->ID, $mobile, $is_new );
		self::login( $user );

		return self::ok(
			array(
				'message'  => $is_new ? __( 'Welcome! Your account is ready.', 'hamista-core' ) : __( 'You’re signed in.', 'hamista-core' ),
				'redirect' => self::redirect_for( $request, $user, $is_new ),
				'is_new'   => $is_new,
			)
		);
	}

	/**
	 * POST /auth/password { login, password, redirect?, nonce }.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response
	 */
	public static function password( \WP_REST_Request $request ) {
		$guard = self::guard( $request );
		if ( $guard ) {
			return $guard;
		}

		$generic = new \WP_Error( 'hamista_login_failed', __( 'The login details you entered are incorrect.', 'hamista-core' ), array( 'status' => 403 ) );
		if ( self::is_bot( $request ) ) {
			return self::error( $generic );
		}

		$retry = OTP::throttle( 'pwd', 10, false );
		if ( $retry ) {
			$minutes = max( 1, (int) ceil( $retry / 60 ) );
			return self::error(
				new \WP_Error(
					'hamista_otp_rate_limited',
					/* translators: %s: minutes */
					sprintf( _n( 'Too many attempts. Please try again in %s minute.', 'Too many attempts. Please try again in %s minutes.', $minutes, 'hamista-core' ), number_format_i18n( $minutes ) ),
					array( 'status' => 429 )
				)
			);
		}

		$login    = trim( sanitize_text_field( (string) $request->get_param( 'login' ) ) );
		$password = (string) $request->get_param( 'password' );
		if ( '' === $login || '' === $password ) {
			return self::error( new \WP_Error( 'hamista_login_empty', __( 'Please enter your login and password.', 'hamista-core' ), array( 'status' => 400 ) ) );
		}

		// A mobile number works as a login name too.
		$mobile = OTP::normalize_mobile( $login );
		if ( $mobile ) {
			$owner = Account::find_user_by_mobile( $mobile );
			if ( $owner ) {
				$login = $owner->user_login;
			}
		}

		$user = wp_signon(
			array(
				'user_login'    => $login,
				'user_password' => $password,
				'remember'      => true,
			),
			is_ssl()
		);
		if ( is_wp_error( $user ) ) {
			OTP::throttle( 'pwd', 10, true );
			return self::error( $generic );
		}
		wp_set_current_user( $user->ID );

		return self::ok(
			array(
				'message'  => __( 'You’re signed in.', 'hamista-core' ),
				'redirect' => self::redirect_for( $request, $user, false ),
			)
		);
	}

	/**
	 * POST /auth/profile { first_name, last_name, email } (cookie auth + wp_rest nonce).
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response
	 */
	public static function profile( \WP_REST_Request $request ) {
		$user_id = get_current_user_id();
		$first   = self::clean_name( $request->get_param( 'first_name' ) );
		$last    = self::clean_name( $request->get_param( 'last_name' ) );
		$email   = trim( (string) $request->get_param( 'email' ) );

		$data = array(
			'ID'         => $user_id,
			'first_name' => $first,
			'last_name'  => $last,
		);
		if ( '' !== $email ) {
			$email = sanitize_email( $email );
			if ( ! is_email( $email ) ) {
				return self::error( new \WP_Error( 'hamista_bad_email', __( 'Please enter a valid email address.', 'hamista-core' ), array( 'status' => 400 ) ) );
			}
			$owner = email_exists( $email );
			if ( $owner && (int) $owner !== $user_id ) {
				return self::error( new \WP_Error( 'hamista_email_taken', __( 'This email address is already used by another account.', 'hamista-core' ), array( 'status' => 400 ) ) );
			}
			$data['user_email'] = $email;
		}
		$display = trim( $first . ' ' . $last );
		if ( '' !== $display ) {
			$data['display_name'] = $display;
		}

		$result = wp_update_user( $data );
		if ( is_wp_error( $result ) ) {
			return self::error( new \WP_Error( 'hamista_profile_failed', __( 'Your details could not be saved. Please try again.', 'hamista-core' ), array( 'status' => 500 ) ) );
		}
		do_action( 'hamista_core/profile_updated', $user_id, $data );

		return self::ok(
			array(
				'message'      => __( 'Your details were saved.', 'hamista-core' ),
				'display_name' => get_userdata( $user_id )->display_name,
			)
		);
	}

	/**
	 * POST /auth/test { mobile } — administrators check the provider settings.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response
	 */
	public static function test( \WP_REST_Request $request ) {
		$mobile = OTP::normalize_mobile( $request->get_param( 'mobile' ) );
		if ( '' === $mobile ) {
			return self::error( OTP::invalid_mobile() );
		}
		$gateway = OTP::gateway();
		if ( is_wp_error( $gateway ) ) {
			return self::error( $gateway );
		}

		$code = OTP::generate();
		$sent = $gateway->send( $mobile, $code );
		if ( is_wp_error( $sent ) ) {
			return self::error( $sent );
		}

		if ( OTP::is_test_mode() ) {
			return self::ok(
				array(
					/* translators: 1: code, 2: masked mobile */
					'message'      => sprintf( __( 'Test mode: no SMS was sent. Code %1$s was generated for %2$s.', 'hamista-core' ), $code, OTP::mask( $mobile ) ),
					'lastTestCode' => Test::last(),
				)
			);
		}
		return self::ok(
			array(
				/* translators: 1: provider, 2: mobile */
				'message' => sprintf( __( '%1$s accepted the message. A test code is on its way to %2$s.', 'hamista-core' ), $gateway->label(), $mobile ),
			)
		);
	}

	/* ---------------------------------------------------------------------
	 * Helpers
	 * ------------------------------------------------------------------ */

	/**
	 * Verify the logged-out nonce.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response|null Error response, or null when valid.
	 */
	private static function guard( \WP_REST_Request $request ) {
		$nonce = (string) $request->get_param( 'nonce' );
		if ( '' === $nonce ) {
			$nonce = (string) $request->get_header( 'x_hamista_nonce' );
		}
		if ( ! wp_verify_nonce( $nonce, self::NONCE ) ) {
			return self::error( new \WP_Error( 'hamista_bad_nonce', __( 'Your session expired. Please try again.', 'hamista-core' ), array( 'status' => 403 ) ) );
		}
		return null;
	}

	/**
	 * Honeypot filled.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return bool
	 */
	private static function is_bot( \WP_REST_Request $request ) {
		$value = $request->get_param( self::HONEYPOT );
		return is_scalar( $value ) && '' !== trim( (string) $value );
	}

	/**
	 * Response after a code was (or appears to be) sent.
	 *
	 * @param string $mobile Mobile.
	 * @param array  $data   { resend_in, expires_in, length }.
	 * @return \WP_REST_Response
	 */
	private static function sent_response( $mobile, array $data ) {
		return self::ok(
			array(
				'message'    => OTP::is_test_mode()
					? __( 'Test mode: the code was not sent by SMS.', 'hamista-core' )
					/* translators: %s: mobile number */
					: sprintf( __( 'We sent a code to %s.', 'hamista-core' ), $mobile ),
				'mobile'     => $mobile,
				'resend_in'  => (int) $data['resend_in'],
				'expires_in' => (int) $data['expires_in'],
				'length'     => (int) $data['length'],
			)
		);
	}

	/**
	 * Extra checks before signing someone in.
	 *
	 * @param \WP_User $user   User.
	 * @param string   $mobile Mobile.
	 * @return true|\WP_Error
	 */
	private static function can_login( $user, $mobile ) {
		$error = new \WP_Error( 'hamista_login_failed', __( 'We couldn’t sign you in with this number. Please contact us.', 'hamista-core' ), array( 'status' => 403 ) );
		if ( is_multisite() && ( ! empty( $user->spam ) || is_user_spammy( $user ) ) ) {
			return $error;
		}
		/**
		 * Allow or block a code sign-in (return false or a WP_Error to block).
		 *
		 * @param bool|\WP_Error $allowed Allowed.
		 * @param \WP_User       $user    User.
		 * @param string         $mobile  Verified mobile.
		 */
		$allowed = apply_filters( 'hamista_core/otp_can_login', true, $user, $mobile );
		if ( is_wp_error( $allowed ) ) {
			return $allowed;
		}
		return $allowed ? true : $error;
	}

	/**
	 * Sign a user in (persistent cookie).
	 *
	 * @param \WP_User $user User.
	 */
	private static function login( $user ) {
		wp_set_current_user( $user->ID );
		wp_set_auth_cookie( $user->ID, true, is_ssl() );
		do_action( 'wp_login', $user->user_login, $user ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- Core hook.
	}

	/**
	 * Where to go after signing in: requested URL (same site), the setting,
	 * the referring page, or home.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @param \WP_User         $user    User.
	 * @param bool             $is_new  New account.
	 * @return string
	 */
	private static function redirect_for( \WP_REST_Request $request, $user, $is_new ) {
		$redirect  = '';
		$requested = (string) $request->get_param( 'redirect' );
		if ( '' !== $requested ) {
			$redirect = wp_validate_redirect( esc_url_raw( $requested ), '' );
		}
		if ( '' === $redirect ) {
			$setting  = trim( (string) hamista_core_option( 'login_redirect', '' ) );
			$redirect = '' !== $setting ? esc_url_raw( $setting ) : '';
		}
		if ( '' === $redirect ) {
			$referer = (string) $request->get_header( 'referer' );
			if ( '' !== $referer && false === strpos( $referer, 'wp-login.php' ) ) {
				$redirect = wp_validate_redirect( esc_url_raw( $referer ), '' );
			}
		}
		if ( '' === $redirect ) {
			$redirect = home_url( '/' );
		}
		/**
		 * Filter the URL visitors go to after signing in.
		 *
		 * @param string   $redirect URL.
		 * @param \WP_User $user     User.
		 * @param bool     $is_new   Whether the account was just created.
		 */
		return (string) apply_filters( 'hamista_core/login_redirect', $redirect, $user, $is_new );
	}

	/**
	 * Clean a person's name.
	 *
	 * @param mixed $value Raw.
	 * @return string
	 */
	private static function clean_name( $value ) {
		if ( ! is_scalar( $value ) ) {
			return '';
		}
		$value = trim( preg_replace( '/\s+/u', ' ', sanitize_text_field( (string) $value ) ) );
		return function_exists( 'mb_substr' ) ? mb_substr( $value, 0, 80 ) : substr( $value, 0, 80 );
	}

	/**
	 * Success response.
	 *
	 * @param array $data Data.
	 * @return \WP_REST_Response
	 */
	private static function ok( array $data = array() ) {
		$response = new \WP_REST_Response(
			array_merge(
				array(
					'ok'      => true,
					'message' => '',
				),
				$data
			),
			200
		);
		$response->header( 'Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0' );
		return $response;
	}

	/**
	 * Error response `{ ok: false, code, message, ... }`.
	 *
	 * @param \WP_Error $error Error.
	 * @param array     $extra Extra fields.
	 * @return \WP_REST_Response
	 */
	private static function error( \WP_Error $error, array $extra = array() ) {
		$data   = $error->get_error_data();
		$data   = is_array( $data ) ? $data : array();
		$status = isset( $data['status'] ) ? (int) $data['status'] : 400;
		unset( $data['status'] );

		$response = new \WP_REST_Response(
			array_merge(
				$extra,
				$data,
				array(
					'ok'      => false,
					'code'    => $error->get_error_code(),
					'message' => $error->get_error_message(),
				)
			),
			$status
		);
		$response->header( 'Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0' );
		return $response;
	}
}
