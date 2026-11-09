import sys
src,dst=sys.argv[1],sys.argv[2]
s=open(src,encoding='utf-8').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:90]); s=s.replace(a,b,1)

SQL=r"""with ids as (select unnest(array[${__ids}]::text[]) id),
c as (select ct.id, ct.phone, ct.note, nullif(ct.ext->>'created_at','')::timestamptz created from erp4.crm_contacts ct join ids using(id) where ct.company_id=${__co}),
cards as (select x.id, x.contact_id, x.custom, x.source_id, x.pipeline_id, x.stage_id, x.created_at, greatest(x.created_at, coalesce(x.status_changed_at,x.created_at), coalesce(x.erp_moved_at,x.created_at)) act from erp4.crm_cards x join c on c.id=x.contact_id where x.company_id=${__co}),
ords as (select o.id, o.contact_id, o.custom, greatest(o.created_at, coalesce(o.status_changed_at,o.created_at), coalesce(o.erp_moved_at,o.created_at)) act from erp4.crm_orders o join c on c.id=o.contact_id where o.company_id=${__co}),
cf as (select k.contact_id, f->>'name' n, v from (select contact_id, custom from cards union all select contact_id, custom from ords) k cross join lateral jsonb_array_elements(case when jsonb_typeof(k.custom)='array' then k.custom else '[]'::jsonb end) f cross join lateral jsonb_array_elements_text(case when jsonb_typeof(f->'value')='array' then f->'value' else jsonb_build_array(f->'value') end) v where f->>'name' in ('Тип услуги','Тип работ','Тип объекта','Площадь объекта в м²','Площадь','Адрес объекта') and coalesce(v,'')<>''),
ph as (select id, right(regexp_replace(phone,'\\D','','g'),9) p from c where phone is not null and length(regexp_replace(phone,'\\D','','g'))>=9),
calls as (select ph.id, max(e.at) at from ph join erp4.call_events e on e.company_id=${__co} and right(regexp_replace(e.from_number,'\\D','','g'),9)=ph.p group by ph.id union all select ph.id, max(e.at) from ph join erp4.call_events e on e.company_id=${__co} and right(regexp_replace(e.to_number,'\\D','','g'),9)=ph.p group by ph.id),
tk as (select t.owner_id oid, t.title, t.due_at from erp4.crm_tasks t where t.company_id=${__co} and t.done_at is null and t.owner_id in (select id from cards union all select id from ords))
select c.id, c.created::text created, c.note,
 (select string_agg(distinct v, ', ') from cf where cf.contact_id=c.id and n in ('Тип услуги','Тип работ')) service,
 (select string_agg(distinct v, ', ') from cf where cf.contact_id=c.id and n='Тип объекта') object,
 (select max(v) from cf where cf.contact_id=c.id and n in ('Площадь объекта в м²','Площадь')) area,
 (select max(v) from cf where cf.contact_id=c.id and n='Адрес объекта') address,
 (select s.name from cards x left join erp4.lead_attribution la on la.card_id=x.id join erp4.crm_sources s on s.id=coalesce(la.source_id,x.source_id) where x.contact_id=c.id order by x.created_at desc limit 1) source,
 (select coalesce(p.title,'')||' · '||coalesce(st.title,'') from cards x left join erp4.crm_pipelines p on p.id=x.pipeline_id left join erp4.crm_stages st on st.id=x.stage_id where x.contact_id=c.id order by x.created_at desc limit 1) stage,
 greatest((select max(act) from cards x where x.contact_id=c.id),(select max(act) from ords o where o.contact_id=c.id),(select max(at) from calls where calls.id=c.id))::text last_at,
 (select jsonb_build_object('title',title,'due',due_at) from tk where tk.oid in (select id from cards x where x.contact_id=c.id union all select id from ords o where o.contact_id=c.id) order by due_at nulls last limit 1) task
from c"""
SQLJS='`'+SQL.replace('`','\\`')+'`'

