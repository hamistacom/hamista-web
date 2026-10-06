<?php
/**
 * One-time codes: generation, storage, verification, cooldowns and rate limits.
 *
 * Codes are never stored in clear text: each record keeps an HMAC of
 * mobile + code (keyed with wp_salt( 'auth' )) in a transient whose name is a
 * salted hash of the mobile number. Messages returned to visitors are generic
 * and never say whether an account exists for a number.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth;

use Hamista\Core\Auth\Gateways\Gateway;

defined( 'ABSPATH' ) || exit;

/**
 * OTP.
 */
class OTP {

	/** Wrong guesses allowed per code. */
	const MAX_ATTEMPTS = 5;

	/** Rate-limit window in seconds. */
	const WINDOW = 600;

	/** Sends per IP address per window. */
	const IP_LIMIT = 5;

	/** Sends per mobile number per window. */
	const MOBILE_LIMIT = 4;

	/** Wrong codes per mobile per hour before the number is locked for an hour. */
	const FAIL_LIMIT = 15;

	/**
	 * Normalise an Iranian mobile number to 09XXXXXXXXX.
	 *
	 * Accepts Persian/Arabic digits, spaces, dashes, dots, parentheses, bidi marks
	 * and the +98 / 0098 / 98 prefixes, or ten digits starting with 9.
	 *
	 * @param string $raw Input.
	 * @return string Normalised number, or '' when invalid.
	 */
	public static function normalize_mobile( $raw ) {
		if ( ! is_scalar( $raw ) ) {
			return '';
		}
		$mobile = hamista_core_latin_digits( (string) $raw );
		$mobile = preg_replace( '/[\s\x{00A0}\x{2000}-\x{200F}\x{2010}-\x{2015}\x{2028}-\x{202F}\x{2212}\x{FEFF}\-\.\(\)\/_]+/u', '', $mobile );
		if ( null === $mobile ) {
			return '';
		}

		if ( 0 === strpos( $mobile, '+98' ) ) {
			$mobile = '0' . ltrim( substr( $mobile, 3 ), '0' );
		} elseif ( 0 === strpos( $mobile, '0098' ) ) {
			$mobile = '0' . ltrim( substr( $mobile, 4 ), '0' );
		} elseif ( 0 === strpos( $mobile, '98' ) && 12 === strlen( $mobile ) ) {
			$mobile = '0' . substr( $mobile, 2 );
		}
		if ( 10 === strlen( $mobile ) && '9' === $mobile[0] ) {
			$mobile = '0' . $mobile;
		}

		$mobile = preg_match( '/^09\d{9}$/', $mobile ) ? $mobile : '';

		/**
		 * Filter the normalised mobile (e.g. to support other countries).
		 *
		 * @param string $mobile Normalised number or ''.
		 * @param string $raw    Raw input.
		 */
		return (string) apply_filters( 'hamista_core/normalize_mobile', $mobile, $raw );
	}

	/**
	 * Mask the middle digits: 0912•••6789.
	 *
	 * @param string $mobile Mobile.
	 * @return string
	 */
	public static function mask( $mobile ) {
		$mobile = (string) $mobile;
		if ( strlen( $mobile ) < 8 ) {
			return str_repeat( '•', strlen( $mobile ) );
		}
		return substr( $mobile, 0, 4 ) . str_repeat( '•', strlen( $mobile ) - 8 ) . substr( $mobile, -4 );
	}

	/**
	 * Code length (4–6).
	 *
	 * @return int
	 */
	public static function length() {
		return max( 4, min( 6, (int) hamista_core_option( 'otp_length', 5 ) ) );
	}

	/**
	 * Code lifetime in seconds.
	 *
	 * @return int
	 */
	public static function expiry() {
		return max( 30, min( 1800, (int) hamista_core_option( 'otp_expiry', 120 ) ) );
	}

	/**
	 * Seconds before another code may be requested for the same number.
	 *
	 * @return int
	 */
	public static function resend_delay() {
		return max( 10, min( 900, (int) hamista_core_option( 'otp_resend', 60 ) ) );
	}

	/**
	 * A random code of the configured length; never starts with 0 so SMS
	 * templates that treat it as a number keep every digit.
	 *
	 * @param int|null $length Digits.
	 * @return string
	 */
	public static function generate( $length = null ) {
		$length = $length ? max( 4, min( 8, (int) $length ) ) : self::length();
		return (string) random_int( (int) pow( 10, $length - 1 ), (int) pow( 10, $length ) - 1 );
	}

