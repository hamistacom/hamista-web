// Light/dark contrast check: every visible text on every public page, in both
// colour schemes, against WCAG AA (4.5:1, or 3:1 for large text). Text that sits
// on an image or gradient can't be measured reliably and is skipped.
// Usage: NODE_PATH=... node contrast.js [baseUrl]
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8080';

function check() {
	const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) { return null; } const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
	const lum = (c) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
	const blend = (top, under) => ({ r: top.r * top.a + under.r * (1 - top.a), g: top.g * top.a + under.g * (1 - top.a), b: top.b * top.a + under.b * (1 - top.a), a: 1 });
	function background(el) {
		const layers = [];
		for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
			const cs = getComputedStyle(n);
			if (cs.backgroundImage !== 'none' && !/^(HTML|BODY)$/.test(n.tagName)) { return null; }
			const c = parse(cs.backgroundColor);
			if (c && c.a > 0) { layers.push(c); if (c.a >= 1) { break; } }
		}
		let out = { r: 255, g: 255, b: 255, a: 1 };
		for (let i = layers.length - 1; i >= 0; i--) { out = blend(layers[i], out); }
		return out;
	}
	const MEDIA = '.hm-zoom__overlay, .hm-zoom__media, .hm-hero--full, .hm-depth--cover, .hm-card--overlay, .hm-imgr__cap, .hm-hscroll__card--caption, figcaption, [data-hm-on-media]';
	const bad = [];
	const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
	const seen = new Set();
	while (walker.nextNode()) {
		const t = walker.currentNode;
		const el = t.parentElement;
		if (!t.textContent.trim() || !el || seen.has(el)) { continue; }
		seen.add(el);
		const r = el.getBoundingClientRect();
		const cs = getComputedStyle(el);
		if (r.width < 2 || r.height < 2 || cs.visibility === 'hidden' || +cs.opacity === 0 || el.closest('[aria-hidden="true"], .screen-reader-text, [hidden], .hm-drawer:not(.is-open), .hm-search-overlay:not(.is-open), script, style, noscript')) { continue; }
		if (cs.webkitTextFillColor && cs.webkitTextFillColor !== cs.color && /0\)$/.test(cs.webkitTextFillColor)) { continue; }
		let fg = parse(cs.color);
		// Transparent text is painted another way (gradient clip, scroll scrub); text over
		// photos and video can't be measured from CSS.
		if (!fg || fg.a === 0 || el.closest(MEDIA)) { continue; }
		const bg = background(el);
		if (!bg) { continue; }
		if (fg.a < 1) { fg = blend(fg, bg); }
		const L1 = lum(fg), L2 = lum(bg);
		const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
		const size = parseFloat(cs.fontSize);
		const large = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700);
		if (ratio < (large ? 3 : 4.5)) { bad.push(ratio.toFixed(2) + '  "' + t.textContent.trim().slice(0, 40) + '"  <' + el.tagName.toLowerCase() + ' class="' + String(el.className).slice(0, 40) + '">'); }
	}
	return bad;
}

(async () => {
	const b = await chromium.launch();
	const probe = await b.newPage();
	await probe.goto(BASE + '/wp-json/wp/v2/pages?per_page=50&_fields=link');
	const pages = JSON.parse(await probe.evaluate(() => document.body.innerText)).map((p) => p.link);
	await probe.goto(BASE + '/wp-json/wp/v2/posts?per_page=1&_fields=link');
	const posts = JSON.parse(await probe.evaluate(() => document.body.innerText)).map((p) => p.link);
	await probe.close();
	let total = 0;
	for (const theme of ['light', 'dark']) {
		const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
		await ctx.addInitScript((t) => { try { localStorage.setItem('hm-theme', t); } catch (e) {} }, theme);
		for (const url of [...pages, ...posts]) {
			const p = await ctx.newPage();
			await p.goto(url, { waitUntil: 'networkidle' }).catch(() => {});
			// Scroll through so lazy backgrounds and reveal states settle.
			await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
			await p.waitForTimeout(300);
			const bad = await p.evaluate(check);
			if (bad.length) { total += bad.length; console.log('✗ [' + theme + '] ' + url.replace(BASE, '') + '\n    ' + bad.slice(0, 8).join('\n    ') + (bad.length > 8 ? '\n    … ' + (bad.length - 8) + ' more' : '')); }
			await p.close();
		}
		await ctx.close();
	}
	console.log(total ? total + ' low-contrast text(s)' : 'contrast: all clear');
	await b.close();
})();
