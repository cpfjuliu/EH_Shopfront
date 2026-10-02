# Star interaction model

Stars are independent interaction models, not cumulative feature tiers, entitlement levels or measures of feature count. Each persona/star combination has its own starting experience and primary task.

| Star | Model | Primary interaction |
| --- | --- | --- |
| 5★ | Strong self-service | The user discovers, chooses and performs the task with clear tools and feedback. |
| 7★ | Orchestrated journey | The user describes a need; the experience coordinates recommendations, prerequisites and sequential steps. |
| 9★ | Reactive intent-aware experience | The user expresses intent; the experience responds with a contextual answer or proposal and inspectable evidence. |
| 11★ | Proactive outcome-first experience | The experience presents a relevant, authorized outcome or meaningful change; the user inspects or acts as needed. |

**9★ = Ask me something.**

**11★ = Here is what you should know.**

These phrases define interaction behavior; they need not be literal labels on every screen. A 9★ screen may suggest prompts or explain scope, but must not present a completed personalized answer before the user supplies intent. An 11★ screen leads with an approved outcome or its availability/status, rather than requiring a question to begin.

## Persona expression

| Persona | 5★ | 7★ | 9★ | 11★ |
| --- | --- | --- | --- | --- |
| Business | Discover data and dashboards | Coordinate a need through access to insight | Ask a business question | Receive a decision-ready briefing |
| Analyst | Discover data and write analysis | Assemble analysis and workspace | Respond to analytical intent with method and scoped analysis | Receive refreshed findings; inspect reproducibility |
| System/Developer | Inspect a contract and integrate | Coordinate identity, access and subscription | Respond to requirements with a contract proposal and failure review | See contract health and consumer impact first |
| External Partner | Request a controlled subset for an approved purpose | Coordinate the minimum approved package | Respond to approved intent with minimisation and a controlled result | Receive an approved aggregate outcome first |

## Strict star isolation

- Higher stars should usually reduce visible complexity and primary choices. Do not make 11★ the most feature-dense experience.
- Lower-star capabilities may appear as secondary drill-downs where necessary, but must not compete with the higher-star primary interaction model. For example, an 11★ briefing may link to a supporting dashboard; the dashboard must not become a parallel landing journey.
- Preserve the selected persona/star and task context through drill-down and return. Follow-up questions can support an 11★ outcome without replacing its proactive starting model.
- Scope every entry point, including search, notifications, history and contextual actions. A direct URL cannot change the model or bypass journey prerequisites.
- Apply the same access, evidence and data-quality rules at every star. Proactive does not mean autonomous permission grants or unapproved consequential actions.

Use `experienceCapabilities.js` as the implementation's central scope model and `experienceFlows.js` for screen content. Preserve the repository's single primary navigation entry per combination and separate presenter selector. Verify changes against `ISOLATION_AUDIT.md`; do not interpret historical PASS labels as evidence for newly changed behavior.
