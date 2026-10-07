<?php
/**
 * Header actions for Elementor-built headers: search, sound, dark mode,
 * account, cart with count, a call-to-action button and the mobile menu button,
 * in any order. Behaviour comes from the theme (drawer, search overlay, cart
 * count updates), so a custom header works exactly like the built-in one.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Header actions widget.
 */
class Header_Actions extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-header-actions';
	}

	/** @return string */
	public function get_title() {
		return __( 'Header Actions', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-header';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'header', 'cart', 'search', 'account', 'login', 'menu', 'dark mode' );
	}

	/** @return bool */
	protected function is_dynamic_content(): bool {
		return true;
	}

	/**
	 * Available actions.
	 *
	 * @return array
	 */
	private static function actions() {
		return array(
			'search'  => __( 'Search', 'hamista-core' ),
			'sound'   => __( 'Sound on/off', 'hamista-core' ),
			'theme'   => __( 'Light/dark switch', 'hamista-core' ),
			'account' => __( 'Account', 'hamista-core' ),
			'cart'    => __( 'Cart', 'hamista-core' ),
			'cta'     => __( 'Button', 'hamista-core' ),
			'menu'    => __( 'Menu button (tablets and phones)', 'hamista-core' ),
		);
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_actions', array( 'label' => __( 'Actions', 'hamista-core' ) ) );
		$this->add_control(
			'items',
			array(
				'label'       => __( 'Show, in this order', 'hamista-core' ),
				'type'        => Controls_Manager::SELECT2,
				'multiple'    => true,
				'label_block' => true,
				'options'     => self::actions(),
				'default'     => array( 'search', 'theme', 'account', 'cart', 'cta', 'menu' ),
			)
		);
		$this->add_control(
			'cta_text',
			array(
				'label'     => __( 'Button text', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Get in touch', 'hamista-core' ),
				'separator' => 'before',
			)
		);
		$this->add_control(
			'cta_link',
			array(
				'label' => __( 'Button link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$this->add_control(
			'cart_style',
			array(
				'label'   => __( 'Cart', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'icon',
				'options' => array(
					'icon'  => __( 'Icon with count', 'hamista-core' ),
					'total' => __( 'Icon with total', 'hamista-core' ),
				),
			)
		);
		$this->add_responsive_control(
			'align',
			array(
				'label'     => __( 'Alignment', 'hamista-core' ),
				'type'      => Controls_Manager::CHOOSE,
				'options'   => array(
					'flex-start' => array(
						'title' => __( 'Start', 'hamista-core' ),
						'icon'  => 'eicon-h-align-right',
					),
					'center'     => array(
						'title' => __( 'Center', 'hamista-core' ),
						'icon'  => 'eicon-h-align-center',
					),
					'flex-end'   => array(
						'title' => __( 'End', 'hamista-core' ),
						'icon'  => 'eicon-h-align-left',
					),
				),
				'selectors' => array( '{{WRAPPER}} .hm-header__actions' => 'justify-content: {{VALUE}};' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s   = $this->get_settings_for_display();
		$woo = class_exists( 'WooCommerce' ) && function_exists( 'wc_get_cart_url' );
		$out = '';
		foreach ( (array) $s['items'] as $item ) {
			switch ( $item ) {
				case 'search':
					$out .= '<button class="hm-icon-btn" type="button" data-hm-open="search" aria-label="' . esc_attr__( 'Search', 'hamista-core' ) . '" aria-controls="hm-search" aria-expanded="false">' . hamista_core_icon( 'search' ) . '</button>';
					break;
				case 'sound':
					$out .= '<button class="hm-icon-btn hm-sound-toggle" type="button" data-hm-sound-toggle aria-label="' . esc_attr__( 'Interface sounds', 'hamista-core' ) . '" aria-pressed="false">' . hamista_core_icon( 'mute' ) . hamista_core_icon( 'sound' ) . '</button>';
					break;
				case 'theme':
					$out .= '<button class="hm-icon-btn hm-theme-toggle" type="button" data-hm-theme-toggle aria-label="' . esc_attr__( 'Toggle dark mode', 'hamista-core' ) . '" aria-pressed="false">' . hamista_core_icon( 'sun' ) . hamista_core_icon( 'moon' ) . '</button>';
					break;
				case 'account':
					$url  = apply_filters( 'hamista/account_url', $woo ? wc_get_page_permalink( 'myaccount' ) : wp_login_url() );
					$out .= '<a class="hm-icon-btn" href="' . esc_url( $url ) . '" data-hm-account aria-label="' . ( is_user_logged_in() ? esc_attr__( 'My account', 'hamista-core' ) : esc_attr__( 'Log in', 'hamista-core' ) ) . '">' . hamista_core_icon( 'user' ) . '</a>';
					break;
				case 'cart':
					if ( $woo ) {
						$count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
						$total = ( 'total' === $s['cart_style'] && WC()->cart ) ? '<span class="hm-header-cart__total">' . wp_kses_post( WC()->cart->get_cart_subtotal() ) . '</span>' : '';
						$out  .= '<a class="hm-icon-btn hm-header-cart' . ( $total ? ' hm-header-cart--total' : '' ) . '" href="' . esc_url( wc_get_cart_url() ) . '" aria-label="' . esc_attr__( 'Cart', 'hamista-core' ) . '">' . hamista_core_icon( 'bag' ) . '<span class="hm-icon-btn__badge hm-num" data-count="' . (int) $count . '">' . esc_html( hamista_core_num( $count ) ) . '</span>' . $total . '</a>';
					}
					break;
				case 'cta':
					if ( ! empty( $s['cta_text'] ) && ! empty( $s['cta_link']['url'] ) ) {
						$out .= '<a class="hm-btn hm-btn--sm hm-header__cta" href="' . esc_url( $s['cta_link']['url'] ) . '">' . esc_html( $s['cta_text'] ) . hamista_core_icon( 'arrow' ) . '</a>';
					}
					break;
				case 'menu':
					$out .= '<button class="hm-icon-btn hm-menu-toggle" type="button" data-hm-open="drawer" aria-label="' . esc_attr__( 'Open menu', 'hamista-core' ) . '" aria-controls="hm-drawer" aria-expanded="false">' . hamista_core_icon( 'menu' ) . '</button>';
					break;
			}
		}
		echo '<div class="hm-header__actions">' . $out . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above.
	}
}
