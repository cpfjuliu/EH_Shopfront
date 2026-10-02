# Personas and boundaries

Design for the selected persona's job. Shared components do not imply shared navigation, data access or primary tasks.

| Persona | Jobs and first-visible concepts | Supporting detail | Success |
| --- | --- | --- | --- |
| Business | Questions, dashboards, briefings and decision-ready insight. Lead with the business question, period, outcome and implication. | Definitions, comparisons, source, freshness, quality and caveats. | Understand what matters and make an informed decision. |
| Analyst | Data discovery, analysis, reproducibility and workspaces. Lead with analytical scope, datasets, method and findings as appropriate to the star. | Schemas, queries, parameters, versions, lineage, exclusions and reproducible steps. | Produce, inspect and reproduce a defensible analysis. |
| System/Developer | Contracts, subscriptions, integration and reliability. Lead with consumer requirements, delivery and contract health. | Versions, entitlement, freshness commitments, fallback behavior, failure scenarios and migration impact. | Integrate and operate a dependable consumption contract. |
| External Partner | Approved projects, purpose, controlled access and data minimisation. Lead with the approved scope and permitted outcome. | Minimum required fields or aggregates, masking, expiry, permitted use and access decisions. | Complete the approved project with the least necessary data. |

The implementation uses `system` for System/Developer and `partner` for External Partner. Governance backstage is a separate presenter-controlled context, not another persona's ordinary navigation.

## Strict persona isolation

- Scope navigation, routes, search, notifications, recent items, actions, overlays and evidence to the selected persona and star.
- Do not expose analyst workspaces as Business primary tasks, developer provisioning as Partner tasks, or governance controls in normal user journeys.
- Metadata discovery is distinct from permission to consume data. Apply field approvals, expiry and purpose restrictions to answers, samples, dashboards, exports and proactive findings.
- Keep supporting detail relevant and authorized. Business users may inspect methodology without inheriting an Analyst workspace; partners may inspect controls without receiving raw data.
- URLs, history and stale actions must not switch identity, grant access or unlock prerequisites. Only the separate prototype selector changes simulated persona/star; switching clears incompatible journey state and overlays and cancels pending transitions.

Apply the [star model](star-model.md) within each persona. More proactive interaction never grants broader authority.
