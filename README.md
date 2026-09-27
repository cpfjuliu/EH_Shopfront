# Edu Hub Experience Prototype

A stateful React/Vite prototype for exploring 5★ / 7★ / 9★ / 11★ experiences across four Edu Hub personas:

- Analyst
- Business user
- System / application developer
- External partner

The prototype is intentionally **not** a collection of static HTML pages. It uses shared components, shared data objects and data-driven experience flows so the UI behaves like one product.

## What is included

- Dummy MOE SSO login
- Role-aware home screen
- Persistent Databricks-inspired app shell
- Global search / command palette
- Persona-specific navigation
- Demo-only persona and experience-level control
- Stateful journeys with back/next behaviour
- Simulated AI / orchestration loading states
- Data catalogue and data-product details
- Access request form
- Provisioning progress
- SQL / analysis workspace
- Business dashboards and governed Q&A
- Developer contracts, APIs and integration scaffolds
- External partner project and controlled-workspace flows
- Responsive desktop / tablet / mobile layout

## Run locally

```bash
npm install
npm run dev
```

Then open the URL shown by Vite, normally `http://localhost:5173`.

## Deploy to Vercel

1. Upload this entire project to a GitHub repository.
2. In Vercel, choose **Add New → Project**.
3. Import the GitHub repository.
4. Vercel should detect **Vite** automatically.
5. Build command: `npm run build`
6. Output directory: `dist`
7. Deploy.

No environment variables or backend services are required.

## Recommended demo sequence

Start with **Analyst → 5★ → 7★ → 9★ → 11★** to show the same broad need with progressively more complexity absorbed by Edu Hub. Then switch persona to show that the entry point is role-aware:

- Analyst: data / analysis intent
- Business: business question / trusted insight
- System: contract / application requirement
- External partner: approved project / approved outcome

The floating **Prototype** control is demo-only and would not exist in the production product.