anchor='let j=s.filter(e=>!1!==e.list).slice(0,4);return'
new_state=('let j=s.filter(e=>!1!==e.list).slice(0,4),[__cx,__cxS]=(0,o.useState)(null),[__cf,__cfS]=(0,o.useState)("all");'
 '(0,o.useEffect)(()=>{let __a=!0,__idl=e.map(x=>x.id).filter(Boolean);if(!__idl.length){__cxS({});return}__cxS(null);'
 'let __ids=__idl.map(x=>pp(String(x))).join(","),__co=pp(G);'
 'eM('+SQLJS+').then(r=>{if(!__a)return;let m={};for(let x of r||[]){let t=x.task;if("string"==typeof t)try{t=JSON.parse(t)}catch{t=null}m[x.id]={...x,task:t}}__cxS(m)}).catch(er=>{__a&&(__cxS({}),b("Додаткові поля клієнтів недоступні: "+ev(er)))});return()=>{__a=!1}},[e]);'
 'let __p9=x=>{let d=String(x??"").replace(/\\D/g,"");return d.length>=9?d.slice(-9):null},__pc={};for(let x of e){let k=__p9(x.phone);k&&(__pc[k]=(__pc[k]??0)+1)}'
 'let __now=Date.now(),__st=x=>{let a=__cx?.[x.id],t=a?.task;return{a,t,none:!!__cx&&!t,over:!!t?.due&&new Date(t.due).getTime()<__now,dup:(__pc[__p9(x.phone)]??0)>1,noname:!x.full_name}};'
 'let __F=[["all","Усі",e.length],["notask","Без задачі",e.filter(x=>__st(x).none).length],["over","Прострочені",e.filter(x=>__st(x).over).length],["noname","Без імені",e.filter(x=>__st(x).noname).length],["dup","Дублі",e.filter(x=>__st(x).dup).length]];'
 'let __rows=e.filter(x=>{let q=__st(x);return"all"===__cf||("notask"===__cf?q.none:"over"===__cf?q.over:"noname"===__cf?q.noname:q.dup)});'
 'let __chip=(t,c)=>t?(0,i.jsx)("span",{className:nH("rounded-full px-2 py-0.5 text-[11.5px] font-semibold",c||"bg-sunk text-ink"),children:t}):null;'
 'let __card=x=>{let q=__st(x),a=q.a||{},t=q.t;return(0,i.jsxs)("div",{role:"button",tabIndex:0,onClick:()=>m(x.id),onKeyDown:ev2=>"Enter"===ev2.key&&m(x.id),className:nH("card flex cursor-pointer flex-col gap-2 p-3 text-left hover:ring-1 hover:ring-gold/40",(q.none||q.over)&&"border-l-4 border-l-crit"),children:['
   '(0,i.jsxs)("div",{className:"flex items-start justify-between gap-2",children:[(0,i.jsxs)("div",{className:"min-w-0",children:[(0,i.jsx)("div",{className:nH("text-[15px] font-bold leading-snug",x.full_name?"text-heading":"text-crit"),children:x.full_name||"без імені"}),a.stage&&(0,i.jsx)("div",{className:"text-[11.5px] text-muted",children:a.stage})]}),'
     'x.phone?(0,i.jsx)("a",{href:"tel:"+String(x.phone).replace(/[^\\d+]/g,""),onClick:ev2=>ev2.stopPropagation(),className:"shrink-0 rounded-lg border border-line px-2.5 py-1.5 text-[13px] font-semibold tabular-nums text-heading",children:x.phone}):(0,i.jsx)("span",{className:"text-[12px] text-muted",children:"без телефону"})]}),'
   '(0,i.jsxs)("div",{className:"flex flex-wrap gap-1.5",children:[__chip(a.service,"bg-goldsoft text-ink"),__chip(a.object,"bg-infosoft text-ink"),__chip(a.area?a.area+" м²":null),__chip(a.source?"Джерело: "+a.source:null),q.dup&&__chip("дубль телефону","bg-warnsoft text-ink"),!__cx&&(0,i.jsx)("span",{className:"text-[11.5px] text-muted",children:"завантаження…"}),__cx&&!a.service&&!a.object&&!a.source&&(0,i.jsx)("span",{className:"text-[11.5px] text-muted",children:"послуга, об\'єкт і джерело не вказані"})]}),'
   '(0,i.jsxs)("div",{className:"grid grid-cols-2 gap-2 text-[12px]",children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("div",{className:"text-muted",children:"З\'явився"}),(0,i.jsx)("div",{className:"font-semibold text-ink",children:a.created?l0(a.created,!1):"—"})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("div",{className:"text-muted",children:"Остання дія"}),(0,i.jsx)("div",{className:"font-semibold text-ink",children:a.last_at?l0(a.last_at):x.last_card?l0(x.last_card,!1):"—"})]})]}),'
   '(0,i.jsx)("div",{className:nH("rounded-lg px-2.5 py-1.5 text-[12.5px]",!__cx?"bg-sunk text-muted":t?(q.over?"bg-critsoft text-crit":"bg-oksoft text-ink"):"bg-critsoft text-crit"),children:!__cx?"Задачі: перевіряю…":t?(q.over?"Прострочено: ":"Задача: ")+(t.title||"без назви")+(t.due?" · "+l0(t.due):""):"Немає задачі на майбутнє"}),'
   'a.note&&(0,i.jsx)("div",{className:"line-clamp-2 text-[12.5px] text-muted",children:"Нотатка: "+a.note}),'
   '(0,i.jsxs)("div",{className:"flex flex-wrap gap-x-3 text-[11.5px] text-muted",children:[(0,i.jsxs)("span",{children:["Звернень: ",x.cards]}),(0,i.jsxs)("span",{children:["Замовлень: ",x.orders]}),Number(x.orders_sum)>0&&(0,i.jsx)("span",{className:"tabular-nums",children:g$(x.orders_sum)})]})]},x.id)};'
 'return')
