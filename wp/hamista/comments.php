<?php
/**
 * Comments.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

if ( post_password_required() ) {
	return;
}
?>
<section id="comments" class="hm-comments">
	<?php if ( have_comments() ) : ?>
		<h2 class="hm-comments__title">
			<?php
			$hamista_count = get_comments_number();
			/* translators: %s: number of comments */
			printf( esc_html( _n( '%s comment', '%s comments', $hamista_count, 'hamista' ) ), esc_html( number_format_i18n( $hamista_count ) ) );
			?>
		</h2>
		<ol class="hm-comment-list">
			<?php
			wp_list_comments(
				array(
					'callback'    => 'hamista_comment',
					'style'       => 'ol',
					'avatar_size' => 88,
				)
			);
			?>
		</ol>
		<?php the_comments_navigation(); ?>
	<?php endif; ?>

	<?php if ( ! comments_open() && get_comments_number() ) : ?>
		<p class="hm-muted"><?php esc_html_e( 'Comments are closed.', 'hamista' ); ?></p>
	<?php endif; ?>

	<?php
	comment_form(
		array(
			'class_submit'       => 'hm-btn submit',
			'title_reply_before' => '<h2 id="reply-title" class="comment-reply-title">',
			'title_reply_after'  => '</h2>',
		)
	);
	?>
</section>
