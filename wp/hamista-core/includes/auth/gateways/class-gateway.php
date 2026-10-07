<?php
/**
 * Base class for SMS gateways.
 *
 * A gateway sends one verification code to one number. Add a provider by
 * extending this class and registering it on the `hamista_core/sms_gateways`
 * filter (slug => class name).
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth\Gateways;

defined( 'ABSPATH' ) || exit;

/**
 * Gateway.
 */
abstract class Gateway {

	/** HTTP timeout in seconds. */
	const TIMEOUT = 15;

	/**
	 * Provider name for messages.
	 *
	 * @return string
	 */
	abstract public function label();

	/**
	 * Send a verification code.
	 *
	 * @param string $mobile Normalised mobile (09XXXXXXXXX).
	 * @param string $code   Code.
	 * @return true|\WP_Error
	 */
	abstract public function send( $mobile, $code );

	/**
	 * A setting value (trimmed string).
	 *
	 * @param string $key Setting key.
	 * @return string
	 */
	protected function opt( $key ) {
		$value = hamista_core_option( $key, '' );
		return is_scalar( $value ) ? trim( (string) $value ) : '';
	}

	/**
	 * Error when required settings are empty.
	 *
	 * @param string[] $keys Setting keys.
	 * @return \WP_Error|null
	 */
	protected function require_settings( array $keys ) {
		foreach ( $keys as $key ) {
			if ( '' === $this->opt( $key ) ) {
				return new \WP_Error(
					'hamista_sms_config',
					/* translators: %s: provider name */
					sprintf( __( '%s is not fully configured. Fill in every field in Hamista → Login & SMS.', 'hamista-core' ), $this->label() )
				);
			}
		}
		return null;
	}

	/**
	 * 09XXXXXXXXX → 989XXXXXXXXX (with an optional prefix such as "+").
	 *
	 * @param string $mobile Normalised mobile.
	 * @param string $prefix Prefix.
	 * @return string
	 */
	protected function international( $mobile, $prefix = '' ) {
		return $prefix . '98' . substr( $mobile, 1 );
	}

	/**
	 * Perform an HTTP request.
	 *
	 * @param string $url  URL.
	 * @param array  $args wp_remote_request() arguments.
	 * @return array|\WP_Error { status: int, body: string, json: mixed }
	 */
	protected function request( $url, array $args = array() ) {
		$args            = wp_parse_args(
			$args,
			array(
				'method'      => 'GET',
				'timeout'     => self::TIMEOUT,
				'redirection' => 2,
				'headers'     => array(),
				'user-agent'  => 'HamistaCore/' . ( defined( 'HAMISTA_CORE_VERSION' ) ? HAMISTA_CORE_VERSION : '1' ) . '; ' . home_url( '/' ),
			)
		);
		$args['headers'] = array_merge( array( 'Accept' => 'application/json' ), (array) $args['headers'] );

		/**
		 * Filter a gateway HTTP request.
		 *
		 * @param array   $args    Request arguments.
		 * @param string  $url     URL.
		 * @param Gateway $gateway Gateway.
		 */
		$args = apply_filters( 'hamista_core/sms_request_args', $args, $url, $this );

		$response = wp_remote_request( $url, $args );
		if ( is_wp_error( $response ) ) {
			return $this->fail(
				/* translators: 1: provider, 2: error */
				sprintf( __( '%1$s could not be reached: %2$s', 'hamista-core' ), $this->label(), $response->get_error_message() ),
				$response,
				'hamista_sms_http'
			);
		}

		$body = (string) wp_remote_retrieve_body( $response );
		return array(
			'status' => (int) wp_remote_retrieve_response_code( $response ),
			'body'   => $body,
			'json'   => json_decode( $body, true ),
		);
	}

	/**
	 * Build an error, logging the raw response when WP_DEBUG is on.
	 *
	 * @param string $message  Readable message.
	 * @param mixed  $response Raw response (array from request() or WP_Error).
	 * @param string $code     Error code.
	 * @return \WP_Error
	 */
	protected function fail( $message, $response = null, $code = 'hamista_sms_failed' ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			$raw = '';
			if ( is_wp_error( $response ) ) {
				$raw = $response->get_error_message();
			} elseif ( is_array( $response ) ) {
				$raw = 'HTTP ' . ( isset( $response['status'] ) ? $response['status'] : '?' ) . ' ' . ( isset( $response['body'] ) ? substr( (string) $response['body'], 0, 500 ) : '' );
			}
			error_log( '[Hamista SMS ' . $this->label() . '] ' . $message . ( $raw ? ' | ' . $raw : '' ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		}
		return new \WP_Error( $code, $message );
	}

	/**
	 * Readable error from a provider code map, falling back to the provider's
	 * own message (usually Persian and readable) and then a generic text.
	 *
	 * @param int|string $code     Provider status code.
	 * @param array      $map      code => message.
	 * @param string     $provider_message Message returned by the provider.
	 * @param array      $response Raw response.
	 * @return \WP_Error
	 */
	protected function provider_error( $code, array $map, $provider_message, $response ) {
		$code = (string) $code;
		if ( isset( $map[ $code ] ) ) {
			$text = $map[ $code ];
		} elseif ( '' !== trim( (string) $provider_message ) ) {
			$text = wp_strip_all_tags( (string) $provider_message );
		} else {
			$text = __( 'The provider rejected the request.', 'hamista-core' );
		}
		/* translators: 1: provider, 2: message, 3: provider status code */
		$message = '' !== $code ? sprintf( __( '%1$s: %2$s (code %3$s)', 'hamista-core' ), $this->label(), $text, $code ) : sprintf( '%1$s: %2$s', $this->label(), $text );
		return $this->fail( $message, $response );
	}

	/**
	 * Messages shared by several providers.
	 *
	 * @return array
	 */
	protected function common_messages() {
		return array(
			'auth'    => __( 'The API key or credentials are invalid.', 'hamista-core' ),
			'credit'  => __( 'Your SMS account is out of credit.', 'hamista-core' ),
			'mobile'  => __( 'The mobile number was rejected by the provider.', 'hamista-core' ),
			'pattern' => __( 'The template/pattern was not found or is not approved yet.', 'hamista-core' ),
			'params'  => __( 'Some request parameters are missing or invalid.', 'hamista-core' ),
			'sender'  => __( 'The sender line is invalid or not allowed.', 'hamista-core' ),
			'account' => __( 'Your SMS account is inactive or suspended.', 'hamista-core' ),
			'ip'      => __( 'This server’s IP address is not allowed for your API key.', 'hamista-core' ),
			'limit'   => __( 'The provider’s rate limit was reached. Try again shortly.', 'hamista-core' ),
			'server'  => __( 'The provider had an internal error. Try again shortly.', 'hamista-core' ),
		);
	}
}
