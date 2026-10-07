<?php
/**
 * Experts: the people visitors book with (doctors, lawyers, stylists,
 * consultants…) as a grid or a carousel, with filters by service and a
 * booking button on each card. Wording follows Hamista → Booking.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Booking\Booking as Bookings;
use Hamista\Core\Booking\View;
use Hamista\Core\Elementor\Carousel;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Experts widget.
 */
class Experts extends Widget_Base {

	use Carousel;

	/** @return string */
	public function get_name() {
		return 'hm-experts';
	}

	/** @return string */
	public function get_title() {
		return __( 'Experts & team', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-person';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'expert', 'team', 'booking', 'doctor', 'lawyer', 'consultant', 'stylist', 'staff' );
	}

	/** @return array */
	public function get_style_depends() {
		View::register_assets();
		return array( 'hamista-widgets', 'hamista-booking' );
	}

	/** @return bool */
	protected function is_dynamic_content(): bool {
		return true;
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_header', array( 'label' => __( 'Heading', 'hamista-core' ) ) );
		$this->add_header_controls(
			array(
				'eyebrow' => __( 'Our team', 'hamista-core' ),
				/* translators: %s: e.g. "doctors", "lawyers" */
				'title'   => sprintf( __( 'Meet our *%s*', 'hamista-core' ), Bookings::label( 'many' ) ),
				'size'    => 'md',
			),
			false
		);
		$this->add_view_all_controls();
		$this->end_controls_section();

		$terms   = get_terms(
			array(
				'taxonomy'   => Bookings::SERVICE,
				'hide_empty' => false,
			)
		);
		$choices = array();
		if ( ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term ) {
				$choices[ $term->term_id ] = $term->name;
			}
		}
		$this->start_controls_section( 'section_query', array( 'label' => Bookings::label( 'many' ) ) );
		$this->add_control(
			'count',
			array(
				'label'   => __( 'How many', 'hamista-core' ),
				'type'    => Controls_Manager::NUMBER,
				'default' => 8,
				'min'     => 1,
				'max'     => 50,
			)
		);
		$this->add_control(
			'groups',
			array(
				'label'       => Bookings::label( 'group_many' ),
				'description' => __( 'Empty shows everyone.', 'hamista-core' ),
				'type'        => Controls_Manager::SELECT2,
				'multiple'    => true,
				'label_block' => true,
				'options'     => $choices,
			)
		);
		$this->add_control(
			'filters',
			array(
				'label'        => __( 'Filter chips', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => array( 'layout' => 'grid' ),
			)
		);
		$this->add_control(
			'card_style',
			array(
				'label'   => __( 'Card style', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'card',
				'options' => array(
					'card'    => __( 'Photo on top', 'hamista-core' ),
					'minimal' => __( 'Round photo, centred', 'hamista-core' ),
					'row'     => __( 'Compact row', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'button',
			array(
				'label'        => __( 'Booking button', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_layout_doc', array( 'label' => __( 'Layout', 'hamista-core' ) ) );
		$this->add_control(
			'layout',
			array(
				'label'   => __( 'Layout', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'grid',
				'options' => array(
					'grid'     => __( 'Grid', 'hamista-core' ),
					'carousel' => __( 'Carousel', 'hamista-core' ),
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
				'mobile_default' => '1',
				'options'        => array_combine( array( '1', '2', '3', '4', '5' ), array( '1', '2', '3', '4', '5' ) ),
				'selectors'      => array( '{{WRAPPER}} .hm-expertgrid' => '--hm-cols: {{VALUE}};' ),
				'condition'      => array( 'layout' => 'grid' ),
			)
		);
		$this->add_carousel_options(
			array( 'layout' => 'carousel' ),
			array(
				'per_view'        => 4,
				'per_view_tablet' => 2.4,
				'per_view_mobile' => 1.3,
			)
		);
		$this->end_controls_section();
		$this->add_section_controls();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s = $this->get_settings_for_display();
		if ( ! post_type_exists( Bookings::EXPERT ) ) {
			if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
				echo '<div class="hm-empty">' . esc_html__( 'Turn on Booking in Hamista settings to show your team here.', 'hamista-core' ) . '</div>';
			}
			return;
		}
		$experts = View::experts(
			array(
				'count'  => (int) $s['count'],
				'groups' => (array) $s['groups'],
			)
		);
		if ( ! $experts ) {
			if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
				echo '<div class="hm-empty">' . esc_html( sprintf( /* translators: %s: e.g. "doctors", "lawyers" */ __( 'Add %s under Booking in the dashboard to show them here.', 'hamista-core' ), Bookings::label( 'many' ) ) ) . '</div>';
			}
			return;
		}
		$style = in_array( $s['card_style'], array( 'card', 'minimal', 'row' ), true ) ? $s['card_style'] : 'card';
		$cards = array();
		foreach ( $experts as $expert ) {
			$cards[] = Bookings::card(
				$expert->ID,
				array(
					'style'  => $style,
					'button' => 'yes' === $s['button'],
				)
			);
		}
		$grid = 'carousel' !== $s['layout'];

		echo '<section class="' . esc_attr( $this->section_class( $s, 'hm-experts' ) ) . '"' . ( $grid ? ' data-hm-widget="pfilter"' : '' ) . '><div class="' . esc_attr( $this->inner_class( $s ) ) . '">';
		echo $this->carousel_head( $s, $this->render_header( $s ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		if ( $grid ) {
			if ( 'yes' === $s['filters'] ) {
				echo View::filters( $experts ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in View.
			}
			echo '<div class="hm-expertgrid hm-expertgrid--' . esc_attr( $style ) . '">' . implode( '', $cards ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in Bookings::card().
		} else {
			echo $this->carousel_wrap( $s, $cards, Bookings::label( 'many' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		echo '</div></section>';
	}
}
