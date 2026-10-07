<?php
/**
 * Shared layout controls for widgets that show a row of items as a native
 * carousel (CSS scroll snapping, no slider library) or as a grid.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor;

use Elementor\Controls_Manager;

defined( 'ABSPATH' ) || exit;

/**
 * Carousel controls and markup.
 */
trait Carousel {

	/**
	 * Layout section: carousel or grid, items per view, gap, arrows, dots, autoplay.
	 *
	 * @param array $defaults layout, per_view, per_view_tablet, per_view_mobile, columns, columns_tablet, columns_mobile, gap.
	 */
	protected function add_carousel_controls( $defaults = array() ) {
		$defaults = wp_parse_args(
			$defaults,
			array(
				'layout'          => 'carousel',
				'per_view'        => 4,
				'per_view_tablet' => 2.4,
				'per_view_mobile' => 1.25,
				'columns'         => '4',
				'columns_tablet'  => '2',
				'columns_mobile'  => '1',
				'gap'             => 20,
				'arrows'          => 'top',
				'dots'            => '',
				'autoplay'        => '',
			)
		);

		$this->start_controls_section( 'section_carousel', array( 'label' => __( 'Layout', 'hamista-core' ) ) );
		$this->add_control(
			'layout',
			array(
				'label'   => __( 'Layout', 'hamista-core' ),
				'type'    => Controls_Manager::CHOOSE,
				'default' => $defaults['layout'],
				'toggle'  => false,
				'options' => array(
					'carousel' => array(
						'title' => __( 'Carousel', 'hamista-core' ),
						'icon'  => 'eicon-slider-push',
					),
					'grid'     => array(
						'title' => __( 'Grid', 'hamista-core' ),
						'icon'  => 'eicon-gallery-grid',
					),
				),
			)
		);
		$this->add_responsive_control(
			'columns',
			array(
				'label'          => __( 'Columns', 'hamista-core' ),
				'type'           => Controls_Manager::SELECT,
				'default'        => $defaults['columns'],
				'tablet_default' => $defaults['columns_tablet'],
				'mobile_default' => $defaults['columns_mobile'],
				'options'        => array_combine( array( '1', '2', '3', '4', '5', '6' ), array( '1', '2', '3', '4', '5', '6' ) ),
				'selectors'      => array( '{{WRAPPER}} .hm-carousel' => '--hm-cols: {{VALUE}};' ),
				'condition'      => array( 'layout' => 'grid' ),
			)
		);
		$this->add_carousel_options( array( 'layout' => 'carousel' ), $defaults );
		$this->end_controls_section();
	}

