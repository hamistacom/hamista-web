<?php
/**
 * Back-in-stock alerts for WooCommerce.
 *
 * Out-of-stock simple products and variations get a small "Notify me" form
 * under the stock line. Subscribers are kept in product meta and get an SMS
 * and/or an email when the product is back, after which the list is cleared.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Shop;

use Hamista\Core\Auth\Account;
use Hamista\Core\Auth\OTP;
use Hamista\Core\Auth\Rest;

defined( 'ABSPATH' ) || exit;

/**
 * Stock_Notify.
 */
class Stock_Notify {

	/** Subscribers: list of { m: mobile, e: email, t: time }. */
	const META = '_hamista_stock_notify';

	/** Cron hook that sends the alerts. */
	const CRON = 'hamista_core_stock_notify';

	/** Subscribers kept per product. */
	const MAX = 2000;

	/**
	 * Hooks.
	 */
	public static function init() {
		if ( ! class_exists( 'WooCommerce' ) || ! hamista_core_option( 'stock_notify', false ) ) {
			return;
		}
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue' ), 20 );
		add_filter( 'woocommerce_get_stock_html', array( __CLASS__, 'stock_html' ), 20, 2 );
		add_filter( 'hamista_core/auth_script_data', array( __CLASS__, 'script_data' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'register_route' ) );
		add_action( 'woocommerce_product_set_stock_status', array( __CLASS__, 'stock_changed' ), 10, 2 );
		add_action( 'woocommerce_variation_set_stock_status', array( __CLASS__, 'stock_changed' ), 10, 2 );
		add_action( self::CRON, array( __CLASS__, 'send' ) );

		if ( is_admin() ) {
			add_filter( 'manage_edit-product_columns', array( __CLASS__, 'admin_column' ), 20 );
			add_action( 'manage_product_posts_custom_column', array( __CLASS__, 'admin_column_value' ), 10, 2 );
		}
	}

	/**
	 * Which contact fields the form asks for: mobile | email | both.
	 *
	 * @return string
	 */
	private static function via() {
		$via = (string) hamista_core_option( 'stock_notify_via', 'mobile' );
		return in_array( $via, array( 'mobile', 'email', 'both' ), true ) ? $via : 'mobile';
	}

	/**
	 * Strings for auth.js.
	 *
	 * @param array $data Script data.
	 * @return array
	 */
	public static function script_data( $data ) {
		$data['i18n'] += array(
			'notifyContact' => __( 'Enter your mobile number or email.', 'hamista-core' ),
			'invalidEmail'  => __( 'Please enter a valid email address.', 'hamista-core' ),
		);
		return $data;
	}

	/* ---------------------------------------------------------------------
	 * Front end
	 * ------------------------------------------------------------------ */

	/**
	 * Load the assets in <head> on product pages that may show the form.
	 */
	public static function enqueue() {
		if ( ! function_exists( 'is_product' ) || ! is_product() ) {
			return;
		}
		$product = wc_get_product( get_queried_object_id() );
		if ( $product && ( $product->is_type( 'variable' ) || ! $product->is_in_stock() ) ) {
			Account::enqueue();
		}
	}

	/**
	 * Add the form under "Out of stock" (also inside the variation data that
	 * WooCommerce swaps in when a variation is picked).
	 *
	 * @param string      $html    Stock HTML.
	 * @param \WC_Product $product Product.
	 * @return string
	 */
	public static function stock_html( $html, $product ) {
		if ( ! $product instanceof \WC_Product || $product->is_in_stock() || ! $product->is_type( array( 'simple', 'variation' ) ) ) {
			return $html;
		}
		if ( is_admin() && ! wp_doing_ajax() ) {
			return $html;
		}
		Account::enqueue();
		return $html . self::form( $product );
	}

