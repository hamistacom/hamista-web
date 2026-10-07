<?php
/**
 * Banner slider: full-width or boxed slides with text and a button, built on
 * the native carousel (scroll snapping, no slider library).
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Carousel;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Slider widget.
 */
class Slider extends Widget_Base {

	use Carousel;

	/** @return string */
	public function get_name() {
		return 'hm-slider';
	}

	/** @return string */
	public function get_title() {
		return __( 'Banner Slider', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-slides';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'slider', 'slides', 'banner', 'carousel', 'hero' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_slides', array( 'label' => __( 'Slides', 'hamista-core' ) ) );
		$rep = new Repeater();
		$rep->add_control(
			'image',
			array(
				'label' => __( 'Image', 'hamista-core' ),
				'type'  => Controls_Manager::MEDIA,
			)
		);
		$rep->add_control(
			'image_mobile',
			array(
				'label'       => __( 'Phone image (optional)', 'hamista-core' ),
				'description' => __( 'A portrait crop for screens narrower than 768px.', 'hamista-core' ),
				'type'        => Controls_Manager::MEDIA,
			)
		);
		$rep->add_control(
			'eyebrow',
			array(
				'label' => __( 'Eyebrow', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$rep->add_control(
			'title',
			array(
				'label'       => __( 'Title', 'hamista-core' ),
				'type'        => Controls_Manager::TEXTAREA,
				'rows'        => 2,
				'default'     => __( 'A fresh *season* has arrived', 'hamista-core' ),
				'description' => __( 'Wrap words in *asterisks* to highlight them.', 'hamista-core' ),
			)
		);
		$rep->add_control(
			'text',
			array(
				'label' => __( 'Text', 'hamista-core' ),
				'type'  => Controls_Manager::TEXTAREA,
				'rows'  => 2,
			)
		);
		$rep->add_control(
			'btn_text',
			array(
				'label'   => __( 'Button text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Shop now', 'hamista-core' ),
			)
		);
		$rep->add_control(
			'link',
			array(
				'label'       => __( 'Link', 'hamista-core' ),
				'description' => __( 'Used by the button; without a button text, the whole slide becomes the link.', 'hamista-core' ),
				'type'        => Controls_Manager::URL,
			)
		);
		$rep->add_control(
			'tone',
			array(
				'label'   => __( 'Text colour', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'light',
				'options' => array(
					'light' => __( 'Light (for dark images)', 'hamista-core' ),
					'dark'  => __( 'Dark (for light images)', 'hamista-core' ),
				),
			)
		);
		$rep->add_control(
			'position',
			array(
				'label'   => __( 'Text position', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'start',
				'options' => array(
					'start'  => __( 'Start', 'hamista-core' ),
					'center' => __( 'Center', 'hamista-core' ),
					'end'    => __( 'End', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'slides',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $rep->get_controls(),
				'title_field' => '{{{ title }}}',
				'default'     => array(
					array( 'title' => __( 'A fresh *season* has arrived', 'hamista-core' ) ),
					array( 'title' => __( 'Up to *40%* off this week', 'hamista-core' ) ),
				),
			)
		);
		$this->add_responsive_control(
			'height',
			array(
				'label'      => __( 'Height', 'hamista-core' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px', 'vh' ),
				'range'      => array(
					'px' => array(
						'min' => 220,
						'max' => 800,
					),
					'vh' => array(
						'min' => 30,
						'max' => 100,
					),
				),
				'selectors'  => array( '{{WRAPPER}} .hm-slider' => '--hm-slider-h: {{SIZE}}{{UNIT}};' ),
			)
		);
		$this->add_control(
			'boxed',
			array(
				'label'        => __( 'Rounded box', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->add_control(
			'arrows',
			array(
				'label'   => __( 'Arrows', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'sides',
				'options' => array(
					''      => __( 'Hidden', 'hamista-core' ),
					'sides' => __( 'On the sides', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'dots',
			array(
				'label'   => __( 'Progress', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'dots',
				'options' => array(
					''     => __( 'None', 'hamista-core' ),
					'dots' => __( 'Dots', 'hamista-core' ),
					'bar'  => __( 'Progress bar', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'autoplay',
			array(
				'label'   => __( 'Autoplay', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '6',
				'options' => array(
					''  => __( 'Off', 'hamista-core' ),
					'4' => __( 'Every 4 seconds', 'hamista-core' ),
					'6' => __( 'Every 6 seconds', 'hamista-core' ),
					'8' => __( 'Every 8 seconds', 'hamista-core' ),
				),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s      = $this->get_settings_for_display();
		$slides = array();
		foreach ( (array) $s['slides'] as $i => $slide ) {
			$img    = ! empty( $slide['image']['id'] ) ? (int) $slide['image']['id'] : 0;
			$mobile = ! empty( $slide['image_mobile']['id'] ) ? (int) $slide['image_mobile']['id'] : 0;
			$media  = '';
			if ( $img ) {
				$attrs = array(
					'class'    => 'hm-slide__img',
					'alt'      => '',
					'sizes'    => '(max-width: 1150px) 100vw, 1150px',
					'loading'  => 0 === $i ? 'eager' : 'lazy',
					'decoding' => 'async',
				);
				if ( 0 === $i ) {
					$attrs['fetchpriority'] = 'high';
				}
				$picture = wp_get_attachment_image( $img, 'full', false, $attrs );
				if ( $mobile ) {
					$src     = wp_get_attachment_image_url( $mobile, 'large' );
					$picture = '<picture><source media="(max-width: 767px)" srcset="' . esc_url( $src ) . '">' . $picture . '</picture>';
				}
				$media = $picture;
			}
			$has_btn = ! empty( $slide['btn_text'] ) && ! empty( $slide['link']['url'] );
			$url     = ! empty( $slide['link']['url'] ) ? $slide['link']['url'] : '';
			$classes = 'hm-slide hm-slide--' . ( 'dark' === $slide['tone'] ? 'dark' : 'light' ) . ' hm-slide--' . ( in_array( $slide['position'], array( 'start', 'center', 'end' ), true ) ? $slide['position'] : 'start' ) . ( $img ? '' : ' hm-slide--blank' );
			$html    = '<div class="' . esc_attr( $classes ) . '">' . $media;
			if ( ! $has_btn && $url ) {
				$html .= '<a class="hm-slide__cover" href="' . esc_url( $url ) . '" aria-label="' . esc_attr( wp_strip_all_tags( $slide['title'] ) ) . '"></a>';
			}
			$html .= '<div class="hm-slide__text">';
			if ( ! empty( $slide['eyebrow'] ) ) {
				$html .= '<p class="hm-eyebrow">' . esc_html( $slide['eyebrow'] ) . '</p>';
			}
			if ( ! empty( $slide['title'] ) ) {
				$html .= ( 0 === $i ? '<h2' : '<h3' ) . ' class="hm-slide__title">' . hamista_core_highlight( $slide['title'] ) . ( 0 === $i ? '</h2>' : '</h3>' );
			}
			if ( ! empty( $slide['text'] ) ) {
				$html .= '<p class="hm-slide__desc">' . esc_html( $slide['text'] ) . '</p>';
			}
			if ( $has_btn ) {
				$html .= '<a class="hm-btn ' . ( 'dark' === $slide['tone'] ? '' : 'hm-btn--inverse' ) . '" href="' . esc_url( $url ) . '"' . ( ! empty( $slide['link']['is_external'] ) ? ' target="_blank" rel="noopener"' : '' ) . '>' . esc_html( $slide['btn_text'] ) . '</a>';
			}
			$slides[] = $html . '</div></div>';
		}
		if ( ! $slides ) {
			return;
		}
		$s['layout'] = 'carousel';
		echo '<div class="hm-slider' . ( 'yes' === $s['boxed'] ? ' hm-slider--boxed' : '' ) . '">' . $this->carousel_wrap( $s, $slides, __( 'Featured', 'hamista-core' ) ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
