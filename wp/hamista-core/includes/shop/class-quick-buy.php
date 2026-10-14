<?php
/**
 * Quick buy (one-click order) for WooCommerce.
 *
 * A "Quick buy" button next to Add to cart opens a small dialog that asks for
 * a name and mobile number only. The order is created straight away with the
 * quantity and variation picked on the product page; the shop calls the
 * customer back, or the customer is sent to the payment page.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Shop;

use Hamista\Core\Auth\Account;
use Hamista\Core\Auth\Captcha;
use Hamista\Core\Auth\OTP;
use Hamista\Core\Auth\Rest;

defined( 'ABSPATH' ) || exit;

/**
 * Quick_Buy.
 */
class Quick_Buy {

	/** Payment method id stored on the orders. */
	const METHOD = 'hamista_quick_buy';

	/**
	 * Whether the button was printed (the dialog follows in the footer).
	 *
	 * @var bool
	 */
	private static $printed = false;

	/**
	 * Hooks.
	 */
	public static function init() {
		if ( ! class_exists( 'WooCommerce' ) || ! hamista_core_option( 'quick_buy', false ) ) {
			return;
		}
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue' ), 20 );
		add_action( 'woocommerce_after_add_to_cart_button', array( __CLASS__, 'button' ) );
		add_action( 'wp_footer', array( __CLASS__, 'dialog' ), 6 );
		add_action( 'rest_api_init', array( __CLASS__, 'register_route' ) );
		add_filter( 'hamista_core/auth_script_data', array( __CLASS__, 'script_data' ) );
	}

	/**
	 * Load the script on product pages.
	 */
	public static function enqueue() {
		if ( function_exists( 'is_product' ) && is_product() ) {
			Account::enqueue();
		}
	}

	/**
	 * Strings for auth.js.
	 *
	 * @param array $data Script data.
	 * @return array
	 */
	public static function script_data( $data ) {
		$data['i18n'] += array(
			'chooseOptions' => __( 'Please choose the product options first.', 'hamista-core' ),
		);
		return $data;
	}

	/**
	 * Button after Add to cart (single product pages).
	 */
	public static function button() {
		global $product;
		if ( ! is_product() || ! $product instanceof \WC_Product || ! $product->is_purchasable() || ! $product->is_in_stock() || ! $product->is_type( array( 'simple', 'variable' ) ) ) {
			return;
		}
		self::$printed = true;
		Account::enqueue();
		printf(
			'<button type="button" class="button hm-quick-buy" data-hm-quick-open data-product="%1$d" aria-haspopup="dialog" aria-controls="hm-quick-modal" aria-expanded="false">%2$s<span>%3$s</span></button>',
			(int) $product->get_id(),
			hamista_core_icon( 'bolt' ), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static SVG.
			esc_html__( 'Quick buy', 'hamista-core' )
		);
	}

