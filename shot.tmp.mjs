import { chromium } from '/Users/sivaprakasam/projects/agents/qa-dashboard/node_modules/playwright/index.mjs'
const [url,out]=process.argv.slice(2)
const b=await chromium.launch()
for (const [w,h] of [[375,812],[1280,800]]){
 const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message))
 await p.goto(url,{waitUntil:'networkidle'});await p.waitForTimeout(2500)
 console.log(w,'overflow',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),errs)
 await p.screenshot({path:`${out}-${w}.png`,fullPage:w==375});await p.close()}
await b.close()
