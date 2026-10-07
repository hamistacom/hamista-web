// Scroll a page like a visitor and capture the viewport at each top-level section,
// plus mid-way frames inside pinned scroll sections (horizontal scroll, zoom, stack).
// Usage: node scroll-shots.js <url> <out-dir> [width] [height] [theme] [hover-selector]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
	const [,, url, out, w = 1440, h = 900, theme = 'light', hover = ''] = process.argv;
	fs.mkdirSync(out, { recursive: true });
	const b = await chromium.launch();
	const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, hasTouch: +w < 800, isMobile: +w < 800 });
	await ctx.addInitScript((t) => { try { localStorage.setItem('hm-theme', t); } catch (e) {} }, theme);
	const p = await ctx.newPage();
	const errs = [];
	p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
	p.on('console', (m) => { if (m.type() === 'error' && !/agent-proxy|gravatar|ERR_TUNNEL|ERR_CONNECTION/i.test(m.text())) { errs.push('CONSOLE ' + m.text()); } });
	await p.goto(url, { waitUntil: 'networkidle' });
	await p.waitForTimeout(1500);

	// Frame positions: each top-level container's top, and inside tall (pinned) ones a few extra stops.
	const stops = await p.evaluate(() => {
		const vh = window.innerHeight;
		const list = [];
		const tops = [...document.querySelectorAll('.elementor > .e-con, .elementor > .elementor-section, .hm-footer')];
		tops.forEach((el, i) => {
			const r = el.getBoundingClientRect();
			const top = Math.max(0, r.top + window.scrollY - (i ? 0 : 0));
			const label = (el.querySelector('[data-hm-widget]') || el).getAttribute('data-hm-widget') || el.className.split(' ').find((c) => c.startsWith('hm-')) || 'section';
			if (r.height > vh * 1.6) {
				for (let k = 0; k <= 3; k++) { list.push({ y: Math.round(top + (r.height - vh) * (k / 3)), label: label + '-' + k }); }
			} else {
				list.push({ y: Math.round(top - (i ? 40 : 0)), label });
			}
		});
		return list;
	});

	let n = 0;
	let y0 = 0;
	for (const s of stops) {
		// Scroll in steps so scroll-driven effects update as they would for a visitor.
		const step = s.y > y0 ? 120 : -120;
		for (let y = y0; step > 0 ? y < s.y : y > s.y; y += step) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(16); }
		await p.evaluate((v) => window.scrollTo(0, v), s.y);
		y0 = s.y;
		await p.waitForTimeout(1300);
		n += 1;
		const file = path.join(out, String(n).padStart(2, '0') + '-' + s.label.replace(/[^a-z0-9-]/gi, '') + '.png');
		await p.screenshot({ path: file });
	}
	if (hover) {
		const el = await p.$(hover);
		if (el) {
			await el.scrollIntoViewIfNeeded();
			await p.waitForTimeout(800);
			await el.hover();
			await p.waitForTimeout(700);
			await p.screenshot({ path: path.join(out, 'hover.png') });
		}
	}
	console.log(n + ' frames' + (errs.length ? '\n' + errs.join('\n') : ''));
	await b.close();
})();
