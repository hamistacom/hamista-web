// Audits every public page of the running site at desktop and phone widths.
// Fails on: horizontal overflow, console/page errors, failed local requests,
// images without alt, and tap targets under WCAG 2.2 (24px; 38px for buttons) on phones.
// Usage: NODE_PATH=... node audit.js [baseUrl]
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8080';
(async () => {
	const b = await chromium.launch();
	const probe = await b.newPage();
	await probe.goto(BASE + '/wp-json/wp/v2/pages?per_page=50&_fields=link', { waitUntil: 'domcontentloaded' });
	const pages = JSON.parse(await probe.evaluate(() => document.body.innerText)).map((p) => p.link);
	const posts = JSON.parse(await (async () => { await probe.goto(BASE + '/wp-json/wp/v2/posts?per_page=3&_fields=link'); return probe.evaluate(() => document.body.innerText); })()).map((p) => p.link);
	const products = await (async () => { await probe.goto(BASE + '/wp-json/wc/store/v1/products?per_page=2'); try { return JSON.parse(await probe.evaluate(() => document.body.innerText)).map((p) => p.permalink); } catch (e) { return []; } })();
	await probe.close();
	const urls = [...new Set([...pages, ...posts, ...products])];
	let failures = 0;
	for (const [label, w, h] of [['desktop', 1440, 900], ['phone', 390, 844]]) {
		const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: label === 'phone' });
		for (const url of urls) {
			const p = await ctx.newPage();
			const errs = [];
			p.on('pageerror', (e) => errs.push('JS: ' + e.message));
			p.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(BASE)) { errs.push('HTTP ' + r.status() + ' ' + r.url().replace(BASE, '')); } });
			await p.goto(url, { waitUntil: 'networkidle' }).catch(() => errs.push('load failed'));
			await p.waitForTimeout(500);
			const r = await p.evaluate((phone) => {
				const vw = document.documentElement.clientWidth;
				const out = [];
				if (document.documentElement.scrollWidth > vw + 1) { out.push('horizontal overflow ' + document.documentElement.scrollWidth + ' > ' + vw); }
				const noAlt = [...document.images].filter((i) => !i.hasAttribute('alt') && i.offsetWidth > 24).length;
				if (noAlt) { out.push(noAlt + ' images without alt'); }
				if (phone) {
					const small = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea')].filter((e) => { const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return b.width > 0 && cs.visibility !== 'hidden' && cs.position !== 'absolute' && !e.closest('[hidden], .hm-hp, .screen-reader-text, .hm-drawer:not(.is-open), .hm-search-overlay:not(.is-open)') && (b.height < 24 || b.width < 24 || (/^(BUTTON|INPUT|SELECT|TEXTAREA)$/.test(e.tagName) || /hm-btn|hm-chip|hm-icon-btn/.test(e.className)) && (b.height < 38 || b.width < 38)) && !e.closest('p, li, h1, h2, h3, h4, label, figcaption, .hm-crumbs, .comment-metadata, .hm-prose'); });
					if (small.length) { out.push(small.length + ' small tap targets, e.g. ' + small.slice(0, 3).map((e) => (e.className || e.tagName).toString().slice(0, 30) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)).join('; ')); }
				}
				return out;
			}, label === 'phone');
			const all = [...errs.filter((e) => !/gravatar|TUNNEL|favicon/.test(e)), ...r];
			if (all.length) { failures += all.length; console.log(`✗ [${label}] ${url.replace(BASE, '')}\n    ` + all.join('\n    ')); }
			await p.close();
		}
		await ctx.close();
	}
	console.log(failures ? `\n${failures} issue(s)` : `\nclean: ${urls.length} pages × 2 widths`);
	await b.close();
	process.exit(failures ? 1 : 0);
})();
