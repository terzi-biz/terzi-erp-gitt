import { createRequire } from 'module'; const { chromium, devices } = createRequire(import.meta.url)('playwright');
import fs from 'fs';
const [file, out] = process.argv.slice(2); const html = fs.readFileSync(file, 'utf8');
const keys = [...new Set([...html.matchAll(/\{key:"([a-z]+)",label:"[^"]+",group:"[^"]+"\}/g)].map(m => m[1]))];
const b = await chromium.launch(); const R = {};
for (const dev of ['iPhone SE', 'iPhone 16', 'iPhone 16 Pro Max']) {
 const ctx = await b.newContext(devices[dev]); R[dev] = {};
 for (const k of keys) { const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 120)));
  await pg.addInitScript(() => { window.claude = { use: () => Promise.reject(new Error('no')) }; });
  await pg.goto('file://' + file + '#' + k); await pg.waitForTimeout(1100);
  R[dev][k] = await pg.evaluate(() => { const W = innerWidth; const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
   const ctl = [...document.querySelectorAll('main input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden]), main select, main textarea')].filter(vis);
   const zoom = ctl.filter(e => parseFloat(getComputedStyle(e).fontSize) < 16).length;
   const taps = [...document.querySelectorAll('main button, main a[href], main select, main [role=button]')].filter(vis);
   const t44 = taps.filter(e => { const r = e.getBoundingClientRect(); return r.height < 40 || r.width < 40; }).length;
   const hoverOnly = [...document.querySelectorAll('main .opacity-0')].filter(e => e.querySelector('button') || e.tagName === 'BUTTON').length;
   const tiny = [...document.querySelectorAll('main *')].filter(e => e.childElementCount === 0 && (e.innerText || '').trim() && vis(e) && parseFloat(getComputedStyle(e).fontSize) < 11).length;
   return { sw: document.documentElement.scrollWidth - W, ctl: ctl.length, zoom, taps: taps.length, t44, hoverOnly, tiny }; });
  R[dev][k].errs = errs.length; await pg.close(); }
 await ctx.close(); }
await b.close(); fs.writeFileSync(out, JSON.stringify(R, null, 1));
const S = R['iPhone SE']; console.log('page'.padEnd(14), 'ovSE ov16 ovMax | inputs zoomIOS | taps <40 | hoverOnly | tiny<11px | errs');
for (const k of keys) console.log(k.padEnd(14), [R['iPhone SE'][k].sw, R['iPhone 16'][k].sw, R['iPhone 16 Pro Max'][k].sw].join('/').padEnd(10), '|', S[k].ctl, S[k].zoom, '|', S[k].taps, S[k].t44, '|', S[k].hoverOnly, '|', S[k].tiny, '|', S[k].errs);
