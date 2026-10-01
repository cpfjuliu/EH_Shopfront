// Synthetic fixtures: no live student data or inference service is connected.
export const resultsContext = {
  period: '2026 vs 2025', scope: 'Authorised HQ schools', metric: 'Mathematics pass rate v1',
  definition: 'Students meeting the subject pass standard ÷ students with valid final results × 100. Changes are percentage points (pp), not percentage changes.',
  quality: 'School I and School J have delayed 2026 submissions and are excluded from current comparisons.',
  methodology: 'Compare the same subject, level and assessment basis across years. Cohort composition may change; differences do not establish causes or programme impact.',
}
export const schoolResults = [
  ['School A', 84, 76], ['School B', 82, 75], ['School C', 88, 82], ['School D', 80, 75],
  ['School E', 86, 82], ['School F', 83, 80], ['School G', 81, 79], ['School H', 87, 86],
].map(([school, previous, current]) => ({ school, previous, current, change: current - previous }))
export const subjectResults = [['Mathematics', '83.9%', '79.4%', '−4.5 pp'], ['English', '85.0%', '88.0%', '+3.0 pp'], ['Science', '82.0%', '82.5%', '+0.5 pp']]
export const resultRecords = schoolResults.flatMap((s, i) => ['Secondary 1','Secondary 2'].flatMap(level => {
  const first = level === 'Secondary 1'
  const prior = s.previous + (first ? 2 : -2)
  const firstChange = [-4,-3,-3,-2,-2,-1,-1,0][i]
  return [
    {school:s.school,level,subject:'Mathematics',previous:prior,current:prior+(first?firstChange:2*s.change-firstChange)},
    {school:s.school,level,subject:'English',previous:85,current:88},
    {school:s.school,level,subject:'Science',previous:82,current:82.5},
  ]
}))
export function dashboardRows(subject, level, school) {
  const records = resultRecords.filter(r => (subject==='All subjects'||r.subject===subject) && (level==='All levels'||r.level===level) && (school==='All schools'||r.school===school))
  const groupBy = subject === 'All subjects' ? 'subject' : 'school'
  return [...new Set(records.map(r=>r[groupBy]))].map(label=>{
    const group=records.filter(r=>r[groupBy]===label)
    const previous=group.reduce((sum,r)=>sum+r.previous,0)/group.length
    const current=group.reduce((sum,r)=>sum+r.current,0)/group.length
    const change=current-previous
    return [label,`${previous.toFixed(1)}%`,`${current.toFixed(1)}%`,`${change>0?'+':''}${change.toFixed(1)} pp`]
  })
}
export const resultsEvidence = [
  ['Metric definition', resultsContext.definition], ['Comparison', resultsContext.period],
  ['Data used', 'Student Academic Results v1.2 + Student Identity v1.8; school/level joins use governed keys.'],
  ['Scope & permitted use', 'Authorised HQ aggregate analysis. No student identifiers in business answers.'],
  ['Quality', resultsContext.quality], ['Assumptions', resultsContext.methodology],
]
export const questions = [
  'Which schools saw the biggest drop in Mathematics pass rates this year?',
  'What is driving School A?', 'Compare subjects', 'Explain the calculation',
  'Show only current data', 'Which levels account for the decline?',
]
export function answerQuestion(question) {
  const q = question.trim().toLowerCase().replace(/[?.!]+$/g, '')
  const topic = questions.findIndex(item => item.toLowerCase().replace(/[?.!]+$/g, '') === q)
  const base = { title: 'Results Q&A', evidence: resultsEvidence, metrics: [], question }
  if (topic === 0) return { ...base, headline: 'School A has the largest Mathematics decline: 8 pp', body: 'Eight schools declined. School A moved from 84% to 76%, followed by School B (−7 pp) and School C (−6 pp). Delayed submissions are excluded.', metrics: [['Schools with declines', '8'], ['School A change', '−8 pp'], ['Comparison', resultsContext.period]], rows: schoolResults.map(s => [s.school, `${s.previous}%`, `${s.current}%`, `${s.change} pp`]) }
  if (topic === 1) return { ...base, headline: 'School A: the largest change is in Secondary 2', body: 'Secondary 2 Mathematics fell from 82% to 70% (−12 pp); Secondary 1 fell from 86% to 82% (−4 pp). In this equally weighted synthetic cohort, these combine to the school’s −8 pp change. This locates the change; it does not explain its cause.', metrics: [['Secondary 2', '−12 pp'], ['Secondary 1', '−4 pp'], ['School A', '−8 pp']] }
  if (topic === 2) return { ...base, headline: 'Mathematics declined while English improved', body: 'Across the same eight schools with current submissions, Mathematics fell 4.5 pp, English improved 3 pp and Science improved 0.5 pp. These are rounded, equally weighted school averages in the synthetic fixture.', metrics: [['Mathematics', '−4.5 pp'], ['English', '+3.0 pp'], ['Science', '+0.5 pp']], rows: subjectResults, columns: ['Subject', '2025', '2026', 'Change'] }
  if (topic === 3) return { ...base, headline: 'How pass rate and year-on-year change are calculated', body: resultsContext.definition, metrics: [['School A 2025', '84%'], ['School A 2026', '76%'], ['76 − 84', '−8 pp']] }
  if (topic === 4) return { ...base, headline: 'Eight schools have comparable current results', body: resultsContext.quality + ' School A–H are included. Missing results are never treated as zero.', metrics: [['Current schools', '8'], ['Excluded schools', '2']] }
  if (topic === 5) return { ...base, headline: 'Secondary 2 accounts for most of the Mathematics decline', body: 'Across the eight current schools, Secondary 2 changed by −7 pp and Secondary 1 by −2 pp. Equal cohort weights give the overall −4.5 pp change. Inspect cohort composition before attributing causes.', metrics: [['Secondary 2', '−7 pp'], ['Secondary 1', '−2 pp']] }
  return { ...base, headline: 'This question needs additional data or clarification', body: 'This prototype answers the example questions below using synthetic Academic Results data. It cannot compute an arbitrary question or extend your authorised scope. Choose an example to explore the demonstrated answer, evidence and caveats.', unsupported: true }
}

export const reproducibleSQL = `-- Synthetic example; review before use. No production connection.
-- School I and School J excluded: delayed 2026 submissions.
WITH rates AS (
  SELECT school_code, subject, level, academic_year,
    100.0 * SUM(CASE WHEN passed THEN 1 ELSE 0 END)
      / NULLIF(COUNT(*), 0) AS pass_rate
  FROM student_academic_results
  WHERE academic_year IN (2025, 2026)
    AND result_status = 'FINAL'
    AND school_code NOT IN ('SCH-I', 'SCH-J')
  GROUP BY school_code, subject, level, academic_year
)
SELECT current.school_code, current.subject, current.level,
  prior.pass_rate AS prior_rate, current.pass_rate AS current_rate,
  current.pass_rate - prior.pass_rate AS change_pp
FROM rates current
JOIN rates prior ON current.school_code = prior.school_code
  AND current.subject = prior.subject AND current.level = prior.level
  AND prior.academic_year = 2025
WHERE current.academic_year = 2026
ORDER BY change_pp;`

export const levelDescriptions = {
  5: ['Trusted self-service', 'Choose the right asset or tool and work with it yourself.'],
  7: ['An assembled starting point', 'Describe your need; Edu Hub recommends and prepares the journey.'],
  9: ['An answer to your intent', 'Ask a question or state a requirement; review the answer, method and caveats.'],
  11: ['Your outcome, ready', 'See what matters first, then inspect evidence or explore with context.'],
}
