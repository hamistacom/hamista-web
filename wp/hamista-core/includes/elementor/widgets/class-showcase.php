<?php
/**
 * Showcase hero: art-directed opening sections.
 *
 * Cinematic: full-screen slides with a slow cross-fade, a numbered index
 * with a progress line, an info card per slide, a film link, a call to
 * action, and a bar of figures and social links along the bottom.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Elementor\Utils;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Showcase widget.
 */
class Showcase extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-showcase';
	}

	/** @return string */
	public function get_title() {
		return __( 'Showcase hero', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-slider-full-screen';
	}

	/** @return array */
	public function get_style_depends() {
		return array( 'hamista-widgets', 'hamista-showcase' );
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'hero', 'showcase', 'slider', 'cinematic', 'banner', 'header' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_slides', array( 'label' => __( 'Slides', 'hamista-core' ) ) );
		$slides = new Repeater();
		$slides->add_control(
			'image',
			array(
				'label'   => __( 'Image', 'hamista-core' ),
				'type'    => Controls_Manager::MEDIA,
				'default' => array( 'url' => Utils::get_placeholder_image_src() ),
				'dynamic' => array( 'active' => true ),
			)
		);
		$slides->add_control(
			'label',
			array(
				'label'   => __( 'Card title', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Isfahan', 'hamista-core' ),
			)
		);
		$slides->add_control(
			'text',
			array(
				'label'   => __( 'Card text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXTAREA,
				'rows'    => 3,
				'default' => __( 'Half the world, they used to say: a square of tiled domes, bazaars and bridges that light up at dusk.', 'hamista-core' ),
			)
		);
		$slides->add_control(
			'link',
			array(
				'label'   => __( 'Card link', 'hamista-core' ),
				'type'    => Controls_Manager::URL,
				'dynamic' => array( 'active' => true ),
			)
		);
		$this->add_control(
			'slides',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $slides->get_controls(),
				'title_field' => '{{{ label }}}',
				'default'     => array(
					array( 'label' => __( 'Isfahan', 'hamista-core' ) ),
					array( 'label' => __( 'Lut desert', 'hamista-core' ) ),
				),
			)
		);
		$this->add_control(
			'autoplay',
			array(
				'label'   => __( 'Change slides every', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '7',
				'options' => array(
					'0' => __( 'Never', 'hamista-core' ),
					'5' => __( '5 seconds', 'hamista-core' ),
					'7' => __( '7 seconds', 'hamista-core' ),
					'9' => __( '9 seconds', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'show_card',
			array(
				'label'        => __( 'Info card', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->add_control(
			'show_index',
			array(
				'label'        => __( 'Slide index', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_text', array( 'label' => __( 'Title and actions', 'hamista-core' ) ) );
		$this->add_control(
			'eyebrow',
			array(
				'label' => __( 'Small label', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$this->add_control(
			'title',
			array(
				'label'       => __( 'Title', 'hamista-core' ),
				'type'        => Controls_Manager::TEXTAREA,
				'rows'        => 2,
				'default'     => __( "An endless\njourney", 'hamista-core' ),
				'description' => __( 'Wrap a word in *stars* to highlight it.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'video_text',
			array(
				'label'     => __( 'Film link text', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Watch the film', 'hamista-core' ),
				'separator' => 'before',
			)
		);
		$this->add_control(
			'video_url',
			array(
				'label'       => __( 'Film address', 'hamista-core' ),
				'type'        => Controls_Manager::URL,
				'description' => __( 'An MP4 file, or an Aparat or YouTube link. Opens in a window over the page.', 'hamista-core' ),
				'dynamic'     => array( 'active' => true ),
			)
		);
		$this->add_control(
			'btn_text',
			array(
				'label'     => __( 'Button text', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Find out more', 'hamista-core' ),
				'separator' => 'before',
			)
		);
		$this->add_control(
			'btn_link',
			array(
				'label'   => __( 'Button link', 'hamista-core' ),
				'type'    => Controls_Manager::URL,
				'dynamic' => array( 'active' => true ),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_bar', array( 'label' => __( 'Bottom bar', 'hamista-core' ) ) );
		$stats = new Repeater();
		$stats->add_control(
			'value',
			array(
				'label'   => __( 'Number', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => '۲٬۰۰۰',
			)
		);
		$stats->add_control(
			'label',
			array(
				'label'   => __( 'Label', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Historic sites', 'hamista-core' ),
			)
		);
		$this->add_control(
			'stats',
			array(
				'label'       => __( 'Figures', 'hamista-core' ),
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $stats->get_controls(),
				'title_field' => '{{{ value }}} {{{ label }}}',
				'default'     => array( array() ),
			)
		);
		$social = new Repeater();
		$social->add_control(
			'label',
			array(
				'label'   => __( 'Label', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Instagram', 'hamista-core' ),
			)
		);
		$social->add_control(
			'url',
			array(
				'label' => __( 'Link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$this->add_control(
			'social',
			array(
				'label'       => __( 'Links', 'hamista-core' ),
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $social->get_controls(),
				'title_field' => '{{{ label }}}',
				'default'     => array(),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section(
			'section_look',
			array(
				'label' => __( 'Look', 'hamista-core' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);
		$this->add_control(
			'height',
			array(
				'label'   => __( 'Height', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'screen',
				'options' => array(
					'screen' => __( 'Full screen', 'hamista-core' ),
					'tall'   => __( 'Tall', 'hamista-core' ),
					'base'   => __( 'Section height from the settings', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'overlay',
			array(
				'label'      => __( 'Darken the image', 'hamista-core' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( '%' ),
				'range'      => array(
					'%' => array(
						'min' => 0,
						'max' => 80,
					),
				),
				'default'    => array(
					'unit' => '%',
					'size' => 35,
				),
				'selectors'  => array( '{{WRAPPER}} .hm-show' => '--hm-show-shade: calc({{SIZE}} / 100);' ),
			)
		);
		$this->add_responsive_control(
			'title_size',
			array(
				'label'      => __( 'Title size', 'hamista-core' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px' ),
				'range'      => array(
					'px' => array(
						'min' => 28,
						'max' => 140,
					),
				),
				'selectors'  => array( '{{WRAPPER}} .hm-show__title' => 'font-size: {{SIZE}}{{UNIT}};' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Two-digit slide number in the site's digits.
	 *
	 * @param int $n Number.
	 * @return string
	 */
	private static function num( $n ) {
		return hamista_core_digits( str_pad( (string) $n, 2, '0', STR_PAD_LEFT ) );
	}

	/**
	 * Image of a slide.
	 *
	 * @param array $media Media value.
	 * @param bool  $first First slide (loads eagerly).
	 * @return string
	 */
	private static function image( $media, $first ) {
		$attrs = array(
			'class'    => 'hm-show__img',
			'alt'      => '',
			'loading'  => $first ? 'eager' : 'lazy',
			'decoding' => 'async',
			'sizes'    => '100vw',
		);
		if ( $first ) {
			$attrs['fetchpriority'] = 'high';
		}
		if ( ! empty( $media['id'] ) ) {
			$html = wp_get_attachment_image( (int) $media['id'], 'full', false, $attrs );
			if ( $html ) {
				return $html;
			}
		}
		if ( empty( $media['url'] ) ) {
			return '';
		}
		return '<img class="hm-show__img" src="' . esc_url( $media['url'] ) . '" alt="" loading="' . ( $first ? 'eager' : 'lazy' ) . '" decoding="async">';
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s      = $this->get_settings_for_display();
		$slides = array_values( array_filter( (array) $s['slides'] ) );
		$count  = count( $slides );
		$id     = 'hm-show-' . $this->get_id();
		$auto   = $count > 1 ? (int) $s['autoplay'] : 0;
		$height = in_array( $s['height'], array( 'screen', 'tall', 'base' ), true ) ? $s['height'] : 'screen';

		echo '<section class="hm-show hm-show--cinematic hm-show--h-' . esc_attr( $height ) . '" id="' . esc_attr( $id ) . '" data-hm-widget="showcase" data-autoplay="' . esc_attr( (string) $auto ) . '" aria-roledescription="' . esc_attr__( 'carousel', 'hamista-core' ) . '" aria-label="' . esc_attr( wp_strip_all_tags( str_replace( '*', '', (string) $s['title'] ) ) ) . '">';

		// Slides.
		echo '<div class="hm-show__media" data-hm-parallax="0.25" data-hm-parallax-var aria-hidden="true">';
		foreach ( $slides as $i => $slide ) {
			echo '<div class="hm-show__slide' . ( 0 === $i ? ' is-active' : '' ) . '" data-slide="' . esc_attr( (string) $i ) . '">' . self::image( $slide['image'] ?? array(), 0 === $i ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- core image markup / escaped.
		}
		echo '</div><div class="hm-show__shade" aria-hidden="true"></div>';

		echo '<div class="hm-show__inner hm-container">';

		// Title and actions.
		echo '<div class="hm-show__main">';
		if ( '' !== (string) $s['eyebrow'] ) {
			echo '<p class="hm-show__eyebrow" data-hm-reveal="up">' . esc_html( $s['eyebrow'] ) . '</p>';
		}
		if ( '' !== (string) $s['title'] ) {
			echo '<h1 class="hm-show__title" data-hm-reveal="words" data-hm-delay="0.1">' . hamista_core_highlight( $s['title'] ) . '</h1>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in hamista_core_highlight().
		}
		$video = ! empty( $s['video_url']['url'] ) ? $s['video_url']['url'] : '';
		$btn   = ! empty( $s['btn_text'] ) && ! empty( $s['btn_link']['url'] );
		if ( ( $video && '' !== (string) $s['video_text'] ) || $btn ) {
			echo '<div class="hm-show__actions" data-hm-reveal="up" data-hm-delay="0.35">';
			if ( $video && '' !== (string) $s['video_text'] ) {
				echo '<button type="button" class="hm-show__play" data-show-video="' . esc_url( $video ) . '" aria-haspopup="dialog"><span class="hm-show__play-ring" aria-hidden="true">' . hamista_core_icon( 'play', array( 'size' => 18 ) ) . '</span><span>' . esc_html( $s['video_text'] ) . '</span></button>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG.
			}
			if ( $btn ) {
				$this->add_link_attributes( 'btn_link', $s['btn_link'] );
				echo '<a class="hm-btn hm-show__cta" ' . $this->get_render_attribute_string( 'btn_link' ) . '>' . esc_html( $s['btn_text'] ) . '</a>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Elementor attributes.
			}
			echo '</div>';
		}
		echo '</div>';

		// Index: current number, a progress line, last number; each slide is a button.
		if ( 'yes' === $s['show_index'] && $count > 1 ) {
			echo '<div class="hm-show__index" data-hm-reveal="fade" data-hm-delay="0.5">';
			echo '<span class="hm-show__num" data-show-current aria-hidden="true">' . esc_html( self::num( 1 ) ) . '</span>';
			echo '<div class="hm-show__dots" role="tablist" aria-label="' . esc_attr__( 'Slides', 'hamista-core' ) . '">';
			foreach ( $slides as $i => $slide ) {
				/* translators: 1: slide number, 2: slide title */
				$label = sprintf( __( 'Slide %1$s: %2$s', 'hamista-core' ), hamista_core_digits( (string) ( $i + 1 ) ), $slide['label'] ?? '' );
				echo '<button type="button" class="hm-show__dot" role="tab" aria-selected="' . ( 0 === $i ? 'true' : 'false' ) . '" aria-controls="' . esc_attr( $id . '-card-' . $i ) . '" data-show-go="' . esc_attr( (string) $i ) . '" data-num="' . esc_attr( self::num( $i + 1 ) ) . '" aria-label="' . esc_attr( $label ) . '"><i></i></button>';
			}
			echo '</div>';
			echo '<span class="hm-show__num hm-show__num--last" aria-hidden="true">' . esc_html( self::num( $count ) ) . '</span>';
			echo '</div>';
		}

		// Info cards, one per slide.
		if ( 'yes' === $s['show_card'] ) {
			echo '<div class="hm-show__cards" aria-live="polite">';
			foreach ( $slides as $i => $slide ) {
				if ( '' === (string) ( $slide['label'] ?? '' ) && '' === (string) ( $slide['text'] ?? '' ) ) {
					continue;
				}
				echo '<article class="hm-show__card' . ( 0 === $i ? ' is-active' : '' ) . '" id="' . esc_attr( $id . '-card-' . $i ) . '" role="tabpanel"' . ( 0 === $i ? '' : ' hidden' ) . '>';
				echo '<h2 class="hm-show__card-title">' . esc_html( $slide['label'] ?? '' ) . '</h2>';
				if ( '' !== (string) ( $slide['text'] ?? '' ) ) {
					echo '<p>' . esc_html( $slide['text'] ) . '</p>';
				}
				if ( ! empty( $slide['link']['url'] ) ) {
					echo '<a class="hm-show__card-link" href="' . esc_url( $slide['link']['url'] ) . '">' . esc_html__( 'View the journey', 'hamista-core' ) . hamista_core_icon( 'arrow', array( 'size' => 14 ) ) . '</a>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG.
				}
				echo '</article>';
			}
			echo '</div>';
		}

		// Bottom bar.
		$stats  = array_filter( (array) $s['stats'], static fn( $r ) => '' !== (string) ( $r['value'] ?? '' ) );
		$social = array_filter( (array) $s['social'], static fn( $r ) => ! empty( $r['url']['url'] ) && '' !== (string) ( $r['label'] ?? '' ) );
		if ( $stats || $social ) {
			echo '<div class="hm-show__bar">';
			if ( $social ) {
				echo '<ul class="hm-show__social">';
				foreach ( $social as $row ) {
					echo '<li><a href="' . esc_url( $row['url']['url'] ) . '"' . ( ! empty( $row['url']['is_external'] ) ? ' target="_blank" rel="noopener"' : '' ) . '>' . esc_html( $row['label'] ) . '</a></li>';
				}
				echo '</ul>';
			}
			if ( $stats ) {
				echo '<dl class="hm-show__stats">';
				foreach ( $stats as $row ) {
					echo '<div><dt>' . esc_html( hamista_core_digits( $row['value'] ) ) . '</dt><dd>' . esc_html( $row['label'] ?? '' ) . '</dd></div>';
				}
				echo '</dl>';
			}
			echo '</div>';
		}
		echo '</div>';

		if ( $video ) {
			echo '<dialog class="hm-show__dialog" aria-label="' . esc_attr( $s['video_text'] ) . '"><button type="button" class="hm-show__close" data-show-close aria-label="' . esc_attr__( 'Close', 'hamista-core' ) . '">' . hamista_core_icon( 'close', array( 'size' => 20 ) ) . '</button><div class="hm-show__player" data-show-player></div></dialog>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG.
		}
		echo '</section>';
	}
}
