<?php
/**
 * Depth scroll: a pinned stage where scenes travel toward the viewer one after
 * another, as if the camera flies through them. Each scene arrives from the
 * distance, holds, then passes through the screen while the next one arrives.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Depth widget.
 */
class Depth extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-depth';
	}

	/** @return string */
	public function get_title() {
		return __( 'Depth Scroll', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-zoom-in-bold';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'zoom', 'depth', 'tunnel', 'scroll', 'fly', '3d', 'motion' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_scenes', array( 'label' => __( 'Scenes', 'hamista-core' ) ) );
		$scenes = new Repeater();
		$scenes->add_control(
			'image',
			array(
				'label' => __( 'Image', 'hamista-core' ),
				'type'  => Controls_Manager::MEDIA,
			)
		);
		$scenes->add_control(
			'label',
			array(
				'label' => __( 'Label', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$scenes->add_control(
			'title',
			array(
				'label'       => __( 'Title', 'hamista-core' ),
				'type'        => Controls_Manager::TEXTAREA,
				'rows'        => 2,
				'default'     => __( 'A scene title', 'hamista-core' ),
				'description' => __( 'Wrap words in *asterisks* to highlight them.', 'hamista-core' ),
			)
		);
		$scenes->add_control(
			'text',
			array(
				'label' => __( 'Text', 'hamista-core' ),
				'type'  => Controls_Manager::TEXTAREA,
				'rows'  => 3,
			)
		);
		$this->add_control(
			'scenes',
			array(
				'label'       => __( 'Scenes', 'hamista-core' ),
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $scenes->get_controls(),
				'title_field' => '{{{ title }}}',
				'default'     => array(
					array(
						'label' => '01',
						'title' => __( 'It starts *far away*', 'hamista-core' ),
						'text'  => __( 'Every scene arrives from the distance…', 'hamista-core' ),
					),
					array(
						'label' => '02',
						'title' => __( 'Comes *closer*', 'hamista-core' ),
						'text'  => __( '…holds for a moment…', 'hamista-core' ),
					),
					array(
						'label' => '03',
						'title' => __( 'And passes *through*', 'hamista-core' ),
						'text'  => __( '…then flies past the camera.', 'hamista-core' ),
					),
				),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_layout', array( 'label' => __( 'Layout', 'hamista-core' ) ) );
		$this->add_control(
			'layout',
			array(
				'label'   => __( 'Scene layout', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'card',
				'options' => array(
					'card'  => __( 'Image card with text below', 'hamista-core' ),
					'cover' => __( 'Full-screen image, text on top', 'hamista-core' ),
					'type'  => __( 'Text only, giant type', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'length',
			array(
				'label'       => __( 'Scroll per scene', 'hamista-core' ),
				'description' => __( 'In screen heights.', 'hamista-core' ),
				'type'        => Controls_Manager::SLIDER,
				'default'     => array( 'size' => 1 ),
				'range'       => array(
					'px' => array(
						'min'  => 0.6,
						'max'  => 2,
						'step' => 0.1,
					),
				),
			)
		);
		$this->add_control(
			'glow',
			array(
				'label'        => __( 'Background glow', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->add_control(
			'scheme',
			array(
				'label'   => __( 'Colour scheme', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'inverse',
				'options' => array(
					''        => __( 'Page colours', 'hamista-core' ),
					'inverse' => __( 'Inverted (dark slab)', 'hamista-core' ),
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
		$scenes = array_values( array_filter( (array) $s['scenes'] ) );
		$n      = count( $scenes );
		if ( ! $n ) {
			return;
		}
		$per    = isset( $s['length']['size'] ) ? (float) $s['length']['size'] : 1;
		$layout = in_array( $s['layout'] ?? 'card', array( 'card', 'cover', 'type' ), true ) ? $s['layout'] : 'card';
		$class  = 'hm-depth hm-depth--' . $layout . ( ! empty( $s['scheme'] ) ? ' hm-scheme-' . sanitize_html_class( $s['scheme'] ) : '' );

		printf( '<section class="%1$s" data-hm-widget="depth" style="--hm-depth-len:%2$svh">', esc_attr( $class ), esc_attr( (string) round( ( $n * $per + 1 ) * 100 ) ) );
		echo '<div class="hm-depth__sticky">';
		if ( 'yes' === ( $s['glow'] ?? 'yes' ) ) {
			echo '<span class="hm-depth__glow" aria-hidden="true"></span>';
		}
		echo '<div class="hm-depth__stage">';
		foreach ( $scenes as $i => $scene ) {
			echo '<div class="hm-depth__layer" aria-hidden="' . ( 0 === $i ? 'false' : 'true' ) . '">';
			if ( 'type' !== $layout ) {
				$img = hamista_core_image(
					$scene['image'] ?? array(),
					'full',
					array(
						'sizes'   => 'cover' === $layout ? '100vw' : '(max-width: 760px) 90vw, 60vw',
						'loading' => 0 === $i ? 'eager' : 'lazy',
					)
				);
				echo '<figure class="hm-depth__media">' . ( $img ? $img : '<span class="hm-depth__blank"></span>' ) . '</figure>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '<div class="hm-depth__text">';
			if ( ! empty( $scene['label'] ) ) {
				echo '<span class="hm-depth__label">' . esc_html( $scene['label'] ) . '</span>';
			}
			if ( ! empty( $scene['title'] ) ) {
				echo '<h3 class="hm-depth__title">' . hamista_core_highlight( $scene['title'] ) . '</h3>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			if ( ! empty( $scene['text'] ) ) {
				echo '<p class="hm-depth__desc">' . esc_html( $scene['text'] ) . '</p>';
			}
			echo '</div></div>';
		}
		echo '</div>';
		printf(
			'<div class="hm-depth__hud" aria-hidden="true"><span class="hm-depth__now">%1$s</span><span class="hm-depth__bar"><span></span></span><span class="hm-depth__total">%2$s</span></div>',
			esc_html( hamista_core_digits( '01' ) ),
			esc_html( hamista_core_digits( str_pad( (string) $n, 2, '0', STR_PAD_LEFT ) ) )
		);
		echo '</div></section>';
	}
}
