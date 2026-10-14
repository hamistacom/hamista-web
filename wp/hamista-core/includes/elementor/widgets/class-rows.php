<?php
/**
 * Rows: a titled list of ruled rows, each with a date or number, a title, a
 * detail and an optional link; for awards, education, experience, prices or
 * press mentions. Rows slide in one after another and lift on hover.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Rows widget.
 */
class Rows extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-rows';
	}

	/** @return string */
	public function get_title() {
		return __( 'Rows', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-bullet-list';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'rows', 'list', 'awards', 'education', 'experience', 'resume', 'timeline', 'cv' );
	}

	/** @return array */
	public function get_script_depends() {
		return array( 'hamista-motion' );
	}

	/** @return array */
	public function get_style_depends() {
		return array( 'hamista-widgets' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_rows', array( 'label' => __( 'Rows', 'hamista-core' ) ) );
		$this->add_control(
			'title',
			array(
				'label'   => __( 'Title', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Awards', 'hamista-core' ),
			)
		);
		$r = new Repeater();
		$r->add_control(
			'start',
			array(
				'label'   => __( 'Date or number', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => '1403',
			)
		);
		$r->add_control(
			'name',
			array(
				'label'   => __( 'Title', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Site of the month', 'hamista-core' ),
			)
		);
		$r->add_control(
			'detail',
			array(
				'label'   => __( 'Detail', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Honourable mention', 'hamista-core' ),
			)
		);
		$r->add_control(
			'link',
			array(
				'label' => __( 'Link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$this->add_control(
			'rows',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $r->get_controls(),
				'title_field' => '{{{ start }}} — {{{ name }}}',
				'default'     => array(
					array(
						'start'  => '1403',
						'name'   => __( 'Site of the month', 'hamista-core' ),
						'detail' => __( 'Honourable mention', 'hamista-core' ),
					),
					array(
						'start'  => '1402',
						'name'   => __( 'Design award', 'hamista-core' ),
						'detail' => __( 'Special mention', 'hamista-core' ),
					),
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
					'md' => __( 'Regular', 'hamista-core' ),
					'lg' => __( 'Large titles', 'hamista-core' ),
				),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s = $this->get_settings_for_display();
		echo '<div class="hm-rows hm-rows--' . esc_attr( 'lg' === $s['size'] ? 'lg' : 'md' ) . '">';
		if ( $s['title'] ) {
			echo '<h3 class="hm-rows__title" data-hm-reveal="up">' . esc_html( $s['title'] ) . '</h3>';
		}
		echo '<ul class="hm-rows__list" data-hm-stagger="0.07">';
		foreach ( (array) $s['rows'] as $row ) {
			$url  = ! empty( $row['link']['url'] ) ? $row['link']['url'] : '';
			$tag  = $url ? 'a' : 'div';
			$attr = $url ? ' href="' . esc_url( $url ) . '"' . ( ! empty( $row['link']['is_external'] ) ? ' target="_blank" rel="noopener"' : '' ) : '';
			echo '<li data-hm-reveal="up"><' . $tag . ' class="hm-rows__row"' . $attr . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- fixed tag, escaped attributes.
			echo '<span class="hm-rows__start hm-num">' . esc_html( hamista_core_digits( (string) $row['start'] ) ) . '</span>';
			echo '<span class="hm-rows__name">' . esc_html( $row['name'] ) . '</span>';
			echo '<span class="hm-rows__detail">' . esc_html( $row['detail'] ) . '</span>';
			echo '<span class="hm-rows__go" aria-hidden="true">' . hamista_core_icon( $url ? 'arrow-out' : 'plus' ) . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '</' . $tag . '></li>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		echo '</ul></div>';
	}
}
