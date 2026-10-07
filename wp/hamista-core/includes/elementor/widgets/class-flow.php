<?php
/**
 * Flow: a headline surrounded by floating elements (images, chips, cards) at
 * different depths. They drift with the scroll, lean toward the pointer, or
 * fly in from around the camera and settle into place.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Flow widget.
 */
class Flow extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-flow';
	}

	/** @return string */
	public function get_title() {
		return __( 'Floating Elements', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-parallax';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'float', 'flow', 'parallax', 'depth', 'gallery', 'motion' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_header', array( 'label' => __( 'Heading', 'hamista-core' ) ) );
		$this->add_header_controls(
			array(
				'eyebrow' => __( 'In motion', 'hamista-core' ),
				'title'   => __( 'Ideas that *move*', 'hamista-core' ),
				'align'   => 'center',
				'size'    => 'xl',
			),
			false
		);
		$this->add_button_controls( 'btn1', __( 'Button', 'hamista-core' ), array( 'text' => '' ) );
		$this->end_controls_section();

		$this->start_controls_section( 'section_items', array( 'label' => __( 'Floating elements', 'hamista-core' ) ) );
		$items = new Repeater();
		$items->add_control(
			'image',
			array(
				'label' => __( 'Image', 'hamista-core' ),
				'type'  => Controls_Manager::MEDIA,
			)
		);
		$items->add_control(
			'text',
			array(
				'label'       => __( 'Text (when there is no image)', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'label_block' => true,
			)
		);
		$items->add_control(
			'shape',
			array(
				'label'   => __( 'Shape', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'card',
				'options' => array(
					'card'   => __( 'Rounded card', 'hamista-core' ),
					'circle' => __( 'Circle', 'hamista-core' ),
					'pill'   => __( 'Pill', 'hamista-core' ),
					'tall'   => __( 'Tall card', 'hamista-core' ),
				),
			)
		);
		foreach ( array(
			'x'     => array( __( 'Horizontal position (%)', 'hamista-core' ), 0, 100, 1, 50 ),
			'y'     => array( __( 'Vertical position (%)', 'hamista-core' ), 0, 100, 1, 50 ),
			'size'  => array( __( 'Width (px)', 'hamista-core' ), 60, 480, 5, 180 ),
			'depth' => array( __( 'Depth (closer = faster)', 'hamista-core' ), -1, 1.5, 0.05, 0.5 ),
			'rot'   => array( __( 'Rotation (°)', 'hamista-core' ), -30, 30, 1, 0 ),
		) as $key => $c ) {
			$items->add_control(
				$key,
				array(
					'label'   => $c[0],
					'type'    => Controls_Manager::SLIDER,
					'default' => array( 'size' => $c[4] ),
					'range'   => array(
						'px' => array(
							'min'  => $c[1],
							'max'  => $c[2],
							'step' => $c[3],
						),
					),
				)
			);
		}
		$items->add_control(
			'mobile',
			array(
				'label'        => __( 'Show on phones', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$defaults = array();
		foreach ( array( array( 12, 22, 200, 0.6, -6 ), array( 84, 18, 170, 0.9, 5 ), array( 20, 74, 160, 1.1, 4 ), array( 78, 78, 220, 0.4, -4 ), array( 50, 8, 120, 0.2, 0 ) ) as $d ) {
			$defaults[] = array(
				'shape' => 'card',
				'x'     => array( 'size' => $d[0] ),
				'y'     => array( 'size' => $d[1] ),
				'size'  => array( 'size' => $d[2] ),
				'depth' => array( 'size' => $d[3] ),
				'rot'   => array( 'size' => $d[4] ),
			);
		}
		$this->add_control(
			'items',
			array(
				'label'       => __( 'Elements', 'hamista-core' ),
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $items->get_controls(),
				'title_field' => '{{{ text || "◻︎" }}}',
				'default'     => $defaults,
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_motion', array( 'label' => __( 'Motion', 'hamista-core' ) ) );
		$this->add_control(
			'mode',
			array(
				'label'   => __( 'Motion', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'drift',
				'options' => array(
					'drift'    => __( 'Drift: layers move at different speeds', 'hamista-core' ),
					'converge' => __( 'Converge: fly in and settle', 'hamista-core' ),
					'disperse' => __( 'Disperse: fly apart when leaving', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'strength',
			array(
				'label'   => __( 'Strength', 'hamista-core' ),
				'type'    => Controls_Manager::SLIDER,
				'default' => array( 'size' => 1 ),
				'range'   => array(
					'px' => array(
						'min'  => 0.3,
						'max'  => 2,
						'step' => 0.1,
					),
				),
			)
		);
		$this->add_control(
			'float',
			array(
				'label'        => __( 'Gentle idle float', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->add_responsive_control(
			'height',
			array(
				'label'      => __( 'Height', 'hamista-core' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'vh', 'px' ),
				'default'    => array(
					'unit' => 'vh',
					'size' => 110,
				),
				'range'      => array(
					'vh' => array(
						'min' => 50,
						'max' => 200,
					),
					'px' => array(
						'min' => 400,
						'max' => 1600,
					),
				),
				'selectors'  => array( '{{WRAPPER}} .hm-flow' => 'min-height: {{SIZE}}{{UNIT}};' ),
			)
		);
		$this->add_control(
			'scheme',
			array(
				'label'   => __( 'Colour scheme', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '',
				'options' => array(
					''        => __( 'Page colours', 'hamista-core' ),
					'surface' => __( 'Soft surface', 'hamista-core' ),
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
		$s     = $this->get_settings_for_display();
		$mode  = in_array( $s['mode'] ?? 'drift', array( 'drift', 'converge', 'disperse' ), true ) ? $s['mode'] : 'drift';
		$class = 'hm-flow hm-flow--' . $mode . ( 'yes' === ( $s['float'] ?? 'yes' ) ? ' hm-flow--float' : '' ) . ( ! empty( $s['scheme'] ) ? ' hm-scheme-' . sanitize_html_class( $s['scheme'] ) : '' );

		printf( '<section class="%1$s" data-hm-widget="flow" data-mode="%2$s" data-strength="%3$s">', esc_attr( $class ), esc_attr( $mode ), esc_attr( (string) ( $s['strength']['size'] ?? 1 ) ) );
		echo '<div class="hm-flow__field" aria-hidden="true">';
		foreach ( (array) $s['items'] as $i => $item ) {
			$x     = (float) ( $item['x']['size'] ?? 50 );
			$y     = (float) ( $item['y']['size'] ?? 50 );
			$w     = (float) ( $item['size']['size'] ?? 180 );
			$depth = (float) ( $item['depth']['size'] ?? 0.5 );
			$rot   = (float) ( $item['rot']['size'] ?? 0 );
			$shape = in_array( $item['shape'] ?? 'card', array( 'card', 'circle', 'pill', 'tall' ), true ) ? $item['shape'] : 'card';
			$img   = hamista_core_image(
				$item['image'] ?? array(),
				'medium_large',
				array(
					'sizes' => '(max-width: 760px) 40vw, ' . (int) $w . 'px',
					'alt'   => '',
				)
			);
			$inner = $img ? $img : '<span class="hm-flow__text">' . esc_html( $item['text'] ?? '' ) . '</span>';
			printf(
				'<div class="hm-flow__item hm-flow__item--%1$s%2$s%3$s%11$s" data-x="%4$s" data-y="%5$s" data-depth="%6$s" data-rot="%7$s" style="--x:%4$s%%;--y:%5$s%%;--w:%8$spx;--d:%6$s;--i:%9$d;--r:%7$sdeg"><div class="hm-flow__in">%10$s</div></div>',
				esc_attr( $shape ),
				$img ? '' : ' is-text',
				'yes' === ( $item['mobile'] ?? 'yes' ) ? '' : ' hm-hide-phone',
				esc_attr( (string) $x ),
				esc_attr( (string) $y ),
				esc_attr( (string) $depth ),
				esc_attr( (string) $rot ),
				esc_attr( (string) $w ),
				(int) $i,
				$inner, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from escaped parts.
				$depth < 0.25 ? ' is-far' : ''
			);
		}
		echo '</div><div class="hm-flow__center hm-container">';
		echo $this->render_header( $s ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $this->render_button( $s, 'btn1', array( 'size' => 'lg' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '</div></section>';
	}
}
