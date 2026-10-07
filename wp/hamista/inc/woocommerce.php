<?php
/**
 * WooCommerce integration. Loaded always; hooks only attach when WooCommerce is active.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'WooCommerce' ) ) {
	return;
}

/**
 * Theme support with gallery features.
 */
function hamista_woocommerce_setup() {
	add_theme_support(
		'woocommerce',
		array(
			'thumbnail_image_width' => 640,
			'single_image_width'    => 960,
			'product_grid'          => array(
				'default_columns' => 3,
				'min_columns'     => 1,
				'max_columns'     => 5,
			),
		)
	);
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
}
add_action( 'after_setup_theme', 'hamista_woocommerce_setup' );

// Replace WooCommerce wrappers, title and sidebar with the theme's.
remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );
remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );
remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );
remove_action( 'woocommerce_archive_description', 'woocommerce_taxonomy_archive_description', 10 );
remove_action( 'woocommerce_archive_description', 'woocommerce_product_archive_description', 10 );
add_filter( 'woocommerce_show_page_title', '__return_false' );

/**
 * Opening wrapper + shop heading.
 */
function hamista_woocommerce_wrapper_start() {
	if ( ( is_shop() || is_product_taxonomy() ) && ! hamista_title_area_enabled( 'shop' ) ) {
		echo '<h1 class="screen-reader-text">' . esc_html( is_shop() ? woocommerce_page_title( false ) : single_term_title( '', false ) ) . '</h1>';
	} elseif ( is_shop() || is_product_taxonomy() ) {
		$title = is_shop() ? woocommerce_page_title( false ) : single_term_title( '', false );
		$desc  = is_product_taxonomy() ? term_description() : '';
		if ( is_shop() ) {
			$shop_page = get_post( wc_get_page_id( 'shop' ) );
			$desc      = $shop_page ? $shop_page->post_excerpt : '';
		}
		$classes = 'hm-page-head hm-shop-head';
		if ( 'center' === hamista_option( 'title_align', 'start' ) ) {
			$classes .= ' hm-page-head--center';
		}
		if ( in_array( hamista_option( 'title_size', 'normal' ), array( 'compact', 'large' ), true ) ) {
			$classes .= ' hm-page-head--' . hamista_option( 'title_size', 'normal' );
		}
		echo '<header class="' . esc_attr( $classes ) . '"><div class="hm-container">';
		woocommerce_breadcrumb();
		echo '<h1 class="hm-page-head__title">' . esc_html( $title ) . '</h1>';
		if ( $desc ) {
			echo '<div class="hm-page-head__desc">' . wp_kses_post( wpautop( $desc ) ) . '</div>';
		}
		hamista_product_category_pills();
		echo '</div></header>';
	}

	$classes = 'hm-container';
	if ( hamista_has_sidebar() ) {
		$classes .= ' hm-layout hm-layout--sidebar';
	}
	echo '<main id="main" class="hm-main hm-shop' . ( is_product() ? ' hm-shop--single' : '' ) . '"><div class="' . esc_attr( $classes ) . '"><div class="hm-shop__content">';

	if ( is_product() ) {
		woocommerce_breadcrumb();
	}
}
add_action( 'woocommerce_before_main_content', 'hamista_woocommerce_wrapper_start', 10 );

/**
 * Closing wrapper (+ sidebar).
 */
function hamista_woocommerce_wrapper_end() {
	echo '</div>';
	if ( hamista_has_sidebar() ) {
		get_sidebar();
	}
	echo '</div></main>';
}
add_action( 'woocommerce_after_main_content', 'hamista_woocommerce_wrapper_end', 10 );

/**
 * Breadcrumb markup that matches the theme.
 *
 * @return array
 */
function hamista_woocommerce_breadcrumb_defaults() {
	return array(
		'delimiter'   => '',
		'wrap_before' => '<nav class="hm-crumbs-wrap" aria-label="' . esc_attr__( 'Breadcrumb', 'hamista' ) . '"><ol class="hm-crumbs">',
		'wrap_after'  => '</ol></nav>',
		'before'      => '<li>',
		'after'       => '</li>',
		'home'        => _x( 'Home', 'breadcrumb', 'hamista' ),
	);
}
add_filter( 'woocommerce_breadcrumb_defaults', 'hamista_woocommerce_breadcrumb_defaults' );

/**
 * Top-level product category pills under the shop title.
 */
