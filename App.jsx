import React, { useEffect, useMemo, useState } from 'react'
import { experienceFlows, personaMeta } from './experienceFlows.js'
import { chartData, dashboards, dataProducts, governanceBackstage, metrics, notifications, recentItems, userProfiles } from './mockData.js'

const stars = [5, 7, 9, 11]
const personas = ['analyst', 'business', 'system', 'partner']

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
  if (/(healthy|ready|granted|approved|pass|current|enabled|included|verified|certified|supported|none|complete|stable|on|allowed|available|monitored|monitoring)/.test(v)) return 'success'
  if (/(warning|pending|provisional|approval|delayed|review|164|45 days)/.test(v)) return 'warning'
  if (/(excluded|disabled|restricted|sensitive)/.test(v)) return 'muted'
  if (/(recommended|interpreted|governed|sdp|2 sdps)/.test(v)) return 'purple'
  return 'neutral'
}

function Badge({ children, tone }) {
  return <span className={`badge badge-${tone || statusTone(children)}`}>{children}</span>
}

function Button({ children, onClick, kind = 'secondary', disabled = false, icon }) {
  return <button className={`button button-${kind}`} onClick={onClick} disabled={disabled}>{icon ? <Icon name={icon} size={14}/> : null}{children}</button>
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
            <div className="visual-row"><span>Student Attendance</span><Badge tone="success">Healthy</Badge></div>
            <div className="visual-row"><span>Student Identity</span><Badge tone="success">Healthy</Badge></div>
            <div className="visual-row"><span>Frequent absence rate v3</span><Badge tone="purple">Governed</Badge></div>
          </div>
          <div className="visual-answer">
            <div className="visual-spark">✦</div>
            <strong>Ask in business language</strong>
            <span>Edu Hub can progressively move from data discovery to intent-aware orchestration.</span>
          </div>
        </div>
      </div>
      <div className="login-environment">Prototype environment · No production data</div>
    </div>
  )
}

function Sidebar({ persona, activeNav, onNav }) {
  const nav = personaMeta[persona].nav
  const iconFor = (label) => {
    if (/home/i.test(label)) return 'home'
    if (/data|contract/i.test(label)) return 'data'
    if (/analytic|insight|dashboard|ask/i.test(label)) return 'chart'
    if (/workspace|project/i.test(label)) return 'folder'
    if (/developer|consumer|subscription/i.test(label)) return 'code'
    if (/agreement|support|request/i.test(label)) return 'file'
    return 'file'
  }
  return (
    <aside className="sidebar">
      <div className="nav-group">
        {nav.map((item) => (
          <button key={item} className={`nav-item ${activeNav === item ? 'active' : ''}`} onClick={() => onNav(item)}>
            <span className="nav-icon"><Icon name={iconFor(item)} /></span><span>{item}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-bottom">
        <div className="nav-caption">PLATFORM</div>
        <button className={`nav-item ${activeNav === 'Governance' ? 'active' : ''}`} onClick={() => onNav('Governance')}><span className="nav-icon"><Icon name="shield"/></span><span>Governance</span></button>
        <button className="nav-item"><span className="nav-icon"><Icon name="help"/></span><span>Help & support</span></button>
      </div>
    </aside>
  )
}

function Topbar({ persona, onSearch, onLogout }) {
  const profile = userProfiles[persona]
  const [open,setOpen] = useState(false)
  const items = notifications[persona] || []
  return (
    <header className="topbar">
      <div className="brand"><div className="brand-mark">EH</div><span>Edu Hub</span></div>
      <button className="global-search" onClick={onSearch}><Icon name="search"/><span>{personaMeta[persona].search}</span><kbd>⌘ K</kbd></button>
      <div className="top-actions">
        <button className="icon-button" aria-label="Help"><Icon name="help"/></button>
        <div className="notification-wrap">
          <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setOpen(v => !v)}><Icon name="bell"/><span className="notification-dot">{items.length}</span></button>
          {open && <div className="notification-panel">
            <div className="notification-head"><strong>Notifications</strong><span>{items.length} items</span></div>
            {items.map(([type,title,copy,tone],i) => <button className="notification-item" key={i} onClick={() => setOpen(false)}>
              <span className={`notification-icon ${tone || 'neutral'}`}>{type === 'Data quality' ? '!' : type === 'Version' || type === 'Change' ? '↻' : '✓'}</span>
              <span><strong>{title}</strong><small>{copy}</small></span>
            </button>)}
          </div>}
        </div>
        <div className="profile-block"><div className="avatar">{profile.initials}</div><div className="profile-copy"><strong>{profile.name}</strong><span>{profile.role}</span></div></div>
        <button className="icon-button" aria-label="Sign out" onClick={onLogout}><Icon name="logout"/></button>
      </div>
    </header>
  )
}

function PrototypeControl({ persona, star, onPersona, onStar, onReset, onBackstage }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`prototype-control ${open ? 'open' : ''}`}>
      {open && <div className="prototype-popover">
        <div className="prototype-heading">Prototype control</div>
        <div className="prototype-label">Persona</div>
        <div className="prototype-options">{personas.map((p) => <button key={p} className={p === persona ? 'selected' : ''} onClick={() => onPersona(p)}>{personaMeta[p].label}</button>)}</div>
        <div className="prototype-label">Experience vision</div>
        <div className="prototype-options">{stars.map((s) => <button key={s} className={s === star ? 'selected' : ''} onClick={() => onStar(s)}>{s}★</button>)}</div>
        <button className="prototype-reset" onClick={onBackstage}><Icon name="shield" size={13}/>Open data owner / governance backstage</button>
        <button className="prototype-reset" onClick={onReset}><Icon name="refresh" size={13}/>Reset journey</button>
        <div className="prototype-note">Demo-only control. A real Edu Hub user would not see this.</div>
      </div>}
      <button className="prototype-trigger" onClick={() => setOpen(v => !v)}>Prototype · {personaMeta[persona].label} · {star}★</button>
    </div>
  )
}

