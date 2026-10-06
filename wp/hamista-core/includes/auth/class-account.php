<?php
/**
 * Front-end account API: the login form, shortcodes, the header login modal,
 * account URL and the user lookup/creation used by the REST routes.
 *
 * Embed the form anywhere with:
 *
 *     echo \Hamista\Core\Auth\Account::render_form( array( 'context' => 'page' ) ); // phpcs:ignore
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth;

defined( 'ABSPATH' ) || exit;

/**
 * Account.
 */
class Account {

	const META = 'hamista_mobile';

	/**
	 * Whether the script data was printed.
	 *
	 * @var bool
	 */
	private static $data_added = false;

	/**
	 * Hooks (only while mobile login is enabled).
	 */
	public static function init() {
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'register_assets' ), 5 );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'maybe_enqueue' ), 20 );
		add_action( 'wp_footer', array( __CLASS__, 'print_modal' ), 5 );
		add_action( 'template_redirect', array( __CLASS__, 'maybe_redirect_account' ) );
		add_filter( 'hamista/account_url', array( __CLASS__, 'account_url' ), 20 );
	}

	/**
	 * Shortcodes are registered even while mobile login is off, so pages never
	 * show the raw [hamista_login] tag (they render nothing for visitors).
	 */
	public static function register_shortcodes() {
		add_shortcode( 'hamista_login', array( __CLASS__, 'shortcode_login' ) );
		add_shortcode( 'hamista_account', array( __CLASS__, 'shortcode_account' ) );
	}

	/* ---------------------------------------------------------------------
	 * Assets
	 * ------------------------------------------------------------------ */

	/**
	 * Register the `hamista-auth` script and style.
	 */
	public static function register_assets() {
		if ( wp_script_is( 'hamista-auth', 'registered' ) ) {
			return;
		}
		$version = defined( 'HAMISTA_CORE_VERSION' ) ? HAMISTA_CORE_VERSION : '1.0.0';
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			$version .= '.' . (int) @filemtime( HAMISTA_CORE_DIR . 'assets/js/auth.js' ) . (int) @filemtime( HAMISTA_CORE_DIR . 'assets/css/auth.css' ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged
		}
		wp_register_style( 'hamista-auth', HAMISTA_CORE_URL . 'assets/css/auth.css', array(), $version );
		wp_register_script(
			'hamista-auth',
			HAMISTA_CORE_URL . 'assets/js/auth.js',
			array(),
			$version,
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);
	}

	/**
	 * Enqueue the assets and print the script data once.
	 */
	public static function enqueue() {
		self::register_assets();
		wp_enqueue_style( 'hamista-auth' );
		wp_enqueue_script( 'hamista-auth' );
		if ( ! self::$data_added ) {
			self::$data_added = true;
			wp_add_inline_script( 'hamista-auth', 'window.hamistaAuth=' . wp_json_encode( self::script_data() ) . ';', 'before' );
		}
	}

	/**
	 * Data for auth.js.
	 *
	 * @return array
	 */
	public static function script_data() {
		$data = array(
			'rest'      => esc_url_raw( rest_url( Rest::NS . '/' ) ),
			'nonce'     => wp_create_nonce( Rest::NONCE ),
			'restNonce' => is_user_logged_in() ? wp_create_nonce( 'wp_rest' ) : '',
			'length'    => OTP::length(),
			'resend'    => OTP::resend_delay(),
			'expiry'    => OTP::expiry(),
			'strict'    => true,
			'i18n'      => array(
				'invalidMobile' => __( 'Please enter a valid mobile number, e.g. 09123456789.', 'hamista-core' ),
				/* translators: %s: number of digits */
				'enterCode'     => __( 'Enter all %s digits of the code.', 'hamista-core' ),
				/* translators: %s: countdown such as 0:59 */
				'resendIn'      => __( 'Resend code in %s', 'hamista-core' ),
				'codeResent'    => __( 'A new code is on its way.', 'hamista-core' ),
				'network'       => __( 'Connection problem. Check your internet and try again.', 'hamista-core' ),
				'error'         => __( 'Something went wrong. Please try again.', 'hamista-core' ),
				'nameRequired'  => __( 'Please enter your name.', 'hamista-core' ),
				'loginRequired' => __( 'Please enter your login and password.', 'hamista-core' ),
				'showPassword'  => __( 'Show password', 'hamista-core' ),
				'hidePassword'  => __( 'Hide password', 'hamista-core' ),
				/* translators: 1: digit position, 2: total digits */
				'digit'         => __( 'Digit %1$s of %2$s', 'hamista-core' ),
				'saved'         => __( 'Your details were saved.', 'hamista-core' ),
			),
		);
		/**
		 * Filter the data passed to auth.js (window.hamistaAuth).
		 *
		 * @param array $data Data.
		 */
		return apply_filters( 'hamista_core/auth_script_data', $data );
	}

	/**
	 * Enqueue early (in <head>) where a form will certainly render.
	 */
	public static function maybe_enqueue() {
		$needed = self::modal_needed();
		if ( ! $needed && is_singular() ) {
			$post   = get_post();
			$needed = $post && ( has_shortcode( $post->post_content, 'hamista_login' ) || has_shortcode( $post->post_content, 'hamista_account' ) );
		}
		if ( ! $needed && class_exists( 'WooCommerce' ) && hamista_core_option( 'otp_woocommerce', true ) && function_exists( 'is_account_page' ) ) {
			$needed = is_account_page() || ( ! is_user_logged_in() && is_checkout() );
		}
		if ( apply_filters( 'hamista_core/auth_enqueue', $needed ) ) {
			self::enqueue();
		}
	}

	/* ---------------------------------------------------------------------
	 * Form
	 * ------------------------------------------------------------------ */

	/**
	 * Render the mobile login form.
	 *
	 * @param array $args {
	 *     @type string    $title         Heading (default depends on registration).
	 *     @type string    $subtitle      Text under the heading.
	 *     @type string    $redirect      Same-site URL after sign-in (default: setting → referring page → home).
	 *     @type bool|null $show_password Password tab (null = `login_password` setting; never shown while that setting is off).
	 *     @type string    $context       page | modal | woocommerce | wp-login.
	 *     @type string    $class         Extra CSS classes.
	 *     @type string    $id            Element id (auto when empty).
	 * }
	 * @return string HTML.
	 */
	public static function render_form( array $args = array() ) {
		if ( ! Auth::enabled() ) {
			if ( current_user_can( 'manage_options' ) ) {
				return '<p class="hm-auth-off">' . esc_html__( 'Mobile login is turned off. Enable it in Hamista → Login & SMS.', 'hamista-core' ) . '</p>';
			}
			return '';
		}

		$args = wp_parse_args(
			$args,
			array(
				'title'         => null,
				'subtitle'      => null,
				'redirect'      => '',
				'show_password' => null,
				'context'       => 'page',
				'class'         => '',
				'id'            => '',
			)
		);

		$contexts = array( 'page', 'modal', 'woocommerce', 'wp-login' );
		$context  = in_array( $args['context'], $contexts, true ) ? $args['context'] : 'page';
		$register = (bool) hamista_core_option( 'otp_register', true );

		$redirect = (string) $args['redirect'];
		if ( '' === $redirect && isset( $_GET['redirect_to'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$redirect = sanitize_text_field( wp_unslash( $_GET['redirect_to'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		}
		$redirect = '' !== $redirect ? wp_validate_redirect( esc_url_raw( $redirect ), '' ) : '';

		$classes = array( 'hm-auth', 'hm-auth--' . $context );
		if ( 'wp-login' === $context || ! hamista_core_theme_active() ) {
			$classes[] = 'hm-auth--standalone';
		}
		if ( in_array( $context, array( 'page', 'woocommerce' ), true ) ) {
			$classes[] = 'hm-bolted'; // Screws on the Industrial kit card.
		}
		if ( $args['class'] ) {
			$classes = array_merge( $classes, array_map( 'sanitize_html_class', preg_split( '/\s+/', (string) $args['class'] ) ) );
		}

		$template_args = array(
			'id'            => $args['id'] ? sanitize_html_class( $args['id'] ) : wp_unique_id( 'hm-auth-' ),
			'classes'       => implode( ' ', array_filter( $classes ) ),
			'context'       => $context,
			'title'         => null !== $args['title'] && '' !== $args['title'] ? (string) $args['title'] : ( $register ? __( 'Log in or sign up', 'hamista-core' ) : __( 'Log in', 'hamista-core' ) ),
			'subtitle'      => null !== $args['subtitle'] ? (string) $args['subtitle'] : __( 'Enter your mobile number and we’ll text you a one-time code.', 'hamista-core' ),
			'redirect'      => $redirect,
			// The setting is a master switch: without it the password route does not exist.
			'show_password' => (bool) hamista_core_option( 'login_password', true ) && ( null === $args['show_password'] || (bool) $args['show_password'] ),
			'length'        => OTP::length(),
			'test_mode'     => OTP::is_test_mode(),
			'lost_url'      => wp_lostpassword_url( $redirect ? $redirect : '' ),
		);

		/**
		 * Filter the login form template arguments.
		 *
		 * @param array $template_args Arguments.
		 * @param array $args          Original arguments.
		 */
		$template_args = apply_filters( 'hamista_core/login_form_args', $template_args, $args );

		self::enqueue();
		ob_start();
		hamista_core_template( 'auth/form', $template_args );
		return (string) ob_get_clean();
	}

	/**
	 * Logged-in panel (or the form when logged out).
	 *
	 * @param array $form_args Form arguments for logged-out visitors.
	 * @return string
	 */
	public static function render_account( array $form_args = array() ) {
		if ( ! is_user_logged_in() || ! Auth::enabled() ) {
			return self::render_form( $form_args );
		}
		$user = wp_get_current_user();
		$woo  = class_exists( 'WooCommerce' ) && function_exists( 'wc_get_page_id' ) && wc_get_page_id( 'myaccount' ) > 0;

		self::enqueue();
		ob_start();
		hamista_core_template(
			'auth/account',
			array(
				'id'          => wp_unique_id( 'hm-account-' ),
				'user'        => $user,
				'mobile'      => (string) get_user_meta( $user->ID, self::META, true ),
				'woocommerce' => $woo,
				'account_url' => $woo ? wc_get_page_permalink( 'myaccount' ) : '',
				'logout_url'  => wp_logout_url( home_url( '/' ) ),
				'standalone'  => ! hamista_core_theme_active(),
			)
		);
		return (string) ob_get_clean();
	}

	/**
	 * [hamista_login title="" subtitle="" redirect="" password="yes|no"].
	 *
	 * @param array|string $atts Attributes.
	 * @return string
	 */
	public static function shortcode_login( $atts ) {
		$atts = shortcode_atts(
			array(
				'title'    => '',
				'subtitle' => null,
				'redirect' => '',
				'password' => '',
			),
			$atts,
			'hamista_login'
		);
		return self::render_account( self::shortcode_form_args( $atts ) );
	}

	/**
	 * [hamista_account] — login form, or the account panel when logged in.
	 *
	 * @param array|string $atts Attributes.
	 * @return string
	 */
	public static function shortcode_account( $atts ) {
		$atts = shortcode_atts(
			array(
				'title'    => '',
				'subtitle' => null,
				'redirect' => '',
				'password' => '',
			),
			$atts,
			'hamista_account'
		);
		return self::render_account( self::shortcode_form_args( $atts ) );
	}

	/**
	 * Shortcode attributes → form args.
	 *
	 * @param array $atts Attributes.
	 * @return array
	 */
	private static function shortcode_form_args( array $atts ) {
		$args = array(
			'title'    => $atts['title'],
			'subtitle' => $atts['subtitle'],
			'redirect' => $atts['redirect'],
			'context'  => 'page',
		);
		if ( '' !== $atts['password'] ) {
			$args['show_password'] = in_array( strtolower( (string) $atts['password'] ), array( '1', 'yes', 'true', 'on' ), true );
		}
		return $args;
	}

	/**
	 * Logged-in visitors on a [hamista_account] page go to WooCommerce My Account.
	 */
	public static function maybe_redirect_account() {
		if ( ! is_user_logged_in() || ! is_singular() || ! class_exists( 'WooCommerce' ) || ! function_exists( 'wc_get_page_id' ) ) {
			return;
		}
		$post = get_post();
		$page = wc_get_page_id( 'myaccount' );
		if ( $post && $page > 0 && (int) $post->ID !== $page && has_shortcode( $post->post_content, 'hamista_account' ) ) {
			wp_safe_redirect( wc_get_page_permalink( 'myaccount' ) );
			exit;
		}
	}

	/* ---------------------------------------------------------------------
	 * Account URL + header modal
	 * ------------------------------------------------------------------ */

	/**
	 * Account URL: WooCommerce My Account, else the login page setting, else
	 * the profile screen (logged in) or wp-login.php.
	 *
	 * Hooked to `hamista/account_url`.
	 *
	 * @return string
	 */
	public static function account_url() {
		if ( class_exists( 'WooCommerce' ) && function_exists( 'wc_get_page_id' ) && wc_get_page_id( 'myaccount' ) > 0 ) {
			return wc_get_page_permalink( 'myaccount' );
		}
		$page = (int) hamista_core_option( 'login_page', 0 );
		if ( $page && 'publish' === get_post_status( $page ) ) {
			return get_permalink( $page );
		}
		return is_user_logged_in() ? get_edit_profile_url() : wp_login_url();
	}

	/**
	 * Whether the header login modal is printed on this page.
	 *
	 * @return bool
	 */
	public static function modal_needed() {
		if ( is_user_logged_in() || is_admin() || is_customize_preview() ) {
			return false;
		}
		$needed = (bool) hamista_core_option( 'header_account', true );
		// Block checkout's "Log in" prompt opens the modal too.
		if ( ! $needed && class_exists( 'WooCommerce' ) && hamista_core_option( 'otp_woocommerce', true ) && function_exists( 'is_checkout' ) ) {
			$needed = is_checkout();
		}
		/**
		 * Whether to print the login modal.
		 *
		 * @param bool $needed Needed.
		 */
		return (bool) apply_filters( 'hamista_core/auth_modal', $needed );
	}

	/**
	 * Print the (hidden) login modal.
	 */
	public static function print_modal() {
		if ( ! self::modal_needed() ) {
			return;
		}
		$form = self::render_form(
			array(
				'context' => 'modal',
				'id'      => 'hm-auth-modal-form',
			)
		);
		if ( '' === $form ) {
			return;
		}
		?>
		<div class="hm-auth-modal" id="hm-auth-modal" data-hm-auth-modal aria-hidden="true" hidden>
			<div class="hm-auth-modal__backdrop" data-hm-auth-close></div>
			<div class="hm-auth-modal__dialog hm-bolted" role="dialog" aria-modal="true" aria-labelledby="hm-auth-modal-form-title">
				<button type="button" class="hm-auth-modal__close" data-hm-auth-close aria-label="<?php esc_attr_e( 'Close', 'hamista-core' ); ?>"><?php echo hamista_core_icon( 'close' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static SVG. ?></button>
				<?php echo $form; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped in the template. ?>
			</div>
		</div>
		<?php
	}

	/* ---------------------------------------------------------------------
	 * Users
	 * ------------------------------------------------------------------ */

	/**
	 * Find the account for a mobile number.
	 *
	 * Order: verified `hamista_mobile` meta → user_login → WooCommerce
	 * `billing_phone` → Digits plugin meta. Unverified fallbacks only match when
	 * exactly one account has the number, and `billing_phone` (typed freely by
	 * customers) never unlocks an account that can edit posts.
	 *
	 * @param string $mobile Mobile.
	 * @return \WP_User|null
	 */
	public static function find_user_by_mobile( $mobile ) {
		$mobile = OTP::normalize_mobile( $mobile );
		if ( '' === $mobile ) {
			return null;
		}

		$user = null;
		$ids  = get_users(
			array(
				'meta_key'    => self::META, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'meta_value'  => $mobile, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
				'number'      => 1,
				'orderby'     => 'ID',
				'order'       => 'ASC',
				'fields'      => 'ID',
				'count_total' => false,
				'blog_id'     => 0,
			)
		);
		if ( $ids ) {
			$user = get_user_by( 'id', (int) $ids[0] );
		}
		if ( ! $user ) {
			$user = get_user_by( 'login', $mobile );
		}
		if ( ! $user ) {
			$variants = self::mobile_variants( $mobile );
			foreach ( array( 'billing_phone', 'digits_phone_no', 'digits_phone' ) as $key ) {
				$ids = get_users(
					array(
						'meta_query'  => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
							array(
								'key'     => $key,
								'value'   => $variants,
								'compare' => 'IN',
							),
						),
						'number'      => 2,
						'fields'      => 'ID',
						'count_total' => false,
						'blog_id'     => 0,
					)
				);
				if ( 1 !== count( $ids ) ) {
					continue;
				}
				$candidate = get_user_by( 'id', (int) $ids[0] );
				if ( $candidate && 'billing_phone' === $key && user_can( $candidate, 'edit_posts' ) ) {
					continue;
				}
				$user = $candidate;
				break;
			}
		}

		/**
		 * Filter the account found for a mobile number.
		 *
		 * @param \WP_User|null $user   User.
		 * @param string        $mobile Normalised mobile.
		 */
		$user = apply_filters( 'hamista_core/find_user_by_mobile', $user ? $user : null, $mobile );
		return $user instanceof \WP_User ? $user : null;
	}

	/**
	 * Spellings of one number as other plugins store it.
	 *
	 * @param string $mobile 09XXXXXXXXX.
	 * @return string[]
	 */
	private static function mobile_variants( $mobile ) {
		$local = substr( $mobile, 1 );
		return array( $mobile, $local, '98' . $local, '+98' . $local, '0098' . $local, '+98 ' . $local, '+980' . $local );
	}

	/**
	 * Create an account for a verified number.
	 *
	 * @param string $mobile Normalised mobile.
	 * @param string $name   Full name (optional).
	 * @return \WP_User|\WP_Error
	 */
	public static function create_user( $mobile, $name = '' ) {
		$role = get_option( 'default_role', 'subscriber' );
		if ( class_exists( 'WooCommerce' ) && get_role( 'customer' ) ) {
			$role = 'customer';
		}

		$name  = trim( (string) $name );
		$parts = '' !== $name ? preg_split( '/\s+/u', $name, 2 ) : array( '', '' );
		$first = isset( $parts[0] ) ? $parts[0] : '';
		$last  = isset( $parts[1] ) ? $parts[1] : '';
		/* translators: %s: last four digits of the mobile number */
		$display = '' !== $name ? $name : sprintf( __( 'User %s', 'hamista-core' ), substr( $mobile, -4 ) );

		$userdata = array(
			'user_login'    => $mobile,
			'user_pass'     => wp_generate_password( 24, true, true ),
			'user_email'    => '',
			// Keep the phone number out of author URLs and public names.
			'user_nicename' => 'u' . strtolower( wp_generate_password( 10, false ) ),
			'display_name'  => $display,
			'nickname'      => $display,
			'first_name'    => $first,
			'last_name'     => $last,
			'role'          => $role,
		);

		/**
		 * Filter the data for a new mobile account.
		 *
		 * @param array  $userdata wp_insert_user() data.
		 * @param string $mobile   Mobile.
		 */
		$userdata = apply_filters( 'hamista_core/new_user_data', $userdata, $mobile );

		// wp_insert_user() expects slashed data, except the password.
		$slashed              = wp_slash( $userdata );
		$slashed['user_pass'] = $userdata['user_pass'];
		$user_id              = wp_insert_user( $slashed );
		if ( is_wp_error( $user_id ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( '[Hamista OTP] create_user: ' . $user_id->get_error_message() ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			}
			return new \WP_Error( 'hamista_register_failed', __( 'Your account could not be created. Please try again or contact us.', 'hamista-core' ), array( 'status' => 500 ) );
		}

		update_user_meta( $user_id, self::META, $mobile );
		update_user_meta( $user_id, 'billing_phone', $mobile );
		if ( class_exists( 'WooCommerce' ) ) {
			if ( '' !== $first ) {
				update_user_meta( $user_id, 'billing_first_name', $first );
			}
			if ( '' !== $last ) {
				update_user_meta( $user_id, 'billing_last_name', $last );
			}
		}

		/**
		 * Fires after an account is created for a verified mobile number.
		 *
		 * @param int    $user_id User ID.
		 * @param string $mobile  Mobile.
		 */
		do_action( 'hamista_core/user_registered', $user_id, $mobile );

		return get_user_by( 'id', $user_id );
	}

	/**
	 * Store a verified number on an account.
	 *
	 * @param int    $user_id User ID.
	 * @param string $mobile  Normalised mobile.
	 * @param bool   $is_new  Just registered.
	 */
	public static function set_mobile( $user_id, $mobile, $is_new = false ) {
		$old = (string) get_user_meta( $user_id, self::META, true );
		if ( $old !== $mobile ) {
			update_user_meta( $user_id, self::META, $mobile );
		}
		/**
		 * Fires when a user proved ownership of a mobile number.
		 *
		 * @param int    $user_id User ID.
		 * @param string $mobile  Mobile.
		 * @param string $old     Previous verified number ('' if none).
		 * @param bool   $is_new  Account was just created.
		 */
		do_action( 'hamista_core/mobile_verified', $user_id, $mobile, $old, $is_new );
	}
}
