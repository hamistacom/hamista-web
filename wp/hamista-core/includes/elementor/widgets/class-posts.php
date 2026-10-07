<?php
/**
 * Posts: blog posts in a grid, list, featured or compact layout, using the
 * theme's own card so blog pages and widgets always match.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Carousel;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Posts widget.
 */
class Posts extends Widget_Base {

	use Carousel;

	/** @return string */
	public function get_name() {
		return 'hm-posts';
	}

	/** @return string */
	public function get_title() {
		return __( 'Posts', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-posts-grid';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'posts', 'blog', 'articles', 'news', 'journal' );
	}

	/**
	 * Posts content changes independently of widget settings.
	 *
	 * @return bool
	 */
	protected function is_dynamic_content(): bool {
		return true;
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_query', array( 'label' => __( 'Query', 'hamista-core' ) ) );
		$cats = array();
		foreach ( get_categories( array( 'hide_empty' => false ) ) as $cat ) {
			$cats[ $cat->term_id ] = $cat->name;
		}
		$this->add_control(
			'count',
			array(
				'label'   => __( 'Number of posts', 'hamista-core' ),
				'type'    => Controls_Manager::NUMBER,
				'default' => 6,
				'min'     => 1,
				'max'     => 48,
			)
		);
		$this->add_control(
			'cats',
			array(
				'label'       => __( 'Categories', 'hamista-core' ),
				'type'        => Controls_Manager::SELECT2,
				'multiple'    => true,
				'options'     => $cats,
				'label_block' => true,
			)
		);
		$this->add_control(
			'orderby',
			array(
				'label'   => __( 'Order', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'date',
				'options' => array(
					'date'          => __( 'Newest first', 'hamista-core' ),
					'comment_count' => __( 'Most discussed', 'hamista-core' ),
					'rand'          => __( 'Random', 'hamista-core' ),
					'title'         => __( 'Title', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'offset',
			array(
				'label'   => __( 'Skip first', 'hamista-core' ),
				'type'    => Controls_Manager::NUMBER,
				'default' => 0,
				'min'     => 0,
			)
		);
		$this->add_control(
			'pagination',
			array(
				'label'        => __( 'Page numbers', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_layout', array( 'label' => __( 'Layout', 'hamista-core' ) ) );
		$this->add_control(
			'layout',
			array(
				'label'   => __( 'Layout', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'grid',
				'options' => array(
					'grid'     => __( 'Grid', 'hamista-core' ),
					'carousel' => __( 'Carousel', 'hamista-core' ),
					'featured' => __( 'Featured first + grid', 'hamista-core' ),
					'list'     => __( 'List', 'hamista-core' ),
					'compact'  => __( 'Compact index', 'hamista-core' ),
				),
			)
		);
		$this->add_responsive_control(
			'columns',
			array(
				'label'          => __( 'Columns', 'hamista-core' ),
				'type'           => Controls_Manager::SELECT,
				'default'        => '3',
				'tablet_default' => '2',
				'mobile_default' => '1',
				'options'        => array(
					'1' => '1',
					'2' => '2',
					'3' => '3',
					'4' => '4',
				),
				'selectors'      => array( '{{WRAPPER}} .hm-posts' => '--hm-cols: {{VALUE}};' ),
				'condition'      => array( 'layout' => array( 'grid', 'featured' ) ),
			)
		);
		$this->add_carousel_options( array( 'layout' => 'carousel' ) );
		$this->add_control(
			'excerpt',
			array(
				'label'        => __( 'Excerpt', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s     = $this->get_settings_for_display();
		$paged = 'yes' === $s['pagination'] ? max( 1, (int) get_query_var( 'paged' ), (int) get_query_var( 'page' ) ) : 1;
		$args  = array(
			'post_type'           => 'post',
			'posts_per_page'      => max( 1, (int) $s['count'] ),
			'orderby'             => $s['orderby'],
			'ignore_sticky_posts' => true,
			'paged'               => $paged,
			'no_found_rows'       => 'yes' !== $s['pagination'],
		);
		if ( (int) $s['offset'] ) {
			$args['offset'] = (int) $s['offset'] + ( $paged - 1 ) * $args['posts_per_page'];
		}
		if ( ! empty( $s['cats'] ) ) {
			$args['category__in'] = array_map( 'intval', (array) $s['cats'] );
		}
		if ( is_singular() ) {
			$args['post__not_in'] = array( get_the_ID() );
		}
		$query = new \WP_Query( $args );

		if ( ! $query->have_posts() ) {
			if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
				echo '<div class="hm-empty">' . esc_html__( 'No posts found for this query.', 'hamista-core' ) . '</div>';
			}
			return;
		}

		if ( 'compact' === $s['layout'] ) {
			echo '<ol class="hm-post-index" data-hm-stagger="0.06">';
			while ( $query->have_posts() ) {
				$query->the_post();
				echo '<li data-hm-reveal="up"><a href="' . esc_url( get_permalink() ) . '"><span class="hm-post-index__title">' . esc_html( get_the_title() ) . '</span><span class="hm-post-index__meta">' . esc_html( get_the_date() ) . '</span>' . hamista_core_icon( 'arrow', array( 'class' => 'hm-i-arrow' ) ) . '</a></li>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</ol>';
			wp_reset_postdata();
			return;
		}

		if ( 'carousel' === $s['layout'] ) {
			$cards = array();
			while ( $query->have_posts() ) {
				$query->the_post();
				ob_start();
				if ( hamista_core_theme_active() && locate_template( 'template-parts/content/card.php' ) ) {
					get_template_part( 'template-parts/content/card', null, array( 'excerpt' => 'yes' === $s['excerpt'] ) );
				} else {
					self::fallback_card( array( 'excerpt' => 'yes' === $s['excerpt'] ) );
				}
				$cards[] = ob_get_clean();
			}
			wp_reset_postdata();
			echo '<div class="hm-posts-carousel">' . $this->carousel_head( $s, '' ) . $this->carousel_wrap( $s, $cards, __( 'Posts', 'hamista-core' ) ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			return;
		}

		$list = 'list' === $s['layout'];
		echo '<div class="hm-posts' . ( $list ? ' hm-posts--list' : '' ) . '" data-hm-stagger="0.08">';
		$index = 0;
		while ( $query->have_posts() ) {
			$query->the_post();
			$card_args = array(
				'featured' => 'featured' === $s['layout'] && 0 === $index && 1 === $paged,
				'excerpt'  => 'yes' === $s['excerpt'],
			);
			echo '<div class="hm-posts__cell' . ( $card_args['featured'] ? ' is-featured' : '' ) . '" data-hm-reveal="up">';
			if ( hamista_core_theme_active() && locate_template( 'template-parts/content/card.php' ) ) {
				get_template_part( 'template-parts/content/card', null, $card_args );
			} else {
				self::fallback_card( $card_args );
			}
			echo '</div>';
			++$index;
		}
		echo '</div>';

		if ( 'yes' === $s['pagination'] && $query->max_num_pages > 1 ) {
			$links = paginate_links(
				array(
					'total'   => $query->max_num_pages,
					'current' => $paged,
					'format'  => '?paged=%#%',
				)
			);
			echo '<nav class="hm-pagination"><div class="nav-links">' . $links . '</div></nav>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		wp_reset_postdata();
	}

	/**
	 * Minimal card for themes other than Hamista.
	 *
	 * @param array $args Card arguments.
	 */
	private static function fallback_card( $args ) {
		echo '<article class="hm-card hm-post-card">';
		if ( has_post_thumbnail() ) {
			echo '<a class="hm-post-card__media" href="' . esc_url( get_permalink() ) . '">' . get_the_post_thumbnail( null, 'medium_large' ) . '</a>';
		}
		echo '<div class="hm-post-card__body"><div class="hm-post-card__meta"><time>' . esc_html( get_the_date() ) . '</time></div>';
		echo '<h3 class="hm-post-card__title"><a href="' . esc_url( get_permalink() ) . '">' . esc_html( get_the_title() ) . '</a></h3>';
		if ( $args['excerpt'] ) {
			echo '<p class="hm-post-card__excerpt">' . esc_html( wp_trim_words( get_the_excerpt(), 24 ) ) . '</p>';
		}
		echo '</div></article>';
	}
}
