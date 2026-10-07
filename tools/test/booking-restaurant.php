<?php
/**
 * wp eval-file booking-restaurant.php — switches the test site to a restaurant:
 * dining areas with seat capacity, guest count, extra questions, one area that
 * is listed but not bookable, and a customised account menu with its own tab.
 * Replaces any existing bookable items and appointments (test data only).
 */
$opts                         = get_option( 'hamista_options', array() );
$opts['booking_enabled']      = true;
$opts['booking_type']         = 'restaurant';
$opts['booking_kind']         = '';
$opts['booking_notice']       = 0;
$opts['booking_qty']          = true;
$opts['booking_qty_label']    = 'تعداد مهمان';
$opts['booking_qty_max']      = 12;
$opts['booking_fields']       = array(
	array(
		'label'    => 'مناسبت',
		'type'     => 'select',
		'choices'  => 'معمولی، تولد، جلسه‌ی کاری',
		'required' => false,
	),
	array(
		'label'    => 'حساسیت غذایی',
		'type'     => 'text',
		'choices'  => '',
		'required' => false,
	),
	array(
		'label'    => 'قوانین رزرو را می‌پذیرم',
		'type'     => 'checkbox',
		'choices'  => '',
		'required' => true,
	),
);
update_option( 'hamista_options', $opts );
\Hamista\Core\Settings\Settings::flush();
\Hamista\Core\Booking\Booking::register_post_types();

foreach ( get_posts( array( 'post_type' => array( 'hm_expert', 'hm_appointment' ), 'post_status' => 'any', 'numberposts' => -1, 'fields' => 'ids' ) ) as $old ) {
	wp_delete_post( $old, true );
}

$images = get_posts( array( 'post_type' => 'attachment', 'post_mime_type' => 'image', 'posts_per_page' => 12, 'fields' => 'ids', 'offset' => 5 ) );
$terms  = array();
foreach ( array( 'داخل سالن', 'فضای باز' ) as $n ) {
	$t       = term_exists( $n, 'hm_service' );
	$terms[] = $t ? (int) $t['term_id'] : (int) wp_insert_term( $n, 'hm_service' )['term_id'];
}
$places = array(
	array( 'سالن اصلی', 'فضای آرام با نور گرم، مناسب شام', 0, 40, true ),
	array( 'تراس', 'رو به باغ، فقط در فصل گرم', 1, 16, true ),
	array( 'اتاق خصوصی', 'تا ده نفر، مناسب جلسه و جشن کوچک', 0, 10, true ),
	array( 'بار قهوه', 'بدون رزرو؛ به ترتیب مراجعه', 0, 1, false ),
);
$first = 0;
foreach ( $places as $i => $p ) {
	$id    = wp_insert_post( array( 'post_type' => 'hm_expert', 'post_status' => 'publish', 'post_title' => $p[0], 'menu_order' => $i, 'post_content' => '<p>' . $p[1] . '.</p>' ) );
	$first = $first ? $first : $id;
	wp_set_object_terms( $id, array( $terms[ $p[2] ] ), 'hm_service' );
	if ( ! empty( $images[ $i ] ) ) {
		set_post_thumbnail( $id, $images[ $i ] );
	}
	update_post_meta( $id, '_hm_role', $p[1] );
	update_post_meta( $id, '_hm_fee', 'بدون پیش‌پرداخت' );
	update_post_meta( $id, '_hm_location', 'همکف' );
	update_post_meta( $id, '_hm_capacity', $p[3] );
	update_post_meta( $id, '_hm_bookable', $p[4] ? '1' : '0' );
	update_post_meta( $id, '_hm_slot', 60 );
	$schedule = array();
	foreach ( array( 6, 0, 1, 2, 3, 4, 5 ) as $day ) {
		$schedule[ $day ] = array(
			'on'    => true,
			'from'  => '12:00',
			'to'    => '16:00',
			'from2' => '19:00',
			'to2'   => '23:00',
		);
	}
	update_post_meta( $id, '_hm_schedule', $schedule );
}

// A page for the custom account tab.
$club = get_page_by_path( 'hm-club' );
$cid  = $club ? $club->ID : wp_insert_post(
	array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => 'باشگاه مشتریان',
		'post_name'    => 'hm-club',
		'post_content' => "<!-- wp:heading {\"level\":3} -->\n<h3>باشگاه مشتریان</h3>\n<!-- /wp:heading -->\n<!-- wp:paragraph -->\n<p>با هر رزرو امتیاز می‌گیرید و در سالگرد عضویت یک دسر مهمان ما هستید.</p>\n<!-- /wp:paragraph -->",
	)
);
$opts                             = get_option( 'hamista_options', array() );
$opts['account_layout']           = 'tabs';
$opts['account_dash_text']        = 'رزروها و سفارش‌هایتان اینجاست.';
$opts['account_dash_block']       = $cid;
$opts['account_dash_block_place'] = 'after';
$opts['account_menu']             = array(
	array( 'item' => 'dashboard', 'label' => 'خانه‌ی حساب', 'icon' => '', 'content' => 0, 'slug' => '', 'url' => '' ),
	array( 'item' => 'appointments', 'label' => 'رزروهای من', 'icon' => '', 'content' => 0, 'slug' => '', 'url' => '' ),
	array( 'item' => 'page', 'label' => 'باشگاه مشتریان', 'icon' => 'heart', 'content' => $cid, 'slug' => 'club', 'url' => '' ),
	array( 'item' => 'orders', 'label' => '', 'icon' => '', 'content' => 0, 'slug' => '', 'url' => '' ),
	array( 'item' => 'link', 'label' => 'پشتیبانی', 'icon' => 'phone', 'content' => 0, 'slug' => '', 'url' => home_url( '/contact/' ) ),
	array( 'item' => 'edit-account', 'label' => '', 'icon' => '', 'content' => 0, 'slug' => '', 'url' => '' ),
	array( 'item' => 'customer-logout', 'label' => '', 'icon' => '', 'content' => 0, 'slug' => '', 'url' => '' ),
);
update_option( 'hamista_options', $opts );
delete_option( 'hamista_account_endpoints' );
delete_option( 'hamista_booking_rewrite' );
\Elementor\Plugin::$instance->files_manager->clear_cache();
echo get_permalink( get_page_by_path( 'hm-booking-test' ) ), "\n", get_post_type_archive_link( 'hm_expert' ), "\n", get_permalink( $first ), "\n";
