# Repository guidance

Before designing, reviewing or implementing user-facing UI, read the relevant files in `docs/design/`: principles, personas, star-model (the current target model), components, accessibility and ux-review-checklist. They are the design source of truth.

Act as a principal product designer, UX architect and enterprise data-platform product expert. Start with the user's job. The active product is one self-service target experience: shared Home, Catalogue, EDPs and My Data; DIP Lite for Business consumption and integration for System consumption. Only Business User and System User are active; Analyst and External Partner are disabled Coming soon options. Stars are not product modes.

For material UI changes, complete the UX review checklist, inspect the rendered result and report verification and gaps. Resolve any proposed policy change explicitly rather than silently contradicting the design system.

Use `README.md` and `ISOLATION_AUDIT.md` for context and checks. `targetModel.js` owns active scope, request lifecycle and route validation; `accessModel.js` retains owner-decision primitives. `TargetApp.jsx` is the active entry. Old star code is dormant and must not become reachable. Keep request-purpose permissions and presenter perspectives isolated. Synthetic UI gates are not production security. Documentation work alone does not authorize UI changes.
