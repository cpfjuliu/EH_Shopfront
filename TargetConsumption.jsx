import React,{useEffect,useState,useRef} from 'react'
import {Btn,Heading,Notice,Facts,DataTable,ApprovedScope,Tag} from './TargetUI.jsx'
import {productById,requestAccess,canUse,answerForRequest,dipQuestions,requestStatus,hasFields,dashboards} from './targetModel.js'
import {dashboardRows} from './resultsModel.js'

export function UseGate({request,navigate,children}){
  if(!canUse(request))return <><Heading title="Access is not available">Your request and intended activity are retained.</Heading><Notice>{requestStatus(request)==='Expired'?'This access has expired. Request renewal before using data.':'The required owner decisions have not granted usable data yet.'}</Notice><Btn primary onClick={()=>navigate(`/request/${request.id}`)}>Review access status</Btn></>
  return children
}
export function DipLite({request,navigate,evidence}){
  const [question,setQuestion]=useState(''),[answer,setAnswer]=useState(null),[busy,setBusy]=useState(false),timer=useRef()
  useEffect(()=>()=>clearTimeout(timer.current),[])
  const ask=e=>{e.preventDefault();if(!question.trim()||busy)return;setBusy(true);setAnswer(null);timer.current=setTimeout(()=>{setAnswer(answerForRequest(request,question));setBusy(false)},250)}
  const ids=Object.keys(requestAccess(request))
  return <UseGate request={request} navigate={navigate}><Heading eyebrow="Approved data workspace" title="DIP Lite" action={<button className="text-button" onClick={()=>navigate(`/request/${request.id}`)}>View access</button>}>{request.reason}</Heading>
    <div className="workspace-context"><strong>In scope</strong><span>{ids.map(id=>productById[id].name).join(' · ')}</span><details><summary>Approved fields and pending data</summary><ApprovedScope request={request}/></details></div>
    {ids.includes('results')&&<Notice>{productById.results.caveat}</Notice>}
    <section className="dip-workspace"><h2>Work with your approved data</h2><p>Ask a supported question or inspect your data scope. Responses use fixed synthetic examples.</p>
      <form onSubmit={ask}><label htmlFor="dip-question">Your question</label><div className="question-row"><textarea id="dip-question" value={question} onChange={e=>setQuestion(e.target.value)} maxLength={1000} required placeholder="For example: Compare subjects"/><Btn primary type="submit" disabled={busy||!question.trim()}>{busy?'Preparing…':'Ask'}</Btn></div></form>
      <details><summary>Supported example questions</summary><div className="example-list">{dipQuestions.map(q=><button key={q} onClick={()=>setQuestion(q)}>{q}</button>)}</div></details>
      {busy&&<p role="status">Preparing the synthetic answer within your approved scope…</p>}
      {answer&&<article className="dip-answer" aria-live="polite"><h2>{answer.headline}</h2><p className="preserve-lines">{answer.body}</p>{answer.rows&&<DataTable caption="Synthetic comparison" columns={answer.columns||['School','2025','2026','Change']} rows={answer.rows}/>}<p className="muted">This prototype does not run arbitrary queries or infer causes.</p></article>}
    </section>
    <div className="evidence-actions"><button className="text-button" onClick={()=>evidence(ids.includes('results')?'results':ids[0],ids)}>Evidence & methodology</button></div>
  </UseGate>
}

