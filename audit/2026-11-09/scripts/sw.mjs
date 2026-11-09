import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs';
const file = process.argv[2]; const html = fs.readFileSync(file, 'utf8');
const keys = [...new Set([...html.matchAll(/\{key:"([a-z]+)",label:"[^"]+",group:"[^"]+"\}/g)].map(m => m[1]))];
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const bad = [];
for (const k of keys) { const pg = await ctx.newPage(); await pg.addInitScript(() => { window.claude = { use: () => Promise.reject(new Error('no')) }; });
 await pg.goto('file://' + file + '#' + k); await pg.waitForTimeout(1200);
 const sw = await pg.evaluate(() => document.documentElement.scrollWidth); if (sw > 390) bad.push(k + ':' + sw); await pg.close(); }
console.log('overflow:', bad.join(' ') || 'none'); await b.close();
