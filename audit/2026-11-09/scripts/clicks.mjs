import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs';
const [file, outf] = process.argv.slice(2); const html = fs.readFileSync(file, 'utf8');
const keys = [...new Set([...html.matchAll(/\{key:"([a-z]+)",label:"[^"]+",group:"[^"]+"\}/g)].map(m => m[1]))];
const b = await chromium.launch();
const init = () => { window.claude = { use: () => Promise.reject(new Error('no')) }; window.__mut = 0; new MutationObserver(m => { window.__mut += m.length; }).observe(document, { subtree: true, childList: true, attributes: true, characterData: true }); };
async function open(ctx, k) { const pg = await ctx.newPage(); pg.__errs = []; pg.on('pageerror', e => pg.__errs.push(e.message.slice(0, 150))); pg.on('dialog', d => { pg.__dlg = d.message().slice(0, 60); d.dismiss(); }); await pg.addInitScript(init); await pg.goto('file://' + file + '#' + k); await pg.waitForTimeout(1300); return pg; }
const list = (pg) => pg.evaluate(() => [...document.querySelectorAll('main button')].map((e, i) => { const r = e.getBoundingClientRect(); return { i, t: (e.innerText || e.getAttribute('aria-label') || e.title || '').trim().replace(/\s+/g, ' ').slice(0, 40), vis: r.width > 0 && r.height > 0, dis: e.disabled }; }));
const results = {};
async function worker(ks) { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
 for (const k of ks) { let pg = await open(ctx, k); const btns = (await list(pg)).filter(x => x.vis); await pg.close(); const res = [];
  for (const bt of btns.slice(0, 40)) { if (bt.dis) { res.push({ ...bt, eff: 'disabled' }); continue; }
   pg = await open(ctx, k); await pg.evaluate(() => { window.__mut = 0; }); const h0 = await pg.evaluate(() => location.hash);
   let eff = '';
   try { const el = pg.locator('main button').nth(bt.i); await el.scrollIntoViewIfNeeded({ timeout: 2000 }); await pg.evaluate(() => { window.__mut = 0; }); await el.click({ timeout: 3000 }); await pg.waitForTimeout(700);
     const st = await pg.evaluate(() => ({ m: window.__mut, h: location.hash })); eff = st.h !== h0 ? 'nav' + st.h : st.m > 0 ? 'dom' + st.m : (pg.__dlg ? 'dialog' : 'NONE'); } catch (e) { eff = 'ERRCLICK ' + e.message.slice(0, 60); }
   if (pg.__errs.length) eff += ' JSERR:' + pg.__errs[0];
   res.push({ ...bt, eff }); await pg.close(); }
  results[k] = res; console.log(k, res.length, res.filter(r => r.eff.startsWith('NONE') || r.eff.includes('JSERR') || r.eff.startsWith('ERRCLICK')).map(r => `[${r.t}]=${r.eff}`).join(' ; ')); }
 await ctx.close(); }
const N = 6; const parts = Array.from({ length: N }, (_, i) => keys.filter((_, j) => j % N === i));
await Promise.all(parts.map(worker)); await b.close(); fs.writeFileSync(outf, JSON.stringify(results, null, 1));
