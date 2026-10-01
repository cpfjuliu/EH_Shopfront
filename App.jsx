import { AccessContext, useAccess, AccessGate, AccessHub, OwnerApprovals, DatasetDiscovery, DatasetDetail, RecommendedDatasets, DatasetTools } from './AccessExperience.jsx'
import { accessTransition, restoreAccess } from './accessModel.js'
import React, { useEffect, useRef, useState } from 'react'
import { personaMeta } from './experienceFlows.js'
import { chartData, dataProducts, governanceBackstage, userProfiles } from './mockData.js'

import { Briefing, BusinessAnswer, ContractTests, PartnerOutcome, ResultsDashboard, ResultsEvidence } from './ResultsExperience.jsx'
import { resultsContext, reproducibleSQL } from './resultsModel.js'

import { personas, stars, getExperience, hasCapability, routeHash, parseRoute, createJourney, transition } from './experienceCapabilities.js'

function Icon({ name, size = 16 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    home: <><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></>,
    data: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></>,
    chart: <><path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="M22 19H2"/></>,
    folder: <path d="M3 5h6l2 2h10v12H3z"/>,
    file: <><path d="M5 3h10l4 4v14H5z"/><path d="M15 3v5h5"/></>,
    code: <><path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 5-4 14"/></>,
    users: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-4 2.7-6 6-6s6 2 6 6"/><path d="M14 15c3.5 0 6 1.6 6 5"/></>,
    search: <><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></>,
    bell: <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-.9.8-1.8 1.2-1.8 2.8"/><path d="M12 17h.01"/></>,
    spark: <><path d="M4 15l4-4 3 3 6-7 3 3"/><path d="M18 7h2v2"/></>,
    shield: <><path d="M12 3 5 6v5c0 5 3.5 8.5 7 10 3.5-1.5 7-5 7-10V6z"/><path d="m9 12 2 2 4-4"/></>,
    chevron: <path d="m9 6 6 6-6 6"/>,
    close: <><path d="M6 6l12 12"/><path d="M18 6 6 18"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    refresh: <><path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M6.1 9A7 7 0 0 1 18 6l2 2"/><path d="M17.9 15A7 7 0 0 1 6 18l-2-2"/></>,
    logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M13 3h7v18h-7"/></>,
  }
  return <svg {...common}>{paths[name] || paths.file}</svg>
}

function statusTone(value = '') {
  const v = String(value).toLowerCase()
  if (/(warning|pending|provisional|approval|delayed|review|164|45 days)/.test(v)) return 'warning'
  if (/(healthy|ready|granted|approved|pass|current|enabled|included|verified|certified|supported|none|complete|stable|on|allowed|available|monitored|monitoring)/.test(v)) return 'success'
  if (/(excluded|disabled|restricted|sensitive)/.test(v)) return 'muted'
  if (/(recommended|interpreted|governed|sdp|2 sdps)/.test(v)) return 'purple'
  return 'neutral'
}

function Badge({ children, tone }) {
  return <span className={`badge badge-${tone || statusTone(children)}`}>{children}</span>
}

function Button({ children, onClick, kind = 'secondary', disabled = false, icon }) {
  return <button className={`button button-${kind}`} onClick={onClick} disabled={disabled || !onClick} title={!onClick ? 'Not available in this prototype' : undefined}>{icon ? <Icon name={icon} size={14}/> : null}{children}</button>
}

function Login({ onLogin }) {
  const [loading, setLoading] = useState(false)
  const signIn = () => {
    setLoading(true)
    setTimeout(() => onLogin(), 700)
  }
  return (
    <div className="login-page">
      <div className="login-brand"><div className="brand-mark">EH</div><span>Edu Hub</span></div>
      <div className="login-shell">
        <div className="login-panel">
          <div className="login-kicker">MOE DATA PLATFORM</div>
          <h1>One place to discover, access and use trusted MOE data.</h1>
          <p>Sign in with your MOE identity. Edu Hub tailors the experience to your role, permissions and approved context.</p>
          <Button kind="primary" onClick={signIn} disabled={loading}>{loading ? 'Signing in…' : 'Continue with MOE SSO'}</Button>
          <div className="login-footnote"><Icon name="shield" size={14}/>Access remains subject to MOE data governance and security controls.</div>
        </div>
        <div className="login-visual" aria-hidden="true">
          <div className="visual-stack">
            <div className="visual-row"><span>Student Academic Results</span><Badge tone="warning">2 delayed submissions</Badge></div>
            <div className="visual-row"><span>Student Identity</span><Badge tone="success">Healthy</Badge></div>
            <div className="visual-row"><span>Subject pass rate v1</span><Badge tone="purple">Governed</Badge></div>
          </div>
          <div className="visual-answer">
            <div className="visual-spark">✦</div>
            <strong>Trust travels with your work</strong>
            <span>Definitions, quality and permitted use stay attached to each experience.</span>
          </div>
        </div>
      </div>
      <div className="login-environment">Prototype environment · No production data</div>
    </div>
  )
}

function Sidebar({ config, route, onNavigate }) {
  return <aside className="sidebar"><nav className="nav-group" aria-label="Experience navigation">
    {config.navigation.map(item=><button key={item.route} aria-label={item.label} title={item.label} className={`nav-item ${route===item.route?'active':''}`} onClick={()=>onNavigate(item.route)}><span className="nav-icon"><Icon name={item.icon}/></span><span>{item.label}</span></button>)}
  </nav><div className="sidebar-bottom"><button className="nav-item" aria-label="Help & scope" title="Help & scope" onClick={()=>onNavigate('help')}><span className="nav-icon"><Icon name="help"/></span><span>Help & scope</span></button></div></aside>
}

