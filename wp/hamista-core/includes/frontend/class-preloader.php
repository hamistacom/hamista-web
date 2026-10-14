<?php
/**
 * Page loader: the site logo (or your own animation) over the page while it
 * loads, then a fade, a rising curtain or a counted percentage. Inline and
 * tiny: no extra request, no library. It leaves as soon as the page is ready
 * and never stays longer than three seconds; without JavaScript it is hidden.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Frontend;

defined( 'ABSPATH' ) || exit;

/**
 * Preloader.
 */
class Preloader {

	/**
	 * Hooks.
	 */
	public static function init() {
		add_action( 'wp_head', array( __CLASS__, 'styles' ), 3 );
		add_action( 'wp_body_open', array( __CLASS__, 'markup' ), 1 );
	}

	/**
	 * Chosen style, or '' when the loader should not show on this request.
	 *
	 * @return string
	 */
	private static function style() {
		$style = (string) hamista_core_option( 'preloader', 'none' );
		if ( ! in_array( $style, array( 'logo', 'curtain', 'counter', 'bar', 'custom' ), true ) ) {
			return '';
		}
		if ( is_admin() || is_feed() || is_embed() || is_customize_preview() || wp_doing_ajax() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
			return '';
		}
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only check for the Elementor editor.
		if ( isset( $_GET['elementor-preview'] ) || ( class_exists( '\Elementor\Plugin' ) && isset( \Elementor\Plugin::$instance->preview ) && \Elementor\Plugin::$instance->preview->is_preview_mode() ) ) {
			return '';
		}
		if ( 'custom' === $style && ! hamista_core_option( 'preloader_image' ) ) {
			return 'logo';
		}
		return $style;
	}

