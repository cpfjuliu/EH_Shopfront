# Reusable component rules

Use existing patterns before adding variants. Active shared components are `Btn`, `Heading`, `Facts`, `DataTable`, `ScopeSummary`, `ApprovedScope` and `ProductEvidence` in `TargetUI.jsx`, plus `Modal` in `Modal.jsx`. `TargetApp.jsx` owns the shared shell/catalogue/request views; `TargetConsumption.jsx` owns DIP Lite, dashboards and integration. Retained governance uses `AccessExperience.jsx` owner controls. These are reuse candidates, not a certification of compliance.

Use the spacing and hierarchy rules in [principles](principles.md) and the interaction requirements in [accessibility](accessibility.md).

| Component | Reusable rules |
| --- | --- |
| Navigation | Home, Catalogue and My Data are shared primary navigation. Request scope stays available across EDPs. DIP Lite, dashboards and integration are contextual destinations. No stars or retired personas in product navigation. Keep perspective and demo-state controls separate. |
| Buttons | Prefer one primary action per task surface; make secondary and destructive actions visually distinct. Use specific verb labels. Use links for navigation and buttons for actions. Prevent repeated submission, show pending state and explain unavailable actions. Avoid duplicate controls for the same action on the same surface. |
| Cards | Use only for a meaningful self-contained unit or selectable item. Prefer headings, rows or dividers for ordinary grouping. Avoid nested cards and clickable containers with ambiguous nested actions. |
| Tables | Use for comparison and structured records. Provide meaningful headers, units, alignment, sorting state and relevant filters. Distinguish zero, missing and withheld values. Keep row actions predictable; allow horizontal scrolling for truly two-dimensional data without making the entire page overflow. |
| Forms | Use persistent labels, useful defaults and explicit required/optional status. Group related inputs; explain purpose for sensitive requests. Validate near the field, preserve input and provide a summary for multiple errors. Confirm consequential changes with their actual scope. |
| Tabs | Use for peer views of the same object, not ordered steps or global navigation. Make selection clear and keyboard-operable. Preserve object, request and intended-use context. |
| Drawers | Use for contextual inspection or a short edit while preserving the parent task. Provide a clear title, close control and return context. Decide explicitly whether the drawer is modal; trap focus only when it is. Use a full page for complex work. |
| Modals | Reserve for focused decisions or short blocking tasks. Name the dialog, manage focus, provide a safe cancellation route and restore focus on close. Avoid nested dialogs and routine informational interruptions. |
| Status indicators | Pair color with text or an icon and accessible meaning. Distinguish pending, approved, denied, expired, stale and degraded. Show relevant time and recovery; do not imply success before completion. |
| Charts | Choose the simplest chart that answers the question. Label units, period, scale and comparison baseline. Distinguish missing/excluded observations from zero; disclose coverage and methodology. Provide a textual takeaway and accessible values. Avoid decorative effects and misleading axes. |
| Evidence panels | Place a concise evidence entry point beside the claim. Disclose authorized source, freshness, quality, owner, lineage, sensitivity and permitted use, with method, assumptions and caveats for generated outputs. Preserve context on close; never leak protected records through evidence. |

Design relevant loading, empty, error, denied-access, stale-data and degraded-data variants alongside the normal state. Critical caveats stay visible with affected content even when full evidence is collapsed. New variants should have a reusable purpose, consistent terminology and a clear reason the existing pattern cannot meet the job.

The EDP core shows purpose, meaning, owner, freshness, coverage, use cases and illustrative division-level reuse. Field selection uses plain-language labels; technical names/types are disclosed by job. Multi-EDP scope adds locked linking fields with an explanation. One request routes portions to the relevant owners. My Data filters Draft, Pending, Partially Approved, Active and Expired; denied decisions remain visible in details and All. Evidence has one modal entry per task, with an EDP selector for multi-product consumption.
