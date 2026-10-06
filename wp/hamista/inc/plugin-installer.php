<?php
/**
 * One-click install/activate for the bundled Hamista Core plugin.
 *
 * The plugin zip ships inside the theme (inc/plugins/hamista-core.zip), so the
 * site needs no outbound connection to finish setup.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

/**
 * Plugin file of Hamista Core, relative to the plugins folder.
 */
const HAMISTA_CORE_PLUGIN = 'hamista-core/hamista-core.php';

/**
 * Admin notice prompting to install or activate Hamista Core.
 */
function hamista_core_notice() {
	if ( defined( 'HAMISTA_CORE_VERSION' ) || ! current_user_can( 'install_plugins' ) ) {
		return;
	}
	$screen = get_current_screen();
	if ( $screen && in_array( $screen->id, array( 'update', 'plugin-install' ), true ) ) {
		return;
	}

	$installed = file_exists( WP_PLUGIN_DIR . '/' . HAMISTA_CORE_PLUGIN );
	$action    = $installed ? 'activate' : 'install';
	$url       = wp_nonce_url( admin_url( 'admin-post.php?action=hamista_core_' . $action ), 'hamista_core_' . $action );
	?>
	<div class="notice notice-info" style="display:flex;align-items:center;gap:18px;padding:14px 18px;border-inline-start-color:#0052ff">
		<div style="flex:1">
			<p style="margin:0 0 4px;font-size:15px"><strong><?php esc_html_e( 'Finish setting up Hamista', 'hamista' ); ?></strong></p>
			<p style="margin:0"><?php esc_html_e( 'Hamista Core adds the Elementor widgets, motion engine, settings panel, mobile OTP login and one-click demo import.', 'hamista' ); ?></p>
		</div>
		<a class="button button-primary button-hero" href="<?php echo esc_url( $url ); ?>">
			<?php echo $installed ? esc_html__( 'Activate Hamista Core', 'hamista' ) : esc_html__( 'Install Hamista Core', 'hamista' ); ?>
		</a>
	</div>
	<?php
}
add_action( 'admin_notices', 'hamista_core_notice' );

/**
 * Install the bundled plugin, then activate it.
 */
function hamista_core_install() {
	check_admin_referer( 'hamista_core_install' );
	if ( ! current_user_can( 'install_plugins' ) ) {
		wp_die( esc_html__( 'You are not allowed to install plugins.', 'hamista' ) );
	}

	$package = HAMISTA_DIR . '/inc/plugins/hamista-core.zip';
	if ( ! file_exists( WP_PLUGIN_DIR . '/' . HAMISTA_CORE_PLUGIN ) ) {
		if ( ! file_exists( $package ) ) {
			wp_die( esc_html__( 'The bundled plugin file is missing. Upload hamista-core.zip from the download package in Plugins → Add New.', 'hamista' ) );
		}
		require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		$upgrader = new Plugin_Upgrader( new Automatic_Upgrader_Skin() );
		$result   = $upgrader->install( $package );
		if ( is_wp_error( $result ) || ! $result ) {
			wp_die( esc_html( is_wp_error( $result ) ? $result->get_error_message() : __( 'Installation failed.', 'hamista' ) ) );
		}
	}
	hamista_core_activate_and_redirect();
}
add_action( 'admin_post_hamista_core_install', 'hamista_core_install' );

/**
 * Activate an already installed plugin.
 */
function hamista_core_activate() {
	check_admin_referer( 'hamista_core_activate' );
	if ( ! current_user_can( 'activate_plugins' ) ) {
		wp_die( esc_html__( 'You are not allowed to activate plugins.', 'hamista' ) );
	}
	hamista_core_activate_and_redirect();
}
add_action( 'admin_post_hamista_core_activate', 'hamista_core_activate' );

/**
 * Activate Hamista Core and open its welcome screen.
 */
function hamista_core_activate_and_redirect() {
	$result = activate_plugin( HAMISTA_CORE_PLUGIN );
	if ( is_wp_error( $result ) ) {
		wp_die( esc_html( $result->get_error_message() ) );
	}
	wp_safe_redirect( admin_url( 'admin.php?page=hamista' ) );
	exit;
}
