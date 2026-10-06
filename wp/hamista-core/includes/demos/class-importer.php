<?php
/**
 * One-click demo import.
 *
 * The admin app drives the import one small step at a time over REST, so no
 * single request runs long enough to hit a host's time limit, and a failed
 * step can simply be retried. Every imported item is tagged with the demo ID
 * and a stable key: importing the same demo twice updates instead of
 * duplicating, and "Uninstall demo content" removes exactly what came in.
 *
 * Steps: prepare → media → terms → posts → products → pages → content →
 * templates → menus → settings → front → finish.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Demos;

use Hamista\Core\Settings\Settings;

defined( 'ABSPATH' ) || exit;

/**
 * Importer.
 */
class Importer {

	const STATE    = 'hamista_demo_state';
	const IMPORTED = 'hamista_demo_imported';
	const META     = '_hamista_demo';
	const KEY      = '_hamista_demo_key';

	/**
	 * Items handled per request for the heavier steps.
	 */
	const BATCH = array(
		'media'    => 3,
		'posts'    => 6,
		'products' => 4,
		'content'  => 2,
	);

	/**
	 * Step order with the progress (%) reached when each step is done.
	 */
	const STEPS = array(
		'prepare'   => 3,
		'media'     => 45,
		'terms'     => 48,
		'posts'     => 58,
		'products'  => 68,
		'pages'     => 71,
		'content'   => 86,
		'templates' => 89,
		'menus'     => 92,
		'settings'  => 96,
		'front'     => 98,
		'finish'    => 100,
	);

	/**
	 * Current import state (ID maps, demo, options).
	 *
	 * @var array
	 */
	private $state = array();

	/**
	 * Manifest of the demo being imported.
	 *
	 * @var array
	 */
	private $demo = array();

	/**
	 * Its content.json.
	 *
	 * @var array
	 */
	private $content = array();

