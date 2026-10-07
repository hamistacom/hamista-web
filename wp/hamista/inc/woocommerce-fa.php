<?php
/**
 * Persian for WooCommerce's most visible front-end strings, used only when
 * WooCommerce's own Persian language pack is missing (a fresh install, or a
 * site that has not downloaded translations yet). Installed translations always win.
 *
 * @package Hamista
 */

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'WooCommerce' ) ) {
	return;
}

/**
 * Original string => Persian.
 *
 * @return array
 */
function hamista_wc_persian_strings() {
	return array(
		'Add to cart'                                   => 'افزودن به سبد خرید',
		'Sale'                                          => 'حراج',
		'Product on sale'                               => 'محصول تخفیف‌دار',
		'New in store'                                  => 'تازه‌های فروشگاه',
		'Your cart is currently empty!'                 => 'سبد خرید شما خالی است!',
		'Read more'                                     => 'بیشتر بخوانید',
		'Add to cart: &ldquo;%s&rdquo;'                 => 'افزودن «%s» به سبد خرید',
		'Read more about &ldquo;%s&rdquo;'              => 'درباره‌ی «%s» بیشتر بخوانید',
		'Select options for &ldquo;%s&rdquo;'           => 'انتخاب گزینه‌های «%s»',
		'View products in the &ldquo;%s&rdquo; group'   => 'دیدن محصولات گروه «%s»',
		'This product has multiple variants. The options may be chosen on the product page' => 'این محصول چند گونه دارد؛ گزینه‌ها را در برگه‌ی محصول انتخاب کنید',
		'Select options'                                => 'انتخاب گزینه‌ها',
		'View products'                                 => 'مشاهده‌ی محصولات',
		'View cart'                                     => 'مشاهده‌ی سبد خرید',
		'Sale!'                                         => 'حراج!',
		'Out of stock'                                  => 'ناموجود',
		'In stock'                                      => 'موجود',
		'%s in stock'                                   => '%s عدد موجود',
		'Description'                                   => 'توضیحات',
		'Additional information'                        => 'اطلاعات بیشتر',
		'Reviews'                                       => 'نظرها',
		'Reviews (%d)'                                  => 'نظرها (%d)',
		'Related products'                              => 'محصولات مرتبط',
		'You may also like&hellip;'                     => 'شاید این‌ها را هم بپسندید…',
		'Category:'                                     => 'دسته:',
		'Categories:'                                   => 'دسته‌ها:',
		'Tag:'                                          => 'برچسب:',
		'Tags:'                                         => 'برچسب‌ها:',
		'SKU:'                                          => 'شناسه‌ی محصول:',
		'N/A'                                           => 'ندارد',
		'Free!'                                         => 'رایگان!',
		'Cart'                                          => 'سبد خرید',
		'Checkout'                                      => 'تسویه‌حساب',
		'Proceed to checkout'                           => 'ادامه‌ی خرید',
		'Update cart'                                   => 'به‌روزرسانی سبد',
		'Apply coupon'                                  => 'اعمال کد تخفیف',
		'Coupon code'                                   => 'کد تخفیف',
		'Coupon:'                                       => 'کد تخفیف:',
		'Cart totals'                                   => 'جمع سبد خرید',
		'Subtotal'                                      => 'جمع جزء',
		'Subtotal:'                                     => 'جمع جزء:',
		'Total'                                         => 'مبلغ کل',
		'Shipping'                                      => 'ارسال',
		'Product'                                       => 'محصول',
		'Price'                                         => 'قیمت',
		'Quantity'                                      => 'تعداد',
		'Remove this item'                              => 'حذف این مورد',
		'Your cart is currently empty.'                 => 'سبد خرید شما خالی است.',
		'Return to shop'                                => 'بازگشت به فروشگاه',
		'No products in the cart.'                      => 'سبد خرید خالی است.',
		'Place order'                                   => 'ثبت سفارش',
		'Billing details'                               => 'جزئیات صورت‌حساب',
		'Your order'                                    => 'سفارش شما',
		'Order notes'                                   => 'یادداشت سفارش',
		'Ship to a different address?'                  => 'ارسال به نشانی دیگر؟',
		'First name'                                    => 'نام',
		'Last name'                                     => 'نام خانوادگی',
		'Company name'                                  => 'نام شرکت',
		'Country / Region'                              => 'کشور',
		'Street address'                                => 'نشانی',
		'Town / City'                                   => 'شهر',
		'State / County'                                => 'استان',
		'Postcode / ZIP'                                => 'کد پستی',
		'Phone'                                         => 'تلفن',
		'Email address'                                 => 'ایمیل',
		'Default sorting'                               => 'مرتب‌سازی پیش‌فرض',
		'Sort by popularity'                            => 'پرفروش‌ترین',
		'Sort by average rating'                        => 'بیشترین امتیاز',
		'Sort by latest'                                => 'جدیدترین',
		'Sort by price: low to high'                    => 'ارزان‌ترین',
		'Sort by price: high to low'                    => 'گران‌ترین',
		'Shop order'                                    => 'ترتیب فروشگاه',
		'Showing the single result'                     => 'یک محصول',
		'Search products&hellip;'                       => 'جست‌وجوی محصولات…',
		'Username or email address'                     => 'نام کاربری یا ایمیل',
		'Password'                                      => 'رمز عبور',
		'Remember me'                                   => 'مرا به خاطر بسپار',
		'Log in'                                        => 'ورود',
		'Login'                                         => 'ورود',
		'Register'                                      => 'ثبت‌نام',
		'Lost your password?'                           => 'رمز عبور را فراموش کرده‌اید؟',
		'Add a review'                                  => 'نظر خود را بنویسید',
		'Your review'                                   => 'نظر شما',
		'Your rating'                                   => 'امتیاز شما',
		'Submit'                                        => 'ارسال',
		'There are no reviews yet.'                     => 'هنوز نظری ثبت نشده است.',
		'Clear'                                         => 'پاک کردن',
		'Choose an option'                              => 'یک گزینه انتخاب کنید',
		'Product quantity'                              => 'تعداد محصول',
		'Original price was: %s.'                       => 'قیمت اصلی: %s.',
		'Current price is: %s.'                         => 'قیمت فعلی: %s.',
		'&ldquo;%s&rdquo; has been added to your cart.' => '«%s» به سبد خرید افزوده شد.',
		'Continue shopping'                             => 'ادامه‌ی خرید',
		'Order received'                                => 'سفارش دریافت شد',
		'Thank you. Your order has been received.'      => 'سپاس؛ سفارش شما دریافت شد.',
		'Order number:'                                 => 'شماره‌ی سفارش:',
		'Date:'                                         => 'تاریخ:',
		'Payment method:'                               => 'روش پرداخت:',
		'Order details'                                 => 'جزئیات سفارش',
	);
}

