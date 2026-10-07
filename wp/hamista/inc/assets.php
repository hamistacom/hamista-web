<?php
/**
 * Front-end assets: styles, script, fonts, design tokens and colour scheme.
 *
 * Budget: one base stylesheet, one style-kit stylesheet, one deferred script.
 * WooCommerce styles load only where WooCommerce output can appear.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

/**
 * Minified file suffix unless SCRIPT_DEBUG is on (and the .min file exists).
 *
 * @param string $relative Path relative to the theme, without extension suffix, e.g. assets/css/base.css.
 * @return string Relative path to load.
 */
function hamista_asset( $relative ) {
	if ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) {
		return $relative;
	}
	$min = preg_replace( '/\.(css|js)$/', '.min.$1', $relative );
	return file_exists( HAMISTA_DIR . '/' . $min ) ? $min : $relative;
}

/**
 * Available style kits. Each kit is one stylesheet in assets/css/kits/.
 *
 * @return array slug => label
 */
function hamista_kits() {
	return apply_filters(
		'hamista/kits',
		array(
			'spark'      => __( 'Spark — editorial', 'hamista' ),
			'industrial' => __( 'Industrial — tactile', 'hamista' ),
			'pulse'      => __( 'Pulse — bold agency', 'hamista' ),
			'flux'       => __( 'Flux — graphite, ivory and ember', 'hamista' ),
			'honey'      => __( 'Honey — warm and natural', 'hamista' ),
			'nomad'      => __( 'Nomad — handwoven, earthy', 'hamista' ),
			'voyage'     => __( 'Voyage — cinematic travel, turquoise', 'hamista' ),
			'azure'      => __( 'Azure — navy and royal blue, frosted panels', 'hamista' ),
			'ink'        => __( 'Ink — manuscript blue, parchment and gilt', 'hamista' ),
			'aurum'      => __( 'Aurum — black, ivory and brushed gold', 'hamista' ),
			'coral'      => __( 'Coral — teal and coral, soft panels', 'hamista' ),
			'stone'      => __( 'Stone — limestone, charcoal and bronze', 'hamista' ),
			'counsel'    => __( 'Counsel — ivory, navy and oxblood', 'hamista' ),
			'clay'       => __( 'Clay — porcelain, sage and terracotta', 'hamista' ),
		)
	);
}

/**
 * Register and enqueue front-end styles and scripts.
 */
function hamista_enqueue_assets() {
	$kit = hamista_option( 'kit', 'spark' );

	wp_enqueue_style( 'hamista', HAMISTA_URI . '/' . hamista_asset( 'assets/css/base.css' ), array(), HAMISTA_VERSION );

	$kit_file = 'assets/css/kits/' . sanitize_file_name( $kit ) . '.css';
	if ( file_exists( HAMISTA_DIR . '/' . $kit_file ) ) {
		wp_enqueue_style( 'hamista-kit', HAMISTA_URI . '/' . hamista_asset( $kit_file ), array( 'hamista' ), HAMISTA_VERSION );
	}

	wp_add_inline_style( 'hamista', hamista_dynamic_css() );

	wp_register_style( 'hamista-woocommerce', HAMISTA_URI . '/' . hamista_asset( 'assets/css/woocommerce.css' ), array( 'hamista' ), HAMISTA_VERSION );
	if ( hamista_is_woocommerce_view() ) {
		wp_enqueue_style( 'hamista-woocommerce' );
	}

	wp_enqueue_script(
		'hamista',
		HAMISTA_URI . '/' . hamista_asset( 'assets/js/theme.js' ),
		array(),
		HAMISTA_VERSION,
		array(
			'in_footer' => true,
			'strategy'  => 'defer',
		)
	);

	wp_add_inline_script(
		'hamista',
		'window.hamistaTheme=' . wp_json_encode( array( 'i18n' => array( 'submenu' => __( 'Toggle submenu', 'hamista' ) ) ) ) . ';',
		'before'
	);

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'hamista_enqueue_assets' );

/**
 * Whether WooCommerce markup is on this page.
 *
 * @return bool
 */
function hamista_is_woocommerce_view() {
	if ( ! class_exists( 'WooCommerce' ) ) {
		return false;
	}
	return is_woocommerce() || is_cart() || is_checkout() || is_account_page();
}

/**
 * Tokens that depend on settings: container width, fonts, base size, accent overrides.
 *
 * Overrides use `:root:root body` so they beat the kit defaults in light and dark.
 *
 * @return string
 */
