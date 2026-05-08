# Feature: GitHub Pages Deployment

## Goal

Deploy the static recipe site to GitHub Pages.

Add a GitHub Actions workflow with a manual trigger that regenerates recipe JSON from Markdown, commits generated recipe data back to `main` when it changes, builds the static site, and deploys `wwwroot` to GitHub Pages.

---

## User Outcome

As the site author, I can:

- edit Markdown recipes in `content/recipes/`
- commit those Markdown files to `main`
- manually run a GitHub Actions workflow
- have the workflow regenerate `wwwroot/data/recipes.json`
- have generated recipe JSON committed back to `main` if it changed
- have the static site deployed to GitHub Pages

---

## Scope

### Include

- Add a GitHub Actions workflow under `.github/workflows/`.
- Use `workflow_dispatch` for manual triggering.
- Check out `main`.
- Set up Node.
- Install dependencies.
- Run the recipe generation/build commands.
- Commit generated `wwwroot/data/recipes.json` back to `main` when it changes.
- Build TypeScript/static assets for deployment.
- Deploy `wwwroot` to GitHub Pages.
- Ensure generated JavaScript can be deployed even if ignored by Git.
- Document any GitHub repository settings required for Pages.

### Exclude

- No backend deployment.
- No database.
- No Docker.
- No .NET.
- No CMS.
- No admin UI.
- No automatic publish-on-every-push unless explicitly added later.
- No third-party deployment service.

---

## Workflow Requirements

Create a workflow such as:

```text
.github/workflows/deploy-pages.yml
```

Required trigger:

```yaml
on:
  workflow_dispatch:
```

Required permissions:

```yaml
permissions:
  contents: write
  pages: write
  id-token: write
```

Use official GitHub Pages actions where appropriate:

- `actions/checkout`
- `actions/setup-node`
- `actions/configure-pages`
- `actions/upload-pages-artifact`
- `actions/deploy-pages`

Pin major versions reasonably, for example `@v4` / `@v5`.

---

## Generated Recipe Commit

The workflow should commit generated recipe JSON back to `main` only when it changes.

Expected generated file:

```text
wwwroot/data/recipes.json
```

Suggested behavior:

```text
npm ci
npm run build:recipes
git diff --quiet -- wwwroot/data/recipes.json || commit generated data
npm run build
deploy wwwroot
```

Commit details:

- Use the GitHub Actions bot identity.
- Commit message can be:

```text
chore: regenerate recipe data
```

Important:

- Do not commit generated JavaScript unless the project intentionally stops ignoring it.
- The deployment artifact should still include generated JavaScript from the build.

---

## Build Requirements

The workflow should run the normal static build path.

Current expected commands:

```bash
npm ci
npm run build
```

`npm run build` should:

- generate recipes from Markdown
- compile TypeScript

If the workflow separately runs `npm run build:recipes` before committing generated JSON, running `npm run build` afterward is acceptable even if it regenerates recipes a second time.

---

## GitHub Pages Requirements

The deployed artifact should be:

```text
wwwroot/
```

The workflow should upload `wwwroot` as the Pages artifact.

Repository settings likely required:

- GitHub Pages source: GitHub Actions
- Actions allowed to read/write repository contents
- If `main` is protected, allow GitHub Actions to push the generated-data commit or document that the commit step may fail

Do not rely on a `gh-pages` branch unless there is a clear reason.

---

## Static Site Considerations

The app currently uses hash URLs such as:

```text
#/recipes/scrambled-eggs
```

Hash routing is compatible with GitHub Pages because the server only needs to serve `index.html`.

Avoid clean URL routing in this feature.

---

## Verification

After implementation, verify locally:

- `npm ci` or `npm install` works.
- `npm run build` succeeds.
- `npm run verify` succeeds.
- `wwwroot/data/recipes.json` is generated.
- compiled JavaScript exists in `wwwroot/scripts/`.

Verify workflow shape:

- workflow has `workflow_dispatch`
- workflow has necessary permissions
- workflow commits `wwwroot/data/recipes.json` only if changed
- workflow deploys `wwwroot`

If possible, trigger the workflow manually after pushing and confirm:

- generated recipe commit appears on `main` when needed
- Pages deployment succeeds
- live site loads
- `/data/recipes.json` is accessible

---

## Acceptance Criteria

- A manual GitHub Actions workflow exists for deployment.
- The workflow regenerates recipes from Markdown.
- The workflow commits changed `wwwroot/data/recipes.json` to `main`.
- The workflow builds the static frontend.
- The workflow deploys `wwwroot` to GitHub Pages.
- The site remains static-only: no backend, database, Docker, or .NET deployment.
- Required GitHub Pages/repository settings are documented.
