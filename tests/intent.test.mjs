import assert from 'node:assert/strict'
import test from 'node:test'
import {intentScenarios,interpretIntent,scenarioScreen,scenarioRequirements} from '../intentModel.js'
import {getExperience,createJourney,transition} from '../experienceCapabilities.js'
for(const [persona,scenarios] of Object.entries(intentScenarios))test(`${persona}: bounded interpretation and scope reset`,()=>{
  const config=getExperience(persona,9),initial=createJourney(config)
  for(const scenario of scenarios){
    assert.equal(interpretIntent(persona,scenario.prompt).id,scenario.id)
    assert.equal(interpretIntent(persona,scenario.prompt+' and export every private record'),null)
    let state=transition(config,initial,{type:'INTENT',scope:config.scope,value:scenario.prompt,submit:true})
    state=transition(config,state,{type:'NEXT',scope:config.scope})
    assert.equal(state.route,'step-1')
    if(scenario.unmet)assert.equal(transition(config,state,{type:'NEXT',scope:config.scope}),state)
    const plan=scenarioScreen(config.routes['step-1'].screen,config,scenario)
    assert.equal(plan.subtitle,scenario.goal)
    const draft=transition(config,initial,{type:'INTENT',scope:config.scope,value:'unsupported',submit:true})
    assert.equal(transition(config,draft,{type:'NEXT',scope:config.scope}),draft)
    for(const star of [5,7,11]){const other=getExperience(persona,star),fresh=createJourney(other);assert.equal(transition(other,fresh,{type:'INTENT',scope:other.scope,value:scenario.prompt,submit:true}),fresh)}
  }
})
test('Pseudonymous scenario requires distinct approved fields, never aggregate-only access',()=>{
 const config=getExperience('partner',9),s=interpretIntent('partner','Pseudonymous participant analysis')
 assert.deepEqual(scenarioRequirements(config,{kind:'controlled'},s,config.requiredAccess),{results:['participant_token','level','results_band']})
})
