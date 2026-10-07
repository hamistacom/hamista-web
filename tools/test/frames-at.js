// Usage: node frames-at.js <url> <outdir> [width] [height] [step] [theme]
// Viewport frames every <step> px, scrolled gradually so scroll-linked effects settle.
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [,, url, out, w = 1440, h = 900, step = 450, theme = ''] = process.argv;
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
  if (theme) await ctx.addInitScript(t => { try { localStorage.setItem('hm-theme', t); } catch (e) {} }, theme);
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  const total = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  let y = 0, i = 0;
  while (y <= total + 1) {
    await p.evaluate(async (t) => {
      const from = scrollY;
      for (let k = 1; k <= 6; k++) { window.scrollTo(0, from + (t - from) * k / 6); await new Promise(r => requestAnimationFrame(r)); }
    }, y);
    await p.waitForTimeout(450);
    await p.screenshot({ path: `${out}/${String(i).padStart(2, '0')}.png` });
    i++; y += +step;
  }
  if (errs.length) console.log(errs.join('\n'));
  console.log('frames', i);
  await b.close();
})();
