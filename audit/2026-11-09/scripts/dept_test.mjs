import { createRequire } from 'module'; const { chromium, devices } = createRequire(import.meta.url)('playwright');
const [file, out] = process.argv.slice(2); const b = await chromium.launch(); const ctx = await b.newContext({ ...devices['iPhone 16'], deviceScaleFactor: 2 });
const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 200)));
await pg.addInitScript(() => {
 const res = o => ({ content: [{ type: 'text', text: JSON.stringify(o) }] }); window.__sqls = [];
 const staff = { '903': { name: 'Менеджер Тест', role: 'Продажі', color: '#1F5C99' }, '906': { name: 'Прораб Тест', role: 'Прораб', color: '#16865C' }, '904': { name: 'Офіс Тест', role: 'Офіс', color: '#0EA5B7' } };
 const row = (id, t, internal, client, line) => ({ call_id: id, call_type: t, internal, from_number: t === 'outbound' ? internal : '0670000000', to_number: t === 'outbound' ? '0670000000' : line, line, at: new Date().toISOString(), duration_sec: 60, employee: staff[internal] ? { ...staff[internal] } : null, client, tags: [], user_tags: [], suggested: [], analysis: null, ai_status: null });
 const feed = { staff, rows: [row('1', 'inbound', '903', 'Клієнт А', '0638705463'), row('2', 'outbound', '906', null, '0976026340'), row('3', 'outbound', '906', 'Клієнт Б', '0976026340'), row('4', 'inbound', '904', null, '0938179707'), row('5', 'missed', null, null, '0638580750')] };
 window.claude = { use: c => c === 'mcp' ? Promise.resolve({ listTools: async () => ({ servers: [{ server: 'TERZI ERP', tools: [{ name: 'whoami' }, { name: 'command' }] }] }),
  callTool: async (s, t, a) => { if (t === 'whoami') return res({ memberships: [{ company_id: 'co_terzi', company: 'TERZI' }], role: 'owner', company_id: 'co_terzi', name: 'Тест' });
   if (t === 'work' && a.action === 'call_feed') return res(feed);
   if (t === 'work' && a.action === 'call_staff') return res({ staff });
   if (t === 'legacy_select') { window.__sqls.push(a.sql.slice(0, 80)); const q = a.sql;
     if (/call_stats/.test(q)) return res({ rows: [{ s: { inbound: 465, answered: 318, missed: 147, missed_called_back: 100, missed_cb_15m: 30, cb_median_sec: 4000, by_employee: [{ employee: 'Менеджер Тест', inbound_answered: 24, outbound: 60, outbound_answered: 40, talk_sec: 3000, avg_wait_inbound: 5 }, { employee: 'Прораб Тест', inbound_answered: 277, outbound: 423, outbound_answered: 300, talk_sec: 9000, avg_wait_inbound: 4 }], by_day: [], by_hour_missed: [], first_call: '2026-09-01' } }] });
     if (/with k as/.test(q)) return res({ rows: [{ inbound: 52, answered: 24, missed: 28, outbound: 60, missed_called_back: 19, missed_cb_15m: 7, cb_median_sec: 55414 }] });
     if (/v_missed_callbacks where company_id/.test(q)) return res({ rows: [{ id: 'm1', at: new Date().toISOString(), from_number: '0670000001', line: '0638705463', wait_sec: 10, cb_at: null }, { id: 'm2', at: new Date().toISOString(), from_number: '0670000002', line: '0976026340', wait_sec: 10, cb_at: null }] });
     return res({ rows: [] }); }
   return res({ rows: [] }); } }) : Promise.reject(new Error('no')) };
});
await pg.goto('file://' + file + '#calls'); await pg.waitForTimeout(2500);
console.log('feed chips:', await pg.locator('[data-testid=feed-dept] button').allInnerTexts());
console.log('badges:', await pg.locator('[data-testid=dept-badge]').allInnerTexts());
await pg.locator('[data-testid=feed-dept] button', { hasText: 'Продажі' }).click(); await pg.waitForTimeout(300);
console.log('sales rows:', await pg.locator('[data-testid=dept-badge]').count(), 'cards', await pg.locator('main .card').count());
await pg.screenshot({ path: out + '_feed.png' });
await pg.locator('main button', { hasText: 'Аналітика і пропущені' }).click(); await pg.waitForTimeout(1500);
const kpi = async () => (await pg.locator('[data-testid=call-kpi]').innerText()).replace(/\n/g, ' ').slice(0, 220);
console.log('KPI sales:', await kpi());
console.log('not-called rows (sales):', await pg.evaluate(() => [...document.querySelectorAll('main')].map(m => (m.innerText.match(/067000000\d/g) || []).join(',')).join('')));
await pg.locator('[data-testid=stats-dept] button', { hasText: 'Усі лінії' }).click(); await pg.waitForTimeout(800);
console.log('KPI all:', await kpi());
await pg.screenshot({ path: out + '_stats.png', fullPage: false });
await pg.locator('main button', { hasText: 'Лінії і співробітники' }).click(); await pg.waitForTimeout(800);
await pg.locator('[data-testid=dept-map] summary').click(); await pg.waitForTimeout(300);
console.log('dept map:', (await pg.locator('[data-testid=dept-map]').innerText()).split('\n').slice(0, 6).join(' | '));
console.log('overflow', await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth), 'errs', errs);
await b.close();
