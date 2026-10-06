<?php
/**
 * Account panel for logged-in visitors ([hamista_account] / [hamista_login]).
 *
 * Override in a theme at hamista-core/auth/account.php.
 *
 * @package Hamista\Core
 * @var array $args {
 *     @type string   $id          Element id.
 *     @type \WP_User $user        Current user.
 *     @type string   $mobile      Verified mobile ('' if none).
 *     @type bool     $woocommerce WooCommerce My Account available.
 *     @type string   $account_url My Account URL (WooCommerce).
 *     @type string   $logout_url  Log-out URL.
 *     @type bool     $standalone  Rendered outside the Hamista theme.
 * }
 */

defined( 'ABSPATH' ) || exit;

$hamista_user = $args['user'];
$hamista_id   = $args['id'];
$hamista_name = '' !== trim( (string) $hamista_user->first_name ) ? $hamista_user->first_name : $hamista_user->display_name;
$hamista_logo = hamista_core_icon( 'logout' );
if ( '' === $hamista_logo ) {
	$hamista_logo = hamista_core_icon( 'arrow-out' );
}
?>
<div id="<?php echo esc_attr( $hamista_id ); ?>" class="hm-auth hm-auth--account hm-bolted<?php echo $args['standalone'] ? ' hm-auth--standalone' : ''; ?>" data-hm-account-panel>
	<div class="hm-auth__profile">
		<?php echo get_avatar( $hamista_user->ID, 128, '', '', array( 'class' => 'hm-auth__avatar' ) ); ?>
		<div class="hm-auth__profile-text">
			<p class="hm-auth__hello">
				<?php
				/* translators: %s: first or display name */
				printf( esc_html__( 'Hello, %s', 'hamista-core' ), '<strong>' . esc_html( $hamista_name ) . '</strong>' );
				?>
			</p>
			<?php if ( $args['mobile'] ) : ?>
				<p class="hm-auth__meta-line">
					<bdi dir="ltr" class="hm-auth__number"><?php echo esc_html( $args['mobile'] ); ?></bdi>
					<span class="hm-auth-verified__badge"><?php echo hamista_core_icon( 'check' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static SVG. ?><?php esc_html_e( 'Verified', 'hamista-core' ); ?></span>
				</p>
			<?php endif; ?>
		</div>
	</div>

	<?php if ( $args['woocommerce'] ) : ?>
		<div class="hm-auth__actions hm-auth__actions--stack">
			<a class="hm-btn hm-btn--block" href="<?php echo esc_url( $args['account_url'] ); ?>"><?php esc_html_e( 'Go to my account', 'hamista-core' ); ?><?php echo hamista_core_icon( 'arrow' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static SVG. ?></a>
			<a class="hm-btn hm-btn--ghost hm-btn--block" href="<?php echo esc_url( $args['logout_url'] ); ?>"><?php echo $hamista_logo; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static SVG. ?><?php esc_html_e( 'Log out', 'hamista-core' ); ?></a>
		</div>
	<?php else : ?>
		<form class="hm-auth__form" data-hm-profile novalidate>
			<div class="hm-auth__grid">
				<div>
					<label class="hm-auth__label" for="<?php echo esc_attr( $hamista_id ); ?>-first"><?php esc_html_e( 'First name', 'hamista-core' ); ?></label>
					<input class="hm-auth__input" id="<?php echo esc_attr( $hamista_id ); ?>-first" name="first_name" type="text" autocomplete="given-name" maxlength="80" value="<?php echo esc_attr( $hamista_user->first_name ); ?>">
				</div>
				<div>
					<label class="hm-auth__label" for="<?php echo esc_attr( $hamista_id ); ?>-last"><?php esc_html_e( 'Last name', 'hamista-core' ); ?></label>
					<input class="hm-auth__input" id="<?php echo esc_attr( $hamista_id ); ?>-last" name="last_name" type="text" autocomplete="family-name" maxlength="80" value="<?php echo esc_attr( $hamista_user->last_name ); ?>">
				</div>
			</div>
			<?php if ( $args['mobile'] ) : ?>
				<label class="hm-auth__label" for="<?php echo esc_attr( $hamista_id ); ?>-mobile"><?php esc_html_e( 'Mobile number', 'hamista-core' ); ?></label>
				<input class="hm-auth__input hm-auth__input--tel" id="<?php echo esc_attr( $hamista_id ); ?>-mobile" type="tel" value="<?php echo esc_attr( $args['mobile'] ); ?>" dir="ltr" readonly aria-describedby="<?php echo esc_attr( $hamista_id ); ?>-mobile-note">
				<p class="hm-auth__hint" id="<?php echo esc_attr( $hamista_id ); ?>-mobile-note"><?php esc_html_e( 'You sign in with this number. Contact us to change it.', 'hamista-core' ); ?></p>
			<?php endif; ?>
			<label class="hm-auth__label" for="<?php echo esc_attr( $hamista_id ); ?>-email"><?php esc_html_e( 'Email (optional)', 'hamista-core' ); ?></label>
			<input class="hm-auth__input" id="<?php echo esc_attr( $hamista_id ); ?>-email" name="email" type="email" autocomplete="email" dir="ltr" value="<?php echo esc_attr( $hamista_user->user_email ); ?>">
			<p class="hm-auth__msg" role="alert" data-hm-msg></p>
			<div class="hm-auth__actions">
				<button type="submit" class="hm-btn hm-auth__submit"><span><?php esc_html_e( 'Save changes', 'hamista-core' ); ?></span></button>
				<a class="hm-btn hm-btn--ghost" href="<?php echo esc_url( $args['logout_url'] ); ?>"><?php echo $hamista_logo; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static SVG. ?><?php esc_html_e( 'Log out', 'hamista-core' ); ?></a>
			</div>
		</form>
	<?php endif; ?>
</div>
