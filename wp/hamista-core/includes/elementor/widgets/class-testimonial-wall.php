<?php
/**
 * Testimonial wall: quote cards in light, dark and accent tones, each with the
 * client under it.
 *  - scatter: cards spread over a giant word, drifting at different speeds;
 *  - columns: two staggered columns that move against each other as the
 *             section scrolls by;
 *  - spotlight: one client at a time in a large photo card, picked from a
 *             row of faces, with the quote and the brands that trust you.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Testimonial wall widget.
 */
class Testimonial_Wall extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-testimonial-wall';
	}

	/** @return string */
	public function get_title() {
		return __( 'Testimonial Wall', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-testimonial-carousel';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'testimonials', 'reviews', 'quotes', 'clients', 'feedback' );
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
		$this->start_controls_section( 'section_quotes', array( 'label' => __( 'Testimonials', 'hamista-core' ) ) );
		$r = new Repeater();
		$r->add_control(
			'quote',
			array(
				'label'   => __( 'Quote', 'hamista-core' ),
				'type'    => Controls_Manager::TEXTAREA,
				'rows'    => 4,
				'default' => __( 'They understood what we wanted quickly, and the results showed in the first month.', 'hamista-core' ),
			)
		);
		$r->add_control(
			'name',
			array(
				'label'   => __( 'Name', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Maryam Karimi', 'hamista-core' ),
			)
		);
		$r->add_control(
			'role',
			array(
				'label'   => __( 'Role', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Marketing manager', 'hamista-core' ),
			)
		);
		$r->add_control(
			'avatar',
			array(
				'label' => __( 'Photo', 'hamista-core' ),
				'type'  => Controls_Manager::MEDIA,
			)
		);
		$r->add_control(
			'rating',
			array(
				'label'   => __( 'Rating', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => '4.9',
			)
		);
		$r->add_control(
			'tone',
			array(
				'label'   => __( 'Tone', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'light',
				'options' => array(
					'light'  => __( 'Light', 'hamista-core' ),
					'dark'   => __( 'Dark', 'hamista-core' ),
					'accent' => __( 'Accent', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'items',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $r->get_controls(),
				'title_field' => '{{{ name }}}',
				'default'     => array(
					array( 'tone' => 'light' ),
					array( 'tone' => 'accent' ),
					array( 'tone' => 'dark' ),
					array( 'tone' => 'light' ),
				),
			)
		);
		$this->add_control(
			'look',
			array(
				'label'   => __( 'Arrangement', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'scatter',
				'options' => array(
					'scatter'   => __( 'Spread over a giant word', 'hamista-core' ),
					'columns'   => __( 'Two columns moving apart', 'hamista-core' ),
					'spotlight' => __( 'One client at a time, picked from a row of faces', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'word',
			array(
				'label'     => __( 'Giant word behind', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Testimonials', 'hamista-core' ),
				'condition' => array( 'look' => 'scatter' ),
			)
		);
		$this->add_control(
			'summary',
			array(
				'label'     => __( 'Rating summary', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Rated 4.9/5 by 1,200+ happy clients', 'hamista-core' ),
				'condition' => array( 'look' => 'spotlight' ),
			)
		);
		$this->add_control(
			'logos',
			array(
				'label'     => __( 'Brand logos', 'hamista-core' ),
				'type'      => Controls_Manager::GALLERY,
				'condition' => array( 'look' => 'spotlight' ),
			)
		);
		$this->add_control(
			'logos_label',
			array(
				'label'     => __( 'Line before the logos', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Trusted by:', 'hamista-core' ),
				'condition' => array( 'look' => 'spotlight' ),
			)
		);
		$this->add_control(
			'rating_label',
			array(
				'label'   => __( 'Rating label', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Rating', 'hamista-core' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s     = $this->get_settings_for_display();
		$look  = in_array( $s['look'], array( 'columns', 'spotlight' ), true ) ? $s['look'] : 'scatter';
		$items = array_values( (array) $s['items'] );
		if ( 'spotlight' === $look ) {
			$this->render_spotlight( $s, $items );
			return;
		}
		echo '<div class="hm-tw hm-tw--' . esc_attr( $look ) . '" data-hm-widget="testimonial-wall">';
		if ( 'scatter' === $look && $s['word'] ) {
			$word = esc_html( $s['word'] );
			echo '<p class="hm-tw__word" aria-hidden="true"><span>' . $word . ' ' . $word . ' ' . $word . '</span></p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		echo '<div class="hm-tw__grid">';
		foreach ( $items as $i => $item ) {
			$tone = in_array( $item['tone'], array( 'light', 'dark', 'accent' ), true ) ? $item['tone'] : 'light';
			printf( '<figure class="hm-tw__item" style="--i:%1$d" data-hm-tw-speed="%2$s">', (int) $i, esc_attr( (string) ( ( $i % 3 ) * 0.5 + 0.4 ) ) );
			echo '<blockquote class="hm-tw__card hm-tw__card--' . esc_attr( $tone ) . '"><span class="hm-tw__mark" aria-hidden="true">' . hamista_core_icon( 'quote' ) . '</span><p>' . esc_html( $item['quote'] ) . '</p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<footer class="hm-tw__rate"><b class="hm-num">' . esc_html( hamista_core_digits( $item['rating'] ) ) . '</b>' . hamista_core_icon( 'star' ) . '<small>' . esc_html( $s['rating_label'] ) . '</small><span class="hm-tw__sign" aria-hidden="true"></span></footer></blockquote>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<figcaption class="hm-tw__who">' . hamista_core_image( $item['avatar'], 'thumbnail', array( 'class' => 'hm-tw__avatar' ) ) . '<span><b>' . esc_html( $item['name'] ) . '</b><small>' . esc_html( $item['role'] ) . '</small></span></figcaption>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '</figure>';
		}
		echo '</div></div>';
	}

	/**
	 * One client at a time: photo card, faces to pick from, quote and brand logos.
	 *
	 * @param array $s     Settings.
	 * @param array $items Testimonials.
	 */
	private function render_spotlight( $s, $items ) {
		echo '<div class="hm-tw hm-tw--spotlight" data-hm-widget="testimonial-wall" data-hm-reveal="up">';
		echo '<div class="hm-tw__photos">';
		foreach ( $items as $i => $item ) {
			echo '<figure class="hm-tw__photo' . ( 0 === $i ? ' is-active' : '' ) . '" data-i="' . (int) $i . '">' . hamista_core_image( $item['avatar'], 'medium_large' ) . '<figcaption><b>' . esc_html( $item['name'] ) . '</b><small>' . esc_html( $item['role'] ) . '</small><span class="hm-tw__chip hm-num">' . esc_html( hamista_core_digits( $item['rating'] ) ) . hamista_core_icon( 'star' ) . '</span></figcaption></figure>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		echo '</div><div class="hm-tw__body"><p class="hm-tw__summary">' . Proof::stars( 4.5 ) . '<span>' . esc_html( $s['summary'] ) . '</span></p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '<div class="hm-tw__faces" role="tablist" aria-label="' . esc_attr__( 'Clients', 'hamista-core' ) . '"><button type="button" class="hm-tw__nav" data-step="-1" aria-label="' . esc_attr__( 'Previous', 'hamista-core' ) . '">' . hamista_core_icon( 'chevron-r' ) . '</button>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		foreach ( $items as $i => $item ) {
			echo '<button type="button" role="tab" class="hm-tw__face' . ( 0 === $i ? ' is-active' : '' ) . '" data-i="' . (int) $i . '" aria-selected="' . ( 0 === $i ? 'true' : 'false' ) . '" aria-label="' . esc_attr( $item['name'] ) . '">' . hamista_core_image( $item['avatar'], 'thumbnail', array( 'alt' => '' ) ) . '</button>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		echo '<button type="button" class="hm-tw__nav" data-step="1" aria-label="' . esc_attr__( 'Next', 'hamista-core' ) . '">' . hamista_core_icon( 'chevron-l' ) . '</button></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '<div class="hm-tw__quotes" aria-live="polite">';
		foreach ( $items as $i => $item ) {
			echo '<blockquote class="hm-tw__quote' . ( 0 === $i ? ' is-active' : '' ) . '" data-i="' . (int) $i . '"><p>«' . esc_html( $item['quote'] ) . '»</p></blockquote>';
		}
		echo '</div>';
		if ( ! empty( $s['logos'] ) ) {
			echo '<div class="hm-tw__brands"><span>' . esc_html( $s['logos_label'] ) . '</span><div class="hm-tw__brands-run">';
			foreach ( (array) $s['logos'] as $logo ) {
				echo hamista_core_image( $logo, 'medium', array( 'class' => 'hm-tw__brand' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</div></div>';
		}
		echo '</div></div>';
	}
}
