<?php
/**
 * Stories: a row of round thumbnails that open a full-screen viewer with
 * progress bars, like social-media stories. Each story can hold several
 * images or a video, a caption and a button.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Stories widget.
 */
class Stories extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-stories';
	}

	/** @return string */
	public function get_title() {
		return __( 'Stories', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-instagram-gallery';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'stories', 'story', 'instagram', 'highlights' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_items', array( 'label' => __( 'Stories', 'hamista-core' ) ) );
		$rep = new Repeater();
		$rep->add_control(
			'title',
			array(
				'label'   => __( 'Title', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'New arrivals', 'hamista-core' ),
			)
		);
		$rep->add_control(
			'cover',
			array(
				'label' => __( 'Cover', 'hamista-core' ),
				'type'  => Controls_Manager::MEDIA,
			)
		);
		$rep->add_control(
			'slides',
			array(
				'label'       => __( 'Story images', 'hamista-core' ),
				'description' => __( 'Shown one after another, five seconds each. Leave empty to use the cover.', 'hamista-core' ),
				'type'        => Controls_Manager::GALLERY,
			)
		);
		$rep->add_control(
			'video',
			array(
				'label'       => __( 'Or a video (MP4)', 'hamista-core' ),
				'type'        => Controls_Manager::MEDIA,
				'media_types' => array( 'video' ),
			)
		);
		$rep->add_control(
			'caption',
			array(
				'label' => __( 'Caption', 'hamista-core' ),
				'type'  => Controls_Manager::TEXTAREA,
				'rows'  => 2,
			)
		);
		$rep->add_control(
			'btn_text',
			array(
				'label' => __( 'Button text', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$rep->add_control(
			'btn_link',
			array(
				'label' => __( 'Button link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$this->add_control(
			'items',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $rep->get_controls(),
				'title_field' => '{{{ title }}}',
				'default'     => array(
					array( 'title' => __( 'New arrivals', 'hamista-core' ) ),
					array( 'title' => __( 'Best sellers', 'hamista-core' ) ),
					array( 'title' => __( 'Behind the scenes', 'hamista-core' ) ),
					array( 'title' => __( 'Customer stories', 'hamista-core' ) ),
				),
			)
		);
		$this->add_control(
			'size',
			array(
				'label'   => __( 'Size', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'md',
				'options' => array(
					'sm' => __( 'Small', 'hamista-core' ),
					'md' => __( 'Medium', 'hamista-core' ),
					'lg' => __( 'Large', 'hamista-core' ),
				),
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
				),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s     = $this->get_settings_for_display();
		$items = (array) $s['items'];
		if ( ! $items ) {
			return;
		}
		$size  = in_array( $s['size'], array( 'sm', 'md', 'lg' ), true ) ? $s['size'] : 'md';
		$align = 'center' === $s['align'] ? ' hm-stories--center' : '';
		echo '<div class="hm-stories hm-stories--' . esc_attr( $size . $align ) . '" data-hm-widget="stories">';
		echo '<div class="hm-stories__row" role="list">';
		foreach ( $items as $i => $item ) {
			$cover  = ! empty( $item['cover']['id'] ) ? (int) $item['cover']['id'] : 0;
			$slides = array();
			foreach ( (array) ( $item['slides'] ?? array() ) as $img ) {
				if ( ! empty( $img['id'] ) ) {
					$url = wp_get_attachment_image_url( (int) $img['id'], 'large' );
					if ( $url ) {
						$slides[] = array(
							'type' => 'image',
							'src'  => $url,
						);
					}
				}
			}
			if ( ! empty( $item['video']['url'] ) ) {
				$slides = array(
					array(
						'type' => 'video',
						'src'  => esc_url_raw( $item['video']['url'] ),
					),
				);
			}
			if ( ! $slides && $cover ) {
				$url = wp_get_attachment_image_url( $cover, 'large' );
				if ( $url ) {
					$slides[] = array(
						'type' => 'image',
						'src'  => $url,
					);
				}
			}
			$data = array(
				'title'   => (string) $item['title'],
				'caption' => (string) $item['caption'],
				'slides'  => $slides,
				'btn'     => ! empty( $item['btn_text'] ) && ! empty( $item['btn_link']['url'] ) ? array(
					'text' => (string) $item['btn_text'],
					'url'  => esc_url_raw( $item['btn_link']['url'] ),
				) : null,
			);
			echo '<button type="button" class="hm-story" role="listitem" data-story="' . esc_attr( wp_json_encode( $data ) ) . '">';
			echo '<span class="hm-story__ring"><span class="hm-story__img">';
			echo $cover ? wp_get_attachment_image(
				$cover,
				'thumbnail',
				false,
				array(
					'alt'     => '',
					'loading' => 'lazy',
				)
			) : '<span class="hm-story__blank">' . esc_html( mb_substr( (string) $item['title'], 0, 1 ) ) . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '</span></span><span class="hm-story__title">' . esc_html( $item['title'] ) . '</span></button>';
		}
		echo '</div></div>';
	}
}
