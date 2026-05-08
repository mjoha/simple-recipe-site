# Feature: Generate Static HTML

## Goal

Remove the TypeScript-driven runtime rendering model and generate the catalog HTML at build time.

The app should become:

```text
Markdown/config -> build script -> static HTML + CSS
```

The browser should not need to fetch JSON and render the catalog with TypeScript. The generated `wwwroot/index.html` should contain the full indexed catalog markup.

---

## Product Direction

This project is a simple static Markdown catalog generator.

Prefer generated HTML and native browser behavior over runtime JavaScript when possible.

Keep the current user-facing layout:

- title
- optional search field
- alphabetical navigation
- indexed item list
- inline expandable item content

But produce that layout at build time.

---

## Scope

### Include

- Generate `wwwroot/index.html` from `content/index.md` and `content/items/*.md`.
- Remove TypeScript as a runtime/rendering requirement.
- Remove JSON fetch/rendering from the frontend.
- Remove or retire `wwwroot/scripts/*.ts` and compiled generated app scripts if no longer needed.
- Keep `wwwroot/styles/site.css`.
- Use semantic generated HTML.
- Use native HTML behavior for expansion, preferably `<details>` / `<summary>`.
- Use normal anchor links for alphabetical navigation.
- Preserve shareable item links using stable element IDs/slugs.
- Decide whether to keep search:
  - either remove search for a pure HTML/CSS version
  - or add a tiny plain JavaScript `search.js` with no build step
- Update local build/dev/verify scripts.
- Update GitHub Pages workflow if needed.
- Update `README.md`.
- Update `.ai/architecture.md`, `.ai/stack.md`, `.ai/process.md`, and any other `.ai` docs that still mention TypeScript runtime rendering or generated JSON as the primary runtime data.

### Exclude

- No TypeScript requirement for browser rendering.
- No frontend framework.
- No backend.
- No database.
- No CMS.
- No markdown parser in the browser.
- No client-side router.
- No complex static-site generator.
- No bundler.
- No SCSS.
- No generated multi-page site unless it is simpler than the single-page output.

---

## Generated HTML Requirements

The build script should generate a complete static page:

```text
wwwroot/index.html
```

The generated page should include:

- document title from `content/index.md`
- visible page title from `content/index.md`
- optional collection description
- alphabetical navigation
- grouped item sections
- expandable items
- item metadata
- item sections in configured order

Use relative asset paths for GitHub Pages compatibility:

```html
<link rel="stylesheet" href="./styles/site.css">
```

If a search script is retained:

```html
<script src="./scripts/search.js" defer></script>
```

Do not use root-relative paths like `/styles/site.css`.

---

## Expansion Behavior

Prefer native HTML:

```html
<details id="scrambled-eggs" class="catalog-item">
  <summary>Scrambled Eggs</summary>
  ...
</details>
```

Benefits:

- no router required
- no custom expand/collapse state required
- multiple items can be open naturally
- content is available without JavaScript

Shareable links:

- `#scrambled-eggs` should jump to the item.
- It is acceptable if the browser does not auto-open a closed `<details>` from a hash by default.
- If auto-opening hash targets is important, implement it with a tiny plain JS helper, not TypeScript.

Keep usability first. Avoid recreating the previous custom router unless absolutely necessary.

---

## Alphabetical Navigation

Generate letter/initial sections:

```html
<nav aria-label="Catalog index">
  <a href="#letter-a">A</a>
  <a href="#letter-b">B</a>
</nav>

<section id="letter-a">
  <h2>A</h2>
  ...
</section>
```

Use normal anchors. No router.

Unavailable letters may be omitted entirely or rendered as inactive text. Choose the simpler, cleaner option.

---

## Search Decision

Search is the only reason to keep browser JavaScript.

Acceptable options:

### Option A: No Search

Remove search for now.

This produces the simplest architecture:

```text
HTML + CSS only
```

### Option B: Tiny Plain JS Search

Keep search with one small hand-written JavaScript file:

```text
wwwroot/scripts/search.js
```

Requirements:

- no TypeScript
- no build step for search
- no dependencies
- filter generated item elements using data attributes
- keep implementation small and readable

Example generated attributes:

```html
<details class="catalog-item" data-search="scrambled eggs eggs butter salt ...">
```

If implementing search makes the feature much larger, choose Option A and document that search can be reintroduced later.

---

## Build Script Requirements

Replace or evolve the current index build script so it writes HTML as the primary output.

Suggested script:

```text
scripts/build-site.mjs
```

Expected behavior:

- read `content/index.md`
- read item files from configured source directory
- parse frontmatter and configured sections
- validate required fields
- sort items
- generate `wwwroot/index.html`
- optionally generate `wwwroot/data/index.json` as an export/debug artifact

If JSON is kept, it should be secondary. The UI should not depend on fetching it.

---

## Package Scripts

Update scripts to remove TypeScript build assumptions.

Suggested:

```json
{
  "scripts": {
    "build": "node scripts/build-site.mjs",
    "dev": "npm run build && node scripts/serve-wwwroot.mjs",
    "verify": "./scripts/verify-local.sh"
  }
}
```

Remove:

- `tsc` build requirement
- `watch:ts`
- TypeScript dev dependency if unused

Keep `package.json` minimal.

---

## Verification

Update `scripts/verify-local.sh` so it checks the generated static HTML site.

It should:

- run `npm run build`
- start static server
- verify `/` responds
- verify `wwwroot/index.html` exists
- verify generated HTML contains expected catalog content
- verify CSS exists
- if search is kept, verify `search.js` exists
- not require TypeScript, JSON fetch, backend, Docker, or database

`npm run verify` should remain short-lived and clean up its server process.

---

## GitHub Pages Workflow

Update `.github/workflows/deploy-pages.yml`:

- run `npm ci`
- run `npm run build`
- commit generated `wwwroot/index.html` if changed, if generated output is intended to be committed
- deploy `wwwroot`

Generated-output decision:

- If `wwwroot/index.html` is committed, workflow can commit changes back to `main`.
- If generated HTML is not committed, workflow should just build and deploy.

Choose the simpler project convention and document it in the README.

Do not commit generated JavaScript that no longer exists.

---

## README Updates

Update `README.md` to explain:

- the project generates a static catalog from Markdown
- content lives in `content/index.md` and `content/items/*.md`
- `npm run build` generates `wwwroot/index.html`
- `npm run dev` serves locally
- `npm run verify` smoke-tests the static site
- deployment uses GitHub Pages
- whether generated `wwwroot/index.html` is committed or only built in CI

---

## AI Docs Updates

Update `.ai` files to reflect the new architecture:

- `architecture.md`: generated HTML is runtime, not generated JSON + TS rendering
- `stack.md`: no TypeScript unless search JS is reintroduced separately
- `process.md`: verify/build commands
- `product.md`: generic static Markdown catalog direction if needed
- `rules.md`: prefer native HTML/CSS and generated markup over runtime JS

---

## Acceptance Criteria

- `wwwroot/index.html` is generated from Markdown/config.
- The catalog UI works without TypeScript runtime rendering.
- Existing indexed layout is preserved in generated HTML.
- Item expansion uses native HTML or tiny plain JS only.
- Alphabetical navigation uses normal anchors.
- `npm run build`, `npm run dev`, and `npm run verify` work.
- GitHub Pages deployment still works.
- README is updated.
- `.ai` docs are updated.
- TypeScript dependency and scripts are removed if no longer used.
- No backend, database, framework, bundler, CMS, or unnecessary dependency is introduced.
