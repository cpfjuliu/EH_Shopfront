import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { chromium } from 'playwright'
import { personas, stars, getExperience } from '../experienceCapabilities.js'
import { personaMeta } from '../experienceFlows.js'

const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{}),args:['--no-sandbox','--disable-gpu']})
const page=await browser.newPage({viewport:{width:1440,height:1000}})
page.setDefaultTimeout(8000)
const errors=[], report=[]
page.on('pageerror',e=>errors.push(e.message))
page.on('console',m=>{if(m.type()==='error')errors.push(m.text())})
const button=name=>page.getByRole('button',{name,exact:true})
const shell=page.locator('.app-shell')
const route=async expected=>{await page.waitForFunction(value=>document.querySelector('.app-shell')?.dataset.route===value,expected)}
async function stable(c) {
  assert.equal(await shell.getAttribute('data-experience'),c.scope)
  assert.deepEqual(await page.evaluate(()=>[localStorage.getItem('eh_persona'),localStorage.getItem('eh_star')]),[c.persona,String(c.star)])
  assert((await page.locator('.prototype-trigger').innerText()).includes(`${personaMeta[c.persona].label} · ${c.star}★`))
}
async function select(c) {
  await page.locator('.prototype-trigger').click()
  await page.locator('.prototype-options').getByRole('button',{name:personaMeta[c.persona].label,exact:true}).click()
  await button(`${c.star}★`).click()
  await page.locator('.prototype-trigger').click()
  await route(c.landing);await stable(c)
}
async function hash(value) {
  await page.evaluate(value=>new Promise(resolve=>{
    window.addEventListener('hashchange',()=>setTimeout(resolve,30),{once:true})
    location.hash=value
  }),value)
}
const primaryKinds={business:new Set(['discover','dashboardDetail','resultsDashboard','intent','recommendations','businessAnswer','table','briefing']),analyst:new Set(['catalog','asset','form','intent','plan','progress','workspace','incident','briefing']),system:new Set(['contract','api','form','intent','plan','progress','contractTests','consumerHealth','change','table']),partner:new Set(['form','table','progress','controlled','intent','plan','partnerOutcome'])}
try {
  await page.goto(process.env.TEST_URL||'http://127.0.0.1:5173')
  await button('Continue with MOE SSO').click()
  await page.locator('.prototype-trigger').waitFor()
  await fs.mkdir('test-results',{recursive:true})
  for(const persona of personas) for(const star of stars) {
    const c=getExperience(persona,star)
    await select(c)
    assert.deepEqual(await page.locator('[aria-label="Experience navigation"] button').allTextContents(),[c.navigation[0].label])
    assert.equal(await page.locator('.sidebar button').count(),2)
    assert.equal(await page.locator('.recent-card').count(),star===5?1:0)
    assert.equal(await page.locator('.assistant-panel').count(),0)
    assert.equal(await page.locator('.answer-card').count(),star===11&&['business','analyst','partner'].includes(persona)?1:0)
    assert.equal(await page.getByRole('button',{name:'Governance',exact:true}).count(),0)
    assert(!/Available at \d+★|Upgrade to access/.test(await page.locator('.main-area').innerText()))
    if(star===5) assert.equal(await page.locator('.prompt-box,.question-compose,.briefing-development').count(),0)
    if(star===7||star===9) assert.equal(await page.locator('.briefing-development').count(),0)
    if(persona==='business'&&star<9) assert.equal(await page.getByRole('textbox',{name:'Ask Edu Hub',exact:true}).count(),0)
    if(persona!=='business') assert.equal(await page.locator('.question-compose').count(),0)
    for(const def of Object.values(c.routes)) if(def.id.startsWith('step-')) assert(primaryKinds[persona].has(def.screen.kind))
    await page.screenshot({path:`test-results/isolation-${persona}-${star}.png`,fullPage:true})

    // Every visible search result is explicitly allowed and keeps identity.
    for(const item of c.search) {
      await button('Search this experience').click()
      assert.deepEqual(await page.locator('.search-results strong').allTextContents(),c.search.map(i=>i.label))
      await page.locator('.search-results button').filter({has:page.getByText(item.label,{exact:true})}).click()
      await route(item.route);await stable(c)
      if(item.route.startsWith('product-')) assert.equal(await button('Request access').count(),0)
    }
    await page.keyboard.press('Control+k')
    await page.getByRole('textbox',{name:'Search this experience',exact:true}).fill('unavailable workflow')
    assert.equal(await page.locator('.search-results button').count(),0)
    await page.keyboard.press('Escape')
    await button('Notifications').click()
    assert.deepEqual(await page.locator('.notification-item strong').allTextContents(),c.notifications.map(n=>n.title))
    await page.locator('.notification-item').click();await route('evidence');await stable(c)
    await button('Back').click();await stable(c)
    await page.locator('.sidebar').getByRole('button',{name:'Help & scope',exact:true}).click()
    await route('help');await stable(c)
    for(const action of c.actions) {
      await page.locator('.sidebar').getByRole('button',{name:c.navigation[0].label,exact:true}).click()
      await page.locator('.context-actions').getByRole('button',{name:action.label,exact:true}).click()
      await route(action.route);await stable(c)
      if(action.route==='source-product') assert.equal(await button('Request access').count(),0)
      if(action.route==='supporting-dashboard') {await page.getByLabel('School',{exact:true}).selectOption('School A');await stable(c)}
      await button('Back').click();await route('step-0');await stable(c)
    }
    if(star===5) {await page.locator('.recent-card').click();await route('step-0');await stable(c)}

    // All foreign scopes, including same-persona stars, must return to landing.
    for(const p of personas) for(const s of stars) if(`${p}/${s}`!==c.scope) {
      await hash(`#/${p}/${s}/step-1`)
      await route('step-0');await stable(c)
      assert.equal(new URL(page.url()).hash,`#/${c.scope}/step-0`)
    }
    // Same-scope steps cannot be visited before the relevant journey action.
    for(const def of Object.values(c.routes).filter(r=>!r.public)) {
      await hash(`#/${c.scope}/${def.id}`)
      await route('step-0');await stable(c)
    }
    for(const invalid of [`#/${c.scope}/governance`,'#/business/11/supporting-dashboard/extra','#/workspace']) {
      await hash(invalid);await route('step-0');await stable(c)
    }
    // A reload of a protected URL must not inherit journey grants.
    await page.goto(`${process.env.TEST_URL||'http://127.0.0.1:5173'}/#/${c.scope}/step-1`)
    await route('step-0');await stable(c)
    // Both history directions restore only public/current-session state.
    await button('Help').click();await route('help')
    await page.goBack();await route('step-0');await stable(c)
    await page.goForward();await route('help');await stable(c)
    const foreign=getExperience(persona==='business'?'analyst':'business',star===11?5:11)
    await select(foreign)
    await page.goBack();await route('step-0');await stable(foreign)
    await page.goForward();await route('step-0');await stable(foreign)
    report.push({persona,star,status:'PASS',checks:['landing','navigation','search','notifications','context','recents','foreign URLs','locked URLs','reload','back/forward','identity unchanged']})
    console.log(`PASS isolation ${c.scope}`)
  }
  // The manual delivery choice affects only Developer 5's interface.
  const developer=getExperience('system',5)
  await select(developer)
  await page.getByLabel('Select delivery',{exact:true}).selectOption('Managed file')
  await button('Use selected delivery').click();await route('step-1')
  assert((await page.locator('.dev-code').innerText()).includes('Secure managed file delivery'))
  await button('Request system access').click();await route('step-2')
  assert.equal(await page.getByLabel('Delivery',{exact:true}).inputValue(),'Managed file')
  await stable(developer)
  assert.deepEqual(errors,[],'Console/runtime errors')
  await fs.writeFile('test-results/isolation-audit.json',JSON.stringify({combinations:report,consoleErrors:errors},null,2))
  console.log('PASS 16-combination isolation audit; no console/runtime errors')
} finally {await browser.close()}