function Topbar({ config, onSearch, onNavigate, onLogout }) {
  const profile=userProfiles[config.persona]
  const [open,setOpen]=useState(false)
  return <header className="topbar"><div className="brand"><div className="brand-mark">EH</div><span>Edu Hub</span></div>
    <button className="global-search" aria-label="Search this experience" onClick={onSearch}><Icon name="search"/><span>{config.searchPlaceholder}</span><kbd>Ctrl K</kbd></button>
    <div className="top-actions"><button className="icon-button" aria-label="Help" onClick={()=>onNavigate('help')}><Icon name="help"/></button>
      <div className="notification-wrap"><button className="icon-button notification-button" aria-label="Notifications" aria-expanded={open} onClick={()=>setOpen(v=>!v)}><Icon name="bell"/><span className="notification-dot">{config.notifications.length}</span></button>
      {open && <div className="notification-panel"><div className="notification-head"><strong>Notifications</strong></div>{config.notifications.map(item=><button className="notification-item" key={item.title} onClick={()=>{setOpen(false);onNavigate(item.route)}}><span className="notification-icon warning">!</span><span><strong>{item.title}</strong><small>{item.copy}</small></span></button>)}</div>}</div>
      <div className="profile-block"><div className="avatar">{profile.initials}</div><div className="profile-copy"><strong>{profile.name}</strong><span>{profile.role}</span></div></div><button className="icon-button" aria-label="Sign out" onClick={onLogout}><Icon name="logout"/></button>
    </div></header>
}

function PrototypeControl({ persona, star, onPersona, onStar, onReset, onBackstage, scenario, onScenario }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`prototype-control ${open ? 'open' : ''}`}>
      {open && <div className="prototype-popover">
        <div className="prototype-heading">Prototype control</div>
        <div className="prototype-label">Persona</div>
        <div className="prototype-options">{personas.map((p) => <button key={p} className={p === persona ? 'selected' : ''} onClick={() => onPersona(p)}>{personaMeta[p].label}</button>)}</div>
        <div className="prototype-label">Experience vision</div>
        <div className="prototype-options">{stars.map((s) => <button key={s} className={s === star ? 'selected' : ''} onClick={() => onStar(s)}>{s}★</button>)}</div>
        <div className="prototype-label">Access scenario</div><div className="prototype-options"><button className={scenario==='first'?'selected':''} onClick={()=>onScenario('first')}>First-time user</button><button className={scenario==='returning'?'selected':''} onClick={()=>onScenario('returning')}>Returning user</button></div><button className="prototype-reset" onClick={onBackstage}><Icon name="shield" size={13}/>Open data owner / governance backstage</button>
        <button className="prototype-reset" onClick={onReset}><Icon name="refresh" size={13}/>Reset journey</button>
        <div className="prototype-note">Demo-only control. A real Edu Hub user would not see this.</div>
      </div>}
      <button className="prototype-trigger" onClick={() => setOpen(v => !v)}>Prototype · {personaMeta[persona].label} · {star}★</button>
    </div>
  )
}

function SearchOverlay({ config, onClose, onPick }) {
  const [query,setQuery]=useState('')
  const results=config.search.filter(item=>(item.label+' '+item.description).toLowerCase().includes(query.toLowerCase()))
  useEffect(()=>{const close=e=>{if(e.key==='Escape')onClose()};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[onClose])
  return <div className="overlay" onMouseDown={onClose}><div className="search-dialog" role="dialog" aria-modal="true" aria-label="Search this experience" onMouseDown={e=>e.stopPropagation()}><div className="search-dialog-input"><Icon name="search"/><input aria-label="Search this experience" autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder={config.searchPlaceholder}/><button aria-label="Close search" onClick={onClose}><Icon name="close"/></button></div><div className="search-results">{results.map(item=><button key={item.route} onClick={()=>{onPick(item.route);onClose()}}><div><strong>{item.label}</strong><span>{item.description}</span></div><Icon name="chevron"/></button>)}{!results.length && <p className="search-empty">No matches in this experience. Try Results, evidence or your current activity.</p>}</div></div></div>
}

function PageHeader({ title, subtitle, breadcrumbs = [], actions }) {
  return <><div className="breadcrumbs">{breadcrumbs.map((b,i) => <React.Fragment key={b}><span>{b}</span>{i < breadcrumbs.length - 1 && <span>/</span>}</React.Fragment>)}</div>
  <div className="page-header"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{actions && <div className="header-actions">{actions}</div>}</div></>
}

function BarChart({ name = 'cohort' }) {
  const data = chartData[name] || chartData.cohort
  return <div className="bar-chart" role="img" aria-label="Illustrative chart">{data.map((d) => <div className="bar-column" key={d.label}><div className="bar-value">{Math.round(d.value / 10)}.{d.value % 10}%</div><div className="bar-track"><div className="bar-fill" style={{ height: `${d.value}%` }} /></div><div className="bar-label">{d.label}</div></div>)}</div>
}

function ActionRow({ screen, onNext, onBack, atEnd, loading }) {
  if (!screen.primaryLabel && !screen.secondaryLabel && !onBack) return null
  return <div className="action-row">
    <div>{onBack ? <Button onClick={onBack}>Back</Button> : null}</div>
    <div className="action-row-right">
      {screen.secondaryLabel && <Button>{screen.secondaryLabel}</Button>}
      {screen.primaryLabel && <Button kind="primary" onClick={onNext} disabled={loading}>{loading ? 'Working…' : screen.primaryLabel}</Button>}
      {!screen.primaryLabel && atEnd && <Button kind="primary" onClick={onNext}>Restart journey</Button>}
    </div>
  </div>
}

function CatalogScreen({ screen, onNext, onNavigate }) {
  const [query, setQuery] = useState(screen.search || '')
  const products = screen.productIds.map(id => dataProducts[id]).filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()))
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Catalog']} />
    <div className="catalog-layout">
      <aside className="catalog-tree"><div className="tree-item active">Student data products</div><p className="body-copy">Certified products and reference context</p></aside>
      <div className="catalog-main"><div className="catalog-toolbar"><div className="search-field"><Icon name="search"/><input aria-label="Search data products" value={query} onChange={e => setQuery(e.target.value)}/></div><Badge tone="neutral">{products.length} results</Badge></div>
      <div className="data-table"><div className="table-row table-head"><span>Name</span><span>Type</span><span>Owner</span><span>Freshness</span><span>Trust</span></div>{products.map(p => <button className="table-row" key={p.id} onClick={()=>p.id==='results'?onNext():onNavigate(`product-${p.id}`)}><span className="linkish">{p.name}</span><span>{p.type}</span><span>{p.owner}</span><span>{p.freshness}</span><span><Badge>{p.trust}</Badge></span></button>)}</div>{!products.length && <p className="body-copy">No products match your search.</p>}</div>
    </div>
    <ActionRow screen={screen} onNext={onNext}/>
  </div>
}