export function Integration({request,operation,navigate,evidence}){
  const approved=requestAccess(request),f=request.meta
  const ready=canUse(request)
  const blocked=['breaking','error'].includes(operation)
  const operationCopy={healthy:['Healthy','The last synthetic update completed successfully.'],stale:['Stale data','The source update is delayed. Last-known-good demonstration data is 20 hours old; do not treat it as current. The example policy stops delivery after 24 hours.'],degraded:['Degraded data','Two Results submissions are delayed. Delivery includes current schools only; missing values are not zero.'],breaking:['Action required','A proposed major schema change would rename a contracted field. The simulated new version is blocked pending consumer review; the approved current version is unchanged.'],error:['Delivery failed','The synthetic consumer destination could not be reached. No successful update is recorded for this attempt. Review the configured destination with the data owner before retrying.']}
  return <UseGate request={request} navigate={navigate}><Heading eyebrow="Approved system consumption" title={f.systemName||'Integration details'} action={<button className="text-button" onClick={()=>navigate(`/request/${request.id}`)}>View access</button>}>{request.reason}</Heading>
    <section className="integration-status"><Tag>{operationCopy[operation][0]}</Tag><h2>{operation==='healthy'?'No action required':operationCopy[operation][0]}</h2><p>{operationCopy[operation][1]}</p><small>All delivery and connectivity states below are simulated.</small></section>
    <div className="target-two-col"><section><h2>{f.method==='s3'?'S3 file delivery':'Direct VPC connection'}</h2><Facts rows={[
      ['Consumer',f.systemName],['Fulfilment',f.method==='s3'?'Approved files placed in the designated consumer bucket for pickup':'AWS consumer with declared network and access prerequisites'],
      ...(f.method==='s3'?[['Destination',f.bucket],['Delivery cadence',f.frequency==='ad-hoc'?'Ad hoc · one-time or manually triggered':`${f.cadence} · recurring file delivery`]]:[['Prerequisites','AWS consumer and network/access readiness declared in the request. No live connectivity checked.']]),
      ['Last successful update',operation==='error'?'Not available for this simulated attempt':operation==='stale'?'20 hours ago · simulated':'17 Oct 2026, 18:15 SGT · simulated'],
      ['Freshness expectation','Source cadence remains daily; a delivery route cannot make the source fresher.'],
    ]}/><details><summary>{f.method==='s3'?'Delivery guide':'Connection guide'}</summary><ol>{(f.method==='s3'?['Confirm the designated bucket and workload permission with the owner.','For regular delivery, Edu Hub periodically places the approved file in that bucket.','Validate version, included fields and freshness before pickup.','For ad hoc provision, an owner-coordinated file drop is simulated; no upload is performed here.']:['Confirm the consuming system is on AWS.','Agree network routing and access prerequisites with the owner.','Use the approved version and fields only.','Connection identifiers are supplied through approved setup, not fabricated in this prototype.']).map(t=><li key={t}>{t}</li>)}</ol><p>No endpoints, credentials or infrastructure are provisioned.</p></details></section>
      <section><h2>Approved data</h2><ApprovedScope request={request} technical/>{Object.keys(approved).map(id=><p key={id}>{productById[id].name} · <strong>{productById[id].version}</strong> · {productById[id].freshness}</p>)}<p className="muted">Common linking references are included only where approved. A joined extract requires each relevant product's linking field; approved standalone portions remain usable.</p></section></div>
    <section className="target-section"><h2>Changes and known issues</h2>{blocked?<Notice error>{operationCopy[operation][1]}</Notice>:<p>No material upcoming compatibility change in the selected demonstration state.</p>}{Object.keys(approved).includes('results')&&<Notice>{productById.results.caveat}</Notice>}<p>Reuse the EDP definitions and validation rules rather than recreating them in the consuming system. Contact the named owner through your access request for unresolved scope or freshness needs.</p></section>
    {ready&&<div className="evidence-actions"><button className="text-button" onClick={()=>evidence(Object.keys(approved)[0],Object.keys(approved))}>Evidence & methodology</button></div>}
  </UseGate>
}

export function EmbeddedDashboard({id,account,navigate,send,evidence}){
  const d=dashboards.find(d=>d.id===id),p=productById[d.product]
  const permitted=account.access.requests.find(r=>r.meta.intent==='dashboard'&&hasFields(r,d.product,d.fields))
  const [subject,setSubject]=useState('All subjects')
  return <><Heading eyebrow="DVP dashboard · embedded in Edu Hub" title={d.name}>{d.description}</Heading><Facts rows={[
    ['Owner',p.owner],['Underlying EDP',p.name],['Last updated','17 Oct 2026, 18:03 SGT · simulated'],
  ]}/><Notice>{p.caveat}</Notice>{!permitted?<section className="target-section"><h2>Approval required to view this dashboard</h2><p>Dashboard scope must be approved for reporting use. Discovery does not grant access to its data.</p><Btn primary onClick={()=>{send({type:'ADD_SCOPE',scope:{[d.product]:d.fields},form:{intent:'dashboard',destination:`/dashboard/${id}`}});navigate('/request')}}>Request dashboard data</Btn></section>:<section className="embedded-dashboard"><div className="section-line"><h2>{id==='results'?'Subject performance':'Attendance snapshot'}</h2><Tag>Approved reporting use</Tag></div>{id==='results'?<><label className="compact-field">Subject<select value={subject} onChange={e=>setSubject(e.target.value)}>{['All subjects','Mathematics','English','Science'].map(s=><option key={s}>{s}</option>)}</select></label><DataTable caption="2025–2026 comparable schools · synthetic" columns={[subject==='All subjects'?'Subject':'School','2025','2026','Change']} rows={dashboardRows(subject,'All levels','All schools')}/><p>Equal synthetic school/cohort weights. No causal inference.</p></>:<><p>Small synthetic sample, not an attendance rate or a whole-school trend.</p><DataTable caption="Approved attendance fields only" columns={['Attendance date','Attendance status']} rows={p.sampleRows.map(row=>[row[1],row[2]])}/></>}</section>}<button className="text-button" onClick={()=>evidence(d.product)}>Evidence & methodology</button></>
}
