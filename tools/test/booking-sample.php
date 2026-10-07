<?php
/**
 * wp eval-file booking-sample.php [type] — turns booking on (business type: general,
 * clinic, beauty, legal, consulting), adds five team members with weekly hours
 * (using existing media) and a page with the Experts, Booking and Before/After widgets.
 */
$opts                        = get_option( 'hamista_options', array() );
$opts['booking_enabled']      = true;
$opts['booking_type']         = $args[0] ?? 'clinic';
$opts['booking_notice']       = 0;
$opts['booking_auto_confirm'] = false;
update_option( 'hamista_options', $opts );
delete_option( 'hamista_booking_rewrite' );

// The module hooks ran before the option changed; register the types for this run.
\Hamista\Core\Settings\Settings::flush();
\Hamista\Core\Booking\Booking::register_post_types();

$images = get_posts( array( 'post_type' => 'attachment', 'post_mime_type' => 'image', 'posts_per_page' => 12, 'fields' => 'ids' ) );
$names  = array( 'دندان‌پزشکی', 'ارتودنسی', 'پوست و زیبایی' );
$terms  = array();
foreach ( $names as $n ) {
	$t       = term_exists( $n, 'hm_service' );
	$terms[] = $t ? (int) $t['term_id'] : (int) wp_insert_term( $n, 'hm_service' )['term_id'];
}
$experts = array(
	array( 'دکتر سارا مهدوی', 'متخصص ارتودنسی، بورد تخصصی', 1, 14, '۶۵۰٬۰۰۰ تومان' ),
	array( 'دکتر علی رضایی', 'دندان‌پزشک عمومی', 0, 9, '۴۰۰٬۰۰۰ تومان' ),
	array( 'دکتر نگار امینی', 'متخصص پوست، مو و زیبایی', 2, 11, '۵۵۰٬۰۰۰ تومان' ),
	array( 'دکتر حمید کاظمی', 'جراح لثه و ایمپلنت', 0, 18, '۷۰۰٬۰۰۰ تومان' ),
	array( 'دکتر مریم صالحی', 'متخصص دندان‌پزشکی کودکان', 0, 7, '۴۵۰٬۰۰۰ تومان' ),
);
$first = 0;
foreach ( $experts as $i => $d ) {
	$post = get_posts( array( 'post_type' => 'hm_expert', 'title' => $d[0], 'post_status' => 'any', 'numberposts' => 1 ) )[0] ?? null;
	$id   = $post ? $post->ID : wp_insert_post( array( 'post_type' => 'hm_expert', 'post_status' => 'publish', 'post_title' => $d[0], 'menu_order' => $i, 'post_content' => '<p>فارغ‌التحصیل دانشگاه علوم پزشکی تهران، با سال‌ها تجربه در درمان‌های زیبایی و ترمیمی. پیش از هر درمان، طرح درمان و هزینه‌ها را شفاف توضیح می‌دهد.</p>' ) );
	$first = $first ? $first : $id;
	wp_set_object_terms( $id, array( $terms[ $d[2] ] ), 'hm_service' );
	if ( ! empty( $images[ $i ] ) ) {
		set_post_thumbnail( $id, $images[ $i ] );
	}
	update_post_meta( $id, '_hm_role', $d[1] );
	update_post_meta( $id, '_hm_experience', (string) $d[3] );
	update_post_meta( $id, '_hm_fee', $d[4] );
	update_post_meta( $id, '_hm_license', (string) ( 120000 + $i * 731 ) );
	update_post_meta( $id, '_hm_location', 'طبقه‌ی دوم، اتاق ' . ( $i + 1 ) );
	$schedule = array();
	foreach ( array( 6, 0, 1, 2, 3, 4, 5 ) as $day ) {
		$schedule[ $day ] = array(
			'on'    => 5 !== $day && ( 4 !== $day || 0 === $i % 2 ),
			'from'  => '09:00',
			'to'    => '13:00',
			'from2' => 4 === $day ? '' : '16:00',
			'to2'   => 4 === $day ? '' : '20:00',
		);
	}
	update_post_meta( $id, '_hm_schedule', $schedule );
	update_post_meta( $id, '_hm_slot', 0 === $i % 2 ? 30 : 20 );
}

$els  = array();
$sets = array(
	array( 'hm-experts', array( 'layout' => 'grid' ) ),
	array( 'hm-booking', array() ),
	array( 'hm-experts', array( 'layout' => 'grid', 'card_style' => 'row' ) ),
	array( 'hm-before-after', array( 'caption' => 'لمینت کامپوزیت، دو جلسه' ) ),
);
foreach ( $sets as $i => $set ) {
	$els[] = array( 'id' => 'cl' . $i . 'aa', 'elType' => 'container', 'isInner' => false, 'settings' => array( 'content_width' => 'boxed' ), 'elements' => array( array( 'id' => 'cw' . $i . 'aa', 'elType' => 'widget', 'widgetType' => $set[0], 'settings' => (object) $set[1], 'elements' => array() ) ) );
}
$page = get_page_by_path( 'hm-booking-test' );
$pid  = $page ? $page->ID : wp_insert_post( array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'نوبت‌دهی', 'post_name' => 'hm-booking-test' ) );
update_post_meta( $pid, '_elementor_edit_mode', 'builder' );
update_post_meta( $pid, '_elementor_template_type', 'wp-page' );
update_post_meta( $pid, '_elementor_version', ELEMENTOR_VERSION );
update_post_meta( $pid, '_elementor_data', wp_slash( wp_json_encode( $els ) ) );
$opts                        = get_option( 'hamista_options', array() );
$opts['booking_page'] = $pid;
update_option( 'hamista_options', $opts );
\Elementor\Plugin::$instance->files_manager->clear_cache();
flush_rewrite_rules( false );
echo get_permalink( $pid ), "\n", get_post_type_archive_link( 'hm_expert' ), "\n", get_permalink( $first ), "\n";
