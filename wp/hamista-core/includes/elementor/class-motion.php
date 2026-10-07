<?php
/**
 * "Hamista Motion" panel on every Elementor widget and container
 * (Advanced tab): entrance, parallax, scroll scrub, sticky, tilt, magnetic,
 * scroll zoom; and for containers card motions, scroll colour and a light line.
 *
 * Settings become `data-hm-*` attributes read by the engine and, for the
 * scroll effects, by scroll-fx.js, which loads only where one is used.
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

		$element->add_control(
			'hm_zoom',
			array(
				'label'     => __( 'Scroll zoom', 'hamista-core' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => '',
				'separator' => 'before',
				'options'   => array(
					''        => __( 'None', 'hamista-core' ),
					'in'      => __( 'Zoom in (grows into place)', 'hamista-core' ),
					'out'     => __( 'Zoom out (settles from close up)', 'hamista-core' ),
					'expand'  => __( 'Open out to full width', 'hamista-core' ),
					'shrink'  => __( 'Close into a card as it leaves', 'hamista-core' ),
					'through' => __( 'Fly through as it leaves', 'hamista-core' ),
				),
			)
		);
		$element->add_control(
			'hm_zoom_amount',
			array(
				'label'     => __( 'Zoom amount', 'hamista-core' ),
				'type'      => Controls_Manager::SLIDER,
				'range'     => array(
					'px' => array(
						'min'  => 0.05,
						'max'  => 0.6,
						'step' => 0.01,
					),
				),
				'default'   => array(
					'unit' => 'px',
					'size' => 0.2,
				),
				'condition' => array( 'hm_zoom!' => '' ),
			)
		);
		$element->add_control(
			'hm_zoom_radius',
			array(
				'label'     => __( 'Corner radius of the card (px)', 'hamista-core' ),
				'type'      => Controls_Manager::NUMBER,
				'min'       => 0,
				'max'       => 80,
				'default'   => 24,
				'condition' => array( 'hm_zoom' => array( 'expand', 'shrink' ) ),
			)
		);
		$element->add_control(
			'hm_zoom_inner',
			array(
				'label'        => __( 'Move the image inside the other way', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'condition'    => array( 'hm_zoom' => array( 'in', 'expand', 'shrink' ) ),
			)
		);

		if ( in_array( $element->get_name(), array( 'container', 'section' ), true ) ) {
			self::add_container_controls( $element );
		}

		$element->end_controls_section();
	}

	/**
	 * Controls that act on a whole section: card motions, scroll colour and the light line.
	 *
	 * @param \Elementor\Element_Base $element Container or section.
	 */
	private static function add_container_controls( $element ) {
		$element->add_control(
			'hm_cards',
			array(
				'label'       => __( 'Card motion', 'hamista-core' ),
				'description' => __( 'Moves the items inside this container, or the cards of the single widget inside it, as one group.', 'hamista-core' ),
				'type'        => Controls_Manager::SELECT,
				'default'     => '',
				'separator'   => 'before',
				'options'     => array(
					''        => __( 'None', 'hamista-core' ),
					'cascade' => __( 'Rise one after another', 'hamista-core' ),
					'flip'    => __( 'Flip up one after another', 'hamista-core' ),
					'spread'  => __( 'Deal out from a pile', 'hamista-core' ),
					'gather'  => __( 'Close in from around', 'hamista-core' ),
					'tilt'    => __( 'Lean with the scroll', 'hamista-core' ),
				),
			)
		);

		$element->add_control(
			'hm_tone',
			array(
				'label'       => __( 'Page colour while in view', 'hamista-core' ),
				'description' => __( 'The whole page fades to this colour as the section reaches the middle of the screen. The section\'s own background colour is replaced by it.', 'hamista-core' ),
				'type'        => Controls_Manager::SELECT,
				'default'     => '',
				'separator'   => 'before',
				'options'     => array(
					''        => __( 'Unchanged', 'hamista-core' ),
					'page'    => __( 'Page background', 'hamista-core' ),
					'surface' => __( 'Soft neutral', 'hamista-core' ),
					'soft'    => __( 'Accent tint', 'hamista-core' ),
					'inverse' => __( 'Dark', 'hamista-core' ),
					'accent'  => __( 'Accent colour', 'hamista-core' ),
					'custom'  => __( 'Your own colours', 'hamista-core' ),
				),
			)
		);
		$element->add_control(
			'hm_tone_bg',
			array(
				'label'     => __( 'Background', 'hamista-core' ),
				'type'      => Controls_Manager::COLOR,
				'condition' => array( 'hm_tone' => 'custom' ),
			)
		);
		$element->add_control(
			'hm_tone_fg',
			array(
				'label'     => __( 'Text', 'hamista-core' ),
				'type'      => Controls_Manager::COLOR,
				'condition' => array( 'hm_tone' => 'custom' ),
			)
		);
		$element->add_control(
			'hm_tone_accent',
			array(
				'label'     => __( 'Accent (optional)', 'hamista-core' ),
				'type'      => Controls_Manager::COLOR,
				'condition' => array( 'hm_tone!' => '' ),
			)
		);

		$element->add_control(
			'hm_light',
			array(
				'label'       => __( 'Light line', 'hamista-core' ),
				'description' => __( 'A thread of light that draws itself down the side margins as visitors scroll through the sections inside this container. For the whole page, use Page settings.', 'hamista-core' ),
				'type'        => Controls_Manager::SELECT,
				'default'     => '',
				'separator'   => 'before',
				'options'     => self::light_modes(),
			)
		);
		self::add_light_controls( $element, 'hm_light' );
	}

	/**
	 * Light line paths.
	 *
	 * @return array
	 */
	public static function light_modes() {
		return array(
			''      => __( 'None', 'hamista-core' ),
			'weave' => __( 'Weave from margin to margin', 'hamista-core' ),
			'start' => __( 'Along the start margin', 'hamista-core' ),
			'end'   => __( 'Along the end margin', 'hamista-core' ),
		);
	}

	/**
	 * Colour, width and options of a light line (shared with page settings).
	 *
	 * @param \Elementor\Controls_Stack $stack   Element or document.
	 * @param string                    $prefix  Control ID of the mode select.
	 */
	public static function add_light_controls( $stack, $prefix ) {
		$when = array( $prefix . '!' => '' );
		$stack->add_control(
			$prefix . '_a',
			array(
				'label'     => __( 'First colour', 'hamista-core' ),
				'type'      => Controls_Manager::COLOR,
				'condition' => $when,
			)
		);
		$stack->add_control(
			$prefix . '_b',
			array(
				'label'       => __( 'Second colour', 'hamista-core' ),
				'description' => __( 'The line shifts from the first colour to the second down the page. Empty: the accent colours.', 'hamista-core' ),
				'type'        => Controls_Manager::COLOR,
				'condition'   => $when,
			)
		);
		$stack->add_control(
			$prefix . '_width',
			array(
				'label'     => __( 'Thickness (px)', 'hamista-core' ),
				'type'      => Controls_Manager::SLIDER,
				'range'     => array(
					'px' => array(
						'min'  => 1,
						'max'  => 5,
						'step' => 0.5,
					),
				),
				'default'   => array(
					'unit' => 'px',
					'size' => 2,
				),
				'condition' => $when,
			)
		);
		$stack->add_control(
			$prefix . '_track',
			array(
				'label'        => __( 'Show the path ahead faintly', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => $when,
			)
		);
		$stack->add_control(
			$prefix . '_mobile',
			array(
				'label'        => __( 'Show on phones', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => $when,
			)
		);
	}

	/**
	 * A colour setting as CSS: the picked colour, or the global colour it points to.
	 *
	 * @param \Elementor\Controls_Stack $stack Element or document.
	 * @param array                     $s     Settings.
	 * @param string                    $key   Control ID.
	 * @return string
	 */
	public static function color( $stack, $s, $key ) {
		$globals = (array) $stack->get_settings( '__globals__' );
		if ( ! empty( $globals[ $key ] ) && preg_match( '/id=([\w-]+)/', (string) $globals[ $key ], $m ) ) {
			return 'var(--e-global-color-' . $m[1] . ')';
		}
		$value = isset( $s[ $key ] ) ? (string) $s[ $key ] : '';
		return preg_match( '/^(#[0-9a-f]{3,8}|rgba?\([\d.,%\s]+\)|hsla?\([\d.,%\s]+\))$/i', trim( $value ) ) ? trim( $value ) : '';
	}

	/**
	 * Light line options as the engine reads them, or null when off.
	 *
	 * @param \Elementor\Controls_Stack $stack  Element or document.
	 * @param array                     $s      Settings.
	 * @param string                    $prefix Control ID of the mode select.
	 * @return array|null
	 */
	public static function light_data( $stack, $s, $prefix ) {
		$mode = isset( $s[ $prefix ] ) ? (string) $s[ $prefix ] : '';
		if ( ! array_key_exists( $mode, self::light_modes() ) || '' === $mode ) {
			return null;
		}
		$data = array(
			'mode' => $mode,
			'w'    => isset( $s[ $prefix . '_width' ]['size'] ) ? (float) $s[ $prefix . '_width' ]['size'] : 2,
		);
		foreach ( array( 'a', 'b' ) as $c ) {
			$value = self::color( $stack, $s, $prefix . '_' . $c );
			if ( $value ) {
				$data[ $c ] = $value;
			}
		}
		if ( empty( $s[ $prefix . '_track' ] ) ) {
			$data['track'] = false;
		}
		if ( empty( $s[ $prefix . '_mobile' ] ) ) {
			$data['mobile'] = false;
		}
		return $data;
	}

	/**
	 * Load the scroll effects script (and the widget styles it needs).
	 */
	public static function enqueue_fx() {
		wp_enqueue_script( 'hamista-scroll-fx' );
		wp_enqueue_style( 'hamista-widgets' );
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

		$fx = false;
		if ( ! empty( $s['hm_zoom'] ) && in_array( $s['hm_zoom'], array( 'in', 'out', 'expand', 'shrink', 'through' ), true ) ) {
			$zoom = array(
				'm' => $s['hm_zoom'],
				'a' => isset( $s['hm_zoom_amount']['size'] ) && '' !== $s['hm_zoom_amount']['size'] ? (float) $s['hm_zoom_amount']['size'] : 0.2,
			);
			if ( in_array( $s['hm_zoom'], array( 'expand', 'shrink' ), true ) ) {
				$zoom['r'] = (float) ( $s['hm_zoom_radius'] ?? 24 );
			}
			if ( ! empty( $s['hm_zoom_inner'] ) ) {
				$zoom['inner'] = 1;
			}
			$element->add_render_attribute( '_wrapper', 'data-hm-zoom', wp_json_encode( $zoom ) );
			$fx = true;
		}
		if ( ! empty( $s['hm_cards'] ) && in_array( $s['hm_cards'], array( 'cascade', 'flip', 'spread', 'gather', 'tilt' ), true ) ) {
			$element->add_render_attribute( '_wrapper', 'data-hm-cards', $s['hm_cards'] );
			$fx = true;
		}
		if ( ! empty( $s['hm_tone'] ) && in_array( $s['hm_tone'], array( 'page', 'surface', 'soft', 'inverse', 'accent', 'custom' ), true ) ) {
			$tone = array( 'p' => $s['hm_tone'] );
			foreach ( array( 'bg', 'fg', 'ac' ) as $key ) {
				$value = self::color( $element, $s, 'ac' === $key ? 'hm_tone_accent' : 'hm_tone_' . $key );
				if ( $value ) {
					$tone[ $key ] = $value;
				}
			}
			$element->add_render_attribute( '_wrapper', 'data-hm-tone', wp_json_encode( $tone ) );
			$fx = true;
		}
		$light = self::light_data( $element, $s, 'hm_light' );
		if ( $light ) {
			$element->add_render_attribute( '_wrapper', 'data-hm-light', wp_json_encode( $light ) );
			$fx = true;
		}
		if ( $fx ) {
			self::enqueue_fx();
		}
	}
}
