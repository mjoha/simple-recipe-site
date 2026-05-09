# Static Markdown Catalog

## Local Development

1. Build generated catalog HTML:

   ```bash
   npm run build
   ```

2. Run static dev server:

   ```bash
   npm run dev
   ```

Local site: `http://localhost:5002/`

## Authoring Content

- Collection config lives in `content/index.md`.
- Optional **`groupBy`**: name of an item frontmatter field used to segment the index (for example `kind` or `course`). When set, the build emits a row of group chips and one section per distinct value; items missing the field go in **Other** (listed last). Omit `groupBy` for a single flat list sorted by title.
- Optional **`groupOrder`**: comma-separated group labels in display order. Labels not listed are appended alphabetically after the ordered groups (still with **Other** last). Entries in `groupOrder` that have no items are skipped.
- Source item files live in `content/items/*.md`.
- **Images**: put files under `content/images/` and reference them from section bodies with Markdown on its **own line**: `![Alt text](filename.ext)` or `![Alt text](filename.ext "Optional caption")`. Paths are relative to `content/images/` (no leading `/`, no `..`). **Alt text is required.** Only referenced files are copied to `dist/images/` at build time. Allowed extensions: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.gif`, `.svg`. With JavaScript enabled, clicking a preview opens an in-page lightbox; without JS, the link opens the image in a new tab. Prefer reasonably sized files (the build does not resize images).
- Hand-authored browser assets live in `src/styles/` and `src/scripts/`.
- `npm run build` generates `dist/index.html` from Markdown and copies assets into `dist/`.
- Keep source changes in `content/`, `src/`, and `scripts/`; treat `dist/` as generated output.

## Commands

- Build once: `npm run build`
- Serve locally: `npm run dev`
- Smoke test: `npm run verify`

## GitHub Pages Deployment

- Workflow file: `.github/workflows/deploy-pages.yml`
- Trigger: run manually from the Actions tab (`workflow_dispatch`)
- The workflow:
  - runs `npm ci`
  - runs `npm run build`
  - uploads `dist/` as the Pages artifact
  - deploys `dist/` to GitHub Pages

### Required Repository Settings

- **Pages source**: set to **GitHub Actions**
- **Actions permissions**: allow workflow read access and Pages deployment permissions

## Generated Output Convention

- `dist/` is generated and reproducible from `content/`, `src/`, and `scripts/build-site.mjs`.
- Runtime is static HTML + CSS with tiny optional browser JavaScript.
- Use relative asset paths (for example `./styles/site.css`) for GitHub Pages compatibility.
