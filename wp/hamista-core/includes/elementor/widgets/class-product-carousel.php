<?php
/**
 * Product carousel: any product query as a swipeable row or a grid, in one of
 * the shared card styles.
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
 * Product carousel widget.
 */
class Product_Carousel extends Widget_Base {

	use Carousel;

	/** @return string */
	public function get_name() {
		return 'hm-product-carousel';
	}

	/** @return string */
	public function get_title() {
		return __( 'Product Carousel', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-product-related';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'products', 'carousel', 'slider', 'swiper', 'woocommerce', 'shop' );
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
		$this->add_header_controls(
			array(
				'title' => __( 'Bestsellers this week', 'hamista-core' ),
				'size'  => 'md',
			),
			false
		);
		$this->add_view_all_controls();
		$this->end_controls_section();

		$this->start_controls_section( 'section_query', array( 'label' => __( 'Products', 'hamista-core' ) ) );
		Product_Query::controls( $this );
		$this->end_controls_section();

		$this->start_controls_section( 'section_card', array( 'label' => __( 'Card', 'hamista-core' ) ) );
		Product_Card::controls( $this );
		$this->end_controls_section();

		$this->add_carousel_controls( array( 'columns_mobile' => '2' ) );
		$this->add_section_controls();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s = $this->get_settings_for_display();
		if ( ! class_exists( 'WooCommerce' ) ) {
			if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
				echo '<div class="hm-empty">' . esc_html__( 'Activate WooCommerce to show products.', 'hamista-core' ) . '</div>';
			}
			return;
		}
		$products = Product_Query::get( $s );
		$options  = Product_Card::options( $s );
		$items    = array();
		foreach ( $products as $product ) {
			$items[] = Product_Card::render( $product, $options );
		}

		echo '<section class="' . esc_attr( $this->section_class( $s, 'hm-shelf' ) ) . '"><div class="' . esc_attr( $this->inner_class( $s ) ) . '">';
		echo $this->carousel_head( $s, $this->render_header( $s ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from escaped parts.
		if ( ! $items ) {
			echo '<p class="hm-empty">' . esc_html__( 'No products match these settings yet.', 'hamista-core' ) . '</p>';
		} else {
			echo $this->carousel_wrap( $s, $items, $s['title'] ? wp_strip_all_tags( $s['title'] ) : __( 'Products', 'hamista-core' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- cards are escaped.
		}
		echo '</div></section>';
	}
}
