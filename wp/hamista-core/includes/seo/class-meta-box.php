<?php
/**
 * "Search results" box on posts, pages, products and projects, with a live
 * preview of how the page shows in Google; a description field on categories
 * and other public taxonomies.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Seo;

defined( 'ABSPATH' ) || exit;

/**
 * Meta box.
 */
class Meta_Box {

	/**
	 * Hooks.
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_meta' ), 20 );
		if ( ! is_admin() ) {
			return;
		}
		add_action( 'add_meta_boxes', array( __CLASS__, 'add' ) );
		add_action( 'save_post', array( __CLASS__, 'save' ) );
		add_action( 'admin_init', array( __CLASS__, 'term_fields' ) );
	}

	/**
	 * Post types that get the box.
	 *
	 * @return string[]
	 */
	public static function post_types() {
		$types = get_post_types( array( 'public' => true ), 'names' );
		unset( $types['attachment'], $types['elementor_library'], $types['e-landing-page'] );
		return array_values( $types );
	}

	/**
	 * Register the meta so the block editor and the REST API keep it.
	 */
	public static function register_meta() {
		foreach ( self::post_types() as $type ) {
			foreach ( array( Seo::META_TITLE, Seo::META_DESC, Seo::META_CANONICAL ) as $key ) {
				register_post_meta(
					$type,
					$key,
					array(
						'type'              => 'string',
						'single'            => true,
						'show_in_rest'      => true,
						'sanitize_callback' => Seo::META_CANONICAL === $key ? 'esc_url_raw' : 'sanitize_text_field',
						'auth_callback'     => static function () {
							return current_user_can( 'edit_posts' );
						},
					)
				);
			}
			register_post_meta(
				$type,
				Seo::META_NOINDEX,
				array(
					'type'          => 'boolean',
					'single'        => true,
					'show_in_rest'  => true,
					'auth_callback' => static function () {
						return current_user_can( 'edit_posts' );
					},
				)
			);
		}
	}

	/**
	 * Add the box.
	 */
	public static function add() {
		foreach ( self::post_types() as $type ) {
			add_meta_box( 'hm-seo', __( 'Search results (SEO)', 'hamista-core' ), array( __CLASS__, 'render' ), $type, 'normal', 'low' );
		}
	}

	/**
	 * Box markup.
	 *
	 * @param \WP_Post $post Post.
	 */
	public static function render( $post ) {
		wp_nonce_field( 'hm_seo_save', 'hm_seo_nonce' );
		$title     = (string) get_post_meta( $post->ID, Seo::META_TITLE, true );
		$desc      = (string) get_post_meta( $post->ID, Seo::META_DESC, true );
		$canonical = (string) get_post_meta( $post->ID, Seo::META_CANONICAL, true );
		$noindex   = (bool) get_post_meta( $post->ID, Seo::META_NOINDEX, true );
		$url       = get_permalink( $post );
		$shown     = '' !== $title ? $title : get_the_title( $post ) . ' ' . Seo::separator() . ' ' . get_bloginfo( 'name' );
		?>
		<div class="hm-seo" style="display:grid;gap:14px;max-width:760px">
			<div class="hm-seo__preview" aria-hidden="true" style="padding:14px 16px;border:1px solid #dcdcde;border-radius:10px;background:#fff;font-family:Arial,Tahoma,sans-serif">
				<div style="color:#202124;font-size:12px" dir="ltr"><?php echo esc_html( preg_replace( '#^https?://#', '', (string) $url ) ); ?></div>
				<div class="hm-seo__pt" style="color:#1a0dab;font-size:18px;line-height:1.4;margin:3px 0"><?php echo esc_html( $shown ); ?></div>
				<div class="hm-seo__pd" style="color:#4d5156;font-size:13px;line-height:1.6"><?php echo esc_html( '' !== $desc ? $desc : __( 'Without a description, search engines pick a sentence from the page.', 'hamista-core' ) ); ?></div>
			</div>
			<p style="margin:0">
				<label for="hm-seo-title"><strong><?php esc_html_e( 'Title in search results', 'hamista-core' ); ?></strong></label><br>
				<input type="text" class="widefat" id="hm-seo-title" name="hm_seo_title" value="<?php echo esc_attr( $title ); ?>" maxlength="120" placeholder="<?php echo esc_attr( $shown ); ?>">
				<span class="description"><?php esc_html_e( 'Unique per page, about 50–60 characters. Leave empty to use the page title and site name.', 'hamista-core' ); ?> <span class="hm-seo__count" data-for="hm-seo-title" data-max="60"></span></span>
			</p>
			<p style="margin:0">
				<label for="hm-seo-desc"><strong><?php esc_html_e( 'Meta description', 'hamista-core' ); ?></strong></label><br>
				<textarea class="widefat" id="hm-seo-desc" name="hm_seo_desc" rows="3" maxlength="320"><?php echo esc_textarea( $desc ); ?></textarea>
				<span class="description"><?php esc_html_e( 'One or two sentences, about 120–155 characters. Leave empty to use the excerpt or the start of the page.', 'hamista-core' ); ?> <span class="hm-seo__count" data-for="hm-seo-desc" data-max="155"></span></span>
			</p>
			<p style="margin:0">
				<label for="hm-seo-canonical"><strong><?php esc_html_e( 'Canonical address', 'hamista-core' ); ?></strong></label><br>
				<input type="url" class="widefat" id="hm-seo-canonical" name="hm_seo_canonical" value="<?php echo esc_attr( $canonical ); ?>" dir="ltr" placeholder="<?php echo esc_attr( (string) $url ); ?>">
				<span class="description"><?php esc_html_e( 'Only when this page copies another one; otherwise leave empty.', 'hamista-core' ); ?></span>
			</p>
			<p style="margin:0">
				<label><input type="checkbox" name="hm_seo_noindex" value="1" <?php checked( $noindex ); ?>> <?php esc_html_e( 'Hide this page from search engines (noindex) and from the sitemap', 'hamista-core' ); ?></label>
			</p>
		</div>
		<script>
		( function () {
			var box = document.querySelector( '.hm-seo' );
			if ( ! box ) { return; }
			var digits = function ( n ) { return String( n ).replace( /\d/g, function ( d ) { return '۰۱۲۳۴۵۶۷۸۹'[ d ]; } ); };
			function update() {
				box.querySelectorAll( '.hm-seo__count' ).forEach( function ( c ) {
					var f = document.getElementById( c.getAttribute( 'data-for' ) ), n = f.value.length, max = +c.getAttribute( 'data-max' );
					c.textContent = n ? '(' + digits( n ) + '/' + digits( max ) + ')' : '';
					c.style.color = n > max ? '#b32d2e' : '';
				} );
				var t = document.getElementById( 'hm-seo-title' ), d = document.getElementById( 'hm-seo-desc' );
				box.querySelector( '.hm-seo__pt' ).textContent = t.value || t.placeholder;
				if ( d.value ) { box.querySelector( '.hm-seo__pd' ).textContent = d.value; }
			}
			box.addEventListener( 'input', update );
			update();
		}() );
		</script>
		<?php
	}

