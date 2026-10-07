<?php
/**
 * Default values for every setting. Kept separate from the schema (labels, choices)
 * so front-end requests never build the full admin schema.
 *
 * Keys shared with the theme must match wp/hamista/inc/options.php.
 *
 * @package Hamista\Core
 */

defined( 'ABSPATH' ) || exit;

return array(
	// General.
	'kit'                   => 'spark',
	'container_width'       => 1150,
	'density'               => 'compact',
	'section_height'        => 500,
	'ui_persian'            => true,
	'portfolio_enabled'     => true,
	'back_to_top'           => true,
	'breadcrumbs'           => true,
	'page_transitions'      => true,

	// Colors.
	'color_scheme'          => 'light',
	'dark_toggle'           => true,
	'accent'                => '',
	'accent_dark'           => '',

	// Typography.
	'custom_fonts'          => array(),
	'font_body'             => 'yekan-bakh',
	'font_heading'          => 'yekan-bakh',
	'font_numbers'          => 'digits',
	'font_size'             => 16,
	'persian_digits'        => true,
	'jalali_dates'          => true,

	// Header.
	'logo'                  => 0,
	'logo_dark'             => 0,
	'logo_height'           => 40,
	'header_layout'         => 'split',
	'header_sticky'         => true,
	'header_hide_on_scroll' => true,
	'header_search'         => true,
	'header_account'        => true,
	'header_cart'           => true,
	'header_cta_text'       => '',
	'header_cta_url'        => '',
	'header_template'       => 0,
	'mobile_bar'            => false,
	'mobile_bar_text'       => '',
	'mobile_bar_url'        => '',
	'mobile_bar_phone'      => '',
	'mobile_bar_whatsapp'   => '',

	// Footer.
	'footer_about'          => '',
	'footer_columns'        => 3,
	'footer_social'         => array(),
	'footer_copyright'      => '',
	'footer_wordmark'       => true,
	'footer_template'       => 0,

	// Blog.
	'blog_layout'           => 'grid',
	'blog_columns'          => 3,
	'blog_featured_first'   => true,
	'blog_sidebar'          => false,
	'reading_time'          => true,
	'single_progress'       => true,
	'single_share'          => true,
	'single_author'         => true,
	'single_nav'            => true,
	'single_related'        => true,

	// Shop.
	'shop_columns'          => 3,
	'shop_sidebar'          => false,
	'shop_hover_image'      => true,

	// Motion.
	'smooth_scroll'         => false,
	'smooth_intensity'      => 10,
	'motion_reveal'         => true,
	'motion_mobile'         => true,
	'magnetic'              => true,
	'cursor'                => 'none',
	'sound_enabled'         => false,
	'sound_default'         => false,
	'sound_theme'           => 'soft',
	'sound_volume'          => 40,
	'sound_hover'           => true,

	// Login & SMS.
	'otp_enabled'           => false,
	'otp_gateway'           => 'test',
	'kavenegar_api_key'     => '',
	'kavenegar_template'    => '',
	'melipayamak_username'  => '',
	'melipayamak_password'  => '',
	'melipayamak_body_id'   => '',
	'smsir_api_key'         => '',
	'smsir_template_id'     => '',
	'smsir_param'           => 'CODE',
	'ippanel_api_key'       => '',
	'ippanel_pattern'       => '',
	'ippanel_sender'        => '',
	'ippanel_variable'      => 'code',
	'ghasedak_api_key'      => '',
	'ghasedak_template'     => '',
	'custom_sms_url'        => '',
	'custom_sms_method'     => 'POST',
	'custom_sms_headers'    => '',
	'custom_sms_body'       => '{"to":"{mobile}","code":"{code}"}',
	'otp_length'            => 5,
	'otp_expiry'            => 120,
	'otp_resend'            => 60,
	'otp_register'          => true,
	'otp_ask_name'          => true,
	'login_password'        => true,
	'login_page'            => 0,
	'login_redirect'        => '',
	'otp_woocommerce'       => true,
	'otp_wp_login'          => false,

	// Performance.
	'perf_google_fonts'     => true,
	'perf_emojis'           => true,
	'perf_embeds'           => true,
	'perf_jquery_migrate'   => false,
	'perf_block_css'        => true,
	'perf_dashicons'        => true,
	'perf_heartbeat'        => false,
	'perf_xmlrpc'           => false,
	'perf_wc_fragments'     => true,
	'perf_preload_lcp'      => true,

	// Custom code.
	'custom_css'            => '',
	'head_code'             => '',
	'footer_code'           => '',
);
