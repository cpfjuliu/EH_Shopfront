import assert from 'node:assert/strict'
import {chromium} from 'playwright'
import {getExperience,personas,stars} from '../experienceCapabilities.js'
import {personaMeta} from '../experienceFlows.js'
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{}),args:['--no-sandbox','--disable-gpu']})
const page=await browser.newPage({viewport:{width:1440,height:1000}})
page.setDefaultTimeout(8000)
const errors=[]
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())})
const button=name=>page.getByRole('button',{name,exact:true})
async function select(persona,star,scenario='First-time user') {
  await page.locator('.prototype-trigger').click()
  await page.locator('.prototype-options').getByRole('button',{name:personaMeta[persona].label,exact:true}).click()
  await button(`${star}★`).click();await button(scenario).click();await page.locator('.prototype-trigger').click()
}
async function backstage(){await page.locator('.prototype-trigger').click();await button('Open data owner / governance backstage').click();await page.locator('.prototype-trigger').click()}
async function openAccess(){await page.locator('.context-actions').getByRole('button',{name:'Data access',exact:true}).click()}
async function nextRoute(previous){await page.waitForFunction(r=>document.querySelector('.app-shell').dataset.route!==r,previous)}
try{
  await page.goto(process.env.TEST_URL||'http://127.0.0.1:5173');await button('Continue with MOE SSO').click();await page.locator('.prototype-trigger').waitFor()
  for(const persona of personas)for(const star of stars){
    await select(persona,star)
    const c=getExperience(persona,star)
    for(let step=0;step<5;step++){
      assert.equal(await page.locator('.app-shell').getAttribute('data-experience'),c.scope)
      assert.equal(await page.locator('.briefing-development,.answer-card,.results-table,.editor-results,.chart-card').count(),0,`Unapproved data leaked: ${c.scope}`)
      const route=await page.locator('.app-shell').getAttribute('data-route'),screen=c.routes[route].screen
      if(await page.getByRole('heading',{name:'Approval needed before use',exact:true}).count())break
      if(screen.kind==='datasetDiscovery'){await page.locator('.asset-card').filter({has:page.getByText('Student Academic Results',{exact:true})}).click();continue}
      if(screen.kind==='asset'){
        await page.locator('.tabs').getByRole('button',{name:'Schema',exact:true}).click()
        assert((await page.locator('.product-tab').innerText()).includes('Sample values require approved field access'))
      }
      if(!screen.primaryLabel)break
      const next=button(screen.primaryLabel)
      if(await next.isDisabled())break
      await next.click();await nextRoute(route)
    }
    await openAccess();assert((await page.locator('.main-area').innerText()).includes('No approved fields yet'))
    console.log(`PASS first-time approval gate ${c.scope}`)
  }
  await select('business',5)
  await page.locator('.asset-card').filter({has:page.getByText('Student Academic Results',{exact:true})}).click()
  assert(await button('Use approved dataset').isDisabled())
  await button('Request dataset fields').click()
  await page.getByLabel('Reason',{exact:true}).fill('Compare academic outcomes using approved fields')
  await page.getByLabel('Student Identity: student_id',{exact:true}).check()
  await button('Submit common request').click()
  assert.equal(await page.locator('[data-owner-status="Pending"]').count(),2)
  await page.reload()
  await page.locator('[data-owner-status="Pending"]').first().waitFor()
  assert.equal(await page.locator('[data-owner-status="Pending"]').count(),2)
  assert((await page.locator('.main-area').innerText()).includes('No approved fields yet'))
  await backstage()
  await button('Approve Student Academic Results').click()
  await button('Deny Student Identity').click()
  await button('Back').click()
  assert.equal(await page.locator('[data-owner-status="Approved"]').count(),1)
  assert.equal(await page.locator('[data-owner-status="Denied"]').count(),1)
  assert((await page.locator('.main-area').innerText()).includes('Provisioned immediately'))
  // Reload deliberately clears route history; return through discovery.
  await button('Continue your journey').click()
  await page.locator('.asset-card').filter({has:page.getByText('Student Academic Results',{exact:true})}).click()
  await button('Use approved dataset').click()
  await page.getByLabel('Active dataset',{exact:true}).waitFor()
  assert.equal(await page.getByLabel('Active dataset',{exact:true}).locator('option:not([disabled])').count(),1)
  await page.getByLabel('Ask about your dataset',{exact:true}).fill('Which schools saw the biggest drop in Mathematics pass rates this year?')
  await button('Send question').click()
  assert((await page.locator('.dataset-message').innerText()).includes('School A'))
  await page.getByLabel('Ask about your dataset',{exact:true}).fill('What is driving School A?');await button('Send question').click()
  assert.equal(await page.locator('.dataset-message').count(),2)
  await button('Analytical tool').click();assert((await page.locator('.results-table').innerText()).includes('-8.0 pp'))
  await page.screenshot({path:'test-results/business-5-approved-tools.png',fullPage:true})
  await backstage();await button('Expire current access').click();await button('Back').click()
  assert.equal(await page.locator('.results-table,.dataset-message').count(),0)
  assert((await page.locator('.main-area').innerText()).includes('No approved access'))
  await page.evaluate(()=>{location.hash='#/business/5/results-dashboard'})
  await page.getByRole('heading',{name:'Approval needed before use'}).waitFor()
  await page.reload()
  await page.getByRole('heading',{name:'Approval needed before use'}).waitFor()

  // Field-level approval permits explanations but cannot unlock calculations.
  await select('business',7)
  await button('Recommend datasets and steps').click()
  await button('Open recommended dashboard').click()
  await page.getByRole('heading',{name:'Approval needed before use'}).waitFor()
  await page.goBack()
  await button('Request recommended fields').click()
  while(await page.locator('.request-datasets input:checked:not(:disabled)').count())await page.locator('.request-datasets input:checked:not(:disabled)').first().uncheck()
  await page.getByLabel('Student Academic Results: subject',{exact:true}).check()
  await page.getByLabel('Reason',{exact:true}).fill('Understand the subject field')
  await button('Submit common request').click()
  await backstage();await button('Approve Student Academic Results').click();await button('Back').click()
  await button('Continue your journey').click();await button('Analyse approved data').click()
  await page.getByLabel('Ask about your dataset',{exact:true}).fill('Which schools saw the biggest drop in Mathematics pass rates this year?')
  await button('Send question').click()
  assert((await page.locator('.dataset-message').innerText()).includes('outside the current approved dataset'))
  assert(!(await page.locator('.dataset-message').innerText()).includes('8 pp'))
  await button('Analytical tool').click();assert.equal(await page.locator('.results-table').count(),0)
  await page.setViewportSize({width:390,height:844});await openAccess()
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Access form overflows mobile')
  await page.screenshot({path:'test-results/access-mobile.png',fullPage:true})
  assert.deepEqual(errors,[])
  console.log('PASS common request, separate owner decisions, immediate partial provisioning, dataset chat, analysis, field restrictions, expiry, mobile; no runtime errors')
}catch(error){console.error(await page.locator('.main-area').innerText());throw error}finally{await browser.close()}
