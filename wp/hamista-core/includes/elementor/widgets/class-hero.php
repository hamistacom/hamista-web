<?php
/**
 * Hero: headline with word reveal, actions, stats, and a media side that can be
 * an image, a parallax mosaic, a CSS device mockup, or a background video.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Hero widget.
 */
class Hero extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-hero';
	}

	/** @return string */
	public function get_title() {
		return __( 'Hero', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-banner';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'hero', 'header', 'banner', 'intro' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_content', array( 'label' => __( 'Content', 'hamista-core' ) ) );
		$this->add_control(
			'layout',
			array(
				'label'   => __( 'Layout', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'split',
				'options' => array(
					'split'     => __( 'Text + media side by side', 'hamista-core' ),
					'center'    => __( 'Centered, media below', 'hamista-core' ),
					'full'      => __( 'Full-bleed background media', 'hamista-core' ),
					'editorial' => __( 'Editorial: giant title, media strip', 'hamista-core' ),
				),
			)
		);
		$this->add_header_controls(
			array(
				'eyebrow' => __( 'Autumn cohort is open', 'hamista-core' ),
				'title'   => __( "Learn to build.\nMake your idea *real*.", 'hamista-core' ),
				'desc'    => __( 'A project-based school for people who would rather build real products than watch endless tutorials.', 'hamista-core' ),
				'tag'     => 'h1',
				'size'    => 'xl',
			),
			false
		);
		$this->add_button_controls( 'btn1', __( 'Primary button', 'hamista-core' ), array( 'text' => __( 'Find your path', 'hamista-core' ) ) );
		$this->add_button_controls(
			'btn2',
			__( 'Secondary button', 'hamista-core' ),
			array(
				'text'  => __( 'See how it works', 'hamista-core' ),
				'style' => 'secondary',
			)
		);

		$stats = new Repeater();
		$stats->add_control(
			'value',
			array(
				'label'   => __( 'Number', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => '120',
			)
		);
		$stats->add_control(
			'suffix',
			array(
				'label' => __( 'Suffix', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$stats->add_control(
			'label',
			array(
				'label'   => __( 'Label', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Projects shipped', 'hamista-core' ),
			)
		);
		$this->add_control(
			'stats',
			array(
				'label'       => __( 'Key numbers', 'hamista-core' ),
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $stats->get_controls(),
				'default'     => array(),
				'title_field' => '{{{ value }}} {{{ label }}}',
				'separator'   => 'before',
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_media', array( 'label' => __( 'Media', 'hamista-core' ) ) );
		$this->add_control(
			'media_type',
			array(
				'label'   => __( 'Media', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'image',
				'options' => array(
					'image'  => __( 'Image', 'hamista-core' ),
					'mosaic' => __( 'Mosaic of images (parallax)', 'hamista-core' ),
					'device' => __( 'Device mockup', 'hamista-core' ),
					'video'  => __( 'Video (mp4)', 'hamista-core' ),
					'none'   => __( 'None', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'image',
			array(
				'label'       => __( 'Image', 'hamista-core' ),
				'type'        => Controls_Manager::MEDIA,
				'condition'   => array( 'media_type' => array( 'image', 'device', 'video' ) ),
				'description' => __( 'For video, this is the poster. For the device, the screen image.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'gallery',
			array(
				'label'     => __( 'Mosaic images', 'hamista-core' ),
				'type'      => Controls_Manager::GALLERY,
				'condition' => array( 'media_type' => 'mosaic' ),
			)
		);
		$this->add_control(
			'video',
			array(
				'label'       => __( 'Video URL (mp4/webm)', 'hamista-core' ),
				'type'        => Controls_Manager::URL,
				'condition'   => array( 'media_type' => 'video' ),
				'description' => __( 'Plays muted and looped; paused for visitors who prefer reduced motion.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'device_variant',
			array(
				'label'     => __( 'Device', 'hamista-core' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => 'monitor',
				'options'   => Device::variants(),
				'condition' => array( 'media_type' => 'device' ),
			)
		);
		$this->add_control(
			'device_label',
			array(
				'label'     => __( 'Status label', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'System online', 'hamista-core' ),
				'condition' => array( 'media_type' => 'device' ),
			)
		);
		$this->add_control(
			'media_ratio',
			array(
				'label'     => __( 'Image shape', 'hamista-core' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => 'portrait',
				'options'   => array(
					'portrait'  => __( 'Portrait', 'hamista-core' ),
					'square'    => __( 'Square', 'hamista-core' ),
					'landscape' => __( 'Landscape', 'hamista-core' ),
					'arch'      => __( 'Arch', 'hamista-core' ),
				),
				'condition' => array( 'media_type' => 'image' ),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_hero_layout', array( 'label' => __( 'Section', 'hamista-core' ) ) );
		$this->add_control(
			'height',
			array(
				'label'   => __( 'Height', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'screen',
				'options' => array(
					'auto'   => __( 'Fit content', 'hamista-core' ),
					'screen' => __( 'Full screen', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'scheme',
			array(
				'label'   => __( 'Colour scheme', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '',
				'options' => array(
					''        => __( 'Page colours', 'hamista-core' ),
					'surface' => __( 'Soft surface', 'hamista-core' ),
					'inverse' => __( 'Inverted (dark slab)', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'decor',
			array(
				'label'   => __( 'Background detail', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'grid',
				'options' => array(
					''     => __( 'None', 'hamista-core' ),
					'grid' => __( 'Fine grid', 'hamista-core' ),
					'rule' => __( 'Hairline rules', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'hint',
			array(
				'label'   => __( 'Scroll hint text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Scroll', 'hamista-core' ),
			)
		);
		$this->add_control(
			'overlay',
			array(
				'label'     => __( 'Overlay strength', 'hamista-core' ),
				'type'      => Controls_Manager::SLIDER,
				'default'   => array( 'size' => 0.45 ),
				'range'     => array(
					'px' => array(
						'min'  => 0,
						'max'  => 0.9,
						'step' => 0.05,
					),
				),
				'condition' => array( 'layout' => 'full' ),
				'selectors' => array( '{{WRAPPER}} .hm-hero' => '--hm-hero-overlay: {{SIZE}};' ),
			)
		);
		$this->add_control(
			'accent_override',
			array(
				'label'     => __( 'Accent color', 'hamista-core' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array( '{{WRAPPER}}' => '--hm-accent: {{VALUE}}; --hm-accent-ink: {{VALUE}};' ),
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
		$layout  = $s['layout'];
		$type    = $s['media_type'];
		$classes = array( 'hm-hero', 'hm-hero--' . $layout, 'hm-hero--h-' . $s['height'], 'hm-hero--media-' . $type );
		if ( $s['scheme'] ) {
			$classes[] = 'hm-scheme-' . $s['scheme'];
		}
		if ( $s['decor'] ) {
			$classes[] = 'hm-hero--decor-' . $s['decor'];
		}
		if ( 'full' === $layout ) {
			$s['title_size'] = $s['title_size'] ? $s['title_size'] : 'xl';
		}

		$text  = $this->render_header( $s, 'hm-hero__head' );
		$text .= $this->render_actions( $s );
		$text .= $this->render_stats( $s );
		$media = 'none' === $type ? '' : $this->render_media( $s );

		echo '<section class="' . esc_attr( implode( ' ', array_map( 'sanitize_html_class', $classes ) ) ) . '">';
		if ( 'full' === $layout ) {
			echo '<div class="hm-hero__bg">' . $media . '<span class="hm-hero__shade"></span></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<div class="hm-container hm-hero__inner"><div class="hm-hero__text">' . $text . '</div></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		} else {
			echo '<div class="hm-container hm-hero__inner">';
			echo '<div class="hm-hero__text">' . $text . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			if ( $media ) {
				echo '<div class="hm-hero__media">' . $media . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</div>';
		}
		if ( $s['hint'] && 'screen' === $s['height'] ) {
			echo '<span class="hm-hero__hint" aria-hidden="true"><i></i>' . esc_html( $s['hint'] ) . '</span>';
		}
		echo '</section>';
	}

	/**
	 * Buttons row.
	 *
	 * @param array $s Settings.
	 * @return string
	 */
	private function render_actions( $s ) {
		$buttons = $this->render_button( $s, 'btn1', array( 'size' => 'lg' ) ) . $this->render_button( $s, 'btn2', array( 'size' => 'lg' ) );
		return $buttons ? '<div class="hm-hero__actions hm-btn-row hm-btn-row--stack" data-hm-reveal="up" data-hm-delay="0.3">' . $buttons . '</div>' : '';
	}

	/**
	 * Key numbers.
	 *
	 * @param array $s Settings.
	 * @return string
	 */
	private function render_stats( $s ) {
		if ( empty( $s['stats'] ) ) {
			return '';
		}
		$html = '<dl class="hm-hero__stats" data-hm-reveal="up" data-hm-delay="0.42">';
		foreach ( $s['stats'] as $stat ) {
			$value = hamista_core_latin_digits( $stat['value'] );
			$num   = is_numeric( str_replace( array( ',', '٬' ), '', $value ) ) ? '<span data-hm-count="' . esc_attr( str_replace( array( ',', '٬' ), '', $value ) ) . '">' . esc_html( hamista_core_digits( $stat['value'] ) ) . '</span>' : esc_html( $stat['value'] );
			$html .= '<div><dt class="hm-num">' . $num . esc_html( $stat['suffix'] ) . '</dt><dd>' . esc_html( $stat['label'] ) . '</dd></div>';
		}
		return $html . '</dl>';
	}

	/**
	 * Media side.
	 *
	 * @param array $s Settings.
	 * @return string
	 */
	private function render_media( $s ) {
		$eager = array(
			'loading'       => 'eager',
			'fetchpriority' => 'high',
			'sizes'         => '(max-width: 900px) 100vw, 50vw',
		);

		switch ( $s['media_type'] ) {
			case 'mosaic':
				$images = array_values( array_filter( (array) $s['gallery'] ) );
				if ( ! $images ) {
					return '';
				}
				$cols = array( array(), array(), array() );
				$i    = 0;
				// Fill three columns with at least four tiles each by cycling the gallery.
				$total = max( 12, count( $images ) );
				for ( $n = 0; $n < $total; $n++ ) {
					$cols[ $n % 3 ][] = $images[ $i % count( $images ) ];
					++$i;
				}
				$html = '<div class="hm-mosaic" data-hm-widget="mosaic"><div class="hm-mosaic__inner">';
				foreach ( $cols as $c => $col ) {
					$html .= '<div class="hm-mosaic__col">';
					foreach ( $col as $n => $img ) {
						$html .= '<figure class="hm-mosaic__tile">' . hamista_core_image(
							$img,
							'large',
							array(
								'loading' => ( $n < 2 ) ? 'eager' : 'lazy',
								'sizes'   => '(max-width: 900px) 33vw, 18vw',
							)
						) . '</figure>';
					}
					$html .= '</div>';
				}
				return $html . '</div></div>';

			case 'device':
				return Device::render_device(
					array(
						'variant' => $s['device_variant'],
						'image'   => $s['image'],
						'label'   => $s['device_label'],
						'float'   => true,
					)
				);

			case 'video':
				$video  = ! empty( $s['video']['url'] ) ? $s['video']['url'] : '';
				$poster = ! empty( $s['image']['url'] ) ? $s['image']['url'] : '';
				if ( ! $video ) {
					return hamista_core_image( $s['image'], 'full', $eager );
				}
				return '<video class="hm-hero__video" src="' . esc_url( $video ) . '"' . ( $poster ? ' poster="' . esc_url( $poster ) . '"' : '' ) . ' autoplay muted loop playsinline preload="metadata"></video>';

			default:
				$img = hamista_core_image( $s['image'], 'full', $eager );
				if ( ! $img ) {
					return '';
				}
				if ( 'full' === $s['layout'] ) {
					return $img;
				}
				return '<figure class="hm-hero__figure hm-hero__figure--' . esc_attr( $s['media_ratio'] ) . '" data-hm-reveal="clip-up" data-hm-delay="0.15"><div class="hm-hero__frame" data-hm-parallax="-0.25" data-hm-parallax-var>' . $img . '</div></figure>';
		}
	}
}
