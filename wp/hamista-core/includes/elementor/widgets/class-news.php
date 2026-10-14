<?php
/**
 * News: the latest posts set the way a newspaper sets its pages.
 *  - lead:    the top story; a large headline, the standfirst, the byline and
 *             the picture with its caption;
 *  - columns: stories side by side with thin rules between them, the first
 *             one wider and with its picture if you like;
 *  - list:    picture at the start, headline and summary beside it;
 *  - index:   a numbered list, for "most read";
 *  - ticker:  a running line of headlines under a label.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * News widget.
 */
class News extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-news';
	}

	/** @return string */
	public function get_title() {
		return __( 'News', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-post-list';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'news', 'newspaper', 'magazine', 'headline', 'ticker', 'most read', 'posts' );
	}

	/** @return array */
	public function get_style_depends() {
		return array( 'hamista-widgets', 'hamista-news' );
	}

	/** @return array */
	public function get_script_depends() {
		return array( 'hamista-motion' );
	}

	/**
	 * The stories change on their own.
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
		$this->start_controls_section( 'section_news', array( 'label' => __( 'Stories', 'hamista-core' ) ) );
		$this->add_control(
			'layout',
			array(
				'label'   => __( 'Set as', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'columns',
				'options' => array(
					'lead'    => __( 'Top story', 'hamista-core' ),
					'columns' => __( 'Columns with rules', 'hamista-core' ),
					'list'    => __( 'Picture beside the headline', 'hamista-core' ),
					'index'   => __( 'Numbered list', 'hamista-core' ),
					'ticker'  => __( 'Running headlines', 'hamista-core' ),
				),
			)
		);
		$cats = array();
		foreach ( get_categories( array( 'hide_empty' => false ) ) as $cat ) {
			$cats[ $cat->term_id ] = $cat->name;
		}
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
			'count',
			array(
				'label'     => __( 'Number of stories', 'hamista-core' ),
				'type'      => Controls_Manager::NUMBER,
				'default'   => 4,
				'min'       => 1,
				'max'       => 24,
				'condition' => array( 'layout!' => 'lead' ),
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
			'orderby',
			array(
				'label'   => __( 'Order', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'date',
				'options' => array(
					'date'          => __( 'Newest first', 'hamista-core' ),
					'comment_count' => __( 'Most discussed', 'hamista-core' ),
					'rand'          => __( 'Random', 'hamista-core' ),
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
				'selectors'      => array( '{{WRAPPER}} .hm-news' => '--hm-news-cols: {{VALUE}};' ),
				'condition'      => array( 'layout' => array( 'columns', 'index' ) ),
			)
		);
		$this->add_control(
			'first_wide',
			array(
				'label'        => __( 'First story wider, with its picture', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => array( 'layout' => 'columns' ),
			)
		);
		$this->add_control(
			'images',
			array(
				'label'        => __( 'Pictures', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => array( 'layout' => array( 'lead', 'columns', 'list' ) ),
			)
		);
		$this->add_control(
			'excerpt',
			array(
				'label'        => __( 'Summary', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => array( 'layout' => array( 'lead', 'columns', 'list' ) ),
			)
		);
		$this->add_control(
			'label',
			array(
				'label'       => __( 'Label', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => __( 'Latest news', 'hamista-core' ),
				'description' => __( 'The bar above the stories, or the tag at the start of the running line. Leave empty to hide it.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'more_text',
			array(
				'label'     => __( 'Link beside the label', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'condition' => array( 'layout!' => 'ticker' ),
			)
		);
		$this->add_control(
			'more_link',
			array(
				'label'     => __( 'Link', 'hamista-core' ),
				'type'      => Controls_Manager::URL,
				'condition' => array( 'layout!' => 'ticker' ),
			)
		);
		$this->add_control(
			'speed',
			array(
				'label'     => __( 'One pass takes (seconds)', 'hamista-core' ),
				'type'      => Controls_Manager::NUMBER,
				'default'   => 40,
				'min'       => 10,
				'max'       => 200,
				'condition' => array( 'layout' => 'ticker' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Stories for the current settings.
	 *
	 * @param array $s Settings.
	 * @return \WP_Post[]
	 */
	private function stories( $s ) {
		$args = array(
			'post_type'           => 'post',
			'post_status'         => 'publish',
			'posts_per_page'      => 'lead' === $s['layout'] ? 1 : max( 1, min( 24, (int) $s['count'] ) ),
			'offset'              => max( 0, (int) $s['offset'] ),
			'orderby'             => in_array( $s['orderby'], array( 'date', 'comment_count', 'rand' ), true ) ? $s['orderby'] : 'date',
			'ignore_sticky_posts' => true,
			'no_found_rows'       => true,
		);
		$cats = array_filter( array_map( 'intval', (array) $s['cats'] ) );
		if ( $cats ) {
			$args['category__in'] = $cats;
		}
		return get_posts( $args );
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s       = $this->get_settings_for_display();
		$layout  = in_array( $s['layout'], array( 'lead', 'columns', 'list', 'index', 'ticker' ), true ) ? $s['layout'] : 'columns';
		$stories = $this->stories( $s );
		if ( ! $stories ) {
			if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
				echo '<p class="hm-news__empty">' . esc_html__( 'No posts yet. Publish a few and they will appear here.', 'hamista-core' ) . '</p>';
			}
			return;
		}
		$pics = 'yes' === $s['images'];
		$sums = 'yes' === $s['excerpt'];

		if ( 'ticker' === $layout ) {
			$items = '';
			foreach ( $stories as $post ) {
				$items .= '<a class="hm-news__tick" href="' . esc_url( get_permalink( $post ) ) . '">' . esc_html( get_the_title( $post ) ) . '</a><i aria-hidden="true">✦</i>';
			}
			printf(
				'<div class="hm-news hm-news--ticker" style="--hm-news-speed:%1$ss">%2$s<div class="hm-news__run"><div class="hm-news__track">%3$s</div><div class="hm-news__track" aria-hidden="true">%4$s</div></div></div>',
				(int) max( 10, (int) $s['speed'] ),
				$s['label'] ? '<strong class="hm-news__tag">' . esc_html( $s['label'] ) . '</strong>' : '',
				$items, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above.
				str_replace( '<a ', '<a tabindex="-1" ', $items ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above.
			);
			return;
		}

		$cols = 'columns' === $layout ? ' hm-news--c' . (int) $s['columns'] . ' hm-news--t' . (int) ( $s['columns_tablet'] ?? 2 ) : '';
		echo '<div class="hm-news hm-news--' . esc_attr( $layout . $cols ) . ( 'columns' === $layout && 'yes' === $s['first_wide'] ? ' hm-news--wide-first' : '' ) . '">';
		if ( $s['label'] ) {
			echo '<div class="hm-news__bar"><h2 class="hm-news__label">' . esc_html( $s['label'] ) . '</h2>';
			if ( $s['more_text'] && ! empty( $s['more_link']['url'] ) ) {
				echo '<a class="hm-news__more" href="' . esc_url( $s['more_link']['url'] ) . '">' . esc_html( $s['more_text'] ) . hamista_core_icon( 'arrow' ) . '</a>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</div>';
		}

		if ( 'lead' === $layout ) {
			$post = $stories[0];
			echo '<article class="hm-news__lead">';
			echo '<p class="hm-news__kicker" data-hm-reveal="up">' . esc_html( self::category( $post ) ) . '</p>';
			echo '<h2 class="hm-news__headline" data-hm-reveal="words"><a href="' . esc_url( get_permalink( $post ) ) . '">' . esc_html( get_the_title( $post ) ) . '</a></h2>';
			if ( $sums && has_excerpt( $post ) ) {
				echo '<p class="hm-news__deck" data-hm-reveal="up" data-hm-delay=".15">' . esc_html( get_the_excerpt( $post ) ) . '</p>';
			}
			echo self::byline( $post ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			if ( $pics && has_post_thumbnail( $post ) ) {
				$caption = get_post_meta( $post->ID, '_hm_caption', true );
				$caption = $caption ? $caption : wp_get_attachment_caption( get_post_thumbnail_id( $post ) );
				echo '<figure class="hm-news__figure" data-hm-reveal="clip-up"><a href="' . esc_url( get_permalink( $post ) ) . '" tabindex="-1">' . get_the_post_thumbnail(
					$post,
					'large',
					array(
						'loading'       => 'eager',
						'fetchpriority' => 'high',
						'sizes'         => '(max-width: 900px) 100vw, 760px',
					)
				) . '</a>' . ( $caption ? '<figcaption>' . esc_html( $caption ) . '</figcaption>' : '' ) . '</figure>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</article></div>';
			return;
		}

		echo '<ol class="hm-news__list" data-hm-stagger="0.07">';
		foreach ( $stories as $i => $post ) {
			$link  = esc_url( get_permalink( $post ) );
			$wide  = 'columns' === $layout && 0 === $i && 'yes' === $s['first_wide'];
			$image = '';
			if ( 'index' !== $layout && $pics && has_post_thumbnail( $post ) && ( 'list' === $layout || $wide || 'yes' !== $s['first_wide'] ) ) {
				$image = '<a class="hm-news__pic" href="' . $link . '" tabindex="-1" aria-hidden="true">' . get_the_post_thumbnail( $post, $wide ? 'large' : 'medium_large', array( 'sizes' => $wide ? '(max-width: 900px) 100vw, 640px' : '(max-width: 900px) 100vw, 360px' ) ) . '</a>';
			}
			echo '<li class="hm-news__item' . ( $wide ? ' is-wide' : '' ) . '" data-hm-reveal="up">';
			if ( 'index' === $layout ) {
				echo '<span class="hm-news__num" aria-hidden="true">' . esc_html( hamista_core_digits( (string) ( $i + 1 ) ) ) . '</span>';
			}
			echo $image; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- markup from WordPress.
			echo '<div class="hm-news__text"><p class="hm-news__kicker">' . esc_html( self::category( $post ) ) . '</p>';
			echo '<h3 class="hm-news__title"><a href="' . $link . '">' . esc_html( get_the_title( $post ) ) . '</a></h3>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above.
			if ( 'index' !== $layout && $sums ) {
				echo '<p class="hm-news__sum">' . esc_html( wp_trim_words( get_the_excerpt( $post ), $wide ? 38 : 22, '…' ) ) . '</p>';
			}
			echo '<p class="hm-news__date"><time datetime="' . esc_attr( get_the_date( 'c', $post ) ) . '">' . esc_html( get_the_date( '', $post ) ) . '</time></p>';
			echo '</div></li>';
		}
		echo '</ol></div>';
	}

	/**
	 * First category name.
	 *
	 * @param \WP_Post $post Post.
	 * @return string
	 */
	private static function category( $post ) {
		$cats = get_the_category( $post->ID );
		return $cats ? $cats[0]->name : '';
	}

	/**
	 * The byline written on the story, or its author's name.
	 *
	 * @param \WP_Post $post Post.
	 * @return string
	 */
	public static function author( $post ) {
		$byline = (string) get_post_meta( $post->ID, '_hm_byline', true );
		return '' !== $byline ? $byline : (string) get_the_author_meta( 'display_name', $post->post_author );
	}

	/**
	 * Author, date and reading time.
	 *
	 * @param \WP_Post $post Post.
	 * @return string
	 */
	private static function byline( $post ) {
		$words = count( preg_split( '/\s+/u', wp_strip_all_tags( $post->post_content ), -1, PREG_SPLIT_NO_EMPTY ) );
		$mins  = max( 1, (int) round( $words / 200 ) );
		return '<p class="hm-news__byline" data-hm-reveal="up" data-hm-delay=".25">'
			. '<span>' . hamista_core_icon( 'pen' ) . esc_html( self::author( $post ) ) . '</span>' // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			. '<span>' . hamista_core_icon( 'calendar' ) . '<time datetime="' . esc_attr( get_the_date( 'c', $post ) ) . '">' . esc_html( get_the_date( '', $post ) ) . '</time></span>' // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			/* translators: %s: minutes */
			. '<span>' . hamista_core_icon( 'clock' ) . esc_html( sprintf( __( '%s min read', 'hamista-core' ), hamista_core_digits( (string) $mins ) ) ) . '</span>' // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			. '</p>';
	}
}
