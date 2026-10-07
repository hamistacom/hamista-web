<?php
/**
 * Site logo for Elementor-built headers and footers (light and dark versions
 * come from Hamista → Header).
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Site logo widget.
 */
class Site_Logo extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-site-logo';
	}

	/** @return string */
	public function get_title() {
		return __( 'Site Logo', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-site-logo';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'logo', 'brand', 'header' );
	}

	/** @return bool */
	protected function is_dynamic_content(): bool {
		return true;
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_logo', array( 'label' => __( 'Logo', 'hamista-core' ) ) );
		$this->add_control(
			'note',
			array(
				'type' => Controls_Manager::RAW_HTML,
				'raw'  => esc_html__( 'The logo and its dark-mode version are set in Hamista → Header.', 'hamista-core' ),
			)
		);
		$this->add_responsive_control(
			'height',
			array(
				'label'      => __( 'Height', 'hamista-core' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px' ),
				'range'      => array(
					'px' => array(
						'min' => 16,
						'max' => 120,
					),
				),
				'selectors'  => array( '{{WRAPPER}}' => '--hm-logo-h: {{SIZE}}px;' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		echo '<div class="hm-header__brand">';
		if ( function_exists( 'hamista_site_logo' ) ) {
			hamista_site_logo();
		} else {
			echo '<a class="hm-brand" href="' . esc_url( home_url( '/' ) ) . '" rel="home">' . esc_html( get_bloginfo( 'name' ) ) . '</a>';
		}
		echo '</div>';
	}
}
