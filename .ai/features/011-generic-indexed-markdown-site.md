# Feature: Generic Indexed Markdown Site

## Goal

Pivot from a recipe-specific static site to a generic indexed Markdown content site.

The app should keep the current interaction model:

- page title
- search field
- alphabetical navigation
- indexed list of items
- inline expandable item content

But the content model, site title, labels, and fields should be controlled by Markdown/config rather than hardcoded around recipes.

Think of this as a simpler MkDocs for authored indexed data.

---

## Product Direction

The product is no longer strictly a recipe site.

It is a static, Markdown-authored index for a curated collection of things.

Examples it should eventually support:

- recipes
- cooking techniques
- books
- notes
- plants
- tools
- concepts
- field-guide entries
- any small authored reference collection

The default content can remain recipe-like for now, but the code and generated data should no longer be named or structured as recipes everywhere.

---

## User Outcome

As the site author, I can define:

- the site title
- the item type/name
- the source directory
- the fields/sections that make up each item
- which fields are searchable
- how expanded items are rendered

Then I can write Markdown files and build a static searchable index from them.

---

## Scope

### Include

- Introduce a collection/site config file in Markdown or simple frontmatter-backed Markdown.
- Move site title out of hardcoded HTML/TypeScript.
- Generalize generated data from `recipes.json` to collection data.
- Generalize frontend types and naming away from `Recipe` where practical.
- Generalize build script naming away from recipes.
- Let the config define the item sections/model.
- Preserve current UI layout and behavior.
- Preserve search, alphabetical navigation, inline expansion, and hash links.
- Keep static-only deployment.
- Keep plain HTML/CSS/TypeScript.
- Update `.ai` docs to reflect the generic indexed Markdown architecture.

### Exclude

- No backend.
- No database.
- No CMS.
- No admin UI.
- No frontend framework.
- No markdown rendering in the browser.
- No rich text editor.
- No nested navigation/sidebar docs system.
- No multi-collection support unless it falls out naturally and simply.
- No plugin system.
- No complex schema language.

---

## Suggested Content Structure

Use a structure like:

```text
content/
  index.md
  items/
    scrambled-eggs.md
    tomato-soup.md
```

`content/index.md` defines the collection:

```md
---
title: Recipes
itemName: Recipe
itemNamePlural: Recipes
source: content/items
output: wwwroot/data/index.json
titleField: title
slugField: slug
requiredFields:
  - title
  - slug
  - ingredients
  - execution
searchFields:
  - title
  - introduction
  - objective
  - ingredients
  - preparation
  - execution
  - reflection
  - variation
  - category
  - difficulty
  - timeEstimate
sections:
  - introduction
  - objective
  - ingredients
  - preparation
  - execution
  - reflection
  - variation
metadata:
  - category
  - difficulty
  - timeEstimate
  - source
---

An authored index of cooking field-guide entries.
```

Keep the format simple. If arrays in frontmatter are too much for the existing parser, use a simpler line format, but keep it readable.

---

## Item Markdown Format

Item files should still be plain Markdown with frontmatter and `##` sections.

Example:

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

Bad scrambled eggs are rubber and regret.

## Objective

A soft, creamy scramble.

## Ingredients

Eggs, butter, and salt.

## Execution