rep(anchor,new_state)
# search width
rep('(0,i.jsxs)("div",{className:"relative w-[320px]",children:[(0,i.jsx)(ni,{size:14,className:"absolute left-2.5 top-2.5 text-muted"}),(0,i.jsx)("input",{className:"w-full rounded-lg border border-line bg-surface py-1.5 pl-8 pr-2 text-[13px]",placeholder:"Ім\'я, телефон, email…"',
    '(0,i.jsxs)("div",{className:"relative w-full max-w-[320px]",children:[(0,i.jsx)(ni,{size:14,className:"absolute left-2.5 top-2.5 text-muted"}),(0,i.jsx)("input",{className:"w-full rounded-lg border border-line bg-surface py-1.5 pl-8 pr-2 text-[13px]",placeholder:"Ім\'я, телефон, email…"')
# replace table with filters + cards
a=s.find('(0,i.jsx)("div",{className:"card overflow-x-auto",children:(0,i.jsxs)("table",{className:"w-full min-w-[860px] text-[13px]"')
endm='children:"Клієнтів не знайдено"})})]})]})}),'
b2=s.find(endm,a); assert a>0 and b2>a
old=s[a:b2+len(endm)]
new=('(0,i.jsx)("div",{className:"flex flex-wrap gap-1.5","data-testid":"client-filters",children:__F.map(([k,l,nn])=>(0,i.jsxs)("button",{onClick:()=>__cfS(k),className:nH("rounded-full border px-3 py-1 text-[12.5px] font-semibold",__cf===k?"border-gold bg-goldsoft":"border-line bg-surface"),children:[l," ",(0,i.jsx)("span",{className:"num text-muted",children:nn})]},k))}),'
     '(0,i.jsxs)("div",{className:"grid gap-2 md:grid-cols-2 xl:grid-cols-3","data-testid":"client-cards",children:[__rows.map(__card),!__rows.length&&(0,i.jsx)("div",{className:"card px-3 py-6 text-center text-muted md:col-span-2",children:e.length?"За цим фільтром клієнтів немає (на цій сторінці)":"Клієнтів не знайдено"})]}),')
s=s[:a]+new+s[b2+len(endm):]
open(dst,'w',encoding='utf-8').write(s); print('ok', len(old))
