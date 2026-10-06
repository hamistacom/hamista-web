<?php
/**
 * Counters: animated key numbers (plain, cards, LCD displays or a dark band).
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Counters widget.
 */
class Counters extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-counters';
	}

	/** @return string */
	public function get_title() {
		return __( 'Counters', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-counter';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'counter', 'stats', 'numbers', 'facts' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_items', array( 'label' => __( 'Numbers', 'hamista-core' ) ) );
		$items = new Repeater();
		$items->add_control(
			'value',
			array(
				'label'   => __( 'Number', 'hamista-core' ),
				'type'    => Controls_Manager::NUMBER,
				'default' => 120,
			)
		);
		$items->add_control(
			'prefix',
			array(
				'label' => __( 'Before', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$items->add_control(
			'suffix',
			array(
				'label' => __( 'After', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$items->add_control(
			'label',
			array(
				'label'   => __( 'Label', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Projects shipped', 'hamista-core' ),
			)
		);
		$items->add_control(
			'desc',
			array(
				'label' => __( 'Note', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$this->add_control(
			'items',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $items->get_controls(),
				'title_field' => '{{{ value }}} — {{{ label }}}',
				'default'     => array(
					array(
						'value'  => 2400,
						'prefix' => '+',
						'label'  => __( 'Active makers', 'hamista-core' ),
					),
					array(
						'value' => 48,
						'label' => __( 'Projects shipped', 'hamista-core' ),
					),
					array(
						'value'  => 96,
						'suffix' => '%',
						'label'  => __( 'Mentor satisfaction', 'hamista-core' ),
					),
					array(
						'value' => 12,
						'label' => __( 'Products with users', 'hamista-core' ),
					),
				),
			)
		);
		$this->add_control(
			'style',
			array(
				'label'   => __( 'Style', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'plain',
				'options' => array(
					'plain' => __( 'Plain with dividers', 'hamista-core' ),
					'cards' => __( 'Cards', 'hamista-core' ),
					'lcd'   => __( 'LCD displays', 'hamista-core' ),
				),
			)
		);
		$this->add_responsive_control(
			'columns',
			array(
				'label'          => __( 'Columns', 'hamista-core' ),
				'type'           => Controls_Manager::SELECT,
				'default'        => '4',
				'tablet_default' => '2',
				'mobile_default' => '2',
				'options'        => array(
					'1' => '1',
					'2' => '2',
					'3' => '3',
					'4' => '4',
					'5' => '5',
				),
				'selectors'      => array( '{{WRAPPER}} .hm-stats' => '--cols: {{VALUE}};' ),
			)
		);
		$this->add_control(
			'duration',
			array(
				'label'   => __( 'Count duration (s)', 'hamista-core' ),
				'type'    => Controls_Manager::NUMBER,
				'default' => 2,
				'min'     => 0.5,
				'max'     => 6,
				'step'    => 0.1,
			)
		);
		$this->add_control(
			'grouping',
			array(
				'label'        => __( 'Thousands separator', 'hamista-core' ),
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
		$plain = 'yes' !== $s['grouping'] ? ' data-hm-plain' : '';
		echo '<div class="hm-stats hm-stats--' . esc_attr( $s['style'] ) . '" data-hm-stagger="0.08">';
		foreach ( $s['items'] as $item ) {
			$value = (float) $item['value'];
			echo '<div class="hm-stat' . ( 'plain' !== $s['style'] ? ' hm-bolted' : '' ) . '" data-hm-reveal="up">';
			echo '<div class="hm-stat__num hm-num">';
			if ( $item['prefix'] ) {
				echo '<span class="hm-stat__affix">' . esc_html( $item['prefix'] ) . '</span>';
			}
			printf(
				'<span data-hm-count="%1$s" data-hm-duration="%2$s"%3$s>%4$s</span>',
				esc_attr( $item['value'] ),
				esc_attr( $s['duration'] ),
				$plain, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				esc_html( hamista_core_digits( number_format( $value, 0, '.', '' ) ) )
			);
			if ( $item['suffix'] ) {
				echo '<span class="hm-stat__affix">' . esc_html( $item['suffix'] ) . '</span>';
			}
			echo '</div><div class="hm-stat__label">' . esc_html( $item['label'] ) . '</div>';
			if ( $item['desc'] ) {
				echo '<p class="hm-stat__desc">' . esc_html( $item['desc'] ) . '</p>';
			}
			echo '</div>';
		}
		echo '</div>';
	}
}