Cook gently. Stop early.
```

The build script should map known section headings according to config instead of hardcoding recipe section names in multiple places.

---

## Generated Data Shape

Generate one static JSON file, for example:

```text
wwwroot/data/index.json
```

Suggested shape:

```json
{
  "title": "Recipes",
  "itemName": "Recipe",
  "itemNamePlural": "Recipes",
  "description": "An authored index of cooking field-guide entries.",
  "titleField": "title",
  "slugField": "slug",
  "searchFields": ["title", "ingredients", "execution"],
  "sections": ["introduction", "objective", "ingredients", "execution"],
  "metadata": ["category", "difficulty", "timeEstimate"],
  "items": [
    {
      "id": 1,
      "title": "Scrambled Eggs",
      "slug": "scrambled-eggs",
      "category": "Eggs",
      "difficulty": "Gentle but unforgiving",
      "timeEstimate": "10 minutes",
      "sections": {
        "introduction": "Bad scrambled eggs are rubber and regret.",
        "objective": "A soft, creamy scramble.",
        "ingredients": "Eggs, butter, and salt.",
        "execution": "Cook gently. Stop early."
      }
    }
  ]
}
```

Prefer this over a fixed recipe-shaped array.

---

## Frontend Requirements

The frontend should consume the generated index JSON.

It should:

- set the document/page title from generated data
- render the search placeholder using item labels if useful
- group items alphabetically by configured title field
- search configured search fields
- render metadata fields from config
- render sections from config, in configured order
- preserve multiline plain text rendering
- preserve inline expansion
- preserve hash links

Hash links can remain:

```text
#/items/{slug}
```

or:

```text
#/entries/{slug}
```

Choose one generic route and avoid recipe-specific `#/recipes/...` for new generated data. Since the site is still evolving, do not over-preserve old recipe hash URLs unless trivial.

---

## Build Script Requirements

Rename or replace the recipe-specific build script.

Suggested script:

```text
scripts/build-index.mjs
```

Expected behavior:

- Read `content/index.md`.
- Parse site/collection config.
- Read item Markdown files from the configured source directory.
- Parse each item's frontmatter.
- Parse configured `##` sections.
- Validate required fields.
- Sort items by title.
- Generate deterministic item IDs or use slugs.
- Write configured output JSON.
- Fail clearly on malformed content.

The existing simple parser may be extended, but keep it understandable. Do not add a full static-site generator.

---

## Package Scripts

Update scripts away from recipe-specific names.

Suggested:

```json
{
  "scripts": {
    "build:index": "node scripts/build-index.mjs",
    "build": "npm run build:index && tsc",
    "dev": "npm run build && node scripts/serve-wwwroot.mjs",
    "verify": "./scripts/verify-local.sh"
  }
}
```

Remove or retire `build:recipes` unless kept as a temporary alias.

---

## File Rename Guidance

Rename when it improves clarity:

- `scripts/build-recipes.mjs` -> `scripts/build-index.mjs`
- `content/recipes/` -> `content/items/`
- `wwwroot/data/recipes.json` -> `wwwroot/data/index.json`
- `Recipe` type -> `IndexItem` or `IndexedItem`
- `fetchRecipes` -> `fetchIndex`
- recipe-specific render/filter names -> item/index names

Do not rename files purely for churn if the implementation becomes riskier, but the resulting code should not read as recipe-specific.

---

## Verification

After implementation, verify:

- `npm run build` succeeds.
- `npm run verify` succeeds.
- generated `wwwroot/data/index.json` exists.
- the site title comes from `content/index.md`.
- items render in the existing A-Z indexed layout.
- search works using configured fields.
- inline expansion works using configured sections.
- hash links use a generic route and work on reload.
- GitHub Pages relative paths still work.
- no backend/database/.NET/Docker assumptions are reintroduced.

---

## GitHub Pages Workflow

Update the GitHub Pages workflow if needed:

- build the generic index JSON
- commit generated `wwwroot/data/index.json` back to `main`
- deploy `wwwroot`

Remove recipe-specific workflow wording where practical.

---

## Documentation Updates

Update `.ai` docs to describe:

- generic indexed Markdown content
- Markdown/config as source of truth
- generated JSON as runtime data
- static frontend runtime
- no recipe-specific architecture requirement

---

## Acceptance Criteria

- The site is no longer hardcoded as a recipe-specific app.
- Site title is controlled by Markdown/config.
- Item model/sections are controlled by Markdown/config.
- Generated runtime data is generic index JSON.
- Frontend renders generic indexed items with the current layout.
- Existing recipe content still works as one possible collection.
- Build, verify, and GitHub Pages deployment workflows are updated.
- No backend, database, frontend framework, CMS, or complex static-site generator is introduced.