	/**
	 * The dialog (once, after a button was printed).
	 */
	public static function dialog() {
		if ( ! self::$printed ) {
			return;
		}
		$name   = '';
		$mobile = '';
		if ( is_user_logged_in() ) {
			$user   = wp_get_current_user();
			$name   = trim( $user->first_name . ' ' . $user->last_name );
			$name   = '' !== $name ? $name : $user->display_name;
			$mobile = (string) get_user_meta( $user->ID, Account::META, true );
			$mobile = '' !== $mobile ? $mobile : OTP::normalize_mobile( get_user_meta( $user->ID, 'billing_phone', true ) );
		}
		$pay   = 'pay' === hamista_core_option( 'quick_buy_mode', 'hold' );
		$class = 'hm-auth hm-auth--modal hm-quick' . ( hamista_core_theme_active() ? '' : ' hm-auth--standalone' );
		?>
		<div class="hm-auth-modal hm-quick-modal" id="hm-quick-modal" aria-hidden="true" hidden>
			<div class="hm-auth-modal__backdrop" data-hm-auth-close></div>
			<div class="hm-auth-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="hm-quick-title" aria-describedby="hm-quick-product">
				<button type="button" class="hm-auth-modal__close" data-hm-auth-close aria-label="<?php esc_attr_e( 'Close', 'hamista-core' ); ?>"><?php echo hamista_core_icon( 'close' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static SVG. ?></button>
				<div class="<?php echo esc_attr( $class ); ?>" data-hm-quick>
					<div class="hm-auth__head">
						<span class="hm-auth__mark" aria-hidden="true"><?php echo hamista_core_icon( 'bolt' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static SVG. ?></span>
						<h2 class="hm-auth__title" id="hm-quick-title"><?php esc_html_e( 'Quick buy', 'hamista-core' ); ?></h2>
						<p class="hm-auth__subtitle" id="hm-quick-product" data-hm-quick-product></p>
					</div>
					<form class="hm-auth__step is-active" data-hm-quick-form novalidate>
						<label class="hm-auth__label" for="hm-quick-name"><?php esc_html_e( 'Full name', 'hamista-core' ); ?></label>
						<input class="hm-auth__input" id="hm-quick-name" name="name" type="text" autocomplete="name" maxlength="80" value="<?php echo esc_attr( $name ); ?>" required>
						<label class="hm-auth__label" for="hm-quick-mobile"><?php esc_html_e( 'Mobile number', 'hamista-core' ); ?></label>
						<input class="hm-auth__input hm-auth__input--tel" id="hm-quick-mobile" name="mobile" type="tel" inputmode="numeric" autocomplete="tel" dir="ltr" maxlength="24" placeholder="<?php esc_attr_e( '0912 345 6789', 'hamista-core' ); ?>" value="<?php echo esc_attr( $mobile ); ?>" required>
						<div class="hm-auth__hp" aria-hidden="true"><label><?php esc_html_e( 'Leave this field empty', 'hamista-core' ); ?> <input type="text" name="<?php echo esc_attr( Rest::HONEYPOT ); ?>" value="" tabindex="-1" autocomplete="off"></label></div>
						<?php echo Captcha::field(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped in Captcha::field(). ?>
						<p class="hm-auth__msg" role="alert" data-hm-msg></p>
						<button type="submit" class="hm-btn hm-btn--block hm-auth__submit"><span><?php echo $pay ? esc_html__( 'Order and pay', 'hamista-core' ) : esc_html__( 'Place order', 'hamista-core' ); ?></span><?php echo hamista_core_icon( 'arrow' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static SVG. ?></button>
						<p class="hm-auth__hint"><?php echo $pay ? esc_html__( 'You’ll go straight to the payment page.', 'hamista-core' ) : esc_html__( 'We’ll call you to confirm the order and arrange delivery.', 'hamista-core' ); ?></p>
					</form>
					<div class="hm-auth__done" data-hm-quick-done hidden tabindex="-1">
						<span class="hm-auth__check" aria-hidden="true"><?php echo hamista_core_icon( 'check' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static SVG. ?></span>
						<p class="hm-auth__done-title"><?php esc_html_e( 'Order placed', 'hamista-core' ); ?></p>
						<p class="hm-auth__done-text" role="status" data-hm-quick-message></p>
					</div>
				</div>
			</div>
		</div>
		<?php
	}

	/* ---------------------------------------------------------------------
	 * REST
	 * ------------------------------------------------------------------ */

	/**
	 * POST hamista/v1/shop/quick-buy.
	 */
	public static function register_route() {
		register_rest_route(
			Rest::NS,
			'/shop/quick-buy',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'create' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'product_id' => array(
						'type'     => 'integer',
						'required' => true,
					),
				),
			)
		);
	}

	/**
	 * Create the order:
	 * { product_id, variation_id?, attributes?, quantity?, name, mobile, captcha?, nonce }.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response
	 */
	public static function create( \WP_REST_Request $request ) {
		$guard = Rest::guard( $request );
		if ( $guard ) {
			return $guard;
		}
		$failed = new \WP_Error( 'hamista_quick_failed', __( 'Your order could not be placed. Please try again or add the product to your cart.', 'hamista-core' ), array( 'status' => 400 ) );
		if ( Rest::is_bot( $request ) ) {
			return Rest::error( $failed );
		}

		$name   = Rest::clean_name( $request->get_param( 'name' ) );
		$mobile = OTP::normalize_mobile( $request->get_param( 'mobile' ) );
		if ( '' === $name ) {
			return Rest::error( new \WP_Error( 'hamista_quick_name', __( 'Please enter your name.', 'hamista-core' ), array( 'status' => 400 ) ) );
		}
		if ( '' === $mobile ) {
			return Rest::error( OTP::invalid_mobile() );
		}

		$captcha = Captcha::check_request( $request );
		if ( is_wp_error( $captcha ) ) {
			return Rest::error( $captcha );
		}

		$retry = OTP::throttle( 'quickbuy', 5 );
		if ( $retry ) {
			return Rest::error( new \WP_Error( 'hamista_otp_rate_limited', __( 'Too many requests. Please try again later.', 'hamista-core' ), array( 'status' => 429 ) ) );
		}

		$item = self::item( $request );
		if ( is_wp_error( $item ) ) {
			return Rest::error( $item );
		}

		$order = self::order( $item, $name, $mobile );
		if ( is_wp_error( $order ) ) {
			return Rest::error( $failed );
		}

		$pay = 'pay' === hamista_core_option( 'quick_buy_mode', 'hold' );
		return Rest::ok(
			array(
				'message'  => $pay
					/* translators: %s: order number */
					? sprintf( __( 'Order %s is ready. Taking you to the payment page…', 'hamista-core' ), hamista_core_digits( $order->get_order_number() ) )
					/* translators: %s: order number */
					: sprintf( __( 'Thank you! Your order number is %s. We’ll call you shortly to confirm it.', 'hamista-core' ), hamista_core_digits( $order->get_order_number() ) ),
				'order'    => $order->get_order_number(),
				'redirect' => $pay ? $order->get_checkout_payment_url() : '',
			)
		);
	}

	/**
	 * The product, quantity and variation attributes from the request.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return array|\WP_Error { product: \WC_Product, quantity: int, attributes: array }
	 */
	private static function item( \WP_REST_Request $request ) {
		$unavailable = new \WP_Error( 'hamista_quick_product', __( 'This product can’t be ordered right now.', 'hamista-core' ), array( 'status' => 400 ) );
		$parent      = wc_get_product( (int) $request->get_param( 'product_id' ) );
		if ( ! $parent || 'publish' !== $parent->get_status() || ! $parent->is_type( array( 'simple', 'variable' ) ) ) {
			return $unavailable;
		}

		$product    = $parent;
		$attributes = array();
		if ( $parent->is_type( 'variable' ) ) {
			$variation = wc_get_product( (int) $request->get_param( 'variation_id' ) );
			if ( ! $variation || ! $variation->is_type( 'variation' ) || $variation->get_parent_id() !== $parent->get_id() ) {
				return new \WP_Error( 'hamista_quick_options', __( 'Please choose the product options first.', 'hamista-core' ), array( 'status' => 400 ) );
			}
			$posted = (array) $request->get_param( 'attributes' );
			foreach ( wc_get_product_variation_attributes( $variation->get_id() ) as $key => $value ) {
				// "Any …" attributes take the value the customer picked.
				if ( '' === $value ) {
					$value = isset( $posted[ $key ] ) && is_scalar( $posted[ $key ] ) ? wc_clean( wp_unslash( (string) $posted[ $key ] ) ) : '';
					if ( '' === $value ) {
						return new \WP_Error( 'hamista_quick_options', __( 'Please choose the product options first.', 'hamista-core' ), array( 'status' => 400 ) );
					}
				}
				$attributes[ $key ] = $value;
			}
			$product = $variation;
		}

		$quantity = max( 1, absint( $request->get_param( 'quantity' ) ) );
		$max      = $product->get_max_purchase_quantity();
		if ( ! $product->is_purchasable() || ! $product->is_in_stock() || ( $max > 0 && $quantity > $max ) || ! $product->has_enough_stock( $quantity ) ) {
			return $unavailable;
		}

		return array(
			'product'    => $product,
			'quantity'   => $quantity,
			'attributes' => $attributes,
		);
	}

	/**
	 * Create the order.
	 *
	 * @param array  $item   From item().
	 * @param string $name   Customer name.
	 * @param string $mobile Normalised mobile.
	 * @return \WC_Order|\WP_Error
	 */
	private static function order( array $item, $name, $mobile ) {
		$user_id = get_current_user_id();
		$order   = wc_create_order(
			array(
				'customer_id' => $user_id,
				'created_via' => self::METHOD,
			)
		);
		if ( is_wp_error( $order ) ) {
			return $order;
		}

		try {
			$parts = preg_split( '/\s+/u', $name, 2 );
			$order->add_product( $item['product'], $item['quantity'], array( 'variation' => $item['attributes'] ) );
			$order->set_billing_first_name( $parts[0] );
			$order->set_billing_last_name( isset( $parts[1] ) ? $parts[1] : '' );
			$order->set_billing_phone( $mobile );
			if ( $user_id ) {
				$order->set_billing_email( wp_get_current_user()->user_email );
			}
			$order->set_payment_method( self::METHOD );
			$order->set_payment_method_title( __( 'Quick buy (we call the customer)', 'hamista-core' ) );
			$order->set_customer_ip_address( OTP::client_ip() );
			$order->set_customer_user_agent( wc_get_user_agent() );
			$order->calculate_totals();

			$pay = 'pay' === hamista_core_option( 'quick_buy_mode', 'hold' );
			// On hold sends the "new order" email and reserves the stock; pending waits for payment.
			$order->update_status( $pay ? 'pending' : 'on-hold', __( 'Quick buy order. Call the customer to confirm it.', 'hamista-core' ) );
		} catch ( \Exception $e ) {
			$order->delete( true );
			return new \WP_Error( 'hamista_quick_failed', $e->getMessage() );
		}

		/**
		 * Fires after a quick buy order was created.
		 *
		 * @param \WC_Order $order Order.
		 */
		do_action( 'hamista_core/quick_buy_order', $order );

		return $order;
	}
}
