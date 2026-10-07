<?php
/**
 * Demo registry. Each demo is a folder in demos/ with a small manifest.json
 * (read for the admin screen) and a content.json (read only while importing).
 *
 * Third-party demo packs can register more folders with the
 * `hamista_core/demo_dirs` filter.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Demos;

defined( 'ABSPATH' ) || exit;

/**
 * Demos.
 */
class Demos {

	/**
	 * Folders that hold demos: path => URL.
	 *
	 * @return array
	 */
	public static function dirs() {
		return apply_filters(
			'hamista_core/demo_dirs',
			array( HAMISTA_CORE_DIR . 'demos/' => HAMISTA_CORE_URL . 'demos/' )
		);
	}

	/**
	 * All demos, sorted by their `order` field.
	 *
	 * @return array id => manifest (plus `path` and `url`).
	 */
	public static function all() {
		static $demos = null;
		if ( null !== $demos ) {
			return $demos;
		}
		$demos = array();
		foreach ( self::dirs() as $dir => $url ) {
			foreach ( (array) glob( trailingslashit( $dir ) . '*/manifest.json' ) as $file ) {
				$manifest = json_decode( (string) file_get_contents( $file ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- local file.
				if ( ! is_array( $manifest ) || empty( $manifest['id'] ) ) {
					continue;
				}
				$folder                                   = basename( dirname( $file ) );
				$manifest['path']                         = trailingslashit( dirname( $file ) );
				$manifest['url']                          = trailingslashit( $url ) . $folder . '/';
				$demos[ sanitize_key( $manifest['id'] ) ] = $manifest;
			}
		}
		uasort(
			$demos,
			static function ( $a, $b ) {
				return ( $a['order'] ?? 99 ) <=> ( $b['order'] ?? 99 );
			}
		);
		return $demos;
	}

	/**
	 * One demo's manifest.
	 *
	 * @param string $id Demo ID.
	 * @return array|null
	 */
	public static function get( $id ) {
		$demos = self::all();
		return $demos[ sanitize_key( $id ) ] ?? null;
	}

	/**
	 * A demo's full content (pages, posts, products, menus, settings).
	 *
	 * @param string $id Demo ID.
	 * @return array|null
	 */
	public static function content( $id ) {
		$demo = self::get( $id );
		if ( ! $demo || ! is_readable( $demo['path'] . 'content.json' ) ) {
			return null;
		}
		$content = json_decode( (string) file_get_contents( $demo['path'] . 'content.json' ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- local file.
		return is_array( $content ) ? $content : null;
	}

	/**
	 * Absolute path of a demo image, by key (resolved against the demo folder).
	 *
	 * @param array  $demo Manifest.
	 * @param string $file Relative file path from content.json.
	 * @return string Path, or '' when missing or outside the demos folders.
	 */
	public static function file( $demo, $file ) {
		$path = realpath( $demo['path'] . $file );
		if ( ! $path || ! is_readable( $path ) ) {
			return '';
		}
		foreach ( array_keys( self::dirs() ) as $dir ) {
			$root = realpath( $dir );
			if ( $root && 0 === strpos( $path, $root ) ) {
				return $path;
			}
		}
		return '';
	}

	/**
	 * Data for the admin app's demo screen.
	 *
	 * @return array
	 */
	public static function for_admin() {
		$list = array();
		foreach ( self::all() as $id => $demo ) {
			$list[] = array(
				'id'          => $id,
				'title'       => $demo['title'] ?? $id,
				'desc'        => $demo['desc'] ?? '',
				'kit'         => $demo['kit'] ?? '',
				'thumb'       => ! empty( $demo['thumb'] ) ? $demo['url'] . $demo['thumb'] : '',
				'preview'     => $demo['preview'] ?? '',
				'pages'       => array_values( (array) ( $demo['pages'] ?? array() ) ),
				'required'    => array_values( (array) ( $demo['required'] ?? array( 'elementor' ) ) ),
				'recommended' => array_values( (array) ( $demo['recommended'] ?? array() ) ),
				'tags'        => array_values( (array) ( $demo['tags'] ?? array() ) ),
			);
		}
		return $list;
	}
}
