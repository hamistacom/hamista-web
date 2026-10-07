<?php
/**
 * Product queries shared by the shop widgets: one set of controls, one query builder.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Shop;

use Elementor\Controls_Manager;

defined( 'ABSPATH' ) || exit;

/**
 * Product query.
 */
class Product_Query {

	/**
	 * Source choices.
	 *
	 * @return array
	 */
	public static function sources() {
		return array(
			'recent'       => __( 'Newest', 'hamista-core' ),
			'featured'     => __( 'Featured', 'hamista-core' ),
			'sale'         => __( 'On sale', 'hamista-core' ),
			'best_selling' => __( 'Best selling', 'hamista-core' ),
			'top_rated'    => __( 'Top rated', 'hamista-core' ),
			'random'       => __( 'Random', 'hamista-core' ),
			'manual'       => __( 'Hand-picked', 'hamista-core' ),
		);
	}

	/**
	 * Product category choices (slug => name).
	 *
	 * @return array
	 */
	public static function category_choices() {
		$choices = array();
		if ( ! taxonomy_exists( 'product_cat' ) ) {
			return $choices;
		}
		$terms = get_terms(
			array(
				'taxonomy'   => 'product_cat',
				'hide_empty' => false,
				'number'     => 300,
			)
		);
		if ( ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term ) {
				$choices[ $term->slug ] = $term->name;
			}
		}
		return $choices;
	}

	/**
	 * Add the query controls to a widget (inside an open controls section).
	 *
	 * @param \Elementor\Widget_Base $widget   Widget.
	 * @param array                  $defaults source, count.
	 * @param string                 $prefix   Control name prefix (for repeated queries).
	 */
	public static function controls( $widget, $defaults = array(), $prefix = '' ) {
		$defaults = wp_parse_args(
			$defaults,
			array(
				'source' => 'recent',
				'count'  => 8,
			)
		);
		$widget->add_control(
			$prefix . 'source',
			array(
				'label'   => __( 'Show', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => $defaults['source'],
				'options' => self::sources(),
			)
		);
		$widget->add_control(
			$prefix . 'ids',
			array(
				'label'       => __( 'Product IDs', 'hamista-core' ),
				'description' => __( 'Comma-separated, in the order to show them.', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'label_block' => true,
				'condition'   => array( $prefix . 'source' => 'manual' ),
			)
		);
		$widget->add_control(
			$prefix . 'category',
			array(
				'label'       => __( 'Categories', 'hamista-core' ),
				'type'        => Controls_Manager::SELECT2,
				'multiple'    => true,
				'options'     => self::category_choices(),
				'label_block' => true,
				'condition'   => array( $prefix . 'source!' => 'manual' ),
			)
		);
		$widget->add_control(
			$prefix . 'count',
			array(
				'label'     => __( 'Number of products', 'hamista-core' ),
				'type'      => Controls_Manager::NUMBER,
				'default'   => $defaults['count'],
				'min'       => 1,
				'max'       => 48,
				'condition' => array( $prefix . 'source!' => 'manual' ),
			)
		);
		$widget->add_control(
			$prefix . 'hide_out',
			array(
				'label'        => __( 'Hide out-of-stock products', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
	}

	/**
	 * Run a query from widget settings.
	 *
	 * @param array  $s      Settings.
	 * @param string $prefix Control prefix.
	 * @return \WC_Product[]
	 */
	public static function get( $s, $prefix = '' ) {
		if ( ! function_exists( 'wc_get_products' ) ) {
			return array();
		}
		$source = $s[ $prefix . 'source' ] ?? 'recent';
		$args   = array(
			'status'     => 'publish',
			'limit'      => max( 1, min( 48, (int) ( $s[ $prefix . 'count' ] ?? 8 ) ) ),
			'visibility' => 'catalog',
			'orderby'    => 'date',
			'order'      => 'DESC',
		);
		if ( 'yes' === ( $s[ $prefix . 'hide_out' ] ?? '' ) ) {
			$args['stock_status'] = 'instock';
		}
		if ( ! empty( $s[ $prefix . 'category' ] ) && 'manual' !== $source ) {
			$args['category'] = array_map( 'sanitize_title', (array) $s[ $prefix . 'category' ] );
		}

		switch ( $source ) {
			case 'manual':
				$ids = array_filter( array_map( 'absint', explode( ',', (string) ( $s[ $prefix . 'ids' ] ?? '' ) ) ) );
				if ( ! $ids ) {
					return array();
				}
				$args['include'] = $ids;
				$args['orderby'] = 'include';
				$args['limit']   = count( $ids );
				break;
			case 'featured':
				$args['featured'] = true;
				break;
			case 'sale':
				$ids             = wc_get_product_ids_on_sale();
				$args['include'] = $ids ? $ids : array( 0 );
				break;
			case 'best_selling':
				$args['orderby']  = 'meta_value_num';
				$args['meta_key'] = 'total_sales'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				break;
			case 'top_rated':
				$args['orderby']  = 'meta_value_num';
				$args['meta_key'] = '_wc_average_rating'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				break;
			case 'random':
				$args['orderby'] = 'rand';
				break;
		}

		/**
		 * Filter the product query of Hamista shop widgets.
		 *
		 * @param array $args     wc_get_products() arguments.
		 * @param array $settings Widget settings.
		 */
		$args = apply_filters( 'hamista_core/product_query', $args, $s );
		return wc_get_products( $args );
	}
}
