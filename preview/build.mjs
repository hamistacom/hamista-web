// Inlines fonts/*.woff2 into a single self-contained HTML file → dist/hamista-preview.html
// Usage: node build.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, 'index.html'), 'utf8').replace(/url\(fonts\/([\w.-]+\.woff2)\)/g, (_, file) =>
  `url(data:font/woff2;base64,${readFileSync(join(here, 'fonts', file)).toString('base64')})`);

mkdirSync(join(here, 'dist'), { recursive: true });
writeFileSync(join(here, 'dist', 'hamista-preview.html'), html);
console.log(`dist/hamista-preview.html — ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB`);
