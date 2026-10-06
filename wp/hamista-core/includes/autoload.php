<?php
/**
 * Class autoloader.
 *
 * Hamista\Core\Settings\Settings      → includes/settings/class-settings.php
 * Hamista\Core\Elementor\Widgets\Hero → includes/elementor/widgets/class-hero.php
 *
 * @package Hamista\Core
 */

defined( 'ABSPATH' ) || exit;

spl_autoload_register(
	static function ( $class ) {
		$prefix = 'Hamista\\Core\\';
		if ( 0 !== strpos( $class, $prefix ) ) {
			return;
		}
		$parts = explode( '\\', substr( $class, strlen( $prefix ) ) );
		$name  = array_pop( $parts );
		$dir   = $parts ? strtolower( str_replace( '_', '-', implode( '/', $parts ) ) ) . '/' : '';
		$file  = HAMISTA_CORE_DIR . 'includes/' . $dir . 'class-' . strtolower( str_replace( '_', '-', $name ) ) . '.php';
		if ( is_readable( $file ) ) {
			require_once $file;
		}
	}
);
