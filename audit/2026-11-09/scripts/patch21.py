import re
p='/home/user/erp/live/work.html'; s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); s=s.replace(a,b,1)
# quick actions open the form directly
rep('F.map(([e,t])=>{let n=fd[t];return(0,i.jsxs)("button",{onClick:()=>{_(!1),v(t)}',
    'F.map(([e,t])=>{let n=fd[t];return(0,i.jsxs)("button",{onClick:()=>{_(!1),v(t);let __L={"Нове звернення":"Нове звернення","Розрахунок / КП":"Новий розрахунок","Звіт за зміну":"Звіт за зміну","Грошова операція":"Грошова операція"}[e];__L&&setTimeout(()=>{let __b=[...document.querySelectorAll("main button")].find(x=>x.textContent.trim()===__L);__b&&__b.click()},450)}')
# refs: tap-to-edit on touch
m=re.search(r'\(0,i\.jsx\)\("td",\{onDoubleClick:(\(\)=>e\.can_edit&&t\.active&&q\(\{.*?\}\)),className:nH\("max-w-\[320px\] px-2 py-1"',s,re.S)
assert m and s.count(m.group(0))==1
H=m.group(1)
s=s.replace(m.group(0),m.group(0).replace('onDoubleClick:'+H,'onDoubleClick:'+H+',onClick:()=>!a&&matchMedia("(pointer:coarse)").matches&&('+H+')()'),1)
open(p,'w',encoding='utf-8').write(s); print('ok', len(H))
