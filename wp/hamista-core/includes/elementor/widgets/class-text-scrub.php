<?php
/**
 * Text Scrub: a large statement whose words light up as it scrolls through.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Group_Control_Typography;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Text scrub widget.
 */
class Text_Scrub extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-text-scrub';
	}

	/** @return string */
	public function get_title() {
		return __( 'Scroll Text Reveal', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-animation-text';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'text', 'scroll', 'reveal', 'statement', 'manifesto' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_text', array( 'label' => __( 'Text', 'hamista-core' ) ) );
		$this->add_control(
			'eyebrow',
			array(
				'label' => __( 'Eyebrow', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$this->add_control(
			'text',
			array(
				'label'       => __( 'Statement', 'hamista-core' ),
				'type'        => Controls_Manager::TEXTAREA,
				'rows'        => 5,
				'default'     => __( 'We believe the fastest way to learn is to *build something real*, show it to people, and improve it the next morning.', 'hamista-core' ),
				'description' => __( 'Words wrapped in *asterisks* light up in the accent colour.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'size',
			array(
				'label'   => __( 'Size', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'lg',
				'options' => array(
					'md' => __( 'Medium', 'hamista-core' ),
					'lg' => __( 'Large', 'hamista-core' ),
					'xl' => __( 'Huge', 'hamista-core' ),
				),
			)
		);
		$this->add_responsive_control(
			'align',
			array(
				'label'     => __( 'Alignment', 'hamista-core' ),
				'type'      => Controls_Manager::CHOOSE,
				'options'   => array(
					'start'  => array(
						'title' => __( 'Start', 'hamista-core' ),
						'icon'  => is_rtl() ? 'eicon-text-align-right' : 'eicon-text-align-left',
					),
					'center' => array(
						'title' => __( 'Center', 'hamista-core' ),
						'icon'  => 'eicon-text-align-center',
					),
				),
				'default'   => 'start',
				'selectors' => array( '{{WRAPPER}} .hm-scrubtext' => 'text-align: {{VALUE}};' ),
			)
		);
		$this->add_control(
			'dim',
			array(
				'label'     => __( 'Unlit opacity', 'hamista-core' ),
				'type'      => Controls_Manager::SLIDER,
				'default'   => array( 'size' => 0.16 ),
				'range'     => array(
					'px' => array(
						'min'  => 0.05,
						'max'  => 0.6,
						'step' => 0.01,
					),
				),
				'selectors' => array( '{{WRAPPER}} .hm-scrubtext' => '--hm-dim: {{SIZE}};' ),
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
				'selectors' => array( '{{WRAPPER}} .hm-scrubtext__text' => 'color: {{VALUE}};' ),
			)
		);
		$this->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'     => 'typography',
				'selector' => '{{WRAPPER}} .hm-scrubtext__text',
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s = $this->get_settings_for_display();
		echo '<div class="hm-scrubtext hm-scrubtext--' . esc_attr( $s['size'] ) . '" data-hm-widget="scrubtext">';
		if ( $s['eyebrow'] ) {
			echo '<p class="hm-eyebrow">' . esc_html( $s['eyebrow'] ) . '</p>';
		}
		echo '<p class="hm-scrubtext__text">' . hamista_core_highlight( $s['text'] ) . '</p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '</div>';
	}
}
