<?php
/**
 * Steps: a numbered process, horizontal with a connector or a vertical timeline.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Steps widget.
 */
class Steps extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-steps';
	}

	/** @return string */
	public function get_title() {
		return __( 'Steps / Timeline', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-time-line';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'steps', 'process', 'timeline', 'how it works', 'history' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_items', array( 'label' => __( 'Steps', 'hamista-core' ) ) );
		$items = new Repeater();
		$items->add_control(
			'marker',
			array(
				'label'       => __( 'Marker', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'description' => __( 'Leave empty for automatic numbering. Use a year for timelines.', 'hamista-core' ),
			)
		);
		$items->add_control(
			'icon',
			array(
				'label'   => __( 'Icon', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '',
				'options' => self::icon_options(),
			)
		);
		$items->add_control(
			'title',
			array(
				'label'   => __( 'Title', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Step title', 'hamista-core' ),
			)
		);
		$items->add_control(
			'text',
			array(
				'label'   => __( 'Text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXTAREA,
				'default' => __( 'What happens in this step and why it matters.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'items',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $items->get_controls(),
				'title_field' => '{{{ title }}}',
				'default'     => array(
					array( 'title' => __( 'Choose your path', 'hamista-core' ) ),
					array( 'title' => __( 'Build with a mentor', 'hamista-core' ) ),
					array( 'title' => __( 'Ship it', 'hamista-core' ) ),
				),
			)
		);
		$this->add_control(
			'layout',
			array(
				'label'   => __( 'Layout', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'h',
				'options' => array(
					'h' => __( 'Horizontal', 'hamista-core' ),
					'v' => __( 'Vertical timeline', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'cards',
			array(
				'label'        => __( 'Show as cards', 'hamista-core' ),
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
		$s     = $this->get_settings_for_display();
		$count = count( (array) $s['items'] );
		echo '<ol class="hm-steps hm-steps--' . esc_attr( $s['layout'] ) . ( 'yes' === $s['cards'] ? ' hm-steps--cards' : '' ) . '" style="--n:' . (int) $count . '" data-hm-stagger="0.12" data-hm-reveal="draw">';
		foreach ( $s['items'] as $i => $item ) {
			$marker = '' !== $item['marker'] ? $item['marker'] : self::index_label( $i );
			echo '<li class="hm-step' . ( 'yes' === $s['cards'] ? ' hm-bolted' : '' ) . '" data-hm-reveal="up">';
			echo '<span class="hm-step__node hm-num">' . esc_html( hamista_core_digits( $marker ) ) . '</span>';
			echo '<div class="hm-step__body">';
			if ( $item['icon'] ) {
				echo '<span class="hm-step__icon">' . hamista_core_icon( $item['icon'] ) . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '<h3 class="hm-step__title">' . esc_html( $item['title'] ) . '</h3>';
			if ( $item['text'] ) {
				echo '<p class="hm-step__text">' . esc_html( $item['text'] ) . '</p>';
			}
			echo '</div></li>';
		}
		echo '</ol>';
	}
}
