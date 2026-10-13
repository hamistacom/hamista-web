<?php
/**
 * Giant text: one or two words set larger than the screen, as a backdrop or a
 * section sign-off ("Steps", "Testimonials", the brand name in the footer).
 * It can stay still, slide sideways as the page scrolls, run as an endless
 * band, or split in two and part as the section passes.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Giant text widget.
 */
class Giant_Text extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-giant-text';
	}

	/** @return string */
	public function get_title() {
		return __( 'Giant Text', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-t-letter';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'giant', 'big', 'text', 'word', 'marquee', 'wordmark', 'brand' );
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
		$this->start_controls_section( 'section_giant', array( 'label' => __( 'Giant text', 'hamista-core' ) ) );
		$this->add_control(
			'text',
			array(
				'label'       => __( 'Text', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => __( 'Steps', 'hamista-core' ),
				'description' => __( 'Wrap a part in *asterisks* to colour it with the accent.', 'hamista-core' ),
				'label_block' => true,
			)
		);
		$this->add_control(
			'second',
			array(
				'label'       => __( 'Second word (split mode)', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'label_block' => true,
				'condition'   => array( 'motion' => 'part' ),
			)
		);
		$this->add_control(
			'motion',
			array(
				'label'   => __( 'Motion', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'slide',
				'options' => array(
					'none'    => __( 'Still', 'hamista-core' ),
					'slide'   => __( 'Slides sideways with scrolling', 'hamista-core' ),
					'marquee' => __( 'Endless band', 'hamista-core' ),
					'part'    => __( 'Two words part as you scroll', 'hamista-core' ),
					'rise'    => __( 'Rises from below the edge', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'look',
			array(
				'label'   => __( 'Look', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'solid',
				'options' => array(
					'solid'   => __( 'Solid', 'hamista-core' ),
					'accent'  => __( 'Accent colour', 'hamista-core' ),
					'outline' => __( 'Outline', 'hamista-core' ),
					'fade'    => __( 'Fades out downwards', 'hamista-core' ),
					'muted'   => __( 'Faint, behind content', 'hamista-core' ),
				),
			)
		);
		$this->add_responsive_control(
			'size',
			array(
				'label'      => __( 'Size', 'hamista-core' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'vw', 'px' ),
				'range'      => array(
					'vw' => array(
						'min' => 6,
						'max' => 40,
					),
					'px' => array(
						'min' => 60,
						'max' => 600,
					),
				),
				'default'    => array(
					'unit' => 'vw',
					'size' => 17,
				),
				'selectors'  => array( '{{WRAPPER}} .hm-giant' => '--hm-giant: {{SIZE}}{{UNIT}};' ),
			)
		);
		$this->add_control(
			'crop',
			array(
				'label'        => __( 'Cut off by the section edge', 'hamista-core' ),
				'description'  => __( 'Shows only the top of the letters, as if the word sinks below the section.', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
			)
		);
		$this->add_control(
			'align',
			array(
				'label'   => __( 'Alignment', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'start',
				'options' => array(
					'start'  => __( 'Start', 'hamista-core' ),
					'center' => __( 'Center', 'hamista-core' ),
					'end'    => __( 'End', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'tag',
			array(
				'label'       => __( 'HTML tag', 'hamista-core' ),
				'description' => __( 'Decorative words should stay a paragraph so each page keeps one main heading.', 'hamista-core' ),
				'type'        => Controls_Manager::SELECT,
				'default'     => 'p',
				'options'     => array(
					'p'    => 'p',
					'div'  => 'div',
					'h2'   => 'H2',
					'span' => 'span',
				),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s      = $this->get_settings_for_display();
		$motion = in_array( $s['motion'], array( 'none', 'slide', 'marquee', 'part', 'rise' ), true ) ? $s['motion'] : 'none';
		$look   = in_array( $s['look'], array( 'solid', 'accent', 'outline', 'fade', 'muted' ), true ) ? $s['look'] : 'solid';
		$tag    = in_array( $s['tag'], array( 'p', 'div', 'h2', 'span' ), true ) ? $s['tag'] : 'p';
		$text   = hamista_core_highlight( $s['text'] );
		$class  = 'hm-giant hm-giant--' . $motion . ' hm-giant--' . $look . ' hm-giant--' . sanitize_html_class( $s['align'] ) . ( 'yes' === $s['crop'] ? ' hm-giant--crop' : '' );

		printf( '<div class="%1$s" data-hm-widget="giant" data-hm-giant="%2$s">', esc_attr( $class ), esc_attr( $motion ) );
		if ( 'marquee' === $motion ) {
			echo '<' . $tag . ' class="hm-giant__band" aria-label="' . esc_attr( wp_strip_all_tags( $s['text'] ) ) . '"><span class="hm-giant__run">'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- whitelisted tag.
			for ( $i = 0; $i < 4; $i++ ) {
				echo '<span class="hm-giant__word"' . ( $i ? ' aria-hidden="true"' : '' ) . '>' . $text . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by the highlighter.
			}
			echo '</span></' . $tag . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		} elseif ( 'part' === $motion ) {
			echo '<' . $tag . ' class="hm-giant__pair"><span class="hm-giant__a">' . $text . '</span> <span class="hm-giant__b">' . hamista_core_highlight( $s['second'] ) . '</span></' . $tag . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		} else {
			echo '<' . $tag . ' class="hm-giant__word">' . $text . '</' . $tag . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		echo '</div>';
	}
}
