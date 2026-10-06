<?php
/**
 * Theme supports, menus, widget areas, image sizes, body classes.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register theme features.
 */
function hamista_setup() {
	load_theme_textdomain( 'hamista', HAMISTA_DIR . '/languages' );

	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'customize-selective-refresh-widgets' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 80,
			'width'       => 240,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);
	add_editor_style( 'assets/css/editor.css' );

	register_nav_menus(
		array(
			'primary' => __( 'Primary menu', 'hamista' ),
			'mobile'  => __( 'Mobile menu (falls back to primary)', 'hamista' ),
			'footer'  => __( 'Footer bottom menu', 'hamista' ),
		)
	);

	set_post_thumbnail_size( 1200, 750, true );
	add_image_size( 'hamista-card', 720, 450, true );
	add_image_size( 'hamista-wide', 1600, 900, true );

	$GLOBALS['content_width'] = 760; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
}
add_action( 'after_setup_theme', 'hamista_setup' );

/**
 * Widget areas: blog sidebar, shop sidebar and footer columns.
 */
function hamista_widgets_init() {
	$shared = array(
		'before_widget' => '<section id="%1$s" class="hm-widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="hm-widget__title">',
		'after_title'   => '</h2>',
	);

	register_sidebar(
		array_merge(
			$shared,
			array(
				'id'   => 'sidebar-blog',
				'name' => __( 'Blog sidebar', 'hamista' ),
			)
		)
	);
	register_sidebar(
		array_merge(
			$shared,
			array(
				'id'   => 'sidebar-shop',
				'name' => __( 'Shop sidebar', 'hamista' ),
			)
		)
	);

	for ( $i = 1; $i <= 4; $i++ ) {
		register_sidebar(
			array_merge(
				$shared,
				array(
					'id'   => 'footer-' . $i,
					/* translators: %d: footer column number */
					'name' => sprintf( __( 'Footer column %d', 'hamista' ), $i ),
				)
			)
		);
	}
}
add_action( 'widgets_init', 'hamista_widgets_init' );

/**
 * Body classes for the active style kit and layout choices.
 *
 * @param array $classes Body classes.
 * @return array
 */
function hamista_body_classes( $classes ) {
	$classes[] = 'hm-kit-' . sanitize_html_class( hamista_option( 'kit', 'spark' ) );
	if ( hamista_option( 'mobile_bar' ) ) {
		$classes[] = 'hm-has-mobile-bar';
	}

	if ( ! is_singular() ) {
		$classes[] = 'hm-archive';
	}
	if ( hamista_has_sidebar() ) {
		$classes[] = 'hm-has-sidebar';
	}

	return $classes;
}
add_filter( 'body_class', 'hamista_body_classes' );

/**
 * Whether the current view shows a sidebar.
 *
 * @return bool
 */
function hamista_has_sidebar() {
	if ( function_exists( 'is_woocommerce' ) && is_woocommerce() ) {
		return hamista_option( 'shop_sidebar' ) && is_active_sidebar( 'sidebar-shop' ) && ! is_product();
	}
	if ( is_home() || is_archive() || is_search() ) {
		return hamista_option( 'blog_sidebar' ) && is_active_sidebar( 'sidebar-blog' );
	}
	return false;
}

/**
 * Show item descriptions in the primary menu and add a caret to parents.
 *
 * @param string   $title Menu item title.
 * @param WP_Post  $item  Menu item.
 * @param stdClass $args  Menu arguments.
 * @param int      $depth Depth.
 * @return string
 */
function hamista_nav_menu_item_title( $title, $item, $args, $depth ) {
	if ( empty( $args->theme_location ) || 'primary' !== $args->theme_location ) {
		return $title;
	}
	if ( $depth > 0 && ! empty( $item->description ) ) {
		$title .= '<span class="menu-item-description">' . esc_html( $item->description ) . '</span>';
	}
	if ( in_array( 'menu-item-has-children', (array) $item->classes, true ) ) {
		$title .= hamista_get_icon( 'chevron', array( 'class' => 'hm-caret' ) );
	}
	return $title;
}
add_filter( 'nav_menu_item_title', 'hamista_nav_menu_item_title', 10, 4 );

/**
 * Shorter, cleaner excerpts.
 *
 * @return int
 */
function hamista_excerpt_length() {
	return 28;
}
add_filter( 'excerpt_length', 'hamista_excerpt_length' );

/**
 * Replace the "[…]" excerpt suffix.
 *
 * @return string
 */
function hamista_excerpt_more() {
	return '…';
}
add_filter( 'excerpt_more', 'hamista_excerpt_more' );

/**
 * Wrap archive titles' prefix ("Category:") so it can be styled or hidden.
 *
 * @param string $title  Title.
 * @param string $orig   Original title.
 * @param string $prefix Prefix.
 * @return string
 */
function hamista_archive_title( $title, $orig, $prefix ) {
	return $orig ? $orig : $title;
}
add_filter( 'get_the_archive_title', 'hamista_archive_title', 10, 3 );
