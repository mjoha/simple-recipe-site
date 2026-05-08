# Architecture

## Overall

Minimal static indexed Markdown site.

- `content/index.md` defines collection configuration.
- Markdown item files in `content/items` are source content.
- A build script generates `wwwroot/data/index.json`.
- Frontend is plain HTML, CSS, and TypeScript with no client framework.
- Runtime serves static files only.

---

## Suggested Structure

Keep structure centered around authored content and static assets:

```text
/
  content/
    index.md
    items/
      *.md
  scripts/
    build-index.mjs
    serve-wwwroot.mjs
  wwwroot/
    data/
      index.json
    index.html
    styles/
      site.css
    scripts/
      app.ts
```

The exact structure can evolve. Prefer clarity over strict layering.

---

## Build Boundaries

Collection content:

- Markdown files hold item metadata and authored sections.
- Content is authored manually and reviewed like normal source code.

Build scripts:

- Parse Markdown frontmatter and known section headings.
- Validate required fields.
- Generate deterministic index JSON for runtime.

---

## API Shape

No runtime API in the current architecture.

- Frontend fetches `/data/index.json`.
- Keep routing client-side via URL hash only.

---

## Frontend Architecture

- Static pages and assets served from `wwwroot`.
- Use semantic HTML and progressive enhancement.
- Keep TypeScript modules small and page-oriented.
- Use `fetch` to load `/data/index.json`.
- Avoid client-side routing until there is a strong reason.

---

## Data Format

Runtime data shape comes from generated index JSON:

- collection metadata (`title`, `itemName`, `itemNamePlural`)
- field configuration (`titleField`, `slugField`, `searchFields`, `sections`, `metadata`)
- item entries with deterministic `id`, `fields`, and `sections`

---

## Rules

- Keep the app static-first and monolithic.
- Prefer simple files and explicit code.
- Do not introduce frontend frameworks.
- Do not introduce a backend/database layer unless a feature explicitly requires it.