import { dataProducts } from './mockData.js'

export const resultFields=['school_code','subject','level','academic_year','passed','result_status']
export function requestDatasets(persona) {
  if(persona==='partner') return [{id:'results',name:'Student Academic Results',owner:dataProducts.results.owner,fields:['participant_token','level','results_band','aggregate_comparison'],description:'Approved project package. No raw marks or direct identifiers.'}]
  return Object.values(dataProducts).map(p=>({id:p.id,name:p.name,owner:p.owner,fields:p.fields.map(f=>f[0]),description:p.description}))
}
export function defaultSelection(persona) {
  return persona==='partner'?{results:['participant_token','level','results_band','aggregate_comparison']}:{results:persona==='system'?[...resultFields,'student_id']:resultFields}
}
export function createAccess(persona,scenario='returning') {
  return {persona,requests:[],grants:scenario==='returning'?Object.fromEntries(requestDatasets(persona).filter(d=>['results','identity'].includes(d.id)).map(d=>[d.id,d.fields])):{},nextId:1}
}
export function restoreAccess(persona,scenario,raw) {
  if(!raw)return createAccess(persona,scenario)
  try {
    const state=JSON.parse(raw),datasets=requestDatasets(persona)
    if(state.persona!==persona||!Array.isArray(state.requests)||!Number.isInteger(state.nextId)||state.nextId<1||!state.grants||Array.isArray(state.grants))throw new Error('Invalid saved access')
    for(const [id,fields] of Object.entries(state.grants))if(!Array.isArray(fields)||!datasets.some(d=>d.id===id&&fields.every(f=>d.fields.includes(f))))throw new Error('Invalid saved fields')
    for(const request of state.requests) {
      if(typeof request.id!=='string'||typeof request.reason!=='string'||!Array.isArray(request.items))throw new Error('Invalid saved request')
      for(const item of request.items)if(!Array.isArray(item.fields)||!['Pending','Approved','Denied','Expired'].includes(item.status)||!datasets.some(d=>d.id===item.dataset&&d.owner===item.owner&&item.fields.every(f=>d.fields.includes(f))))throw new Error('Invalid saved decision')
    }
    return state
  }catch{return createAccess(persona,'first')}
}
export function approved(access,dataset,fields=[]) {
  return Boolean(access.grants[dataset]?.length) && fields.every(field=>access.grants[dataset].includes(field))
}
export function hasRequirements(access,requirements) {
  return Object.entries(requirements||{}).every(([id,fields])=>approved(access,id,fields))
}
export function accessTransition(state,action) {
  if(action.persona!==state.persona)return state
  if(action.type==='SUBMIT') {
    if(typeof action.reason!=='string'||!action.reason.trim())return state
    const items=requestDatasets(state.persona).flatMap(d=>{
      const fields=d.fields.filter(f=>action.selection?.[d.id]?.includes(f)&&!state.grants[d.id]?.includes(f))
      return fields.length?[{dataset:d.id,name:d.name,owner:d.owner,fields,status:'Pending'}]:[]
    })
    if(!items.length)return state
    return {...state,nextId:state.nextId+1,requests:[...state.requests,{id:`REQ-${String(state.nextId).padStart(3,'0')}`,reason:action.reason.trim().slice(0,1000),items}]}
  }
  if(action.type==='DECIDE') {
    const request=state.requests.find(r=>r.id===action.request)
    const item=request?.items.find(i=>i.dataset===action.dataset)
    if(!item||item.status!=='Pending'||action.actor!==item.owner||!['Approved','Denied'].includes(action.decision))return state
    const grants=action.decision==='Approved'?{...state.grants,[item.dataset]:[...new Set([...(state.grants[item.dataset]||[]),...item.fields])]}:state.grants
    return {...state,grants,requests:state.requests.map(r=>r.id!==request.id?r:{...r,items:r.items.map(i=>i!==item?i:{...i,status:action.decision})})}
  }
  if(action.type==='EXPIRE'&&action.actor==='governance')return {...state,grants:{},requests:state.requests.map(r=>({...r,items:r.items.map(i=>i.status==='Approved'?{...i,status:'Expired'}:i)}))}
  return state
}
