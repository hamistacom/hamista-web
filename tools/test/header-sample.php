<?php
/**
 * wp eval-file header-sample.php [on|off] — an Elementor-built header using the
 * header widgets, shown on the portfolio test page only.
 */
$mode = $args[0] ?? 'on';
$old  = get_posts( array( 'post_type' => 'hm_layout', 'title' => 'سربرگ آزمایشی', 'posts_per_page' => 1, 'fields' => 'ids', 'post_status' => 'any' ) );
foreach ( $old as $o ) { wp_delete_post( $o, true ); }
if ( 'off' === $mode ) { echo "removed\n"; return; }
$w   = static function ( $id, $type, $settings = array() ) { return array( 'id' => $id, 'elType' => 'widget', 'widgetType' => $type, 'settings' => (object) $settings, 'elements' => array() ); };
$els = array(
	array(
		'id' => 'hdr001', 'elType' => 'container', 'isInner' => false,
		'settings' => array( 'flex_direction' => 'row', 'flex_align_items' => 'center', 'flex_justify_content' => 'space-between', 'min_height' => array( 'unit' => 'px', 'size' => 72 ), 'padding' => array( 'unit' => 'px', 'top' => '0', 'bottom' => '0', 'left' => '0', 'right' => '0', 'isLinked' => false ) ),
		'elements' => array( $w( 'hdr002', 'hm-site-logo' ), $w( 'hdr003', 'hm-nav-menu', array( 'style' => 'pill' ) ), $w( 'hdr004', 'hm-header-actions', array( 'items' => array( 'search', 'theme', 'cart', 'cta', 'menu' ), 'cta_link' => array( 'url' => '/contact/' ), 'cart_style' => 'total' ) ) ),
	),
);
$id = wp_insert_post( array( 'post_type' => 'hm_layout', 'post_status' => 'publish', 'post_title' => 'سربرگ آزمایشی' ) );
update_post_meta( $id, '_hm_layout_type', 'header' );
update_post_meta( $id, '_hm_layout_rule', 'pages' );
update_post_meta( $id, '_elementor_edit_mode', 'builder' );
update_post_meta( $id, '_elementor_version', ELEMENTOR_VERSION );
update_post_meta( $id, '_elementor_data', wp_slash( wp_json_encode( $els ) ) );
\Elementor\Plugin::$instance->files_manager->clear_cache();
echo "header $id\n";
