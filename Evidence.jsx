import React from 'react'
import { useAccess } from './AccessExperience.jsx'
import { hasRequirements } from './accessModel.js'
import { dataProducts } from './mockData.js'
import { resultsContext } from './resultsModel.js'

export function EvidenceContent(){
  const {config,access,activeScenario,analysisLevel,requirements,evidenceContext,evidenceProductId}=useAccess()
  const p=dataProducts[evidenceProductId]||dataProducts.results,partner=config.persona==='partner',analyst=config.persona==='analyst',developer=config.persona==='system'
  const allowed=hasRequirements(access,requirements||config.requiredAccess)
  const rows=p.id!=='results'?[
    ['Source / SDP',p.source+' → '+p.name+' '+p.version],['Owner',p.owner],
    ['Refresh',p.freshness+' · fixture validation '+p.lastValidated+' (simulated)'],
    ['Coverage / quality',p.coverage+' · '+p.quality],['Definition',p.definition],
    ['Sensitivity / permitted use',p.classification+' · '+p.allowedUse],
    ['Lineage',p.lineage.map(row=>row.slice(0,3).join(' · ')).join(' → ')],
    ['Limitations','Synthetic product metadata; result-specific calculations are not available for this dataset.'],
  ]:partner?[
    ['Source / version','Approved programme aggregate fixture, 2025–2026. A versioned partner source extract is not supplied.'],
    ['Refresh / coverage','Refresh timestamp and actual cohort counts are unavailable in this prototype. Disclosure threshold: at least 10 per group.'],
    ['Owner / permitted use',p.owner+' · approved academic programme evaluation; MOE sponsor renewal required after 180 days.'],
    ['Method',activeScenario?.method||'Compare participant and comparison-cohort pass-rate changes over the same 2025–2026 period.'],
    ['Calculation',allowed?(activeScenario?.subset?'Project-scoped sample: token, level and band only; no impact estimate.':'Participant change +4 pp minus comparison change +1 pp = 3 pp difference in changes. Baseline rates, denominators and matching diagnostics are not supplied; independent recomputation is unavailable.'):'Result-specific calculations are unavailable until project access is approved.'],
    ['Quality / caveats','Synthetic illustration, not a verified programme evaluation. Changing cohorts and selection effects may explain differences; no causal claim.'],
    ['Restricted evidence','Direct identifiers, raw marks and detailed lineage records stay within MOE. Pseudonymous samples require separate field approval and remain project-scoped.'],
  ]:[
    ['Source / SDP',p.source+' → Student Academic Results '+p.version],
    ['Owner',p.owner],
    ['Refresh',`Fixture validation: ${p.lastValidated}. This is a simulated timestamp, not live freshness. Source cadence: ${p.freshness}.`],
    ['Coverage / quality','Eight comparable schools (A–H); School I and School J excluded because 2026 submissions are delayed. Missing observations are never zero-filled.'],
    ['Calculation',developer?'Contracted schema and additive v1 compatibility; delivery and freshness limits are evaluated separately from source certification.':resultsContext.definition+' Displayed summaries weight synthetic schools/cohorts equally, not by student counts.'],
    ['Assumptions',activeScenario?.assumptions||resultsContext.methodology],
    ['Sensitivity / permitted use',developer?'Sensitive fields; registered workload identity and contracted fields only.':analyst?'Sensitive source records; approved analytical workspace and field entitlements.':'Authorized aggregate business insight; no student identifiers in answers.'],
  ]
  if(analyst&&activeScenario)rows.push(['Analysis level',analysisLevel])
  if(activeScenario&&!partner)rows.push(['Applied method',activeScenario.method],['Selected data',activeScenario.data])
  if(developer)rows.push(['Contract provenance',`${p.version} · ${activeScenario?.delivery||'registered delivery contract'} · owner-governed version changes. Expired entitlement always fails closed.`])
  if(!partner&&p.id==='results')rows.push(['Lineage','School Results System → finality, subject-code and duplicate checks → Student Academic Results v1.2 → approved consumption. Student Identity v1.8 supplies governed join context where required.'])
  return <section className="evidence-detail" aria-label="Contextual evidence"><p className="evidence-context">{evidenceContext||config.navigation[0].label}</p><dl className="evidence-list">{rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{analyst&&<details><summary>Reproducibility</summary><p>Use the selected scenario's SQL and parameters in the approved workspace. The on-screen preview uses fixed synthetic aggregates, not executed SQL. Source row counts are unavailable; do not interpret this preview as a production query result.</p></details>}{!allowed&&<p role="status">Metadata is available; protected results remain unavailable until access is approved.</p>}</section>
}
