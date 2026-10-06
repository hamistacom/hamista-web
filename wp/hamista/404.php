<?php
/**
 * 404.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main id="main" class="hm-main">
	<section class="hm-404 hm-container">
		<span class="hm-404__code" aria-hidden="true"><?php echo esc_html( hamista_digits( '404' ) ); ?></span>
		<h1><?php esc_html_e( 'This page wandered off', 'hamista' ); ?></h1>
		<p><?php esc_html_e( 'The address may be mistyped, or the page has moved. Try a search or head back home.', 'hamista' ); ?></p>
		<?php get_search_form(); ?>
		<a class="hm-btn" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Back to home', 'hamista' ); ?><?php hamista_icon( 'arrow' ); ?></a>
	</section>
</main>
<?php
get_footer();
