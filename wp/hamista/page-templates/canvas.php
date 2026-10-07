<?php
/**
 * Template Name: Hamista — Canvas (no header or footer)
 * Template Post Type: page
 *
 * Only the page content: for landing pages, coming-soon and campaign pages.
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
<body <?php body_class( 'hm-canvas' ); ?>>
<?php wp_body_open(); ?>
<main id="main" class="hm-main hm-main--builder">
	<?php
	while ( have_posts() ) :
		the_post();
		the_content();
	endwhile;
	?>
</main>
<?php wp_footer(); ?>
</body>
</html>
