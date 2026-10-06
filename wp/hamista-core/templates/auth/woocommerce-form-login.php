<?php
/**
 * WooCommerce My Account login (replaces myaccount/form-login.php).
 *
 * Override in a theme at hamista-core/auth/woocommerce-form-login.php.
 *
 * @package Hamista\Core
 */

defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_customer_login_form' ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- WooCommerce hook.

echo \Hamista\Core\Auth\Account::render_form( array( 'context' => 'woocommerce' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped in the form template.

do_action( 'woocommerce_after_customer_login_form' ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- WooCommerce hook.
