# Self-service target rebuild review — 17 October 2026

## Outcome and scope

Implemented the user-approved replacement of the 16-persona/star experiment with one shared self-service product. Business and System are active presenter perspectives. Analyst and External Partner are visible Coming soon options, disabled without placeholder journeys. Normal routes contain no stars.

Business job: discover data/dashboard → understand shared EDP → scope fields across products → request/track → use approved data in DIP Lite or an embedded dashboard. System job: same discovery/governance path → inspect technical suitability → specify fulfilment → integrate and operate approved consumption. Healthy integration needs no primary action.

## Review checklist

| Item | Result and evidence |
| --- | --- |
| Primary task | Pass: shared Home/Catalogue/My Data; one purpose/scope form and one review before submission; clear approved-to-use actions. |
| Hierarchy | Pass: purpose/trust precede field selection; technical detail is disclosed. Request status and outstanding decisions lead My Data/details. |
| Unnecessary elements | Pass: no star comparison surfaces, decorative heroes, operations statistics or additional workflow navigation. Discovery rows replace the old broad card grid; Home uses three meaningful product cards. |
| Duplicated actions | Pass: one submit/review primary; one contextual evidence entry with an EDP selector in multi-product consumption. |
| Permissions and perspective isolation | Pass: request-specific approvals, wrong-owner rejection, partial access, expiry, separate presenter accounts and consumption-intent routing. Another use case never inherits approval automatically. |
| Retired journeys | Pass: Coming soon options are disabled; all 16 old persona/star landing URLs return Home without changing perspective. Model checks also cover old nested access/backstage/step paths. History/reload do not mount legacy screens. |
| Accessibility | Targeted pass: persistent labels, table headers/captions, skip link, focus indicators, modal focus/Shift+Tab/inert/Escape/restoration and disclosure keyboard operation. Rendered contrast samples: primary text 5.09:1, secondary text 6.08:1, input boundary 3.05:1. Gap: no full screen-reader or exhaustive WCAG conformance audit. |
| Responsive | Pass for inspected 1440px desktop and 390/320px mobile surfaces. Presenter controls occupy a reserved footer; primary controls can be scrolled into view above it. Tables scroll within their own region. Gap: separate browser-zoom testing not performed. |
| State coverage | Pass: saved drafts, pending/partial/active/expired/denied states, loading feedback, empty discovery, missing access, unsupported/out-of-scope questions, unavailable VPC prerequisites, stale/degraded/breaking/failed consumption. Source delays are not zero-filled. |
| Trust/evidence | Pass: owner, version, definitions, simulated refresh, limitations, permitted use and technical provenance. Division reuse/contact metadata are explicitly illustrative. Evidence does not claim live AI, policy enforcement or connectivity. |
| Component consistency | Pass: existing palette/tokens, Results fixtures, approval reducer, owner controls and Modal retained. New shared target components serve both active perspectives. Vite/Vercel configuration unchanged. |

## Verification performed

- Normal Vite production build passed. The Windows filesystem sandbox blocked realpath resolution; the same build succeeded outside that sandbox without configuration changes.
- `node --test tests/access.test.mjs tests/target-model.test.mjs`: **15 passed**. Retains existing owner/access primitive checks and adds target lifecycle, linking, intent requirements, per-use-case authority and route checks.
- `tests/target-journeys.mjs`: **passed**, no browser console/runtime errors. Business three-EDP request, independent approvals, partial DIP Lite use, full activation, evidence, expiry/renewal and embedded Attendance dashboard; System technical evaluation, weekly S3, conditional VPC, active integration and operational states; lifecycle filters, denied requests, retired routes/history, modal keyboard and 390/320px reachability.
- Rendered captures inspected for Home, grouped search, EDPs, review, pending/partial/active consumption, dashboards, S3/VPC integration, presenter/demo controls and evidence. Screenshots are in ignored `test-results/target-*.png`.
- Targeted React/state review caught and fixed loss of backstage expiry availability when another request is submitted; a regression test protects it. Adding dashboard scope also preserves preselected fields.

## Product assumptions and limits

- Student Academic Results remains the deepest analytical example. Attendance dashboard content is a small synthetic sample; Identity & Contact has metadata rather than real contact values. DVP views are local embedded stand-ins, not a connected DVP service.
- `student_id` is a synthetic linking example; no production identity/key design is asserted.
- Per-use-case approval is deliberate. Reporting dashboards require reporting intent plus the necessary fields. Partial approval permits standalone approved portions, not cross-product computation using pending fields.
- S3 ad hoc/daily/weekly and VPC readiness are simulations. No bucket, files, connection, endpoint, credentials, service guarantee or network verification is created.
- Other Data Assets remain discovery-only, requiring owner assessment rather than inheriting EDP trust/fulfilment.
- Reuse divisions and timestamps are illustrative; there is no live adoption or freshness service. Browser storage is not production enforcement.
- Legacy journey modules and their old browser tests remain dormant references. The active npm test scripts target the rebuilt product. Their old navigation rules are explicitly superseded in the maintained design docs.

The leadership walkthrough now demonstrates shared discovery/governance and two consumption paths. The engineering walkthrough exposes scope, per-owner decisions, per-request authorization and fulfilment metadata without hidden backend behavior.
