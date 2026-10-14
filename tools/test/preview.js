// Full home page of the imported demo, light and dark, for the importer's preview window
// (720 px wide WebP: demos/<id>/preview.webp and preview-dark.webp).
// Usage: NODE_PATH=/opt/node-tools/node_modules node preview.js <demo-id>
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
const os = require('os');
(async () => {
	const id = process.argv[2];
	const b = await chromium.launch();
	const jobs = [];
	for (const tone of ['light', 'dark']) {
		const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
		await ctx.addInitScript((v) => { try { localStorage.setItem('hm-theme', v); sessionStorage.setItem('hm-pl-seen', '1'); } catch (e) {} }, tone);
		const p = await ctx.newPage();
		await p.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
		await p.waitForTimeout(1200);
		const h = await p.evaluate(() => document.documentElement.scrollHeight);
		for (let y = 0; y < h; y += 450) { await p.evaluate((v) => scrollTo(0, v), y); await p.waitForTimeout(110); }
		await p.evaluate(() => scrollTo(0, 0));
		// Settle every scroll effect in its finished state and keep the header in place.
		await p.addStyleTag({ content: '[data-hm-reveal],[data-hm-stagger]>*,.hm-reveal{opacity:1!important;transform:none!important;clip-path:none!important;filter:none!important}.hm-header,.hm-site-header,header.is-sticky{position:absolute!important}.hm-cursor,.hm-cursor-ring,.hm-cursor-bead,.hm-to-top,.hm-mobile-bar{display:none!important}' });
		await p.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; }));
		await p.waitForLoadState('networkidle');
		await p.waitForTimeout(900);
		const png = path.join(os.tmpdir(), `preview-${id}-${tone}.png`);
		await p.screenshot({ path: png, fullPage: true });
		jobs.push([png, path.resolve(__dirname, '../../wp/hamista-core/demos', id, tone === 'light' ? 'preview.webp' : 'preview-dark.webp')]);
		await ctx.close();
	}
	await b.close();
	execFileSync('python3', ['-c', `
import sys, json
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
for src, dst in json.loads(sys.argv[1]):
    im = Image.open(src).convert('RGB')
    h = round(im.height * 720 / im.width)
    im = im.resize((720, h), Image.LANCZOS)
    if h > 16000:
        im = im.crop((0, 0, 720, 16000))
    im.save(dst, 'WEBP', quality=62, method=6)
    print(dst.split('/demos/')[1], im.size)
`, JSON.stringify(jobs)], { stdio: 'inherit' });
})();
