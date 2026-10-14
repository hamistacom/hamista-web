<?php
/**
 * SMS.ir — verify (template) API v1, bulk send for text.
 *
 * POST https://api.sms.ir/v1/send/verify, header x-api-key
 * JSON: { mobile, templateId, parameters: [ { name, value } ] }
 * POST https://api.sms.ir/v1/send/bulk, header x-api-key
 * JSON: { lineNumber, messageText, mobiles: [ ... ] }
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
		return $this->result( $response );
	}

	/**
	 * Send a text message from the account's line.
	 *
	 * @param string $mobile Mobile.
	 * @param string $text   Message.
	 * @return true|\WP_Error
	 */
	public function send_text( $mobile, $text ) {
		$missing = $this->require_settings( array( 'smsir_api_key', 'smsir_line' ) );
		if ( $missing ) {
			return $missing;
		}

		return $this->result(
			$this->request(
				'https://api.sms.ir/v1/send/bulk',
				array(
					'method'  => 'POST',
					'headers' => array(
						'Content-Type' => 'application/json',
						'x-api-key'    => $this->opt( 'smsir_api_key' ),
					),
					'body'    => wp_json_encode(
						array(
							'lineNumber'  => (int) preg_replace( '/\D+/', '', $this->opt( 'smsir_line' ) ),
							'messageText' => $text,
							'mobiles'     => array( $mobile ),
						)
					),
				)
			)
		);
	}

	/**
	 * Read a response.
	 *
	 * @param array|\WP_Error $response Response from request().
	 * @return true|\WP_Error
	 */
	private function result( $response ) {
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
