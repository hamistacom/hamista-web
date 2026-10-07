<?php
/**
 * Classic checkout "Returning customer?" login (replaces checkout/form-login.php).
 *
 * Override in a theme at hamista-core/auth/woocommerce-checkout-login.php.
 *
 * @package Hamista\Core
 */

defined( 'ABSPATH' ) || exit;

if ( is_user_logged_in() || 'no' === get_option( 'woocommerce_enable_checkout_login_reminder' ) ) {
	return;
}

$hamista_target = wp_unique_id( 'hm-checkout-login-' );
?>
<div class="woocommerce-form-login-toggle">
	<?php
	wc_print_notice(
		apply_filters( 'woocommerce_checkout_login_message', esc_html__( 'Returning customer?', 'hamista-core' ) ) // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- WooCommerce hook.
		. ' <a href="#' . esc_attr( $hamista_target ) . '" class="hm-auth-showlogin" data-hm-auth-toggle="' . esc_attr( $hamista_target ) . '" aria-expanded="false">' . esc_html__( 'Log in with your mobile number', 'hamista-core' ) . '</a>',
		'notice'
	);
	?>
</div>
<div class="hm-auth-collapse" id="<?php echo esc_attr( $hamista_target ); ?>" hidden>
	<?php
	// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped inside the form template.
	echo \Hamista\Core\Auth\Account::render_form(
		array(
			'context'  => 'woocommerce',
			'title'    => __( 'Welcome back', 'hamista-core' ),
			'subtitle' => __( 'Log in to use your saved details. New here? Just continue to billing below.', 'hamista-core' ),
			'redirect' => wc_get_checkout_url(),
		)
	);
	// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
	?>
</div>
