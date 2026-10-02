# UX review checklist

Complete this review for every material UI change: changes to visible hierarchy, navigation, tasks, actions, components, data presentation or interaction states. Record each item as Pass, Gap or Not applicable, with brief evidence or a reason. Do not mark an untested behavior as Pass.

State the affected persona/star combinations, user job, intended outcome and primary action (or why none is needed).

- [ ] **Primary-task clarity:** The first view makes the job and next step obvious. A higher-star outcome is not buried beneath setup or competing tools.
- [ ] **Hierarchy:** Headings, content order, typography and spacing prioritize the decision. Supporting detail is progressively disclosed; material warnings remain visible.
- [ ] **Unnecessary elements:** Remove decoration, cards, hero areas, helper copy and controls that do not help the task.
- [ ] **Duplicated actions:** Each action has a clear home. Any repeated action has a demonstrated usability reason and does not compete with the primary action.
- [ ] **Persona leakage:** Navigation, content, search, notifications, evidence, exports and contextual actions remain within persona and approved access/purpose boundaries.
- [ ] **Star leakage:** Landing and primary interaction match the selected star. Lower-star tools remain secondary; 11★ does not accumulate every feature. Direct URLs, history, selector changes and stale actions preserve isolation and prerequisites.
- [ ] **Accessibility:** Check semantics, labels, keyboard completion, focus, contrast, non-color cues, touch targets and assistive-technology behavior using [accessibility requirements](accessibility.md).
- [ ] **Responsiveness:** Verify affected flows at narrow and wide widths and with zoom. Preserve content order, readable data and reachable controls without whole-page horizontal overflow.
- [ ] **Loading/error/degraded states:** Cover loading, empty, error, denied-access, stale-data and degraded-data states. Preserve context and input, prevent repeated actions, and provide feasible recovery. Missing data is not zero.
- [ ] **Trust/evidence:** Claims expose authorized source, freshness, quality, owner, lineage, sensitivity and permitted use. Generated outputs expose evidence, assumptions and caveats. Synthetic behavior and unavailable evidence are stated honestly.
- [ ] **Component consistency:** Reuse suitable existing components, terminology, spacing and behavior. Justify necessary variants and correct relevant accessibility defects.

Use `README.md` for test commands and `ISOLATION_AUDIT.md` for scope expectations. Run relevant existing checks; capability, routing or access changes require the corresponding isolation/access coverage, including affected persona/star combinations. Inspect the changed flow in the browser, including non-happy paths. Documentation-only changes require content and consistency review, not an application test run.

Before completion, report what changed, checks performed and unresolved gaps. Fix material failures within scope; otherwise identify the limitation explicitly. A passing build alone does not complete this review. Keep these documents aligned when an authorized design decision changes a rule, and review for contradictions and unnecessary verbosity.
