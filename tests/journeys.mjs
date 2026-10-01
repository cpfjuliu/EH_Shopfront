import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { chromium } from 'playwright'
import { experienceFlows, personaMeta } from '../experienceFlows.js'
import { dashboardRows, questions } from '../resultsModel.js'

const browser = await chromium.launch({ headless:true, ...(process.env.BROWSER_EXECUTABLE ? {executablePath:process.env.BROWSER_EXECUTABLE} : {}), args:['--no-sandbox','--disable-gpu'] })
const page = await browser.newPage({viewport:{width:1440,height:1000}})
const errors=[]
page.on('pageerror',e=>errors.push(e.message))
page.on('console',m=>{if(m.type()==='error')errors.push(m.text())})
const url=process.env.TEST_URL || 'http://127.0.0.1:5173'
await fs.mkdir('test-results',{recursive:true})
const button=name=>page.getByRole('button',{name,exact:true})
const visible=async locator=>{await locator.waitFor({state:'visible'});assert(await locator.isVisible())}
async function select(persona,star) {
  await page.locator('.prototype-trigger').click()
  await page.locator('.prototype-options').getByRole('button',{name:personaMeta[persona].label,exact:true}).click()
  await button(`${star}★`).click()
  await page.locator('.prototype-trigger').click()
}
async function advance(screen) {
  await button(screen.primaryLabel).click()
  await page.waitForFunction(()=> ![...document.querySelectorAll('button')].some(b=>b.textContent==='Preparing…'||b.textContent==='Working…'))
}
try {
  await page.goto(url)
  await button('Continue with MOE SSO').click()
  await visible(page.locator('.prototype-trigger'))
  for(const persona of Object.keys(experienceFlows)) for(const star of [5,7,9,11]) {
    await select(persona,star)
    const screens=experienceFlows[persona][star].screens
    for(let i=0;i<screens.length;i++) {
      const screen=screens[i]
      assert.equal(await page.locator('.app-shell').getAttribute('data-experience'),`${persona}/${star}`)
      await visible(page.locator('.main-area'))
      if(screen.kind==='intent') await visible(page.getByRole('heading',{name:screen.title,exact:true}))
      else await visible(page.getByRole('heading',{name:screen.title || 'Student Academic Results',exact:true}).first())
      if(screen.kind==='asset'||screen.kind==='contract') {
        for(const tab of ['Schema','Delivery','Versions','Consumers',...(screen.kind==='asset'?['Lineage','Quality','Access']:[])]) {
          await page.locator('.tabs').getByRole('button',{name:tab,exact:true}).click()
          assert((await page.locator('.product-tab').innerText()).length>150,`${persona} ${star} ${tab}`)
        }
      }
      if(persona==='analyst' && star===9 && screen.kind==='plan') await page.getByLabel('Override analysis level').selectOption('Secondary 2')
      if(screen.kind==='datasetTools') {
        await page.getByLabel('Ask about your dataset').fill('What does this dataset contain?')
        await button('Send question').click()
        assert((await page.locator('.dataset-message').innerText()).includes('pass rate'))
        await button('Analytical tool').click()
        assert((await page.locator('.results-table').innerText()).includes('School A'))
      }
      if(screen.kind==='recommendedDatasets') {
        await button('Open recommended dashboard').click()
        await visible(page.getByLabel('Subject',{exact:true}))
        assert((await page.locator('.results-table').innerText()).includes('School A'))
        await button('Back').click()
        await visible(page.getByRole('heading',{name:screen.title,exact:true}))
      }
      if(screen.kind==='workspace') {
        assert.equal(await page.locator('.assistant-panel').count(),star===5?0:1)
        assert.equal(await button('Why this answer?').count(),0)
        const sql=page.getByRole('textbox',{name:'Review and edit SQL'})
        if(star===9) assert((await sql.inputValue()).includes("AND level = 'Secondary 2'"))
        if(star===5) {await sql.fill('SELECT subject FROM student_academic_results;');await button('Run').click();await visible(page.getByText('SQL saved for review.',{exact:false}))}
        else {await button('Run').click();await visible(page.getByText('Synthetic preview refreshed.',{exact:false}))}
      }
      if(screen.kind==='resultsDashboard') {
        if(star===7) assert.equal(await page.getByLabel('Period',{exact:true}).inputValue(),'Compare years')
        await page.getByLabel('Subject',{exact:true}).selectOption('Mathematics')
        await page.getByLabel('Period',{exact:true}).selectOption('Compare years')
        await page.getByLabel('Level',{exact:true}).selectOption('Secondary 2')
        await page.getByLabel('School',{exact:true}).selectOption('School A')
        assert((await page.locator('.results-table').innerText()).includes('-12.0 pp'))
      }
      if(screen.kind==='businessAnswer') {
        for(const q of questions) {await page.locator('.suggestion-row').getByRole('button',{name:q,exact:true}).click();assert(!(await page.locator('.answer-card').innerText()).includes('needs additional data'))}
        for(const label of ['Why this answer?','What data was used?','Show assumptions']) {await button(label).click();assert((await page.locator('.evidence-detail').innerText()).length>100)}
        await page.getByLabel('Ask a follow-up',{exact:true}).fill('Give me private student names')
        await button('Ask follow-up').click()
        await visible(page.getByRole('heading',{name:'This question needs additional data or clarification'}))
        await page.locator('.suggestion-row').getByRole('button',{name:questions[0],exact:true}).click()
      }
      if(screen.kind==='briefing') {
        assert.equal(await page.locator('.briefing-development').count(),3)
        assert.equal(await page.getByRole('button',{name:'Create briefing',exact:true}).count(),0)
        await button('Evidence & methodology').click();await visible(page.locator('.evidence-detail'))
        await button('Evidence & methodology').click()
        await page.screenshot({path:`test-results/${persona}-${star}.png`,fullPage:true})
      }
      if(screen.kind==='contractTests') for(const scenario of ['Delayed ≤24 hours','Delayed >24 hours','Expired entitlement','Breaking schema change']) {
        await page.getByLabel('Response scenario').selectOption(scenario)
        assert((await page.getByRole('status').innerText()).length>40)
      }
      if(screen.kind==='controlled') {
        await page.getByText('Prototype access scenarios',{exact:true}).click()
        for(const state of ['Expired','Denied']) {
          await page.getByLabel('Entitlement',{exact:true}).selectOption(state)
          await visible(page.getByRole('status'))
          assert.equal(await page.getByRole('heading',{name:'Approved analysis',exact:true}).count(),0)
        }
        await page.getByLabel('Entitlement',{exact:true}).selectOption('Active')
        await visible(page.getByRole('heading',{name:screen.subset?'Approved data package':'Approved analysis',exact:true}))
      }
      assert.equal(await page.locator('.app-shell').getAttribute('data-experience'),`${persona}/${star}`)
      assert.deepEqual(await page.evaluate(()=>[localStorage.getItem('eh_persona'),localStorage.getItem('eh_star')]),[persona,String(star)])
      const forbidden=persona==='business'?['Generate analysis','Request system access','Propose minimum interaction']:persona==='analyst'?['Ask Edu Hub','Request system access','Propose minimum interaction']:persona==='system'?['Ask Edu Hub','Generate analysis','Propose minimum interaction']:['Ask Edu Hub','Generate analysis','Request system access']
      if(star===5) forbidden.push('Propose analytical method','Generate scaffold and tests','Recommend project package','Recommend integration')
      for(const name of forbidden) assert.equal(await page.locator('.main-area').getByRole('button',{name,exact:true}).count(),0,`${persona} ${star}: ${name} leaked`)
      if(i<screens.length-1) {
        if(screen.kind==='datasetDiscovery')await page.locator('.asset-card').filter({has:page.getByText('Student Academic Results',{exact:true})}).click()
        else await advance(screen)
      }
    }
    await button('Back').click()
    await visible(page.locator('.main-area'))
    console.log(`PASS ${persona} ${star}★ (${screens.length} screens, Back)`)
  }
  // The 9★ sidebar entry must submit, not lead to a dead-end manual screen.
  await select('business',9)
  await page.locator('.sidebar').getByRole('button',{name:'Ask Edu Hub',exact:true}).click()
  await page.getByRole('textbox',{name:'Ask Edu Hub',exact:true}).fill('  ')
  assert(await button('Ask').isDisabled())
  await page.getByRole('textbox',{name:'Ask Edu Hub',exact:true}).fill(questions[0])
  await button('Ask').click()
  // Switching persona cancels an outstanding transition.
  await page.locator('.prototype-trigger').click()
  await page.locator('.prototype-options').getByRole('button',{name:'System',exact:true}).click()
  await button('11★').click();await page.locator('.prototype-trigger').click()
  await page.waitForTimeout(1000)
  await visible(page.getByRole('heading',{name:'Results Support App',exact:true}))
  await select('business',11)
  await button('Compare subjects').click()
  await visible(page.getByRole('heading',{name:'Mathematics declined while English improved'}))
  await button('Back').click()
  await button('What is driving School A?').click()
  await visible(page.getByRole('heading',{name:'School A: the largest change is in Secondary 2'}))
  await page.getByLabel('Ask a follow-up',{exact:true}).fill('What is driving the decline in School A?')
  await button('Ask follow-up').click()
  await visible(page.getByRole('heading',{name:'School A: the largest change is in Secondary 2'}))
  await button('Inspect evidence & quality').click()
  await button('Back').click()
  await visible(page.getByRole('heading',{name:'School A: the largest change is in Secondary 2'}))
  await page.getByLabel('Ask a follow-up',{exact:true}).fill('Show me whether this is concentrated in a particular level.')
  await button('Ask follow-up').click()
  await visible(page.getByRole('heading',{name:'Secondary 2 accounts for most of the Mathematics decline'}))
  assert((await page.locator('.main-area').innerText()).includes('2026 vs 2025'))
  await page.locator('.sidebar').getByRole('button',{name:'Results briefing',exact:true}).click()
  await visible(page.getByRole('heading',{name:'Your Academic Results Briefing',exact:true}))
  await page.setViewportSize({width:390,height:844})
  await page.screenshot({path:'test-results/business-11-mobile.png',fullPage:true})
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'Mobile page overflows')
  await page.setViewportSize({width:1440,height:1000})
  await page.locator('.prototype-trigger').click()
  await button('Open data owner / governance backstage').click()
  await page.locator('.prototype-trigger').click()
  await visible(page.getByRole('heading',{name:'Data owner & governance backstage',exact:true}))
  assert((await page.locator('.main-area').innerText()).includes('Student Academic Results'))
  await button('Sign out').click();await visible(button('Continue with MOE SSO'))
  await page.evaluate(()=>{localStorage.setItem('eh_persona','invalid');localStorage.setItem('eh_star','12');localStorage.setItem('eh_logged_in','1')})
  await page.reload();await visible(page.locator('.prototype-trigger'))
  assert((await page.locator('.prototype-trigger').innerText()).includes('Business · 5★'))
  assert.equal(dashboardRows('Mathematics','Secondary 2','School A')[0][3],'-12.0 pp')
  assert.deepEqual(errors,[],'Browser console/runtime errors')
  console.log('PASS follow-ups, blank input, pending-transition cancellation, context, mobile, governance, invalid saved state; no console/runtime errors')
} finally { await browser.close() }
