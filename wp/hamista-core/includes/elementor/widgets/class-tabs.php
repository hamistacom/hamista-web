<?php
/**
 * Tabs Showcase: a list of tabs on one side and a large media panel on the
 * other; can advance automatically with a progress bar.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Tabs widget.
 */
class Tabs extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-tabs';
	}

	/** @return string */
	public function get_title() {
		return __( 'Tabs Showcase', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-tabs';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'tabs', 'showcase', 'courses', 'tracks', 'autoplay' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_tabs', array( 'label' => __( 'Tabs', 'hamista-core' ) ) );
		$items = new Repeater();
		$items->add_control(
			'title',
			array(
				'label'   => __( 'Tab title', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Product design', 'hamista-core' ),
			)
		);
		$items->add_control(
			'subtitle',
			array(
				'label'   => __( 'Tab subtitle', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'From problem to testable prototype', 'hamista-core' ),
			)
		);
		$items->add_control(
			'meta',
			array(
				'label'   => __( 'Tab meta (short, Latin)', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => '10 WK',
			)
		);
		$items->add_control(
			'image',
			array(
				'label'   => __( 'Panel image', 'hamista-core' ),
				'type'    => Controls_Manager::MEDIA,
				'default' => array( 'url' => \Elementor\Utils::get_placeholder_image_src() ),
			)
		);
		$items->add_control(
			'panel_title',
			array(
				'label' => __( 'Panel title', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$items->add_control(
			'panel_text',
			array(
				'label' => __( 'Panel text', 'hamista-core' ),
				'type'  => Controls_Manager::TEXTAREA,
			)
		);
		$items->add_control(
			'chips',
			array(
				'label'       => __( 'Tags (comma separated)', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'placeholder' => 'Figma, React, API',
			)
		);
		$items->add_control(
			'btn_text',
			array(
				'label' => __( 'Button text', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$items->add_control(
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
				'fields'      => $items->get_controls(),
				'title_field' => '{{{ title }}}',
				'default'     => array(
					array( 'title' => __( 'Product design', 'hamista-core' ) ),
					array( 'title' => __( 'Web development', 'hamista-core' ) ),
					array( 'title' => __( 'Applied AI', 'hamista-core' ) ),
				),
			)
		);
		$this->add_control(
			'autoplay',
			array(
				'label'       => __( 'Advance every (seconds)', 'hamista-core' ),
				'type'        => Controls_Manager::NUMBER,
				'default'     => 6,
				'min'         => 0,
				'max'         => 30,
				'description' => __( '0 turns autoplay off. Autoplay pauses on hover and while off-screen.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'media_side',
			array(
				'label'   => __( 'Media position', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'end',
				'options' => array(
					'end'   => __( 'After the tabs', 'hamista-core' ),
					'start' => __( 'Before the tabs', 'hamista-core' ),
				),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s    = $this->get_settings_for_display();
		$id   = 'hmt-' . $this->get_id();
		$auto = (float) $s['autoplay'];
		echo '<div class="hm-tabs hm-tabs--media-' . esc_attr( $s['media_side'] ) . '" data-hm-widget="tabs" data-autoplay="' . esc_attr( $auto ) . '">';
		echo '<div class="hm-tabs__list" role="tablist">';
		foreach ( $s['items'] as $i => $item ) {
			printf(
				'<button type="button" class="hm-tabs__tab%5$s" role="tab" id="%1$s-t%2$d" aria-controls="%1$s-p%2$d" aria-selected="%3$s" tabindex="%4$s">',
				esc_attr( $id ),
				(int) $i,
				0 === $i ? 'true' : 'false',
				0 === $i ? '0' : '-1',
				0 === $i ? ' is-active' : ''
			);
			echo '<span class="hm-tabs__title">' . esc_html( $item['title'] ) . '</span>';
			if ( $item['subtitle'] ) {
				echo '<span class="hm-tabs__sub">' . esc_html( $item['subtitle'] ) . '</span>';
			}
			if ( $item['meta'] ) {
				echo '<span class="hm-tabs__meta">' . esc_html( $item['meta'] ) . '</span>';
			}
			if ( $auto > 0 ) {
				echo '<span class="hm-tabs__bar" aria-hidden="true"></span>';
			}
			echo '</button>';
		}
		echo '</div><div class="hm-tabs__panels hm-bolted">';
		foreach ( $s['items'] as $i => $item ) {
			printf( '<div class="hm-tabs__panel%3$s" role="tabpanel" id="%1$s-p%2$d" aria-labelledby="%1$s-t%2$d">', esc_attr( $id ), (int) $i, 0 === $i ? ' is-active' : '' );
			$img = hamista_core_image( $item['image'], 'large', array( 'sizes' => '(max-width: 900px) 100vw, 55vw' ) );
			if ( $img ) {
				echo '<div class="hm-tabs__media">' . $img . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			if ( $item['panel_title'] || $item['panel_text'] || $item['chips'] || $item['btn_text'] ) {
				echo '<div class="hm-tabs__info">';
				if ( $item['panel_title'] ) {
					echo '<h3 class="hm-tabs__ptitle">' . esc_html( $item['panel_title'] ) . '</h3>';
				}
				if ( $item['panel_text'] ) {
					echo '<p class="hm-tabs__ptext">' . esc_html( $item['panel_text'] ) . '</p>';
				}
				$chips = array_filter( array_map( 'trim', preg_split( '/[,،]/u', (string) $item['chips'] ) ) );
				if ( $chips ) {
					echo '<div class="hm-tabs__chips">';
					foreach ( $chips as $chip ) {
						echo '<span class="hm-chip">' . esc_html( $chip ) . '</span>';
					}
					echo '</div>';
				}
				if ( $item['btn_text'] ) {
					echo self::button_html( $item['btn_text'], $item['btn_link'], 'secondary', array( 'size' => 'sm' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				echo '</div>';
			}
			echo '</div>';
		}
		echo '</div></div>';
	}
}
