<?php
/**
 * Scroll Path: a pinned, dark stage where a spark draws a path as you scroll,
 * lighting up each step of a story.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Scroll path widget.
 */
class Scroll_Path extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-scroll-path';
	}

	/** @return string */
	public function get_title() {
		return __( 'Scroll Path Story', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-flow';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'story', 'path', 'timeline', 'scroll', 'steps', 'process' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_intro', array( 'label' => __( 'Opening', 'hamista-core' ) ) );
		$this->add_header_controls(
			array(
				'eyebrow' => __( 'The story of a product', 'hamista-core' ),
				'title'   => __( "Every product\nstarts with a *spark*.", 'hamista-core' ),
				'align'   => 'center',
				'size'    => 'xl',
			),
			false
		);
		$this->add_control(
			'hint',
			array(
				'label'   => __( 'Scroll hint', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Keep scrolling', 'hamista-core' ),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_steps', array( 'label' => __( 'Steps', 'hamista-core' ) ) );
		$steps = new Repeater();
		$steps->add_control(
			'code',
			array(
				'label'       => __( 'Marker (Latin, short)', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => 'SPARK',
				'description' => __( 'Shown in small capitals next to the path.', 'hamista-core' ),
			)
		);
		$steps->add_control(
			'title',
			array(
				'label'   => __( 'Title', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'A spark', 'hamista-core' ),
			)
		);
		$steps->add_control(
			'text',
			array(
				'label'   => __( 'Text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXTAREA,
				'rows'    => 3,
				'default' => __( 'It always starts with a simple question.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'steps',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $steps->get_controls(),
				'title_field' => '{{{ title }}}',
				'default'     => array(
					array(
						'code'  => 'SPARK',
						'title' => __( 'A spark', 'hamista-core' ),
						'text'  => __( 'It always starts with a simple question: “What if I built this myself?”', 'hamista-core' ),
					),
					array(
						'code'  => 'PROTOTYPE',
						'title' => __( 'The first version', 'hamista-core' ),
						'text'  => __( 'By week two the idea comes alive on screen — rough, but real enough to touch.', 'hamista-core' ),
					),
					array(
						'code'  => 'FIRST USER',
						'title' => __( 'The first user', 'hamista-core' ),
						'text'  => __( 'The first honest feedback: the moment everything about building changes.', 'hamista-core' ),
					),
					array(
						'code'  => 'PRODUCT',
						'title' => __( 'A real product', 'hamista-core' ),
						'text'  => __( 'Now you are a maker — with a live product, real users and a story to tell.', 'hamista-core' ),
					),
				),
			)
		);
		$this->add_control(
			'length',
			array(
				'label'   => __( 'Scroll length (screens)', 'hamista-core' ),
				'type'    => Controls_Manager::SLIDER,
				'default' => array( 'size' => 4.2 ),
				'range'   => array(
					'px' => array(
						'min'  => 2,
						'max'  => 8,
						'step' => 0.2,
					),
				),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section(
			'section_style',
			array(
				'label' => __( 'Stage', 'hamista-core' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);
		$this->add_control(
			'bg_from',
			array(
				'label'     => __( 'Background', 'hamista-core' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array( '{{WRAPPER}} .hm-path' => '--hm-path-bg: {{VALUE}};' ),
			)
		);
		$this->add_control(
			'mid_color',
			array(
				'label'     => __( 'Mid-story glow', 'hamista-core' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array( '{{WRAPPER}} .hm-path' => '--hm-path-mid: {{VALUE}};' ),
			)
		);
		$this->add_control(
			'accent_override',
			array(
				'label'     => __( 'Spark color', 'hamista-core' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array( '{{WRAPPER}}' => '--hm-accent: {{VALUE}};' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s     = $this->get_settings_for_display();
		$steps = array_values( (array) $s['steps'] );
		$total = count( $steps );
		$len   = isset( $s['length']['size'] ) ? (float) $s['length']['size'] : 4.2;

		echo '<section class="hm-path" data-hm-widget="path" style="--hm-path-len:' . esc_attr( (string) round( $len * 100 ) ) . 'vh">';
		echo '<div class="hm-path__stage">';
		echo '<div class="hm-path__bg" aria-hidden="true"></div><div class="hm-path__dust" aria-hidden="true"></div>';
		echo '<svg class="hm-path__svg" aria-hidden="true"><path class="hm-path__track"/><path class="hm-path__line"/><path class="hm-path__tail"/></svg>';
		foreach ( $steps as $i => $step ) {
			echo '<div class="hm-path__node" aria-hidden="true"><i></i><span>' . esc_html( self::index_label( $i ) . ' ' . $step['code'] ) . '</span></div>';
		}
		echo '<div class="hm-path__spark" aria-hidden="true"><i></i></div>';

		echo '<div class="hm-path__intro">' . $this->render_header( $s ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		if ( $s['hint'] ) {
			echo '<span class="hm-path__hint">' . esc_html( $s['hint'] ) . '</span>';
		}
		echo '</div>';

		echo '<ol class="hm-path__steps">';
		foreach ( $steps as $i => $step ) {
			echo '<li class="hm-path__step"><span class="hm-path__n">' . esc_html( self::index_label( $i ) . ' / ' . self::pad_number( $total ) ) . '</span>';
			echo '<h3>' . esc_html( $step['title'] ) . '</h3><p>' . esc_html( $step['text'] ) . '</p></li>';
		}
		echo '</ol>';
		echo '<div class="hm-path__rail" aria-hidden="true"><i></i></div>';
		echo '<div class="hm-path__count" aria-hidden="true"><b>' . esc_html( self::pad_number( 0 ) ) . '</b> / ' . esc_html( self::pad_number( $total ) ) . '</div>';
		echo '</div></section>';
	}
}
