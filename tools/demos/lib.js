/**
 * Helpers that turn compact page descriptions into Elementor layout data.
 *
 * Tokens resolved by the importer (wp/hamista-core/includes/demos/class-importer.php):
 *   img('key')              → media value          gallery(['a','b']) → gallery value
 *   '{{page:key}}' '{{post:key}}' '{{product:key}}' '{{shop}}' '{{blog}}' '{{cart}}' '{{account}}' '{{home}}'
 *   '{{img:key}}' '{{imgid:key}}' '{{term:key}}' '{{termlink:key}}' '{{ids:a,b}}'
 */
'use strict';

const crypto = require('crypto');

let seed = 'hamista';
let counter = 0;
/** Deterministic 7-character element IDs, so rebuilding a demo gives a stable diff. */
function uid() {
	counter += 1;
	return crypto.createHash('md5').update(seed + ':' + counter).digest('hex').slice(0, 7);
}
function reset(demoId) { seed = demoId; counter = 0; }

const img = (key) => ({ __img: key });
const gallery = (keys) => ({ __gallery: keys });
const link = (url, external = false) => ({ url, is_external: external ? 'on' : '', nofollow: '', custom_attributes: '' });
const px = (size) => ({ unit: 'px', size, sizes: [] });
const pct = (size) => ({ unit: '%', size, sizes: [] });
const gap = (size) => ({ column: String(size), row: String(size), isLinked: true, unit: 'px', size });
const pad = (t, r = t, b = t, l = r) => ({ unit: 'px', top: String(t), right: String(r), bottom: String(b), left: String(l), isLinked: t === r && r === b && b === l });

/** A widget. */
function w(type, settings = {}) {
	return { id: uid(), elType: 'widget', isInner: false, widgetType: type, settings, elements: [] };
}

/** A container. */
function con(settings, elements, inner = false) {
	return { id: uid(), elType: 'container', isInner: inner, settings: Object.assign({ container_type: 'flex' }, settings), elements };
}

/** Full-bleed section for widgets that draw their own section (hero, hscroll, zoom, path, cta, marquee). */
function bleed(widget, extra = {}) {
	return con(Object.assign({ content_width: 'full', css_classes: 'hm-bleed', flex_gap: gap(0) }, extra), [widget]);
}

/**
 * A boxed page section.
 * opts: space (none|sm|md|lg), scheme (surface|inverse|accent), cls, gap, width, top0, bottom0
 */
function section(opts, elements) {
	const cls = ['hm-gutter', 'hm-space-' + (opts.space || 'md')];
	if (opts.scheme) { cls.push('hm-scheme-' + opts.scheme); }
	if (opts.top0) { cls.push('hm-space-top-0'); }
	if (opts.bottom0) { cls.push('hm-space-bottom-0'); }
	if (opts.cls) { cls.push(opts.cls); }
	const s = { content_width: 'boxed', css_classes: cls.join(' '), flex_gap: gap(opts.gap ?? 48) };
	if (opts.width) { s.boxed_width = px(opts.width); }
	if (opts.align) { s.flex_align_items = opts.align; }
	return con(s, elements);
}

/**
 * Columns inside a section: cols([[widths], children…]).
 * cols({ widths: [50, 50], gap: 48, align: 'center', reverse: false }, [colA, colB])
 */
function cols(opts, columns) {
	const widths = opts.widths || columns.map(() => Math.floor(100 / columns.length));
	return con(
		{
			content_width: 'full',
			flex_direction: 'row',
			flex_direction_mobile: opts.reverseMobile ? 'column-reverse' : 'column',
			flex_wrap: 'nowrap',
			flex_gap: gap(opts.gap ?? 56),
			flex_gap_mobile: gap(opts.gapMobile ?? 32),
			flex_align_items: opts.align || 'stretch',
			padding: pad(0),
			css_classes: opts.cls || '',
		},
		columns.map((children, i) => con(
			{
				content_width: 'full',
				width: pct(widths[i]),
				width_tablet: pct(opts.stackTablet ? 100 : widths[i]),
				width_mobile: pct(100),
				flex_gap: gap(opts.innerGap ?? 24),
				padding: pad(0),
				flex_justify_content: opts.justify || '',
				css_classes: (opts.colCls && opts.colCls[i]) || '',
			},
			Array.isArray(children) ? children : [children],
			true
		)),
		true
	);
}

/* ---------------- Widget shorthands (settings mirror each widget's controls) ---------------- */

