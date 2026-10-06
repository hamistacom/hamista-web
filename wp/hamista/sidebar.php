<?php
/**
 * Sidebar (blog or shop).
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

$hamista_sidebar = ( function_exists( 'is_woocommerce' ) && is_woocommerce() ) ? 'sidebar-shop' : 'sidebar-blog';
if ( ! is_active_sidebar( $hamista_sidebar ) ) {
	return;
}
?>
<aside class="hm-sidebar" aria-label="<?php esc_attr_e( 'Sidebar', 'hamista' ); ?>">
	<?php dynamic_sidebar( $hamista_sidebar ); ?>
</aside>
