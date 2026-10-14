<?php
/**
 * Text messages through the selected provider, and the SMS log.
 *
 * Every send attempt (login codes, shop notifications, admin tests) is
 * recorded in a non-autoloaded option, newest first, capped at LOG_MAX rows.
 * Numbers are stored masked; message text and codes are never stored.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Auth;

defined( 'ABSPATH' ) || exit;

/**
 * Sms.
 */
class Sms {

	const LOG     = 'hamista_sms_log';
	const LOG_MAX = 500;

	/**
	 * Send a text message through the selected provider and log it.
	 *
	 * @param string $mobile Mobile (any format OTP::normalize_mobile() accepts).
	 * @param string $text   Message.
	 * @param string $type   Log type: otp, order, admin, stock or test.
	 * @return true|\WP_Error
	 */
	public static function send( $mobile, $text, $type ) {
		$mobile = OTP::normalize_mobile( $mobile );
		if ( '' === $mobile ) {
			return OTP::invalid_mobile();
		}
		$slug    = OTP::gateway_slug();
		$gateway = OTP::gateway( $slug );
		$result  = is_wp_error( $gateway ) ? $gateway : $gateway->send_text( $mobile, $text );
		self::log( $mobile, $type, $slug, $result );
		return $result;
	}

	/**
	 * Fill a message template. {site} is always available; stored HTML
	 * entities (textarea settings are saved through wp_kses_post) are decoded.
	 *
	 * @param string $template Template.
	 * @param array  $vars     '{name}' => value.
	 * @return string
	 */
	public static function render( $template, array $vars = array() ) {
		$vars += array( '{site}' => get_bloginfo( 'name' ) );
		$text  = strtr( (string) $template, array_map( 'strval', $vars ) );
		return trim( html_entity_decode( wp_strip_all_tags( $text ), ENT_QUOTES, 'UTF-8' ) );
	}

	/**
	 * Record a send attempt.
	 *
	 * @param string          $mobile   Normalised mobile.
	 * @param string          $type     otp, order, admin, stock or test.
	 * @param string          $provider Gateway slug.
	 * @param true|\WP_Error  $result   Result.
	 */
	public static function log( $mobile, $type, $provider, $result ) {
		$error = '';
		if ( is_wp_error( $result ) ) {
			$error = $result->get_error_message();
		} elseif ( true !== $result ) {
			$error = __( 'The provider rejected the request.', 'hamista-core' );
		}

		// Read-modify-write without a lock: two sends in the same instant can drop one row.
		$rows = get_option( self::LOG, array() );
		$rows = is_array( $rows ) ? $rows : array();
		array_unshift(
			$rows,
			array(
				'time'     => time(),
				'mobile'   => OTP::mask( $mobile ),
				'type'     => sanitize_key( $type ),
				'provider' => sanitize_key( $provider ),
				'error'    => $error,
			)
		);
		update_option( self::LOG, array_slice( $rows, 0, self::LOG_MAX ), false );
	}

	/**
	 * REST routes: GET (rows) and DELETE (clear) /hamista/v1/sms-log.
	 */
	public static function register_routes() {
		$permission = static function () {
			return current_user_can( 'manage_options' );
		};
		register_rest_route(
			Rest::NS,
			'/sms-log',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( __CLASS__, 'rest_rows' ),
					'permission_callback' => $permission,
				),
				array(
					'methods'             => \WP_REST_Server::DELETABLE,
					'callback'            => array( __CLASS__, 'rest_clear' ),
					'permission_callback' => $permission,
				),
			)
		);
	}

	/**
	 * Log rows ready for display.
	 *
	 * @return \WP_REST_Response
	 */
	public static function rest_rows() {
		$types     = array(
			'otp'   => __( 'Login code', 'hamista-core' ),
			'order' => __( 'Order update', 'hamista-core' ),
			'admin' => __( 'New order (admin)', 'hamista-core' ),
			'stock' => __( 'Stock alert', 'hamista-core' ),
			'test'  => __( 'Test', 'hamista-core' ),
		);
		$gateways  = OTP::gateways();
		$providers = array();
		$rows      = array();

		foreach ( (array) get_option( self::LOG, array() ) as $row ) {
			if ( ! is_array( $row ) || empty( $row['time'] ) ) {
				continue;
			}
			$slug = isset( $row['provider'] ) ? (string) $row['provider'] : '';
			if ( ! isset( $providers[ $slug ] ) ) {
				$gateway            = isset( $gateways[ $slug ] ) ? OTP::gateway( $slug ) : null;
				$providers[ $slug ] = $gateway && ! is_wp_error( $gateway ) ? $gateway->label() : $slug;
			}
			$type   = isset( $row['type'] ) ? (string) $row['type'] : '';
			$error  = isset( $row['error'] ) ? (string) $row['error'] : '';
			$rows[] = array(
				'time'     => hamista_core_digits( wp_date( 'Y/m/d H:i', (int) $row['time'] ) ),
				'mobile'   => isset( $row['mobile'] ) ? (string) $row['mobile'] : '',
				'type'     => isset( $types[ $type ] ) ? $types[ $type ] : $type,
				'provider' => $providers[ $slug ],
				'ok'       => '' === $error,
				'status'   => '' === $error ? __( 'Sent', 'hamista-core' ) : __( 'Failed', 'hamista-core' ),
				'error'    => $error,
			);
		}
		return rest_ensure_response( array( 'rows' => $rows ) );
	}

	/**
	 * Clear the log.
	 *
	 * @return \WP_REST_Response
	 */
	public static function rest_clear() {
		delete_option( self::LOG );
		return rest_ensure_response(
			array(
				'rows'    => array(),
				'message' => __( 'The SMS log was cleared.', 'hamista-core' ),
			)
		);
	}
}
