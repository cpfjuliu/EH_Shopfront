import { reproducibleSQL } from './resultsModel.js'

export const experienceFlows = {
  "analyst": {
    "5": {
      "entryLabel": "Find Student Academic Results",
      "screens": [
        {
          "kind": "catalog",
          "title": "Data products",
          "subtitle": "Choose an asset, inspect its contract and build your own analysis.",
          "search": "Student Academic Results",
          "productIds": ["results","identity","attendance"],
          "primaryLabel": "Open Student Academic Results"
        },
        {
          "kind": "asset",
          "productId": "results",
          "primaryLabel": "Request access",
          "secondaryLabel": "View sample SQL"
        },
        {
          "kind": "form",
          "title": "Request Results access",
          "subtitle": "Purpose and workspace determine entitlement.",
          "fields": [
            ["Purpose","Compare academic results by subject, level and school."],
            ["Workspace","HQ Analytics"],
            ["Requested data","Student Academic Results, Student Identity"],
            ["Access period","90 days"]
          ],
          "primaryLabel": "Submit request"
        },
        {
          "kind": "workspace",
          "title": "Academic Results notebook",
          "subtitle": "HQ Analytics · 2026 vs 2025 · Synthetic data",
          "badges": ["Results v1.2","Authorised HQ scope"],
          "code": "-- Write your SQL here. Inspect schema and definitions before running.",
          "resultColumns": ["Subject","2025","2026","Change"],
          "resultRows": [
            ["Mathematics","83.9%","79.4%","−4.5 pp"],
            ["English","85.0%","88.0%","+3.0 pp"]
          ],
          "assistant": "Review the comparison basis and cohort composition. Two delayed school submissions are excluded.",
          "manual": true
        }
      ]
    },
    "7": {
      "entryLabel": "Describe an analysis need",
      "screens": [
        {
          "kind": "intent",
          "title": "What analysis do you need?",
          "eyebrow": "Academic Results",
          "prompt": "I want to compare results trends by subject, level and school.",
          "primaryLabel": "Recommend analysis",
          "subtitle": "Describe your need using the synthetic Academic Results scenario."
        },
        {
          "kind": "plan",
          "title": "Recommended analysis setup",
          "subtitle": "Review the proposed starting point before proceeding.",
          "rows": [
            ["Dataset","Student Academic Results v1.2","Final subject results for 2025 and 2026","Certified"],
            ["Join","Student Identity v1.8","Governed school and level keys; no free-text joins","Governed"],
            ["Metric","Subject pass rate v1","Passes ÷ valid final results; change in pp","Governed"]
          ],
          "checks": [
            ["Scope","Authorised HQ"],
            ["Delayed submissions","2 excluded"]
          ],
          "primaryLabel": "Assemble workspace"
        },
        {
          "kind": "progress",
          "title": "Preparing your analysis",
          "subtitle": "Demonstration of governed provisioning; no production access is granted.",
          "tasks": [
            ["Purpose recorded","Academic Results analysis"],
            ["Entitlements reviewed","Student Results + Student Identity"],
            ["Workspace prepared","Approved fields and governed keys"],
            ["Ready for use","Sandbox and audit enabled"]
          ],
          "summary": [
            ["Products","2"],
            ["Audit","On"]
          ],
          "primaryLabel": "Simulate approval"
        },
        {
          "kind": "workspace",
          "title": "Prepared Results analysis",
          "subtitle": "HQ Analytics · 2026 vs 2025 · Synthetic data",
          "badges": ["Results v1.2","Authorised HQ scope"],
          "code": reproducibleSQL,
          "resultColumns": ["Subject","2025","2026","Change"],
          "resultRows": [
            ["Mathematics","83.9%","79.4%","−4.5 pp"],
            ["English","85.0%","88.0%","+3.0 pp"]
          ],
          "assistant": "Review the comparison basis and cohort composition. Two delayed school submissions are excluded.",
          "manual": false
        }
      ]
    },
    "9": {
      "entryLabel": "Ask an analytical question",
      "screens": [
        {
          "kind": "intent",
          "title": "What do you want to understand?",
          "eyebrow": "Academic Results",
          "prompt": "Which subjects show the largest year-on-year decline?",
          "primaryLabel": "Propose analytical method",
          "subtitle": "Describe your need using the synthetic Academic Results scenario."
        },
        {
          "kind": "plan",
          "title": "Review the analytical method",
          "subtitle": "Review the proposed starting point before proceeding.",
          "rows": [
            ["Dataset","Student Academic Results v1.2","Final subject results for 2025 and 2026","Certified"],
            ["Join","Student Identity v1.8","Governed school and level keys; no free-text joins","Governed"],
            ["Metric","Subject pass rate v1","Passes ÷ valid final results; change in pp","Governed"],
            ["Comparison","2026 vs 2025","Same subject, level and assessment basis","Review"],
            ["Quality","Exclude delayed schools","School I and School J; no imputation","Warning"],
            ["Limitation","Changing cohorts","Descriptive comparison, not causal attribution","Review"]
          ],
          "checks": [
            ["Scope","Authorised HQ"],
            ["Delayed submissions","2 excluded"]
          ],
          "primaryLabel": "Generate analysis",
          "editable": true
        },
        {
          "kind": "incident",
          "title": "Two Results submissions are delayed",
          "subtitle": "Quality and limitations remain visible before analysis.",
          "severity": "Degraded source freshness",
          "summary": "School I and School J are missing comparable final 2026 submissions.",
          "affected": [
            ["School I","Delayed","Excluded, never zero-filled"],
            ["School J","Delayed","Excluded, never zero-filled"]
          ],
          "handling": [
            ["Analysis","Continue on eight current schools"],
            ["Limitation","No complete MOE-wide conclusion"],
            ["Recovery","Refresh after source validation"]
          ],
          "primaryLabel": "Continue with safe handling"
        },
        {
          "kind": "workspace",
          "title": "Reviewed Results analysis",
          "subtitle": "HQ Analytics · 2026 vs 2025 · Synthetic data",
          "badges": ["Results v1.2","Authorised HQ scope"],
          "code": reproducibleSQL,
          "resultColumns": ["Subject","2025","2026","Change"],
          "resultRows": [
            ["Mathematics","83.9%","79.4%","−4.5 pp"],
            ["English","85.0%","88.0%","+3.0 pp"]
          ],
          "assistant": "Review the comparison basis and cohort composition. Two delayed school submissions are excluded.",
          "manual": false
        }
      ]
    },
    "11": {
      "entryLabel": "Open analysis briefing",
      "screens": [
        {
          "kind": "briefing",
          "audience": "analyst",
          "title": "Your refreshed analysis briefing",
          "subtitle": "Based on your followed Academic Results topic and recent subject-trend notebook.",
          "primaryLabel": "Open reproducible analysis"
        },
        {
          "kind": "workspace",
          "title": "Reproducible Results analysis",
          "subtitle": "HQ Analytics · 2026 vs 2025 · Synthetic data",
          "badges": ["Results v1.2","Authorised HQ scope"],
          "code": reproducibleSQL,
          "resultColumns": ["Subject","2025","2026","Change"],
          "resultRows": [
            ["Mathematics","83.9%","79.4%","−4.5 pp"],
            ["English","85.0%","88.0%","+3.0 pp"]
          ],
          "assistant": "Review the comparison basis and cohort composition. Two delayed school submissions are excluded.",
          "manual": false
        }
      ]
    }
  },
  "business": {
    "5": {
      "entryLabel": "Find Student Academic Results",
      "screens": [
        {
          "kind": "discover",
          "title": "Discover",
          "subtitle": "Find and choose a trusted report. Apply your own filters.",
          "search": "Student Academic Results",
          "items": [
            ["Dashboard","Student Academic Results","Subject pass rates by school, level and year.","Trusted"]
          ],
          "primaryLabel": "Open Student Academic Results"
        },
        {
          "kind": "dashboardDetail",
          "title": "Student Academic Results",
          "subtitle": "Inspect the trusted dashboard before opening it.",
          "primaryLabel": "Open dashboard"
        },
        {
          "kind": "resultsDashboard",
          "title": "Student Academic Results",
          "subtitle": "Trusted aggregate results · Synthetic fixture · Authorised HQ scope",
          "prepared": false
        }
      ]
    },
    "7": {
      "entryLabel": "Prepare a leadership briefing",
      "screens": [
        {
          "kind": "intent",
          "title": "What do you need to prepare?",
          "eyebrow": "Academic Results",
          "prompt": "I need a briefing on this year’s academic results for senior leaders.",
          "primaryLabel": "Recommend a results view",
          "subtitle": "Describe your need using the synthetic Academic Results scenario."
        },
        {
          "kind": "recommendations",
          "title": "Your recommended Results view",
          "subtitle": "2026 vs 2025, all subjects and HQ schools are already selected.",
          "items": [
            ["Best match","Academic Results leadership view","Pre-built comparison by subject, level and school. Prepared for senior leaders.","Access granted"]
          ],
          "primaryLabel": "Open prepared view"
        },
        {
          "kind": "resultsDashboard",
          "title": "Student Academic Results",
          "subtitle": "Trusted aggregate results · Synthetic fixture · Authorised HQ scope",
          "prepared": true
        }
      ]
    },
    "9": {
      "entryLabel": "Ask Edu Hub",
      "screens": [
        {
          "kind": "intent",
          "title": "Ask Edu Hub",
          "eyebrow": "Academic Results",
          "prompt": "Which schools saw the biggest drop in Mathematics pass rates this year?",
          "primaryLabel": "Ask",
          "subtitle": "Ask first. Edu Hub returns a computed example answer with evidence and limitations.",
          "businessQuestion": true,
          "suggestions": ["Compare subjects","Explain the calculation","Show only current data"]
        },
        {
          "kind": "businessAnswer",
          "title": "Results Q&A",
          "primaryLabel": "Show schools"
        },
        {
          "kind": "table",
          "title": "Results school comparison",
          "subtitle": "Mathematics · 2026 vs 2025 · current submissions only · synthetic data",
          "columns": ["School","2025","2026","Change"],
          "rows": [
            ["School A","84%","76%","−8 pp"],
            ["School B","82%","75%","−7 pp"],
            ["School C","88%","82%","−6 pp"],
            ["School D","80%","75%","−5 pp"],
            ["School E","86%","82%","−4 pp"],
            ["School F","83%","80%","−3 pp"],
            ["School G","81%","79%","−2 pp"],
            ["School H","87%","86%","−1 pp"]
          ]
        }
      ]
    },
    "11": {
      "entryLabel": "Open Results briefing",
      "screens": [
        {
          "kind": "briefing",
          "audience": "business",
          "title": "Your Academic Results Briefing",
          "subtitle": "Prepared for Julius · Business Officer · Followed topic: Academic Results · 2026 vs 2025",
          "primaryLabel": "Explore drivers"
        },
        {
          "kind": "businessAnswer",
          "title": "Explore Results",
          "briefing": true,
          "primaryLabel": "Show schools"
        },
        {
          "kind": "table",
          "title": "Results school comparison",
          "subtitle": "Mathematics · 2026 vs 2025 · current submissions only · synthetic data",
          "columns": ["School","2025","2026","Change"],
          "rows": [
            ["School A","84%","76%","−8 pp"],
            ["School B","82%","75%","−7 pp"],
            ["School C","88%","82%","−6 pp"],
            ["School D","80%","75%","−5 pp"],
            ["School E","86%","82%","−4 pp"],
            ["School F","83%","80%","−3 pp"],
            ["School G","81%","79%","−2 pp"],
            ["School H","87%","86%","−1 pp"]
          ]
        }
      ]
    }
  },
  "system": {
    "5": {
      "entryLabel": "Browse Results contracts",
      "screens": [
        {
          "kind": "contract",
          "title": "Student Academic Results",
          "subtitle": "Stable business contract for registered applications.",
          "productId": "results",
          "primaryLabel": "Use selected delivery"
        },
        {
          "kind": "api",
          "title": "Results API",
          "subtitle": "Student Academic Results v1.2",
          "code": "GET /v1/student-academic-results?academic_year=2026\nAuthorization: Bearer <workload-token>\n\n200 OK\n{ \"subject\": \"Mathematics\", \"passed\": true,\n  \"academic_year\": 2026, \"freshness_status\": \"current\" }",
          "facts": [
            ["Identity","Workload identity"],
            ["Freshness","Daily by 6 PM"],
            ["SLO","99.5%"],
            ["Sandbox","Synthetic data only"]
          ],
          "primaryLabel": "Request system access"
        },
        {
          "kind": "form",
          "title": "Request system access",
          "subtitle": "Register your consuming application and permitted use.",
          "fields": [
            ["Application","Results Support App"],
            ["Purpose","Display approved academic results to authorised officers."],
            ["Environment","Sandbox then production"],
            ["Delivery","REST API"]
          ],
          "primaryLabel": "Submit request"
        },
        {
          "kind": "api",
          "title": "Manual integration console",
          "subtitle": "Student Academic Results v1.2",
          "code": "GET /v1/student-academic-results?academic_year=2026\nAuthorization: Bearer <workload-token>\n\n200 OK\n{ \"subject\": \"Mathematics\", \"passed\": true,\n  \"academic_year\": 2026, \"freshness_status\": \"current\" }",
          "facts": [
            ["Identity","Workload identity"],
            ["Freshness","Daily by 6 PM"],
            ["SLO","99.5%"],
            ["Sandbox","Synthetic data only"]
          ]
        }
      ]
    },
    "7": {
      "entryLabel": "Describe the application need",
      "screens": [
        {
          "kind": "intent",
          "title": "What does your application need?",
          "eyebrow": "Academic Results",
          "prompt": "Our application needs student academic results daily and runs outside AWS.",
          "primaryLabel": "Recommend integration",
          "subtitle": "Describe your need using the synthetic Academic Results scenario."
        },
        {
          "kind": "plan",
          "title": "Recommended Results integration",
          "subtitle": "Review the proposed starting point before proceeding.",
          "rows": [
            ["Fields","student_id, subject, academic_year, passed","Only approved minimum fields; freshness metadata included","Review"],
            ["Delivery","REST API","HTTPS for a non-AWS application","Recommended"],
            ["Freshness","Daily by 6 PM","Expose last validated timestamp and status","Governed"]
          ],
          "checks": [
            ["Scope","Authorised HQ"],
            ["Delayed submissions","2 excluded"]
          ],
          "primaryLabel": "Provision subscription"
        },
        {
          "kind": "progress",
          "title": "Provisioning Results subscription",
          "subtitle": "Demonstration of governed provisioning; no production access is granted.",
          "tasks": [
            ["Application purpose recorded","Daily Academic Results for an approved non-AWS application"],
            ["Workload identity and entitlement","Registered service identity and minimum approved fields"],
            ["Approval and sandbox","Owner approval coordinated; synthetic test environment ready"],
            ["Production subscription prepared","Daily delivery, freshness monitoring and audit enabled"]
          ],
          "summary": [
            ["Data product","Academic Results v1.2"],
            ["Delivery","REST API"],
            ["Environment","Non-AWS application"]
          ],
          "primaryLabel": "Open integration console"
        },
        {
          "kind": "api",
          "title": "Provisioned Results subscription",
          "subtitle": "Student Academic Results v1.2",
          "code": "GET /v1/student-academic-results?academic_year=2026\nAuthorization: Bearer <workload-token>\n\n200 OK\n{ \"subject\": \"Mathematics\", \"passed\": true,\n  \"academic_year\": 2026, \"freshness_status\": \"current\" }",
          "facts": [
            ["Identity","Workload identity"],
            ["Freshness","Daily by 6 PM"],
            ["SLO","99.5%"],
            ["Sandbox","Synthetic data only"]
          ]
        }
      ]
    },
    "9": {
      "entryLabel": "State a service requirement",
      "screens": [
        {
          "kind": "intent",
          "title": "What service does your application need?",
          "eyebrow": "Academic Results",
          "prompt": "Our application needs student academic results daily, runs outside AWS, and requires student_id, subject, academic_year and passed. Serve last-known-good data for up to 24 hours during delays; fail closed after that.",
          "primaryLabel": "Propose consumer contract",
          "subtitle": "Describe your need using the synthetic Academic Results scenario."
        },
        {
          "kind": "plan",
          "title": "Review consumer contract",
          "subtitle": "Review the proposed starting point before proceeding.",
          "rows": [
            ["Fields","student_id, subject, academic_year, passed","Only approved minimum fields; freshness metadata included","Review"],
            ["Delivery","REST API","HTTPS for a non-AWS application","Recommended"],
            ["Freshness","Daily by 6 PM","Expose last validated timestamp and status","Governed"],
            ["Fallback","Last-known-good ≤24 hours","Label stale; reject expired data and never bypass entitlement","Review"],
            ["Version","v1 compatible","Additive fields only; breaking changes require v2 and notice","Supported"],
            ["Compatibility","Consumer contract tests","Validate schema, access, stale data and expired entitlement","Included"]
          ],
          "checks": [
            ["Scope","Authorised HQ"],
            ["Delayed submissions","2 excluded"]
          ],
          "primaryLabel": "Generate scaffold and tests"
        },
        {
          "kind": "api",
          "title": "Generated Results integration",
          "subtitle": "Student Academic Results v1.2",
          "code": "// Illustrative scaffold; replace endpoint and token in your application.\nasync function getResults(token) {\n  const response = await fetch('/v1/student-academic-results', {\n    headers: { Authorization: 'Bearer ' + token }\n  });\n  if (response.status === 403) throw new Error('Entitlement denied or expired');\n  if (!response.ok) throw new Error('Results unavailable');\n  const result = await response.json();\n  const age = Date.now() - Date.parse(result.validated_at);\n  if (!Number.isFinite(age) || age < 0 || age > 86400000)\n    throw new Error('No valid result within freshness contract');\n  return { ...result, showWarning: result.freshness_status !== 'current' };\n}\n// Contract checks: valid schema; additive field compatibility;\n// stale <=24h labelled; stale >24h rejected; 403 never uses cache.",
          "facts": [
            ["Minimum fields","4 + freshness metadata"],
            ["Stale response","Label ≤24h; reject >24h"],
            ["403 / expiry","Fail closed"],
            ["Compatibility","v1 additive changes only"]
          ],
          "primaryLabel": "Inspect contract tests"
        },
        {
          "kind": "contractTests",
          "title": "Consumer contract checks"
        }
      ]
    },
    "11": {
      "entryLabel": "Bind to a business-level contract",
      "screens": [
        {
          "kind": "consumerHealth",
          "title": "Results Support App",
          "subtitle": "Your stable business contract is healthy. No consumer action required.",
          "contracts": [
            ["Student Academic Results","v1.2 compatible · daily by 6 PM · 99.5% SLO"]
          ],
          "facts": [
            ["Consumer code changes","0"],
            ["Storage dependency","None exposed"],
            ["Compatibility","47 / 47 checks passed"]
          ],
          "primaryLabel": "View latest platform change"
        },
        {
          "kind": "change",
          "title": "Platform change completed",
          "subtitle": "No consumer action required.",
          "message": "Results delivery moved from Redshift to Databricks. Endpoint, fields, semantics and entitlements remain compatible; registered consumer code is unchanged.",
          "metrics": [
            ["Consumer code changes","0"],
            ["Contract tests","47 / 47"],
            ["Downtime","0 min"],
            ["SLO","99.5%"]
          ],
          "primaryLabel": "View compatibility"
        },
        {
          "kind": "table",
          "title": "Compatibility and consumer impact",
          "subtitle": "Changes are evaluated against registered consumers before release.",
          "columns": ["Consumer","Contract","Latest test","Breaking impact"],
          "rows": [
            ["Results Support App","v1.2","47 passed","None"],
            ["MOEinfo","v1.1","36 passed","None"],
            ["KM2","v1.2","41 passed","None"]
          ]
        }
      ]
    }
  },
  "partner": {
    "5": {
      "entryLabel": "Start from an approved data request",
      "screens": [
        {
          "kind": "form",
          "title": "New data-sharing request",
          "subtitle": "Register the approved purpose before selecting data.",
          "fields": [
            ["Partner organisation","Example Programme Partner"],
            ["Approved purpose","Evaluate academic outcomes of the Student Support Programme."],
            ["MOE sponsor","Programme owner"],
            ["Access period","180 days"],
            ["Requested data","Pseudonymous participant ID, level, academic results band"]
          ],
          "primaryLabel": "Continue"
        },
        {
          "kind": "table",
          "title": "Data package",
          "subtitle": "Review the minimum data proposed for the approved purpose.",
          "columns": ["Field","Use","Decision"],
          "rows": [
            ["Project-scoped participant ID","Link approved programme records","Included"],
            ["Level","Approved comparison","Included"],
            ["Academic results band","Programme evaluation","Included"],
            ["Names and detailed marks","Not necessary for purpose","Excluded"]
          ],
          "primaryLabel": "Submit for approval"
        },
        {
          "kind": "progress",
          "title": "Partner access ready",
          "subtitle": "Example Programme Partner",
          "tasks": [
            ["Purpose approved","Programme owner"],
            ["Data minimisation reviewed","3 approved fields"],
            ["Partner identity verified","Organisation account active"],
            ["Secure delivery enabled","Access expires automatically in 6 months"]
          ],
          "summary": [
            ["Approved fields","3"],
            ["Expiry","180 days"],
            ["Audit logging","On"]
          ],
          "primaryLabel": "Open approved subset"
        },
        {
          "kind": "controlled",
          "title": "Your approved controlled subset",
          "subtitle": "Approved, controlled subset · project-scoped identifiers and results bands only",
          "metrics": [
            ["Participant change","+4 pp"],
            ["Comparison cohort","+1 pp"],
            ["Raw exports","0"]
          ],
          "controls": [
            ["Purpose","Approved academic programme evaluation"],
            ["Masking","Direct identifiers removed"],
            ["Aggregation","Groups of at least 10"],
            ["Pseudonymisation","Project-scoped IDs only inside MOE"],
            ["Expiry","180 days; automatic denial after expiry"],
            ["Export","Raw records disabled"],
            ["Audit","Every interaction logged"]
          ],
          "academic": true,
          "subset": true
        }
      ]
    },
    "7": {
      "entryLabel": "Start from an approved project",
      "screens": [
        {
          "kind": "intent",
          "title": "What does your approved project need?",
          "eyebrow": "Academic Results",
          "prompt": "We need to evaluate academic outcomes for programme participants.",
          "primaryLabel": "Recommend project package",
          "subtitle": "Describe your need using the synthetic Academic Results scenario."
        },
        {
          "kind": "plan",
          "title": "Recommended project package",
          "subtitle": "Review the proposed starting point before proceeding.",
          "rows": [
            ["Package","Results bands + level","Minimum useful approved subset","Recommended"],
            ["Sample","Synthetic test records","Prepare without exposing student data","Included"],
            ["Workspace","MOE controlled environment","Sponsor, purpose and expiry stay attached","Ready"]
          ],
          "checks": [
            ["Purpose","Approved programme evaluation"],
            ["Sponsor","MOE programme owner"],
            ["Access","180 days; no raw marks"]
          ],
          "primaryLabel": "Open secure workspace"
        },
        {
          "kind": "controlled",
          "title": "Your prepared project package",
          "subtitle": "Recommended indicators and synthetic sample · secure workspace",
          "metrics": [
            ["Participant change","+4 pp"],
            ["Comparison cohort","+1 pp"],
            ["Raw exports","0"]
          ],
          "controls": [
            ["Purpose","Approved academic programme evaluation"],
            ["Masking","Direct identifiers removed"],
            ["Aggregation","Groups of at least 10"],
            ["Pseudonymisation","Project-scoped IDs only inside MOE"],
            ["Expiry","180 days; automatic denial after expiry"],
            ["Export","Raw records disabled"],
            ["Audit","Every interaction logged"]
          ],
          "academic": true,
          "subset": true
        }
      ]
    },
    "9": {
      "entryLabel": "Describe the evaluation outcome",
      "screens": [
        {
          "kind": "intent",
          "title": "What outcome does the project need?",
          "eyebrow": "Academic Results",
          "prompt": "Evaluate whether a programme improves academic outcomes.",
          "primaryLabel": "Propose minimum interaction",
          "subtitle": "Describe your need using the synthetic Academic Results scenario."
        },
        {
          "kind": "plan",
          "title": "Minimum sufficient Results interaction",
          "subtitle": "Review the proposed starting point before proceeding.",
          "rows": [
            ["Decision","Aggregate comparison is sufficient","Detailed raw student results are not needed","Recommended"],
            ["Purpose","Approved academic programme evaluation","Enforced for this approved project","Governed"],
            ["Masking","Direct identifiers removed","Enforced for this approved project","Governed"],
            ["Aggregation","Groups of at least 10","Enforced for this approved project","Governed"],
            ["Pseudonymisation","Project-scoped IDs only inside MOE","Enforced for this approved project","Governed"],
            ["Expiry","180 days; automatic denial after expiry","Enforced for this approved project","Governed"],
            ["Export","Raw records disabled","Enforced for this approved project","Governed"],
            ["Audit","Every interaction logged","Enforced for this approved project","Governed"]
          ],
          "checks": [
            ["Purpose","Approved programme evaluation"],
            ["Sponsor","MOE programme owner"],
            ["Access","180 days; no raw marks"]
          ],
          "primaryLabel": "Open controlled comparison"
        },
        {
          "kind": "controlled",
          "title": "Approved programme comparison",
          "subtitle": "Synthetic aggregate result within MOE boundaries; descriptive association only.",
          "metrics": [
            ["Participant change","+4 pp"],
            ["Comparison cohort","+1 pp"],
            ["Raw exports","0"]
          ],
          "controls": [
            ["Purpose","Approved academic programme evaluation"],
            ["Masking","Direct identifiers removed"],
            ["Aggregation","Groups of at least 10"],
            ["Pseudonymisation","Project-scoped IDs only inside MOE"],
            ["Expiry","180 days; automatic denial after expiry"],
            ["Export","Raw records disabled"],
            ["Audit","Every interaction logged"]
          ],
          "academic": true
        }
      ]
    },
    "11": {
      "entryLabel": "View approved outcome",
      "screens": [
        {
          "kind": "partnerOutcome",
          "title": "Your approved evaluation is ready",
          "subtitle": "Student Support Programme · Approved purpose and MOE sponsor · 180-day entitlement",
          "primaryLabel": "Inspect evidence and controls"
        },
        {
          "kind": "controlled",
          "title": "Approved programme comparison",
          "subtitle": "Synthetic aggregate result within MOE boundaries; descriptive association only.",
          "metrics": [
            ["Participant change","+4 pp"],
            ["Comparison cohort","+1 pp"],
            ["Raw exports","0"]
          ],
          "controls": [
            ["Purpose","Approved academic programme evaluation"],
            ["Masking","Direct identifiers removed"],
            ["Aggregation","Groups of at least 10"],
            ["Pseudonymisation","Project-scoped IDs only inside MOE"],
            ["Expiry","180 days; automatic denial after expiry"],
            ["Export","Raw records disabled"],
            ["Audit","Every interaction logged"]
          ],
          "academic": true
        }
      ]
    }
  }
}

export const personaMeta = {
  "analyst": {
    "label": "Analyst",
    "role": "HQ Analyst"
  },
  "business": {
    "label": "Business",
    "role": "Business Officer"
  },
  "system": {
    "label": "System",
    "role": "Application Developer"
  },
  "partner": {
    "label": "External partner",
    "role": "External Partner"
  }
}
