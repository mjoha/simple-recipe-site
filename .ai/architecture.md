# Architecture

## Overall

Minimal static recipe site.

- Markdown files in `content/recipes` are the source of truth.
- A build script generates `wwwroot/data/recipes.json`.
- Frontend is plain HTML, CSS, and TypeScript with no client framework.
- Runtime serves static files only.

---

## Suggested Structure

Keep structure centered around authored content and static assets:

```text
/
  content/
    recipes/
      *.md
  scripts/
    build-recipes.mjs
    serve-wwwroot.mjs
  wwwroot/
    data/
      recipes.json
    index.html
    styles/
      site.css
    scripts/
      app.ts
```

The exact structure can evolve. Prefer clarity over strict layering.

---

## Build Boundaries

Recipe content:

- Markdown files hold recipe metadata and editorial sections.
- Content is authored manually and reviewed like normal source code.

Build scripts:

- Parse Markdown frontmatter and known section headings.
- Validate required fields.
- Generate deterministic recipe JSON for runtime.

---

## API Shape

No runtime API in the current architecture.

- Frontend fetches `/data/recipes.json`.
- Keep routing client-side via URL hash only.

---

## Frontend Architecture

- Static pages and assets served from `wwwroot`.
- Use semantic HTML and progressive enhancement.
- Keep TypeScript modules small and page-oriented.
- Use `fetch` to load `/data/recipes.json`.
- Avoid client-side routing until there is a strong reason.

---

## Data Format

Runtime data shape comes from generated JSON:

- `id`, `title`, `slug`
- editorial fields (`introduction`, `objective`, `ingredients`, `preparation`, `execution`, `reflection`, `variation`)
- optional metadata (`category`, `timeEstimate`, `difficulty`, `source`)

---

## Rules

- Keep the app static-first and monolithic.
- Prefer simple files and explicit code.
- Do not introduce frontend frameworks.
- Do not introduce a backend/database layer unless a feature explicitly requires it.