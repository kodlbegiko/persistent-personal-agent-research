
import { readdir, readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
const files = await readdir('dist/assets');
let js = 0; let css = 0;
for (const file of files) {
  const bytes = gzipSync(await readFile('dist/assets/' + file)).length;
  if (file.endsWith('.js')) js += bytes;
  if (file.endsWith('.css')) css += bytes;
}
const result = { jsGzipKB: +(js / 1024).toFixed(2), cssGzipKB: +(css / 1024).toFixed(2), jsBudgetKB: 120, cssBudgetKB: 20 };
console.log('BUNDLE_BUDGET', result);
if (js > 120 * 1024 || css > 20 * 1024) process.exit(1);
