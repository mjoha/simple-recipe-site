# Feature: Project Cleanup And Generic Docs

## Goal

Clean up the project after the pivots to a generic static Markdown catalog generator.

The current implementation has moved beyond the original recipe/.NET/TypeScript architecture, but some docs, names, examples, and historical feature specs still point at older directions. This feature should make the repository easier for future agents and humans to understand.

---

## Scope

### Include

- Archive obsolete historical feature specs.
- Make user-facing docs generic.
- Make project/package naming generic.
- Remove recipe-specific language from current `.ai` docs.
- Update process examples to match the static catalog architecture.
- Remove stale config fields that no longer apply.
- Add or improve generated-output drift checks.
- Ensure GitHub Pages/deployment docs match the current static HTML output.

### Exclude

- No behavior changes to the generated site.
- No redesign.
- No backend.
- No database.
- No TypeScript reintroduction.
- No large build-script refactor unless required for documentation consistency.

---

## Archive Historical Features

Move obsolete feature specs into an archive folder so future agents do not treat old architecture specs as current guidance.

Suggested structure:

```text
.ai/features/
  014-project-cleanup-and-docs.md
  ...
.ai/archive/features/
  001-baseline-project.md
  002-postgresql-recipes-read-model.md
  ...
```

Archive specs that describe old architecture or old product pivots, especially:

- .NET/API/PostgreSQL features
- recipe-specific UI/model features that no longer represent the current generic catalog direction
- TypeScript runtime rendering features

Keep current or recently relevant static catalog specs active if useful.

At minimum, active feature specs should not contradict the current architecture.

Update `.ai/tasks.json` so archived specs point to their new paths or are clearly marked archived.

---

## Generic Naming Cleanup

Replace obvious recipe-specific naming in user-facing project files.

Update:

- `README.md`
- `package.json`
- `package-lock.json` if package name changes
- `.ai/product.md`
- `.ai/process.md`
- `.ai/stack.md`
- `.ai/architecture.md`
- `.ai/rules.md` if needed

Examples:

- `Simple Recipe Site` -> current repo/product name.
- `simple-recipe-site` package name -> current repo/package name.
- `recipe` examples -> `catalog`, `item`, `entry`, or `static site` examples.
- `feat: add recipe endpoint` -> `feat: add catalog section` or `feat: update static catalog`.
- `feat: add recipe list UI` -> `feat: improve catalog index`.

Do not rename content entries merely because they are recipes. Recipes are valid example content. The tool/project should be generic.

---

## Product Docs Cleanup

Update `.ai/product.md` so it describes the current product:

```text
A static Markdown-powered catalog generator.
```

It should explain:

- source content lives in Markdown
- generated HTML is the runtime output
- the layout is title + search + alphabetical navigation + expandable entries
- the product is not recipe-specific
- the product is not a CMS
- the product prioritizes simplicity and static hosting

Remove or rewrite stale sections like:

- `Search recipes`
- `Add or edit recipes`
- `Initial Recipe Data`
- `No frontend framework unless app outgrows vanilla TypeScript`

---

## Process Docs Cleanup

Update `.ai/process.md` to match current work.

It should emphasize:

- editing `content/index.md` and `content/items/*.md`
- updating `scripts/build-site.mjs` when generated HTML changes
- using `npm run build`
- using `npm run verify`
- keeping browser JS tiny and optional
- avoiding backend/database unless explicitly requested

Remove stale commit examples and workflow text that references backend endpoints or recipe UI.

---

## README Cleanup

Update `README.md` to be a concise, accurate introduction.

It should include:

- what the project does
- content authoring structure
- build command
- local dev command
- verify command
- GitHub Pages deployment notes
- generated output convention
- note about relative paths for GitHub Pages

Use the current repo/product name in the title.

---

## Stale Config Cleanup

Review `content/index.md`.

Remove or update fields that no longer apply to generated HTML output.

For example:

```text
output: wwwroot/data/index.json
```

This is stale if the primary generated output is now `wwwroot/index.html`.

Either remove it or change it to something accurate such as:

```text
output: wwwroot/index.html
```

Only keep config fields that are actually read by `scripts/build-site.mjs` or clearly documented as future-facing.

---

## Generated Output Drift Check

Add or improve verification so stale generated HTML is caught.

After `npm run build`, verification should fail if generated files differ from committed state when that matters.

Suggested check:

```bash
git diff --exit-code -- wwwroot/index.html
```

If `search.js` or CSS are generated in the future, include them too.

Do not make this check fail in contexts where there is no Git checkout, unless that becomes a problem. Keep it simple.

---

## GitHub Pages Workflow Cleanup

Ensure `.github/workflows/deploy-pages.yml` matches current conventions:

- builds static HTML
- commits generated `wwwroot/index.html` back to `main` if changed
- deploys `wwwroot`
- does not mention generated recipe JSON
- does not mention TypeScript
- does not mention backend/database

If package name changes, ensure workflow still works with `npm ci`.

---

## Verification

After implementation, verify:

- `npm run build` succeeds.
- `npm run verify` succeeds, or clearly reports if a local dev server is already running.
- `README.md` no longer says `Simple Recipe Site`.
- `package.json` no longer says `simple-recipe-site`.
- `.ai/product.md` no longer describes recipes as the product.
- `.ai/process.md` no longer uses backend/recipe endpoint examples.
- Active `.ai/features/` specs do not primarily describe obsolete .NET/PostgreSQL architecture.
- Archived specs remain available for history.

---

## Acceptance Criteria

- Current docs describe a generic static Markdown catalog generator.
- Obsolete feature specs are archived or clearly separated from active specs.
- User-facing project naming is generic and current.
- Stale recipe/backend/TypeScript language is removed from current `.ai` docs.
- Stale generated JSON config is removed or corrected.
- Generated HTML drift is caught by verification.
- No runtime behavior changes are introduced.
