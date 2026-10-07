<?php
/**
 * Pricing: plans with a monthly/yearly switch and a highlighted plan.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Pricing widget.
 */
class Pricing extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-pricing';
	}

	/** @return string */
	public function get_title() {
		return __( 'Pricing Plans', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-price-table';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'pricing', 'plans', 'price', 'table', 'subscription' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_plans', array( 'label' => __( 'Plans', 'hamista-core' ) ) );
		$plans = new Repeater();
		$plans->add_control(
			'name',
			array(
				'label'   => __( 'Plan name', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Starter', 'hamista-core' ),
			)
		);
		$plans->add_control(
			'desc',
			array(
				'label' => __( 'Short description', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$plans->add_control(
			'price',
			array(
				'label'   => __( 'Price', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => '1,900,000',
			)
		);
		$plans->add_control(
			'price_alt',
			array(
				'label'       => __( 'Price with switch on', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'description' => __( 'Shown when visitors flip the switch (e.g. yearly or installment price).', 'hamista-core' ),
			)
		);
		$plans->add_control(
			'unit',
			array(
				'label'   => __( 'Unit', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Toman', 'hamista-core' ),
			)
		);
		$plans->add_control(
			'period',
			array(
				'label' => __( 'Period note', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$plans->add_control(
			'features',
			array(
				'label'       => __( 'Features (one per line)', 'hamista-core' ),
				'type'        => Controls_Manager::TEXTAREA,
				'rows'        => 6,
				'description' => __( 'Start a line with “-” to show it as not included.', 'hamista-core' ),
				'default'     => __( "Weekly live sessions\nMentor feedback\n-Final project review", 'hamista-core' ),
			)
		);
		$plans->add_control(
			'btn_text',
			array(
				'label'   => __( 'Button text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Choose plan', 'hamista-core' ),
			)
		);
		$plans->add_control(
			'btn_link',
			array(
				'label' => __( 'Button link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$plans->add_control(
			'featured',
			array(
				'label'        => __( 'Highlight this plan', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
			)
		);
		$plans->add_control(
			'badge',
			array(
				'label' => __( 'Badge', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$this->add_control(
			'plans',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $plans->get_controls(),
				'title_field' => '{{{ name }}}',
				'default'     => array(
					array( 'name' => __( 'Starter', 'hamista-core' ) ),
					array(
						'name'     => __( 'Pro', 'hamista-core' ),
						'featured' => 'yes',
						'badge'    => __( 'Most popular', 'hamista-core' ),
					),
					array( 'name' => __( 'Team', 'hamista-core' ) ),
				),
			)
		);
		$this->add_control(
			'switch_off',
			array(
				'label'     => __( 'Switch label (off)', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Pay once', 'hamista-core' ),
				'separator' => 'before',
			)
		);
		$this->add_control(
			'switch_on',
			array(
				'label'   => __( 'Switch label (on)', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Monthly installments', 'hamista-core' ),
			)
		);
		$this->add_control(
			'switch_note',
			array(
				'label' => __( 'Note next to the switch', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s       = $this->get_settings_for_display();
		$has_alt = false;
		// The switch only makes sense when some plan has a different second price.
		foreach ( $s['plans'] as $plan ) {
			if ( '' !== $plan['price_alt'] && $plan['price_alt'] !== $plan['price'] ) {
				$has_alt = true;
			}
		}

		echo '<div class="hm-pricing" data-hm-widget="pricing">';
		if ( $has_alt ) {
			echo '<div class="hm-pricing__toggle"><span>' . esc_html( $s['switch_off'] ) . '</span>';
			echo '<button type="button" class="hm-pricing__switch" role="switch" aria-checked="false" aria-label="' . esc_attr( $s['switch_on'] ) . '"><i></i></button>';
			echo '<span>' . esc_html( $s['switch_on'] ) . '</span>';
			if ( $s['switch_note'] ) {
				echo '<em class="hm-pricing__note">' . esc_html( $s['switch_note'] ) . '</em>';
			}
			echo '</div>';
		}
		echo '<div class="hm-pricing__grid" style="--n:' . count( (array) $s['plans'] ) . '" data-hm-stagger="0.1">';
		foreach ( $s['plans'] as $plan ) {
			$featured = 'yes' === $plan['featured'];
			echo '<article class="hm-plan' . ( $featured ? ' is-featured' : '' ) . ' hm-bolted" data-hm-reveal="up">';
			echo '<span class="hm-plan__hole" aria-hidden="true"></span>';
			if ( $plan['badge'] ) {
				echo '<span class="hm-plan__badge">' . esc_html( $plan['badge'] ) . '</span>';
			}
			echo '<h3 class="hm-plan__name">' . esc_html( $plan['name'] ) . '</h3>';
			if ( $plan['desc'] ) {
				echo '<p class="hm-plan__desc">' . esc_html( $plan['desc'] ) . '</p>';
			}
			echo '<div class="hm-plan__price"><b class="hm-num hm-plan__p1">' . esc_html( hamista_core_digits( $plan['price'] ) ) . '</b>';
			if ( '' !== $plan['price_alt'] ) {
				echo '<b class="hm-num hm-plan__p2">' . esc_html( hamista_core_digits( $plan['price_alt'] ) ) . '</b>';
			}
			echo '<span>' . esc_html( $plan['unit'] ) . '</span></div>';
			if ( $plan['period'] ) {
				echo '<p class="hm-plan__period">' . esc_html( $plan['period'] ) . '</p>';
			}
			echo '<ul class="hm-plan__features">';
			foreach ( array_filter( array_map( 'trim', explode( "\n", (string) $plan['features'] ) ) ) as $line ) {
				$off = 0 === strpos( $line, '-' );
				echo '<li' . ( $off ? ' class="is-off"' : '' ) . '>' . hamista_core_icon( $off ? 'minus' : 'check' ) . '<span>' . esc_html( ltrim( $line, '- ' ) ) . '</span></li>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</ul>';
			if ( $plan['btn_text'] ) {
				echo self::button_html( $plan['btn_text'], $plan['btn_link'], $featured ? 'primary' : 'secondary', array( 'class' => 'hm-btn--block' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</article>';
		}
		echo '</div></div>';
	}
}
