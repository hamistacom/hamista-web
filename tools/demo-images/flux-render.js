// Renders the Flux (creative studio) demo artwork from flux.html → WebP.
// Usage: NODE_PATH=/opt/node-tools/node_modules node flux-render.js
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const OUT = path.resolve(__dirname, '../../wp/hamista-core/demos/flux/images');
const set = [];
const add = (name, s, w, h, v = 1) => set.push({ name, s, w, h, v });
add('hero', 'hero', 2000, 1125);
for (let v = 1; v <= 6; v++) add('orb-' + v, 'orb', 1600, 1000, v);
for (let v = 1; v <= 4; v++) add('glass-' + v, 'glass', 1600, 1000, v);
for (let v = 1; v <= 3; v++) add('ribbon-' + v, 'ribbon', 2000, 1125, v);
add('chat', 'chat', 1600, 1000, 1);
for (let v = 1; v <= 6; v++) add('journal-' + v, 'type', 1600, 1000, v);
for (let v = 1; v <= 6; v++) { add('product-' + v, 'product', 1000, 1000, v); add('product-' + v + '-b', 'orb', 1000, 1000, v + 1); }
const floats = [['orb', 1], ['glass', 2], ['ribbon', 2], ['orb', 3], ['chat', 2], ['orb', 5], ['glass', 3], ['orb', 6]];
floats.forEach(([s, v], i) => add('float-' + (i + 1), s, 800, 600, v));
(async () => {
	fs.mkdirSync(OUT, { recursive: true });
	const b = await chromium.launch();
	const p = await b.newPage({ deviceScaleFactor: 1 });
	const jobs = [];
	for (const it of set) {
		await p.setViewportSize({ width: it.w, height: it.h });
		await p.goto('file://' + path.join(__dirname, 'flux.html') + `?s=${it.s}&v=${it.v}&w=${it.w}&h=${it.h}`);
		await p.waitForSelector('body[data-ready="1"]');
		await p.waitForTimeout(80);
		const png = path.join(require('os').tmpdir(), 'flux-' + it.name + '.png');
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
