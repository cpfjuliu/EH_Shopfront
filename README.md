# Edu Hub Experience Vision Prototype

React/Vite prototype demonstrating 16 role-aware journeys using **Student Academic Results**. All data, approvals, contracts and API responses are synthetic. No production SSO, SQL engine, AI service or policy enforcement backend is connected.

## Experience distinctions

| Persona | 5★ — self-service | 7★ — orchestrated | 9★ — reactive intent | 11★ — outcome first |
| --- | --- | --- | --- | --- |
| Business | Discover datasets and dashboards; request fields; select an approved dataset for AI-assisted Chat or analysis | Describe a need; receive recommended datasets, dashboard and access steps; obtain approval and continue in dataset-scoped chat or analysis | Ask Edu Hub; resolve required permissions before returning an answer, evidence and caveats | Land on a personalised Results briefing using approved data; explore with context |
| Analyst | Inspect SDP tabs, request access and write SQL | Describe the analysis; receive recommended products/joins and a workspace | Review method, override level, inspect delays and generate scoped SQL | Land on a refreshed analysis briefing; inspect SQL, definitions, lineage and assumptions |
| System | Inspect a contract and integrate manually | Describe the application; coordinate identity, entitlement, sandbox and subscription | Review fields, freshness, fallback and versions; inspect scaffold and failure scenarios | See stable contract health first; inspect migration with zero consumer code changes |
| Partner | Request fields with a reason within the approved project; receive a controlled subset | Describe the need; receive a minimum package, synthetic sample and workspace | Review minimisation, aggregation, masking, pseudonymisation and expiry | Receive an approved aggregate evaluation first; inspect controls without raw exports |

Each combination opens directly on its own starting experience. Business 9★ starts with Ask Edu Hub; Business 11★ starts with Your Academic Results Briefing. There is one primary navigation entry per combination. The bottom-right persona/star selector is a separate presenter control and is the only place that changes simulated identity or star.

## UX interaction guidance

The repository design source of truth is `docs/design/`; consult `AGENTS.md` before UI work.

- Analyst, System and Partner 9★ interpret a small set of explicitly listed scenarios in `intentModel.js`. Matching is deterministic (normalized wording and documented aliases), not general AI. Unsupported input stays on the question screen. Hourly freshness is understood but rejected because the source is daily.
- The interpreted goal, method and result follow the selected scenario. Protected Analyst/Partner findings require approved fields, including separate pseudonymous partner fields. Editing intent resets downstream journey grants.
- Access starts with the persona's goal, retains the destination during owner approval and leads with Continue when ready. Technical field selection is disclosed progressively; approvals and expiry remain unchanged.
- One contextual evidence pattern describes source/version, simulated refresh, coverage, calculation, owner, lineage, permitted use and caveats. Missing partner baselines/counts are explicitly unavailable, not invented.
- Search and evidence use a shared native modal with inert background, focus containment, Escape and focus restoration. On narrow screens the presenter has a dedicated row outside the scrollable app.
- Business 11★ has one primary exploration path; follow-ups and supporting tools are secondary. Healthy System 11★ requires no action. Business Q&A no longer repeats its visible school table through a primary “Show schools” action.

## Isolation model

`experienceCapabilities.js` defines all 16 states, including navigation, routes, features, home cards, contextual actions, search results and notifications. Stars are independent interaction models rather than cumulative feature tiers. Screen content remains in `experienceFlows.js`.

The shared transition function validates the scope and originating route of actions. Journey steps unlock sequentially; URLs and history cannot grant prerequisites. Hash routes carry persona/star for clarity but never change the selected experience. Switching the demo selector resets journey state, closes overlays, cancels pending transitions and creates a new history session. Reloading a protected route returns to the current landing.

Business 11★ can inspect a supporting dashboard; Analyst 11★ can inspect a read-only source SDP. These are secondary evidence actions, not competing primary journeys. Governance backstage is available only from the demo control. Partner 5★/7★ receive controlled packages; Partner 9★ reviews minimisation before a scenario-specific aggregate result or approved pseudonymous package; Partner 11★ receives the approved outcome first.

## Trust and limitations

- Discoverable asset types are datasets and dashboards. There is no report or separate prepared-view product.
- The demo selector includes First-time user (no field grants) and Returning user (approved Results and Identity fields). Selecting a scenario resets the demonstration; refresh preserves that session's scenario, requests and decisions.
- Data access accepts one Reason and fields from multiple datasets. One request is split into decisions for the respective dataset owners in governance backstage. Each approval grants its fields immediately; pending or denied portions remain unavailable. Continue your journey returns to the activity that needed access.
- Metadata and schemas are discoverable before approval; sample values are filtered to approved fields. Data-backed answers, dashboards, workspaces, provisioning and proactive findings are gated across all 16 combinations. Dataset chat can explain an approved subset, but sample calculations require all relevant fields. Backstage expiry removes tool access immediately.
- Business 5★ chat starts from a user-selected approved dataset. Business 7★ first recommends datasets and access steps from a stated need, then uses the same approved-data tools. Business 9★ still starts from the actual question and Business 11★ from the approved proactive briefing.

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

`npm test` runs capability/access unit tests, all 16 returning-user journeys, the 16-combination isolation audit and all 16 first-time approval gates plus the complete owner-approval lifecycle. The included UX suite (also available as `npm run test:ux`) checks all supported/unsupported intent scenarios, retained access destinations, modal focus, contextual evidence and 320/390px layouts. Run the existing suites individually with `npm run test:capabilities`, `npm run test:journeys`, `npm run test:isolation` and `npm run test:access`. Unit tests need no browser/server.

The journey suite checks SDP tabs, manual/prepared filters, reactive Q&A, proactive briefings, preserved context, analyst overrides, contract failures, partner expiry/denial, navigation, blank input, transition cancellation, mobile overflow, governance, logout and invalid stored preferences. The isolation suite exercises every scoped search result, notifications, contextual actions, recent cards, all foreign persona/star URLs, locked routes, reloads and browser back/forward. Browser runtime and console errors fail both suites. See `ISOLATION_AUDIT.md` for the acceptance matrix; the browser audit also writes ignored `test-results/isolation-audit.json` and 16 landing screenshots.

The existing Vite 5 toolchain is retained. `npm audit` reports two development-tool vulnerabilities (Vite/esbuild), requiring a separate toolchain upgrade. Keep the dev server on loopback. Production output is static.

## Deployment

Pushes to the linked GitHub branch trigger the existing Vercel integration. No new Vercel settings or environment variables are required.
