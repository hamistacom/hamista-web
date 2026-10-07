<?php
/**
 * Deal of the day: sale products with a live countdown and a stock-left bar.
 * Three layouts: one spotlight product, a heading panel beside a carousel,
 * or a coloured band above a carousel.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Carousel;
use Hamista\Core\Elementor\Widget_Base;
use Hamista\Core\Shop\Product_Card;
use Hamista\Core\Shop\Product_Query;

defined( 'ABSPATH' ) || exit;

/**
 * Product deal widget.
 */
class Product_Deal extends Widget_Base {

	use Carousel;

	/** @return string */
	public function get_name() {
		return 'hm-product-deal';
	}

	/** @return string */
	public function get_title() {
		return __( 'Deal of the Day', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-countdown';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'deal', 'offer', 'sale', 'countdown', 'amazing', 'woocommerce' );
	}

	/** @return array */
	public function get_script_depends() {
		return array( 'hamista-motion', 'wc-add-to-cart' );
	}

	/** @return bool */
	protected function is_dynamic_content(): bool {
		return true;
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_header', array( 'label' => __( 'Heading', 'hamista-core' ) ) );
		$this->add_control(
			'layout_type',
			array(
				'label'   => __( 'Layout', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'panel',
				'options' => array(
					'panel'     => __( 'Heading panel beside products', 'hamista-core' ),
					'band'      => __( 'Coloured band above products', 'hamista-core' ),
					'spotlight' => __( 'One product in the spotlight', 'hamista-core' ),
				),
			)
		);
		$this->add_header_controls(
			array(
				'eyebrow' => __( 'Today only', 'hamista-core' ),
				'title'   => __( 'Deals that end *tonight*', 'hamista-core' ),
				'size'    => 'md',
			),
			false
		);
		$this->add_control(
			'ends',
			array(
				'label'   => __( 'Countdown ends', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'midnight',
				'options' => array(
					'midnight' => __( 'At midnight, every day', 'hamista-core' ),
					'date'     => __( 'On a fixed date', 'hamista-core' ),
					'sale'     => __( 'When the product\'s sale ends', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'end_date',
			array(
				'label'     => __( 'End date', 'hamista-core' ),
				'type'      => Controls_Manager::DATE_TIME,
				'condition' => array( 'ends' => 'date' ),
			)
		);
		$this->add_view_all_controls();
		$this->end_controls_section();

		$this->start_controls_section( 'section_query', array( 'label' => __( 'Products', 'hamista-core' ) ) );
		Product_Query::controls(
			$this,
			array(
				'source' => 'sale',
				'count'  => 8,
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_card', array( 'label' => __( 'Card', 'hamista-core' ) ) );
		Product_Card::controls(
			$this,
			array(
				'style' => 'framed',
				'parts' => array( 'badges', 'hover', 'cart', 'stock' ),
			)
		);
		$this->end_controls_section();

		$this->add_carousel_controls(
			array(
				'per_view'        => 3.2,
				'per_view_tablet' => 2.3,
				'per_view_mobile' => 1.2,
				'columns'         => '3',
			)
		);
		$this->add_section_controls();
	}

	/**
	 * End of the countdown (Unix time).
	 *
	 * @param array $s Settings.
	 * @return int
	 */
	private function end_time( $s ) {
		if ( 'date' === $s['ends'] && ! empty( $s['end_date'] ) ) {
			$date = date_create( $s['end_date'], wp_timezone() );
			return $date ? $date->getTimestamp() : 0;
		}
		if ( 'midnight' === $s['ends'] ) {
			$now = new \DateTimeImmutable( 'now', wp_timezone() );
			return $now->setTime( 0, 0 )->modify( '+1 day' )->getTimestamp();
		}
		return 0;
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s = $this->get_settings_for_display();
		if ( ! class_exists( 'WooCommerce' ) ) {
			return;
		}
		$products = Product_Query::get( $s );
		if ( ! $products ) {
			if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
				echo '<div class="hm-empty">' . esc_html__( 'No products match these settings yet. Put a product on sale or choose another source.', 'hamista-core' ) . '</div>';
			}
			return;
		}
		$layout  = in_array( $s['layout_type'], array( 'panel', 'band', 'spotlight' ), true ) ? $s['layout_type'] : 'panel';
		$until   = $this->end_time( $s );
		$options = Product_Card::options( $s );
		$timer   = Product_Card::countdown( $products[0], 'sale' === $s['ends'] ? 0 : $until );

		echo '<section class="' . esc_attr( $this->section_class( $s, 'hm-deal' ) . ' hm-deal--' . $layout ) . '"><div class="' . esc_attr( $this->inner_class( $s ) ) . '">';

		if ( 'spotlight' === $layout ) {
			$product = $products[0];
			$percent = Product_Card::discount( $product );
			echo '<div class="hm-deal__spot">';
			echo '<a class="hm-deal__media" href="' . esc_url( get_permalink( $product->get_id() ) ) . '">' . $product->get_image( 'woocommerce_single', array( 'loading' => 'lazy' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			if ( $percent ) {
				/* translators: %s: discount percent */
				echo '<span class="hm-deal__off">' . esc_html( sprintf( __( '%s%% off', 'hamista-core' ), hamista_core_num( $percent ) ) ) . '</span>';
			}
			echo '</a><div class="hm-deal__info">';
			echo $this->render_header( $s ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<h3 class="hm-deal__name"><a href="' . esc_url( get_permalink( $product->get_id() ) ) . '">' . esc_html( $product->get_name() ) . '</a></h3>';
			if ( $product->get_short_description() ) {
				echo '<p class="hm-deal__desc">' . esc_html( wp_trim_words( wp_strip_all_tags( $product->get_short_description() ), 26 ) ) . '</p>';
			}
			echo '<div class="hm-deal__price">' . wp_kses_post( $product->get_price_html() ) . '</div>';
			echo $timer . Product_Card::stock_bar( $product ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<div class="hm-deal__actions">' . Product_Card::cart_button( $product ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '</div></div></div></section>';
			return;
		}

		$items = array();
		foreach ( $products as $product ) {
			$items[] = Product_Card::render( $product, $options );
		}
		$more = '';
		if ( ! empty( $s['more_text'] ) && ! empty( $s['more_link']['url'] ) ) {
			$this->add_link_attributes( 'more_link', $s['more_link'] );
			$more = '<a class="hm-btn hm-btn--secondary hm-btn--sm" ' . $this->get_render_attribute_string( 'more_link' ) . '>' . esc_html( $s['more_text'] ) . '</a>';
		}

		echo '<div class="hm-deal__grid">';
		echo '<div class="hm-deal__panel ' . ( 'band' === $layout ? 'hm-scheme-accent' : 'hm-scheme-inverse' ) . '">' . $this->render_header( $s ) . $timer . '<div class="hm-deal__tools">' . $more . ( 'top' === $s['arrows'] ? $this->carousel_arrows( $s ) : '' ) . '</div></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $this->carousel_wrap( $s, $items, __( 'Deals', 'hamista-core' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '</div></div></section>';
	}
}
