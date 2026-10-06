<?php
/**
 * Per-page layout options (header style, title, header/footer visibility).
 *
 * Stored as post meta so they work in the block editor, the classic editor and
 * Elementor (Hamista Core mirrors them into Elementor's page settings panel).
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

/**
 * Option definitions: meta key => [ label, choices|null ].
 *
 * @return array
 */
function hamista_page_option_fields() {
	return array(
		'_hm_header'       => array(
			'label'   => __( 'Header', 'hamista' ),
			'choices' => array(
				''                  => __( 'Default', 'hamista' ),
				'transparent'       => __( 'Transparent over content', 'hamista' ),
				'transparent-light' => __( 'Transparent, light text (dark hero)', 'hamista' ),
				'hidden'            => __( 'Hidden', 'hamista' ),
			),
		),
		'_hm_title'        => array(
			'label'   => __( 'Page title', 'hamista' ),
			'choices' => array(
				''     => __( 'Default', 'hamista' ),
				'show' => __( 'Show', 'hamista' ),
				'hide' => __( 'Hide', 'hamista' ),
			),
		),
		'_hm_footer'       => array(
			'label'   => __( 'Footer', 'hamista' ),
			'choices' => array(
				''       => __( 'Default', 'hamista' ),
				'hidden' => __( 'Hidden', 'hamista' ),
			),
		),
		'_hm_color_scheme' => array(
			'label'   => __( 'Force colour scheme', 'hamista' ),
			'choices' => array(
				''      => __( 'Visitor choice', 'hamista' ),
				'light' => __( 'Always light', 'hamista' ),
				'dark'  => __( 'Always dark', 'hamista' ),
			),
		),
	);
}

/**
 * Register the meta so it is available in REST (block editor) and sanitised.
 */
function hamista_register_page_meta() {
	foreach ( array_keys( hamista_page_option_fields() ) as $key ) {
		foreach ( array( 'page', 'post' ) as $post_type ) {
			register_post_meta(
				$post_type,
				$key,
				array(
					'type'              => 'string',
					'single'            => true,
					'show_in_rest'      => true,
					'sanitize_callback' => 'sanitize_key',
					'auth_callback'     => static function () {
						return current_user_can( 'edit_posts' );
					},
				)
			);
		}
	}
}
add_action( 'init', 'hamista_register_page_meta' );

/**
 * Read a page option for the current (or given) post. Elementor page settings win.
 *
 * @param string   $key     Meta key, e.g. `_hm_header`.
 * @param int|null $post_id Post ID.
 * @return string
 */
function hamista_page_option( $key, $post_id = null ) {
	if ( ! $post_id ) {
		if ( ! is_singular() ) {
			return '';
		}
		$post_id = get_queried_object_id();
	}

	$elementor = get_post_meta( $post_id, '_elementor_page_settings', true );
	$el_key    = ltrim( $key, '_' );
	if ( is_array( $elementor ) && ! empty( $elementor[ $el_key ] ) ) {
		return (string) $elementor[ $el_key ];
	}

	return (string) get_post_meta( $post_id, $key, true );
}

/**
 * Meta box for the classic and block editors.
 */
function hamista_add_page_options_box() {
	add_meta_box( 'hamista-page-options', __( 'Hamista layout', 'hamista' ), 'hamista_render_page_options_box', array( 'page', 'post' ), 'side', 'default' );
}
add_action( 'add_meta_boxes', 'hamista_add_page_options_box' );

/**
 * Meta box markup.
 *
 * @param WP_Post $post Post.
 */
function hamista_render_page_options_box( $post ) {
	wp_nonce_field( 'hamista_page_options', 'hamista_page_options_nonce' );
	foreach ( hamista_page_option_fields() as $key => $field ) {
		$value = get_post_meta( $post->ID, $key, true );
		echo '<p><label for="' . esc_attr( $key ) . '" style="display:block;font-weight:600;margin-bottom:4px">' . esc_html( $field['label'] ) . '</label>';
		echo '<select id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" style="width:100%">';
		foreach ( $field['choices'] as $choice => $label ) {
			printf( '<option value="%s"%s>%s</option>', esc_attr( $choice ), selected( $value, $choice, false ), esc_html( $label ) );
		}
		echo '</select></p>';
	}
}

/**
 * Save the meta box.
 *
 * @param int $post_id Post ID.
 */
function hamista_save_page_options( $post_id ) {
	if ( ! isset( $_POST['hamista_page_options_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['hamista_page_options_nonce'] ), 'hamista_page_options' ) ) {
		return;
	}
	if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	foreach ( hamista_page_option_fields() as $key => $field ) {
		$value = isset( $_POST[ $key ] ) ? sanitize_key( wp_unslash( $_POST[ $key ] ) ) : '';
		if ( '' === $value || ! array_key_exists( $value, $field['choices'] ) ) {
			delete_post_meta( $post_id, $key );
		} else {
			update_post_meta( $post_id, $key, $value );
		}
	}
}
add_action( 'save_post', 'hamista_save_page_options' );

/**
 * Pages built with Elementor hide the theme title unless asked otherwise.
 *
 * @return bool
 */
function hamista_show_page_title() {
	$choice = hamista_page_option( '_hm_title' );
	if ( 'show' === $choice ) {
		return true;
	}
	if ( 'hide' === $choice || hamista_is_built_with_elementor() || is_front_page() ) {
		return false;
	}
	return true;
}

/**
 * Header state for the current view.
 *
 * @return array [ 'hidden' => bool, 'transparent' => bool, 'light' => bool ]
 */
function hamista_header_state() {
	$choice = hamista_page_option( '_hm_header' );
	return array(
		'hidden'      => 'hidden' === $choice,
		'transparent' => 0 === strpos( $choice, 'transparent' ),
		'light'       => 'transparent-light' === $choice,
	);
}

/**
 * Per-page forced colour scheme overrides the visitor's choice.
 */
function hamista_forced_color_scheme() {
	$forced = is_singular() ? hamista_page_option( '_hm_color_scheme' ) : '';
	if ( in_array( $forced, array( 'light', 'dark' ), true ) ) {
		echo '<script>document.documentElement.setAttribute("data-hm-theme",' . wp_json_encode( $forced ) . ');document.documentElement.setAttribute("data-hm-forced","1");</script>' . "\n";
	}
}
add_action( 'wp_head', 'hamista_forced_color_scheme', 1 );
