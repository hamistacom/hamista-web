<?php
/**
 * Team: people with photo, role and links.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Team widget.
 */
class Team extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-team';
	}

	/** @return string */
	public function get_title() {
		return __( 'Team', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-person';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'team', 'people', 'staff', 'mentors' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_people', array( 'label' => __( 'People', 'hamista-core' ) ) );
		$people = new Repeater();
		$people->add_control(
			'photo',
			array(
				'label' => __( 'Photo', 'hamista-core' ),
				'type'  => Controls_Manager::MEDIA,
			)
		);
		$people->add_control(
			'name',
			array(
				'label'   => __( 'Name', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Full name', 'hamista-core' ),
			)
		);
		$people->add_control(
			'role',
			array(
				'label'   => __( 'Role', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Mentor', 'hamista-core' ),
			)
		);
		$people->add_control(
			'linkedin',
			array(
				'label' => 'LinkedIn',
				'type'  => Controls_Manager::URL,
			)
		);
		$people->add_control(
			'instagram',
			array(
				'label' => 'Instagram',
				'type'  => Controls_Manager::URL,
			)
		);
		$this->add_control(
			'people',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $people->get_controls(),
				'title_field' => '{{{ name }}}',
				'default'     => array(
					array( 'name' => __( 'Full name', 'hamista-core' ) ),
					array( 'name' => __( 'Full name', 'hamista-core' ) ),
					array( 'name' => __( 'Full name', 'hamista-core' ) ),
					array( 'name' => __( 'Full name', 'hamista-core' ) ),
				),
			)
		);
		$this->add_responsive_control(
			'columns',
			array(
				'label'          => __( 'Columns', 'hamista-core' ),
				'type'           => Controls_Manager::SELECT,
				'default'        => '4',
				'tablet_default' => '2',
				'mobile_default' => '2',
				'options'        => array(
					'2' => '2',
					'3' => '3',
					'4' => '4',
					'5' => '5',
				),
				'selectors'      => array( '{{WRAPPER}} .hm-team' => '--cols: {{VALUE}};' ),
			)
		);
		$this->add_control(
			'mono',
			array(
				'label'        => __( 'Black & white until hover', 'hamista-core' ),
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
		$s = $this->get_settings_for_display();
		echo '<div class="hm-team' . ( 'yes' === $s['mono'] ? ' hm-team--mono' : '' ) . '" data-hm-stagger="0.08">';
		foreach ( $s['people'] as $person ) {
			echo '<figure class="hm-person" data-hm-reveal="up">';
			$photo = hamista_core_image(
				$person['photo'],
				'medium_large',
				array(
					'alt'   => $person['name'],
					'sizes' => '(max-width: 760px) 50vw, 25vw',
				)
			);
			echo '<div class="hm-person__photo">' . ( $photo ? $photo : '<span class="hm-person__initial" aria-hidden="true">' . esc_html( mb_substr( (string) $person['name'], 0, 1 ) ) . '</span>' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			$links = '';
			foreach ( array( 'linkedin', 'instagram' ) as $network ) {
				if ( ! empty( $person[ $network ]['url'] ) ) {
					$links .= '<a href="' . esc_url( $person[ $network ]['url'] ) . '" target="_blank" rel="noopener" aria-label="' . esc_attr( ucfirst( $network ) ) . '">' . hamista_core_icon( $network ) . '</a>';
				}
			}
			if ( $links ) {
				echo '<span class="hm-person__links">' . $links . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</div><figcaption><b>' . esc_html( $person['name'] ) . '</b><span>' . esc_html( $person['role'] ) . '</span></figcaption></figure>';
		}
		echo '</div>';
	}
}