	/**
	 * Hooks.
	 */
	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
		add_filter( 'hamista_core/admin_data', array( __CLASS__, 'admin_data' ) );
	}

	/**
	 * Demo list and import status for the admin app.
	 *
	 * @param array $data App data.
	 * @return array
	 */
	public static function admin_data( $data ) {
		$data['demos']        = Demos::for_admin();
		$data['demoImported'] = (bool) get_option( self::IMPORTED );
		return $data;
	}

	/**
	 * REST routes.
	 */
	public static function register_routes() {
		$manage = static function () {
			return current_user_can( 'manage_options' );
		};
		register_rest_route(
			'hamista/v1',
			'/demos/plugins',
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'install_plugin' ),
				'permission_callback' => static function () {
					return current_user_can( 'install_plugins' ) && current_user_can( 'activate_plugins' );
				},
			)
		);
		register_rest_route(
			'hamista/v1',
			'/demos/(?P<id>[a-z0-9_-]+)/import',
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'import' ),
				'permission_callback' => $manage,
			)
		);
		register_rest_route(
			'hamista/v1',
			'/demos/uninstall',
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'uninstall' ),
				'permission_callback' => $manage,
			)
		);
	}

	/* ------------------------------------------------------------------ */
	/* Plugins                                                            */
	/* ------------------------------------------------------------------ */

	/**
	 * Install (from WordPress.org) and activate Elementor or WooCommerce.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public static function install_plugin( $request ) {
		$known = array(
			'elementor'   => array( 'elementor/elementor.php', 'Elementor' ),
			'woocommerce' => array( 'woocommerce/woocommerce.php', 'WooCommerce' ),
		);
		$slug  = sanitize_key( $request->get_param( 'slug' ) );
		if ( ! isset( $known[ $slug ] ) ) {
			return new \WP_Error( 'hamista_plugin', __( 'Unknown plugin.', 'hamista-core' ), array( 'status' => 400 ) );
		}
		list( $file, $name ) = $known[ $slug ];

		require_once ABSPATH . 'wp-admin/includes/plugin.php';
		if ( ! file_exists( WP_PLUGIN_DIR . '/' . $file ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
			require_once ABSPATH . 'wp-admin/includes/misc.php';
			require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
			require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';

			$api = plugins_api(
				'plugin_information',
				array(
					'slug'   => $slug,
					'fields' => array( 'sections' => false ),
				)
			);
			if ( is_wp_error( $api ) ) {
				/* translators: %s: plugin name */
				return new \WP_Error( 'hamista_plugin', sprintf( __( 'Could not reach WordPress.org to download %s. Install it from Plugins → Add New, then try again.', 'hamista-core' ), $name ), array( 'status' => 502 ) );
			}
			$upgrader = new \Plugin_Upgrader( new \WP_Ajax_Upgrader_Skin() );
			$result   = $upgrader->install( $api->download_link );
			if ( true !== $result ) {
				/* translators: %s: plugin name */
				return new \WP_Error( 'hamista_plugin', sprintf( __( '%s could not be installed. Check that the plugins folder is writable.', 'hamista-core' ), $name ), array( 'status' => 500 ) );
			}
		}

		$activated = activate_plugin( $file, '', false, true );
		if ( is_wp_error( $activated ) ) {
			return new \WP_Error( 'hamista_plugin', $activated->get_error_message(), array( 'status' => 500 ) );
		}
		return rest_ensure_response(
			array(
				'ok'      => true,
				/* translators: %s: plugin name */
				'message' => sprintf( __( '%s is installed and active.', 'hamista-core' ), $name ),
			)
		);
	}

	/* ------------------------------------------------------------------ */
	/* Import                                                             */
	/* ------------------------------------------------------------------ */

	/**
	 * Run one step (or one batch of a step).
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public static function import( $request ) {
		$id   = sanitize_key( $request['id'] );
		$demo = Demos::get( $id );
		if ( ! $demo ) {
			return new \WP_Error( 'hamista_demo', __( 'This demo could not be found.', 'hamista-core' ), array( 'status' => 404 ) );
		}
		foreach ( (array) ( $demo['required'] ?? array( 'elementor' ) ) as $slug ) {
			if ( ! self::plugin_active( $slug ) ) {
				return new \WP_Error( 'hamista_demo', __( 'Activate the required plugins first.', 'hamista-core' ), array( 'status' => 409 ) );
			}
		}

		$step = sanitize_key( (string) $request->get_param( 'step' ) );
		$step = isset( self::STEPS[ $step ] ) ? $step : 'prepare';

		$options = (array) $request->get_param( 'options' );
		$options = array(
			'content'    => ! empty( $options['content'] ),
			'menus'      => ! empty( $options['menus'] ),
			'settings'   => ! empty( $options['settings'] ),
			'front_page' => ! empty( $options['front_page'] ),
		);

		$importer          = new self();
		$importer->demo    = $demo;
		$importer->content = Demos::content( $id );
		if ( ! $importer->content ) {
			return new \WP_Error( 'hamista_demo', __( 'The demo files are damaged. Reinstall Hamista Core and try again.', 'hamista-core' ), array( 'status' => 500 ) );
		}

		if ( function_exists( 'set_time_limit' ) ) {
			@set_time_limit( 120 ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged -- not allowed on every host.
		}
		wp_raise_memory_limit( 'admin' );

		if ( 'prepare' === $step ) {
			$importer->state = array(
				'demo'    => $id,
				'options' => $options,
				'map'     => array(),
			);
		} else {
			$importer->state = (array) get_option( self::STATE, array() );
			if ( ( $importer->state['demo'] ?? '' ) !== $id ) {
				return new \WP_Error( 'hamista_demo', __( 'The import was interrupted. Please start again.', 'hamista-core' ), array( 'status' => 409 ) );
			}
			$importer->state['options'] = $options;
		}

		$batch  = max( 0, (int) $request->get_param( 'batch' ) );
		$result = $importer->run( $step, $batch );
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		update_option( self::STATE, $importer->state, false );

		return rest_ensure_response( $result );
	}

	/**
	 * Dispatch a step and work out what comes next.
	 *
	 * @param string $step  Step.
	 * @param int    $batch Batch index within the step.
	 * @return array|\WP_Error { done, next, progress, message, links? }
	 */
	private function run( $step, $batch ) {
		$opt   = $this->state['options'];
		$skips = array(
			'media'     => ! $opt['content'],
			'terms'     => ! $opt['content'],
			'posts'     => ! $opt['content'],
			'products'  => ! $opt['content'] || ! class_exists( 'WooCommerce' ),
			'pages'     => ! $opt['content'],
			'content'   => ! $opt['content'],
			'templates' => ! $opt['content'],
			'menus'     => ! $opt['menus'],
			'settings'  => ! $opt['settings'],
			'front'     => ! $opt['front_page'],
		);

		$more = false;
		if ( empty( $skips[ $step ] ) ) {
			$method = 'step_' . $step;
			$more   = $this->$method( $batch );
			if ( is_wp_error( $more ) ) {
				return $more;
			}
		}

		$steps = array_keys( self::STEPS );
		$index = array_search( $step, $steps, true );
		$prev  = $index > 0 ? self::STEPS[ $steps[ $index - 1 ] ] : 0;

		if ( $more ) {
			$total    = max( 1, (int) $more );
			$progress = $prev + ( self::STEPS[ $step ] - $prev ) * min( 1, ( $batch + 1 ) / $total );
			return array(
				'done'     => false,
				'next'     => array(
					'step'  => $step,
					'batch' => $batch + 1,
				),
				'progress' => round( $progress ),
				'message'  => $this->message( $step ),
			);
		}

		if ( 'finish' === $step ) {
			return array(
				'done'     => true,
				'next'     => null,
				'progress' => 100,
				'message'  => __( 'Done.', 'hamista-core' ),
				'links'    => $this->links(),
			);
		}

		// Find the next step that is not skipped, so the bar does not stall.
		$next = $steps[ $index + 1 ];
		while ( ! empty( $skips[ $next ] ) && 'finish' !== $next ) {
			$next = $steps[ array_search( $next, $steps, true ) + 1 ];
		}
		return array(
			'done'     => false,
			'next'     => array(
				'step'  => $next,
				'batch' => 0,
			),
			'progress' => self::STEPS[ $step ],
			'message'  => $this->message( $next ),
		);
	}

	/**
	 * Status line shown under the progress bar.
	 *
	 * @param string $step Step about to run.
	 * @return string
	 */
	private function message( $step ) {
		$messages = array(
			'prepare'   => __( 'Getting ready…', 'hamista-core' ),
			'media'     => __( 'Copying images…', 'hamista-core' ),
			'terms'     => __( 'Creating categories…', 'hamista-core' ),
			'posts'     => __( 'Adding blog posts…', 'hamista-core' ),
			'products'  => __( 'Adding products…', 'hamista-core' ),
			'pages'     => __( 'Creating pages…', 'hamista-core' ),
			'content'   => __( 'Building pages with Elementor…', 'hamista-core' ),
			'templates' => __( 'Saving templates to the Elementor library…', 'hamista-core' ),
			'menus'     => __( 'Setting up menus…', 'hamista-core' ),
			'settings'  => __( 'Applying the style kit and settings…', 'hamista-core' ),
			'front'     => __( 'Setting the home page…', 'hamista-core' ),
			'finish'    => __( 'Finishing up…', 'hamista-core' ),
		);
		return $messages[ $step ] ?? '';
	}

	/* ------------------------------------------------------------------ */
	/* Steps                                                              */
	/* ------------------------------------------------------------------ */

	/**
	 * Start fresh: forget earlier ID maps for this run.
	 *
	 * @return bool
	 */
	private function step_prepare() {
		$this->state['map'] = array(
			'media'    => array(),
			'terms'    => array(),
			'posts'    => array(),
			'products' => array(),
			'pages'    => array(),
		);
		return false;
	}

	/**
	 * Copy images into the media library.
	 *
	 * @param int $batch Batch.
	 * @return int|false Number of batches when more remain.
	 */
	private function step_media( $batch ) {
		$images = (array) ( $this->content['images'] ?? array() );
		$keys   = array_keys( $images );
		$size   = self::BATCH['media'];
		$total  = (int) ceil( count( $keys ) / $size );

		require_once ABSPATH . 'wp-admin/includes/image.php';
		require_once ABSPATH . 'wp-admin/includes/file.php';

		foreach ( array_slice( $keys, $batch * $size, $size ) as $key ) {
			$existing = $this->find( 'attachment', $key );
			if ( $existing ) {
				$this->state['map']['media'][ $key ] = $existing;
				continue;
			}
			$file = Demos::file( $this->demo, $images[ $key ] );
			if ( ! $file ) {
				continue;
			}
			$id = $this->sideload( $file, $key );
			if ( $id ) {
				$this->state['map']['media'][ $key ] = $id;
			}
		}
		return $batch + 1 < $total ? $total : false;
	}

	/**
	 * Copy one file into uploads and register it as an attachment.
	 *
	 * @param string $file Absolute path.
	 * @param string $key  Image key.
	 * @return int Attachment ID or 0.
	 */
	private function sideload( $file, $key ) {
		$name   = sanitize_file_name( $this->state['demo'] . '-' . basename( $file ) );
		$upload = wp_upload_bits( $name, null, (string) file_get_contents( $file ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- bundled file.
		if ( ! empty( $upload['error'] ) ) {
			return 0;
		}
		$type = wp_check_filetype( $upload['file'] );
		$alts = (array) ( $this->content['alts'] ?? array() );
		$id   = wp_insert_attachment(
			array(
				'post_title'     => $alts[ $key ] ?? preg_replace( '/\.[^.]+$/', '', basename( $file ) ),
				'post_mime_type' => $type['type'],
				'post_status'    => 'inherit',
			),
			$upload['file']
		);
		if ( ! $id || is_wp_error( $id ) ) {
			return 0;
		}
		$this->tag( $id, $key );
		if ( ! empty( $alts[ $key ] ) ) {
			update_post_meta( $id, '_wp_attachment_image_alt', $alts[ $key ] );
		}
		wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $upload['file'] ) );
		return (int) $id;
	}

	/**
	 * Categories, tags and product categories.
	 *
	 * @return false
	 */
	private function step_terms() {
		foreach ( (array) ( $this->content['terms'] ?? array() ) as $term ) {
			if ( ! taxonomy_exists( $term['taxonomy'] ) ) {
				continue;
			}
			$found = get_term_by( 'slug', $term['slug'], $term['taxonomy'] );
			if ( $found ) {
				$id = (int) $found->term_id;
			} else {
				$args = array(
					'slug'        => $term['slug'],
					'description' => $term['description'] ?? '',
				);
				if ( ! empty( $term['parent'] ) && isset( $this->state['map']['terms'][ $term['parent'] ] ) ) {
					$args['parent'] = $this->state['map']['terms'][ $term['parent'] ];
				}
				$made = wp_insert_term( $term['name'], $term['taxonomy'], $args );
				if ( is_wp_error( $made ) ) {
					continue;
				}
				$id = (int) $made['term_id'];
				update_term_meta( $id, self::META, $this->state['demo'] );
			}
			$this->state['map']['terms'][ $term['key'] ] = $id;
			if ( ! empty( $term['image'] ) && 'product_cat' === $term['taxonomy'] ) {
				update_term_meta( $id, 'thumbnail_id', $this->media_id( $term['image'] ) );
			}
		}
		return false;
	}

	/**
	 * Blog posts.
	 *
	 * @param int $batch Batch.
	 * @return int|false
	 */
	private function step_posts( $batch ) {
		$posts = (array) ( $this->content['posts'] ?? array() );
		$size  = self::BATCH['posts'];
		$total = (int) ceil( count( $posts ) / $size );

		foreach ( array_slice( $posts, $batch * $size, $size ) as $i => $post ) {
			$age = (int) ( $post['days_ago'] ?? ( ( $batch * $size + $i ) * 4 + 1 ) );
			$id  = $this->upsert(
				'post',
				$post['key'],
				array(
					'post_title'   => $post['title'],
					'post_name'    => $post['slug'] ?? '',
					'post_excerpt' => $post['excerpt'] ?? '',
					'post_content' => $this->replace_string( $post['content'] ?? '' ),
					'post_status'  => 'publish',
					'post_date'    => wp_date( 'Y-m-d H:i:s', time() - $age * DAY_IN_SECONDS - HOUR_IN_SECONDS * ( 3 + $i ) ),
				)
			);
			if ( ! $id ) {
				continue;
			}
			$this->state['map']['posts'][ $post['key'] ] = $id;
			if ( ! empty( $post['image'] ) && $this->media_id( $post['image'] ) ) {
				set_post_thumbnail( $id, $this->media_id( $post['image'] ) );
			}
			$by_tax = array();
			foreach ( (array) ( $post['terms'] ?? array() ) as $term_key ) {
				foreach ( (array) ( $this->content['terms'] ?? array() ) as $term ) {
					if ( $term['key'] === $term_key && isset( $this->state['map']['terms'][ $term_key ] ) ) {
						$by_tax[ $term['taxonomy'] ][] = (int) $this->state['map']['terms'][ $term_key ];
					}
				}
			}
			foreach ( $by_tax as $taxonomy => $ids ) {
				wp_set_object_terms( $id, $ids, $taxonomy );
			}
		}
		return $batch + 1 < $total ? $total : false;
	}

	/**
	 * WooCommerce products.
	 *
	 * @param int $batch Batch.
	 * @return int|false
	 */
	private function step_products( $batch ) {
		$products = (array) ( $this->content['products'] ?? array() );
		$size     = self::BATCH['products'];
		$total    = (int) ceil( count( $products ) / $size );

		foreach ( array_slice( $products, $batch * $size, $size ) as $data ) {
			$existing = $this->find( 'product', $data['key'] );
			$product  = $existing ? wc_get_product( $existing ) : null;
			$product  = $product ? $product : new \WC_Product_Simple();

			$product->set_name( $data['title'] );
			if ( ! empty( $data['slug'] ) ) {
				$product->set_slug( $data['slug'] );
			}
			$product->set_status( 'publish' );
			$product->set_description( $this->replace_string( $data['content'] ?? '' ) );
			$product->set_short_description( $data['excerpt'] ?? '' );
			$product->set_regular_price( (string) ( $data['price'] ?? '' ) );
			$product->set_sale_price( (string) ( $data['sale_price'] ?? '' ) );
			$product->set_sku( $existing ? $product->get_sku() : ( $data['sku'] ?? '' ) );
			$product->set_featured( ! empty( $data['featured'] ) );
			$product->set_virtual( ! empty( $data['virtual'] ) );
			if ( isset( $data['stock'] ) ) {
				$product->set_manage_stock( true );
				$product->set_stock_quantity( (int) $data['stock'] );
			}
			if ( ! empty( $data['weight'] ) ) {
				$product->set_weight( (string) $data['weight'] );
			}
			if ( ! empty( $data['image'] ) ) {
				$product->set_image_id( $this->media_id( $data['image'] ) );
			}
			$product->set_gallery_image_ids( array_filter( array_map( array( $this, 'media_id' ), (array) ( $data['gallery'] ?? array() ) ) ) );

			$cats = array();
			foreach ( (array) ( $data['terms'] ?? array() ) as $term_key ) {
				if ( isset( $this->state['map']['terms'][ $term_key ] ) ) {
					$cats[] = (int) $this->state['map']['terms'][ $term_key ];
				}
			}
			if ( $cats ) {
				$product->set_category_ids( $cats );
			}

			if ( ! empty( $data['attributes'] ) ) {
				$attributes = array();
				foreach ( $data['attributes'] as $position => $attr ) {
					$attribute = new \WC_Product_Attribute();
					$attribute->set_name( $attr['name'] );
					$attribute->set_options( (array) $attr['options'] );
					$attribute->set_position( $position );
					$attribute->set_visible( true );
					$attributes[] = $attribute;
				}
				$product->set_attributes( $attributes );
			}

			// A duplicate SKU from an earlier, deleted import must not stop the run.
			try {
				$id = $product->save();
			} catch ( \Exception $e ) {
				$product->set_sku( '' );
				$id = $product->save();
			}
			if ( $id ) {
				$this->tag( $id, $data['key'] );
				$this->state['map']['products'][ $data['key'] ] = (int) $id;
			}
		}
		return $batch + 1 < $total ? $total : false;
	}

	/**
	 * Create (or find) every page first, so content can link between pages.
	 *
	 * @return false
	 */
	private function step_pages() {
		foreach ( (array) ( $this->content['pages'] ?? array() ) as $page ) {
			$id = $this->upsert(
				'page',
				$page['key'],
				array(
					'post_title'  => $page['title'],
					'post_name'   => $page['slug'] ?? '',
					'post_status' => 'publish',
				),
				false
			);
			if ( $id ) {
				$this->state['map']['pages'][ $page['key'] ] = $id;
			}
		}
		return false;
	}

	/**
	 * Fill pages with their Elementor layouts.
	 *
	 * @param int $batch Batch.
	 * @return int|false
	 */
	private function step_content( $batch ) {
		$pages = (array) ( $this->content['pages'] ?? array() );
		$size  = self::BATCH['content'];
		$total = (int) ceil( count( $pages ) / $size );

		foreach ( array_slice( $pages, $batch * $size, $size ) as $page ) {
			$id = $this->state['map']['pages'][ $page['key'] ] ?? 0;
			if ( ! $id ) {
				continue;
			}
			if ( ! empty( $page['template'] ) ) {
				update_post_meta( $id, '_wp_page_template', sanitize_text_field( $page['template'] ) );
			}
			if ( ! empty( $page['elementor'] ) ) {
				$this->save_elementor( $id, $this->replace( $page['elementor'] ), $this->replace( (array) ( $page['settings'] ?? array() ) ) );
			} elseif ( isset( $page['content'] ) ) {
				wp_update_post(
					array(
						'ID'           => $id,
						'post_content' => $this->replace_string( $page['content'] ),
					)
				);
			}
		}
		return $batch + 1 < $total ? $total : false;
	}

	/**
	 * Save pages and the signature sections (horizontal scroll, scroll zoom…)
	 * to the Elementor library, so they can be dropped into any page.
	 *
	 * @return false
	 */
	private function step_templates() {
		if ( ! class_exists( '\Elementor\Plugin' ) ) {
			return false;
		}
		$source = \Elementor\Plugin::$instance->templates_manager->get_source( 'local' );
		if ( ! $source ) {
			return false;
		}
		$section_type = \Elementor\Plugin::$instance->documents->get_document_type( 'container' ) ? 'container' : 'section';
		$pages        = array();
		foreach ( (array) ( $this->content['pages'] ?? array() ) as $page ) {
			$pages[ $page['key'] ] = $page;
		}

		foreach ( (array) ( $this->content['templates'] ?? array() ) as $template ) {
			$page = $pages[ $template['page'] ] ?? null;
			if ( ! $page || empty( $page['elementor'] ) ) {
				continue;
			}
			$is_page  = 'page' === $template['type'];
			$elements = $is_page ? $page['elementor'] : array_slice( $page['elementor'], (int) $template['index'], 1 );
			if ( ! $elements ) {
				continue;
			}
			$existing = $this->find( 'elementor_library', $template['key'] );
			if ( $existing ) {
				continue;
			}
			$id = $source->save_item(
				array(
					'title'         => $template['title'],
					'type'          => $is_page ? 'page' : $section_type,
					'content'       => $this->replace( $elements ),
					'page_settings' => $is_page ? $this->replace( (array) ( $page['settings'] ?? array() ) ) : array(),
				)
			);
			if ( $id && ! is_wp_error( $id ) ) {
				$this->tag( $id, $template['key'] );
			}
		}
		return false;
	}

	/**
	 * Navigation menus and their locations.
	 *
	 * @return false
	 */
	private function step_menus() {
		$locations = get_theme_mod( 'nav_menu_locations', array() );
		foreach ( (array) ( $this->content['menus'] ?? array() ) as $menu ) {
			$name     = $menu['name'];
			$existing = wp_get_nav_menu_object( $name );
			if ( $existing ) {
				// Rebuild an earlier import of the same menu from scratch.
				foreach ( (array) wp_get_nav_menu_items( $existing->term_id, array( 'post_status' => 'any' ) ) as $item ) {
					wp_delete_post( $item->ID, true );
				}
				$menu_id = (int) $existing->term_id;
			} else {
				$menu_id = wp_create_nav_menu( $name );
				if ( is_wp_error( $menu_id ) ) {
					continue;
				}
				update_term_meta( $menu_id, self::META, $this->state['demo'] );
			}
			$this->add_menu_items( $menu_id, (array) $menu['items'], 0 );
			if ( ! empty( $menu['location'] ) ) {
				$locations[ $menu['location'] ] = $menu_id;
			}
		}
		set_theme_mod( 'nav_menu_locations', $locations );
		return false;
	}

	/**
	 * Add menu items (recursively for sub-menus).
	 *
	 * @param int   $menu_id Menu.
	 * @param array $items   Items.
	 * @param int   $parent  Parent item ID.
	 */
	private function add_menu_items( $menu_id, $items, $parent ) {
		foreach ( $items as $position => $item ) {
			$args = array(
				'menu-item-title'     => $item['title'],
				'menu-item-status'    => 'publish',
				'menu-item-parent-id' => $parent,
				'menu-item-position'  => $position + 1,
			);
			if ( ! empty( $item['page'] ) ) {
				$page_id = $this->state['map']['pages'][ $item['page'] ] ?? 0;
				if ( ! $page_id ) {
					continue;
				}
				$args['menu-item-type']      = 'post_type';
				$args['menu-item-object']    = 'page';
				$args['menu-item-object-id'] = $page_id;
			} elseif ( ! empty( $item['post'] ) ) {
				$post_id = $this->state['map']['posts'][ $item['post'] ] ?? 0;
				if ( ! $post_id ) {
					continue;
				}
				$args['menu-item-type']      = 'post_type';
				$args['menu-item-object']    = 'post';
				$args['menu-item-object-id'] = $post_id;
			} elseif ( ! empty( $item['term'] ) ) {
				$term_id = $this->state['map']['terms'][ $item['term'] ] ?? 0;
				$term    = $term_id ? get_term( $term_id ) : null;
				if ( ! $term || is_wp_error( $term ) ) {
					continue;
				}
				$args['menu-item-type']      = 'taxonomy';
				$args['menu-item-object']    = $term->taxonomy;
				$args['menu-item-object-id'] = $term_id;
			} else {
				$url = $this->replace_string( (string) ( $item['url'] ?? '#' ) );
				if ( '' === $url ) {
					continue;
				}
				$args['menu-item-type'] = 'custom';
				$args['menu-item-url']  = $url;
			}
			if ( ! empty( $item['desc'] ) ) {
				$args['menu-item-description'] = $item['desc'];
			}
			$item_id = wp_update_nav_menu_item( $menu_id, 0, $args );
			if ( ! is_wp_error( $item_id ) && ! empty( $item['children'] ) ) {
				$this->add_menu_items( $menu_id, (array) $item['children'], $item_id );
			}
		}
	}

	/**
	 * Hamista settings, Elementor kit and WooCommerce defaults.
	 *
	 * @return false
	 */
	private function step_settings() {
		$options = $this->replace( (array) ( $this->content['options'] ?? array() ) );
		if ( ! empty( $this->demo['kit'] ) ) {
			$options['kit'] = $this->demo['kit'];
		}
		if ( $options && class_exists( '\Hamista\Core\Settings\Settings' ) ) {
			Settings::save( $options );
		}
		if ( ! empty( $this->content['site']['tagline'] ) ) {
			update_option( 'blogdescription', sanitize_text_field( $this->content['site']['tagline'] ) );
		}

		if ( class_exists( '\Elementor\Plugin' ) ) {
			// Theme tokens drive colours and type; Elementor's own defaults would fight them.
			update_option( 'elementor_disable_color_schemes', 'yes' );
			update_option( 'elementor_disable_typography_schemes', 'yes' );
			update_option( 'elementor_load_fa4_shim', '' );
			$cpt = (array) get_option( 'elementor_cpt_support', array( 'page', 'post' ) );
			update_option( 'elementor_cpt_support', array_values( array_unique( array_merge( $cpt, array( 'page', 'post' ) ) ) ) );
		}

		if ( class_exists( 'WooCommerce' ) && ! empty( $this->content['woocommerce'] ) ) {
			$wc = $this->content['woocommerce'];
			if ( ! empty( $wc['currency'] ) ) {
				update_option( 'woocommerce_currency', sanitize_text_field( $wc['currency'] ) );
				update_option( 'woocommerce_price_num_decimals', (int) ( $wc['decimals'] ?? 0 ) );
				update_option( 'woocommerce_price_thousand_sep', $wc['thousand_sep'] ?? '٬' );
				update_option( 'woocommerce_currency_pos', $wc['currency_pos'] ?? 'right_space' );
			}
			if ( ! empty( $wc['catalog_rows'] ) ) {
				update_option( 'woocommerce_catalog_rows', (int) $wc['catalog_rows'] );
			}
			// WooCommerce creates its pages in the language active at install time.
			// Rename them only while they still carry the English defaults.
			$defaults = array(
				'shop'      => 'Shop',
				'cart'      => 'Cart',
				'checkout'  => 'Checkout',
				'myaccount' => 'My account',
			);
			foreach ( (array) ( $wc['pages'] ?? array() ) as $page => $title ) {
				$page_id = function_exists( 'wc_get_page_id' ) ? wc_get_page_id( $page ) : 0;
				if ( $page_id > 0 && isset( $defaults[ $page ] ) && get_the_title( $page_id ) === $defaults[ $page ] ) {
					wp_update_post(
						array(
							'ID'         => $page_id,
							'post_title' => sanitize_text_field( $title ),
						)
					);
				}
			}
		}
		return false;
	}

	/**
	 * Front page, posts page and pretty permalinks.
	 *
	 * @return false
	 */
	private function step_front() {
		$front = $this->state['map']['pages'][ $this->content['front_page'] ?? '' ] ?? 0;
		$blog  = $this->state['map']['pages'][ $this->content['posts_page'] ?? '' ] ?? 0;
		if ( $front ) {
			update_option( 'show_on_front', 'page' );
			update_option( 'page_on_front', $front );
		}
		if ( $blog ) {
			update_option( 'page_for_posts', $blog );
		}
		if ( ! get_option( 'permalink_structure' ) ) {
			update_option( 'permalink_structure', '/%postname%/' );
		}
		$this->trash_starter_content();
		return false;
	}

	/**
	 * Move WordPress's own sample post and page to the trash, but only while
	 * they are untouched, so a fresh site shows the demo and nothing else.
	 */
	private function trash_starter_content() {
		foreach ( array( 'post' => 'hello-world', 'page' => 'sample-page' ) as $type => $slug ) {
			$item = get_page_by_path( $slug, OBJECT, $type );
			if ( $item && 'publish' === $item->post_status && $item->post_modified_gmt === $item->post_date_gmt && (int) $item->comment_count <= 1 ) {
				wp_trash_post( $item->ID );
			}
		}
	}

	/**
	 * Clear caches and remember what was imported.
	 *
	 * @return false
	 */
	private function step_finish() {
		flush_rewrite_rules( false );
		if ( class_exists( '\Elementor\Plugin' ) ) {
			\Elementor\Plugin::$instance->files_manager->clear_cache();
		}
		$imported = (array) get_option( self::IMPORTED, array() );
		$imported[ $this->state['demo'] ] = time();
		update_option( self::IMPORTED, $imported, false );
		delete_option( self::STATE );
		return false;
	}

	/**
	 * Links for the "done" screen.
	 *
	 * @return array
	 */
	private function links() {
		$front = (int) get_option( 'page_on_front' );
		$home  = $this->state['map']['pages'][ $this->content['front_page'] ?? '' ] ?? $front;
		$links = array( 'home' => home_url( '/' ) );
		if ( $home && class_exists( '\Elementor\Plugin' ) ) {
			$links['edit'] = add_query_arg(
				array(
					'post'   => $home,
					'action' => 'elementor',
				),
				admin_url( 'post.php' )
			);
		}
		return $links;
	}

	/* ------------------------------------------------------------------ */
	/* Uninstall                                                          */
	/* ------------------------------------------------------------------ */

	/**
	 * Remove everything a demo import created.
	 *
	 * @return \WP_REST_Response
	 */
	public static function uninstall() {
		$ids = get_posts(
			array(
				'post_type'      => 'any',
				'post_status'    => 'any',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'meta_key'       => self::META, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_query_meta_key -- admin action, runs once.
				'no_found_rows'  => true,
			)
		);
		$ids = array_merge(
			$ids,
			get_posts(
				array(
					'post_type'      => array( 'attachment', 'elementor_library', 'product' ),
					'post_status'    => 'any',
					'posts_per_page' => -1,
					'fields'         => 'ids',
					'meta_key'       => self::META, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_query_meta_key -- admin action, runs once.
					'no_found_rows'  => true,
				)
			)
		);
		$front = (int) get_option( 'page_on_front' );
		foreach ( array_unique( array_map( 'intval', $ids ) ) as $id ) {
			if ( 'attachment' === get_post_type( $id ) ) {
				wp_delete_attachment( $id, true );
			} else {
				wp_delete_post( $id, true );
			}
		}
		if ( $front && ! get_post( $front ) ) {
			update_option( 'show_on_front', 'posts' );
			update_option( 'page_on_front', 0 );
			update_option( 'page_for_posts', 0 );
		}

		$terms = get_terms(
			array(
				'taxonomy'   => array_values( get_taxonomies() ),
				'hide_empty' => false,
				'meta_key'   => self::META, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_query_meta_key -- admin action, runs once.
				'fields'     => 'all',
			)
		);
		foreach ( is_array( $terms ) ? $terms : array() as $term ) {
			if ( 'nav_menu' === $term->taxonomy ) {
				wp_delete_nav_menu( $term->term_id );
			} else {
				wp_delete_term( $term->term_id, $term->taxonomy );
			}
		}

		delete_option( self::IMPORTED );
		delete_option( self::STATE );
		if ( class_exists( '\Elementor\Plugin' ) ) {
			\Elementor\Plugin::$instance->files_manager->clear_cache();
		}
		return rest_ensure_response(
			array(
				'ok'      => true,
				'message' => __( 'Demo content removed. Your own content was not touched.', 'hamista-core' ),
			)
		);
	}

	/* ------------------------------------------------------------------ */
	/* Helpers                                                            */
	/* ------------------------------------------------------------------ */

	/**
	 * Whether a companion plugin is active.
	 *
	 * @param string $slug elementor|woocommerce.
	 * @return bool
	 */
	private static function plugin_active( $slug ) {
		if ( 'elementor' === $slug ) {
			return did_action( 'elementor/loaded' ) > 0;
		}
		if ( 'woocommerce' === $slug ) {
			return class_exists( 'WooCommerce' );
		}
		return true;
	}

	/**
	 * Tag a post as demo content.
	 *
	 * @param int    $id  Post ID.
	 * @param string $key Stable key.
	 */
	private function tag( $id, $key ) {
		update_post_meta( $id, self::META, $this->state['demo'] );
		update_post_meta( $id, self::KEY, $key );
	}

	/**
	 * An earlier import's item for this demo and key.
	 *
	 * @param string $type Post type.
	 * @param string $key  Key.
	 * @return int
	 */
	private function find( $type, $key ) {
		$found = get_posts(
			array(
				'post_type'      => $type,
				'post_status'    => 'any',
				'posts_per_page' => 1,
				'fields'         => 'ids',
				'no_found_rows'  => true,
				'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_query_meta_query -- import only.
					array(
						'key'   => self::META,
						'value' => $this->state['demo'],
					),
					array(
						'key'   => self::KEY,
						'value' => $key,
					),
				),
			)
		);
		return $found ? (int) $found[0] : 0;
	}

	/**
	 * Insert or update a post by its demo key.
	 *
	 * @param string $type    Post type.
	 * @param string $key     Key.
	 * @param array  $postarr Post fields.
	 * @param bool   $update  Overwrite fields of an existing item.
	 * @return int
	 */
	private function upsert( $type, $key, $postarr, $update = true ) {
		$existing = $this->find( $type, $key );
		if ( $existing && ! $update ) {
			return $existing;
		}
		$postarr['post_type'] = $type;
		if ( $existing ) {
			$postarr['ID'] = $existing;
			unset( $postarr['post_date'] );
			$id = wp_update_post( wp_slash( $postarr ), true );
		} else {
			$id = wp_insert_post( wp_slash( $postarr ), true );
		}
		if ( is_wp_error( $id ) || ! $id ) {
			return 0;
		}
		$this->tag( $id, $key );
		return (int) $id;
	}

	/**
	 * Attachment ID for an image key.
	 *
	 * @param string $key Key.
	 * @return int
	 */
	private function media_id( $key ) {
		return (int) ( $this->state['map']['media'][ $key ] ?? 0 );
	}

	/**
	 * Store an Elementor layout on a page.
	 *
	 * @param int   $id       Page ID.
	 * @param array $elements Elements.
	 * @param array $settings Page settings.
	 */
	private function save_elementor( $id, $elements, $settings ) {
		update_post_meta( $id, '_elementor_edit_mode', 'builder' );
		update_post_meta( $id, '_elementor_template_type', 'wp-page' );
		update_post_meta( $id, '_elementor_version', defined( 'ELEMENTOR_VERSION' ) ? ELEMENTOR_VERSION : '3.0.0' );
		update_post_meta( $id, '_elementor_data', wp_slash( wp_json_encode( $elements ) ) );
		if ( $settings ) {
			update_post_meta( $id, '_elementor_page_settings', $settings );
		}
		delete_post_meta( $id, '_elementor_css' );
		delete_post_meta( $id, '_elementor_element_cache' );
	}

	/**
	 * Resolve tokens inside layout data.
	 *
	 * - { "__img": "key" }        → Elementor media value.
	 * - { "__gallery": [keys] }   → Elementor gallery value.
	 * - "{{...}}" inside strings  → see replace_string().
	 *
	 * @param mixed $value Data.
	 * @return mixed
	 */
	private function replace( $value ) {
		if ( is_array( $value ) ) {
			if ( isset( $value['__img'] ) && 1 === count( $value ) ) {
				return $this->media_value( $value['__img'] );
			}
			if ( isset( $value['__gallery'] ) && 1 === count( $value ) ) {
				return array_values( array_filter( array_map( array( $this, 'media_value' ), (array) $value['__gallery'] ), static function ( $m ) { return ! empty( $m['id'] ); } ) );
			}
			foreach ( $value as $k => $v ) {
				$value[ $k ] = $this->replace( $v );
			}
			return $value;
		}
		return is_string( $value ) ? $this->replace_string( $value ) : $value;
	}

	/**
	 * Elementor media control value for an image key.
	 *
	 * @param string $key Key.
	 * @return array
	 */
	private function media_value( $key ) {
		$id = $this->media_id( $key );
		return array(
			'id'     => $id,
			'url'    => $id ? (string) wp_get_attachment_url( $id ) : '',
			'alt'    => '',
			'source' => 'library',
			'size'   => '',
		);
	}

	/**
	 * Replace {{tokens}} in a string.
	 *
	 * {{home}} {{blog}} {{shop}} {{cart}} {{account}} {{page:key}} {{post:key}}
	 * {{product:key}} {{img:key}} {{imgid:key}} {{term:key}} {{termlink:key}}
	 * {{ids:key,key}} (product IDs, comma separated)
	 *
	 * @param string $text Text.
	 * @return string
	 */
	private function replace_string( $text ) {
		if ( false === strpos( $text, '{{' ) ) {
			return $text;
		}
		return preg_replace_callback(
			'/\{\{([a-z]+)(?::([a-z0-9_,-]+))?\}\}/',
			function ( $m ) {
				$type = $m[1];
				$key  = $m[2] ?? '';
				$map  = $this->state['map'];
				switch ( $type ) {
					case 'home':
						return home_url( '/' );
					case 'blog':
						$blog = $map['pages'][ $this->content['posts_page'] ?? '' ] ?? (int) get_option( 'page_for_posts' );
						return $blog ? get_permalink( $blog ) : home_url( '/' );
					case 'shop':
						return function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/' );
					case 'cart':
						return function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : home_url( '/' );
					case 'account':
						return function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : wp_login_url();
					case 'page':
						return isset( $map['pages'][ $key ] ) ? get_permalink( $map['pages'][ $key ] ) : home_url( '/' );
					case 'post':
						return isset( $map['posts'][ $key ] ) ? get_permalink( $map['posts'][ $key ] ) : home_url( '/' );
					case 'product':
						return isset( $map['products'][ $key ] ) ? get_permalink( $map['products'][ $key ] ) : home_url( '/' );
					case 'img':
						return isset( $map['media'][ $key ] ) ? (string) wp_get_attachment_url( $map['media'][ $key ] ) : '';
					case 'imgid':
						return (string) ( $map['media'][ $key ] ?? 0 );
					case 'term':
						return (string) ( $map['terms'][ $key ] ?? 0 );
					case 'termlink':
						$link = isset( $map['terms'][ $key ] ) ? get_term_link( (int) $map['terms'][ $key ] ) : '';
						return is_string( $link ) ? $link : home_url( '/' );
					case 'ids':
						$ids = array();
						foreach ( explode( ',', $key ) as $k ) {
							if ( isset( $map['products'][ $k ] ) ) {
								$ids[] = $map['products'][ $k ];
							}
						}
						return implode( ',', $ids );
				}
				return $m[0];
			},
			$text
		);
	}
}
