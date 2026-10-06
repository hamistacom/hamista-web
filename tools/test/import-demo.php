<?php
/**
 * wp eval-file import-demo.php <demo> — run a full demo import through the REST steps.
 */
wp_set_current_user( 1 );
$demo    = $args[0] ?? 'spark';
$options = array( 'content' => true, 'menus' => true, 'settings' => true, 'front_page' => true );
$next    = array( 'step' => 'prepare', 'batch' => 0 );
$start   = microtime( true );
for ( $i = 0; $i < 200 && $next; $i++ ) {
	$req = new WP_REST_Request( 'POST', '/hamista/v1/demos/' . $demo . '/import' );
	$req->set_body_params( array( 'step' => $next['step'], 'batch' => $next['batch'], 'options' => $options ) );
	$t   = microtime( true );
	$res = rest_do_request( $req );
	$data = $res->get_data();
	if ( $res->is_error() ) {
		echo 'ERROR at ', $next['step'], ': ', wp_json_encode( $data, JSON_UNESCAPED_UNICODE ), "\n";
		exit( 1 );
	}
	printf( "%-10s %2d  %3d%%  %.2fs  %s\n", $next['step'], $next['batch'], $data['progress'], microtime( true ) - $t, $data['message'] );
	$next = $data['done'] ? null : $data['next'];
	if ( $data['done'] ) {
		echo 'links: ', wp_json_encode( $data['links'] ), "\n";
	}
}
printf( "total %.1fs\n", microtime( true ) - $start );