const heading = (s) => w('hm-heading', Object.assign({ title_tag: 'h2', title_size: 'lg', header_align: 'start', title_reveal: 'words' }, s));
const button = (text, url, style = 'primary', extra = {}) => w('hm-button', Object.assign({ btn1_text: text, btn1_link: link(url), btn1_style: style, btn2_text: '', mobile_full: 'yes' }, extra));
const buttons = (a, b, extra = {}) => w('hm-button', Object.assign({ btn1_text: a[0], btn1_link: link(a[1]), btn1_style: a[2] || 'primary', btn2_text: b[0], btn2_link: link(b[1]), btn2_style: b[2] || 'secondary', mobile_full: 'yes' }, extra));
const textEditor = (html) => w('text-editor', { editor: html });
const spacer = (size) => w('spacer', { space: px(size) });

function hero(s) {
	return bleed(w('hm-hero', Object.assign({ layout: 'split', title_tag: 'h1', title_size: 'xl', header_align: 'start', title_reveal: 'words', btn1_style: 'primary', btn2_style: 'secondary', media_type: 'image', media_ratio: 'portrait', height: 'screen', decor: 'grid', hint: '' }, s)));
}
const marquee = (items, s = {}) => bleed(w('hm-marquee', Object.assign({ items: items.map((t) => (typeof t === 'string' ? { text: t } : t)), separator: 'dot', size: 'lg', look: 'alternate', speed: px(60), follow: 'yes', bordered: 'yes' }, s)));
const textScrub = (text, s = {}) => w('hm-text-scrub', Object.assign({ text, size: 'lg' }, s));
const scrollZoom = (s) => bleed(w('hm-scroll-zoom', Object.assign({ title_tag: 'h2', title_size: 'xl', header_align: 'center', title_reveal: 'words', start_scale: px(0.42), radius: px(28), length: px(3), btn1_style: 'inverse' }, s)));
const hscroll = (s) => bleed(w('hm-hscroll', Object.assign({ title_tag: 'h2', title_size: 'lg', header_align: 'start', title_reveal: 'words', card_size: 'md', card_style: 'caption', length: px(1), progress: 'yes', btn1_style: 'secondary' }, s)));
const scrollPath = (s) => bleed(w('hm-scroll-path', Object.assign({ title_tag: 'h2', title_size: 'xl', header_align: 'center', title_reveal: 'words', length: px(4.2) }, s)));
const stack = (items) => w('hm-stack', { items });
const depth = (s) => bleed(w('hm-depth', Object.assign({ layout: 'card', length: px(1), glow: 'yes', scheme: 'inverse' }, s)));
/** Floating elements: items are { image?, text?, shape, x, y, size, depth, rot } in plain numbers. */
const flow = (s) => {
	const items = (s.items || []).map((i) => ({
		image: i.image || {}, text: i.text || '', shape: i.shape || 'card', mobile: i.mobile === false ? '' : 'yes',
		x: px(i.x), y: px(i.y), size: px(i.size || 180), depth: px(i.depth ?? 0.5), rot: px(i.rot || 0),
	}));
	return bleed(w('hm-flow', Object.assign({ title_tag: 'h1', title_size: 'xxl', header_align: 'center', title_reveal: 'words', btn1_style: 'primary', mode: 'drift', strength: px(1), float: 'yes' }, s, { items })));
};
const imageReveal = (key, s = {}) => w('hm-image-reveal', Object.assign({ image: img(key), ratio: '4-3', reveal: 'clip-up', parallax: px(0.4), frame: '' }, s));
const counters = (items, s = {}) => w('hm-counters', Object.assign({ items, style: 'plain', duration: 2, grouping: 'yes' }, s));
const features = (items, s = {}) => w('hm-features', Object.assign({ items, layout: 'grid', style: 'cards', icon_style: 'tile', link_text: '' }, s));
const steps = (items, s = {}) => w('hm-steps', Object.assign({ items, layout: 'h', cards: 'yes' }, s));
const tabs = (items, s = {}) => w('hm-tabs', Object.assign({ items, autoplay: 6, media_side: 'end' }, s));
const faq = (items, s = {}) => w('hm-accordion', Object.assign({ items: items.map(([q, a]) => ({ q, a: '<p>' + a + '</p>' })), first_open: 'yes', single: 'yes', schema: 'yes', style: 'cards' }, s));
const testimonials = (items, s = {}) => w('hm-testimonials', Object.assign({ items: items.map((t) => Object.assign({ rating: '5' }, t)), layout: 'grid' }, s));
const pricing = (plans, s = {}) => w('hm-pricing', Object.assign({ plans, switch_off: '', switch_on: '' }, s));
const team = (people, s = {}) => w('hm-team', Object.assign({ people, mono: '' }, s));
const cta = (s) => bleed(w('hm-cta', Object.assign({ title_tag: 'h2', title_size: 'xl', header_align: 'center', title_reveal: 'words', action: 'buttons', btn1_style: 'primary', btn2_style: 'ghost', look: 'inverse', decor: 'grid', rounded: '' }, s)));
const contactForm = (s = {}) => w('hm-contact-form', s);
const leadForm = (s = {}) => w('hm-lead-form', s);
const contactInfo = (items, s = {}) => w('hm-contact-info', Object.assign({ items }, s));
const posts = (s = {}) => w('hm-posts', Object.assign({ count: 3, orderby: 'date', offset: 0, layout: 'grid', excerpt: 'yes' }, s));
const products = (s = {}) => w('hm-products', Object.assign({ source: 'recent', count: 4, columns: '4' }, s));
const device = (s) => w('hm-device', s);

