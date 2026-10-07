<?php
/**
 * Before / after: two photos with a draggable divider. Built on a native
 * range input, so it works with touch, mouse and the keyboard.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Group_Control_Image_Size;
use Elementor\Utils;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Before / after widget.
 */
class Before_After extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-before-after';
	}

	/** @return string */
	public function get_title() {
		return __( 'Before & after', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-image-before-after';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'before', 'after', 'compare', 'comparison', 'slider', 'result' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_images', array( 'label' => __( 'Photos', 'hamista-core' ) ) );
		$this->add_control(
			'before',
			array(
				'label'   => _x( 'Before', 'photo comparison', 'hamista-core' ),
				'type'    => Controls_Manager::MEDIA,
				'default' => array( 'url' => Utils::get_placeholder_image_src() ),
				'dynamic' => array( 'active' => true ),
			)
		);
		$this->add_control(
			'after',
			array(
				'label'   => _x( 'After', 'photo comparison', 'hamista-core' ),
				'type'    => Controls_Manager::MEDIA,
				'default' => array( 'url' => Utils::get_placeholder_image_src() ),
				'dynamic' => array( 'active' => true ),
			)
		);
		$this->add_group_control(
			Group_Control_Image_Size::get_type(),
			array(
				'name'    => 'image',
				'default' => 'large',
			)
		);
		$this->add_control(
			'before_label',
			array(
				'label'     => __( '"Before" label', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => _x( 'Before', 'photo comparison', 'hamista-core' ),
				'separator' => 'before',
			)
		);
		$this->add_control(
			'after_label',
			array(
				'label'   => __( '"After" label', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => _x( 'After', 'photo comparison', 'hamista-core' ),
			)
		);
		$this->add_control(
			'caption',
			array(
				'label'       => __( 'Caption', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'label_block' => true,
				'placeholder' => __( 'e.g. Composite veneers, two sessions', 'hamista-core' ),
			)
		);
		$this->add_control(
			'start',
			array(
				'label'   => __( 'Divider start position', 'hamista-core' ),
				'type'    => Controls_Manager::SLIDER,
				'range'   => array(
					'%' => array(
						'min' => 5,
						'max' => 95,
					),
				),
				'default' => array(
					'unit' => '%',
					'size' => 50,
				),
			)
		);
		$this->add_responsive_control(
			'ratio',
			array(
				'label'     => __( 'Aspect ratio', 'hamista-core' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => '4/3',
				'options'   => array(
					'1/1'  => '1:1',
					'4/3'  => '4:3',
					'3/2'  => '3:2',
					'16/9' => '16:9',
					'3/4'  => '3:4',
				),
				'selectors' => array( '{{WRAPPER}} .hm-ba__frame' => 'aspect-ratio: {{VALUE}};' ),
			)
		);
		$this->add_control(
			'radius',
			array(
				'label'      => __( 'Corner radius', 'hamista-core' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px' ),
				'range'      => array(
					'px' => array(
						'min' => 0,
						'max' => 48,
					),
				),
				'selectors'  => array( '{{WRAPPER}} .hm-ba__frame' => 'border-radius: {{SIZE}}{{UNIT}};' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Image tag for one side.
	 *
	 * @param array  $s     Settings.
	 * @param string $key   before|after.
	 * @param string $class Class.
	 * @return string
	 */
	private function image( $s, $key, $class ) {
		$media = $s[ $key ] ?? array();
		$alt   = (string) $s[ $key . '_label' ];
		if ( ! empty( $media['id'] ) ) {
			$size = 'custom' === ( $s['image_size'] ?? '' ) ? 'large' : ( $s['image_size'] ?? 'large' );
			$html = wp_get_attachment_image(
				(int) $media['id'],
				$size,
				false,
				array(
					'class'     => $class,
					'alt'       => $alt,
					'loading'   => 'lazy',
					'decoding'  => 'async',
					'draggable' => 'false',
				)
			);
			if ( $html ) {
				return $html;
			}
		}
		return empty( $media['url'] ) ? '' : '<img class="' . esc_attr( $class ) . '" src="' . esc_url( $media['url'] ) . '" alt="' . esc_attr( $alt ) . '" loading="lazy" decoding="async" draggable="false">';
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s     = $this->get_settings_for_display();
		$start = isset( $s['start']['size'] ) ? max( 5, min( 95, (int) $s['start']['size'] ) ) : 50;
		$id    = 'hm-ba-' . $this->get_id();
		echo '<figure class="hm-ba" data-hm-widget="compare" style="--hm-ba: ' . esc_attr( (string) $start ) . '%">';
		echo '<div class="hm-ba__frame">';
		echo $this->image( $s, 'after', 'hm-ba__img hm-ba__img--after' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- core image markup / escaped.
		echo '<div class="hm-ba__before">' . $this->image( $s, 'before', 'hm-ba__img' ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- core image markup / escaped.
		if ( '' !== (string) $s['before_label'] ) {
			echo '<span class="hm-ba__tag hm-ba__tag--before" aria-hidden="true">' . esc_html( $s['before_label'] ) . '</span>';
		}
		if ( '' !== (string) $s['after_label'] ) {
			echo '<span class="hm-ba__tag hm-ba__tag--after" aria-hidden="true">' . esc_html( $s['after_label'] ) . '</span>';
		}
		echo '<span class="hm-ba__line" aria-hidden="true"><span class="hm-ba__knob">' . hamista_core_icon( 'chevron-r', array( 'size' => 14 ) ) . hamista_core_icon( 'chevron-l', array( 'size' => 14 ) ) . '</span></span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG.
		printf(
			'<input type="range" class="hm-ba__range" id="%1$s" min="0" max="100" step="1" value="%2$d" dir="ltr" aria-label="%3$s">',
			esc_attr( $id ),
			(int) $start,
			esc_attr(
				sprintf(
					/* translators: 1: before label, 2: after label */
					__( 'Drag to compare %1$s and %2$s', 'hamista-core' ),
					$s['before_label'] ? $s['before_label'] : _x( 'Before', 'photo comparison', 'hamista-core' ),
					$s['after_label'] ? $s['after_label'] : _x( 'After', 'photo comparison', 'hamista-core' )
				)
			)
		);
		echo '</div>';
		if ( '' !== (string) $s['caption'] ) {
			echo '<figcaption class="hm-ba__caption">' . esc_html( $s['caption'] ) . '</figcaption>';
		}
		echo '</figure>';
	}
}
