<?php
/**
 * Price calculator: the visitor picks a service and an amount and sees the
 * total in tomans at once (amount × rate, plus a fee), then goes on to order.
 * For currency payments, subscriptions, top-ups, gift cards or anything
 * priced by the unit. No request to the server; the rates live in the widget.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Calculator widget.
 */
class Calculator extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-calculator';
	}

	/** @return string */
	public function get_title() {
		return __( 'Price calculator', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-number-field';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'calculator', 'price', 'currency', 'dollar', 'exchange', 'subscription', 'quote' );
	}

	/** @return array */
	public function get_script_depends() {
		return array( 'hamista-calculator' );
	}

	/** @return array */
	public function get_style_depends() {
		return array( 'hamista-widgets' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_calc', array( 'label' => __( 'Calculator', 'hamista-core' ) ) );
		$this->add_control(
			'title',
			array(
				'label'   => __( 'Title', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'How much will it cost?', 'hamista-core' ),
			)
		);
		$r = new Repeater();
		$r->add_control(
			'name',
			array(
				'label'   => __( 'Service', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Dollar payment', 'hamista-core' ),
			)
		);
		$r->add_control(
			'unit',
			array(
				'label'   => __( 'Unit', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'dollars', 'hamista-core' ),
			)
		);
		$r->add_control(
			'rate',
			array(
				'label'       => __( 'Price of one unit (tomans)', 'hamista-core' ),
				'type'        => Controls_Manager::NUMBER,
				'default'     => 60000,
				'min'         => 0,
				'description' => __( 'Update it whenever the rate changes.', 'hamista-core' ),
			)
		);
		$r->add_control(
			'fee',
			array(
				'label'   => __( 'Service fee (%)', 'hamista-core' ),
				'type'    => Controls_Manager::NUMBER,
				'default' => 5,
				'min'     => 0,
				'max'     => 100,
				'step'    => 0.5,
			)
		);
		$r->add_control(
			'min',
			array(
				'label'   => __( 'Smallest amount', 'hamista-core' ),
				'type'    => Controls_Manager::NUMBER,
				'default' => 1,
				'min'     => 0,
			)
		);
		$r->add_control(
			'start',
			array(
				'label'   => __( 'Amount shown first', 'hamista-core' ),
				'type'    => Controls_Manager::NUMBER,
				'default' => 20,
				'min'     => 0,
			)
		);
		$this->add_control(
			'items',
			array(
				'label'       => __( 'Services', 'hamista-core' ),
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $r->get_controls(),
				'title_field' => '{{{ name }}}',
				'default'     => array(
					array(
						'name'  => __( 'Dollar payment', 'hamista-core' ),
						'unit'  => __( 'dollars', 'hamista-core' ),
						'rate'  => 60000,
						'fee'   => 5,
						'start' => 20,
					),
				),
			)
		);
		$this->add_control(
			'note',
			array(
				'label'   => __( 'Line under the total', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Rates are updated every hour.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'btn_text',
			array(
				'label'   => __( 'Button text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Place the order', 'hamista-core' ),
			)
		);
		$this->add_control(
			'btn_link',
			array(
				'label'       => __( 'Button link', 'hamista-core' ),
				'type'        => Controls_Manager::URL,
				'description' => __( 'The chosen service, amount and total are added to the link (service, amount, total), so a form or chat can pick them up.', 'hamista-core' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s     = $this->get_settings_for_display();
		$items = array();
		foreach ( (array) $s['items'] as $item ) {
			$items[] = array(
				'name'  => (string) $item['name'],
				'unit'  => (string) $item['unit'],
				'rate'  => max( 0, (float) $item['rate'] ),
				'fee'   => max( 0, (float) $item['fee'] ),
				'min'   => max( 0, (float) $item['min'] ),
				'start' => max( 0, (float) $item['start'] ),
			);
		}
		if ( ! $items ) {
			return;
		}
		$uid  = 'hm-calc-' . $this->get_id();
		$href = ! empty( $s['btn_link']['url'] ) ? $s['btn_link']['url'] : '';

		echo '<form class="hm-calc" data-hm-calc="' . esc_attr( wp_json_encode( $items ) ) . '" action="' . esc_url( $href ) . '" method="get">';
		if ( $s['title'] ) {
			echo '<p class="hm-calc__title">' . esc_html( $s['title'] ) . '</p>';
		}
		if ( count( $items ) > 1 ) {
			echo '<div class="hm-calc__tabs" role="radiogroup" aria-label="' . esc_attr__( 'Service', 'hamista-core' ) . '">';
			foreach ( $items as $i => $item ) {
				printf(
					'<label class="hm-calc__tab"><input type="radio" name="service" value="%1$s"%2$s><span>%3$s</span></label>',
					esc_attr( $item['name'] ),
					checked( 0, $i, false ),
					esc_html( $item['name'] )
				);
			}
			echo '</div>';
		} else {
			echo '<input type="hidden" name="service" value="' . esc_attr( $items[0]['name'] ) . '">';
		}
		echo '<label class="hm-calc__field" for="' . esc_attr( $uid ) . '"><span class="hm-calc__label">' . esc_html__( 'Amount', 'hamista-core' ) . '</span>';
		echo '<span class="hm-calc__input"><input id="' . esc_attr( $uid ) . '" name="amount" type="number" inputmode="decimal" dir="ltr" min="' . esc_attr( $items[0]['min'] ) . '" step="any" value="' . esc_attr( $items[0]['start'] ) . '"><b class="hm-calc__unit">' . esc_html( $items[0]['unit'] ) . '</b></span></label>';
		echo '<div class="hm-calc__lines">';
		echo '<p><span>' . esc_html__( 'Rate', 'hamista-core' ) . '</span><b data-part="rate"></b></p>';
		echo '<p><span>' . esc_html__( 'Service fee', 'hamista-core' ) . '</span><b data-part="fee"></b></p>';
		echo '</div>';
		echo '<p class="hm-calc__total"><span>' . esc_html__( 'You pay', 'hamista-core' ) . '</span><output data-part="total" aria-live="polite"></output></p>';
		echo '<input type="hidden" name="total" value="">';
		if ( $s['note'] ) {
			echo '<p class="hm-calc__note">' . esc_html( $s['note'] ) . '</p>';
		}
		if ( $s['btn_text'] ) {
			echo '<button type="submit" class="hm-btn hm-btn--primary hm-calc__go"><span>' . esc_html( $s['btn_text'] ) . '</span>' . hamista_core_icon( 'arrow', array( 'class' => 'hm-i-arrow' ) ) . '</button>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		echo '</form>';
	}
}
