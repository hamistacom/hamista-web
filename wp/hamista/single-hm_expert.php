<?php
/**
 * Profile of a team member who takes appointments: photo, title, key facts,
 * weekly hours, biography and the booking form for this person.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

get_header();

if ( ! hamista_elementor_location( 'single' ) ) :
	$hamista_booking = class_exists( '\Hamista\Core\Booking\Booking' );
	while ( have_posts() ) :
		the_post();
		$hamista_id    = get_the_ID();
		$hamista_terms = get_the_terms( $hamista_id, 'hm_service' );
		$hamista_terms = $hamista_terms && ! is_wp_error( $hamista_terms ) ? $hamista_terms : array();
		$hamista_role  = $hamista_booking ? \Hamista\Core\Booking\Booking::field( $hamista_id, 'role' ) : '';
		$hamista_facts = array();
		if ( $hamista_booking ) {
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
								echo '<span class="hm-expert__blank">' . hamista_get_icon( 'user', array( 'size' => 42 ) ) . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG.
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
								<?php if ( $hamista_booking ) : ?>
									<aside class="hm-profile__box" aria-labelledby="hm-profile-hours">
										<h2 id="hm-profile-hours"><?php esc_html_e( 'Weekly hours', 'hamista' ); ?></h2>
										<?php echo \Hamista\Core\Booking\View::hours( $hamista_id ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped inside. ?>
									</aside>
								<?php endif; ?>
							</div>

							<?php if ( $hamista_booking ) : ?>
								<div class="hm-profile__actions">
									<a class="hm-btn" href="#booking"><?php echo hamista_get_icon( 'calendar', array( 'size' => 18 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG. ?><?php esc_html_e( 'Book an appointment', 'hamista' ); ?></a>
									<a class="hm-btn hm-btn--ghost" href="<?php echo esc_url( get_post_type_archive_link( 'hm_expert' ) ); ?>"><?php esc_html_e( 'The whole team', 'hamista' ); ?></a>
								</div>
							<?php endif; ?>
						</div>
					</div>

					<?php if ( $hamista_booking ) : ?>
						<section class="hm-profile__booking" id="booking" aria-labelledby="hm-profile-book">
							<h2 id="hm-profile-book">
								<?php
								/* translators: %s: person's name */
								echo esc_html( sprintf( __( 'Book an appointment with %s', 'hamista' ), get_the_title() ) );
								?>
							</h2>
							<?php echo \Hamista\Core\Booking\View::booking( array( 'expert' => $hamista_id ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped inside. ?>
						</section>
					<?php endif; ?>
				</div>
			</article>
		</main>
		<?php
	endwhile;
endif;

get_footer();