function hamista_product_category_pills() {
	$terms = get_terms(
		array(
			'taxonomy'   => 'product_cat',
			'parent'     => 0,
			'hide_empty' => true,
			'number'     => 10,
			'exclude'    => array( (int) get_option( 'default_product_cat' ) ),
		)
	);
	if ( is_wp_error( $terms ) || count( $terms ) < 2 ) {
		return;
	}
	$current = is_product_category() ? get_queried_object_id() : 0;
	echo '<div class="hm-page-head__filters">';
	printf( '<a class="hm-chip%s" href="%s">%s</a>', $current ? '' : ' is-active', esc_url( wc_get_page_permalink( 'shop' ) ), esc_html__( 'All products', 'hamista' ) );
	foreach ( $terms as $term ) {
		printf( '<a class="hm-chip%s" href="%s">%s</a>', $current === $term->term_id ? ' is-active' : '', esc_url( get_term_link( $term ) ), esc_html( $term->name ) );
	}
	echo '</div>';
}

/**
 * Grid columns and page size from settings.
 *
 * @return int
 */
function hamista_loop_shop_columns() {
	return max( 2, min( 5, (int) hamista_option( 'shop_columns', 3 ) ) );
}
add_filter( 'loop_shop_columns', 'hamista_loop_shop_columns' );
add_filter(
	'loop_shop_per_page',
	static function () {
		return hamista_loop_shop_columns() * 4;
	}
);

/**
 * Related products: one row.
 *
 * @param array $args Arguments.
 * @return array
 */
function hamista_related_products_args( $args ) {
	$args['posts_per_page'] = hamista_loop_shop_columns();
	$args['columns']        = hamista_loop_shop_columns();
	return $args;
}
add_filter( 'woocommerce_output_related_products_args', 'hamista_related_products_args' );

/**
 * Toolbar wrapper around result count + ordering.
 */
add_action(
	'woocommerce_before_shop_loop',
	static function () {
		echo '<div class="hm-shop-toolbar">';
	},
	15
);
add_action(
	'woocommerce_before_shop_loop',
	static function () {
		echo '</div>';
	},
	35
);

/**
 * Second gallery image revealed on hover.
 */
function hamista_product_hover_image() {
	if ( ! hamista_option( 'shop_hover_image' ) ) {
		return;
	}
	global $product;
	$ids = $product ? $product->get_gallery_image_ids() : array();
	if ( $ids ) {
		echo wp_get_attachment_image(
			$ids[0],
			'woocommerce_thumbnail',
			false,
			array(
				'class'   => 'hm-hover-img',
				'loading' => 'lazy',
				'alt'     => '',
			)
		);
	}
}
add_action( 'woocommerce_before_shop_loop_item_title', 'hamista_product_hover_image', 11 );

/**
 * Wrap the loop thumbnail(s) in a media frame.
 */
add_action(
	'woocommerce_before_shop_loop_item_title',
	static function () {
		echo '<span class="hm-product-media">';
	},
	9
);
add_action(
	'woocommerce_before_shop_loop_item_title',
	static function () {
		echo '</span>';
	},
	12
);

/**
 * Sale badge shows the discount percentage when it can be computed.
 *
 * @param string     $html    Badge HTML.
 * @param WP_Post    $post    Post.
 * @param WC_Product $product Product.
 * @return string
 */
function hamista_sale_flash( $html, $post, $product ) {
	$percent = 0;
	if ( $product && $product->is_type( 'simple' ) ) {
		$regular = (float) $product->get_regular_price();
		$sale    = (float) $product->get_sale_price();
		if ( $regular > 0 && $sale > 0 ) {
			$percent = (int) round( ( 1 - $sale / $regular ) * 100 );
		}
	}
	/* translators: %s: discount percent */
	$label = $percent ? sprintf( __( '%s%% off', 'hamista' ), hamista_digits( $percent ) ) : __( 'Sale', 'hamista' );
	return '<span class="onsale hm-num">' . esc_html( $label ) . '</span>';
}
add_filter( 'woocommerce_sale_flash', 'hamista_sale_flash', 10, 3 );

/**
 * Prices in Persian digits on Persian sites, matching the rest of the theme
 * (Hamista → Typography → Persian digits).
 *
 * @param string $price Formatted number, without currency.
 * @return string
 */
function hamista_price_digits( $price ) {
	return is_admin() && ! wp_doing_ajax() ? $price : hamista_digits( $price );
}
add_filter( 'formatted_woocommerce_price', 'hamista_price_digits' );

/**
 * Keep the header cart badge in sync after AJAX add-to-cart.
 *
 * @param array $fragments Fragments.
 * @return array
 */
