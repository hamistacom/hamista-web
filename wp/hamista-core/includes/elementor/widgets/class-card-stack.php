<?php
/**
 * Card Deck: a fanned stack of glass cards. The arrow buttons (or a swipe)
 * bring the next card flying onto the deck; its title types itself in.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Card deck widget.
 */
class Card_Stack extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-card-stack';
	}

	/** @return string */
	public function get_title() {
		return __( 'Card Deck', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-slider-3d';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'cards', 'deck', 'stack', 'slider', 'services', 'glass', 'nft' );
	}

	/** @return array */
	public function get_script_depends() {
		return array( 'hamista-motion', 'hamista-card-stack' );
	}

	/** @return array */
	public function get_style_depends() {
		return array( 'hamista-widgets', 'hamista-card-stack' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_cards', array( 'label' => __( 'Cards', 'hamista-core' ) ) );
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
				'default' => __( 'Service', 'hamista-core' ),
			)
		);
		$items->add_control(
			'title',
			array(
				'label'       => __( 'Title', 'hamista-core' ),
				'description' => __( 'Types itself in when the card comes to the top.', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => __( 'Brand identity', 'hamista-core' ),
			)
		);
		$items->add_control(
			'text',
			array(
				'label' => __( 'Short text', 'hamista-core' ),
				'type'  => Controls_Manager::TEXTAREA,
				'rows'  => 2,
			)
		);
		$items->add_control(
			'avatar',
			array(
				'label' => __( 'Small round picture', 'hamista-core' ),
				'type'  => Controls_Manager::MEDIA,
			)
		);
		$items->add_control(
			'person',
			array(
				'label' => __( 'Name beside the picture', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$items->add_control(
			'meta',
			array(
				'label' => __( 'Line under the name', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$items->add_control(
			'tag_label',
			array(
				'label'   => __( 'Tag caption', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'From', 'hamista-core' ),
			)
		);
		$items->add_control(
			'tag',
			array(
				'label'   => __( 'Tag', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( '12 million Toman', 'hamista-core' ),
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
					array( 'title' => __( 'Brand identity', 'hamista-core' ) ),
					array( 'title' => __( 'Website design', 'hamista-core' ) ),
					array( 'title' => __( 'Motion and video', 'hamista-core' ) ),
				),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_deck', array( 'label' => __( 'Deck', 'hamista-core' ) ) );
		$this->add_control(
			'arrows',
			array(
				'label'        => __( 'Arrow buttons', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->add_control(
			'counter',
			array(
				'label'        => __( 'Counter and progress', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->add_control(
			'typing',
			array(
				'label'        => __( 'Type the title', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->add_control(
			'autoplay',
			array(
				'label'       => __( 'Change every (seconds)', 'hamista-core' ),
				'description' => __( '0 keeps the deck still until a visitor moves it.', 'hamista-core' ),
				'type'        => Controls_Manager::NUMBER,
				'min'         => 0,
				'max'         => 30,
				'default'     => 6,
			)
		);
		$this->add_control(
			'look',
			array(
				'label'   => __( 'Card look', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'glass',
				'options' => array(
					'glass' => __( 'Frosted glass', 'hamista-core' ),
					'solid' => __( 'Solid surface', 'hamista-core' ),
				),
			)
		);
		$this->add_responsive_control(
			'width',
			array(
				'label'      => __( 'Card width', 'hamista-core' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px' ),
				'range'      => array(
					'px' => array(
						'min' => 220,
						'max' => 480,
					),
				),
				'default'    => array(
					'unit' => 'px',
					'size' => 320,
				),
				'selectors'  => array( '{{WRAPPER}} .hm-deck' => '--hm-deck-w: {{SIZE}}px;' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s     = $this->get_settings_for_display();
		$items = array_values( (array) $s['items'] );
		$total = count( $items );
		if ( ! $total ) {
			return;
		}
		$config = array(
			'auto'   => max( 0, (int) $s['autoplay'] ),
			'typing' => 'yes' === $s['typing'],
		);
		printf(
			'<div class="hm-deck hm-deck--%1$s" data-hm-widget="card-stack" data-hm-deck="%2$s" role="group" aria-roledescription="%3$s" aria-label="%4$s">',
			esc_attr( 'solid' === $s['look'] ? 'solid' : 'glass' ),
			esc_attr( wp_json_encode( $config ) ),
			esc_attr__( 'card deck', 'hamista-core' ),
			esc_attr( $items[0]['title'] )
		);
		echo '<div class="hm-deck__stage" aria-live="polite">';
		foreach ( $items as $i => $item ) {
			$tag = ! empty( $item['link']['url'] ) ? 'a' : 'div';
			$url = 'a' === $tag ? ' href="' . esc_url( $item['link']['url'] ) . '"' . ( ! empty( $item['link']['is_external'] ) ? ' target="_blank" rel="noopener"' : '' ) : '';
			printf( '<%1$s class="hm-deck__card" data-i="%2$d"%3$s%4$s>', esc_attr( $tag ), (int) $i, $url, $i ? ' aria-hidden="true" tabindex="-1"' : '' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $url is escaped above.
			$img = hamista_core_image( $item['image'], 'medium_large', array( 'sizes' => '(max-width: 600px) 80vw, 360px' ) );
			echo '<div class="hm-deck__media">' . $img; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			if ( $item['label'] ) {
				echo '<span class="hm-deck__label">' . esc_html( $item['label'] ) . '</span>';
			}
			echo '</div><div class="hm-deck__body">';
			echo '<h3 class="hm-deck__title" data-text="' . esc_attr( $item['title'] ) . '">' . esc_html( $item['title'] ) . '</h3>';
			if ( $item['text'] ) {
				echo '<p class="hm-deck__text">' . esc_html( $item['text'] ) . '</p>';
			}
			echo '<div class="hm-deck__foot">';
			$avatar = ! empty( $item['avatar']['url'] ) ? hamista_core_image( $item['avatar'], 'thumbnail', array( 'class' => 'hm-deck__avatar' ) ) : '';
			if ( $avatar || $item['person'] ) {
				echo '<div class="hm-deck__who">' . $avatar . '<span><b>' . esc_html( $item['person'] ) . '</b>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				if ( $item['meta'] ) {
					echo '<small class="hm-num">' . esc_html( $item['meta'] ) . '</small>';
				}
				echo '</span></div>';
			}
			if ( $item['tag'] ) {
				echo '<div class="hm-deck__tag"><small>' . esc_html( $item['tag_label'] ) . '</small><span class="hm-num">' . esc_html( $item['tag'] ) . '</span></div>';
			}
			echo '</div></div>';
			printf( '</%s>', esc_attr( $tag ) );
		}
		echo '</div>';

		if ( 'yes' === $s['arrows'] || 'yes' === $s['counter'] ) {
			echo '<div class="hm-deck__nav">';
			if ( 'yes' === $s['arrows'] ) {
				$next_icon = is_rtl() ? 'chevron-l' : 'chevron-r';
				$prev_icon = is_rtl() ? 'chevron-r' : 'chevron-l';
				echo '<button type="button" class="hm-deck__btn" data-deck="prev" aria-label="' . esc_attr__( 'Previous card', 'hamista-core' ) . '">' . hamista_core_icon( $prev_icon ) . '</button>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			if ( 'yes' === $s['counter'] ) {
				echo '<span class="hm-deck__count hm-num"><b data-deck-index>' . esc_html( self::pad_number( 1 ) ) . '</b><i style="--n:' . (int) $total . '"><span></span></i>' . esc_html( self::pad_number( $total ) ) . '</span>';
			}
			if ( 'yes' === $s['arrows'] ) {
				echo '<button type="button" class="hm-deck__btn" data-deck="next" aria-label="' . esc_attr__( 'Next card', 'hamista-core' ) . '">' . hamista_core_icon( $next_icon ) . '</button>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</div>';
		}
		echo '</div>';
	}
}
