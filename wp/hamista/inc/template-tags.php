<?php
/**
 * Template helpers.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

/**
 * Persian digits for display strings on Persian sites (when the option is on).
 *
 * @param string|int $value Value.
 * @return string
 */
function hamista_digits( $value ) {
	$value = (string) $value;
	if ( ! hamista_option( 'persian_digits' ) || 0 !== strpos( get_locale(), 'fa' ) ) {
		return $value;
	}
	return strtr( $value, array_combine( range( 0, 9 ), array( '۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹' ) ) );
}

/**
 * Persian and Arabic-Indic digits to Latin (for phone numbers typed in settings).
 *
 * @param string $value Value.
 * @return string
 */
function hamista_latin_digits( $value ) {
	return strtr(
		(string) $value,
		array(
			'۰' => '0',
			'۱' => '1',
			'۲' => '2',
			'۳' => '3',
			'۴' => '4',
			'۵' => '5',
			'۶' => '6',
			'۷' => '7',
			'۸' => '8',
			'۹' => '9',
			'٠' => '0',
			'١' => '1',
			'٢' => '2',
			'٣' => '3',
			'٤' => '4',
			'٥' => '5',
			'٦' => '6',
			'٧' => '7',
			'٨' => '8',
			'٩' => '9',
		)
	);
}

/**
 * Site logo with optional dark-mode variant; falls back to the site name.
 */
function hamista_site_logo() {
	$logo_id      = (int) get_theme_mod( 'custom_logo' );
	$logo_dark_id = (int) hamista_option( 'logo_dark' );
	$name         = get_bloginfo( 'name' );

	echo '<a class="hm-brand" href="' . esc_url( home_url( '/' ) ) . '" rel="home">';
	if ( $logo_id ) {
		echo wp_get_attachment_image(
			$logo_id,
			'full',
			false,
			array(
				'class'         => 'hm-logo-light' . ( $logo_dark_id ? ' has-dark' : '' ),
				'alt'           => $name,
				'loading'       => 'eager',
				'fetchpriority' => 'high',
			)
		);
		if ( $logo_dark_id ) {
			echo wp_get_attachment_image(
				$logo_dark_id,
				'full',
				false,
				array(
					'class'   => 'hm-logo-dark',
					'alt'     => $name,
					'loading' => 'eager',
				)
			);
		}
	} else {
		echo '<span class="hm-brand__text">' . esc_html( $name ) . '</span>';
	}
	echo '</a>';
}

/**
 * Estimated reading time in minutes (≈200 words per minute, works for Persian).
 *
 * @param int|null $post_id Post ID.
 * @return int
 */
function hamista_reading_minutes( $post_id = null ) {
	$content = get_post_field( 'post_content', $post_id ? $post_id : get_the_ID() );
	$words   = count( preg_split( '/\s+/u', trim( wp_strip_all_tags( strip_shortcodes( $content ) ) ), -1, PREG_SPLIT_NO_EMPTY ) );
	return max( 1, (int) ceil( $words / 200 ) );
}

/**
 * "N min read" label.
 *
 * @param int|null $post_id Post ID.
 * @return string
 */
function hamista_reading_time( $post_id = null ) {
	$minutes = hamista_reading_minutes( $post_id );
	/* translators: %s: number of minutes */
	return sprintf( _n( '%s min read', '%s min read', $minutes, 'hamista' ), number_format_i18n( $minutes ) );
}

/**
 * Category chips for a post.
 *
 * @param int $limit Max number of categories.
 * @param int $post_id Post ID.
 */
function hamista_post_categories( $limit = 1, $post_id = 0 ) {
	$cats = get_the_category( $post_id ? $post_id : get_the_ID() );
	foreach ( array_slice( $cats, 0, $limit ) as $cat ) {
		printf( '<a class="hm-chip" href="%s">%s</a>', esc_url( get_category_link( $cat ) ), esc_html( $cat->name ) );
	}
}

/**
 * Breadcrumbs. Uses Yoast SEO or Rank Math when active, a lightweight trail otherwise.
 */
