<?php
/**
 * Button: theme-styled button(s) with magnetic hover.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Button widget.
 */
class Button extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-button';
	}

	/** @return string */
	public function get_title() {
		return __( 'Buttons', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-button';
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_buttons', array( 'label' => __( 'Buttons', 'hamista-core' ) ) );
		$this->add_button_controls( 'btn1', __( 'First button', 'hamista-core' ), array( 'text' => __( 'Get started', 'hamista-core' ) ) );
		$this->add_button_controls(
			'btn2',
			__( 'Second button', 'hamista-core' ),
			array(
				'text'  => '',
				'style' => 'secondary',
			)
		);
		$this->add_control(
			'size',
			array(
				'label'     => __( 'Size', 'hamista-core' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => '',
				'separator' => 'before',
				'options'   => array(
					'sm' => __( 'Small', 'hamista-core' ),
					''   => __( 'Default', 'hamista-core' ),
					'lg' => __( 'Large', 'hamista-core' ),
				),
			)
		);
		$this->add_responsive_control(
			'align',
			array(
				'label'     => __( 'Alignment', 'hamista-core' ),
				'type'      => Controls_Manager::CHOOSE,
				'options'   => array(
					'flex-start' => array(
						'title' => __( 'Start', 'hamista-core' ),
						'icon'  => is_rtl() ? 'eicon-h-align-right' : 'eicon-h-align-left',
					),
					'center'     => array(
						'title' => __( 'Center', 'hamista-core' ),
						'icon'  => 'eicon-h-align-center',
					),
					'flex-end'   => array(
						'title' => __( 'End', 'hamista-core' ),
						'icon'  => is_rtl() ? 'eicon-h-align-left' : 'eicon-h-align-right',
					),
				),
				'selectors' => array( '{{WRAPPER}} .hm-btn-row' => 'justify-content: {{VALUE}};' ),
			)
		);
		$this->add_control(
			'mobile_full',
			array(
				'label'        => __( 'Full width on phones', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s    = $this->get_settings_for_display();
		$args = array( 'size' => $s['size'] );
		echo '<div class="hm-btn-row' . ( 'yes' === $s['mobile_full'] ? ' hm-btn-row--stack' : '' ) . '">';
		echo $this->render_button( $s, 'btn1', $args ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $this->render_button( $s, 'btn2', $args ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '</div>';
	}
}
