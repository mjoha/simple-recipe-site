# Feature: Baseline Recipe Browser UI

## Goal

Create the first useful recipe browsing experience.

The UI should be minimalistic, crystal clear, and effective: users should be able to browse all recipes grouped by category, filter them with a search field, and open a plain recipe view.

This feature should make the site feel like the beginning of a real digital recipe book without adding images, accounts, editing, or heavy UI patterns.

---

## User Outcome

As a user, I can land on the site, see `Recipes` as the title, search/filter the recipe collection, browse recipes grouped by category, and open one recipe to read it clearly.

As a developer, I have enough seed recipes to test the browser UI with realistic categories and list lengths.

---

## Scope

### Include

- Update the landing page title to `Recipes`.
- Add a search/filter field.
- Render all recipes grouped by category.
- Filter the grouped recipe list using the search/filter field.
- Add a plain recipe view for a selected recipe.
- Allow returning from the recipe view back to the grouped list.
- Add around 30 additional seed recipes for test data.
- Keep recipe rendering safe: use DOM APIs and `textContent`, not `innerHTML`.
- Keep all frontend code in plain TypeScript.
- Keep styling in plain CSS.
- Preserve the existing `npm run dev` workflow.

### Exclude

- No recipe create/edit/delete.
- No recipe forms.
- No server-side search endpoint.
- No recipe detail route.
- No browser history/routing.
- No images.
- No tags table.
- No authentication.
- No sharing flow.
- No frontend framework.
- No SCSS.
- No large visual redesign beyond the baseline browser UI.

---

## Landing Page

The root page should have this basic structure:

```text
Recipes

[ Search recipes... ]

Breakfast
- Pancakes
- ...

Dinner
- ...

Baking
- ...
```

Requirements:

- The visible site title should be exactly `Recipes`.
- The search/filter input should be easy to find near the top of the page.
- Recipes should be grouped under category headings.
- Categories should be derived from recipe data.
- Recipes with no category should appear under `Uncategorized`.
- Within each category, sort recipes by title.
- Sort categories alphabetically, with `Uncategorized` last.

---

## Search And Filtering

Search should happen client-side for now using the already-loaded recipe data.

The search field should match against:

- Title
- Description
- Category
- Ingredients
- Instructions
- Source

Behavior:

- Empty search shows all recipes grouped by category.
- Non-empty search filters recipes and keeps matching recipes grouped by category.
- Search should be case-insensitive.
- Show a simple empty state when no recipes match.
- Do not add debounce libraries or external search dependencies.
- Do not add a backend search endpoint yet.

---

## Recipe List Items

Each recipe list item should be compact and scannable.

Show:

- Title
- Category, if useful
- Servings, if present
- Total time if prep/cook time is present
- Short description, if present

The list item should be clickable or have a clearly labeled button to open the recipe.

Avoid card-heavy or dashboard-style UI. Keep the presentation calm and readable.

---

## Recipe View

Selecting a recipe should show a plain reading view on the same page.

Suggested layout:

```text
Back to recipes

Pancakes
Breakfast · 4 servings · 10 min prep · 15 min cook

A simple family breakfast recipe.

Ingredients
2 eggs
200 ml milk
150 g flour

Instructions
Whisk eggs and milk.
Mix dry ingredients, then combine with wet ingredients.
Cook in a buttered pan until golden on both sides.
```

Requirements:

- No images.
- No decorative clutter.
- Use readable line lengths.
- Preserve multiline ingredients and instructions.
- Show missing optional fields gracefully.
- Provide an obvious way back to the recipe list.
- Keep this as client-side state, not a route.

---

## Seed Data

Add around 30 additional seed recipes to make the UI useful to test.

Include a mix of categories, for example:

- Breakfast
- Dinner
- Baking
- Dessert
- Lunch
- Soup
- Sides
- Preserves

Guidelines:

- Keep recipes simple and believable.
- Use concise ingredients and instructions.
- Include enough variation to test search, category grouping, and optional metadata.
- Do not add images.
- Do not add a separate tags system.
- Keep the existing seed recipe unless there is a good reason to replace it.

Because the app is still early and local-only, it is acceptable to update or recreate the seed migration if that keeps the migration history clean.

---

## Data/API Requirements

- Reuse the existing `GET /api/recipes` endpoint.
- Do not add new API endpoints unless absolutely necessary.
- Ensure the response includes the fields the frontend needs:
  - `id`
  - `title`
  - `description`
  - `ingredients`
  - `instructions`
  - `category`
  - `servings`
  - `prepMinutes`
  - `cookMinutes`
  - `source`
- Keep API behavior read-only.

---

## Frontend Implementation Notes

- Keep TypeScript small and readable.
- Prefer a few clear rendering functions over a framework-like abstraction.
- Suggested functions:
  - `loadRecipes`
  - `renderRecipeGroups`
  - `renderRecipeListItem`
  - `renderRecipeDetail`
  - `matchesSearch`
- Use event listeners directly.
- Use `textContent` for recipe-controlled text.
- Use DOM APIs to preserve multiline fields, for example splitting text by newline and appending lines.
- Keep global state minimal, likely:
  - all recipes
  - selected recipe id
  - current search query

---

## Styling Direction

The visual style should be:

- Minimalistic.
- Warm and readable.
- High contrast.
- More like a recipe index/book than a SaaS dashboard.

Use plain CSS only.

Avoid:

- Image placeholders.
- Heavy shadows.
- Animations.
- Dense dashboard layouts.
- CSS frameworks.

---

## Verification

After implementation, verify:

- `dotnet tool restore` succeeds.
- `docker compose up -d` starts PostgreSQL.
- The database can be reset or migrated cleanly if seed data changed.
- `dotnet ef database update` succeeds.
- `npm run build` succeeds.
- `dotnet build` succeeds.
- `npm run dev` starts the local app.
- `http://localhost:5002/api/recipes` returns the expanded recipe data.
- `http://localhost:5002/` shows the `Recipes` landing page.
- Recipes are grouped by category.
- Search filters recipes across the expected fields.
- Selecting a recipe shows the plain recipe view.
- Back navigation returns to the grouped list.
- Recipe rendering does not use `innerHTML`.

If the existing Docker volume contains old seed data, document the local reset command needed to recreate the database.

---

## Acceptance Criteria

- The landing page title is `Recipes`.
- A search/filter field is present and functional.
- All recipes are listed and grouped by category.
- Search filters the grouped list client-side.
- A selected recipe can be viewed plainly on the same page.
- The recipe view preserves ingredients and instructions readability.
- Around 30 additional seed recipes exist for UI testing.
- No create/edit/delete/search API behavior is added.
- No frontend framework, SCSS, images, auth, or unrelated dependencies are introduced.
