<?php
/**
 * Parsgreen — API v2: SendOtp for codes, SendSms for text.
 *
 * POST https://sms.parsgreen.ir/Apiv2/Message/SendOtp, header Authorization: basic apikey:{KEY}
 * JSON: { Mobile, SmsCode, TemplateId (0–6), AddName }
 * POST https://sms.parsgreen.ir/Apiv2/Message/SendSms
 * JSON: { SmsBody, Mobiles: [ ... ], SmsNumber (optional) }
 * Response: { "R_Success": true, "R_Code": 0, "R_Message": "..." }
 *
 * Without an OTP template number, codes go out as text.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth\Gateways;

defined( 'ABSPATH' ) || exit;

/**
 * Parsgreen.
 */
class Parsgreen extends Gateway {

	const API = 'https://sms.parsgreen.ir/Apiv2/';

	/**
	 * Label.
	 *
	 * @return string
	 */
	public function label() {
		return __( 'Parsgreen', 'hamista-core' );
	}

	/**
	 * Send.
	 *
	 * @param string $mobile Mobile.
	 * @param string $code   Code.
	 * @return true|\WP_Error
	 */
	public function send( $mobile, $code ) {
		$template = $this->opt( 'parsgreen_template' );
		if ( '' === $template ) {
			return $this->send_text( $mobile, $this->code_text( $code ) );
		}
		return $this->call(
			'Message/SendOtp',
			array(
				'Mobile'     => $mobile,
				'SmsCode'    => (string) $code,
				'TemplateId' => max( 0, min( 6, (int) $template ) ),
				'AddName'    => false,
			)
		);
	}

	/**
	 * Send a text message (from the sender line when one is set).
	 *
	 * @param string $mobile Mobile.
	 * @param string $text   Message.
	 * @return true|\WP_Error
	 */
	public function send_text( $mobile, $text ) {
		$data = array(
			'SmsBody' => $text,
			'Mobiles' => array( $mobile ),
		);
		if ( '' !== $this->opt( 'parsgreen_sender' ) ) {
			$data['SmsNumber'] = $this->opt( 'parsgreen_sender' );
		}
		return $this->call( 'Message/SendSms', $data );
	}

	/**
	 * Call a method.
	 *
	 * @param string $method Method path.
	 * @param array  $data   Payload.
	 * @return true|\WP_Error
	 */
	private function call( $method, array $data ) {
		$missing = $this->require_settings( array( 'parsgreen_api_key' ) );
		if ( $missing ) {
			return $missing;
		}

		$response = $this->request(
			self::API . $method,
			array(
				'method'  => 'POST',
				'headers' => array(
					'Content-Type'  => 'application/json; charset=utf-8',
					'Authorization' => 'basic apikey:' . $this->opt( 'parsgreen_api_key' ),
				),
				'body'    => wp_json_encode( $data ),
			)
		);
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$json = is_array( $response['json'] ) ? $response['json'] : array();
		if ( ! empty( $json['R_Success'] ) ) {
			return true;
		}

		$m    = $this->common_messages();
		$code = isset( $json['R_Code'] ) ? $json['R_Code'] : ( 401 === $response['status'] ? 401 : '' );
		return $this->provider_error(
			$code,
			array( '401' => $m['auth'] ),
			isset( $json['R_Message'] ) ? $json['R_Message'] : '',
			$response
		);
	}
}
