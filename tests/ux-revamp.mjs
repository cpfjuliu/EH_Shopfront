import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {chromium} from 'playwright'
import {intentScenarios} from '../intentModel.js'
import {getExperience} from '../experienceCapabilities.js'
import {personaMeta} from '../experienceFlows.js'
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{})})
const page=await browser.newPage({viewport:{width:1440,height:1000}})
page.setDefaultTimeout(8000)
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())})
const button=name=>page.getByRole('button',{name,exact:true})
async function select(persona,star,scenario='Returning user'){
 await page.locator('.prototype-trigger').click();await page.locator('.prototype-options').getByRole('button',{name:personaMeta[persona].label,exact:true}).click();await button(`${star}★`).click();await button(scenario).click();await page.locator('.prototype-trigger').click()
}
async function next(){const previous=await page.locator('.app-shell').getAttribute('data-route');await page.locator('.main-area .button-primary:visible').click();await page.waitForFunction(r=>document.querySelector('.app-shell').dataset.route!==r,previous)}
async function evidence(){await button('Evidence & methodology').click();await page.getByRole('dialog').waitFor();return page.locator('.evidence-detail').innerText()}
try{
 await fs.mkdir('test-results',{recursive:true});await page.goto(process.env.TEST_URL||'http://127.0.0.1:5173');await button('Continue with MOE SSO').click()
 for(const [persona,scenarios] of Object.entries(intentScenarios)){
  for(const scenario of scenarios){
   await select(persona,9);await page.locator('textarea').fill(scenario.prompt);await next()
   const plan=await page.locator('.main-area').innerText();assert(plan.includes(scenario.goal));assert(plan.includes(scenario.method));assert(plan.includes(scenario.assumptions));assert(plan.includes(scenario.response))
   if(scenario.unmet){assert.equal(await page.locator('.main-area .button-primary').count(),0);await page.evaluate(()=>location.hash='#/system/9/step-2');await page.waitForFunction(()=>document.querySelector('.app-shell').dataset.route==='step-0');continue}
   await next()
   if(persona==='analyst'){await next();await button('Run').click();assert((await page.locator('.sql-editor').inputValue()).includes(`subject = '${scenario.subject}'`));assert((await page.locator('.editor-results').innerText()).includes(scenario.subject==='English'?'88.0%':'pp'))}
   if(persona==='system'){const code=await page.locator('.dev-code').innerText();assert(code.includes(scenario.id==='batch'?'managed-file':scenario.environment));await next();await page.getByLabel('Response scenario').selectOption('Expired entitlement');assert((await page.getByRole('status').innerText()).includes('403'))}
   if(persona==='partner'){assert.equal(await page.getByRole('heading',{name:scenario.subset?'Approved data package':'Approved analysis',exact:true}).count(),1);const detail=await evidence();assert(detail.includes('unavailable')||detail.includes('not supplied'));await page.keyboard.press('Escape')}
   await page.screenshot({path:`test-results/scenario-${persona}-${scenario.id}.png`,fullPage:true})
  }
  await select(persona,9);await page.locator('textarea').fill('Show only English for 2025 and no other years');await page.locator('.main-area .button-primary').click();await page.getByRole('alert').waitFor();assert.equal(await page.locator('.app-shell').getAttribute('data-route'),'step-0');assert.equal(await page.locator('.plan-table').count(),0)
  await page.screenshot({path:`test-results/unsupported-${persona}.png`,fullPage:true})
  console.log(`PASS ${persona}: every supported scenario and unsupported intent`)
 }
 // Modal isolation, reverse tab containment, Escape and exact focus restoration.
 await select('business',11);const trigger=page.locator('.global-search');await trigger.click();await page.getByRole('textbox',{name:'Search this experience'}).fill('nothing-matches');assert(await page.locator('#root').evaluate(el=>el.inert));const dialog=page.getByRole('dialog');await dialog.getByRole('button',{name:'Close Search this experience'}).focus();await page.keyboard.press('Shift+Tab');assert(await page.evaluate(()=>!!document.activeElement.closest('dialog')));await page.keyboard.press('Tab');assert(await page.evaluate(()=>!!document.activeElement.closest('dialog')));await page.keyboard.press('Escape');assert(await trigger.evaluate(el=>el===document.activeElement));assert(!(await page.locator('#root').evaluate(el=>el.inert)))
 await evidence();await page.keyboard.press('Escape');assert(await button('Evidence & methodology').evaluate(el=>el===document.activeElement))
 await select('analyst',11);await evidence();await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Reproducibility');await page.keyboard.press('Enter');assert(await page.locator('dialog details').evaluate(el=>el.open));await page.keyboard.press('Tab');assert(await page.getByRole('button',{name:'Close Evidence & methodology'}).evaluate(el=>el===document.activeElement));await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Reproducibility');await page.keyboard.press('Escape')
 // First-time goal and preserved English intent across explicit owner approval.
 await select('analyst',9,'First-time user');await page.locator('textarea').fill('English year-on-year change');await next();await page.getByRole('heading',{name:'Approval needed before use'}).waitFor();assert(!(await page.locator('.main-area').innerText()).includes('88%'));await button('Request or track access').click();await page.getByLabel('Reason',{exact:true}).fill('Compare English outcomes in the approved analytical workspace');await button('Submit common request').click();await page.locator('.prototype-trigger').click();await button('Open data owner / governance backstage').click();await page.locator('.prototype-trigger').click();await button('Approve Student Academic Results').click();await button('Approve Student Identity').click();await button('Back').click();await button('Continue your journey').click();assert((await page.locator('.plan-table').innerText()).includes('English improved from 85% to 88%'))
 // A fresh first-time 11-star gate uses business language, not field names.
 await select('business',11,'First-time user');assert(!(await page.locator('.main-area').innerText()).includes('student_id'));await button('Request or track access').click();assert(!(await page.locator('.main-area').innerText()).includes('school_code'))
 for(const persona of ['business','analyst','system','partner']){
  await select(persona,9);const nine=await page.locator('.main-area .button-primary:visible,.main-area textarea:visible,.main-area .suggestion-row button:visible').count();await select(persona,11);const eleven=await page.locator('.main-area .button-primary:visible,.main-area textarea:visible,.main-area .suggestion-row button:visible').count();assert(eleven<nine,`${persona}: fewer primary choices at 11`)
 }
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});await select('analyst',5);const warning=page.locator('.catalog-main .badge').filter({hasText:'delayed'});assert(await warning.evaluate(el=>el.scrollWidth<=el.clientWidth));assert(await page.evaluate(()=>document.querySelector('.app-shell').getBoundingClientRect().bottom<=document.querySelector('.prototype-control').getBoundingClientRect().top));await select('business',11);await button('Explore drivers').scrollIntoViewIfNeeded();const box=await button('Explore drivers').boundingBox(),presenter=await page.locator('.prototype-control').boundingBox();assert(box.y+box.height<=presenter.y);await page.screenshot({path:`test-results/briefing-actions-${width}.png`});await evidence();await page.screenshot({path:`test-results/evidence-${width}.png`});await page.keyboard.press('Escape')
 }
 assert.deepEqual(errors,[]);console.log('PASS modal focus/inert/Escape, preserved destination, goal-based access, evidence, 11-star choices, 320/390 touch layouts; no runtime errors')
}finally{await browser.close()}
