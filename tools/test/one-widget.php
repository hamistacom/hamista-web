<?php
/**
 * wp eval-file one-widget.php <widget> [slug] — page with a single widget at its defaults.
 */
$w    = $args[0] ?? 'hm-lead-form';
$slug = $args[1] ?? 'hm-test-' . $w;
$els  = array(
	array(
		'id'       => 'c' . substr( md5( $w ), 0, 6 ),
		'elType'   => 'container',
		'isInner'  => false,
		'settings' => array( 'content_width' => 'boxed', 'boxed_width' => array( 'unit' => 'px', 'size' => 760 ), 'padding' => array( 'unit' => 'px', 'top' => '80', 'right' => '0', 'bottom' => '80', 'left' => '0', 'isLinked' => false ) ),
		'elements' => array( array( 'id' => 'w' . substr( md5( $w ), 0, 6 ), 'elType' => 'widget', 'widgetType' => $w, 'settings' => new stdClass(), 'elements' => array() ) ),
	),
);
$page = get_page_by_path( $slug );
$id   = $page ? $page->ID : wp_insert_post( array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => $w, 'post_name' => $slug ) );
update_post_meta( $id, '_elementor_edit_mode', 'builder' );
update_post_meta( $id, '_elementor_template_type', 'wp-page' );
update_post_meta( $id, '_elementor_version', ELEMENTOR_VERSION );
update_post_meta( $id, '_elementor_data', wp_slash( wp_json_encode( $els ) ) );
\Elementor\Plugin::$instance->files_manager->clear_cache();
echo get_permalink( $id ), "\n";
