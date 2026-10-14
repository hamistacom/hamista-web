<?php
/**
 * WooCommerce SMS notifications: order status updates to the customer, new
 * orders and stock alerts to the shop's admin numbers. Every message is off
 * until switched on in Hamista → Login & SMS, and goes out through the
 * selected SMS provider's text line.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth;

defined( 'ABSPATH' ) || exit;

/**
 * Shop_Sms.
 */
class Shop_Sms {

	/** Order statuses that can text the customer. */
	const STATUSES = array( 'processing', 'completed', 'on-hold', 'cancelled' );

	/** Order meta set once the admin was told about an order. */
	const ADMIN_SENT = '_hamista_sms_admin';

	/**
	 * Wire hooks.
	 */
	public static function init() {
		add_action( 'woocommerce_order_status_changed', array( __CLASS__, 'status_changed' ), 10, 4 );
		add_action( 'woocommerce_low_stock', array( __CLASS__, 'low_stock' ) );
		add_action( 'woocommerce_no_stock', array( __CLASS__, 'no_stock' ) );
		add_action( 'hamista_core_send_sms', array( __CLASS__, 'deliver' ), 10, 3 );
	}

	/**
	 * Default message for a template setting.
	 *
	 * @param string $key Setting key.
	 * @return string
	 */
	public static function default_text( $key ) {
		$texts = array(
			'sms_processing_text' => __( "Hi {name}, we received order {order} ({total}) and are getting it ready.\n{site}", 'hamista-core' ),
			'sms_completed_text'  => __( "Hi {name}, order {order} is complete. Thank you for shopping with us.\n{site}", 'hamista-core' ),
			'sms_on_hold_text'    => __( "Hi {name}, order {order} is on hold until we confirm your payment.\n{site}", 'hamista-core' ),
			'sms_cancelled_text'  => __( "Hi {name}, order {order} was cancelled. Contact us if you have any questions.\n{site}", 'hamista-core' ),
			'sms_new_order_text'  => __( "New order {order} from {name}: {total} ({status})\n{site}", 'hamista-core' ),
			'sms_low_stock_text'  => __( "Low stock: {product}, {stock} left.\n{site}", 'hamista-core' ),
			'sms_no_stock_text'   => __( "Out of stock: {product}\n{site}", 'hamista-core' ),
		);
		return isset( $texts[ $key ] ) ? $texts[ $key ] : '';
	}

	/**
	 * Customer and admin messages on a status change.
	 *
	 * @param int            $order_id Order ID.
	 * @param string         $from     Old status.
	 * @param string         $to       New status.
	 * @param \WC_Order|null $order    Order.
	 */
	public static function status_changed( $order_id, $from, $to, $order = null ) {
		if ( ! $order instanceof \WC_Order ) {
			$order = wc_get_order( $order_id );
		}
		if ( ! $order instanceof \WC_Order ) {
			return;
		}
		$vars = self::order_vars( $order, $to );

		$key = 'sms_' . str_replace( '-', '_', $to );
		if ( in_array( $to, self::STATUSES, true ) && hamista_core_option( $key, false ) ) {
			$mobile = self::customer_mobile( $order );
			if ( '' !== $mobile ) {
				self::queue( $mobile, Sms::render( self::text( $key . '_text' ), $vars ), 'order' );
			}
		}

		// Same moments WooCommerce sends its "New order" e-mail, once per order.
		$placed = in_array( $from, array( 'pending', 'failed', 'cancelled', 'checkout-draft' ), true ) && in_array( $to, array( 'processing', 'on-hold', 'completed' ), true );
		if ( $placed && hamista_core_option( 'sms_new_order', false ) && ! $order->get_meta( self::ADMIN_SENT ) ) {
			$order->update_meta_data( self::ADMIN_SENT, time() );
			$order->save_meta_data();
			self::to_admins( Sms::render( self::text( 'sms_new_order_text' ), $vars ), 'admin' );
		}
	}

	/**
	 * Low-stock alert.
	 *
	 * @param \WC_Product $product Product.
	 */
	public static function low_stock( $product ) {
		self::stock_alert( $product, 'sms_low_stock_text' );
	}

