<?php
/**
 * Built-in header: brand, primary menu, actions, mobile drawer, search overlay.
 *
 * @package Hamista
 * @var array $args Header state from hamista_header_state().
 */

defined( 'ABSPATH' ) || exit;

$hamista_state   = wp_parse_args(
	$args,
	array(
		'transparent' => false,
		'light'       => false,
	)
);
$hamista_classes = array( 'hm-header', 'hm-header--' . sanitize_html_class( hamista_option( 'header_layout', 'split' ) ) );
if ( hamista_option( 'header_sticky' ) ) {
	$hamista_classes[] = 'is-sticky';
}
if ( $hamista_state['transparent'] ) {
	$hamista_classes[] = 'is-transparent';
}
if ( $hamista_state['light'] ) {
	$hamista_classes[] = 'is-light';
}
if ( hamista_option( 'header_glass' ) ) {
	$hamista_classes[] = 'is-glass';
}

$hamista_cta_text = hamista_option( 'header_cta_text' );
$hamista_cta_url  = hamista_option( 'header_cta_url' );
$hamista_has_woo  = class_exists( 'WooCommerce' ) && function_exists( 'wc_get_cart_url' );
?>
<header id="masthead" class="<?php echo esc_attr( implode( ' ', $hamista_classes ) ); ?>" data-hide-on-scroll="<?php echo hamista_option( 'header_hide_on_scroll' ) ? '1' : '0'; ?>">
	<div class="hm-container hm-header__in">
		<div class="hm-header__brand"><?php hamista_site_logo(); ?></div>

		<?php if ( has_nav_menu( 'primary' ) ) : ?>
			<nav class="hm-nav" aria-label="<?php esc_attr_e( 'Primary', 'hamista' ); ?>">
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'primary',
						'container'      => false,
						'menu_class'     => 'hm-menu',
						'depth'          => 3,
						'fallback_cb'    => false,
					)
				);
				?>
			</nav>
		<?php endif; ?>

		<div class="hm-header__actions">
			<?php if ( hamista_option( 'header_search' ) ) : ?>
				<button class="hm-icon-btn hm-hide-sm" type="button" data-hm-open="search" aria-label="<?php esc_attr_e( 'Search', 'hamista' ); ?>" aria-controls="hm-search" aria-expanded="false"><?php hamista_icon( 'search' ); ?></button>
			<?php endif; ?>

			<?php if ( hamista_option( 'sound_enabled' ) ) : ?>
				<button class="hm-icon-btn hm-sound-toggle" type="button" data-hm-sound-toggle aria-label="<?php esc_attr_e( 'Interface sounds', 'hamista' ); ?>" aria-pressed="false"><?php hamista_icon( 'mute' ); ?><?php hamista_icon( 'sound' ); ?></button>
			<?php endif; ?>
			<?php if ( hamista_option( 'dark_toggle' ) ) : ?>
				<button class="hm-icon-btn hm-theme-toggle" type="button" data-hm-theme-toggle aria-label="<?php esc_attr_e( 'Toggle dark mode', 'hamista' ); ?>" aria-pressed="false"><?php hamista_icon( 'sun' ); ?><?php hamista_icon( 'moon' ); ?></button>
			<?php endif; ?>

			<?php
			if ( hamista_option( 'header_account' ) ) {
				$hamista_account_url = apply_filters( 'hamista/account_url', $hamista_has_woo ? wc_get_page_permalink( 'myaccount' ) : wp_login_url() );
				printf(
					'<a class="hm-icon-btn hm-hide-sm" href="%1$s" data-hm-account aria-label="%2$s">%3$s</a>',
					esc_url( $hamista_account_url ),
					is_user_logged_in() ? esc_attr__( 'My account', 'hamista' ) : esc_attr__( 'Log in', 'hamista' ),
					hamista_get_icon( 'user' ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				);
			}

			if ( $hamista_has_woo && hamista_option( 'header_cart' ) ) {
				$hamista_count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
				printf(
					'<a class="hm-icon-btn hm-header-cart" href="%1$s" aria-label="%2$s">%3$s<span class="hm-icon-btn__badge hm-num" data-count="%4$d">%5$s</span></a>',
					esc_url( wc_get_cart_url() ),
					esc_attr__( 'Cart', 'hamista' ),
					hamista_get_icon( 'bag' ), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					(int) $hamista_count,
					esc_html( number_format_i18n( $hamista_count ) )
				);
			}
			?>

			<?php if ( $hamista_cta_text && $hamista_cta_url ) : ?>
				<a class="hm-btn hm-btn--sm hm-header__cta" href="<?php echo esc_url( $hamista_cta_url ); ?>"><?php echo esc_html( $hamista_cta_text ); ?><?php hamista_icon( 'arrow' ); ?></a>
			<?php endif; ?>

			<button class="hm-icon-btn hm-menu-toggle" type="button" data-hm-open="drawer" aria-label="<?php esc_attr_e( 'Open menu', 'hamista' ); ?>" aria-controls="hm-drawer" aria-expanded="false"><?php hamista_icon( 'menu' ); ?></button>
		</div>
	</div>
</header>

<?php
get_template_part(
	'template-parts/header/overlays',
	null,
	array(
		'cta_text' => $hamista_cta_text,
		'cta_url'  => $hamista_cta_url,
	)
);
