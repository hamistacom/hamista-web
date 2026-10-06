<?php
/**
 * Templates builder: headers, footers and reusable blocks designed in Elementor
 * (free version is enough), with display rules.
 *
 * Header resolution: a template whose rule matches the current page type wins,
 * then the template chosen in Hamista → Header, then the theme's built-in header.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Layouts;

defined( 'ABSPATH' ) || exit;

/**
 * Layouts.
 */
class Layouts {

	const POST_TYPE = 'hm_layout';

	/**
	 * Hooks.
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_post_type' ) );
		add_filter( 'option_elementor_cpt_support', array( __CLASS__, 'elementor_support' ) );
		add_filter( 'default_option_elementor_cpt_support', array( __CLASS__, 'elementor_support' ) );
		add_filter( 'hamista/header/render', array( __CLASS__, 'render_header' ) );
		add_filter( 'hamista/footer/render', array( __CLASS__, 'render_footer' ) );
		add_shortcode( 'hamista_block', array( __CLASS__, 'shortcode' ) );
		add_action( 'template_redirect', array( __CLASS__, 'protect_single' ) );
		add_filter( 'single_template', array( __CLASS__, 'single_template' ) );

		if ( is_admin() ) {
			add_action( 'add_meta_boxes', array( __CLASS__, 'meta_box' ) );
			add_action( 'save_post_' . self::POST_TYPE, array( __CLASS__, 'save' ) );
			add_filter( 'manage_' . self::POST_TYPE . '_posts_columns', array( __CLASS__, 'columns' ) );
			add_action( 'manage_' . self::POST_TYPE . '_posts_custom_column', array( __CLASS__, 'column' ), 10, 2 );
		}
	}

	/**
	 * Post type.
	 */
	public static function register_post_type() {
		register_post_type(
			self::POST_TYPE,
			array(
				'labels'              => array(
					'name'          => __( 'Templates', 'hamista-core' ),
					'singular_name' => __( 'Template', 'hamista-core' ),
					'add_new'       => __( 'Add template', 'hamista-core' ),
					'add_new_item'  => __( 'Add template', 'hamista-core' ),
					'edit_item'     => __( 'Edit template', 'hamista-core' ),
					'menu_name'     => __( 'Templates', 'hamista-core' ),
					'not_found'     => __( 'No templates yet. Create a header, footer or block and design it with Elementor.', 'hamista-core' ),
				),
				'public'              => true,
				'exclude_from_search' => true,
				'show_in_nav_menus'   => false,
				'show_in_admin_bar'   => false,
				'show_in_menu'        => false,
				'show_in_rest'        => true,
				'has_archive'         => false,
				'rewrite'             => false,
				'supports'            => array( 'title', 'elementor' ),
				'capability_type'     => 'page',
			)
		);
	}

	/**
	 * Enable Elementor for the post type.
	 *
	 * @param mixed $types Post types.
	 * @return array
	 */
	public static function elementor_support( $types ) {
		$types   = is_array( $types ) ? $types : array( 'page', 'post' );
		$types[] = self::POST_TYPE;
		return array_values( array_unique( $types ) );
	}

	/**
	 * Only editors may view a template on its own (the Elementor editor needs it).
	 */
	public static function protect_single() {
		if ( is_singular( self::POST_TYPE ) && ! current_user_can( 'edit_posts' ) ) {
			global $wp_query;
			$wp_query->set_404();
			status_header( 404 );
		}
	}

	/**
	 * Edit templates on a blank canvas.
	 *
	 * @param string $template Template file.
	 * @return string
	 */
	public static function single_template( $template ) {
		if ( is_singular( self::POST_TYPE ) && defined( 'ELEMENTOR_PATH' ) ) {
			$canvas = ELEMENTOR_PATH . 'modules/page-templates/templates/canvas.php';
			if ( file_exists( $canvas ) ) {
				return $canvas;
			}
		}
		return $template;
	}

	/**
	 * Types.
	 *
	 * @return array
	 */
	public static function types() {
		return array(
			'header' => __( 'Header', 'hamista-core' ),
			'footer' => __( 'Footer', 'hamista-core' ),
			'block'  => __( 'Block (use anywhere)', 'hamista-core' ),
		);
	}

	/**
	 * Display rules.
	 *
	 * @return array
	 */
	public static function rules() {
		return array(
			''         => __( 'Only where chosen in Hamista settings', 'hamista-core' ),
			'site'     => __( 'Entire site', 'hamista-core' ),
			'front'    => __( 'Front page', 'hamista-core' ),
			'pages'    => __( 'All pages', 'hamista-core' ),
			'posts'    => __( 'Blog posts', 'hamista-core' ),
			'archives' => __( 'Blog and archives', 'hamista-core' ),
			'shop'     => __( 'Shop (WooCommerce)', 'hamista-core' ),
		);
	}

