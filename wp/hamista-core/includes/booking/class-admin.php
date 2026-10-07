<?php
/**
 * Booking screens in the dashboard: the expert profile and weekly hours boxes,
 * the appointments list (filters, status changes, pending count) and the
 * appointment details box.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Booking;

defined( 'ABSPATH' ) || exit;

/**
 * Admin.
 */
class Admin {

	const ACTION = 'hamista_appointment_status';
	const COUNT  = 'hamista_booking_pending';

	/**
	 * Hooks.
	 */
	public static function init() {
		if ( ! is_admin() ) {
			add_action( 'hamista_core/appointment_booked', array( __CLASS__, 'forget_count' ) );
			add_action( 'hamista_core/appointment_cancelled', array( __CLASS__, 'forget_count' ) );
			return;
		}
		add_filter( 'use_block_editor_for_post_type', array( __CLASS__, 'classic_editor' ), 10, 2 );
		add_action( 'add_meta_boxes_' . Booking::EXPERT, array( __CLASS__, 'expert_boxes' ) );
		add_action( 'save_post_' . Booking::EXPERT, array( __CLASS__, 'save_expert' ), 10, 2 );
		add_action( 'add_meta_boxes_' . Booking::APPOINTMENT, array( __CLASS__, 'appointment_boxes' ) );
		add_action( 'save_post_' . Booking::APPOINTMENT, array( __CLASS__, 'save_appointment' ), 10, 2 );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'styles' ) );
		add_action( 'admin_menu', array( __CLASS__, 'pending_bubble' ), 99 );
		add_action( 'admin_post_' . self::ACTION, array( __CLASS__, 'change_status' ) );
		add_action( 'admin_notices', array( __CLASS__, 'notice' ) );

		$screen = 'edit-' . Booking::APPOINTMENT;
		add_filter( 'manage_' . Booking::APPOINTMENT . '_posts_columns', array( __CLASS__, 'columns' ) );
		add_action( 'manage_' . Booking::APPOINTMENT . '_posts_custom_column', array( __CLASS__, 'column' ), 10, 2 );
		add_filter( 'manage_' . $screen . '_sortable_columns', array( __CLASS__, 'sortable' ) );
		add_filter( 'views_' . $screen, array( __CLASS__, 'views' ) );
		add_filter( 'bulk_actions-' . $screen, array( __CLASS__, 'bulk_actions' ) );
		add_filter( 'handle_bulk_actions-' . $screen, array( __CLASS__, 'handle_bulk' ), 10, 3 );
		add_filter( 'post_row_actions', array( __CLASS__, 'row_actions' ), 10, 2 );
		add_action( 'restrict_manage_posts', array( __CLASS__, 'filters' ) );
		add_action( 'pre_get_posts', array( __CLASS__, 'query' ) );
		add_filter( 'manage_' . Booking::EXPERT . '_posts_columns', array( __CLASS__, 'expert_columns' ) );
		add_action( 'manage_' . Booking::EXPERT . '_posts_custom_column', array( __CLASS__, 'expert_column' ), 10, 2 );
	}

	/* ---------------------------------------------------------------------
	 * Styles
	 * ------------------------------------------------------------------ */

	/**
	 * A few rules for the boxes and the list, only on booking screens.
	 */
	public static function styles() {
		$screen = get_current_screen();
		if ( ! $screen || ! in_array( $screen->post_type, array( Booking::EXPERT, Booking::APPOINTMENT ), true ) ) {
			return;
		}
		wp_register_style( 'hamista-booking-admin', false, array(), HAMISTA_CORE_VERSION );
		wp_enqueue_style( 'hamista-booking-admin' );
		wp_add_inline_style(
			'hamista-booking-admin',
			'.hm-hours{width:100%;border-collapse:collapse}.hm-hours th,.hm-hours td{padding:8px 6px;text-align:start;vertical-align:middle;border-bottom:1px solid #f0f0f1}.hm-hours tr:last-child td{border-bottom:0}.hm-hours th{font-weight:600;color:#50575e;font-size:12px}.hm-hours select{min-width:88px}.hm-ap-extra{margin-top:12px}.hm-ap-extra th{width:30%;font-weight:600}.hm-ap-time select{min-width:110px}.hm-hours__day{font-weight:600;white-space:nowrap}.hm-hours tr.is-off td:not(:first-child){opacity:.45}.hm-hours__sep{color:#8c8f94;padding-inline:4px}.hm-booking-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px 18px}.hm-booking-row label{display:block;font-weight:600;margin-bottom:5px}.hm-booking-row .widefat{max-width:100%}.hm-booking-note{color:#646970;margin:10px 0 0}'
			. '.hm-status{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:600;line-height:1.6;background:#f0f0f1;color:#3c434a}.hm-status::before{content:"";width:7px;height:7px;border-radius:50%;background:currentColor}.hm-status--pending{background:#fcf3dc;color:#8a5a00}.hm-status--confirmed{background:#e3f1e8;color:#1f6b3a}.hm-status--done{background:#e6eef9;color:#1d4f91}.hm-status--cancelled{background:#fbe9e9;color:#a12a2a}'
			. '.column-hm_when{width:16%}.column-hm_status{width:13%}.column-hm_mobile{width:12%}.column-hm_mobile bdi{direction:ltr;unicode-bidi:isolate}.hm-when__day{display:block;font-weight:600}.hm-when__time{color:#646970}.column-hm_photo{width:52px}.column-hm_photo img{width:40px;height:40px;border-radius:50%;object-fit:cover}.hm-days{display:flex;gap:3px;flex-wrap:wrap}.hm-days span{font-size:11px;padding:1px 6px;border-radius:4px;background:#e3f1e8;color:#1f6b3a}'
		);
	}

	/**
	 * Profiles are mostly fields and hours, which read better in the classic
	 * editor than at the foot of the block editor.
	 *
	 * @param bool   $use       Use the block editor.
	 * @param string $post_type Post type.
	 * @return bool
	 */
	public static function classic_editor( $use, $post_type ) {
		return Booking::EXPERT === $post_type ? (bool) apply_filters( 'hamista_core/expert_block_editor', false ) : $use;
	}

	/* ---------------------------------------------------------------------
	 * Expert boxes
	 * ------------------------------------------------------------------ */

	/**
	 * Expert meta boxes.
	 */
	public static function expert_boxes() {
		add_meta_box( 'hm-expert-profile', __( 'Profile', 'hamista-core' ), array( __CLASS__, 'profile_box' ), Booking::EXPERT, 'normal', 'high' );
		add_meta_box( 'hm-expert-hours', __( 'Weekly hours', 'hamista-core' ), array( __CLASS__, 'hours_box' ), Booking::EXPERT, 'normal', 'high' );
	}

	/**
	 * Profile fields.
	 *
	 * @param \WP_Post $post Expert.
	 */
	public static function profile_box( $post ) {
		wp_nonce_field( 'hm_expert_profile', 'hm_expert_nonce' );
		$hints = array(
			'role'       => __( 'e.g. Orthodontist, board certified', 'hamista-core' ),
			'license'    => __( 'e.g. 123456', 'hamista-core' ),
			'experience' => __( 'e.g. 12', 'hamista-core' ),
			'fee'        => __( 'e.g. 450,000 Toman', 'hamista-core' ),
			'location'   => __( 'e.g. Second floor, room 4', 'hamista-core' ),
		);
		echo '<div class="hm-booking-row">';
		foreach ( Booking::expert_fields() as $key => $label ) {
			printf(
				'<p><label for="hm-expert-%1$s">%2$s</label><input type="%3$s" id="hm-expert-%1$s" name="hm_profile[%1$s]" value="%4$s" placeholder="%5$s" class="widefat"%6$s></p>',
				esc_attr( $key ),
				esc_html( $label ),
				'experience' === $key ? 'number' : 'text',
				esc_attr( Booking::field( $post->ID, $key ) ),
				esc_attr( $hints[ $key ] ?? '' ),
				'experience' === $key ? ' min="0" max="70"' : ''
			);
		}
		echo '</div>';
		printf(
			'<p><label><input type="checkbox" name="hm_profile[bookable]" value="1"%1$s> %2$s</label></p>',
			checked( Booking::bookable( $post->ID ), true, false ),
			esc_html__( 'Takes online bookings', 'hamista-core' )
		);
		echo '<p class="hm-booking-note">' . esc_html(
			sprintf(
			/* translators: %s: e.g. "specialties", "services" */
				__( 'The photo comes from the featured image and the biography from the main editor. Add %s in the box on the side.', 'hamista-core' ),
				Booking::label( 'group_many' )
			)
		) . '</p>';
	}

	/**
	 * Weekly hours table.
	 *
	 * @param \WP_Post $post Expert.
	 */
	public static function hours_box( $post ) {
		$schedule = Booking::schedule( $post->ID );
		$length   = Booking::slot_length( $post->ID );
		echo '<table class="hm-hours"><thead><tr><th>' . esc_html__( 'Day', 'hamista-core' ) . '</th><th>' . esc_html__( 'Morning shift', 'hamista-core' ) . '</th><th>' . esc_html__( 'Evening shift (optional)', 'hamista-core' ) . '</th></tr></thead><tbody>';
		foreach ( Booking::weekdays() as $day => $label ) {
			$row  = $schedule[ $day ];
			$name = 'hm_hours[' . $day . ']';
			echo '<tr class="' . ( $row['on'] ? '' : 'is-off' ) . '"><td class="hm-hours__day"><label><input type="checkbox" name="' . esc_attr( $name ) . '[on]" value="1"' . checked( $row['on'], true, false ) . ' data-hm-day> ' . esc_html( $label ) . '</label></td><td>';
			/* translators: %s: weekday */
			self::time_select( $name . '[from]', $row['from'], sprintf( __( '%s, start', 'hamista-core' ), $label ) );
			echo '<span class="hm-hours__sep">–</span>';
			/* translators: %s: weekday */
			self::time_select( $name . '[to]', $row['to'], sprintf( __( '%s, end', 'hamista-core' ), $label ) );
			echo '</td><td>';
			/* translators: %s: weekday */
			self::time_select( $name . '[from2]', $row['from2'], sprintf( __( '%s, evening start', 'hamista-core' ), $label ), true );
			echo '<span class="hm-hours__sep">–</span>';
			/* translators: %s: weekday */
			self::time_select( $name . '[to2]', $row['to2'], sprintf( __( '%s, evening end', 'hamista-core' ), $label ), true );
			echo '</td></tr>';
		}
		echo '</tbody></table>';
		echo '<p class="hm-booking-row" style="margin-top:14px"><span><label for="hm-slot">' . esc_html__( 'Length of each appointment', 'hamista-core' ) . '</label><select id="hm-slot" name="hm_slot">';
		foreach ( Booking::slot_lengths() as $minutes ) {
			/* translators: %s: number of minutes */
			printf( '<option value="%1$d"%2$s>%3$s</option>', (int) $minutes, selected( $length, $minutes, false ), esc_html( sprintf( __( '%s minutes', 'hamista-core' ), hamista_core_digits( (string) $minutes ) ) ) );
		}
		echo '</select></span>';
		printf(
			'<span><label for="hm-capacity">%1$s</label><input type="number" id="hm-capacity" name="hm_capacity" value="%2$d" min="1" max="500" class="small-text"><span class="description"> %3$s</span></span>',
			esc_html__( 'Bookings at the same time', 'hamista-core' ),
			(int) Booking::capacity( $post->ID ),
			esc_html__( 'e.g. seats in a dining area or places in a class; 1 for one booking at a time', 'hamista-core' )
		);
		echo '</p>';
		echo '<p class="hm-booking-note">' . esc_html__( 'Visitors can book any free slot inside these hours. Leave the evening shift empty for mornings only.', 'hamista-core' ) . '</p>';
		echo "<script>document.querySelectorAll('[data-hm-day]').forEach(function(c){c.addEventListener('change',function(){c.closest('tr').classList.toggle('is-off',!c.checked);});});</script>";
	}

	/**
	 * A 24-hour time dropdown in 15-minute steps (same look in every browser).
	 *
	 * @param string $name  Field name.
	 * @param string $value HH:MM ('' for none).
	 * @param string $label Accessible label.
	 * @param bool   $empty Offer an empty choice.
	 */
	private static function time_select( $name, $value, $label, $empty = false ) {
		echo '<select name="' . esc_attr( $name ) . '" aria-label="' . esc_attr( $label ) . '">';
		if ( $empty ) {
			echo '<option value="">—</option>';
		}
		$times = array();
		for ( $m = 6 * 60; $m < 24 * 60; $m += 15 ) {
			$times[] = sprintf( '%02d:%02d', intdiv( $m, 60 ), $m % 60 );
		}
		if ( $value && ! in_array( $value, $times, true ) ) {
			$times[] = $value;
			sort( $times );
		}
		foreach ( $times as $time ) {
			echo '<option value="' . esc_attr( $time ) . '"' . selected( $value, $time, false ) . '>' . esc_html( hamista_core_digits( $time ) ) . '</option>';
		}
		echo '</select>';
	}

	/**
	 * A date dropdown with Jalali labels (a month back, three months ahead).
	 *
	 * @param string $name  Field name.
	 * @param string $value Y-m-d.
	 * @param string $id    Element id.
	 */
	private static function date_select( $name, $value, $id ) {
		$start = new \DateTimeImmutable( 'today -30 days', wp_timezone() );
		$dates = array();
		for ( $i = 0; $i <= 120; $i++ ) {
			$dates[] = $start->modify( '+' . $i . ' days' )->format( 'Y-m-d' );
		}
		if ( $value && ! in_array( $value, $dates, true ) ) {
			array_unshift( $dates, $value );
		}
		echo '<select id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '" class="widefat">';
		foreach ( $dates as $date ) {
			echo '<option value="' . esc_attr( $date ) . '"' . selected( $value, $date, false ) . '>' . esc_html( Booking::date_label( $date, 'l j F Y' ) ) . '</option>';
		}
		echo '</select>';
	}

	/**
	 * Save profile and hours.
	 *
	 * @param int      $post_id Post ID.
	 * @param \WP_Post $post    Post.
	 */
	public static function save_expert( $post_id, $post ) {
		if ( ! isset( $_POST['hm_expert_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['hm_expert_nonce'] ), 'hm_expert_profile' ) || ! current_user_can( 'edit_post', $post_id ) || wp_is_post_revision( $post ) ) {
			return;
		}
		$input = isset( $_POST['hm_profile'] ) ? (array) wp_unslash( $_POST['hm_profile'] ) : array(); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitised per field below.
		foreach ( array_keys( Booking::expert_fields() ) as $key ) {
			$value = isset( $input[ $key ] ) ? sanitize_text_field( $input[ $key ] ) : '';
			if ( 'experience' === $key && '' !== $value ) {
				$value = (string) absint( hamista_core_latin_digits( $value ) );
			}
			if ( '' === $value ) {
				delete_post_meta( $post_id, '_hm_' . $key );
			} else {
				update_post_meta( $post_id, '_hm_' . $key, $value );
			}
		}

		$hours = isset( $_POST['hm_hours'] ) ? (array) wp_unslash( $_POST['hm_hours'] ) : array(); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- each value goes through Booking::clean_time().
		$clean = array();
		foreach ( array_keys( Booking::weekdays() ) as $day ) {
			$row           = isset( $hours[ $day ] ) && is_array( $hours[ $day ] ) ? $hours[ $day ] : array();
			$clean[ $day ] = array(
				'on'    => ! empty( $row['on'] ),
				'from'  => Booking::clean_time( $row['from'] ?? '', '09:00' ),
				'to'    => Booking::clean_time( $row['to'] ?? '', '13:00' ),
				'from2' => Booking::clean_time( $row['from2'] ?? '' ),
				'to2'   => Booking::clean_time( $row['to2'] ?? '' ),
			);
		}
		update_post_meta( $post_id, '_hm_schedule', $clean );
		$slot = isset( $_POST['hm_slot'] ) ? absint( $_POST['hm_slot'] ) : 30;
		update_post_meta( $post_id, '_hm_slot', in_array( $slot, Booking::slot_lengths(), true ) ? $slot : 30 );
		$capacity = isset( $_POST['hm_capacity'] ) ? absint( hamista_core_latin_digits( sanitize_text_field( wp_unslash( $_POST['hm_capacity'] ) ) ) ) : 1;
		update_post_meta( $post_id, '_hm_capacity', max( 1, min( 500, $capacity ) ) );
		update_post_meta( $post_id, '_hm_bookable', empty( $input['bookable'] ) ? '0' : '1' );
	}

	/**
	 * Expert list columns: photo and working days.
	 *
	 * @param array $columns Columns.
	 * @return array
	 */
	public static function expert_columns( $columns ) {
		$out = array();
		foreach ( $columns as $key => $label ) {
			if ( 'title' === $key ) {
				$out['hm_photo'] = '<span class="screen-reader-text">' . esc_html__( 'Photo', 'hamista-core' ) . '</span>';
			}
			$out[ $key ] = $label;
			if ( 'title' === $key ) {
				$out['hm_days'] = __( 'Working days', 'hamista-core' );
			}
		}
		return $out;
	}

	/**
	 * Expert list cells.
	 *
	 * @param string $column  Column.
	 * @param int    $post_id Expert.
	 */
	public static function expert_column( $column, $post_id ) {
		if ( 'hm_photo' === $column ) {
			echo get_the_post_thumbnail( $post_id, 'thumbnail' );
		} elseif ( 'hm_days' === $column ) {
			$days = array();
			foreach ( Booking::schedule( $post_id ) as $day => $row ) {
				if ( $row['on'] ) {
					$days[] = '<span>' . esc_html( Booking::weekdays()[ $day ] ) . '</span>';
				}
			}
			echo $days ? '<div class="hm-days">' . implode( '', $days ) . '</div>' : '—'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above.
		}
	}

	/* ---------------------------------------------------------------------
	 * Appointment details
	 * ------------------------------------------------------------------ */

	/**
	 * Appointment meta box.
	 */
	public static function appointment_boxes() {
		add_meta_box( 'hm-appointment', __( 'Appointment details', 'hamista-core' ), array( __CLASS__, 'appointment_box' ), Booking::APPOINTMENT, 'normal', 'high' );
	}

	/**
	 * Details box.
	 *
	 * @param \WP_Post $post Appointment.
	 */
	public static function appointment_box( $post ) {
		wp_nonce_field( 'hm_appointment', 'hm_appointment_nonce' );
		$get     = static function ( $key ) use ( $post ) {
			return (string) get_post_meta( $post->ID, '_hm_' . $key, true );
		};
		$experts = get_posts(
			array(
				'post_type'      => Booking::EXPERT,
				'posts_per_page' => 100,
				'orderby'        => 'title',
				'order'          => 'ASC',
			)
		);
		$date    = $get( 'date' );
		echo '<div class="hm-booking-row">';
		echo '<p><label for="hm-ap-status">' . esc_html__( 'Status', 'hamista-core' ) . '</label><select id="hm-ap-status" name="hm_ap[status]" class="widefat">';
		foreach ( Booking::statuses() as $key => $label ) {
			printf( '<option value="%1$s"%2$s>%3$s</option>', esc_attr( $key ), selected( $get( 'status' ), $key, false ), esc_html( $label ) );
		}
		echo '</select></p>';
		echo '<p><label for="hm-ap-expert">' . esc_html( Booking::label( 'one' ) ) . '</label><select id="hm-ap-expert" name="hm_ap[expert]" class="widefat">';
		foreach ( $experts as $expert ) {
			printf( '<option value="%1$d"%2$s>%3$s</option>', (int) $expert->ID, selected( (int) $get( 'expert' ), $expert->ID, false ), esc_html( $expert->post_title ) );
		}
		echo '</select></p>';
		echo '<p><label for="hm-ap-date">' . esc_html__( 'Date', 'hamista-core' ) . '</label>';
		self::date_select( 'hm_ap[date]', $date, 'hm-ap-date' );
		echo '</p><p><label>' . esc_html__( 'Time', 'hamista-core' ) . '</label><span class="hm-ap-time">';
		self::time_select( 'hm_ap[time]', $get( 'time' ), __( 'Time', 'hamista-core' ) );
		echo '</span></p>';
		$qty = max( 1, (int) $get( 'qty' ) );
		if ( hamista_core_option( 'booking_qty', false ) || $qty > 1 ) {
			printf( '<p><label for="hm-ap-qty">%1$s</label><input type="number" id="hm-ap-qty" name="hm_ap[qty]" value="%2$d" min="1" max="500" class="small-text"></p>', esc_html( Rest::qty_label() ), (int) $qty );
		}
		printf( '<p><label for="hm-ap-name">%1$s</label><input type="text" id="hm-ap-name" name="hm_ap[name]" value="%2$s" class="widefat"></p>', esc_html__( 'Name', 'hamista-core' ), esc_attr( $get( 'name' ) ) );
		printf( '<p><label for="hm-ap-mobile">%1$s</label><input type="tel" id="hm-ap-mobile" name="hm_ap[mobile]" value="%2$s" class="widefat" dir="ltr"></p>', esc_html__( 'Mobile', 'hamista-core' ), esc_attr( $get( 'mobile' ) ) );
		echo '</div>';
		printf( '<p><label for="hm-ap-note" style="display:block;font-weight:600;margin-bottom:5px">%1$s</label><textarea id="hm-ap-note" name="hm_ap[note]" rows="3" class="widefat">%2$s</textarea></p>', esc_html__( 'Notes', 'hamista-core' ), esc_textarea( $get( 'note' ) ) );
		$extra = get_post_meta( $post->ID, '_hm_extra', true );
		if ( is_array( $extra ) && $extra ) {
			echo '<table class="widefat striped hm-ap-extra"><tbody>';
			foreach ( $extra as $row ) {
				if ( isset( $row['label'], $row['value'] ) ) {
					echo '<tr><th scope="row">' . esc_html( $row['label'] ) . '</th><td>' . esc_html( $row['value'] ) . '</td></tr>';
				}
			}
			echo '</tbody></table>';
		}
		$user = (int) $get( 'user' );
		if ( $user && get_userdata( $user ) ) {
			/* translators: %s: user display name with a link */
			echo '<p class="hm-booking-note">' . wp_kses_post( sprintf( __( 'Booked by the account of %s.', 'hamista-core' ), '<a href="' . esc_url( get_edit_user_link( $user ) ) . '">' . esc_html( get_userdata( $user )->display_name ) . '</a>' ) ) . '</p>';
		}
	}

	/**
	 * Save details.
	 *
	 * @param int      $post_id Post ID.
	 * @param \WP_Post $post    Post.
	 */
	public static function save_appointment( $post_id, $post ) {
		if ( ! isset( $_POST['hm_appointment_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['hm_appointment_nonce'] ), 'hm_appointment' ) || ! current_user_can( 'edit_post', $post_id ) || wp_is_post_revision( $post ) ) {
			return;
		}
		$in     = isset( $_POST['hm_ap'] ) ? (array) wp_unslash( $_POST['hm_ap'] ) : array(); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitised per field below.
		$old    = (string) get_post_meta( $post_id, '_hm_status', true );
		$status = isset( $in['status'] ) && isset( Booking::statuses()[ $in['status'] ] ) ? $in['status'] : $old;
		$date   = isset( $in['date'] ) && preg_match( '/^\d{4}-\d{2}-\d{2}$/', $in['date'] ) ? $in['date'] : (string) get_post_meta( $post_id, '_hm_date', true );
		$time   = Booking::clean_time( $in['time'] ?? '', (string) get_post_meta( $post_id, '_hm_time', true ) );
		$expert = isset( $in['expert'] ) && Booking::EXPERT === get_post_type( (int) $in['expert'] ) ? (int) $in['expert'] : (int) get_post_meta( $post_id, '_hm_expert', true );
		$name   = sanitize_text_field( $in['name'] ?? '' );
		$meta   = array(
			'_hm_status' => $status,
			'_hm_date'   => $date,
			'_hm_time'   => $time,
			'_hm_expert' => $expert,
			'_hm_name'   => $name,
			'_hm_mobile' => sanitize_text_field( hamista_core_latin_digits( $in['mobile'] ?? '' ) ),
			'_hm_note'   => sanitize_textarea_field( $in['note'] ?? '' ),
			'_hm_qty'    => isset( $in['qty'] ) ? max( 1, min( 500, absint( hamista_core_latin_digits( (string) $in['qty'] ) ) ) ) : max( 1, (int) get_post_meta( $post_id, '_hm_qty', true ) ),
		);
		foreach ( $meta as $key => $value ) {
			update_post_meta( $post_id, $key, $value );
		}

		// Keep the list title in step with the details, without looping back here.
		remove_action( 'save_post_' . Booking::APPOINTMENT, array( __CLASS__, 'save_appointment' ), 10 );
		wp_update_post(
			array(
				'ID'         => $post_id,
				'post_title' => sprintf( '%s — %s %s', $name, Booking::date_label( $date, 'j F' ), Booking::time_label( $time ) ),
			)
		);
		add_action( 'save_post_' . Booking::APPOINTMENT, array( __CLASS__, 'save_appointment' ), 10, 2 );

		if ( $old !== $status ) {
			self::status_changed( $post_id, $status, $old );
		}
	}

	/* ---------------------------------------------------------------------
	 * Appointments list
	 * ------------------------------------------------------------------ */

	/**
	 * Columns.
	 *
	 * @param array $columns Columns.
	 * @return array
	 */
	public static function columns( $columns ) {
		$qty = hamista_core_option( 'booking_qty', false ) ? array( 'hm_qty' => Rest::qty_label() ) : array();
		return array(
			'cb'          => $columns['cb'] ?? '<input type="checkbox">',
			'title'       => __( 'Name', 'hamista-core' ),
			'hm_when'     => Booking::word( 'when' ),
			'hm_provider' => Booking::label( 'one' ),
			'hm_mobile'   => __( 'Mobile', 'hamista-core' ),
		) + $qty + array(
			'hm_status' => __( 'Status', 'hamista-core' ),
			'date'      => __( 'Booked on', 'hamista-core' ),
		);
	}

	/**
	 * Status badge.
	 *
	 * @param string $status Status key.
	 * @return string
	 */
	public static function badge( $status ) {
		$labels = Booking::statuses();
		$status = isset( $labels[ $status ] ) ? $status : 'pending';
		return '<span class="hm-status hm-status--' . esc_attr( $status ) . '">' . esc_html( $labels[ $status ] ) . '</span>';
	}

	/**
	 * Cells.
	 *
	 * @param string $column  Column.
	 * @param int    $post_id Appointment.
	 */
	public static function column( $column, $post_id ) {
		switch ( $column ) {
			case 'hm_when':
				$date = (string) get_post_meta( $post_id, '_hm_date', true );
				echo '<span class="hm-when__day">' . esc_html( Booking::date_label( $date, 'l j F' ) ) . '</span><span class="hm-when__time">' . esc_html( Booking::time_label( (string) get_post_meta( $post_id, '_hm_time', true ) ) ) . '</span>';
				break;
			case 'hm_provider':
				$expert = (int) get_post_meta( $post_id, '_hm_expert', true );
				echo $expert ? '<a href="' . esc_url( add_query_arg( 'hm_provider', $expert ) ) . '">' . esc_html( get_the_title( $expert ) ) . '</a>' : '—';
				break;
			case 'hm_mobile':
				$mobile = (string) get_post_meta( $post_id, '_hm_mobile', true );
				echo $mobile ? '<a href="tel:' . esc_attr( $mobile ) . '"><bdi>' . esc_html( $mobile ) . '</bdi></a>' : '—';
				break;
			case 'hm_qty':
				echo esc_html( hamista_core_num( max( 1, (int) get_post_meta( $post_id, '_hm_qty', true ) ) ) );
				break;
			case 'hm_status':
				echo self::badge( (string) get_post_meta( $post_id, '_hm_status', true ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in badge().
				break;
		}
	}

	/**
	 * Sortable columns.
	 *
	 * @param array $columns Columns.
	 * @return array
	 */
	public static function sortable( $columns ) {
		$columns['hm_when'] = array( 'hm_when', true );
		return $columns;
	}

	/**
	 * Quick links above the list: today, upcoming, awaiting confirmation.
	 *
	 * @param array $views Views.
	 * @return array
	 */
	public static function views( $views ) {
		$base    = admin_url( 'edit.php?post_type=' . Booking::APPOINTMENT );
		$current = isset( $_GET['hm_view'] ) ? sanitize_key( $_GET['hm_view'] ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- list filter.
		$items   = array(
			'today'    => __( 'Today', 'hamista-core' ),
			'upcoming' => __( 'Upcoming', 'hamista-core' ),
			'pending'  => __( 'Awaiting confirmation', 'hamista-core' ),
		);
		if ( $current ) {
			foreach ( $views as $key => $html ) {
				$views[ $key ] = str_replace( array( ' class="current"', ' aria-current="page"' ), '', $html );
			}
		}
		foreach ( $items as $key => $label ) {
			$count                 = 'pending' === $key ? self::pending_count() : null;
			$views[ 'hm_' . $key ] = sprintf(
				'<a href="%1$s"%2$s>%3$s%4$s</a>',
				esc_url( add_query_arg( 'hm_view', $key, $base ) ),
				$current === $key ? ' class="current" aria-current="page"' : '',
				esc_html( $label ),
				null === $count ? '' : ' <span class="count">(' . esc_html( hamista_core_num( $count ) ) . ')</span>'
			);
		}
		return $views;
	}

	/**
	 * Expert and status dropdowns.
	 *
	 * @param string $post_type Post type.
	 */
	public static function filters( $post_type ) {
		if ( Booking::APPOINTMENT !== $post_type ) {
			return;
		}
		// phpcs:disable WordPress.Security.NonceVerification.Recommended -- list filters.
		$expert = isset( $_GET['hm_provider'] ) ? absint( $_GET['hm_provider'] ) : 0;
		$status = isset( $_GET['hm_status'] ) ? sanitize_key( $_GET['hm_status'] ) : '';
		// phpcs:enable
		echo '<label class="screen-reader-text" for="hm-filter-expert">' . esc_html( Booking::label( 'one' ) ) . '</label><select name="hm_provider" id="hm-filter-expert"><option value="0">' . esc_html( sprintf( /* translators: %s: e.g. "Doctors" */ __( 'All %s', 'hamista-core' ), Booking::label( 'many' ) ) ) . '</option>';
		foreach ( get_posts(
			array(
				'post_type'      => Booking::EXPERT,
				'posts_per_page' => 100,
				'orderby'        => 'title',
				'order'          => 'ASC',
			)
		) as $item ) {
			printf( '<option value="%1$d"%2$s>%3$s</option>', (int) $item->ID, selected( $expert, $item->ID, false ), esc_html( $item->post_title ) );
		}
		echo '</select><label class="screen-reader-text" for="hm-filter-status">' . esc_html__( 'Filter by status', 'hamista-core' ) . '</label><select name="hm_status" id="hm-filter-status"><option value="">' . esc_html__( 'All statuses', 'hamista-core' ) . '</option>';
		foreach ( Booking::statuses() as $key => $label ) {
			printf( '<option value="%1$s"%2$s>%3$s</option>', esc_attr( $key ), selected( $status, $key, false ), esc_html( $label ) );
		}
		echo '</select>';
	}

	/**
	 * Apply list filters and the appointment-time sort.
	 *
	 * @param \WP_Query $query Query.
	 */
	public static function query( $query ) {
		if ( ! $query->is_main_query() || Booking::APPOINTMENT !== $query->get( 'post_type' ) ) {
			return;
		}
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( ! $screen || 'edit-' . Booking::APPOINTMENT !== $screen->id ) {
			return;
		}
		// phpcs:disable WordPress.Security.NonceVerification.Recommended -- list filters.
		$meta   = array(
			'hm_date' => array(
				'key'     => '_hm_date',
				'compare' => 'EXISTS',
			),
			'hm_time' => array(
				'key'     => '_hm_time',
				'compare' => 'EXISTS',
			),
		);
		$expert = isset( $_GET['hm_provider'] ) ? absint( $_GET['hm_provider'] ) : 0;
		$status = isset( $_GET['hm_status'] ) ? sanitize_key( $_GET['hm_status'] ) : '';
		$view   = isset( $_GET['hm_view'] ) ? sanitize_key( $_GET['hm_view'] ) : '';
		$today  = wp_date( 'Y-m-d' );
		if ( $expert ) {
			$meta[] = array(
				'key'   => '_hm_expert',
				'value' => $expert,
			);
		}
		if ( 'pending' === $view ) {
			$status = 'pending';
		}
		if ( $status && isset( Booking::statuses()[ $status ] ) ) {
			$meta[] = array(
				'key'   => '_hm_status',
				'value' => $status,
			);
		}
		if ( 'today' === $view ) {
			$meta['hm_date'] = array(
				'key'   => '_hm_date',
				'value' => $today,
			);
		} elseif ( 'upcoming' === $view ) {
			$meta['hm_date'] = array(
				'key'     => '_hm_date',
				'value'   => $today,
				'compare' => '>=',
				'type'    => 'DATE',
			);
			$meta[]          = array(
				'key'     => '_hm_status',
				'value'   => array( 'pending', 'confirmed' ),
				'compare' => 'IN',
			);
		}
		$query->set( 'meta_query', $meta ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query

		$orderby = isset( $_GET['orderby'] ) ? sanitize_key( $_GET['orderby'] ) : '';
		if ( 'hm_when' === $orderby || ( '' === $orderby && $view ) ) {
			$order = isset( $_GET['order'] ) && 'desc' === strtolower( sanitize_key( $_GET['order'] ) ) ? 'DESC' : 'ASC';
			$query->set(
				'orderby',
				array(
					'hm_date' => $order,
					'hm_time' => $order,
				)
			);
		}
		// phpcs:enable
	}

	/**
	 * Row actions: confirm, done, cancel. Quick edit is hidden because the
	 * details live in meta fields.
	 *
	 * @param array    $actions Actions.
	 * @param \WP_Post $post    Post.
	 * @return array
	 */
	public static function row_actions( $actions, $post ) {
		if ( Booking::APPOINTMENT !== $post->post_type ) {
			return $actions;
		}
		unset( $actions['inline hide-if-no-js'] );
		if ( ! current_user_can( 'edit_post', $post->ID ) ) {
			return $actions;
		}
		$status = (string) get_post_meta( $post->ID, '_hm_status', true );
		$labels = array(
			'confirmed' => __( 'Confirm', 'hamista-core' ),
			'done'      => __( 'Mark as done', 'hamista-core' ),
			'cancelled' => _x( 'Cancel', 'appointment', 'hamista-core' ),
		);
		$out    = array();
		foreach ( $labels as $key => $label ) {
			if ( $key === $status || ( 'confirmed' === $key && 'done' === $status ) ) {
				continue;
			}
			$url                 = wp_nonce_url(
				add_query_arg(
					array(
						'action' => self::ACTION,
						'id'     => $post->ID,
						'status' => $key,
					),
					admin_url( 'admin-post.php' )
				),
				self::ACTION . '_' . $post->ID
			);
			$out[ 'hm_' . $key ] = '<a href="' . esc_url( $url ) . '"' . ( 'cancelled' === $key ? ' class="submitdelete"' : '' ) . '>' . esc_html( $label ) . '</a>';
		}
		return $out + $actions;
	}

	/**
	 * Status change from a row action.
	 */
	public static function change_status() {
		$id     = isset( $_GET['id'] ) ? absint( $_GET['id'] ) : 0;
		$status = isset( $_GET['status'] ) ? sanitize_key( $_GET['status'] ) : '';
		check_admin_referer( self::ACTION . '_' . $id );
		if ( Booking::APPOINTMENT !== get_post_type( $id ) || ! current_user_can( 'edit_post', $id ) || ! isset( Booking::statuses()[ $status ] ) ) {
			wp_die( esc_html__( 'You are not allowed to change this appointment.', 'hamista-core' ), '', array( 'response' => 403 ) );
		}
		self::set_status( $id, $status );
		$back = wp_get_referer();
		wp_safe_redirect( add_query_arg( 'hm_updated', 1, $back ? $back : admin_url( 'edit.php?post_type=' . Booking::APPOINTMENT ) ) );
		exit;
	}

	/**
	 * Bulk actions.
	 *
	 * @param array $actions Actions.
	 * @return array
	 */
	public static function bulk_actions( $actions ) {
		unset( $actions['edit'] );
		return array(
			'hm_confirmed' => __( 'Confirm', 'hamista-core' ),
			'hm_done'      => __( 'Mark as done', 'hamista-core' ),
			'hm_cancelled' => _x( 'Cancel', 'appointment', 'hamista-core' ),
		) + $actions;
	}

	/**
	 * Run a bulk status change.
	 *
	 * @param string $redirect Redirect URL.
	 * @param string $action   Action.
	 * @param int[]  $ids      Posts.
	 * @return string
	 */
	public static function handle_bulk( $redirect, $action, $ids ) {
		$status = 0 === strpos( $action, 'hm_' ) ? substr( $action, 3 ) : '';
		if ( ! isset( Booking::statuses()[ $status ] ) ) {
			return $redirect;
		}
		$done = 0;
		foreach ( (array) $ids as $id ) {
			if ( current_user_can( 'edit_post', $id ) && Booking::APPOINTMENT === get_post_type( $id ) ) {
				self::set_status( (int) $id, $status );
				++$done;
			}
		}
		return add_query_arg( 'hm_updated', $done, $redirect );
	}

	/**
	 * Confirmation after a status change.
	 */
	public static function notice() {
		$screen = get_current_screen();
		if ( ! $screen || 'edit-' . Booking::APPOINTMENT !== $screen->id || empty( $_GET['hm_updated'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- display only.
			return;
		}
		$count = absint( $_GET['hm_updated'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- display only.
		/* translators: %s: number of appointments */
		echo '<div class="notice notice-success is-dismissible"><p>' . esc_html( sprintf( _n( '%s appointment updated.', '%s appointments updated.', $count, 'hamista-core' ), hamista_core_num( $count ) ) ) . '</p></div>';
	}

	/* ---------------------------------------------------------------------
	 * Status
	 * ------------------------------------------------------------------ */

	/**
	 * Change an appointment's status.
	 *
	 * @param int    $id     Appointment.
	 * @param string $status New status.
	 */
	public static function set_status( $id, $status ) {
		$old = (string) get_post_meta( $id, '_hm_status', true );
		if ( $old === $status ) {
			return;
		}
		update_post_meta( $id, '_hm_status', $status );
		self::status_changed( $id, $status, $old );
	}

	/**
	 * After a status change: refresh the count and let SMS add-ons react.
	 *
	 * @param int    $id     Appointment.
	 * @param string $status New status.
	 * @param string $old    Old status.
	 */
	private static function status_changed( $id, $status, $old ) {
		self::forget_count();
		/**
		 * An appointment's status changed in the dashboard.
		 *
		 * @param int    $id     Appointment ID.
		 * @param string $status New status (pending|confirmed|done|cancelled).
		 * @param string $old    Previous status.
		 */
		do_action( 'hamista_core/appointment_status', $id, $status, $old );
	}

	/**
	 * Appointments awaiting confirmation.
	 *
	 * @return int
	 */
	public static function pending_count() {
		$count = get_transient( self::COUNT );
		if ( false === $count ) {
			$query = new \WP_Query(
				array(
					'post_type'      => Booking::APPOINTMENT,
					'post_status'    => 'publish',
					'posts_per_page' => 1,
					'fields'         => 'ids',
					'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
						array(
							'key'   => '_hm_status',
							'value' => 'pending',
						),
						array(
							'key'     => '_hm_date',
							'value'   => wp_date( 'Y-m-d' ),
							'compare' => '>=',
							'type'    => 'DATE',
						),
					),
				)
			);
			$count = (int) $query->found_posts;
			set_transient( self::COUNT, $count, 10 * MINUTE_IN_SECONDS );
		}
		return (int) $count;
	}

	/**
	 * Drop the cached count.
	 */
	public static function forget_count() {
		delete_transient( self::COUNT );
	}

	/**
	 * Pending count next to "Appointments" in the menu.
	 */
	public static function pending_bubble() {
		global $submenu;
		$parent = 'edit.php?post_type=' . Booking::EXPERT;
		$count  = self::pending_count();
		if ( ! $count || empty( $submenu[ $parent ] ) ) {
			return;
		}
		foreach ( $submenu[ $parent ] as $i => $item ) {
			if ( 'edit.php?post_type=' . Booking::APPOINTMENT === $item[2] ) {
				// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- adding a count badge, as core does for comments.
				$submenu[ $parent ][ $i ][0] .= ' <span class="awaiting-mod count-' . (int) $count . '"><span class="pending-count">' . esc_html( hamista_core_num( $count ) ) . '</span></span>';
			}
		}
	}
}
