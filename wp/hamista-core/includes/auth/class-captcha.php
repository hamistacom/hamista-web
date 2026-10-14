<?php
/**
 * Captcha for the login form, quick buy and (optionally) the wp-login.php and
 * WooCommerce login and registration forms.
 *
 * Providers: a built-in arithmetic question (signed with an HMAC, expiring and
 * single-use, no third party), Cloudflare Turnstile and Google reCAPTCHA v3.
 * The markup printed here is brought to life by assets/js/auth.js; the
 * built-in question also works without JavaScript.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth;

defined( 'ABSPATH' ) || exit;

/**
 * Captcha.
 */
class Captcha {

	/** Built-in question lifetime in seconds. */
	const TTL = 1200;

	/** How long a solved captcha covers repeat requests of the same scope (e.g. resending a code). */
	const PASS_TTL = 900;

	/** Field name posted by classic forms (also the Turnstile response field). */
	const FIELD = 'hm_captcha';

	/** Answer field of the built-in question. */
	const ANSWER = 'hm_captcha_answer';

	/**
	 * Hooks.
	 */
	public static function init() {
		if ( ! self::provider() ) {
			return;
		}
		add_filter( 'hamista_core/auth_script_data', array( __CLASS__, 'script_data' ) );

		if ( ! hamista_core_option( 'captcha_wp_forms', false ) ) {
			return;
		}
		add_action( 'login_form', array( __CLASS__, 'print_field' ) );
		add_action( 'register_form', array( __CLASS__, 'print_field' ) );
		add_filter( 'authenticate', array( __CLASS__, 'check_wp_login' ), 99 );
		add_filter( 'registration_errors', array( __CLASS__, 'check_wp_register' ) );
		if ( class_exists( 'WooCommerce' ) ) {
			add_action( 'woocommerce_login_form', array( __CLASS__, 'print_field' ) );
			add_action( 'woocommerce_register_form', array( __CLASS__, 'print_field' ) );
			add_filter( 'woocommerce_process_login_errors', array( __CLASS__, 'check_wc_form' ) );
			add_filter( 'woocommerce_process_registration_errors', array( __CLASS__, 'check_wc_form' ) );
		}
	}

	/**
	 * Active provider: builtin | turnstile | recaptcha, or '' when off or not
	 * configured.
	 *
	 * @return string
	 */
	public static function provider() {
		$provider = (string) hamista_core_option( 'captcha', 'none' );
		if ( in_array( $provider, array( 'turnstile', 'recaptcha' ), true ) && ( '' === self::site_key( $provider ) || '' === self::secret( $provider ) ) ) {
			return '';
		}
		$provider = in_array( $provider, array( 'builtin', 'turnstile', 'recaptcha' ), true ) ? $provider : '';
		/**
		 * Filter the captcha provider ('' turns the captcha off).
		 *
		 * @param string $provider builtin | turnstile | recaptcha | ''.
		 */
		return (string) apply_filters( 'hamista_core/captcha_provider', $provider );
	}

	/**
	 * Public site key.
	 *
	 * @param string $provider Provider.
	 * @return string
	 */
	private static function site_key( $provider ) {
		return trim( (string) hamista_core_option( $provider . '_site_key', '' ) );
	}

	/**
	 * Secret key.
	 *
	 * @param string $provider Provider.
	 * @return string
	 */
	private static function secret( $provider ) {
		return trim( (string) hamista_core_option( $provider . '_secret_key', '' ) );
	}

	/**
	 * Data for auth.js.
	 *
	 * @param array $data Script data.
	 * @return array
	 */
	public static function script_data( $data ) {
		$provider        = self::provider();
		$sources         = array(
			'turnstile' => 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
			'recaptcha' => 'https://www.google.com/recaptcha/api.js?render=' . rawurlencode( self::site_key( 'recaptcha' ) ),
		);
		$data['captcha'] = array(
			'provider' => $provider,
			'siteKey'  => 'builtin' === $provider ? '' : self::site_key( $provider ),
			'src'      => isset( $sources[ $provider ] ) ? $sources[ $provider ] : '',
		);
		$data['i18n']   += array(
			'captchaAnswer'  => __( 'Please answer the security question.', 'hamista-core' ),
			'captchaPending' => __( 'Please complete the security check.', 'hamista-core' ),
		);
		return $data;
	}

