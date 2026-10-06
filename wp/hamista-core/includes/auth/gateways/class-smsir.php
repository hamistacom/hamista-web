<?php
/**
 * SMS.ir — verify (template) API v1.
 *
 * POST https://api.sms.ir/v1/send/verify, header x-api-key
 * JSON: { mobile, templateId, parameters: [ { name, value } ] }
 * Response: { "status": 1, "message": "...", "data": { "messageId": 0, "cost": 1 } }
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth\Gateways;

defined( 'ABSPATH' ) || exit;

/**
 * SMS.ir.
 */
class Smsir extends Gateway {

	/**
	 * Label.
	 *
	 * @return string
	 */
	public function label() {
		return __( 'SMS.ir', 'hamista-core' );
	}

	/**
	 * Send.
	 *
	 * @param string $mobile Mobile.
	 * @param string $code   Code.
	 * @return true|\WP_Error
	 */
	public function send( $mobile, $code ) {
		$missing = $this->require_settings( array( 'smsir_api_key', 'smsir_template_id' ) );
		if ( $missing ) {
			return $missing;
		}
		$param = $this->opt( 'smsir_param' );

		$response = $this->request(
			'https://api.sms.ir/v1/send/verify',
			array(
				'method'  => 'POST',
				'headers' => array(
					'Content-Type' => 'application/json',
					'x-api-key'    => $this->opt( 'smsir_api_key' ),
				),
				'body'    => wp_json_encode(
					array(
						'mobile'     => $mobile,
						'templateId' => (int) $this->opt( 'smsir_template_id' ),
						'parameters' => array(
							array(
								'name'  => '' !== $param ? $param : 'CODE',
								'value' => (string) $code,
							),
						),
					)
				),
			)
		);
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$json   = is_array( $response['json'] ) ? $response['json'] : array();
		$status = isset( $json['status'] ) ? (int) $json['status'] : null;
		if ( 1 === $status ) {
			return true;
		}

		$m = $this->common_messages();
		if ( null === $status ) {
			$status = 401 === $response['status'] ? '10' : '';
		}
		return $this->provider_error(
			$status,
			array(
				'0'   => $m['server'],
				'10'  => $m['auth'],
				'11'  => $m['auth'],
				'12'  => $m['ip'],
				'13'  => $m['account'],
				'14'  => $m['account'],
				'15'  => $m['ip'],
				'20'  => $m['limit'],
				'101' => $m['sender'],
				'102' => $m['credit'],
				'103' => __( 'The message text is empty.', 'hamista-core' ),
				'104' => $m['mobile'],
				'105' => __( 'Too many recipients.', 'hamista-core' ),
				'111' => $m['pattern'],
				'112' => __( 'The template parameter name does not match the template.', 'hamista-core' ),
				'113' => $m['pattern'],
			),
			isset( $json['message'] ) ? $json['message'] : '',
			$response
		);
	}
}
