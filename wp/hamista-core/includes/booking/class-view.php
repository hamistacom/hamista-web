<?php
/**
 * Front-end booking markup shared by the widgets, the shortcodes and the
 * theme templates: the booking flow, an expert's weekly hours and the
 * visitor's own appointments.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Booking;

use Hamista\Core\Frontend\Frontend;

defined( 'ABSPATH' ) || exit;

/**
 * View.
 */
class View {

	/**
	 * Script data printed once.
	 *
	 * @var bool
	 */
	private static $data_added = false;

	/**
	 * Register the booking script and style.
	 */
	public static function register_assets() {
		if ( wp_style_is( 'hamista-booking', 'registered' ) ) {
			return;
		}
		$deps = wp_style_is( 'hamista-widgets', 'registered' ) ? array( 'hamista-widgets' ) : array();
		wp_register_style( 'hamista-booking', Frontend::asset( 'css/booking.css' ), $deps, HAMISTA_CORE_VERSION );
		wp_register_script(
			'hamista-booking',
			Frontend::asset( 'js/booking.js' ),
			array(),
			HAMISTA_CORE_VERSION,
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);
	}

	/**
	 * Enqueue the booking assets with their data.
	 */
	public static function enqueue() {
		self::register_assets();
		wp_enqueue_style( 'hamista-booking' );
		wp_enqueue_script( 'hamista-booking' );
		if ( wp_script_is( 'hamista-motion', 'registered' ) ) {
			wp_enqueue_script( 'hamista-motion' ); // Filter chips.
		}
		if ( self::$data_added ) {
			return;
		}
		self::$data_added = true;
		wp_add_inline_script(
			'hamista-booking',
			'window.hamistaBooking=' . wp_json_encode(
				array(
					'rest'      => esc_url_raw( rest_url( Rest::NS . '/booking/' ) ),
					'restNonce' => is_user_logged_in() ? wp_create_nonce( 'wp_rest' ) : '',
					'i18n'      => array(
						'loading'     => __( 'Loading free times…', 'hamista-core' ),
						'noTimes'     => __( 'No free time on this day. Try another day.', 'hamista-core' ),
						'noDays'      => __( 'There is no free time in the coming days. Please call us.', 'hamista-core' ),
						'full'        => __( 'Full', 'hamista-core' ),
						'closed'      => __( 'Closed', 'hamista-core' ),
						/* translators: %s: number of free slots */
						'free'        => __( '%s free', 'hamista-core' ),
						'error'       => __( 'Something went wrong. Please try again.', 'hamista-core' ),
						'offline'     => __( 'No connection. Check your internet and try again.', 'hamista-core' ),
						'name'        => __( 'Please enter your full name.', 'hamista-core' ),
						'mobile'      => __( 'Please enter a valid mobile number, like 09121234567.', 'hamista-core' ),
						/* translators: %s: e.g. "doctor", "lawyer" */
						'pickExpert'  => sprintf( __( 'Choose the %s first.', 'hamista-core' ), Booking::label( 'one' ) ),
						'pickTime'    => __( 'Choose a time to continue.', 'hamista-core' ),
						'sending'     => __( 'Booking…', 'hamista-core' ),
						'cancelAsk'   => Booking::word( 'cancel_ask' ),
						'cancelling'  => __( 'Cancelling…', 'hamista-core' ),
						'cancelled'   => __( 'Cancelled', 'hamista-core' ),
						'loginNeeded' => __( 'Please log in first; it takes a few seconds with your mobile number.', 'hamista-core' ),
						'morning'     => __( 'Morning', 'hamista-core' ),
						'afternoon'   => __( 'Afternoon & evening', 'hamista-core' ),
						/* translators: %s: number of places left */
						'left'        => __( '%s left', 'hamista-core' ),
						'required'    => __( 'Please fill in the required fields.', 'hamista-core' ),
					),
				)
			) . ';',
			'before'
		);
	}

