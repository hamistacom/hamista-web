// Usage: node shot.js <url> <out.png> [width] [height] [theme] [full]
const { chromium } = require('playwright');
(async () => {
  const [,, url, out, w = 1440, h = 900, theme = '', full = '1'] = process.argv;
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
  if (theme) await ctx.addInitScript(t => { try { localStorage.setItem('hm-theme', t); } catch (e) {} }, theme);
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await p.goto(url, { waitUntil: 'networkidle' });
  // Scroll through so reveal-on-scroll elements resolve, then back to top.
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(900);
  await p.screenshot({ path: out, fullPage: full === '1' });
  if (errs.length) console.log(errs.join('\n'));
  await b.close();
})();
