# Rules

## General

- Follow `.ai/architecture.md`, `.ai/stack.md`, and `.ai/product.md`.
- Keep implementation minimal and iterative.
- Prefer boring, maintainable solutions over clever abstractions.
- Add dependencies only when they remove real complexity.
- Avoid framework churn and upgrade-heavy tooling.

---

## Structure

- Keep related code close together.
- Do not create global services or generic infrastructure prematurely.
- Use feature folders when a feature grows beyond one or two files.
- Keep build scripts focused on deterministic content parsing and HTML generation.

---

## API

Current architecture has no runtime API.

- Do not add controllers/endpoints unless a feature explicitly reintroduces backend runtime.

---

## Database

Current architecture has no runtime database.

- Markdown config/item files in `content/` are source of truth.
- Generated HTML in `dist/index.html` is runtime output.
- Do not add database dependencies unless explicitly required by a future feature.

---

## UI

- Use semantic HTML.
- Use plain CSS.
- Do not add SCSS.
- Prefer native HTML behavior over runtime JavaScript.
- Keep browser JavaScript minimal and optional.
- Avoid frontend frameworks, routers, global state libraries, CSS frameworks, and component libraries for now.

---

## Naming

- Markdown content/config files: simple lowercase names such as `index.md`, `items/*.md`.
- Build scripts: explicit lowercase names such as `build-site.mjs`, `serve-dist.mjs`.
- Frontend assets: simple lowercase names such as `site.css`, `index.html`.

---

## Anti-Patterns

- No premature microservices.
- No frontend framework by default.
- No generic repository/service layer unless it earns its place.
- No complex build pipeline for static assets.
- No backend/database runtime unless explicitly needed.
- No auth, image storage, queues, or background jobs until explicitly needed.