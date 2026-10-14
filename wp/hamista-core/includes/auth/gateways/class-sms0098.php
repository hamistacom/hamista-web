<?php
/**
 * 0098 SMS — HTTP link API (text only; codes use the verification message).
 *
 * GET https://www.0098sms.com/sendsmslink.aspx?FROM=&TO=&TEXT=&USERNAME=&PASSWORD=&DOMAIN=0098
 * Response: a plain-text status number, 0 = sent.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth\Gateways;

defined( 'ABSPATH' ) || exit;

/**
 * 0098 SMS.
 */
class Sms0098 extends Gateway {

	/**
	 * Label.
	 *
	 * @return string
	 */
	public function label() {
		return __( '0098 SMS', 'hamista-core' );
	}

	/**
	 * Send.
	 *
	 * @param string $mobile Mobile.
	 * @param string $code   Code.
	 * @return true|\WP_Error
	 */
	public function send( $mobile, $code ) {
		return $this->send_text( $mobile, $this->code_text( $code ) );
	}

	/**
	 * Send a text message from the panel number.
	 *
	 * @param string $mobile Mobile.
	 * @param string $text   Message.
	 * @return true|\WP_Error
	 */
	public function send_text( $mobile, $text ) {
		$missing = $this->require_settings( array( 'sms0098_username', 'sms0098_password', 'sms0098_from' ) );
		if ( $missing ) {
			return $missing;
		}

		$url = add_query_arg(
			array(
				'FROM'     => rawurlencode( $this->opt( 'sms0098_from' ) ),
				'TO'       => rawurlencode( $mobile ),
				'TEXT'     => rawurlencode( $text ),
				'USERNAME' => rawurlencode( $this->opt( 'sms0098_username' ) ),
				'PASSWORD' => rawurlencode( $this->opt( 'sms0098_password' ) ),
				'DOMAIN'   => '0098',
			),
			'https://www.0098sms.com/sendsmslink.aspx'
		);

		$response = $this->request( $url, array( 'headers' => array( 'Accept' => 'text/plain, */*' ) ) );
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$status = preg_match( '/^\s*(-?\d+)/', $response['body'], $match ) ? $match[1] : '';
		if ( '0' === $status ) {
			return true;
		}

		$m = $this->common_messages();
		return $this->provider_error(
			$status,
			array(
				'1'  => $m['mobile'],
				'2'  => $m['mobile'],
				'3'  => $m['sender'],
				'4'  => __( 'The message text is empty.', 'hamista-core' ),
				'5'  => $m['auth'],
				'6'  => $m['auth'],
				'8'  => $m['account'],
				'9'  => $m['credit'],
				'12' => $m['auth'],
				'13' => __( 'The data contains invalid characters.', 'hamista-core' ),
				'14' => $m['limit'],
				'16' => $m['sender'],
			),
			'',
			$response
		);
	}
}