	/**
	 * Keyed hash of a code for a number.
	 *
	 * @param string $mobile Mobile.
	 * @param string $code   Code.
	 * @return string
	 */
	public static function hash( $mobile, $code ) {
		return hash_hmac( 'sha256', $mobile . '|' . $code, wp_salt( 'auth' ) );
	}

	/**
	 * Transient name for a value (salted md5, never the raw number or IP).
	 *
	 * @param string $type  Short type id.
	 * @param string $value Value.
	 * @return string
	 */
	private static function key( $type, $value ) {
		return 'hm_otp_' . $type . '_' . md5( $type . '|' . $value . '|' . wp_salt( 'auth' ) );
	}

	/**
	 * Visitor IP. Only REMOTE_ADDR is trusted; sites behind a proxy or CDN can
	 * supply the real address through the `hamista_core/otp_client_ip` filter.
	 *
	 * @return string
	 */
	public static function client_ip() {
		$ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
		$ip = filter_var( $ip, FILTER_VALIDATE_IP ) ? $ip : '0.0.0.0';
		return (string) apply_filters( 'hamista_core/otp_client_ip', $ip );
	}

	/* ---------------------------------------------------------------------
	 * Gateways
	 * ------------------------------------------------------------------ */

	/**
	 * Registered gateways, slug => class name.
	 *
	 * @return array
	 */
	public static function gateways() {
		$map = array(
			'test'        => Gateways\Test::class,
			'kavenegar'   => Gateways\Kavenegar::class,
			'melipayamak' => Gateways\Melipayamak::class,
			'smsir'       => Gateways\Smsir::class,
			'ippanel'     => Gateways\Ippanel::class,
			'ghasedak'    => Gateways\Ghasedak::class,
			'custom'      => Gateways\Custom::class,
		);
		/**
		 * Add or replace SMS gateways. Classes must extend
		 * \Hamista\Core\Auth\Gateways\Gateway.
		 *
		 * @param array $map slug => class name.
		 */
		return (array) apply_filters( 'hamista_core/sms_gateways', $map );
	}

	/**
	 * Gateway instance.
	 *
	 * @param string|null $slug Gateway slug (default: the `otp_gateway` setting).
	 * @return Gateway|\WP_Error
	 */
	public static function gateway( $slug = null ) {
		$slug = $slug ? $slug : (string) hamista_core_option( 'otp_gateway', 'test' );
		$map  = self::gateways();
		if ( empty( $map[ $slug ] ) || ! class_exists( $map[ $slug ] ) || ! is_subclass_of( $map[ $slug ], Gateway::class ) ) {
			return new \WP_Error( 'hamista_sms_no_gateway', __( 'The selected SMS provider is not available.', 'hamista-core' ) );
		}
		return new $map[ $slug ]();
	}

	/**
	 * Whether test mode (no SMS) is active.
	 *
	 * @return bool
	 */
	public static function is_test_mode() {
		return 'test' === hamista_core_option( 'otp_gateway', 'test' );
	}

	/* ---------------------------------------------------------------------
	 * Issue & verify
	 * ------------------------------------------------------------------ */

	/**
	 * Current code record for a number.
	 *
	 * @param string $mobile Normalised mobile.
	 * @return array|null
	 */
	private static function record( $mobile ) {
		$record = get_transient( self::key( 'code', $mobile ) );
		return is_array( $record ) && isset( $record['hash'] ) ? $record : null;
	}

	/**
	 * Seconds left before a new code may be sent to this number.
	 *
	 * @param string $mobile Normalised mobile.
	 * @return int
	 */
	public static function cooldown_remaining( $mobile ) {
		$record = self::record( $mobile );
		if ( ! $record ) {
			return 0;
		}
		return max( 0, (int) $record['sent'] + self::resend_delay() - time() );
	}

