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
	}
}
