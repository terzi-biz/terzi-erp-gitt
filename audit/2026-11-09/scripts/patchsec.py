import sys
src,dst=sys.argv[1],sys.argv[2]
s=open(src,encoding='utf-8').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); s=s.replace(a,b,1)
rep('eI=eC().then(e=>e?"gateway":"owner")),eI}',
    'eI=eC().then(e=>e?"gateway":(()=>{try{return"1"===localStorage.getItem("terzi-owner-db")}catch{return!1}})()?"owner":"none")),eI}')
rep('onClick:()=>{window.confirm("Режим власника БД дає прямий доступ до всієї бази. Увімкнути лише для видачі ключа?")},children:"Увімкнути режим власника БД (тимчасово)"})',
    'onClick:()=>{if(window.confirm("Режим власника БД дає прямий доступ до всієї бази. Увімкнути лише для видачі ключа?")){try{localStorage.setItem("terzi-owner-db","1")}catch{}location.reload()}},children:"Увімкнути режим власника БД (тимчасово)"})')
rep('(0,i.jsx)(n0,{v:"gold",onClick:()=>g(n,"власник · перший ключ"),disabled:!n,"data-testid":"key-self",children:"Видати ключ собі"})',
    '(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n0,{v:"gold",onClick:()=>g(n,"власник · перший ключ"),disabled:!n,"data-testid":"key-self",children:"Видати ключ собі"}),(0,i.jsx)(n0,{v:"ghost",onClick:()=>{try{localStorage.removeItem("terzi-owner-db")}catch{}location.reload()},children:"Вимкнути режим власника БД"})]})')
open(dst,'w',encoding='utf-8').write(s); print('ok')
