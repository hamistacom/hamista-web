<?php
/**
 * Login: the mobile OTP sign-in / sign-up form.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Login widget.
 */
class Login extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-login';
	}

	/** @return string */
	public function get_title() {
		return __( 'Mobile Login (OTP)', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-lock-user';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'login', 'register', 'otp', 'sms', 'account', 'mobile' );
	}

	/** @return array */
	public function get_script_depends() {
		return array( 'hamista-auth' );
	}

	/** @return array */
	public function get_style_depends() {
		return array( 'hamista-auth' );
	}

	/**
	 * Depends on the visitor's login state.
	 *
	 * @return bool
	 */
	protected function is_dynamic_content(): bool {
		return true;
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_form', array( 'label' => __( 'Form', 'hamista-core' ) ) );
		$this->add_control(
			'title',
			array(
				'label'   => __( 'Title', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Log in or sign up', 'hamista-core' ),
			)
		);
		$this->add_control(
			'subtitle',
			array(
				'label'   => __( 'Subtitle', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Enter your mobile number — we will text you a code.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'redirect',
			array(
				'label'       => __( 'Redirect after login', 'hamista-core' ),
				'type'        => Controls_Manager::URL,
				'description' => __( 'Leave empty to use the setting in Hamista → Login & SMS.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'password',
			array(
				'label'   => __( 'Password option', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '',
				'options' => array(
					''     => __( 'Follow settings', 'hamista-core' ),
					'show' => __( 'Show', 'hamista-core' ),
					'hide' => __( 'Hide', 'hamista-core' ),
				),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s = $this->get_settings_for_display();
		if ( ! hamista_core_option( 'otp_enabled' ) && \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			echo '<div class="hm-empty">' . esc_html__( 'Mobile login is off. Turn it on in Hamista → Login & SMS.', 'hamista-core' ) . '</div>';
		}
		echo \Hamista\Core\Auth\Account::render_form( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by the template.
			array(
				'title'         => $s['title'],
				'subtitle'      => $s['subtitle'],
				'redirect'      => ! empty( $s['redirect']['url'] ) ? $s['redirect']['url'] : '',
				'show_password' => '' === $s['password'] ? null : 'show' === $s['password'],
				'context'       => 'page',
			)
		);
	}
}
