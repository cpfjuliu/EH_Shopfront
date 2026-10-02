# Design principles

These documents govern future UI work. They define intended design quality, not a claim that every existing screen already meets it. Apply them within the requested scope; they do not mandate an unsolicited redesign.

## Start with the job

Act as a principal product designer, UX architect and modern enterprise data-platform product expert. Define the user's job, persona, star model and successful outcome before choosing screens or components. Organize journeys around user decisions and work, not technical architecture.

Every screen must have an obvious primary task and preferably one clear primary action. A read-only outcome may need no primary button. Business concepts lead for Business users; analysis, contracts and controlled partner access follow their respective persona needs. See [personas](personas.md) and [star model](star-model.md).

## Make the next step clear

- Establish hierarchy through order, headings, typography and spacing before adding containers or decoration.
- Use progressive disclosure: show what is needed now, with clearly labelled routes to supporting detail. Never hide a material warning or access restriction behind disclosure.
- Prefer recognition over recall through visible context, meaningful labels, defaults and preserved inputs.
- Keep language, placement and interaction patterns consistent. Explain status, consequences and recovery at the point of action.
- Prevent errors with constraints, validation and previews. Use confirmation for consequential or irreversible actions, not routine navigation.

## Keep enterprise UI restrained

Draw inspiration from the usability of Databricks, Linear, Stripe Dashboard, Material 3 and Apple HIG without copying proprietary branding. Favor functional, calm enterprise interfaces over marketing-style UI.

Use an 8px spacing rhythm where practical: 8, 16, 24 and 32px are useful starting points; 4px can support tight internal alignment. Accessibility and content fit take precedence. Avoid unnecessary cards, gradients, oversized hero areas, duplicate actions and explanatory clutter. Use concise labels and contextual help instead of paragraphs explaining obvious controls.

Reuse existing components when suitable. Consistency does not justify repeating an accessibility defect. See [component rules](components.md) and [accessibility](accessibility.md).

## Make trust inspectable

Keep an evidence entry point near consequential claims. Supporting detail must expose authoritative source, freshness, quality, owner, lineage, sensitivity and permitted use where available and authorized. Mark missing or unknown metadata explicitly; never invent certification or provenance.

AI-generated outputs must expose evidence, assumptions and caveats. Separate observed facts from inference or recommendations; explain coverage, exclusions and uncertainty. Do not fabricate answers or imply that a synthetic prototype executes real queries or enforces real permissions.

Evidence disclosure must respect persona, entitlement and approved purpose. Show an authorized summary or an unavailable explanation when underlying records cannot be exposed.

## Design the full state model

| State | Required experience |
| --- | --- |
| Loading | Identify the pending operation; preserve context and prevent duplicate submission. Offer cancellation where supported. |
| Empty | Distinguish no data, no matches and a new workspace; offer an appropriate next step. |
| Error | Explain what failed and a feasible recovery; preserve valid input. |
| Denied access | Explain the permitted reason and request or owner route where available; expose no protected values. |
| Stale data | Show the as-of time and freshness issue next to affected results; explain whether use remains appropriate. |
| Degraded data | Show missing coverage, exclusions and impact on interpretation; never silently treat missing values as zero. |

Proactive results remain subject to approval, freshness and quality constraints. A higher star does not bypass these states. Review material changes using the [UX checklist](ux-review-checklist.md).
