// Usage: node booking-flow.js <page-url> <out-dir> [width] [theme] [day-index]
// Walks the booking widget: expert → day and time → details → done, with a screenshot per step.
const { chromium } = require('playwright');
(async () => {
  const [,, url, out, w = 1440, theme = '', pick = '1'] = process.argv;
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +w, height: 900 }, deviceScaleFactor: 1 });
  if (theme) await ctx.addInitScript(t => { try { localStorage.setItem('hm-theme', t); } catch (e) {} }, theme);
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await p.goto(url, { waitUntil: 'networkidle' });
  const book = p.locator('[data-hm-book]').first();
  await book.scrollIntoViewIfNeeded();
  await p.waitForTimeout(500);
  const shot = async name => { await p.waitForTimeout(450); await book.screenshot({ path: `${out}/${name}-${w}${theme ? '-' + theme : ''}.png` }); };
  await shot('1-expert');
  // Filter chips, then pick the second visible person.
  const chips = book.locator('.hm-chip');
  if (await chips.count() > 2) { await chips.nth(1).click(); await p.waitForTimeout(300); await chips.nth(0).click(); }
  await book.locator('.hm-book__pick:not([hidden])').nth(1).click();
  await book.locator('[data-step="expert"] [data-go="time"]').click();
  await book.locator('.hm-book__time').first().waitFor();
  await shot('2-time');
  // Second free day, last time.
  const days = book.locator('.hm-book__day:not([disabled])');
  if (await days.count() > +pick) { await days.nth(+pick).click(); }
  await book.locator('.hm-book__time').last().click();
  await book.locator('[data-step="time"] [data-go="details"]').click();
  await shot('3-details');
  // Validation first, then a real submit.
  await book.locator('button[type="submit"]').click();
  await p.waitForTimeout(200);
  console.log('validation:', await book.locator('[data-hm-book-msg]').textContent());
  await book.locator('input[name="name"]').fill('نرگس توکلی');
  await book.locator('input[name="mobile"]').fill('۰۹۳۵ ۱۱۱ ۲۲۳۳');
  await book.locator('textarea[name="note"]').fill('مشاوره‌ی ارتودنسی');
  await book.locator('button[type="submit"]').click();
  await book.locator('[data-step="done"]:not([hidden])').waitFor({ timeout: 8000 });
  console.log('done:', await book.locator('[data-hm-book-done]').textContent());
  await shot('4-done');
  if (errs.length) console.log(errs.join('\n'));
  await b.close();
})();
