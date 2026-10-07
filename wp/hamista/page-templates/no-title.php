<?php
/**
 * Template Name: Hamista — Contained, no title
 * Template Post Type: page
 *
 * Header and footer, content in the site container, without the page title block.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main id="main" class="hm-main hm-section">
	<div class="hm-container hm-prose entry-content">
		<?php
		while ( have_posts() ) :
			the_post();
			the_content();
		endwhile;
		?>
	</div>
</main>
<?php
get_footer();
