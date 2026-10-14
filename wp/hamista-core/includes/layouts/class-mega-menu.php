<?php
/**
 * Mega menu for the primary navigation.
 *
 * Two ways to build one, chosen per top-level menu item in Appearance → Menus:
 * - Columns: the item's children become column headings and their children
 *   the links under them (descriptions show as a second line).
 * - Template: a block designed in Elementor (Hamista → Templates) fills the
 *   panel, for pictures, product grids or anything else.
 *
 * The theme styles any item with the `hm-mega` class, so a plain CSS class in
 * the menu editor works too.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Layouts;

defined( 'ABSPATH' ) || exit;

/**
 * Mega menu.
 */
class Mega_Menu {

	const META = '_hm_mega';

	/**
	 * Hooks.
	 */
	public static function init() {
		add_action( 'wp_nav_menu_item_custom_fields', array( __CLASS__, 'fields' ), 10, 2 );
		add_action( 'wp_update_nav_menu_item', array( __CLASS__, 'save' ), 10, 2 );
		add_filter( 'wp_setup_nav_menu_item', array( __CLASS__, 'setup' ) );
		add_filter( 'nav_menu_css_class', array( __CLASS__, 'classes' ), 10, 4 );
		add_filter( 'walker_nav_menu_start_el', array( __CLASS__, 'panel' ), 10, 4 );
		add_filter( 'hamista/menu_item_has_panel', array( __CLASS__, 'has_panel' ), 10, 3 );
	}

	/**
	 * Template panels open like a dropdown, so the theme shows the caret.
	 *
	 * @param bool      $has_panel Has a panel.
	 * @param \WP_Post  $item      Item.
	 * @param \stdClass $args      Arguments.
	 * @return bool
	 */
	public static function has_panel( $has_panel, $item, $args ) {
		return $has_panel || ( ! empty( $item->hm_mega['template'] ) && 'template' === $item->hm_mega['mode'] && self::is_primary( $args ) );
	}

	/**
	 * Stored settings for an item.
	 *
	 * @param int $item_id Menu item ID.
	 * @return array { mode: ''|columns|template, columns: int, template: int, width: container|full }
	 */
	public static function get( $item_id ) {
		$value = get_post_meta( $item_id, self::META, true );
		return wp_parse_args(
			is_array( $value ) ? $value : array(),
			array(
				'mode'     => '',
				'columns'  => 4,
				'template' => 0,
				'width'    => 'container',
			)
		);
	}

	/**
	 * Block templates to choose from.
	 *
	 * @return \WP_Post[]
	 */
	private static function templates() {
		static $list = null;
		if ( null === $list ) {
			$list = get_posts(
				array(
					'post_type'      => Layouts::POST_TYPE,
					'post_status'    => 'publish',
					'posts_per_page' => 100,
					'orderby'        => 'title',
					'order'          => 'ASC',
					'meta_key'       => '_hm_layout_type', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
					'meta_value'     => 'block', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
				)
			);
		}
		return $list;
	}

	/**
	 * Fields in the menu editor.
	 *
	 * @param int      $item_id Item ID.
	 * @param \WP_Post $item    Item.
	 */
	public static function fields( $item_id, $item ) {
		if ( ! empty( $item->menu_item_parent ) ) {
			return;
		}
		$s    = self::get( $item_id );
		$name = 'hm_mega[' . (int) $item_id . ']';
		wp_nonce_field( 'hm_mega_' . $item_id, 'hm_mega_nonce_' . $item_id );
		?>
		<fieldset class="field-hm-mega description description-wide" style="margin:8px 0;padding:10px 12px;border:1px solid #dcdcde;border-radius:6px">
			<legend style="padding:0 4px;font-weight:600"><?php esc_html_e( 'Mega menu', 'hamista-core' ); ?></legend>
			<p>
				<label><?php esc_html_e( 'Panel', 'hamista-core' ); ?><br>
					<select name="<?php echo esc_attr( $name ); ?>[mode]" class="widefat">
						<option value="" <?php selected( $s['mode'], '' ); ?>><?php esc_html_e( 'Off (normal dropdown)', 'hamista-core' ); ?></option>
						<option value="columns" <?php selected( $s['mode'], 'columns' ); ?>><?php esc_html_e( 'Columns from the sub-items', 'hamista-core' ); ?></option>
						<option value="template" <?php selected( $s['mode'], 'template' ); ?>><?php esc_html_e( 'Elementor template', 'hamista-core' ); ?></option>
					</select>
				</label>
			</p>
			<p>
				<label><?php esc_html_e( 'Columns', 'hamista-core' ); ?><br>
					<select name="<?php echo esc_attr( $name ); ?>[columns]" class="widefat">
						<?php foreach ( array( 2, 3, 4, 5 ) as $n ) : ?>
							<option value="<?php echo (int) $n; ?>" <?php selected( (int) $s['columns'], $n ); ?>><?php echo esc_html( number_format_i18n( $n ) ); ?></option>
						<?php endforeach; ?>
					</select>
				</label>
			</p>
			<p>
				<label><?php esc_html_e( 'Template', 'hamista-core' ); ?><br>
					<select name="<?php echo esc_attr( $name ); ?>[template]" class="widefat">
						<option value="0"><?php esc_html_e( '— Choose a block template —', 'hamista-core' ); ?></option>
						<?php foreach ( self::templates() as $tpl ) : ?>
							<option value="<?php echo (int) $tpl->ID; ?>" <?php selected( (int) $s['template'], $tpl->ID ); ?>><?php echo esc_html( get_the_title( $tpl ) ); ?></option>
						<?php endforeach; ?>
					</select>
				</label>
				<span class="description"><?php esc_html_e( 'Build it under Hamista → Templates as a "Block".', 'hamista-core' ); ?></span>
			</p>
			<p>
				<label><?php esc_html_e( 'Width', 'hamista-core' ); ?><br>
					<select name="<?php echo esc_attr( $name ); ?>[width]" class="widefat">
						<option value="container" <?php selected( $s['width'], 'container' ); ?>><?php esc_html_e( 'Content width', 'hamista-core' ); ?></option>
						<option value="full" <?php selected( $s['width'], 'full' ); ?>><?php esc_html_e( 'Full width', 'hamista-core' ); ?></option>
					</select>
				</label>
			</p>
		</fieldset>
		<?php
	}

