import React from 'react'
import {productById, fieldName, effectiveScope, requestAccess} from './targetModel.js'
import {resultsContext} from './resultsModel.js'

export const Btn=({children,primary=false,...props})=><button className={`button button-${primary?'primary':'secondary'}`} {...props}>{children}</button>
export const Heading=({eyebrow,title,children,action})=><header className="target-heading"><div>{eyebrow&&<p className="eyebrow">{eyebrow}</p>}<h1 tabIndex="-1">{title}</h1>{children&&<p>{children}</p>}</div>{action}</header>
export const Tag=({children})=><span className={`target-tag ${/Active|Approved|Healthy/.test(children)?'positive':''}`}>{children}</span>
export const Notice=({children,error=false})=><div className={`target-notice ${error?'error':''}`} role={error?'alert':'note'}>{children}</div>
export function Facts({rows}){return <dl className="target-facts">{rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
export function DataTable({columns,rows,caption}){return <div className="target-table-wrap" tabIndex="0" role="region" aria-label={caption}><table className="target-table"><caption>{caption}</caption><thead><tr>{columns.map(c=><th scope="col" key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table></div>}

export function ScopeSummary({scope,technical=false,onRemove}){
  const effective=effectiveScope(scope),multi=Object.keys(effective).length>1
  return <div className="scope-summary">{Object.entries(effective).map(([id,fields])=><section key={id}>
    <div className="section-line"><h3>{productById[id].name}</h3>{onRemove&&<button className="text-button" onClick={()=>onRemove(id)}>Remove<span className="sr-only"> {productById[id].name}</span></button>}</div>
    <ul className="field-list">{fields.map(f=><li key={f}>{fieldName(f)}{technical&&<code>{f}</code>}{multi&&f==='student_id'&&<small>Required to link your selected data</small>}</li>)}</ul>
  </section>)}</div>
}
export function ApprovedScope({request,technical=false}){
  const approved=requestAccess(request)
  return <div className="approved-scope">{request.items.map(i=><div key={i.dataset}><strong>{productById[i.dataset].name}</strong> <Tag>{i.status}</Tag><p>{approved[i.dataset]?i.fields.map(fieldName).join(', '):'Not available for use.'}</p>{technical&&approved[i.dataset]&&<code>{i.fields.join(', ')}</code>}</div>)}</div>
}
export function ProductEvidence({product,technical=false}){
  const p=productById[product]
  return <div className="target-evidence"><p>{p.name} · {p.version}</p><Facts rows={[
    ['Owner',p.owner],['Source',technical?p.source:'Governed '+p.name+' product fixture'],
    ['Refresh',`${p.freshness}. Example validation: 17 October 2026, 18:03 SGT (simulated; not live).`],
    ['Coverage',p.coverage],['Quality and limitations',p.caveat],
    ['Definition',product==='results'?resultsContext.definition:p.definition],
    ['Methodology',product==='results'?'Compare 2025 and 2026 final results for the same subject and level. Equal synthetic school/cohort weights; not student-count-weighted. Cohorts may change, so comparisons do not establish causes.':'Metadata and small synthetic examples only. No complete operational population or cross-product calculation is supplied.'],
    ['Permitted use','Only the approved fields for the stated use case. Pending, denied and expired portions remain unavailable.'],
  ]}/>{technical&&<details><summary>Lineage and version provenance</summary><ol>{p.lineage.map((row,i)=><li key={i}>{row.slice(0,3).join(' · ')}</li>)}</ol><p>{p.version}. Changes require owner review. Delivery/connection behavior is simulated; no production contract or service-level commitment is established.</p></details>}</div>
}