function AssetScreen({ screen, onNext, onBack, config }) {
  const p = dataProducts[screen.productId]
  const [tab,setTab] = useState('Overview')
  const [sampleSQL,setSampleSQL] = useState(false)
  const tabs = ['Overview','Schema','Delivery','Versions','Consumers','Lineage','Quality','Access']
  return <div className="page-content"><PageHeader title={p.name} subtitle={p.description} breadcrumbs={['Catalog','Student',p.name]} actions={<>{hasCapability(config,'sampleSql') && p.id==='results' && <Button onClick={()=>setSampleSQL(v=>!v)}>{sampleSQL ? 'Hide sample SQL' : 'View sample SQL'}</Button>}{!screen.readOnly && <Button kind="primary" onClick={onNext}>{screen.primaryLabel || 'Request access'}</Button>}</>} />
    <div className="badge-row"><Badge tone="purple">{p.type}</Badge><Badge>{p.lifecycle}</Badge><Badge>{p.version}</Badge><Badge>{p.trust}</Badge><Badge>{p.classification}</Badge></div>
    <div className="trust-banner"><div className="trust-icon"><Icon name="shield" size={18}/></div><div><strong>Trusted product</strong><span>Authoritative: {p.authoritative} · Last validated {p.lastValidated} · Changes are versioned and assessed against registered consumers.</span></div><Badge tone="success">Certified</Badge></div>
    <div className="meta-grid"><Meta label="Owner" value={p.owner}/><Meta label="Freshness" value={p.freshness}/><Meta label="Coverage" value={p.coverage}/><Meta label="Quality" value={p.quality}/></div>
    <div className="tabs scroll-tabs">{tabs.map(t => <button key={t} className={tab===t?'active':''} onClick={() => setTab(t)}>{t}</button>)}</div>
    <ProductTabContent p={p} tab={tab}/>
    {sampleSQL && <pre className="dev-code">{reproducibleSQL}</pre>}
    <ActionRow screen={{}} onBack={onBack}/>
  </div>
}

function ProductTabContent({ p, tab }) {
  const {access}=useAccess()
  const indexes=p.fields.map((f,i)=>access.grants[p.id]?.includes(f[0])?i:-1).filter(i=>i>=0)
  const sample=indexes.length?<SimpleTable columns={indexes.map(i=>p.fields[i][0])} rows={p.sampleRows.map(row=>indexes.map(i=>row[i]||'—'))}/>:<p role="status">Sample values require approved field access. Schema definitions remain discoverable.</p>
  if (tab === 'Overview') return <div className="asset-layout"><div>
    <h3>What this product is for</h3><p className="body-copy">{p.definition}</p>
    <h3 className="section-title">Sample data</h3>{sample}
  </div><aside className="asset-aside"><Info label="Lifecycle" value={`${p.lifecycle} · ${p.version}`}/><Info label="Data steward" value={p.steward}/><Info label="Source" value={p.source}/><Info label="Approved use" value={p.allowedUse}/><Info label="Recommended join" value={p.id === 'attendance' ? 'Student Identity on student_id' : 'Use governed identifiers'}/></aside></div>
  if (tab === 'Schema') return <div className="product-tab"><div className="tab-intro"><div><h3>Schema</h3><p>Contracted fields with classification and validation expectations.</p></div><Badge>{p.version}</Badge></div><SimpleTable columns={['Field','Type','Description','Classification','Rule']} rows={p.fields}/><h3 className="section-title">Masked sample rows</h3>{sample}</div>
  if (tab === 'Delivery') return <div className="product-tab"><div className="tab-intro"><div><h3>Delivery</h3><p>Supported consumption routes are part of the product contract, not ad-hoc integration choices.</p></div><Badge tone="success">Monitored</Badge></div><SimpleTable columns={['Route','Interface','Cadence','Intended consumers','Commitment']} rows={p.deliveries}/></div>
  if (tab === 'Versions') return <div className="product-tab"><div className="tab-intro"><div><h3>Versions</h3><p>Consumers can see what changed, what remains supported and when action is required.</p></div><Badge>{p.lifecycle}</Badge></div><SimpleTable columns={['Version','Status','Released','Change','Supported until']} rows={p.versions}/></div>
  if (tab === 'Consumers') return <div className="product-tab"><div className="tab-intro"><div><h3>Registered consumers</h3><p>Knowing who depends on the product lets Edu Hub assess impact before changes are released.</p></div><Badge>{p.consumers.length} consumers</Badge></div><SimpleTable columns={['Consumer','Route','Contract','Environment','Last activity']} rows={p.consumers}/></div>
  if (tab === 'Lineage') return <div className="product-tab"><div className="tab-intro"><div><h3>Lineage</h3><p>Trace the product from authoritative source through standardisation to consumption.</p></div></div><SimpleTable columns={['Node','Stage','What happens','Status']} rows={p.lineage}/></div>
  if (tab === 'Quality') return <div className="product-tab"><div className="tab-intro"><div><h3>Quality</h3><p>Quality checks are evaluated on each refresh and surfaced to consumers when degraded.</p></div><Badge>{p.quality}</Badge></div><SimpleTable columns={['Check','Expectation','Latest','Status']} rows={p.qualityChecks}/></div>
  if (tab === 'Access') return <div className="product-tab"><div className="tab-intro"><div><h3>Access policy</h3><p>Access depends on user type, purpose and approved delivery route.</p></div><Badge>{p.classification}</Badge></div><SimpleTable columns={['Consumer type','Access','Condition','Decision']} rows={p.permissions}/></div>
  return null
}

