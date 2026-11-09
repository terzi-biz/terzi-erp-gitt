import { createRequire } from 'module'; const { chromium, devices } = createRequire(import.meta.url)('playwright');
const file = process.argv[2]; const b = await chromium.launch(); const ctx = await b.newContext(devices['iPhone 16']);
const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('dialog', d => d.accept());
await pg.addInitScript(() => { window.claude = { use: (c) => c === 'mcp' ? Promise.resolve({ listTools: async () => ({ servers: [{ server: 'Neon', tools: [{ name: 'run_sql' }] }] }), callTool: async (s, t, a) => { window.__sql = (window.__sql || 0) + 1; return { structuredContent: [] }; } }) : Promise.reject(new Error('no')) }; });
await pg.goto('file://' + file + '#crm'); await pg.waitForTimeout(2000);
console.log('default: sql calls', await pg.evaluate(() => window.__sql || 0), '|', (await pg.evaluate(() => document.body.innerText)).split('\n').find(l => /Немає доступу|Захищений/.test(l))?.slice(0, 90));
await pg.goto('file://' + file + '#pilot'); await pg.reload(); await pg.waitForTimeout(2000);
const btn = pg.locator('button', { hasText: 'Увімкнути режим власника БД' }); console.log('enable btn', await btn.count()); if (await btn.count()) { await btn.first().click(); await pg.waitForTimeout(2500); }
console.log('after enable: flag', await pg.evaluate(() => localStorage.getItem('terzi-owner-db')), 'disable btn', await pg.locator('button', { hasText: 'Вимкнути режим власника БД' }).count(), 'sql calls', await pg.evaluate(() => window.__sql || 0));
await pg.locator('button', { hasText: 'Вимкнути режим власника БД' }).first().click().catch(() => {}); await pg.waitForTimeout(2000);
console.log('after disable: flag', await pg.evaluate(() => localStorage.getItem('terzi-owner-db')), 'errs', errs); await b.close();
