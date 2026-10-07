// Renders the agency (Tapesh) demo artwork from agency.html → WebP.
// Usage: NODE_PATH=/opt/node-tools/node_modules node agency-render.js
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const OUT = path.resolve(__dirname, '../../wp/hamista-core/demos/agency/images');
const set = [];
const add = (name, s, w, h, v = 1) => set.push({ name, s, w, h, v });
add('showreel', 'showreel', 2000, 1125);
add('dashboard', 'dashboard', 1600, 1200);
for (let v = 1; v <= 6; v++) add('work-' + v, 'work', 1600, 1200, v);
for (let v = 1; v <= 4; v++) add('social-' + v, 'social', 1200, 1500, v);
for (let v = 1; v <= 6; v++) add('product-' + v, 'product', 1000, 1000, v);
for (let v = 1; v <= 6; v++) add('journal-' + v, 'journal', 1600, 1000, v);
(async () => {
	fs.mkdirSync(OUT, { recursive: true });
	const only = process.argv[2] || '';
	const b = await chromium.launch();
	const p = await b.newPage({ deviceScaleFactor: 1 });
	const jobs = [];
	for (const it of set) {
		if (only && !it.name.startsWith(only)) continue;
		await p.setViewportSize({ width: it.w, height: it.h });
		await p.goto('file://' + path.join(__dirname, 'agency.html') + `?s=${it.s}&v=${it.v}&w=${it.w}&h=${it.h}`);
		await p.waitForSelector('body[data-ready="1"]');
		await p.waitForTimeout(80);
		const png = path.join(require('os').tmpdir(), 'agency-' + it.name + '.png');
		await (await p.$('#stage')).screenshot({ path: png });
		jobs.push([png, path.join(OUT, it.name + '.webp')]);
	}
	await b.close();
	execFileSync('python3', ['-c', `
import sys, json
from PIL import Image
for src, dst in json.loads(sys.argv[1]):
    Image.open(src).convert('RGB').save(dst, 'WEBP', quality=78, method=6)
`, JSON.stringify(jobs)], { stdio: 'inherit' });
	console.log(jobs.length + ' images');
})();
