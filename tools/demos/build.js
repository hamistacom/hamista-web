/**
 * Builds demo packages for Hamista Core.
 *
 *   node tools/demos/build.js            → all demos
 *   node tools/demos/build.js spark      → one demo
 *
 * Each demo module (tools/demos/demos/<id>.js) exports { manifest, content }.
 * Output: wp/hamista-core/demos/<id>/manifest.json and content.json.
 * The build fails loudly on unknown image keys, missing files, or links to
 * pages, posts or products that do not exist.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const lib = require('./lib');

const OUT = path.resolve(__dirname, '../../wp/hamista-core/demos');
const only = process.argv[2];

function collectTokens(value, found) {
	if (Array.isArray(value)) { value.forEach((v) => collectTokens(v, found)); return found; }
	if (value && typeof value === 'object') {
		if (value.__img) { found.img.add(value.__img); }
		if (value.__gallery) { value.__gallery.forEach((k) => found.img.add(k)); }
		Object.values(value).forEach((v) => collectTokens(v, found));
		return found;
	}
	if (typeof value === 'string') {
		for (const m of value.matchAll(/\{\{([a-z]+)(?::([a-z0-9_,-]+))?\}\}/g)) {
			const [, type, key] = m;
			if (type === 'img' || type === 'imgid') { found.img.add(key); }
			if (type === 'page') { found.page.add(key); }
			if (type === 'post') { found.post.add(key); }
			if (type === 'product') { found.product.add(key); }
			if (type === 'term' || type === 'termlink') { found.term.add(key); }
			if (type === 'ids') { key.split(',').forEach((k) => found.product.add(k)); }
		}
	}
	return found;
}

function validate(id, demo) {
	const c = demo.content;
	const dir = path.join(OUT, id);
	const errors = [];
	const found = collectTokens(c, { img: new Set(), page: new Set(), post: new Set(), product: new Set(), term: new Set() });
	(c.posts || []).forEach((p) => { if (p.image) { found.img.add(p.image); } });
	(c.products || []).forEach((p) => { if (p.image) { found.img.add(p.image); } (p.gallery || []).forEach((g) => found.img.add(g)); });
	const has = {
		page: new Set((c.pages || []).map((p) => p.key)),
		post: new Set((c.posts || []).map((p) => p.key)),
		product: new Set((c.products || []).map((p) => p.key)),
		term: new Set((c.terms || []).map((t) => t.key)),
	};
	for (const key of found.img) {
		if (!c.images[key]) { errors.push('image key not declared: ' + key); continue; }
		if (!fs.existsSync(path.join(dir, c.images[key]))) { errors.push('image file missing: ' + c.images[key]); }
	}
	for (const type of ['page', 'post', 'product', 'term']) {
		for (const key of found[type]) { if (!has[type].has(key)) { errors.push(type + ' not found: ' + key); } }
	}
	const walkMenu = (items) => items.forEach((it) => {
		if (it.page && !has.page.has(it.page)) { errors.push('menu page not found: ' + it.page); }
		if (it.children) { walkMenu(it.children); }
	});
	(c.menus || []).forEach((m) => walkMenu(m.items));
	(c.posts || []).concat(c.products || []).forEach((p) => (p.terms || []).forEach((t) => { if (!has.term.has(t)) { errors.push('term not found: ' + t + ' (' + p.key + ')'); } }));
	(c.templates || []).forEach((t) => { if (!has.page.has(t.page)) { errors.push('template page not found: ' + t.page); } });
	// Unused images only cost download size: report them.
	const unused = Object.keys(c.images).filter((k) => !found.img.has(k));
	if (errors.length) { throw new Error(id + ':\n  ' + errors.join('\n  ')); }
	return unused;
}

const demosDir = path.join(__dirname, 'demos');
const ids = fs.readdirSync(demosDir).filter((f) => f.endsWith('.js')).map((f) => f.slice(0, -3)).filter((id) => !only || id === only);

for (const id of ids) {
	lib.reset(id);
	delete require.cache[require.resolve(path.join(demosDir, id))];
	const demo = require(path.join(demosDir, id));
	const unused = validate(id, demo);
	// Only images a page, post or product actually uses are shipped in the import.
	unused.forEach((key) => { delete demo.content.images[key]; });
	const dir = path.join(OUT, id);
	fs.mkdirSync(dir, { recursive: true });
	fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(demo.manifest, null, '\t') + '\n');
	fs.writeFileSync(path.join(dir, 'content.json'), JSON.stringify(demo.content));
	const kb = (fs.statSync(path.join(dir, 'content.json')).size / 1024).toFixed(1);
	console.log(`${id}: ${demo.content.pages.length} pages, ${(demo.content.posts || []).length} posts, ${(demo.content.products || []).length} products, content ${kb} KB` + (unused.length ? `\n  skipped unused images: ${unused.join(', ')}` : ''));
}
