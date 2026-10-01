import assert from 'node:assert/strict'
import test from 'node:test'
import {personas, stars, getExperience, createJourney, transition, canVisit, parseRoute, routeHash} from '../experienceCapabilities.js'

const expected = {
  business:['datasetDiscovery','intent','intent','briefing'],
  analyst:['catalog','intent','intent','briefing'],
  system:['contract','intent','intent','consumerHealth'],
  partner:['accessHub','intent','intent','partnerOutcome'],
}
for(const persona of personas) for(const [index,star] of stars.entries()) test(`${persona} ${star}: isolated routes, actions and prerequisites`,()=>{
  const c=getExperience(persona,star), initial=createJourney(c)
  assert.equal(c.routes[c.landing].screen.kind,expected[persona][index])
  assert.equal(c.navigation.length,1,'No competing primary journeys')
  for(const item of [...c.navigation,...c.search,...c.actions,...c.notifications,...c.home.cards,...c.quickActions]) {
    assert.equal(c.routes[item.route].scope,c.scope)
    assert(canVisit(c,initial,item.route))
  }
  for(const otherPersona of personas) for(const otherStar of stars) {
    const other=getExperience(otherPersona,otherStar)
    if(other===c) continue
    for(const route of Object.keys(other.routes)) assert.equal(parseRoute(c,routeHash(other,route)),c.landing)
    assert.equal(transition(c,initial,{type:'NEXT',scope:other.scope}),initial,'Reject foreign action')
  }
  for(const [route,def] of Object.entries(c.routes)) if(!def.public) {
    assert(!canVisit(c,initial,route))
    for(const type of ['NAVIGATE','HISTORY']) assert.equal(transition(c,initial,{type,scope:c.scope,route}).route,c.landing)
  }
  assert.equal(transition(c,initial,{type:'NEXT',scope:c.scope,source:'step-99'}),initial)
  assert.equal(transition(c,initial,{type:'CHANGE_PERSONA',scope:c.scope,value:'system'}),initial)
  assert.equal(transition(c,initial,{type:'CHANGE_STAR',scope:c.scope,value:11}),initial)
  assert.equal(transition(c,initial,{type:'NAVIGATE',scope:c.scope,route:'governance'}).route,c.landing)
  let state=initial
  if(c.routes[c.landing].screen.businessQuestion) {
    assert.equal(transition(c,state,{type:'NEXT',scope:c.scope}),state,'Ask first')
    state=transition(c,state,{type:'QUESTION',scope:c.scope,value:'Which schools declined?'})
  }
  while(c.routes[state.route].next) {
    const previous=state
    state=transition(c,state,{type:'NEXT',scope:c.scope,source:state.route})
    assert.notEqual(state.route,previous.route)
    assert.equal(state.scope,c.scope)
    assert(canVisit(c,state,state.route))
    assert(!canVisit(c,createJourney(c),state.route),'Reload does not inherit grants')
  }
  for(const [type,feature,value] of [['QUESTION','businessQuestions','Test'],['LEVEL','methodOverride','Secondary 2'],['DELIVERY','manualDelivery','Managed file']]) {
    const result=transition(c,initial,{type,scope:c.scope,value})
    assert.equal(result!==initial,c.features.includes(feature),`${type} capability`)
  }
})
test('Explicit feature boundaries and invalid preferences',()=>{
  for(const p of personas) {
    const five=getExperience(p,5)
    assert(!five.features.some(f=>['businessQuestions','starterSql','generatedContract','dataMinimisation','proactiveBriefing'].includes(f)))
    assert.equal(getExperience(p,11).home.cards.length,0)
  }
  assert.equal(getExperience('business',7).features.includes('businessQuestions'),false)
  assert.equal(getExperience('analyst',7).features.includes('methodOverride'),false)
  assert.equal(getExperience('system',7).features.includes('generatedContract'),false)
  assert.equal(getExperience('partner',5).routes['step-3'].screen.subset,true)
  assert.equal(getExperience('partner',7).routes['step-2'].screen.subset,true)
  assert.equal(getExperience('invalid',12).scope,'analyst/7')
  assert.equal(getExperience('__proto__','constructor').scope,'analyst/7')
})
