<?php
/**
 * Site header.
 *
 * Header source, in order: Elementor Pro Theme Builder → a Hamista Core
 * header template (Elementor, free) → the built-in configurable header.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="hm-skip-link" href="#main"><?php esc_html_e( 'Skip to content', 'hamista' ); ?></a>
<div class="hm-site">
	<?php
	$hamista_header = hamista_header_state();
	if ( ! $hamista_header['hidden'] && ! hamista_elementor_location( 'header' ) ) {
		/**
		 * Return true after printing a custom header to replace the built-in one.
		 *
		 * @param bool $rendered Whether a header was already rendered.
		 */
		if ( ! apply_filters( 'hamista/header/render', false ) ) {
			get_template_part( 'template-parts/header/site-header', null, $hamista_header );
		}
	}
	?>