function Meta({label,value}) { return <div className="meta-card"><span>{label}</span><strong>{value}</strong></div> }
function Info({label,value}) { return <div className="info-block"><span>{label}</span><p>{value}</p></div> }
function IntentScreen({ screen, onNext, onBack, loading, onQuestion }) {
  const [prompt,setPrompt] = useState(screen.prompt)
  return <div className="page-content intent-page"><PageHeader title="Home" />
    <div className="intent-card"><div className="intent-eyebrow"><span className="spark-icon">✦</span>{screen.eyebrow}</div><h2>{screen.title}</h2><p>{screen.subtitle}</p>
      <div className="prompt-box"><textarea aria-label={screen.title} value={prompt} onChange={e=>setPrompt(e.target.value)}/><div className="prompt-footer"><span>Uses approved data, policy and shared definitions</span><Button kind="primary" onClick={() => { if (screen.businessQuestion) onQuestion(prompt.trim()); onNext() }} disabled={loading || !prompt.trim()}>{loading ? 'Preparing…' : screen.primaryLabel}</Button></div></div>
      <div className="suggestion-row">{screen.suggestions?.map(s => <button key={s} onClick={() => setPrompt(s)}>{s}</button>)}</div>
    </div>
    <ActionRow screen={{}} onBack={onBack}/>
  </div>
}

function PlanScreen({ screen, onNext, onBack, config, analysisLevel, onAnalysisLevel }) {
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Edu Hub',screen.title]} />
    {screen.editable && hasCapability(config,'methodOverride') && <label className="form-field">Override analysis level<select value={analysisLevel} onChange={e=>onAnalysisLevel(e.target.value)}><option>All levels</option><option>Secondary 1</option><option>Secondary 2</option></select><small>Your selection is carried into the generated SQL. Review cohort changes before attributing causes.</small></label>}
    <div className="plan-layout"><div className="plan-table">{screen.rows.map(([label,value,note,status]) => <div className="plan-row" key={label+value}><div className="plan-label">{label}</div><div><strong>{value}</strong><span>{note}</span></div><Badge>{status}</Badge></div>)}</div>
    <aside className="summary-panel"><h3>Review</h3>{screen.checks?.map(([label,value]) => <div className="summary-line" key={label}><span>{label}</span><Badge>{value}</Badge></div>)}</aside></div>
    <ActionRow screen={screen} onNext={onNext} onBack={onBack}/>
  </div>
}

function ProgressScreen({ screen, onNext, onBack, loading }) {
  const [done,setDone] = useState(screen.primaryLabel ? Math.min(2, screen.tasks.length) : screen.tasks.length)
  useEffect(() => {
    if (done >= screen.tasks.length - 1) return
    const timer = setTimeout(() => setDone(d => d + 1), 650)
    return () => clearTimeout(timer)
  }, [done, screen.tasks.length])
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Edu Hub','Provisioning']} />
    <div className="progress-layout"><div className="progress-card">{screen.tasks.map(([title,copy],i) => <div className={`progress-item ${i < done ? 'done' : i === done ? 'active' : ''}`} key={title}><div className="progress-marker">{i < done ? <Icon name="check" size={14}/> : i+1}</div><div><strong>{title}</strong><span>{copy}</span></div>{i < done && <Badge>Complete</Badge>}{i === done && <Badge tone="warning">In progress</Badge>}</div>)}</div>
    <aside className="summary-panel"><h3>Setup summary</h3>{screen.summary?.map(([label,value]) => <div className="summary-line" key={label}><span>{label}</span><strong>{value}</strong></div>)}</aside></div>
    <ActionRow screen={screen} onNext={onNext} onBack={onBack} loading={loading}/>
  </div>
}

function WorkspaceScreen({ screen, onBack, config, analysisLevel = 'All levels' }) {
  const generated = analysisLevel === 'All levels' ? screen.code : screen.code.replace("AND result_status = 'FINAL'", "AND result_status = 'FINAL'\n    AND level = '" + analysisLevel + "'")
  const [code,setCode] = useState(generated)
  const [run,setRun] = useState(false)
  const [message,setMessage] = useState('')
  const [detail,setDetail] = useState(null)
  const execute = () => { setRun(code === generated && !screen.manual); setMessage(code === generated && !screen.manual ? 'Synthetic preview refreshed. No database query was executed.' : 'SQL saved for review. This prototype has no SQL execution backend; edited queries cannot produce new results.') }

  return <div className="page-content workspace-page"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Workspace',screen.title]} actions={<><Button>Share</Button><Button kind="primary" onClick={execute}>Run all</Button></>} />
    <ResultsEvidence compact/>
    <div className="editor-shell"><aside className="editor-left"><div className="editor-panel-head">Analysis assets <span>＋</span></div><span className="editor-file active">01_analysis.sql</span><button className="editor-file" onClick={()=>setDetail(detail==='definition'?null:'definition')}>Definitions</button><button className="editor-file" onClick={()=>setDetail(detail==='lineage'?null:'lineage')}>Lineage</button></aside>
    <main className="editor-main">{detail && <div className="panel-card"><h3>{detail==='definition'?'Metric and assumptions':'Results lineage'}</h3><p>{detail==='definition'?resultsContext.definition+' '+resultsContext.methodology:'School Results System → finality, subject-code and duplicate validation → Student Academic Results v1.2 → authorised HQ workspace. Student Identity v1.8 supplies governed school and level context. Two delayed submissions are excluded.'}</p></div>}<div className="editor-toolbar"><Button kind="primary" onClick={execute}>Run</Button>{screen.badges?.map(b => <Badge key={b}>{b}</Badge>)}<span className="saved-state">Saved just now</span></div><label className="sql-label">Review and edit SQL<textarea className="code-editor sql-editor" value={code} onChange={e=>{setCode(e.target.value);setRun(false)}}/></label>{message && <p role="status">{message}</p>}<div className="editor-results">{!run ? <div className="result-placeholder">Write or review SQL, then select Run. Execution is simulated.</div> : analysisLevel !== 'All levels' ? <div className="result-placeholder">SQL scoped to {analysisLevel}. Review and execute in an approved workspace; no scoped result fixture is supplied.</div> : screen.chart ? <BarChart name={screen.chart}/> : screen.resultRows ? <SimpleTable columns={screen.resultColumns} rows={screen.resultRows}/> : <div className="result-placeholder">Run the analysis to refresh results.</div>}</div></main>
    {hasCapability(config,'starterSql') && <aside className="assistant-panel"><div className="editor-panel-head">Analysis notes</div><div className="assistant-message">{screen.assistant}</div><div className="assistant-input">Review the method, definitions and lineage before use.</div></aside>}</div>
    <ActionRow screen={{}} onBack={onBack}/>
  </div>
}

