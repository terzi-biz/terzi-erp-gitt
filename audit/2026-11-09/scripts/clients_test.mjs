import { createRequire } from 'module'; const { chromium, devices } = createRequire(import.meta.url)('playwright');
const [file, out, dev = 'iPhone SE'] = process.argv.slice(2); const b = await chromium.launch(); const ctx = await b.newContext({ ...devices[dev], deviceScaleFactor: 2 });
const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 200)));
await pg.addInitScript(() => {
 const now = Date.now(), iso = d => new Date(now + d * 864e5).toISOString();
 const rows = [
  { id: 'c1', full_name: 'Тест Клієнт А', phone: '0670000001', cards: 1, orders: 1, orders_sum: '23400.00', last_card: iso(-5), extra: null },
  { id: 'c2', full_name: null, phone: '0670000002', cards: 1, orders: 0, orders_sum: '0', last_card: iso(-1), extra: null },
  { id: 'c3', full_name: 'Тест Клієнт В', phone: '0670000002', cards: 2, orders: 0, orders_sum: '0', last_card: iso(-3), extra: null },
  { id: 'c4', full_name: 'Тест Клієнт Г', phone: null, cards: 1, orders: 0, orders_sum: '0', last_card: iso(-10), extra: null }];
 const ext = [
  { id: 'c1', created: iso(-6), note: 'Просить замір у суботу', service: 'Напівсуха стяжка підлоги', object: 'Коммерция', area: '130', source: 'OLX', stage: 'Квалификация · Успешно / создать заказ', last_at: iso(-0.2), task: { title: 'Перевести замовлення на наступний етап', due: iso(-4) } },
  { id: 'c2', created: iso(-2), note: null, service: null, object: null, area: null, source: '0800', stage: 'Заміри · Замір призначено', last_at: iso(-1), task: { title: "Зв'язатися з клієнтом", due: iso(1) } },
  { id: 'c3', created: iso(-8), note: null, service: 'Утеплення', object: 'Дом', area: '80', source: 'Facebook Leads', stage: 'Квалификация · Перший контакт', last_at: iso(-3), task: null }];
 const res = o => ({ content: [{ type: 'text', text: JSON.stringify(o) }] });
 window.claude = { use: c => c === 'mcp' ? Promise.resolve({ listTools: async () => ({ servers: [{ server: 'TERZI ERP', tools: [{ name: 'whoami' }, { name: 'command' }] }] }),
  callTool: async (s, t, a) => { if (t === 'whoami') return res({ memberships: [{ company_id: 'co_terzi', company: 'TERZI' }], role: 'owner', company_id: 'co_terzi', name: 'Тест' });
   if (t === 'refs' && a.action === 'clients') return res({ total: 4, rows, fields: [] });
   if (t === 'legacy_select') { window.__sql = a.sql; return res({ rows: ext }); }
   return res({ rows: [] }); } }) : Promise.reject(new Error('no')) };
});
await pg.goto('file://' + file + '#clients'); await pg.waitForTimeout(2500);
await pg.screenshot({ path: out + '_cards.png', fullPage: true });
console.log('sql len', await pg.evaluate(() => (window.__sql || '').length), 'starts', await pg.evaluate(() => (window.__sql || '').slice(0, 70)));
console.log('filters:', await pg.locator('[data-testid=client-filters] button').allInnerTexts());
for (const f of ['Без задачі', 'Прострочені', 'Без імені', 'Дублі']) { await pg.locator('[data-testid=client-filters] button', { hasText: f }).click(); await pg.waitForTimeout(200); console.log(f, '→', (await pg.locator('[data-testid=client-cards] > div').allInnerTexts()).map(t => t.split('\n')[0])); }
await pg.locator('[data-testid=client-filters] button', { hasText: 'Усі' }).click();
console.log('tel href:', await pg.locator('[data-testid=client-cards] a[href^="tel:"]').first().getAttribute('href'));
console.log('overflow', await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth), 'errs', errs);
await b.close();
