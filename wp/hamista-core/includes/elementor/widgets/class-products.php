<?php
/**
 * Products (WooCommerce): any product query in the theme's product grid.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Products widget.
 */
class Products extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-products';
	}

	/** @return string */
	public function get_title() {
		return __( 'Products', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-products';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'products', 'woocommerce', 'shop', 'store' );
	}

	/** @return array */
	public function get_style_depends() {
		return array( 'hamista-widgets', 'hamista-woocommerce', 'woocommerce-general' );
	}

	/**
	 * Products change independently of widget settings.
	 *
	 * @return bool
	 */
	protected function is_dynamic_content(): bool {
		return true;
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_query', array( 'label' => __( 'Products', 'hamista-core' ) ) );
		$cats  = array();
		$terms = get_terms(
			array(
				'taxonomy'   => 'product_cat',
				'hide_empty' => false,
			)
		);
		if ( ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term ) {
				$cats[ $term->slug ] = $term->name;
			}
		}
		$this->add_control(
			'source',
			array(
				'label'   => __( 'Show', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'recent',
				'options' => array(
					'recent'       => __( 'Newest', 'hamista-core' ),
					'featured'     => __( 'Featured', 'hamista-core' ),
					'sale'         => __( 'On sale', 'hamista-core' ),
					'best_selling' => __( 'Best selling', 'hamista-core' ),
					'top_rated'    => __( 'Top rated', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'category',
			array(
				'label'       => __( 'Categories', 'hamista-core' ),
				'type'        => Controls_Manager::SELECT2,
				'multiple'    => true,
				'options'     => $cats,
				'label_block' => true,
			)
		);
		$this->add_control(
			'count',
			array(
				'label'   => __( 'Number of products', 'hamista-core' ),
				'type'    => Controls_Manager::NUMBER,
				'default' => 4,
				'min'     => 1,
				'max'     => 48,
			)
		);
		$this->add_control(
			'columns',
			array(
				'label'   => __( 'Columns', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '4',
				'options' => array(
					'2' => '2',
					'3' => '3',
					'4' => '4',
					'5' => '5',
				),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render through WooCommerce's own [products] shortcode logic so every
	 * plugin hooking the product loop keeps working.
	 */
	protected function render() {
		$s    = $this->get_settings_for_display();
		$atts = array(
			'limit'    => max( 1, (int) $s['count'] ),
			'columns'  => (int) $s['columns'],
			'paginate' => false,
			'cache'    => true,
		);
		switch ( $s['source'] ) {
			case 'featured':
				$atts['visibility'] = 'featured';
				break;
			case 'sale':
				$atts['on_sale'] = 'true';
				break;
			case 'best_selling':
				$atts['best_selling'] = 'true';
				break;
			case 'top_rated':
				$atts['top_rated'] = 'true';
				break;
			default:
				$atts['orderby'] = 'date';
				$atts['order']   = 'DESC';
		}
		if ( ! empty( $s['category'] ) ) {
			$atts['category'] = implode( ',', array_map( 'sanitize_title', (array) $s['category'] ) );
		}

		$type = isset( $atts['on_sale'] ) ? 'sale_products' : ( isset( $atts['best_selling'] ) ? 'best_selling_products' : ( isset( $atts['top_rated'] ) ? 'top_rated_products' : 'products' ) );
		unset( $atts['on_sale'], $atts['best_selling'], $atts['top_rated'] );

		$shortcode = new \WC_Shortcode_Products( $atts, $type );
		echo '<div class="hm-products woocommerce">' . $shortcode->get_content() . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
