<?php
/**
 * Booking form: online appointments in three short steps (who, day and time,
 * then name and mobile number). Free slots come from each expert's weekly hours.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Booking\Booking as Bookings;
use Hamista\Core\Booking\View;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Booking form widget.
 */
class Booking_Form extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-booking';
	}

	/** @return string */
	public function get_title() {
		return __( 'Appointment booking', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-calendar';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'booking', 'appointment', 'reserve', 'calendar', 'schedule', 'doctor', 'lawyer', 'salon' );
	}

	/** @return array */
	public function get_script_depends() {
		View::register_assets();
		return array( 'hamista-motion', 'hamista-booking' );
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
		$experts = array( 0 => __( 'Let the visitor choose', 'hamista-core' ) );
		foreach ( get_posts(
			array(
				'post_type'      => Bookings::EXPERT,
				'posts_per_page' => 100,
				'orderby'        => 'title',
				'order'          => 'ASC',
			)
		) as $expert ) {
			$experts[ $expert->ID ] = $expert->post_title;
		}
		$terms  = get_terms(
			array(
				'taxonomy'   => Bookings::SERVICE,
				'hide_empty' => false,
			)
		);
		$groups = array();
		if ( ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term ) {
				$groups[ $term->term_id ] = $term->name;
			}
		}

		$this->start_controls_section( 'section_booking', array( 'label' => __( 'Booking', 'hamista-core' ) ) );
		$this->add_control(
			'title',
			array(
				'label'       => __( 'Title', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => __( 'Book an appointment online', 'hamista-core' ),
				'label_block' => true,
			)
		);
		$this->add_control(
			'intro',
			array(
				'label'   => __( 'Text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXTAREA,
				'rows'    => 2,
				'default' => __( 'Pick a free time; we will confirm it by SMS.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'expert',
			array(
				'label'       => Bookings::label( 'one' ),
				'description' => __( 'Choose one to skip the first step, e.g. on a personal profile page.', 'hamista-core' ),
				'type'        => Controls_Manager::SELECT,
				'default'     => '0',
				'options'     => $experts,
				'separator'   => 'before',
			)
		);
		$this->add_control(
			'groups',
			array(
				/* translators: %s: e.g. "specialties", "services" */
				'label'       => sprintf( __( 'Only these %s', 'hamista-core' ), Bookings::label( 'group_many' ) ),
				'type'        => Controls_Manager::SELECT2,
				'multiple'    => true,
				'label_block' => true,
				'options'     => $groups,
				'condition'   => array( 'expert' => '0' ),
			)
		);
		$this->add_control(
			'note',
			array(
				'label'        => __( 'Notes field', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->add_control(
			'box',
			array(
				'label'   => __( 'Appearance', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'card',
				'options' => array(
					'card'  => __( 'In a card', 'hamista-core' ),
					'plain' => __( 'Without a frame', 'hamista-core' ),
				),
			)
		);
		$this->add_responsive_control(
			'max_width',
			array(
				'label'      => __( 'Maximum width', 'hamista-core' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px', '%' ),
				'range'      => array(
					'px' => array(
						'min' => 360,
						'max' => 1200,
					),
				),
				'selectors'  => array( '{{WRAPPER}} .hm-book' => 'max-width: {{SIZE}}{{UNIT}};' ),
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
				echo '<div class="hm-empty">' . esc_html__( 'Turn on Booking in Hamista settings to take appointments here.', 'hamista-core' ) . '</div>';
			}
			return;
		}
		echo '<section class="' . esc_attr( $this->section_class( $s, 'hm-booking' ) ) . '"><div class="' . esc_attr( $this->inner_class( $s ) ) . '">';
		$html = View::booking(
			array(
				'expert' => absint( $s['expert'] ),
				'groups' => (array) $s['groups'],
				'title'  => (string) $s['title'],
				'intro'  => (string) $s['intro'],
				'note'   => 'yes' === $s['note'],
				'style'  => (string) $s['box'],
			)
		);
		echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in View.
		echo '</div></section>';
	}
}
