<?php
/**
 * Booking: experts, services and appointments for any business that works by
 * appointment (clinics, salons, law firms, consultants, studios…).
 *
 * Experts are a public post type with a weekly schedule; appointments are a
 * private post type managed under the same menu. The wording (doctor, lawyer,
 * stylist…) comes from the business type chosen in Hamista → Booking. Free
 * slots and booking go through Rest, "My appointments" lives in Account_Tab.
 * The module stays idle until it is switched on.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Booking;

defined( 'ABSPATH' ) || exit;

/**
 * Booking.
 */
class Booking {

	const EXPERT      = 'hm_expert';
	const SERVICE     = 'hm_service';
	const APPOINTMENT = 'hm_appointment';
	const REWRITE     = '1';

	/**
	 * Whether the module is on.
	 *
	 * @return bool
	 */
	public static function enabled() {
		return (bool) apply_filters( 'hamista_core/booking_enabled', (bool) hamista_core_option( 'booking_enabled', false ) );
	}

	/**
	 * Hooks.
	 */
	public static function init() {
		if ( ! self::enabled() ) {
			return;
		}
		add_action( 'init', array( __CLASS__, 'register_post_types' ) );
		add_action( 'init', array( __CLASS__, 'maybe_flush' ), 99 );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'assets' ), 20 );
		add_action( 'pre_get_posts', array( __CLASS__, 'archive_order' ) );
		Admin::init();
		Rest::init();
		Account_Tab::init();
	}

	/**
	 * Weekdays in Iranian order: PHP weekday number => label.
	 *
	 * @return array
	 */
	public static function weekdays() {
		return array(
			6 => __( 'Saturday', 'hamista-core' ),
			0 => __( 'Sunday', 'hamista-core' ),
			1 => __( 'Monday', 'hamista-core' ),
			2 => __( 'Tuesday', 'hamista-core' ),
			3 => __( 'Wednesday', 'hamista-core' ),
			4 => __( 'Thursday', 'hamista-core' ),
			5 => __( 'Friday', 'hamista-core' ),
		);
	}

	/**
	 * Appointment statuses.
	 *
	 * @return array
	 */
	public static function statuses() {
		return array(
			'pending'   => __( 'Awaiting confirmation', 'hamista-core' ),
			'confirmed' => __( 'Confirmed', 'hamista-core' ),
			'done'      => _x( 'Done', 'appointment status', 'hamista-core' ),
			'cancelled' => __( 'Cancelled', 'hamista-core' ),
		);
	}

	/**
	 * Business types and their wording.
	 *
	 * @return array[] type => { title, one, many, group_one, group_many, fee, license, slug, group_slug }
	 */
	public static function presets() {
		$presets = array(
			'general'    => array(
				'title'      => __( 'General services', 'hamista-core' ),
				'one'        => __( 'Expert', 'hamista-core' ),
				'many'       => __( 'Experts', 'hamista-core' ),
				'group_one'  => __( 'Service', 'hamista-core' ),
				'group_many' => __( 'Services', 'hamista-core' ),
				'fee'        => __( 'Fee', 'hamista-core' ),
				'license'    => __( 'Licence number', 'hamista-core' ),
				'slug'       => 'experts',
				'group_slug' => 'service',
			),
			'clinic'     => array(
				'title'      => __( 'Clinic and medical', 'hamista-core' ),
				'one'        => __( 'Doctor', 'hamista-core' ),
				'many'       => __( 'Doctors', 'hamista-core' ),
				'group_one'  => __( 'Specialty', 'hamista-core' ),
				'group_many' => __( 'Specialties', 'hamista-core' ),
				'fee'        => __( 'Visit fee', 'hamista-core' ),
				'license'    => __( 'Medical council number', 'hamista-core' ),
				'slug'       => 'doctors',
				'group_slug' => 'specialty',
			),
			'beauty'     => array(
				'title'      => __( 'Beauty salon', 'hamista-core' ),
				'one'        => __( 'Stylist', 'hamista-core' ),
				'many'       => __( 'Stylists', 'hamista-core' ),
				'group_one'  => __( 'Service', 'hamista-core' ),
				'group_many' => __( 'Services', 'hamista-core' ),
				'fee'        => __( 'Price', 'hamista-core' ),
				'license'    => __( 'Licence number', 'hamista-core' ),
				'slug'       => 'stylists',
				'group_slug' => 'service',
			),
			'legal'      => array(
				'title'      => __( 'Law firm', 'hamista-core' ),
				'one'        => __( 'Lawyer', 'hamista-core' ),
				'many'       => __( 'Lawyers', 'hamista-core' ),
				'group_one'  => __( 'Practice area', 'hamista-core' ),
				'group_many' => __( 'Practice areas', 'hamista-core' ),
				'fee'        => __( 'Consultation fee', 'hamista-core' ),
				'license'    => __( 'Bar licence number', 'hamista-core' ),
				'slug'       => 'lawyers',
				'group_slug' => 'practice',
			),
			'consulting' => array(
				'title'      => __( 'Consulting and coaching', 'hamista-core' ),
				'one'        => __( 'Consultant', 'hamista-core' ),
				'many'       => __( 'Consultants', 'hamista-core' ),
				'group_one'  => _x( 'Field', 'area of work', 'hamista-core' ),
				'group_many' => _x( 'Fields', 'areas of work', 'hamista-core' ),
				'fee'        => __( 'Session fee', 'hamista-core' ),
				'license'    => __( 'Licence number', 'hamista-core' ),
				'slug'       => 'consultants',
				'group_slug' => 'field',
			),
		);
		/**
		 * Business types offered in Hamista → Booking.
		 *
		 * @param array $presets Presets.
		 */
		return (array) apply_filters( 'hamista_core/booking_presets', $presets );
	}

	/**
	 * Wording for the chosen business type (custom names override it).
	 *
	 * @return array See presets().
	 */
	public static function labels() {
		static $labels = null;
		if ( null !== $labels ) {
			return $labels;
		}
		$presets = self::presets();
		$type    = (string) hamista_core_option( 'booking_type', 'general' );
		$labels  = $presets[ $type ] ?? $presets['general'];
		foreach ( array( 'one', 'many', 'group_one', 'group_many' ) as $key ) {
			$custom = trim( (string) hamista_core_option( 'booking_label_' . $key, '' ) );
			if ( '' !== $custom ) {
				$labels[ $key ] = $custom;
			}
		}
		return $labels;
	}

	/**
	 * One label.
	 *
	 * @param string $key one|many|group_one|group_many|fee|license.
	 * @return string
	 */
	public static function label( $key ) {
		return (string) ( self::labels()[ $key ] ?? '' );
	}

	/**
	 * Post types and taxonomy.
	 */
	public static function register_post_types() {
		$one        = self::label( 'one' );
		$many       = self::label( 'many' );
		$group_one  = self::label( 'group_one' );
		$group_many = self::label( 'group_many' );
		register_post_type(
			self::EXPERT,
			array(
				'labels'        => array(
					'name'               => $many,
					'singular_name'      => $one,
					/* translators: %s: e.g. "Doctor", "Lawyer" */
					'add_new'            => sprintf( __( 'Add %s', 'hamista-core' ), $one ),
					/* translators: %s: e.g. "Doctor", "Lawyer" */
					'add_new_item'       => sprintf( __( 'Add %s', 'hamista-core' ), $one ),
					/* translators: %s: e.g. "Doctor", "Lawyer" */
					'edit_item'          => sprintf( __( 'Edit %s', 'hamista-core' ), $one ),
					'view_item'          => __( 'View profile', 'hamista-core' ),
					/* translators: %s: e.g. "Doctors", "Lawyers" */
					'search_items'       => sprintf( __( 'Search %s', 'hamista-core' ), $many ),
					'not_found'          => __( 'Nothing found.', 'hamista-core' ),
					'not_found_in_trash' => __( 'Nothing in the trash.', 'hamista-core' ),
					/* translators: %s: e.g. "Doctors", "Lawyers" */
					'all_items'          => sprintf( __( 'All %s', 'hamista-core' ), $many ),
					'menu_name'          => __( 'Booking', 'hamista-core' ),
				),
				'public'        => true,
				'has_archive'   => true,
				'menu_icon'     => 'dashicons-calendar-alt',
				'menu_position' => 22,
				'show_in_rest'  => true,
				'supports'      => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes', 'elementor' ),
				'rewrite'       => array(
					'slug'       => self::slug(),
					'with_front' => false,
				),
			)
		);
		register_taxonomy(
			self::SERVICE,
			self::EXPERT,
			array(
				'labels'            => array(
					'name'          => $group_many,
					'singular_name' => $group_one,
					/* translators: %s: e.g. "Specialty", "Service" */
					'add_new_item'  => sprintf( __( 'Add %s', 'hamista-core' ), $group_one ),
					/* translators: %s: e.g. "Specialties", "Services" */
					'all_items'     => sprintf( __( 'All %s', 'hamista-core' ), $group_many ),
				),
				'hierarchical'      => true,
				'show_admin_column' => true,
				'show_in_rest'      => true,
				'rewrite'           => array(
					'slug'       => self::slug( 'group' ),
					'with_front' => false,
				),
			)
		);
		register_post_type(
			self::APPOINTMENT,
			array(
				'labels'          => array(
					'name'          => __( 'Appointments', 'hamista-core' ),
					'singular_name' => __( 'Appointment', 'hamista-core' ),
					'edit_item'     => __( 'Appointment details', 'hamista-core' ),
					'search_items'  => __( 'Search appointments', 'hamista-core' ),
					'not_found'     => __( 'No appointments yet.', 'hamista-core' ),
					'all_items'     => __( 'Appointments', 'hamista-core' ),
				),
				'public'          => false,
				'show_ui'         => true,
				'show_in_menu'    => 'edit.php?post_type=' . self::EXPERT,
				'capability_type' => 'post',
				'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
				'map_meta_cap'    => true,
				'supports'        => false,
			)
		);
	}

	/**
	 * URL base of expert pages or of their groups.
	 *
	 * @param string $which expert|group.
	 * @return string
	 */
	public static function slug( $which = 'expert' ) {
		if ( 'group' === $which ) {
			return sanitize_title( (string) apply_filters( 'hamista_core/service_slug', self::label( 'group_slug' ) ? self::label( 'group_slug' ) : 'service' ) );
		}
		return sanitize_title( (string) apply_filters( 'hamista_core/expert_slug', self::label( 'slug' ) ? self::label( 'slug' ) : 'experts' ) );
	}

	/**
	 * Refresh permalinks after the module is switched on or the business type
	 * (and so the URL base) changes.
	 */
	public static function maybe_flush() {
		$version = self::REWRITE . '|' . self::slug() . '|' . self::slug( 'group' );
		if ( get_option( 'hamista_booking_rewrite' ) !== $version ) {
			flush_rewrite_rules( false );
			update_option( 'hamista_booking_rewrite', $version, true );
		}
	}

	/**
	 * Expert archives follow the manual order (Order field), then the name.
	 *
	 * @param \WP_Query $query Query.
	 */
	public static function archive_order( $query ) {
		if ( is_admin() || ! $query->is_main_query() || $query->get( 'orderby' ) ) {
			return;
		}
		if ( $query->is_post_type_archive( self::EXPERT ) || $query->is_tax( self::SERVICE ) ) {
			$query->set(
				'orderby',
				array(
					'menu_order' => 'ASC',
					'title'      => 'ASC',
				)
			);
		}
	}

	/**
	 * Styles (and the filter script) on expert pages rendered by the theme.
	 */
	public static function assets() {
		View::register_assets();
		if ( is_post_type_archive( self::EXPERT ) || is_tax( self::SERVICE ) || is_singular( self::EXPERT ) ) {
			wp_enqueue_style( 'hamista-widgets' );
			wp_enqueue_style( 'hamista-booking' );
			wp_enqueue_script( 'hamista-motion' );
		}
	}

	/* ---------------------------------------------------------------------
	 * Experts
	 * ------------------------------------------------------------------ */

	/**
	 * Profile fields: key => label.
	 *
	 * @return array
	 */
	public static function expert_fields() {
		return array(
			'role'       => __( 'Title shown under the name', 'hamista-core' ),
			'license'    => self::label( 'license' ),
			'experience' => __( 'Years of experience', 'hamista-core' ),
			'fee'        => self::label( 'fee' ),
			'location'   => __( 'Address or room', 'hamista-core' ),
		);
	}

	/**
	 * A profile field.
	 *
	 * @param int    $id  Expert ID.
	 * @param string $key Field.
	 * @return string
	 */
	public static function field( $id, $key ) {
		return (string) get_post_meta( $id, '_hm_' . $key, true );
	}

	/**
	 * Weekly schedule: weekday => [ on, from, to, from2, to2 ].
	 *
	 * The second pair is an optional evening shift (empty when unused): many
	 * offices work mornings, close at midday and open again in the evening.
	 *
	 * @param int $id Expert ID.
	 * @return array
	 */
	public static function schedule( $id ) {
		$saved = get_post_meta( $id, '_hm_schedule', true );
		$saved = is_array( $saved ) ? $saved : array();
		$out   = array();
		foreach ( array_keys( self::weekdays() ) as $day ) {
			$row         = $saved[ $day ] ?? array();
			$out[ $day ] = array(
				'on'    => ! empty( $row['on'] ),
				'from'  => self::clean_time( $row['from'] ?? '09:00', '09:00' ),
				'to'    => self::clean_time( $row['to'] ?? '13:00', '13:00' ),
				'from2' => self::clean_time( $row['from2'] ?? '' ),
				'to2'   => self::clean_time( $row['to2'] ?? '' ),
			);
		}
		return $out;
	}

	/**
	 * Working ranges of one schedule row: list of [ from, to ].
	 *
	 * @param array $row Row from schedule().
	 * @return array[]
	 */
	public static function ranges( $row ) {
		$out = array();
		if ( empty( $row['on'] ) ) {
			return $out;
		}
		foreach ( array( array( 'from', 'to' ), array( 'from2', 'to2' ) ) as $pair ) {
			$from = $row[ $pair[0] ] ?? '';
			$to   = $row[ $pair[1] ] ?? '';
			if ( $from && $to && $from < $to ) {
				$out[] = array( $from, $to );
			}
		}
		return $out;
	}

	/**
	 * Slot lengths offered in the schedule box (minutes).
	 *
	 * @return int[]
	 */
	public static function slot_lengths() {
		return array( 10, 15, 20, 30, 45, 60, 90 );
	}

	/**
	 * Minutes per appointment.
	 *
	 * @param int $id Expert ID.
	 * @return int
	 */
	public static function slot_length( $id ) {
		$len = (int) get_post_meta( $id, '_hm_slot', true );
		return in_array( $len, self::slot_lengths(), true ) ? $len : 30;
	}

	/**
	 * HH:MM or a fallback.
	 *
	 * @param string $time     Input.
	 * @param string $fallback Fallback.
	 * @return string
	 */
	public static function clean_time( $time, $fallback = '' ) {
		$time = hamista_core_latin_digits( (string) $time );
		return preg_match( '/^([01]\d|2[0-3]):[0-5]\d$/', $time ) ? $time : $fallback;
	}

	/**
	 * Services (or specialties, practice areas…) of an expert.
	 *
	 * @param int $id Expert ID.
	 * @return \WP_Term[]
	 */
	public static function groups( $id ) {
		$terms = get_the_terms( $id, self::SERVICE );
		return $terms && ! is_wp_error( $terms ) ? $terms : array();
	}

	/**
	 * Booking page URL, with the expert preselected (Hamista → Booking → booking page).
	 *
	 * @param int $id Expert ID (0 for no preselection).
	 * @return string
	 */
	public static function booking_url( $id = 0 ) {
		$page = (int) hamista_core_option( 'booking_page', 0 );
		$url  = $page && 'publish' === get_post_status( $page ) ? get_permalink( $page ) : '';
		if ( ! $url ) {
			return $id ? get_permalink( $id ) . '#booking' : '';
		}
		return $id ? add_query_arg( 'expert', $id, $url ) : $url;
	}

	/**
	 * Expert card used by the Experts widget and the archive.
	 *
	 * @param int   $id   Expert ID.
	 * @param array $args style (card|minimal|row), button (bool).
	 * @return string
	 */
	public static function card( $id, $args = array() ) {
		$args  = wp_parse_args(
			$args,
			array(
				'style'  => 'card',
				'button' => true,
			)
		);
		$terms = self::groups( $id );
		$slugs = array();
		foreach ( $terms as $term ) {
			$slugs[] = 'hm-sv-' . $term->term_id;
		}
		$role  = self::field( $id, 'role' );
		$years = self::field( $id, 'experience' );
		$photo = get_the_post_thumbnail(
			$id,
			'medium_large',
			array(
				'class'    => 'hm-expert__img',
				'alt'      => get_the_title( $id ),
				'loading'  => 'lazy',
				'decoding' => 'async',
			)
		);
		$html  = '<article class="hm-expert hm-expert--' . esc_attr( $args['style'] ) . '" data-terms="' . esc_attr( implode( ' ', $slugs ) ) . '">';
		$html .= '<a class="hm-expert__media" href="' . esc_url( get_permalink( $id ) ) . '" tabindex="-1" aria-hidden="true">' . ( $photo ? $photo : '<span class="hm-expert__blank">' . hamista_core_icon( 'user', array( 'size' => 34 ) ) . '</span>' ) . '</a>';
		$html .= '<div class="hm-expert__body">';
		$html .= '<h3 class="hm-expert__name"><a href="' . esc_url( get_permalink( $id ) ) . '">' . esc_html( get_the_title( $id ) ) . '</a></h3>';
		$html .= '<p class="hm-expert__role">' . esc_html( $role ? $role : implode( '، ', wp_list_pluck( $terms, 'name' ) ) ) . '</p>';
		if ( $years ) {
			/* translators: %s: years of experience */
			$html .= '<p class="hm-expert__meta">' . hamista_core_icon( 'award', array( 'size' => 15 ) ) . esc_html( sprintf( __( '%s years of experience', 'hamista-core' ), hamista_core_digits( $years ) ) ) . '</p>';
		}
		$booking = $args['button'] ? self::booking_url( $id ) : '';
		if ( $booking ) {
			$html .= '<a class="hm-btn hm-btn--sm hm-expert__book" href="' . esc_url( $booking ) . '">' . hamista_core_icon( 'calendar', array( 'size' => 16 ) ) . esc_html__( 'Book an appointment', 'hamista-core' ) . '</a>';
		}
		return $html . '</div></article>';
	}

	/* ---------------------------------------------------------------------
	 * Dates
	 * ------------------------------------------------------------------ */

	/**
	 * Jalali label for a Y-m-d date, e.g. "شنبه ۱۵ مهر".
	 *
	 * @param string $date   Y-m-d.
	 * @param string $format Jalali format (see Jalali::format()).
	 * @return string
	 */
	public static function date_label( $date, $format = 'l j F' ) {
		$dt = date_create( $date, wp_timezone() );
		if ( ! $dt ) {
			return $date;
		}
		if ( 0 === strpos( determine_locale(), 'fa' ) && class_exists( '\Hamista\Core\Jalali\Jalali' ) ) {
			return hamista_core_digits( \Hamista\Core\Jalali\Jalali::format( $format, $dt ) );
		}
		return wp_date( 'l j F', $dt->getTimestamp() );
	}

	/**
	 * Display time HH:MM in the site's digits.
	 *
	 * @param string $time HH:MM.
	 * @return string
	 */
	public static function time_label( $time ) {
		return hamista_core_digits( $time );
	}
}
