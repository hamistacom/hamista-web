// Render an SVG (inline, so library fonts apply to its text) to a transparent PNG.
// Usage: NODE_PATH=/opt/node-tools/node_modules node svg-render.js <in.svg> <out.png> <width>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
	const [,, input, out, width = 1200] = process.argv;
	const lib = path.resolve(__dirname, '../../wp/hamista-core/assets/fonts/library');
	const faces = ['doran-400', 'doran-500', 'doran-700', 'doran-800'].map((f) => `@font-face{font-family:Doran;src:url(file://${lib}/doran/${f}.woff2);font-weight:${f.split('-')[1]}}`).join('');
	const svg = fs.readFileSync(input, 'utf8');
	const b = await chromium.launch();
	const p = await b.newPage({ viewport: { width: +width, height: 400 }, deviceScaleFactor: 1 });
	await p.setContent(`<!doctype html><html dir="rtl"><head><style>${faces}html,body{margin:0;background:transparent}svg{display:block;width:${width}px;height:auto}</style></head><body>${svg}</body></html>`);
	await p.evaluate(() => document.fonts.ready);
	await p.waitForTimeout(300);
	await (await p.$('svg')).screenshot({ path: out, omitBackground: true });
	await b.close();
})();
