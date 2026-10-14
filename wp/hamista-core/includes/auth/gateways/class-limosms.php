<?php
/**
 * Limo SMS — pattern send for codes, sendsms for text.
 *
 * POST https://api.limosms.com/api/sendpatternmessage, header ApiKey
 * JSON: { OtpId, ReplaceToken: [ <code> ], MobileNumber }
 * POST https://api.limosms.com/api/sendsms, header ApiKey
 * JSON: { Message, SenderNumber, MobileNumber: [ ... ], SendToBlocksNumber }
 * Response: { "Success": true, "Message": "...", "MessageId": 123 }
 *
 * Without a pattern ID, codes go out as text.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth\Gateways;

defined( 'ABSPATH' ) || exit;

/**
 * Limo SMS.
 */
class Limosms extends Gateway {

	const API = 'https://api.limosms.com/api/';

	/**
	 * Label.
	 *
	 * @return string
	 */
	public function label() {
		return __( 'Limo SMS', 'hamista-core' );
	}

	/**
	 * Send.
	 *
	 * @param string $mobile Mobile.
	 * @param string $code   Code.
	 * @return true|\WP_Error
	 */
	public function send( $mobile, $code ) {
		if ( '' === $this->opt( 'limosms_pattern' ) ) {
			return $this->send_text( $mobile, $this->code_text( $code ) );
		}
		return $this->call(
			'sendpatternmessage',
			array(
				'OtpId'        => $this->opt( 'limosms_pattern' ),
				'ReplaceToken' => array( (string) $code ),
				'MobileNumber' => $mobile,
			)
		);
	}

	/**
	 * Send a text message from the sender line.
	 *
	 * @param string $mobile Mobile.
	 * @param string $text   Message.
	 * @return true|\WP_Error
	 */
	public function send_text( $mobile, $text ) {
		$missing = $this->require_settings( array( 'limosms_sender' ) );
		if ( $missing ) {
			return $missing;
		}
		return $this->call(
			'sendsms',
			array(
				'Message'            => $text,
				'SenderNumber'       => $this->opt( 'limosms_sender' ),
				'MobileNumber'       => array( $mobile ),
				'SendToBlocksNumber' => true,
			)
		);
	}

	/**
	 * Call a method.
	 *
	 * @param string $method Method.
	 * @param array  $data   Payload.
	 * @return true|\WP_Error
	 */
	private function call( $method, array $data ) {
		$missing = $this->require_settings( array( 'limosms_api_key' ) );
		if ( $missing ) {
			return $missing;
		}

		$response = $this->request(
			self::API . $method,
			array(
				'method'  => 'POST',
				'headers' => array(
					'Content-Type' => 'application/json',
					'ApiKey'       => $this->opt( 'limosms_api_key' ),
				),
				'body'    => wp_json_encode( $data ),
			)
		);
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		// Accept "Success" as well as "success".
		$json = is_array( $response['json'] ) ? array_change_key_case( $response['json'], CASE_LOWER ) : array();
		if ( ! empty( $json['success'] ) ) {
			return true;
		}

		$m = $this->common_messages();
		return $this->provider_error(
			200 === $response['status'] ? '' : $response['status'],
			array(
				'401' => $m['auth'],
				'403' => $m['auth'],
				'429' => $m['limit'],
				'500' => $m['server'],
			),
			isset( $json['message'] ) && is_string( $json['message'] ) ? $json['message'] : '',
			$response
		);
	}
}
