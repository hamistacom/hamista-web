<?php
/**
 * "My appointments": a tab in WooCommerce My Account, a block in the Hamista
 * account panel, and the [hamista_appointments] / [hamista_booking] shortcodes.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Booking;

defined( 'ABSPATH' ) || exit;

/**
 * Account tab.
 */
class Account_Tab {

	const ENDPOINT = 'appointments';

	/**
	 * Hooks.
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'shortcodes' ) );
		add_action( 'hamista_core/account_panel_end', array( __CLASS__, 'panel_block' ) );
		if ( ! class_exists( 'WooCommerce' ) ) {
			return;
		}
		add_filter( 'woocommerce_get_query_vars', array( __CLASS__, 'query_vars' ) );
		add_filter( 'woocommerce_account_menu_items', array( __CLASS__, 'menu_item' ), 20 );
		add_filter( 'woocommerce_endpoint_' . self::ENDPOINT . '_title', array( __CLASS__, 'title' ) );
		add_action( 'woocommerce_account_' . self::ENDPOINT . '_endpoint', array( __CLASS__, 'content' ) );
		add_filter( 'hamista/account_cards', array( __CLASS__, 'dashboard_card' ), 10, 2 );
	}

	/**
	 * Shortcodes.
	 */
	public static function shortcodes() {
		add_shortcode( 'hamista_appointments', array( __CLASS__, 'shortcode_appointments' ) );
		add_shortcode( 'hamista_booking', array( __CLASS__, 'shortcode_booking' ) );
	}

	/**
	 * Tab label.
	 *
	 * @return string
	 */
	public static function label() {
		return Booking::word( 'mine' );
	}

	/**
	 * Register the endpoint with WooCommerce (it adds the rewrite rule itself).
	 *
	 * @param array $vars Query vars.
	 * @return array
	 */
	public static function query_vars( $vars ) {
		$vars[ self::ENDPOINT ] = self::ENDPOINT;
		return $vars;
	}

	/**
	 * Menu item after "Orders" (or after "Dashboard" on sites without orders).
	 *
	 * @param array $items Items.
	 * @return array
	 */
	public static function menu_item( $items ) {
		$after = isset( $items['orders'] ) ? 'orders' : 'dashboard';
		$out   = array();
		foreach ( $items as $key => $label ) {
			$out[ $key ] = $label;
			if ( $key === $after ) {
				$out[ self::ENDPOINT ] = self::label();
			}
		}
		if ( ! isset( $out[ self::ENDPOINT ] ) ) {
			$out = array( self::ENDPOINT => self::label() ) + $out;
		}
		return $out;
	}

	/**
	 * Page title on the endpoint.
	 *
	 * @return string
	 */
	public static function title() {
		return self::label();
	}

	/**
	 * Endpoint content.
	 */
	public static function content() {
		echo View::appointments(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in View.
	}

	/**
	 * "Next appointment" card on the theme's account dashboard.
	 *
	 * @param array $cards   Cards.
	 * @param int   $user_id User.
	 * @return array
	 */
	public static function dashboard_card( $cards, $user_id ) {
		if ( get_current_user_id() !== (int) $user_id ) {
			return $cards;
		}
		$next = null;
		foreach ( array_reverse( View::user_appointments() ) as $item ) {
			if ( $item['upcoming'] ) {
				$next = $item;
				break;
			}
		}
		$card = array(
			'icon'  => 'calendar',
			'label' => Booking::word( 'next' ),
			'value' => $next ? Booking::date_label( $next['date'], 'j F' ) . ' · ' . Booking::time_label( $next['time'] ) : __( 'None booked', 'hamista-core' ),
			'url'   => wc_get_account_endpoint_url( self::ENDPOINT ),
		);
		return array_slice( $cards, 0, 1, true ) + array( 'appointment' => $card ) + $cards;
	}

	/**
	 * Block under the Hamista account panel on sites without WooCommerce.
	 *
	 * @param array $args Panel arguments.
	 */
	public static function panel_block( $args ) {
		if ( ! empty( $args['woocommerce'] ) ) {
			return;
		}
		echo '<div class="hm-auth__section"><h3 class="hm-auth__section-title">' . esc_html( self::label() ) . '</h3>' . View::appointments() . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in View.
	}

	/**
	 * [hamista_appointments].
	 *
	 * @return string
	 */
	public static function shortcode_appointments() {
		if ( ! is_user_logged_in() ) {
			return '<p class="hm-appts__guest">' . esc_html( Booking::word( 'login_see' ) ) . '</p>';
		}
		return View::appointments();
	}

	/**
	 * [hamista_booking expert="" service="" title="" note="yes"] (service: comma-separated IDs).
	 *
	 * @param array|string $atts Attributes.
	 * @return string
	 */
	public static function shortcode_booking( $atts ) {
		$atts = shortcode_atts(
			array(
				'expert'  => 0,
				'service' => '',
				'title'   => '',
				'note'    => 'yes',
			),
			$atts,
			'hamista_booking'
		);
		return View::booking(
			array(
				'expert' => absint( $atts['expert'] ),
				'groups' => array_filter( array_map( 'absint', explode( ',', (string) $atts['service'] ) ) ),
				'title'  => sanitize_text_field( $atts['title'] ),
				'note'   => 'no' !== $atts['note'],
			)
		);
	}
}
