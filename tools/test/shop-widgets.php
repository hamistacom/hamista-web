<?php
/**
 * wp eval-file shop-widgets.php — a page with every Hamista shop widget, for visual checks.
 */
$widgets = array(
	array( 'hm-product-categories', array( 'style' => 'circle' ) ),
	array( 'hm-product-carousel', array( 'dots' => 'bar' ) ),
	array( 'hm-product-deal', array() ),
	array( 'hm-product-deal', array( 'layout_type' => 'spotlight' ) ),
	array( 'hm-product-tabs', array() ),
	array( 'hm-product-carousel', array( 'card_style' => 'overlay', 'title' => 'نمای روی تصویر', 'arrows' => 'sides', 'dots' => 'dots' ) ),
	array( 'hm-product-categories', array( 'style' => 'tile', 'layout' => 'grid', 'columns' => '4' ) ),
);
$els = array();
foreach ( $widgets as $i => $w ) {
	$els[] = array(
		'id'       => 'cs' . $i . substr( md5( $w[0] . $i ), 0, 4 ),
		'elType'   => 'container',
		'isInner'  => false,
		'settings' => array( 'content_width' => 'full', 'padding' => array( 'unit' => 'px', 'top' => '0', 'right' => '0', 'bottom' => '0', 'left' => '0', 'isLinked' => true ) ),
		'elements' => array( array( 'id' => 'ws' . $i . substr( md5( $w[0] . $i ), 0, 4 ), 'elType' => 'widget', 'widgetType' => $w[0], 'settings' => (object) $w[1], 'elements' => array() ) ),
	);
}
// Two products on sale with an end date, so deals have something to show.
foreach ( array_slice( wc_get_products( array( 'limit' => 6 ) ), 0, 4 ) as $p ) {
	if ( $p->is_type( 'simple' ) && $p->get_regular_price() ) {
		$p->set_sale_price( (string) round( $p->get_regular_price() * 0.8 ) );
		$p->set_date_on_sale_to( time() + 2 * DAY_IN_SECONDS );
		$p->set_manage_stock( true );
		$p->set_stock_quantity( 7 );
		$p->set_total_sales( 23 );
		$p->save();
	}
}
$page = get_page_by_path( 'hm-shop-widgets' );
$id   = $page ? $page->ID : wp_insert_post( array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'ویجت‌های فروشگاه', 'post_name' => 'hm-shop-widgets' ) );
update_post_meta( $id, '_elementor_edit_mode', 'builder' );
update_post_meta( $id, '_elementor_template_type', 'wp-page' );
update_post_meta( $id, '_elementor_version', ELEMENTOR_VERSION );
update_post_meta( $id, '_elementor_data', wp_slash( wp_json_encode( $els ) ) );
\Elementor\Plugin::$instance->files_manager->clear_cache();
echo get_permalink( $id ), "\n";
