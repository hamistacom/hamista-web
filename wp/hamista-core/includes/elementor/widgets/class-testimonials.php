<?php
/**
 * Testimonials: grid (centre card offset), a marquee wall, or one big quote.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Testimonials widget.
 */
class Testimonials extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-testimonials';
	}

	/** @return string */
	public function get_title() {
		return __( 'Testimonials', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-testimonial-carousel';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'testimonials', 'reviews', 'quotes', 'customers' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_items', array( 'label' => __( 'Testimonials', 'hamista-core' ) ) );
		$items = new Repeater();
		$items->add_control(
			'quote',
			array(
				'label'   => __( 'Quote', 'hamista-core' ),
				'type'    => Controls_Manager::TEXTAREA,
				'rows'    => 4,
				'default' => __( 'I finished the course with a product people actually use. Nothing else I tried did that.', 'hamista-core' ),
			)
		);
		$items->add_control(
			'name',
			array(
				'label'   => __( 'Name', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Sara Ahmadi', 'hamista-core' ),
			)
		);
		$items->add_control(
			'role',
			array(
				'label'   => __( 'Role', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Product designer', 'hamista-core' ),
			)
		);
		$items->add_control(
			'avatar',
			array(
				'label' => __( 'Photo', 'hamista-core' ),
				'type'  => Controls_Manager::MEDIA,
			)
		);
		$items->add_control(
			'rating',
			array(
				'label'   => __( 'Stars', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '0',
				'options' => array(
					'0' => __( 'Hide', 'hamista-core' ),
					'3' => '3',
					'4' => '4',
					'5' => '5',
				),
			)
		);
		$this->add_control(
			'items',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $items->get_controls(),
				'title_field' => '{{{ name }}}',
				'default'     => array(
					array( 'name' => __( 'Sara Ahmadi', 'hamista-core' ) ),
					array( 'name' => __( 'Reza Karimi', 'hamista-core' ) ),
					array( 'name' => __( 'Nazanin Rad', 'hamista-core' ) ),
				),
			)
		);
		$this->add_control(
			'layout',
			array(
				'label'   => __( 'Layout', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'grid',
				'options' => array(
					'grid'    => __( 'Grid', 'hamista-core' ),
					'marquee' => __( 'Moving wall', 'hamista-core' ),
					'single'  => __( 'One large quote', 'hamista-core' ),
				),
			)
		);
		$this->add_responsive_control(
			'columns',
			array(
				'label'          => __( 'Columns', 'hamista-core' ),
				'type'           => Controls_Manager::SELECT,
				'default'        => '3',
				'tablet_default' => '2',
				'mobile_default' => '1',
				'options'        => array(
					'1' => '1',
					'2' => '2',
					'3' => '3',
				),
				'condition'      => array( 'layout' => 'grid' ),
				'selectors'      => array( '{{WRAPPER}} .hm-quotes--grid' => '--cols: {{VALUE}};' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * One testimonial card.
	 *
	 * @param array $item Item.
	 * @param int   $i    Index.
	 * @param bool  $big  Large variant.
	 * @return string
	 */
	private function card( $item, $i, $big = false ) {
		$html = '<figure class="hm-quote' . ( $big ? ' hm-quote--big' : ' hm-bolted' ) . '" style="--r:' . ( 0 === $i % 2 ? '-1' : '1' ) . '">';
		if ( ! $big ) {
			$html .= '<span class="hm-quote__pin" aria-hidden="true"></span>';
		}
		$html .= '<span class="hm-quote__mark" aria-hidden="true">' . hamista_core_icon( 'quote' ) . '</span>';
		if ( (int) $item['rating'] > 0 ) {
			/* translators: %d: star rating */
			$html .= '<span class="hm-quote__stars" role="img" aria-label="' . esc_attr( sprintf( __( '%d out of 5 stars', 'hamista-core' ), (int) $item['rating'] ) ) . '">' . str_repeat( '★', (int) $item['rating'] ) . '</span>';
		}
		$html  .= '<blockquote class="hm-quote__text">' . esc_html( $item['quote'] ) . '</blockquote>';
		$html  .= '<figcaption class="hm-quote__who">';
		$avatar = hamista_core_image(
			$item['avatar'],
			'thumbnail',
			array(
				'class' => 'hm-quote__avatar',
				'alt'   => $item['name'],
			)
		);
		if ( ! $avatar ) {
			$avatar = '<span class="hm-quote__avatar hm-quote__avatar--initial" aria-hidden="true">' . esc_html( mb_substr( (string) $item['name'], 0, 1 ) ) . '</span>';
		}
		$html .= $avatar . '<span><b>' . esc_html( $item['name'] ) . '</b><small>' . esc_html( $item['role'] ) . '</small></span></figcaption>';
		return $html . '</figure>';
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s     = $this->get_settings_for_display();
		$items = (array) $s['items'];

		if ( 'single' === $s['layout'] && $items ) {
			echo '<div class="hm-quotes hm-quotes--single" data-hm-reveal="up">' . $this->card( $items[0], 0, true ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			return;
		}

		if ( 'marquee' === $s['layout'] ) {
			$half = (int) ceil( count( $items ) / 2 );
			echo '<div class="hm-quotes hm-quotes--wall">';
			foreach ( array( array_slice( $items, 0, $half ), array_slice( $items, $half ) ) as $row => $group ) {
				if ( ! $group ) {
					continue;
				}
				echo '<div class="hm-marquee hm-marquee--quotes" data-hm-widget="marquee" data-speed="34" data-pause-hover' . ( $row ? ' data-direction="reverse"' : '' ) . '><div class="hm-marquee__track"><div class="hm-marquee__group">';
				foreach ( $group as $i => $item ) {
					echo $this->card( $item, $i ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				echo '</div></div></div>';
			}
			echo '</div>';
			return;
		}

		echo '<div class="hm-quotes hm-quotes--grid" data-hm-stagger="0.1">';
		foreach ( $items as $i => $item ) {
			echo '<div class="hm-quotes__cell" data-hm-reveal="up">' . $this->card( $item, $i ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		echo '</div>';
	}
}
