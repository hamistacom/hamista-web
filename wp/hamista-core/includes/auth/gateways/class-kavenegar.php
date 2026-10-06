<?php
/**
 * Kavenegar — verify/lookup API.
 *
 * GET https://api.kavenegar.com/v1/{API-KEY}/verify/lookup.json?receptor=&token=&template=
 * Response: { "return": { "status": 200, "message": "..." }, "entries": [...] }
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth\Gateways;

defined( 'ABSPATH' ) || exit;

/**
 * Kavenegar.
 */
class Kavenegar extends Gateway {

	/**
	 * Label.
	 *
	 * @return string
	 */
	public function label() {
		return __( 'Kavenegar', 'hamista-core' );
	}

	/**
	 * Send.
	 *
	 * @param string $mobile Mobile.
	 * @param string $code   Code.
	 * @return true|\WP_Error
	 */
	public function send( $mobile, $code ) {
		$missing = $this->require_settings( array( 'kavenegar_api_key', 'kavenegar_template' ) );
		if ( $missing ) {
			return $missing;
		}

		$url = add_query_arg(
			array(
				'receptor' => rawurlencode( $mobile ),
				'token'    => rawurlencode( $code ),
				'template' => rawurlencode( $this->opt( 'kavenegar_template' ) ),
			),
			'https://api.kavenegar.com/v1/' . rawurlencode( $this->opt( 'kavenegar_api_key' ) ) . '/verify/lookup.json'
		);

		$response = $this->request( $url );
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$json   = is_array( $response['json'] ) ? $response['json'] : array();
		$status = isset( $json['return']['status'] ) ? (int) $json['return']['status'] : (int) $response['status'];
		if ( 200 === $status ) {
			return true;
		}

		$m = $this->common_messages();
		return $this->provider_error(
			$status,
			array(
				'400' => $m['params'],
				'401' => $m['account'],
				'403' => $m['auth'],
				'404' => __( 'The API method was not found.', 'hamista-core' ),
				'405' => __( 'The request method is not allowed.', 'hamista-core' ),
				'407' => $m['ip'],
				'409' => $m['server'],
				'411' => $m['mobile'],
				'412' => $m['sender'],
				'413' => __( 'The message is too long.', 'hamista-core' ),
				'414' => $m['limit'],
				'418' => $m['credit'],
				'422' => __( 'The token contains invalid characters.', 'hamista-core' ),
				'424' => $m['pattern'],
				'426' => __( 'This method needs an upgraded (premium) Kavenegar plan.', 'hamista-core' ),
				'428' => __( 'Voice calls are only possible for numeric tokens.', 'hamista-core' ),
				'431' => __( 'The template structure is invalid.', 'hamista-core' ),
				'432' => __( 'The template has no %token% parameter.', 'hamista-core' ),
				'607' => __( 'The template tag name is invalid.', 'hamista-core' ),
			),
			isset( $json['return']['message'] ) ? $json['return']['message'] : '',
			$response
		);
	}
}
