<?php
/**
 * Features: a grid, list or bento of feature modules with icons.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Features widget.
 */
class Features extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-features';
	}

	/** @return string */
	public function get_title() {
		return __( 'Features', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-icon-box';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'features', 'services', 'icon box', 'grid', 'bento', 'benefits' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_items', array( 'label' => __( 'Features', 'hamista-core' ) ) );
		$items = new Repeater();
		$items->add_control(
			'icon',
			array(
				'label'   => __( 'Icon', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'bolt',
				'options' => self::icon_options(),
			)
		);
		$items->add_control(
			'image',
			array(
				'label'       => __( 'Image (optional)', 'hamista-core' ),
				'type'        => Controls_Manager::MEDIA,
				'description' => __( 'Shown at the top of the card in bento and card layouts.', 'hamista-core' ),
			)
		);
		$items->add_control(
			'title',
			array(
				'label'   => __( 'Title', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Feature title', 'hamista-core' ),
			)
		);
		$items->add_control(
			'text',
			array(
				'label'   => __( 'Text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXTAREA,
				'default' => __( 'One or two sentences explaining why this matters.', 'hamista-core' ),
			)
		);
		$items->add_control(
			'meta',
			array(
				'label'       => __( 'Spec line (optional)', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'description' => __( 'A short technical label such as “24-BIT / 96 KHZ”.', 'hamista-core' ),
			)
		);
		$items->add_control(
			'link',
			array(
				'label' => __( 'Link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$items->add_control(
			'wide',
			array(
				'label'        => __( 'Wide tile (bento)', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
			)
		);
		$this->add_control(
			'items',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $items->get_controls(),
				'title_field' => '{{{ title }}}',
				'default'     => array(
					array(
						'icon'  => 'compass',
						'title' => __( 'Pick your path', 'hamista-core' ),
					),
					array(
						'icon'  => 'users',
						'title' => __( 'Build with a mentor', 'hamista-core' ),
					),
					array(
						'icon'  => 'rocket',
						'title' => __( 'Ship it', 'hamista-core' ),
					),
				),
			)
		);
		$this->add_control(
			'link_text',
			array(
				'label'   => __( 'Link text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Learn more', 'hamista-core' ),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_layout', array( 'label' => __( 'Layout', 'hamista-core' ) ) );
		$this->add_control(
			'layout',
			array(
				'label'   => __( 'Layout', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'grid',
				'options' => array(
					'grid'  => __( 'Grid', 'hamista-core' ),
					'bento' => __( 'Bento (mixed sizes)', 'hamista-core' ),
					'list'  => __( 'List with rules', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'style',
			array(
				'label'   => __( 'Style', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'cards',
				'options' => array(
					'cards' => __( 'Cards', 'hamista-core' ),
					'plain' => __( 'Plain', 'hamista-core' ),
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
					'4' => '4',
				),
				'selectors'      => array( '{{WRAPPER}} .hm-features' => '--cols: {{VALUE}};' ),
			)
		);
		$this->add_control(
			'numbered',
			array(
				'label'        => __( 'Show numbers', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
			)
		);
		$this->add_control(
			'icon_style',
			array(
				'label'   => __( 'Icon style', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'tile',
				'options' => array(
					'tile'  => __( 'Filled tile', 'hamista-core' ),
					'soft'  => __( 'Soft tile', 'hamista-core' ),
					'plain' => __( 'Plain', 'hamista-core' ),
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
		$classes = 'hm-features hm-features--' . sanitize_html_class( $s['layout'] ) . ' hm-features--' . sanitize_html_class( $s['style'] ) . ' hm-features--icon-' . sanitize_html_class( $s['icon_style'] );
		echo '<div class="' . esc_attr( $classes ) . '" data-hm-stagger="0.08">';
		foreach ( $s['items'] as $i => $item ) {
			$url   = ! empty( $item['link']['url'] ) ? $item['link']['url'] : '';
			$class = 'hm-feature' . ( 'cards' === $s['style'] ? ' hm-feature--card hm-bolted' : '' ) . ( 'yes' === $item['wide'] ? ' is-wide' : '' );
			echo '<article class="' . esc_attr( $class ) . '" data-hm-reveal="up" data-hm-spot>';
			if ( 'cards' === $s['style'] ) {
				echo '<span class="hm-vents" aria-hidden="true"><i></i><i></i><i></i></span>';
			}
			$img = hamista_core_image( $item['image'], 'large', array( 'sizes' => '(max-width: 760px) 100vw, 40vw' ) );
			if ( $img ) {
				echo '<div class="hm-feature__media">' . $img . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '<div class="hm-feature__top">';
			if ( $item['icon'] ) {
				echo '<span class="hm-feature__icon">' . hamista_core_icon( $item['icon'] ) . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			if ( 'yes' === $s['numbered'] ) {
				echo '<span class="hm-feature__num hm-num">' . esc_html( self::index_label( $i ) ) . '</span>';
			}
			echo '</div>';
			echo '<h3 class="hm-feature__title">' . esc_html( $item['title'] ) . '</h3>';
			if ( $item['text'] ) {
				echo '<p class="hm-feature__text">' . esc_html( $item['text'] ) . '</p>';
			}
			if ( $item['meta'] ) {
				echo '<p class="hm-feature__meta hm-num">' . esc_html( $item['meta'] ) . '</p>';
			}
			if ( $url && $s['link_text'] ) {
				echo '<a class="hm-feature__link" href="' . esc_url( $url ) . '">' . esc_html( $s['link_text'] ) . hamista_core_icon( 'arrow', array( 'class' => 'hm-i-arrow' ) ) . '</a>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</article>';
		}
		echo '</div>';
	}
}