/* ---------------- Content helpers ---------------- */

/** A blog post body from a compact outline: strings are paragraphs; ['h', text], ['ul', [...]], ['q', text, cite], ['img', key, caption]. */
function article(blocks) {
	return blocks.map((b) => {
		if (typeof b === 'string') { return '<!-- wp:paragraph -->\n<p>' + b + '</p>\n<!-- /wp:paragraph -->'; }
		const [t, a, c] = b;
		if (t === 'h') { return '<!-- wp:heading -->\n<h2 class="wp-block-heading">' + a + '</h2>\n<!-- /wp:heading -->'; }
		if (t === 'h3') { return '<!-- wp:heading {"level":3} -->\n<h3 class="wp-block-heading">' + a + '</h3>\n<!-- /wp:heading -->'; }
		if (t === 'ul') { return '<!-- wp:list -->\n<ul class="wp-block-list">' + a.map((li) => '<!-- wp:list-item -->\n<li>' + li + '</li>\n<!-- /wp:list-item -->').join('\n') + '</ul>\n<!-- /wp:list -->'; }
		if (t === 'ol') { return '<!-- wp:list {"ordered":true} -->\n<ol class="wp-block-list">' + a.map((li) => '<!-- wp:list-item -->\n<li>' + li + '</li>\n<!-- /wp:list-item -->').join('\n') + '</ol>\n<!-- /wp:list -->'; }
		if (t === 'q') { return '<!-- wp:quote -->\n<blockquote class="wp-block-quote"><!-- wp:paragraph -->\n<p>' + a + '</p>\n<!-- /wp:paragraph -->' + (c ? '<cite>' + c + '</cite>' : '') + '</blockquote>\n<!-- /wp:quote -->'; }
		if (t === 'img') { return '<!-- wp:image {"id":{{imgid:' + a + '}},"sizeSlug":"large","linkDestination":"none"} -->\n<figure class="wp-block-image size-large"><img src="{{img:' + a + '}}" alt="" class="wp-image-{{imgid:' + a + '}}"/>' + (c ? '<figcaption class="wp-element-caption">' + c + '</figcaption>' : '') + '</figure>\n<!-- /wp:image -->'; }
		throw new Error('Unknown block ' + t);
	}).join('\n\n');
}

/** Product long description. */
function productBody(paragraphs, specs) {
	let html = paragraphs.map((p) => '<p>' + p + '</p>').join('\n');
	if (specs && specs.length) {
		html += '\n<table><tbody>' + specs.map(([k, v]) => '<tr><th>' + k + '</th><td>' + v + '</td></tr>').join('') + '</tbody></table>';
	}
	return html;
}

/** Page settings for Hamista's layout options. */
const pageSettings = (o = {}) => Object.assign({ hm_header: o.header || '', hm_footer: o.footer || '', hm_title: o.title || 'hide' }, o.extra || {});

module.exports = {
	reset, uid, img, gallery, link, px, pct, gap, pad, w, con, bleed, section, cols,
	heading, button, buttons, textEditor, spacer, hero, marquee, textScrub, scrollZoom, hscroll, scrollPath, stack, depth, flow,
	imageReveal, counters, features, steps, tabs, faq, testimonials, pricing, team, cta, contactForm, leadForm,
	contactInfo, posts, products, device, article, productBody, pageSettings,
};
