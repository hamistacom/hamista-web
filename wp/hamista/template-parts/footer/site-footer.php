<?php
/**
 * Built-in footer: about column, widget columns, bottom bar, wordmark.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

$hamista_columns = max( 0, min( 4, (int) hamista_option( 'footer_columns', 3 ) ) );
$hamista_about   = hamista_option( 'footer_about' );
$hamista_copy    = hamista_option( 'footer_copyright' );
if ( ! $hamista_copy ) {
	/* translators: 1: year, 2: site name */
	$hamista_copy = sprintf( __( '© %1$s %2$s. All rights reserved.', 'hamista' ), hamista_digits( wp_date( 'Y' ) ), get_bloginfo( 'name' ) );
}
?>
<footer class="hm-footer" id="colophon">
	<div class="hm-container">
		<div class="hm-footer__grid" style="--hm-footer-cols: <?php echo (int) $hamista_columns; ?>">
			<div class="hm-footer__about">
				<?php hamista_site_logo(); ?>
				<?php if ( $hamista_about ) : ?>
					<p><?php echo wp_kses_post( $hamista_about ); ?></p>
				<?php endif; ?>
				<?php hamista_social_links(); ?>
			</div>
			<?php for ( $hamista_i = 1; $hamista_i <= $hamista_columns; $hamista_i++ ) : ?>
				<div class="hm-footer__col">
					<?php if ( is_active_sidebar( 'footer-' . $hamista_i ) ) : ?>
						<?php dynamic_sidebar( 'footer-' . $hamista_i ); ?>
					<?php endif; ?>
				</div>
			<?php endfor; ?>
		</div>

		<div class="hm-footer__bottom">
			<p><?php echo wp_kses_post( str_replace( '{year}', hamista_digits( wp_date( 'Y' ) ), $hamista_copy ) ); ?></p>
			<?php
			if ( has_nav_menu( 'footer' ) ) {
				wp_nav_menu(
					array(
						'theme_location' => 'footer',
						'container'      => 'nav',
						'menu_class'     => 'hm-footer-menu',
						'depth'          => 1,
						'fallback_cb'    => false,
					)
				);
			}
			?>
		</div>
	</div>
	<?php if ( hamista_option( 'footer_wordmark' ) ) : ?>
		<span class="hm-footer__wordmark" aria-hidden="true"><?php echo esc_html( get_bloginfo( 'name' ) ); ?></span>
	<?php endif; ?>
</footer>