	/**
	 * Save the fields.
	 *
	 * @param int $menu_id Menu ID.
	 * @param int $item_id Item ID.
	 */
	public static function save( $menu_id, $item_id ) {
		$nonce = 'hm_mega_nonce_' . $item_id;
		if ( ! isset( $_POST[ $nonce ] ) || ! wp_verify_nonce( sanitize_key( wp_unslash( $_POST[ $nonce ] ) ), 'hm_mega_' . $item_id ) || ! current_user_can( 'edit_theme_options' ) ) {
			return;
		}
		$raw  = isset( $_POST['hm_mega'][ $item_id ] ) && is_array( $_POST['hm_mega'][ $item_id ] ) ? wp_unslash( $_POST['hm_mega'][ $item_id ] ) : array(); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- each key sanitised below.
		$mode = isset( $raw['mode'] ) ? sanitize_key( $raw['mode'] ) : '';
		if ( ! in_array( $mode, array( 'columns', 'template' ), true ) ) {
			delete_post_meta( $item_id, self::META );
			return;
		}
		update_post_meta(
			$item_id,
			self::META,
			array(
				'mode'     => $mode,
				'columns'  => isset( $raw['columns'] ) ? min( 5, max( 2, absint( $raw['columns'] ) ) ) : 4,
				'template' => isset( $raw['template'] ) ? absint( $raw['template'] ) : 0,
				'width'    => isset( $raw['width'] ) && 'full' === $raw['width'] ? 'full' : 'container',
			)
		);
	}

	/**
	 * Attach the settings to the item once, so the filters below read no meta.
	 *
	 * @param \WP_Post $item Item.
	 * @return \WP_Post
	 */
	public static function setup( $item ) {
		if ( isset( $item->ID ) && empty( $item->menu_item_parent ) ) {
			$item->hm_mega = self::get( $item->ID );
		}
		return $item;
	}

	/**
	 * Whether this is the desktop primary menu.
	 *
	 * @param \stdClass $args wp_nav_menu() arguments.
	 * @return bool
	 */
	private static function is_primary( $args ) {
		return isset( $args->theme_location, $args->menu_class ) && 'primary' === $args->theme_location && 'hm-menu' === $args->menu_class;
	}

	/**
	 * Classes on the top-level item.
	 *
	 * @param string[]  $classes Classes.
	 * @param \WP_Post  $item    Item.
	 * @param \stdClass $args    Arguments.
	 * @param int       $depth   Depth.
	 * @return string[]
	 */
	public static function classes( $classes, $item, $args, $depth ) {
		if ( $depth || empty( $item->hm_mega['mode'] ) || ! self::is_primary( $args ) ) {
			return $classes;
		}
		$s         = $item->hm_mega;
		$classes[] = 'hm-mega';
		$classes[] = 'hm-mega--c' . (int) $s['columns'];
		if ( 'full' === $s['width'] ) {
			$classes[] = 'hm-mega--full';
		}
		if ( 'template' === $s['mode'] && $s['template'] ) {
			$classes[] = 'hm-mega--template';
		}
		return array_unique( $classes );
	}

	/**
	 * Template panel after the item's link.
	 *
	 * @param string    $output Item markup.
	 * @param \WP_Post  $item   Item.
	 * @param int       $depth  Depth.
	 * @param \stdClass $args   Arguments.
	 * @return string
	 */
	public static function panel( $output, $item, $depth, $args ) {
		if ( $depth || empty( $item->hm_mega['template'] ) || 'template' !== $item->hm_mega['mode'] || ! self::is_primary( $args ) ) {
			return $output;
		}
		$id = (int) $item->hm_mega['template'];
		if ( Layouts::POST_TYPE !== get_post_type( $id ) || 'publish' !== get_post_status( $id ) ) {
			return $output;
		}
		$html = Layouts::content( $id );
		return $html ? $output . '<div class="sub-menu hm-mega__panel">' . $html . '</div>' : $output;
	}
}
