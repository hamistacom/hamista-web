/**
 * Writes .min.js / .min.css next to every front-end asset of the theme and the
 * plugin. The PHP side serves the .min file when it exists (and SCRIPT_DEBUG is off).
 *
 *   npm i esbuild            (once, anywhere on NODE_PATH)
 *   node tools/build/minify.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const ROOT = path.resolve(__dirname, '../../wp');
const TARGETS = [
	'hamista/assets/js', 'hamista/assets/css', 'hamista/assets/css/kits',
	'hamista-core/assets/js', 'hamista-core/assets/css', 'hamista-core/assets/admin',
];

let before = 0;
let after = 0;
for (const rel of TARGETS) {
	const dir = path.join(ROOT, rel);
	for (const file of fs.readdirSync(dir)) {
		if (!/\.(js|css)$/.test(file) || /\.min\.(js|css)$/.test(file)) { continue; }
		const src = path.join(dir, file);
		const out = src.replace(/\.(js|css)$/, '.min.$1');
		const code = fs.readFileSync(src, 'utf8');
		const banner = (code.match(/^\/\*![\s\S]*?\*\//) || [''])[0];
		const result = esbuild.transformSync(code, {
			loader: path.extname(file).slice(1),
			minify: true,
			legalComments: 'none',
			target: ['es2019', 'chrome80', 'safari13'],
			charset: 'utf8',
		});
		fs.writeFileSync(out, (banner ? banner + '\n' : '') + result.code);
		before += code.length;
		after += fs.statSync(out).size;
		console.log(`${path.relative(ROOT, src).padEnd(52)} ${(code.length / 1024).toFixed(1).padStart(7)} KB → ${(fs.statSync(out).size / 1024).toFixed(1).padStart(6)} KB`);
	}
}
console.log(`\ntotal ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB`);
