// Capture a demo's home page as its importer thumbnail (800×500 WebP).
// Usage: node thumb.js <demo-id>
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
(async () => {
	const id = process.argv[2];
	const b = await chromium.launch();
	const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
	await ctx.addInitScript(() => { try { localStorage.setItem('hm-theme', 'light'); } catch (e) {} });
	const p = await ctx.newPage();
	await p.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
	await p.waitForTimeout(2200);
	const png = path.join(require('os').tmpdir(), `thumb-${id}.png`);
	await p.screenshot({ path: png });
	await b.close();
	const out = path.resolve(__dirname, '../../wp/hamista-core/demos', id, 'thumb.webp');
	execFileSync('python3', ['-c', `
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB').resize((800, 500), Image.LANCZOS)
im.save(sys.argv[2], 'WEBP', quality=82, method=6)
`, png, out]);
	console.log('thumb →', out);
})();
