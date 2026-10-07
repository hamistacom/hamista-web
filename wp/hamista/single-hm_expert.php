<?php
/**
 * Profile of a bookable item (a person, a table, a court…): photo, title, key
 * facts, weekly hours, description and its booking form. Sections follow
 * Hamista → Booking; a profile built with Elementor shows its own design.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

get_header();

if ( ! hamista_elementor_location( 'single' ) ) :
	$hamista_booking = class_exists( '\Hamista\Core\Booking\Booking' );
	$hamista_show    = array(
		'facts' => (bool) hamista_option( 'booking_profile_facts', true ),
		'hours' => (bool) hamista_option( 'booking_profile_hours', true ),
		'form'  => (bool) hamista_option( 'booking_profile_form', true ),
	);
	$hamista_after   = (int) hamista_option( 'booking_profile_block', 0 );
	while ( have_posts() ) :
		the_post();
		$hamista_id    = get_the_ID();
		$hamista_place = $hamista_booking && 'place' === \Hamista\Core\Booking\Booking::kind();
		$hamista_form  = $hamista_booking && $hamista_show['form'] && \Hamista\Core\Booking\Booking::bookable( $hamista_id );

		// A profile designed with Elementor keeps its own layout; the booking form and the shared block follow it.
		if ( hamista_is_built_with_elementor( $hamista_id ) ) :
			?>
			<main id="main" class="hm-main hm-main--builder">
				<?php the_content(); ?>
				<?php if ( $hamista_form ) : ?>
					<div class="hm-container hm-profile hm-profile--builder">
						<section class="hm-profile__booking" id="booking" aria-label="<?php echo esc_attr( \Hamista\Core\Booking\Booking::word( 'book' ) ); ?>">
							<?php echo \Hamista\Core\Booking\View::booking( array( 'expert' => $hamista_id ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped inside. ?>
						</section>
					</div>
				<?php endif; ?>
				<?php echo $hamista_after && function_exists( 'hamista_core_render_content' ) ? hamista_core_render_content( $hamista_after ) : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Elementor or post content. ?>
			</main>
			<?php
			continue;
		endif;

		$hamista_terms = get_the_terms( $hamista_id, 'hm_service' );
		$hamista_terms = $hamista_terms && ! is_wp_error( $hamista_terms ) ? $hamista_terms : array();
		$hamista_role  = $hamista_booking ? \Hamista\Core\Booking\Booking::field( $hamista_id, 'role' ) : '';
		$hamista_facts = array();
		if ( $hamista_booking && $hamista_show['facts'] ) {
			$hamista_years = \Hamista\Core\Booking\Booking::field( $hamista_id, 'experience' );
			/* translators: %s: number of years */
			$hamista_years = $hamista_years ? sprintf( __( '%s years', 'hamista' ), $hamista_years ) : '';
			$hamista_list  = array(
				'experience' => array( __( 'Experience', 'hamista' ), $hamista_years ),
				'fee'        => array( \Hamista\Core\Booking\Booking::label( 'fee' ), \Hamista\Core\Booking\Booking::field( $hamista_id, 'fee' ) ),
				'license'    => array( \Hamista\Core\Booking\Booking::label( 'license' ), \Hamista\Core\Booking\Booking::field( $hamista_id, 'license' ) ),
				'location'   => array( __( 'Where', 'hamista' ), \Hamista\Core\Booking\Booking::field( $hamista_id, 'location' ) ),
			);
			foreach ( $hamista_list as $hamista_key => $hamista_fact ) {
				if ( '' !== $hamista_fact[1] ) {
					$hamista_facts[ $hamista_key ] = $hamista_fact;
				}
			}
		}
		?>
		<main id="main" class="hm-main">
			<article <?php post_class( 'hm-profile' ); ?>>
				<div class="hm-container">
					<?php hamista_breadcrumbs(); ?>
					<div class="hm-profile__top">
						<figure class="hm-profile__photo">
							<?php
							if ( has_post_thumbnail() ) {
								the_post_thumbnail(
									'large',
									array(
										'loading'       => 'eager',
										'fetchpriority' => 'high',
										'sizes'         => '(max-width: 900px) 300px, 340px',
									)
								);
							} else {
								$hamista_blank = class_exists( '\\Hamista\\Core\\Booking\\Booking' ) ? \Hamista\Core\Booking\Booking::monogram( get_the_ID(), 42 ) : hamista_get_icon( $hamista_place ? 'grid' : 'user', array( 'size' => 42 ) );
								echo '<span class="hm-expert__blank">' . $hamista_blank . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped initial or static SVG.
							}
							?>
						</figure>
						<div class="hm-profile__main">
							<?php if ( $hamista_terms ) : ?>
								<p class="hm-profile__tags">
									<?php foreach ( $hamista_terms as $hamista_term ) : ?>
										<a class="hm-chip" href="<?php echo esc_url( get_term_link( $hamista_term ) ); ?>"><?php echo esc_html( $hamista_term->name ); ?></a>
									<?php endforeach; ?>
								</p>
							<?php endif; ?>
							<h1 class="hm-profile__name entry-title"><?php the_title(); ?></h1>
							<?php if ( $hamista_role || has_excerpt() ) : ?>
								<p class="hm-profile__role"><?php echo esc_html( $hamista_role ? $hamista_role : get_the_excerpt() ); ?></p>
							<?php endif; ?>

							<?php if ( $hamista_facts ) : ?>
								<dl class="hm-profile__facts">
									<?php foreach ( $hamista_facts as $hamista_fact ) : ?>
										<div class="hm-profile__fact"><dt><span><?php echo esc_html( $hamista_fact[0] ); ?></span></dt><dd><strong><?php echo esc_html( hamista_digits( $hamista_fact[1] ) ); ?></strong></dd></div>
									<?php endforeach; ?>
								</dl>
							<?php endif; ?>

							<div class="hm-profile__cols">
								<div class="hm-profile__bio hm-prose entry-content">
									<?php if ( '' !== trim( (string) get_the_content() ) ) : ?>
										<h2><?php esc_html_e( 'About', 'hamista' ); ?></h2>
										<?php the_content(); ?>
									<?php endif; ?>
								</div>
								<?php if ( $hamista_booking && $hamista_show['hours'] ) : ?>
									<aside class="hm-profile__box" aria-labelledby="hm-profile-hours">
										<h2 id="hm-profile-hours"><?php esc_html_e( 'Weekly hours', 'hamista' ); ?></h2>
										<?php echo \Hamista\Core\Booking\View::hours( $hamista_id ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped inside. ?>
									</aside>
								<?php endif; ?>
							</div>

							<?php if ( $hamista_booking ) : ?>
								<div class="hm-profile__actions">
									<?php if ( $hamista_form ) : ?>
										<a class="hm-btn" href="#booking"><?php echo hamista_get_icon( 'calendar', array( 'size' => 18 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG. ?><?php echo esc_html( \Hamista\Core\Booking\Booking::word( 'book' ) ); ?></a>
									<?php endif; ?>
									<a class="hm-btn hm-btn--ghost" href="<?php echo esc_url( get_post_type_archive_link( 'hm_expert' ) ); ?>"><?php echo esc_html( sprintf( /* translators: %s: e.g. "doctors", "tables" */ __( 'All %s', 'hamista' ), \Hamista\Core\Booking\Booking::label( 'many' ) ) ); ?></a>
								</div>
							<?php endif; ?>
						</div>
					</div>

					<?php if ( $hamista_form ) : ?>
						<section class="hm-profile__booking" id="booking" aria-labelledby="hm-profile-book">
							<h2 id="hm-profile-book">
								<?php
								echo esc_html(
									$hamista_place
										/* translators: %s: item name, e.g. "Table 4" */
										? sprintf( __( 'Book %s', 'hamista' ), get_the_title() )
										/* translators: %s: person's name */
										: sprintf( __( 'Book an appointment with %s', 'hamista' ), get_the_title() )
								);
								?>
							</h2>
							<?php echo \Hamista\Core\Booking\View::booking( array( 'expert' => $hamista_id ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped inside. ?>
						</section>
					<?php endif; ?>
				</div>
				<?php echo $hamista_after && function_exists( 'hamista_core_render_content' ) ? hamista_core_render_content( $hamista_after ) : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Elementor or post content. ?>
			</article>
		</main>
		<?php
	endwhile;
endif;

get_footer();
