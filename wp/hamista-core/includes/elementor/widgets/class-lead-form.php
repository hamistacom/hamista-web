<?php
/**
 * Multi-step lead form: what the visitor needs → budget and timing → contact
 * details. One question per screen keeps the first step effortless; answers
 * are kept in the browser so a visitor who leaves half-way can pick up again.
 *
 * Submissions go through the same endpoint and inbox as the contact form.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Lead form widget.
 */
class Lead_Form extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-lead-form';
	}

	/** @return string */
	public function get_title() {
		return __( 'Multi-step Form', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-form-vertical';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'form', 'lead', 'quote', 'steps', 'wizard', 'request' );
	}

	/** @return array */
	public function get_script_depends() {
		return array( 'hamista-motion', 'hamista-lead-form' );
	}

	/**
	 * Contact fields of the last step: key => [ label, type, shown by default, required by default ].
	 *
	 * @return array
	 */
	public static function contact_fields() {
		return array(
			'name'    => array( __( 'Full name', 'hamista-core' ), 'text', true, true ),
			'phone'   => array( __( 'Mobile number', 'hamista-core' ), 'tel', true, true ),
			'email'   => array( __( 'Email', 'hamista-core' ), 'email', false, false ),
			'company' => array( __( 'Business or website', 'hamista-core' ), 'text', true, false ),
			'message' => array( __( 'Anything else we should know?', 'hamista-core' ), 'textarea', true, false ),
		);
	}

	/**
	 * Settings with their defaults applied (shared with the submit handler).
	 *
	 * @param array $s Saved settings.
	 * @return array
	 */
	public static function normalize( $s ) {
		$defaults = array(
			'multi'       => 'yes',
			'budget_on'   => 'yes',
			'timeline_on' => 'yes',
			'budgets'     => '',
			'timelines'   => '',
			'choices'     => array(),
		);
		foreach ( self::contact_fields() as $key => $field ) {
			$defaults[ 'show_' . $key ] = $field[2] ? 'yes' : '';
			$defaults[ 'req_' . $key ]  = $field[3] ? 'yes' : '';
		}
		return array_merge( $defaults, (array) $s );
	}

	/**
	 * Split a one-option-per-line textarea.
	 *
	 * @param string $text Text.
	 * @return array
	 */
	public static function lines( $text ) {
		return array_values( array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n/', (string) $text ) ), 'strlen' ) );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_need', array( 'label' => __( 'Step 1 — Needs', 'hamista-core' ) ) );
		$this->add_control(
			'need_label',
			array(
				'label'   => __( 'Step name', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Services', 'hamista-core' ),
			)
		);
		$this->add_control(
			'need_title',
			array(
				'label'       => __( 'Question', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'label_block' => true,
				'default'     => __( 'What can we help you with?', 'hamista-core' ),
			)
		);
		$this->add_control(
			'need_desc',
			array(
				'label'   => __( 'Hint', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Pick as many as you like.', 'hamista-core' ),
			)
		);
		$choices = new Repeater();
		$choices->add_control(
			'label',
			array(
				'label'   => __( 'Option', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Option', 'hamista-core' ),
			)
		);
		$choices->add_control(
			'note',
			array(
				'label' => __( 'Short note', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$choices->add_control(
			'icon',
			array(
				'label'   => __( 'Icon', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'target',
				'options' => self::icon_options(),
			)
		);
		$this->add_control(
			'choices',
			array(
				'label'       => __( 'Options', 'hamista-core' ),
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $choices->get_controls(),
				'title_field' => '{{{ label }}}',
				'default'     => array(
					array(
						'label' => __( 'Website', 'hamista-core' ),
						'icon'  => 'globe',
					),
					array(
						'label' => __( 'Branding', 'hamista-core' ),
						'icon'  => 'palette',
					),
					array(
						'label' => __( 'Marketing', 'hamista-core' ),
						'icon'  => 'megaphone',
					),
					array(
						'label' => __( 'Something else', 'hamista-core' ),
						'icon'  => 'plus',
					),
				),
			)
		);
		$this->add_control(
			'multi',
			array(
				'label'        => __( 'Allow several options', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_budget', array( 'label' => __( 'Step 2 — Budget & timing', 'hamista-core' ) ) );
		$this->add_control(
			'budget_on',
			array(
				'label'        => __( 'Show this step', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->add_control(
			'budget_label',
			array(
				'label'     => __( 'Step name', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Budget', 'hamista-core' ),
				'condition' => array( 'budget_on' => 'yes' ),
			)
		);
		$this->add_control(
			'budget_title',
			array(
				'label'       => __( 'Question', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'label_block' => true,
				'default'     => __( 'Roughly what budget do you have in mind?', 'hamista-core' ),
				'condition'   => array( 'budget_on' => 'yes' ),
			)
		);
		$this->add_control(
			'budgets',
			array(
				'label'       => __( 'Budget options', 'hamista-core' ),
				'type'        => Controls_Manager::TEXTAREA,
				'rows'        => 5,
				'description' => __( 'One option per line.', 'hamista-core' ),
				'default'     => implode( "\n", array( __( 'Under $2,000', 'hamista-core' ), __( '$2,000 – $5,000', 'hamista-core' ), __( '$5,000 – $10,000', 'hamista-core' ), __( 'More than $10,000', 'hamista-core' ), __( 'Not sure yet', 'hamista-core' ) ) ),
				'condition'   => array( 'budget_on' => 'yes' ),
			)
		);
		$this->add_control(
			'timeline_on',
			array(
				'label'        => __( 'Ask about timing', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
				'separator'    => 'before',
				'condition'    => array( 'budget_on' => 'yes' ),
			)
		);
		$this->add_control(
			'timeline_title',
			array(
				'label'     => __( 'Timing question', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'When would you like to start?', 'hamista-core' ),
				'condition' => array(
					'budget_on'   => 'yes',
					'timeline_on' => 'yes',
				),
			)
		);
		$this->add_control(
			'timelines',
			array(
				'label'       => __( 'Timing options', 'hamista-core' ),
				'type'        => Controls_Manager::TEXTAREA,
				'rows'        => 4,
				'description' => __( 'One option per line.', 'hamista-core' ),
				'default'     => implode( "\n", array( __( 'As soon as possible', 'hamista-core' ), __( 'Within a month', 'hamista-core' ), __( 'In a few months', 'hamista-core' ) ) ),
				'condition'   => array(
					'budget_on'   => 'yes',
					'timeline_on' => 'yes',
				),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_contact', array( 'label' => __( 'Step 3 — Contact details', 'hamista-core' ) ) );
		$this->add_control(
			'contact_label',
			array(
				'label'   => __( 'Step name', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Contact', 'hamista-core' ),
			)
		);
		$this->add_control(
			'contact_title',
			array(
				'label'       => __( 'Question', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'label_block' => true,
				'default'     => __( 'Where can we reach you?', 'hamista-core' ),
			)
		);
		foreach ( self::contact_fields() as $key => $field ) {
			$this->add_control(
				'show_' . $key,
				array(
					/* translators: %s: field name */
					'label'        => sprintf( __( 'Show “%s”', 'hamista-core' ), $field[0] ),
					'type'         => Controls_Manager::SWITCHER,
					'return_value' => 'yes',
					'default'      => $field[2] ? 'yes' : '',
					'separator'    => 'before',
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
			if ( 'name' !== $key && 'phone' !== $key ) {
				$this->add_control(
					'req_' . $key,
					array(
						'label'        => __( 'Required', 'hamista-core' ),
						'type'         => Controls_Manager::SWITCHER,
						'return_value' => 'yes',
						'default'      => $field[3] ? 'yes' : '',
						'condition'    => array( 'show_' . $key => 'yes' ),
					)
				);
			}
		}
		$this->add_control(
			'consent',
			array(
				'label'       => __( 'Consent checkbox text', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'label_block' => true,
				'separator'   => 'before',
				'description' => __( 'Leave empty to hide.', 'hamista-core' ),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_finish', array( 'label' => __( 'Buttons & confirmation', 'hamista-core' ) ) );
		$this->add_control(
			'next_text',
			array(
				'label'   => __( 'Next button', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Next', 'hamista-core' ),
			)
		);
		$this->add_control(
			'back_text',
			array(
				'label'   => __( 'Back button', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Back', 'hamista-core' ),
			)
		);
		$this->add_control(
			'submit_text',
			array(
				'label'   => __( 'Submit button', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Send request', 'hamista-core' ),
			)
		);
		$this->add_control(
			'done_title',
			array(
				'label'     => __( 'Confirmation title', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Request received', 'hamista-core' ),
				'separator' => 'before',
			)
		);
		$this->add_control(
			'done_text',
			array(
				'label'   => __( 'Confirmation text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXTAREA,
				'rows'    => 3,
				'default' => __( 'We will call you within one working day. Meanwhile, have a look at what we have built for others.', 'hamista-core' ),
			)
		);
		$this->add_button_controls(
			'done_btn',
			__( 'Confirmation button', 'hamista-core' ),
			array(
				'text'  => '',
				'style' => 'secondary',
			)
		);
		$this->add_control(
			'to',
			array(
				'label'       => __( 'Send to', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'placeholder' => get_option( 'admin_email' ),
				'separator'   => 'before',
				'description' => __( 'Leave empty to use the site admin email. Every request is also saved in Hamista → Form messages.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'remember',
			array(
				'label'        => __( 'Remember unfinished answers', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
				'description'  => __( 'Kept only in the visitor\'s browser, so they can continue where they left off.', 'hamista-core' ),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section(
			'section_style',
			array(
				'label' => __( 'Box', 'hamista-core' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);
		$this->add_control(
			'boxed',
			array(
				'label'        => __( 'Card background', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->add_responsive_control(
			'columns',
			array(
				'label'     => __( 'Option columns', 'hamista-core' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => '2',
				'options'   => array(
					'1' => '1',
					'2' => '2',
					'3' => '3',
					'4' => '4',
				),
				'selectors' => array( '{{WRAPPER}} .hm-lead__choices' => '--cols: {{VALUE}};' ),
			)
		);
		$this->add_control(
			'accent',
			array(
				'label'     => __( 'Accent color', 'hamista-core' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array( '{{WRAPPER}}' => '--hm-accent: {{VALUE}}; --hm-accent-ink: {{VALUE}};' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s     = self::normalize( $this->get_settings_for_display() );
		$id    = 'hml-' . $this->get_id();
		$steps = array( 'need' );
		if ( 'yes' === $s['budget_on'] ) {
			$steps[] = 'budget';
		}
		$steps[] = 'contact';
		$total   = count( $steps );

		printf(
			'<div class="hm-lead%1$s" data-hm-widget="leadform" data-key="%2$s"%3$s>',
			'yes' === ( $s['boxed'] ?? 'yes' ) ? ' hm-lead--boxed hm-bolted' : '',
			esc_attr( $this->get_id() . '-' . get_the_ID() ),
			'yes' === ( $s['remember'] ?? 'yes' ) ? ' data-remember' : ''
		);

		// Step indicator.
		echo '<ol class="hm-lead__nav" aria-hidden="true">';
		foreach ( $steps as $i => $step ) {
			$label = $s[ $step . '_label' ] ?? '';
			printf( '<li class="%1$s"><span class="hm-lead__dot">%2$s</span><span class="hm-lead__name">%3$s</span></li>', 0 === $i ? 'is-current' : '', esc_html( hamista_core_digits( (string) ( $i + 1 ) ) ), esc_html( $label ) );
		}
		echo '</ol><div class="hm-lead__bar" aria-hidden="true"><span></span></div>';

		echo '<div class="hm-lead__resume" hidden><p>' . esc_html__( 'You started a request earlier. Continue where you left off?', 'hamista-core' ) . '</p><div><button type="button" class="hm-btn hm-btn--sm" data-resume>' . esc_html__( 'Continue', 'hamista-core' ) . '</button><button type="button" class="hm-btn hm-btn--sm hm-btn--ghost" data-restart>' . esc_html__( 'Start over', 'hamista-core' ) . '</button></div></div>';

		echo '<form class="hm-lead__form" novalidate>';
		echo '<input type="hidden" name="form" value="lead"><input type="hidden" name="post_id" value="' . (int) get_the_ID() . '"><input type="hidden" name="element" value="' . esc_attr( $this->get_id() ) . '">';
		echo '<input type="text" name="hm_hp" value="" tabindex="-1" autocomplete="off" class="hm-hp" aria-hidden="true">';

		foreach ( $steps as $i => $step ) {
			printf( '<fieldset class="hm-lead__step%1$s" data-step="%2$s"%3$s>', 0 === $i ? ' is-active' : '', esc_attr( $step ), 0 === $i ? '' : ' hidden' );
			printf( '<legend class="hm-lead__q" tabindex="-1"><span class="hm-lead__count">%1$s</span>%2$s</legend>', esc_html( sprintf( /* translators: 1: step number, 2: step count */ __( '%1$s of %2$s', 'hamista-core' ), hamista_core_digits( (string) ( $i + 1 ) ), hamista_core_digits( (string) $total ) ) ), esc_html( $s[ $step . '_title' ] ?? '' ) );
			call_user_func( array( $this, 'render_step_' . $step ), $s, $id );
			echo '<p class="hm-lead__msg" role="alert" data-hm-msg></p></fieldset>';
		}

		echo '<div class="hm-lead__actions">';
		echo '<button type="button" class="hm-btn hm-btn--ghost" data-prev hidden>' . hamista_core_icon( 'arrow', array( 'class' => 'hm-i-back' ) ) . '<span>' . esc_html( $s['back_text'] ?? __( 'Back', 'hamista-core' ) ) . '</span></button>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '<button type="button" class="hm-btn" data-next' . ( 1 === $total ? ' hidden' : '' ) . '><span>' . esc_html( $s['next_text'] ?? __( 'Next', 'hamista-core' ) ) . '</span>' . hamista_core_icon( 'arrow', array( 'class' => 'hm-i-arrow' ) ) . '</button>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '<button type="submit" class="hm-btn" data-submit' . ( 1 === $total ? '' : ' hidden' ) . '><span>' . esc_html( $s['submit_text'] ?? __( 'Send request', 'hamista-core' ) ) . '</span>' . hamista_core_icon( 'check', array( 'class' => 'hm-i-done' ) ) . '</button>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '</div></form>';

		echo '<div class="hm-lead__done" hidden tabindex="-1"><span class="hm-lead__tick" aria-hidden="true"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="m15 27 7.5 7.5L37 19"/></svg></span>';
		echo '<h3>' . esc_html( $s['done_title'] ?? '' ) . '</h3><p>' . esc_html( $s['done_text'] ?? '' ) . '</p>';
		echo $this->render_button( $s, 'done_btn' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '</div></div>';
	}

	/**
	 * Step 1: needs.
	 *
	 * @param array  $s  Settings.
	 * @param string $id Widget DOM id prefix.
	 */
	protected function render_step_need( $s, $id ) {
		if ( ! empty( $s['need_desc'] ) ) {
			echo '<p class="hm-lead__hint">' . esc_html( $s['need_desc'] ) . '</p>';
		}
		$type = 'yes' === $s['multi'] ? 'checkbox' : 'radio';
		echo '<div class="hm-lead__choices" data-required>';
		foreach ( (array) $s['choices'] as $i => $choice ) {
			$label = trim( (string) ( $choice['label'] ?? '' ) );
			if ( '' === $label ) {
				continue;
			}
			printf(
				'<label class="hm-choice"><input type="%1$s" name="need[]" value="%2$s"><span class="hm-choice__box">%3$s<span class="hm-choice__text"><b>%4$s</b>%5$s</span><span class="hm-choice__mark" aria-hidden="true">%6$s</span></span></label>',
				esc_attr( $type ),
				esc_attr( $label ),
				! empty( $choice['icon'] ) ? hamista_core_icon( $choice['icon'], array( 'class' => 'hm-choice__icon' ) ) : '',
				esc_html( $label ),
				! empty( $choice['note'] ) ? '<small>' . esc_html( $choice['note'] ) . '</small>' : '',
				hamista_core_icon( 'check', array( 'size' => 16 ) )
			);
		}
		echo '</div>';
	}

	/**
	 * Step 2: budget and timing.
	 *
	 * @param array  $s  Settings.
	 * @param string $id Widget DOM id prefix.
	 */
	protected function render_step_budget( $s, $id ) {
		echo '<div class="hm-lead__pills" data-required>';
		foreach ( self::lines( $s['budgets'] ) as $option ) {
			printf( '<label class="hm-pill"><input type="radio" name="budget" value="%1$s"><span>%2$s</span></label>', esc_attr( $option ), esc_html( $option ) );
		}
		echo '</div>';
		if ( 'yes' === $s['timeline_on'] && self::lines( $s['timelines'] ) ) {
			echo '<p class="hm-lead__sub" id="' . esc_attr( $id ) . '-tl">' . esc_html( $s['timeline_title'] ?? '' ) . '</p>';
			echo '<div class="hm-lead__pills" role="radiogroup" aria-labelledby="' . esc_attr( $id ) . '-tl">';
			foreach ( self::lines( $s['timelines'] ) as $option ) {
				printf( '<label class="hm-pill"><input type="radio" name="timeline" value="%1$s"><span>%2$s</span></label>', esc_attr( $option ), esc_html( $option ) );
			}
			echo '</div>';
		}
	}

	/**
	 * Step 3: contact details.
	 *
	 * @param array  $s  Settings.
	 * @param string $id Widget DOM id prefix.
	 */
	protected function render_step_contact( $s, $id ) {
		echo '<div class="hm-lead__fields">';
		foreach ( self::contact_fields() as $key => $field ) {
			if ( 'yes' !== $s[ 'show_' . $key ] ) {
				continue;
			}
			$required = in_array( $key, array( 'name', 'phone' ), true ) || 'yes' === $s[ 'req_' . $key ];
			$label    = ! empty( $s[ 'label_' . $key ] ) ? $s[ 'label_' . $key ] : $field[0];
			$fid      = $id . '-' . $key;
			$attrs    = $required ? ' required aria-required="true"' : '';
			$auto     = array(
				'name'    => 'name',
				'phone'   => 'tel',
				'email'   => 'email',
				'company' => 'organization',
			);
			if ( isset( $auto[ $key ] ) ) {
				$attrs .= ' autocomplete="' . $auto[ $key ] . '"';
			}
			if ( 'phone' === $key ) {
				$attrs .= ' inputmode="tel" dir="ltr" placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"';
			}
			if ( 'email' === $key ) {
				$attrs .= ' dir="ltr"';
			}
			echo '<p class="hm-field hm-field--' . esc_attr( $key ) . '">';
			echo '<label for="' . esc_attr( $fid ) . '">' . esc_html( $label ) . ( $required ? '' : ' <small>' . esc_html__( '(optional)', 'hamista-core' ) . '</small>' ) . '</label>';
			if ( 'textarea' === $field[1] ) {
				echo '<textarea id="' . esc_attr( $fid ) . '" name="' . esc_attr( $key ) . '" rows="3"' . $attrs . '></textarea>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			} else {
				echo '<input id="' . esc_attr( $fid ) . '" type="' . esc_attr( $field[1] ) . '" name="' . esc_attr( $key ) . '"' . $attrs . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</p>';
		}
		if ( ! empty( $s['consent'] ) ) {
			echo '<label class="hm-field hm-field--consent"><input type="checkbox" name="consent" value="1" required> <span>' . esc_html( $s['consent'] ) . '</span></label>';
		}
		echo '</div>';
	}
}
