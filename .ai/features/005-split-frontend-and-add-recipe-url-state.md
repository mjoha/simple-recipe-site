# Feature: Split Frontend And Add Recipe URL State

## Goal

Split the current single-file frontend into small vanilla TypeScript modules and add minimal URL state for selected recipes.

The app should remain framework-free and dependency-light. Do not add a router library.

---

## User Outcome

As a user, I can open a recipe, use the browser back button to return to the list, and share or reload a URL that opens the same recipe.

As a developer, the frontend code is easier to navigate because API calls, types, filtering, rendering, and URL state are separated into focused files.

---

## Scope

### Include

- Split `wwwroot/scripts/app.ts` into multiple TypeScript files.
- Switch the frontend build to browser-native ES modules.
- Update `index.html` to load the frontend script as a module.
- Add hash-based recipe detail URL state.
- Preserve existing recipe list, search, category grouping, and recipe detail behavior.
- Preserve safe DOM rendering using `textContent` and DOM APIs.
- Preserve the existing `npm run dev` workflow.
- Keep plain CSS.

### Exclude

- No frontend framework.
- No router dependency.
- No bundler unless TypeScript compilation cannot work without one.
- No server-side route fallback.
- No clean URL routing such as `/recipes/12`.
- No backend/API changes.
- No database changes.
- No recipe create/edit/delete.
- No auth, images, sharing UI, or search API.

---

## Routing Requirement

Use hash-based routing only.

Supported states:

```text
/
#/recipes/12
```

Behavior:

- Empty hash or unknown hash shows the recipe list.
- Clicking a recipe updates the hash to `#/recipes/{id}`.
- Browser back/forward should work.
- Loading the page directly with `#/recipes/{id}` should show that recipe after recipes are fetched.
- If the hash points to a missing recipe id, show the list and a simple status message or fallback gracefully.
- The existing Back button should return to the list by clearing the hash.

Do not add a router package.

---

## Suggested File Structure

Use this structure unless the implementation reveals a better small variation:

```text
wwwroot/scripts/
  app.ts
  api.ts
  dom.ts
  filters.ts
  renderDetail.ts
  renderList.ts
  router.ts
  types.ts
```

Suggested responsibilities:

- `app.ts`: app startup, state coordination, event wiring.
- `api.ts`: `fetchRecipes`.
- `types.ts`: shared `Recipe` type.
- `filters.ts`: search matching, category normalization, category sorting, time formatting.
- `renderList.ts`: grouped recipe list rendering.
- `renderDetail.ts`: selected recipe rendering.
- `router.ts`: hash parsing, hash writing, hashchange listener helper.
- `dom.ts`: shared DOM lookup helpers or small DOM utilities, if useful.

Keep modules boring and explicit. Do not create a framework-like abstraction.

---

## TypeScript Build Requirement

Move away from the current single-output configuration:

```json
{
  "module": "none",
  "outFile": "wwwroot/scripts/app.js"
}
```

Use native browser ES modules instead.

The generated JavaScript should remain under `wwwroot/scripts`.

Acceptable approach:

- Put TypeScript source files in `wwwroot/scripts`.
- Compile to JavaScript files in place or to a nearby output folder under `wwwroot/scripts`.
- Ensure browser imports resolve correctly.
- Keep `npm run build`, `npm run watch:ts`, and `npm run dev` working.

Do not add Vite, Webpack, Rollup, esbuild, or other bundlers for this feature.

---

## HTML Requirement

Update the script tag to load a module:

```html
<script type="module" src="/scripts/app.js"></script>
```

Keep the existing HTML structure unless a small adjustment makes the module split cleaner.

---

## Behavior To Preserve

The following should still work after the refactor:

- Recipes load from `/api/recipes`.
- Landing title is `Recipes`.
- Search filters recipes client-side.
- Recipes are grouped by category.
- Categories are sorted alphabetically with `Uncategorized` last.
- Recipes are sorted by title within each category.
- Empty search shows all recipes.
- No-match search shows the empty state.
- Recipe detail shows title, metadata, description, ingredients, instructions, and source when available.
- Multiline ingredients and instructions remain readable.
- No recipe-controlled data is rendered with `innerHTML`.

---

## Verification

After implementation, verify:

- `npm run build` succeeds.
- `dotnet build` succeeds.
- `npm run dev` starts the local app.
- `http://localhost:5002/` shows the recipe list.
- Search and category grouping still work.
- Clicking a recipe changes the URL hash to `#/recipes/{id}`.
- Refreshing `http://localhost:5002/#/recipes/{id}` opens the recipe detail.
- Browser back returns to the list.
- Unknown recipe hashes fall back gracefully.
- No frontend framework, router package, or bundler dependency was added.
- Recipe rendering still avoids `innerHTML`.

---

## Acceptance Criteria

- `app.ts` is no longer a large all-in-one file.
- Frontend code is split into focused TypeScript modules.
- `index.html` loads `app.js` with `type="module"`.
- The TypeScript build emits browser-loadable ES modules.
- Recipe detail selection is represented in the hash URL.
- Browser back/forward works for recipe detail navigation.
- Existing recipe browsing/search behavior is preserved.
- No backend, database, CSS tooling, or dependency-heavy frontend changes are introduced.
