import { experienceFlows } from './experienceFlows.js'

export const personas = ['business', 'analyst', 'system', 'partner']
export const stars = [5, 7, 9, 11]

// Explicit interaction models, not an additive feature ladder. Nothing in this
// file grants access to another persona's flow, even when a renderer is shared.
const definitions = {
  business: {
    5: { label:'Trusted dashboards', search:'Find trusted dashboards and reports…', features:['dashboardFilters'], recent:'Student Academic Results dashboard' },
    7: { label:'Prepare a business view', search:'Find your prepared business view…', features:['dashboardFilters','guidedNeed'] },
    9: { label:'Ask Edu Hub', search:'Find evidence for your question…', features:['businessQuestions'] },
    11:{ label:'Results briefing', search:'Find supporting briefing evidence…', features:['businessQuestions','proactiveBriefing'], supportingDashboard:true },
  },
  analyst: {
    5: { label:'Data products', search:'Find Results data products…', features:['productDetails','manualSql','sampleSql'], recent:'Student Academic Results SDP', productLibrary:true },
    7: { label:'Analysis setup', search:'Find your analysis setup…', features:['productDetails','starterSql','guidedNeed'] },
    9: { label:'Analytical question', search:'Find your analytical method…', features:['productDetails','starterSql','methodOverride'] },
    11:{ label:'Analysis briefing', search:'Find evidence and reproducible analysis…', features:['productDetails','starterSql','proactiveBriefing'], productEvidence:true },
  },
  system: {
    5: { label:'Data contracts', search:'Find business data contracts…', features:['contractDetails','manualDelivery'], recent:'Student Academic Results contract' },
    7: { label:'Application setup', search:'Find your application setup…', features:['contractDetails','guidedNeed'] },
    9: { label:'Service requirement', search:'Find your consumer contract…', features:['contractDetails','generatedContract','contractTests'] },
    11:{ label:'Contract health', search:'Find compatibility and consumer impact…', features:['contractDetails','consumerImpact'] },
  },
  partner: {
    5: { label:'Approved data request', search:'Find your approved project request…', features:['projectRequest','controlledAccess'], recent:'Student Support Programme request' },
    7: { label:'Project setup', search:'Find your approved project package…', features:['guidedNeed','controlledAccess'] },
    9: { label:'Minimum data interaction', search:'Find purpose and minimisation controls…', features:['dataMinimisation','controlledAccess'] },
    11:{ label:'Approved outcome', search:'Find evidence for your approved outcome…', features:['approvedOutcome','controlledAccess'] },
  },
}

function createExperience(persona, star, definition) {
  const scope = `${persona}/${star}`
  const screens = experienceFlows[persona][star].screens
  const routes = Object.fromEntries(screens.map((screen, index) => [`step-${index}`, {
    id:`step-${index}`, scope, screen, public:index===0,
    next:index<screens.length-1 ? `step-${index+1}` : null,
  }]))
  routes.evidence = { id:'evidence', scope, public:true, screen:{kind:'scopeEvidence',title:persona==='partner'?'Purpose, evidence & controls':'Definitions, evidence & quality',persona} }
  routes.help = { id:'help', scope, public:true, screen:{kind:'experienceHelp',title:'Help & scope',description:experienceFlows[persona][star].entryLabel} }
  if (definition.productLibrary) for (const productId of ['identity','attendance']) routes[`product-${productId}`]={id:`product-${productId}`,scope,public:true,screen:{kind:'asset',productId,readOnly:true}}
  if (definition.supportingDashboard) routes['supporting-dashboard'] = {id:'supporting-dashboard',scope,public:true,screen:{...screens.find(s=>s.kind==='resultsDashboard'),kind:'resultsDashboard',title:'Supporting Results dashboard',subtitle:'Verify your briefing · same authorised scope and comparison period',prepared:true}}
  if (definition.productEvidence) routes['source-product'] = {id:'source-product',scope,public:true,screen:{kind:'asset',productId:'results',readOnly:true}}
  const actions = [
    {id:'evidence',label:persona==='partner'?'Inspect purpose & controls':'Inspect evidence & quality',route:'evidence',placement:'context'},
    ...(definition.supportingDashboard ? [{id:'supporting-dashboard',label:'View supporting dashboard',route:'supporting-dashboard',placement:'context'}] : []),
    ...(definition.productEvidence ? [{id:'source-product',label:'Inspect underlying SDP',route:'source-product',placement:'context'}] : []),
  ]
  const notification = persona==='partner'
    ? {title:'Project access review due in 45 days',copy:'Sponsor confirmation and approved purpose remain required.',route:'evidence'}
    : persona==='system'
      ? {title:'Results freshness notice',copy:'Two school submissions are delayed. Inspect the contract treatment.',route:'evidence'}
      : {title:'Two Results submissions are delayed',copy:'Inspect coverage and permitted use before interpreting comparisons.',route:'evidence'}
  return {
    scope, persona, star, landing:'step-0', routes,
    features:definition.features,
    navigation:[{label:definition.label,route:'step-0',icon:persona==='system'?'code':persona==='partner'?'folder':persona==='analyst'?'data':'chart'}],
    searchPlaceholder:definition.search,
    // No generic persona-wide recent cards, counters or quick actions.
    home:{primary:'step-0',modules:['primary'],cards:definition.recent?[{label:definition.recent,route:'step-0'}]:[]},
    actions,
    search:[{label:definition.label,description:'Student Academic Results · your current experience',route:'step-0'},...actions.filter(a=>a.id==='evidence').map(a=>({label:a.label,description:'Definitions, scope and limitations',route:a.route})),...(definition.productLibrary?[{label:'Student Identity',description:'Reference SDP details',route:'product-identity'},{label:'Student Attendance',description:'Reference SDP details',route:'product-attendance'}]:[])],
    notifications:[notification],
    quickActions:[],
  }
}

