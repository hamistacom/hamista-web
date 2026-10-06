<?php
/**
 * "Hamista Motion" panel on every Elementor widget and container
 * (Advanced tab): entrance, parallax, scroll scrub, sticky, tilt, magnetic.
 *
 * Settings become one `data-hm-motion` JSON attribute read by the engine.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor;

use Elementor\Controls_Manager;

defined( 'ABSPATH' ) || exit;

/**
 * Motion controls.
 */
class Motion {

	/**
	 * Hooks.
	 */
	public static function init() {
		add_action( 'elementor/element/after_section_end', array( __CLASS__, 'add_controls' ), 10, 2 );
		foreach ( array( 'widget', 'container', 'section', 'column' ) as $type ) {
			add_action( "elementor/frontend/{$type}/before_render", array( __CLASS__, 'before_render' ) );
		}
	}

	/**
	 * Add the panel right after Elementor's own "Motion Effects" section.
	 *
	 * @param \Elementor\Element_Base $element    Element.
	 * @param string                  $section_id Section that just closed.
	 */
	public static function add_controls( $element, $section_id ) {
		if ( 'section_effects' !== $section_id ) {
			return;
		}

		$element->start_controls_section(
			'hm_motion_section',
			array(
				'label' => __( 'Hamista Motion', 'hamista-core' ),
				'tab'   => Controls_Manager::TAB_ADVANCED,
			)
		);

		$element->add_control(
			'hm_in',
			array(
				'label'   => __( 'Entrance', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '',
				'options' => array(
					''        => __( 'None', 'hamista-core' ),
					'up'      => __( 'Rise', 'hamista-core' ),
					'down'    => __( 'Drop', 'hamista-core' ),
					'start'   => __( 'Slide from start', 'hamista-core' ),
					'end'     => __( 'Slide from end', 'hamista-core' ),
					'fade'    => __( 'Fade', 'hamista-core' ),
					'scale'   => __( 'Scale up', 'hamista-core' ),
					'blur'    => __( 'Blur in', 'hamista-core' ),
					'clip-up' => __( 'Wipe up (images)', 'hamista-core' ),
					'clip-x'  => __( 'Wipe sideways (images)', 'hamista-core' ),
					'words'   => __( 'Words rise (headings)', 'hamista-core' ),
				),
			)
		);
		$element->add_control(
			'hm_in_delay',
			array(
				'label'     => __( 'Delay (s)', 'hamista-core' ),
				'type'      => Controls_Manager::NUMBER,
				'min'       => 0,
				'max'       => 3,
				'step'      => 0.05,
				'default'   => '',
				'condition' => array( 'hm_in!' => '' ),
			)
		);
		$element->add_control(
			'hm_in_duration',
			array(
				'label'     => __( 'Duration (s)', 'hamista-core' ),
				'type'      => Controls_Manager::NUMBER,
				'min'       => 0.2,
				'max'       => 3,
				'step'      => 0.05,
				'default'   => '',
				'condition' => array( 'hm_in!' => '' ),
			)
		);

		$element->add_control(
			'hm_parallax',
			array(
				'label'       => __( 'Scroll parallax', 'hamista-core' ),
				'description' => __( 'Negative values move against the scroll.', 'hamista-core' ),
				'type'        => Controls_Manager::SLIDER,
				'range'       => array(
					'px' => array(
						'min'  => -1,
						'max'  => 1,
						'step' => 0.05,
					),
				),
				'separator'   => 'before',
			)
		);

		$element->add_control(
			'hm_scrub',
			array(
				'label'        => __( 'Scroll-linked entrance', 'hamista-core' ),
				'description'  => __( 'Animates with the scroll position instead of once.', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'separator'    => 'before',
			)
		);
		$scrub = array(
			'hm_scrub_opacity' => array( __( 'Start opacity', 'hamista-core' ), 0, 1, 0.05, 0 ),
			'hm_scrub_y'       => array( __( 'Start offset Y (px)', 'hamista-core' ), -400, 400, 5, 80 ),
			'hm_scrub_x'       => array( __( 'Start offset X (px)', 'hamista-core' ), -400, 400, 5, 0 ),
			'hm_scrub_scale'   => array( __( 'Start scale', 'hamista-core' ), 0.3, 1.6, 0.01, 1 ),
			'hm_scrub_rotate'  => array( __( 'Start rotation (°)', 'hamista-core' ), -45, 45, 1, 0 ),
			'hm_scrub_blur'    => array( __( 'Start blur (px)', 'hamista-core' ), 0, 30, 1, 0 ),
		);
		foreach ( $scrub as $id => $c ) {
			$element->add_control(
				$id,
				array(
					'label'     => $c[0],
					'type'      => Controls_Manager::NUMBER,
					'min'       => $c[1],
					'max'       => $c[2],
					'step'      => $c[3],
					'default'   => $c[4],
					'condition' => array( 'hm_scrub' => 'yes' ),
				)
			);
		}

		$element->add_control(
			'hm_sticky',
			array(
				'label'        => __( 'Sticky inside parent', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'separator'    => 'before',
			)
		);
		$element->add_control(
			'hm_sticky_offset',
			array(
				'label'     => __( 'Sticky offset (px)', 'hamista-core' ),
				'type'      => Controls_Manager::NUMBER,
				'default'   => 100,
				'condition' => array( 'hm_sticky' => 'yes' ),
				'selectors' => array(
					'{{WRAPPER}}' => 'position: sticky; top: {{VALUE}}px; align-self: flex-start; z-index: 2;',
				),
			)
		);

		$element->add_control(
			'hm_tilt',
			array(
				'label'        => __( '3D tilt on hover', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'separator'    => 'before',
			)
		);
		$element->add_control(
			'hm_magnetic',
			array(
				'label'        => __( 'Magnetic (follows the cursor)', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
			)
		);

		$element->end_controls_section();
	}

	/**
	 * Print data attributes and make sure the engine loads.
	 *
	 * @param \Elementor\Element_Base $element Element.
	 */
	public static function before_render( $element ) {
		$s      = $element->get_settings_for_display();
		$motion = array();

		if ( ! empty( $s['hm_in'] ) ) {
			$motion['in'] = $s['hm_in'];
			if ( '' !== ( $s['hm_in_delay'] ?? '' ) ) {
				$motion['d'] = (float) $s['hm_in_delay'];
			}
			if ( '' !== ( $s['hm_in_duration'] ?? '' ) ) {
				$motion['t'] = (float) $s['hm_in_duration'];
			}
		}
		if ( ! empty( $s['hm_parallax']['size'] ) ) {
			$motion['px'] = (float) $s['hm_parallax']['size'];
		}
		if ( ! empty( $s['hm_scrub'] ) ) {
			$motion['sc'] = array(
				'o' => (float) ( $s['hm_scrub_opacity'] ?? 0 ),
				'y' => (float) ( $s['hm_scrub_y'] ?? 0 ),
				'x' => (float) ( $s['hm_scrub_x'] ?? 0 ),
				's' => (float) ( $s['hm_scrub_scale'] ?? 1 ),
				'r' => (float) ( $s['hm_scrub_rotate'] ?? 0 ),
				'b' => (float) ( $s['hm_scrub_blur'] ?? 0 ),
			);
		}
		if ( ! empty( $s['hm_tilt'] ) ) {
			$motion['tilt'] = 1;
		}
		if ( ! empty( $s['hm_magnetic'] ) ) {
			$motion['mag'] = 1;
		}

		if ( $motion ) {
			$element->add_render_attribute( '_wrapper', 'data-hm-motion', wp_json_encode( $motion ) );
			wp_enqueue_script( 'hamista-motion' );
			wp_enqueue_style( 'hamista-widgets' );
		}
	}
}
