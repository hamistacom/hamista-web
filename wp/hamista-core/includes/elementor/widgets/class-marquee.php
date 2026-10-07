<?php
/**
 * Marquee: an endless band of words or logos that speeds up with the scroll.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Group_Control_Typography;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Marquee widget.
 */
class Marquee extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-marquee';
	}

	/** @return string */
	public function get_title() {
		return __( 'Marquee', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-animation';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'marquee', 'ticker', 'logos', 'clients', 'scrolling text' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_items', array( 'label' => __( 'Items', 'hamista-core' ) ) );
		$items = new Repeater();
		$items->add_control(
			'text',
			array(
				'label'   => __( 'Text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Product design', 'hamista-core' ),
			)
		);
		$items->add_control(
			'image',
			array(
				'label'       => __( 'Logo / image (optional)', 'hamista-core' ),
				'type'        => Controls_Manager::MEDIA,
				'description' => __( 'When set, the image is shown instead of the text (the text becomes its alt text).', 'hamista-core' ),
			)
		);
		$this->add_control(
			'items',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $items->get_controls(),
				'title_field' => '{{{ text }}}',
				'default'     => array(
					array( 'text' => __( 'Product design', 'hamista-core' ) ),
					array( 'text' => __( 'Web development', 'hamista-core' ) ),
					array( 'text' => __( 'Applied AI', 'hamista-core' ) ),
					array( 'text' => __( 'Digital business', 'hamista-core' ) ),
				),
			)
		);
		$this->add_control(
			'separator',
			array(
				'label'   => __( 'Separator', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'dot',
				'options' => array(
					'dot'   => '●',
					'slash' => '/',
					'dash'  => '—',
					'plus'  => '+',
					'none'  => __( 'None', 'hamista-core' ),
				),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_motion', array( 'label' => __( 'Motion & look', 'hamista-core' ) ) );
		$this->add_control(
			'size',
			array(
				'label'   => __( 'Size', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'lg',
				'options' => array(
					'sm' => __( 'Small', 'hamista-core' ),
					'md' => __( 'Medium', 'hamista-core' ),
					'lg' => __( 'Large', 'hamista-core' ),
					'xl' => __( 'Giant', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'look',
			array(
				'label'   => __( 'Text look', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'alternate',
				'options' => array(
					'solid'     => __( 'Solid', 'hamista-core' ),
					'muted'     => __( 'Muted', 'hamista-core' ),
					'alternate' => __( 'Alternate solid / muted', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'speed',
			array(
				'label'   => __( 'Speed (px/s)', 'hamista-core' ),
				'type'    => Controls_Manager::SLIDER,
				'default' => array( 'size' => 60 ),
				'range'   => array(
					'px' => array(
						'min' => 10,
						'max' => 240,
					),
				),
			)
		);
		$this->add_control(
			'reverse',
			array(
				'label'        => __( 'Reverse direction', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
			)
		);
		$this->add_control(
			'follow',
			array(
				'label'        => __( 'Follow scroll direction', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->add_control(
			'pause',
			array(
				'label'        => __( 'Pause on hover', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
			)
		);
		$this->add_control(
			'bordered',
			array(
				'label'        => __( 'Top and bottom rules', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->add_control(
			'tilt',
			array(
				'label'     => __( 'Tilt', 'hamista-core' ),
				'type'      => Controls_Manager::SLIDER,
				'default'   => array( 'size' => 0 ),
				'range'     => array(
					'px' => array(
						'min'  => -6,
						'max'  => 6,
						'step' => 0.5,
					),
				),
				'selectors' => array( '{{WRAPPER}} .hm-marquee' => 'transform: rotate({{SIZE}}deg);' ),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section(
			'section_style',
			array(
				'label' => __( 'Text', 'hamista-core' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);
		$this->add_control(
			'color',
			array(
				'label'     => __( 'Color', 'hamista-core' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array( '{{WRAPPER}} .hm-marquee' => 'color: {{VALUE}};' ),
			)
		);
		$this->add_control(
			'band_bg',
			array(
				'label'     => __( 'Band background', 'hamista-core' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array( '{{WRAPPER}} .hm-marquee' => 'background-color: {{VALUE}};' ),
			)
		);
		$this->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'     => 'typography',
				'selector' => '{{WRAPPER}} .hm-marquee__item',
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s    = $this->get_settings_for_display();
		$seps = array(
			'dot'   => '●',
			'slash' => '/',
			'dash'  => '—',
			'plus'  => '+',
			'none'  => '',
		);
		$sep  = $seps[ $s['separator'] ] ?? '';

		$attrs  = ' data-hm-widget="marquee" data-speed="' . esc_attr( $s['speed']['size'] ?? 60 ) . '"';
		$attrs .= 'yes' === $s['reverse'] ? ' data-direction="reverse"' : '';
		$attrs .= 'yes' === $s['follow'] ? ' data-follow-scroll' : '';
		$attrs .= 'yes' === $s['pause'] ? ' data-pause-hover' : '';
		$class  = 'hm-marquee hm-marquee--' . sanitize_html_class( $s['size'] ) . ' hm-marquee--' . sanitize_html_class( $s['look'] );
		$class .= 'yes' === $s['bordered'] ? ' hm-marquee--ruled' : '';

		echo '<div class="' . esc_attr( $class ) . '"' . $attrs . '><div class="hm-marquee__track"><div class="hm-marquee__group">'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		foreach ( $s['items'] as $item ) {
			$img = hamista_core_image(
				$item['image'],
				'medium',
				array(
					'alt'   => $item['text'],
					'class' => 'hm-marquee__logo',
				)
			);
			echo '<span class="hm-marquee__item">' . ( $img ? $img : esc_html( $item['text'] ) ) . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			if ( $sep ) {
				echo '<span class="hm-marquee__sep" aria-hidden="true">' . esc_html( $sep ) . '</span>';
			}
		}
		echo '</div></div></div>';
	}
}
