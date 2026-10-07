<?php
/**
 * Navigation menu for Elementor-built headers: any WordPress menu with the
 * theme's dropdowns. On tablets and phones the Header Actions menu button
 * opens the same menu in a drawer.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Nav menu widget.
 */
class Nav_Menu extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-nav-menu';
	}

	/** @return string */
	public function get_title() {
		return __( 'Menu', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-nav-menu';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'menu', 'nav', 'navigation', 'header' );
	}

	/** @return bool */
	protected function is_dynamic_content(): bool {
		return true;
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$menus   = wp_get_nav_menus();
		$choices = array( '' => __( 'Primary menu location', 'hamista-core' ) );
		foreach ( $menus as $menu ) {
			$choices[ $menu->term_id ] = $menu->name;
		}
		$this->start_controls_section( 'section_menu', array( 'label' => __( 'Menu', 'hamista-core' ) ) );
		$this->add_control(
			'menu',
			array(
				'label'   => __( 'Menu', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '',
				'options' => $choices,
			)
		);
		$this->add_control(
			'style',
			array(
				'label'   => __( 'Hover style', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '',
				'options' => array(
					''          => __( 'Theme default', 'hamista-core' ),
					'pill'      => __( 'Soft pill', 'hamista-core' ),
					'underline' => __( 'Underline', 'hamista-core' ),
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
						'icon'  => 'eicon-h-align-right',
					),
					'center'     => array(
						'title' => __( 'Center', 'hamista-core' ),
						'icon'  => 'eicon-h-align-center',
					),
					'flex-end'   => array(
						'title' => __( 'End', 'hamista-core' ),
						'icon'  => 'eicon-h-align-left',
					),
				),
				'selectors' => array( '{{WRAPPER}} .hm-menu' => 'justify-content: {{VALUE}};' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s    = $this->get_settings_for_display();
		$args = array(
			'container'   => false,
			'menu_class'  => 'hm-menu',
			'depth'       => 3,
			'fallback_cb' => false,
			'echo'        => false,
		);
		if ( ! empty( $s['menu'] ) ) {
			$args['menu'] = (int) $s['menu'];
		} elseif ( has_nav_menu( 'primary' ) ) {
			$args['theme_location'] = 'primary';
		} else {
			return;
		}
		$html = wp_nav_menu( $args );
		if ( $html ) {
			echo '<nav class="hm-nav hm-nav--widget' . ( $s['style'] ? ' hm-nav--' . esc_attr( $s['style'] ) : '' ) . '" aria-label="' . esc_attr__( 'Primary', 'hamista-core' ) . '">' . $html . '</nav>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- core menu output.
		}
	}
}
