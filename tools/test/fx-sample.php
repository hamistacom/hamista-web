<?php
/**
 * wp eval-file fx-sample.php — a page that exercises the scroll effects:
 * page light line, scroll colour, element zoom and card motions.
 * Uses the Sayal demo images already in the media library.
 */
$img = static function ( $title ) {
	$found = get_posts( array( 'post_type' => 'attachment', 'title' => $title, 'numberposts' => 1, 'fields' => 'ids' ) );
	return $found ? array( 'id' => $found[0], 'url' => wp_get_attachment_url( $found[0] ) ) : array( 'id' => '', 'url' => '' );
};
$n   = 0;
$id  = static function () use ( &$n ) {
	++$n;
	return 'fx' . str_pad( (string) $n, 5, '0', STR_PAD_LEFT );
};
$w   = static function ( $type, $settings ) use ( $id ) {
	return array( 'id' => $id(), 'elType' => 'widget', 'widgetType' => $type, 'settings' => $settings, 'elements' => array() );
};
$c   = static function ( $settings, $elements ) use ( $id ) {
	return array( 'id' => $id(), 'elType' => 'container', 'isInner' => false, 'settings' => array_merge( array( 'container_type' => 'flex', 'content_width' => 'boxed', 'css_classes' => 'hm-gutter hm-space-lg', 'flex_gap' => array( 'size' => 40, 'unit' => 'px', 'column' => '40', 'row' => '40' ) ), $settings ), 'elements' => $elements );
};
$head = static function ( $eyebrow, $title, $text = '' ) use ( $w ) {
	return $w( 'hm-heading', array( 'eyebrow' => $eyebrow, 'title' => $title, 'description' => $text, 'title_tag' => 'h2', 'title_size' => 'lg', 'header_align' => 'start' ) );
};
$items = array();
foreach ( array( 'راهبرد', 'طراحی', 'ساخت', 'آزمون', 'راه‌اندازی', 'پشتیبانی' ) as $i => $t ) {
	$items[] = array( 'icon' => array( 'compass', 'users', 'rocket', 'chart', 'shield', 'spark' )[ $i ], 'title' => $t, 'text' => 'یک توضیح کوتاه و روشن درباره‌ی این مرحله از کار، در دو خط.' );
}
$features = static function ( $extra = array() ) use ( $w, $items ) {
	return $w( 'hm-features', array_merge( array( 'items' => $items, 'layout' => 'grid', 'columns' => '3', 'style' => 'cards', 'icon_style' => 'tile' ), $extra ) );
};
$els = array(
	$c( array( 'css_classes' => 'hm-gutter hm-space-lg' ), array( $w( 'hm-heading', array( 'eyebrow' => 'جلوه‌های اسکرول', 'title' => "نور، رنگ و حرکت\n*با هر اسکرول*", 'description' => 'رشته‌ی نور از کناره‌ی صفحه پایین می‌آید، رنگ صفحه با هر بخش عوض می‌شود و کارت‌ها با حرکت پخش می‌شوند.', 'title_tag' => 'h1', 'title_size' => 'xl', 'header_align' => 'start' ) ) ) ),
	$c( array( 'hm_cards' => 'spread' ), array( $features() ) ),
	$c( array( 'hm_tone' => 'inverse' ), array( $head( 'تغییر رنگ', 'صفحه تاریک می‌شود', 'وقتی این بخش به میانه‌ی صفحه می‌رسد، رنگ همه‌ی صفحه آرام عوض می‌شود.' ), $w( 'image', array( 'image' => $img( 'work-3' ), 'image_size' => 'full', 'hm_zoom' => 'expand', 'hm_zoom_amount' => array( 'unit' => 'px', 'size' => 0.3 ), 'hm_zoom_inner' => 'yes', 'hm_zoom_radius' => 28 ) ) ) ),
	$c( array( 'hm_tone' => 'soft', 'hm_cards' => 'cascade' ), array( $head( 'پله‌ای', 'کارت‌ها یکی‌یکی بالا می‌آیند' ), $features( array( 'style' => 'cards' ) ) ) ),
	$c( array(), array( $head( 'زوم', 'نزدیک شدن به تصویر' ), $w( 'image', array( 'image' => $img( 'work-1' ), 'image_size' => 'full', 'hm_zoom' => 'in', 'hm_zoom_amount' => array( 'unit' => 'px', 'size' => 0.25 ), 'hm_zoom_inner' => 'yes' ) ) ) ),
	$c( array( 'hm_cards' => 'flip' ), array( $head( 'چرخش', 'کارت‌ها می‌چرخند و می‌نشینند' ), $features() ) ),
	$c( array( 'hm_tone' => 'accent' ), array( $head( 'رنگ تأکیدی', 'بخش رنگی', 'رنگ متن و خطوط هم با پس‌زمینه هماهنگ می‌شود.' ), $features( array( 'style' => 'plain' ) ) ) ),
	$c( array( 'hm_cards' => 'gather' ), array( $head( 'گرد آمدن', 'کارت‌ها از اطراف جمع می‌شوند' ), $features() ) ),
	$c( array( 'hm_cards' => 'tilt' ), array( $head( 'خم شدن', 'کارت‌ها با اسکرول خم می‌شوند' ), $features() ) ),
	$c( array(), array( $w( 'image', array( 'image' => $img( 'work-5' ), 'image_size' => 'full', 'hm_zoom' => 'shrink', 'hm_zoom_amount' => array( 'unit' => 'px', 'size' => 0.3 ) ) ) ) ),
);
$page = get_page_by_path( 'hm-fx-test' );
$pid  = $page ? $page->ID : wp_insert_post( array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'جلوه‌ها', 'post_name' => 'hm-fx-test' ) );
update_post_meta( $pid, '_elementor_edit_mode', 'builder' );
update_post_meta( $pid, '_elementor_template_type', 'wp-page' );
update_post_meta( $pid, '_elementor_version', ELEMENTOR_VERSION );
update_post_meta( $pid, '_elementor_data', wp_slash( wp_json_encode( $els ) ) );
update_post_meta( $pid, '_elementor_page_settings', array( 'hm_page_light' => 'weave', 'hm_title' => 'hide' ) );
delete_post_meta( $pid, '_elementor_css' );
echo get_permalink( $pid ) . "\n";
