// Usage: node booking-account.js <site-url> <booking-page-path> <out-dir> <user> <pass>
// Logs in, books through the widget, then opens My account → My appointments and cancels.
const { chromium } = require('playwright');
(async () => {
  const [,, site, path, out, user, pass] = process.argv;
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await p.goto(site + '/wp-login.php');
  await p.fill('#user_login', user);
  await p.fill('#user_pass', pass);
  await Promise.all([p.waitForNavigation(), p.click('#wp-submit')]);
  await p.goto(site + path, { waitUntil: 'networkidle' });
  const book = p.locator('[data-hm-book]').first();
  await book.locator('.hm-book__pick').first().click();
  await book.locator('[data-step="expert"] [data-go="time"]').click();
  // A day after tomorrow, so the 24-hour cancellation window still allows cancelling.
  await book.locator('.hm-book__day:not([disabled])').nth(2).click();
  await book.locator('.hm-book__time').nth(2).click();
  await book.locator('[data-step="time"] [data-go="details"]').click();
  console.log('prefilled name:', await book.locator('input[name="name"]').inputValue());
  await book.locator('input[name="mobile"]').fill('09351112233');
  await book.locator('button[type="submit"]').click();
  await book.locator('[data-step="done"]:not([hidden])').waitFor({ timeout: 8000 });
  const link = book.locator('[data-step="done"] a.hm-btn');
  const href = await link.count() ? await link.getAttribute('href') : '';
  console.log('my appointments link:', href || '(none)');
  await p.goto(site + '/my-account/', { waitUntil: 'networkidle' });
  await p.screenshot({ path: out + '/account-dashboard.png', fullPage: false });
  await p.setViewportSize({ width: 390, height: 844 });
  await p.screenshot({ path: out + '/account-dashboard-390.png', fullPage: true });
  await p.setViewportSize({ width: 1280, height: 900 });
  await p.goto(href, { waitUntil: 'networkidle' });
  await p.screenshot({ path: out + '/account-appointments.png', fullPage: false });
  p.on('dialog', d => d.accept());
  const cancel = p.locator('[data-hm-cancel]').first();
  console.log('cancel buttons:', await p.locator('[data-hm-cancel]').count());
  await cancel.click();
  await p.waitForTimeout(1200);
  console.log('message:', await p.locator('[data-hm-appts-msg]').textContent());
  await p.locator('.hm-appts').screenshot({ path: out + '/account-cancelled.png' });
  if (errs.length) console.log(errs.join('\n'));
  await b.close();
})();
