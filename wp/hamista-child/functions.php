<?php
/**
 * Hamista Child functions.
 *
 * @package Hamista_Child
 */

defined( 'ABSPATH' ) || exit;

/**
 * Load the child stylesheet after the parent's.
 */
function hamista_child_enqueue() {
	wp_enqueue_style( 'hamista-child', get_stylesheet_uri(), array( 'hamista' ), wp_get_theme()->get( 'Version' ) );
}
add_action( 'wp_enqueue_scripts', 'hamista_child_enqueue', 20 );

// Add your own functions below this line.