	/**
	 * Published experts, optionally limited to groups (services, specialties…) or IDs.
	 *
	 * @param array $args groups (int[]), ids (int[]), count (int), bookable (only items that take bookings).
	 * @return \WP_Post[]
	 */
	public static function experts( $args = array() ) {
		$args           = wp_parse_args(
			$args,
			array(
				'groups'   => array(),
				'bookable' => false,
				'ids'      => array(),
				'count'    => 50,
			)
		);
		$args['ids']    = array_filter( array_map( 'intval', (array) $args['ids'] ) );
		$args['groups'] = array_filter( array_map( 'intval', (array) $args['groups'] ) );
		$query          = array(
			'post_type'      => Booking::EXPERT,
			'post_status'    => 'publish',
			'posts_per_page' => max( 1, (int) $args['count'] ),
			'orderby'        => array(
				'menu_order' => 'ASC',
				'title'      => 'ASC',
			),
			'no_found_rows'  => true,
		);
		if ( $args['ids'] ) {
			$query['post__in'] = $args['ids'];
			$query['orderby']  = 'post__in';
		}
		if ( $args['groups'] ) {
			$query['tax_query'] = array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
				array(
					'taxonomy' => Booking::SERVICE,
					'terms'    => $args['groups'],
				),
			);
		}
		$items = get_posts( $query );
		if ( $args['bookable'] ) {
			$items = array_values(
				array_filter(
					$items,
					static function ( $item ) {
						return Booking::bookable( $item->ID );
					}
				)
			);
		}
		return $items;
	}

	/**
	 * Filter chips (services, specialties…) for a list of experts.
	 *
	 * @param \WP_Post[] $experts Experts.
	 * @param string     $label   Toolbar label.
	 * @return string
	 */
	public static function filters( $experts, $label = '' ) {
		$used = array();
		foreach ( $experts as $expert ) {
			foreach ( Booking::groups( $expert->ID ) as $term ) {
				$used[ $term->term_id ] = $term->name;
			}
		}
		if ( count( $used ) < 2 ) {
			return '';
		}
		$html = '<div class="hm-filters" role="toolbar" aria-label="' . esc_attr( $label ? $label : Booking::label( 'group_many' ) ) . '"><button type="button" class="hm-chip" aria-pressed="true" data-filter="">' . esc_html__( 'All', 'hamista-core' ) . '</button>';
		foreach ( $used as $id => $name ) {
			$html .= '<button type="button" class="hm-chip" aria-pressed="false" data-filter="hm-sv-' . esc_attr( (string) $id ) . '">' . esc_html( $name ) . '</button>';
		}
		return $html . '</div>';
	}

	/* ---------------------------------------------------------------------
	 * Booking
	 * ------------------------------------------------------------------ */

	/**
	 * The booking flow: expert → day and time → details → done.
	 *
	 * @param array $args {
	 *     @type int    $expert Preselected expert (0 = let the visitor choose; ?expert= also works).
	 *     @type int[]  $groups Limit the list to these services / specialties.
	 *     @type string $title       Heading ('' for none).
	 *     @type string $intro       Short text under the heading.
	 *     @type bool   $note        Show the note field.
	 *     @type string $style       card|plain.
	 * }
	 * @return string
	 */
	public static function booking( $args = array() ) {
		$args = wp_parse_args(
			$args,
			array(
				'expert' => 0,
				'groups' => array(),
				'title'  => '',
				'intro'  => '',
				'note'   => true,
				'style'  => 'card',
			)
		);

		$experts = self::experts(
			array(
				'groups'   => $args['groups'],
				'bookable' => true,
			)
		);
		if ( ! $experts ) {
			return current_user_can( 'edit_posts' ) ? '<div class="hm-empty">' . esc_html( sprintf( /* translators: %s: e.g. "doctors", "lawyers" */ __( 'Add %s under Booking in the dashboard and set their weekly hours to start taking appointments.', 'hamista-core' ), Booking::label( 'many' ) ) ) . '</div>' : '';
		}
		$picked = (int) $args['expert'];
		if ( ! $picked && isset( $_GET['expert'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- preselection only.
			$picked = absint( $_GET['expert'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		}
		if ( $picked && Booking::EXPERT !== get_post_type( $picked ) ) {
			$picked = 0;
		}
		$fixed = (int) $args['expert'] > 0 && $picked;

		$user   = wp_get_current_user();
		$name   = $user->exists() ? trim( $user->first_name . ' ' . $user->last_name ) : '';
		$name   = '' !== $name ? $name : ( $user->exists() ? $user->display_name : '' );
		$mobile = $user->exists() ? (string) get_user_meta( $user->ID, 'hamista_mobile', true ) : '';
		if ( '' === $mobile && $user->exists() ) {
			$mobile = (string) get_user_meta( $user->ID, 'billing_phone', true );
		}
		$id        = wp_unique_id( 'hm-book-' );
		$login     = hamista_core_option( 'booking_login', false ) && ! is_user_logged_in();
		$login_url = function_exists( 'wc_get_page_permalink' ) && class_exists( 'WooCommerce' ) ? wc_get_page_permalink( 'myaccount' ) : wp_login_url( get_permalink() );

		self::enqueue();
		ob_start();
		?>
		<div class="hm-book hm-book--<?php echo esc_attr( 'plain' === $args['style'] ? 'plain' : 'card' ); ?>" id="<?php echo esc_attr( $id ); ?>" data-hm-book data-expert="<?php echo esc_attr( (string) $picked ); ?>"<?php echo $picked ? ' data-name="' . esc_attr( get_the_title( $picked ) ) . '" data-fee="' . esc_attr( hamista_core_digits( Booking::field( $picked, 'fee' ) ) ) . '"' : ''; ?><?php echo $fixed ? ' data-fixed' : ''; ?>>
			<?php if ( $args['title'] || $args['intro'] ) : ?>
				<div class="hm-book__head">
					<?php if ( $args['title'] ) : ?>
						<h2 class="hm-book__title"><?php echo esc_html( $args['title'] ); ?></h2>
					<?php endif; ?>
					<?php if ( $args['intro'] ) : ?>
						<p class="hm-book__intro"><?php echo esc_html( $args['intro'] ); ?></p>
					<?php endif; ?>
				</div>
			<?php endif; ?>

			<ol class="hm-book__progress" aria-hidden="true">
				<?php if ( ! $fixed ) : ?>
					<li data-for="expert"><span><?php echo esc_html( hamista_core_digits( '1' ) ); ?></span><?php echo esc_html( Booking::label( 'one' ) ); ?></li>
				<?php endif; ?>
				<li data-for="time"><span><?php echo esc_html( hamista_core_digits( $fixed ? '1' : '2' ) ); ?></span><?php esc_html_e( 'Day & time', 'hamista-core' ); ?></li>
				<li data-for="details"><span><?php echo esc_html( hamista_core_digits( $fixed ? '2' : '3' ) ); ?></span><?php esc_html_e( 'Your details', 'hamista-core' ); ?></li>
			</ol>
			<p class="screen-reader-text" aria-live="polite" data-hm-book-live></p>

			<?php if ( ! $fixed ) : ?>
				<section class="hm-book__step" data-step="expert" aria-labelledby="<?php echo esc_attr( $id ); ?>-s1">
					<h3 class="hm-book__label" id="<?php echo esc_attr( $id ); ?>-s1">
					<?php
					/* translators: %s: e.g. "doctor", "lawyer" */
					echo esc_html( sprintf( __( 'Choose the %s', 'hamista-core' ), Booking::label( 'one' ) ) );
					?>
					</h3>
					<div data-hm-widget="pfilter">
						<?php echo self::filters( $experts ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in filters(). ?>
						<div class="hm-book__experts" role="radiogroup" aria-labelledby="<?php echo esc_attr( $id ); ?>-s1">
							<?php foreach ( $experts as $expert ) : ?>
								<?php
								$terms = Booking::groups( $expert->ID );
								$slugs = array();
								foreach ( $terms as $term ) {
									$slugs[] = 'hm-sv-' . $term->term_id;
								}
								$role = Booking::field( $expert->ID, 'role' );
								$fee  = Booking::field( $expert->ID, 'fee' );
								?>
								<label class="hm-book__pick" data-terms="<?php echo esc_attr( implode( ' ', $slugs ) ); ?>">
									<input type="radio" name="<?php echo esc_attr( $id ); ?>-expert" value="<?php echo esc_attr( (string) $expert->ID ); ?>"<?php checked( $picked, $expert->ID ); ?> data-name="<?php echo esc_attr( get_the_title( $expert ) ); ?>" data-fee="<?php echo esc_attr( hamista_core_digits( $fee ) ); ?>">
									<span class="hm-book__avatar">
										<?php
										$thumb = get_the_post_thumbnail(
											$expert,
											'thumbnail',
											array(
												'alt'     => '',
												'loading' => 'lazy',
											)
										);
										echo $thumb ? $thumb : hamista_core_icon( 'stethoscope', array( 'size' => 22 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- core markup / static SVG.
										?>
									</span>
									<span class="hm-book__pick-text">
										<strong><?php echo esc_html( get_the_title( $expert ) ); ?></strong>
										<small><?php echo esc_html( $role ? $role : implode( '، ', wp_list_pluck( $terms, 'name' ) ) ); ?></small>
									</span>
									<?php if ( $fee ) : ?>
										<span class="hm-book__fee"><?php echo esc_html( hamista_core_digits( $fee ) ); ?></span>
									<?php endif; ?>
									<span class="hm-book__tick" aria-hidden="true"><?php echo hamista_core_icon( 'check', array( 'size' => 14 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG. ?></span>
								</label>
							<?php endforeach; ?>
						</div>
					</div>
					<div class="hm-book__nav">
						<button type="button" class="hm-btn" data-go="time"><?php esc_html_e( 'See free times', 'hamista-core' ); ?><?php echo hamista_core_icon( 'arrow', array( 'size' => 16 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG. ?></button>
					</div>
				</section>
			<?php endif; ?>

			<section class="hm-book__step" data-step="time" aria-labelledby="<?php echo esc_attr( $id ); ?>-s2"<?php echo $fixed ? '' : ' hidden'; ?>>
				<div class="hm-book__row">
					<h3 class="hm-book__label" id="<?php echo esc_attr( $id ); ?>-s2"><?php esc_html_e( 'Pick a day and time', 'hamista-core' ); ?></h3>
					<?php if ( ! $fixed ) : ?>
						<button type="button" class="hm-book__change" data-go="expert"><?php echo hamista_core_icon( 'arrow-right', array( 'size' => 14 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG. ?><span data-hm-book-expert></span></button>
					<?php endif; ?>
				</div>
				<div class="hm-book__days" role="radiogroup" aria-label="<?php esc_attr_e( 'Day', 'hamista-core' ); ?>" data-hm-days></div>
				<div class="hm-book__slots" data-hm-slots aria-live="polite"></div>
				<div class="hm-book__nav">
					<button type="button" class="hm-btn" data-go="details" disabled><?php esc_html_e( 'Continue', 'hamista-core' ); ?><?php echo hamista_core_icon( 'arrow', array( 'size' => 16 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG. ?></button>
				</div>
			</section>

			<section class="hm-book__step" data-step="details" aria-labelledby="<?php echo esc_attr( $id ); ?>-s3" hidden>
				<div class="hm-book__row">
					<h3 class="hm-book__label" id="<?php echo esc_attr( $id ); ?>-s3"><?php esc_html_e( 'Your details', 'hamista-core' ); ?></h3>
					<button type="button" class="hm-book__change" data-go="time"><?php echo hamista_core_icon( 'arrow-right', array( 'size' => 14 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG. ?><?php esc_html_e( 'Change time', 'hamista-core' ); ?></button>
				</div>
				<dl class="hm-book__summary">
					<div><dt><?php echo esc_html( Booking::label( 'one' ) ); ?></dt><dd data-sum="expert"></dd></div>
					<div><dt><?php esc_html_e( 'Day', 'hamista-core' ); ?></dt><dd data-sum="day"></dd></div>
					<div><dt><?php esc_html_e( 'Time', 'hamista-core' ); ?></dt><dd data-sum="time"></dd></div>
					<div data-sum-fee hidden><dt><?php echo esc_html( Booking::label( 'fee' ) ); ?></dt><dd data-sum="fee"></dd></div>
				</dl>
				<?php if ( $login ) : ?>
					<div class="hm-book__login">
						<p><?php echo esc_html( Booking::word( 'login_book' ) ); ?></p>
						<a class="hm-btn" href="<?php echo esc_url( $login_url ); ?>" data-hm-login><?php esc_html_e( 'Log in or sign up', 'hamista-core' ); ?></a>
					</div>
				<?php else : ?>
					<form class="hm-book__form" data-hm-book-form novalidate>
						<div class="hm-book__fields">
							<p class="hm-field">
								<label for="<?php echo esc_attr( $id ); ?>-name"><?php esc_html_e( 'Full name', 'hamista-core' ); ?></label>
								<input type="text" id="<?php echo esc_attr( $id ); ?>-name" name="name" autocomplete="name" required maxlength="80" value="<?php echo esc_attr( $name ); ?>">
							</p>
							<p class="hm-field">
								<label for="<?php echo esc_attr( $id ); ?>-mobile"><?php esc_html_e( 'Mobile number', 'hamista-core' ); ?></label>
								<input type="tel" id="<?php echo esc_attr( $id ); ?>-mobile" name="mobile" autocomplete="tel" inputmode="tel" dir="ltr" required maxlength="16" placeholder="<?php echo esc_attr( hamista_core_digits( '0912 123 4567' ) ); ?>" value="<?php echo esc_attr( $mobile ); ?>">
							</p>
						</div>
						<?php if ( hamista_core_option( 'booking_qty', false ) ) : ?>
							<p class="hm-field hm-book__qty">
								<label for="<?php echo esc_attr( $id ); ?>-qty"><?php echo esc_html( Rest::qty_label() ); ?></label>
								<span class="hm-book__stepper">
									<button type="button" data-qty="-1" aria-label="<?php esc_attr_e( 'Fewer', 'hamista-core' ); ?>"><?php echo hamista_core_icon( 'minus', array( 'size' => 14 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG. ?></button>
									<input type="text" id="<?php echo esc_attr( $id ); ?>-qty" name="qty" value="<?php echo esc_attr( hamista_core_digits( '1' ) ); ?>" data-max="<?php echo esc_attr( (string) Rest::qty_max() ); ?>" inputmode="numeric" dir="ltr" maxlength="3">
									<button type="button" data-qty="1" aria-label="<?php esc_attr_e( 'More', 'hamista-core' ); ?>"><?php echo hamista_core_icon( 'plus', array( 'size' => 14 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG. ?></button>
								</span>
							</p>
						<?php endif; ?>
						<?php foreach ( Rest::form_fields() as $hm_key => $hm_field ) : ?>
							<?php $hm_fid = $id . '-' . $hm_key; ?>
							<?php if ( 'checkbox' === $hm_field['type'] ) : ?>
								<p class="hm-field hm-field--check">
									<label><input type="checkbox" name="fields[<?php echo esc_attr( $hm_key ); ?>]" value="1"<?php echo $hm_field['required'] ? ' required' : ''; ?>> <?php echo esc_html( $hm_field['label'] ); ?></label>
								</p>
							<?php else : ?>
								<p class="hm-field">
									<label for="<?php echo esc_attr( $hm_fid ); ?>"><?php echo esc_html( $hm_field['label'] ); ?><?php echo $hm_field['required'] ? '' : ' <span class="hm-field__opt">(' . esc_html__( 'optional', 'hamista-core' ) . ')</span>'; ?></label>
									<?php if ( 'textarea' === $hm_field['type'] ) : ?>
										<textarea id="<?php echo esc_attr( $hm_fid ); ?>" name="fields[<?php echo esc_attr( $hm_key ); ?>]" rows="2" maxlength="1000"<?php echo $hm_field['required'] ? ' required' : ''; ?>></textarea>
									<?php elseif ( 'select' === $hm_field['type'] ) : ?>
										<select id="<?php echo esc_attr( $hm_fid ); ?>" name="fields[<?php echo esc_attr( $hm_key ); ?>]"<?php echo $hm_field['required'] ? ' required' : ''; ?>>
											<option value=""><?php esc_html_e( 'Choose…', 'hamista-core' ); ?></option>
											<?php foreach ( $hm_field['choices'] as $hm_choice ) : ?>
												<option value="<?php echo esc_attr( $hm_choice ); ?>"><?php echo esc_html( $hm_choice ); ?></option>
											<?php endforeach; ?>
										</select>
									<?php else : ?>
										<input type="text" id="<?php echo esc_attr( $hm_fid ); ?>" name="fields[<?php echo esc_attr( $hm_key ); ?>]" maxlength="200"<?php echo 'number' === $hm_field['type'] ? ' inputmode="numeric"' : ''; ?><?php echo $hm_field['required'] ? ' required' : ''; ?>>
									<?php endif; ?>
								</p>
							<?php endif; ?>
						<?php endforeach; ?>
						<?php if ( $args['note'] ) : ?>
							<p class="hm-field">
								<label for="<?php echo esc_attr( $id ); ?>-note"><?php esc_html_e( 'Notes (optional)', 'hamista-core' ); ?></label>
								<textarea id="<?php echo esc_attr( $id ); ?>-note" name="note" rows="2" maxlength="500"></textarea>
							</p>
						<?php endif; ?>
						<p class="hm-hp" aria-hidden="true"><label><?php esc_html_e( 'Leave this field empty', 'hamista-core' ); ?><input type="text" name="website" tabindex="-1" autocomplete="off"></label></p>
						<p class="hm-book__msg" role="alert" data-hm-book-msg></p>
						<div class="hm-book__nav">
							<button type="submit" class="hm-btn"><?php echo hamista_core_icon( 'calendar', array( 'size' => 16 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG. ?><span><?php echo esc_html( Booking::word( 'submit' ) ); ?></span></button>
						</div>
					</form>
				<?php endif; ?>
			</section>

			<section class="hm-book__step hm-book__done" data-step="done" hidden tabindex="-1">
				<span class="hm-book__done-icon" aria-hidden="true"><?php echo hamista_core_icon( 'check', array( 'size' => 28 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG. ?></span>
				<h3 class="hm-book__label"><?php echo esc_html( Booking::word( 'done' ) ); ?></h3>
				<p data-hm-book-done></p>
				<div class="hm-book__nav hm-book__nav--center">
					<?php if ( is_user_logged_in() && self::appointments_url() ) : ?>
						<a class="hm-btn hm-btn--ghost" href="<?php echo esc_url( self::appointments_url() ); ?>"><?php echo esc_html( Booking::word( 'mine' ) ); ?></a>
					<?php endif; ?>
					<button type="button" class="hm-btn hm-btn--ghost" data-hm-book-again><?php esc_html_e( 'Book another', 'hamista-core' ); ?></button>
				</div>
			</section>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	/* ---------------------------------------------------------------------
	 * Weekly hours
	 * ------------------------------------------------------------------ */

	/**
	 * Weekly hours list for a profile page.
	 *
	 * @param int $id Expert ID.
	 * @return string
	 */
	public static function hours( $id ) {
		$today = (int) wp_date( 'w' );
		$html  = '<ul class="hm-hours-list">';
		foreach ( Booking::schedule( $id ) as $day => $row ) {
			$ranges = Booking::ranges( $row );
			$text   = array();
			foreach ( $ranges as $range ) {
				/* translators: 1: start time, 2: end time */
				$text[] = sprintf( __( '%1$s to %2$s', 'hamista-core' ), Booking::time_label( $range[0] ), Booking::time_label( $range[1] ) );
			}
			$html .= '<li class="' . ( $ranges ? 'is-on' : 'is-off' ) . ( $today === $day ? ' is-today' : '' ) . '"><span>' . esc_html( Booking::weekdays()[ $day ] ) . '</span><span>' . esc_html( $text ? implode( ' · ', $text ) : __( 'Closed', 'hamista-core' ) ) . '</span></li>';
		}
		return $html . '</ul>';
	}

	/* ---------------------------------------------------------------------
	 * My appointments
	 * ------------------------------------------------------------------ */

	/**
	 * Where logged-in visitors see their appointments.
	 *
	 * @return string
	 */
	public static function appointments_url() {
		if ( class_exists( 'WooCommerce' ) && function_exists( 'wc_get_account_endpoint_url' ) && wc_get_page_id( 'myaccount' ) > 0 ) {
			return wc_get_account_endpoint_url( Account_Tab::ENDPOINT );
		}
		return (string) apply_filters( 'hamista_core/appointments_url', '' );
	}

	/**
	 * The current visitor's appointments, newest first.
	 *
	 * @return array[] { id, expert, date, time, status, upcoming }
	 */
	public static function user_appointments() {
		$user = get_current_user_id();
		if ( ! $user ) {
			return array();
		}
		$ids = get_posts(
			array(
				'post_type'      => Booking::APPOINTMENT,
				'post_status'    => 'publish',
				'posts_per_page' => 50,
				'fields'         => 'ids',
				'no_found_rows'  => true,
				'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					'hm_user' => array(
						'key'   => '_hm_user',
						'value' => $user,
					),
					'hm_date' => array(
						'key'     => '_hm_date',
						'compare' => 'EXISTS',
					),
					'hm_time' => array(
						'key'     => '_hm_time',
						'compare' => 'EXISTS',
					),
				),
				'orderby'        => array(
					'hm_date' => 'DESC',
					'hm_time' => 'DESC',
				),
			)
		);
		$now = time();
		$out = array();
		foreach ( $ids as $id ) {
			$date   = (string) get_post_meta( $id, '_hm_date', true );
			$time   = (string) get_post_meta( $id, '_hm_time', true );
			$at     = date_create_immutable( $date . ' ' . $time, wp_timezone() );
			$status = (string) get_post_meta( $id, '_hm_status', true );
			$out[]  = array(
				'id'       => $id,
				'expert'   => (int) get_post_meta( $id, '_hm_expert', true ),
				'date'     => $date,
				'time'     => $time,
				'status'   => $status,
				'upcoming' => $at && $at->getTimestamp() >= $now && in_array( $status, array( 'pending', 'confirmed' ), true ),
			);
		}
		return $out;
	}

	/**
	 * One appointment row.
	 *
	 * @param array $item From user_appointments().
	 * @return string
	 */
	private static function appointment_item( $item ) {
		$labels = Booking::statuses();
		$status = isset( $labels[ $item['status'] ] ) ? $item['status'] : 'pending';
		$expert = $item['expert'];
		$terms  = Booking::groups( $expert );
		$role   = Booking::field( $expert, 'role' );
		$place  = Booking::field( $expert, 'location' );
		$html   = '<li class="hm-appt' . ( $item['upcoming'] ? ' is-upcoming' : '' ) . '" data-hm-appt="' . esc_attr( (string) $item['id'] ) . '">';
		$html  .= '<div class="hm-appt__date"><span>' . esc_html( Booking::date_label( $item['date'], 'l' ) ) . '</span><strong>' . esc_html( Booking::date_label( $item['date'], 'j' ) ) . '</strong><span>' . esc_html( Booking::date_label( $item['date'], 'F' ) ) . '</span></div>';
		$html  .= '<div class="hm-appt__body"><p class="hm-appt__doc">' . ( $expert ? '<a href="' . esc_url( get_permalink( $expert ) ) . '">' . esc_html( get_the_title( $expert ) ) . '</a>' : '' ) . '</p>';
		$html  .= '<p class="hm-appt__meta">' . hamista_core_icon( 'clock', array( 'size' => 14 ) ) . '<span>' . esc_html( Booking::time_label( $item['time'] ) ) . '</span>';
		$sub    = $role ? $role : implode( '، ', wp_list_pluck( $terms, 'name' ) );
		if ( $sub ) {
			$html .= '<span class="hm-appt__dot" aria-hidden="true">·</span><span>' . esc_html( $sub ) . '</span>';
		}
		$qty = max( 1, (int) get_post_meta( $item['id'], '_hm_qty', true ) );
		if ( $qty > 1 ) {
			$html .= '<span class="hm-appt__dot" aria-hidden="true">·</span><span>' . esc_html( Rest::qty_label() . ': ' . hamista_core_num( $qty ) ) . '</span>';
		}
		$html .= '</p>';
		if ( $place && $item['upcoming'] ) {
			$html .= '<p class="hm-appt__meta">' . hamista_core_icon( 'pin', array( 'size' => 14 ) ) . '<span>' . esc_html( hamista_core_digits( $place ) ) . '</span></p>';
		}
		$html .= '</div><div class="hm-appt__side"><span class="hm-appt__status hm-appt__status--' . esc_attr( $status ) . '" data-hm-appt-status>' . esc_html( $labels[ $status ] ) . '</span>';
		if ( Rest::can_cancel( $item['id'] ) ) {
			$html .= '<button type="button" class="hm-appt__cancel" data-hm-cancel="' . esc_attr( (string) $item['id'] ) . '">' . esc_html_x( 'Cancel', 'appointment', 'hamista-core' ) . '</button>';
		}
		return $html . '</div></li>';
	}

	/**
	 * The "My appointments" list.
	 *
	 * @return string
	 */
	public static function appointments() {
		if ( ! is_user_logged_in() ) {
			return '';
		}
		self::enqueue();
		$items    = self::user_appointments();
		$upcoming = array_values( wp_list_filter( $items, array( 'upcoming' => true ) ) );
		$past     = array_values( wp_list_filter( $items, array( 'upcoming' => false ) ) );
		$book     = Booking::booking_url();

		$html = '<div class="hm-appts" data-hm-appts>';
		if ( ! $items ) {
			$html .= '<div class="hm-appts__empty">' . hamista_core_icon( 'calendar', array( 'size' => 28 ) ) . '<p>' . esc_html( Booking::word( 'empty' ) ) . '</p>';
			if ( $book ) {
				$html .= '<a class="hm-btn" href="' . esc_url( $book ) . '">' . esc_html( Booking::word( 'book' ) ) . '</a>';
			}
			return $html . '</div></div>';
		}
		$html .= '<div class="hm-appts__head"><h3>' . esc_html__( 'Upcoming', 'hamista-core' ) . '</h3>';
		if ( $book ) {
			$html .= '<a class="hm-btn hm-btn--sm" href="' . esc_url( $book ) . '">' . hamista_core_icon( 'plus', array( 'size' => 14 ) ) . esc_html( Booking::word( 'new' ) ) . '</a>';
		}
		$html .= '</div>';
		if ( $upcoming ) {
			// Soonest first for what is ahead.
			$html .= '<ul class="hm-appts__list">' . implode( '', array_map( array( __CLASS__, 'appointment_item' ), array_reverse( $upcoming ) ) ) . '</ul>';
		} else {
			$html .= '<p class="hm-appts__none">' . esc_html( Booking::word( 'none_upcoming' ) ) . '</p>';
		}
		if ( $past ) {
			$html .= '<details class="hm-appts__past"' . ( $upcoming ? '' : ' open' ) . '><summary>' . esc_html__( 'Past and cancelled', 'hamista-core' ) . ' <span>' . esc_html( hamista_core_num( count( $past ) ) ) . '</span></summary><ul class="hm-appts__list">' . implode( '', array_map( array( __CLASS__, 'appointment_item' ), $past ) ) . '</ul></details>';
		}
		$html .= '<p class="hm-appts__msg" role="status" data-hm-appts-msg></p>';
		return $html . '</div>';
	}
}
