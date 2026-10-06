<?php
/**
 * Site footer.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

if ( 'hidden' !== hamista_page_option( '_hm_footer' ) && ! hamista_elementor_location( 'footer' ) ) {
	/**
	 * Return true after printing a custom footer to replace the built-in one.
	 *
	 * @param bool $rendered Whether a footer was already rendered.
	 */
	if ( ! apply_filters( 'hamista/footer/render', false ) ) {
		get_template_part( 'template-parts/footer/site-footer' );
	}
}
?>
</div><!-- .hm-site -->

<?php if ( hamista_option( 'back_to_top' ) ) : ?>
	<a class="hm-to-top" href="#masthead" data-hm-to-top aria-label="<?php esc_attr_e( 'Back to top', 'hamista' ); ?>">
		<svg class="hm-to-top__ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="23"/></svg>
		<?php hamista_icon( 'arrow-up' ); ?>
	</a>
<?php endif; ?>

<?php
if ( hamista_option( 'mobile_bar' ) ) {
	get_template_part( 'template-parts/footer/mobile-bar' );
}
?>

<?php wp_footer(); ?>
</body>
</html>
