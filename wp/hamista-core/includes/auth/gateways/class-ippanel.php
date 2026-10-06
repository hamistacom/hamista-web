<?php
/**
 * IPPanel — pattern ("normal") send, edge API v1.
 *
 * Farazsms and several other Iranian resellers run on IPPanel, so this
 * gateway also serves Farazsms accounts (same API key, pattern and sender).
 *
 * POST https://api2.ippanel.com/api/v1/sms/pattern/normal/send, header apikey
 * JSON: { code, sender, recipient, variable: { <name>: <code> } }
 * Response: { "status": "OK", "code": "200", "error_message": "", "data": { "message_id": 123 } }
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth\Gateways;

defined( 'ABSPATH' ) || exit;

/**
 * IPPanel / Farazsms.
 */
class Ippanel extends Gateway {

	/**
	 * Label.
	 *
	 * @return string
	 */
	public function label() {
		return __( 'IPPanel', 'hamista-core' );
	}

	/**
	 * Send.
	 *
	 * @param string $mobile Mobile.
	 * @param string $code   Code.
	 * @return true|\WP_Error
	 */
	public function send( $mobile, $code ) {
		$missing = $this->require_settings( array( 'ippanel_api_key', 'ippanel_pattern', 'ippanel_sender' ) );
		if ( $missing ) {
			return $missing;
		}
		$variable = $this->opt( 'ippanel_variable' );

		$response = $this->request(
			'https://api2.ippanel.com/api/v1/sms/pattern/normal/send',
			array(
				'method'  => 'POST',
				'headers' => array(
					'Content-Type' => 'application/json',
					'apikey'       => $this->opt( 'ippanel_api_key' ),
				),
				'body'    => wp_json_encode(
					array(
						'code'      => $this->opt( 'ippanel_pattern' ),
						'sender'    => $this->opt( 'ippanel_sender' ),
						'recipient' => $mobile,
						'variable'  => array( ( '' !== $variable ? $variable : 'code' ) => (string) $code ),
					)
				),
			)
		);
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$json   = is_array( $response['json'] ) ? $response['json'] : array();
		$status = isset( $json['status'] ) ? strtoupper( (string) $json['status'] ) : '';
		if ( 200 === $response['status'] && ( 'OK' === $status || ! empty( $json['data']['message_id'] ) ) ) {
			return true;
		}

		$m       = $this->common_messages();
		$message = '';
		foreach ( array( 'error_message', 'message' ) as $field ) {
			if ( ! empty( $json[ $field ] ) && is_string( $json[ $field ] ) ) {
				$message = $json[ $field ];
				break;
			}
		}
		if ( ! $message && ! empty( $json['data']['error'] ) ) {
			$message = is_array( $json['data']['error'] ) ? implode( ' ', array_map( 'strval', array_map( array( $this, 'flatten' ), $json['data']['error'] ) ) ) : (string) $json['data']['error'];
		}

		$by_http = array(
			401 => $m['auth'],
			403 => $m['account'],
			404 => $m['pattern'],
			422 => '' !== $message ? $message : $m['params'],
			429 => $m['limit'],
			500 => $m['server'],
		);
		if ( '' === $message && isset( $by_http[ $response['status'] ] ) ) {
			$message = $by_http[ $response['status'] ];
		}
		if ( false !== stripos( $message, 'credit' ) ) {
			$message = $m['credit'];
		}
		return $this->provider_error( $response['status'], array( '401' => $m['auth'] ), $message, $response );
	}

	/**
	 * Flatten nested validation errors.
	 *
	 * @param mixed $item Item.
	 * @return string
	 */
	private function flatten( $item ) {
		return is_array( $item ) ? implode( ' ', array_map( array( $this, 'flatten' ), $item ) ) : (string) $item;
	}
}
