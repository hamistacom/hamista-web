<?php
/**
 * Accordion / FAQ with optional FAQPage structured data.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Accordion widget.
 */
class Accordion extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-accordion';
	}

	/** @return string */
	public function get_title() {
		return __( 'FAQ / Accordion', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-accordion';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'faq', 'accordion', 'questions', 'toggle' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_items', array( 'label' => __( 'Questions', 'hamista-core' ) ) );
		$items = new Repeater();
		$items->add_control(
			'q',
			array(
				'label'       => __( 'Question', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'label_block' => true,
				'default'     => __( 'Do I need any experience to start?', 'hamista-core' ),
			)
		);
		$items->add_control(
			'a',
			array(
				'label'   => __( 'Answer', 'hamista-core' ),
				'type'    => Controls_Manager::WYSIWYG,
				'default' => __( 'No. Every path starts from zero.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'items',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $items->get_controls(),
				'title_field' => '{{{ q }}}',
				'default'     => array(
					array( 'q' => __( 'Do I need any experience to start?', 'hamista-core' ) ),
					array( 'q' => __( 'Are classes online or in person?', 'hamista-core' ) ),
					array( 'q' => __( 'Do I get a certificate?', 'hamista-core' ) ),
				),
			)
		);
		$this->add_control(
			'first_open',
			array(
				'label'        => __( 'First item open', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->add_control(
			'single',
			array(
				'label'        => __( 'Only one open at a time', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->add_control(
			'schema',
			array(
				'label'        => __( 'Add FAQ structured data (SEO)', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
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
					'lines' => __( 'Lines', 'hamista-core' ),
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
		$id   = 'hma-' . $this->get_id();
		$faqs = array();
		echo '<div class="hm-acc hm-acc--' . esc_attr( $s['style'] ) . '" data-hm-widget="accordion" data-single="' . ( 'yes' === $s['single'] ? 'true' : 'false' ) . '" data-hm-stagger="0.06">';
		foreach ( $s['items'] as $i => $item ) {
			$open = 0 === $i && 'yes' === $s['first_open'];
			echo '<div class="hm-acc__item' . ( $open ? ' is-open' : '' ) . ( 'cards' === $s['style'] ? ' hm-bolted' : '' ) . '" data-hm-reveal="up">';
			printf(
				'<h3 class="hm-acc__q"><button type="button" class="hm-acc__btn" id="%1$s-q%2$d" aria-controls="%1$s-a%2$d" aria-expanded="%3$s"><span>%4$s</span><span class="hm-acc__icon" aria-hidden="true"></span></button></h3>',
				esc_attr( $id ),
				(int) $i,
				$open ? 'true' : 'false',
				esc_html( $item['q'] )
			);
			printf( '<div class="hm-acc__panel" id="%1$s-a%2$d" role="region" aria-labelledby="%1$s-q%2$d"><div><div class="hm-acc__a">%3$s</div></div></div>', esc_attr( $id ), (int) $i, wp_kses_post( wpautop( $item['a'] ) ) );
			echo '</div>';
			$faqs[] = array(
				'@type'          => 'Question',
				'name'           => wp_strip_all_tags( $item['q'] ),
				'acceptedAnswer' => array(
					'@type' => 'Answer',
					'text'  => wp_strip_all_tags( $item['a'] ),
				),
			);
		}
		echo '</div>';

		if ( 'yes' === $s['schema'] && $faqs && ! \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			echo '<script type="application/ld+json">' . wp_json_encode(
				array(
					'@context'   => 'https://schema.org',
					'@type'      => 'FAQPage',
					'mainEntity' => $faqs,
				),
				JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
			) . '</script>';
		}
	}
}
