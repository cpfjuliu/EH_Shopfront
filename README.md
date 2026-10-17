# Edu Hub — self-service target prototype

**Trusted Data for MOE, empowering evidence-based decisions and services.**

One Catalogue, shared Enterprise Data Products (EDPs), one governed access journey, and different consumption paths for Business and System users. All records, approvals, freshness, reuse examples and delivery/connectivity states are synthetic. No production SSO, AI, SQL engine, AWS infrastructure or authorization backend is connected.

## Active product

- **Home:** discover trusted data or continue work.
- **Catalogue:** grouped Data followed by Dashboards. Student Identity & Contact, Student Attendance and Student Academic Results are first-class EDPs. Special Needs Enrolment and Active Students (P1 - JC3) are Other Data Assets with explicitly unestablished EDP assurances/fulfilment.
- **EDP:** shared purpose, meaning, coverage, owner, freshness, quality, reuse and field selection. Schema/version/lineage details are progressively disclosed.
- **Request scope:** one draft across EDPs; synthetic common student references are automatically included and locked for multi-EDP scope. These fields still need owner approval. Intended use adapts the same form; one review precedes submission.
- **My Data:** Draft, Pending Data Owner approval, Partially Approved, Active and Expired. Denied portions remain visible. Every request has its own purpose, fields and consumption destination; one use case never authorizes another automatically.
- **DIP Lite:** approved data only; bounded Results Q&A, attendance definition and scope questions, with evidence and honest unsupported states. No arbitrary queries or cross-product reasoning.
- **Embedded DVP dashboards:** Attendance and Results remain in Edu Hub. Reporting-use approval and required fields are checked before showing synthetic values.
- **Integration:** S3 ad hoc/daily/weekly files or an eligible AWS direct VPC connection. Inspect version, freshness, fields, setup guidance and healthy/stale/degraded/breaking/failed states. No real endpoint, credentials or infrastructure.

Only Business User and System User are active. The bottom-right presenter tool shows Analyst and External Partner disabled with Coming soon tags. The separate **Demo states & governance** control selects lifecycle/operational scenarios and opens the retained Data Owner backstage.

The old 16-persona/star experiment is retired. “5★ target experience” is presenter terminology only. Legacy modules remain references but are not mounted or reachable through old URLs/history. Current rules explicitly supersede the old single-navigation-entry and active star-isolation rules.

## Demonstrate

Business: Home → search Attendance → Data and Dashboard results → select Attendance fields → add Academic Results fields → inspect locked linking references → describe use → review/submit → My Data Pending → backstage approve Results only → use that portion in DIP Lite → approve remaining portions → Active → inspect evidence or an unsupported question. Results calculations need School, Subject, Education level, Academic year, Pass outcome and Result finality.

System: presenter selects System User → same Catalogue/EDP → technical evaluation → fields → purpose and consuming system → S3 destination/cadence, or AWS/network-ready VPC → submit → My Data → owner approval → integration. Change operational condition through the separate demo controls. Healthy means no action required.

Dashboards: search Attendance → open its dashboard → Request dashboard data retains reporting intent/destination → owner approval → Open dashboard. A generic explore grant does not automatically authorize reporting use.

Demo access scenarios replace only the current perspective's account: First-time, Draft, Pending, Partially approved, Active, Expired or Denied. Accounts are stored separately under `edu-hub-target-v1`; old storage is ignored. Browser storage and synthetic owner decisions are not production security.

## Engineering map

| File | Responsibility |
| --- | --- |
| `TargetApp.jsx` | Active shell, shared discovery/EDP/request/My Data, presenter controls and navigation |
| `targetModel.js` | EDP adapters, search, linking, per-use-case access, validation, lifecycle, demo states and route allowlist |
| `TargetUI.jsx` | Shared components and evidence |
| `TargetConsumption.jsx` | DIP Lite, dashboards and integration |
| `accessModel.js` | Retained owner decision/field approval primitives |
| `resultsModel.js`, `mockData.js`, `resultsProduct.js` | Reused fixtures, metadata, definitions and bounded Q&A |
| `Modal.jsx` | Retained focus, inert background, Escape and restoration |
| `App.jsx`, `AccessExperience.jsx` | Retained governance/owner components; other exports are dormant |
| `target.css` | Active styling using existing tokens |

## Run and verify

```sh
npm ci
npm run dev -- --host 127.0.0.1
npm run build
npm run preview -- --host 127.0.0.1
```

With preview running, install Playwright Chromium (`npx playwright install chromium`) or set `BROWSER_EXECUTABLE` to installed Chrome. `TEST_URL` defaults to `http://127.0.0.1:4173` in the active browser suite.

```sh
npm test
npm run test:unit
npm run test:journeys
```

The active suite retains access-model tests and adds target-model and target-journey checks. Old star capability/intent/browser files remain historical references, excluded from active acceptance. Historical PASS labels do not validate the rebuild. Screenshots go under ignored `test-results/`.

## Limits and assumptions

- Results remains the deepest path: eight comparable schools, two delayed/excluded submissions, percentage-point comparisons and equal synthetic weights. No causal claims.
- Contact fields and division reuse are illustrative metadata, not real contact data or live adoption evidence.
- `student_id` is a synthetic linking reference, not a production identity architecture decision.
- Owner decisions are per EDP portion. Partial approval enables standalone portions, not computations requiring pending fields.
- Other Data Assets are discovery-only examples requiring owner assessment.
- VPC readiness is declared, not verified. S3 schedules/timestamps are examples, not service commitments.
- Unchanged Vite/Vercel configuration builds static output to `dist`. No deployment or push is part of this rebuild. Development-tool modernization remains separate scope.

Consult `AGENTS.md` and `docs/design/` before UI work. See `ISOLATION_AUDIT.md` and `docs/design/target-rebuild-review.md` for boundaries and verification limits.
