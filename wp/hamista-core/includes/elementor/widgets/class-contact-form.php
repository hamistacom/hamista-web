<?php
/**
 * Contact Form: AJAX form saved to Hamista → Form messages and emailed.
 * The recipient and required fields are read on the server from the saved
 * widget settings, never from the browser.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Contact form widget.
 */
class Contact_Form extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-contact-form';
	}

	/** @return string */
	public function get_title() {
		return __( 'Contact Form', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-form-horizontal';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'form', 'contact', 'message', 'email' );
	}

	/**
	 * Field definitions: key => [ label, type ].
	 *
	 * @return array
	 */
	public static function fields() {
		return array(
			'name'    => array( __( 'Your name', 'hamista-core' ), 'text' ),
			'email'   => array( __( 'Email', 'hamista-core' ), 'email' ),
			'phone'   => array( __( 'Mobile', 'hamista-core' ), 'tel' ),
			'subject' => array( __( 'Subject', 'hamista-core' ), 'text' ),
			'message' => array( __( 'Message', 'hamista-core' ), 'textarea' ),
		);
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_fields', array( 'label' => __( 'Fields', 'hamista-core' ) ) );
		foreach ( self::fields() as $key => $field ) {
			$this->add_control(
				'show_' . $key,
				array(
					/* translators: %s: field name */
					'label'        => sprintf( __( 'Show “%s”', 'hamista-core' ), $field[0] ),
					'type'         => Controls_Manager::SWITCHER,
					'return_value' => 'yes',
					'default'      => in_array( $key, array( 'name', 'email', 'message' ), true ) ? 'yes' : '',
					'separator'    => 'name' === $key ? 'none' : 'before',
				)
			);
			$this->add_control(
				'label_' . $key,
				array(
					'label'     => __( 'Label', 'hamista-core' ),
					'type'      => Controls_Manager::TEXT,
					'default'   => $field[0],
					'condition' => array( 'show_' . $key => 'yes' ),
				)
			);
			$this->add_control(
				'req_' . $key,
				array(
					'label'        => __( 'Required', 'hamista-core' ),
					'type'         => Controls_Manager::SWITCHER,
					'return_value' => 'yes',
					'default'      => in_array( $key, array( 'name', 'message' ), true ) ? 'yes' : '',
					'condition'    => array( 'show_' . $key => 'yes' ),
				)
			);
		}
		$this->end_controls_section();

		$this->start_controls_section( 'section_submit', array( 'label' => __( 'Sending', 'hamista-core' ) ) );
		$this->add_control(
			'button',
			array(
				'label'   => __( 'Button text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Send message', 'hamista-core' ),
			)
		);
		$this->add_control(
			'success',
			array(
				'label'   => __( 'Success message', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Thanks! Your message is on its way — we usually reply within a day.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'to',
			array(
				'label'       => __( 'Send to', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'placeholder' => get_option( 'admin_email' ),
				'description' => __( 'Leave empty to use the site admin email. Every message is also saved in Hamista → Form messages.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'consent',
			array(
				'label'       => __( 'Consent checkbox text', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'description' => __( 'Leave empty to hide.', 'hamista-core' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s  = $this->get_settings_for_display();
		$id = 'hmf-' . $this->get_id();
		echo '<form class="hm-form hm-form--contact hm-bolted" data-hm-widget="form" novalidate>';
		echo '<input type="hidden" name="form" value="contact"><input type="hidden" name="post_id" value="' . (int) get_the_ID() . '"><input type="hidden" name="element" value="' . esc_attr( $this->get_id() ) . '">';
		echo '<input type="text" name="hm_hp" value="" tabindex="-1" autocomplete="off" class="hm-hp" aria-hidden="true">';
		echo '<div class="hm-form__grid">';
		foreach ( self::fields() as $key => $field ) {
			if ( 'yes' !== $s[ 'show_' . $key ] ) {
				continue;
			}
			$req   = 'yes' === $s[ 'req_' . $key ];
			$label = $s[ 'label_' . $key ];
			$wide  = in_array( $key, array( 'message', 'subject' ), true ) ? ' hm-field--wide' : '';
			echo '<div class="hm-field' . esc_attr( $wide ) . '"><label for="' . esc_attr( $id . '-' . $key ) . '">' . esc_html( $label ) . ( $req ? ' <span aria-hidden="true">*</span>' : '' ) . '</label>';
			$attrs = ' id="' . esc_attr( $id . '-' . $key ) . '" name="' . esc_attr( $key ) . '"' . ( $req ? ' required' : '' );
			if ( 'textarea' === $field[1] ) {
				echo '<textarea' . $attrs . ' rows="5"></textarea>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			} else {
				$extra = 'email' === $field[1] ? ' autocomplete="email"' : ( 'tel' === $field[1] ? ' autocomplete="tel" inputmode="tel"' : ( 'name' === $key ? ' autocomplete="name"' : '' ) );
				echo '<input type="' . esc_attr( $field[1] ) . '"' . $attrs . $extra . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</div>';
		}
		echo '</div>';
		if ( $s['consent'] ) {
			echo '<label class="hm-form__consent"><input type="checkbox" name="consent" value="1" required> <span>' . esc_html( $s['consent'] ) . '</span></label>';
		}
		echo '<div class="hm-form__foot"><button class="hm-btn hm-btn--lg" type="submit"><span>' . esc_html( $s['button'] ) . '</span>' . hamista_core_icon( 'arrow', array( 'class' => 'hm-i-arrow' ) ) . '</button>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '<p class="hm-form__status" role="status" aria-live="polite"></p></div>';
		echo '</form>';
	}
}
