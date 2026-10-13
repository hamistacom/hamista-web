<?php
/**
 * Project showcase from the portfolio (or hand-picked items), three looks:
 *  - stack:   wide cards, picture beside a dark panel (title, year, category,
 *             button); each card stays put while the next one slides over it;
 *  - grid:    two columns of large pictures with the title and a link;
 *  - gallery: an uneven gallery of pictures in thin frames, title, tags and
 *             a round arrow.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;
use Hamista\Core\Portfolio\Portfolio;

defined( 'ABSPATH' ) || exit;

/**
 * Project showcase widget.
 */
class Project_Show extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-project-show';
	}

	/** @return string */
	public function get_title() {
		return __( 'Project Showcase', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-gallery-justified';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'projects', 'portfolio', 'works', 'case study', 'gallery', 'stack' );
	}

	/** @return array */
	public function get_script_depends() {
		return array( 'hamista-motion', 'hamista-agency' );
	}

	/** @return array */
	public function get_style_depends() {
		return array( 'hamista-widgets', 'hamista-agency' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$manual = array( 'source' => 'manual' );
		$this->start_controls_section( 'section_projects', array( 'label' => __( 'Projects', 'hamista-core' ) ) );
		$this->add_control(
			'source',
			array(
				'label'   => __( 'Projects from', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'portfolio',
				'options' => array(
					'portfolio' => __( 'The portfolio (latest projects)', 'hamista-core' ),
					'manual'    => __( 'Written here', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'count',
			array(
				'label'     => __( 'How many', 'hamista-core' ),
				'type'      => Controls_Manager::NUMBER,
				'min'       => 1,
				'max'       => 12,
				'default'   => 4,
				'condition' => array( 'source' => 'portfolio' ),
			)
		);
		$r = new Repeater();
		$r->add_control(
			'image',
			array(
				'label' => __( 'Picture', 'hamista-core' ),
				'type'  => Controls_Manager::MEDIA,
			)
		);
		$r->add_control(
			'title',
			array(
				'label'   => __( 'Title', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Social media growth campaign', 'hamista-core' ),
			)
		);
		$r->add_control(
			'category',
			array(
				'label'   => __( 'Category or tags', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Growth strategy', 'hamista-core' ),
			)
		);
		$r->add_control(
			'year',
			array(
				'label'   => __( 'Year', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => '1404',
			)
		);
		$r->add_control(
			'link',
			array(
				'label' => __( 'Link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$this->add_control(
			'items',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $r->get_controls(),
				'title_field' => '{{{ title }}}',
				'default'     => array( array(), array(), array() ),
				'condition'   => $manual,
			)
		);
		$this->add_control(
			'look',
			array(
				'label'   => __( 'Look', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'stack',
				'options' => array(
					'stack'   => __( 'Cards that stack while scrolling', 'hamista-core' ),
					'grid'    => __( 'Two-column grid', 'hamista-core' ),
					'gallery' => __( 'Uneven gallery', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'btn_text',
			array(
				'label'   => __( 'Link text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'View project', 'hamista-core' ),
			)
		);
		$this->add_control(
			'year_label',
			array(
				'label'     => __( 'Year label', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Year:', 'hamista-core' ),
				'condition' => array( 'look' => 'stack' ),
			)
		);
		$this->add_control(
			'cat_label',
			array(
				'label'     => __( 'Category label', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Category:', 'hamista-core' ),
				'condition' => array( 'look' => 'stack' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Projects as plain arrays.
	 *
	 * @param array $s Settings.
	 * @return array
	 */
	private function projects( $s ) {
		if ( 'manual' === $s['source'] ) {
			$out = array();
			foreach ( (array) $s['items'] as $item ) {
				$out[] = array(
					'image'    => $item['image'],
					'title'    => $item['title'],
					'category' => $item['category'],
					'year'     => $item['year'],
					'url'      => ! empty( $item['link']['url'] ) ? $item['link']['url'] : '',
				);
			}
			return $out;
		}
		$posts = get_posts(
			array(
				'post_type'      => class_exists( Portfolio::class ) ? Portfolio::TYPE : 'hm_portfolio',
				'posts_per_page' => max( 1, (int) $s['count'] ),
				'no_found_rows'  => true,
			)
		);
		$out   = array();
		foreach ( $posts as $post ) {
			$terms = get_the_terms( $post, class_exists( Portfolio::class ) ? Portfolio::TAXONOMY : 'hm_portfolio_cat' );
			$out[] = array(
				'image'    => (int) get_post_thumbnail_id( $post ),
				'title'    => get_the_title( $post ),
				'category' => $terms && ! is_wp_error( $terms ) ? implode( '، ', wp_list_pluck( $terms, 'name' ) ) : '',
				'year'     => (string) get_post_meta( $post->ID, '_hm_year', true ),
				'url'      => get_permalink( $post ),
			);
		}
		return $out;
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s        = $this->get_settings_for_display();
		$look     = in_array( $s['look'], array( 'stack', 'grid', 'gallery' ), true ) ? $s['look'] : 'stack';
		$projects = $this->projects( $s );
		if ( ! $projects ) {
			return;
		}
		echo '<div class="hm-ps hm-ps--' . esc_attr( $look ) . '" data-hm-widget="project-show"' . ( 'stack' === $look ? '' : ' data-hm-stagger="0.1"' ) . '>';
		foreach ( $projects as $i => $p ) {
			$img  = hamista_core_image( $p['image'], 'large', array( 'class' => 'hm-ps__img' ) );
			$link = array( 'url' => $p['url'] );
			if ( 'stack' === $look ) {
				printf( '<article class="hm-ps__card" style="--i:%d">', (int) $i );
				echo '<div class="hm-ps__media">' . $img . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				echo '<div class="hm-ps__panel"><h3 class="hm-ps__title">' . esc_html( $p['title'] ) . '</h3><dl class="hm-ps__meta">';
				if ( $p['year'] ) {
					echo '<div><dt>' . esc_html( $s['year_label'] ) . '</dt><dd class="hm-num">' . esc_html( hamista_core_digits( $p['year'] ) ) . '</dd></div>';
				}
				if ( $p['category'] ) {
					echo '<div><dt>' . esc_html( $s['cat_label'] ) . '</dt><dd>' . esc_html( $p['category'] ) . '</dd></div>';
				}
				echo '</dl>';
				if ( $p['url'] && $s['btn_text'] ) {
					echo self::button_html( $s['btn_text'], $link, 'inverse', array( 'size' => 'sm' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				echo '</div></article>';
			} elseif ( 'grid' === $look ) {
				echo '<article class="hm-ps__tile" data-hm-reveal="up"><a class="hm-ps__frame" href="' . esc_url( $p['url'] ? $p['url'] : '#' ) . '">' . $img . '</a>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				echo '<div class="hm-ps__row"><div><h3 class="hm-ps__title">' . esc_html( $p['title'] ) . '</h3><small>' . esc_html( $p['category'] ) . '</small></div>';
				if ( $p['url'] && $s['btn_text'] ) {
					echo '<a class="hm-ps__view" href="' . esc_url( $p['url'] ) . '">' . hamista_core_icon( 'arrow-out' ) . esc_html( $s['btn_text'] ) . '</a>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				echo '</div></article>';
			} else {
				printf( '<article class="hm-ps__piece hm-ps__piece--%d" data-hm-reveal="up">', (int) ( $i % 5 ) );
				echo '<a class="hm-ps__frame" href="' . esc_url( $p['url'] ? $p['url'] : '#' ) . '">' . $img . '</a>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				echo '<div class="hm-ps__row"><div><h3 class="hm-ps__title">' . esc_html( $p['title'] ) . '</h3>';
				$tags = array_filter( array_map( 'trim', preg_split( '/[,،]/u', (string) $p['category'] ) ) );
				if ( $tags ) {
					echo '<ul class="hm-sl__tags">';
					foreach ( $tags as $tag ) {
						echo '<li>' . esc_html( $tag ) . '</li>';
					}
					echo '</ul>';
				}
				echo '</div>';
				if ( $p['url'] ) {
					echo '<a class="hm-ps__circle" href="' . esc_url( $p['url'] ) . '" aria-label="' . esc_attr( $p['title'] ) . '">' . hamista_core_icon( 'chevron-l' ) . '</a>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				echo '</div></article>';
			}
		}
		echo '</div>';
	}
}
