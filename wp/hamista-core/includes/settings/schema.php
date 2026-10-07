<?php
/**
 * Settings schema: sections and fields rendered by the admin app.
 *
 * Field keys: type, label, desc, choices, min, max, step, unit, placeholder,
 * fields (repeater), show_if (key => value|values), group (sub-heading), width (half),
 * requires (plugin slug), mode (code language), action (button id), ltr (left-to-right text input),
 * group_desc (a line under the group heading), show_if_row (repeater sub-field shown only for some rows).
 * Defaults come from defaults.php.
 *
 * @package Hamista\Core
 */

defined( 'ABSPATH' ) || exit;

// Wrapped in a closure so the helper variables below stay local to this file.
return ( static function () {
	$img = HAMISTA_CORE_URL . 'assets/admin/img/';

	$pages = array( 0 => __( '— Automatic —', 'hamista-core' ) );
	foreach ( get_pages( array( 'number' => 300 ) ) as $page ) {
		$pages[ $page->ID ] = $page->post_title;
	}

	// Pages and Hamista block templates, for content placed inside other screens.
	$content_sources = array( 0 => __( '— None —', 'hamista-core' ) );
	foreach ( get_posts(
		array(
			'post_type'      => 'hm_layout',
			'posts_per_page' => 100,
			'meta_key'       => '_hm_layout_type', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
			'meta_value'     => 'block', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
		)
	) as $block ) {
		/* translators: %s: template title */
		$content_sources[ $block->ID ] = sprintf( __( 'Block: %s', 'hamista-core' ), $block->post_title );
	}
	foreach ( $pages as $page_id => $page_title ) {
		if ( $page_id ) {
			/* translators: %s: page title */
			$content_sources[ $page_id ] = sprintf( __( 'Page: %s', 'hamista-core' ), $page_title );
		}
	}

	$layouts = static function ( $type ) {
		$items = array( 0 => __( 'Built-in (configured below)', 'hamista-core' ) );
		$posts = get_posts(
			array(
				'post_type'      => 'hm_layout',
				'posts_per_page' => 100,
				'meta_key'       => '_hm_layout_type', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
			'meta_value'         => $type, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
			)
		);
		foreach ( $posts as $post ) {
			$items[ $post->ID ] = $post->post_title;
		}
		return $items;
	};

	$on_off = array(
		'type' => 'toggle',
	);

	return array(
		'dashboard'   => array(
			'title' => __( 'Dashboard', 'hamista-core' ),
			'icon'  => 'grid',
			'view'  => 'dashboard',
		),
		'demos'       => array(
			'title' => __( 'Demo import', 'hamista-core' ),
			'icon'  => 'layers',
			'view'  => 'demos',
		),
		'general'     => array(
			'title'  => __( 'Style & layout', 'hamista-core' ),
			'icon'   => 'palette',
			'desc'   => __( 'The overall look of the site. Style kits change typography, surfaces and details at once.', 'hamista-core' ),
			'fields' => array(
				'kit'               => array(
					'type'    => 'cards',
					'label'   => __( 'Style kit', 'hamista-core' ),
					'choices' => array(
						'spark'      => array(
							'label' => __( 'Spark', 'hamista-core' ),
							'desc'  => __( 'Editorial, typographic, electric accent', 'hamista-core' ),
							'image' => $img . 'kit-spark.svg',
						),
						'industrial' => array(
							'label' => __( 'Industrial', 'hamista-core' ),
							'desc'  => __( 'Tactile, skeuomorphic, safety red', 'hamista-core' ),
							'image' => $img . 'kit-industrial.svg',
						),
						'pulse'      => array(
							'label' => __( 'Pulse', 'hamista-core' ),
							'desc'  => __( 'Bold and kinetic, violet with acid lime', 'hamista-core' ),
							'image' => $img . 'kit-pulse.svg',
						),
						'flux'       => array(
							'label' => __( 'Flux', 'hamista-core' ),
							'desc'  => __( 'Cinematic dark, frosted glass and amber glow', 'hamista-core' ),
							'image' => $img . 'kit-flux.svg',
						),
						'honey'      => array(
							'label' => __( 'Honey', 'hamista-core' ),
							'desc'  => __( 'Warm cream, amber and soft hexagons', 'hamista-core' ),
							'image' => $img . 'kit-honey.svg',
						),
						'nomad'      => array(
							'label' => __( 'Nomad', 'hamista-core' ),
							'desc'  => __( 'Wool, terracotta and kilim patterns', 'hamista-core' ),
							'image' => $img . 'kit-nomad.svg',
						),
						'voyage'     => array(
							'label' => __( 'Voyage', 'hamista-core' ),
							'desc'  => __( 'Stone white, charcoal and Persian turquoise', 'hamista-core' ),
							'image' => $img . 'kit-voyage.svg',
						),
						'azure'      => array(
							'label' => __( 'Azure', 'hamista-core' ),
							'desc'  => __( 'Cloud white, navy and royal blue', 'hamista-core' ),
							'image' => $img . 'kit-azure.svg',
						),
						'ink'        => array(
							'label' => __( 'Ink', 'hamista-core' ),
							'desc'  => __( 'Manuscript blue, parchment and gilt', 'hamista-core' ),
							'image' => $img . 'kit-ink.svg',
						),
					),
				),
				'container_width'   => array(
					'type'  => 'range',
					'label' => __( 'Content width', 'hamista-core' ),
					'desc'  => __( 'Maximum width of page content. 1150px keeps every section comfortable on a 15" laptop; Elementor\'s container width is kept in sync.', 'hamista-core' ),
					'min'   => 960,
					'max'   => 1920,
					'step'  => 10,
					'unit'  => 'px',
				),
				'density'           => array(
					'type'    => 'cards',
					'label'   => __( 'Density', 'hamista-core' ),
					'desc'    => __( 'Vertical spacing between and inside sections. Compact shows more on a laptop screen with less scrolling.', 'hamista-core' ),
					'choices' => array(
						'compact' => array(
							'label' => __( 'Compact', 'hamista-core' ),
							'icon'  => 'compress',
						),
						'normal'  => array(
							'label' => __( 'Balanced', 'hamista-core' ),
							'icon'  => 'grid',
						),
						'roomy'   => array(
							'label' => __( 'Spacious', 'hamista-core' ),
							'icon'  => 'expand',
						),
					),
				),
				'section_height'    => array(
					'type'  => 'range',
					'label' => __( 'Base section height', 'hamista-core' ),
					'desc'  => __( 'Heroes, sliders and showcase sections are sized from this value so each one fits a laptop screen.', 'hamista-core' ),
					'min'   => 400,
					'max'   => 720,
					'step'  => 10,
					'unit'  => 'px',
				),
				'page_transitions'  => $on_off + array(
					'label' => __( 'Smooth page transitions', 'hamista-core' ),
					'desc'  => __( 'Cross-fades between pages in supporting browsers. No JavaScript, no delay.', 'hamista-core' ),
				),
				'ui_persian'        => $on_off + array(
					'label' => __( 'Always show Hamista in Persian', 'hamista-core' ),
					'desc'  => __( 'Keeps the Hamista panel, widgets and theme texts in Persian even if the site or your profile language is set to English.', 'hamista-core' ),
				),
				'portfolio_enabled' => $on_off + array(
					'label' => __( 'Portfolio', 'hamista-core' ),
					'desc'  => __( 'A "Portfolio" section in the dashboard for projects, with categories, an archive page and the Portfolio widget.', 'hamista-core' ),
				),
				'title_pages'       => $on_off + array(
					'label' => __( 'On pages', 'hamista-core' ),
					'group' => __( 'Page title area', 'hamista-core' ),
					'desc'  => __( 'The band with the title and breadcrumbs above the content. Pages built with Elementor and the front page never show it; each page can still choose for itself under "Page options".', 'hamista-core' ),
				),
				'title_archives'    => $on_off + array( 'label' => __( 'On blog, archives and search results', 'hamista-core' ) ),
				'title_shop'        => $on_off + array(
					'label'    => __( 'On shop, cart, checkout and account pages', 'hamista-core' ),
					'requires' => 'woocommerce',
				),
				'title_align'       => array(
					'type'    => 'cards',
					'label'   => __( 'Alignment', 'hamista-core' ),
					'choices' => array(
						'start'  => array(
							'label' => __( 'Right', 'hamista-core' ),
							'icon'  => 'align-start',
						),
						'center' => array(
							'label' => __( 'Centre', 'hamista-core' ),
							'icon'  => 'align-center',
						),
					),
				),
				'title_size'        => array(
					'type'    => 'select',
					'label'   => __( 'Size', 'hamista-core' ),
					'choices' => array(
						'compact' => __( 'Compact', 'hamista-core' ),
						'normal'  => __( 'Normal', 'hamista-core' ),
						'large'   => __( 'Large', 'hamista-core' ),
					),
				),
				'back_to_top'       => $on_off + array(
					'label' => __( 'Back-to-top button', 'hamista-core' ),
					'group' => __( 'Other', 'hamista-core' ),
				),
				'breadcrumbs'       => $on_off + array(
					'label' => __( 'Breadcrumbs', 'hamista-core' ),
					'desc'  => __( 'Uses Yoast SEO or Rank Math breadcrumbs when they are enabled.', 'hamista-core' ),
				),
			),
		),
		'colors'      => array(
			'title'  => __( 'Colors & dark mode', 'hamista-core' ),
			'icon'   => 'sun',
			'fields' => array(
				'color_scheme' => array(
					'type'    => 'cards',
					'label'   => __( 'Default color scheme', 'hamista-core' ),
					'choices' => array(
						'light'  => array(
							'label' => __( 'Light', 'hamista-core' ),
							'icon'  => 'sun',
						),
						'dark'   => array(
							'label' => __( 'Dark', 'hamista-core' ),
							'icon'  => 'moon',
						),
						'system' => array(
							'label' => __( 'Follow device', 'hamista-core' ),
							'icon'  => 'mobile',
						),
					),
				),
				'dark_toggle'  => $on_off + array(
					'label' => __( 'Let visitors switch light/dark', 'hamista-core' ),
					'desc'  => __( 'Shows the toggle in the header and remembers each visitor\'s choice.', 'hamista-core' ),
				),
				'accent'       => array(
					'type'    => 'color',
					'label'   => __( 'Accent color', 'hamista-core' ),
					'desc'    => __( 'Buttons, links and highlights. Leave empty to use the style kit\'s color.', 'hamista-core' ),
					'presets' => array( '#0052FF', '#F5A000', '#FF4757', '#10B981', '#7C3AED', '#E11D48', '#0EA5E9', '#111111' ),
					'width'   => 'half',
				),
				'accent_dark'  => array(
					'type'    => 'color',
					'label'   => __( 'Accent in dark mode', 'hamista-core' ),
					'desc'    => __( 'Optional. A slightly brighter tone usually reads better on dark.', 'hamista-core' ),
					'presets' => array( '#3D72FF', '#FFB21A', '#FF5A68', '#34D399', '#A78BFA', '#FB7185', '#38BDF8', '#F4F4F0' ),
					'width'   => 'half',
				),
			),
		),
		'typography'  => array(
			'title'  => __( 'Typography', 'hamista-core' ),
			'icon'   => 'pen',
			'desc'   => __( 'All fonts are served from your own site — nothing loads from Google.', 'hamista-core' ),
			'fields' => array(
				'font_library'        => array(
					'type'  => 'font_library',
					'group' => __( 'Font library', 'hamista-core' ),
					'label' => __( 'Font library', 'hamista-core' ),
					'desc'  => __( 'Licensed Persian fonts that come with Hamista. Switch off the ones you do not want in the menus and in Elementor, and the weights you do not need. A page only downloads the fonts and weights it uses.', 'hamista-core' ),
				),
				'font_body'           => array(
					'type'    => 'select',
					'group'   => __( 'Site fonts', 'hamista-core' ),
					'label'   => __( 'Body font', 'hamista-core' ),
					'choices' => 'font_families',
					'width'   => 'half',
				),
				'font_body_weight'    => array(
					'type'       => 'select',
					'label'      => __( 'Body text weight', 'hamista-core' ),
					'choices'    => 'font_weights',
					'weights_of' => 'font_body',
					'width'      => 'half',
				),
				'font_heading'        => array(
					'type'    => 'select',
					'label'   => __( 'Heading font', 'hamista-core' ),
					'choices' => 'font_families',
					'width'   => 'half',
				),
				'font_heading_weight' => array(
					'type'       => 'select',
					'label'      => __( 'Heading weight', 'hamista-core' ),
					'choices'    => 'font_weights',
					'weights_of' => 'font_heading',
					'width'      => 'half',
				),
				'custom_fonts'        => array(
					'type'  => 'fonts',
					'group' => __( 'Your own fonts', 'hamista-core' ),
					'label' => __( 'Font files', 'hamista-core' ),
					'desc'  => __( 'Upload your licensed font files (woff2 recommended). The weight is detected from each file name, e.g. YekanBakhFaNum-Bold.woff2 → 700. Use the family names "Yekan Bakh" and "Digits" to replace the theme defaults.', 'hamista-core' ),
				),
				'font_numbers'        => array(
					'type'    => 'select',
					'group'   => __( 'Numbers, size and dates', 'hamista-core' ),
					'label'   => __( 'Numbers font', 'hamista-core' ),
					'desc'    => __( 'Used for counters, prices, dates and codes.', 'hamista-core' ),
					'choices' => 'font_families',
					'width'   => 'half',
				),
				'font_size'           => array(
					'type'  => 'range',
					'label' => __( 'Base font size', 'hamista-core' ),
					'min'   => 14,
					'max'   => 19,
					'step'  => 1,
					'unit'  => 'px',
					'width' => 'half',
				),
				'persian_digits'      => $on_off + array(
					'label' => __( 'Persian digits', 'hamista-core' ),
					'desc'  => __( 'Prefer FaNum font files and show numbers as ۱۲۳ in theme output.', 'hamista-core' ),
				),
				'jalali_dates'        => $on_off + array(
					'label' => __( 'Solar Hijri (Jalali) dates', 'hamista-core' ),
					'desc'  => __( 'Shows post and comment dates in the Persian calendar on Persian sites. Skipped automatically if WP-Parsidate is active.', 'hamista-core' ),
				),
			),
		),
		'header'      => array(
			'title'  => __( 'Header', 'hamista-core' ),
			'icon'   => 'menu',
			'fields' => array(
				'header_template'       => array(
					'type'    => 'select',
					'label'   => __( 'Header source', 'hamista-core' ),
					'desc'    => __( 'Design your own header with Elementor in Hamista → Templates, then pick it here.', 'hamista-core' ),
					'choices' => $layouts( 'header' ),
				),
				'logo'                  => array(
					'type'  => 'media',
					'label' => __( 'Logo', 'hamista-core' ),
					'group' => __( 'Logo', 'hamista-core' ),
					'width' => 'half',
				),
				'logo_dark'             => array(
					'type'  => 'media',
					'label' => __( 'Logo for dark mode', 'hamista-core' ),
					'width' => 'half',
				),
				'logo_height'           => array(
					'type'  => 'range',
					'label' => __( 'Logo height', 'hamista-core' ),
					'min'   => 20,
					'max'   => 120,
					'unit'  => 'px',
				),
				'header_layout'         => array(
					'type'    => 'cards',
					'label'   => __( 'Layout', 'hamista-core' ),
					'group'   => __( 'Built-in header', 'hamista-core' ),
					'choices' => array(
						'split'    => array(
							'label' => __( 'Menu in the middle', 'hamista-core' ),
							'image' => $img . 'header-split.svg',
						),
						'start'    => array(
							'label' => __( 'Menu beside the logo', 'hamista-core' ),
							'image' => $img . 'header-start.svg',
						),
						'centered' => array(
							'label' => __( 'Centered logo', 'hamista-core' ),
							'image' => $img . 'header-centered.svg',
						),
					),
					'show_if' => array( 'header_template' => 0 ),
				),
				'header_sticky'         => $on_off + array(
					'label'   => __( 'Sticky header', 'hamista-core' ),
					'show_if' => array( 'header_template' => 0 ),
				),
				'header_hide_on_scroll' => $on_off + array(
					'label'   => __( 'Hide while scrolling down', 'hamista-core' ),
					'desc'    => __( 'Gives content more room; reappears as soon as visitors scroll up.', 'hamista-core' ),
					'show_if' => array(
						'header_template' => 0,
						'header_sticky'   => true,
					),
				),
				'header_search'         => $on_off + array(
					'label'   => __( 'Search button', 'hamista-core' ),
					'show_if' => array( 'header_template' => 0 ),
				),
				'header_account'        => $on_off + array(
					'label'   => __( 'Account button', 'hamista-core' ),
					'show_if' => array( 'header_template' => 0 ),
				),
				'header_cart'           => $on_off + array(
					'label'    => __( 'Cart button', 'hamista-core' ),
					'requires' => 'woocommerce',
					'show_if'  => array( 'header_template' => 0 ),
				),
				'header_cta_text'       => array(
					'type'        => 'text',
					'label'       => __( 'Button text', 'hamista-core' ),
					'placeholder' => __( 'e.g. Get started', 'hamista-core' ),
					'width'       => 'half',
					'show_if'     => array( 'header_template' => 0 ),
				),
				'header_cta_url'        => array(
					'type'        => 'url',
					'label'       => __( 'Button link', 'hamista-core' ),
					'placeholder' => 'https://',
					'width'       => 'half',
					'show_if'     => array( 'header_template' => 0 ),
				),
				'mobile_bar'            => $on_off + array(
					'label' => __( 'Mobile action bar', 'hamista-core' ),
					'desc'  => __( 'A bar fixed to the bottom of phone screens, within thumb reach: one main button plus call and WhatsApp shortcuts.', 'hamista-core' ),
					'group' => __( 'Mobile', 'hamista-core' ),
				),
				'mobile_bar_text'       => array(
					'type'        => 'text',
					'label'       => __( 'Main button text', 'hamista-core' ),
					'placeholder' => __( 'e.g. Free consultation', 'hamista-core' ),
					'width'       => 'half',
					'show_if'     => array( 'mobile_bar' => true ),
				),
				'mobile_bar_url'        => array(
					'type'        => 'url',
					'label'       => __( 'Main button link', 'hamista-core' ),
					'placeholder' => 'https://',
					'width'       => 'half',
					'show_if'     => array( 'mobile_bar' => true ),
				),
				'mobile_bar_phone'      => array(
					'type'        => 'text',
					'label'       => __( 'Phone number', 'hamista-core' ),
					'placeholder' => '021 1234 5678',
					'width'       => 'half',
					'show_if'     => array( 'mobile_bar' => true ),
				),
				'mobile_bar_whatsapp'   => array(
					'type'        => 'text',
					'label'       => __( 'WhatsApp number', 'hamista-core' ),
					'placeholder' => '0912 345 6789',
					'width'       => 'half',
					'show_if'     => array( 'mobile_bar' => true ),
				),
			),
		),
		'footer'      => array(
			'title'  => __( 'Footer', 'hamista-core' ),
			'icon'   => 'layers',
			'fields' => array(
				'footer_template'  => array(
					'type'    => 'select',
					'label'   => __( 'Footer source', 'hamista-core' ),
					'desc'    => __( 'Design your own footer with Elementor in Hamista → Templates, then pick it here.', 'hamista-core' ),
					'choices' => $layouts( 'footer' ),
				),
				'footer_about'     => array(
					'type'    => 'textarea',
					'label'   => __( 'About text', 'hamista-core' ),
					'show_if' => array( 'footer_template' => 0 ),
				),
				'footer_columns'   => array(
					'type'    => 'select',
					'label'   => __( 'Widget columns', 'hamista-core' ),
					'desc'    => __( 'Fill them in Appearance → Widgets (Footer column 1–4).', 'hamista-core' ),
					'choices' => array(
						0 => '0',
						1 => '1',
						2 => '2',
						3 => '3',
						4 => '4',
					),
					'show_if' => array( 'footer_template' => 0 ),
				),
				'footer_social'    => array(
					'type'    => 'repeater',
					'label'   => __( 'Social links', 'hamista-core' ),
					'add'     => __( 'Add link', 'hamista-core' ),
					'fields'  => array(
						'network' => array(
							'type'    => 'select',
							'label'   => __( 'Network', 'hamista-core' ),
							'choices' => array(
								'instagram' => __( 'Instagram', 'hamista-core' ),
								'telegram'  => __( 'Telegram', 'hamista-core' ),
								'whatsapp'  => __( 'WhatsApp', 'hamista-core' ),
								'linkedin'  => __( 'LinkedIn', 'hamista-core' ),
								'x'         => __( 'X', 'hamista-core' ),
								'youtube'   => __( 'YouTube', 'hamista-core' ),
								'aparat'    => __( 'Aparat', 'hamista-core' ),
								'eitaa'     => __( 'Eitaa', 'hamista-core' ),
								'bale'      => __( 'Bale', 'hamista-core' ),
								'rubika'    => __( 'Rubika', 'hamista-core' ),
								'github'    => __( 'GitHub', 'hamista-core' ),
								'dribbble'  => __( 'Dribbble', 'hamista-core' ),
								'behance'   => __( 'Behance', 'hamista-core' ),
							),
						),
						'url'     => array(
							'type'        => 'url',
							'label'       => __( 'Profile URL', 'hamista-core' ),
							'placeholder' => 'https://',
						),
					),
					'show_if' => array( 'footer_template' => 0 ),
				),
				'footer_copyright' => array(
					'type'        => 'text',
					'label'       => __( 'Copyright line', 'hamista-core' ),
					'desc'        => __( 'Use {year} for the current year.', 'hamista-core' ),
					'placeholder' => __( '© {year} Your brand. All rights reserved.', 'hamista-core' ),
					'show_if'     => array( 'footer_template' => 0 ),
				),
				'footer_wordmark'  => $on_off + array(
					'label'   => __( 'Large wordmark at the bottom', 'hamista-core' ),
					'show_if' => array( 'footer_template' => 0 ),
				),
			),
		),
		'blog'        => array(
			'title'  => __( 'Blog', 'hamista-core' ),
			'icon'   => 'book',
			'fields' => array(
				'blog_layout'         => array(
					'type'    => 'cards',
					'label'   => __( 'Archive layout', 'hamista-core' ),
					'choices' => array(
						'grid' => array(
							'label' => __( 'Grid', 'hamista-core' ),
							'icon'  => 'grid',
						),
						'list' => array(
							'label' => __( 'List', 'hamista-core' ),
							'icon'  => 'menu',
						),
					),
				),
				'blog_columns'        => array(
					'type'    => 'select',
					'label'   => __( 'Grid columns', 'hamista-core' ),
					'choices' => array(
						2 => '2',
						3 => '3',
						4 => '4',
					),
					'show_if' => array( 'blog_layout' => 'grid' ),
				),
				'blog_featured_first' => $on_off + array(
					'label'   => __( 'Feature the newest post', 'hamista-core' ),
					'show_if' => array( 'blog_layout' => 'grid' ),
				),
				'blog_sidebar'        => $on_off + array( 'label' => __( 'Sidebar on archives', 'hamista-core' ) ),
				'reading_time'        => $on_off + array(
					'label' => __( 'Reading time', 'hamista-core' ),
					'group' => __( 'Single post', 'hamista-core' ),
				),
				'single_progress'     => $on_off + array( 'label' => __( 'Reading progress bar', 'hamista-core' ) ),
				'single_share'        => $on_off + array( 'label' => __( 'Share buttons', 'hamista-core' ) ),
				'single_author'       => $on_off + array( 'label' => __( 'Author box', 'hamista-core' ) ),
				'single_nav'          => $on_off + array( 'label' => __( 'Previous / next post', 'hamista-core' ) ),
				'single_related'      => $on_off + array( 'label' => __( 'Related posts', 'hamista-core' ) ),
			),
		),
		'shop'        => array(
			'title'    => __( 'Shop', 'hamista-core' ),
			'icon'     => 'bag',
			'requires' => 'woocommerce',
			'fields'   => array(
				'shop_columns'     => array(
					'type'    => 'select',
					'label'   => __( 'Products per row', 'hamista-core' ),
					'choices' => array(
						2 => '2',
						3 => '3',
						4 => '4',
						5 => '5',
					),
				),
				'shop_sidebar'     => $on_off + array(
					'label' => __( 'Shop sidebar', 'hamista-core' ),
					'desc'  => __( 'Add filters in Appearance → Widgets → Shop sidebar.', 'hamista-core' ),
				),
				'shop_hover_image' => $on_off + array(
					'label' => __( 'Show second image on hover', 'hamista-core' ),
				),
			),
		),
		'account'     => array(
			'title'    => __( 'Account area', 'hamista-core' ),
			'icon'     => 'account',
			'requires' => 'woocommerce',
			'desc'     => __( 'The customer\'s account pages: menu items, your own tabs and what the dashboard shows. Tabs can show any page or a Hamista block designed with Elementor.', 'hamista-core' ),
			'fields'   => array(
				'account_layout'           => array(
					'type'    => 'cards',
					'label'   => __( 'Layout', 'hamista-core' ),
					'choices' => array(
						'side' => array(
							'label' => __( 'Menu beside the content', 'hamista-core' ),
							'icon'  => 'menu',
						),
						'tabs' => array(
							'label' => __( 'Tabs above the content', 'hamista-core' ),
							'icon'  => 'grid',
						),
					),
				),
				'account_menu'             => array(
					'type'   => 'repeater',
					'label'  => __( 'Menu', 'hamista-core' ),
					'desc'   => __( 'Add the items in the order you want them. Leave the list empty to keep the standard WooCommerce menu. "Your own tab" shows the chosen page or block at the address you give it; "Link" goes to any address.', 'hamista-core' ),
					'add'    => __( 'Add an item', 'hamista-core' ),
					'group'  => __( 'Menu', 'hamista-core' ),
					'fields' => array(
						'item'    => array(
							'type'    => 'select',
							'label'   => __( 'Item', 'hamista-core' ),
							'choices' => array_merge(
								\Hamista\Core\Account\Panel::items(),
								array(
									'page' => __( 'Your own tab', 'hamista-core' ),
									'link' => __( 'Link', 'hamista-core' ),
								)
							),
						),
						'label'   => array(
							'type'        => 'text',
							'label'       => __( 'Name in the menu', 'hamista-core' ),
							'placeholder' => __( 'Empty keeps the standard name', 'hamista-core' ),
						),
						'icon'    => array(
							'type'    => 'select',
							'label'   => __( 'Icon', 'hamista-core' ),
							'choices' => \Hamista\Core\Account\Panel::icons(),
						),
						'content' => array(
							'type'        => 'select',
							'label'       => __( 'Content', 'hamista-core' ),
							'choices'     => $content_sources,
							'show_if_row' => array( 'item' => 'page' ),
						),
						'slug'    => array(
							'type'        => 'text',
							'label'       => __( 'Address in English letters', 'hamista-core' ),
							'placeholder' => 'my-courses',
							'show_if_row' => array( 'item' => 'page' ),
						),
						'url'     => array(
							'type'        => 'url',
							'label'       => __( 'Link address', 'hamista-core' ),
							'show_if_row' => array( 'item' => 'link' ),
						),
					),
				),
				'account_dash_greeting'    => $on_off + array(
					'label' => __( 'Greeting', 'hamista-core' ),
					'group' => __( 'Dashboard', 'hamista-core' ),
				),
				'account_dash_text'        => array(
					'type'        => 'text',
					'label'       => __( 'Line under the greeting', 'hamista-core' ),
					'placeholder' => __( 'Your orders, appointments and account details, all in one place.', 'hamista-core' ),
					'show_if'     => array( 'account_dash_greeting' => true ),
				),
				'account_dash_cards'       => $on_off + array( 'label' => __( 'Summary cards', 'hamista-core' ) ),
				'account_dash_orders'      => $on_off + array( 'label' => __( 'Latest orders', 'hamista-core' ) ),
				'account_dash_block'       => array(
					'type'    => 'select',
					'label'   => __( 'Your own content', 'hamista-core' ),
					'desc'    => __( 'A page or a Hamista block (Hamista → Templates) designed with Elementor, e.g. offers, news or a support form.', 'hamista-core' ),
					'choices' => $content_sources,
				),
				'account_dash_block_place' => array(
					'type'    => 'select',
					'label'   => __( 'Where it goes', 'hamista-core' ),
					'choices' => array(
						'before'  => __( 'Above the dashboard', 'hamista-core' ),
						'after'   => __( 'Below the dashboard', 'hamista-core' ),
						'replace' => __( 'Instead of the dashboard', 'hamista-core' ),
					),
				),
			),
		),
		'booking'     => array(
			'title'  => __( 'Booking & appointments', 'hamista-core' ),
			'icon'   => 'calendar',
			'desc'   => __( 'For anything booked by time: people (doctor, teacher, consultant) or places (table, court, studio), with weekly hours, capacity, online booking of free times and a "My appointments" tab for customers.', 'hamista-core' ),
			'fields' => array(
				'booking_enabled'          => $on_off + array(
					'label' => __( 'Enable online booking', 'hamista-core' ),
					'desc'  => __( 'Adds a "Booking" menu to the dashboard for what you take bookings for and the appointments, plus the "Booking: list" and "Booking: form" widgets.', 'hamista-core' ),
				),
				'booking_type'             => array(
					'type'    => 'cards',
					'label'   => __( 'Business type', 'hamista-core' ),
					'desc'    => __( 'Sets the wording across the site and the dashboard, e.g. doctor and specialty, or lawyer and practice area.', 'hamista-core' ),
					'choices' => array(
						'general'    => array(
							'label' => __( 'General services', 'hamista-core' ),
							'icon'  => 'calendar',
						),
						'clinic'     => array(
							'label' => __( 'Clinic and medical', 'hamista-core' ),
							'icon'  => 'stethoscope',
						),
						'beauty'     => array(
							'label' => __( 'Beauty salon', 'hamista-core' ),
							'icon'  => 'scissors',
						),
						'legal'      => array(
							'label' => __( 'Law firm', 'hamista-core' ),
							'icon'  => 'scale',
						),
						'consulting' => array(
							'label' => __( 'Consulting and coaching', 'hamista-core' ),
							'icon'  => 'chat',
						),
						'education'  => array(
							'label' => __( 'Education and tutoring', 'hamista-core' ),
							'icon'  => 'book',
						),
						'restaurant' => array(
							'label' => __( 'Restaurant and café', 'hamista-core' ),
							'icon'  => 'cup',
						),
						'sports'     => array(
							'label' => __( 'Sports venue', 'hamista-core' ),
							'icon'  => 'ball',
						),
						'space'      => array(
							'label' => __( 'Studio and space rental', 'hamista-core' ),
							'icon'  => 'grid',
						),
						'auto'       => array(
							'label' => __( 'Car service', 'hamista-core' ),
							'icon'  => 'car',
						),
					),
					'show_if' => array( 'booking_enabled' => true ),
				),
				'booking_label_one'        => array(
					'type'        => 'text',
					'label'       => __( 'Name for one person', 'hamista-core' ),
					'placeholder' => __( 'e.g. Instructor', 'hamista-core' ),
					'group'       => __( 'Your own wording (optional)', 'hamista-core' ),
					'group_desc'  => __( 'Leave empty to use the wording of the business type.', 'hamista-core' ),
					'width'       => 'half',
					'show_if'     => array( 'booking_enabled' => true ),
				),
				'booking_label_many'       => array(
					'type'        => 'text',
					'label'       => __( 'Name for the team', 'hamista-core' ),
					'placeholder' => __( 'e.g. Instructors', 'hamista-core' ),
					'width'       => 'half',
					'show_if'     => array( 'booking_enabled' => true ),
				),
				'booking_label_group_one'  => array(
					'type'        => 'text',
					'label'       => __( 'Name for one service', 'hamista-core' ),
					'placeholder' => __( 'e.g. Course', 'hamista-core' ),
					'width'       => 'half',
					'show_if'     => array( 'booking_enabled' => true ),
				),
				'booking_label_group_many' => array(
					'type'        => 'text',
					'label'       => __( 'Name for services', 'hamista-core' ),
					'placeholder' => __( 'e.g. Courses', 'hamista-core' ),
					'width'       => 'half',
					'show_if'     => array( 'booking_enabled' => true ),
				),
				'booking_kind'             => array(
					'type'    => 'select',
					'label'   => __( 'What is booked', 'hamista-core' ),
					'desc'    => __( 'People get title, experience and licence fields; places and things get a short description instead.', 'hamista-core' ),
					'choices' => array(
						''       => __( 'As the business type suggests', 'hamista-core' ),
						'person' => __( 'People (doctor, teacher, consultant…)', 'hamista-core' ),
						'place'  => __( 'Places and things (table, court, room…)', 'hamista-core' ),
					),
					'show_if' => array( 'booking_enabled' => true ),
				),
				'booking_qty'              => $on_off + array(
					'label'   => __( 'Ask how many people', 'hamista-core' ),
					'desc'    => __( 'For tables, classes and tours. Each booking takes that many places from the slot\'s capacity.', 'hamista-core' ),
					'group'   => __( 'Booking form', 'hamista-core' ),
					'show_if' => array( 'booking_enabled' => true ),
				),
				'booking_qty_label'        => array(
					'type'        => 'text',
					'label'       => __( 'Label of the field', 'hamista-core' ),
					'placeholder' => __( 'Number of people', 'hamista-core' ),
					'width'       => 'half',
					'show_if'     => array(
						'booking_enabled' => true,
						'booking_qty'     => true,
					),
				),
				'booking_qty_max'          => array(
					'type'    => 'range',
					'label'   => __( 'Most people in one booking', 'hamista-core' ),
					'min'     => 1,
					'max'     => 50,
					'width'   => 'half',
					'show_if' => array(
						'booking_enabled' => true,
						'booking_qty'     => true,
					),
				),
				'booking_fields'           => array(
					'type'    => 'repeater',
					'label'   => __( 'Extra questions', 'hamista-core' ),
					'desc'    => __( 'Asked after name and mobile, e.g. car model, occasion or seating preference. Answers appear in the appointment and the email.', 'hamista-core' ),
					'add'     => __( 'Add a question', 'hamista-core' ),
					'fields'  => array(
						'label'    => array(
							'type'  => 'text',
							'label' => __( 'Question', 'hamista-core' ),
						),
						'type'     => array(
							'type'    => 'select',
							'label'   => __( 'Answer type', 'hamista-core' ),
							'choices' => array(
								'text'     => __( 'Short text', 'hamista-core' ),
								'textarea' => __( 'Long text', 'hamista-core' ),
								'number'   => __( 'Number', 'hamista-core' ),
								'select'   => __( 'Choose from a list', 'hamista-core' ),
								'checkbox' => __( 'Tick box', 'hamista-core' ),
							),
						),
						'choices'  => array(
							'type'        => 'text',
							'label'       => __( 'Options', 'hamista-core' ),
							'placeholder' => __( 'Separate with commas', 'hamista-core' ),
							'show_if_row' => array( 'type' => 'select' ),
						),
						'required' => array(
							'type'  => 'toggle',
							'label' => __( 'Required', 'hamista-core' ),
						),
					),
					'show_if' => array( 'booking_enabled' => true ),
				),
				'booking_page'             => array(
					'type'    => 'select',
					'label'   => __( 'Booking page', 'hamista-core' ),
					'desc'    => __( 'A page with the "Booking: form" widget or the [hamista_booking] shortcode. Booking buttons lead here; Automatic uses each profile page.', 'hamista-core' ),
					'choices' => $pages,
					'group'   => __( 'Booking rules', 'hamista-core' ),
					'show_if' => array( 'booking_enabled' => true ),
				),
				'booking_days'             => array(
					'type'    => 'range',
					'label'   => __( 'How far ahead people can book', 'hamista-core' ),
					'min'     => 1,
					'max'     => 60,
					'unit'    => __( 'days', 'hamista-core' ),
					'width'   => 'half',
					'show_if' => array( 'booking_enabled' => true ),
				),
				'booking_notice'           => array(
					'type'    => 'range',
					'label'   => __( 'Minimum notice before an appointment', 'hamista-core' ),
					'min'     => 0,
					'max'     => 48,
					'unit'    => __( 'hours', 'hamista-core' ),
					'width'   => 'half',
					'show_if' => array( 'booking_enabled' => true ),
				),
				'booking_cancel_hours'     => array(
					'type'    => 'range',
					'label'   => __( 'Online cancellation allowed until', 'hamista-core' ),
					'desc'    => __( 'Hours before the appointment. After that, people are asked to call.', 'hamista-core' ),
					'min'     => 0,
					'max'     => 72,
					'unit'    => __( 'hours', 'hamista-core' ),
					'width'   => 'half',
					'show_if' => array( 'booking_enabled' => true ),
				),
				'booking_login'            => $on_off + array(
					'label'   => __( 'Only logged-in visitors can book', 'hamista-core' ),
					'desc'    => __( 'Recommended with mobile login (OTP): the number is verified and people can see and cancel their appointments.', 'hamista-core' ),
					'show_if' => array( 'booking_enabled' => true ),
				),
				'booking_auto_confirm'     => $on_off + array(
					'label'   => __( 'Confirm new appointments automatically', 'hamista-core' ),
					'desc'    => __( 'When off, new appointments wait for the reception to confirm them.', 'hamista-core' ),
					'show_if' => array( 'booking_enabled' => true ),
				),
				'booking_profile_facts'    => $on_off + array(
					'label'   => __( 'Key facts (fee, experience, address)', 'hamista-core' ),
					'group'   => __( 'Profile pages', 'hamista-core' ),
					'desc'    => __( 'A profile built with Elementor shows its own design; these switches apply to the standard layout.', 'hamista-core' ),
					'show_if' => array( 'booking_enabled' => true ),
				),
				'booking_profile_hours'    => $on_off + array(
					'label'   => __( 'Weekly hours', 'hamista-core' ),
					'show_if' => array( 'booking_enabled' => true ),
				),
				'booking_profile_form'     => $on_off + array(
					'label'   => __( 'Booking form on the profile', 'hamista-core' ),
					'show_if' => array( 'booking_enabled' => true ),
				),
				'booking_profile_block'    => array(
					'type'    => 'select',
					'label'   => __( 'Content under every profile', 'hamista-core' ),
					'desc'    => __( 'A page or a Hamista block template (built with Elementor), e.g. insurance partners or a call to action.', 'hamista-core' ),
					'choices' => $content_sources,
					'show_if' => array( 'booking_enabled' => true ),
				),
				'booking_email'            => array(
					'type'        => 'text',
					'label'       => __( 'Send new appointments to', 'hamista-core' ),
					'desc'        => __( 'Email of the reception. Empty uses the site admin email.', 'hamista-core' ),
					'placeholder' => 'reception@example.com',
					'ltr'         => true,
					'group'       => __( 'Notifications', 'hamista-core' ),
					'show_if'     => array( 'booking_enabled' => true ),
				),
			),
		),
		'motion'      => array(
			'title'  => __( 'Motion', 'hamista-core' ),
			'icon'   => 'wave',
			'desc'   => __( 'Hamista\'s motion engine is dependency-free and always respects the visitor\'s "reduce motion" setting.', 'hamista-core' ),
			'fields' => array(
				'smooth_scroll'    => $on_off + array(
					'label' => __( 'Smooth scrolling', 'hamista-core' ),
					'desc'  => __( 'Inertia scrolling for mouse wheels. Off by default: the browser\'s own scrolling is the fastest on long Elementor pages. Touch devices always scroll natively.', 'hamista-core' ),
				),
				'smooth_intensity' => array(
					'type'    => 'range',
					'label'   => __( 'Scroll smoothness', 'hamista-core' ),
					'desc'    => __( 'Lower is silkier, higher is snappier.', 'hamista-core' ),
					'min'     => 5,
					'max'     => 20,
					'step'    => 1,
					'show_if' => array( 'smooth_scroll' => true ),
				),
				'motion_reveal'    => $on_off + array(
					'label' => __( 'Entrance animations', 'hamista-core' ),
					'desc'  => __( 'Elements ease into view as they scroll in. Set per element in Elementor → Advanced → Hamista Motion.', 'hamista-core' ),
				),
				'motion_mobile'    => $on_off + array(
					'label' => __( 'Animations on phones', 'hamista-core' ),
				),
				'magnetic'         => $on_off + array(
					'label' => __( 'Magnetic buttons', 'hamista-core' ),
					'desc'  => __( 'Buttons lean slightly toward the cursor.', 'hamista-core' ),
				),
				'cursor'           => array(
					'type'    => 'cards',
					'label'   => __( 'Cursor style', 'hamista-core' ),
					'desc'    => __( 'Desktop only. Any element can show a word inside the cursor with the attribute data-hm-cursor="…".', 'hamista-core' ),
					'choices' => array(
						'none'  => array(
							'label' => __( 'System cursor', 'hamista-core' ),
							'icon'  => 'mouse',
						),
						'dot'   => array(
							'label' => __( 'Dot', 'hamista-core' ),
							'icon'  => 'dot',
						),
						'ring'  => array(
							'label' => __( 'Dot and ring', 'hamista-core' ),
							'icon'  => 'ring',
						),
						'blend' => array(
							'label' => __( 'Inverting lens', 'hamista-core' ),
							'icon'  => 'contrast',
						),
						'glow'  => array(
							'label' => __( 'Soft glow', 'hamista-core' ),
							'icon'  => 'sun',
						),
					),
				),
				'sound_enabled'    => $on_off + array(
					'label' => __( 'Interface sounds', 'hamista-core' ),
					'group' => __( 'Sound', 'hamista-core' ),
					'desc'  => __( 'Subtle clicks and ticks for buttons, links and toggles, synthesized in the browser (no audio files). Visitors get a speaker button in the header to turn them on or off.', 'hamista-core' ),
				),
				'sound_default'    => $on_off + array(
					'label'   => __( 'On for first-time visitors', 'hamista-core' ),
					'desc'    => __( 'Browsers only allow sound after the first click or key press, so nothing plays before the visitor interacts.', 'hamista-core' ),
					'show_if' => array( 'sound_enabled' => true ),
				),
				'sound_theme'      => array(
					'type'    => 'select',
					'label'   => __( 'Sound character', 'hamista-core' ),
					'choices' => array(
						'soft'       => __( 'Soft — rounded and quiet', 'hamista-core' ),
						'glass'      => __( 'Glass — bright and airy', 'hamista-core' ),
						'mechanical' => __( 'Mechanical — crisp switch clicks', 'hamista-core' ),
						'digital'    => __( 'Digital — short synth blips', 'hamista-core' ),
					),
					'show_if' => array( 'sound_enabled' => true ),
				),
				'sound_volume'     => array(
					'type'    => 'range',
					'label'   => __( 'Volume', 'hamista-core' ),
					'min'     => 5,
					'max'     => 100,
					'step'    => 5,
					'unit'    => '%',
					'show_if' => array( 'sound_enabled' => true ),
				),
				'sound_hover'      => $on_off + array(
					'label'   => __( 'Tick on hover', 'hamista-core' ),
					'desc'    => __( 'A very quiet tick when the pointer reaches a button or card.', 'hamista-core' ),
					'show_if' => array( 'sound_enabled' => true ),
				),
			),
		),
		'login'       => array(
			'title'  => __( 'Login & SMS', 'hamista-core' ),
			'icon'   => 'mobile',
			'desc'   => __( 'Sign in and sign up with a one-time code sent by SMS. Works with WooCommerce accounts and WordPress users.', 'hamista-core' ),
			'fields' => array(
				'otp_enabled'          => $on_off + array( 'label' => __( 'Enable mobile login (OTP)', 'hamista-core' ) ),
				'otp_gateway'          => array(
					'type'    => 'select',
					'label'   => __( 'SMS provider', 'hamista-core' ),
					'group'   => __( 'SMS provider', 'hamista-core' ),
					'choices' => array(
						'test'        => __( 'Test mode (no SMS, code shown to admins)', 'hamista-core' ),
						'kavenegar'   => __( 'Kavenegar', 'hamista-core' ),
						'melipayamak' => __( 'Melipayamak', 'hamista-core' ),
						'smsir'       => __( 'SMS.ir', 'hamista-core' ),
						'ippanel'     => __( 'IPPanel / Farazsms', 'hamista-core' ),
						'ghasedak'    => __( 'Ghasedak', 'hamista-core' ),
						'custom'      => __( 'Custom HTTP API', 'hamista-core' ),
					),
					'show_if' => array( 'otp_enabled' => true ),
				),
				'kavenegar_api_key'    => array(
					'type'    => 'password',
					'label'   => __( 'API key', 'hamista-core' ),
					'show_if' => array(
						'otp_enabled' => true,
						'otp_gateway' => 'kavenegar',
					),
				),
				'kavenegar_template'   => array(
					'type'    => 'text',
					'label'   => __( 'Verify template name', 'hamista-core' ),
					'desc'    => __( 'Create a "verify lookup" template in Kavenegar with the token %token%.', 'hamista-core' ),
					'show_if' => array(
						'otp_enabled' => true,
						'otp_gateway' => 'kavenegar',
					),
				),
				'melipayamak_username' => array(
					'type'    => 'text',
					'label'   => __( 'Username', 'hamista-core' ),
					'width'   => 'half',
					'show_if' => array(
						'otp_enabled' => true,
						'otp_gateway' => 'melipayamak',
					),
				),
				'melipayamak_password' => array(
					'type'    => 'password',
					'label'   => __( 'Password / API key', 'hamista-core' ),
					'width'   => 'half',
					'show_if' => array(
						'otp_enabled' => true,
						'otp_gateway' => 'melipayamak',
					),
				),
				'melipayamak_body_id'  => array(
					'type'    => 'text',
					'label'   => __( 'Pattern (bodyId)', 'hamista-core' ),
					'desc'    => __( 'Shared-line pattern ID with one variable for the code.', 'hamista-core' ),
					'show_if' => array(
						'otp_enabled' => true,
						'otp_gateway' => 'melipayamak',
					),
				),
				'smsir_api_key'        => array(
					'type'    => 'password',
					'label'   => __( 'API key', 'hamista-core' ),
					'show_if' => array(
						'otp_enabled' => true,
						'otp_gateway' => 'smsir',
					),
				),
				'smsir_template_id'    => array(
					'type'    => 'text',
					'label'   => __( 'Template ID', 'hamista-core' ),
					'width'   => 'half',
					'show_if' => array(
						'otp_enabled' => true,
						'otp_gateway' => 'smsir',
					),
				),
				'smsir_param'          => array(
					'type'    => 'text',
					'label'   => __( 'Parameter name', 'hamista-core' ),
					'width'   => 'half',
					'show_if' => array(
						'otp_enabled' => true,
						'otp_gateway' => 'smsir',
					),
				),
				'ippanel_api_key'      => array(
					'type'    => 'password',
					'label'   => __( 'API key', 'hamista-core' ),
					'show_if' => array(
						'otp_enabled' => true,
						'otp_gateway' => 'ippanel',
					),
				),
				'ippanel_pattern'      => array(
					'type'    => 'text',
					'label'   => __( 'Pattern code', 'hamista-core' ),
					'width'   => 'half',
					'show_if' => array(
						'otp_enabled' => true,
						'otp_gateway' => 'ippanel',
					),
				),
				'ippanel_sender'       => array(
					'type'        => 'text',
					'label'       => __( 'Sender number', 'hamista-core' ),
					'placeholder' => '+983000505',
					'width'       => 'half',
					'show_if'     => array(
						'otp_enabled' => true,
						'otp_gateway' => 'ippanel',
					),
				),
				'ippanel_variable'     => array(
					'type'    => 'text',
					'label'   => __( 'Variable name', 'hamista-core' ),
					'show_if' => array(
						'otp_enabled' => true,
						'otp_gateway' => 'ippanel',
					),
				),
				'ghasedak_api_key'     => array(
					'type'    => 'password',
					'label'   => __( 'API key', 'hamista-core' ),
					'show_if' => array(
						'otp_enabled' => true,
						'otp_gateway' => 'ghasedak',
					),
				),
				'ghasedak_template'    => array(
					'type'    => 'text',
					'label'   => __( 'Template name', 'hamista-core' ),
					'show_if' => array(
						'otp_enabled' => true,
						'otp_gateway' => 'ghasedak',
					),
				),
				'custom_sms_url'       => array(
					'type'    => 'url',
					'label'   => __( 'Endpoint URL', 'hamista-core' ),
					'desc'    => __( 'Placeholders {mobile} and {code} work in the URL, headers and body.', 'hamista-core' ),
					'show_if' => array(
						'otp_enabled' => true,
						'otp_gateway' => 'custom',
					),
				),
				'custom_sms_method'    => array(
					'type'    => 'select',
					'label'   => __( 'Method', 'hamista-core' ),
					'choices' => array(
						'POST' => 'POST',
						'GET'  => 'GET',
					),
					'show_if' => array(
						'otp_enabled' => true,
						'otp_gateway' => 'custom',
					),
				),
				'custom_sms_headers'   => array(
					'type'        => 'textarea',
					'label'       => __( 'Headers (one per line)', 'hamista-core' ),
					'placeholder' => "Authorization: Bearer YOUR_KEY\nContent-Type: application/json",
					'show_if'     => array(
						'otp_enabled' => true,
						'otp_gateway' => 'custom',
					),
				),
				'custom_sms_body'      => array(
					'type'    => 'textarea',
					'label'   => __( 'Request body', 'hamista-core' ),
					'show_if' => array(
						'otp_enabled'       => true,
						'otp_gateway'       => 'custom',
						'custom_sms_method' => 'POST',
					),
				),
				'otp_test'             => array(
					'type'    => 'action',
					'label'   => __( 'Send a test code', 'hamista-core' ),
					'desc'    => __( 'Save first, then send a code to your own number to check the provider settings.', 'hamista-core' ),
					'action'  => 'otp_test',
					'button'  => __( 'Send test SMS', 'hamista-core' ),
					'input'   => __( 'Mobile number', 'hamista-core' ),
					'show_if' => array( 'otp_enabled' => true ),
				),
				'otp_length'           => array(
					'type'    => 'select',
					'label'   => __( 'Code length', 'hamista-core' ),
					'group'   => __( 'Behaviour', 'hamista-core' ),
					'choices' => array(
						4 => '4',
						5 => '5',
						6 => '6',
					),
					'width'   => 'half',
					'show_if' => array( 'otp_enabled' => true ),
				),
				'otp_expiry'           => array(
					'type'    => 'range',
					'label'   => __( 'Code lifetime', 'hamista-core' ),
					'min'     => 60,
					'max'     => 600,
					'step'    => 30,
					'unit'    => __( 'sec', 'hamista-core' ),
					'width'   => 'half',
					'show_if' => array( 'otp_enabled' => true ),
				),
				'otp_resend'           => array(
					'type'    => 'range',
					'label'   => __( 'Wait before resending', 'hamista-core' ),
					'min'     => 30,
					'max'     => 300,
					'step'    => 10,
					'unit'    => __( 'sec', 'hamista-core' ),
					'show_if' => array( 'otp_enabled' => true ),
				),
				'otp_register'         => $on_off + array(
					'label'   => __( 'Create accounts for new numbers', 'hamista-core' ),
					'show_if' => array( 'otp_enabled' => true ),
				),
				'otp_ask_name'         => $on_off + array(
					'label'   => __( 'Ask new users for their name', 'hamista-core' ),
					'show_if' => array(
						'otp_enabled'  => true,
						'otp_register' => true,
					),
				),
				'login_password'       => $on_off + array(
					'label'   => __( 'Also allow password login', 'hamista-core' ),
					'show_if' => array( 'otp_enabled' => true ),
				),
				'login_page'           => array(
					'type'    => 'select',
					'label'   => __( 'Login page', 'hamista-core' ),
					'desc'    => __( 'A page with the [hamista_login] shortcode or the Login widget. Automatic uses the WooCommerce account page when available.', 'hamista-core' ),
					'choices' => $pages,
					'group'   => __( 'Pages & redirects', 'hamista-core' ),
					'show_if' => array( 'otp_enabled' => true ),
				),
				'login_redirect'       => array(
					'type'        => 'url',
					'label'       => __( 'After login, go to', 'hamista-core' ),
					'placeholder' => __( 'Leave empty to return to the previous page', 'hamista-core' ),
					'show_if'     => array( 'otp_enabled' => true ),
				),
				'otp_woocommerce'      => $on_off + array(
					'label'    => __( 'Use mobile login on WooCommerce account & checkout', 'hamista-core' ),
					'requires' => 'woocommerce',
					'show_if'  => array( 'otp_enabled' => true ),
				),
				'otp_wp_login'         => $on_off + array(
					'label'   => __( 'Add mobile login to wp-login.php', 'hamista-core' ),
					'show_if' => array( 'otp_enabled' => true ),
				),
			),
		),
		'performance' => array(
			'title'  => __( 'Performance', 'hamista-core' ),
			'icon'   => 'gauge',
			'desc'   => __( 'Safe switches that remove WordPress features most sites never use. Each one shaves requests or kilobytes.', 'hamista-core' ),
			'fields' => array(
				'perf_google_fonts'   => $on_off + array(
					'label' => __( 'Block Google Fonts', 'hamista-core' ),
					'desc'  => __( 'Stops Elementor and the theme from loading fonts from Google (often slow or blocked in Iran). Hamista fonts are self-hosted.', 'hamista-core' ),
				),
				'perf_emojis'         => $on_off + array( 'label' => __( 'Remove emoji script', 'hamista-core' ) ),
				'perf_embeds'         => $on_off + array( 'label' => __( 'Remove oEmbed discovery script', 'hamista-core' ) ),
				'perf_dashicons'      => $on_off + array( 'label' => __( 'Skip Dashicons for visitors', 'hamista-core' ) ),
				'perf_block_css'      => $on_off + array(
					'label' => __( 'Skip block-editor CSS on Elementor pages', 'hamista-core' ),
				),
				'perf_wc_fragments'   => $on_off + array(
					'label'    => __( 'Load WooCommerce cart scripts only where needed', 'hamista-core' ),
					'requires' => 'woocommerce',
				),
				'perf_preload_lcp'    => $on_off + array(
					'label' => __( 'Prioritise the hero image', 'hamista-core' ),
					'desc'  => __( 'Loads the first large image of each page eagerly with high priority.', 'hamista-core' ),
				),
				'perf_jquery_migrate' => $on_off + array(
					'label' => __( 'Remove jQuery Migrate', 'hamista-core' ),
					'desc'  => __( 'Only if your plugins are up to date.', 'hamista-core' ),
				),
				'perf_heartbeat'      => $on_off + array(
					'label' => __( 'Slow down the Heartbeat API', 'hamista-core' ),
				),
				'perf_xmlrpc'         => $on_off + array(
					'label' => __( 'Disable XML-RPC', 'hamista-core' ),
					'desc'  => __( 'Improves security. Keep off if you use Jetpack or the WordPress mobile app.', 'hamista-core' ),
				),
			),
		),
		'code'        => array(
			'title'  => __( 'Custom code', 'hamista-core' ),
			'icon'   => 'code',
			'fields' => array(
				'custom_css'  => array(
					'type'  => 'code',
					'mode'  => 'css',
					'label' => __( 'Custom CSS', 'hamista-core' ),
				),
				'head_code'   => array(
					'type'  => 'code',
					'mode'  => 'html',
					'label' => __( 'Code in <head>', 'hamista-core' ),
					'desc'  => __( 'Analytics, verification tags. Requires the unfiltered_html capability.', 'hamista-core' ),
				),
				'footer_code' => array(
					'type'  => 'code',
					'mode'  => 'html',
					'label' => __( 'Code before </body>', 'hamista-core' ),
				),
			),
		),
		'tools'       => array(
			'title' => __( 'Tools', 'hamista-core' ),
			'icon'  => 'cog',
			'view'  => 'tools',
		),
	);
} )();
