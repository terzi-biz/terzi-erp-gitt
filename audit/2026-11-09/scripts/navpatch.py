import re
p='/home/user/erp/live/work.html'; s=open(p,encoding='utf-8').read()
m=re.search(r'let nx=\[(\{key:"tasks".*?)\],nh=\{',s); assert m
old=m.group(1)
items=dict((k,l) for k,l,g in re.findall(r'\{key:"([a-z]+)",label:"([^"]+)",group:"([^"]+)"\}',old))
G=[("Мій день",["tasks","calendar","notifications"]),
   ("Управління",["ceo","dash","tower","office","quality"]),
   ("Продажі",["pilot","inbox","calls","crm","pipelines","funnel","clients","crmorders"]),
   ("Замір і кошторис",["measure","calculators","estimates","prices","catalog"]),
   ("Виконання робіт",["sites","orders","production","stock"]),
   ("Фінанси",["finance","finmodel"]),
   ("Команда",["people","staff"]),
   ("Маркетинг",["marketing"]),
   ("Налаштування",["settings","org","integrations","processes","refs","brand","system"])]
used=[k for _,ks in G for k in ks]
assert sorted(used)==sorted(items), (set(items)^set(used))
new=",".join('{key:"%s",label:"%s",group:"%s"}'%(k,items[k],g) for g,ks in G for k in ks)
s=s.replace(old,new,1)
a='[W,K]=(0,o.useState)(!1),[Z,X]=(0,o.useState)(!1);'
assert s.count(a)==1
s=s.replace(a,'[W,K]=(0,o.useState)(!1),[Z,X]=(0,o.useState)(!1),[__nvO,__nvS]=(0,o.useState)(()=>{try{return JSON.parse(localStorage.getItem("terzi-nav-open")||"{}")||{}}catch{return{}}}),__nvT=(g,v)=>__nvS(p=>{let n={...p,[g]:v};try{localStorage.setItem("terzi-nav-open",JSON.stringify(n))}catch{}return n});',1)
b='M.map(e=>(0,i.jsxs)("div",{className:"mt-3",children:[(0,i.jsx)("div",{className:"px-3 pb-1 text-[10.5px] uppercase tracking-[0.14em] opacity-70",children:e}),C.filter(t=>t.group===e).map('
assert s.count(b)==1
chev='(0,i.jsx)("svg",{width:14,height:14,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2.2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,style:{transition:"transform .15s",transform:__o?"rotate(180deg)":"none"},children:(0,i.jsx)("path",{d:"m6 9 6 6 6-6"})})'
nb=('M.map(e=>{let __n=C.filter(t=>t.group===e),__a=__n.some(t=>t.key===I),__o=__nvO[e]??(__a||M.length<=2);return(0,i.jsxs)("div",{className:"mt-1.5","data-navgroup":e,children:['
    '(0,i.jsxs)("button",{type:"button","aria-expanded":__o,onClick:()=>__nvT(e,!__o),className:nH("flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-white/5",__a?"text-gold":"text-navink/70"),children:['
    '(0,i.jsx)("span",{className:"flex-1",children:e}),!__o&&(0,i.jsx)("span",{className:"num rounded-full bg-white/10 px-1.5 text-[10.5px] tracking-normal",children:__n.length}),'+chev+']}),'
    '__o&&__n.map(')
s=s.replace(b,nb,1)
c='},e.key)})]},e)),g.length>0&&'
assert s.count(c)==1, s.count(c)
s=s.replace(c,'},e.key)})]},e)}),g.length>0&&',1)
open(p,'w',encoding='utf-8').write(s)
print('ok')
