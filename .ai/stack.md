# Stack

## Core

- Static site served from generated `dist/`.
- Authored Markdown collection config under `content/index.md`.
- Authored Markdown items under `content/items`.
- Build-time HTML generation to `dist/index.html`.
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

- Hand-authored static assets live in `src/` and are copied to `dist/` at build time.
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
- Local static dev server for `dist/`.

---

## Deployment Direction

- Deploy static files only (`dist` output).
- Treat Markdown config and item files as source of truth and generated HTML as runtime output.
- Keep deployment compatible with basic static hosts.

---

## Future, Not Yet

- Backend/API runtime.
- Database persistence.
- Authentication.
- Media upload/storage.
- Public/private sharing rules.