// Renders a local HTML file to PNG once its fonts are ready.
// Usage: NODE_PATH=/opt/node-tools/node_modules node render-html.js <file.html> <out.png> <width> <height>
const { chromium } = require('playwright');
const path = require('path');
(async () => {
	const [,, file, out, w, h] = process.argv;
	const b = await chromium.launch();
	const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
	await p.goto('file://' + path.resolve(file));
	await p.evaluate(() => document.fonts.ready);
	await p.waitForTimeout(200);
	await p.screenshot({ path: out });
	await b.close();
})();
