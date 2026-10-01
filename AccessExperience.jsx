import React,{createContext,useContext,useState} from 'react'
import {dataProducts} from './mockData.js'
import {approved,hasRequirements,requestDatasets,defaultSelection,resultFields} from './accessModel.js'
import {answerQuestion,questions,dashboardRows,resultsContext} from './resultsModel.js'

export const AccessContext=createContext(null)
export const useAccess=()=>useContext(AccessContext)
const Btn=({children,onClick,disabled=false,primary=false})=><button className={`button button-${primary?'primary':'secondary'}`} disabled={disabled} onClick={onClick}>{children}</button>
const Heading=({title,children})=><div className="page-header"><div><h1>{title}</h1><p>{children}</p></div></div>

export function AccessGate({requirements,children}) {
  const {access,navigate}=useAccess()
  if(hasRequirements(access,requirements))return children
  return <div className="page-content"><Heading title="Approval needed before use">This activity uses protected data. Dataset certification and your field access are separate checks.</Heading><div className="panel-card" role="status"><h2>Request the fields you need</h2>{Object.entries(requirements).map(([id,fields])=><p key={id}><strong>{dataProducts[id]?.name}</strong><br/>{fields.join(', ')} · {approved(access,id,fields)?'Approved':'Access required'}</p>)}<p>Pending, denied or expired fields are not available to chat, dashboards or analytical tools.</p><Btn primary onClick={()=>navigate('access')}>Request or track access</Btn></div></div>
}

export function AccessHub({onBack,onNext,screen,selectedDataset='results'}) {
  const {access,send,config}=useAccess()
  const datasets=requestDatasets(config.persona)
  const [selection,setSelection]=useState(()=>selectedDataset==='results'?defaultSelection(config.persona):{[selectedDataset]:[]})
  const [reason,setReason]=useState('')
  const [submitted,setSubmitted]=useState(false)
  const count=Object.entries(selection).reduce((n,[id,fields])=>n+fields.filter(f=>!access.grants[id]?.includes(f)).length,0)
  const toggle=(id,field)=>{setSubmitted(false);setSelection(s=>({...s,[id]:s[id]?.includes(field)?s[id].filter(f=>f!==field):[...(s[id]||[]),field]}))}
  return <div className="page-content"><Heading title="Data access">One reason, one request. Each dataset owner reviews their fields; approval provisions access immediately.</Heading>
    <div className="access-process" aria-label="Access lifecycle"><span>Discover</span><span>Request fields</span><span>Owner approval</span><span>Access & use</span></div>
    <section className="panel-card"><h2>Your approved access</h2>{Object.keys(access.grants).length?Object.entries(access.grants).map(([id,fields])=><p key={id}><strong>{datasets.find(d=>d.id===id)?.name}</strong> · <span className="badge badge-success">Ready to use</span><br/>{fields.join(', ')}</p>):<p>No approved fields yet. Dataset descriptions and schemas remain discoverable.</p>}<p>Approved purpose applies to every tool. All approvals in this demonstration are simulated.</p></section>
    <form className="panel-card access-request" onSubmit={e=>{e.preventDefault();if(reason.trim()&&count){send({type:'SUBMIT',reason,selection});setSubmitted(true);setReason('')}}}>
      <h2>Request dataset fields</h2><label className="form-field">Reason<textarea required maxLength={1000} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Explain why you need these fields…"/></label>
      <div className="request-datasets">{datasets.map(d=><fieldset key={d.id}><legend>{d.name}</legend><p>Owner: {d.owner}</p><p>{d.description}</p>{d.fields.map(field=><label className="field-choice" key={field}><input type="checkbox" aria-label={`${d.name}: ${field}`} checked={Boolean(access.grants[d.id]?.includes(field)||selection[d.id]?.includes(field))} disabled={Boolean(access.grants[d.id]?.includes(field))} onChange={()=>toggle(d.id,field)}/><span>{field}</span>{access.grants[d.id]?.includes(field)&&<small>Approved</small>}</label>)}</fieldset>)}</div>
      <button className="button button-primary" disabled={!reason.trim()||!count}>Submit common request</button>
      {submitted&&<p role="status">Request submitted to the respective dataset owners. Track their decisions below.</p>}
    </form>
    <section className="panel-card"><h2>Request status</h2>{!access.requests.length?<p>No requests submitted in this session.</p>:access.requests.map(r=><article className="request-status" key={r.id}><h3>{r.id} · {r.reason}</h3>{r.items.map(i=><div key={i.dataset} data-owner-status={i.status}><strong>{i.name}</strong><p>{i.fields.join(', ')}</p><p>{i.owner} · <span className={`badge badge-${i.status==='Approved'?'success':'warning'}`}>{i.status}</span>{i.status==='Approved'?' · Provisioned immediately':i.status==='Denied'?' · No access granted; revise the reason or fields and submit a new request':''}</p></div>)}</article>)}</section>
    <div className="action-row"><Btn onClick={onBack}>Back</Btn>{screen.primaryLabel?<Btn primary disabled={!hasRequirements(access,config.requiredAccess)} onClick={onNext}>{screen.primaryLabel}</Btn>:<Btn onClick={onBack}>Continue your journey</Btn>}</div>
  </div>
}

