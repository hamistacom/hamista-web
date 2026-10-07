<?php
/**
 * OTP smoke test: runs the REST handlers in-process in test mode.
 *   wp eval-file tools/test/otp-smoke.php
 * Creates one throw-away user and removes it afterwards.
 */
use Hamista\Core\Auth\Gateways\Test;

$check = static function ( $label, $ok, $detail = '' ) {
	WP_CLI::line( ( $ok ? '  ok   ' : '  FAIL ' ) . $label . ( $detail ? "  ($detail)" : '' ) );
	if ( ! $ok ) {
		$GLOBALS['hm_fail'] = true;
	}
};
$call = static function ( $method, $route, $params = array() ) {
	$request = new WP_REST_Request( $method, '/hamista/v1' . $route );
	foreach ( $params as $k => $v ) {
		$request->set_param( $k, $v );
	}
	$response = rest_do_request( $request );
	return array( $response->get_status(), (array) $response->get_data() );
};

add_filter( 'hamista_core/otp_enabled', '__return_true' );
rest_get_server();
$mobile = '09123456789';
// Start clean: drop code, rate-limit and cooldown records left by earlier runs.
global $wpdb;
$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '\_transient\_hm\_otp\_%' OR option_name LIKE '\_transient\_timeout\_hm\_otp\_%'" ); // phpcs:ignore

list( $s, $d ) = $call( 'GET', '/auth/nonce' );
$nonce = isset( $d['nonce'] ) ? $d['nonce'] : '';
$check( 'nonce issued', 200 === $s && '' !== $nonce );

list( $s ) = $call( 'POST', '/auth/send', array( 'mobile' => $mobile, 'nonce' => 'bad' ) );
$check( 'bad nonce rejected', 403 === $s, $s );

list( $s, $d ) = $call( 'POST', '/auth/send', array( 'mobile' => '0912', 'nonce' => $nonce ) );
$check( 'invalid mobile rejected', $s >= 400, $s );

list( $s, $d ) = $call( 'POST', '/auth/send', array( 'mobile' => '۰۹۱۲۳۴۵۶۷۸۹', 'nonce' => $nonce ) );
$check( 'Persian-digit mobile accepted', 200 === $s, $s . ' ' . ( isset( $d['message'] ) ? $d['message'] : '' ) );

list( $s ) = $call( 'POST', '/auth/send', array( 'mobile' => $mobile, 'nonce' => $nonce ) );
$check( 'cooldown blocks immediate resend', $s >= 400, $s );

$last = Test::last();
$check( 'code stored for admin only', $last && ! empty( $last['code'] ) );

list( $s ) = $call( 'POST', '/auth/verify', array( 'mobile' => $mobile, 'code' => '000000', 'nonce' => $nonce ) );
$check( 'wrong code rejected', $s >= 400, $s );

list( $s, $d ) = $call( 'POST', '/auth/verify', array( 'mobile' => $mobile, 'code' => $last['code'], 'nonce' => $nonce ) );
$check( 'new user is asked for a name first', 200 === $s && ! empty( $d['need_name'] ), wp_json_encode( $d, JSON_UNESCAPED_UNICODE ) );

list( $s, $d ) = $call( 'POST', '/auth/verify', array( 'mobile' => $mobile, 'code' => $last['code'], 'name' => 'کاربر آزمایشی', 'nonce' => $nonce ) );
$check( 'code + name registers and logs in', 200 === $s && ! empty( $d['ok'] ), wp_json_encode( $d, JSON_UNESCAPED_UNICODE ) );

list( $s ) = $call( 'POST', '/auth/verify', array( 'mobile' => $mobile, 'code' => $last['code'], 'nonce' => $nonce ) );
$check( 'code cannot be reused', $s >= 400, $s );

$user = get_user_by( 'login', $mobile );
if ( ! $user ) {
	$users = get_users( array( 'meta_key' => 'hamista_mobile', 'meta_value' => $mobile, 'number' => 1 ) );
	$user  = $users ? $users[0] : null;
}
$check( 'user created', (bool) $user, $user ? $user->user_login : '' );
if ( $user ) {
	require_once ABSPATH . 'wp-admin/includes/user.php';
	wp_delete_user( $user->ID );
}

$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '\_transient\_hm\_otp\_%' OR option_name LIKE '\_transient\_timeout\_hm\_otp\_%'" ); // phpcs:ignore
WP_CLI::line( empty( $GLOBALS['hm_fail'] ) ? 'OTP smoke: all passed' : 'OTP smoke: FAILURES' );
