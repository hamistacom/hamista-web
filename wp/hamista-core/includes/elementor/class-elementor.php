<?php
/**
 * Elementor integration: widget category, widget registration, motion panel,
 * page settings, fonts and kit synchronisation.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor;

defined( 'ABSPATH' ) || exit;

/**
 * Elementor.
 */
class Elementor {

	/**
	 * Widget class names (short) in panel order.
	 *
	 * @return array
	 */
	public static function widget_list() {
		$widgets = array(
			'Hero',
			'Heading',
			'Button',
			'Text_Scrub',
			'Scroll_Zoom',
			'Depth',
			'Flow',
			'Hscroll',
			'Scroll_Path',
			'Stack',
			'Marquee',
			'Image_Reveal',
			'Counters',
			'Features',
			'Steps',
			'Tabs',
			'Accordion',
			'Testimonials',
			'Pricing',
			'Team',
			'Device',
			'Cta',
			'Contact_Form',
			'Lead_Form',
			'Contact_Info',
			'Posts',
			'Slider',
			'Stories',
			'Site_Logo',
			'Nav_Menu',
			'Header_Actions',
			'Before_After',
			'Showcase',
			'Search_Box',
		);
		if ( post_type_exists( 'hm_portfolio' ) || hamista_core_option( 'portfolio_enabled', true ) ) {
			$widgets[] = 'Portfolio';
		}
		if ( class_exists( '\Hamista\Core\Booking\Booking' ) && \Hamista\Core\Booking\Booking::enabled() ) {
			array_push( $widgets, 'Experts', 'Booking_Form' );
		}
		if ( class_exists( 'WooCommerce' ) ) {
			array_push( $widgets, 'Products', 'Product_Carousel', 'Product_Tabs', 'Product_Deal', 'Product_Categories' );
		}
		if ( class_exists( '\Hamista\Core\Auth\Account' ) ) {
			$widgets[] = 'Login';
		}
		return apply_filters( 'hamista_core/elementor_widgets', $widgets );
	}

	/**
	 * Hooks.
	 */
	public static function init() {
		add_action( 'elementor/elements/categories_registered', array( __CLASS__, 'register_category' ) );
		add_action( 'elementor/widgets/register', array( __CLASS__, 'register_widgets' ) );
		add_action( 'elementor/editor/after_enqueue_styles', array( __CLASS__, 'editor_styles' ) );
		add_action( 'elementor/preview/enqueue_styles', array( __CLASS__, 'preview_assets' ) );
		add_action( 'hamista_core/settings_saved', array( __CLASS__, 'sync_kit' ), 10, 3 );

		Motion::init();
		Page_Settings::init();
	}

	/**
	 * "Hamista" panel category, listed first.
	 *
	 * @param \Elementor\Elements_Manager $manager Manager.
	 */
	public static function register_category( $manager ) {
		$manager->add_category(
			'hamista',
			array(
				'title' => __( 'Hamista', 'hamista-core' ),
				'icon'  => 'eicon-apps',
			)
		);

		// Move the category to the top of the panel.
		$reflection = new \ReflectionObject( $manager );
		if ( $reflection->hasProperty( 'categories' ) ) {
			$property = $reflection->getProperty( 'categories' );
			$property->setAccessible( true );
			$categories = $property->getValue( $manager );
			if ( isset( $categories['hamista'] ) ) {
				$property->setValue( $manager, array( 'hamista' => $categories['hamista'] ) + $categories );
			}
		}
	}

	/**
	 * Register widgets.
	 *
	 * @param \Elementor\Widgets_Manager $manager Manager.
	 */
	public static function register_widgets( $manager ) {
		foreach ( self::widget_list() as $short ) {
			$class = __NAMESPACE__ . '\\Widgets\\' . $short;
			if ( class_exists( $class ) ) {
				$manager->register( new $class() );
			}
		}
	}

	/**
	 * Editor panel styles (widget icons).
	 */
	public static function editor_styles() {
		wp_enqueue_style( 'hamista-editor', HAMISTA_CORE_URL . 'assets/css/editor.css', array(), HAMISTA_CORE_VERSION );

		// Persian sites: the editor panel uses the same Persian font as the Hamista panel.
		if ( 0 === strpos( determine_locale(), 'fa' ) && class_exists( '\Hamista\Core\Admin\Admin' ) ) {
			$fonts = \Hamista\Core\Admin\Admin::font_css();
			if ( $fonts ) {
				$fonts = str_replace( '.hm-admin{--hm-a-font:', '#elementor-panel,#elementor-navigator,.dialog-widget-content,.e-route-panel-editor-content{font-family:', $fonts );
				wp_add_inline_style( 'hamista-editor', $fonts );
			}
		}
	}

	/**
	 * Load the engine and styles inside the editor preview so effects can be previewed.
	 */
	public static function preview_assets() {
		wp_enqueue_style( 'hamista-widgets' );
		wp_enqueue_script( 'hamista-motion' );
		wp_enqueue_script( 'hamista-scroll-fx' );
	}

	/**
	 * Keep Elementor's kit (container width, fonts) in step with Hamista settings.
	 *
	 * @param array $new   New values.
	 * @param array $old   Old values.
	 * @param array $clean Submitted values.
	 */
	public static function sync_kit( $new, $old, $clean ) {
		if ( ! array_key_exists( 'container_width', (array) $clean ) && ! empty( $clean ) ) {
			return;
		}
		self::update_kit_settings(
			array(
				'container_width' => array(
					'unit'  => 'px',
					'size'  => (int) $new['container_width'],
					'sizes' => array(),
				),
			)
		);
	}

	/**
	 * Merge settings into the active Elementor kit and clear generated CSS.
	 *
	 * @param array $settings Kit settings.
	 */
	public static function update_kit_settings( $settings ) {
		$kit_id = (int) get_option( 'elementor_active_kit' );
		if ( ! $kit_id ) {
			return;
		}
		$current = get_post_meta( $kit_id, '_elementor_page_settings', true );
		$current = is_array( $current ) ? $current : array();
		update_post_meta( $kit_id, '_elementor_page_settings', array_merge( $current, $settings ) );
		if ( class_exists( '\Elementor\Plugin' ) && isset( \Elementor\Plugin::$instance->files_manager ) ) {
			\Elementor\Plugin::$instance->files_manager->clear_cache();
		}
	}
}
