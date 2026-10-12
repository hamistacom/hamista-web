<?php
/**
 * Built-in SEO (Hamista → SEO).
 *
 * Titles, meta descriptions, canonical links, robots rules, Open Graph,
 * structured data, robots.txt, sitemap tuning, llms.txt, a fallback favicon
 * and alt text for images that have none. Everything that writes to <head>
 * stands down when a dedicated SEO plugin is active, so the two never print
 * the same tag twice.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Seo;

defined( 'ABSPATH' ) || exit;

/**
 * SEO.
 */
class Seo {

	/**
	 * Meta keys used on posts, pages, products and portfolio items.
	 */
	const META_TITLE     = '_hm_seo_title';
	const META_DESC      = '_hm_seo_desc';
	const META_NOINDEX   = '_hm_seo_noindex';
	const META_CANONICAL = '_hm_seo_canonical';

	/**
	 * Term meta key for a description written for search results.
	 */
	const TERM_DESC = '_hm_seo_desc';

	/**
	 * Hooks.
	 */
	public static function init() {
		// These help every site, with or without an SEO plugin.
		add_filter( 'wp_get_attachment_image_attributes', array( __CLASS__, 'image_alt' ), 20, 2 );
		add_action( 'wp_head', array( __CLASS__, 'favicon' ), 99 );
		add_action( 'init', array( __CLASS__, 'llms_rewrite' ) );
		add_action( 'template_redirect', array( __CLASS__, 'serve_text_files' ), 0 );
		add_filter( 'option_site_icon', array( __CLASS__, 'site_icon' ) );
		add_filter( 'default_option_site_icon', array( __CLASS__, 'site_icon' ) );
		add_action(
			'save_post',
			static function () {
				delete_transient( 'hamista_llms_txt' );
			}
		);

		if ( ! hamista_core_option( 'seo_enabled', true ) || self::plugin_active() ) {
			return;
		}

		add_filter( 'document_title_separator', array( __CLASS__, 'separator' ) );
		add_filter( 'pre_get_document_title', array( __CLASS__, 'custom_title' ), 20 );
		add_filter( 'document_title_parts', array( __CLASS__, 'title_parts' ), 20 );
		add_filter( 'wp_robots', array( __CLASS__, 'robots' ) );
		add_filter( 'robots_txt', array( __CLASS__, 'robots_txt' ), 20, 2 );
		remove_action( 'wp_head', 'rel_canonical' );
		add_action( 'wp_head', array( __CLASS__, 'head' ), 1 );
		add_action( 'wp_head', array( Schema::class, 'output' ), 30 );

		// Sitemap: hide what is set to noindex, add last-modified dates.
		add_filter( 'wp_sitemaps_posts_query_args', array( __CLASS__, 'sitemap_query' ) );
		add_filter( 'wp_sitemaps_posts_entry', array( __CLASS__, 'sitemap_entry' ), 10, 2 );
		add_filter( 'wp_sitemaps_add_provider', array( __CLASS__, 'sitemap_providers' ), 10, 2 );
		add_filter( 'wp_sitemaps_taxonomies', array( __CLASS__, 'sitemap_taxonomies' ) );
		add_filter( 'wp_sitemaps_post_types', array( __CLASS__, 'sitemap_post_types' ) );

		Meta_Box::init();
	}

	/**
	 * Whether a dedicated SEO plugin handles titles, meta and schema.
	 *
	 * @return bool
	 */
	public static function plugin_active() {
		$active = defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' ) || defined( 'AIOSEO_VERSION' )
			|| defined( 'SEOPRESS_VERSION' ) || defined( 'THE_SEO_FRAMEWORK_VERSION' ) || defined( 'SQ_VERSION' )
			|| class_exists( 'WPSEO_Options' ) || class_exists( 'All_in_One_SEO_Pack' );

		/**
		 * Whether another plugin owns the page's SEO tags.
		 *
		 * @param bool $active Detected state.
		 */
		return (bool) apply_filters( 'hamista_core/seo_plugin_active', $active );
	}

	/* ------------------------------------------------------------------ *
	 * Titles
	 * ------------------------------------------------------------------ */

	/**
	 * Title separator from the settings.
	 *
	 * @return string
	 */
	public static function separator() {
		$sep = (string) hamista_core_option( 'seo_separator', '|' );
		return '' !== $sep ? $sep : '|';
	}

