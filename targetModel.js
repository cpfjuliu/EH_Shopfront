import {dataProducts} from './mockData.js'
import {createAccess, accessTransition, restoreAccess, resultFields} from './accessModel.js'
import {answerQuestion, questions} from './resultsModel.js'

export const personas = {business:'Business User', system:'System User'}
export const fieldNames = {
  student_id:'Student linking reference', school_code:'School', class_code:'Class', level:'Education level',
  subject:'Subject', academic_year:'Academic year', passed:'Pass outcome', result_status:'Result finality',
  validated_at:'Validation time', freshness_status:'Freshness status', attendance_date:'Attendance date',
  attendance_status:'Attendance status', absence_category:'Reason for absence', latecoming_flag:'Late arrival',
  freshness_timestamp:'Last source update', enrolment_status:'Enrolment status', guardian_contact:'Contact reference',
}
export const fieldName = name => fieldNames[name] || name.replaceAll('_',' ')
export const products = ['identity','attendance','results'].map(id=>({
  ...dataProducts[id], name:id==='identity'?'Student Identity & Contact':dataProducts[id].name,
  type:'Enterprise Data Product', usedBy:id==='results'?['CPDD1','DXD']:id==='attendance'?['DXD','IFSD']:['CPDD1','IFSD'],
  purpose:id==='identity'?'Understand who is enrolled, their school and level, and approved contact references.':id==='attendance'?'Understand attendance patterns and identify where support may be needed.':'Compare final academic outcomes across schools, subjects and years.',
  useCases:id==='identity'?['Link data across education services','Maintain approved student contact context']:id==='attendance'?['Review attendance patterns','Support operational reporting']:['Compare subject performance','Prepare leadership reporting'],
  caveat:id==='results'?'School I and School J have delayed submissions. Comparisons include eight current schools; missing results are never zero.':id==='attendance'?'Synthetic attendance examples only. A complete operational attendance extract is not supplied.':'Contact and identity metadata are synthetic. No real student contact details are supplied.',
}))
export const productById = Object.fromEntries(products.map(p=>[p.id,p]))
export const otherAssets = [
  {id:'special-needs',name:'Special Needs Enrolment',description:'Restricted enrolment reference for approved support planning.',keywords:'support special needs enrolment',owner:'Student Support (example)'},
  {id:'active-students',name:'Active Students (P1 - JC3)',description:'Active student population reference for reporting and attendance context.',keywords:'attendance active enrolment students population',owner:'Student Data Domain'},
]
export const dashboards = [
  {id:'attendance',name:'Student Attendance overview',product:'attendance',description:'Daily attendance patterns and absence categories.',fields:['attendance_date','attendance_status']},
  {id:'results',name:'Academic Results overview',product:'results',description:'Subject and school comparisons for 2025–2026.',fields:resultFields},
]
export function searchCatalogue(query='') {
  const q=query.trim().toLowerCase()
  const matches=value=>!q||value.toLowerCase().includes(q)
  return {
    data:products.filter(p=>matches(p.name+' '+p.purpose+' '+p.useCases.join(' '))),
    other:otherAssets.filter(p=>matches(p.name+' '+p.keywords)),
    dashboards:dashboards.filter(p=>matches(p.name+' '+p.description)),
  }
}
export const emptyForm = (persona='business')=>({purpose:'',intent:persona==='system'?'system':'explore',systemName:'',method:'s3',frequency:'ad-hoc',cadence:'Daily',bucket:'',aws:false,network:false,destination:''})
export const newAccount = persona=>({access:createAccess(persona,'first'),scope:{},form:emptyForm(persona),operation:'healthy'})
export function effectiveScope(scope) {
  const selected=Object.fromEntries(products.map(p=>[p.id,[...new Set((scope[p.id]||[]).filter(f=>p.fields.some(row=>row[0]===f)))]]).filter(([,f])=>f.length))
  if(Object.keys(selected).length>1)for(const id of Object.keys(selected))selected[id]=[...new Set([...selected[id],'student_id'])]
  return selected
}
export const scopeCount = scope=>Object.values(effectiveScope(scope)).reduce((n,fields)=>n+fields.length,0)
export function validateRequest(account) {
  const f=account.form
  if(!scopeCount(account.scope))return 'Select at least one field from an Enterprise Data Product.'
  if(!f.purpose.trim())return 'Describe the purpose of this request.'
  if(!['explore','dashboard','system'].includes(f.intent))return 'Choose how you will use the data.'
  if(f.intent==='system'){
    if(!f.systemName.trim())return 'Enter the consuming system name.'
    if(f.method==='vpc'&&(!f.aws||!f.network))return 'Direct VPC connection requires an AWS consumer and confirmed network/access prerequisites.'
    if(!['s3','vpc'].includes(f.method))return 'Choose a supported fulfilment method.'
    if(f.method==='s3'&&!/^s3:\/\/[a-z0-9][a-z0-9.-]{1,61}[a-z0-9](\/[^\s]*)?$/.test(f.bucket.trim()))return 'Enter a designated bucket in the form s3://example-consumer-bucket. This is a simulated destination.'
    if(!['ad-hoc','regular'].includes(f.frequency)||!['Daily','Weekly'].includes(f.cadence))return 'Choose ad hoc, daily or weekly delivery.'
  }
  return ''
}
export function requestStatus(r) {
  const states=r.items.map(i=>i.status)
  if(states.every(s=>s==='Expired'))return 'Expired'
  if(states.every(s=>s==='Approved'))return 'Active'
  if(states.includes('Approved'))return 'Partially Approved'
  if(states.includes('Pending'))return 'Pending Data Owner approval'
  if(states.includes('Denied'))return 'Denied'
  return 'Expired'
}
export function requestAccess(r){return Object.fromEntries((r?.items||[]).filter(i=>i.status==='Approved').map(i=>[i.dataset,i.fields]))}
export const hasFields=(r,id,fields)=>fields.every(f=>requestAccess(r)[id]?.includes(f))
export const canUse=r=>Object.values(requestAccess(r)).some(f=>f.length)
export const destination=r=>r.meta.intent==='system'?`/integration/${r.id}`:r.meta.destination?.startsWith('/dashboard/')?r.meta.destination:`/dip/${r.id}`
function summarizeGrants(access){
  const grants={}
  for(const request of access.requests)for(const item of request.items)if(item.status==='Approved')grants[item.dataset]=[...new Set([...(grants[item.dataset]||[]),...item.fields])]
  // This summary supports the retained backstage only; consumption uses requestAccess.
  return {...access,grants}
}
export function targetTransition(state,action) {
  if(action.persona&&action.persona!==state.access.persona)return state
  switch(action.type){
    case 'FIELD': {
      if(!productById[action.id]?.fields.some(row=>row[0]===action.field))return state
      if(action.field==='student_id'&&Object.keys(effectiveScope(state.scope)).length>1)return state
      const before=state.scope[action.id]||[]
      const scope={...state.scope,[action.id]:before.includes(action.field)?before.filter(f=>f!==action.field):[...before,action.field]}
      return {...state,scope}
    }
    case 'ADD_SCOPE':{
      const scope={...state.scope}
      for(const [id,fields] of Object.entries(action.scope))scope[id]=[...new Set([...(scope[id]||[]),...fields])]
      return {...state,scope:effectiveScope(scope),form:{...state.form,...action.form}}
    }
    case 'FORM':return {...state,form:{...state.form,...action.values}}
    case 'REMOVE_PRODUCT': {const scope={...state.scope};delete scope[action.id];return {...state,scope}}
    case 'CLEAR_DRAFT':return {...state,scope:{},form:emptyForm(state.access.persona)}
    case 'SUBMIT':{
      if(validateRequest(state))return state
      // Reuse the owner-routing reducer, but authorize every use case independently.
      const next=accessTransition({...state.access,grants:{}},{type:'SUBMIT',persona:state.access.persona,reason:state.form.purpose.trim(),selection:effectiveScope(state.scope)})
      if(next.requests.length===state.access.requests.length)return state
      const access={...next,requests:next.requests.map((r,i)=>i===next.requests.length-1?{...r,meta:{...state.form},submitted:'17 Oct 2026 · simulated'}:r)}
      return {...state,access:summarizeGrants(access),scope:{},form:emptyForm(state.access.persona)}
    }
    case 'DECIDE':case 'EXPIRE':return {...state,access:summarizeGrants(accessTransition(state.access,{...action,persona:state.access.persona}))}
    case 'EXPIRE_REQUEST':{
      if(action.actor!=='governance')return state
      const requests=state.access.requests.map(r=>r.id!==action.id?r:{...r,items:r.items.map(i=>i.status==='Approved'?{...i,status:'Expired'}:i)})
      return {...state,access:summarizeGrants({...state.access,requests})}
    }
    case 'OPERATION':return ['healthy','stale','degraded','breaking','error'].includes(action.value)?{...state,operation:action.value}:state
    default:return state
  }
}
export function demoAccount(persona,scenario) {
  let s=newAccount(persona)
  if(scenario==='First-time / no access')return s
  s={...s,scope:{results:resultFields,attendance:['attendance_date','attendance_status']},form:{...emptyForm(persona),purpose:'Review academic outcomes and attendance',systemName:persona==='system'?'Student Support Service':'',bucket:'s3://demo-consumer-bucket',frequency:'regular'}}
  if(scenario==='Draft')return s
  s=targetTransition(s,{type:'SUBMIT'})
  for(const [index,item] of s.access.requests[0].items.entries()){
    if(scenario==='Pending approval')break
    if(scenario==='Partially approved'&&index>0)break
    s=targetTransition(s,{type:'DECIDE',request:'REQ-001',dataset:item.dataset,actor:item.owner,decision:scenario==='Denied'?'Denied':'Approved'})
  }
  if(scenario==='Expired')s=targetTransition(s,{type:'EXPIRE',actor:'governance'})
  return s
}
export function restoreAccount(persona,value) {
  try{
    if(!value||typeof value.form?.purpose!=='string'||!Array.isArray(value.access?.requests))return newAccount(persona)
    const access=restoreAccess(persona,'first',JSON.stringify(value.access))
    if(access.requests.some(r=>!r.meta||!['explore','dashboard','system'].includes(r.meta.intent)))return newAccount(persona)
    return {...newAccount(persona),access:summarizeGrants(access),scope:effectiveScope(value.scope||{}),form:{...emptyForm(persona),...value.form},operation:['healthy','stale','degraded','breaking','error'].includes(value.operation)?value.operation:'healthy'}
  }catch{return newAccount(persona)}
}
export function safeRoute(raw,account) {
  const route=raw.replace(/^#/,'')||'/home'
  if(['/home','/catalogue','/my-data','/request'].includes(route))return route
  if(/^\/edp\/[^/]+$/.test(route)&&productById[route.split('/')[2]])return route
  if(/^\/asset\/[^/]+$/.test(route)&&otherAssets.some(a=>a.id===route.split('/')[2]))return route
  if(/^\/dashboard\/[^/]+$/.test(route)&&dashboards.some(a=>a.id===route.split('/')[2]))return route
  const match=route.match(/^\/(request|dip|integration)\/(REQ-\d+)$/)
  const r=match&&account.access.requests.find(r=>r.id===match[2])
  if(r&&(match[1]==='request'||(match[1]==='integration')===(r.meta.intent==='system')))return route
  return '/home'
}
export function answerForRequest(request,question) {
  if(!canUse(request))return {headline:'Access is not available',body:'This use case has no approved data. Review its status in My Data.',unsupported:true}
  const q=question.trim().toLowerCase().replace(/[?.!]+$/,'')
  if(q==='what data can i use')return {headline:'Your approved data',body:Object.entries(requestAccess(request)).map(([id,fields])=>productById[id].name+': '+fields.map(fieldName).join(', ')).join('\n')}
  if(q==='what does attendance status mean')return hasFields(request,'attendance',['attendance_status'])?{headline:'Attendance status',body:'Present, absent or partial for a school day. These synthetic definitions do not establish a full attendance trend. No cross-product analysis is executed.'}:{headline:'Attendance data is not approved for this use case',body:'Attendance status is outside your currently approved fields. Review the outstanding owner decision in My Data.',unsupported:true}
  if(q==='what does pass rate mean'&&hasFields(request,'results',['passed']))return {headline:'Pass rate definition',body:'Students meeting the pass standard ÷ students with valid final results × 100. Computing a comparison requires the full approved Results field set.'}
  const answer=answerQuestion(question)
  if(answer.unsupported)return answer
  if(!hasFields(request,'results',resultFields))return {headline:'Additional approved data is needed',body:'This calculation needs School, Subject, Education level, Academic year, Pass outcome and Result finality from Student Academic Results. Pending, denied or expired fields cannot be used.',unsupported:true}
  return answer
}
export const dipQuestions=['What data can I use?','What does attendance status mean?',...questions]
