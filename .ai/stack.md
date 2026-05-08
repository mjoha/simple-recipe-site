# Stack

## Core

- Static site served from `wwwroot`.
- Authored Markdown recipes under `content/recipes`.
- Build-time JSON generation to `wwwroot/data/recipes.json`.
- Plain HTML, simple CSS, and TypeScript for frontend behavior.
- No frontend framework by default.

---

## Backend

No backend runtime in the current architecture.

- Do not add controllers or API endpoints unless a future feature explicitly reintroduces a backend.
- Do not add database dependencies for the current authored cookbook direction.
- Keep data-generation scripts small and explicit.

---

## Frontend

- Static assets served directly from `wwwroot`.
- Use semantic HTML.
- Use plain CSS.
- Do not add SCSS.
- Use TypeScript for browser code.
- Avoid React, Vue, Svelte, client-side routers, global state libraries, and component frameworks for now.

---

## Dev Environment

- WSL Ubuntu.
- Project files should stay under `/home/...`, not `/mnt/c/...`.
- Node/npm for TypeScript tooling and recipe build scripts.
- Local static dev server for `wwwroot`.

---

## Deployment Direction

- Deploy static files only (`wwwroot` output).
- Treat Markdown recipe files as source of truth and generated JSON as runtime data.
- Keep deployment compatible with basic static hosts.

---

## Future, Not Yet

- Backend/API runtime.
- Database persistence.
- Authentication.
- Recipe image upload/storage.
- Public/private sharing rules.