function DiscoverScreen({ screen, onNext, onBack }) {
  const [q,setQ] = useState(screen.search)
  const items = screen.items.filter(x => x.join(' ').toLowerCase().includes(q.toLowerCase()))
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Analytics']} />
    <div className="wide-search"><Icon name="search"/><input aria-label="Search dashboards" value={q} onChange={e=>setQ(e.target.value)}/></div>
    <h3 className="section-title">Results</h3><div className="asset-card-grid">{items.map((item,i) => <button className="asset-card" key={item[1]} onClick={i===0?onNext:undefined}><div className="asset-type">{item[0]}</div><strong>{item[1]}</strong><p>{item[2]}</p><Badge>{item[3]}</Badge></button>)}</div>
    <ActionRow screen={screen} onNext={onNext} onBack={onBack}/>
  </div>
}

function DashboardDetail({ screen, onNext, onBack }) {
  const d = {name:'Student Academic Results',owner:'Academic Data Domain',updated:'Today, 6:04 PM',definition:'Subject pass rate v1'}
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Analytics','Dashboards',d.name]} actions={<Button kind="primary" onClick={onNext}>{screen.primaryLabel}</Button>} />
    <div className="badge-row"><Badge tone="purple">Dashboard</Badge><Badge>Trusted</Badge><Badge>Daily</Badge></div>
    <div className="meta-grid"><Meta label="Owner" value={d.owner}/><Meta label="Updated" value={d.updated}/><Meta label="Audience" value="HQ officers"/><Meta label="Definition set" value={d.definition}/></div>
    <div className="definition-callout"><div><strong>Subject pass rate</strong><span>{resultsContext.definition}</span></div><Badge tone="purple">{'v1'}</Badge></div>
    <div className="preview-card"><div className="preview-label">Preview</div><div className="metric-grid"><Metric label="Mathematics pass rate" value="79.4%"/><Metric label="English pass rate" value="88.0%"/><Metric label="Current schools" value="8"/></div><p className="body-copy">Synthetic summary across comparable schools. Apply filters in the dashboard.</p></div>
    <ActionRow screen={{}} onBack={onBack}/>
  </div>
}

function Metric({label,value}) { return <div className="metric-card"><span>{label}</span><strong>{value}</strong></div> }

function RecommendationsScreen({ screen, onNext, onBack }) {
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Edu Hub','Recommendations']} />
    <div className="asset-card-grid">{screen.items.map((item,i)=><button className={`asset-card ${i===0?'recommended':''}`} key={item[1]} onClick={i===0?onNext:undefined}><div className="asset-type">{item[0]}</div><strong>{item[1]}</strong><p>{item[2]}</p><Badge>{item[3]}</Badge></button>)}</div>
    <ActionRow screen={screen} onNext={onNext} onBack={onBack}/>
  </div>
}

function TableScreen({ screen, onNext, onBack }) {
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Edu Hub',screen.title]} /><div className="table-card full"><SimpleTable columns={screen.columns} rows={screen.rows}/></div><ActionRow screen={screen} onNext={onNext} onBack={onBack}/></div>
}

function SimpleTable({columns=[],rows=[]}) {
  return <div className="simple-table"><div className="simple-row simple-head" style={{gridTemplateColumns:`repeat(${columns.length}, minmax(0,1fr))`}}>{columns.map(c=><span key={c}>{c}</span>)}</div>{rows.map((row,i)=><div className="simple-row" key={i} style={{gridTemplateColumns:`repeat(${columns.length}, minmax(0,1fr))`}}>{row.map((cell,j)=><span key={j} className={j===0?'linkish':''}>{j===row.length-1 && /(current|approved|ready|provisional|none|included|excluded|passed)/i.test(cell) ? <Badge>{cell}</Badge> : cell}</span>)}</div>)}</div>
}

function ApiScreen({ screen, onNext, onBack }) {
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Developer',screen.title]} />
    <div className="api-layout"><pre className="dev-code">{screen.code}</pre><aside className="summary-panel"><h3>Interface</h3>{screen.facts.map(([l,v])=><div className="summary-line" key={l}><span>{l}</span><Badge>{v}</Badge></div>)}</aside></div><ActionRow screen={screen} onNext={onNext} onBack={onBack}/></div>
}

