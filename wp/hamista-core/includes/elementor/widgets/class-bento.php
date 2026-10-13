<?php
/**
 * Bento grid: cards of different sizes on one grid. Each card picks what it
 * holds (a call to action, a figure, a rating with a logo, a picture with a
 * caption) and its tone (light, dark, accent, glass), and how many columns
 * and rows it spans.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Bento widget.
 */
class Bento extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-bento';
	}

	/** @return string */
	public function get_title() {
		return __( 'Bento Grid', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-gallery-grid';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'bento', 'grid', 'cards', 'features', 'why us', 'benefits' );
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
		$this->start_controls_section( 'section_cards', array( 'label' => __( 'Cards', 'hamista-core' ) ) );
		$c = new Repeater();
		$c->add_control(
			'kind',
			array(
				'label'   => __( 'Card holds', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'text',
				'options' => array(
					'text'   => __( 'Title, text and button', 'hamista-core' ),
					'figure' => __( 'Title with a big figure', 'hamista-core' ),
					'rating' => __( 'Stars, score and a logo', 'hamista-core' ),
					'image'  => __( 'Picture with a caption', 'hamista-core' ),
					'list'   => __( 'Title with a checklist', 'hamista-core' ),
				),
			)
		);
		$c->add_control(
			'kicker',
			array(
				'label' => __( 'Small line above', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$c->add_control(
			'title',
			array(
				'label'   => __( 'Title', 'hamista-core' ),
				'type'    => Controls_Manager::TEXTAREA,
				'rows'    => 2,
				'default' => __( 'Safe and reliable', 'hamista-core' ),
			)
		);
		$c->add_control(
			'text',
			array(
				'label' => __( 'Text', 'hamista-core' ),
				'type'  => Controls_Manager::TEXTAREA,
				'rows'  => 3,
			)
		);
		$c->add_control(
			'value',
			array(
				'label'       => __( 'Figure or score', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'description' => __( 'For example 24/7, 95% or 4.8/5.', 'hamista-core' ),
			)
		);
		$c->add_control(
			'image',
			array(
				'label' => __( 'Picture', 'hamista-core' ),
				'type'  => Controls_Manager::MEDIA,
			)
		);
		$c->add_control(
			'image_place',
			array(
				'label'   => __( 'Picture placement', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'fill',
				'options' => array(
					'fill'   => __( 'Fills the card', 'hamista-core' ),
					'end'    => __( 'At the end side', 'hamista-core' ),
					'bottom' => __( 'At the bottom', 'hamista-core' ),
					'center' => __( 'In the middle (logo)', 'hamista-core' ),
				),
			)
		);
		$c->add_control(
			'btn_text',
			array(
				'label' => __( 'Button text', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$c->add_control(
			'btn_link',
			array(
				'label' => __( 'Link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$c->add_control(
			'tone',
			array(
				'label'   => __( 'Tone', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'light',
				'options' => array(
					'light'  => __( 'Light', 'hamista-core' ),
					'dark'   => __( 'Dark', 'hamista-core' ),
					'accent' => __( 'Accent', 'hamista-core' ),
					'glass'  => __( 'Frosted glass', 'hamista-core' ),
					'clear'  => __( 'Transparent with a line', 'hamista-core' ),
				),
			)
		);
		$c->add_control(
			'cols',
			array(
				'label'   => __( 'Columns wide', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '3',
				'options' => array(
					'1' => '1',
					'2' => '2',
					'3' => '3',
					'4' => '4',
					'5' => '5',
					'6' => '6',
					'9' => '9',
				),
			)
		);
		$c->add_control(
			'rows',
			array(
				'label'   => __( 'Rows tall', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '1',
				'options' => array(
					'1' => '1',
					'2' => '2',
				),
			)
		);
		$this->add_control(
			'cards',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $c->get_controls(),
				'title_field' => '{{{ title }}}',
				'default'     => array(
					array(
						'kind'     => 'text',
						'kicker'   => __( 'A short call, no strings attached.', 'hamista-core' ),
						'title'    => __( 'Let us talk, or just say hello.', 'hamista-core' ),
						'btn_text' => __( 'Book a call', 'hamista-core' ),
						'cols'     => '3',
					),
					array(
						'kind'  => 'figure',
						'title' => __( 'Support around the clock', 'hamista-core' ),
						'text'  => __( 'From planning to launch and beyond.', 'hamista-core' ),
						'value' => '24/7',
						'tone'  => 'dark',
						'cols'  => '3',
					),
					array(
						'kind'        => 'rating',
						'title'       => __( '150+ happy clients', 'hamista-core' ),
						'value'       => '4.8/5',
						'image_place' => 'center',
						'cols'        => '3',
						'rows'        => '2',
					),
					array(
						'kind'  => 'text',
						'title' => __( 'Safe and reliable', 'hamista-core' ),
						'text'  => __( 'Since 1398', 'hamista-core' ),
						'tone'  => 'accent',
						'cols'  => '2',
					),
					array(
						'kind'  => 'text',
						'title' => __( 'Built with the best', 'hamista-core' ),
						'text'  => __( 'The latest tools, connected and ready to go.', 'hamista-core' ),
						'cols'  => '2',
					),
					array(
						'kind'  => 'image',
						'title' => __( 'Reliable and ready for what comes next', 'hamista-core' ),
						'tone'  => 'dark',
						'cols'  => '2',
					),
				),
			)
		);
		$this->add_responsive_control(
			'columns',
			array(
				'label'          => __( 'Grid columns', 'hamista-core' ),
				'type'           => Controls_Manager::SELECT,
				'default'        => '9',
				'tablet_default' => '2',
				'mobile_default' => '1',
				'options'        => array(
					'1'  => '1',
					'2'  => '2',
					'4'  => '4',
					'6'  => '6',
					'9'  => '9',
					'12' => '12',
				),
				'selectors'      => array( '{{WRAPPER}} .hm-bento' => '--hm-bento-cols: {{VALUE}};' ),
			)
		);
		$this->add_responsive_control(
			'row_height',
			array(
				'label'      => __( 'Row height', 'hamista-core' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px' ),
				'range'      => array(
					'px' => array(
						'min' => 120,
						'max' => 480,
					),
				),
				'default'    => array(
					'unit' => 'px',
					'size' => 300,
				),
				'selectors'  => array( '{{WRAPPER}} .hm-bento' => '--hm-bento-row: {{SIZE}}px;' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s = $this->get_settings_for_display();
		echo '<div class="hm-bento" data-hm-stagger="0.08">';
		foreach ( (array) $s['cards'] as $card ) {
			$kind  = in_array( $card['kind'], array( 'text', 'figure', 'rating', 'image', 'list' ), true ) ? $card['kind'] : 'text';
			$tone  = in_array( $card['tone'], array( 'light', 'dark', 'accent', 'glass', 'clear' ), true ) ? $card['tone'] : 'light';
			$place = in_array( $card['image_place'], array( 'fill', 'end', 'bottom', 'center' ), true ) ? $card['image_place'] : 'fill';
			$has   = ! empty( $card['image']['url'] ) && false === strpos( $card['image']['url'], 'placeholder' );
			printf(
				'<div class="hm-bento__card hm-bento__card--%1$s hm-bento__card--%2$s%3$s" style="--c:%4$d;--r:%5$d" data-hm-reveal="up">',
				esc_attr( $kind ),
				esc_attr( $tone ),
				$has ? ' has-img hm-bento__card--img-' . esc_attr( $place ) : '',
				(int) max( 1, (int) $card['cols'] ),
				(int) max( 1, (int) $card['rows'] )
			);
			if ( $has ) {
				echo '<span class="hm-bento__img" data-hm-parallax="0.06" data-hm-parallax-var>' . hamista_core_image( $card['image'], 'image' === $kind || 'fill' === $place ? 'large' : 'medium_large' ) . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '<div class="hm-bento__body">';
			if ( 'rating' === $kind ) {
				echo '<div class="hm-bento__rate">' . Proof::stars( 4.5 ) . '<b class="hm-num">' . esc_html( hamista_core_digits( $card['value'] ) ) . '</b></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			if ( $card['kicker'] ) {
				echo '<p class="hm-bento__kicker">' . esc_html( $card['kicker'] ) . '</p>';
			}
			if ( $card['title'] ) {
				echo '<h3 class="hm-bento__title">' . hamista_core_highlight( $card['title'] ) . '</h3>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			if ( 'figure' === $kind && '' !== (string) $card['value'] ) {
				echo '<b class="hm-bento__value hm-num">' . esc_html( hamista_core_digits( $card['value'] ) ) . '</b>';
			}
			if ( $card['text'] ) {
				if ( 'list' === $kind ) {
					echo '<ul class="hm-bento__list">';
					foreach ( array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n/', $card['text'] ) ) ) as $line ) {
						echo '<li>' . hamista_core_icon( 'check' ) . esc_html( $line ) . '</li>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					}
					echo '</ul>';
				} else {
					echo '<p class="hm-bento__text">' . esc_html( $card['text'] ) . '</p>';
				}
			}
			if ( $card['btn_text'] ) {
				echo self::button_html( $card['btn_text'], $card['btn_link'], 'accent' === $tone ? 'inverse' : 'primary', array( 'size' => 'sm' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</div></div>';
		}
		echo '</div>';
	}
}
