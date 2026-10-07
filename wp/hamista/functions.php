<?php
/**
 * Hamista theme bootstrap.
 *
 * The theme is the presentation layer only. Features (Elementor widgets, motion
 * engine, settings panel, OTP login, demo import) live in the Hamista Core plugin,
 * so the site keeps working, and keeps its content, if the theme is switched.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

define( 'HAMISTA_VERSION', '1.0.0' );
define( 'HAMISTA_DIR', get_template_directory() );
define( 'HAMISTA_URI', get_template_directory_uri() );

foreach ( array( 'options', 'icons', 'setup', 'fonts', 'assets', 'template-tags', 'page-options', 'elementor', 'woocommerce', 'woocommerce-fa', 'plugin-installer' ) as $hamista_file ) {
	require_once HAMISTA_DIR . '/inc/' . $hamista_file . '.php';
}
unset( $hamista_file );
