# Feature: Pivot To Static Markdown Recipes

## Goal

Remove the backend/database runtime and pivot the app to a static authored recipe site.

Recipes should live as Markdown files in the repository as the source of truth. A build step should generate static JSON that the vanilla TypeScript frontend fetches at runtime.

The result should be simpler to maintain, easier to deploy, and better aligned with an authored editorial cookbook.

---

## Product Decision

The app is an authored, curated recipe field guide.

It is not currently:

- a user-generated recipe platform
- a dynamic recipe database
- a CRUD app
- a community voting/commenting app

Prefer content quality, editorial control, and simple deployment over dynamic backend features.

---

## Target Architecture

```text
content/recipes/*.md
        ↓ build script
wwwroot/data/recipes.json
        ↓ fetch
vanilla TypeScript frontend
```

Runtime should be static files only:

- `index.html`
- CSS
- compiled JavaScript
- generated `recipes.json`

No API server should be required to browse recipes.

---

## Scope

### Include

- Remove ASP.NET Core runtime dependency from the app.
- Remove PostgreSQL runtime dependency.
- Remove EF Core usage, migrations, DbContext, controllers, and recipe database model.
- Add `content/recipes/` as the authored Markdown source directory.
- Add at least one Markdown recipe file using the editorial recipe format.
- Add a build/import script that converts Markdown recipes to `wwwroot/data/recipes.json`.
- Update frontend data loading to fetch `/data/recipes.json` instead of `/api/recipes`.
- Preserve the existing vanilla TypeScript frontend.
- Preserve recipe index, search, inline expansion, and hash URL behavior.
- Update local development scripts.
- Update verification scripts.
- Update `.ai/stack.md`, `.ai/architecture.md`, and any process docs that still describe .NET/PostgreSQL as the current architecture.
- Keep deployment static-host friendly.

### Exclude

- No backend API.
- No database.
- No Docker requirement for local development.
- No EF Core.
- No migrations.
- No admin UI.
- No create/edit UI in the browser.
- No user accounts.
- No comments, ratings, or voting.
- No markdown parser in the browser.
- No frontend framework.
- No bundler unless truly needed.
- No CMS.

---

## Markdown Recipe Format

Use Markdown files as the source of truth.

Suggested file:

```text
content/recipes/scrambled-eggs.md
```

Suggested format:

```md
---
title: Scrambled Eggs
slug: scrambled-eggs
category: Eggs
difficulty: Gentle but unforgiving
timeEstimate: 10 minutes
source:
---

## Introduction

It truly does not get any simpler than this...

## Objective

A decadent, unreasonably creamy scramble...

## Ingredients

Eggs, butter, salt.

## Preparation

...

## Execution

...

## Reflection

...

## Variation

...
```

Rules:

- Frontmatter holds metadata.
- Markdown headings define editorial sections.
- Section content should be emitted as plain text strings in JSON.
- Do not require exact measurements.
- Keep authoring pleasant in any Markdown editor.

---

## Generated JSON Shape

Generate:

```text
wwwroot/data/recipes.json
```

Suggested shape:

```json
[
  {
    "id": 1,
    "title": "Scrambled Eggs",
    "slug": "scrambled-eggs",
    "category": "Eggs",
    "difficulty": "Gentle but unforgiving",
    "timeEstimate": "10 minutes",
    "source": null,
    "introduction": "...",
    "objective": "...",
    "ingredients": "Eggs, butter, salt.",
    "preparation": "...",
    "execution": "...",
    "reflection": "...",
    "variation": "..."
  }
]
```

Notes:

- Prefer stable IDs derived deterministically from sorted recipe files or use slugs as the primary identifier.
- If keeping numeric IDs for current hash links, generate them deterministically so links do not change unexpectedly.
- Consider moving hash URLs toward `#/recipes/{slug}` if that simplifies stable sharing.
- Choose one approach and keep it simple.

---

## Build Script

Add a small recipe build script.

Acceptable implementation options:

- Node script using built-in Node APIs and a tiny frontmatter parser if justified.
- Node script using built-in Node APIs and a simple local frontmatter parser.
- .NET script is not preferred if the app is pivoting away from .NET.

