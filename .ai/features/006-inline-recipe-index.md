# Feature: Inline Recipe Index

## Goal

Replace the current category-grouped list plus separate recipe detail view with a single-page cookbook-style recipe index.

Recipes should be grouped alphabetically by title, like an index in a cookbook. Selecting a recipe should expand it inline at its location in the index instead of navigating to a separate detail view.

The result should be simpler, more focused, and more aligned with the plain handwritten recipe book feel.

---

## User Outcome

As a user, I can browse recipes by first letter, search the collection, and expand a recipe in place without losing my position in the index.

As a user, I can also open or share a URL that expands a specific recipe in the index.

---

## Scope

### Include

- Replace category grouping with alphabetical grouping by recipe title.
- Add a simple letter index at the top.
- Remove the separate recipe detail view from the UI.
- Remove the separate Back button/detail-page interaction.
- Expand selected recipe content inline within the recipe list.
- Keep one expanded recipe at a time.
- Keep hash URL state for the expanded recipe, using `#/recipes/{id}`.
- Loading `/#/recipes/{id}` should expand that recipe after data loads.
- Browser back/forward should expand/collapse recipes correctly.
- Search should continue to filter recipes client-side.
- Search results should still be grouped alphabetically by title.
- Preserve safe DOM rendering with DOM APIs and `textContent`.
- Keep frontend TypeScript split into small modules.
- Keep styling plain and minimal.

### Exclude

- No separate recipe detail route or view.
- No clean URL routing such as `/recipes/12`.
- No server-side search.
- No backend/API changes.
- No database changes.
- No recipe create/edit/delete.
- No category navigation.
- No images.
- No auth.
- No frontend framework.
- No router dependency.
- No bundler.
- No SCSS.

---

## Landing Page Shape

The page should remain a single view:

```text
Recipes

[ Search recipes... ]

A B C D E F G H I J K L M
N O P Q R S T U V W X Y Z

A
Apple Cake
  [collapsed]

B
Banana Bread
  [expanded inline if selected]

  Breakfast · 4 servings · 10 min prep · 45 min cook

  A simple family recipe.

  Ingredients
  ...

  Instructions
  ...
```

The UI should stay plain and readable. Avoid turning the letter index into a heavy navigation component.

---

## Alphabetical Grouping

Group recipes by the first meaningful character of the recipe title.

Rules:

- Trim leading whitespace before reading the first character.
- Use uppercase letters for group headings.
- Sort groups alphabetically.
- Sort recipes by title within each group.
- For titles that do not start with a letter or digit, group under `#`.
- If the project needs Nordic letters later, preserve them naturally rather than forcing them into A-Z.

Suggested helper functions:

```typescript
getRecipeInitial(recipe: Recipe): string
groupRecipesByInitial(recipes: Recipe[]): Map<string, Recipe[]>
sortedInitialKeys(groups: Map<string, Recipe[]>): string[]
```

Remove category grouping helpers if they are no longer used.

---

## Letter Index

Add a compact letter index above the recipe groups.

Behavior:

- Show letters for groups that exist in the currently filtered result set.
- Clicking a letter scrolls to that letter section.
- Keep this as simple anchor/button behavior.
- Do not add URL state for selected letters.
- If search narrows the result set, update the letter index accordingly.

The recipe hash URL remains reserved for expanded recipes only.

---

## Inline Recipe Expansion

Each recipe row should be expandable in place.

Behavior:

- Clicking a collapsed recipe expands it.
- Clicking a different recipe expands the new recipe and collapses the previous one.
- Clicking the currently expanded recipe may collapse it by clearing the hash.
- The expanded recipe should show:
  - Title
  - Category, if present
  - Servings, if present
  - Prep/cook time, if present
  - Description, if present
  - Ingredients
  - Instructions
  - Source, if present
- Preserve multiline ingredients and instructions.
- Use DOM APIs and `textContent`; do not use `innerHTML`.

Keep the expanded content visually connected to its recipe title, not as a separate page-like panel.

---

## Hash URL State

Continue using:

```text
#/recipes/{id}
```

Behavior:

- Empty hash means no recipe is expanded.
- `#/recipes/{id}` expands that recipe inline.
- Loading the page with a recipe hash expands that recipe after recipes are fetched.
- After expanding from a hash, scroll the expanded recipe into view.
- Browser back/forward should work.
- Unknown or invalid recipe hashes should clear/fallback gracefully to the unexpanded index with a simple status message.

Do not add a router package.

---

## Search Behavior

Search should remain client-side.

Search should match:

- Title
- Description
- Category
- Ingredients
- Instructions
- Source

Behavior:

- Empty search shows all recipes grouped by initial.
- Non-empty search filters recipes and groups matching recipes by initial.
- If the currently expanded recipe no longer matches the search, collapse it by clearing the hash or show a clear fallback.
- Show a simple empty state when no recipes match.

---

## Frontend Cleanup

This feature should reduce frontend complexity where possible.

Expected cleanup:

- Remove separate list/detail view toggling.
- Remove `recipe-detail-view` from `index.html` if no longer needed.
- Remove the Back button if no longer needed.
- Replace `renderDetail` with inline rendering or rename it to match its new purpose.
- Remove category grouping functions if unused.
- Keep modules focused and small.

Do not collapse everything back into one large `app.ts`.

---

## Verification

After implementation, verify:

- `npm run build` succeeds.
- `dotnet build` succeeds.
- `npm run dev` starts the local app.
- `http://localhost:5002/` shows the recipe index.
- Recipes are grouped by initial letter.
- The letter index reflects the visible groups.
- Clicking a letter scrolls to that section.
- Search filters recipes and updates groups/letter index.
- Clicking a recipe expands it inline.
- Only one recipe is expanded at a time.
- Clicking another recipe updates the hash and expands the new recipe.
- Loading `http://localhost:5002/#/recipes/{id}` expands that recipe inline.
- Browser back/forward works for expanded recipe state.
- Unknown recipe hashes fall back gracefully.
- No `innerHTML` or unsafe recipe rendering is introduced.
- No backend/API/database changes are made.

---

## Acceptance Criteria

- The separate recipe detail view is removed.
- Recipes are grouped alphabetically by title initial.
- A letter index is present and functional.
- Recipe content expands inline at its list location.
- Hash recipe URLs still work and point to the expanded inline recipe.
- Search still works across the expected recipe fields.
- Frontend code is simpler or at least no more complex than before.
- No new dependencies, frontend framework, router library, bundler, or backend changes are introduced.
