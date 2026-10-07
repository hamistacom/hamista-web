<?php
/**
 * Admin screen: the "Hamista" menu and the settings app shell.
 *
 * Everything inside the page is rendered by assets/admin/admin.js from the data
 * printed here (window.hamistaAdmin), so this class only registers menus, loads
 * assets on its own screen and gathers that data.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Admin;

use Hamista\Core\Settings\Settings;

defined( 'ABSPATH' ) || exit;

/**
 * Admin.
 */
class Admin {

	const SLUG       = 'hamista';
	const CAPABILITY = 'manage_options';

	/**
	 * Screen hook suffix of the app page.
	 *
	 * @var string
	 */
	private static $hook = '';

	/**
	 * Hooks.
	 */
	public static function init() {
		// REST routes: registered on every request (REST calls are not is_admin()).
		Tools::init();

		if ( ! is_admin() ) {
			return;
		}

		add_action( 'admin_menu', array( __CLASS__, 'menu' ), 9 );
		add_action( 'admin_menu', array( __CLASS__, 'post_type_menus' ), 20 );
		add_action( 'admin_init', array( __CLASS__, 'welcome_redirect' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue' ) );
		add_action( 'in_admin_header', array( __CLASS__, 'hide_notices' ), 1000 );
		add_filter( 'admin_body_class', array( __CLASS__, 'body_class' ) );
	}

	/**
	 * Top-level menu and the app's own submenus.
	 */
	public static function menu() {
		self::$hook = add_menu_page(
			__( 'Hamista', 'hamista-core' ),
			__( 'Hamista', 'hamista-core' ),
			self::CAPABILITY,
			self::SLUG,
			array( __CLASS__, 'render' ),
			self::menu_icon(),
			59
		);

		add_submenu_page(
			self::SLUG,
			__( 'Hamista settings', 'hamista-core' ),
			__( 'Settings', 'hamista-core' ),
			self::CAPABILITY,
			self::SLUG,
			array( __CLASS__, 'render' )
		);

		// A plain link into the app: no callback, so WordPress prints the URL as-is.
		add_submenu_page(
			self::SLUG,
			__( 'Demo import', 'hamista-core' ),
			__( 'Demo import', 'hamista-core' ),
			self::CAPABILITY,
			'admin.php?page=' . self::SLUG . '#demos'
		);
	}

	/**
	 * Links to the templates and form-message post types, when those modules are loaded.
	 */
	public static function post_type_menus() {
		$items = array(
			'hm_layout'  => __( 'Templates', 'hamista-core' ),
			'hm_message' => __( 'Form messages', 'hamista-core' ),
		);
		foreach ( $items as $post_type => $label ) {
			$object = get_post_type_object( $post_type );
			// A post type registered with show_in_menu => 'hamista' already gets its own entry.
			if ( ! $object || self::SLUG === $object->show_in_menu ) {
				continue;
			}
			add_submenu_page(
				self::SLUG,
				$label,
				$label,
				$object->cap->edit_posts,
				'edit.php?post_type=' . $post_type
			);
		}
	}

	/**
	 * Monochrome "H" monogram for the admin menu. WordPress recolours the fill to match
	 * the admin colour scheme, so the SVG must be base64 encoded and use `fill`.
	 *
	 * @return string
	 */
	private static function menu_icon() {
		$svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="black" fill-rule="evenodd" d="M5 2h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Zm1.5 3.5v9h2.25v-3.6h2.5v3.6h2.25v-9h-2.25v3.4h-2.5V5.5Z"/></svg>';
		return 'data:image/svg+xml;base64,' . base64_encode( $svg ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
	}

	/**
	 * Whether the current request is the app screen.
	 *
	 * @return bool
	 */
	private static function is_app_screen() {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		return $screen && self::$hook && self::$hook === $screen->id;
	}

	/**
	 * Body class used to give the page its own canvas.
	 *
	 * @param string $classes Classes.
	 * @return string
	 */
	public static function body_class( $classes ) {
		if ( self::is_app_screen() ) {
			$classes .= ' hm-admin-screen';
		}
		return $classes;
	}

	/**
	 * After activation, open the app once.
	 */
	public static function welcome_redirect() {
		if ( ! get_transient( 'hamista_core_welcome' ) ) {
			return;
		}
		if ( wp_doing_ajax() || is_network_admin() || ! current_user_can( self::CAPABILITY ) ) {
			return;
		}
		delete_transient( 'hamista_core_welcome' );

		// Bulk activation: do not hijack the redirect back to the plugins list.
		if ( isset( $_GET['activate-multi'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}

		wp_safe_redirect( admin_url( 'admin.php?page=' . self::SLUG ) );
		exit;
	}

	/**
	 * Keep other plugins' notices out of the app.
	 */
	public static function hide_notices() {
		if ( ! self::is_app_screen() ) {
			return;
		}
		remove_all_actions( 'admin_notices' );
		remove_all_actions( 'all_admin_notices' );
		remove_all_actions( 'user_admin_notices' );
		remove_all_actions( 'network_admin_notices' );
	}

	/**
	 * Assets, only on the app screen.
	 *
	 * @param string $hook Current screen hook suffix.
	 */
	public static function enqueue( $hook ) {
		if ( ! self::$hook || self::$hook !== $hook ) {
			return;
		}

		$css = 'assets/admin/admin.css';
		$js  = 'assets/admin/admin.js';

		wp_enqueue_media();

		// Syntax highlighting for code fields. False when the user turned it off in their profile.
		$code_editor = array(
			'css'  => wp_enqueue_code_editor( array( 'type' => 'text/css' ) ),
			'html' => wp_enqueue_code_editor( array( 'type' => 'text/html' ) ),
		);

		$deps = array( 'media-editor' );
		if ( $code_editor['css'] || $code_editor['html'] ) {
			$deps[] = 'code-editor';
		}

		wp_enqueue_style( 'hamista-admin', HAMISTA_CORE_URL . $css, array(), self::asset_version( $css ) );
		wp_enqueue_script( 'hamista-admin', HAMISTA_CORE_URL . $js, $deps, self::asset_version( $js ), true );

		$font_css = self::font_css();
		if ( $font_css ) {
			wp_add_inline_style( 'hamista-admin', $font_css );
		}

		$data               = self::data();
		$data['codeEditor'] = $code_editor;

		/**
		 * Data handed to the admin app. Other modules add keys here (demos, lastTestCode, ...).
		 *
		 * @param array $data App data.
		 */
		$data = apply_filters( 'hamista_core/admin_data', $data );

		// JSON (not wp_localize_script) keeps booleans and numbers typed; HEX flags keep
		// stored HTML such as `</script>` in code fields from closing the tag.
		wp_add_inline_script(
			'hamista-admin',
			'window.hamistaAdmin = ' . wp_json_encode( $data, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE ) . ';',
			'before'
		);
	}

	/**
	 * Version string for cache busting (file time while developing).
	 *
	 * @param string $file Path relative to the plugin.
	 * @return string
	 */
	private static function asset_version( $file ) {
		$path = HAMISTA_CORE_DIR . $file;
		return HAMISTA_CORE_VERSION . ( is_readable( $path ) ? '.' . filemtime( $path ) : '' );
	}

	/**
	 * Admin UI font: the theme's bundled Vazirmatn when present.
	 *
	 * @return string CSS, or '' to fall back to the system font.
	 */
	public static function font_css() {
		$dir = get_template_directory() . '/assets/fonts/vazirmatn/';
		if ( ! file_exists( $dir . 'vazirmatn-arabic.woff2' ) ) {
			return '';
		}
		$url   = get_template_directory_uri() . '/assets/fonts/vazirmatn/';
		$faces = array(
			'vazirmatn-arabic.woff2' => 'U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC',
			'vazirmatn-latin.woff2'  => 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
		);

		$css = '';
		foreach ( $faces as $file => $range ) {
			if ( ! file_exists( $dir . $file ) ) {
				continue;
			}
			$css .= '@font-face{font-family:"Vazirmatn";src:url(' . esc_url( $url . $file ) . ') format("woff2");font-weight:100 900;font-style:normal;font-display:swap;unicode-range:' . $range . ';}';
		}
		return $css . '.hm-admin{--hm-a-font:"Vazirmatn",system-ui,-apple-system,"Segoe UI",Tahoma,sans-serif;}';
	}

	/**
	 * Page markup: one root node; the app renders into it.
	 */
	public static function render() {
		if ( ! current_user_can( self::CAPABILITY ) ) {
			return;
		}
		?>
		<div id="hamista-admin" class="hm-admin" dir="<?php echo is_rtl() ? 'rtl' : 'ltr'; ?>">
			<noscript>
				<div class="hm-noscript">
					<strong><?php esc_html_e( 'Hamista settings need JavaScript.', 'hamista-core' ); ?></strong>
					<?php esc_html_e( 'Please enable JavaScript in your browser, then reload this page.', 'hamista-core' ); ?>
				</div>
			</noscript>
			<div class="hm-boot" aria-hidden="true"></div>
		</div>
		<?php
	}

	/**
	 * Everything the app needs.
	 *
	 * @return array
	 */
	private static function data() {
		return array(
			'version' => HAMISTA_CORE_VERSION,
			'schema'  => Settings::schema(),
			'values'  => Settings::admin_values(),
			'rest'    => array(
				'root'  => esc_url_raw( rest_url( 'hamista/v1/' ) ),
				'nonce' => wp_create_nonce( 'wp_rest' ),
			),
			'demos'   => array(),
			'plugins' => self::plugins(),
			'system'  => self::system(),
			'links'   => self::links(),
			'rtl'     => is_rtl(),
			'i18n'    => self::i18n(),
		);
	}

	/**
	 * Install/activation status of the companion plugins.
	 *
	 * @return array slug => { installed, active, name }
	 */
	private static function plugins() {
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		$installed = get_plugins();
		$known     = array(
			'elementor'   => array( 'elementor/elementor.php', 'Elementor' ),
			'woocommerce' => array( 'woocommerce/woocommerce.php', 'WooCommerce' ),
		);

		$plugins = array();
		foreach ( $known as $slug => $info ) {
			list( $file, $name ) = $info;
			$plugins[ $slug ]    = array(
				'installed' => isset( $installed[ $file ] ),
				'active'    => is_plugin_active( $file ),
				'name'      => isset( $installed[ $file ]['Name'] ) ? $installed[ $file ]['Name'] : $name,
			);
		}
		return $plugins;
	}

	/**
	 * System status rows. `ok` is true (fine), false (needs attention) or null (informational).
	 *
	 * @return array
	 */
	private static function system() {
		global $wp_version;

		$yes = __( 'Yes', 'hamista-core' );
		$no  = __( 'No', 'hamista-core' );

		$memory       = defined( 'WP_MEMORY_LIMIT' ) ? WP_MEMORY_LIMIT : ini_get( 'memory_limit' );
		$memory_bytes = wp_convert_hr_to_bytes( $memory );
		$unlimited    = '-1' === (string) ini_get( 'memory_limit' );
		$upload       = wp_max_upload_size();

		$elementor_active = defined( 'ELEMENTOR_VERSION' );
		$woo_active       = class_exists( 'WooCommerce' );
		$theme            = wp_get_theme( get_template() );
		$is_hamista       = 'hamista' === get_template();

		$rows = array(
			array(
				'label' => __( 'PHP version', 'hamista-core' ),
				'value' => PHP_VERSION,
				'ok'    => version_compare( PHP_VERSION, '7.4', '>=' ),
			),
			array(
				'label' => __( 'WordPress version', 'hamista-core' ),
				'value' => $wp_version,
				'ok'    => version_compare( $wp_version, '6.4', '>=' ),
			),
			array(
				'label' => __( 'Memory limit', 'hamista-core' ),
				'value' => $unlimited ? __( 'Unlimited', 'hamista-core' ) : size_format( $memory_bytes ),
				'ok'    => $unlimited || $memory_bytes >= 256 * MB_IN_BYTES,
			),
			array(
				'label' => __( 'Max upload size', 'hamista-core' ),
				'value' => size_format( $upload ),
				'ok'    => $upload >= 8 * MB_IN_BYTES,
			),
			array(
				'label' => __( 'Elementor', 'hamista-core' ),
				'value' => $elementor_active ? ELEMENTOR_VERSION : __( 'Not active', 'hamista-core' ),
				'ok'    => $elementor_active,
			),
			array(
				'label' => __( 'WooCommerce', 'hamista-core' ),
				'value' => $woo_active && defined( 'WC_VERSION' ) ? WC_VERSION : __( 'Not active (optional)', 'hamista-core' ),
				'ok'    => $woo_active ? true : null,
			),
			array(
				'label' => __( 'Hamista theme active', 'hamista-core' ),
				'value' => $is_hamista ? $yes : $theme->get( 'Name' ),
				'ok'    => $is_hamista,
			),
			array(
				'label' => __( 'Child theme active', 'hamista-core' ),
				'value' => is_child_theme() ? $yes : __( 'No — recommended for custom code', 'hamista-core' ),
				'ok'    => is_child_theme() ? true : null,
			),
			array(
				'label' => __( 'Pretty permalinks', 'hamista-core' ),
				'value' => get_option( 'permalink_structure' ) ? $yes : $no,
				'ok'    => (bool) get_option( 'permalink_structure' ),
			),
			array(
				'label' => __( 'HTTPS', 'hamista-core' ),
				'value' => ( is_ssl() || 0 === strpos( home_url(), 'https://' ) ) ? $yes : $no,
				'ok'    => is_ssl() || 0 === strpos( home_url(), 'https://' ),
			),
			array(
				'label' => __( 'Hamista Core version', 'hamista-core' ),
				'value' => HAMISTA_CORE_VERSION,
				'ok'    => true,
			),
		);

		return $rows;
	}

	/**
	 * Quick links.
	 *
	 * @return array
	 */
	private static function links() {
		return array(
			'templates' => post_type_exists( 'hm_layout' ) ? admin_url( 'edit.php?post_type=hm_layout' ) : '',
			'messages'  => post_type_exists( 'hm_message' ) ? admin_url( 'edit.php?post_type=hm_message' ) : '',
			'menus'     => current_theme_supports( 'menus' ) ? admin_url( 'nav-menus.php' ) : '',
			'widgets'   => current_theme_supports( 'widgets' ) ? admin_url( 'widgets.php' ) : '',
			'customize' => admin_url( 'customize.php' ),
			'plugins'   => admin_url( 'plugins.php' ),
			'site'      => home_url( '/' ),
			'docs'      => 'https://hamista.com/docs',
		);
	}

	/**
	 * UI strings used by admin.js.
	 *
	 * @return array
	 */
	private static function i18n() {
		return array(
			// Shell.
			'appName'          => __( 'Hamista', 'hamista-core' ),
			'navLabel'         => __( 'Settings sections', 'hamista-core' ),
			'navSettings'      => __( 'Settings', 'hamista-core' ),
			'search'           => __( 'Search settings', 'hamista-core' ),
			'searchClear'      => __( 'Clear search', 'hamista-core' ),
			/* translators: %s: the search term. */
			'searchFor'        => __( 'Results for “%s”', 'hamista-core' ),
			/* translators: %s: the search term. */
			'searchNone'       => __( 'No settings match “%s”.', 'hamista-core' ),
			'searchNoneHint'   => __( 'Try a shorter word, or browse the sections on the side.', 'hamista-core' ),
			'resultOne'        => __( '1 setting', 'hamista-core' ),
			/* translators: %d: number of settings. */
			'resultMany'       => __( '%d settings', 'hamista-core' ),
			'openSection'      => __( 'Open section', 'hamista-core' ),
			/* translators: %s: label of the setting this one depends on. */
			'dependsOn'        => __( 'Applies when: %s', 'hamista-core' ),
			'docs'             => __( 'Documentation', 'hamista-core' ),
			'viewSite'         => __( 'View site', 'hamista-core' ),
			'newTab'           => __( '(opens in a new tab)', 'hamista-core' ),
			'unsavedDot'       => __( 'Has unsaved changes', 'hamista-core' ),
			'listSep'          => _x( ', ', 'list separator', 'hamista-core' ),

			// Save bar.
			'unsaved'          => __( 'Unsaved changes', 'hamista-core' ),
			/* translators: %d: number of unsaved changes. */
			'unsavedCount'     => __( '%d unsaved changes', 'hamista-core' ),
			'allSaved'         => __( 'All changes saved', 'hamista-core' ),
			'save'             => __( 'Save changes', 'hamista-core' ),
			'saving'           => __( 'Saving…', 'hamista-core' ),
			'saved'            => __( 'Settings saved.', 'hamista-core' ),
			'discard'          => __( 'Discard', 'hamista-core' ),
			'discarded'        => __( 'Changes discarded.', 'hamista-core' ),
			'shortcutSave'     => __( 'Ctrl + S', 'hamista-core' ),
			'shortcutSaveMac'  => __( '⌘ S', 'hamista-core' ),
			'leaveWarning'     => __( 'You have unsaved changes. Leave anyway?', 'hamista-core' ),

			// Sections.
			'resetSection'     => __( 'Reset section', 'hamista-core' ),
			/* translators: %s: section name. */
			'resetSectionQ'    => __( 'Reset “%s”?', 'hamista-core' ),
			'resetSectionMsg'  => __( 'Every setting in this section goes back to its default. Other sections are not affected.', 'hamista-core' ),
			'reset'            => __( 'Reset', 'hamista-core' ),
			'resetDone'        => __( 'Section reset to defaults.', 'hamista-core' ),
			'cancel'           => __( 'Cancel', 'hamista-core' ),
			'close'            => __( 'Close', 'hamista-core' ),
			'confirm'          => __( 'Confirm', 'hamista-core' ),

			// Fields.
			'colorDefault'     => __( 'Style kit default', 'hamista-core' ),
			'colorPick'        => __( 'Pick a color', 'hamista-core' ),
			'colorPresets'     => __( 'Suggested colors', 'hamista-core' ),
			'colorClear'       => __( 'Use default', 'hamista-core' ),
			'colorInvalid'     => __( 'Use a hex color like #0052FF.', 'hamista-core' ),
			'show'             => __( 'Show', 'hamista-core' ),
			'hide'             => __( 'Hide', 'hamista-core' ),
			'mediaChoose'      => __( 'Choose image', 'hamista-core' ),
			'mediaReplace'     => __( 'Replace', 'hamista-core' ),
			'mediaRemove'      => __( 'Remove', 'hamista-core' ),
			'mediaTitle'       => __( 'Select an image', 'hamista-core' ),
			'mediaUse'         => __( 'Use this image', 'hamista-core' ),
			'mediaNone'        => __( 'No image selected', 'hamista-core' ),
			'mediaUnavailable' => __( 'The media library could not be loaded. Reload the page and try again.', 'hamista-core' ),
			'rowAdd'           => __( 'Add item', 'hamista-core' ),
			'rowEmpty'         => __( 'Nothing here yet.', 'hamista-core' ),
			'rowUp'            => __( 'Move up', 'hamista-core' ),
			'rowDown'          => __( 'Move down', 'hamista-core' ),
			'rowRemove'        => __( 'Remove', 'hamista-core' ),
			/* translators: %d: item number in a repeating list. */
			'rowLabel'         => __( 'Item %d', 'hamista-core' ),
			'codeHint'         => __( 'Syntax highlighting is off in your profile, so this is a plain text box.', 'hamista-core' ),

			// Fonts.
			'fontAddFamily'    => __( 'Add family', 'hamista-core' ),
			'fontFamilyName'   => __( 'Family name', 'hamista-core' ),
			'fontFamilyPh'     => __( 'e.g. Yekan Bakh', 'hamista-core' ),
			'fontFamilyExists' => __( 'A family with this name already exists.', 'hamista-core' ),
			'fontFamilyEmpty'  => __( 'Enter a family name first.', 'hamista-core' ),
			'fontUpload'       => __( 'Upload font files', 'hamista-core' ),
			/* translators: %s: font family name. */
			'fontUploadTitle'  => __( 'Font files for “%s”', 'hamista-core' ),
			'fontUse'          => __( 'Add to family', 'hamista-core' ),
			'fontRemoveFamily' => __( 'Remove family', 'hamista-core' ),
			'fontRemoveFile'   => __( 'Remove file', 'hamista-core' ),
			'fontNoFiles'      => __( 'No files yet. Upload woff2, woff, ttf or otf files.', 'hamista-core' ),
			/* translators: %d: number of skipped files. */
			'fontNotFont'      => __( 'Skipped %d file(s) that are not fonts.', 'hamista-core' ),
			/* translators: %d: number of font files. */
			'fontFiles'        => __( '%d files', 'hamista-core' ),
			'fontFileOne'      => __( '1 file', 'hamista-core' ),
			'fontWeight'       => __( 'Weight', 'hamista-core' ),
			'fontStyle'        => __( 'Style', 'hamista-core' ),
			'fontNormal'       => __( 'Normal', 'hamista-core' ),
			'fontItalic'       => __( 'Italic', 'hamista-core' ),
			'fontVariable'     => __( 'Variable (100–900)', 'hamista-core' ),
			'fontSample'       => 'سلام، این یک متن نمونه است ۱۲۳۴',
			'fontSampleShort'  => 'ابجد Aa ۱۲۳',
			'fontEmpty'        => __( 'No custom fonts yet. Add a family, then upload its files.', 'hamista-core' ),
			'fontReloadHint'   => __( 'New families appear in the font menus below after you save and reload.', 'hamista-core' ),
			'w100'             => __( 'Thin', 'hamista-core' ),
			'w200'             => __( 'Extra light', 'hamista-core' ),
			'w300'             => __( 'Light', 'hamista-core' ),
			'w400'             => __( 'Regular', 'hamista-core' ),
			'w500'             => __( 'Medium', 'hamista-core' ),
			'w600'             => __( 'Semi bold', 'hamista-core' ),
			'w700'             => __( 'Bold', 'hamista-core' ),
			'w800'             => __( 'Extra bold', 'hamista-core' ),
			'w900'             => __( 'Black', 'hamista-core' ),
			'w950'             => __( 'Extra black', 'hamista-core' ),

			// Actions.
			'actionSaveFirst'  => __( 'Save your changes in this section first.', 'hamista-core' ),
			'actionWorking'    => __( 'Sending…', 'hamista-core' ),
			'actionMissing'    => __( 'Enter a value first.', 'hamista-core' ),
			/* translators: %s: the one-time code. */
			'lastTestCode'     => __( 'Last test code: %s', 'hamista-core' ),

			// Requests.
			'requestFailed'    => __( 'Something went wrong. Please try again.', 'hamista-core' ),
			'sessionExpired'   => __( 'Your session has expired. Reload the page and try again.', 'hamista-core' ),
			'offline'          => __( 'Could not reach the server. Check your connection.', 'hamista-core' ),

			// Dashboard.
			'welcome'          => __( 'Welcome to Hamista', 'hamista-core' ),
			'welcomeLead'      => __( 'Style, header, login, motion and more — everything that shapes your site lives here. A few steps get you from a fresh install to a finished site.', 'hamista-core' ),
			/* translators: %s: version number. */
			'versionLabel'     => __( 'Version %s', 'hamista-core' ),
			'getStarted'       => __( 'Get started', 'hamista-core' ),
			/* translators: 1: number of finished steps, 2: total number of steps. */
			'stepsDone'        => __( '%1$d of %2$d done', 'hamista-core' ),
			'stepDemo'         => __( 'Import a demo', 'hamista-core' ),
			'stepDemoDesc'     => __( 'Start from finished pages, menus and a style kit.', 'hamista-core' ),
			'stepLogo'         => __( 'Upload your logo', 'hamista-core' ),
			'stepLogoDesc'     => __( 'Shown in the header, with an optional dark-mode version.', 'hamista-core' ),
			'stepColors'       => __( 'Pick your colors', 'hamista-core' ),
			'stepColorsDesc'   => __( 'Set the accent used for buttons, links and highlights.', 'hamista-core' ),
			'stepLogin'        => __( 'Set up mobile login', 'hamista-core' ),
			'stepLoginDesc'    => __( 'Let customers sign in with a one-time SMS code.', 'hamista-core' ),
			'done'             => __( 'Done', 'hamista-core' ),
			'open'             => __( 'Open', 'hamista-core' ),
			'plugins'          => __( 'Plugins', 'hamista-core' ),
			'pluginsManage'    => __( 'Manage', 'hamista-core' ),
			'pluginActive'     => __( 'Active', 'hamista-core' ),
			'pluginInactive'   => __( 'Installed, not active', 'hamista-core' ),
			'pluginMissing'    => __( 'Not installed', 'hamista-core' ),
			'pluginRequired'   => __( 'Required', 'hamista-core' ),
			'pluginRecommend'  => __( 'Recommended', 'hamista-core' ),
			'pluginInstall'    => __( 'Install & activate', 'hamista-core' ),
			'pluginActivate'   => __( 'Activate', 'hamista-core' ),
			'pluginWorking'    => __( 'Installing…', 'hamista-core' ),
			/* translators: %s: plugin name. */
			'pluginDone'       => __( '%s is active.', 'hamista-core' ),
			'elementorDesc'    => __( 'Page builder for every Hamista widget and template.', 'hamista-core' ),
			'wooDesc'          => __( 'Shop, cart, checkout and customer accounts.', 'hamista-core' ),
			'system'           => __( 'System status', 'hamista-core' ),
			'statusOk'         => __( 'OK', 'hamista-core' ),
			'statusWarn'       => __( 'Needs attention', 'hamista-core' ),
			'statusInfo'       => __( 'Info', 'hamista-core' ),
			'quickLinks'       => __( 'Quick links', 'hamista-core' ),
			'linkTemplates'    => __( 'Header & footer templates', 'hamista-core' ),
			'linkMessages'     => __( 'Form messages', 'hamista-core' ),
			'linkMenus'        => __( 'Menus', 'hamista-core' ),
			'linkWidgets'      => __( 'Widgets', 'hamista-core' ),
			'linkCustomize'    => __( 'Customizer', 'hamista-core' ),

			// Demos.
			'demosTitle'       => __( 'Demo import', 'hamista-core' ),
			'demosDesc'        => __( 'Start from a finished site. Pages, menus and the style kit are imported in one go; your existing content is kept.', 'hamista-core' ),
			'demosEmpty'       => __( 'No demos available yet', 'hamista-core' ),
			'demosEmptyDesc'   => __( 'Demo sites ship with Hamista Core updates. Check back after updating the plugin.', 'hamista-core' ),
			'demoPreview'      => __( 'Preview', 'hamista-core' ),
			'demoImport'       => __( 'Import', 'hamista-core' ),
			/* translators: %s: demo name. */
			'demoImportTitle'  => __( 'Import “%s”', 'hamista-core' ),
			/* translators: %d: number of pages. */
			'demoPages'        => __( '%d pages', 'hamista-core' ),
			/* translators: %s: style kit name. */
			'demoKit'          => __( 'Style kit: %s', 'hamista-core' ),
			'demoPluginsHead'  => __( 'Plugins', 'hamista-core' ),
			'demoPluginsNeed'  => __( 'Activate the required plugins to continue.', 'hamista-core' ),
			'demoOptionsHead'  => __( 'What to import', 'hamista-core' ),
			'demoOptContent'   => __( 'Content', 'hamista-core' ),
			'demoOptContentD'  => __( 'Pages, posts and products with their images.', 'hamista-core' ),
			'demoOptMenus'     => __( 'Menus', 'hamista-core' ),
			'demoOptMenusD'    => __( 'Header and footer navigation.', 'hamista-core' ),
			'demoOptSettings'  => __( 'Settings & style kit', 'hamista-core' ),
			'demoOptSettingsD' => __( 'Hamista settings, colors and Elementor kit.', 'hamista-core' ),
			'demoOptFront'     => __( 'Set as front page', 'hamista-core' ),
			'demoOptFrontD'    => __( 'Use the demo home page as your site\'s front page.', 'hamista-core' ),
			'demoKeepNote'     => __( 'Your existing pages, posts and products are kept. Imported items are tagged, so you can remove them later with “Uninstall demo content”.', 'hamista-core' ),
			'demoStart'        => __( 'Start import', 'hamista-core' ),
			'demoPreparing'    => __( 'Preparing…', 'hamista-core' ),
			'demoRunning'      => __( 'Importing — keep this window open.', 'hamista-core' ),
			'demoDone'         => __( 'Your demo is ready', 'hamista-core' ),
			'demoDoneDesc'     => __( 'Everything was imported. Take a look, then make it yours.', 'hamista-core' ),
			'demoEditHome'     => __( 'Edit home page with Elementor', 'hamista-core' ),
			'demoFailed'       => __( 'The import stopped', 'hamista-core' ),
			'demoRetry'        => __( 'Retry', 'hamista-core' ),
			'demoUninstall'    => __( 'Uninstall demo content', 'hamista-core' ),
			'demoUninstallQ'   => __( 'Remove imported demo content?', 'hamista-core' ),
			'demoUninstallMsg' => __( 'Pages, posts, products, menus and images that came from a demo are deleted. Content you created yourself is not touched.', 'hamista-core' ),
			'demoUninstallGo'  => __( 'Remove demo content', 'hamista-core' ),

			// Tools.
			'toolsTitle'       => __( 'Tools', 'hamista-core' ),
			'toolsDesc'        => __( 'Back up, move and reset your settings, and clear generated files.', 'hamista-core' ),
			'exportTitle'      => __( 'Export settings', 'hamista-core' ),
			'exportDesc'       => __( 'Download every Hamista setting as a JSON file — for backups or to copy them to another site.', 'hamista-core' ),
			'exportButton'     => __( 'Download .json', 'hamista-core' ),
			'exportDone'       => __( 'Settings file downloaded.', 'hamista-core' ),
			'importTitle'      => __( 'Import settings', 'hamista-core' ),
			'importDesc'       => __( 'Load a file exported from Hamista. Settings in the file replace the current ones.', 'hamista-core' ),
			'importButton'     => __( 'Choose file…', 'hamista-core' ),
			/* translators: %s: file name. */
			'importQ'          => __( 'Import “%s”?', 'hamista-core' ),
			'importMsg'        => __( 'Settings in this file replace your current ones. Consider exporting a backup first.', 'hamista-core' ),
			'importGo'         => __( 'Import settings', 'hamista-core' ),
			'importBad'        => __( 'This file could not be read as JSON.', 'hamista-core' ),
			'cssTitle'         => __( 'Regenerate Elementor CSS', 'hamista-core' ),
			'cssDesc'          => __( 'Clears Elementor\'s generated CSS files. Use it after changing colors, fonts or the content width if a page still looks old.', 'hamista-core' ),
			'cssButton'        => __( 'Regenerate', 'hamista-core' ),
			'cssNeedsElem'     => __( 'Elementor is not active.', 'hamista-core' ),
			'fontsTitle'       => __( 'Clear font cache', 'hamista-core' ),
			'fontsDesc'        => __( 'Re-scans the font folders. Use it after adding or replacing font files in the theme.', 'hamista-core' ),
			'fontsButton'      => __( 'Clear cache', 'hamista-core' ),
			'dangerZone'       => __( 'Danger zone', 'hamista-core' ),
			'resetAllTitle'    => __( 'Reset all settings', 'hamista-core' ),
			'resetAllDesc'     => __( 'Every Hamista setting goes back to its default. Your content, menus and templates are not touched.', 'hamista-core' ),
			'resetAllButton'   => __( 'Reset everything', 'hamista-core' ),
			'resetAllQ'        => __( 'Reset all Hamista settings?', 'hamista-core' ),
			'resetAllMsg'      => __( 'This cannot be undone. Export your settings first if you might need them again.', 'hamista-core' ),
			/* translators: %s: the word the user must type. */
			'resetAllType'     => __( 'Type %s to confirm', 'hamista-core' ),
			'resetAllWord'     => _x( 'reset', 'word typed to confirm resetting all settings', 'hamista-core' ),
			'resetAllDone'     => __( 'All settings were reset.', 'hamista-core' ),
		);
	}
}