	/**
	 * Template ID for a type on the current request.
	 *
	 * @param string $type header|footer.
	 * @return int
	 */
	public static function resolve( $type ) {
		static $cache = array();
		if ( isset( $cache[ $type ] ) ) {
			return $cache[ $type ];
		}

		$contexts = array();
		if ( is_front_page() ) {
			$contexts[] = 'front';
		}
		if ( function_exists( 'is_woocommerce' ) && ( is_woocommerce() || is_cart() || is_checkout() || is_account_page() ) ) {
			$contexts[] = 'shop';
		}
		if ( is_page() ) {
			$contexts[] = 'pages';
		}
		if ( is_singular( 'post' ) ) {
			$contexts[] = 'posts';
		}
		if ( is_home() || is_archive() || is_search() ) {
			$contexts[] = 'archives';
		}

		$ids = get_posts(
			array(
				'post_type'      => self::POST_TYPE,
				'posts_per_page' => 50,
				'fields'         => 'ids',
				'no_found_rows'  => true,
				'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					array(
						'key'   => '_hm_layout_type',
						'value' => $type,
					),
				),
			)
		);

		$site = 0;
		foreach ( $ids as $id ) {
			$rule = get_post_meta( $id, '_hm_layout_rule', true );
			if ( $rule && in_array( $rule, $contexts, true ) ) {
				$cache[ $type ] = (int) $id;
				return $cache[ $type ];
			}
			if ( 'site' === $rule && ! $site ) {
				$site = (int) $id;
			}
		}

		$chosen = (int) hamista_core_option( $type . '_template' );
		if ( $chosen && 'publish' === get_post_status( $chosen ) ) {
			$cache[ $type ] = $chosen;
		} else {
			$cache[ $type ] = $site;
		}
		return $cache[ $type ];
	}

	/**
	 * Elementor markup for a template.
	 *
	 * @param int $id Template ID.
	 * @return string
	 */
	public static function content( $id ) {
		if ( ! $id || ! class_exists( '\Elementor\Plugin' ) ) {
			return '';
		}
		return \Elementor\Plugin::instance()->frontend->get_builder_content_for_display( $id, true );
	}

	/**
	 * Replace the theme header.
	 *
	 * @param bool $rendered Already rendered.
	 * @return bool
	 */
	public static function render_header( $rendered ) {
		$id = self::resolve( 'header' );
		if ( $rendered || ! $id ) {
			return $rendered;
		}
		$sticky = get_post_meta( $id, '_hm_layout_sticky', true );
		$class  = 'hm-header hm-header--custom' . ( $sticky ? ' is-sticky' : '' );
		echo '<header id="masthead" class="' . esc_attr( $class ) . '" data-hide-on-scroll="' . ( 'hide' === $sticky ? '1' : '0' ) . '">' . self::content( $id ) . '</header>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Elementor output.
		return true;
	}

	/**
	 * Replace the theme footer.
	 *
	 * @param bool $rendered Already rendered.
	 * @return bool
	 */
	public static function render_footer( $rendered ) {
		$id = self::resolve( 'footer' );
		if ( $rendered || ! $id ) {
			return $rendered;
		}
		echo '<footer id="colophon" class="hm-footer--custom">' . self::content( $id ) . '</footer>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Elementor output.
		return true;
	}

	/**
	 * [hamista_block id="123"]
	 *
	 * @param array $atts Attributes.
	 * @return string
	 */
	public static function shortcode( $atts ) {
		$atts = shortcode_atts( array( 'id' => 0 ), $atts, 'hamista_block' );
		$id   = absint( $atts['id'] );
		if ( ! $id || self::POST_TYPE !== get_post_type( $id ) || 'publish' !== get_post_status( $id ) ) {
			return '';
		}
		return self::content( $id );
	}

	/**
	 * Settings meta box.
	 */
	public static function meta_box() {
		add_meta_box( 'hm-layout', __( 'Template settings', 'hamista-core' ), array( __CLASS__, 'render_box' ), self::POST_TYPE, 'side', 'high' );
	}

	/**
	 * Meta box markup.
	 *
	 * @param \WP_Post $post Post.
	 */
	public static function render_box( $post ) {
		wp_nonce_field( 'hm_layout', 'hm_layout_nonce' );
		$type   = get_post_meta( $post->ID, '_hm_layout_type', true );
		$rule   = get_post_meta( $post->ID, '_hm_layout_rule', true );
		$sticky = get_post_meta( $post->ID, '_hm_layout_sticky', true );
		if ( ! $type && isset( $_GET['hm_type'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$type = sanitize_key( $_GET['hm_type'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		}
		echo '<p><label style="font-weight:600;display:block;margin-bottom:4px" for="hm_layout_type">' . esc_html__( 'Type', 'hamista-core' ) . '</label><select style="width:100%" id="hm_layout_type" name="hm_layout_type">';
		foreach ( self::types() as $value => $label ) {
			printf( '<option value="%s"%s>%s</option>', esc_attr( $value ), selected( $type, $value, false ), esc_html( $label ) );
		}
		echo '</select></p>';
		echo '<p><label style="font-weight:600;display:block;margin-bottom:4px" for="hm_layout_rule">' . esc_html__( 'Show on', 'hamista-core' ) . '</label><select style="width:100%" id="hm_layout_rule" name="hm_layout_rule">';
		foreach ( self::rules() as $value => $label ) {
			printf( '<option value="%s"%s>%s</option>', esc_attr( $value ), selected( $rule, $value, false ), esc_html( $label ) );
		}
		echo '</select></p>';
		echo '<p><label style="font-weight:600;display:block;margin-bottom:4px" for="hm_layout_sticky">' . esc_html__( 'Header behaviour', 'hamista-core' ) . '</label><select style="width:100%" id="hm_layout_sticky" name="hm_layout_sticky">';
		foreach (
			array(
				''       => __( 'Scrolls away', 'hamista-core' ),
				'sticky' => __( 'Sticky', 'hamista-core' ),
				'hide'   => __( 'Sticky, hides while scrolling down', 'hamista-core' ),
			) as $value => $label
		) {
			printf( '<option value="%s"%s>%s</option>', esc_attr( $value ), selected( $sticky, $value, false ), esc_html( $label ) );
		}
		echo '</select></p>';
		if ( 'block' === $type && $post->ID ) {
			echo '<p>' . esc_html__( 'Shortcode:', 'hamista-core' ) . ' <code>[hamista_block id="' . (int) $post->ID . '"]</code></p>';
		}
	}

	/**
	 * Save the meta box.
	 *
	 * @param int $post_id Post ID.
	 */
	public static function save( $post_id ) {
		if ( ! isset( $_POST['hm_layout_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['hm_layout_nonce'] ), 'hm_layout' ) || ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}
		$type   = isset( $_POST['hm_layout_type'] ) ? sanitize_key( $_POST['hm_layout_type'] ) : 'block';
		$rule   = isset( $_POST['hm_layout_rule'] ) ? sanitize_key( $_POST['hm_layout_rule'] ) : '';
		$sticky = isset( $_POST['hm_layout_sticky'] ) ? sanitize_key( $_POST['hm_layout_sticky'] ) : '';
		update_post_meta( $post_id, '_hm_layout_type', array_key_exists( $type, self::types() ) ? $type : 'block' );
		update_post_meta( $post_id, '_hm_layout_rule', array_key_exists( $rule, self::rules() ) ? $rule : '' );
		update_post_meta( $post_id, '_hm_layout_sticky', in_array( $sticky, array( 'sticky', 'hide' ), true ) ? $sticky : '' );
		if ( ! get_post_meta( $post_id, '_wp_page_template', true ) ) {
			update_post_meta( $post_id, '_wp_page_template', 'elementor_canvas' );
		}
	}

	/**
	 * List columns.
	 *
	 * @param array $columns Columns.
	 * @return array
	 */
	public static function columns( $columns ) {
		$date = $columns['date'];
		unset( $columns['date'] );
		$columns['hm_type'] = __( 'Type', 'hamista-core' );
		$columns['hm_rule'] = __( 'Shows on', 'hamista-core' );
		$columns['date']    = $date;
		return $columns;
	}

	/**
	 * Column values.
	 *
	 * @param string $column  Column.
	 * @param int    $post_id Post ID.
	 */
	public static function column( $column, $post_id ) {
		if ( 'hm_type' === $column ) {
			$types = self::types();
			$type  = get_post_meta( $post_id, '_hm_layout_type', true );
			echo esc_html( $types[ $type ] ?? '—' );
		}
		if ( 'hm_rule' === $column ) {
			$rules = self::rules();
			$rule  = get_post_meta( $post_id, '_hm_layout_rule', true );
			echo esc_html( $rules[ $rule ] ?? '—' );
		}
	}
}
