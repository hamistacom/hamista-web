<?php
/**
 * Contact Info: address / phone / email / hours cards and a click-to-load map.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Contact info widget.
 */
class Contact_Info extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-contact-info';
	}

	/** @return string */
	public function get_title() {
		return __( 'Contact Info & Map', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-map-pin';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'contact', 'address', 'phone', 'map', 'location' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_items', array( 'label' => __( 'Details', 'hamista-core' ) ) );
		$items = new Repeater();
		$items->add_control(
			'icon',
			array(
				'label'   => __( 'Icon', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'pin',
				'options' => self::icon_options(),
			)
		);
		$items->add_control(
			'label',
			array(
				'label'   => __( 'Label', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Address', 'hamista-core' ),
			)
		);
		$items->add_control(
			'value',
			array(
				'label'   => __( 'Value', 'hamista-core' ),
				'type'    => Controls_Manager::TEXTAREA,
				'rows'    => 2,
				'default' => __( 'Tehran, Valiasr St.', 'hamista-core' ),
			)
		);
		$items->add_control(
			'link',
			array(
				'label'       => __( 'Link', 'hamista-core' ),
				'type'        => Controls_Manager::URL,
				'description' => __( 'e.g. tel:+982100000000 or mailto:hello@example.com', 'hamista-core' ),
			)
		);
		$this->add_control(
			'items',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $items->get_controls(),
				'title_field' => '{{{ label }}}',
				'default'     => array(
					array(
						'icon'  => 'pin',
						'label' => __( 'Address', 'hamista-core' ),
					),
					array(
						'icon'  => 'phone',
						'label' => __( 'Phone', 'hamista-core' ),
						'value' => '021-00000000',
					),
					array(
						'icon'  => 'mail',
						'label' => __( 'Email', 'hamista-core' ),
						'value' => 'hello@example.com',
					),
				),
			)
		);
		$this->add_control(
			'map',
			array(
				'label'       => __( 'Map embed URL', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'label_block' => true,
				'separator'   => 'before',
				'description' => __( 'An embeddable map URL (Neshan, Balad, OpenStreetMap or Google Maps embed). It only loads after the visitor clicks, keeping pages fast and private.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'map_image',
			array(
				'label'     => __( 'Map preview image', 'hamista-core' ),
				'type'      => Controls_Manager::MEDIA,
				'condition' => array( 'map!' => '' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s = $this->get_settings_for_display();
		echo '<div class="hm-cinfo">';
		echo '<ul class="hm-cinfo__list" data-hm-stagger="0.08">';
		foreach ( $s['items'] as $item ) {
			$url = ! empty( $item['link']['url'] ) ? $item['link']['url'] : '';
			echo '<li class="hm-cinfo__item hm-bolted" data-hm-reveal="up">';
			echo '<span class="hm-cinfo__icon">' . hamista_core_icon( $item['icon'] ) . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<span class="hm-cinfo__text"><small>' . esc_html( $item['label'] ) . '</small>';
			$value = hamista_core_ltr_phone( nl2br( esc_html( $item['value'] ) ) );
			echo $url ? '<a href="' . esc_url( $url, array( 'http', 'https', 'tel', 'mailto' ) ) . '">' . $value . '</a>' : '<span>' . $value . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '</span></li>';
		}
		echo '</ul>';
		if ( $s['map'] ) {
			$preview = hamista_core_image( $s['map_image'], 'large' );
			echo '<div class="hm-cinfo__map hm-bolted" data-hm-widget="mapload" data-hm-reveal="clip-up">';
			echo $preview; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			printf(
				'<button type="button" class="hm-btn hm-btn--secondary hm-cinfo__load" data-src="%1$s">%2$s<span>%3$s</span></button>',
				esc_url( $s['map'] ),
				hamista_core_icon( 'pin' ), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				esc_html__( 'Show the map', 'hamista-core' )
			);
			echo '</div>';
		}
		echo '</div>';
	}
}
