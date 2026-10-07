// node shoot.js <file.html> <out.png> [width] [height] [theme] [mouseX] [mouseY]
const { chromium } = require('playwright');
const path = require('path');
(async () => {
	const [,, file, out, w = 1440, h = 700, theme = 'light', mx, my] = process.argv;
	const b = await chromium.launch();
	const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
	await p.goto('file://' + path.resolve(file));
	await p.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
	await p.waitForTimeout(400);
	if (mx) { await p.mouse.move(+w / 2, +h / 2); await p.mouse.move(+mx, +my, { steps: 20 }); await p.waitForTimeout(1500); }
	await p.screenshot({ path: out });
	await b.close();
})();