	/**
	 * Out-of-stock alert.
	 *
	 * @param \WC_Product $product Product.
	 */
	public static function no_stock( $product ) {
		self::stock_alert( $product, 'sms_no_stock_text' );
	}

	/**
	 * Send a stock alert to the admin numbers.
	 *
	 * @param \WC_Product $product Product.
	 * @param string      $key     Template setting key.
	 */
	private static function stock_alert( $product, $key ) {
		if ( ! $product instanceof \WC_Product || ! hamista_core_option( 'sms_admin_stock', false ) ) {
			return;
		}
		$text = Sms::render(
			self::text( $key ),
			array(
				'{product}' => $product->get_formatted_name(),
				'{stock}'   => wc_stock_amount( $product->get_stock_quantity() ),
			)
		);
		self::to_admins( $text, 'stock' );
	}

	/**
	 * Text every admin number.
	 *
	 * @param string $text Message.
	 * @param string $type Log type.
	 */
	private static function to_admins( $text, $type ) {
		foreach ( self::admin_mobiles() as $mobile ) {
			self::queue( $mobile, $text, $type );
		}
	}

	/**
	 * Send in the background when Action Scheduler (bundled with WooCommerce)
	 * is available, so a slow provider never holds up checkout.
	 *
	 * @param string $mobile Mobile.
	 * @param string $text   Message.
	 * @param string $type   Log type.
	 */
	private static function queue( $mobile, $text, $type ) {
		if ( function_exists( 'as_enqueue_async_action' ) ) {
			as_enqueue_async_action( 'hamista_core_send_sms', array( $mobile, $text, $type ), 'hamista' );
			return;
		}
		Sms::send( $mobile, $text, $type );
	}

	/**
	 * Background job: send one queued message.
	 *
	 * @param string $mobile Mobile.
	 * @param string $text   Message.
	 * @param string $type   Log type.
	 */
	public static function deliver( $mobile, $text, $type ) {
		Sms::send( $mobile, $text, $type );
	}

	/**
	 * Valid numbers from the `sms_admin_mobiles` setting (comma, space or line separated).
	 *
	 * @return string[]
	 */
	public static function admin_mobiles() {
		$raw     = hamista_core_latin_digits( (string) hamista_core_option( 'sms_admin_mobiles', '' ) );
		$mobiles = array_map( array( OTP::class, 'normalize_mobile' ), (array) preg_split( '/[\s,،;]+/u', $raw ) );
		return array_values( array_unique( array_filter( $mobiles ) ) );
	}

	/**
	 * The customer's mobile: the billing phone, else the number they log in with.
	 *
	 * @param \WC_Order $order Order.
	 * @return string Normalised mobile or ''.
	 */
	private static function customer_mobile( $order ) {
		$mobile = OTP::normalize_mobile( $order->get_billing_phone() );
		if ( '' === $mobile && $order->get_customer_id() ) {
			$mobile = OTP::normalize_mobile( get_user_meta( $order->get_customer_id(), Account::META, true ) );
		}
		return $mobile;
	}

	/**
	 * Placeholders for order messages.
	 *
	 * @param \WC_Order $order  Order.
	 * @param string    $status New status.
	 * @return array
	 */
	private static function order_vars( $order, $status ) {
		$name = $order->get_billing_first_name();
		if ( '' === trim( $name ) ) {
			$name = $order->get_formatted_billing_full_name();
		}
		return array(
			'{name}'   => '' !== trim( $name ) ? $name : __( 'dear customer', 'hamista-core' ),
			'{order}'  => $order->get_order_number(),
			'{total}'  => wc_price( $order->get_total(), array( 'currency' => $order->get_currency() ) ),
			'{status}' => wc_get_order_status_name( $status ),
		);
	}

	/**
	 * A template setting, or its default when left empty.
	 *
	 * @param string $key Setting key.
	 * @return string
	 */
	private static function text( $key ) {
		$text = (string) hamista_core_option( $key, '' );
		return '' !== trim( $text ) ? $text : self::default_text( $key );
	}
}