function SearchOverlay({ persona, onClose, onPick }) {
  const [query, setQuery] = useState('')
  const all = [
    ['Data product', 'Student Attendance', 'Daily attendance, absence categories and latecoming', 'Data products'],
    ['Data product', 'Student Identity', 'Core student identity and enrolment context', 'Data products'],
    ['Dashboard', 'Student Attendance Overview', 'School and cohort attendance trends', persona === 'business' ? 'Dashboards' : 'Analytics'],
    ['Metric', 'Frequent absence rate v3', 'Students absent on ≥10% of instructional days · prototype governed measure', persona === 'system' ? 'Data products' : 'Analytics'],
    ['Workspace', 'Frequent student absence analysis', 'Recent analysis workspace', persona === 'partner' ? 'Secure workspace' : 'Workspace'],
  ]
  const results = all.filter(x => x.join(' ').toLowerCase().includes(query.toLowerCase()))
  return <div className="overlay" onMouseDown={onClose}><div className="search-dialog" onMouseDown={e => e.stopPropagation()}>
    <div className="search-dialog-input"><Icon name="search"/><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder={personaMeta[persona].search}/><button onClick={onClose}><Icon name="close"/></button></div>
    <div className="search-results">{results.map((r,i) => <button key={i} onClick={() => { onPick(r[3]); onClose() }}><div><Badge>{r[0]}</Badge><strong>{r[1]}</strong><span>{r[2]}</span></div><Icon name="chevron"/></button>)}</div>
  </div></div>
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

function HomeContext({ persona, star, onStart }) {
  const flow = experienceFlows[persona][star]
  const profile = userProfiles[persona]
  const items = recentItems[persona]
  const notice = notifications[persona]?.[0]
  const intro = {
    analyst: ['Analyse with trusted data', 'Start with trusted data or describe the analysis you are trying to perform. Your workspaces, approvals and definitions stay with you.'],
    business: ['Get to the answer', 'Use trusted dashboards, briefings and governed business questions without navigating technical datasets.'],
    system: ['Build against dependable data products', 'Discover contracts, manage subscriptions and integrate applications without depending on internal storage details.'],
    partner: ['Work within your approved purpose', 'Access approved projects and secure workspaces with controls that follow the data interaction.'],
  }[persona]
  const continuity = {
    analyst: [['Pending access','2'],['Saved analyses','5'],['Active workspaces','3']],
    business: [['Followed views','6'],['Saved questions','4'],['Briefings','2']],
    system: [['Subscriptions','4'],['Production consumers','3'],['Upcoming changes','1']],
    partner: [['Active projects','1'],['Reviews due','1'],['Days to expiry','164']],
  }[persona]
  return <div className="home-content">
    <PageHeader title={`Good evening, ${profile.name.split(' ')[0]}`} subtitle={profile.context} />
    <section className="home-hero">
      <div><div className="eyebrow">{star}★ EXPERIENCE</div><h2>{intro[0]}</h2><p>{intro[1]}</p></div>
      <Button kind="primary" onClick={onStart} icon="spark">{flow.entryLabel}</Button>
    </section>
    {notice && <div className={`attention-banner ${notice[3] || 'neutral'}`}><div className="attention-icon">{notice[3]==='warning'?'!':'✓'}</div><div><strong>{notice[1]}</strong><span>{notice[2]}</span></div><Button>View</Button></div>}
    <div className="home-section-title">Recently used</div>
    <div className="recent-grid">{items.map(([type,name,status]) => <button className="recent-card" key={name} onClick={onStart}><div className="recent-type">{type}</div><strong>{name}</strong><span>{status}</span></button>)}</div>
    <div className="home-grid home-grid-3">
      <div className="home-panel"><div className="panel-title">My Edu Hub</div>{continuity.map(([label,value])=><div className="activity-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
      <div className="home-panel"><div className="panel-title">Platform status</div><div className="status-line"><span className="status-dot ok"/>Certified data products operating normally</div><div className="status-line"><span className="status-dot warn"/>2 attendance source feeds delayed</div><div className="status-line"><span className="status-dot ok"/>Access services operating normally</div></div>
      <div className="home-panel"><div className="panel-title">Trust by default</div><div className="status-line"><Icon name="shield" size={13}/><span>Definitions, lineage and quality stay attached to use</span></div><div className="status-line"><Icon name="refresh" size={13}/><span>Changes are versioned and consumer impact checked</span></div><div className="status-line"><Icon name="check" size={13}/><span>Purpose and permissions are applied throughout</span></div></div>
    </div>
  </div>
}

function CatalogScreen({ screen, onNext }) {
  const [query, setQuery] = useState(screen.search || '')
  const products = screen.productIds.map(id => dataProducts[id]).filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()))
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Catalog']} />
    <div className="catalog-layout">
      <aside className="catalog-tree"><div className="catalog-filter"><Icon name="search"/><input placeholder="Filter"/></div><button className="tree-item active">Student</button><button className="tree-item">School</button><button className="tree-item">Staff</button><button className="tree-item">Finance</button></aside>
      <div className="catalog-main"><div className="catalog-toolbar"><div className="search-field"><Icon name="search"/><input value={query} onChange={e => setQuery(e.target.value)}/></div><Badge tone="neutral">{products.length} results</Badge></div>
      <div className="data-table"><div className="table-row table-head"><span>Name</span><span>Type</span><span>Owner</span><span>Freshness</span><span>Trust</span></div>{products.map((p,i) => <button className="table-row" key={p.id} onClick={i === 0 ? onNext : undefined}><span className="linkish">{p.name}</span><span>{p.type}</span><span>{p.owner}</span><span>{p.freshness}</span><span><Badge>{p.trust}</Badge></span></button>)}</div></div>
    </div>
    <ActionRow screen={screen} onNext={onNext}/>
  </div>
}

function AssetScreen({ screen, onNext, onBack }) {
  const p = dataProducts[screen.productId]
  const [tab,setTab] = useState('Overview')
  const tabs = ['Overview','Schema','Delivery','Versions','Consumers','Lineage','Quality','Access']
  return <div className="page-content"><PageHeader title={p.name} subtitle={p.description} breadcrumbs={['Catalog','Student',p.name]} actions={<><Button>{screen.secondaryLabel || 'Open in SQL'}</Button><Button kind="primary" onClick={onNext}>{screen.primaryLabel || 'Request access'}</Button></>} />
    <div className="badge-row"><Badge tone="purple">{p.type}</Badge><Badge>{p.lifecycle}</Badge><Badge>{p.version}</Badge><Badge>{p.trust}</Badge><Badge>{p.classification}</Badge></div>
    <div className="trust-banner"><div className="trust-icon"><Icon name="shield" size={18}/></div><div><strong>Trusted product</strong><span>Authoritative: {p.authoritative} · Last validated {p.lastValidated} · Changes are versioned and assessed against registered consumers.</span></div><Badge tone="success">Certified</Badge></div>
    <div className="meta-grid"><Meta label="Owner" value={p.owner}/><Meta label="Freshness" value={p.freshness}/><Meta label="Coverage" value={p.coverage}/><Meta label="Quality" value={p.quality}/></div>
    <div className="tabs scroll-tabs">{tabs.map(t => <button key={t} className={tab===t?'active':''} onClick={() => setTab(t)}>{t}</button>)}</div>
    <ProductTabContent p={p} tab={tab}/>
    <ActionRow screen={{}} onBack={onBack}/>
  </div>
}

function ProductTabContent({ p, tab }) {
  if (tab === 'Overview') return <div className="asset-layout"><div>
    <h3>What this product is for</h3><p className="body-copy">{p.definition}</p>
    <h3 className="section-title">Sample data</h3><SimpleTable columns={p.fields.slice(0,5).map(f=>f[0])} rows={p.sampleRows}/>
  </div><aside className="asset-aside"><Info label="Lifecycle" value={`${p.lifecycle} · ${p.version}`}/><Info label="Data steward" value={p.steward}/><Info label="Source" value={p.source}/><Info label="Approved use" value={p.allowedUse}/><Info label="Recommended join" value={p.id === 'attendance' ? 'Student Identity on student_id' : 'Use governed identifiers'}/></aside></div>
  if (tab === 'Schema') return <div className="product-tab"><div className="tab-intro"><div><h3>Schema</h3><p>Contracted fields with classification and validation expectations.</p></div><Badge>{p.version}</Badge></div><SimpleTable columns={['Field','Type','Description','Classification','Rule']} rows={p.fields}/><h3 className="section-title">Masked sample rows</h3><SimpleTable columns={p.fields.slice(0,5).map(f=>f[0])} rows={p.sampleRows}/></div>
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
function EmptyTab({name}) { return <div className="empty-tab"><Icon name="data" size={22}/><strong>{name}</strong><span>This prototype keeps the focus on the core journey. The production surface would expose the corresponding governed detail here.</span></div> }

function FormScreen({ screen, onNext, onBack }) {
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Requests','New']} />
    <div className="form-card">{screen.fields.map(([label,value],i) => <label className="form-field" key={label}><span>{label}</span>{i === 1 || value.length > 50 ? <textarea defaultValue={value}/> : <input defaultValue={value}/>}<small>{i===0 ? 'Use a clear purpose so policy and approvers can be determined.' : ''}</small></label>)}</div>
    <ActionRow screen={screen} onNext={onNext} onBack={onBack}/>
  </div>
}

function IntentScreen({ screen, onNext, onBack, loading }) {
  const [prompt,setPrompt] = useState(screen.prompt)
  return <div className="page-content intent-page"><PageHeader title="Home" />
    <div className="intent-card"><div className="intent-eyebrow"><span className="spark-icon">✦</span>{screen.eyebrow}</div><h2>{screen.title}</h2><p>{screen.subtitle}</p>
      <div className="prompt-box"><textarea value={prompt} onChange={e=>setPrompt(e.target.value)}/><div className="prompt-footer"><span>Uses approved data, policy and shared definitions</span><Button kind="primary" onClick={onNext} disabled={loading}>{loading ? 'Preparing…' : screen.primaryLabel}</Button></div></div>
      <div className="suggestion-row">{screen.suggestions?.map(s => <button key={s} onClick={() => setPrompt(s)}>{s}</button>)}</div>
    </div>
    <ActionRow screen={{}} onBack={onBack}/>
  </div>
}

function PlanScreen({ screen, onNext, onBack }) {
  const hasFrequent = JSON.stringify(screen.rows).toLowerCase().includes('frequent absence')
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Edu Hub',screen.title]} />
    {hasFrequent && <div className="definition-callout"><div><strong>Frequent absence rate</strong><span>{metrics.frequentAbsence.description}</span></div><Button>Definition details</Button></div>}
    <div className="plan-layout"><div className="plan-table">{screen.rows.map(([label,value,note,status]) => <div className="plan-row" key={label+value}><div className="plan-label">{label}</div><div><strong>{value}</strong><span>{note}</span></div><Badge>{status}</Badge></div>)}</div>
    <aside className="summary-panel"><h3>Review</h3>{screen.checks?.map(([label,value]) => <div className="summary-line" key={label}><span>{label}</span><Badge>{value}</Badge></div>)}</aside></div>
    <ActionRow screen={screen} onNext={onNext} onBack={onBack}/>
  </div>
}

function ProgressScreen({ screen, onNext, onBack, loading }) {
  const [done,setDone] = useState(Math.min(2, screen.tasks.length))
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

function WorkspaceScreen({ screen, onBack }) {
  return <div className="page-content workspace-page"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Workspace',screen.title]} actions={<><Button>Share</Button><Button kind="primary">Run all</Button></>} />
    <TransparencyControls mode="analysis" />
    <div className="editor-shell"><aside className="editor-left"><div className="editor-panel-head">Analysis assets <span>＋</span></div><button className="editor-file active">01_analysis.sql</button><button className="editor-file">02_breakdown.sql</button><button className="editor-file">Definitions</button><button className="editor-file">Lineage</button></aside>
    <main className="editor-main"><div className="editor-toolbar"><Button kind="primary">Run</Button>{screen.badges?.map(b => <Badge key={b}>{b}</Badge>)}<span className="saved-state">Saved just now</span></div><pre className="code-editor">{screen.code}</pre><div className="editor-results">{screen.chart ? <BarChart name={screen.chart}/> : screen.resultRows ? <SimpleTable columns={screen.resultColumns} rows={screen.resultRows}/> : <div className="result-placeholder">Run the analysis to refresh results.</div>}</div></main>
    <aside className="assistant-panel"><div className="editor-panel-head">Genie Code</div><div className="assistant-message">{screen.assistant}</div><div className="assistant-message user">Explain the assumptions behind this analysis.</div><div className="assistant-input">Ask about this analysis…</div></aside></div>
    <ActionRow screen={{}} onBack={onBack}/>
  </div>
}

function DiscoverScreen({ screen, onNext, onBack }) {
  const [q,setQ] = useState(screen.search)
  const items = screen.items.filter(x => x.join(' ').toLowerCase().includes(q.toLowerCase()))
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Analytics']} />
    <div className="wide-search"><Icon name="search"/><input value={q} onChange={e=>setQ(e.target.value)}/></div>
    <h3 className="section-title">Results</h3><div className="asset-card-grid">{items.map((item,i) => <button className="asset-card" key={item[1]} onClick={i===0?onNext:undefined}><div className="asset-type">{item[0]}</div><strong>{item[1]}</strong><p>{item[2]}</p><Badge>{item[3]}</Badge></button>)}</div>
    <ActionRow screen={screen} onNext={onNext} onBack={onBack}/>
  </div>
}

function DashboardDetail({ screen, onNext, onBack }) {
  const d = dashboards.attendanceOverview
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Analytics','Dashboards',d.name]} actions={<Button kind="primary" onClick={onNext}>{screen.primaryLabel}</Button>} />
    <div className="badge-row"><Badge tone="purple">Dashboard</Badge><Badge>Trusted</Badge><Badge>Daily</Badge></div>
    <div className="meta-grid"><Meta label="Owner" value={d.owner}/><Meta label="Updated" value={d.updated}/><Meta label="Audience" value="HQ officers"/><Meta label="Definition set" value={d.definition}/></div>
    <div className="definition-callout"><div><strong>Frequent absence rate</strong><span>{metrics.frequentAbsence.description}</span></div><Badge tone="purple">{metrics.frequentAbsence.version}</Badge></div>
    <div className="preview-card"><div className="preview-label">Preview</div><div className="metric-grid"><Metric label="Attendance rate" value="92.8%"/><Metric label="Students with frequent absence" value="4.7%"/><Metric label="Schools above threshold" value="12"/></div><BarChart name="monthly"/></div>
    <ActionRow screen={{}} onBack={onBack}/>
  </div>
}

function Metric({label,value}) { return <div className="metric-card"><span>{label}</span><strong>{value}</strong></div> }

function DashboardScreen({ screen, onBack }) {
  const mentionsFrequent = JSON.stringify(screen).toLowerCase().includes('frequent absence')
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Analytics',screen.title]} actions={<><Button>Export</Button><Button>Share</Button></>} />
    {mentionsFrequent && <div className="definition-callout"><div><strong>What “frequent absence” means here</strong><span>{metrics.frequentAbsence.description}</span></div><Button>View definition</Button></div>}
    <div className="metric-grid metric-grid-4">{screen.metrics.map(([l,v]) => <Metric key={l} label={l} value={v}/>)}</div>
    <div className="dashboard-layout"><div className="chart-card"><h3>Trend</h3><BarChart name={screen.chart}/></div><div className="table-card"><h3>Highlights</h3><SimpleTable columns={['Item','Change']} rows={screen.table}/></div></div>
    <ActionRow screen={{}} onBack={onBack}/>
  </div>
}

function RecommendationsScreen({ screen, onNext, onBack }) {
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Edu Hub','Recommendations']} />
    <div className="asset-card-grid">{screen.items.map((item,i)=><button className={`asset-card ${i===0?'recommended':''}`} key={item[1]} onClick={i===0?onNext:undefined}><div className="asset-type">{item[0]}</div><strong>{item[1]}</strong><p>{item[2]}</p><Badge>{item[3]}</Badge></button>)}</div>
    <ActionRow screen={screen} onNext={onNext} onBack={onBack}/>
  </div>
}

function TransparencyControls({ mode = 'answer' }) {
  const [open,setOpen] = useState(null)
  const content = {
    why: mode === 'answer'
      ? 'The result is based on the largest term-on-term change using a governed attendance measure, with delayed feeds prevented from being presented as current.'
      : 'The analysis plan uses the minimum fields required for the question and a governed join between Student Attendance and Student Identity.',
    data: 'Student Attendance v2.3 and Student Identity v1.8. Both are certified Standard Data Products with current lineage and quality status.',
    assumptions: `Frequent absence rate uses the prototype rule: students absent on 10% or more instructional days in the selected period. Two delayed school feeds are excluded from strong current-period conclusions.`,
  }
  const buttons = [['why', mode === 'answer' ? 'Why this answer?' : 'Why this analysis?'],['data','What data was used?'],['assumptions','Show assumptions']]
  return <div className="transparency-wrap"><div className="transparency-actions">{buttons.map(([key,label])=><button key={key} className={open===key?'active':''} onClick={()=>setOpen(open===key?null:key)}>{label}</button>)}</div>{open && <div className="transparency-drawer"><div><Icon name="shield" size={17}/></div><div><strong>{buttons.find(b=>b[0]===open)?.[1]}</strong><p>{content[open]}</p></div><button onClick={()=>setOpen(null)} aria-label="Close"><Icon name="close" size={14}/></button></div>}</div>
}

function AnswerScreen({ screen, onNext, onBack }) {
  return <div className="page-content"><PageHeader title={screen.title} breadcrumbs={['Edu Hub',screen.title]} />
    <TransparencyControls mode="answer" />
    <div className="answer-layout"><main className="answer-card"><h2>{screen.headline}</h2><p>{screen.body}</p><div className="metric-grid metric-grid-3">{screen.metrics.map(([l,v]) => <Metric key={l} label={l} value={v}/>)}</div>{screen.chart && <BarChart name={screen.chart}/>}</main>
    <aside className="evidence-panel"><h3>Evidence & context</h3>{screen.evidence.map(([l,v]) => <div className="evidence-row" key={l}><strong>{l}</strong><span>{v}</span></div>)}</aside></div>
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

function ContractScreen({ screen, onNext, onBack }) {
  const p = dataProducts[screen.productId]
  const [tab,setTab] = useState('Contract')
  const tabs = ['Contract','Schema','Delivery','Versions','Consumers']
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Data products',p.name]} />
    <div className="badge-row"><Badge tone="purple">API-ready</Badge><Badge>{p.lifecycle}</Badge><Badge>{p.version}</Badge><Badge>{p.trust}</Badge><Badge>{p.classification}</Badge></div>
    <div className="meta-grid"><Meta label="Freshness" value={p.freshness}/><Meta label="SLO" value="99.5% delivery"/><Meta label="Owner" value={p.owner}/><Meta label="Compatibility" value="Backward compatible within major version"/></div>
    <div className="tabs scroll-tabs">{tabs.map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
    {tab === 'Contract' ? <div className="contract-overview"><div className="panel-card"><h3>Business contract</h3><div className="contract-key"><span>Product</span><strong>{p.name} {p.version}</strong></div><div className="contract-key"><span>Promise</span><strong>Stable attendance semantics independent of storage or platform implementation</strong></div><div className="contract-key"><span>Change policy</span><strong>Breaking changes require a new major version and consumer impact review</strong></div><div className="contract-key"><span>Freshness</span><strong>{p.freshness}</strong></div></div><aside className="summary-panel"><h3>Contract health</h3><div className="summary-line"><span>Registered consumers</span><strong>{p.consumers.length}</strong></div><div className="summary-line"><span>Latest quality</span><Badge>{p.quality}</Badge></div><div className="summary-line"><span>Last validated</span><strong>{p.lastValidated}</strong></div><div className="summary-line"><span>Lifecycle</span><Badge>{p.lifecycle}</Badge></div></aside></div> : <ProductTabContent p={p} tab={tab}/>} 
    <ActionRow screen={screen} onNext={onNext} onBack={onBack}/>
  </div>
}

function ProjectsScreen({ screen, onNext, onBack }) {
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Partner access']} actions={<Button kind="primary" icon="plus">New project</Button>} />
    <div className="asset-card-grid">{screen.projects.map((p,i)=><button className="asset-card" key={p[0]} onClick={i===0?onNext:undefined}><div className="asset-type">{p[1]}</div><strong>{p[0]}</strong><p>{p[2]}</p><Badge>{p[3]}</Badge></button>)}</div><ActionRow screen={screen} onNext={onNext} onBack={onBack}/></div>
}

function ControlledScreen({ screen, onBack }) {
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Partner access',screen.title]} />
    <div className="metric-grid metric-grid-4">{screen.metrics.map(([l,v]) => <Metric key={l} label={l} value={v}/>)}</div>
    <div className="dashboard-layout"><div className="chart-card"><h3>Approved analysis</h3><BarChart name={screen.chart}/></div><aside className="evidence-panel"><h3>Workspace controls</h3>{screen.controls.map(([l,v])=><div className="evidence-row" key={l}><strong>{l}</strong><span>{v}</span></div>)}</aside></div><ActionRow screen={{}} onBack={onBack}/></div>
}

function ConversationScreen({ screen, onBack }) {
  return <div className="page-content"><PageHeader title={screen.title} subtitle={screen.subtitle} breadcrumbs={['Briefings',screen.title]} />
    <div className="conversation-layout"><div className="conversation-card">{screen.messages.map(([who,msg],i)=><div key={i} className={`chat-message ${who}`}><div className="chat-avatar">{who==='user'?'JC':'✦'}</div><div>{msg}</div></div>)}<div className="chat-compose">Ask a follow-up…</div></div><aside className="summary-panel"><h3>Conversation context</h3>{screen.context.map(([l,v])=><div className="summary-line" key={l}><span>{l}</span><strong>{v}</strong></div>)}</aside></div><ActionRow screen={{}} onBack={onBack}/></div>
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
    <div className="definition-callout"><div><strong>Why this matters</strong><span>Higher-star experience does not hide failures. It detects them early, makes the impact explicit and offers a safe recovery path.</span></div><Badge tone="warning">Degraded</Badge></div>
    <ActionRow screen={screen} onNext={onNext} onBack={onBack}/>
  </div>
}

function GovernanceScreen({ onBack }) {
  return <div className="page-content"><PageHeader title="Data owner & governance backstage" subtitle="The operating layer behind the consumer experience. This is a prototype backstage view, not a fifth consumer persona." breadcrumbs={['Platform','Governance']} />
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

function renderScreen(screen, props) {
  const map = {
    catalog: CatalogScreen,
    asset: AssetScreen,
    form: FormScreen,
    intent: IntentScreen,
    plan: PlanScreen,
    progress: ProgressScreen,
    workspace: WorkspaceScreen,
    discover: DiscoverScreen,
    dashboardDetail: DashboardDetail,
    dashboard: DashboardScreen,
    recommendations: RecommendationsScreen,
    answer: AnswerScreen,
    table: TableScreen,
    api: ApiScreen,
    contract: ContractScreen,
    projects: ProjectsScreen,
    controlled: ControlledScreen,
    conversation: ConversationScreen,
    consumerHealth: ConsumerHealth,
    change: ChangeScreen,
    incident: IncidentScreen,
    governance: GovernanceScreen,
  }
  const Component = map[screen.kind] || TableScreen
  return <Component screen={screen} {...props}/>
}

function manualScreenFor(persona, label) {
  if (/governance/i.test(label)) return { kind:'governance', title:'Governance' }
  if (/home/i.test(label)) return null
  if (/data product/i.test(label)) return experienceFlows.analyst[5].screens[0]
  if (/analytics|insights|dashboards/i.test(label)) return experienceFlows.business[5].screens[2]
  if (/workspace/i.test(label) && persona !== 'partner') return experienceFlows.analyst[7].screens[3]
  if (/request/i.test(label)) return experienceFlows.analyst[5].screens[2]
  if (/developer|consumer|subscription/i.test(label)) return experienceFlows.system[5].screens[0]
  if (/project/i.test(label)) return experienceFlows.partner[7].screens[0]
  if (/secure workspace/i.test(label)) return experienceFlows.partner[9].screens[2]
  if (/agreement/i.test(label)) return { kind:'table', title:'Agreements', subtitle:'Data-sharing agreements for your organisation.', columns:['Agreement','Purpose','Status','Expiry'], rows:[['DSA-2041','Programme evaluation','Active','24 Mar 2027'],['DSA-1978','Research collaboration','Pending','—']] }
  if (/ask edu hub/i.test(label)) return experienceFlows.business[9].screens[0]
  if (/saved views/i.test(label)) return { kind:'discover', title:'Saved views', subtitle:'Dashboards and insights you have saved.', search:'', items:[['Dashboard','Student Attendance Overview','School and cohort attendance trends.','Trusted'],['Explorer','Students Missing School Frequently','Saved business explorer with governed definition.','Trusted']] }
  return { kind:'table', title:label, subtitle:'Prototype module.', columns:['Item','Status'], rows:[['Example item','Available']] }
}

function App() {
  const [loggedIn,setLoggedIn] = useState(() => localStorage.getItem('eh_logged_in') === '1')
  const [persona,setPersona] = useState(() => localStorage.getItem('eh_persona') || 'analyst')
  const [star,setStar] = useState(() => Number(localStorage.getItem('eh_star')) || 7)
  const [step,setStep] = useState(0)
  const [journey,setJourney] = useState(false)
  const [activeNav,setActiveNav] = useState('Home')
  const [manualView,setManualView] = useState(null)
  const [searchOpen,setSearchOpen] = useState(false)
  const [loading,setLoading] = useState(false)

  useEffect(() => { localStorage.setItem('eh_persona',persona) }, [persona])
  useEffect(() => { localStorage.setItem('eh_star',String(star)) }, [star])
  useEffect(() => {
    const handler = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true) } }
    window.addEventListener('keydown',handler); return () => window.removeEventListener('keydown',handler)
  },[])

  const flow = experienceFlows[persona][star]
  const screen = flow.screens[step] || flow.screens[0]

  const login = () => { localStorage.setItem('eh_logged_in','1'); setLoggedIn(true) }
  const logout = () => { localStorage.removeItem('eh_logged_in'); setLoggedIn(false); setJourney(false); setStep(0) }
  const reset = () => { setStep(0); setJourney(false); setManualView(null); setActiveNav('Home') }
  const changePersona = (p) => { setPersona(p); setStep(0); setJourney(false); setManualView(null); setActiveNav('Home') }
  const changeStar = (s) => { setStar(s); setStep(0); setJourney(false); setManualView(null); setActiveNav('Home') }
  const startJourney = () => { setJourney(true); setManualView(null); setStep(0); setActiveNav(personaMeta[persona].nav[0]) }
  const next = () => {
    if (loading) return
    if (step >= flow.screens.length - 1) { setStep(0); setJourney(false); setActiveNav('Home'); return }
    const current = flow.screens[step]
    if (['intent','progress'].includes(current.kind)) {
      setLoading(true)
      setTimeout(() => { setLoading(false); setStep(s => s + 1) }, current.kind === 'intent' ? 800 : 650)
    } else setStep(s => s + 1)
  }
  const back = () => {
    if (manualView) { setManualView(null); setActiveNav('Home'); return }
    if (step > 0) setStep(s => s - 1)
    else { setJourney(false); setActiveNav('Home') }
  }
  const onNav = (label) => {
    setActiveNav(label)
    const manual = manualScreenFor(persona,label)
    if (!manual) { setManualView(null); setJourney(false); setStep(0) }
    else { setManualView(manual); setJourney(false) }
  }

  if (!loggedIn) return <Login onLogin={login}/>

  return <div className="app-shell">
    <Topbar persona={persona} onSearch={() => setSearchOpen(true)} onLogout={logout}/>
    <Sidebar persona={persona} activeNav={activeNav} onNav={onNav}/>
    <main className="main-area">
      {manualView ? renderScreen(manualView,{onNext:()=>{},onBack:back,loading:false}) : journey ? renderScreen(screen,{onNext:next,onBack:back,loading,atEnd:step===flow.screens.length-1}) : <HomeContext persona={persona} star={star} onStart={startJourney}/>} 
    </main>
    <PrototypeControl persona={persona} star={star} onPersona={changePersona} onStar={changeStar} onReset={reset} onBackstage={() => onNav('Governance')}/>
    {searchOpen && <SearchOverlay persona={persona} onClose={() => setSearchOpen(false)} onPick={onNav}/>} 
  </div>
}

export default App
