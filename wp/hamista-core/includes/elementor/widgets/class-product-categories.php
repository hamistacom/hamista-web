<?php
/**
 * Product categories: circles, cards, tiles or pills, as a carousel or grid.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Carousel;
use Hamista\Core\Elementor\Widget_Base;
use Hamista\Core\Shop\Product_Query;

defined( 'ABSPATH' ) || exit;

/**
 * Product categories widget.
 */
class Product_Categories extends Widget_Base {

	use Carousel;

	/** @return string */
	public function get_name() {
		return 'hm-product-categories';
	}

	/** @return string */
	public function get_title() {
		return __( 'Product Categories', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-product-categories';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'categories', 'product', 'woocommerce', 'carousel' );
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
				'title' => __( 'Shop by category', 'hamista-core' ),
				'size'  => 'md',
			),
			false
		);
		$this->add_view_all_controls();
		$this->end_controls_section();

		$this->start_controls_section( 'section_terms', array( 'label' => __( 'Categories', 'hamista-core' ) ) );
		$this->add_control(
			'pick',
			array(
				'label'       => __( 'Categories', 'hamista-core' ),
				'description' => __( 'Leave empty to show top-level categories.', 'hamista-core' ),
				'type'        => Controls_Manager::SELECT2,
				'multiple'    => true,
				'label_block' => true,
				'options'     => Product_Query::category_choices(),
			)
		);
		$this->add_control(
			'count',
			array(
				'label'   => __( 'Maximum', 'hamista-core' ),
				'type'    => Controls_Manager::NUMBER,
				'default' => 10,
				'min'     => 1,
				'max'     => 40,
			)
		);
		$this->add_control(
			'style',
			array(
				'label'   => __( 'Style', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'circle',
				'options' => array(
					'circle' => __( 'Round image', 'hamista-core' ),
					'card'   => __( 'Image card', 'hamista-core' ),
					'tile'   => __( 'Compact tile', 'hamista-core' ),
					'pill'   => __( 'Pills', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'show_count',
			array(
				'label'        => __( 'Show product count', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->end_controls_section();

		$this->add_carousel_controls(
			array(
				'per_view'        => 6,
				'per_view_tablet' => 4.3,
				'per_view_mobile' => 2.6,
				'columns'         => '6',
				'columns_tablet'  => '3',
				'columns_mobile'  => '2',
			)
		);
		$this->add_section_controls();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s = $this->get_settings_for_display();
		if ( ! taxonomy_exists( 'product_cat' ) ) {
			return;
		}
		$args = array(
			'taxonomy'   => 'product_cat',
			'hide_empty' => true,
			'number'     => max( 1, (int) $s['count'] ),
		);
		if ( ! empty( $s['pick'] ) ) {
			$args['slug']    = array_map( 'sanitize_title', (array) $s['pick'] );
			$args['orderby'] = 'slug__in';
		} else {
			$args['parent']  = 0;
			$args['exclude'] = array( (int) get_option( 'default_product_cat' ) );
		}
		$terms = get_terms( $args );
		if ( is_wp_error( $terms ) || ! $terms ) {
			return;
		}

		$style = in_array( $s['style'], array( 'circle', 'card', 'tile', 'pill' ), true ) ? $s['style'] : 'circle';
		$items = array();
		foreach ( $terms as $term ) {
			$thumb = (int) get_term_meta( $term->term_id, 'thumbnail_id', true );
			$img   = ( $thumb && 'pill' !== $style ) ? wp_get_attachment_image(
				$thumb,
				'card' === $style ? 'woocommerce_thumbnail' : 'thumbnail',
				false,
				array(
					'loading'  => 'lazy',
					'decoding' => 'async',
					'alt'      => '',
				)
			) : '';
			/* translators: %s: number of products */
			$count   = 'yes' === $s['show_count'] ? '<small>' . esc_html( sprintf( _n( '%s product', '%s products', $term->count, 'hamista-core' ), hamista_core_num( $term->count ) ) ) . '</small>' : '';
			$items[] = '<a class="hm-pcat hm-pcat--' . esc_attr( $style ) . '" href="' . esc_url( get_term_link( $term ) ) . '">'
				. ( 'pill' !== $style ? '<span class="hm-pcat__media">' . ( $img ? $img : hamista_core_icon( 'grid', array( 'size' => 26 ) ) ) . '</span>' : '' )
				. '<span class="hm-pcat__text"><b>' . esc_html( $term->name ) . '</b>' . $count . '</span></a>';
		}

		echo '<section class="' . esc_attr( $this->section_class( $s, 'hm-pcats' ) ) . '"><div class="' . esc_attr( $this->inner_class( $s ) ) . '">';
		echo $this->carousel_head( $s, $this->render_header( $s ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from escaped parts.
		echo $this->carousel_wrap( $s, $items, __( 'Product categories', 'hamista-core' ), 'hm-pcats--' . $style ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above.
		echo '</div></section>';
	}
}
