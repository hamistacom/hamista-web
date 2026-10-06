<?php
/**
 * Horizontal Scroll: vertical scrolling moves a row of cards sideways while
 * the section stays pinned. Becomes a swipeable carousel on phones.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Horizontal scroll widget.
 */
class Hscroll extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-hscroll';
	}

	/** @return string */
	public function get_title() {
		return __( 'Horizontal Scroll', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-slider-push';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'horizontal', 'scroll', 'carousel', 'gallery', 'projects', 'pin' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_intro', array( 'label' => __( 'Intro panel', 'hamista-core' ) ) );
		$this->add_header_controls(
			array(
				'eyebrow' => __( 'Selected work', 'hamista-core' ),
				'title'   => __( "Projects our\nstudents *shipped*", 'hamista-core' ),
				'desc'    => __( 'Keep scrolling — the row moves with you.', 'hamista-core' ),
				'size'    => 'lg',
			),
			false
		);
		$this->add_button_controls( 'btn1', __( 'Button', 'hamista-core' ), array( 'style' => 'secondary' ) );
		$this->end_controls_section();

		$this->start_controls_section( 'section_items', array( 'label' => __( 'Cards', 'hamista-core' ) ) );
		$items = new Repeater();
		$items->add_control(
			'image',
			array(
				'label'   => __( 'Image', 'hamista-core' ),
				'type'    => Controls_Manager::MEDIA,
				'default' => array( 'url' => \Elementor\Utils::get_placeholder_image_src() ),
			)
		);
		$items->add_control(
			'label',
			array(
				'label'   => __( 'Label', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Product design', 'hamista-core' ),
			)
		);
		$items->add_control(
			'title',
			array(
				'label'   => __( 'Title', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Project title', 'hamista-core' ),
			)
		);
		$items->add_control(
			'text',
			array(
				'label' => __( 'Text', 'hamista-core' ),
				'type'  => Controls_Manager::TEXTAREA,
				'rows'  => 2,
			)
		);
		$items->add_control(
			'link',
			array(
				'label' => __( 'Link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$this->add_control(
			'items',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $items->get_controls(),
				'title_field' => '{{{ title }}}',
				'default'     => array(
					array( 'title' => __( 'Booking app', 'hamista-core' ) ),
					array( 'title' => __( 'Store dashboard', 'hamista-core' ) ),
					array( 'title' => __( 'Writing assistant', 'hamista-core' ) ),
					array( 'title' => __( 'Habit tracker', 'hamista-core' ) ),
				),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_settings', array( 'label' => __( 'Layout', 'hamista-core' ) ) );
		$this->add_control(
			'card_size',
			array(
				'label'   => __( 'Card size', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'md',
				'options' => array(
					'sm' => __( 'Small', 'hamista-core' ),
					'md' => __( 'Medium', 'hamista-core' ),
					'lg' => __( 'Large', 'hamista-core' ),
					'xl' => __( 'Screen-wide', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'card_style',
			array(
				'label'   => __( 'Card style', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'caption',
				'options' => array(
					'caption' => __( 'Image with caption below', 'hamista-core' ),
					'overlay' => __( 'Text over image', 'hamista-core' ),
					'card'    => __( 'Card', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'length',
			array(
				'label'   => __( 'Extra pause at the end', 'hamista-core' ),
				'type'    => Controls_Manager::SLIDER,
				'default' => array( 'size' => 1 ),
				'range'   => array(
					'px' => array(
						'min'  => 1,
						'max'  => 2,
						'step' => 0.1,
					),
				),
			)
		);
		$this->add_control(
			'progress',
			array(
				'label'        => __( 'Progress bar', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
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
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s       = $this->get_settings_for_display();
		$classes = 'hm-hscroll hm-hscroll--' . sanitize_html_class( $s['card_size'] ) . ' hm-hscroll--' . sanitize_html_class( $s['card_style'] );
		if ( $s['scheme'] ) {
			$classes .= ' hm-scheme-' . sanitize_html_class( $s['scheme'] );
		}
		echo '<section class="' . esc_attr( $classes ) . '" data-hm-widget="hscroll" data-length="' . esc_attr( $s['length']['size'] ?? 1 ) . '">';
		echo '<div class="hm-hscroll__sticky"><div class="hm-hscroll__track">';

		$head = $this->render_header( $s );
		if ( $head || ! empty( $s['btn1_text'] ) ) {
			echo '<div class="hm-hscroll__intro">' . $head . $this->render_button( $s, 'btn1' ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}

		foreach ( $s['items'] as $i => $item ) {
			$url  = ! empty( $item['link']['url'] ) ? $item['link']['url'] : '';
			$tag  = $url ? 'a' : 'div';
			$href = $url ? ' href="' . esc_url( $url ) . '"' . ( ! empty( $item['link']['is_external'] ) ? ' target="_blank" rel="noopener"' : '' ) : '';
			echo '<article class="hm-hscroll__item" data-hm-spot>';
			echo '<' . $tag . ' class="hm-hscroll__media"' . $href . ' data-hm-cursor="' . esc_attr__( 'View', 'hamista-core' ) . '">'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo hamista_core_image( $item['image'], 'large', array( 'sizes' => '(max-width: 900px) 80vw, 40vw' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '</' . $tag . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<div class="hm-hscroll__body">';
			echo '<div class="hm-hscroll__meta"><span>' . esc_html( $item['label'] ) . '</span><span class="hm-num">' . esc_html( self::index_label( $i ) ) . '</span></div>';
			echo '<h3 class="hm-hscroll__title">' . esc_html( $item['title'] ) . '</h3>';
			if ( $item['text'] ) {
				echo '<p class="hm-hscroll__text">' . esc_html( $item['text'] ) . '</p>';
			}
			echo '</div></article>';
		}

		echo '</div>';
		if ( 'yes' === $s['progress'] ) {
			echo '<div class="hm-hscroll__progress" aria-hidden="true"><i class="hm-hscroll__bar"></i></div>';
		}
		echo '</div></section>';
	}
}
