import { createRequire } from 'module'; const { chromium, devices } = createRequire(import.meta.url)('playwright');
const [file, out, dev = 'iPhone SE'] = process.argv.slice(2); const b = await chromium.launch(); const ctx = await b.newContext({ ...devices[dev], deviceScaleFactor: 1 });
const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 150)));
await pg.addInitScript(() => { window.claude = { use: () => Promise.reject(new Error('no')) }; });
const shot = async n => pg.screenshot({ path: `${out}_${n}.png` });
const modalInfo = () => pg.evaluate(() => { const m = [...document.querySelectorAll('[role=dialog], .fixed.inset-0')].filter(e => e.getBoundingClientRect().height > 0).pop(); if (!m) return 'no modal'; const box = m.querySelector('.card, [role=dialog] > div') || m; const r = box.getBoundingClientRect(); const btns = [...m.querySelectorAll('button')].filter(x => { const q = x.getBoundingClientRect(); return q.height > 0 && (q.bottom > innerHeight || q.top < 0); }).map(x => x.innerText.trim().slice(0, 20)); return `modal ${Math.round(r.width)}x${Math.round(r.height)} top=${Math.round(r.top)} bottom=${Math.round(r.bottom)} vh=${innerHeight} scroll=${box.scrollHeight > box.clientHeight} offscreenBtns=${JSON.stringify(btns.slice(0, 6))}`; });
// 1. Estimates → Стяжка
await pg.goto('file://' + file + '#estimates'); await pg.waitForTimeout(1500);
await pg.locator('main button', { hasText: 'Стяжка підлоги' }).first().click(); await pg.waitForTimeout(800); await shot('screed1');
console.log('screed:', await modalInfo());
const inputs = await pg.evaluate(() => [...document.querySelectorAll('input:not([type=hidden]),select')].filter(e => e.getBoundingClientRect().height > 0).map(e => (e.getAttribute('aria-label') || e.name || e.placeholder || e.closest('label')?.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 30) + ':' + e.type + ':' + e.value).slice(0, 25));
console.log(inputs.join(' | '));
const num = pg.locator('main input[type=number], [role=dialog] input[type=number], .fixed input[type=number]').first();
if (await num.count()) { await num.fill('120'); await pg.waitForTimeout(600); }
const txt = await pg.evaluate(() => document.body.innerText); console.log('result text:', (txt.match(/(Разом|Всього|Підсумок|До сплати|Сума)[^\n]{0,60}\n?[^\n]{0,40}/g) || []).slice(0, 5));
await pg.evaluate(() => window.scrollTo(0, 1e6)); await pg.waitForTimeout(300); await shot('screed2');
// 2. Новий розрахунок
await pg.goto('file://' + file + '#estimates'); await pg.reload(); await pg.waitForTimeout(1300);
await pg.locator('main button', { hasText: 'Новий розрахунок' }).first().click(); await pg.waitForTimeout(700); await shot('newcalc'); console.log('Новий розрахунок:', await modalInfo());
// 3. FAB quick action → Нове звернення
await pg.goto('file://' + file + '#tower'); await pg.reload(); await pg.waitForTimeout(1300);
await pg.getByRole('button', { name: 'Швидка дія' }).click(); await pg.waitForTimeout(400); await shot('fab');
const qa = await pg.evaluate(() => [...document.querySelectorAll('.card button')].map(b => b.innerText.trim()).filter(Boolean)); console.log('quick:', qa.join(', '));
await pg.locator('button', { hasText: 'Нове звернення' }).first().click(); await pg.waitForTimeout(800); await shot('lead'); console.log('after Нове звернення:', await pg.evaluate(() => location.hash), await modalInfo());
// 4. Грошова операція
await pg.goto('file://' + file + '#finance'); await pg.reload(); await pg.waitForTimeout(1300);
await pg.locator('main button', { hasText: 'Грошова операція' }).first().click(); await pg.waitForTimeout(700); await shot('money'); console.log('Грошова операція:', await modalInfo());
console.log('errs', errs); await b.close();
