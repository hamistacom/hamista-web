<?php
/**
 * Portfolio: projects as a grid, a mosaic or a carousel, with optional
 * category filters that work instantly in the browser.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Carousel;
use Hamista\Core\Elementor\Widget_Base;
use Hamista\Core\Portfolio\Portfolio as Projects;

defined( 'ABSPATH' ) || exit;

/**
 * Portfolio widget.
 */
class Portfolio extends Widget_Base {

	use Carousel;

	/** @return string */
	public function get_name() {
		return 'hm-portfolio';
	}

	/** @return string */
	public function get_title() {
		return __( 'Portfolio', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-gallery-masonry';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'portfolio', 'projects', 'work', 'gallery', 'filter' );
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
				'eyebrow' => __( 'Selected work', 'hamista-core' ),
				'title'   => __( 'Recent *projects*', 'hamista-core' ),
				'size'    => 'md',
			),
			false
		);
		$this->add_view_all_controls();
		$this->end_controls_section();

		$terms   = get_terms(
			array(
				'taxonomy'   => Projects::TAXONOMY,
				'hide_empty' => false,
			)
		);
		$choices = array();
		if ( ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term ) {
				$choices[ $term->term_id ] = $term->name;
			}
		}
		$this->start_controls_section( 'section_query', array( 'label' => __( 'Projects', 'hamista-core' ) ) );
		$this->add_control(
			'count',
			array(
				'label'   => __( 'Number of projects', 'hamista-core' ),
				'type'    => Controls_Manager::NUMBER,
				'default' => 6,
				'min'     => 1,
				'max'     => 30,
			)
		);
		$this->add_control(
			'cats',
			array(
				'label'       => __( 'Categories', 'hamista-core' ),
				'type'        => Controls_Manager::SELECT2,
				'multiple'    => true,
				'label_block' => true,
				'options'     => $choices,
			)
		);
		$this->add_control(
			'filters',
			array(
				'label'        => __( 'Category filters', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => array( 'layout!' => 'carousel' ),
			)
		);
		$this->add_control(
			'card_style',
			array(
				'label'   => __( 'Card style', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'caption',
				'options' => array(
					'caption' => __( 'Caption below', 'hamista-core' ),
					'overlay' => __( 'Caption on hover', 'hamista-core' ),
					'minimal' => __( 'Minimal', 'hamista-core' ),
				),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_layout_pf', array( 'label' => __( 'Layout', 'hamista-core' ) ) );
		$this->add_control(
			'layout',
			array(
				'label'   => __( 'Layout', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'grid',
				'options' => array(
					'grid'     => __( 'Grid', 'hamista-core' ),
					'masonry'  => __( 'Mosaic', 'hamista-core' ),
					'carousel' => __( 'Carousel', 'hamista-core' ),
				),
			)
		);
		$this->add_responsive_control(
			'columns',
			array(
				'label'          => __( 'Columns', 'hamista-core' ),
				'type'           => Controls_Manager::SELECT,
				'default'        => '3',
				'tablet_default' => '2',
				'mobile_default' => '1',
				'options'        => array_combine( array( '1', '2', '3', '4' ), array( '1', '2', '3', '4' ) ),
				'selectors'      => array( '{{WRAPPER}} .hm-pfgrid' => '--hm-cols: {{VALUE}};' ),
				'condition'      => array( 'layout!' => 'carousel' ),
			)
		);
		$this->add_carousel_options(
			array( 'layout' => 'carousel' ),
			array(
				'per_view'        => 2.4,
				'per_view_tablet' => 1.6,
				'per_view_mobile' => 1.1,
			)
		);
		$this->end_controls_section();
		$this->add_section_controls();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s = $this->get_settings_for_display();
		if ( ! post_type_exists( Projects::TYPE ) ) {
			return;
		}
		$args = array(
			'post_type'           => Projects::TYPE,
			'posts_per_page'      => max( 1, (int) $s['count'] ),
			'ignore_sticky_posts' => true,
			'no_found_rows'       => true,
		);
		if ( ! empty( $s['cats'] ) ) {
			$args['tax_query'] = array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
				array(
					'taxonomy' => Projects::TAXONOMY,
					'terms'    => array_map( 'intval', (array) $s['cats'] ),
				),
			);
		}
		$query = new \WP_Query( $args );
		if ( ! $query->have_posts() ) {
			if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
				echo '<div class="hm-empty">' . esc_html__( 'Add projects under Portfolio in the dashboard to show them here.', 'hamista-core' ) . '</div>';
			}
			return;
		}
		$style = in_array( $s['card_style'], array( 'caption', 'overlay', 'minimal' ), true ) ? $s['card_style'] : 'caption';
		$cards = array();
		$used  = array();
		foreach ( $query->posts as $post ) {
			$cards[] = Projects::card( $post->ID, $style );
			$terms   = get_the_terms( $post->ID, Projects::TAXONOMY );
			if ( $terms && ! is_wp_error( $terms ) ) {
				foreach ( $terms as $term ) {
					$used[ $term->term_id ] = $term->name;
				}
			}
		}
		wp_reset_postdata();

		echo '<section class="' . esc_attr( $this->section_class( $s, 'hm-portfolio' ) ) . '"' . ( 'carousel' !== $s['layout'] ? ' data-hm-widget="pfilter"' : '' ) . '><div class="' . esc_attr( $this->inner_class( $s ) ) . '">';
		echo $this->carousel_head( $s, $this->render_header( $s ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

		if ( 'carousel' === $s['layout'] ) {
			echo $this->carousel_wrap( $s, $cards, __( 'Projects', 'hamista-core' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		} else {
			if ( 'yes' === $s['filters'] && count( $used ) > 1 ) {
				echo '<div class="hm-filters" role="toolbar" aria-label="' . esc_attr__( 'Filter projects', 'hamista-core' ) . '"><button type="button" class="hm-chip" aria-pressed="true" data-filter="">' . esc_html__( 'All', 'hamista-core' ) . '</button>';
				foreach ( $used as $id => $name ) {
					echo '<button type="button" class="hm-chip" aria-pressed="false" data-filter="hm-pf-' . esc_attr( (string) $id ) . '">' . esc_html( $name ) . '</button>';
				}
				echo '</div>';
			}
			echo '<div class="hm-pfgrid' . ( 'masonry' === $s['layout'] ? ' hm-pfgrid--masonry' : '' ) . '">' . implode( '', $cards ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		echo '</div></section>';
	}
}