	/**
	 * Generate, send and store a code.
	 *
	 * @param string $mobile Normalised mobile.
	 * @return array|\WP_Error { resend_in, expires_in, length }
	 */
	public static function issue( $mobile ) {
		if ( '' === self::normalize_mobile( $mobile ) ) {
			return self::invalid_mobile();
		}

		$wait = self::cooldown_remaining( $mobile );
		if ( $wait > 0 ) {
			return new \WP_Error(
				'hamista_otp_cooldown',
				/* translators: %s: seconds */
				sprintf( __( 'A code was just sent. You can request a new one in %s seconds.', 'hamista-core' ), number_format_i18n( $wait ) ),
				array(
					'status'     => 429,
					'resend_in'  => $wait,
					'expires_in' => self::expires_in( $mobile ),
					'length'     => self::length(),
				)
			);
		}

		if ( self::locked_out( $mobile ) ) {
			return self::rate_limited( self::WINDOW );
		}

		$ip_key     = self::key( 'ip', self::client_ip() );
		$mobile_key = self::key( 'mob', $mobile );
		$retry      = max( self::hits_retry( $ip_key, self::IP_LIMIT ), self::hits_retry( $mobile_key, self::MOBILE_LIMIT ) );
		if ( $retry > 0 ) {
			return self::rate_limited( $retry );
		}
		self::hit( $ip_key );
		self::hit( $mobile_key );

		$gateway = self::gateway();
		if ( is_wp_error( $gateway ) ) {
			self::log( $gateway );
			return self::send_failed();
		}

		$code = self::generate();

		/**
		 * Short-circuit sending (e.g. to use WhatsApp or e-mail). Return true when
		 * the code was delivered, a WP_Error on failure, or null to use the gateway.
		 *
		 * @param null|true|\WP_Error $sent   Result.
		 * @param string              $mobile Mobile.
		 * @param string              $code   Code.
		 */
		$sent = apply_filters( 'hamista_core/otp_pre_send', null, $mobile, $code );
		if ( null === $sent ) {
			$sent = $gateway->send( $mobile, $code );
		}
		if ( true !== $sent ) {
			self::log( is_wp_error( $sent ) ? $sent : new \WP_Error( 'hamista_sms_failed', 'Gateway returned a non-true value.' ) );
			return self::send_failed();
		}

		$now    = time();
		$record = array(
			'hash'     => self::hash( $mobile, $code ),
			'sent'     => $now,
			'expires'  => $now + self::expiry(),
			'attempts' => 0,
		);
		set_transient( self::key( 'code', $mobile ), $record, max( self::expiry(), self::resend_delay() ) + 30 );

		do_action( 'hamista_core/otp_sent', $mobile );

		return array(
			'resend_in'  => self::resend_delay(),
			'expires_in' => self::expiry(),
			'length'     => self::length(),
		);
	}

	/**
	 * Seconds left before the current code expires.
	 *
	 * @param string $mobile Normalised mobile.
	 * @return int
	 */
	public static function expires_in( $mobile ) {
		$record = self::record( $mobile );
		return $record ? max( 0, (int) $record['expires'] - time() ) : 0;
	}

	/**
	 * Check a code. A correct code stays valid until consume() is called so a
	 * follow-up request (e.g. the new-user name step) can present it again.
	 *
	 * @param string $mobile Normalised mobile.
	 * @param string $code   Code (any digits).
	 * @return true|\WP_Error
	 */
	public static function check( $mobile, $code ) {
		$code   = preg_replace( '/\D+/', '', hamista_core_latin_digits( (string) $code ) );
		$record = self::record( $mobile );

		if ( self::locked_out( $mobile ) ) {
			return new \WP_Error( 'hamista_otp_locked', __( 'Too many wrong codes. Please try again later.', 'hamista-core' ), array( 'status' => 429 ) );
		}
		if ( ! $record || time() > (int) $record['expires'] ) {
			return new \WP_Error( 'hamista_otp_expired', __( 'This code has expired. Please request a new one.', 'hamista-core' ), array( 'status' => 410 ) );
		}
		if ( (int) $record['attempts'] >= self::MAX_ATTEMPTS ) {
			return new \WP_Error( 'hamista_otp_locked', __( 'Too many wrong attempts. Please request a new code.', 'hamista-core' ), array( 'status' => 429 ) );
		}

		if ( '' !== $code && hash_equals( (string) $record['hash'], self::hash( $mobile, $code ) ) ) {
			return true;
		}

		// Wrong: count it against this code (keep the original lifetime) and the number.
		++$record['attempts'];
		$ttl = max( 1, max( (int) $record['expires'], (int) $record['sent'] + self::resend_delay() ) - time() + 30 );
		set_transient( self::key( 'code', $mobile ), $record, $ttl );
		self::hit( self::key( 'fail', $mobile ), HOUR_IN_SECONDS );

		$left = self::MAX_ATTEMPTS - (int) $record['attempts'];
		if ( $left <= 0 ) {
			return new \WP_Error( 'hamista_otp_locked', __( 'Too many wrong attempts. Please request a new code.', 'hamista-core' ), array( 'status' => 429 ) );
		}
		return new \WP_Error(
			'hamista_otp_wrong',
			/* translators: %s: attempts left */
			sprintf( _n( 'That code isn’t right. %s attempt left.', 'That code isn’t right. %s attempts left.', $left, 'hamista-core' ), number_format_i18n( $left ) ),
			array(
				'status'        => 400,
				'attempts_left' => $left,
			)
		);
	}

