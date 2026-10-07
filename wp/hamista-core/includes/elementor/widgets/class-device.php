<?php
/**
 * Device: a hardware mockup built entirely in CSS (monitor, rack unit, synth,
 * phone) with a live-looking dashboard screen or your own screenshot.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Device widget.
 */
class Device extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-device';
	}

	/** @return string */
	public function get_title() {
		return __( 'Device Mockup', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-device-desktop';
	}

	/**
	 * Variant choices.
	 *
	 * @return array
	 */
	public static function variants() {
		return array(
			'monitor' => __( 'Monitor', 'hamista-core' ),
			'rack'    => __( 'Rack unit', 'hamista-core' ),
			'synth'   => __( 'Synth / controller', 'hamista-core' ),
			'phone'   => __( 'Phone', 'hamista-core' ),
		);
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_device', array( 'label' => __( 'Device', 'hamista-core' ) ) );
		$this->add_control(
			'variant',
			array(
				'label'   => __( 'Device', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'monitor',
				'options' => self::variants(),
			)
		);
		$this->add_control(
			'image',
			array(
				'label'       => __( 'Screen image', 'hamista-core' ),
				'type'        => Controls_Manager::MEDIA,
				'description' => __( 'Leave empty to show the built-in animated dashboard.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'label',
			array(
				'label'   => __( 'Status label', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => 'SYSTEM ONLINE',
			)
		);
		$this->add_control(
			'screen_title',
			array(
				'label'     => __( 'Dashboard title', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => 'OUTPUT / CH-01',
				'condition' => array( 'image[url]' => '' ),
			)
		);
		$this->add_control(
			'screen_value',
			array(
				'label'     => __( 'Dashboard value', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => '98.6',
				'condition' => array( 'image[url]' => '' ),
			)
		);
		$this->add_control(
			'screen_unit',
			array(
				'label'     => __( 'Value unit', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => '%',
				'condition' => array( 'image[url]' => '' ),
			)
		);
		$this->add_control(
			'float',
			array(
				'label'        => __( 'Float gently', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->add_responsive_control(
			'max_width',
			array(
				'label'      => __( 'Max width', 'hamista-core' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px', '%' ),
				'range'      => array(
					'px' => array(
						'min' => 200,
						'max' => 1200,
					),
				),
				'selectors'  => array( '{{WRAPPER}} .hm-device' => 'max-width: {{SIZE}}{{UNIT}};' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s = $this->get_settings_for_display();
		// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped inside render_device().
		echo self::render_device(
			array(
				'variant' => $s['variant'],
				'image'   => $s['image'],
				'label'   => $s['label'],
				'title'   => $s['screen_title'],
				'value'   => $s['screen_value'],
				'unit'    => $s['screen_unit'],
				'float'   => 'yes' === $s['float'],
			)
		);
		// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Device markup (shared with the Hero widget).
	 *
	 * @param array $args variant, image, label, title, value, unit, float.
	 * @return string
	 */
	public static function render_device( $args ) {
		$args    = wp_parse_args(
			$args,
			array(
				'variant' => 'monitor',
				'image'   => array(),
				'label'   => 'SYSTEM ONLINE',
				'title'   => 'OUTPUT / CH-01',
				'value'   => '98.6',
				'unit'    => '%',
				'float'   => true,
			)
		);
		$variant = array_key_exists( $args['variant'], self::variants() ) ? $args['variant'] : 'monitor';
		$screen  = hamista_core_image(
			$args['image'],
			'large',
			array(
				'loading' => 'eager',
				'class'   => 'hm-device__img',
			)
		);
		if ( ! $screen ) {
			$screen = self::dashboard( $args );
		}

		$label = $args['label'] ? '<span class="hm-device__status"><i class="hm-led"></i><span>' . esc_html( $args['label'] ) . '</span></span>' : '';
		$vents = '<span class="hm-vents" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';

		$html = '<div class="hm-device hm-device--' . esc_attr( $variant ) . ( $args['float'] ? ' is-float' : '' ) . '" aria-hidden="true">';

		switch ( $variant ) {
			case 'rack':
				$html .= '<div class="hm-device__body hm-bolted">' . $label
					. '<div class="hm-device__screen">' . $screen . '<span class="hm-device__scan"></span></div>'
					. '<div class="hm-device__knobs"><span class="hm-knob"></span><span class="hm-knob hm-knob--sm"></span></div>'
					. '<div class="hm-device__keys"><i></i><i></i><i class="is-on"></i><i></i></div>' . $vents . '</div>';
				break;

			case 'synth':
				$keys  = str_repeat( '<i></i>', 14 );
				$html .= '<div class="hm-device__body">' . $label
					. '<div class="hm-device__top"><div class="hm-device__screen">' . $screen . '<span class="hm-device__scan"></span></div>'
					. '<div class="hm-device__knobs"><span class="hm-knob hm-knob--blue"></span><span class="hm-knob hm-knob--green"></span><span class="hm-knob"></span><span class="hm-knob hm-knob--red"></span></div></div>'
					. '<div class="hm-device__keybed">' . $keys . '</div></div>';
				break;

			case 'phone':
				$html .= '<div class="hm-device__body"><span class="hm-device__notch"></span><div class="hm-device__screen">' . $screen . '</div></div>';
				break;

			default:
				$html .= '<div class="hm-device__body"><div class="hm-device__screen">' . $screen . '<span class="hm-device__scan"></span></div>'
					. '<div class="hm-device__chin">' . $label . '<span class="hm-device__btns"><i></i><i></i><i class="is-power"></i></span></div></div>'
					. '<div class="hm-device__stand"></div>';
		}

		return $html . '</div>';
	}

	/**
	 * Built-in animated dashboard screen.
	 *
	 * @param array $args title, value, unit.
	 * @return string
	 */
	private static function dashboard( $args ) {
		$bars = '';
		foreach ( array( 34, 52, 41, 63, 48, 72, 58, 81, 66, 90, 74, 96 ) as $i => $h ) {
			$bars .= '<i style="--h:' . (int) $h . '%;--i:' . (int) $i . '"></i>';
		}
		return '<div class="hm-dash">'
			. '<div class="hm-dash__head"><span>' . esc_html( $args['title'] ) . '</span><span class="hm-dash__rec"><i></i>REC</span></div>'
			. '<div class="hm-dash__value"><b>' . esc_html( $args['value'] ) . '</b><small>' . esc_html( $args['unit'] ) . '</small></div>'
			. '<div class="hm-dash__bars">' . $bars . '</div>'
			. '<div class="hm-dash__rows"><span><i class="hm-led"></i>CPU 42°</span><span><i class="hm-led hm-led--amber"></i>BUF 128</span><span class="hm-dash__spin"></span></div>'
			. '</div>';
	}
}
