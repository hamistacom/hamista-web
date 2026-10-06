<?php
/**
 * Ghasedak — simple verification (template) API v2.
 *
 * POST https://api.ghasedak.me/v2/verification/send/simple, header apikey
 * form: receptor, type (1 = SMS), template, param1
 * Response: { "result": { "code": 200, "message": "success" }, "items": [ ... ] }
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth\Gateways;

defined( 'ABSPATH' ) || exit;

/**
 * Ghasedak.
 */
class Ghasedak extends Gateway {

	/**
	 * Label.
	 *
	 * @return string
	 */
	public function label() {
		return __( 'Ghasedak', 'hamista-core' );
	}

	/**
	 * Send.
	 *
	 * @param string $mobile Mobile.
	 * @param string $code   Code.
	 * @return true|\WP_Error
	 */
	public function send( $mobile, $code ) {
		$missing = $this->require_settings( array( 'ghasedak_api_key', 'ghasedak_template' ) );
		if ( $missing ) {
			return $missing;
		}

		$response = $this->request(
			'https://api.ghasedak.me/v2/verification/send/simple',
			array(
				'method'  => 'POST',
				'headers' => array(
					'Content-Type' => 'application/x-www-form-urlencoded',
					'apikey'       => $this->opt( 'ghasedak_api_key' ),
				),
				'body'    => array(
					'receptor' => $mobile,
					'type'     => 1,
					'template' => $this->opt( 'ghasedak_template' ),
					'param1'   => $code,
				),
			)
		);
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$json   = is_array( $response['json'] ) ? $response['json'] : array();
		$status = isset( $json['result']['code'] ) ? (int) $json['result']['code'] : (int) $response['status'];
		if ( 200 === $status ) {
			return true;
		}

		$m = $this->common_messages();
		return $this->provider_error(
			$status,
			array(
				'400' => $m['params'],
				'401' => $m['auth'],
				'402' => __( 'The operation failed.', 'hamista-core' ),
				'404' => $m['pattern'],
				'405' => __( 'The request method is not allowed.', 'hamista-core' ),
				'406' => $m['params'],
				'412' => $m['account'],
				'418' => $m['credit'],
				'419' => $m['mobile'],
				'422' => __( 'The data contains invalid characters.', 'hamista-core' ),
				'429' => $m['limit'],
				'500' => $m['server'],
			),
			isset( $json['result']['message'] ) ? $json['result']['message'] : '',
			$response
		);
	}
}
