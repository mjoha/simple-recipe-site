# Simple Recipe Site

## Local Development

1. Build recipes and frontend:

   ```bash
   npm run build
   ```

2. Run static dev server:

   ```bash
   npm run dev
   ```

Frontend: `http://localhost:5002/`
Index data: `http://localhost:5002/data/index.json`

## Authoring Content

- Collection config lives in `content/index.md`.
- Source item files live in `content/items/*.md`.
- Run `npm run build:index` to regenerate `wwwroot/data/index.json`.
- `npm run build` runs both index generation and TypeScript compilation.

## GitHub Pages Deployment

- Workflow file: `.github/workflows/deploy-pages.yml`
- Trigger: run manually from the Actions tab (`workflow_dispatch`)
- The workflow:
  - runs `npm ci`
  - regenerates `wwwroot/data/index.json`
  - commits `wwwroot/data/index.json` back to `main` only when changed
  - runs `npm run build`
  - deploys `wwwroot` to GitHub Pages

### Required Repository Settings

- **Pages source**: set to **GitHub Actions**
- **Actions permissions**: allow workflow read/write access to repository contents
- **Branch protection** (if enabled on `main`): allow GitHub Actions to push the generated data commit, otherwise the commit step can fail