export function OwnerApprovals() {
  const {access,send}=useAccess()
  return <section className="panel-card owner-approvals"><h2>Dataset owner approvals</h2><p>Demo backstage: act as the named owner to review only their part of the common request.</p>{!access.requests.length&&<p>No new requests. Use the first-time user scenario and submit a request from Data access.</p>}{access.requests.map(r=><article key={r.id}><h3>{r.id} · {r.reason}</h3>{r.items.map(i=><div className="owner-decision" key={i.dataset}><strong>{i.name} · {i.owner}</strong><p>{i.fields.join(', ')}</p><span className="badge">{i.status}</span>{i.status==='Pending'&&<div className="action-row"><Btn primary onClick={()=>send({type:'DECIDE',request:r.id,dataset:i.dataset,actor:i.owner,decision:'Approved'})}>Approve {i.name}</Btn><Btn onClick={()=>send({type:'DECIDE',request:r.id,dataset:i.dataset,actor:i.owner,decision:'Denied'})}>Deny {i.name}</Btn></div>}</div>)}</article>)}<Btn disabled={!Object.keys(access.grants).length} onClick={()=>send({type:'EXPIRE',actor:'governance'})}>Expire current access</Btn></section>
}

export function DatasetDiscovery({onNext,onSelectDataset}) {
  const {access,navigate}=useAccess()
  const [query,setQuery]=useState('')
  const products=Object.values(dataProducts).filter(p=>`${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="page-content"><Heading title="Discover datasets & dashboards">Choose your dataset, understand its scope, then request fields or use your approved access.</Heading><div className="wide-search"><input aria-label="Search datasets and dashboards" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search Student Academic Results…"/></div><h2>Datasets</h2><div className="asset-card-grid">{products.map(p=><button className="asset-card" key={p.id} onClick={()=>{onSelectDataset(p.id);onNext()}}><span className="asset-type">Dataset · Certified</span><strong>{p.name}</strong><p>{p.description}</p><p>{p.owner} · {p.freshness}</p><span className="badge">{approved(access,p.id)?'Approved fields available':'Request access'}</span></button>)}</div>{!products.length&&<p>No matching datasets.</p>}<h2>Dashboards</h2>{(!query||'student academic results dashboard'.includes(query.toLowerCase()))&&<button className="asset-card" onClick={()=>navigate('results-dashboard')}><span className="asset-type">Dashboard</span><strong>Student Academic Results dashboard</strong><p>Uses approved Academic Results fields. Access is checked before any data appears.</p></button>}</div>
}

export function DatasetDetail({selectedDataset,onNext,onBack}) {
  const {access,navigate}=useAccess(), p=dataProducts[selectedDataset]
  return <div className="page-content"><Heading title={p.name}>{p.description}</Heading><div className="badge-row"><span className="badge badge-success">Certified dataset</span><span className="badge">{approved(access,p.id)?'Approved fields available':'Access required'}</span></div><div className="panel-card"><p><strong>Owner:</strong> {p.owner} · <strong>Freshness:</strong> {p.freshness}</p><p>{p.definition}</p><p><strong>Permitted use:</strong> {p.allowedUse}</p><p><strong>Quality:</strong> {p.quality}</p><h2>Dataset fields</h2>{p.fields.map(([name,type,description])=><div className="dataset-field" key={name}><strong>{name}</strong><span>{type} · {description}</span><span>{access.grants[p.id]?.includes(name)?'Approved':'Access required'}</span></div>)}</div><div className="action-row"><Btn onClick={onBack}>Back</Btn><Btn onClick={()=>navigate('access')}>Request dataset fields</Btn><Btn primary disabled={!approved(access,p.id)} onClick={onNext}>Use approved dataset</Btn></div></div>
}

export function RecommendedDatasets({screen,onNext,onBack,onSelectDataset}) {
  const {access,navigate}=useAccess()
  return <div className="page-content"><Heading title={screen.title}>Recommended for your Academic Results analysis. Review the datasets and follow the access steps.</Heading><div className="asset-card-grid">{['results','identity'].map(id=><div className="asset-card" key={id}><span className="asset-type">Dataset</span><strong>{dataProducts[id].name}</strong><p>{id==='results'?'Subject, school, level and yearly pass results.':'Governed school and enrolment context when your analysis needs it.'}</p><p>Owner: {dataProducts[id].owner}</p><span className="badge">{approved(access,id)?'Approved fields available':'Request required'}</span></div>)}<div className="asset-card"><span className="asset-type">Dashboard</span><strong>Student Academic Results dashboard</strong><p>Explore approved subject, school and level comparisons.</p><Btn onClick={()=>navigate('results-dashboard')}>Open recommended dashboard</Btn></div></div><ol className="recommended-steps"><li>Review the recommended datasets and choose the fields you need.</li><li>Give a reason and submit one request to the respective owners.</li><li>After approval, use AI-assisted Chat or the analytical tool. Keep prompting within your approved data until you have the answer you need.</li></ol><div className="action-row"><Btn onClick={onBack}>Back</Btn><Btn onClick={()=>navigate('access')}>Request recommended fields</Btn><Btn primary disabled={!approved(access,'results')} onClick={()=>{onSelectDataset('results');onNext()}}>Analyse approved data</Btn></div></div>
}

export function DatasetTools({selectedDataset,onSelectDataset,onBack}) {
  const {access,navigate,config}=useAccess()
  const [tab,setTab]=useState('AI-assisted Chat'),[draft,setDraft]=useState(''),[messages,setMessages]=useState([]),[subject,setSubject]=useState('Mathematics')
  const choices=requestDatasets(config.persona).filter(d=>approved(access,d.id))
  const dataset=choices.find(d=>d.id===selectedDataset)
  const canAnalyse=approved(access,'results',resultFields)&&dataset?.id==='results'
  const ask=e=>{
    e.preventDefault();if(!draft.trim()||!dataset)return
    const q=draft.trim(),p=dataProducts[dataset.id]
    let text
    if(/definition|what.*(dataset|contain)|describe|understand/i.test(q))text=p.definition
    else if(/fields|columns|schema/i.test(q))text='Your approved fields: '+access.grants[dataset.id].join(', ')
    else if(/owner|fresh|quality/i.test(q))text=`Owner: ${p.owner}. Freshness: ${p.freshness}. Quality: ${p.quality}.`
    else if(canAnalyse){const answer=answerQuestion(q);text=`${answer.headline}. ${answer.body}`}
    else text='This question needs fields or a calculation outside the current approved dataset. Request the required fields first. This prototype supports dataset explanations and the supplied Academic Results examples.'
    setMessages(m=>[...m,{question:q,text,dataset:dataset.id}]);setDraft('')
  }
  return <div className="page-content"><Heading title="Use your approved data">Select an approved dataset and a tool. Chat stays within that dataset and its authorised fields.</Heading><label className="form-field">Active dataset<select aria-label="Active dataset" value={dataset?.id||''} onChange={e=>{onSelectDataset(e.target.value);setMessages([])}}><option value="" disabled>Select an approved dataset</option>{choices.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label>{!dataset?<div className="panel-card" role="status"><p>No approved access for this selected dataset.</p><Btn onClick={()=>navigate('access')}>Request or track access</Btn></div>:<><p className="approved-fields"><strong>Approved fields:</strong> {access.grants[dataset.id].join(', ')}</p><div className="tabs">{['AI-assisted Chat','Analytical tool'].map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</div>{tab==='AI-assisted Chat'?<div className="panel-card dataset-chat"><h2>Ask about {dataset.name}</h2><p>Ask about definitions, approved fields or the data you can use. Synthetic example calculations only; arbitrary queries are not executed.</p>{messages.filter(m=>m.dataset===dataset.id).map((m,i)=><article className="dataset-message" key={i}><strong>{m.question}</strong><p>{m.text}</p><small>Source: {dataset.name} · approved fields only · {resultsContext.period}</small></article>)}<form className="question-compose" onSubmit={ask}><label htmlFor="dataset-question">Ask about your dataset</label><div><input id="dataset-question" value={draft} onChange={e=>setDraft(e.target.value)}/><button className="button button-primary" disabled={!draft.trim()}>Send question</button></div></form><div className="suggestion-row">{['What does this dataset contain?','Which fields can I use?',...(canAnalyse?[questions[0],questions[1]]:[])].map(q=><button key={q} onClick={()=>setDraft(q)}>{q}</button>)}</div></div>:<div className="panel-card"><h2>Academic Results analysis</h2>{canAnalyse?<><label className="form-field">Subject<select aria-label="Analysis subject" value={subject} onChange={e=>setSubject(e.target.value)}>{['Mathematics','English','Science'].map(s=><option key={s}>{s}</option>)}</select></label><div className="results-table-wrap"><table className="results-table"><thead><tr>{['School','2025','2026','Change'].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{dashboardRows(subject,'All levels','All schools').map(row=><tr key={row[0]}>{row.map((v,i)=><td key={i}>{v}</td>)}</tr>)}</tbody></table></div><p>{resultsContext.quality} {resultsContext.methodology}</p></>:<p role="status">The sample analysis requires approved Academic Results fields: {resultFields.join(', ')}. Dataset explanations remain available in chat.</p>}</div>}</>}<div className="action-row"><Btn onClick={onBack}>Back</Btn><Btn onClick={()=>navigate('access')}>Manage dataset access</Btn></div></div>
}