function hamista_cart_fragment( $fragments ) {
	$count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
	$fragments['.hm-header-cart .hm-icon-btn__badge'] = sprintf( '<span class="hm-icon-btn__badge hm-num" data-count="%1$d">%2$s</span>', (int) $count, esc_html( number_format_i18n( $count ) ) );
	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'hamista_cart_fragment' );

/**
 * Product loop button classes match theme buttons.
 *
 * @param array $args Arguments.
 * @return array
 */
function hamista_loop_add_to_cart_args( $args ) {
	$args['class'] = trim( $args['class'] . ' hm-btn hm-btn--sm' );
	return $args;
}
add_filter( 'woocommerce_loop_add_to_cart_args', 'hamista_loop_add_to_cart_args' );

/**
 * WooCommerce styles that the theme fully replaces.
 *
 * @param array $styles Styles.
 * @return array
 */
function hamista_woocommerce_styles( $styles ) {
	unset( $styles['woocommerce-layout'], $styles['woocommerce-smallscreen'] );
	return $styles;
}
add_filter( 'woocommerce_enqueue_styles', 'hamista_woocommerce_styles' );

/* -------------------------------------------------------------------------
 * My account
 * ---------------------------------------------------------------------- */

/**
 * Icon per account endpoint (unknown endpoints get a neutral one).
 *
 * @param string $endpoint Endpoint key.
 * @return string Icon name.
 */
function hamista_account_icon( $endpoint ) {
	$icons = array(
		'dashboard'       => 'grid',
		'orders'          => 'receipt',
		'appointments'    => 'calendar',
		'downloads'       => 'download',
		'edit-address'    => 'pin',
		'payment-methods' => 'card',
		'edit-account'    => 'user',
		'customer-logout' => 'logout',
		'wishlist'        => 'heart',
	);
	return (string) apply_filters( 'hamista/account_icon', $icons[ $endpoint ] ?? 'folder', $endpoint );
}

/**
 * Persian labels for the standard account menu when WooCommerce's own
 * translation is missing (labels already in Persian are left alone).
 *
 * @param array $items Endpoint => label.
 * @return array
 */
function hamista_account_menu_labels( $items ) {
	if ( 0 !== strpos( determine_locale(), 'fa' ) && ! hamista_option( 'ui_persian', true ) ) {
		return $items;
	}
	$labels = array(
		'dashboard'       => __( 'Dashboard', 'hamista' ),
		'orders'          => __( 'Orders', 'hamista' ),
		'downloads'       => __( 'Downloads', 'hamista' ),
		'edit-address'    => __( 'Addresses', 'hamista' ),
		'payment-methods' => __( 'Payment methods', 'hamista' ),
		'edit-account'    => __( 'Account details', 'hamista' ),
		'customer-logout' => __( 'Log out', 'hamista' ),
	);
	foreach ( $items as $key => $label ) {
		if ( isset( $labels[ $key ] ) && ! preg_match( '/\p{Arabic}/u', (string) $label ) ) {
			$items[ $key ] = $labels[ $key ];
		}
	}
	return $items;
}
add_filter( 'woocommerce_account_menu_items', 'hamista_account_menu_labels', 99 );

/**
 * Summary cards on the account dashboard.
 *
 * @param int $user_id User.
 * @return array[] { icon, label, value (HTML allowed: price), url }
 */
function hamista_account_cards( $user_id ) {
	$cards     = array(
		'orders' => array(
			'icon'  => 'receipt',
			'label' => __( 'Orders', 'hamista' ),
			'value' => hamista_digits( number_format_i18n( wc_get_customer_order_count( $user_id ) ) ),
			'url'   => wc_get_account_endpoint_url( 'orders' ),
		),
		'spent'  => array(
			'icon'  => 'bag',
			'label' => __( 'Total purchases', 'hamista' ),
			'value' => wc_price( wc_get_customer_total_spent( $user_id ) ),
			'url'   => wc_get_account_endpoint_url( 'orders' ),
		),
	);
	$downloads = wc_get_customer_available_downloads( $user_id );
	if ( $downloads ) {
		$cards['downloads'] = array(
			'icon'  => 'download',
			'label' => __( 'Downloads', 'hamista' ),
			'value' => hamista_digits( number_format_i18n( count( $downloads ) ) ),
			'url'   => wc_get_account_endpoint_url( 'downloads' ),
		);
	}
	/**
	 * Account dashboard cards; add-ons (e.g. booking) can add their own.
	 *
	 * @param array $cards   Cards.
	 * @param int   $user_id User.
	 */
	return (array) apply_filters( 'hamista/account_cards', $cards, $user_id );
}
