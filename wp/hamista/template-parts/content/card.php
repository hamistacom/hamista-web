<?php
/**
 * Post card (archives, related posts, Hamista Core posts widget).
 *
 * @package Hamista
 * @var array $args { featured: bool, excerpt: bool, image_size: string, heading: string }
 */

defined( 'ABSPATH' ) || exit;

$hamista_args = wp_parse_args(
	$args,
	array(
		'featured'   => false,
		'excerpt'    => true,
		'image_size' => 'hamista-card',
		'heading'    => 'h3',
	)
);
$hamista_tag  = in_array( $hamista_args['heading'], array( 'h2', 'h3', 'h4' ), true ) ? $hamista_args['heading'] : 'h3';
?>
<article <?php post_class( array( 'hm-card', 'hm-post-card', $hamista_args['featured'] ? 'hm-post-card--featured' : '', has_post_thumbnail() ? '' : 'hm-post-card--no-media' ) ); ?>>
	<?php if ( has_post_thumbnail() ) : ?>
		<a class="hm-post-card__media" href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true">
			<?php
			the_post_thumbnail(
				$hamista_args['featured'] ? 'hamista-wide' : $hamista_args['image_size'],
				array(
					'loading' => $hamista_args['featured'] ? 'eager' : 'lazy',
					'sizes'   => $hamista_args['featured'] ? '(max-width: 760px) 100vw, 60vw' : '(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 420px',
				)
			);
			?>
		</a>
	<?php endif; ?>
	<div class="hm-post-card__body">
		<div class="hm-post-card__meta">
			<?php hamista_post_categories( 1 ); ?>
			<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
		</div>
		<<?php echo esc_html( $hamista_tag ); ?> class="hm-post-card__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></<?php echo esc_html( $hamista_tag ); ?>>
		<?php if ( $hamista_args['excerpt'] ) : ?>
			<p class="hm-post-card__excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), $hamista_args['featured'] ? 40 : 24, '…' ) ); ?></p>
		<?php endif; ?>
		<div class="hm-post-card__foot">
			<span><?php the_author(); ?></span>
			<?php if ( hamista_option( 'reading_time' ) ) : ?>
				<span><?php echo esc_html( hamista_reading_time() ); ?></span>
			<?php endif; ?>
		</div>
	</div>
</article>
