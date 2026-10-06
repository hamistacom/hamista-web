<?php
/**
 * Plugin Name:       Hamista Core
 * Plugin URI:        https://hamista.com
 * Description:       Elementor widgets, a dependency-free motion engine, the Hamista settings panel, header/footer builder, mobile OTP login and one-click demo import for the Hamista theme.
 * Version:           1.0.0
 * Requires at least: 6.4
 * Requires PHP:      7.4
 * Author:            Hamista
 * Author URI:        https://hamista.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       hamista-core
 * Domain Path:       /languages
 * Elementor tested up to: 4.0
 * WC requires at least: 8.0
 * WC tested up to:   11.1
 *
 * @package Hamista\Core
 */

defined( 'ABSPATH' ) || exit;

define( 'HAMISTA_CORE_VERSION', '1.0.0' );
define( 'HAMISTA_CORE_FILE', __FILE__ );
define( 'HAMISTA_CORE_DIR', plugin_dir_path( __FILE__ ) );
define( 'HAMISTA_CORE_URL', plugin_dir_url( __FILE__ ) );

require_once HAMISTA_CORE_DIR . 'includes/autoload.php';
require_once HAMISTA_CORE_DIR . 'includes/helpers.php';

add_action( 'plugins_loaded', array( 'Hamista\\Core\\Plugin', 'instance' ), 5 );

register_activation_hook( __FILE__, array( 'Hamista\\Core\\Plugin', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'Hamista\\Core\\Plugin', 'deactivate' ) );

// WooCommerce: High-Performance Order Storage and cart/checkout blocks compatible.
add_action(
	'before_woocommerce_init',
	static function () {
		if ( class_exists( '\Automattic\WooCommerce\Utilities\FeaturesUtil' ) ) {
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'cart_checkout_blocks', __FILE__, true );
		}
	}
);
