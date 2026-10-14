<?php
/**
 * Amoot SMS — REST API: SendWithPattern for codes, SendSimple for text.
 *
 * POST https://portal.amootsms.com/rest/SendWithPattern, header Authorization: {TOKEN}
 * form: Mobile, PatternCodeID, PatternValues (comma-separated, in pattern order)
 * POST https://portal.amootsms.com/rest/SendSimple
 * form: SendDateTime (0 = now), SMSMessageText, LineNumber, Mobiles (comma-separated)
 * Response: { "Status": "Success", "Data": [ { "Mobile": ..., "MessageID": ..., "Status": "Success" } ] }
 *
 * Without a pattern ID, codes go out as text.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth\Gateways;

defined( 'ABSPATH' ) || exit;

/**
 * Amoot SMS.
 */
class Amoot extends Gateway {

	const API = 'https://portal.amootsms.com/rest/';

	/**
	 * Label.
	 *
	 * @return string
	 */
	public function label() {
		return __( 'Amoot SMS', 'hamista-core' );
	}

	/**
	 * Send.
	 *
	 * @param string $mobile Mobile.
	 * @param string $code   Code.
	 * @return true|\WP_Error
	 */
	public function send( $mobile, $code ) {
		if ( '' === $this->opt( 'amoot_pattern' ) ) {
			return $this->send_text( $mobile, $this->code_text( $code ) );
		}
		return $this->call(
			'SendWithPattern',
			array(
				'Mobile'        => $mobile,
				'PatternCodeID' => (int) $this->opt( 'amoot_pattern' ),
				'PatternValues' => (string) $code,
			)
		);
	}

	/**
	 * Send a text message from the sender line (the shared "Public" line by default).
	 *
	 * @param string $mobile Mobile.
	 * @param string $text   Message.
	 * @return true|\WP_Error
	 */
	public function send_text( $mobile, $text ) {
		$line = $this->opt( 'amoot_line' );
		return $this->call(
			'SendSimple',
			array(
				'SendDateTime'   => '0',
				'SMSMessageText' => $text,
				'LineNumber'     => '' !== $line ? $line : 'Public',
				'Mobiles'        => $mobile,
			)
		);
	}

	/**
	 * Call a method.
	 *
	 * @param string $method Method.
	 * @param array  $data   Form fields.
	 * @return true|\WP_Error
	 */
	private function call( $method, array $data ) {
		$missing = $this->require_settings( array( 'amoot_token' ) );
		if ( $missing ) {
			return $missing;
		}

		$response = $this->request(
			self::API . $method,
			array(
				'method'  => 'POST',
				'headers' => array(
					'Content-Type'  => 'application/x-www-form-urlencoded',
					'Authorization' => $this->opt( 'amoot_token' ),
				),
				'body'    => $data,
			)
		);
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$json   = is_array( $response['json'] ) ? $response['json'] : array();
		$status = isset( $json['Status'] ) && is_scalar( $json['Status'] ) ? (string) $json['Status'] : '';
		if ( 'Success' === $status ) {
			return true;
		}

		$m = $this->common_messages();
		return $this->provider_error(
			$status,
			array(
				'Token_Invalid'    => $m['auth'],
				'LineNumber_Empty' => $m['sender'],
				'ServerError'      => $m['server'],
			),
			'',
			$response
		);
	}
}