	/* ---------------------------------------------------------------------
	 * Markup
	 * ------------------------------------------------------------------ */

	/**
	 * Widget markup ('' when the captcha is off).
	 *
	 * @param string $context auth (Hamista forms) | form (wp-login.php, WooCommerce).
	 * @return string
	 */
	public static function field( $context = 'auth' ) {
		$provider = self::provider();
		if ( ! $provider ) {
			return '';
		}

		if ( 'turnstile' === $provider ) {
			return '<div class="hm-captcha hm-captcha--turnstile" data-hm-captcha="turnstile"></div>';
		}
		if ( 'recaptcha' === $provider ) {
			return '<div class="hm-captcha hm-captcha--recaptcha" data-hm-captcha="recaptcha" hidden><input type="hidden" name="' . esc_attr( self::FIELD ) . '" value=""></div>';
		}

		$id        = wp_unique_id( 'hm-captcha-' );
		$challenge = self::challenge();
		$classes   = 'auth' === $context ? 'hm-auth__input hm-captcha__input' : 'input input-text woocommerce-Input hm-captcha__input';
		$label     = sprintf(
			/* translators: %s: arithmetic question such as 3 + 4 */
			esc_html__( 'Security question: what is %s?', 'hamista-core' ),
			'<bdi dir="ltr" data-hm-captcha-q>' . esc_html( $challenge['question'] ) . '</bdi>'
		);

		return sprintf(
			'<div class="hm-captcha hm-captcha--builtin%1$s" data-hm-captcha="builtin" data-expires="%2$d"><label class="%3$s" for="%4$s">%5$s</label><input class="%6$s" id="%4$s" name="%7$s" type="text" inputmode="numeric" autocomplete="off" maxlength="4" dir="ltr" required><input type="hidden" name="%8$s" value="%9$s" data-hm-captcha-token></div>',
			'auth' === $context ? '' : ' form-row form-row-wide',
			(int) $challenge['expires'],
			'auth' === $context ? 'hm-auth__label' : 'hm-captcha__label',
			esc_attr( $id ),
			$label,
			esc_attr( $classes ),
			esc_attr( self::ANSWER ),
			esc_attr( self::FIELD ),
			esc_attr( $challenge['token'] )
		);
	}