	/**
	 * A title written for search results replaces the whole document title.
	 *
	 * @param string $title Title so far.
	 * @return string
	 */
	public static function custom_title( $title ) {
		$custom = '';
		if ( is_front_page() ) {
			$custom = (string) hamista_core_option( 'seo_home_title', '' );
		}
		if ( '' === $custom && is_singular() ) {
			$custom = (string) get_post_meta( get_queried_object_id(), self::META_TITLE, true );
		}
		if ( '' === $custom ) {
			return $title;
		}
		return wp_strip_all_tags( self::vars( $custom ) );
	}

	/**
	 * Unique titles: the page number on paged views, the site name last.
	 *
	 * @param array $parts Title parts.
	 * @return array
	 */
	public static function title_parts( $parts ) {
		if ( is_front_page() && ! empty( $parts['tagline'] ) && ! hamista_core_option( 'seo_home_tagline', true ) ) {
			unset( $parts['tagline'] );
		}
		if ( is_search() ) {
			/* translators: %s: search terms. */
			$parts['title'] = sprintf( __( 'Search results for “%s”', 'hamista-core' ), get_search_query( false ) );
		}
		return $parts;
	}

	/**
	 * Replace %%sitename%%, %%title%%, %%sep%% and %%tagline%% in a template.
	 *
	 * @param string $text Template.
	 * @return string
	 */
	private static function vars( $text ) {
		$title = is_singular() ? single_post_title( '', false ) : wp_strip_all_tags( (string) get_the_archive_title() );
		return strtr(
			$text,
			array(
				'%%sitename%%' => get_bloginfo( 'name' ),
				'%%tagline%%'  => get_bloginfo( 'description' ),
				'%%sep%%'      => self::separator(),
				'%%title%%'    => $title,
			)
		);
	}

	/* ------------------------------------------------------------------ *
	 * Description, canonical, Open Graph
	 * ------------------------------------------------------------------ */

	/**
	 * Description of the current view, trimmed for search results.
	 *
	 * @return string
	 */
	public static function description() {
		$text = '';
		if ( is_front_page() ) {
			$text = (string) hamista_core_option( 'seo_home_desc', '' );
			if ( '' === $text && is_page() ) {
				$text = (string) get_post_meta( get_queried_object_id(), self::META_DESC, true );
			}
			if ( '' === $text ) {
				$text = get_bloginfo( 'description' );
			}
		} elseif ( is_singular() ) {
			$post = get_queried_object();
			$text = (string) get_post_meta( $post->ID, self::META_DESC, true );
			if ( '' === $text && has_excerpt( $post ) ) {
				$text = $post->post_excerpt;
			}
			if ( '' === $text ) {
				$text = self::text_of( $post );
			}
		} elseif ( is_category() || is_tag() || is_tax() ) {
			$term = get_queried_object();
			$text = (string) get_term_meta( $term->term_id, self::TERM_DESC, true );
			if ( '' === $text ) {
				$text = term_description( $term );
			}
		} elseif ( is_post_type_archive() ) {
			$type = get_queried_object();
			$text = $type && ! empty( $type->description ) ? $type->description : '';
			if ( '' === $text && function_exists( 'is_shop' ) && is_shop() ) {
				$text = (string) get_post_meta( (int) wc_get_page_id( 'shop' ), self::META_DESC, true );
			}
		} elseif ( is_home() ) {
			$page = (int) get_option( 'page_for_posts' );
			$text = $page ? (string) get_post_meta( $page, self::META_DESC, true ) : '';
		} elseif ( is_author() ) {
			$text = get_the_author_meta( 'description', (int) get_queried_object_id() );
		}
		return self::trim( $text );
	}

	/**
	 * Readable text of a post: its content, or the text inside its Elementor layout.
	 *
	 * @param \WP_Post $post Post.
	 * @return string
	 */
	private static function text_of( $post ) {
		$content = $post->post_content;
		if ( '' === trim( wp_strip_all_tags( $content ) ) && 'builder' === get_post_meta( $post->ID, '_elementor_edit_mode', true ) ) {
			$data    = json_decode( (string) get_post_meta( $post->ID, '_elementor_data', true ), true );
			$content = is_array( $data ) ? implode( ' ', self::elementor_text( $data, 4 ) ) : '';
		}
		return strip_shortcodes( $content );
	}

