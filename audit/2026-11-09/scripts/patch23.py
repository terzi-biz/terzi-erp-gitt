import sys,re
src,dst=sys.argv[1],sys.argv[2]
s=open(src,encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(s.count(a),a[:100]); s=s.replace(a,b)
js=open('/home/user/erp/scripts/tzdept.js',encoding='utf-8').read()
s=re.sub(r'<script id="tz-dept">.*?</script>\n','',s,flags=re.S)
rep('<div id="root"></div>','<script id="tz-dept">'+js+'</script>\n<div id="root"></div>')
CH=lambda cur,setf,opts,cls: '(0,i.jsx)("div",{className:"flex flex-wrap gap-1.5",children:'+opts+'.map(([k,l])=>(0,i.jsx)("button",{className:'+cls+',onClick:()=>'+setf+'(k),children:l},k))})'
# ---- feed x6
rep('[w,N]=(0,o.useState)(null);(0,o.useEffect)(()=>{let t=setTimeout(()=>{A(null),lG("call_feed"',
    '[w,N]=(0,o.useState)(null),[__dp,__dpS]=(0,o.useState)("all");(0,o.useEffect)(()=>{let t=setTimeout(()=>{A(null),lG("call_feed"')
rep('(0,i.jsxs)("div",{className:"flex gap-1.5 overflow-x-auto pb-0.5",children:[(0,i.jsx)("button",{className:I(!n),onClick:()=>a(""),children:"Усі співробітники"})',
    '(0,i.jsx)("div",{className:"flex flex-wrap gap-1.5","data-testid":"feed-dept",children:[["all","Усі відділи"],["sales","Продажі"],["tech","Технічний"],["admin","Адміністративний"]].map(([k,l])=>(0,i.jsx)("button",{className:I(__dp===k),onClick:()=>__dpS(k),children:l+(v?" "+v.rows.filter(e=>"all"===k||window.__tzDeptOf(e)===k).length:"")},k))}),(0,i.jsxs)("div",{className:"flex gap-1.5 overflow-x-auto pb-0.5",children:[(0,i.jsx)("button",{className:I(!n),onClick:()=>a(""),children:"Усі співробітники"})')
rep('children:v?.rows.map(e=>(0,i.jsx)(x7,{c:e,','children:v?.rows.filter(e=>"all"===__dp||window.__tzDeptOf(e)===__dp).map(e=>(0,i.jsx)(x7,{c:e,')
# ---- row badge x7
rep('(0,i.jsx)("b",{className:"text-heading",children:e.employee?.name??(e.internal?`внутр. ${e.internal}`:"—")}),',
    '(0,i.jsx)("b",{className:"text-heading",children:e.employee?.name??(e.internal?`внутр. ${e.internal}`:"—")}),"sales"!==window.__tzDeptOf(e)&&(0,i.jsx)("span",{className:"rounded-full bg-sunk px-2 py-0.5 text-[11px] font-semibold text-muted","data-testid":"dept-badge",children:window.__TZD.names[window.__tzDeptOf(e)]+(e.client?"":" · перший контакт")}),')
# ---- stats ho
rep('function ho(){let[e,t]=(0,o.useState)(7),[n,a]=(0,o.useState)(0),s=pp(G),',
    'function ho(){let[e,t]=(0,o.useState)(7),[n,a]=(0,o.useState)(0),s=pp(G),[__dp,__dpS]=(0,o.useState)("sales"),[__sf,__sfS]=(0,o.useState)(null),__e1=(0,o.useEffect)(()=>{lG("call_staff").then(e=>__sfS(e.staff),()=>null)},[]),')
rep(',u=cS("select max(finished_at)::text last, (array_agg(status order by id desc))[1] status from erp4.integration_runs where provider=\'binotel\'",[n]),{go:p}=nf(),m=d.rows?.[0]?.s,x=e=>Number(m?.[e]??0);',
    ',u=cS("select max(finished_at)::text last, (array_agg(status order by id desc))[1] status from erp4.integration_runs where provider=\'binotel\'",[n]),__k=cS(window.__tzKpiSql(s,r,l,__dp),[__dp,n,e]),{go:p}=nf(),m=d.rows?.[0]?.s,__kp="all"!==__dp?__k.rows?.[0]??null:null,x=e=>Number((__kp?__kp[e]:m?.[e])??0),__inD=e=>"all"===__dp||window.__tzDeptOf({line:e.line})===__dp;')
rep('let h=(c.rows??[]).filter(e=>!e.cb_at),g=(m?.by_employee??[]).map(',
    'let h=(c.rows??[]).filter(e=>!e.cb_at&&__inD(e)),g=(m?.by_employee??[]).filter(e=>{if("all"===__dp||!__sf)return!0;let k=Object.entries(__sf).filter(([,v])=>v.name===e.employee).map(([k])=>k);return k.length?k.some(x=>window.__tzDeptOf({internal:x})===__dp):"sales"===__dp}).map(')
rep('(0,i.jsx)(al,{label:"Медіана передзвону",value:hl(m.cb_median_sec)})','(0,i.jsx)(al,{label:"Медіана передзвону",value:hl(__kp?__kp.cb_median_sec:m.cb_median_sec)})')
rep('(0,i.jsxs)("div",{className:"mb-3 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6","data-testid":"call-kpi"',
    '(0,i.jsxs)("div",{className:"mb-2 flex flex-wrap items-center gap-1.5","data-testid":"stats-dept",children:[[["sales","Продажі"],["tech","Технічний"],["admin","Адміністративний"],["all","Усі лінії"]].map(([k,l])=>(0,i.jsx)("button",{onClick:()=>__dpS(k),className:nH("rounded-full border px-3 py-1 text-[12.5px] font-semibold",__dp===k?"border-gold bg-goldsoft":"border-line bg-surface"),children:l},k)),(0,i.jsx)("span",{className:"text-[11.5px] text-muted",children:"all"===__dp?"усі дзвінки":"показники, «Не передзвонили», співробітники і пропущені — лише цей відділ; графіки по днях і годинах — усі лінії"})]}),(0,i.jsxs)("div",{className:"mb-3 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6","data-testid":"call-kpi"')
rep('rows:(c.rows??[]).slice().sort((e,t)=>String(t.at).localeCompare(String(e.at))).slice(0,50)','rows:(c.rows??[]).filter(__inD).slice().sort((e,t)=>String(t.at).localeCompare(String(e.at))).slice(0,50)')
# ---- CEO pult & inbox missed list
rep("calls as (select * from erp4.call_events where company_id = ${e} and provider = 'binotel' and at > now() - interval '30 days')",
    "calls as (select * from erp4.call_events where company_id = ${e} and provider = 'binotel' and at > now() - interval '30 days' and ${window.__tzSalesSql('')})")
rep("mc as (select * from erp4.v_missed_callbacks where company_id = ${e} and at > now() - interval '7 days')",
    "mc as (select * from erp4.v_missed_callbacks where company_id = ${e} and at > now() - interval '7 days' and call_id in (select c.call_id from erp4.call_events c where c.company_id = ${e} and c.at > now() - interval '8 days' and ${window.__tzSalesSql('c.')}))")
rep("from erp4.v_missed_callbacks v where company_id=${e} and cb_at is null and card_id is null and order_id is null",
    "from erp4.v_missed_callbacks v where company_id=${e} and cb_at is null and card_id is null and order_id is null and v.call_id in (select c.call_id from erp4.call_events c where c.company_id=${e} and c.at > now() - interval '31 days' and ${window.__tzSalesSql('c.')})")
# ---- lines tab hd: collapsible dept list
rep('children:(0,i.jsxs)("div",{className:"flex flex-col gap-1.5",children:[Object.entries(e).sort(([e],[t])=>e.localeCompare(t)).map(([e,t])=>(0,i.jsxs)("div",{className:"grid grid-cols-[60px_1.2fr_1fr_1.2fr_44px] items-center gap-2"',
    'children:(0,i.jsxs)("div",{className:"flex flex-col gap-1.5",children:[(0,i.jsxs)("details",{className:"rounded-lg border border-line bg-sunk px-3 py-2 text-[12.5px]","data-testid":"dept-map",children:[(0,i.jsx)("summary",{className:"cursor-pointer font-semibold text-heading",children:"Відділи ліній (для статистики продажів)"}),(0,i.jsx)("div",{className:"mt-2 grid gap-1",children:Object.entries(e).sort(([a],[b])=>a.localeCompare(b)).map(([k,t])=>(0,i.jsxs)("div",{className:"flex justify-between gap-2 border-b border-line py-1",children:[(0,i.jsx)("span",{children:k+" · "+(t.name||"—")}),(0,i.jsx)("b",{children:window.__TZD.names[window.__tzDeptOf({internal:k})]})]},k))}),(0,i.jsx)("p",{className:"mt-2 text-muted",children:"Дзвінки технічного і адміністративного відділів не входять у статистику продажів, «перезвонити» і пульт керівника, але є в стрічці дзвінків: їх можна прослухати й оцінити. Дзвінок на новий номер позначається «перший контакт»."})]}),Object.entries(e).sort(([e],[t])=>e.localeCompare(t)).map(([e,t])=>(0,i.jsxs)("div",{className:"grid grid-cols-[60px_1.2fr_1fr_1.2fr_44px] items-center gap-2"')
# ---- clients: object icon + contact type
rep('__chip(a.object,"bg-infosoft text-ink")','__chip(a.object?window.__tzObjIcon(a.object)+" "+a.object:null,"bg-infosoft text-ink"),__chip(x.extra?.contact_type?"👤 "+x.extra.contact_type:null,"bg-oksoft text-ink")')
rep('let __F=[["all","Усі",e.length],','let __hasCT=s.some(f=>"contact_type"===f.key),__F=[["all","Усі",e.length],')
rep('(0,i.jsx)("div",{className:"flex flex-wrap gap-1.5","data-testid":"client-filters",children:',
    '!__hasCT&&(0,i.jsx)("button",{className:"self-start rounded-lg border border-dashed border-gold px-3 py-1.5 text-[12.5px] font-semibold","data-testid":"add-ctype",onClick:async()=>{try{await l3("client_fields_save",{fields:[...s,{key:"contact_type",label:"Тип контакту",type:"select",list:!0,options:window.__TZ_CTYPES}]}),nZ("ok","Поле «Тип контакту» додано — відкрийте клієнта і оберіть тип"),f(e=>e+1)}catch(er){nZ("err",ev(er))}},children:"+ Додати поле «Тип контакту» (клієнт, контрагент, співробітник, підрядник, партнер, посередник)"}),(0,i.jsx)("div",{className:"flex flex-wrap gap-1.5","data-testid":"client-filters",children:')
open(dst,'w',encoding='utf-8').write(s); print('ok')
