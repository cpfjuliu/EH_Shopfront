# Edu Hub Experience Vision Prototype

Interactive React/Vite prototype for exploring 5★, 7★, 9★ and 11★ Edu Hub experiences across four consumer personas:

- Analyst
- Business user
- System / application developer
- External partner

The prototype is intentionally backed by central mock data rather than separate static pages, so common product behaviour stays consistent across personas and star levels.

## Revamp highlights

- Plain-language attendance scenario: "students missing school frequently" replaces the jargon-heavy "persistent absenteeism" wording.
- Governed metric shown as **Frequent absence rate**, with a visible prototype definition: students absent on 10% or more instructional days in the selected period.
- Fully populated Standard Data Product views for Schema, Delivery, Versions, Consumers, Lineage, Quality and Access.
- Mock contract lifecycle, compatibility windows, registered consumers and delivery commitments.
- Data-quality failure and recovery state for the analyst 9★ journey.
- Trust and transparency controls: Why this answer, What data was used, Show assumptions.
- Notifications and change-management signals.
- Role-aware "My Edu Hub" continuity on the home page.
- Data owner / governance backstage view, accessible from the sidebar or prototype control.
- Product-health mock metrics for reuse, request-to-use time and contract protection.

## Deploy to Vercel

Upload every file in this folder to the repository root. The project intentionally uses a flat structure so phone uploads are easier.

Vercel configuration is included in `vercel.json`:

- Install: `npm install --dangerously-allow-all-scripts`
- Build: `npm run build`
- Output: `dist`

Vercel should detect the Vite application automatically.

## Demo control

The bottom-right prototype control is intentionally not part of the proposed end-user product. It lets the presenter switch persona and experience level and open the governance backstage view.

All data and metrics shown are synthetic prototype content and should not be treated as production MOE definitions or operational figures.
