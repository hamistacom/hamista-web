<?php
/**
 * Empty state.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;
?>
<div class="hm-empty">
	<h2 class="h3"><?php esc_html_e( 'Nothing here yet', 'hamista' ); ?></h2>
	<p>
		<?php
		if ( is_search() ) {
			esc_html_e( 'No results matched your search. Try different keywords.', 'hamista' );
		} else {
			esc_html_e( 'There is no content to show here yet.', 'hamista' );
		}
		?>
	</p>
	<div style="width:min(100%,460px);margin:24px auto 0"><?php get_search_form(); ?></div>
</div>
