<?php
/**
 * Image Reveal: an image that wipes into view and drifts inside its frame.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Image reveal widget.
 */
class Image_Reveal extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-image-reveal';
	}

	/** @return string */
	public function get_title() {
		return __( 'Image Reveal', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-image-rollover';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'image', 'photo', 'parallax', 'reveal' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_image', array( 'label' => __( 'Image', 'hamista-core' ) ) );
		$this->add_control(
			'image',
			array(
				'label'   => __( 'Image', 'hamista-core' ),
				'type'    => Controls_Manager::MEDIA,
				'default' => array( 'url' => \Elementor\Utils::get_placeholder_image_src() ),
			)
		);
		$this->add_control(
			'ratio',
			array(
				'label'   => __( 'Shape', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '4-3',
				'options' => array(
					'auto' => __( 'Original', 'hamista-core' ),
					'1-1'  => '1:1',
					'4-3'  => '4:3',
					'3-4'  => '3:4',
					'16-9' => '16:9',
					'21-9' => '21:9',
					'arch' => __( 'Arch', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'reveal',
			array(
				'label'   => __( 'Reveal', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'clip-up',
				'options' => array(
					'clip-up' => __( 'Wipe up', 'hamista-core' ),
					'clip-x'  => __( 'Wipe sideways', 'hamista-core' ),
					'scale'   => __( 'Scale in', 'hamista-core' ),
					'fade'    => __( 'Fade', 'hamista-core' ),
					'none'    => __( 'None', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'parallax',
			array(
				'label'   => __( 'Inner parallax', 'hamista-core' ),
				'type'    => Controls_Manager::SLIDER,
				'default' => array( 'size' => 0.4 ),
				'range'   => array(
					'px' => array(
						'min'  => 0,
						'max'  => 1,
						'step' => 0.05,
					),
				),
			)
		);
		$this->add_control(
			'mono',
			array(
				'label'        => __( 'Black & white until hover', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
			)
		);
		$this->add_control(
			'frame',
			array(
				'label'   => __( 'Frame', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '',
				'options' => array(
					''      => __( 'None', 'hamista-core' ),
					'bezel' => __( 'Device bezel', 'hamista-core' ),
					'mat'   => __( 'Paper mat', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'caption',
			array(
				'label' => __( 'Caption', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$this->add_control(
			'link',
			array(
				'label' => __( 'Link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$this->add_responsive_control(
			'radius',
			array(
				'label'      => __( 'Corner radius', 'hamista-core' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px' ),
				'range'      => array(
					'px' => array(
						'min' => 0,
						'max' => 80,
					),
				),
				'selectors'  => array( '{{WRAPPER}} .hm-imgr__frame' => 'border-radius: {{SIZE}}px;' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s   = $this->get_settings_for_display();
		$img = hamista_core_image( $s['image'], 'full', array( 'sizes' => '(max-width: 900px) 100vw, 60vw' ) );
		if ( ! $img ) {
			return;
		}
		$classes = 'hm-imgr hm-imgr--' . sanitize_html_class( $s['ratio'] );
		$classes .= 'yes' === $s['mono'] ? ' hm-imgr--mono' : '';
		$classes .= $s['frame'] ? ' hm-imgr--' . sanitize_html_class( $s['frame'] ) : '';
		$reveal   = 'none' !== $s['reveal'] ? ' data-hm-reveal="' . esc_attr( $s['reveal'] ) . '"' : '';
		$url      = ! empty( $s['link']['url'] ) ? $s['link']['url'] : '';

		echo '<figure class="' . esc_attr( $classes ) . '" data-hm-widget="imgreveal" data-parallax="' . esc_attr( $s['parallax']['size'] ?? 0 ) . '">';
		echo $url ? '<a class="hm-imgr__frame" href="' . esc_url( $url ) . '"' . $reveal . '>' : '<div class="hm-imgr__frame"' . $reveal . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $img; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $url ? '</a>' : '</div>';
		if ( $s['caption'] ) {
			echo '<figcaption class="hm-imgr__caption">' . esc_html( $s['caption'] ) . '</figcaption>';
		}
		echo '</figure>';
	}
}
