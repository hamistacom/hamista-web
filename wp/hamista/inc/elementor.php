<?php
/**
 * Elementor compatibility.
 *
 * - Pages built with Elementor render edge to edge (no theme container).
 * - Elementor Pro Theme Builder locations are supported when Pro is active.
 * - The theme container width is mirrored to Elementor's kit by Hamista Core.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

/**
 * Whether the current (or given) post is built with Elementor.
 *
 * @param int|null $post_id Post ID.
 * @return bool
 */
function hamista_is_built_with_elementor( $post_id = null ) {
	if ( ! did_action( 'elementor/loaded' ) || ! class_exists( '\Elementor\Plugin' ) ) {
		return false;
	}
	$post_id = $post_id ? $post_id : get_the_ID();
	if ( ! $post_id ) {
		return false;
	}
	$document = \Elementor\Plugin::$instance->documents->get( $post_id );
	return $document && $document->is_built_with_elementor();
}

/**
 * Let Elementor Pro's Theme Builder replace header/footer/single/archive.
 *
 * @param \ElementorPro\Modules\ThemeBuilder\Classes\Locations_Manager $manager Locations manager.
 */
function hamista_register_elementor_locations( $manager ) {
	$manager->register_all_core_location();
}
add_action( 'elementor/theme/register_locations', 'hamista_register_elementor_locations' );

/**
 * Render an Elementor Pro location if one is assigned.
 *
 * @param string $location header|footer|single|archive.
 * @return bool True when Elementor rendered the location.
 */
function hamista_elementor_location( $location ) {
	return function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( $location );
}
