# Persona and star isolation audit

The prototype preserves the existing palette, layout, synthetic Academic Results fixtures, SDP metadata and governance backstage. Isolation is enforced by the central capability model and shared route/action reducer, not scattered star checks.

## Acceptance matrix

| Persona | Star | Isolated starting experience | Journey and isolation |
| --- | --- | --- | --- |
| Business | 5 | Discover datasets/dashboards; request fields; use dataset-scoped chat and analysis | PASS |
| Business | 7 | Describe a need; receive datasets/dashboard and access steps; then chat and analyse | PASS |
| Business | 9 | Ask Edu Hub; submit before any answer appears | PASS |
| Business | 11 | Personalised Results briefing; explore with retained context | PASS |
| Analyst | 5 | Catalogue, SDP, access request, manual SQL | PASS |
| Analyst | 7 | Describe analysis; assemble products, joins and workspace | PASS |
| Analyst | 9 | Propose method, review quality, override level, generate SQL | PASS |
| Analyst | 11 | Refreshed findings first; drill into reproducible analysis | PASS |
| Developer | 5 | Inspect contract, select delivery, request access, integrate | PASS |
| Developer | 7 | Describe application; coordinate integration provisioning | PASS |
| Developer | 9 | State requirement; review contract, scaffold and failure tests | PASS |
| Developer | 11 | Stable business contract health and consumer impact | PASS |
| Partner | 5 | Approved purpose request and controlled subset | PASS |
| Partner | 7 | Describe approved need; receive recommended sample package | PASS |
| Partner | 9 | Review minimisation before controlled comparison | PASS |
| Partner | 11 | Approved aggregate outcome first; inspect controls | PASS |

## Automated checks

- First-time approval gates tested across all 16 combinations in addition to the returning-user journeys. Discovery metadata stays available; protected consumption and provisioning require approved fields.
- A single request carries fields from multiple datasets to their respective owners. Separate approval/denial decisions grant only approved fields immediately. The test continues into Business 5 chat, follow-up questions and analysis, then expires access and verifies data disappears.
- Business 7 partial field approval permits dataset explanations but cannot unlock calculations requiring additional fields. Request form mobile layout is checked.

- All 16 capability states: explicit landing kinds, one primary navigation entry, only scoped surface destinations, sequential grants, foreign/stale action rejection, feature-specific overrides, invalid preference fallback.
- All 16 complete journeys: normal actions preserve persona/star; foreign primary actions are absent; manual analysis has no generated assistant; partner packages do not show outcome metrics; reactive answers require submission.
- All 16 shell audits: navigation, cards, search and its empty state, keyboard search, notifications, help, recent items and contextual drill-downs.
- Every other persona/star URL tested from every selected state (240 foreign combinations), plus each locked step, malformed and backstage URLs. None changes the selected experience or unlocks a step.
- Reloads clear step grants. Browser back/forward works within the current session and cannot restore another selection's screens.
- Pending transitions are cancelled on a selector change. Business briefing follow-ups retain the period and question across an evidence detour.
- SDP Schema, Delivery, Versions, Consumers, Lineage, Quality and Access remain populated; governance remains behind the demo control.
- Degraded fixtures retained: delayed submissions, excluded records, stale contract responses, expired entitlement, denied access and breaking schemas.
- Desktop landing screenshots for all 16 states, Business 11 mobile overflow check, and zero browser console/runtime errors.

## Reproduce

Run `npm run build`, start `npm run preview -- --host 127.0.0.1`, then run `npm test` with `TEST_URL` pointing to the preview URL. Set `BROWSER_EXECUTABLE` to an installed Chrome/Chromium executable or install Playwright Chromium. Results and screenshots are written under ignored `test-results/`.

These checks enforce the prototype's interaction model. They are not production authorisation: fixtures, approvals, queries and integrations remain simulated. Vercel configuration is unchanged.
