# Edu Hub Experience Vision Prototype

React/Vite prototype demonstrating 16 role-aware journeys using **Student Academic Results**. All data, approvals, contracts and API responses are synthetic. No production SSO, SQL engine, AI service or policy enforcement backend is connected.

## Experience distinctions

| Persona | 5★ — self-service | 7★ — orchestrated | 9★ — reactive intent | 11★ — outcome first |
| --- | --- | --- | --- | --- |
| Business | Find a trusted Results dashboard; filter subject, year, level and school manually | State a leadership need; open a prepared comparison view | Ask Edu Hub; receive an answer, magnitude, evidence and caveats; ask follow-ups | Land on a personalised three-development Results briefing; explore drivers or subjects with context |
| Analyst | Inspect SDP tabs, request access and write SQL | Describe the analysis; receive recommended products/joins and a workspace | Review method, override level, inspect delays and generate scoped SQL | Land on a refreshed analysis briefing; inspect SQL, definitions, lineage and assumptions |
| System | Inspect a contract and integrate manually | Describe the application; coordinate identity, entitlement, sandbox and subscription | Review fields, freshness, fallback and versions; inspect scaffold and failure scenarios | See stable contract health first; inspect migration with zero consumer code changes |
| Partner | Submit purpose, sponsor, duration and data request; receive a controlled subset | Describe the need; receive a minimum package, synthetic sample and workspace | Review minimisation, aggregation, masking, pseudonymisation and expiry | Receive an approved aggregate evaluation first; inspect controls without raw exports |

11★ opens directly on the outcome. Lower levels retain their role-aware home and explicit starting action. The bottom-right persona/star selector is a separate presenter control.

## Trust and limitations

- Results SDP retains Overview, Schema, Delivery, Versions, Consumers, Lineage, Quality and Access tabs. Original Attendance and Identity product fixtures remain for reference.
- Eight synthetic schools have comparable 2025–2026 results. School I/J submissions are delayed and excluded, never zero-filled. Business answers contain no student identifiers.
- Pass rate is passes divided by valid final results; changes are percentage points. Fixture aggregates use equal school/cohort weights. Descriptive differences do not establish causation.
- Business Q&A supports the visible example questions: calculation, current data, subject comparison, level drivers and School A. Other questions receive an explicit limitation instead of fabricated results. This is a deterministic prototype, not general-purpose AI.
- SQL is editable and the supplied preview can be refreshed. Edited queries require an approved external workspace; the prototype does not execute them.
- Contract scenarios simulate stale responses, expired entitlement and breaking changes. Partner expired/denied scenarios hide results. These are UI demonstrations, not security enforcement.
- Data Owner/Governance backstage retains certification, incidents, lifecycle and consumer-impact checks.
- Unimplemented placeholder operations are disabled. Vercel configuration is unchanged.

## Run locally

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

Build with `npm run build`; preview with `npm run preview`.

## Browser verification

With the local server running:

```sh
npx playwright install chromium
npm test
```

Optional environment variables: `TEST_URL` (default `http://127.0.0.1:5173`) and `BROWSER_EXECUTABLE` (installed Chrome/Chromium executable). Screenshots go to ignored `test-results/`.

The suite walks all 16 journeys and checks SDP tabs, manual/prepared filters, reactive Q&A, proactive briefings, context, analyst overrides, contract failures, partner expiry/denial, Back, sidebar Q&A, blank input, transition cancellation, mobile overflow, governance, logout and invalid stored preferences. Browser runtime and console errors fail the run.

The existing Vite 5 toolchain is retained. `npm audit` reports two development-tool vulnerabilities (Vite/esbuild), requiring a separate toolchain upgrade. Keep the dev server on loopback. Production output is static.

## Deployment

Pushes to the linked GitHub branch trigger the existing Vercel integration. No new Vercel settings or environment variables are required.
