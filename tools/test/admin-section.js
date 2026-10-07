// Screenshot one section of the Hamista settings app, optionally after a few clicks.
// Usage: node admin-section.js <site> <section> <out.png> <user> <pass> [click-selector …]
const { chromium } = require('playwright');
(async () => {
	const [,, site, section, out, user, pass, ...clicks] = process.argv;
	const b = await chromium.launch();
	const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
	const errs = [];
	p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
	await p.route(/gravatar|wordpress\.org|w\.org\/|googleapis|gstatic/, (r) => r.abort());
	await p.goto(site + '/wp-login.php', { waitUntil: 'domcontentloaded' });
	await p.fill('#user_login', user);
	await p.fill('#user_pass', pass);
	await Promise.all([p.waitForURL(/wp-admin/, { waitUntil: 'commit' }), p.click('#wp-submit')]);
	await p.goto(site + '/wp-admin/admin.php?page=hamista#' + section, { waitUntil: 'domcontentloaded' });
	await p.waitForSelector('.hm-field', { timeout: 20000 });
	await p.waitForTimeout(1500);
	for (const sel of clicks) { await p.click(sel); await p.waitForTimeout(400); }
	await p.screenshot({ path: out, fullPage: true });
	console.log(errs.join('\n') || 'ok');
	await b.close();
})();
