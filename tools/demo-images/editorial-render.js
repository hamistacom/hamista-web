// Renders editorial prints (covers, cards, letterheads, posters, swatches,
// reports, sketch pages) from a JSON list to PNG files, in one browser session.
// Usage: NODE_PATH=/opt/node-tools/node_modules node editorial-render.js <spec.json> <out-dir>
// spec: [{ "name": "cover-1", "w": 1000, "h": 1400, "p": { "t": "cover", ... } }, ...]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
	const [,, specFile, outDir] = process.argv;
	const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
	fs.mkdirSync(outDir, { recursive: true });
	const b = await chromium.launch();
	const page = await b.newPage({ deviceScaleFactor: 1 });
	const file = 'file://' + path.join(__dirname, 'editorial.html');
	for (const item of spec) {
		await page.setViewportSize({ width: item.w, height: item.h });
		await page.goto(file + '#' + encodeURIComponent(JSON.stringify(item.p)));
		await page.goto('about:blank');
		await page.goto(file + '#' + encodeURIComponent(JSON.stringify(item.p)));
		await page.waitForSelector('body[data-ready="1"]');
		await page.evaluate(() => document.fonts.ready);
		await page.waitForTimeout(60);
		await page.screenshot({ path: path.join(outDir, item.name + '.png') });
		process.stdout.write(item.name + ' ');
	}
	await b.close();
	console.log('\ndone', spec.length);
})();
