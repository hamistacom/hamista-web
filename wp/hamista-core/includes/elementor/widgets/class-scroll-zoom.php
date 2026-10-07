<?php
/**
 * Scroll Zoom: a pinned section where an image or video grows from a card to
 * the full viewport as you scroll, then reveals a message on top.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Scroll zoom widget.
 */
class Scroll_Zoom extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-scroll-zoom';
	}

	/** @return string */
	public function get_title() {
		return __( 'Scroll Zoom', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-zoom-in-bold';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'zoom', 'scroll', 'image', 'video', 'pin', 'sticky' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_intro', array( 'label' => __( 'Opening text', 'hamista-core' ) ) );
		$this->add_header_controls(
			array(
				'eyebrow' => __( 'Inside the studio', 'hamista-core' ),
				'title'   => __( 'Every product starts *small*.', 'hamista-core' ),
				'align'   => 'center',
				'size'    => 'xl',
			),
			false
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_media', array( 'label' => __( 'Media', 'hamista-core' ) ) );
		$this->add_control(
			'image',
			array(
				'label'   => __( 'Image (or video poster)', 'hamista-core' ),
				'type'    => Controls_Manager::MEDIA,
				'default' => array( 'url' => \Elementor\Utils::get_placeholder_image_src() ),
			)
		);
		$this->add_control(
			'video',
			array(
				'label' => __( 'Video URL (optional, mp4/webm)', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$this->add_control(
			'direction',
			array(
				'label'       => __( 'Direction', 'hamista-core' ),
				'type'        => Controls_Manager::SELECT,
				'default'     => 'in',
				'options'     => array(
					'in'  => __( 'Zoom in: card grows to full screen', 'hamista-core' ),
					'out' => __( 'Zoom out: full screen shrinks to a card', 'hamista-core' ),
				),
				'description' => __( 'With zoom out, the closing message shows first, over the full-screen image.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'start_scale',
			array(
				'label'   => __( 'Starting size', 'hamista-core' ),
				'type'    => Controls_Manager::SLIDER,
				'default' => array( 'size' => 0.42 ),
				'range'   => array(
					'px' => array(
						'min'  => 0.2,
						'max'  => 0.85,
						'step' => 0.01,
					),
				),
			)
		);
		$this->add_control(
			'radius',
			array(
				'label'   => __( 'Starting corner radius', 'hamista-core' ),
				'type'    => Controls_Manager::SLIDER,
				'default' => array( 'size' => 28 ),
				'range'   => array(
					'px' => array(
						'min' => 0,
						'max' => 80,
					),
				),
			)
		);
		$this->add_control(
			'length',
			array(
				'label'       => __( 'Scroll length', 'hamista-core' ),
				'description' => __( 'How long the effect lasts, in screen heights.', 'hamista-core' ),
				'type'        => Controls_Manager::SLIDER,
				'default'     => array( 'size' => 3 ),
				'range'       => array(
					'px' => array(
						'min'  => 1.5,
						'max'  => 5,
						'step' => 0.25,
					),
				),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_overlay', array( 'label' => __( 'Closing message', 'hamista-core' ) ) );
		$this->add_control(
			'o_title',
			array(
				'label'   => __( 'Title', 'hamista-core' ),
				'type'    => Controls_Manager::TEXTAREA,
				'rows'    => 2,
				'default' => __( 'Then it ships to *real people*.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'o_desc',
			array(
				'label' => __( 'Text', 'hamista-core' ),
				'type'  => Controls_Manager::TEXTAREA,
			)
		);
		$this->add_button_controls(
			'btn1',
			__( 'Button', 'hamista-core' ),
			array( 'style' => 'inverse' )
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s      = $this->get_settings_for_display();
		$length = isset( $s['length']['size'] ) ? (float) $s['length']['size'] : 3;
		$media  = hamista_core_image(
			$s['image'],
			'full',
			array(
				'sizes'   => '100vw',
				'loading' => 'lazy',
			)
		);
		if ( ! empty( $s['video']['url'] ) ) {
			$poster = ! empty( $s['image']['url'] ) ? ' poster="' . esc_url( $s['image']['url'] ) . '"' : '';
			$media  = '<video src="' . esc_url( $s['video']['url'] ) . '"' . $poster . ' autoplay muted loop playsinline preload="metadata"></video>';
		}

		printf(
			'<section class="hm-zoom hm-zoom--%4$s" data-hm-widget="zoom" data-direction="%4$s" data-start="%1$s" data-radius="%2$s" style="--hm-zoom-len:%3$svh">',
			esc_attr( $s['start_scale']['size'] ?? 0.42 ),
			esc_attr( $s['radius']['size'] ?? 28 ),
			esc_attr( (string) round( $length * 100 ) ),
			'out' === ( $s['direction'] ?? 'in' ) ? 'out' : 'in'
		);
		echo '<div class="hm-zoom__sticky">';
		echo '<div class="hm-zoom__intro hm-container">' . $this->render_header( $s ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '<div class="hm-zoom__media">' . $media . '<span class="hm-zoom__shade"></span></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '<div class="hm-zoom__overlay"><div class="hm-container">';
		if ( $s['o_title'] ) {
			echo '<h2 class="hm-zoom__title hm-title hm-title--xl">' . hamista_core_highlight( $s['o_title'] ) . '</h2>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		if ( $s['o_desc'] ) {
			echo '<p class="hm-zoom__desc">' . esc_html( $s['o_desc'] ) . '</p>';
		}
		echo $this->render_button( $s, 'btn1', array( 'size' => 'lg' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '</div></div></div></section>';
	}
}
