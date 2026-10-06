<?php
/**
 * Stacking Cards: cards pin one after another and the previous card settles
 * back as the next arrives.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Stack widget.
 */
class Stack extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-stack';
	}

	/** @return string */
	public function get_title() {
		return __( 'Stacking Cards', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-gallery-justified';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'stack', 'cards', 'sticky', 'services', 'programs' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_items', array( 'label' => __( 'Cards', 'hamista-core' ) ) );
		$items = new Repeater();
		$items->add_control(
			'eyebrow',
			array(
				'label'   => __( 'Label', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( '10 weeks', 'hamista-core' ),
			)
		);
		$items->add_control(
			'title',
			array(
				'label'   => __( 'Title', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Product design', 'hamista-core' ),
			)
		);
		$items->add_control(
			'text',
			array(
				'label'   => __( 'Text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXTAREA,
				'default' => __( 'From a real problem to a prototype people can test.', 'hamista-core' ),
			)
		);
		$items->add_control(
			'points',
			array(
				'label'       => __( 'Bullet points (one per line)', 'hamista-core' ),
				'type'        => Controls_Manager::TEXTAREA,
				'rows'        => 4,
			)
		);
		$items->add_control(
			'image',
			array(
				'label'   => __( 'Image', 'hamista-core' ),
				'type'    => Controls_Manager::MEDIA,
				'default' => array( 'url' => \Elementor\Utils::get_placeholder_image_src() ),
			)
		);
		$items->add_control(
			'btn_text',
			array(
				'label' => __( 'Button text', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$items->add_control(
			'btn_link',
			array(
				'label' => __( 'Button link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$items->add_control(
			'tone',
			array(
				'label'   => __( 'Card tone', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '',
				'options' => array(
					''        => __( 'Surface', 'hamista-core' ),
					'inverse' => __( 'Dark', 'hamista-core' ),
					'accent'  => __( 'Accent', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'items',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $items->get_controls(),
				'title_field' => '{{{ title }}}',
				'default'     => array(
					array( 'title' => __( 'Product design', 'hamista-core' ) ),
					array(
						'title' => __( 'Web development', 'hamista-core' ),
						'tone'  => 'inverse',
					),
					array(
						'title' => __( 'Applied AI', 'hamista-core' ),
						'tone'  => 'accent',
					),
				),
			)
		);
		$this->add_control(
			'offset',
			array(
				'label'     => __( 'Distance from top', 'hamista-core' ),
				'type'      => Controls_Manager::SLIDER,
				'default'   => array( 'size' => 110 ),
				'range'     => array(
					'px' => array(
						'min' => 0,
						'max' => 300,
					),
				),
				'selectors' => array( '{{WRAPPER}} .hm-stack' => '--hm-stack-top: {{SIZE}}px;' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s     = $this->get_settings_for_display();
		$total = count( (array) $s['items'] );
		echo '<div class="hm-stack" data-hm-widget="stack">';
		foreach ( $s['items'] as $i => $item ) {
			$tone = $item['tone'] ? ' hm-stack__card--' . sanitize_html_class( $item['tone'] ) : '';
			echo '<div class="hm-stack__item" style="--i:' . (int) $i . '">';
			echo '<article class="hm-stack__card hm-bolted' . esc_attr( $tone ) . '">';
			echo '<div class="hm-stack__body">';
			echo '<div class="hm-stack__top"><span class="hm-stack__num hm-num">' . esc_html( self::index_label( $i ) . ' / ' . str_pad( (string) $total, 2, '0', STR_PAD_LEFT ) ) . '</span>';
			if ( $item['eyebrow'] ) {
				echo '<span class="hm-stack__label">' . esc_html( $item['eyebrow'] ) . '</span>';
			}
			echo '</div>';
			echo '<h3 class="hm-stack__title">' . esc_html( $item['title'] ) . '</h3>';
			if ( $item['text'] ) {
				echo '<p class="hm-stack__text">' . esc_html( $item['text'] ) . '</p>';
			}
			$points = array_filter( array_map( 'trim', explode( "\n", (string) $item['points'] ) ) );
			if ( $points ) {
				echo '<ul class="hm-stack__points">';
				foreach ( $points as $point ) {
					echo '<li>' . hamista_core_icon( 'check' ) . '<span>' . esc_html( $point ) . '</span></li>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				echo '</ul>';
			}
			if ( $item['btn_text'] ) {
				echo self::button_html( $item['btn_text'], $item['btn_link'], 'inverse' === $item['tone'] || 'accent' === $item['tone'] ? 'inverse' : 'primary' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</div>';
			$img = hamista_core_image( $item['image'], 'large', array( 'sizes' => '(max-width: 900px) 100vw, 45vw' ) );
			if ( $img ) {
				echo '<div class="hm-stack__media">' . $img . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</article></div>';
		}
		echo '</div>';
	}
}