	/**
	 * Collect editor text and headings from Elementor elements (first few only).
	 *
	 * @param array $elements Elements.
	 * @param int   $limit    How many text runs to gather.
	 * @return string[]
	 */
	private static function elementor_text( $elements, $limit ) {
		$out = array();
		foreach ( $elements as $el ) {
			if ( count( $out ) >= $limit ) {
				break;
			}
			$s = isset( $el['settings'] ) && is_array( $el['settings'] ) ? $el['settings'] : array();
			foreach ( array( 'editor', 'text', 'description', 'subtitle' ) as $key ) {
				if ( ! empty( $s[ $key ] ) && is_string( $s[ $key ] ) && mb_strlen( wp_strip_all_tags( $s[ $key ] ) ) > 40 ) {
					$out[] = wp_strip_all_tags( $s[ $key ] );
					break;
				}
			}
			if ( ! empty( $el['elements'] ) ) {
				$out = array_merge( $out, self::elementor_text( $el['elements'], $limit - count( $out ) ) );
			}
		}
		return $out;
	}

	/**
	 * Plain text, one line, about 155 characters, cut at a word.
	 *
	 * @param string $text Text.
	 * @return string
	 */
	public static function trim( $text ) {
		$text = trim( preg_replace( '/\s+/u', ' ', wp_strip_all_tags( (string) $text ) ) );
		$text = str_replace( array( '*', '{{', '}}' ), '', $text );
		if ( mb_strlen( $text ) <= 160 ) {
			return $text;
		}
		$cut   = mb_substr( $text, 0, 156 );
		$space = mb_strrpos( $cut, ' ' );
		return rtrim( false !== $space && $space > 100 ? mb_substr( $cut, 0, $space ) : $cut, '،,.؛; ' ) . '…';
	}

	/**
	 * Canonical address of the current view (null when there should be none).
	 *
	 * @return string|null
	 */
	public static function canonical() {
		if ( is_404() || is_search() ) {
			return null;
		}
		if ( is_singular() ) {
			$id     = get_queried_object_id();
			$custom = (string) get_post_meta( $id, self::META_CANONICAL, true );
			if ( '' !== $custom ) {
				return $custom;
			}
			$url  = get_permalink( $id );
			$page = (int) get_query_var( 'page' );
			if ( $page > 1 ) {
				$url = trailingslashit( $url ) . user_trailingslashit( (string) $page, 'single_paged' );
			}
			return $url;
		}
		if ( is_front_page() ) {
			$url = home_url( '/' );
		} elseif ( is_home() ) {
			$page = (int) get_option( 'page_for_posts' );
			$url  = $page ? get_permalink( $page ) : home_url( '/' );
		} elseif ( is_category() || is_tag() || is_tax() ) {
			$url = get_term_link( get_queried_object() );
		} elseif ( is_post_type_archive() ) {
			$url = get_post_type_archive_link( (string) get_query_var( 'post_type' ) );
		} elseif ( is_author() ) {
			$url = get_author_posts_url( (int) get_queried_object_id() );
		} else {
			return null;
		}
		if ( is_wp_error( $url ) || ! $url ) {
			return null;
		}
		$paged = (int) get_query_var( 'paged' );
		return $paged > 1 ? get_pagenum_link( $paged ) : $url;
	}

	/**
	 * Share image: the featured image, else the default from the settings, else the site icon.
	 *
	 * @return array|null [ url, width, height, alt ]
	 */
	private static function share_image() {
		$id = 0;
		if ( is_singular() && has_post_thumbnail( get_queried_object_id() ) ) {
			$id = (int) get_post_thumbnail_id( get_queried_object_id() );
		}
		if ( ! $id ) {
			$id = (int) hamista_core_option( 'seo_share_image', 0 );
		}
		if ( ! $id ) {
			$id = (int) get_option( 'site_icon' );
		}
		if ( ! $id ) {
			return null;
		}
		$src = wp_get_attachment_image_src( $id, 'large' );
		if ( ! $src ) {
			return null;
		}
		return array( $src[0], (int) $src[1], (int) $src[2], (string) get_post_meta( $id, '_wp_attachment_image_alt', true ) );
	}

