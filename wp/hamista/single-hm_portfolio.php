<?php
/**
 * Single project: title, project details, cover image and content.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

get_header();

if ( ! hamista_elementor_location( 'single' ) ) :
	while ( have_posts() ) :
		the_post();
		$hamista_details = class_exists( '\Hamista\Core\Portfolio\Portfolio' ) ? \Hamista\Core\Portfolio\Portfolio::details( get_the_ID() ) : array();
		$hamista_terms   = get_the_terms( get_the_ID(), 'hm_portfolio_cat' );
		?>
		<main id="main" class="hm-main">
			<article <?php post_class( 'hm-project' ); ?>>
				<header class="hm-project__head hm-container">
					<?php hamista_breadcrumbs(); ?>
					<div class="hm-project__intro">
						<div>
							<?php if ( $hamista_terms && ! is_wp_error( $hamista_terms ) ) : ?>
								<p class="hm-eyebrow"><?php echo esc_html( implode( '، ', wp_list_pluck( $hamista_terms, 'name' ) ) ); ?></p>
							<?php endif; ?>
							<h1 class="hm-project__title entry-title" data-hm-reveal="words"><?php the_title(); ?></h1>
							<?php if ( has_excerpt() ) : ?>
								<p class="hm-project__lead"><?php echo esc_html( get_the_excerpt() ); ?></p>
							<?php endif; ?>
						</div>
						<?php if ( $hamista_details ) : ?>
							<dl class="hm-project__facts">
								<?php foreach ( $hamista_details as $hamista_key => $hamista_fact ) : ?>
									<div>
										<dt><?php echo esc_html( $hamista_fact['label'] ); ?></dt>
										<dd>
											<?php if ( 'url' === $hamista_key ) : ?>
												<a href="<?php echo esc_url( $hamista_fact['value'] ); ?>" target="_blank" rel="noopener"><?php echo esc_html( wp_parse_url( $hamista_fact['value'], PHP_URL_HOST ) ); ?></a>
											<?php else : ?>
												<?php echo esc_html( hamista_digits( $hamista_fact['value'] ) ); ?>
											<?php endif; ?>
										</dd>
									</div>
								<?php endforeach; ?>
							</dl>
						<?php endif; ?>
					</div>
				</header>
				<?php if ( has_post_thumbnail() ) : ?>
					<figure class="hm-project__cover hm-container">
						<?php
						the_post_thumbnail(
							'hamista-wide',
							array(
								'loading'       => 'eager',
								'fetchpriority' => 'high',
								'sizes'         => '(max-width: 1150px) 100vw, 1150px',
							)
						);
						?>
					</figure>
				<?php endif; ?>
				<div class="hm-container hm-project__body">
					<div class="hm-prose entry-content"><?php the_content(); ?></div>
				</div>
				<nav class="hm-container hm-project__nav" aria-label="<?php esc_attr_e( 'More projects', 'hamista' ); ?>">
					<?php
					$hamista_prev = get_previous_post();
					$hamista_next = get_next_post();
					if ( $hamista_prev ) {
						echo '<a class="hm-project__adj" href="' . esc_url( get_permalink( $hamista_prev ) ) . '"><small>' . esc_html__( 'Previous project', 'hamista' ) . '</small><b>' . esc_html( get_the_title( $hamista_prev ) ) . '</b></a>';
					}
					if ( $hamista_next ) {
						echo '<a class="hm-project__adj hm-project__adj--next" href="' . esc_url( get_permalink( $hamista_next ) ) . '"><small>' . esc_html__( 'Next project', 'hamista' ) . '</small><b>' . esc_html( get_the_title( $hamista_next ) ) . '</b></a>';
					}
					?>
				</nav>
			</article>
		</main>
		<?php
	endwhile;
endif;

get_footer();
