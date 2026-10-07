<?php
/**
 * wp eval-file portfolio-sample.php — six sample projects (using existing media) and a widget page.
 */
$images = get_posts( array( 'post_type' => 'attachment', 'post_mime_type' => 'image', 'posts_per_page' => 12, 'fields' => 'ids' ) );
$cats   = array( 'برندینگ', 'وب‌سایت', 'موشن' );
$ids    = array();
foreach ( $cats as $c ) {
	$t     = term_exists( $c, 'hm_portfolio_cat' );
	$ids[] = $t ? (int) $t['term_id'] : (int) wp_insert_term( $c, 'hm_portfolio_cat' )['term_id'];
}
$titles = array( 'هویت بصری کافه‌ی دانه', 'وب‌سایت کلینیک آوا', 'تیزر معرفی اپ پرداخت', 'بسته‌بندی عسل کوهستان', 'فروشگاه آنلاین پوشاک', 'انیمیشن معرفی محصول' );
foreach ( $titles as $i => $title ) {
	if ( get_page_by_title( $title, OBJECT, 'hm_portfolio' ) ) { continue; } // phpcs:ignore
	$id = wp_insert_post( array( 'post_type' => 'hm_portfolio', 'post_status' => 'publish', 'post_title' => $title, 'post_excerpt' => 'طراحی و اجرا از ایده تا تحویل، در شش هفته.', 'post_content' => '<p>این پروژه با یک کارگاه دوروزه شروع شد و با تحویل راهنمای برند و فایل‌های نهایی تمام شد.</p>' ) );
	wp_set_object_terms( $id, array( $ids[ $i % 3 ] ), 'hm_portfolio_cat' );
	if ( ! empty( $images[ $i ] ) ) { set_post_thumbnail( $id, $images[ $i ] ); }
	update_post_meta( $id, '_hm_client', 'شرکت نمونه' );
	update_post_meta( $id, '_hm_year', '1403' );
	update_post_meta( $id, '_hm_services', 'استراتژی، طراحی، توسعه' );
}
$els = array();
foreach ( array( array( 'layout' => 'masonry' ), array( 'layout' => 'carousel', 'card_style' => 'overlay' ), array( 'layout' => 'expand' ) ) as $i => $set ) {
	$type   = 2 === $i ? 'hm-testimonials' : 'hm-portfolio';
	$els[] = array( 'id' => 'pf' . $i . 'aa', 'elType' => 'container', 'isInner' => false, 'settings' => array( 'content_width' => 'full' ), 'elements' => array( array( 'id' => 'pw' . $i . 'aa', 'elType' => 'widget', 'widgetType' => $type, 'settings' => (object) $set, 'elements' => array() ) ) );
}
$page = get_page_by_path( 'hm-portfolio-test' );
$id   = $page ? $page->ID : wp_insert_post( array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'نمونه‌کارها', 'post_name' => 'hm-portfolio-test' ) );
update_post_meta( $id, '_elementor_edit_mode', 'builder' );
update_post_meta( $id, '_elementor_template_type', 'wp-page' );
update_post_meta( $id, '_elementor_version', ELEMENTOR_VERSION );
update_post_meta( $id, '_elementor_data', wp_slash( wp_json_encode( $els ) ) );
\Elementor\Plugin::$instance->files_manager->clear_cache();
echo get_permalink( $id ), "\n", get_post_type_archive_link( 'hm_portfolio' ), "\n";
