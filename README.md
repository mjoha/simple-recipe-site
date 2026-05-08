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
- Source item files live in `content/items/*.md`.
- `npm run build` generates `wwwroot/index.html` from Markdown.
- Keep source changes in `content/` and `scripts/`; treat `wwwroot/index.html` as generated output.

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
  - commits generated `wwwroot/index.html` back to `main` only when changed
  - deploys `wwwroot` to GitHub Pages

### Required Repository Settings

- **Pages source**: set to **GitHub Actions**
- **Actions permissions**: allow workflow read/write access to repository contents
- **Branch protection** (if enabled on `main`): allow GitHub Actions to push the generated data commit, otherwise the commit step can fail

## Generated Output Convention

- `wwwroot/index.html` is generated and committed.
- Runtime is static HTML + CSS with tiny optional browser JavaScript.
- Use relative asset paths (for example `./styles/site.css`) for GitHub Pages compatibility.
