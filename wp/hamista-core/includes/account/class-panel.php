<?php
/**
 * Customisable WooCommerce account area: menu items in any order with your own
 * names and icons, extra tabs filled with a page or an Elementor block, links,
 * dashboard sections and a tabs layout. Everything is set in Hamista →
 * Account area; an empty menu list keeps WooCommerce's own menu.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Account;

defined( 'ABSPATH' ) || exit;

/**
 * Account panel.
 */
class Panel {

	/**
	 * Menu rows resolved from the settings (cached per request).
	 *
	 * @var array[]|null
	 */
	private static $rows = null;

	/**
	 * Hooks.
	 */
	public static function init() {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return;
		}
		add_filter( 'woocommerce_account_menu_items', array( __CLASS__, 'menu' ), 40 );
		add_filter( 'woocommerce_get_query_vars', array( __CLASS__, 'query_vars' ) );
		add_filter( 'woocommerce_get_endpoint_url', array( __CLASS__, 'link_url' ), 10, 2 );
		add_filter( 'hamista/account_icon', array( __CLASS__, 'icon' ), 10, 2 );
		add_filter( 'hamista/account_dashboard', array( __CLASS__, 'dashboard' ) );
		add_filter( 'body_class', array( __CLASS__, 'body_class' ) );
		add_action( 'init', array( __CLASS__, 'tabs' ), 20 );
		add_action( 'init', array( __CLASS__, 'maybe_flush' ), 99 );
	}

	/**
	 * Built-in menu items: key => default label.
	 *
	 * @return array
	 */
	public static function items() {
		return array(
			'dashboard'       => __( 'Dashboard', 'hamista-core' ),
			'orders'          => __( 'Orders', 'hamista-core' ),
			'appointments'    => class_exists( '\\Hamista\\Core\\Booking\\Booking' ) ? \Hamista\Core\Booking\Booking::word( 'mine' ) : __( 'My appointments', 'hamista-core' ),
			'downloads'       => __( 'Downloads', 'hamista-core' ),
			'edit-address'    => __( 'Addresses', 'hamista-core' ),
			'payment-methods' => __( 'Payment methods', 'hamista-core' ),
			'edit-account'    => __( 'Account details', 'hamista-core' ),
			'customer-logout' => __( 'Log out', 'hamista-core' ),
		);
	}

	/**
	 * Icons offered in the menu editor: name => label.
	 *
	 * @return array
	 */
	public static function icons() {
		return array(
			''         => __( 'Automatic', 'hamista-core' ),
			'grid'     => __( 'Grid', 'hamista-core' ),
			'receipt'  => __( 'Receipt', 'hamista-core' ),
			'bag'      => __( 'Bag', 'hamista-core' ),
			'calendar' => __( 'Calendar', 'hamista-core' ),
			'clock'    => __( 'Clock', 'hamista-core' ),
			'download' => __( 'Download', 'hamista-core' ),
			'pin'      => __( 'Location', 'hamista-core' ),
			'card'     => __( 'Bank card', 'hamista-core' ),
			'user'     => __( 'Person', 'hamista-core' ),
			'heart'    => __( 'Heart', 'hamista-core' ),
			'mail'     => __( 'Envelope', 'hamista-core' ),
			'phone'    => __( 'Phone', 'hamista-core' ),
			'folder'   => __( 'Folder', 'hamista-core' ),
			'tag'      => __( 'Tag', 'hamista-core' ),
			'link'     => __( 'Link', 'hamista-core' ),
			'check'    => __( 'Tick', 'hamista-core' ),
			'logout'   => __( 'Exit', 'hamista-core' ),
		);
	}

	/**
	 * Menu rows from the settings, with keys and slugs worked out.
	 *
	 * @return array[] { key, item, label, icon, content, url }
	 */
	public static function rows() {
		if ( null !== self::$rows ) {
			return self::$rows;
		}
		self::$rows = array();
		$used       = array();
		foreach ( (array) hamista_core_option( 'account_menu', array() ) as $i => $row ) {
			$item = (string) ( $row['item'] ?? '' );
			if ( '' === $item ) {
				continue;
			}
			$label = trim( (string) ( $row['label'] ?? '' ) );
			if ( 'page' === $item ) {
				$slug = sanitize_title( (string) ( $row['slug'] ?? '' ) );
				$slug = '' !== $slug ? $slug : 'tab-' . ( $i + 1 );
				if ( isset( self::items()[ $slug ] ) ) {
					$slug .= '-tab';
				}
				$key = $slug;
			} elseif ( 'link' === $item ) {
				$key = 'hm-link-' . ( $i + 1 );
			} else {
				$key = $item;
			}
			if ( isset( $used[ $key ] ) ) {
				continue;
			}
			$used[ $key ] = true;
			self::$rows[] = array(
				'key'     => $key,
				'item'    => $item,
				'label'   => $label,
				'icon'    => sanitize_key( (string) ( $row['icon'] ?? '' ) ),
				'content' => (int) ( $row['content'] ?? 0 ),
				'url'     => esc_url_raw( (string) ( $row['url'] ?? '' ) ),
			);
		}
		return self::$rows;
	}

	/**
	 * Rebuild the account menu from the settings.
	 *
	 * @param array $items WooCommerce items: endpoint => label.
	 * @return array
	 */
	public static function menu( $items ) {
		$rows = self::rows();
		if ( ! $rows ) {
			return $items;
		}
		$defaults = self::items();
		$out      = array();
		foreach ( $rows as $row ) {
			if ( 'page' === $row['item'] || 'link' === $row['item'] ) {
				if ( '' !== $row['label'] && ( 'page' === $row['item'] || '' !== $row['url'] ) ) {
					$out[ $row['key'] ] = $row['label'];
				}
				continue;
			}
			// Built-in pages only show while WooCommerce (or the booking module) offers them.
			$always = in_array( $row['key'], array( 'dashboard', 'customer-logout' ), true );
			if ( ! $always && ! isset( $items[ $row['key'] ] ) ) {
				continue;
			}
			$out[ $row['key'] ] = '' !== $row['label'] ? $row['label'] : ( $items[ $row['key'] ] ?? $defaults[ $row['key'] ] ?? $row['key'] );
		}
		return $out ? $out : $items;
	}

	/**
	 * Register the slugs of custom tabs as account endpoints.
	 *
	 * @param array $vars Query vars.
	 * @return array
	 */
	public static function query_vars( $vars ) {
		foreach ( self::rows() as $row ) {
			if ( 'page' === $row['item'] ) {
				$vars[ $row['key'] ] = $row['key'];
			}
		}
		return $vars;
	}

	/**
	 * Content and titles of custom tabs.
	 */
	public static function tabs() {
		foreach ( self::rows() as $row ) {
			if ( 'page' !== $row['item'] && 'link' !== $row['item'] && 'dashboard' !== $row['item'] && '' !== $row['label'] ) {
				add_filter(
					'woocommerce_endpoint_' . $row['key'] . '_title',
					static function () use ( $row ) {
						return $row['label'];
					},
					20
				);
			}
			if ( 'page' !== $row['item'] ) {
				continue;
			}
			add_action(
				'woocommerce_account_' . $row['key'] . '_endpoint',
				static function () use ( $row ) {
					$html = $row['content'] ? hamista_core_render_content( $row['content'] ) : '';
					echo '<div class="hm-account-tab">' . ( '' !== $html ? $html : '<p class="hm-account-tab__empty">' . esc_html__( 'Choose the content of this tab in Hamista → Account area.', 'hamista-core' ) . '</p>' ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Elementor or post content.
				}
			);
			add_filter(
				'woocommerce_endpoint_' . $row['key'] . '_title',
				static function ( $title ) use ( $row ) {
					return '' !== $row['label'] ? $row['label'] : $title;
				}
			);
		}
	}

	/**
	 * Link items point wherever they were set to.
	 *
	 * @param string $url      Endpoint URL.
	 * @param string $endpoint Endpoint.
	 * @return string
	 */
	public static function link_url( $url, $endpoint ) {
		foreach ( self::rows() as $row ) {
			if ( 'link' === $row['item'] && $row['key'] === $endpoint && '' !== $row['url'] ) {
				return $row['url'];
			}
		}
		return $url;
	}

	/**
	 * Chosen icons, and a sensible one for custom tabs.
	 *
	 * @param string $icon     Icon name.
	 * @param string $endpoint Endpoint.
	 * @return string
	 */
	public static function icon( $icon, $endpoint ) {
		foreach ( self::rows() as $row ) {
			if ( $row['key'] !== $endpoint ) {
				continue;
			}
			if ( '' !== $row['icon'] ) {
				return $row['icon'];
			}
			if ( 'link' === $row['item'] ) {
				return 'link';
			}
		}
		return $icon;
	}

	/**
	 * Dashboard sections and extra content for the theme's dashboard template.
	 *
	 * @param array $dash Defaults from the theme.
	 * @return array
	 */
	public static function dashboard( $dash ) {
		$dash['greeting'] = (bool) hamista_core_option( 'account_dash_greeting', true );
		$dash['cards']    = (bool) hamista_core_option( 'account_dash_cards', true );
		$dash['orders']   = (bool) hamista_core_option( 'account_dash_orders', true );
		$text             = trim( (string) hamista_core_option( 'account_dash_text', '' ) );
		if ( '' !== $text ) {
			$dash['text'] = $text;
		}
		$block = (int) hamista_core_option( 'account_dash_block', 0 );
		if ( $block ) {
			$place = (string) hamista_core_option( 'account_dash_block_place', 'after' );
			$place = in_array( $place, array( 'before', 'after', 'replace' ), true ) ? $place : 'after';
			$html  = hamista_core_render_content( $block );
			if ( '' !== $html ) {
				$dash[ $place ] = $html;
			}
		}
		return $dash;
	}

	/**
	 * Tabs layout class on account pages.
	 *
	 * @param array $classes Body classes.
	 * @return array
	 */
	public static function body_class( $classes ) {
		if ( 'tabs' === hamista_core_option( 'account_layout', 'side' ) && function_exists( 'is_account_page' ) && is_account_page() ) {
			$classes[] = 'hm-account-tabs';
		}
		return $classes;
	}

	/**
	 * Refresh permalinks when the custom tab addresses change.
	 */
	public static function maybe_flush() {
		$slugs = array();
		foreach ( self::rows() as $row ) {
			if ( 'page' === $row['item'] ) {
				$slugs[] = $row['key'];
			}
		}
		$hash = md5( implode( '|', $slugs ) );
		if ( get_option( 'hamista_account_endpoints' ) !== $hash ) {
			flush_rewrite_rules( false );
			update_option( 'hamista_account_endpoints', $hash, true );
		}
	}
}
