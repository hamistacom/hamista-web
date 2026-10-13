<?php
/**
 * Process: the steps of working together.
 *  - tabs:   numbered cards with a tab on top; the section holds still while
 *            the cards slide in and pile up one over the other;
 *  - stages: tall cards that rise one after another and stack in the middle,
 *            each with a stage badge and a picture.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Process widget.
 */
class Process extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-process';
	}

	/** @return string */
	public function get_title() {
		return __( 'Work Process', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-flow';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'process', 'steps', 'how we work', 'stages', 'timeline' );
	}

	/** @return array */
	public function get_script_depends() {
		return array( 'hamista-motion', 'hamista-agency' );
	}

	/** @return array */
	public function get_style_depends() {
		return array( 'hamista-widgets', 'hamista-agency' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->add_header_controls(
			array(
				'eyebrow' => __( '*{ 08 }* # How we work', 'hamista-core' ),
				'title'   => __( 'Our way of working', 'hamista-core' ),
				'desc'    => __( 'We listen first, then plan, build and keep improving with you.', 'hamista-core' ),
				'size'    => 'md',
			)
		);
		$this->start_controls_section( 'section_steps', array( 'label' => __( 'Steps', 'hamista-core' ) ) );
		$r = new Repeater();
		$r->add_control(
			'icon',
			array(
				'label'   => __( 'Icon', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'compass',
				'options' => self::icon_options(),
			)
		);
		$r->add_control(
			'title',
			array(
				'label'   => __( 'Title', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Discovery and planning', 'hamista-core' ),
			)
		);
		$r->add_control(
			'text',
			array(
				'label' => __( 'Text', 'hamista-core' ),
				'type'  => Controls_Manager::TEXTAREA,
				'rows'  => 3,
			)
		);
		$r->add_control(
			'image',
			array(
				'label' => __( 'Picture', 'hamista-core' ),
				'type'  => Controls_Manager::MEDIA,
			)
		);
		$r->add_control(
			'link',
			array(
				'label' => __( 'Link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$this->add_control(
			'steps',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $r->get_controls(),
				'title_field' => '{{{ title }}}',
				'default'     => array(
					array(
						'icon'  => 'compass',
						'title' => __( 'Discovery and planning', 'hamista-core' ),
						'text'  => __( 'We learn your business, goals and market, then set a clear plan.', 'hamista-core' ),
					),
					array(
						'icon'  => 'pen',
						'title' => __( 'Design and build', 'hamista-core' ),
						'text'  => __( 'Ideas become designs, then working pages you can try.', 'hamista-core' ),
					),
					array(
						'icon'  => 'rocket',
						'title' => __( 'Launch', 'hamista-core' ),
						'text'  => __( 'Tested, measured and put live without surprises.', 'hamista-core' ),
					),
					array(
						'icon'  => 'trend',
						'title' => __( 'Measure and grow', 'hamista-core' ),
						'text'  => __( 'Monthly reports and steady improvements.', 'hamista-core' ),
					),
				),
			)
		);
		$this->add_control(
			'look',
			array(
				'label'   => __( 'Look', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'tabs',
				'options' => array(
					'tabs'   => __( 'Numbered cards that pile up', 'hamista-core' ),
					'stages' => __( 'Stage cards rising in the middle', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'more',
			array(
				'label'   => __( 'Card link text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'More', 'hamista-core' ),
			)
		);
		$this->add_control(
			'stage',
			array(
				'label'     => __( 'Stage label', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Stage', 'hamista-core' ),
				'condition' => array( 'look' => 'stages' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s     = $this->get_settings_for_display();
		$look  = 'stages' === $s['look'] ? 'stages' : 'tabs';
		$steps = array_values( (array) $s['steps'] );
		printf( '<div class="hm-pr hm-pr--%1$s" data-hm-widget="process" style="--n:%2$d">', esc_attr( $look ), count( $steps ) );
		echo '<div class="hm-pr__pin">';
		echo $this->render_header( $s, 'hm-pr__head' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '<div class="hm-pr__track">';
		foreach ( $steps as $i => $step ) {
			$dark = 'tabs' === $look && 1 === $i % 2;
			printf( '<article class="hm-pr__card%1$s" style="--i:%2$d">', $dark ? ' is-dark' : '', (int) $i );
			if ( 'tabs' === $look ) {
				echo '<span class="hm-pr__tab hm-num">' . esc_html( self::pad_number( $i + 1 ) ) . '</span>';
				if ( ! empty( $step['link']['url'] ) && $s['more'] ) {
					echo '<a class="hm-pr__more" href="' . esc_url( $step['link']['url'] ) . '">' . hamista_core_icon( 'chevron-l' ) . esc_html( $s['more'] ) . '</a>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				echo '<span class="hm-pr__icon">' . hamista_core_icon( $step['icon'] ) . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				echo '<h3 class="hm-pr__title">' . esc_html( $step['title'] ) . '</h3><p class="hm-pr__text">' . esc_html( $step['text'] ) . '</p>';
			} else {
				echo '<div class="hm-pr__top"><span class="hm-pr__icon">' . hamista_core_icon( $step['icon'] ) . '</span><span class="hm-pr__stage">' . esc_html( $s['stage'] . ' ' . hamista_core_digits( self::pad_number( $i + 1 ) ) ) . '</span></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				echo '<h3 class="hm-pr__title">' . esc_html( $step['title'] ) . '</h3><p class="hm-pr__text">' . esc_html( $step['text'] ) . '</p>';
				if ( ! empty( $step['image']['url'] ) ) {
					echo '<span class="hm-pr__img">' . hamista_core_image( $step['image'], 'medium_large' ) . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
			}
			echo '</article>';
		}
		echo '</div></div></div>';
	}
}
