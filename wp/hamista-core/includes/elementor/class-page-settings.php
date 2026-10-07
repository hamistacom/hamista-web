<?php
/**
 * Hamista layout options inside Elementor's page settings panel. Values are
 * saved in Elementor's page settings; the theme reads them through
 * hamista_page_option() (keys without the leading underscore).
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor;

use Elementor\Controls_Manager;

defined( 'ABSPATH' ) || exit;

/**
 * Page settings.
 */
class Page_Settings {

	/**
	 * Hooks.
	 */
	public static function init() {
		add_action( 'elementor/documents/register_controls', array( __CLASS__, 'register' ) );
		add_filter( 'elementor/document/wrapper_attributes', array( __CLASS__, 'wrapper_attributes' ), 10, 2 );
	}

	/**
	 * The page-wide light line rides on the document wrapper.
	 *
	 * @param array                         $attributes Wrapper attributes.
	 * @param \Elementor\Core\Base\Document $document   Document.
	 * @return array
	 */
	public static function wrapper_attributes( $attributes, $document ) {
		if ( ! $document instanceof \Elementor\Core\DocumentTypes\PageBase ) {
			return $attributes;
		}
		$s     = (array) $document->get_settings();
		$light = Motion::light_data( $document, $s, 'hm_page_light' );
		if ( $light ) {
			$attributes['data-hm-light'] = wp_json_encode( $light );
			Motion::enqueue_fx();
		}
		return $attributes;
	}

	/**
	 * Add controls to page/post documents.
	 *
	 * @param \Elementor\Core\Base\Document $document Document.
	 */
	public static function register( $document ) {
		if ( ! $document instanceof \Elementor\Core\DocumentTypes\PageBase || ! hamista_core_theme_active() ) {
			return;
		}

		$document->start_controls_section(
			'hm_page_section',
			array(
				'label' => __( 'Hamista layout', 'hamista-core' ),
				'tab'   => Controls_Manager::TAB_SETTINGS,
			)
		);
		$document->add_control(
			'hm_header',
			array(
				'label'   => __( 'Header', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '',
				'options' => array(
					''                  => __( 'Default', 'hamista-core' ),
					'transparent'       => __( 'Transparent over content', 'hamista-core' ),
					'transparent-light' => __( 'Transparent, light text (dark hero)', 'hamista-core' ),
					'hidden'            => __( 'Hidden', 'hamista-core' ),
				),
			)
		);
		$document->add_control(
			'hm_footer',
			array(
				'label'   => __( 'Footer', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '',
				'options' => array(
					''       => __( 'Default', 'hamista-core' ),
					'hidden' => __( 'Hidden', 'hamista-core' ),
				),
			)
		);
		$document->add_control(
			'hm_color_scheme',
			array(
				'label'   => __( 'Force colour scheme', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '',
				'options' => array(
					''      => __( 'Visitor choice', 'hamista-core' ),
					'light' => __( 'Always light', 'hamista-core' ),
					'dark'  => __( 'Always dark', 'hamista-core' ),
				),
			)
		);
		$document->end_controls_section();

		$document->start_controls_section(
			'hm_page_fx_section',
			array(
				'label' => __( 'Hamista scroll effects', 'hamista-core' ),
				'tab'   => Controls_Manager::TAB_SETTINGS,
			)
		);
		$document->add_control(
			'hm_page_light',
			array(
				'label'       => __( 'Light line along the page', 'hamista-core' ),
				'description' => __( 'A thread of light that draws itself through every section of this page as visitors scroll, with a glowing head at the reading point.', 'hamista-core' ),
				'type'        => Controls_Manager::SELECT,
				'default'     => '',
				'options'     => Motion::light_modes(),
			)
		);
		Motion::add_light_controls( $document, 'hm_page_light' );
		$document->end_controls_section();
	}
}
