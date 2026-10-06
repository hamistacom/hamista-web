<?php
/**
 * wp eval-file: create/refresh a page with every Hamista widget at defaults.
 */
$widgets = array( 'hm-hero', 'hm-marquee', 'hm-heading', 'hm-text-scrub', 'hm-tabs', 'hm-counters', 'hm-features', 'hm-steps', 'hm-scroll-path', 'hm-hscroll', 'hm-scroll-zoom', 'hm-stack', 'hm-image-reveal', 'hm-testimonials', 'hm-pricing', 'hm-team', 'hm-device', 'hm-accordion', 'hm-contact-info', 'hm-contact-form', 'hm-posts', 'hm-products', 'hm-cta' );
$els = array();
foreach ( $widgets as $w ) {
	$full = in_array( $w, array( 'hm-hero', 'hm-scroll-path', 'hm-hscroll', 'hm-scroll-zoom', 'hm-cta', 'hm-marquee' ), true );
	$els[] = array(
		'id'       => substr( md5( $w ), 0, 7 ),
		'elType'   => 'container',
		'isInner'  => false,
		'settings' => $full ? array( 'content_width' => 'full', 'padding' => array( 'unit' => 'px', 'top' => '0', 'right' => '0', 'bottom' => '0', 'left' => '0', 'isLinked' => true ) )
			: array( 'content_width' => 'boxed', 'padding' => array( 'unit' => 'px', 'top' => '80', 'right' => '0', 'bottom' => '80', 'left' => '0', 'isLinked' => false ) ),
		'elements' => array( array( 'id' => substr( md5( $w . 'w' ), 0, 7 ), 'elType' => 'widget', 'widgetType' => $w, 'settings' => new stdClass(), 'elements' => array() ) ),
	);
}
$page = get_page_by_path( 'hm-all-widgets' );
$id   = $page ? $page->ID : wp_insert_post( array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'All widgets', 'post_name' => 'hm-all-widgets' ) );
update_post_meta( $id, '_elementor_edit_mode', 'builder' );
update_post_meta( $id, '_elementor_template_type', 'wp-page' );
update_post_meta( $id, '_elementor_version', ELEMENTOR_VERSION );
update_post_meta( $id, '_elementor_data', wp_slash( wp_json_encode( $els ) ) );
\Elementor\Plugin::$instance->files_manager->clear_cache();
echo get_permalink( $id ), "\n";