	/**
	 * The form. A <div>, not a <form>: inside a variable product it lands in
	 * the add-to-cart form, and forms cannot nest.
	 *
	 * @param \WC_Product $product Product.
	 * @return string
	 */
	private static function form( $product ) {
		$id     = wp_unique_id( 'hm-notify-' );
		$via    = self::via();
		$mobile = '';
		$email  = '';
		if ( is_user_logged_in() ) {
			$user   = wp_get_current_user();
			$mobile = (string) get_user_meta( $user->ID, Account::META, true );
			$mobile = '' !== $mobile ? $mobile : OTP::normalize_mobile( get_user_meta( $user->ID, 'billing_phone', true ) );
			$email  = (string) $user->user_email;
		}

		$fields = '';
		if ( 'email' !== $via ) {
			$fields .= sprintf(
				'<label class="hm-notify__label" for="%1$s-mobile">%2$s</label><input class="input-text hm-notify__input" id="%1$s-mobile" type="tel" inputmode="numeric" autocomplete="tel" dir="ltr" maxlength="24" placeholder="%3$s" value="%4$s" data-hm-notify-mobile>',
				esc_attr( $id ),
				esc_html__( 'Mobile number', 'hamista-core' ),
				esc_attr__( '0912 345 6789', 'hamista-core' ),
				esc_attr( $mobile )
			);
		}
		if ( 'mobile' !== $via ) {
			$fields .= sprintf(
				'<label class="hm-notify__label" for="%1$s-email">%2$s</label><input class="input-text hm-notify__input" id="%1$s-email" type="email" autocomplete="email" dir="ltr" maxlength="100" placeholder="%3$s" value="%4$s" data-hm-notify-email>',
				esc_attr( $id ),
				esc_html__( 'Email', 'hamista-core' ),
				esc_attr__( 'name@example.com', 'hamista-core' ),
				esc_attr( $email )
			);
		}

		return sprintf(
			'<div class="hm-notify" role="group" aria-labelledby="%1$s-title" data-hm-notify="%2$d"><p class="hm-notify__title" id="%1$s-title">%3$s</p><div class="hm-notify__row">%4$s<button type="button" class="button hm-notify__submit" data-hm-notify-submit>%5$s</button></div><p class="hm-notify__msg" role="status" aria-live="polite" data-hm-msg></p></div>',
			esc_attr( $id ),
			(int) $product->get_id(),
			esc_html__( 'Let me know when it’s back in stock', 'hamista-core' ),
			$fields, // Escaped above.
			esc_html__( 'Notify me', 'hamista-core' )
		);
	}

	/* ---------------------------------------------------------------------
	 * REST
	 * ------------------------------------------------------------------ */

