<?php
/**
 * Single post.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

get_header();

if ( ! hamista_elementor_location( 'single' ) ) :
	while ( have_posts() ) :
		the_post();
		?>
		<main id="main" class="hm-main">
			<article <?php post_class( 'hm-single' ); ?>>
				<header class="hm-single-hero">
					<div class="hm-container--narrow">
						<?php hamista_breadcrumbs(); ?>
						<div class="hm-single-hero__cats" style="margin-top:22px"><?php hamista_post_categories( 3 ); ?></div>
						<h1 class="hm-single-hero__title entry-title" data-hm-reveal="words"><?php the_title(); ?></h1>
						<?php if ( has_excerpt() ) : ?>
							<p class="hm-single-hero__excerpt"><?php echo esc_html( get_the_excerpt() ); ?></p>
						<?php endif; ?>
						<div class="hm-single-meta">
							<a class="hm-single-meta__author" href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>">
								<?php echo get_avatar( get_the_author_meta( 'ID' ), 80, '', '', array( 'class' => 'hm-avatar' ) ); ?>
								<?php the_author(); ?>
							</a>
							<span class="hm-meta-sep"></span>
							<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
							<?php if ( hamista_option( 'reading_time' ) ) : ?>
								<span class="hm-meta-sep"></span>
								<span><?php echo esc_html( hamista_reading_time() ); ?></span>
							<?php endif; ?>
						</div>
					</div>
					<?php if ( has_post_thumbnail() ) : ?>
						<figure class="hm-single-figure hm-container">
							<?php
							the_post_thumbnail(
								'hamista-wide',
								array(
									'loading'       => 'eager',
									'fetchpriority' => 'high',
									'sizes'         => '(max-width: 1320px) 100vw, 1320px',
								)
							);
							?>
						</figure>
					<?php endif; ?>
				</header>

				<div class="hm-single-body">
					<div class="hm-container hm-single-layout">
						<div class="hm-prose entry-content">
							<?php
							the_content();
							wp_link_pages(
								array(
									'before' => '<nav class="hm-pagination"><div class="nav-links">',
									'after'  => '</div></nav>',
								)
							);
							?>
						</div>

						<?php if ( hamista_option( 'single_share' ) ) : ?>
							<aside class="hm-single-aside" aria-label="<?php esc_attr_e( 'Share', 'hamista' ); ?>">
								<?php hamista_share_links(); ?>
							</aside>
						<?php endif; ?>

						<div class="hm-single-after">
							<?php
							$hamista_tags = get_the_tags();
							if ( $hamista_tags ) {
								echo '<div class="hm-tags">';
								foreach ( $hamista_tags as $hamista_tag ) {
									printf( '<a class="hm-chip" href="%s">#%s</a>', esc_url( get_tag_link( $hamista_tag ) ), esc_html( $hamista_tag->name ) );
								}
								echo '</div>';
							}

							if ( hamista_option( 'single_author' ) && get_the_author_meta( 'description' ) ) :
								?>
								<div class="hm-author-box">
									<?php echo get_avatar( get_the_author_meta( 'ID' ), 144, '', '', array( 'class' => 'hm-avatar' ) ); ?>
									<div>
										<h3><?php the_author(); ?></h3>
										<p><?php echo esc_html( get_the_author_meta( 'description' ) ); ?></p>
									</div>
								</div>
								<?php
							endif;

							if ( hamista_option( 'single_nav' ) ) {
								$hamista_prev = get_previous_post();
								$hamista_next = get_next_post();
								if ( $hamista_prev || $hamista_next ) {
									echo '<nav class="hm-post-nav" aria-label="' . esc_attr__( 'More posts', 'hamista' ) . '">';
									if ( $hamista_prev ) {
										printf( '<a href="%s"><small>%s</small><strong>%s</strong></a>', esc_url( get_permalink( $hamista_prev ) ), esc_html__( 'Previous post', 'hamista' ), esc_html( get_the_title( $hamista_prev ) ) );
									} else {
										echo '<span></span>';
									}
									if ( $hamista_next ) {
										printf( '<a class="is-next" href="%s"><small>%s</small><strong>%s</strong></a>', esc_url( get_permalink( $hamista_next ) ), esc_html__( 'Next post', 'hamista' ), esc_html( get_the_title( $hamista_next ) ) );
									}
									echo '</nav>';
								}
							}

							if ( comments_open() || get_comments_number() ) {
								comments_template();
							}
							?>
						</div>
					</div>
				</div>
			</article>

			<?php
			if ( hamista_option( 'single_related' ) ) {
				get_template_part( 'template-parts/post/related' );
			}
			?>
		</main>
		<?php
	endwhile;
endif;

get_footer();