	/**
	 * Head tags: description, canonical, Open Graph and Twitter card.
	 */
	public static function head() {
		$desc      = self::description();
		$canonical = self::canonical();
		$title     = wp_get_document_title();
		$tags      = array();

		if ( '' !== $desc ) {
			$tags[] = '<meta name="description" content="' . esc_attr( $desc ) . '">';
		}
		if ( $canonical ) {
			$tags[] = '<link rel="canonical" href="' . esc_url( $canonical ) . '">';
		}
		self::pagination_links( $tags );

		if ( hamista_core_option( 'seo_social', true ) ) {
			$og = array(
				'og:locale'    => get_locale(),
				'og:site_name' => get_bloginfo( 'name' ),
				'og:type'      => is_singular( 'post' ) ? 'article' : ( is_singular( 'product' ) ? 'product' : 'website' ),
				'og:title'     => $title,
				'og:url'       => $canonical ? $canonical : '',
			);
			if ( '' !== $desc ) {
				$og['og:description'] = $desc;
			}
			$image = self::share_image();
			if ( $image ) {
				$og['og:image']        = $image[0];
				$og['og:image:width']  = $image[1];
				$og['og:image:height'] = $image[2];
				if ( '' !== $image[3] ) {
					$og['og:image:alt'] = $image[3];
				}
			}
			if ( is_singular( 'post' ) ) {
				$og['article:published_time'] = get_post_time( 'c', true );
				$og['article:modified_time']  = get_post_modified_time( 'c', true );
			}
			foreach ( $og as $property => $content ) {
				if ( '' !== (string) $content ) {
					$tags[] = '<meta property="' . esc_attr( $property ) . '" content="' . esc_attr( (string) $content ) . '">';
				}
			}
			$tags[] = '<meta name="twitter:card" content="' . ( $image ? 'summary_large_image' : 'summary' ) . '">';
		}

		$verify = array(
			'google-site-verification' => 'seo_verify_google',
			'msvalidate.01'            => 'seo_verify_bing',
			'yandex-verification'      => 'seo_verify_yandex',
		);
		foreach ( $verify as $name => $key ) {
			$code = trim( (string) hamista_core_option( $key, '' ) );
			if ( '' !== $code && is_front_page() ) {
				$tags[] = '<meta name="' . esc_attr( $name ) . '" content="' . esc_attr( $code ) . '">';
			}
		}

		echo "\n" . implode( "\n", $tags ) . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- every value escaped above.
	}

	/**
	 * Previous/next links on paged archives help crawlers read the series.
	 *
	 * @param array $tags Tags (by reference).
	 */
	private static function pagination_links( &$tags ) {
		if ( is_singular() ) {
			return;
		}
		global $wp_query;
		$paged = max( 1, (int) get_query_var( 'paged' ) );
		$max   = isset( $wp_query->max_num_pages ) ? (int) $wp_query->max_num_pages : 1;
		if ( $paged > 1 ) {
			$tags[] = '<link rel="prev" href="' . esc_url( get_pagenum_link( $paged - 1 ) ) . '">';
		}
		if ( $paged < $max ) {
			$tags[] = '<link rel="next" href="' . esc_url( get_pagenum_link( $paged + 1 ) ) . '">';
		}
	}

	/* ------------------------------------------------------------------ *
	 * Robots
	 * ------------------------------------------------------------------ */

	/**
	 * Robots meta: noindex for search results, empty archives, chosen posts and
	 * (optionally) tag and author archives; large image previews everywhere else.
	 *
	 * @param array $robots Directives.
	 * @return array
	 */
	public static function robots( $robots ) {
		if ( ! get_option( 'blog_public' ) ) {
			return $robots;
		}
		$noindex = is_search() || is_404();
		if ( is_singular() && get_post_meta( get_queried_object_id(), self::META_NOINDEX, true ) ) {
			$noindex = true;
		}
		if ( is_tag() && hamista_core_option( 'seo_noindex_tags', false ) ) {
			$noindex = true;
		}
		if ( is_author() && hamista_core_option( 'seo_noindex_authors', true ) ) {
			$noindex = true;
		}
		if ( is_date() ) {
			$noindex = true;
		}
		if ( function_exists( 'is_cart' ) && ( is_cart() || is_checkout() || is_account_page() ) ) {
			$noindex = true;
		}
		if ( $noindex ) {
			$robots['noindex'] = true;
			$robots['follow']  = true;
			unset( $robots['max-image-preview'] );
		} else {
			$robots['max-image-preview'] = 'large';
			$robots['max-snippet']       = '-1';
		}
		return $robots;
	}

