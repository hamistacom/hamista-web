// Scroll through a page like a visitor and capture viewport frames into a contact sheet.
// Usage: node frames.js <url> <out.png> [width=1440] [height=900] [theme=light] [startY=0] [endY=all] [step=0.85] [cols=3]
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
(async () => {
  const [,, url, out, w = 1440, h = 900, theme = 'light', start = 0, end = 'all', step = 0.85, cols = 3] = process.argv;
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +w, height: +h } });
  await ctx.addInitScript(t => { try { localStorage.setItem('hm-theme', t); } catch (e) {} }, theme);
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  const total = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const last = end === 'all' ? total : Math.min(total, +end);
  const frames = [];
  for (let y = +start, i = 0; y <= last + 1 && i < 60; y += Math.round(+h * +step), i++) {
    // Scroll in small native steps so scroll-linked code sees continuous movement.
    await p.evaluate(async target => { const s = scrollY; const n = 6; for (let k = 1; k <= n; k++) { window.scrollTo(0, s + (target - s) * k / n); await new Promise(r => requestAnimationFrame(r)); } }, Math.min(y, last));
    await p.waitForTimeout(650);
    const f = `${out.replace(/\.png$/, '')}-f${String(i).padStart(2, '0')}.png`;
    await p.screenshot({ path: f });
    frames.push(f);
  }
  await b.close();
  execFileSync('python3', ['-c', `
import sys
from PIL import Image
files=sys.argv[2:]; cols=int(sys.argv[1]); tw=480
ims=[Image.open(f) for f in files]
th=int(ims[0].height*tw/ims[0].width)
rows=(len(ims)+cols-1)//cols
sheet=Image.new('RGB',(cols*tw+(cols-1)*8, rows*th+(rows-1)*8),'#888')
for i,im in enumerate(ims):
    sheet.paste(im.resize((tw,th)),((i%cols)*(tw+8),(i//cols)*(th+8)))
sheet.save('${out}')
`, String(cols), ...frames]);
  console.log(`${frames.length} frames → ${out}`);
  if (errs.length) console.log(errs.join('\n'));
})();
