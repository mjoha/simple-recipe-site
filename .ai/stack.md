# Stack

## Core

- Static site served from `wwwroot`.
- Authored Markdown collection config under `content/index.md`.
- Authored Markdown items under `content/items`.
- Build-time HTML generation to `wwwroot/index.html`.
- Plain HTML and CSS for runtime behavior.
- No frontend framework by default.

---

## Backend

No backend runtime in the current architecture.

- Do not add controllers or API endpoints unless a future feature explicitly reintroduces a backend.
- Do not add database dependencies for the current static catalog direction.
- Keep data-generation scripts small and explicit.

---

## Frontend

- Static assets served directly from `wwwroot`.
- Use semantic HTML.
- Use plain CSS.
- Do not add SCSS.
- Prefer native browser HTML behavior over runtime JavaScript.
- If search is needed later, use a tiny hand-written JavaScript file without a build step.
- Avoid React, Vue, Svelte, client-side routers, global state libraries, and component frameworks for now.

---

## Dev Environment

- WSL Ubuntu.
- Project files should stay under `/home/...`, not `/mnt/c/...`.
- Node/npm for build scripts.
- Local static dev server for `wwwroot`.

---

## Deployment Direction

- Deploy static files only (`wwwroot` output).
- Treat Markdown config and item files as source of truth and generated HTML as runtime output.
- Keep deployment compatible with basic static hosts.

---

## Future, Not Yet

- Backend/API runtime.
- Database persistence.
- Authentication.
- Recipe image upload/storage.
- Public/private sharing rules.