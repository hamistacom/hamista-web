<?php
/**
 * Test mode — sends nothing. The latest code is stored for administrators
 * (Hamista → Login & SMS) and is never shown to visitors.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth\Gateways;

use Hamista\Core\Auth\OTP;

defined( 'ABSPATH' ) || exit;

/**
 * Test.
 */
class Test extends Gateway {

	const OPTION = 'hamista_otp_last_test';

	/**
	 * Label.
	 *
	 * @return string
	 */
	public function label() {
		return __( 'Test mode', 'hamista-core' );
	}

	/**
	 * "Send": store the code for administrators.
	 *
	 * @param string $mobile Mobile.
	 * @param string $code   Code.
	 * @return true
	 */
	public function send( $mobile, $code ) {
		update_option(
			self::OPTION,
			array(
				'mobile' => OTP::mask( $mobile ),
				'code'   => (string) $code,
				'time'   => time(),
			),
			false
		);
		return true;
	}

	/**
	 * Latest stored test code.
	 *
	 * @return array|null { mobile, code, time }
	 */
	public static function last() {
		$last = get_option( self::OPTION );
		return is_array( $last ) && isset( $last['code'] ) ? $last : null;
	}
}