function hamista_breadcrumbs() {
	if ( ! hamista_option( 'breadcrumbs' ) || is_front_page() ) {
		return;
	}
	if ( function_exists( 'yoast_breadcrumb' ) && class_exists( 'WPSEO_Options' ) && WPSEO_Options::get( 'breadcrumbs-enable' ) ) {
		yoast_breadcrumb( '<nav class="hm-crumbs-wrap" aria-label="' . esc_attr__( 'Breadcrumb', 'hamista' ) . '">', '</nav>' );
		return;
	}
	if ( function_exists( 'rank_math_the_breadcrumbs' ) ) {
		rank_math_the_breadcrumbs();
		return;
	}

	$items = array( array( home_url( '/' ), __( 'Home', 'hamista' ) ) );

	if ( is_singular( 'post' ) ) {
		$page_for_posts = (int) get_option( 'page_for_posts' );
		if ( $page_for_posts ) {
			$items[] = array( get_permalink( $page_for_posts ), get_the_title( $page_for_posts ) );
		}
		$cats = get_the_category();
		if ( $cats ) {
			$items[] = array( get_category_link( $cats[0] ), $cats[0]->name );
		}
		$items[] = array( '', get_the_title() );
	} elseif ( is_page() ) {
		foreach ( array_reverse( get_post_ancestors( get_the_ID() ) ) as $ancestor ) {
			$items[] = array( get_permalink( $ancestor ), get_the_title( $ancestor ) );
		}
		$items[] = array( '', get_the_title() );
	} elseif ( is_search() ) {
		$items[] = array( '', __( 'Search', 'hamista' ) );
	} elseif ( is_404() ) {
		$items[] = array( '', __( 'Not found', 'hamista' ) );
	} elseif ( is_archive() ) {
		$items[] = array( '', wp_strip_all_tags( get_the_archive_title() ) );
	} elseif ( is_home() ) {
		$items[] = array( '', single_post_title( '', false ) );
	}

	echo '<nav aria-label="' . esc_attr__( 'Breadcrumb', 'hamista' ) . '"><ol class="hm-crumbs">';
	foreach ( $items as $item ) {
		if ( $item[0] ) {
			printf( '<li><a href="%s">%s</a></li>', esc_url( $item[0] ), esc_html( $item[1] ) );
		} else {
			printf( '<li aria-current="page">%s</li>', esc_html( $item[1] ) );
		}
	}
	echo '</ol></nav>';
}

/**
 * Numbered pagination for archives.
 */
