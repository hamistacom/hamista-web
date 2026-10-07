<?php
/**
 * Product tabs: several product queries behind one row of tabs (for example
 * New, On sale, Bestsellers, or one tab per category).
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Carousel;
use Hamista\Core\Elementor\Widget_Base;
use Hamista\Core\Shop\Product_Card;
use Hamista\Core\Shop\Product_Query;

defined( 'ABSPATH' ) || exit;

/**
 * Product tabs widget.
 */
class Product_Tabs extends Widget_Base {

	use Carousel;

	/** @return string */
	public function get_name() {
		return 'hm-product-tabs';
	}

	/** @return string */
	public function get_title() {
		return __( 'Product Tabs', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-tabs';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'products', 'tabs', 'woocommerce', 'filter' );
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
				'title' => __( 'Picked for you', 'hamista-core' ),
				'size'  => 'md',
			),
			false
		);
		$this->add_control(
			'tabs_style',
			array(
				'label'   => __( 'Tab style', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'pills',
				'options' => array(
					'pills'     => __( 'Pills', 'hamista-core' ),
					'underline' => __( 'Underline', 'hamista-core' ),
					'segmented' => __( 'Segmented', 'hamista-core' ),
				),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_tabs', array( 'label' => __( 'Tabs', 'hamista-core' ) ) );
		$rep = new Repeater();
		$rep->add_control(
			'label',
			array(
				'label'   => __( 'Tab label', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Newest', 'hamista-core' ),
			)
		);
		Product_Query::controls( $rep );
		$this->add_control(
			'tabs',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $rep->get_controls(),
				'title_field' => '{{{ label }}}',
				'default'     => array(
					array(
						'label'  => __( 'Newest', 'hamista-core' ),
						'source' => 'recent',
					),
					array(
						'label'  => __( 'On sale', 'hamista-core' ),
						'source' => 'sale',
					),
					array(
						'label'  => __( 'Bestsellers', 'hamista-core' ),
						'source' => 'best_selling',
					),
				),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_card', array( 'label' => __( 'Card', 'hamista-core' ) ) );
		Product_Card::controls( $this );
		$this->end_controls_section();

		$this->add_carousel_controls(
			array(
				'layout'         => 'grid',
				'columns_mobile' => '2',
			)
		);
		$this->add_section_controls();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s = $this->get_settings_for_display();
		if ( ! class_exists( 'WooCommerce' ) || empty( $s['tabs'] ) ) {
			return;
		}
		$id      = 'hm-pt-' . $this->get_id();
		$options = Product_Card::options( $s );
		$style   = in_array( $s['tabs_style'], array( 'pills', 'underline', 'segmented' ), true ) ? $s['tabs_style'] : 'pills';

		$list   = '';
		$panels = '';
		foreach ( array_values( $s['tabs'] ) as $i => $tab ) {
			$items = array();
			foreach ( Product_Query::get( $tab ) as $product ) {
				$items[] = Product_Card::render( $product, $options );
			}
			$selected = 0 === $i;
			$list    .= '<button type="button" role="tab" class="hm-ptabs__tab" id="' . esc_attr( $id . '-t' . $i ) . '" aria-controls="' . esc_attr( $id . '-p' . $i ) . '" aria-selected="' . ( $selected ? 'true' : 'false' ) . '"' . ( $selected ? '' : ' tabindex="-1"' ) . '>' . esc_html( $tab['label'] ) . '</button>';
			$panels  .= '<div class="hm-ptabs__panel" role="tabpanel" id="' . esc_attr( $id . '-p' . $i ) . '" aria-labelledby="' . esc_attr( $id . '-t' . $i ) . '"' . ( $selected ? '' : ' hidden' ) . '>'
				. ( $items ? $this->carousel_wrap( $s, $items, $tab['label'] ) : '<p class="hm-empty">' . esc_html__( 'No products here yet.', 'hamista-core' ) . '</p>' )
				. '</div>';
		}

		echo '<section class="' . esc_attr( $this->section_class( $s, 'hm-ptabs' ) ) . '" data-hm-widget="ptabs"><div class="' . esc_attr( $this->inner_class( $s ) ) . '">';
		echo '<div class="hm-crow">' . $this->render_header( $s ) . '<div class="hm-ptabs__list hm-ptabs__list--' . esc_attr( $style ) . '" role="tablist">' . $list . '</div></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $panels; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above.
		echo '</div></section>';
	}
}
