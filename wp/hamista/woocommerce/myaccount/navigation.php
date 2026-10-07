<?php
/**
 * My account navigation: the customer's name on top, then the account pages
 * with an icon each.
 *
 * Based on the WooCommerce template of the same name.
 *
 * @package Hamista
 * @version 9.3.0
 */

defined( 'ABSPATH' ) || exit;

$hamista_user   = wp_get_current_user();
$hamista_name   = trim( $hamista_user->first_name . ' ' . $hamista_user->last_name );
$hamista_name   = '' !== $hamista_name ? $hamista_name : $hamista_user->display_name;
$hamista_mobile = (string) get_user_meta( $hamista_user->ID, 'hamista_mobile', true );
$hamista_sub    = '' !== $hamista_mobile ? $hamista_mobile : $hamista_user->user_email;

do_action( 'woocommerce_before_account_navigation' );
?>

<nav class="woocommerce-MyAccount-navigation hm-account-nav" aria-label="<?php esc_attr_e( 'Account pages', 'hamista' ); ?>">
	<div class="hm-account-nav__user">
		<span class="hm-account-nav__avatar" aria-hidden="true"><?php echo esc_html( mb_substr( $hamista_name, 0, 1 ) ); ?></span>
		<div>
			<strong><?php echo esc_html( $hamista_name ); ?></strong>
			<?php if ( $hamista_sub ) : ?>
				<bdi dir="ltr"><?php echo esc_html( hamista_digits( $hamista_sub ) ); ?></bdi>
			<?php endif; ?>
		</div>
	</div>
	<ul>
		<?php foreach ( wc_get_account_menu_items() as $hamista_endpoint => $hamista_label ) : ?>
			<li class="<?php echo esc_attr( wc_get_account_menu_item_classes( $hamista_endpoint ) ); ?>">
				<a href="<?php echo esc_url( wc_get_account_endpoint_url( $hamista_endpoint ) ); ?>"<?php echo wc_is_current_account_menu_item( $hamista_endpoint ) ? ' aria-current="page"' : ''; ?>>
					<?php echo hamista_get_icon( hamista_account_icon( $hamista_endpoint ), array( 'size' => 18 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG. ?>
					<span><?php echo esc_html( $hamista_label ); ?></span>
				</a>
			</li>
		<?php endforeach; ?>
	</ul>
</nav>

<?php do_action( 'woocommerce_after_account_navigation' ); ?>