	/**
	 * POST hamista/v1/shop/notify { product_id, mobile?, email?, nonce }.
	 */
	public static function register_route() {
		register_rest_route(
			Rest::NS,
			'/shop/notify',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'subscribe' ),
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
	 * Add a subscriber.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response
	 */
	public static function subscribe( \WP_REST_Request $request ) {
		$guard = Rest::guard( $request );
		if ( $guard ) {
			return $guard;
		}

		$retry = OTP::throttle( 'notify', 8 );
		if ( $retry ) {
			return Rest::error( new \WP_Error( 'hamista_otp_rate_limited', __( 'Too many requests. Please try again later.', 'hamista-core' ), array( 'status' => 429 ) ) );
		}

		$product = wc_get_product( (int) $request->get_param( 'product_id' ) );
		if ( ! $product || ! $product->is_type( array( 'simple', 'variation' ) ) || 'publish' !== get_post_status( $product->get_parent_id() ? $product->get_parent_id() : $product->get_id() ) ) {
			return Rest::error( new \WP_Error( 'hamista_notify_product', __( 'This product is not available.', 'hamista-core' ), array( 'status' => 404 ) ) );
		}
		if ( $product->is_in_stock() ) {
			return Rest::error( new \WP_Error( 'hamista_notify_in_stock', __( 'Good news: this product is already in stock.', 'hamista-core' ), array( 'status' => 400 ) ) );
		}

		$via       = self::via();
		$raw_phone = trim( (string) $request->get_param( 'mobile' ) );
		$raw_email = trim( (string) $request->get_param( 'email' ) );
		$mobile    = 'email' !== $via ? OTP::normalize_mobile( $raw_phone ) : '';
		$email     = 'mobile' !== $via ? sanitize_email( $raw_email ) : '';

		if ( 'email' !== $via && ( '' !== $raw_phone || 'mobile' === $via ) && '' === $mobile ) {
			return Rest::error( OTP::invalid_mobile() );
		}
		if ( 'mobile' !== $via && ( '' !== $raw_email || 'email' === $via ) && ! is_email( $email ) ) {
			return Rest::error( new \WP_Error( 'hamista_bad_email', __( 'Please enter a valid email address.', 'hamista-core' ), array( 'status' => 400 ) ) );
		}
		if ( '' === $mobile && '' === $email ) {
			return Rest::error( new \WP_Error( 'hamista_notify_contact', __( 'Enter your mobile number or email.', 'hamista-core' ), array( 'status' => 400 ) ) );
		}

		$list = self::subscribers( $product->get_id() );
		foreach ( $list as $row ) {
			if ( ( '' !== $mobile && $row['m'] === $mobile ) || ( '' !== $email && 0 === strcasecmp( $row['e'], $email ) ) ) {
				return Rest::ok( array( 'message' => __( 'You’re already on the list. We’ll let you know as soon as it’s back.', 'hamista-core' ) ) );
			}
		}
		if ( count( $list ) < self::MAX ) {
			$list[] = array(
				'm' => $mobile,
				'e' => $email,
				't' => time(),
			);
			update_post_meta( $product->get_id(), self::META, $list );
		}

		return Rest::ok( array( 'message' => __( 'Done! We’ll let you know as soon as it’s back in stock.', 'hamista-core' ) ) );
	}

	/* ---------------------------------------------------------------------
	 * Sending
	 * ------------------------------------------------------------------ */

	/**
	 * Subscribers of a product or variation.
	 *
	 * @param int $product_id Product ID.
	 * @return array
	 */
	private static function subscribers( $product_id ) {
		$list = get_post_meta( $product_id, self::META, true );
		return is_array( $list ) ? array_values( $list ) : array();
	}

	/**
	 * Back in stock: send the alerts in the background.
	 *
	 * @param int    $product_id Product or variation ID.
	 * @param string $status     New stock status.
	 */
	public static function stock_changed( $product_id, $status ) {
		$args = array( (int) $product_id );
		if ( 'instock' === $status && self::subscribers( $product_id ) && ! wp_next_scheduled( self::CRON, $args ) ) {
			wp_schedule_single_event( time(), self::CRON, $args );
		}
	}

	/**
	 * Send the alerts for one product and clear its list.
	 *
	 * @param int $product_id Product or variation ID.
	 */
	public static function send( $product_id ) {
		$product = wc_get_product( $product_id );
		$list    = self::subscribers( $product_id );
		if ( ! $product || ! $product->is_in_stock() || ! $list ) {
			return;
		}
		delete_post_meta( $product_id, self::META );

		$name     = wp_strip_all_tags( $product->get_name() );
		$site     = wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES );
		$template = trim( (string) hamista_core_option( 'stock_notify_message', '' ) );
		$template = '' !== $template ? $template : __( '{product} is back in stock at {site}. Order now: {link}', 'hamista-core' );
		$text     = strtr(
			wp_strip_all_tags( $template ),
			array(
				'{product}' => $name,
				'{link}'    => $product->get_permalink(),
				'{site}'    => $site,
			)
		);
		/* translators: 1: product name, 2: site name */
		$subject = sprintf( __( '%1$s is back in stock at %2$s', 'hamista-core' ), $name, $site );

		$gateway = OTP::gateway();
		$sms     = ! is_wp_error( $gateway ) && method_exists( $gateway, 'send_text' );

		foreach ( $list as $row ) {
			if ( $sms && ! empty( $row['m'] ) ) {
				$gateway->send_text( $row['m'], $text );
			}
			if ( ! empty( $row['e'] ) ) {
				wp_mail( $row['e'], $subject, $text );
			}
		}

		/**
		 * Fires after back-in-stock alerts were sent.
		 *
		 * @param \WC_Product $product Product or variation.
		 * @param array       $list    Subscribers { m, e, t }.
		 */
		do_action( 'hamista_core/stock_notify_sent', $product, $list );
	}

	/* ---------------------------------------------------------------------
	 * Admin
	 * ------------------------------------------------------------------ */

	/**
	 * "Waiting" column in Products.
	 *
	 * @param array $columns Columns.
	 * @return array
	 */
	public static function admin_column( $columns ) {
		$out = array();
		foreach ( $columns as $key => $label ) {
			$out[ $key ] = $label;
			if ( 'is_in_stock' === $key ) {
				$out['hm_notify'] = esc_html__( 'Waiting', 'hamista-core' );
			}
		}
		if ( ! isset( $out['hm_notify'] ) ) {
			$out['hm_notify'] = esc_html__( 'Waiting', 'hamista-core' );
		}
		return $out;
	}

	/**
	 * Subscriber count (product plus its variations).
	 *
	 * @param string $column  Column.
	 * @param int    $post_id Product ID.
	 */
	public static function admin_column_value( $column, $post_id ) {
		if ( 'hm_notify' !== $column ) {
			return;
		}
		$count   = count( self::subscribers( $post_id ) );
		$product = wc_get_product( $post_id );
		if ( $product && $product->is_type( 'variable' ) ) {
			foreach ( $product->get_children() as $child ) {
				$count += count( self::subscribers( $child ) );
			}
		}
		if ( ! $count ) {
			echo '<span aria-hidden="true">–</span>';
			return;
		}
		printf(
			'<span title="%1$s">%2$s</span>',
			/* translators: %s: number of people */
			esc_attr( sprintf( _n( '%s person is waiting for this product', '%s people are waiting for this product', $count, 'hamista-core' ), hamista_core_num( $count ) ) ),
			esc_html( hamista_core_num( $count ) )
		);
	}
}
