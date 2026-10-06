<?php
/**
 * Custom HTTP API — any provider with a URL, method, headers and body.
 *
 * Placeholders: {mobile} (09XXXXXXXXX), {mobile_intl} (989XXXXXXXXX) and {code}.
 * They are URL-encoded in the URL, JSON-escaped in a JSON body and inserted
 * as-is elsewhere. Any 2xx response counts as success.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth\Gateways;

defined( 'ABSPATH' ) || exit;

/**
 * Custom.
 */
class Custom extends Gateway {

	/**
	 * Label.
	 *
	 * @return string
	 */
	public function label() {
		return __( 'Custom API', 'hamista-core' );
	}

	/**
	 * Send.
	 *
	 * @param string $mobile Mobile.
	 * @param string $code   Code.
	 * @return true|\WP_Error
	 */
	public function send( $mobile, $code ) {
		$missing = $this->require_settings( array( 'custom_sms_url' ) );
		if ( $missing ) {
			return $missing;
		}

		$vars = array(
			'{mobile}'      => $mobile,
			'{mobile_intl}' => $this->international( $mobile ),
			'{code}'        => (string) $code,
		);

		$url   = strtr( $this->opt( 'custom_sms_url' ), array_map( 'rawurlencode', $vars ) );
		$parts = wp_parse_url( $url );
		if ( empty( $parts['host'] ) || empty( $parts['scheme'] ) || ! in_array( strtolower( $parts['scheme'] ), array( 'http', 'https' ), true ) ) {
			return $this->fail( __( 'The custom endpoint URL is invalid.', 'hamista-core' ), null, 'hamista_sms_config' );
		}

		$method  = 'GET' === strtoupper( $this->opt( 'custom_sms_method' ) ) ? 'GET' : 'POST';
		$headers = $this->parse_headers( (string) hamista_core_option( 'custom_sms_headers', '' ), $vars );
		$args    = array(
			'method'  => $method,
			'headers' => $headers,
		);

		if ( 'POST' === $method ) {
			$body    = (string) hamista_core_option( 'custom_sms_body', '' );
			$is_json = $this->is_json( $body, $headers );
			if ( $is_json ) {
				$escaped = array();
				foreach ( $vars as $key => $value ) {
					$escaped[ $key ] = substr( wp_json_encode( $value ), 1, -1 );
				}
				$body = strtr( $body, $escaped );
				if ( ! $this->has_header( $headers, 'content-type' ) ) {
					$args['headers']['Content-Type'] = 'application/json';
				}
			} else {
				$body = strtr( $body, $vars );
				if ( ! $this->has_header( $headers, 'content-type' ) && false !== strpos( $body, '=' ) ) {
					$args['headers']['Content-Type'] = 'application/x-www-form-urlencoded';
				}
			}
			$args['body'] = $body;
		}

		$response = $this->request( $url, $args );
		if ( is_wp_error( $response ) ) {
			return $response;
		}
		if ( $response['status'] >= 200 && $response['status'] < 300 ) {
			return true;
		}

		$message = '';
		if ( is_array( $response['json'] ) ) {
			foreach ( array( 'message', 'error', 'error_message', 'detail' ) as $field ) {
				if ( ! empty( $response['json'][ $field ] ) && is_string( $response['json'][ $field ] ) ) {
					$message = $response['json'][ $field ];
					break;
				}
			}
		}
		if ( '' === $message ) {
			/* translators: %d: HTTP status */
			$message = sprintf( __( 'The endpoint answered with HTTP %d.', 'hamista-core' ), $response['status'] );
		}
		return $this->provider_error( $response['status'], array(), $message, $response );
	}

	/**
	 * "Name: value" lines → array.
	 *
	 * @param string $raw  Raw headers.
	 * @param array  $vars Placeholders.
	 * @return array
	 */
	private function parse_headers( $raw, array $vars ) {
		$headers = array();
		foreach ( preg_split( '/\r\n|\r|\n/', $raw ) as $line ) {
			$line = trim( $line );
			if ( '' === $line || false === strpos( $line, ':' ) ) {
				continue;
			}
			list( $name, $value ) = array_map( 'trim', explode( ':', $line, 2 ) );
			if ( '' !== $name && preg_match( '/^[A-Za-z0-9\-_]+$/', $name ) ) {
				$headers[ $name ] = strtr( $value, $vars );
			}
		}
		return $headers;
	}

	/**
	 * Case-insensitive header check.
	 *
	 * @param array  $headers Headers.
	 * @param string $name    Lower-case name.
	 * @return bool
	 */
	private function has_header( array $headers, $name ) {
		foreach ( array_keys( $headers ) as $key ) {
			if ( strtolower( $key ) === $name ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Whether the body is JSON (by content type or shape).
	 *
	 * @param string $body    Body template.
	 * @param array  $headers Headers.
	 * @return bool
	 */
	private function is_json( $body, array $headers ) {
		foreach ( $headers as $key => $value ) {
			if ( 'content-type' === strtolower( $key ) ) {
				return false !== stripos( $value, 'json' );
			}
		}
		$first = substr( ltrim( $body ), 0, 1 );
		return '{' === $first || '[' === $first;
	}
}
