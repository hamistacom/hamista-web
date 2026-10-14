<?php
/**
 * Asanak — REST API v2: template (pattern) send for codes, sendsms for text.
 *
 * POST https://sms.asanak.ir/webservice/v2rest/template
 * JSON: { username, password, template_id, parameters: { <name>: <code> }, destination }
 * POST https://sms.asanak.ir/webservice/v2rest/sendsms
 * JSON: { username, password, source, destination, message }
 * Response: { "meta": { "status": 200, "message": "..." }, "data": [ ... ] }
 *
 * Without a template ID, codes go out as text from the sender line.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth\Gateways;

defined( 'ABSPATH' ) || exit;

/**
 * Asanak.
 */
class Asanak extends Gateway {

	const API = 'https://sms.asanak.ir/webservice/v2rest/';

	/**
	 * Label.
	 *
	 * @return string
	 */
	public function label() {
		return __( 'Asanak', 'hamista-core' );
	}

	/**
	 * Send.
	 *
	 * @param string $mobile Mobile.
	 * @param string $code   Code.
	 * @return true|\WP_Error
	 */
	public function send( $mobile, $code ) {
		if ( '' === $this->opt( 'asanak_template' ) ) {
			return $this->send_text( $mobile, $this->code_text( $code ) );
		}
		$param = $this->opt( 'asanak_param' );
		return $this->call(
			'template',
			array(
				'template_id' => (int) $this->opt( 'asanak_template' ),
				'parameters'  => array( ( '' !== $param ? $param : 'code' ) => (string) $code ),
				'destination' => $mobile,
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
		$missing = $this->require_settings( array( 'asanak_sender' ) );
		if ( $missing ) {
			return $missing;
		}
		return $this->call(
			'sendsms',
			array(
				'source'      => $this->opt( 'asanak_sender' ),
				'destination' => $mobile,
				'message'     => $text,
			)
		);
	}

	/**
	 * Call a method.
	 *
	 * @param string $method Method.
	 * @param array  $data   Payload (credentials are added).
	 * @return true|\WP_Error
	 */
	private function call( $method, array $data ) {
		$missing = $this->require_settings( array( 'asanak_username', 'asanak_password' ) );
		if ( $missing ) {
			return $missing;
		}

		$response = $this->request(
			self::API . $method,
			array(
				'method'  => 'POST',
				'headers' => array( 'Content-Type' => 'application/json' ),
				'body'    => wp_json_encode(
					array(
						'username' => $this->opt( 'asanak_username' ),
						'password' => $this->opt( 'asanak_password' ),
					) + $data
				),
			)
		);
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$json   = is_array( $response['json'] ) ? $response['json'] : array();
		$status = isset( $json['meta']['status'] ) ? (int) $json['meta']['status'] : (int) $response['status'];
		if ( 200 === $status ) {
			return true;
		}

		$m = $this->common_messages();
		return $this->provider_error(
			$status,
			array(
				'401' => $m['auth'],
				'429' => $m['limit'],
				'500' => $m['server'],
			),
			isset( $json['meta']['message'] ) ? $json['meta']['message'] : '',
			$response
		);
	}
}
