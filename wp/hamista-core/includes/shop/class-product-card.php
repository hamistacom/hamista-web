<?php
/**
 * Product card markup used by every Hamista shop widget, so a card looks and
 * behaves the same in a carousel, a grid, tabs or a deal block.
 *
 * Add to cart uses WooCommerce's own AJAX classes, so the mini cart, fragments
 * and analytics plugins keep working.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Shop;

use Elementor\Controls_Manager;

defined( 'ABSPATH' ) || exit;

/**
 * Product card.
 */
class Product_Card {

	/**
	 * Card styles.
	 *
	 * @return array
	 */
	public static function styles() {
		return array(
			'classic'    => __( 'Classic', 'hamista-core' ),
			'minimal'    => __( 'Minimal', 'hamista-core' ),
			'framed'     => __( 'Framed', 'hamista-core' ),
			'overlay'    => __( 'Text over image', 'hamista-core' ),
			'horizontal' => __( 'Horizontal', 'hamista-core' ),
		);
	}

	/**
	 * Card controls (inside an open section).
	 *
	 * @param \Elementor\Widget_Base $widget   Widget.
	 * @param array                  $defaults style.
	 */
	public static function controls( $widget, $defaults = array() ) {
		$widget->add_control(
			'card_style',
			array(
				'label'   => __( 'Card style', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => $defaults['style'] ?? 'classic',
				'options' => self::styles(),
			)
		);
		$widget->add_control(
			'card_ratio',
			array(
				'label'   => __( 'Image shape', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => $defaults['ratio'] ?? '1-1',
				'options' => array(
					'1-1' => __( 'Square', 'hamista-core' ),
					'4-5' => __( 'Portrait', 'hamista-core' ),
					'3-4' => __( 'Tall', 'hamista-core' ),
					'4-3' => __( 'Landscape', 'hamista-core' ),
				),
			)
		);
		$widget->add_control(
			'card_parts',
			array(
				'label'       => __( 'Show', 'hamista-core' ),
				'type'        => Controls_Manager::SELECT2,
				'multiple'    => true,
				'label_block' => true,
				'default'     => $defaults['parts'] ?? array( 'category', 'rating', 'badges', 'hover', 'cart' ),
				'options'     => array(
					'category' => __( 'Category', 'hamista-core' ),
					'rating'   => __( 'Rating', 'hamista-core' ),
					'badges'   => __( 'Sale and new badges', 'hamista-core' ),
					'hover'    => __( 'Second image on hover', 'hamista-core' ),
					'cart'     => __( 'Add to cart', 'hamista-core' ),
					'stock'    => __( 'Stock left bar', 'hamista-core' ),
					'excerpt'  => __( 'Short description', 'hamista-core' ),
				),
			)
		);
	}

	/**
	 * Card options from widget settings.
	 *
	 * @param array $s Settings.
	 * @return array
	 */
	public static function options( $s ) {
		return array(
			'style' => array_key_exists( $s['card_style'] ?? '', self::styles() ) ? $s['card_style'] : 'classic',
			'ratio' => in_array( $s['card_ratio'] ?? '', array( '1-1', '4-5', '3-4', '4-3' ), true ) ? $s['card_ratio'] : '1-1',
			'parts' => (array) ( $s['card_parts'] ?? array() ),
		);
	}

	/**
	 * Highest discount of a product, in percent.
	 *
	 * @param \WC_Product $product Product.
	 * @return int
	 */
	public static function discount( $product ) {
		if ( ! $product->is_on_sale() ) {
			return 0;
		}
		$best   = 0;
		$prices = $product->is_type( 'variable' ) ? $product->get_variation_prices( true ) : array(
			'regular_price' => array( (float) $product->get_regular_price() ),
			'sale_price'    => array( (float) $product->get_sale_price() ),
		);
		foreach ( $prices['regular_price'] as $key => $regular ) {
			$sale = $prices['sale_price'][ $key ] ?? $regular;
			if ( $regular > 0 && $sale < $regular ) {
				$best = max( $best, (int) round( ( $regular - $sale ) / $regular * 100 ) );
			}
		}
		return $best;
	}

	/**
	 * Badges: discount, new, out of stock.
	 *
	 * @param \WC_Product $product Product.
	 * @return string
	 */
	public static function badges( $product ) {
		$html    = '';
		$percent = $product->is_in_stock() ? self::discount( $product ) : 0;
		if ( ! $product->is_in_stock() ) {
			$html .= '<span class="hm-badge hm-badge--muted">' . esc_html__( 'Sold out', 'hamista-core' ) . '</span>';
		} elseif ( $percent ) {
			/* translators: %s: discount percent */
			$html .= '<span class="hm-badge hm-badge--sale">' . esc_html( sprintf( __( '%s%% off', 'hamista-core' ), hamista_core_num( $percent ) ) ) . '</span>';
		}
		$created = $product->get_date_created();
		if ( $created && $created->getTimestamp() > time() - 30 * DAY_IN_SECONDS ) {
			$html .= '<span class="hm-badge">' . esc_html__( 'New', 'hamista-core' ) . '</span>';
		}
		return $html ? '<span class="hm-pcard__badges">' . $html . '</span>' : '';
	}

	/**
	 * Add to cart link (AJAX for simple products, product page for the rest).
	 *
	 * @param \WC_Product $product Product.
	 * @param bool        $icon    Icon-only button.
	 * @return string
	 */
	public static function cart_button( $product, $icon = false ) {
		$ajax    = $product->supports( 'ajax_add_to_cart' ) && $product->is_purchasable() && $product->is_in_stock();
		$classes = array( 'hm-pcard__cart', 'add_to_cart_button', 'product_type_' . $product->get_type() );
		if ( $ajax ) {
			$classes[] = 'ajax_add_to_cart';
		}
		$classes[] = $icon ? 'hm-icon-btn' : 'hm-btn hm-btn--sm';
		$label     = self::cart_label( $product );
		return sprintf(
			'<a href="%1$s" data-quantity="1" data-product_id="%2$d" data-product_sku="%3$s" class="%4$s" aria-label="%5$s" rel="nofollow">%6$s</a>',
			esc_url( $product->add_to_cart_url() ),
			$product->get_id(),
			esc_attr( $product->get_sku() ),
			esc_attr( implode( ' ', $classes ) ),
			/* translators: %s: product name */
			esc_attr( sprintf( __( 'Add “%s” to cart', 'hamista-core' ), $product->get_name() ) ),
			$icon ? hamista_core_icon( 'bag', array( 'size' => 18 ) ) : hamista_core_icon( 'bag', array( 'size' => 16 ) ) . '<span>' . esc_html( $label ) . '</span>'
		);
	}

	/**
	 * Button label. WooCommerce's own wording is used when it is translated;
	 * otherwise Hamista's Persian wording, so cards never show English.
	 *
	 * @param \WC_Product $product Product.
	 * @return string
	 */
	public static function cart_label( $product ) {
		$text = $product->add_to_cart_text();
		$ours = array(
			'Add to cart'    => __( 'Add to cart', 'hamista-core' ),
			'Select options' => __( 'Choose options', 'hamista-core' ),
			'View products'  => __( 'View products', 'hamista-core' ),
			'Read more'      => __( 'View product', 'hamista-core' ),
			'Buy product'    => __( 'Buy now', 'hamista-core' ),
		);
		return $ours[ $text ] ?? $text;
	}

	/**
	 * Stock-left bar for deals: sold vs. stock.
	 *
	 * @param \WC_Product $product Product.
	 * @return string
	 */
	public static function stock_bar( $product ) {
		$stock = $product->get_manage_stock() ? (int) $product->get_stock_quantity() : 0;
		$sold  = (int) $product->get_total_sales();
		if ( $stock <= 0 ) {
			return '';
		}
		$percent = (int) round( $sold / max( 1, $sold + $stock ) * 100 );
		return '<div class="hm-stockbar" style="--p:' . esc_attr( (string) $percent ) . '%">'
			/* translators: %s: number of items left */
			. '<div class="hm-stockbar__row"><span>' . esc_html( sprintf( __( 'Only %s left', 'hamista-core' ), hamista_core_num( $stock ) ) ) . '</span>'
			/* translators: %s: number sold */
			. '<span>' . esc_html( sprintf( __( '%s sold', 'hamista-core' ), hamista_core_num( $sold ) ) ) . '</span></div>'
			. '<div class="hm-stockbar__track"><i></i></div></div>';
	}

	/**
	 * Countdown to the end of the sale (or a fixed timestamp).
	 *
	 * @param \WC_Product $product Product.
	 * @param int         $until   Fallback end time (Unix).
	 * @return string
	 */
	public static function countdown( $product, $until = 0 ) {
		$end = $product->get_date_on_sale_to();
		$end = $end ? $end->getTimestamp() : (int) $until;
		if ( $end <= time() ) {
			return '';
		}
		$units = array(
			'd' => __( 'Days', 'hamista-core' ),
			'h' => __( 'Hours', 'hamista-core' ),
			'm' => __( 'Minutes', 'hamista-core' ),
			's' => __( 'Seconds', 'hamista-core' ),
		);
		$html  = '<div class="hm-countdown" data-hm-widget="countdown" data-end="' . esc_attr( (string) $end ) . '" role="timer">';
		foreach ( $units as $key => $label ) {
			$html .= '<span class="hm-countdown__unit"><b data-unit="' . esc_attr( $key ) . '">۰۰</b><small>' . esc_html( $label ) . '</small></span>';
		}
		return $html . '</div>';
	}

	/**
	 * Render one card.
	 *
	 * @param \WC_Product $product Product.
	 * @param array       $o       Options from options().
	 * @return string
	 */
	public static function render( $product, $o ) {
		if ( ! $product instanceof \WC_Product ) {
			return '';
		}
		$parts = $o['parts'];
		$has   = static function ( $part ) use ( $parts ) {
			return in_array( $part, $parts, true );
		};
		$link  = get_permalink( $product->get_id() );
		$title = $product->get_name();

		$image = $product->get_image(
			'woocommerce_thumbnail',
			array(
				'class'    => 'hm-pcard__img',
				'loading'  => 'lazy',
				'decoding' => 'async',
			)
		);
		$hover = '';
		if ( $has( 'hover' ) ) {
			$gallery = $product->get_gallery_image_ids();
			if ( $gallery ) {
				$hover = wp_get_attachment_image(
					$gallery[0],
					'woocommerce_thumbnail',
					false,
					array(
						'class'    => 'hm-pcard__img hm-pcard__img--alt',
						'loading'  => 'lazy',
						'decoding' => 'async',
						'alt'      => '',
					)
				);
			}
		}

		$category = '';
		if ( $has( 'category' ) ) {
			$terms = get_the_terms( $product->get_id(), 'product_cat' );
			if ( $terms && ! is_wp_error( $terms ) ) {
				$category = '<span class="hm-pcard__cat">' . esc_html( $terms[0]->name ) . '</span>';
			}
		}

		$rating = '';
		if ( $has( 'rating' ) && $product->get_average_rating() > 0 ) {
			$avg    = (float) $product->get_average_rating();
			$rating = '<span class="hm-pcard__rating" aria-label="' . esc_attr(
				/* translators: %s: average rating */
				sprintf( __( 'Rated %s out of 5', 'hamista-core' ), hamista_core_num( $avg, 1 ) )
			) . '">' . hamista_core_icon( 'star', array( 'size' => 14 ) ) . esc_html( hamista_core_num( $avg, 1 ) ) . '</span>';
		}

		$classes = 'hm-pcard hm-pcard--' . $o['style'] . ' hm-ratio-' . $o['ratio'] . ( $hover ? ' has-alt' : '' ) . ( $product->is_in_stock() ? '' : ' is-out' );
		$html    = '<article class="' . esc_attr( $classes ) . '">';
		$html   .= '<a class="hm-pcard__media" href="' . esc_url( $link ) . '" tabindex="-1" aria-hidden="true">' . $image . $hover . ( $has( 'badges' ) ? self::badges( $product ) : '' ) . '</a>';
		if ( $has( 'cart' ) && in_array( $o['style'], array( 'minimal', 'overlay' ), true ) ) {
			$html .= '<div class="hm-pcard__quick">' . self::cart_button( $product, true ) . '</div>';
		}
		$html .= '<div class="hm-pcard__body">';
		$html .= ( $category || $rating ) ? '<div class="hm-pcard__meta">' . $category . $rating . '</div>' : '';
		$html .= '<h3 class="hm-pcard__title"><a href="' . esc_url( $link ) . '">' . esc_html( $title ) . '</a></h3>';
		if ( $has( 'excerpt' ) && $product->get_short_description() ) {
			$html .= '<p class="hm-pcard__excerpt">' . esc_html( wp_trim_words( wp_strip_all_tags( $product->get_short_description() ), 14 ) ) . '</p>';
		}
		if ( $has( 'stock' ) ) {
			$html .= self::stock_bar( $product );
		}
		$html .= '<div class="hm-pcard__foot"><span class="hm-pcard__price">' . wp_kses_post( $product->get_price_html() ) . '</span>';
		if ( $has( 'cart' ) && ! in_array( $o['style'], array( 'minimal', 'overlay' ), true ) ) {
			$html .= self::cart_button( $product, 'horizontal' !== $o['style'] );
		}
		$html .= '</div></div></article>';

		/**
		 * Filter a Hamista product card.
		 *
		 * @param string      $html    Card HTML.
		 * @param \WC_Product $product Product.
		 * @param array       $options Card options.
		 */
		return apply_filters( 'hamista_core/product_card', $html, $product, $o );
	}
}
