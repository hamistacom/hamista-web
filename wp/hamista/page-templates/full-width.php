<?php
/**
 * Template Name: Hamista — Full width
 * Template Post Type: page, post
 *
 * Content spans the full window with no theme title. Ideal for page builders.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main id="main" class="hm-main hm-main--builder">
	<?php
	while ( have_posts() ) :
		the_post();
		the_content();
	endwhile;
	?>
</main>
<?php
get_footer();
