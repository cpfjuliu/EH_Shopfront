import { dashboardRows, resultRecords, reproducibleSQL } from './resultsModel.js'



const analyst = [

  ['maths','Mathematics year-on-year decline','Mathematics','school'],

  ['english','English year-on-year change','English','school'],

  ['schools','Compare Mathematics results by school','Mathematics','school'],

  ['levels','Compare Mathematics results by level','Mathematics','level'],

].map(([id,prompt,subject,group])=>({id,prompt,goal:prompt,subject,group,

  data:`Student Academic Results v1.2 · ${subject} · 2025 and 2026`,

  method:id==='maths'?'Rank Mathematics year-on-year declines by school; equally weighted synthetic cohorts.':`Compare ${subject} pass rates by ${group}; equally weighted synthetic cohorts.`,

  assumptions:group==='level'?'Equal school weights within each level; no causal attribution.':'Same assessment basis; school cohorts can differ between years.',

  response:id==='schools'?'School comparison: eight current schools, 2025 and 2026 pass rates side by side; missing schools are excluded.':subject==='English'?'English improved from 85% to 88% (+3 pp); the fixture does not show a decline.':group==='level'?'Secondary 2 declined 7 pp; Secondary 1 declined 2 pp.':'Mathematics declined in eight schools; School A has the largest decline (8 pp).',

}))

const system = [

  {id:'api',prompt:'Daily results via API',delivery:'REST API',environment:'Registered workload',freshness:'Daily by 6 PM',fallback:24},

  {id:'batch',prompt:'Daily results by batch delivery',delivery:'Managed file',environment:'Approved batch consumer',freshness:'Daily file at 6:15 PM',fallback:24},

  {id:'nonaws',prompt:'Daily results for a non-AWS consumer',delivery:'REST API over HTTPS',environment:'Non-AWS consumer',freshness:'Daily by 6 PM',fallback:24},

  {id:'fresh',prompt:'Results refreshed every hour',delivery:'No compatible subscription',environment:'Registered workload',freshness:'Hourly required; source is daily',fallback:0,unmet:true},

].map(s=>({...s,goal:s.prompt,data:'Student Academic Results v1.2 · four contracted fields + validation metadata',method:`${s.delivery}; ${s.freshness}.`,assumptions:s.unmet?'An API cannot make the daily source hourly. No subscription or scaffold will be provisioned.':`${s.environment}; approved workload identity required; last-known-good data at most 24 hours old.`,response:s.unmet?'Requirement not met: this source cannot satisfy hourly freshness. Choose the daily example or discuss a different source with the owner.':`${s.delivery} contract proposed for ${s.environment.toLowerCase()}.`}))

const partner = [

  {id:'evaluation',prompt:'Evaluate academic outcomes for programme participants',method:'Compare participant and comparison-cohort change, 2025–2026.',response:'Participants +4 pp; comparison cohort +1 pp. The 3 pp difference in changes is descriptive, not causal.'},

  {id:'aggregate',prompt:'Aggregate comparison only',method:'Return cohort-level changes only; no participant package.',response:'Approved aggregate: participant change +4 pp and comparison change +1 pp; raw and participant-level exports unavailable.'},

  {id:'pseudo',prompt:'Pseudonymous participant analysis',method:'Inspect project-scoped tokens, level and results band inside the controlled workspace.',response:'A minimum pseudonymous package is available after field approval; it cannot establish programme impact.',subset:true},

].map(s=>({...s,goal:s.prompt,data:s.subset?'Project-scoped participant token, level and results band':'Approved aggregate comparison · synthetic programme fixture',assumptions:s.subset?'Tokens are project-scoped; no direct identifiers, raw marks or cross-project joins.':'Groups of at least 10; baseline rates and actual cohort counts are not supplied by this fixture.'}))

export const intentScenarios={analyst,system,partner}

const normalize=value=>value.trim().toLowerCase().replace(/[?.!]+$/g,'').replace(/\s+/g,' ')

const aliases={

  analyst:{'which subjects show the largest year-on-year decline':'maths','maths year-on-year decline':'maths','english year-on-year decline':'english','results by school':'schools','results by level':'levels'},

  system:{'our application needs student academic results daily, runs outside aws, and requires student_id, subject, academic_year and passed. serve last-known-good data for up to 24 hours during delays; fail closed after that':'nonaws'},

  partner:{'evaluate whether a programme improves academic outcomes':'evaluation','programme evaluation':'evaluation'},

}