function ContractScreen({ screen, onNext, onBack, config, delivery, onDelivery }) {
  const p = dataProducts[screen.productId]
  const [tab,setTab] = useState('Contract')
  const tabs = ['Contract','Schema','Delivery','Versions','Consumers']
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Data products',p.name]} />
    <div className="badge-row"><Badge tone="purple">API-ready</Badge><Badge>{p.lifecycle}</Badge><Badge>{p.version}</Badge><Badge>{p.trust}</Badge><Badge>{p.classification}</Badge></div>
    <div className="meta-grid"><Meta label="Freshness" value={p.freshness}/><Meta label="SLO" value="99.5% delivery"/><Meta label="Owner" value={p.owner}/><Meta label="Compatibility" value="Backward compatible within major version"/></div>
    <div className="tabs scroll-tabs">{tabs.map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
    {tab === 'Contract' ? <div className="contract-overview"><div className="panel-card"><h3>Business contract</h3><div className="contract-key"><span>Product</span><strong>{p.name} {p.version}</strong></div><div className="contract-key"><span>Promise</span><strong>Stable academic results semantics independent of storage or platform implementation</strong></div><div className="contract-key"><span>Change policy</span><strong>Breaking changes require a new major version and consumer impact review</strong></div><div className="contract-key"><span>Freshness</span><strong>{p.freshness}</strong></div></div><aside className="summary-panel"><h3>Contract health</h3><div className="summary-line"><span>Registered consumers</span><strong>{p.consumers.length}</strong></div><div className="summary-line"><span>Latest quality</span><Badge>{p.quality}</Badge></div><div className="summary-line"><span>Last validated</span><strong>{p.lastValidated}</strong></div><div className="summary-line"><span>Lifecycle</span><Badge>{p.lifecycle}</Badge></div></aside></div> : <ProductTabContent p={p} tab={tab}/>}
    {hasCapability(config,'manualDelivery') && <label className="form-field">Select delivery<select aria-label="Select delivery" value={delivery} onChange={e=>onDelivery(e.target.value)}><option>REST API</option><option>Direct query</option><option>Managed file</option></select><small>You choose the delivery route for your integration.</small></label>}
    <ActionRow screen={screen} onNext={onNext} onBack={onBack}/>
  </div>
}

function ControlledScreen({ screen, onBack }) {
  const [entitlement,setEntitlement] = useState('Active')
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Partner access',screen.title]} />
    <details className="panel-card"><summary>Prototype access scenarios</summary><label className="form-field">Entitlement<select aria-label="Entitlement" value={entitlement} onChange={e=>setEntitlement(e.target.value)}><option>Active</option><option>Expired</option><option>Denied</option></select></label></details>
    {entitlement === 'Active' ? <>{!screen.subset && <div className="metric-grid metric-grid-4">{screen.metrics.map(([l,v]) => <Metric key={l} label={l} value={v}/>)}</div>}
    <div className="dashboard-layout"><div className="chart-card"><h3>{screen.subset?'Approved data package':'Approved analysis'}</h3>{screen.subset?<><p>Project-scoped synthetic sample. Use only within the approved evaluation workspace.</p><SimpleTable columns={['Participant token','Level','Results band']} rows={[['PRJ-001','Secondary 2','Meets standard'],['PRJ-002','Secondary 2','Developing']]}/></>:<p>Participant pass-rate change: +4 pp. Comparison cohort: +1 pp. Aggregate synthetic comparison; causal impact is not established.</p>}</div><aside className="evidence-panel"><h3>Workspace controls</h3>{screen.controls.map(([l,v])=><div className="evidence-row" key={l}><strong>{l}</strong><span>{v}</span></div>)}</aside></div></> : <div className="incident-banner" role="status"><strong>Access {entitlement.toLowerCase()}</strong><p>Results are unavailable. Your MOE sponsor must confirm the approved purpose and renew or approve entitlement before access resumes. No raw data or cached result is released.</p></div>}<ActionRow screen={{}} onBack={onBack}/></div>
}

function ConsumerHealth({ screen, onNext, onBack }) {
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Developer','Consumers',screen.title]} />
    <div className="api-layout"><div className="panel-card"><h3>Business contracts</h3>{screen.contracts.map(([name,copy])=><div className="contract-health" key={name}><div className="check-circle"><Icon name="check"/></div><div><strong>{name}</strong><span>{copy}</span></div></div>)}</div><aside className="summary-panel"><h3>Consumer health</h3>{screen.facts.map(([l,v])=><div className="summary-line" key={l}><span>{l}</span><strong>{v}</strong></div>)}</aside></div><ActionRow screen={screen} onNext={onNext} onBack={onBack}/></div>
}

function ChangeScreen({ screen, onNext, onBack }) {
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Developer','Change history']} />
    <div className="success-banner"><div className="check-circle large"><Icon name="check" size={20}/></div><div><strong>Migration completed successfully</strong><span>{screen.message}</span></div></div><div className="metric-grid metric-grid-4">{screen.metrics.map(([l,v])=><Metric key={l} label={l} value={v}/>)}</div><ActionRow screen={screen} onNext={onNext} onBack={onBack}/></div>
}

function IncidentScreen({ screen, onNext, onBack }) {
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Edu Hub','Data health']} />
    <div className="incident-banner"><div className="incident-mark">!</div><div><strong>{screen.severity}</strong><p>{screen.summary}</p></div></div>
    <div className="incident-grid"><div className="panel-card"><h3>Affected data</h3><SimpleTable columns={['Feed','Latest state','Treatment']} rows={screen.affected}/></div><aside className="summary-panel"><h3>Safe handling</h3>{screen.handling.map(([l,v])=><div className="evidence-row" key={l}><strong>{l}</strong><span>{v}</span></div>)}</aside></div>
    <div className="definition-callout"><div><strong>Why this matters</strong><span>Delayed source feeds remain visible. Review the affected scope and handling before continuing your analysis.</span></div><Badge tone="warning">Degraded</Badge></div>
    <ActionRow screen={screen} onNext={onNext} onBack={onBack}/>
  </div>
}

function GovernanceScreen({ onBack }) {
  return <div className="page-content"><PageHeader title="Data owner & governance backstage" subtitle="The operating layer behind the consumer experience. This is a prototype backstage view, not a fifth consumer persona." breadcrumbs={['Platform','Governance']} />
    <OwnerApprovals/>
    <div className="metric-grid metric-grid-4">{governanceBackstage.metrics.map(([l,v])=><Metric key={l} label={l} value={v}/>)}</div>
    <div className="governance-grid">
      <div className="panel-card"><div className="tab-intro"><div><h3>Review queue</h3><p>Ownership, certification and purpose reviews that require human accountability.</p></div><Badge tone="warning">3 open</Badge></div><SimpleTable columns={['Item','Review','Owner','Due','Status']} rows={governanceBackstage.reviewQueue}/></div>
      <div className="panel-card"><div className="tab-intro"><div><h3>Data quality incidents</h3><p>Consumer-facing impact is carried with the product, not managed only in a separate ticket.</p></div></div><SimpleTable columns={['Incident','Scope','Opened','Consumer handling','State']} rows={governanceBackstage.incidents}/></div>
    </div>
    <div className="panel-card governance-changes"><div className="tab-intro"><div><h3>Upcoming product changes</h3><p>Every proposed change is tested against registered consumers before release.</p></div><Button>Review change policy</Button></div><SimpleTable columns={['Product','Stage','Change','Consumer impact']} rows={governanceBackstage.changes}/></div>
    <div className="definition-callout"><div><strong>Governance by design</strong><span>Owners certify definitions and permitted uses; the platform applies those decisions through access, contracts, quality signals, lifecycle and audit.</span></div><Badge tone="purple">Backstage</Badge></div>
    <ActionRow screen={{}} onBack={onBack}/>
  </div>
}

function ScopeEvidence({ config, onBack }) {
  const partner=config.persona==='partner'
  const product=dataProducts.results
  const rows=partner ? [['Approved purpose','Academic programme evaluation'],['MOE sponsor','Programme owner'],['Method','Approved aggregate 2025–2026 comparison; no causal claim'],['Disclosure','Raw marks and direct identifiers stay within MOE'],['Expiry','180 days; sponsor renewal required'],['Controls','Pseudonymisation, minimum cohort size 10, query audit and restricted exports']] : [['Authoritative source',product.source],['Owner',product.owner],['Freshness',product.freshness+' · '+product.lastValidated],['Quality',resultsContext.quality],['Sensitivity','Sensitive source records; access is limited to the permitted purpose'],['Definition',resultsContext.definition],['Assumptions',resultsContext.methodology],['Permitted use',config.persona==='business'?'Authorised aggregate business views':config.persona==='system'?'Registered workload identity and contracted fields':'Approved analytical purpose and workspace entitlement']]
  return <div className="page-content"><PageHeader title={partner?'Purpose, evidence & controls':'Definitions, evidence & quality'} subtitle="Context for your current experience"/><div className="panel-card">{rows.map(([l,v])=><Info key={l} label={l} value={v}/>)}</div><ActionRow screen={{}} onBack={onBack}/></div>
}

function ExperienceHelp({ config, onBack }) {
  return <div className="page-content"><PageHeader title="Help & scope" subtitle={personaMeta[config.persona].role}/><div className="panel-card"><h3>{config.navigation[0].label}</h3><p>{config.routes[config.landing].screen.subtitle || 'Inspect the evidence accompanying your approved outcome.'}</p><p>This demonstration uses synthetic data. Permissions, freshness and approved purpose remain attached to your work.</p></div><ActionRow screen={{}} onBack={onBack}/></div>
}

function renderScreen(screen, props) {
  const map={accessHub:AccessHub,datasetDiscovery:DatasetDiscovery,datasetDetail:DatasetDetail,recommendedDatasets:RecommendedDatasets,datasetTools:DatasetTools,scopeEvidence:ScopeEvidence,experienceHelp:ExperienceHelp,briefing:Briefing,businessAnswer:BusinessAnswer,resultsDashboard:ResultsDashboard,partnerOutcome:PartnerOutcome,contractTests:ContractTests,catalog:CatalogScreen,asset:AssetScreen,intent:IntentScreen,plan:PlanScreen,progress:ProgressScreen,workspace:WorkspaceScreen,discover:DiscoverScreen,dashboardDetail:DashboardDetail,recommendations:RecommendationsScreen,table:TableScreen,api:ApiScreen,contract:ContractScreen,controlled:ControlledScreen,consumerHealth:ConsumerHealth,change:ChangeScreen,incident:IncidentScreen}
  const Component=map[screen.kind]
  if(!Component) throw new Error('Unregistered experience screen: '+screen.kind)
  return <Component screen={screen} {...props}/>
}

function Experience({ config, onLogout, backstage, setBackstage, scenario }) {
  const accessKey=`eh_access_v1/${config.scope}/${scenario}`
  const [access,setAccess]=useState(()=>restoreAccess(config.persona,scenario,sessionStorage.getItem(accessKey)))
  useEffect(()=>{sessionStorage.setItem(accessKey,JSON.stringify(access))},[access,accessKey])
  const send=action=>setAccess(previous=>accessTransition(previous,{...action,persona:config.persona}))
  const [state,setState]=useState(()=>createJourney(config))
  const current=useRef(state)
  const timer=useRef(null)
  const sessionId=useRef(crypto.randomUUID())
  const [loading,setLoading]=useState(false)
  const [searchOpen,setSearchOpen]=useState(false)
  const cancelPending=()=>{clearTimeout(timer.current);setLoading(false)}
  const dispatch=action=>{
    const previous=current.current
    const next=transition(config,previous,{scope:config.scope,...action})
    if(next===previous)return
    current.current=next;setState(next)
    if(next.route!==previous.route || action.type==='HISTORY') {
      const method=next.historyMode==='push'?'pushState':'replaceState'
      window.history[method]({experience:config.scope,session:sessionId.current},'',routeHash(config,next.route))
    }
  }
  useEffect(()=>{
    // A fresh scope/session never trusts an old URL or history-state grant.
    const requested=parseRoute(config,window.location.hash)
    dispatch({type:'HISTORY',route:requested})
    const restore=()=>{
      cancelPending();setSearchOpen(false);setBackstage(false)
      const foreignSession=window.history.state?.session && window.history.state.session!==sessionId.current
      dispatch({type:'HISTORY',route:foreignSession?config.landing:parseRoute(config,window.location.hash)})
    }
    const keyboard=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSearchOpen(true)}}
    window.addEventListener('popstate',restore);window.addEventListener('hashchange',restore);window.addEventListener('keydown',keyboard)
    return()=>{clearTimeout(timer.current);window.removeEventListener('popstate',restore);window.removeEventListener('hashchange',restore);window.removeEventListener('keydown',keyboard)}
  },[config])
  useEffect(()=>{if(backstage){cancelPending();setSearchOpen(false)}},[backstage])
  const navigate=route=>{cancelPending();setBackstage(false);dispatch({type:'NAVIGATE',route})}
  const next=()=>{
    if(loading)return
    const source=current.current.route
    const kind=config.routes[source].screen.kind
    if(['intent','progress'].includes(kind)) {
      setLoading(true)
      timer.current=setTimeout(()=>{setLoading(false);dispatch({type:'NEXT',source})},650)
    } else dispatch({type:'NEXT',source})
  }
  const back=()=>{cancelPending();dispatch({type:'BACK'})}
  let screen=config.routes[state.route].screen
  if(hasCapability(config,'manualDelivery') && screen.kind==='api' && state.delivery!=='REST API') screen={...screen,title:state.delivery+' integration',code:state.delivery==='Direct query'?'-- Use your approved workload identity in the authorised query environment.\nSELECT student_id, subject, academic_year, passed\nFROM edu_hub.student_academic_results\nWHERE academic_year = 2026;':'Secure managed file delivery\nSchedule: daily at 6:15 PM\nFormat: approved fields only; manifest includes freshness status\nIdentity: registered application\nExpired entitlement: delivery stopped',facts:[['Delivery',state.delivery],['Freshness','Daily'],['Entitlement','Registered application only'],['Data','Contracted minimum fields']]}
  const props={config,selectedDataset:state.selectedDataset,onSelectDataset:value=>dispatch({type:'DATASET',source:state.route,value}),onNavigate:navigate,onNext:next,onBack:back,loading,question:state.question,onQuestion:value=>dispatch({type:'QUESTION',source:state.route,value}),analysisLevel:state.analysisLevel,onAnalysisLevel:value=>dispatch({type:'LEVEL',source:state.route,value}),delivery:state.delivery,onDelivery:value=>dispatch({type:'DELIVERY',source:state.route,value})}
  return <AccessContext.Provider value={{access,send,navigate,config}}><div className="app-shell" data-experience={config.scope} data-route={state.route}>
    <Topbar config={config} onSearch={()=>setSearchOpen(true)} onNavigate={navigate} onLogout={onLogout}/>
    <Sidebar config={config} route={state.route} onNavigate={navigate}/>
    <main className="main-area">
      {backstage ? <GovernanceScreen onBack={()=>setBackstage(false)}/> : <>
        <React.Fragment key={state.route}><AccessGate requirements={config.routes[state.route].requires}>{renderScreen(screen,props)}</AccessGate></React.Fragment>
        <nav className="context-actions" aria-label="Supporting context">{config.actions.filter(action=>action.route!==state.route).map(action=><button key={action.id} onClick={()=>navigate(action.route)}>{action.label}</button>)}</nav>
        {state.route===config.landing && config.home.cards.length>0 && <section className="experience-recents" aria-label="Recently used">{config.home.cards.map(card=><button className="recent-card" key={card.route} onClick={()=>navigate(card.route)}><span>Recently used</span><strong>{card.label}</strong></button>)}</section>}
      </>}
    </main>
    {searchOpen && <SearchOverlay config={config} onClose={()=>setSearchOpen(false)} onPick={navigate}/>}
  </div></AccessContext.Provider>
}