	/**
	 * Carousel options (items in view, gap, arrows, progress, autoplay), shown
	 * when the widget's own layout control is set to a carousel.
	 *
	 * @param array $condition Elementor condition for the carousel options.
	 * @param array $defaults  Defaults (see add_carousel_controls()).
	 */
	protected function add_carousel_options( $condition, $defaults = array() ) {
		$defaults = wp_parse_args(
			$defaults,
			array(
				'per_view'        => 3,
				'per_view_tablet' => 2.2,
				'per_view_mobile' => 1.15,
				'gap'             => 20,
				'arrows'          => 'top',
				'dots'            => '',
				'autoplay'        => '',
			)
		);
		$this->add_responsive_control(
			'per_view',
			array(
				'label'          => __( 'Items in view', 'hamista-core' ),
				'description'    => __( 'Decimals show part of the next item, which tells visitors there is more to swipe.', 'hamista-core' ),
				'type'           => Controls_Manager::NUMBER,
				'min'            => 1,
				'max'            => 8,
				'step'           => 0.05,
				'default'        => $defaults['per_view'],
				'tablet_default' => $defaults['per_view_tablet'],
				'mobile_default' => $defaults['per_view_mobile'],
				'selectors'      => array( '{{WRAPPER}} .hm-carousel' => '--hm-per: {{VALUE}};' ),
				'condition'      => $condition,
			)
		);
		$this->add_responsive_control(
			'gap',
			array(
				'label'      => __( 'Gap', 'hamista-core' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px' ),
				'range'      => array(
					'px' => array(
						'min' => 0,
						'max' => 60,
					),
				),
				'default'    => array(
					'unit' => 'px',
					'size' => $defaults['gap'],
				),
				'selectors'  => array( '{{WRAPPER}} .hm-carousel' => '--hm-gap: {{SIZE}}{{UNIT}};' ),
			)
		);
		$this->add_control(
			'arrows',
			array(
				'label'     => __( 'Arrows', 'hamista-core' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => $defaults['arrows'],
				'options'   => array(
					''      => __( 'Hidden', 'hamista-core' ),
					'top'   => __( 'Beside the heading', 'hamista-core' ),
					'sides' => __( 'On the sides', 'hamista-core' ),
				),
				'condition' => $condition,
			)
		);
		$this->add_control(
			'dots',
			array(
				'label'     => __( 'Progress', 'hamista-core' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => $defaults['dots'],
				'options'   => array(
					''     => __( 'None', 'hamista-core' ),
					'dots' => __( 'Dots', 'hamista-core' ),
					'bar'  => __( 'Progress bar', 'hamista-core' ),
				),
				'condition' => $condition,
			)
		);
		$this->add_control(
			'autoplay',
			array(
				'label'       => __( 'Autoplay', 'hamista-core' ),
				'type'        => Controls_Manager::SELECT,
				'default'     => $defaults['autoplay'],
				'options'     => array(
					''  => __( 'Off', 'hamista-core' ),
					'4' => __( 'Every 4 seconds', 'hamista-core' ),
					'6' => __( 'Every 6 seconds', 'hamista-core' ),
					'8' => __( 'Every 8 seconds', 'hamista-core' ),
				),
				'description' => __( 'Pauses while the pointer is over it, while it is off screen and for visitors who prefer reduced motion.', 'hamista-core' ),
				'condition'   => $condition,
			)
		);
	}

	/**
	 * Arrow buttons (placed by the widget, e.g. inside its heading row).
	 *
	 * @param array $s Settings.
	 * @return string
	 */
	protected function carousel_arrows( $s ) {
		if ( 'carousel' !== ( $s['layout'] ?? 'carousel' ) || empty( $s['arrows'] ) ) {
			return '';
		}
		return '<div class="hm-carousel__nav">'
			. '<button type="button" class="hm-icon-btn hm-carousel__prev" data-carousel-prev aria-label="' . esc_attr__( 'Previous', 'hamista-core' ) . '">' . hamista_core_icon( 'arrow-right', array( 'size' => 18 ) ) . '</button>'
			. '<button type="button" class="hm-icon-btn hm-carousel__next" data-carousel-next aria-label="' . esc_attr__( 'Next', 'hamista-core' ) . '">' . hamista_core_icon( 'arrow', array( 'size' => 18 ) ) . '</button>'
			. '</div>';
	}

	/**
	 * Wrap rendered items in the carousel/grid markup.
	 *
	 * @param array    $s     Settings.
	 * @param string[] $items Item HTML (already escaped).
	 * @param string   $label Accessible name of the region.
	 * @param string   $class Extra class.
	 * @return string
	 */
	protected function carousel_wrap( $s, $items, $label, $class = '' ) {
		$layout = 'grid' === ( $s['layout'] ?? '' ) ? 'grid' : 'carousel';
		$attrs  = 'class="hm-carousel hm-carousel--' . $layout . ( 'carousel' === $layout && 'sides' === ( $s['arrows'] ?? '' ) ? ' hm-carousel--sides' : '' ) . ( $class ? ' ' . esc_attr( $class ) : '' ) . '"';
		if ( 'carousel' === $layout ) {
			$attrs .= ' data-hm-widget="carousel"';
			if ( ! empty( $s['autoplay'] ) ) {
				$attrs .= ' data-autoplay="' . (int) $s['autoplay'] . '"';
			}
		}
		$html = '<div ' . $attrs . '>';
		if ( 'carousel' === $layout && 'sides' === ( $s['arrows'] ?? '' ) ) {
			$html .= $this->carousel_arrows( $s );
		}
		$html .= '<div class="hm-carousel__track"' . ( 'carousel' === $layout ? ' role="region" tabindex="0" aria-label="' . esc_attr( $label ) . '"' : '' ) . '>';
		foreach ( $items as $item ) {
			$html .= '<div class="hm-carousel__slide">' . $item . '</div>';
		}
		$html .= '</div>';
		if ( 'carousel' === $layout && ! empty( $s['dots'] ) ) {
			$html .= 'bar' === $s['dots'] ? '<div class="hm-carousel__bar" aria-hidden="true"><i></i></div>' : '<div class="hm-carousel__dots" aria-hidden="true"></div>';
		}
		return $html . '</div>';
	}

	/**
	 * "View all" link controls (inside an open section).
	 */
	protected function add_view_all_controls() {
		$this->add_control(
			'more_text',
			array(
				'label'     => __( '"View all" text', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'View all', 'hamista-core' ),
				'separator' => 'before',
			)
		);
		$this->add_control(
			'more_link',
			array(
				'label'   => __( '"View all" link', 'hamista-core' ),
				'type'    => Controls_Manager::URL,
				'dynamic' => array( 'active' => true ),
			)
		);
	}

	/**
	 * Heading row: heading on one side, "view all" and arrows on the other.
	 *
	 * @param array  $s      Settings.
	 * @param string $header Rendered heading.
	 * @return string
	 */
	protected function carousel_head( $s, $header ) {
		$tools = '';
		if ( ! empty( $s['more_text'] ) && ! empty( $s['more_link']['url'] ) ) {
			$this->add_link_attributes( 'more_link', $s['more_link'] );
			$tools .= '<a class="hm-crow__more" ' . $this->get_render_attribute_string( 'more_link' ) . '>' . esc_html( $s['more_text'] ) . hamista_core_icon( 'arrow', array( 'size' => 16 ) ) . '</a>';
		}
		if ( 'top' === ( $s['arrows'] ?? '' ) ) {
			$tools .= $this->carousel_arrows( $s );
		}
		if ( '' === $header && '' === $tools ) {
			return '';
		}
		return '<div class="hm-crow">' . $header . ( $tools ? '<div class="hm-crow__tools">' . $tools . '</div>' : '' ) . '</div>';
	}
}
