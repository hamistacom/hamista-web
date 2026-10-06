<?php
/**
 * Melipayamak — shared service line (pattern) REST API.
 *
 * POST https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber
 * form: username, password, text (pattern variables separated by ";"), to, bodyId
 * Response: { "Value": "<recId or error code>", "RetStatus": 1, "StrRetStatus": "Ok" }
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth\Gateways;

defined( 'ABSPATH' ) || exit;

/**
 * Melipayamak.
 */
class Melipayamak extends Gateway {

	/**
	 * Label.
	 *
	 * @return string
	 */
	public function label() {
		return __( 'Melipayamak', 'hamista-core' );
	}

	/**
	 * Send.
	 *
	 * @param string $mobile Mobile.
	 * @param string $code   Code.
	 * @return true|\WP_Error
	 */
	public function send( $mobile, $code ) {
		$missing = $this->require_settings( array( 'melipayamak_username', 'melipayamak_password', 'melipayamak_body_id' ) );
		if ( $missing ) {
			return $missing;
		}

		$response = $this->request(
			'https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber',
			array(
				'method'  => 'POST',
				'headers' => array( 'Content-Type' => 'application/x-www-form-urlencoded' ),
				'body'    => array(
					'username' => $this->opt( 'melipayamak_username' ),
					'password' => $this->opt( 'melipayamak_password' ),
					'text'     => $code,
					'to'       => $mobile,
					'bodyId'   => $this->opt( 'melipayamak_body_id' ),
				),
			)
		);
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$json   = is_array( $response['json'] ) ? $response['json'] : array();
		$ret    = isset( $json['RetStatus'] ) ? (int) $json['RetStatus'] : -999;
		$value  = isset( $json['Value'] ) ? trim( (string) $json['Value'] ) : '';
		$is_rec = (bool) preg_match( '/^\d{6,}$/', $value ); // recId is a long number; error codes are short.

		if ( 1 === $ret && $is_rec ) {
			return true;
		}

		$m    = $this->common_messages();
		$map  = array(
			'-10' => __( 'The variables contain a link, which is not allowed.', 'hamista-core' ),
			'-7'  => $m['sender'],
			'-6'  => $m['server'],
			'-5'  => __( 'The text does not match the pattern variables.', 'hamista-core' ),
			'-4'  => $m['pattern'],
			'-3'  => $m['sender'],
			'-2'  => __( 'Too many recipients.', 'hamista-core' ),
			'-1'  => __( 'Access to this web service is disabled for your account.', 'hamista-core' ),
			'0'   => $m['auth'],
			'2'   => $m['credit'],
			'3'   => $m['limit'],
			'4'   => $m['limit'],
			'5'   => $m['sender'],
			'6'   => $m['server'],
			'7'   => __( 'The text contains a filtered word.', 'hamista-core' ),
			'9'   => __( 'Public lines cannot send through the web service.', 'hamista-core' ),
			'10'  => $m['account'],
			'11'  => __( 'The message was not sent.', 'hamista-core' ),
			'12'  => __( 'Your account documents are incomplete.', 'hamista-core' ),
			'14'  => __( 'The text contains a link.', 'hamista-core' ),
			'16'  => $m['mobile'],
			'17'  => __( 'The text is empty.', 'hamista-core' ),
			'18'  => $m['mobile'],
			'35'  => __( 'The number is on the telecom blacklist.', 'hamista-core' ),
		);
		$code = 1 === $ret ? $value : (string) $ret;
		return $this->provider_error( '-999' === $code ? '' : $code, $map, isset( $json['StrRetStatus'] ) ? $json['StrRetStatus'] : '', $response );
	}
}
