import re,sys
p='/home/user/erp/live/work.html'; s=open(p,encoding='utf-8').read()
css=open('/home/user/erp/scripts/mobile.css').read()
s=re.sub(r'<style id="terzi-mobile">.*?</style>\n','',s,flags=re.S)
s=s.replace('<div id="root"></div>','<style id="terzi-mobile">'+css+'</style>\n<div id="root"></div>',1)
open(p,'w',encoding='utf-8').write(s)
