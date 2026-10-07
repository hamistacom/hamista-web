<?php
/**
 * Header overlays shared by the built-in header and Elementor-built headers:
 * the mobile menu drawer, the search overlay and the reading progress bar.
 *
 * @package Hamista
 * @var array $args cta_text, cta_url, search (force the search overlay).
 */

defined( 'ABSPATH' ) || exit;

$hamista_args     = wp_parse_args(
	$args,
	array(
		'cta_text' => hamista_option( 'header_cta_text' ),
		'cta_url'  => hamista_option( 'header_cta_url' ),
		'search'   => false,
	)
);
$hamista_cta_text = $hamista_args['cta_text'];
$hamista_cta_url  = $hamista_args['cta_url'];
$hamista_has_woo  = class_exists( 'WooCommerce' ) && function_exists( 'wc_get_cart_url' );
?>
<div class="hm-drawer" id="hm-drawer" aria-hidden="true">
	<div class="hm-drawer__backdrop" data-hm-close></div>
	<div class="hm-drawer__panel" role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'Menu', 'hamista' ); ?>">
		<div class="hm-drawer__head">
			<?php hamista_site_logo(); ?>
			<button class="hm-icon-btn" type="button" data-hm-close aria-label="<?php esc_attr_e( 'Close menu', 'hamista' ); ?>"><?php hamista_icon( 'close' ); ?></button>
		</div>
		<div class="hm-drawer__body">
			<?php
			$hamista_drawer_location = has_nav_menu( 'mobile' ) ? 'mobile' : 'primary';
			if ( has_nav_menu( $hamista_drawer_location ) ) {
				wp_nav_menu(
					array(
						'theme_location' => $hamista_drawer_location,
						'container'      => 'nav',
						'menu_class'     => 'hm-drawer-menu',
						'depth'          => 3,
						'fallback_cb'    => false,
					)
				);
			}
			get_search_form();
			if ( $hamista_cta_text && $hamista_cta_url ) {
				printf( '<a class="hm-btn hm-btn--block" href="%s">%s</a>', esc_url( $hamista_cta_url ), esc_html( $hamista_cta_text ) );
			}
			if ( hamista_option( 'header_account' ) ) {
				printf( '<a class="hm-btn hm-btn--secondary hm-btn--block" href="%s">%s%s</a>', esc_url( apply_filters( 'hamista/account_url', $hamista_has_woo ? wc_get_page_permalink( 'myaccount' ) : wp_login_url() ) ), hamista_get_icon( 'user' ), is_user_logged_in() ? esc_html__( 'My account', 'hamista' ) : esc_html__( 'Log in / Sign up', 'hamista' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			hamista_social_links();
			?>
		</div>
	</div>
</div>

<?php if ( hamista_option( 'header_search' ) || $hamista_args['search'] ) : ?>
	<div class="hm-search-overlay" id="hm-search" aria-hidden="true">
		<div class="hm-search-overlay__backdrop" data-hm-close></div>
		<div class="hm-search-overlay__box" role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'Search', 'hamista' ); ?>">
			<?php get_search_form(); ?>
			<p class="hm-search-overlay__hint"><?php esc_html_e( 'Press Esc to close', 'hamista' ); ?></p>
		</div>
	</div>
<?php endif; ?>

<?php if ( is_singular( 'post' ) && hamista_option( 'single_progress' ) ) : ?>
	<div class="hm-progress" data-hm-progress aria-hidden="true"></div>
<?php endif; ?>
