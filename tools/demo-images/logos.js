// Renders each demo's logo (light and dark) to demos/<id>/images/logo(.dark).webp with transparency.
// Usage: NODE_PATH=/opt/node-tools/node_modules node logos.js [id …]
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
const os = require('os');
(async () => {
	const b = await chromium.launch();
	const p = await b.newPage({ deviceScaleFactor: 1, viewport: { width: 900, height: 300 } });
	const jobs = [];
	const ids = process.argv.slice(2).length ? process.argv.slice(2) : ['spark', 'agency', 'industrial', 'honey', 'nomad', 'flux', 'rahnavard', 'parvazyar'];
	for (const id of ids) {
		for (const dark of [0, 1]) {
			await p.goto('file://' + path.join(__dirname, 'logos.html') + `?id=${id}&dark=${dark}`);
			await p.waitForSelector('body[data-ready="1"]');
			const png = path.join(os.tmpdir(), `logo-${id}-${dark}.png`);
			await (await p.$('#logo')).screenshot({ path: png, omitBackground: true });
			jobs.push([png, path.resolve(__dirname, '../../wp/hamista-core/demos', id, 'images', dark ? 'logo-dark.webp' : 'logo.webp')]);
		}
	}
	await b.close();
	execFileSync('python3', ['-c', `
import sys, json
from PIL import Image
for src, dst in json.loads(sys.argv[1]):
    im = Image.open(src).convert('RGBA')
    im = im.crop(im.getbbox())
    im.save(dst, 'WEBP', lossless=True, method=6)
    print(dst.split('/demos/')[1], im.size)
`, JSON.stringify(jobs)], { stdio: 'inherit' });
})();