	/**
	 * robots.txt: keep crawlers out of admin, cart, account and search pages,
	 * and point them at the sitemap.
	 *
	 * @param string $output Default rules.
	 * @param bool   $public Whether the site is public.
	 * @return string
	 */
	public static function robots_txt( $output, $public ) {
		if ( ! $public ) {
			return $output;
		}
		$path  = wp_parse_url( home_url( '/' ), PHP_URL_PATH );
		$path  = $path ? trailingslashit( $path ) : '/';
		$lines = array(
			'User-agent: *',
			'Disallow: ' . $path . 'wp-admin/',
			'Allow: ' . $path . 'wp-admin/admin-ajax.php',
			'Disallow: ' . $path . '?s=',
			'Disallow: ' . $path . 'search/',
			'Disallow: ' . $path . '*?add-to-cart=',
			'Disallow: ' . $path . '*?orderby=',
		);
		if ( function_exists( 'wc_get_page_id' ) ) {
			foreach ( array( 'cart', 'checkout', 'myaccount' ) as $page ) {
				$id = (int) wc_get_page_id( $page );
				if ( $id > 0 ) {
					$lines[] = 'Disallow: ' . wp_parse_url( get_permalink( $id ), PHP_URL_PATH );
				}
			}
		}
		$extra = trim( (string) hamista_core_option( 'seo_robots_extra', '' ) );
		if ( '' !== $extra ) {
			$lines[] = '';
			$lines[] = sanitize_textarea_field( $extra );
		}
		$lines[] = '';
		$lines[] = 'Sitemap: ' . home_url( '/wp-sitemap.xml' );
		return implode( "\n", $lines ) . "\n";
	}

	/* ------------------------------------------------------------------ *
	 * Sitemap
	 * ------------------------------------------------------------------ */

