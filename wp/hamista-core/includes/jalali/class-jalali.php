<?php
/**
 * Solar Hijri (Jalali) dates for Persian sites.
 *
 * Converts human-readable dates produced through wp_date() (post dates,
 * comment dates, archives). Machine formats (ISO 8601, RFC 2822, Unix) are left
 * untouched so <time datetime>, feeds and schema stay valid. Steps aside when
 * WP-Parsidate is active.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Jalali;

defined( 'ABSPATH' ) || exit;

/**
 * Jalali.
 */
class Jalali {

	/**
	 * Hooks.
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'maybe_hook' ), 20 );
	}

	/**
	 * Attach the filter only for Persian sites with the option on.
	 */
	public static function maybe_hook() {
		if ( ! hamista_core_option( 'jalali_dates' ) || 0 !== strpos( get_locale(), 'fa' ) ) {
			return;
		}
		if ( defined( 'WP_PARSI_VER' ) || function_exists( 'parsidate' ) || class_exists( 'WP_Parsidate' ) ) {
			return;
		}
		add_filter( 'wp_date', array( __CLASS__, 'filter_wp_date' ), 10, 4 );
	}

	/**
	 * Re-format a date in the Jalali calendar.
	 *
	 * @param string             $date      Formatted date.
	 * @param string             $format    PHP date format.
	 * @param int                $timestamp Unix timestamp.
	 * @param \DateTimeZone|null $timezone  Timezone.
	 * @return string
	 */
	public static function filter_wp_date( $date, $format, $timestamp, $timezone ) {
		if ( is_feed() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || self::is_machine_format( $format ) ) {
			return $date;
		}
		$dt = new \DateTime( '@' . $timestamp );
		$dt->setTimezone( $timezone instanceof \DateTimeZone ? $timezone : wp_timezone() );
		return self::format( $format, $dt );
	}

	/**
	 * Formats meant for machines, not people.
	 *
	 * @param string $format Format.
	 * @return bool
	 */
	private static function is_machine_format( $format ) {
		return in_array( $format, array( 'c', 'r', 'U', 'Y-m-d', 'Y-m-d H:i:s', 'Y-m-d\TH:i:sP', DATE_ATOM, DATE_RFC2822, DATE_W3C ), true )
			|| false !== strpos( $format, '\T' );
	}

	/**
	 * Gregorian → Jalali.
	 *
	 * @param int $gy Year.
	 * @param int $gm Month.
	 * @param int $gd Day.
	 * @return int[] [ year, month, day ]
	 */
	public static function to_jalali( $gy, $gm, $gd ) {
		$g_d_m = array( 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 );
		$gy2   = ( $gm > 2 ) ? ( $gy + 1 ) : $gy;
		$days  = 355666 + ( 365 * $gy ) + intdiv( $gy2 + 3, 4 ) - intdiv( $gy2 + 99, 100 ) + intdiv( $gy2 + 399, 400 ) + $gd + $g_d_m[ $gm - 1 ];
		$jy    = -1595 + ( 33 * intdiv( $days, 12053 ) );
		$days %= 12053;
		$jy   += 4 * intdiv( $days, 1461 );
		$days %= 1461;
		if ( $days > 365 ) {
			--$days;
			$jy   += intdiv( $days, 365 );
			$days %= 365;
		}
		if ( $days < 186 ) {
			$jm = 1 + intdiv( $days, 31 );
			$jd = 1 + ( $days % 31 );
		} else {
			$jm = 7 + intdiv( $days - 186, 30 );
			$jd = 1 + ( ( $days - 186 ) % 30 );
		}
		return array( $jy, $jm, $jd );
	}

	/**
	 * Whether a Jalali year is a leap year (33-year cycle approximation).
	 *
	 * @param int $jy Year.
	 * @return bool
	 */
	private static function is_leap( $jy ) {
		$r = $jy % 33;
		return ( ( $r % 4 ) - 1 ) === (int) ( $r * 0.05 );
	}

	/**
	 * Format like date(), in the Jalali calendar with Persian names.
	 *
	 * @param string    $format Format.
	 * @param \DateTime $dt     Date.
	 * @return string
	 */
	public static function format( $format, \DateTime $dt ) {
		list( $jy, $jm, $jd ) = self::to_jalali( (int) $dt->format( 'Y' ), (int) $dt->format( 'n' ), (int) $dt->format( 'j' ) );

		$months   = array( 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند' );
		$weekdays = array( 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه' );
		$wd       = (int) $dt->format( 'w' );
		$out      = '';
		$length   = strlen( $format );

		for ( $i = 0; $i < $length; $i++ ) {
			$char = $format[ $i ];
			if ( '\\' === $char ) {
				++$i;
				$out .= $format[ $i ] ?? '';
				continue;
			}
			switch ( $char ) {
				case 'd':
					$out .= str_pad( (string) $jd, 2, '0', STR_PAD_LEFT );
					break;
				case 'j':
					$out .= $jd;
					break;
				case 'D':
				case 'l':
					$out .= $weekdays[ $wd ];
					break;
				case 'S':
					$out .= 'ام';
					break;
				case 'F':
				case 'M':
					$out .= $months[ $jm - 1 ];
					break;
				case 'm':
					$out .= str_pad( (string) $jm, 2, '0', STR_PAD_LEFT );
					break;
				case 'n':
					$out .= $jm;
					break;
				case 't':
					$out .= $jm <= 6 ? 31 : ( $jm < 12 ? 30 : ( self::is_leap( $jy ) ? 30 : 29 ) );
					break;
				case 'L':
					$out .= self::is_leap( $jy ) ? '1' : '0';
					break;
				case 'Y':
				case 'o':
					$out .= $jy;
					break;
				case 'y':
					$out .= substr( (string) $jy, -2 );
					break;
				case 'a':
					$out .= 'am' === $dt->format( 'a' ) ? 'ق.ظ' : 'ب.ظ';
					break;
				case 'A':
					$out .= 'AM' === $dt->format( 'A' ) ? 'قبل‌ازظهر' : 'بعدازظهر';
					break;
				default:
					$out .= $dt->format( $char );
			}
		}

		return function_exists( 'hamista_core_digits' ) ? hamista_core_digits( $out ) : $out;
	}
}
