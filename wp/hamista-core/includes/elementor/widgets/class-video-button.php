<?php
/**
 * Video: a still or a short muted loop with a play button. Clicking opens the
 * full film (MP4, Aparat or YouTube) in a window over the page; nothing heavy
 * loads until then.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Video button widget.
 */
class Video_Button extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-video-button';
	}

	/** @return string */
	public function get_title() {
		return __( 'Video Window', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-youtube';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'video', 'film', 'play', 'popup', 'lightbox', 'aparat', 'youtube' );
	}

	/** @return array */
	public function get_script_depends() {
		return array( 'hamista-motion', 'hamista-agency' );
	}

	/** @return array */
	public function get_style_depends() {
		return array( 'hamista-widgets', 'hamista-agency' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_video', array( 'label' => __( 'Video', 'hamista-core' ) ) );
		$this->add_control(
			'film',
			array(
				'label'       => __( 'Film address', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'description' => __( 'An MP4 file, or an Aparat or YouTube link. Opens in a window over the page.', 'hamista-core' ),
				'label_block' => true,
				'default'     => '',
			)
		);
		$this->add_control(
			'loop',
			array(
				'label'       => __( 'Short loop on the card (MP4, optional)', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'description' => __( 'A few silent seconds, under 2 MB. Plays only while the card is on screen.', 'hamista-core' ),
				'label_block' => true,
			)
		);
		$this->add_control(
			'poster',
			array(
				'label' => __( 'Still image', 'hamista-core' ),
				'type'  => Controls_Manager::MEDIA,
			)
		);
		$this->add_control(
			'label',
			array(
				'label'   => __( 'Button text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Watch the film', 'hamista-core' ),
			)
		);
		$this->add_control(
			'look',
			array(
				'label'   => __( 'Look', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'card',
				'options' => array(
					'card'   => __( 'Card with play button', 'hamista-core' ),
					'button' => __( 'Round play button only', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'ratio',
			array(
				'label'     => __( 'Card shape', 'hamista-core' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => '16/10',
				'options'   => array(
					'16/10' => __( 'Wide', 'hamista-core' ),
					'4/3'   => __( 'Classic', 'hamista-core' ),
					'1/1'   => __( 'Square', 'hamista-core' ),
					'3/4'   => __( 'Portrait', 'hamista-core' ),
				),
				'selectors' => array( '{{WRAPPER}} .hm-vid' => '--hm-vid-ratio: {{VALUE}};' ),
				'condition' => array( 'look' => 'card' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s    = $this->get_settings_for_display();
		$film = trim( (string) $s['film'] );
		$look = 'button' === $s['look'] ? 'button' : 'card';
		echo '<div class="hm-vid hm-vid--' . esc_attr( $look ) . '" data-hm-reveal="up">';
		if ( 'card' === $look ) {
			echo '<div class="hm-vid__media">';
			echo hamista_core_image( $s['poster'], 'medium_large', array( 'class' => 'hm-vid__poster' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			if ( ! empty( $s['loop'] ) ) {
				echo '<video class="hm-vid__loop" data-hm-loop="' . esc_url( $s['loop'] ) . '" muted loop playsinline preload="none" aria-hidden="true"></video>';
			}
			echo '</div>';
		}
		$label = $s['label'] ? $s['label'] : __( 'Play', 'hamista-core' );
		if ( $film ) {
			printf(
				'<button type="button" class="hm-vid__play" data-hm-film="%1$s"><span class="hm-vid__icon">%2$s</span><span class="hm-vid__label">%3$s</span></button>',
				esc_url( $film ),
				hamista_core_icon( 'play' ), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				esc_html( $label )
			);
		} else {
			echo '<span class="hm-vid__play" aria-hidden="true"><span class="hm-vid__icon">' . hamista_core_icon( 'play' ) . '</span></span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		echo '</div>';
	}
}
