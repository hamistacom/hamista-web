<?php
/**
 * My account dashboard: a greeting, summary cards and the latest orders.
 *
 * Based on the WooCommerce template of the same name.
 *
 * @package Hamista
 * @version 4.4.0
 * @var \WP_User $current_user
 */

defined( 'ABSPATH' ) || exit;

$hamista_user  = isset( $current_user ) && $current_user instanceof WP_User ? $current_user : wp_get_current_user();
$hamista_name  = '' !== trim( (string) $hamista_user->first_name ) ? $hamista_user->first_name : $hamista_user->display_name;
$hamista_dash  = (array) apply_filters(
	'hamista/account_dashboard',
	array(
		'greeting' => true,
		'text'     => __( 'Your orders, appointments and account details, all in one place.', 'hamista' ),
		'cards'    => true,
		'orders'   => true,
		'before'   => '',
		'after'    => '',
		'replace'  => '',
	)
);
$hamista_cards = ! empty( $hamista_dash['cards'] ) ? hamista_account_cards( $hamista_user->ID ) : array();
$hamista_last  = empty( $hamista_dash['orders'] ) ? array() : wc_get_orders(
	array(
		'customer_id' => $hamista_user->ID,
		'limit'       => 3,
		'orderby'     => 'date',
		'order'       => 'DESC',
	)
);
?>

<div class="hm-account-dash">
	<?php if ( ! empty( $hamista_dash['before'] ) ) : ?>
		<div class="hm-account-dash__block"><?php echo $hamista_dash['before']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered page or Elementor block. ?></div>
	<?php endif; ?>

	<?php if ( ! empty( $hamista_dash['replace'] ) ) : ?>
		<div class="hm-account-dash__block"><?php echo $hamista_dash['replace']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered page or Elementor block. ?></div>
	<?php else : ?>

		<?php if ( ! empty( $hamista_dash['greeting'] ) ) : ?>
		<header class="hm-account-dash__head">
			<h2>
				<?php
				/* translators: %s: first name */
				echo esc_html( sprintf( __( 'Hello, %s', 'hamista' ), $hamista_name ) );
				?>
			</h2>
			<?php if ( ! empty( $hamista_dash['text'] ) ) : ?>
				<p><?php echo esc_html( $hamista_dash['text'] ); ?></p>
			<?php endif; ?>
		</header>
	<?php endif; ?>

		<?php if ( $hamista_cards ) : ?>
		<div class="hm-account-cards">
			<?php foreach ( $hamista_cards as $hamista_card ) : ?>
				<a class="hm-account-card" href="<?php echo esc_url( $hamista_card['url'] ?? '#' ); ?>">
					<span class="hm-account-card__icon" aria-hidden="true"><?php echo hamista_get_icon( $hamista_card['icon'] ?? 'grid', array( 'size' => 18 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG. ?></span>
					<span class="hm-account-card__label"><?php echo esc_html( $hamista_card['label'] ?? '' ); ?></span>
					<strong class="hm-account-card__value"><?php echo wp_kses_post( $hamista_card['value'] ?? '' ); ?></strong>
				</a>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>

		<?php if ( ! empty( $hamista_dash['orders'] ) ) : ?>
	<section class="hm-account-recent" aria-labelledby="hm-account-recent">
		<div class="hm-account-recent__head">
			<h3 id="hm-account-recent"><?php esc_html_e( 'Latest orders', 'hamista' ); ?></h3>
			<?php if ( $hamista_last ) : ?>
				<a href="<?php echo esc_url( wc_get_account_endpoint_url( 'orders' ) ); ?>"><?php esc_html_e( 'All orders', 'hamista' ); ?></a>
			<?php endif; ?>
		</div>
			<?php if ( $hamista_last ) : ?>
			<ul class="hm-account-orders">
				<?php foreach ( $hamista_last as $hamista_order ) : ?>
					<li>
						<a href="<?php echo esc_url( $hamista_order->get_view_order_url() ); ?>">
							<span class="hm-account-orders__no">
								<?php
								/* translators: %s: order number */
								echo esc_html( hamista_digits( sprintf( __( 'Order %s', 'hamista' ), $hamista_order->get_order_number() ) ) );
								?>
							</span>
							<span class="hm-account-orders__date"><?php echo esc_html( $hamista_order->get_date_created() ? wc_format_datetime( $hamista_order->get_date_created() ) : '' ); ?></span>
							<span class="hm-account-orders__status hm-account-orders__status--<?php echo esc_attr( $hamista_order->get_status() ); ?>"><?php echo esc_html( wc_get_order_status_name( $hamista_order->get_status() ) ); ?></span>
							<span class="hm-account-orders__total"><?php echo wp_kses_post( $hamista_order->get_formatted_order_total() ); ?></span>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>
		<?php else : ?>
			<p class="hm-account-recent__empty">
				<?php esc_html_e( 'No orders yet.', 'hamista' ); ?>
				<a href="<?php echo esc_url( apply_filters( 'woocommerce_return_to_shop_redirect', wc_get_page_permalink( 'shop' ) ) ); ?>"><?php esc_html_e( 'Visit the shop', 'hamista' ); ?></a>
			</p>
		<?php endif; ?>
	</section>
	<?php endif; ?>

	<?php endif; ?>

	<?php if ( ! empty( $hamista_dash['after'] ) ) : ?>
		<div class="hm-account-dash__block"><?php echo $hamista_dash['after']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered page or Elementor block. ?></div>
	<?php endif; ?>
</div>

<?php
/**
 * My Account dashboard.
 *
 * @since 2.6.0
 */
do_action( 'woocommerce_account_dashboard' );

// phpcs:disable WooCommerce.Commenting.CommentHooks.MissingHookComment -- deprecated WooCommerce hooks kept for compatibility.
do_action( 'woocommerce_before_my_account' );
do_action( 'woocommerce_after_my_account' );
// phpcs:enable
