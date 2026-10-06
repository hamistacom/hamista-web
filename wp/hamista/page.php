<?php
/**
 * Pages. Pages built with Elementor render edge to edge; other pages get a
 * readable column and the theme title.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

get_header();

if ( ! hamista_elementor_location( 'single' ) ) :
	while ( have_posts() ) :
		the_post();

		if ( hamista_is_built_with_elementor() ) :
			?>
			<main id="main" class="hm-main hm-main--builder">
				<?php if ( hamista_show_page_title() ) : ?>
					<?php hamista_page_head( get_the_title() ); ?>
				<?php endif; ?>
				<?php the_content(); ?>
			</main>
			<?php
		else :
			if ( hamista_show_page_title() ) {
				hamista_page_head( get_the_title(), has_excerpt() ? get_the_excerpt() : '' );
			}
			?>
			<main id="main" class="hm-main hm-section" style="padding-top:<?php echo hamista_show_page_title() ? '0' : 'var(--hm-space-section)'; ?>">
				<div class="hm-container--narrow">
					<div class="hm-prose entry-content">
						<?php
						the_content();
						wp_link_pages();
						?>
					</div>
					<?php
					if ( comments_open() || get_comments_number() ) {
						comments_template();
					}
					?>
				</div>
			</main>
			<?php
		endif;
	endwhile;
endif;

get_footer();
