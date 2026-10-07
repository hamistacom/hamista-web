// Reports the height of every top-level section on a page at laptop size.
// Sections taller than the visible laptop area (820px) are flagged unless they
// are scroll stages (pinned widgets that are tall on purpose).
// Usage: NODE_PATH=... node heights.js <url> [width] [height]
const { chromium } = require('playwright');
(async () => {
	const [,, url, w = 1440, h = 820] = process.argv;
	const b = await chromium.launch();
	const p = await b.newPage({ viewport: { width: +w, height: +h } });
	await p.goto(url, { waitUntil: 'networkidle' });
	const rows = await p.evaluate(() => {
		const root = document.querySelector('.elementor[data-elementor-type="wp-page"]') || document.querySelector('main');
		const top = root ? [...root.children] : [];
		return top.map((el) => {
			const stage = el.querySelector('.hm-zoom, .hm-hscroll, .hm-path, .hm-depth, .hm-stack');
			return { id: el.dataset.id || el.className.split(' ')[0], h: Math.round(el.getBoundingClientRect().height), stage: !!stage };
		});
	});
	let total = 0;
	rows.forEach((r) => {
		total += r.h;
		console.log((r.h > +h && !r.stage ? '✗ ' : '  ') + String(r.h).padStart(5) + 'px  ' + r.id + (r.stage ? '  (scroll stage)' : ''));
	});
	console.log('page: ' + total + 'px = ' + (total / +h).toFixed(1) + ' screens');
	await b.close();
})();