export const experienceCapabilities = Object.fromEntries(personas.map(persona=>[
  persona, Object.fromEntries(stars.map(star=>[star,createExperience(persona,star,definitions[persona][star])])),
]))

export function getExperience(persona, star) {
  return personas.includes(persona) && stars.includes(Number(star)) ? experienceCapabilities[persona][Number(star)] : experienceCapabilities.analyst[7]
}
export function hasCapability(config, feature) { return config.features.includes(feature) }
export function routeHash(config, route) { return `#/${config.scope}/${route}` }
export function parseRoute(config, hash) {
  const match = /^#\/([^/]+)\/(\d+)\/([a-z0-9-]+)$/.exec(hash)
  return match && `${match[1]}/${match[2]}`===config.scope && Object.hasOwn(config.routes,match[3]) ? match[3] : config.landing
}
export function createJourney(config) {
  return {scope:config.scope,route:config.landing,unlocked:[config.landing],trail:[],question:'',analysisLevel:'All levels',delivery:'REST API',historyMode:'replace'}
}
export function canVisit(config, state, route) {
  return state.scope===config.scope && Object.hasOwn(config.routes,route) && (config.routes[route].public || state.unlocked.includes(route))
}

// Both route navigation and actions pass through this reducer. A stale callback
// must match the current scope AND originating route. URL inputs never set either
// simulated identity dimension or grant a journey prerequisite.
export function transition(config, state, action) {
  if (action.scope!==config.scope || state.scope!==config.scope) return state
  if (action.source && action.source!==state.route) return state
  if (action.type==='QUESTION') return hasCapability(config,'businessQuestions') && typeof action.value==='string' ? {...state,question:action.value} : state
  if (action.type==='LEVEL') return hasCapability(config,'methodOverride') && ['All levels','Secondary 1','Secondary 2'].includes(action.value) ? {...state,analysisLevel:action.value} : state
  if (action.type==='DELIVERY') return hasCapability(config,'manualDelivery') && ['REST API','Direct query','Managed file'].includes(action.value) ? {...state,delivery:action.value} : state
  if (action.type==='NEXT') {
    const next=config.routes[state.route]?.next
    if (!next || (config.routes[state.route].screen.businessQuestion && !state.question.trim())) return state
    return {...state,route:next,unlocked:[...new Set([...state.unlocked,next])],trail:[...state.trail,state.route],historyMode:'push'}
  }
  if (action.type==='BACK') {
    const route=state.trail.at(-1)||config.landing
    return {...state,route,trail:state.trail.slice(0,-1),historyMode:'push'}
  }
  if (action.type==='NAVIGATE' || action.type==='HISTORY') {
    const route=canVisit(config,state,action.route)?action.route:config.landing
    return {...state,route,trail:action.type==='HISTORY'?[]:[...state.trail,state.route],historyMode:action.type==='HISTORY'?'replace':'push'}
  }
  return state
}
