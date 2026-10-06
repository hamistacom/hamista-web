<?php
/**
 * Search form.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

$hamista_id = wp_unique_id( 'hm-s-' );
?>
<form role="search" method="get" class="hm-search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="screen-reader-text" for="<?php echo esc_attr( $hamista_id ); ?>"><?php esc_html_e( 'Search for:', 'hamista' ); ?></label>
	<input type="search" id="<?php echo esc_attr( $hamista_id ); ?>" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" placeholder="<?php esc_attr_e( 'Search…', 'hamista' ); ?>" autocomplete="off">
	<button type="submit" aria-label="<?php esc_attr_e( 'Search', 'hamista' ); ?>"><?php hamista_icon( 'search' ); ?></button>
</form>