	/**
	 * Leave posts set to noindex out of the sitemap.
	 *
	 * @param array $args Query args.
	 * @return array
	 */
	public static function sitemap_query( $args ) {
		$skip = self::utility_pages();
		if ( $skip ) {
			$args['post__not_in'] = $skip; // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_post__not_in -- a handful of ids.
		}
		$args['meta_query'] = array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query -- sitemap pages are cached and requested rarely.
			'relation' => 'OR',
			array(
				'key'     => self::META_NOINDEX,
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'   => self::META_NOINDEX,
				'value' => '',
			),
		);
		return $args;
	}

	/**
	 * Cart, checkout and account pages: never in search results, the sitemap or llms.txt.
	 *
	 * @return int[]
	 */
	public static function utility_pages() {
		$ids = array();
		if ( function_exists( 'wc_get_page_id' ) ) {
			foreach ( array( 'cart', 'checkout', 'myaccount' ) as $page ) {
				$id = (int) wc_get_page_id( $page );
				if ( $id > 0 ) {
					$ids[] = $id;
				}
			}
		}
		$account = (int) hamista_core_option( 'account_page', 0 );
		if ( $account ) {
			$ids[] = $account;
		}
		return array_values( array_unique( $ids ) );
	}

	/**
	 * Last-modified date for each sitemap entry.
	 *
	 * @param array    $entry Entry.
	 * @param \WP_Post $post  Post.
	 * @return array
	 */
	public static function sitemap_entry( $entry, $post ) {
		$entry['lastmod'] = get_post_modified_time( 'c', true, $post );
		return $entry;
	}

	/**
	 * Author archives only when they are indexable.
	 *
	 * @param \WP_Sitemaps_Provider $provider Provider.
	 * @param string                $name     Provider name.
	 * @return \WP_Sitemaps_Provider|false
	 */
	public static function sitemap_providers( $provider, $name ) {
		if ( 'users' === $name && hamista_core_option( 'seo_noindex_authors', true ) ) {
			return false;
		}
		return $provider;
	}

	/**
	 * No tag archives when they are noindex, no internal taxonomies.
	 *
	 * @param array $taxonomies Taxonomies.
	 * @return array
	 */
	public static function sitemap_taxonomies( $taxonomies ) {
		if ( hamista_core_option( 'seo_noindex_tags', false ) ) {
			unset( $taxonomies['post_tag'] );
		}
		unset( $taxonomies['post_format'], $taxonomies['product_shipping_class'], $taxonomies['elementor_library_type'] );
		return $taxonomies;
	}

	/**
	 * No template or library post types in the sitemap.
	 *
	 * @param array $types Post types.
	 * @return array
	 */
	public static function sitemap_post_types( $types ) {
		unset( $types['elementor_library'], $types['e-landing-page'], $types['hm_layout'] );
		return $types;
	}

	/* ------------------------------------------------------------------ *
	 * llms.txt and sitemap.xml
	 * ------------------------------------------------------------------ */

	/**
	 * /llms.txt and /sitemap.xml resolve without a physical file.
	 */
	public static function llms_rewrite() {
		add_rewrite_rule( '^llms\.txt$', 'index.php?hm_text=llms', 'top' );
		add_rewrite_rule( '^sitemap\.xml$', 'index.php?hm_text=sitemap', 'top' );
		add_filter(
			'query_vars',
			static function ( $vars ) {
				$vars[] = 'hm_text';
				return $vars;
			}
		);
		if ( get_option( 'hamista_core_rewrite_seo' ) !== HAMISTA_CORE_VERSION ) {
			flush_rewrite_rules( false );
			update_option( 'hamista_core_rewrite_seo', HAMISTA_CORE_VERSION );
		}
	}

	/**
	 * Serve /llms.txt; send /sitemap.xml to WordPress's own sitemap.
	 */
	public static function serve_text_files() {
		$file = (string) get_query_var( 'hm_text' );
		if ( '' === $file ) {
			// Plain permalinks: match the path directly.
			$path = (string) wp_parse_url( isset( $_SERVER['REQUEST_URI'] ) ? esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '', PHP_URL_PATH );
			$base = (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH );
			$rel  = ltrim( substr( $path, strlen( rtrim( $base, '/' ) ) ), '/' );
			$file = 'llms.txt' === $rel ? 'llms' : ( 'sitemap.xml' === $rel ? 'sitemap' : '' );
		}
		if ( 'sitemap' === $file && ! self::plugin_active() ) {
			wp_safe_redirect( home_url( '/wp-sitemap.xml' ), 301 );
			exit;
		}
		if ( 'llms' !== $file || ! hamista_core_option( 'seo_llms', true ) ) {
			return;
		}
		status_header( 200 );
		header( 'Content-Type: text/plain; charset=utf-8' );
		header( 'X-Robots-Tag: noindex' );
		echo self::llms_txt(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- plain text, built from stripped strings.
		exit;
	}

	/**
	 * llms.txt: a short Markdown map of the site for language models
	 * (https://llmstxt.org): name, summary, then the main pages, posts and products.
	 *
	 * @return string
	 */
	public static function llms_txt() {
		$cached = get_transient( 'hamista_llms_txt' );
		if ( false !== $cached ) {
			return $cached;
		}
		$clean = static function ( $text ) {
			return trim( preg_replace( '/\s+/u', ' ', wp_strip_all_tags( html_entity_decode( (string) $text, ENT_QUOTES, 'UTF-8' ) ) ) );
		};
		$intro = trim( (string) hamista_core_option( 'seo_llms_intro', '' ) );
		$out   = '# ' . $clean( get_bloginfo( 'name' ) ) . "\n\n";
		$out  .= '> ' . $clean( '' !== $intro ? $intro : ( hamista_core_option( 'seo_home_desc', '' ) ? hamista_core_option( 'seo_home_desc', '' ) : get_bloginfo( 'description' ) ) ) . "\n\n";

		$sections = array(
			__( 'Pages', 'hamista-core' )    => array(
				'post_type' => 'page',
				'orderby'   => 'menu_order title',
				'order'     => 'ASC',
				'number'    => 40,
			),
			__( 'Articles', 'hamista-core' ) => array(
				'post_type' => 'post',
				'number'    => 30,
			),
		);
		if ( post_type_exists( 'product' ) ) {
			$sections[ __( 'Products', 'hamista-core' ) ] = array(
				'post_type' => 'product',
				'number'    => 40,
			);
		}
		if ( post_type_exists( 'hm_portfolio' ) ) {
			$sections[ __( 'Projects', 'hamista-core' ) ] = array(
				'post_type' => 'hm_portfolio',
				'number'    => 20,
			);
		}
		foreach ( $sections as $heading => $q ) {
			$posts = get_posts(
				array(
					'post_type'        => $q['post_type'],
					'post_status'      => 'publish',
					'posts_per_page'   => $q['number'],
					'orderby'          => isset( $q['orderby'] ) ? $q['orderby'] : 'date',
					'order'            => isset( $q['order'] ) ? $q['order'] : 'DESC',
					'has_password'     => false,
					'post__not_in'     => self::utility_pages(), // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_post__not_in -- a handful of ids.
					'suppress_filters' => false,
					'meta_query'       => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query -- cached for a day.
						array(
							'key'     => self::META_NOINDEX,
							'compare' => 'NOT EXISTS',
						),
					),
				)
			);
			if ( ! $posts ) {
				continue;
			}
			$out .= '## ' . $heading . "\n\n";
			foreach ( $posts as $post ) {
				$desc = (string) get_post_meta( $post->ID, self::META_DESC, true );
				if ( '' === $desc ) {
					$desc = has_excerpt( $post ) ? $post->post_excerpt : self::text_of( $post );
				}
				$desc = self::trim( $desc );
				$out .= '- [' . $clean( get_the_title( $post ) ) . '](' . get_permalink( $post ) . ')' . ( '' !== $desc ? ': ' . $desc : '' ) . "\n";
			}
			$out .= "\n";
		}
		set_transient( 'hamista_llms_txt', $out, DAY_IN_SECONDS );
		return $out;
	}

	/* ------------------------------------------------------------------ *
	 * Favicon and alt text
	 * ------------------------------------------------------------------ */

	/**
	 * The icon picked in Hamista → SEO stands in when WordPress has none, so
	 * core prints every size (favicon, Apple touch icon, tiles).
	 *
	 * @param mixed $value Saved site icon.
	 * @return mixed
	 */
	public static function site_icon( $value ) {
		if ( (int) $value ) {
			return $value;
		}
		$icon = (int) hamista_core_option( 'seo_favicon', 0 );
		return $icon ? $icon : $value;
	}

	/**
	 * Until a site icon is chosen (Settings → General), show a neutral icon
	 * drawn from the site's first letter instead of the browser's blank page.
	 */
	public static function favicon() {
		if ( has_site_icon() || ! hamista_core_option( 'seo_favicon_fallback', true ) ) {
			return;
		}
		$name   = trim( wp_strip_all_tags( get_bloginfo( 'name' ) ) );
		$letter = '' !== $name ? mb_substr( $name, 0, 1 ) : 'H';
		$accent = (string) hamista_core_option( 'accent', '' );
		$accent = preg_match( '/^#[0-9a-f]{3,8}$/i', $accent ) ? $accent : '#111111';
		$svg    = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="' . $accent . '"/>'
			. '<text x="32" y="44" font-family="Tahoma,Arial,sans-serif" font-size="34" font-weight="700" text-anchor="middle" fill="#fff">' . esc_html( $letter ) . '</text></svg>';
		echo '<link rel="icon" href="data:image/svg+xml,' . rawurlencode( $svg ) . '">' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- url-encoded inline SVG.
	}

	/**
	 * Images without alt text get one: the attachment's caption or title,
	 * else the title of the page it belongs to. Decorative images marked with
	 * role="presentation" or aria-hidden stay empty on purpose.
	 *
	 * @param array    $attr       Attributes.
	 * @param \WP_Post $attachment Attachment.
	 * @return array
	 */
	public static function image_alt( $attr, $attachment ) {
		if ( isset( $attr['alt'] ) && '' !== trim( (string) $attr['alt'] ) ) {
			return $attr;
		}
		if ( ( isset( $attr['role'] ) && 'presentation' === $attr['role'] ) || isset( $attr['aria-hidden'] ) ) {
			return $attr;
		}
		$alt = '';
		if ( $attachment instanceof \WP_Post ) {
			$alt = trim( (string) $attachment->post_excerpt );
			if ( '' === $alt && ! preg_match( '/^(img|image|dsc|photo|screenshot)?[-_\s]*\d+[-_\s\d]*$/i', $attachment->post_title ) ) {
				$alt = trim( (string) $attachment->post_title );
			}
			if ( '' === $alt && $attachment->post_parent ) {
				$alt = get_the_title( $attachment->post_parent );
			}
		}
		if ( '' !== $alt ) {
			$attr['alt'] = wp_strip_all_tags( $alt );
		}
		return $attr;
	}
}
