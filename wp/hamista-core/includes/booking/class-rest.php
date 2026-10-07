<?php
/**
 * Booking: free time slots and the public booking endpoints.
 *
 * GET  /hamista/v1/booking/days?expert=ID → the next bookable days with their slots
 * POST /hamista/v1/booking/book            → create an appointment
 * POST /hamista/v1/booking/cancel          → cancel one of the visitor's appointments
 * GET  /hamista/v1/booking/nonce           → a fresh nonce for cached pages
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Booking;

use Hamista\Core\Auth\OTP;

defined( 'ABSPATH' ) || exit;

/**
 * Booking REST routes.
 */
class Rest {

	const NS    = 'hamista/v1';
	const NONCE = 'hamista_booking';

	/**
	 * Hooks.
	 */
	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'routes' ) );
	}

	/**
	 * REST routes.
	 */
	public static function routes() {
		$public = '__return_true';
		register_rest_route(
			self::NS,
			'/booking/days',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'rest_days' ),
				'permission_callback' => $public,
				'args'                => array(
					'expert' => array(
						'type'     => 'integer',
						'required' => true,
					),
				),
			)
		);
		register_rest_route(
			self::NS,
			'/booking/nonce',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => static function () {
					return rest_ensure_response( array( 'nonce' => wp_create_nonce( self::NONCE ) ) );
				},
				'permission_callback' => $public,
			)
		);
		register_rest_route(
			self::NS,
			'/booking/book',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'rest_book' ),
				'permission_callback' => $public,
			)
		);
		register_rest_route(
			self::NS,
			'/booking/cancel',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'rest_cancel' ),
				'permission_callback' => static function () {
					return is_user_logged_in() ? true : self::fail( 'hamista_login_required', __( 'Please log in first; it takes a few seconds with your mobile number.', 'hamista-core' ), 401 );
				},
			)
		);
	}

	/* ---------------------------------------------------------------------
	 * Availability
	 * ------------------------------------------------------------------ */

	/**
	 * How many days ahead visitors can book.
	 *
	 * @return int
	 */
	public static function days_ahead() {
		return max( 1, min( 60, (int) hamista_core_option( 'booking_days', 14 ) ) );
	}

	/**
	 * Booked times of an expert on a date (cancelled ones free the slot again).
	 *
	 * @param int    $expert Expert ID.
	 * @param string $date   Y-m-d.
	 * @return string[] HH:MM list.
	 */
	public static function booked( $expert, $date ) {
		$ids   = get_posts(
			array(
				'post_type'      => Booking::APPOINTMENT,
				'post_status'    => 'publish',
				'posts_per_page' => 100,
				'fields'         => 'ids',
				'no_found_rows'  => true,
				'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					array(
						'key'   => '_hm_expert',
						'value' => (int) $expert,
					),
					array(
						'key'   => '_hm_date',
						'value' => $date,
					),
					array(
						'key'     => '_hm_status',
						'value'   => 'cancelled',
						'compare' => '!=',
					),
				),
			)
		);
		$times = array();
		foreach ( $ids as $id ) {
			$times[] = (string) get_post_meta( $id, '_hm_time', true );
		}
		return $times;
	}

	/**
	 * Free slots of an expert on one date.
	 *
	 * @param int    $expert Expert ID.
	 * @param string $date   Y-m-d.
	 * @return string[] HH:MM list.
	 */
	public static function slots( $expert, $date ) {
		$tz  = wp_timezone();
		$day = date_create_immutable( $date . ' 00:00', $tz );
		if ( ! $day ) {
			return array();
		}
		$row    = Booking::schedule( $expert )[ (int) $day->format( 'w' ) ] ?? null;
		$ranges = $row ? Booking::ranges( $row ) : array();
		if ( ! $ranges ) {
			return array();
		}
		$len      = Booking::slot_length( $expert );
		$notice   = max( 0, (int) hamista_core_option( 'booking_notice', 2 ) ) * HOUR_IN_SECONDS;
		$taken    = array_flip( self::booked( $expert, $date ) );
		$step     = '+' . $len . ' minutes';
		$out      = array();
		$earliest = time() + $notice;
		foreach ( $ranges as $range ) {
			$t  = date_create_immutable( $date . ' ' . $range[0], $tz );
			$to = date_create_immutable( $date . ' ' . $range[1], $tz );
			while ( $t && $to ) {
				$end = $t->modify( $step );
				if ( $end > $to ) {
					break;
				}
				$hm = $t->format( 'H:i' );
				if ( $t->getTimestamp() >= $earliest && ! isset( $taken[ $hm ] ) ) {
					$out[] = $hm;
				}
				$t = $end;
			}
		}
		/**
		 * Free slots of an expert on a date (HH:MM list).
		 *
		 * @param string[] $out    Slots.
		 * @param int      $expert Expert ID.
		 * @param string   $date   Y-m-d.
		 */
		$out = (array) apply_filters( 'hamista_core/booking_slots', array_values( array_unique( $out ) ), $expert, $date );
		return $out;
	}

	/**
	 * Bookable days from today with their free slots.
	 *
	 * @param int $expert Expert ID.
	 * @return array[] { date, open, weekday, day, slots[] }
	 */
	public static function days( $expert ) {
		$days     = array();
		$schedule = Booking::schedule( $expert );
		$start    = new \DateTimeImmutable( 'today', wp_timezone() );
		$count    = self::days_ahead();
		for ( $i = 0; $i < $count; $i++ ) {
			$day    = $start->modify( '+' . $i . ' days' );
			$date   = $day->format( 'Y-m-d' );
			$slots  = self::slots( $expert, $date );
			$days[] = array(
				'date'    => $date,
				'open'    => (bool) Booking::ranges( $schedule[ (int) $day->format( 'w' ) ] ?? array() ),
				'weekday' => Booking::date_label( $date, 'l' ),
				'day'     => Booking::date_label( $date, 'j F' ),
				'slots'   => array_map(
					static function ( $time ) {
						return array(
							'time'  => $time,
							'label' => Booking::time_label( $time ),
						);
					},
					$slots
				),
			);
		}
		return $days;
	}

	/**
	 * GET /booking/days.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public static function rest_days( \WP_REST_Request $request ) {
		$expert = (int) $request->get_param( 'expert' );
		if ( Booking::EXPERT !== get_post_type( $expert ) || 'publish' !== get_post_status( $expert ) ) {
			return new \WP_Error( 'hamista_no_expert', __( 'Booking is not available for this person right now.', 'hamista-core' ), array( 'status' => 404 ) );
		}
		$response = rest_ensure_response(
			array(
				'expert' => $expert,
				'days'   => self::days( $expert ),
			)
		);
		$response->header( 'Cache-Control', 'no-store' );
		return $response;
	}

	/* ---------------------------------------------------------------------
	 * Booking
	 * ------------------------------------------------------------------ */

	/**
	 * Error response.
	 *
	 * @param string $code    Code.
	 * @param string $message Message.
	 * @param int    $status  HTTP status.
	 * @return \WP_Error
	 */
	private static function fail( $code, $message, $status = 400 ) {
		return new \WP_Error( $code, $message, array( 'status' => $status ) );
	}

	/**
	 * POST /booking/book { expert, date, time, name, mobile, note, nonce }.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public static function rest_book( \WP_REST_Request $request ) {
		if ( ! wp_verify_nonce( (string) $request->get_param( 'nonce' ), self::NONCE ) ) {
			return self::fail( 'hamista_bad_nonce', __( 'Your session expired. Please try again.', 'hamista-core' ), 403 );
		}
		if ( '' !== trim( (string) $request->get_param( 'website' ) ) ) {
			return self::fail( 'hamista_spam', __( 'Something went wrong. Please try again.', 'hamista-core' ) );
		}
		if ( class_exists( OTP::class ) && OTP::throttle( 'booking', 6 ) ) {
			return self::fail( 'hamista_too_many', __( 'Too many requests. Please try again in a few minutes.', 'hamista-core' ), 429 );
		}
		if ( hamista_core_option( 'booking_login', false ) && ! is_user_logged_in() ) {
			return self::fail( 'hamista_login_required', __( 'Please log in first; it takes a few seconds with your mobile number.', 'hamista-core' ), 401 );
		}

		$expert = (int) $request->get_param( 'expert' );
		$date   = (string) $request->get_param( 'date' );
		$time   = Booking::clean_time( $request->get_param( 'time' ) );
		$name   = trim( sanitize_text_field( (string) $request->get_param( 'name' ) ) );
		$note   = trim( sanitize_textarea_field( (string) $request->get_param( 'note' ) ) );
		$mobile = class_exists( OTP::class ) ? OTP::normalize_mobile( $request->get_param( 'mobile' ) ) : preg_replace( '/\D+/', '', (string) $request->get_param( 'mobile' ) );

		if ( Booking::EXPERT !== get_post_type( $expert ) || 'publish' !== get_post_status( $expert ) ) {
			return self::fail( 'hamista_no_expert', __( 'Booking is not available for this person right now.', 'hamista-core' ), 404 );
		}
		if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date ) || ! $time ) {
			return self::fail( 'hamista_bad_slot', __( 'Choose a day and a time.', 'hamista-core' ) );
		}
		if ( mb_strlen( $name ) < 2 ) {
			return self::fail( 'hamista_bad_name', __( 'Please enter your full name.', 'hamista-core' ) );
		}
		if ( '' === $mobile ) {
			return self::fail( 'hamista_bad_mobile', __( 'Please enter a valid mobile number, like 09121234567.', 'hamista-core' ) );
		}

		// One booking per slot even if two people press the button together.
		$lock = 'hm_slot_' . md5( $expert . '|' . $date . '|' . $time );
		if ( ! add_option( $lock, time(), '', false ) ) {
			if ( (int) get_option( $lock ) > time() - 30 ) {
				return self::fail( 'hamista_slot_taken', __( 'Someone just booked this time. Please choose another one.', 'hamista-core' ), 409 );
			}
			update_option( $lock, time(), false );
		}
		if ( ! in_array( $time, self::slots( $expert, $date ), true ) ) {
			delete_option( $lock );
			return self::fail( 'hamista_slot_taken', __( 'This time is no longer free. Please choose another one.', 'hamista-core' ), 409 );
		}

		$id = wp_insert_post(
			array(
				'post_type'   => Booking::APPOINTMENT,
				'post_status' => 'publish',
				'post_title'  => sprintf( '%s — %s %s', $name, Booking::date_label( $date, 'j F' ), Booking::time_label( $time ) ),
				'post_author' => get_current_user_id(),
				'meta_input'  => array(
					'_hm_expert' => $expert,
					'_hm_date'   => $date,
					'_hm_time'   => $time,
					'_hm_name'   => $name,
					'_hm_mobile' => $mobile,
					'_hm_note'   => $note,
					'_hm_user'   => get_current_user_id(),
					'_hm_status' => hamista_core_option( 'booking_auto_confirm', false ) ? 'confirmed' : 'pending',
				),
			),
			true
		);
		delete_option( $lock );
		if ( is_wp_error( $id ) ) {
			return self::fail( 'hamista_save_failed', __( 'Your appointment could not be saved. Please try again.', 'hamista-core' ), 500 );
		}

		self::notify( $id );

		/**
		 * After an appointment is booked.
		 *
		 * @param int $id Appointment ID.
		 */
		do_action( 'hamista_core/appointment_booked', $id );

		return rest_ensure_response(
			array(
				'ok'      => true,
				'id'      => $id,
				'message' => sprintf(
					/* translators: 1: expert name, 2: date, 3: time */
					__( 'Your appointment with %1$s on %2$s at %3$s is booked. We will confirm it by phone or SMS.', 'hamista-core' ),
					get_the_title( $expert ),
					Booking::date_label( $date ),
					Booking::time_label( $time )
				),
			)
		);
	}

	/**
	 * Email the reception about a new appointment.
	 *
	 * @param int $id Appointment ID.
	 */
	private static function notify( $id ) {
		$to = sanitize_email( (string) hamista_core_option( 'booking_email', '' ) );
		$to = $to ? $to : get_option( 'admin_email' );
		if ( ! $to ) {
			return;
		}
		$expert = (int) get_post_meta( $id, '_hm_expert', true );
		$lines  = array(
			Booking::label( 'one' ) . ': ' . get_the_title( $expert ),
			__( 'Date', 'hamista-core' ) . ': ' . Booking::date_label( (string) get_post_meta( $id, '_hm_date', true ) ),
			__( 'Time', 'hamista-core' ) . ': ' . Booking::time_label( (string) get_post_meta( $id, '_hm_time', true ) ),
			__( 'Name', 'hamista-core' ) . ': ' . get_post_meta( $id, '_hm_name', true ),
			__( 'Mobile', 'hamista-core' ) . ': ' . get_post_meta( $id, '_hm_mobile', true ),
			__( 'Notes', 'hamista-core' ) . ': ' . get_post_meta( $id, '_hm_note', true ),
			'',
			admin_url( 'post.php?post=' . $id . '&action=edit' ),
		);
		/* translators: %s: site name */
		wp_mail( $to, sprintf( __( '[%s] New appointment', 'hamista-core' ), wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES ) ), implode( "\n", $lines ) );
	}

	/**
	 * Whether the current user owns an appointment.
	 *
	 * @param int $id Appointment ID.
	 * @return bool
	 */
	public static function owns( $id ) {
		$user = get_current_user_id();
		return $user && Booking::APPOINTMENT === get_post_type( $id ) && (int) get_post_meta( $id, '_hm_user', true ) === $user;
	}

	/**
	 * Whether an appointment can still be cancelled by the visitor.
	 *
	 * @param int $id Appointment ID.
	 * @return bool
	 */
	public static function can_cancel( $id ) {
		$status = (string) get_post_meta( $id, '_hm_status', true );
		if ( in_array( $status, array( 'cancelled', 'done' ), true ) ) {
			return false;
		}
		$at = date_create_immutable( get_post_meta( $id, '_hm_date', true ) . ' ' . get_post_meta( $id, '_hm_time', true ), wp_timezone() );
		return $at && $at->getTimestamp() - time() > max( 0, (int) hamista_core_option( 'booking_cancel_hours', 24 ) ) * HOUR_IN_SECONDS;
	}

	/**
	 * POST /booking/cancel { id } (logged-in owner, X-WP-Nonce).
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public static function rest_cancel( \WP_REST_Request $request ) {
		$id = (int) $request->get_param( 'id' );
		if ( ! self::owns( $id ) ) {
			return self::fail( 'hamista_forbidden', __( 'You can only cancel your own appointments.', 'hamista-core' ), 403 );
		}
		if ( ! self::can_cancel( $id ) ) {
			return self::fail( 'hamista_too_late', __( 'This appointment can no longer be cancelled online. Please call us.', 'hamista-core' ) );
		}
		update_post_meta( $id, '_hm_status', 'cancelled' );
		do_action( 'hamista_core/appointment_cancelled', $id );
		return rest_ensure_response(
			array(
				'ok'      => true,
				'message' => __( 'Your appointment was cancelled.', 'hamista-core' ),
			)
		);
	}
}
