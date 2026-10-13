<?php
/**
 * Logo grid: client logos in soft tiles, greyed until the pointer reaches
 * them, with an optional button tile at the end ("Join them").
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Logo grid widget.
 */
class Logo_Grid extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-logo-grid';
	}

	/** @return string */
	public function get_title() {
		return __( 'Logo Grid', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-logo';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'logos', 'clients', 'brands', 'partners', 'sponsors' );
	}

	/** @return array */
	public function get_style_depends() {
		return array( 'hamista-widgets', 'hamista-agency' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_logos', array( 'label' => __( 'Logos', 'hamista-core' ) ) );
		$this->add_control(
			'logos',
			array(
				'label' => __( 'Logos', 'hamista-core' ),
				'type'  => Controls_Manager::GALLERY,
			)
		);
		$this->add_responsive_control(
			'columns',
			array(
				'label'          => __( 'Columns', 'hamista-core' ),
				'type'           => Controls_Manager::SELECT,
				'default'        => '6',
				'tablet_default' => '4',
				'mobile_default' => '2',
				'options'        => array(
					'2' => '2',
					'3' => '3',
					'4' => '4',
					'5' => '5',
					'6' => '6',
					'8' => '8',
				),
				'selectors'      => array( '{{WRAPPER}} .hm-logos' => '--hm-logo-cols: {{VALUE}};' ),
			)
		);
		$this->add_control(
			'look',
			array(
				'label'   => __( 'Tiles', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'soft',
				'options' => array(
					'soft'    => __( 'Soft tiles', 'hamista-core' ),
					'outline' => __( 'Outlined tiles', 'hamista-core' ),
					'plain'   => __( 'No tiles', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'btn_text',
			array(
				'label'   => __( 'Button tile text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Join them', 'hamista-core' ),
			)
		);
		$this->add_control(
			'btn_link',
			array(
				'label' => __( 'Button link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s    = $this->get_settings_for_display();
		$look = in_array( $s['look'], array( 'soft', 'outline', 'plain' ), true ) ? $s['look'] : 'soft';
		echo '<ul class="hm-logos hm-logos--' . esc_attr( $look ) . '" data-hm-stagger="0.05">';
		foreach ( (array) $s['logos'] as $logo ) {
			echo '<li class="hm-logos__item" data-hm-reveal="up">' . hamista_core_image( $logo, 'medium', array( 'class' => 'hm-logos__img' ) ) . '</li>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		if ( $s['btn_text'] ) {
			echo '<li class="hm-logos__item hm-logos__item--btn" data-hm-reveal="up">' . self::button_html( $s['btn_text'], $s['btn_link'], 'primary', array( 'size' => 'sm' ) ) . '</li>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		echo '</ul>';
	}
}
