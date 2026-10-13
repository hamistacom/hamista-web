<?php
/**
 * Social proof: a row of overlapping avatars, a star rating with its score and
 * a short line ("based on 204 reviews"). Small enough to sit in a hero corner,
 * under a title or inside a card.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Proof widget.
 */
class Proof extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-proof';
	}

	/** @return string */
	public function get_title() {
		return __( 'Avatars and Rating', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-rating';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'rating', 'reviews', 'avatars', 'stars', 'trust', 'proof' );
	}

	/** @return array */
	public function get_style_depends() {
		return array( 'hamista-widgets', 'hamista-agency' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_proof', array( 'label' => __( 'Avatars and rating', 'hamista-core' ) ) );
		$this->add_control(
			'avatars',
			array(
				'label' => __( 'Avatars', 'hamista-core' ),
				'type'  => Controls_Manager::GALLERY,
			)
		);
		$this->add_control(
			'plus',
			array(
				'label'        => __( 'Plus button after the avatars', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->add_control(
			'plus_link',
			array(
				'label'     => __( 'Plus button link', 'hamista-core' ),
				'type'      => Controls_Manager::URL,
				'condition' => array( 'plus' => 'yes' ),
			)
		);
		$this->add_control(
			'score',
			array(
				'label'   => __( 'Score', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => '4.8',
			)
		);
		$this->add_control(
			'stars',
			array(
				'label'   => __( 'Stars', 'hamista-core' ),
				'type'    => Controls_Manager::NUMBER,
				'min'     => 0,
				'max'     => 5,
				'step'    => 0.5,
				'default' => 4.5,
			)
		);
		$this->add_control(
			'note',
			array(
				'label'   => __( 'Line under the stars', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Based on 204 reviews', 'hamista-core' ),
			)
		);
		$this->add_control(
			'layout',
			array(
				'label'   => __( 'Layout', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'stack',
				'options' => array(
					'stack'  => __( 'Avatars above, rating below', 'hamista-core' ),
					'inline' => __( 'Avatars and rating in a row', 'hamista-core' ),
					'card'   => __( 'Rating bar (wide card)', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'name',
			array(
				'label'     => __( 'Name beside the first avatar', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'condition' => array( 'layout' => 'card' ),
			)
		);
		$this->add_control(
			'role',
			array(
				'label'     => __( 'Role', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'condition' => array( 'layout' => 'card' ),
			)
		);
		$this->add_responsive_control(
			'align',
			array(
				'label'     => __( 'Alignment', 'hamista-core' ),
				'type'      => Controls_Manager::CHOOSE,
				'default'   => 'end',
				'options'   => array(
					'start'  => array(
						'title' => __( 'Start', 'hamista-core' ),
						'icon'  => is_rtl() ? 'eicon-text-align-right' : 'eicon-text-align-left',
					),
					'center' => array(
						'title' => __( 'Center', 'hamista-core' ),
						'icon'  => 'eicon-text-align-center',
					),
					'end'    => array(
						'title' => __( 'End', 'hamista-core' ),
						'icon'  => is_rtl() ? 'eicon-text-align-left' : 'eicon-text-align-right',
					),
				),
				'selectors' => array( '{{WRAPPER}} .hm-proof' => '--hm-proof-align: {{VALUE}};' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Star row: full, half and empty stars drawn with one shape.
	 *
	 * @param float $value Stars out of five.
	 * @return string
	 */
	public static function stars( $value ) {
		$value = max( 0, min( 5, (float) $value ) );
		$html  = '<span class="hm-stars" role="img" aria-label="' . esc_attr( sprintf( /* translators: %s: rating out of five. */ __( 'Rated %s out of 5', 'hamista-core' ), hamista_core_digits( (string) $value ) ) ) . '">';
		for ( $i = 1; $i <= 5; $i++ ) {
			$fill  = $value >= $i ? 'full' : ( $value >= $i - 0.5 ? 'half' : 'empty' );
			$html .= '<span class="hm-star hm-star--' . $fill . '" aria-hidden="true">' . hamista_core_icon( 'star' ) . '</span>';
		}
		return $html . '</span>';
	}

	/**
	 * Overlapping avatars.
	 *
	 * @param array  $gallery Gallery items.
	 * @param bool   $plus    Add a plus button.
	 * @param array  $link    Plus link.
	 * @return string
	 */
	public static function avatars( $gallery, $plus = false, $link = array() ) {
		$html = '<span class="hm-avatars">';
		foreach ( array_slice( (array) $gallery, 0, 5 ) as $img ) {
			$html .= hamista_core_image(
				$img,
				'thumbnail',
				array(
					'class' => 'hm-avatars__img',
					'alt'   => '',
				)
			);
		}
		if ( $plus ) {
			$tag   = ! empty( $link['url'] ) ? 'a' : 'span';
			$href  = 'a' === $tag ? ' href="' . esc_url( $link['url'] ) . '" aria-label="' . esc_attr__( 'See more', 'hamista-core' ) . '"' : ' aria-hidden="true"';
			$html .= '<' . $tag . ' class="hm-avatars__plus"' . $href . '>' . hamista_core_icon( 'plus' ) . '</' . $tag . '>';
		}
		return $html . '</span>';
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s      = $this->get_settings_for_display();
		$layout = in_array( $s['layout'], array( 'stack', 'inline', 'card' ), true ) ? $s['layout'] : 'stack';
		echo '<div class="hm-proof hm-proof--' . esc_attr( $layout ) . '" data-hm-reveal="up">';
		if ( 'card' === $layout ) {
			echo '<div class="hm-proof__who">' . self::avatars( $s['avatars'], false ) . '<span><b>' . esc_html( $s['name'] ) . '</b><small>' . esc_html( $s['role'] ) . '</small></span></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		} elseif ( ! empty( $s['avatars'] ) || 'yes' === $s['plus'] ) {
			echo self::avatars( $s['avatars'], 'yes' === $s['plus'], $s['plus_link'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		echo '<div class="hm-proof__rating">';
		echo '<span class="hm-proof__stars">' . self::stars( $s['stars'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		if ( $s['note'] ) {
			echo '<small>' . esc_html( $s['note'] ) . '</small>';
		}
		echo '</span>';
		if ( '' !== (string) $s['score'] ) {
			echo '<b class="hm-proof__score hm-num">' . esc_html( hamista_core_digits( $s['score'] ) ) . '</b>';
		}
		echo '</div></div>';
	}
}