function hamista_pagination() {
	$links = paginate_links(
		array(
			'type'      => 'plain',
			'mid_size'  => 1,
			'prev_text' => hamista_get_icon( 'chevron-r', array( 'aria-label' => __( 'Previous page', 'hamista' ) ) ),
			'next_text' => hamista_get_icon( 'chevron-l', array( 'aria-label' => __( 'Next page', 'hamista' ) ) ),
		)
	);
	if ( $links ) {
		echo '<nav class="hm-pagination" aria-label="' . esc_attr__( 'Posts pagination', 'hamista' ) . '"><div class="nav-links">' . $links . '</div></nav>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}

/**
 * Social network list used by the footer and share buttons.
 *
 * @return array network => label
 */
function hamista_social_networks() {
	return array(
		'instagram' => 'Instagram',
		'telegram'  => 'Telegram',
		'whatsapp'  => 'WhatsApp',
		'linkedin'  => 'LinkedIn',
		'x'         => 'X',
		'youtube'   => 'YouTube',
		'aparat'    => 'Aparat',
		'eitaa'     => 'Eitaa',
		'bale'      => 'Bale',
		'rubika'    => 'Rubika',
		'github'    => 'GitHub',
		'dribbble'  => 'Dribbble',
		'behance'   => 'Behance',
	);
}

/**
 * Social profile links from settings.
 */
function hamista_social_links() {
	$links    = (array) hamista_option( 'footer_social', array() );
	$networks = hamista_social_networks();
	$out      = '';

	foreach ( $links as $link ) {
		if ( empty( $link['url'] ) || empty( $link['network'] ) || ! isset( $networks[ $link['network'] ] ) ) {
			continue;
		}
		$out .= sprintf(
			'<a class="hm-icon-btn" href="%1$s" target="_blank" rel="noopener me" aria-label="%2$s">%3$s</a>',
			esc_url( $link['url'] ),
			esc_attr( $networks[ $link['network'] ] ),
			hamista_get_icon( $link['network'] )
		);
	}

	if ( $out ) {
		echo '<div class="hm-social">' . $out . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}

/**
 * Share buttons for the current post (no third-party scripts).
 */
function hamista_share_links() {
	$url   = rawurlencode( get_permalink() );
	$title = rawurlencode( get_the_title() );
	$items = array(
		'telegram' => array( 'https://t.me/share/url?url=' . $url . '&text=' . $title, 'Telegram' ),
		'whatsapp' => array( 'https://wa.me/?text=' . $title . '%20' . $url, 'WhatsApp' ),
		'linkedin' => array( 'https://www.linkedin.com/sharing/share-offsite/?url=' . $url, 'LinkedIn' ),
		'x'        => array( 'https://x.com/intent/post?url=' . $url . '&text=' . $title, 'X' ),
	);

	foreach ( $items as $icon => $item ) {
		printf(
			'<a class="hm-icon-btn hm-share-btn" href="%1$s" target="_blank" rel="noopener" aria-label="%2$s">%3$s</a>',
			esc_url( $item[0] ),
			/* translators: %s: network name */
			esc_attr( sprintf( __( 'Share on %s', 'hamista' ), $item[1] ) ),
			hamista_get_icon( $icon ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		);
	}
	printf(
		'<button type="button" class="hm-icon-btn hm-share-btn" data-hm-copy="%1$s" aria-label="%2$s" data-copied="%3$s">%4$s</button>',
		esc_url( get_permalink() ),
		esc_attr__( 'Copy link', 'hamista' ),
		esc_attr__( 'Link copied', 'hamista' ),
		hamista_get_icon( 'link' ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	);
}

/**
 * Archive/page heading block.
 *
 * @param string $title       Title.
 * @param string $description Optional description (HTML allowed).
 * @param string $eyebrow     Optional small label above the title.
 */
function hamista_page_head( $title, $description = '', $eyebrow = '' ) {
	if ( ! hamista_title_area_enabled() ) {
		// Hidden in the settings: keep one heading for search engines and screen readers.
		echo '<h1 class="screen-reader-text">' . wp_kses_post( $title ) . '</h1>';
		return;
	}
	$classes = 'hm-page-head';
	$align   = (string) hamista_option( 'title_align', 'start' );
	$size    = (string) hamista_option( 'title_size', 'normal' );
	if ( 'center' === $align ) {
		$classes .= ' hm-page-head--center';
	}
	if ( in_array( $size, array( 'compact', 'large' ), true ) ) {
		$classes .= ' hm-page-head--' . $size;
	}
	?>
	<header class="<?php echo esc_attr( $classes ); ?>">
		<div class="hm-container">
			<?php hamista_breadcrumbs(); ?>
			<?php if ( $eyebrow ) : ?>
				<p class="hm-eyebrow" style="margin:18px 0 0"><?php echo esc_html( $eyebrow ); ?></p>
			<?php endif; ?>
			<h1 class="hm-page-head__title entry-title"><?php echo wp_kses_post( $title ); ?></h1>
			<?php if ( $description ) : ?>
				<div class="hm-page-head__desc"><?php echo wp_kses_post( wpautop( $description ) ); ?></div>
			<?php endif; ?>
			<?php do_action( 'hamista/page_head/after', $title ); ?>
		</div>
	</header>
	<?php
}

/**
 * Top-level category filter pills for the blog.
 */
function hamista_blog_filters() {
	$cats = get_categories(
		array(
			'parent'     => 0,
			'hide_empty' => true,
			'number'     => 8,
		)
	);
	if ( count( $cats ) < 2 ) {
		return;
	}
	$current        = is_category() ? get_queried_object_id() : 0;
	$page_for_posts = (int) get_option( 'page_for_posts' );
	$all_url        = $page_for_posts ? get_permalink( $page_for_posts ) : home_url( '/' );

	echo '<div class="hm-page-head__filters">';
	printf( '<a class="hm-chip%s" href="%s">%s</a>', $current ? '' : ' is-active', esc_url( $all_url ), esc_html__( 'All', 'hamista' ) );
	foreach ( $cats as $cat ) {
		printf( '<a class="hm-chip%s" href="%s">%s</a>', $current === $cat->term_id ? ' is-active' : '', esc_url( get_category_link( $cat ) ), esc_html( $cat->name ) );
	}
	echo '</div>';
}

/**
 * Comment markup callback.
 *
 * @param WP_Comment $comment Comment.
 * @param array      $args    Arguments.
 * @param int        $depth   Depth.
 */
function hamista_comment( $comment, $args, $depth ) {
	?>
	<li id="comment-<?php comment_ID(); ?>" <?php comment_class( 'hm-comment' ); ?>>
		<div class="hm-comment__head">
			<?php echo get_avatar( $comment, 88, '', '', array( 'class' => 'hm-avatar' ) ); ?>
			<div>
				<div class="hm-comment__author"><?php comment_author_link( $comment ); ?></div>
				<a class="hm-comment__date" href="<?php echo esc_url( get_comment_link( $comment ) ); ?>"><time datetime="<?php comment_time( 'c' ); ?>"><?php comment_date( '', $comment ); ?></time></a>
			</div>
		</div>
		<div class="hm-comment__body">
			<?php if ( '0' === $comment->comment_approved ) : ?>
				<p class="hm-muted"><em><?php esc_html_e( 'Your comment is awaiting moderation.', 'hamista' ); ?></em></p>
			<?php endif; ?>
			<?php comment_text(); ?>
		</div>
		<?php
		comment_reply_link(
			array_merge(
				$args,
				array(
					'depth'  => $depth,
					'before' => '<div class="reply">',
					'after'  => '</div>',
				)
			)
		);
}
