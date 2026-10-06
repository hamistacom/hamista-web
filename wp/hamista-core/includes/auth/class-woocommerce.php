<?php
/**
 * WooCommerce integration: mobile login on My Account and the classic checkout,
 * billing phone kept in sync with the verified number, and the number shown
 * (read-only) in Account details.
 *
 * Block checkout links its "Log in" prompt to My Account; Account::modal_needed()
 * also lets that prompt open the login modal in place.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth;

defined( 'ABSPATH' ) || exit;

/**
 * WooCommerce.
 */
class WooCommerce {

	/**
	 * Templates replaced: WooCommerce template name => Hamista template name.
	 *
	 * @var array
	 */
	private static $templates = array(
		'myaccount/form-login.php' => 'auth/woocommerce-form-login',
		'checkout/form-login.php'  => 'auth/woocommerce-checkout-login',
	);

	/**
	 * Hooks.
	 */
	public static function init() {
		add_filter( 'woocommerce_locate_template', array( __CLASS__, 'locate_template' ), 20, 2 );
		// wc_get_template() caches located paths; this filter runs after the cache.
		add_filter( 'wc_get_template', array( __CLASS__, 'locate_template' ), 20, 2 );

		add_action( 'hamista_core/mobile_verified', array( __CLASS__, 'sync_billing_phone' ), 10, 3 );
		add_action( 'woocommerce_edit_account_form_start', array( __CLASS__, 'account_mobile_field' ) );
		add_filter( 'woocommerce_save_account_details_required_fields', array( __CLASS__, 'optional_email' ) );
	}

	/**
	 * Swap WooCommerce login templates for the mobile form.
	 *
	 * @param string $template      Located path.
	 * @param string $template_name Template name.
	 * @return string
	 */
	public static function locate_template( $template, $template_name ) {
		if ( ! isset( self::$templates[ $template_name ] ) ) {
			return $template;
		}
		$name = self::$templates[ $template_name ];
		$file = locate_template( 'hamista-core/' . $name . '.php' );
		if ( ! $file ) {
			$file = HAMISTA_CORE_DIR . 'templates/' . $name . '.php';
		}
		return is_readable( $file ) ? $file : $template;
	}

	/**
	 * Fill an empty billing phone (or one that held the previous verified number).
	 *
	 * @param int    $user_id User ID.
	 * @param string $mobile  New verified number.
	 * @param string $old     Previous verified number.
	 */
	public static function sync_billing_phone( $user_id, $mobile, $old = '' ) {
		$billing = (string) get_user_meta( $user_id, 'billing_phone', true );
		$current = OTP::normalize_mobile( $billing );
		if ( '' === trim( $billing ) || ( '' !== $old && $current === $old ) ) {
			update_user_meta( $user_id, 'billing_phone', $mobile );
		}
	}

	/**
	 * Read-only verified number in My Account → Account details.
	 */
	public static function account_mobile_field() {
		$mobile = (string) get_user_meta( get_current_user_id(), Account::META, true );
		if ( '' === $mobile ) {
			return;
		}
		wp_enqueue_style( 'hamista-auth' );
		?>
		<p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide hm-auth-verified">
			<label for="hm-account-mobile">
				<?php esc_html_e( 'Mobile number', 'hamista-core' ); ?>
				<span class="hm-auth-verified__badge"><?php echo hamista_core_icon( 'check' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static SVG. ?><?php esc_html_e( 'Verified', 'hamista-core' ); ?></span>
			</label>
			<input type="tel" class="woocommerce-Input input-text" id="hm-account-mobile" value="<?php echo esc_attr( $mobile ); ?>" dir="ltr" readonly aria-describedby="hm-account-mobile-note">
			<span id="hm-account-mobile-note" class="hm-auth-verified__note"><em><?php esc_html_e( 'You sign in with this number. Contact us to change it.', 'hamista-core' ); ?></em></span>
		</p>
		<?php
	}

	/**
	 * Accounts created by mobile may have no email; don't force one on save.
	 *
	 * @param array $fields Required fields.
	 * @return array
	 */
	public static function optional_email( $fields ) {
		$user = wp_get_current_user();
		if ( $user && $user->ID && '' === (string) $user->user_email && get_user_meta( $user->ID, Account::META, true ) ) {
			unset( $fields['account_email'] );
		}
		return $fields;
	}
}
