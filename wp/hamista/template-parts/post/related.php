<?php
/**
 * Related posts (same category, newest first).
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

$hamista_cats = wp_get_post_categories( get_the_ID() );
$hamista_rel  = new WP_Query(
	array(
		'post_type'           => 'post',
		'posts_per_page'      => 3,
		'post__not_in'        => array( get_the_ID() ),
		'category__in'        => $hamista_cats,
		'ignore_sticky_posts' => true,
		'no_found_rows'       => true,
	)
);

if ( $hamista_rel->have_posts() ) :
	?>
	<section class="hm-related" aria-labelledby="hm-related-title">
		<div class="hm-container">
			<div class="hm-related__head">
				<h2 id="hm-related-title"><?php esc_html_e( 'Keep reading', 'hamista' ); ?></h2>
				<?php
				$hamista_blog = (int) get_option( 'page_for_posts' );
				$hamista_more = $hamista_cats ? get_category_link( $hamista_cats[0] ) : ( $hamista_blog ? get_permalink( $hamista_blog ) : home_url( '/' ) );
				?>
				<a class="hm-btn hm-btn--secondary hm-btn--sm" href="<?php echo esc_url( $hamista_more ); ?>"><?php esc_html_e( 'All posts', 'hamista' ); ?><?php hamista_icon( 'arrow' ); ?></a>
			</div>
			<div class="hm-posts">
				<?php
				while ( $hamista_rel->have_posts() ) :
					$hamista_rel->the_post();
					get_template_part( 'template-parts/content/card', null, array( 'excerpt' => false ) );
				endwhile;
				wp_reset_postdata();
				?>
			</div>
		</div>
	</section>
	<?php
endif;
