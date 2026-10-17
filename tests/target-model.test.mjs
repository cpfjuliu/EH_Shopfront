import test from 'node:test'
import assert from 'node:assert/strict'
import {resultFields} from '../accessModel.js'
import {effectiveScope,newAccount,targetTransition,validateRequest,demoAccount,requestStatus,requestAccess,answerForRequest,safeRoute,searchCatalogue,restoreAccount,destination,hasFields} from '../targetModel.js'

test('one catalogue distinguishes data, other assets and embedded dashboards',()=>{
  const result=searchCatalogue('Attendance')
  assert.deepEqual(result.data.map(p=>p.id),['attendance'])
  assert.deepEqual(result.other.map(p=>p.id),['active-students'])
  assert.deepEqual(result.dashboards.map(p=>p.id),['attendance'])
  assert.equal(searchCatalogue().data.length,3)
  assert.equal(searchCatalogue('not-in-the-catalogue').data.length,0)
})
test('multi-EDP scope includes validated locked linking fields and excludes invented fields',()=>{
  let a=newAccount('business')
  a=targetTransition(a,{type:'FIELD',id:'results',field:'subject'})
  a=targetTransition(a,{type:'FIELD',id:'attendance',field:'attendance_status'})
  assert.deepEqual(effectiveScope(a.scope),{attendance:['attendance_status','student_id'],results:['subject','student_id']})
  assert.equal(targetTransition(a,{type:'FIELD',id:'results',field:'student_id'}),a)
  assert.equal(targetTransition(a,{type:'FIELD',id:'results',field:'invented'}),a)
  a=targetTransition(a,{type:'REMOVE_PRODUCT',id:'attendance'})
  assert.deepEqual(effectiveScope(a.scope),{results:['subject']})
})
test('intent drives technical requirements independently of presenter perspective',()=>{
  let a={...newAccount('business'),scope:{results:['subject']}}
  assert.match(validateRequest(a),/purpose/)
  a=targetTransition(a,{type:'FORM',values:{purpose:'Support a service',intent:'system'}})
  assert.match(validateRequest(a),/system name/)
  a=targetTransition(a,{type:'FORM',values:{systemName:'Service',method:'vpc'}})
  assert.match(validateRequest(a),/AWS/)
  a=targetTransition(a,{type:'FORM',values:{aws:true,network:true}})
  assert.equal(validateRequest(a),'')
  a=targetTransition(a,{type:'FORM',values:{method:'s3',bucket:'invalid'}})
  assert.match(validateRequest(a),/bucket/)
  a=targetTransition(a,{type:'FORM',values:{bucket:'s3://demo-consumer-bucket',frequency:'regular',cadence:'Weekly'}})
  assert.equal(validateRequest(a),'')
})
test('a use-case request preserves purpose, scope and fulfilment; partial approval is immediately useful',()=>{
  let a=demoAccount('business','Pending approval'),r=a.access.requests[0]
  assert.equal(requestStatus(r),'Pending Data Owner approval')
  assert.equal(destination(r),'/dip/REQ-001')
  const item=r.items.find(i=>i.dataset==='results')
  a=targetTransition(a,{type:'DECIDE',request:r.id,dataset:item.dataset,actor:'wrong owner',decision:'Approved'})
  assert.equal(requestStatus(a.access.requests[0]),'Pending Data Owner approval')
  a=targetTransition(a,{type:'DECIDE',request:r.id,dataset:item.dataset,actor:item.owner,decision:'Approved'})
  r=a.access.requests[0]
  assert.equal(requestStatus(r),'Partially Approved')
  assert(hasFields(r,'results',resultFields))
  assert(!requestAccess(r).attendance)
  assert.match(answerForRequest(r,'Compare subjects').headline,/Mathematics/)
  assert(answerForRequest(r,'Show every student contact').unsupported)
})
test('approvals cannot carry into another use case, and expiry/denial fail closed',()=>{
  let a=demoAccount('business','Active')
  a=targetTransition(a,{type:'ADD_SCOPE',scope:{results:resultFields},form:{purpose:'Different purpose'}})
  a=targetTransition(a,{type:'SUBMIT'})
  assert.equal(a.access.requests.length,2)
  assert(a.access.grants.results.length>0,'backstage can still expire earlier active access after another request is submitted')
  assert.equal(requestStatus(a.access.requests[1]),'Pending Data Owner approval')
  assert(!hasFields(a.access.requests[1],'results',resultFields))
  a=targetTransition(a,{type:'EXPIRE',actor:'governance'})
  assert(answerForRequest(a.access.requests[0],'Compare subjects').unsupported)
  assert.equal(requestStatus(demoAccount('business','Denied').access.requests[0]),'Denied')
})
test('adding dashboard scope retains existing selections on the same EDP',()=>{
  let a={...newAccount('business'),scope:{attendance:['absence_category']}}
  a=targetTransition(a,{type:'ADD_SCOPE',scope:{attendance:['attendance_date','attendance_status']},form:{intent:'dashboard'}})
  assert.deepEqual(a.scope.attendance,['absence_category','attendance_date','attendance_status'])
})
test('DIP Lite describes approved subsets but cannot compute without required fields',()=>{
  let a={...newAccount('business'),scope:{results:['passed']},form:{...newAccount('business').form,purpose:'Definition review'}}
  a=targetTransition(a,{type:'SUBMIT'});const r=a.access.requests[0],i=r.items[0]
  a=targetTransition(a,{type:'DECIDE',request:r.id,dataset:i.dataset,actor:i.owner,decision:'Approved'})
  const approved=a.access.requests[0]
  assert(!answerForRequest(approved,'What does pass rate mean?').unsupported)
  assert(answerForRequest(approved,'Compare subjects').unsupported)
})
test('deprecated and foreign routes never change persona or expose legacy screens',()=>{
  const a=demoAccount('business','Active')
  for(const p of ['business','system','analyst','partner'])for(const star of [5,7,9,11])for(const step of ['step-0','step-1','access','backstage'])assert.equal(safeRoute(`#/${p}/${star}/${step}`,a),'/home')
  assert.equal(safeRoute('#/integration/REQ-001',a),'/home')
  assert.equal(safeRoute('#/dip/REQ-001',a),'/dip/REQ-001')
  assert.equal(safeRoute('#/dip/REQ-999',a),'/home')
  assert.equal(safeRoute('#/backstage',a),'/home')
  assert.equal(targetTransition(a,{type:'FORM',persona:'system',values:{purpose:'leak'}}),a)
})
test('all demo lifecycle states and safe persistence restoration',()=>{
  for(const [scenario,status] of [['Pending approval','Pending Data Owner approval'],['Partially approved','Partially Approved'],['Active','Active'],['Expired','Expired'],['Denied','Denied']]){
    const a=demoAccount('system',scenario)
    assert.equal(requestStatus(a.access.requests[0]),status)
    assert.equal(requestStatus(restoreAccount('system',a).access.requests[0]),status)
  }
  assert.equal(restoreAccount('business',demoAccount('system','Active')).access.requests.length,0)
  assert.equal(restoreAccount('business',{access:{requests:[]},form:null}).access.requests.length,0)
})