	/**
	 * Save.
	 *
	 * @param int $post_id Post ID.
	 */
	public static function save( $post_id ) {
		if ( ! isset( $_POST['hm_seo_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['hm_seo_nonce'] ) ), 'hm_seo_save' ) ) {
			return;
		}
		if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || wp_is_post_revision( $post_id ) || ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}
		$fields = array(
			Seo::META_TITLE     => isset( $_POST['hm_seo_title'] ) ? sanitize_text_field( wp_unslash( $_POST['hm_seo_title'] ) ) : '',
			Seo::META_DESC      => isset( $_POST['hm_seo_desc'] ) ? sanitize_textarea_field( wp_unslash( $_POST['hm_seo_desc'] ) ) : '',
			Seo::META_CANONICAL => isset( $_POST['hm_seo_canonical'] ) ? esc_url_raw( wp_unslash( $_POST['hm_seo_canonical'] ) ) : '',
		);
		foreach ( $fields as $key => $value ) {
			if ( '' === $value ) {
				delete_post_meta( $post_id, $key );
			} else {
				update_post_meta( $post_id, $key, $value );
			}
		}
		if ( ! empty( $_POST['hm_seo_noindex'] ) ) {
			update_post_meta( $post_id, Seo::META_NOINDEX, 1 );
		} else {
			delete_post_meta( $post_id, Seo::META_NOINDEX );
		}
		delete_transient( 'hamista_llms_txt' );
	}

	/**
	 * Description field on public taxonomies.
	 */
	public static function term_fields() {
		foreach ( get_taxonomies( array( 'public' => true ), 'names' ) as $tax ) {
			if ( 'post_format' === $tax ) {
				continue;
			}
			add_action( $tax . '_edit_form_fields', array( __CLASS__, 'term_field' ), 20 );
			add_action( 'edited_' . $tax, array( __CLASS__, 'term_save' ) );
		}
	}

	/**
	 * Term field row.
	 *
	 * @param \WP_Term $term Term.
	 */
	public static function term_field( $term ) {
		wp_nonce_field( 'hm_seo_term', 'hm_seo_term_nonce' );
		?>
		<tr class="form-field">
			<th scope="row"><label for="hm-seo-term-desc"><?php esc_html_e( 'Meta description', 'hamista-core' ); ?></label></th>
			<td>
				<textarea id="hm-seo-term-desc" name="hm_seo_term_desc" rows="3" maxlength="320"><?php echo esc_textarea( (string) get_term_meta( $term->term_id, Seo::TERM_DESC, true ) ); ?></textarea>
				<p class="description"><?php esc_html_e( 'Shown under the title in search results. Leave empty to use the description above.', 'hamista-core' ); ?></p>
			</td>
		</tr>
		<?php
	}

	/**
	 * Save the term field.
	 *
	 * @param int $term_id Term ID.
	 */
	public static function term_save( $term_id ) {
		if ( ! isset( $_POST['hm_seo_term_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['hm_seo_term_nonce'] ) ), 'hm_seo_term' ) || ! current_user_can( 'edit_term', $term_id ) ) {
			return;
		}
		$desc = isset( $_POST['hm_seo_term_desc'] ) ? sanitize_textarea_field( wp_unslash( $_POST['hm_seo_term_desc'] ) ) : '';
		if ( '' === $desc ) {
			delete_term_meta( $term_id, Seo::TERM_DESC );
		} else {
			update_term_meta( $term_id, Seo::TERM_DESC, $desc );
		}
	}
}