	/**
	 * Styles, printed early so the loader paints with the first frame.
	 */
	public static function styles() {
		if ( ! self::style() ) {
			return;
		}
		$css = '
.hm-pl{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;background:var(--hm-bg,#fff);color:var(--hm-fg,#111);transition:opacity .6s cubic-bezier(.16,1,.3,1),visibility .6s,transform 1s cubic-bezier(.76,0,.24,1)}
.hm-pl--dark{background:#0b0b0c;color:#fff}.hm-pl--accent{background:var(--hm-accent,#111);color:var(--hm-accent-fg,#fff)}
.hm-pl__in{display:grid;justify-items:center;gap:22px;transition:opacity .4s,transform .6s cubic-bezier(.16,1,.3,1)}
.hm-pl__logo{display:block;height:clamp(34px,5vw,52px);animation:hm-pl-in .9s cubic-bezier(.16,1,.3,1) both}
.hm-pl__logo img{display:block;width:auto;height:100%}
.hm-pl__logo .hm-pl__dark{display:none}
[data-hm-theme="dark"] .hm-pl--auto .hm-pl__logo.has-dark .hm-pl__light,.hm-pl--dark .hm-pl__logo.has-dark .hm-pl__light{display:none}
[data-hm-theme="dark"] .hm-pl--auto .hm-pl__logo.has-dark .hm-pl__dark,.hm-pl--dark .hm-pl__logo.has-dark .hm-pl__dark{display:block}
.hm-pl__name{font:800 clamp(1.6rem,4vw,2.6rem)/1 var(--hm-font-heading,inherit)}
.hm-pl__bar{display:block;width:150px;height:2px;border-radius:2px;background:color-mix(in srgb,currentColor 14%,transparent);overflow:hidden}
.hm-pl__bar i{display:block;height:100%;background:var(--hm-accent,currentColor);transform:scaleX(0);transform-origin:right;transition:transform .25s linear}
[dir="ltr"] .hm-pl__bar i{transform-origin:left}
.hm-pl--accent .hm-pl__bar i{background:currentColor}
.hm-pl__num{display:none}
.hm-pl--counter .hm-pl__bar{width:min(360px,60vw)}
.hm-pl--counter .hm-pl__num{display:block;position:absolute;bottom:clamp(16px,4vw,48px);inset-inline-start:clamp(20px,4vw,56px);font:800 clamp(4.5rem,13vw,11rem)/.9 var(--hm-font-heading,inherit)}
.hm-pl--counter .hm-pl__num::after{content:"٪";font-size:.4em;margin-inline-start:.08em;opacity:.5}
.hm-pl__anim{max-width:min(220px,50vw);max-height:220px}
.hm-pl.is-done{opacity:0;visibility:hidden}
.hm-pl.is-done .hm-pl__in{opacity:0;transform:translateY(-12px)}
.hm-pl--curtain.is-done{opacity:1;transform:translateY(-100%);transition-delay:.15s}
.hm-pl--bar{inset:0 0 auto;height:3px;display:block;background:none}
.hm-pl--bar .hm-pl__in{display:block}.hm-pl--bar .hm-pl__logo{display:none}
.hm-pl--bar .hm-pl__bar{width:100%;height:3px;border-radius:0;background:none}
html.hm-pl-on{overflow:hidden}
@keyframes hm-pl-in{from{opacity:0;transform:translateY(10px) scale(.96)}}
@media (prefers-reduced-motion:reduce){.hm-pl,.hm-pl__in,.hm-pl__logo{transition-duration:.01s;animation:none}}';
		echo '<style id="hamista-preloader">' . preg_replace( '/\s*\n\s*/', '', $css ) . '</style>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static CSS.
		echo '<noscript><style>.hm-pl{display:none}html.hm-pl-on{overflow:auto}</style></noscript>' . "\n";
	}

	/**
	 * Markup and the script that runs it.
	 */
	public static function markup() {
		$style = self::style();
		if ( ! $style ) {
			return;
		}
		$tone = (string) hamista_core_option( 'preloader_tone', 'auto' );
		$tone = in_array( $tone, array( 'auto', 'dark', 'accent' ), true ) ? $tone : 'auto';
		$once = 'bar' !== $style && hamista_core_option( 'preloader_once', true );

		$inner = '';
		if ( 'custom' === $style ) {
			$inner = wp_get_attachment_image(
				(int) hamista_core_option( 'preloader_image' ),
				'full',
				false,
				array(
					'class'    => 'hm-pl__anim',
					'alt'      => '',
					'loading'  => 'eager',
					'decoding' => 'async',
				)
			);
		} elseif ( 'bar' !== $style ) {
			$inner = self::logo();
		}

		printf(
			'<div id="hm-preloader" class="hm-pl hm-pl--%1$s hm-pl--%2$s" data-once="%3$s" aria-hidden="true"><div class="hm-pl__in">%4$s<span class="hm-pl__bar"><i></i></span></div><b class="hm-pl__num">%5$s</b></div>',
			esc_attr( $style ),
			esc_attr( $tone ),
			$once ? '1' : '0',
			$inner, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- image markup from WordPress.
			esc_html( hamista_core_digits( '0' ) )
		);
		$fa = 0 === strpos( get_locale(), 'fa' ) ? '1' : '0';
		// Ready when the DOM and fonts are in (not every image), at least 0.7s for the motion to read, at most 3s.
		$js = '(function(d){var p=d.getElementById("hm-preloader");if(!p)return;var r=d.documentElement,k="hm-pl-seen",fa=' . $fa . ';
try{if(p.dataset.once==="1"&&sessionStorage.getItem(k)){p.remove();return;}}catch(e){}
if(!p.classList.contains("hm-pl--bar"))r.classList.add("hm-pl-on");
var bar=p.querySelector(".hm-pl__bar i"),num=p.querySelector(".hm-pl__num"),v=0,goal=86,t0=Date.now(),ended=false;
function draw(){bar.style.transform="scaleX("+(v/100)+")";if(num){var s=String(Math.round(v));num.textContent=fa?s.replace(/\d/g,function(c){return"۰۱۲۳۴۵۶۷۸۹"[c];}):s;}}
(function step(){if(ended)return;v+=(goal-v)*.08;draw();requestAnimationFrame(step);})();
function end(){if(ended)return;ended=true;v=100;draw();setTimeout(function(){p.classList.add("is-done");r.classList.remove("hm-pl-on");try{sessionStorage.setItem(k,"1");}catch(e){}setTimeout(function(){p.remove();},1300);},250);}
function ready(){var wait=Math.max(0,700-(Date.now()-t0));goal=100;setTimeout(end,wait);}
var f=d.fonts&&d.fonts.ready?d.fonts.ready:Promise.resolve();
if(d.readyState==="loading"){d.addEventListener("DOMContentLoaded",function(){f.then(ready);});}else{f.then(ready);}
setTimeout(end,3000);})(document);';
		wp_print_inline_script_tag( preg_replace( '/\s*\n\s*/', '', $js ) );
	}

	/**
	 * The site logo (light and dark), or the site name.
	 *
	 * @return string
	 */
	private static function logo() {
		$light = (int) get_theme_mod( 'custom_logo' );
		if ( ! $light ) {
			$light = (int) hamista_core_option( 'logo' );
		}
		$dark = (int) hamista_core_option( 'logo_dark' );
		if ( ! $light ) {
			return '<span class="hm-pl__name">' . esc_html( get_bloginfo( 'name' ) ) . '</span>';
		}
		$args  = array(
			'alt'      => '',
			'loading'  => 'eager',
			'decoding' => 'async',
		);
		$html  = '<span class="hm-pl__logo' . ( $dark ? ' has-dark' : '' ) . '">';
		$html .= wp_get_attachment_image( $light, 'full', false, $args + array( 'class' => 'hm-pl__light' ) );
		if ( $dark ) {
			$html .= wp_get_attachment_image( $dark, 'full', false, $args + array( 'class' => 'hm-pl__dark' ) );
		}
		return $html . '</span>';
	}
}
