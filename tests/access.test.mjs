import assert from 'node:assert/strict'
import test from 'node:test'
import {createAccess,accessTransition,approved,hasRequirements,resultFields,requestDatasets,restoreAccess} from '../accessModel.js'
for(const persona of ['business','analyst','system','partner'])test(`${persona}: owner routing, immediate field grants and expiry`,()=>{
  let state=createAccess(persona,'first')
  const datasets=requestDatasets(persona)
  assert(!approved(state,'results'))
  assert.equal(accessTransition(state,{type:'SUBMIT',persona,reason:' ',selection:{results:resultFields}}),state)
  const selection=Object.fromEntries(datasets.map(d=>[d.id,[d.fields[0],'invented_field']]))
  state=accessTransition(state,{type:'SUBMIT',persona,reason:'Evaluate academic outcomes',selection})
  assert.equal(state.requests.length,1)
  assert.equal(state.requests[0].items.length,datasets.length)
  for(const item of state.requests[0].items){
    assert.equal(item.owner,datasets.find(d=>d.id===item.dataset).owner)
    assert.equal(item.fields.length,1)
    assert(!approved(state,item.dataset))
    const action={type:'DECIDE',persona,request:'REQ-001',dataset:item.dataset,decision:'Approved'}
    assert.equal(accessTransition(state,{...action,actor:'wrong owner'}),state)
    const other=state.requests[0].items.find(i=>i.dataset!==item.dataset&&i.status==='Pending')
    state=accessTransition(state,{...action,actor:item.owner})
    assert(approved(state,item.dataset,item.fields))
    if(other)assert(!approved(state,other.dataset))
  }
  state=accessTransition(state,{type:'EXPIRE',persona,actor:'governance'})
  assert(!approved(state,'results'))
  assert(state.requests[0].items.every(i=>i.status==='Expired'))
})
test('Denial, partial approval and foreign-persona actions never grant fields',()=>{
  let state=createAccess('business','first')
  state=accessTransition(state,{type:'SUBMIT',persona:'business',reason:'Compare results',selection:{results:['subject'],identity:['student_id']}})
  const base={type:'DECIDE',persona:'business',request:'REQ-001'}
  assert.equal(accessTransition(state,{...base,persona:'system',dataset:'results',actor:'Academic Data Domain',decision:'Approved'}),state)
  state=accessTransition(state,{...base,dataset:'results',actor:'Academic Data Domain',decision:'Approved'})
  assert(approved(state,'results',['subject']))
  assert(!hasRequirements(state,{results:resultFields}))
  const item=state.requests[0].items.find(i=>i.dataset==='identity')
  state=accessTransition(state,{...base,dataset:'identity',actor:item.owner,decision:'Denied'})
  assert(!approved(state,'identity'))
})
test('Restoring access preserves pending/expired state and rejects corrupt records',()=>{
  const empty=createAccess('business','first')
  assert.deepEqual(restoreAccess('business','first',JSON.stringify(empty)),empty)
  assert.deepEqual(restoreAccess('business','returning','{corrupt'),empty)
  assert.deepEqual(restoreAccess('business','first',JSON.stringify(createAccess('partner'))),empty)
  assert.deepEqual(restoreAccess('business','first',JSON.stringify({...empty,grants:{results:['invented']}})),empty)
})