	/**
	 * Print the widget in a classic form (wp-login.php, WooCommerce).
	 */
	public static function print_field() {
		if ( 'builtin' !== self::provider() ) {
			Account::enqueue();
		}
		echo self::field( 'form' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped in field().
	}

	/**
	 * A new built-in question.
	 *
	 * @return array { question, token, expires }
	 */
	public static function challenge() {
		$a = random_int( 2, 9 );
		$b = random_int( 1, 9 );
		if ( random_int( 0, 1 ) && $a > $b ) {
			$question = $a . ' − ' . $b;
			$answer   = $a - $b;
		} else {
			$question = $a . ' + ' . $b;
			$answer   = $a + $b;
		}
		$expires = time() + self::TTL;
		$salt    = wp_generate_password( 12, false );

		return array(
			'question' => hamista_core_digits( $question ),
			'token'    => $expires . '.' . $salt . '.' . self::sign( $expires, $salt, $answer ),
			'expires'  => $expires,
		);
	}

	/**
	 * Signature of a built-in answer.
	 *
	 * @param int    $expires Expiry timestamp.
	 * @param string $salt    Random salt.
	 * @param int    $answer  Answer.
	 * @return string
	 */
	private static function sign( $expires, $salt, $answer ) {
		return hash_hmac( 'sha256', $expires . '|' . $salt . '|' . (int) $answer, wp_salt( 'nonce' ) );
	}

	/* ---------------------------------------------------------------------
	 * Verification
	 * ------------------------------------------------------------------ */

	/**
	 * Check the captcha sent with a REST request (`captcha`, `captcha_answer`).
	 *
	 * @param \WP_REST_Request $request Request.
	 * @param string           $scope   When set, a solved captcha also covers repeat requests of this
	 *                                  scope from the same address for a while (e.g. "resend code").
	 * @return true|\WP_Error
	 */
	public static function check_request( \WP_REST_Request $request, $scope = '' ) {
		return self::verify( $request->get_param( 'captcha' ), $request->get_param( 'captcha_answer' ), $scope );
	}

	/**
	 * Check a captcha.
	 *
	 * @param mixed  $token  Provider token, or the signed built-in question.
	 * @param mixed  $answer Built-in answer.
	 * @param string $scope  See check_request().
	 * @return true|\WP_Error
	 */
	public static function verify( $token, $answer = '', $scope = '' ) {
		$provider = self::provider();
		if ( ! $provider ) {
			return true;
		}
		$pass_key = '' !== $scope ? self::key( 'pass', $scope ) : '';
		if ( $pass_key && get_transient( $pass_key ) ) {
			return true;
		}

		$token = is_scalar( $token ) ? trim( (string) $token ) : '';
		if ( '' === $token || strlen( $token ) > 4096 ) {
			return self::error( 'hamista_captcha_required' );
		}

		$result = 'builtin' === $provider ? self::verify_builtin( $token, $answer ) : self::verify_remote( $provider, $token );
		if ( true === $result && $pass_key ) {
			set_transient( $pass_key, 1, self::PASS_TTL );
		}
		return $result;
	}

	/**
	 * Built-in question.
	 *
	 * @param string $token  Signed question.
	 * @param mixed  $answer Answer (Persian or Latin digits).
	 * @return true|\WP_Error
	 */
	private static function verify_builtin( $token, $answer ) {
		$parts = explode( '.', $token );
		if ( 3 !== count( $parts ) || ! ctype_digit( $parts[0] ) || (int) $parts[0] < time() ) {
			return self::error( 'hamista_captcha_expired' );
		}
		$answer = is_scalar( $answer ) ? trim( hamista_core_latin_digits( (string) $answer ) ) : '';
		if ( ! preg_match( '/^-?\d{1,3}$/', $answer ) ) {
			return self::error( 'hamista_captcha_required' );
		}

		$used = 'hm_cap_used_' . md5( $parts[2] );
		if ( get_transient( $used ) ) {
			return self::error( 'hamista_captcha_expired' );
		}
		// One try per question: a wrong answer burns it too.
		set_transient( $used, 1, max( 1, (int) $parts[0] - time() ) );

		if ( ! hash_equals( self::sign( (int) $parts[0], $parts[1], (int) $answer ), $parts[2] ) ) {
			return self::error( 'hamista_captcha_wrong' );
		}
		return true;
	}

	/**
	 * Turnstile / reCAPTCHA v3 token, checked with the provider.
	 *
	 * @param string $provider Provider.
	 * @param string $token    Token.
	 * @return true|\WP_Error
	 */
	private static function verify_remote( $provider, $token ) {
		$url      = 'turnstile' === $provider ? 'https://challenges.cloudflare.com/turnstile/v0/siteverify' : 'https://www.google.com/recaptcha/api/siteverify';
		$response = wp_remote_post(
			$url,
			array(
				'timeout' => 10,
				'body'    => array(
					'secret'   => self::secret( $provider ),
					'response' => $token,
					'remoteip' => OTP::client_ip(),
				),
			)
		);
		if ( is_wp_error( $response ) ) {
			self::log( $provider . ': ' . $response->get_error_message() );
			return self::error( 'hamista_captcha_unavailable' );
		}

		$body  = json_decode( (string) wp_remote_retrieve_body( $response ), true );
		$body  = is_array( $body ) ? $body : array();
		$codes = isset( $body['error-codes'] ) ? (array) $body['error-codes'] : array();

		// A wrong secret is the site's fault, not the visitor's: don't lock everyone out.
		if ( array_intersect( array( 'missing-input-secret', 'invalid-input-secret' ), $codes ) ) {
			self::log( $provider . ': ' . implode( ', ', $codes ) );
			return true;
		}
		if ( empty( $body['success'] ) ) {
			return self::error( 'hamista_captcha_wrong' );
		}
		if ( 'recaptcha' === $provider ) {
			/**
			 * Lowest reCAPTCHA v3 score accepted (0–1).
			 *
			 * @param float $threshold Threshold.
			 */
			$threshold = (float) apply_filters( 'hamista_core/recaptcha_threshold', 0.5 );
			if ( isset( $body['score'] ) && (float) $body['score'] < $threshold ) {
				return self::error( 'hamista_captcha_wrong' );
			}
		}
		return true;
	}

	/* ---------------------------------------------------------------------
	 * Classic forms
	 * ------------------------------------------------------------------ */

	/**
	 * Check the captcha posted by a classic form.
	 *
	 * @return true|\WP_Error
	 */
	private static function check_post() {
		// phpcs:disable WordPress.Security.NonceVerification.Missing -- The form handlers verify their own nonces; this only reads the captcha.
		$token  = isset( $_POST[ self::FIELD ] ) ? sanitize_text_field( wp_unslash( $_POST[ self::FIELD ] ) ) : '';
		$answer = isset( $_POST[ self::ANSWER ] ) ? sanitize_text_field( wp_unslash( $_POST[ self::ANSWER ] ) ) : '';
		// phpcs:enable WordPress.Security.NonceVerification.Missing
		return self::verify( $token, $answer );
	}

	/**
	 * Whether this request is a wp-login.php form submission.
	 *
	 * @param string $field Field the form posts.
	 * @return bool
	 */
	private static function is_wp_login_post( $field ) {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- Presence check only.
		return isset( $GLOBALS['pagenow'] ) && 'wp-login.php' === $GLOBALS['pagenow'] && isset( $_POST[ $field ] );
	}

	/**
	 * Wp-login.php sign-in (`authenticate`, late).
	 *
	 * @param \WP_User|\WP_Error|null $user User or error so far.
	 * @return \WP_User|\WP_Error|null
	 */
	public static function check_wp_login( $user ) {
		if ( ! self::is_wp_login_post( 'log' ) || is_wp_error( $user ) || null === $user ) {
			return $user;
		}
		$check = self::check_post();
		return is_wp_error( $check ) ? $check : $user;
	}

	/**
	 * Wp-login.php registration.
	 *
	 * @param \WP_Error $errors Errors.
	 * @return \WP_Error
	 */
	public static function check_wp_register( $errors ) {
		if ( ! self::is_wp_login_post( 'user_login' ) ) {
			return $errors;
		}
		$check = self::check_post();
		if ( is_wp_error( $check ) ) {
			$errors->add( $check->get_error_code(), $check->get_error_message() );
		}
		return $errors;
	}

	/**
	 * WooCommerce My Account login and registration.
	 *
	 * @param \WP_Error $errors Errors.
	 * @return \WP_Error
	 */
	public static function check_wc_form( $errors ) {
		$check = self::check_post();
		if ( is_wp_error( $check ) && $errors instanceof \WP_Error ) {
			$errors->add( $check->get_error_code(), $check->get_error_message() );
		}
		return $errors;
	}

	/* ---------------------------------------------------------------------
	 * Helpers
	 * ------------------------------------------------------------------ */

	/**
	 * Visitor-facing error.
	 *
	 * @param string $code Error code.
	 * @return \WP_Error
	 */
	private static function error( $code ) {
		$messages = array(
			'hamista_captcha_required'    => __( 'Please complete the security check.', 'hamista-core' ),
			'hamista_captcha_wrong'       => __( 'The security check failed. Please try again.', 'hamista-core' ),
			'hamista_captcha_expired'     => __( 'The security question expired. Please answer the new one.', 'hamista-core' ),
			'hamista_captcha_unavailable' => __( 'The security check is unavailable right now. Please try again in a moment.', 'hamista-core' ),
		);
		return new \WP_Error( $code, $messages[ $code ], array( 'status' => 400 ) );
	}

	/**
	 * Transient key bound to the visitor's address.
	 *
	 * @param string $type  Type.
	 * @param string $value Value.
	 * @return string
	 */
	private static function key( $type, $value ) {
		return 'hm_cap_' . $type . '_' . md5( $type . '|' . $value . '|' . OTP::client_ip() . '|' . wp_salt( 'nonce' ) );
	}

	/**
	 * Log a provider problem when debugging.
	 *
	 * @param string $message Message.
	 */
	private static function log( $message ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( '[Hamista captcha] ' . $message ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		}
	}
}