function App() {
  const [scenario,setScenario]=useState(()=>sessionStorage.getItem('eh_access_scenario')==='first'?'first':'returning')
  const [backstage,setBackstage]=useState(false)
  const [loggedIn,setLoggedIn]=useState(()=>localStorage.getItem('eh_logged_in')==='1')
  const [selection,setSelection]=useState(()=>{
    const config=getExperience(localStorage.getItem('eh_persona'),Number(localStorage.getItem('eh_star')))
    return {persona:config.persona,star:config.star,generation:0}
  })
  const config=getExperience(selection.persona,selection.star)
  // Only these demo-control callbacks can change persona or star.
  const select=(persona,star)=>{
    if(!personas.includes(persona)||!stars.includes(star))return
    setBackstage(false)
    for(const preset of ['first','returning'])sessionStorage.removeItem(`eh_access_v1/${persona}/${star}/${preset}`)
    localStorage.setItem('eh_persona',persona);localStorage.setItem('eh_star',String(star))
    window.history.replaceState(null,'',routeHash(getExperience(persona,star),'step-0'))
    setSelection(s=>({persona,star,generation:s.generation+1}))
  }
  const login=()=>{localStorage.setItem('eh_logged_in','1');setLoggedIn(true)}
  const logout=()=>{setBackstage(false);localStorage.removeItem('eh_logged_in');setLoggedIn(false);setSelection(s=>({...s,generation:s.generation+1}));window.history.replaceState(null,'',routeHash(config,config.landing))}
  if(!loggedIn)return <Login onLogin={login}/>
  return <><Experience key={`${config.scope}/${selection.generation}`} config={config} scenario={scenario} backstage={backstage} setBackstage={setBackstage} onLogout={logout}/><PrototypeControl scenario={scenario} onScenario={value=>{sessionStorage.setItem('eh_access_scenario',value);setScenario(value);select(config.persona,config.star)}} persona={config.persona} star={config.star} onPersona={persona=>select(persona,config.star)} onStar={star=>select(config.persona,star)} onReset={()=>select(config.persona,config.star)} onBackstage={()=>setBackstage(true)}/></>
}

export default App
