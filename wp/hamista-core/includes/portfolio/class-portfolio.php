<?php
/**
 * Portfolio: a "project" post type with categories and project details
 * (client, year, services, link), used by the Portfolio widget and the
 * theme's portfolio archive and single templates.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Portfolio;

defined( 'ABSPATH' ) || exit;

/**
 * Portfolio.
 */
class Portfolio {

	const TYPE     = 'hm_portfolio';
	const TAXONOMY = 'hm_portfolio_cat';
	const REWRITE  = '1';

	/**
	 * Details stored as post meta: key => label.
	 *
	 * @return array
	 */
	public static function fields() {
		return array(
			'client'   => __( 'Client', 'hamista-core' ),
			'year'     => __( 'Year', 'hamista-core' ),
			'services' => __( 'Services', 'hamista-core' ),
			'url'      => __( 'Live link', 'hamista-core' ),
		);
	}

	/**
	 * Hooks.
	 */
	public static function init() {
		if ( ! apply_filters( 'hamista_core/portfolio_enabled', (bool) hamista_core_option( 'portfolio_enabled', true ) ) ) {
			return;
		}
		add_action( 'init', array( __CLASS__, 'register_post_type' ) );
		add_action( 'init', array( __CLASS__, 'maybe_flush' ), 99 );
		add_action( 'add_meta_boxes', array( __CLASS__, 'meta_box' ) );
		add_action( 'save_post_' . self::TYPE, array( __CLASS__, 'save' ), 10, 2 );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'assets' ), 20 );
	}

	/**
	 * Post type and taxonomy.
	 */
	public static function register_post_type() {
		register_post_type(
			self::TYPE,
			array(
				'labels'        => array(
					'name'               => __( 'Portfolio', 'hamista-core' ),
					'singular_name'      => __( 'Project', 'hamista-core' ),
					'add_new'            => __( 'Add project', 'hamista-core' ),
					'add_new_item'       => __( 'Add new project', 'hamista-core' ),
					'edit_item'          => __( 'Edit project', 'hamista-core' ),
					'new_item'           => __( 'New project', 'hamista-core' ),
					'view_item'          => __( 'View project', 'hamista-core' ),
					'search_items'       => __( 'Search projects', 'hamista-core' ),
					'not_found'          => __( 'No projects found.', 'hamista-core' ),
					'not_found_in_trash' => __( 'No projects in the trash.', 'hamista-core' ),
					'all_items'          => __( 'All projects', 'hamista-core' ),
					'menu_name'          => __( 'Portfolio', 'hamista-core' ),
				),
				'public'        => true,
				'has_archive'   => true,
				'menu_icon'     => 'dashicons-portfolio',
				'menu_position' => 21,
				'show_in_rest'  => true,
				'supports'      => array( 'title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'elementor' ),
				'rewrite'       => array(
					'slug'       => apply_filters( 'hamista_core/portfolio_slug', 'portfolio' ),
					'with_front' => false,
				),
			)
		);
		register_taxonomy(
			self::TAXONOMY,
			self::TYPE,
			array(
				'labels'            => array(
					'name'          => __( 'Project categories', 'hamista-core' ),
					'singular_name' => __( 'Project category', 'hamista-core' ),
					'add_new_item'  => __( 'Add category', 'hamista-core' ),
					'all_items'     => __( 'All categories', 'hamista-core' ),
				),
				'hierarchical'      => true,
				'show_admin_column' => true,
				'show_in_rest'      => true,
				'rewrite'           => array(
					'slug'       => apply_filters( 'hamista_core/portfolio_cat_slug', 'portfolio-category' ),
					'with_front' => false,
				),
			)
		);
	}

	/**
	 * Card styles on portfolio pages rendered by the theme.
	 */
	public static function assets() {
		if ( is_post_type_archive( self::TYPE ) || is_tax( self::TAXONOMY ) ) {
			wp_enqueue_style( 'hamista-widgets' );
		}
	}

	/**
	 * Refresh permalinks once after this module first runs (or its URLs change).
	 */
	public static function maybe_flush() {
		if ( get_option( 'hamista_portfolio_rewrite' ) !== self::REWRITE ) {
			flush_rewrite_rules( false );
			update_option( 'hamista_portfolio_rewrite', self::REWRITE, true );
		}
	}

	/**
	 * Project details box.
	 */
	public static function meta_box() {
		add_meta_box( 'hm-project', __( 'Project details', 'hamista-core' ), array( __CLASS__, 'render_box' ), self::TYPE, 'side' );
	}

	/**
	 * Box markup.
	 *
	 * @param \WP_Post $post Post.
	 */
	public static function render_box( $post ) {
		wp_nonce_field( 'hm_project', 'hm_project_nonce' );
		foreach ( self::fields() as $key => $label ) {
			$value = get_post_meta( $post->ID, '_hm_' . $key, true );
			printf(
				'<p><label for="hm-%1$s" style="display:block;font-weight:600;margin-bottom:4px">%2$s</label><input type="%3$s" id="hm-%1$s" name="hm_project[%1$s]" value="%4$s" class="widefat"></p>',
				esc_attr( $key ),
				esc_html( $label ),
				'url' === $key ? 'url' : 'text',
				esc_attr( $value )
			);
		}
	}

	/**
	 * Save details.
	 *
	 * @param int      $post_id Post ID.
	 * @param \WP_Post $post    Post.
	 */
	public static function save( $post_id, $post ) {
		if ( ! isset( $_POST['hm_project_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['hm_project_nonce'] ), 'hm_project' ) || ! current_user_can( 'edit_post', $post_id ) || wp_is_post_revision( $post ) ) {
			return;
		}
		$input = isset( $_POST['hm_project'] ) ? (array) wp_unslash( $_POST['hm_project'] ) : array(); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitised per field below.
		foreach ( array_keys( self::fields() ) as $key ) {
			$value = isset( $input[ $key ] ) ? ( 'url' === $key ? esc_url_raw( $input[ $key ] ) : sanitize_text_field( $input[ $key ] ) ) : '';
			if ( '' === $value ) {
				delete_post_meta( $post_id, '_hm_' . $key );
			} else {
				update_post_meta( $post_id, '_hm_' . $key, $value );
			}
		}
	}

	/**
	 * Details of a project, for templates.
	 *
	 * @param int $post_id Post ID.
	 * @return array label => value (only filled ones; the link is returned under 'url').
	 */
	public static function details( $post_id ) {
		$out = array();
		foreach ( self::fields() as $key => $label ) {
			$value = (string) get_post_meta( $post_id, '_hm_' . $key, true );
			if ( '' !== $value ) {
				$out[ $key ] = array(
					'label' => $label,
					'value' => $value,
				);
			}
		}
		return $out;
	}

	/**
	 * Card markup shared by the widget and the archive.
	 *
	 * @param int    $post_id Post ID.
	 * @param string $style   overlay|caption|minimal.
	 * @return string
	 */
	public static function card( $post_id, $style = 'caption' ) {
		$terms = get_the_terms( $post_id, self::TAXONOMY );
		$slugs = array();
		$names = array();
		if ( $terms && ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term ) {
				$slugs[] = 'hm-pf-' . $term->term_id;
				$names[] = $term->name;
			}
		}
		$img  = get_the_post_thumbnail(
			$post_id,
			'large',
			array(
				'class'    => 'hm-pfcard__img',
				'loading'  => 'lazy',
				'decoding' => 'async',
				'alt'      => '',
				'sizes'    => '(max-width: 760px) 100vw, 40vw',
			)
		);
		$year = (string) get_post_meta( $post_id, '_hm_year', true );
		return '<article class="hm-pfcard hm-pfcard--' . esc_attr( $style ) . '" data-terms="' . esc_attr( implode( ' ', $slugs ) ) . '">'
			. '<a class="hm-pfcard__media" href="' . esc_url( get_permalink( $post_id ) ) . '">' . ( $img ? $img : '<span class="hm-pfcard__blank"></span>' ) . '</a>'
			. '<div class="hm-pfcard__body"><h3 class="hm-pfcard__title"><a href="' . esc_url( get_permalink( $post_id ) ) . '">' . esc_html( get_the_title( $post_id ) ) . '</a></h3>'
			. '<p class="hm-pfcard__meta">' . esc_html( implode( '، ', $names ) ) . ( $year ? '<span>' . esc_html( hamista_core_digits( $year ) ) . '</span>' : '' ) . '</p></div></article>';
	}
}
