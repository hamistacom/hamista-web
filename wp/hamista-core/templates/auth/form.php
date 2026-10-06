<?php
/**
 * Mobile login form.
 *
 * Override in a theme at hamista-core/auth/form.php. Keep the data-hm-* hooks
 * and the field names: assets/js/auth.js relies on them.
 *
 * @package Hamista\Core
 * @var array $args {
 *     @type string $id            Element id.
 *     @type string $classes       Root classes.
 *     @type string $context       page | modal | woocommerce | wp-login.
 *     @type string $title         Heading.
 *     @type string $subtitle      Sub-heading.
 *     @type string $redirect      Redirect URL or ''.
 *     @type bool   $show_password Password tab.
 *     @type int    $length        Code length.
 *     @type bool   $test_mode     Test gateway active.
 *     @type string $lost_url      Lost password URL.
 * }
 */

defined( 'ABSPATH' ) || exit;

$hamista_id     = $args['id'];
$hamista_length = (int) $args['length'];
$hamista_tabs   = ! empty( $args['show_password'] );
$hamista_hp     = \Hamista\Core\Auth\Rest::HONEYPOT;
$hamista_icon   = static function ( $name ) {
	echo hamista_core_icon( $name ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static SVG.
};
$hamista_honeypot = static function () use ( $hamista_hp ) {
	printf(
		'<div class="hm-auth__hp" aria-hidden="true"><label>%1$s <input type="text" name="%2$s" value="" tabindex="-1" autocomplete="off"></label></div>',
		esc_html__( 'Leave this field empty', 'hamista-core' ),
		esc_attr( $hamista_hp )
	);
};
?>
<div id="<?php echo esc_attr( $hamista_id ); ?>" class="<?php echo esc_attr( $args['classes'] ); ?>" data-hm-auth data-step="mobile" data-context="<?php echo esc_attr( $args['context'] ); ?>" data-length="<?php echo esc_attr( $hamista_length ); ?>" data-redirect="<?php echo esc_url( $args['redirect'] ); ?>">

	<div class="hm-auth__head">
		<span class="hm-auth__mark" aria-hidden="true"><?php $hamista_icon( 'mobile' ); ?></span>
		<h2 class="hm-auth__title" id="<?php echo esc_attr( $hamista_id ); ?>-title"><?php echo esc_html( $args['title'] ); ?></h2>
		<?php if ( '' !== (string) $args['subtitle'] ) : ?>
			<p class="hm-auth__subtitle"><?php echo esc_html( $args['subtitle'] ); ?></p>
		<?php endif; ?>
	</div>

	<?php if ( $hamista_tabs ) : ?>
		<div class="hm-auth__tabs" role="tablist" aria-label="<?php esc_attr_e( 'Sign-in method', 'hamista-core' ); ?>">
			<button type="button" class="hm-auth__tab is-active" role="tab" id="<?php echo esc_attr( $hamista_id ); ?>-tab-otp" aria-controls="<?php echo esc_attr( $hamista_id ); ?>-otp" aria-selected="true" data-hm-tab="otp"><?php $hamista_icon( 'mobile' ); ?><span><?php esc_html_e( 'One-time code', 'hamista-core' ); ?></span></button>
			<button type="button" class="hm-auth__tab" role="tab" id="<?php echo esc_attr( $hamista_id ); ?>-tab-password" aria-controls="<?php echo esc_attr( $hamista_id ); ?>-password" aria-selected="false" tabindex="-1" data-hm-tab="password"><?php $hamista_icon( 'lock' ); ?><span><?php esc_html_e( 'Password', 'hamista-core' ); ?></span></button>
		</div>
	<?php endif; ?>

	<div class="hm-auth__panel" id="<?php echo esc_attr( $hamista_id ); ?>-otp" data-hm-panel="otp"<?php echo $hamista_tabs ? ' role="tabpanel" aria-labelledby="' . esc_attr( $hamista_id ) . '-tab-otp"' : ''; ?>>

		<form class="hm-auth__step is-active" data-hm-step="mobile" novalidate>
			<label class="hm-auth__label" for="<?php echo esc_attr( $hamista_id ); ?>-mobile"><?php esc_html_e( 'Mobile number', 'hamista-core' ); ?></label>
			<div class="hm-auth__field">
				<span class="hm-auth__field-icon" aria-hidden="true"><?php $hamista_icon( 'phone' ); ?></span>
				<input class="hm-auth__input hm-auth__input--tel" id="<?php echo esc_attr( $hamista_id ); ?>-mobile" name="mobile" type="tel" inputmode="numeric" autocomplete="tel" dir="ltr" maxlength="24" placeholder="<?php esc_attr_e( '0912 345 6789', 'hamista-core' ); ?>" required aria-describedby="<?php echo esc_attr( $hamista_id ); ?>-mobile-error">
			</div>
			<?php $hamista_honeypot(); ?>
			<p class="hm-auth__msg" id="<?php echo esc_attr( $hamista_id ); ?>-mobile-error" role="alert" data-hm-msg></p>
			<button type="submit" class="hm-btn hm-btn--block hm-auth__submit"><span><?php esc_html_e( 'Send code', 'hamista-core' ); ?></span><?php $hamista_icon( 'arrow' ); ?></button>
		</form>

		<form class="hm-auth__step" data-hm-step="code" hidden novalidate>
			<p class="hm-auth__sent"><?php esc_html_e( 'Enter the code we sent to', 'hamista-core' ); ?></p>
			<p class="hm-auth__row hm-auth__row--number">
				<bdi class="hm-auth__number" dir="ltr" data-hm-number></bdi>
				<button type="button" class="hm-auth__link" data-hm-edit><?php $hamista_icon( 'pen' ); ?><?php esc_html_e( 'Edit number', 'hamista-core' ); ?></button>
			</p>
			<div class="hm-auth__code" dir="ltr" role="group" aria-label="<?php esc_attr_e( 'Verification code', 'hamista-core' ); ?>" data-hm-code>
				<?php for ( $hamista_i = 1; $hamista_i <= $hamista_length; $hamista_i++ ) : ?>
					<input class="hm-auth__digit" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="<?php echo 1 === $hamista_i ? 'one-time-code' : 'off'; ?>" aria-label="<?php /* translators: 1: digit position, 2: total digits */ echo esc_attr( sprintf( __( 'Digit %1$s of %2$s', 'hamista-core' ), number_format_i18n( $hamista_i ), number_format_i18n( $hamista_length ) ) ); ?>">
				<?php endfor; ?>
			</div>
			<p class="hm-auth__row hm-auth__row--resend">
				<span class="hm-auth__timer" data-hm-timer></span>
				<button type="button" class="hm-auth__link" data-hm-resend hidden><?php $hamista_icon( 'refresh' ); ?><?php esc_html_e( 'Resend code', 'hamista-core' ); ?></button>
			</p>
			<p class="hm-auth__msg" role="alert" data-hm-msg></p>
			<button type="submit" class="hm-btn hm-btn--block hm-auth__submit"><span><?php esc_html_e( 'Verify and continue', 'hamista-core' ); ?></span></button>
		</form>

		<form class="hm-auth__step" data-hm-step="name" hidden novalidate>
			<p class="hm-auth__lead"><?php esc_html_e( 'Your number is verified. What should we call you?', 'hamista-core' ); ?></p>
			<label class="hm-auth__label" for="<?php echo esc_attr( $hamista_id ); ?>-name"><?php esc_html_e( 'Full name', 'hamista-core' ); ?></label>
			<input class="hm-auth__input" id="<?php echo esc_attr( $hamista_id ); ?>-name" name="name" type="text" autocomplete="name" maxlength="80" required>
			<p class="hm-auth__msg" role="alert" data-hm-msg></p>
			<button type="submit" class="hm-btn hm-btn--block hm-auth__submit"><span><?php esc_html_e( 'Create my account', 'hamista-core' ); ?></span><?php $hamista_icon( 'arrow' ); ?></button>
		</form>
	</div>

	<?php if ( $hamista_tabs ) : ?>
		<div class="hm-auth__panel" id="<?php echo esc_attr( $hamista_id ); ?>-password" data-hm-panel="password" role="tabpanel" aria-labelledby="<?php echo esc_attr( $hamista_id ); ?>-tab-password" hidden>
			<form class="hm-auth__step is-active" data-hm-form="password" novalidate>
				<label class="hm-auth__label" for="<?php echo esc_attr( $hamista_id ); ?>-login"><?php esc_html_e( 'Mobile, email or username', 'hamista-core' ); ?></label>
				<input class="hm-auth__input" id="<?php echo esc_attr( $hamista_id ); ?>-login" name="login" type="text" autocomplete="username" autocapitalize="off" spellcheck="false" dir="auto" required>
				<label class="hm-auth__label" for="<?php echo esc_attr( $hamista_id ); ?>-pass"><?php esc_html_e( 'Password', 'hamista-core' ); ?></label>
				<div class="hm-auth__field hm-auth__field--password">
					<input class="hm-auth__input" id="<?php echo esc_attr( $hamista_id ); ?>-pass" name="password" type="password" autocomplete="current-password" dir="ltr" required>
					<button type="button" class="hm-auth__reveal" data-hm-reveal aria-pressed="false" aria-label="<?php esc_attr_e( 'Show password', 'hamista-core' ); ?>">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/><path class="hm-auth__reveal-slash" d="M4 4l16 16"/></svg>
					</button>
				</div>
				<?php $hamista_honeypot(); ?>
				<p class="hm-auth__msg" role="alert" data-hm-msg></p>
				<button type="submit" class="hm-btn hm-btn--block hm-auth__submit"><span><?php esc_html_e( 'Log in', 'hamista-core' ); ?></span><?php $hamista_icon( 'arrow' ); ?></button>
				<p class="hm-auth__row"><a class="hm-auth__link" href="<?php echo esc_url( $args['lost_url'] ); ?>"><?php esc_html_e( 'Forgot your password?', 'hamista-core' ); ?></a></p>
			</form>
		</div>
	<?php endif; ?>

	<div class="hm-auth__done" data-hm-step="done" hidden>
		<span class="hm-auth__check" aria-hidden="true"><?php $hamista_icon( 'check' ); ?></span>
		<p class="hm-auth__done-title" data-hm-done-title><?php esc_html_e( 'You’re signed in', 'hamista-core' ); ?></p>
		<p class="hm-auth__done-text"><?php esc_html_e( 'Taking you there…', 'hamista-core' ); ?></p>
	</div>

	<?php if ( ! empty( $args['test_mode'] ) ) : ?>
		<p class="hm-auth__test">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/></svg>
			<span><?php esc_html_e( 'Test mode: codes are not sent by SMS; an administrator can see them in Hamista → Login & SMS.', 'hamista-core' ); ?></span>
		</p>
	<?php endif; ?>

	<noscript><p class="hm-auth__msg"><?php esc_html_e( 'Please turn on JavaScript to sign in with your mobile number.', 'hamista-core' ); ?></p></noscript>
</div>