Keep dependencies minimal.

Suggested script:

```text
scripts/build-recipes.mjs
```

Expected behavior:

- Read `content/recipes/*.md`.
- Parse frontmatter metadata.
- Parse known section headings.
- Validate required fields.
- Sort recipes by title.
- Write `wwwroot/data/recipes.json`.
- Fail clearly if a recipe is malformed.

Required fields:

- `title`
- `slug`
- `ingredients`
- `execution`

Optional fields:

- `category`
- `difficulty`
- `timeEstimate`
- `source`
- `introduction`
- `objective`
- `preparation`
- `reflection`
- `variation`

---

## Frontend Changes

- Change recipe fetching from `/api/recipes` to `/data/recipes.json`.
- Update `Recipe` type if needed.
- Preserve current UI behavior:
  - A-Z recipe index
  - search
  - inline expansion
  - shareable hash recipe links
  - no surprise scrolling
- Remove assumptions that data came from an API/database.

If switching from numeric IDs to slugs:

- Update router parsing/writing.
- Update expanded recipe state.
- Keep old numeric ID compatibility only if it is trivial. This app is not deployed yet, so do not over-preserve unshipped URL formats.

---

## Local Development

Preferred scripts:

```json
{
  "scripts": {
    "build:recipes": "node scripts/build-recipes.mjs",
    "build": "npm run build:recipes && tsc",
    "watch:ts": "tsc -w",
    "dev": "npm run build && <static file server>",
    "verify": "./scripts/verify-local.sh"
  }
}
```

Choose a simple static server for local development.

Options:

- Use a tiny dev dependency such as `http-server` or `serve`.
- Use a small Node script based on built-in `node:http`.

Prefer the built-in Node script if it stays simple.

The dev server should serve `wwwroot`.

---

## Verification

Update verification so it no longer depends on:

- Docker
- PostgreSQL
- dotnet
- EF migrations
- `/api/recipes`

Verification should check:

- recipe JSON generation succeeds
- TypeScript build succeeds
- static server starts
- `/` responds
- `/data/recipes.json` responds
- generated JSON contains at least one recipe
- frontend assets are present

Suggested command:

```bash
npm run verify
```

`npm run verify` should remain short-lived and should clean up the static server process it starts.

---

## Files To Remove Or Retire

Remove if no longer needed:

- `Program.cs`
- `Controllers/`
- `Data/`
- `Recipes/` C# model folder
- `Migrations/`
- `simple-recipe-site.csproj`
- `simple-recipe-site.http`
- `appsettings*.json`
- `docker-compose.yml`
- `.config/dotnet-tools.json`
- .NET-specific verification steps

Keep only if there is a clear reason.

Because this app is not deployed yet, prefer replacing the old architecture cleanly rather than layering compatibility around it.

---

## Documentation Updates

Update `.ai` docs so future agents understand the pivot:

- `.ai/stack.md`
- `.ai/architecture.md`
- `.ai/process.md`
- `.ai/product.md` if needed

The docs should say:

- Markdown recipes are source of truth.
- Generated JSON is runtime data.
- Vanilla TypeScript frontend consumes static JSON.
- No backend/database unless a future feature reintroduces one for a clear reason.

---

## Deployment Direction

The app should be deployable as static files.

Target output:

```text
wwwroot/
```

Static hosts should be viable:

- Cloudflare Pages
- Netlify
- GitHub Pages
- Azure Static Web Apps
- any basic nginx/static hosting

No managed PostgreSQL or app server should be required for the current product.

---

## Acceptance Criteria

- Recipes are authored as Markdown files under `content/recipes/`.
- A build script generates `wwwroot/data/recipes.json`.
- The frontend fetches static JSON, not `/api/recipes`.
- The recipe index, search, inline expansion, and shareable recipe links still work.
- The app runs locally without Docker, PostgreSQL, .NET, or EF Core.
- `npm run verify` validates the static app.
- Old backend/database files are removed or clearly retired.
- `.ai` docs reflect the new static Markdown architecture.
- No frontend framework, CMS, backend, database, or unnecessary dependency is introduced.