/**
 * Plural strings: original singular => [ singular, plural ] in Persian.
 *
 * @return array
 */
function hamista_wc_persian_plurals() {
	return array(
		'Showing all %d result'                  => array( 'نمایش %d محصول', 'نمایش همه‌ی %d محصول' ),
		'Showing all %1$d result'                => array( 'نمایش %1$d محصول', 'نمایش همه‌ی %1$d محصول' ),
		'Showing %1$d&ndash;%2$d of %3$d result' => array( 'نمایش %1$d تا %2$d از %3$d محصول', 'نمایش %1$d تا %2$d از %3$d محصول' ),
		'%s customer review'                     => array( '%s نظر', '%s نظر' ),
		'%d item'                                => array( '%d کالا', '%d کالا' ),
	);
}

/**
 * Fill in an untranslated WooCommerce string.
 *
 * @param string $translation Translated text.
 * @param string $text        Original text.
 * @return string
 */
function hamista_wc_gettext( $translation, $text ) {
	if ( $translation !== $text ) {
		return $translation;
	}
	static $map = null;
	if ( null === $map ) {
		$map = hamista_wc_persian_strings();
	}
	return isset( $map[ $text ] ) ? $map[ $text ] : $translation;
}

/**
 * Fill in an untranslated WooCommerce plural.
 *
 * @param string $translation Translated text.
 * @param string $single      Singular original.
 * @param string $plural      Plural original.
 * @param int    $number      Count.
 * @return string
 */
function hamista_wc_ngettext( $translation, $single, $plural, $number ) {
	if ( $translation !== $single && $translation !== $plural ) {
		return $translation;
	}
	$map = hamista_wc_persian_plurals();
	return isset( $map[ $single ] ) ? $map[ $single ][ 1 === (int) $number ? 0 : 1 ] : $translation;
}

/**
 * Same, for strings that carry a context (WooCommerce uses _x and _nx too).
 *
 * @param string $translation Translated text.
 * @param string $text        Original text.
 * @return string
 */
function hamista_wc_gettext_context( $translation, $text ) {
	return hamista_wc_gettext( $translation, $text );
}

/**
 * Plural with a context.
 *
 * @param string $translation Translated text.
 * @param string $single      Singular original.
 * @param string $plural      Plural original.
 * @param int    $number      Count.
 * @return string
 */
function hamista_wc_ngettext_context( $translation, $single, $plural, $number ) {
	return hamista_wc_ngettext( $translation, $single, $plural, $number );
}

/**
 * The cart and checkout pages WooCommerce creates on a site without its
 * language pack store a few English headings in their blocks; show them in Persian.
 *
 * @param string $content Block HTML.
 * @param array  $block   Block.
 * @return string
 */
function hamista_wc_block_text( $content, $block ) {
	if ( empty( $block['blockName'] ) || ! in_array( $block['blockName'], array( 'core/heading', 'core/paragraph', 'woocommerce/empty-cart-block' ), true ) ) {
		return $content;
	}
	if ( ! ( function_exists( 'is_cart' ) && is_cart() ) && ! ( function_exists( 'is_checkout' ) && is_checkout() ) ) {
		return $content;
	}
	return strtr(
		$content,
		array(
			'Your cart is currently empty!' => 'سبد خرید شما خالی است!',
			'New in store'                  => 'تازه‌های فروشگاه',
			'Browse store'                  => 'دیدن فروشگاه',
		)
	);
}

/**
 * Hook only on Persian sites (or with the Persian interface switch on).
 */
function hamista_wc_persian_fallback() {
	if ( is_admin() && ! wp_doing_ajax() ) {
		return;
	}
	if ( 0 !== strpos( determine_locale(), 'fa' ) ) {
		return;
	}
	add_filter( 'gettext_woocommerce', 'hamista_wc_gettext', 10, 2 );
	add_filter( 'ngettext_woocommerce', 'hamista_wc_ngettext', 10, 4 );
	add_filter( 'gettext_with_context_woocommerce', 'hamista_wc_gettext_context', 10, 2 );
	add_filter( 'ngettext_with_context_woocommerce', 'hamista_wc_ngettext_context', 10, 4 );
	add_filter( 'render_block', 'hamista_wc_block_text', 10, 2 );
}
add_action( 'init', 'hamista_wc_persian_fallback', 1 );
