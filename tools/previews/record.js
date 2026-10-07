const { chromium } = require('playwright');
const path = require('path');
(async () => {
	const b = await chromium.launch();
	const ctx = await b.newContext({ viewport: { width: 1440, height: 660 }, recordVideo: { dir: 'out/vid', size: { width: 1440, height: 660 } } });
	const p = await ctx.newPage();
	await p.goto('file://' + path.resolve('bakhtiari.html'));
	await p.waitForTimeout(800);
	const pts = [[720,330],[150,200],[200,600],[700,620],[1300,560],[1350,120],[700,40],[400,330],[720,330]];
	for (const [x,y] of pts) { await p.mouse.move(x, y, { steps: 45 }); await p.waitForTimeout(450); }
	await p.waitForTimeout(600);
	await ctx.close(); await b.close();
})();
