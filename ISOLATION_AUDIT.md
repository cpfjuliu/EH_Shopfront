# Active target experience boundaries

The 17 October 2026 rebuild replaces the old 16-combination audit. Business and System share discovery, EDPs, scope and My Data. Request intent selects DIP Lite/dashboard or integration; presenter perspective is not the entitlement mechanism.

## Acceptance boundaries

- Only Business and System are selectable. Analyst/External Partner have disabled Coming soon tags.
- Routes contain no persona/star modes. Old persona/star paths, malformed paths and direct backstage paths resolve to Home. History/reload cannot mount legacy screens.
- Perspective switches close overlays and return to Catalogue. Accounts retain separate drafts/requests; cross-perspective stale actions are ignored.
- Scope accepts known EDP fields only. Multi-EDP scope includes a locked common student reference.
- One request routes portions to named owners. Wrong-owner decisions cannot grant access. Pending, denied and expired fields remain unavailable.
- Approvals are per use case. A new purpose with the same fields starts Pending.
- Partial approval enables valid standalone portions. DIP Lite calculations require all relevant fields. Dashboards require reporting approval and necessary fields. Integration routes require system-intent requests.
- Expiry removes consumption immediately. Renewal retains context but needs new decisions.
- S3 supports ad hoc/daily/weekly. VPC requires AWS and declared network/access readiness; no live verification.
- Evidence exposes definitions and permitted metadata, not protected raw samples. Synthetic values and operational conditions are labelled.

## Reproduce

Build and start preview, then `npm test`. Default browser target: `http://127.0.0.1:4173`; override `TEST_URL` if necessary. Use installed Playwright Chromium or `BROWSER_EXECUTABLE`.

`tests/access.test.mjs` retains approval primitive tests. `tests/target-model.test.mjs` covers search, validated scope, linking, fulfilment, per-request authority, lifecycle and routes. `tests/target-journeys.mjs` exercises the Business/System stories, dashboards, owner decisions, filters, expiry/denial, fulfilment, modal focus and narrow layouts against the rendered app. Old test files are dormant references.

These checks verify synthetic frontend behavior, not production authentication, authorization, AWS operation or audit compliance.