export function interpretIntent(persona,value){

  if(typeof value!=='string')return null

  const q=normalize(value),id=aliases[persona]?.[q]

  return intentScenarios[persona]?.find(s=>normalize(s.prompt)===q||s.id===id)||null

}

export function getScenario(persona,id){return intentScenarios[persona]?.find(s=>s.id===id)||null}

export function scenarioRequirements(config,screen,scenario,requirements){

  if(config.persona==='partner'&&config.star===9&&scenario?.subset&&['controlled','plan'].includes(screen.kind))return {results:['participant_token','level','results_band']}

  return requirements

}

export function scenarioScreen(screen,config,scenario,analysisLevel='All levels'){

  if(config.star!==9||!scenario)return screen

  const s=config.persona==='analyst'&&analysisLevel!=='All levels'?{...scenario,data:scenario.data+' · '+analysisLevel,method:scenario.method+' Scope: '+analysisLevel+'.',response:`${analysisLevel}: ${scenario.subject} comparison. Inspect the scoped school/level preview; all-level conclusions do not apply.`}:scenario

  if(screen.kind==='plan')return {...screen,subtitle:s.goal,rows:[['Interpreted goal',s.goal,'Supported prototype scenario','Understood'],['Data',s.data,'Approved scope only','Scoped'],['Method',s.method,s.assumptions,'Review'],['Response',s.response,'Synthetic example; no arbitrary reasoning',s.unmet?'Unavailable':'Ready']],checks:[],primaryLabel:s.unmet?null:screen.primaryLabel}

  if(config.persona==='analyst'&&screen.kind==='workspace'){

    const rows=s.group==='school'?dashboardRows(s.subject,analysisLevel,'All schools'):['Secondary 1','Secondary 2'].filter(level=>analysisLevel==='All levels'||analysisLevel===level).map(level=>{const records=resultRecords.filter(r=>r.subject===s.subject&&r.level===level);const prior=records.reduce((n,r)=>n+r.previous,0)/records.length;const current=records.reduce((n,r)=>n+r.current,0)/records.length;return [level,`${prior.toFixed(1)}%`,`${current.toFixed(1)}%`,`${(current-prior).toFixed(1)} pp`]})

    const base=reproducibleSQL.slice(0,reproducibleSQL.indexOf('SELECT current.school_code')).replace("AND result_status = 'FINAL'",`AND result_status = 'FINAL'\n    AND subject = '${s.subject}'`)

    const key=s.group==='level'?'level':'school_code'

    const code=base+`-- Equal weights across the matched synthetic school/level rates.

SELECT current.${key}, AVG(prior.pass_rate) AS prior_rate,

  AVG(current.pass_rate) AS current_rate,

  AVG(current.pass_rate - prior.pass_rate) AS change_pp

FROM rates current JOIN rates prior

  ON current.school_code = prior.school_code AND current.subject = prior.subject

  AND current.level = prior.level AND prior.academic_year = 2025

WHERE current.academic_year = 2026

GROUP BY current.${key}

ORDER BY ${s.id==='maths'?'change_pp':`current.${key}`};`

    return {...screen,scopedFixture:true,title:s.goal,subtitle:s.response,code,chart:null,resultColumns:[s.group==='level'?'Level':'School','2025','2026','Change'],resultRows:rows,assistant:s.method+' '+s.assumptions}



  }

  if(config.persona==='system'&&screen.kind==='api')return {...screen,title:s.delivery+' integration',subtitle:s.goal,code:s.id==='batch'?'# Synthetic delivery manifest; no files are delivered\nroute: managed-file\nschedule: daily 18:15\nfields: student_id, subject, academic_year, passed\nvalidate: schema_version, validated_at, entitlement\nreject: expired entitlement or age > 24h\nrecovery: retry after source validation':screen.code+`\n// Consumer: ${s.environment}\n// Delivery: ${s.delivery}`,facts:[['Delivery',s.delivery],['Consumer',s.environment],['Freshness',s.freshness],['Failure policy','Deny expired access; reject >24h']]}

  if(config.persona==='system'&&screen.kind==='contractTests')return {...screen,subtitle:s.goal,delivery:s.delivery}

  if(config.persona==='partner'&&['controlled','plan'].includes(screen.kind))return {...screen,title:s.goal,subtitle:s.response,subset:!!s.subset,scenario:s}

  return screen

}
