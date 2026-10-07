<?php
/**
 * Team archive (experts available for booking) and their service pages.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

get_header();

if ( ! hamista_elementor_location( 'archive' ) ) :
	$hamista_booking = class_exists( '\Hamista\Core\Booking\Booking' );
	$hamista_term    = is_tax( 'hm_service' ) ? get_queried_object() : null;
	hamista_page_head(
		$hamista_term ? single_term_title( '', false ) : post_type_archive_title( '', false ),
		$hamista_term ? term_description() : '',
		$hamista_booking && 'place' === \Hamista\Core\Booking\Booking::kind() ? __( 'Book online', 'hamista' ) : __( 'Our team', 'hamista' )
	);
	$hamista_groups = get_terms(
		array(
			'taxonomy'   => 'hm_service',
			'hide_empty' => true,
			'parent'     => 0,
		)
	);
	?>
	<main id="main" class="hm-main hm-section hm-experts-page"<?php echo hamista_main_top_style(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- fixed attribute. ?>>
		<div class="hm-container">
			<?php if ( ! is_wp_error( $hamista_groups ) && count( $hamista_groups ) > 1 ) : ?>
				<nav class="hm-filters" aria-label="<?php echo esc_attr( $hamista_booking ? \Hamista\Core\Booking\Booking::label( 'group_many' ) : __( 'Categories', 'hamista' ) ); ?>">
					<a class="hm-chip<?php echo $hamista_term ? '' : ' is-active'; ?>" href="<?php echo esc_url( get_post_type_archive_link( 'hm_expert' ) ); ?>"<?php echo $hamista_term ? '' : ' aria-current="page"'; ?>><?php esc_html_e( 'All', 'hamista' ); ?></a>
					<?php foreach ( $hamista_groups as $hamista_group ) : ?>
						<?php $hamista_on = $hamista_term && $hamista_term->term_id === $hamista_group->term_id; ?>
						<a class="hm-chip<?php echo $hamista_on ? ' is-active' : ''; ?>" href="<?php echo esc_url( get_term_link( $hamista_group ) ); ?>"<?php echo $hamista_on ? ' aria-current="page"' : ''; ?>><?php echo esc_html( $hamista_group->name ); ?></a>
					<?php endforeach; ?>
				</nav>
			<?php endif; ?>

			<?php if ( have_posts() ) : ?>
				<div class="hm-expertgrid">
					<?php
					while ( have_posts() ) :
						the_post();
						if ( $hamista_booking ) {
							echo \Hamista\Core\Booking\Booking::card( get_the_ID() ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped inside.
						} else {
							get_template_part( 'template-parts/content/card' );
						}
					endwhile;
					?>
				</div>
				<?php hamista_pagination(); ?>
			<?php else : ?>
				<?php get_template_part( 'template-parts/content/none' ); ?>
			<?php endif; ?>
		</div>
	</main>
	<?php
endif;

get_footer();
