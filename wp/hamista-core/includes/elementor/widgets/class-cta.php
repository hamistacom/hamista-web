<?php
/**
 * Call to Action: a closing band with buttons or an email signup.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * CTA widget.
 */
class Cta extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-cta';
	}

	/** @return string */
	public function get_title() {
		return __( 'Call to Action', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-call-to-action';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'cta', 'call to action', 'newsletter', 'signup', 'banner' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_content', array( 'label' => __( 'Content', 'hamista-core' ) ) );
		$this->add_header_controls(
			array(
				'title' => __( "Your next idea\ncould be *yours*.", 'hamista-core' ),
				'desc'  => __( 'Book a free consultation and we will find the right path together.', 'hamista-core' ),
				'align' => 'center',
				'size'  => 'xl',
			),
			false
		);
		$this->add_control(
			'action',
			array(
				'label'     => __( 'Action', 'hamista-core' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => 'buttons',
				'separator' => 'before',
				'options'   => array(
					'buttons' => __( 'Buttons', 'hamista-core' ),
					'email'   => __( 'Email signup', 'hamista-core' ),
				),
			)
		);
		$this->add_button_controls( 'btn1', __( 'Primary button', 'hamista-core' ), array( 'text' => __( 'Book a consultation', 'hamista-core' ) ) );
		$this->add_button_controls( 'btn2', __( 'Secondary button', 'hamista-core' ), array( 'style' => 'ghost' ) );
		$this->add_control(
			'email_placeholder',
			array(
				'label'     => __( 'Email placeholder', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Your email', 'hamista-core' ),
				'condition' => array( 'action' => 'email' ),
			)
		);
		$this->add_control(
			'email_button',
			array(
				'label'     => __( 'Signup button', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Keep me posted', 'hamista-core' ),
				'condition' => array( 'action' => 'email' ),
			)
		);
		$this->add_control(
			'note',
			array(
				'label'   => __( 'Small print', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Free · No commitment · Reply within 24 hours', 'hamista-core' ),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_look', array( 'label' => __( 'Look', 'hamista-core' ) ) );
		$this->add_control(
			'look',
			array(
				'label'   => __( 'Background', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'inverse',
				'options' => array(
					'inverse' => __( 'Dark slab', 'hamista-core' ),
					'accent'  => __( 'Accent', 'hamista-core' ),
					'surface' => __( 'Soft surface', 'hamista-core' ),
					'image'   => __( 'Image', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'image',
			array(
				'label'     => __( 'Background image', 'hamista-core' ),
				'type'      => Controls_Manager::MEDIA,
				'condition' => array( 'look' => 'image' ),
			)
		);
		$this->add_control(
			'decor',
			array(
				'label'   => __( 'Detail', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'grid',
				'options' => array(
					''      => __( 'None', 'hamista-core' ),
					'grid'  => __( 'Fine grid', 'hamista-core' ),
					'grill' => __( 'Speaker grill', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'rounded',
			array(
				'label'        => __( 'Inset with rounded corners', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
			)
		);
		$this->end_controls_section();

		$this->add_header_style_controls();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s       = $this->get_settings_for_display();
		$classes = 'hm-cta hm-cta--' . sanitize_html_class( $s['look'] ) . ( 'image' === $s['look'] ? '' : ' hm-scheme-' . sanitize_html_class( $s['look'] ) );
		$classes .= $s['decor'] ? ' hm-cta--' . sanitize_html_class( $s['decor'] ) : '';
		$classes .= 'yes' === $s['rounded'] ? ' hm-cta--inset' : '';

		echo '<section class="' . esc_attr( $classes ) . '">';
		if ( 'image' === $s['look'] ) {
			echo '<div class="hm-cta__bg" aria-hidden="true">' . hamista_core_image( $s['image'], 'full', array( 'sizes' => '100vw' ) ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		echo '<div class="hm-container hm-cta__inner">';
		echo $this->render_header( $s ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

		if ( 'email' === $s['action'] ) {
			echo '<form class="hm-cta__form hm-form" data-hm-widget="form" novalidate data-hm-reveal="up" data-hm-delay="0.25">';
			echo '<input type="hidden" name="form" value="newsletter"><input type="hidden" name="post_id" value="' . (int) get_the_ID() . '"><input type="hidden" name="element" value="' . esc_attr( $this->get_id() ) . '">';
			echo '<input type="text" name="hm_hp" value="" tabindex="-1" autocomplete="off" class="hm-hp" aria-hidden="true">';
			echo '<label class="screen-reader-text" for="hm-cta-email-' . esc_attr( $this->get_id() ) . '">' . esc_html( $s['email_placeholder'] ) . '</label>';
			echo '<input class="hm-cta__input" id="hm-cta-email-' . esc_attr( $this->get_id() ) . '" type="email" name="email" required placeholder="' . esc_attr( $s['email_placeholder'] ) . '">';
			echo '<button class="hm-btn hm-btn--lg" type="submit"><span>' . esc_html( $s['email_button'] ) . '</span>' . hamista_core_icon( 'arrow', array( 'class' => 'hm-i-arrow' ) ) . hamista_core_icon( 'check', array( 'class' => 'hm-i-done' ) ) . '</button>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<p class="hm-form__status" role="status" aria-live="polite"></p></form>';
		} else {
			$buttons = $this->render_button( $s, 'btn1', array( 'size' => 'lg' ) ) . $this->render_button( $s, 'btn2', array( 'size' => 'lg' ) );
			if ( $buttons ) {
				echo '<div class="hm-btn-row hm-btn-row--stack hm-cta__actions" data-hm-reveal="up" data-hm-delay="0.25">' . $buttons . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
		}
		if ( $s['note'] ) {
			echo '<p class="hm-cta__note" data-hm-reveal="fade" data-hm-delay="0.35">' . esc_html( $s['note'] ) . '</p>';
		}
		echo '</div></section>';
	}
}
