// Renders demo images from scenes.html → WebP.
// Usage: NODE_PATH=/opt/node-tools/node_modules node render.js [only-prefix]
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../wp/hamista-core/demos');
const TMP = path.join(require('os').tmpdir(), 'hm-demo-png');
fs.mkdirSync(TMP, { recursive: true });

const set = [];
const add = (dir, name, s, w, h, extra = {}) => set.push({ dir, name, s, w, h, ...extra });

// Spark — digital studio / school.
['ui-booking', 'ui-dashboard', 'ui-chat', 'ui-habit', 'ui-finance', 'ui-landing', 'ui-system', 'ui-music'].forEach((s, i) => add('spark', `ui-${i + 1}`, s, 1200, 1500, { v: [1, 3, 4, 5, 6, 2, 7, 8][i] }));
add('spark', 'studio', 'studio', 2000, 1125);
for (let v = 1; v <= 8; v++) add('spark', `journal-${v}`, 'poster', 1600, 1000, { v });
for (let v = 1; v <= 6; v++) {
	add('spark', `course-${v}`, 'course', 1000, 1000, { v });
	add('spark', `course-${v}-b`, 'course', 1000, 1000, { v, alt: 1 });
}
add('spark', 'workspace', 'workspace', 1600, 1200);
add('spark', 'community', 'community', 1600, 1200);

// Industrial — hardware lab.
for (let v = 1; v <= 6; v++) {
	add('industrial', `device-${v}`, 'product', 1200, 1200, { v });
	add('industrial', `device-${v}-dark`, 'product', 1200, 1200, { v, dark: 1 });
}
add('industrial', 'hero', 'ind-hero', 2000, 1125);
for (let v = 1; v <= 4; v++) add('industrial', `drawing-${v}`, 'blueprint', 1600, 1000, { v });
add('industrial', 'workbench', 'workbench', 1600, 1200);

// Shared.
for (let v = 1; v <= 6; v++) add('shared', `person-${v}`, 'portrait', 800, 1000, { v });

(async () => {
	const only = process.argv[2] || '';
	const browser = await chromium.launch();
	const page = await browser.newPage({ deviceScaleFactor: 1 });
	const jobs = [];
	for (const it of set) {
		const id = `${it.dir}/${it.name}`;
		if (only && !id.startsWith(only)) continue;
		const qs = new URLSearchParams({ s: it.s, w: it.w, h: it.h, v: it.v || 1 });
		if (it.dark) qs.set('dark', '1');
		if (it.alt) qs.set('alt', '1');
		await page.setViewportSize({ width: it.w, height: it.h });
		await page.goto('file://' + path.join(__dirname, 'scenes.html') + '?' + qs);
		await page.waitForSelector('body[data-ready="1"]');
		await page.waitForTimeout(60);
		const png = path.join(TMP, id.replace('/', '__') + '.png');
		await (await page.$('#stage')).screenshot({ path: png });
		const out = path.join(ROOT, it.dir, 'images', it.name + '.webp');
		fs.mkdirSync(path.dirname(out), { recursive: true });
		jobs.push([png, out]);
		process.stdout.write('.');
	}
	await browser.close();
	fs.writeFileSync(path.join(TMP, 'jobs.json'), JSON.stringify(jobs));
	execFileSync('python3', ['-c', `
import json, sys
from PIL import Image
for src, dst in json.load(open(sys.argv[1])):
    Image.open(src).convert('RGB').save(dst, 'WEBP', quality=80, method=6)
`, path.join(TMP, 'jobs.json')], { stdio: 'inherit' });
	console.log(`\n${jobs.length} images`);
})();
