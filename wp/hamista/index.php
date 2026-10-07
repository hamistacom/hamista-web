<?php
/**
 * Blog index, archives and search results.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

get_header();

if ( ! hamista_elementor_location( 'archive' ) ) :
	if ( is_search() ) {
		/* translators: %s: search query */
		hamista_page_head( sprintf( __( 'Results for “%s”', 'hamista' ), esc_html( get_search_query() ) ), '', __( 'Search', 'hamista' ) );
	} elseif ( is_home() ) {
		$hamista_blog_page = (int) get_option( 'page_for_posts' );
		hamista_page_head(
			$hamista_blog_page ? get_the_title( $hamista_blog_page ) : __( 'Journal', 'hamista' ),
			$hamista_blog_page ? get_the_excerpt( $hamista_blog_page ) : get_bloginfo( 'description' )
		);
	} else {
		hamista_page_head( get_the_archive_title(), get_the_archive_description() );
	}

	$hamista_columns  = max( 1, min( 4, (int) hamista_option( 'blog_columns', 3 ) ) );
	$hamista_list     = 'list' === hamista_option( 'blog_layout' );
	$hamista_featured = ! is_search() && ! is_paged() && hamista_option( 'blog_featured_first' ) && ! $hamista_list;
	?>
	<main id="main" class="hm-main hm-section"<?php echo hamista_main_top_style(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- fixed attribute. ?>>
		<div class="hm-container <?php echo hamista_has_sidebar() ? 'hm-layout hm-layout--sidebar' : ''; ?>">
			<div>
				<?php if ( have_posts() ) : ?>
					<div class="hm-posts<?php echo $hamista_list ? ' hm-posts--list' : ''; ?>" style="--hm-cols: <?php echo (int) ( hamista_has_sidebar() ? min( 2, $hamista_columns ) : $hamista_columns ); ?>">
						<?php
						$hamista_index = 0;
						while ( have_posts() ) :
							the_post();
							get_template_part(
								'template-parts/content/card',
								null,
								array(
									'featured' => $hamista_featured && 0 === $hamista_index,
									'heading'  => 'h2',
								)
							);
							++$hamista_index;
						endwhile;
						?>
					</div>
					<?php hamista_pagination(); ?>
				<?php else : ?>
					<?php get_template_part( 'template-parts/content/none' ); ?>
				<?php endif; ?>
			</div>
			<?php
			if ( hamista_has_sidebar() ) {
				get_sidebar();
			}
			?>
		</div>
	</main>
	<?php
endif;

get_footer();
