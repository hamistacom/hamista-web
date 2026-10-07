<?php
/**
 * Portfolio archive and portfolio category pages.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

get_header();

if ( ! hamista_elementor_location( 'archive' ) ) :
	$hamista_term = is_tax( 'hm_portfolio_cat' ) ? get_queried_object() : null;
	hamista_page_head(
		$hamista_term ? single_term_title( '', false ) : post_type_archive_title( '', false ),
		$hamista_term ? term_description() : '',
		__( 'Selected work', 'hamista' )
	);
	$hamista_cats = get_terms(
		array(
			'taxonomy'   => 'hm_portfolio_cat',
			'hide_empty' => true,
			'parent'     => 0,
		)
	);
	?>
	<main id="main" class="hm-main hm-section"<?php echo hamista_main_top_style(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- fixed attribute. ?>>
		<div class="hm-container">
			<?php if ( ! is_wp_error( $hamista_cats ) && count( $hamista_cats ) > 1 ) : ?>
				<nav class="hm-filters" aria-label="<?php esc_attr_e( 'Project categories', 'hamista' ); ?>">
					<a class="hm-chip<?php echo $hamista_term ? '' : ' is-active'; ?>" href="<?php echo esc_url( get_post_type_archive_link( 'hm_portfolio' ) ); ?>"><?php esc_html_e( 'All', 'hamista' ); ?></a>
					<?php foreach ( $hamista_cats as $hamista_cat ) : ?>
						<a class="hm-chip<?php echo $hamista_term && $hamista_term->term_id === $hamista_cat->term_id ? ' is-active' : ''; ?>" href="<?php echo esc_url( get_term_link( $hamista_cat ) ); ?>"><?php echo esc_html( $hamista_cat->name ); ?></a>
					<?php endforeach; ?>
				</nav>
			<?php endif; ?>

			<?php if ( have_posts() ) : ?>
				<div class="hm-pfgrid">
					<?php
					while ( have_posts() ) :
						the_post();
						if ( class_exists( '\Hamista\Core\Portfolio\Portfolio' ) ) {
							echo \Hamista\Core\Portfolio\Portfolio::card( get_the_ID() ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped inside.
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
