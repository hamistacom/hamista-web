<?php
/**
 * Ring badge: a slowly turning ring around a centre. The ring carries either a
 * line of text written along the circle or a set of social links; the centre
 * holds an icon, a logo or a link ("Get in touch", "Scroll down").
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Badge ring widget.
 */
class Badge_Ring extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-badge-ring';
	}

	/** @return string */
	public function get_title() {
		return __( 'Ring Badge', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-circle-o';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'circle', 'ring', 'badge', 'rotate', 'social', 'text' );
	}

	/** @return array */
	public function get_style_depends() {
		return array( 'hamista-widgets', 'hamista-agency' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_ring', array( 'label' => __( 'Ring', 'hamista-core' ) ) );
		$this->add_control(
			'mode',
			array(
				'label'   => __( 'On the ring', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'text',
				'options' => array(
					'text'   => __( 'Text along the circle', 'hamista-core' ),
					'social' => __( 'Social links', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'text',
			array(
				'label'     => __( 'Ring text', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Creative studio • Since 1395 • Tehran •', 'hamista-core' ),
				'condition' => array( 'mode' => 'text' ),
			)
		);
		$net = new Repeater();
		$net->add_control(
			'network',
			array(
				'label'   => __( 'Network', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'instagram',
				'options' => array(
					'instagram' => __( 'Instagram', 'hamista-core' ),
					'telegram'  => __( 'Telegram', 'hamista-core' ),
					'whatsapp'  => __( 'WhatsApp', 'hamista-core' ),
					'linkedin'  => __( 'LinkedIn', 'hamista-core' ),
					'x'         => __( 'X', 'hamista-core' ),
					'youtube'   => __( 'YouTube', 'hamista-core' ),
					'mail'      => __( 'Email', 'hamista-core' ),
					'phone'     => __( 'Phone', 'hamista-core' ),
				),
			)
		);
		$net->add_control(
			'url',
			array(
				'label' => __( 'Link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$this->add_control(
			'socials',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $net->get_controls(),
				'title_field' => '{{{ network }}}',
				'default'     => array(
					array( 'network' => 'instagram' ),
					array( 'network' => 'telegram' ),
					array( 'network' => 'linkedin' ),
					array( 'network' => 'x' ),
					array( 'network' => 'whatsapp' ),
				),
				'condition'   => array( 'mode' => 'social' ),
			)
		);
		$this->add_control(
			'center',
			array(
				'label'   => __( 'Centre', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'arrow',
				'options' => array(
					'arrow' => __( 'Arrow', 'hamista-core' ),
					'play'  => __( 'Play', 'hamista-core' ),
					'star'  => __( 'Star', 'hamista-core' ),
					'image' => __( 'Image or logo', 'hamista-core' ),
					'none'  => __( 'Nothing', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'image',
			array(
				'label'     => __( 'Image', 'hamista-core' ),
				'type'      => Controls_Manager::MEDIA,
				'condition' => array( 'center' => 'image' ),
			)
		);
		$this->add_control(
			'link',
			array(
				'label' => __( 'Centre link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$this->add_control(
			'look',
			array(
				'label'   => __( 'Look', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'accent',
				'options' => array(
					'accent'  => __( 'Accent ring', 'hamista-core' ),
					'outline' => __( 'Thin outline', 'hamista-core' ),
					'glass'   => __( 'Frosted glass', 'hamista-core' ),
				),
			)
		);
		$this->add_responsive_control(
			'size',
			array(
				'label'      => __( 'Size', 'hamista-core' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px' ),
				'range'      => array(
					'px' => array(
						'min' => 90,
						'max' => 360,
					),
				),
				'default'    => array(
					'unit' => 'px',
					'size' => 150,
				),
				'selectors'  => array( '{{WRAPPER}} .hm-ring' => '--hm-ring: {{SIZE}}px;' ),
			)
		);
		$this->add_control(
			'speed',
			array(
				'label'   => __( 'One turn takes (seconds)', 'hamista-core' ),
				'type'    => Controls_Manager::NUMBER,
				'min'     => 0,
				'max'     => 120,
				'default' => 24,
			)
		);
		$this->add_control(
			'scroll',
			array(
				'label'        => __( 'Also turn with scrolling', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s     = $this->get_settings_for_display();
		$look  = in_array( $s['look'], array( 'accent', 'outline', 'glass' ), true ) ? $s['look'] : 'accent';
		$speed = max( 0, (int) $s['speed'] );
		printf(
			'<div class="hm-ring hm-ring--%1$s hm-ring--%2$s" data-hm-widget="ring"%3$s style="--hm-ring-turn:%4$ss">',
			esc_attr( $look ),
			esc_attr( 'social' === $s['mode'] ? 'social' : 'text' ),
			'yes' === $s['scroll'] ? ' data-hm-ring-scroll' : '',
			esc_attr( $speed ? (string) $speed : '0' )
		);
		echo '<div class="hm-ring__track">';
		if ( 'social' === $s['mode'] ) {
			$items = array_values( (array) $s['socials'] );
			$n     = max( 1, count( $items ) );
			echo '<ul class="hm-ring__social">';
			foreach ( $items as $i => $item ) {
				$url  = ! empty( $item['url']['url'] ) ? $item['url']['url'] : '#';
				$icon = 'mail' === $item['network'] ? 'mail' : ( 'phone' === $item['network'] ? 'phone' : $item['network'] );
				printf(
					'<li style="--i:%1$d;--n:%2$d"><a href="%3$s" target="_blank" rel="noopener" aria-label="%4$s">%5$s</a></li>',
					(int) $i,
					(int) $n,
					esc_url( $url ),
					esc_attr( $item['network'] ),
					hamista_core_icon( $icon ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				);
			}
			echo '</ul>';
		} else {
			$id = 'hm-ring-' . $this->get_id();
			printf(
				'<svg class="hm-ring__text" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="%1$s" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"/></defs><text><textPath href="#%1$s" textLength="500">%2$s</textPath></text></svg>',
				esc_attr( $id ),
				esc_html( $s['text'] )
			);
		}
		echo '</div>';
		$center = '';
		if ( 'image' === $s['center'] && ! empty( $s['image']['url'] ) ) {
			$center = hamista_core_image( $s['image'], 'thumbnail', array( 'class' => 'hm-ring__img' ) );
		} elseif ( in_array( $s['center'], array( 'arrow', 'play', 'star' ), true ) ) {
			$center = hamista_core_icon( 'arrow' === $s['center'] ? 'arrow-out' : $s['center'] );
		}
		if ( $center ) {
			if ( ! empty( $s['link']['url'] ) ) {
				echo '<a class="hm-ring__center" href="' . esc_url( $s['link']['url'] ) . '" aria-label="' . esc_attr( 'text' === $s['mode'] ? $s['text'] : __( 'Open', 'hamista-core' ) ) . '">' . $center . '</a>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			} else {
				echo '<span class="hm-ring__center">' . $center . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
		}
		echo '</div>';
	}
}
