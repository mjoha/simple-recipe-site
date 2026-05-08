# Architecture

## Overall

Minimal static indexed Markdown site.

- `content/index.md` defines collection configuration.
- Markdown item files in `content/items` are source content.
- A build script generates `wwwroot/index.html`.
- Frontend runtime is static HTML and CSS with no client framework.
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
    build-site.mjs
    serve-wwwroot.mjs
  wwwroot/
    index.html
    styles/
      site.css
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
- Generate deterministic catalog HTML for runtime.

---

## API Shape

No runtime API in the current architecture.

---

## Frontend Architecture

- Static pages and assets served from `wwwroot`.
- Use semantic HTML and progressive enhancement.
- Prefer generated semantic markup and native elements such as `<details>/<summary>`.
- Avoid runtime JavaScript unless there is a clear user-facing need.

---

## Data Format

- Source content lives in Markdown under `content/`.
- Runtime output is generated `wwwroot/index.html`.

---

## Rules

- Keep the app static-first and monolithic.
- Prefer simple files and explicit code.
- Do not introduce frontend frameworks.
- Do not introduce a backend/database layer unless a feature explicitly requires it.