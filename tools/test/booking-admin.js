// Usage: node booking-admin.js <site-url> <out-dir> <user> <pass> <expert-id>
// Screenshots of the booking screens in the dashboard.
const { chromium } = require('playwright');
(async () => {
  const [,, site, out, user, pass, expert] = process.argv;
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(site + '/wp-login.php');
  await p.fill('#user_login', user);
  await p.fill('#user_pass', pass);
  await Promise.all([p.waitForNavigation(), p.click('#wp-submit')]);
  await p.goto(site + '/wp-admin/edit.php?post_type=hm_appointment', { waitUntil: 'networkidle' });
  await p.screenshot({ path: out + '/admin-appointments.png' });
  await p.goto(site + '/wp-admin/post.php?post=' + expert + '&action=edit', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const box = p.locator('#hm-expert-hours');
  if (await box.count()) { await box.scrollIntoViewIfNeeded(); await box.screenshot({ path: out + '/admin-hours.png' }); }
  const prof = p.locator('#hm-expert-profile');
  if (await prof.count()) { await prof.screenshot({ path: out + '/admin-profile.png' }); }
  await p.goto(site + '/wp-admin/admin.php?page=hamista#booking', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  await p.screenshot({ path: out + '/admin-settings.png', fullPage: true });
  await b.close();
})();