function hamista_dynamic_css() {
	$width   = max( 960, min( 1920, absint( hamista_option( 'container_width', 1150 ) ) ) );
	$section = max( 400, min( 720, absint( hamista_option( 'section_height', 500 ) ) ) );
	$density = array(
		'compact' => '1',
		'normal'  => '1.25',
		'roomy'   => '1.55',
	);
	$density = $density[ (string) hamista_option( 'density', 'compact' ) ] ?? '1';
	$size    = max( 13, min( 20, absint( hamista_option( 'font_size', 16 ) ) ) );
	$logo    = max( 20, min( 120, absint( hamista_option( 'logo_height', 40 ) ) ) );

	$vars = array(
		'--hm-container'    => $width . 'px',
		'--hm-section-h'    => $section . 'px',
		'--hm-density'      => $density,
		'--hm-fs-base'      => $size . 'px',
		'--hm-logo-h'       => $logo . 'px',
		'--hm-font-body'    => hamista_font_stack( hamista_option( 'font_body' ) ),
		'--hm-font-heading' => hamista_font_stack( hamista_option( 'font_heading' ) ),
		'--hm-font-num'     => hamista_font_stack( hamista_option( 'font_numbers' ) ),
	);

	$css = ':root{';
	foreach ( $vars as $name => $value ) {
		$css .= $name . ':' . $value . ';';
	}
	$css .= '}';

	// Chosen weights beat the style kit's own (kits set them on body).
	$weights = '';
	foreach ( array(
		'font_body_weight'    => '--hm-fw-body',
		'font_heading_weight' => '--hm-fw-heading',
	) as $option => $var ) {
		$weight = absint( hamista_option( $option ) );
		if ( $weight >= 100 && $weight <= 950 ) {
			$weights .= $var . ':' . $weight . ';';
		}
	}
	if ( $weights ) {
		$css .= ':root:root body{' . $weights . '}';
	}

	$accent = sanitize_hex_color( (string) hamista_option( 'accent' ) );
	if ( $accent ) {
		$css .= ':root:root body{--hm-accent:' . $accent . ';--hm-accent-ink:' . $accent . ';--hm-accent-soft:' . hamista_hex_to_rgba( $accent, .1 ) . ';--hm-accent-fg:' . hamista_contrast_color( $accent ) . ';}';
	}
	$accent_dark = sanitize_hex_color( (string) hamista_option( 'accent_dark' ) );
	if ( $accent_dark ) {
		$css .= '[data-hm-theme="dark"]:root body{--hm-accent:' . $accent_dark . ';--hm-accent-ink:' . $accent_dark . ';--hm-accent-soft:' . hamista_hex_to_rgba( $accent_dark, .14 ) . ';--hm-accent-fg:' . hamista_contrast_color( $accent_dark ) . ';}';
	}

	if ( hamista_option( 'page_transitions' ) ) {
		$css .= '@view-transition{navigation:auto}';
	}

	return apply_filters( 'hamista/dynamic_css', $css );
}

/**
 * Convert #rrggbb to rgba().
 *
 * @param string $hex   Hex colour.
 * @param float  $alpha Alpha.
 * @return string
 */
function hamista_hex_to_rgba( $hex, $alpha ) {
	$hex = ltrim( $hex, '#' );
	if ( 3 === strlen( $hex ) ) {
		$hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
	}
	return sprintf( 'rgba(%d,%d,%d,%s)', hexdec( substr( $hex, 0, 2 ) ), hexdec( substr( $hex, 2, 2 ) ), hexdec( substr( $hex, 4, 2 ) ), $alpha );
}

/**
 * Black or white text for a background colour (WCAG relative luminance).
 *
 * @param string $hex Hex colour.
 * @return string
 */
function hamista_contrast_color( $hex ) {
	$hex = ltrim( $hex, '#' );
	if ( 3 === strlen( $hex ) ) {
		$hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
	}
	$lum = 0;
	foreach ( array( array( 0.2126, 0 ), array( 0.7152, 2 ), array( 0.0722, 4 ) ) as $channel ) {
		$c    = hexdec( substr( $hex, $channel[1], 2 ) ) / 255;
		$c    = $c <= 0.03928 ? $c / 12.92 : pow( ( $c + 0.055 ) / 1.055, 2.4 );
		$lum += $channel[0] * $c;
	}
	return $lum > 0.45 ? '#111111' : '#ffffff';
}

/**
 * Earliest head output: colour scheme (prevents a light→dark flash), fonts, preloads.
 */
function hamista_head_early() {
	$scheme = hamista_option( 'color_scheme', 'light' );
	$toggle = (bool) hamista_option( 'dark_toggle', true );
	?>
	<script>(function(d){var r=d.documentElement,t=null,def=<?php echo wp_json_encode( $scheme ); ?>;
	<?php
	if ( $toggle ) :
		?>
		try{t=localStorage.getItem('hm-theme')}catch(e){}<?php endif; ?>if(t!=='light'&&t!=='dark'){t=def==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):def}r.setAttribute('data-hm-theme',t);r.classList.add('hm-js')})(document);</script>
	<?php
	$fonts = hamista_font_face_css();
	foreach ( $fonts['preload'] as $font_url ) {
		printf( '<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n", esc_url( $font_url ) );
	}
	if ( $fonts['css'] ) {
		echo '<style id="hamista-fonts">' . $fonts['css'] . '</style>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from escaped parts.
	}
}
add_action( 'wp_head', 'hamista_head_early', 1 );

/**
 * Block editor: same fonts and tokens as the front end.
 */
function hamista_block_editor_assets() {
	$fonts = hamista_font_face_css();
	wp_add_inline_style( 'wp-edit-blocks', $fonts['css'] . hamista_dynamic_css() );
}
add_action( 'enqueue_block_editor_assets', 'hamista_block_editor_assets' );

/**
 * Theme-color meta for mobile browser chrome.
 */
function hamista_theme_color_meta() {
	$colors = array(
		'industrial' => '#e0e5ec',
		'pulse'      => '#fafafd',
		'flux'       => '#f5f1ea',
		'honey'      => '#fbf6ec',
		'nomad'      => '#f2ece2',
		'voyage'     => '#f4f2ee',
		'azure'      => '#f5f7fb',
		'ink'        => '#0b1220',
		'aurum'      => '#070707',
		'coral'      => '#f6f4ef',
		'stone'      => '#efebe4',
		'counsel'    => '#f4f1ea',
		'clay'       => '#f3efe8',
	);
	$color  = $colors[ hamista_option( 'kit' ) ] ?? '#f6f6f3';
	printf( '<meta name="theme-color" content="%s">' . "\n", esc_attr( apply_filters( 'hamista/theme_color', $color ) ) );
}
add_action( 'wp_head', 'hamista_theme_color_meta', 2 );
