import React, { useState } from 'react'
import { answerQuestion, dashboardRows, questions, resultsContext, schoolResults } from './resultsModel.js'

const Button = ({ children, onClick, primary=false, disabled=false }) => <button className={`button button-${primary ? 'primary' : 'secondary'}`} onClick={onClick} disabled={disabled}>{children}</button>
const Header = ({ title, subtitle }) => <div className="page-header"><div><h1>{title}</h1><p>{subtitle}</p></div></div>
const Table = ({ columns, rows }) => <div className="results-table-wrap"><table className="results-table"><thead><tr>{columns.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table></div>

export function ResultsDashboard({ screen, onBack }) {
  const [subject,setSubject]=useState(screen.prepared?'All subjects':'Mathematics')
  const [period,setPeriod]=useState(screen.prepared?'Compare years':'2026')
  const [level,setLevel]=useState('All levels')
  const [school,setSchool]=useState('All schools')
  const rows=dashboardRows(subject,level,school)
  const shown = period==='Compare years'?rows:rows.map(r=>[r[0],r[period==='2025'?1:2]])
  return <div className="page-content"><Header {...screen}/>
    {screen.prepared && <div className="trust-banner"><strong>Recommended dashboard</strong><span>All subjects · 2026 vs 2025 · authorised HQ schools. Explore the dashboard below.</span></div>}
    <div className="results-filters">{[['Subject',subject,setSubject,['All subjects','Mathematics','English','Science']],['Period',period,setPeriod,['2026','2025','Compare years']],['Level',level,setLevel,['All levels','Secondary 1','Secondary 2']],['School',school,setSchool,['All schools',...schoolResults.map(s=>s.school)]]].map(([label,value,set,options])=><label key={label}>{label}<select aria-label={label} value={value} onChange={e=>set(e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select></label>)}</div>
    <p className="body-copy">{resultsContext.definition}</p>
    <Table columns={period==='Compare years'?['School / subject','2025','2026','Change']:['School / subject',period]} rows={shown}/>
    <p className="body-copy">{resultsContext.quality} Subject summaries use equally weighted school averages.</p>
    <Button onClick={onBack}>Back</Button>
  </div>
}

export function BusinessAnswer({ screen, onNext, onBack, question, onQuestion }) {
  const [draft,setDraft]=useState('')
  const answer=answerQuestion(question || questions[0])
  const ask=q=>{if(q.trim()){onQuestion(q.trim());setDraft('')}}
  return <div className="page-content"><Header title={screen.title} subtitle={`${resultsContext.period} · ${resultsContext.scope} · Synthetic example`}/>
    {screen.briefing && <p className="body-copy">Following your Results briefing · Academic Results · Mathematics · school and level comparison. Your authorised scope stays applied.</p>}
    <div className="answer-card" aria-live="polite"><span className="eyebrow">Your question</span><p>{answer.question}</p><h2>{answer.headline}</h2><p>{answer.body}</p>
      <div className="metric-grid">{answer.metrics.map(([l,v])=><div className="metric-card" key={l}><span>{l}</span><strong>{v}</strong></div>)}</div>
      {answer.rows && <Table columns={answer.columns||['School','2025','2026','Change']} rows={answer.rows}/>}
    </div>
    <p className="body-copy">{resultsContext.quality}</p>
    <form className="question-compose" onSubmit={e=>{e.preventDefault();ask(draft)}}><label htmlFor="follow-up">Ask a follow-up</label><div><input id="follow-up" value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Ask about these Results…"/><button className="button button-primary" disabled={!draft.trim()}>Ask follow-up</button></div></form>
    <details className="secondary-disclosure"><summary>Example follow-ups</summary><div className="suggestion-row">{questions.map(q=><button key={q} onClick={()=>ask(q)}>{q}</button>)}</div></details>
    <div className="action-row"><Button onClick={onBack}>Back</Button></div>
  </div>
}

export function Briefing({ screen, onNext, onQuestion }) {
  const [draft,setDraft]=useState('')
  const explore=q=>{onQuestion(q);onNext()}
  return <div className="page-content briefing-page"><Header {...screen}/>
    <div className="badge-row"><span className="badge badge-success">Simulated refresh · 6:04 PM</span><span className="badge badge-neutral">Synthetic prototype</span></div>
    <section className="answer-card briefing-card"><div className="eyebrow">{screen.audience==='analyst'?'Three changes since your last analysis':'What matters for your leadership briefing'}</div>
      <h2>Mathematics needs attention; English is improving.</h2>
      <div className="briefing-development"><strong>Mathematics pass rates declined in 8 schools.</strong><p>School A shows the largest change: 84% to 76% (−8 pp).</p></div>
      <div className="briefing-development"><strong>Most of the decline is concentrated in Secondary 2.</strong><p>Review cohort differences before drawing conclusions about causes.</p></div>
      <div className="briefing-development"><strong>English improved across the eight current schools.</strong><p>The comparable school average rose 3 pp, from 85% to 88%.</p></div>
      <p className="briefing-caveat">Two delayed submissions are excluded. Findings cover your authorised schools, with 2026 compared with 2025.</p>
      <div className="briefing-actions">{screen.audience==='analyst'?<Button primary onClick={onNext}>Open reproducible analysis</Button>:<><Button primary onClick={()=>explore('Which levels account for the decline?')}>Explore drivers</Button></>}</div>
    </section>

    {screen.audience==='business' && <details className="secondary-disclosure"><summary>Ask about this briefing</summary><form className="question-compose" onSubmit={e=>{e.preventDefault();if(draft.trim())explore(draft.trim())}}><label htmlFor="briefing-follow-up">Explore this briefing</label><div><input id="briefing-follow-up" value={draft} onChange={e=>setDraft(e.target.value)} placeholder="What is driving School A?"/><button className="button button-secondary" disabled={!draft.trim()}>Ask follow-up</button></div><div className="suggestion-row"><button type="button" onClick={()=>explore('Compare subjects')}>Compare subjects</button><button type="button" onClick={()=>explore('What is driving School A?')}>What is driving School A?</button></div></form></details>}
  </div>
}

export function PartnerOutcome({ screen, onNext }) {
  return <div className="page-content briefing-page"><Header {...screen}/><div className="answer-card"><span className="badge badge-success">Approved aggregate outcome</span><h2>Participants improved by 4 pp; the comparison cohort improved by 1 pp.</h2><p>This descriptive comparison is ready inside MOE boundaries. It does not establish that the programme caused the difference.</p><p>Matched 2025–2026 cohorts · minimum group size 10 · synthetic example. Direct identifiers and raw marks remain within MOE.</p><details className="secondary-disclosure"><summary>Explore approved comparison</summary><Button onClick={onNext}>{screen.primaryLabel}</Button></details></div></div>
}

export function ContractTests({ screen, onBack }) {
  const [scenario,setScenario]=useState('Current response')
  const outcomes={'Current response':'Pass — contracted fields and current freshness accepted.','Delayed ≤24 hours':'Pass — last-known-good response returned with a visible stale warning.','Delayed >24 hours':'Blocked — no valid result within freshness contract.','Expired entitlement':'Denied — 403; cached student results must not be served.','Breaking schema change':'Blocked — major version migration and consumer approval required.'}
  return <div className="page-content"><Header {...screen} subtitle={`${screen.delivery||'Contract'} · interactive simulation · no live API calls`}/><label className="form-field">Response scenario<select value={scenario} onChange={e=>setScenario(e.target.value)}>{Object.keys(outcomes).map(s=><option key={s}>{s}</option>)}</select></label><div className="panel-card" role="status">{outcomes[scenario]}</div><div className="action-row"><Button onClick={onBack}>Back</Button></div></div>
}
