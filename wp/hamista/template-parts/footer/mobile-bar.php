<?php
/**
 * Mobile action bar: the primary action and quick contact links, fixed within
 * thumb reach on phones (hidden from 768px up).
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

$hamista_text     = hamista_option( 'mobile_bar_text' );
$hamista_url      = hamista_option( 'mobile_bar_url' );
$hamista_phone    = preg_replace( '/[^0-9+]/', '', hamista_latin_digits( (string) hamista_option( 'mobile_bar_phone' ) ) );
$hamista_whatsapp = preg_replace( '/[^0-9]/', '', hamista_latin_digits( (string) hamista_option( 'mobile_bar_whatsapp' ) ) );

if ( ! $hamista_text && ! $hamista_phone && ! $hamista_whatsapp ) {
	return;
}
// wa.me expects the international format without + or leading zero.
if ( $hamista_whatsapp && '0' === $hamista_whatsapp[0] ) {
	$hamista_whatsapp = '98' . substr( $hamista_whatsapp, 1 );
}
?>
<nav class="hm-mobile-bar" aria-label="<?php esc_attr_e( 'Quick actions', 'hamista' ); ?>">
	<?php if ( $hamista_phone ) : ?>
		<a class="hm-mobile-bar__icon" href="<?php echo esc_url( 'tel:' . $hamista_phone ); ?>" aria-label="<?php esc_attr_e( 'Call us', 'hamista' ); ?>"><?php hamista_icon( 'phone' ); ?></a>
	<?php endif; ?>
	<?php if ( $hamista_whatsapp ) : ?>
		<a class="hm-mobile-bar__icon" href="<?php echo esc_url( 'https://wa.me/' . $hamista_whatsapp ); ?>" target="_blank" rel="noopener" aria-label="<?php esc_attr_e( 'Chat on WhatsApp', 'hamista' ); ?>"><?php hamista_icon( 'whatsapp' ); ?></a>
	<?php endif; ?>
	<?php if ( $hamista_text ) : ?>
		<a class="hm-btn hm-mobile-bar__cta" href="<?php echo esc_url( $hamista_url ? $hamista_url : '#' ); ?>"><span><?php echo esc_html( $hamista_text ); ?></span><?php hamista_icon( 'arrow', array( 'class' => 'hm-i-arrow' ) ); ?></a>
	<?php endif; ?>
</nav>
