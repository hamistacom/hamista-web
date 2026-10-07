<?php
/**
 * wp eval-file showcase-sample.php — a page with the cinematic Showcase hero,
 * using the Rahnavard placeholder scenes.
 */
require_once ABSPATH . 'wp-admin/includes/image.php';
$dir = WP_PLUGIN_DIR . '/hamista-core/demos/rahnavard/images/';
$ids = array();
foreach ( array( 1, 2, 3, 4 ) as $n ) {
	$name     = 'rahnavard-slide-' . $n . '.webp';
	$existing = get_posts( array( 'post_type' => 'attachment', 'name' => 'rahnavard-slide-' . $n, 'numberposts' => 1, 'fields' => 'ids' ) );
	if ( $existing ) {
		$ids[ $n ] = $existing[0];
		continue;
	}
	$upload = wp_upload_bits( $name, null, file_get_contents( $dir . 'slide-' . $n . '.webp' ) );
	$aid    = wp_insert_attachment( array( 'post_mime_type' => 'image/webp', 'post_title' => 'rahnavard-slide-' . $n, 'post_status' => 'inherit' ), $upload['file'] );
	wp_update_attachment_metadata( $aid, wp_generate_attachment_metadata( $aid, $upload['file'] ) );
	$ids[ $n ] = $aid;
}
$media  = static function ( $id ) {
	return array( 'id' => $id, 'url' => wp_get_attachment_url( $id ) );
};
$slides = array(
	array( 'image' => $media( $ids[1] ), 'label' => 'اصفهان', 'text' => 'نصف جهان؛ میدانی از گنبدهای کاشی، بازار و پل‌هایی که غروب‌ها روشن می‌شوند.' ),
	array( 'image' => $media( $ids[2] ), 'label' => 'کویر لوت', 'text' => 'گرم‌ترین نقطه‌ی زمین و یکی از تاریک‌ترین آسمان‌های شب؛ کلوت‌ها در نور ماه.' ),
	array( 'image' => $media( $ids[3] ), 'label' => 'جنگل هیرکانی', 'text' => 'جنگل‌های چهل‌میلیون‌ساله‌ی شمال، در مه صبحگاهی و صدای رودخانه.' ),
	array( 'image' => $media( $ids[4] ), 'label' => 'تخت جمشید', 'text' => 'ستون‌های بلند پارسه در آفتاب عصر؛ جایی که تاریخ هنوز ایستاده است.' ),
);
$hero = array(
	'id'         => 'shw1aaa',
	'elType'     => 'widget',
	'widgetType' => 'hm-showcase',
	'settings'   => array(
		'slides'     => $slides,
		'autoplay'   => '7',
		'title'      => "سفری\n*بی‌پایان*",
		'video_text' => 'تماشای فیلم',
		'video_url'  => array( 'url' => 'https://www.aparat.com/v/abc123' ),
		'btn_text'   => 'بیشتر بدانید',
		'btn_link'   => array( 'url' => '#tours' ),
		'stats'      => array(
			array( 'value' => '۲٬۰۰۰', 'label' => 'اثر تاریخی' ),
			array( 'value' => '۲۸', 'label' => 'میراث جهانی' ),
			array( 'value' => '۳۱', 'label' => 'استان' ),
		),
		'social'     => array(
			array( 'label' => 'اینستاگرام', 'url' => array( 'url' => 'https://instagram.com/' ) ),
			array( 'label' => 'آپارات', 'url' => array( 'url' => 'https://aparat.com/' ) ),
		),
	),
	'elements'   => array(),
);
$els  = array( array( 'id' => 'shc1aaa', 'elType' => 'container', 'isInner' => false, 'settings' => array( 'content_width' => 'full', 'css_classes' => 'hm-bleed', 'flex_gap' => array( 'size' => 0, 'unit' => 'px' ) ), 'elements' => array( $hero ) ) );
$page = get_page_by_path( 'hm-travel-test' );
$pid  = $page ? $page->ID : wp_insert_post( array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'ره‌نورد', 'post_name' => 'hm-travel-test' ) );
update_post_meta( $pid, '_elementor_edit_mode', 'builder' );
update_post_meta( $pid, '_elementor_template_type', 'wp-page' );
update_post_meta( $pid, '_elementor_version', ELEMENTOR_VERSION );
update_post_meta( $pid, '_elementor_data', wp_slash( wp_json_encode( $els ) ) );
update_post_meta( $pid, '_hm_header', 'transparent-light' );
update_post_meta( $pid, '_hm_title', 'hide' );
\Elementor\Plugin::$instance->files_manager->clear_cache();
echo get_permalink( $pid ), "\n";