	/**
	 * Invalidate the code after a successful sign-in.
	 *
	 * @param string $mobile Normalised mobile.
	 */
	public static function consume( $mobile ) {
		// The owner proved possession of the number: drop the code and its cooldown.
		// The per-number send limit still applies.
		delete_transient( self::key( 'code', $mobile ) );
		delete_transient( self::key( 'fail', $mobile ) );
	}

	/**
	 * Whether a number has too many wrong codes in the last hour.
	 *
	 * @param string $mobile Normalised mobile.
	 * @return bool
	 */
	private static function locked_out( $mobile ) {
		return self::hits_retry( self::key( 'fail', $mobile ), self::FAIL_LIMIT ) > 0;
	}

	/* ---------------------------------------------------------------------
	 * Fixed-window counters
	 * ------------------------------------------------------------------ */

	/**
	 * Seconds until a counter allows another hit (0 = allowed now).
	 *
	 * @param string $key   Transient key.
	 * @param int    $limit Max hits per window.
	 * @return int
	 */
	private static function hits_retry( $key, $limit ) {
		$data = get_transient( $key );
		if ( ! is_array( $data ) || (int) $data['count'] < $limit ) {
			return 0;
		}
		return max( 1, (int) $data['until'] - time() );
	}

	/**
	 * Count a hit (fixed window: the expiry is set by the first hit).
	 *
	 * @param string $key    Transient key.
	 * @param int    $window Window length.
	 */
	private static function hit( $key, $window = self::WINDOW ) {
		$now  = time();
		$data = get_transient( $key );
		if ( ! is_array( $data ) || (int) $data['until'] <= $now ) {
			$data = array(
				'count' => 0,
				'until' => $now + $window,
			);
		}
		++$data['count'];
		set_transient( $key, $data, max( 1, (int) $data['until'] - $now ) );
	}

	/**
	 * Generic per-IP limiter for other endpoints (e.g. password login).
	 *
	 * @param string $bucket Bucket name.
	 * @param int    $limit  Hits per window.
	 * @param bool   $count  Record a hit.
	 * @return int Seconds to wait (0 = allowed).
	 */
	public static function throttle( $bucket, $limit, $count = true ) {
		$key   = self::key( substr( sanitize_key( $bucket ), 0, 8 ), self::client_ip() );
		$retry = self::hits_retry( $key, $limit );
		if ( ! $retry && $count ) {
			self::hit( $key );
		}
		return $retry;
	}

	/* ---------------------------------------------------------------------
	 * Errors
	 * ------------------------------------------------------------------ */

	/**
	 * Invalid number.
	 *
	 * @return \WP_Error
	 */
	public static function invalid_mobile() {
		return new \WP_Error( 'hamista_otp_invalid_mobile', __( 'Please enter a valid mobile number, e.g. 09123456789.', 'hamista-core' ), array( 'status' => 400 ) );
	}

	/**
	 * Rate limited.
	 *
	 * @param int $retry Seconds.
	 * @return \WP_Error
	 */
	private static function rate_limited( $retry ) {
		$minutes = max( 1, (int) ceil( $retry / 60 ) );
		return new \WP_Error(
			'hamista_otp_rate_limited',
			/* translators: %s: minutes */
			sprintf( _n( 'Too many requests. Please try again in %s minute.', 'Too many requests. Please try again in %s minutes.', $minutes, 'hamista-core' ), number_format_i18n( $minutes ) ),
			array(
				'status'      => 429,
				'retry_after' => (int) $retry,
			)
		);
	}

	/**
	 * Generic sending failure (details go to the debug log only).
	 *
	 * @return \WP_Error
	 */
	private static function send_failed() {
		return new \WP_Error( 'hamista_otp_send_failed', __( 'We couldn’t send the code right now. Please try again in a few minutes.', 'hamista-core' ), array( 'status' => 502 ) );
	}

	/**
	 * Log a gateway error when debugging.
	 *
	 * @param \WP_Error $error Error.
	 */
	private static function log( $error ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( '[Hamista OTP] ' . $error->get_error_code() . ': ' . $error->get_error_message() ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		}
	}
}
