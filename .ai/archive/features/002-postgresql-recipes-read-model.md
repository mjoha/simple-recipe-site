# Feature: PostgreSQL Recipe Read Model

## Goal

Add the first real recipe data slice.

By the end of this feature, recipes should be stored in PostgreSQL through EF Core, exposed through the existing `RecipesController`, and fetched/rendered by the frontend.

Keep this feature read-only from the user's perspective. Do not add create, edit, delete, search, auth, or image handling yet.

---

## User Outcome

As a developer, I can run the app locally with PostgreSQL and see at least one real recipe rendered on the frontend.

I can also call the API directly and receive recipes from the database:

```text
GET /api/recipes
```

---

## Scope

### Include

- Add EF Core PostgreSQL support.
- Add local PostgreSQL setup with Docker Compose.
- Add an `AppDbContext`.
- Add a `Recipe` model.
- Add the initial EF Core migration.
- Seed at least one recipe.
- Update `RecipesController` so `GET /api/recipes` reads from PostgreSQL.
- Update the frontend TypeScript to fetch `/api/recipes`.
- Render a simple list of recipes on the frontend.
- Update `.http` requests for the recipes endpoint if needed.
- Document the local run commands needed for this feature.

### Exclude

- No recipe create/edit/delete endpoints.
- No frontend forms.
- No search.
- No recipe detail page.
- No tags table.
- No separate ingredient or instruction tables.
- No images.
- No authentication or ownership.
- No deployment setup.

---

## Recipe Model

Start with one `recipes` table and keep ingredients/instructions as text.

Suggested C# model:

```csharp
public class Recipe
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public string? Description { get; set; }

    public required string Ingredients { get; set; }

    public required string Instructions { get; set; }

    public string? Category { get; set; }

    public int? Servings { get; set; }

    public int? PrepMinutes { get; set; }

    public int? CookMinutes { get; set; }

    public string? Source { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime UpdatedAtUtc { get; set; }
}
```

Suggested table shape:

```text
recipes
- id integer primary key
- title text not null
- description text null
- ingredients text not null
- instructions text not null
- category text null
- servings integer null
- prep_minutes integer null
- cook_minutes integer null
- source text null
- created_at_utc timestamp not null
- updated_at_utc timestamp not null
```

Use EF Core conventions where reasonable. Add explicit configuration only where it improves clarity or avoids bad defaults.

---

## Seed Data

Seed at least one recipe so the frontend has real database data to show.

The seed can be simple, for example:

- Title: `Pancakes`
- Description: `A simple family breakfast recipe.`
- Ingredients: multiline text
- Instructions: multiline text
- Category: `Breakfast`
- Servings: `4`

Do not add a large seed catalog in this feature.

---

## Backend Requirements

- Use EF Core with PostgreSQL.
- Register `AppDbContext` in `Program.cs`.
- Read the connection string from configuration.
- Keep `RecipesController` as the API entry point.
- `GET /api/recipes` should return all recipes ordered by title or creation date.
- Keep controller logic small and readable.
- If a service/repository is introduced, keep it recipe-specific and minimal.

Suggested API response shape:

```json
[
  {
    "id": 1,
    "title": "Pancakes",
    "description": "A simple family breakfast recipe.",
    "ingredients": "2 eggs\n200 ml milk\n...",
    "instructions": "Mix ingredients.\nCook in a pan.",
    "category": "Breakfast",
    "servings": 4,
    "prepMinutes": 10,
    "cookMinutes": 15,
    "source": "Family recipe",
    "createdAtUtc": "2026-05-05T00:00:00Z",
    "updatedAtUtc": "2026-05-05T00:00:00Z"
  }
]
```

---

## Frontend Requirements

- Fetch recipes from `/api/recipes`.
- Render recipe titles and a small amount of supporting information.
- Show a simple loading state.
- Show a simple error state if the fetch fails.
- Keep the UI plain and minimal.
- Do not add frontend frameworks or routing.

The frontend does not need to render every field yet. Rendering title, description, category, and servings is enough.

---

## Local Development

Add a local PostgreSQL dependency through Docker Compose.

Suggested service:

```text
postgres
- image: postgres
- database: simple_recipe_site
- user/password suitable for local development
- port: 5432
```

Use local-only credentials. Do not commit production secrets.

The app should read a local development connection string from configuration or environment variables.

---

## Verification

After implementation, verify:

- `docker compose up -d` starts PostgreSQL.
- EF Core migration can be applied.
- `dotnet build` succeeds.
- TypeScript build succeeds.
- Running the app starts successfully.
- `http://localhost:5002/api/recipes` returns seeded recipe data from PostgreSQL.
- `http://localhost:5002/` renders the recipe fetched from the API.

Suggested command sequence:

```bash
docker compose up -d
dotnet ef database update
npm run build
dotnet run --launch-profile http
```

If the final local workflow differs, document the actual commands clearly.

---

## Acceptance Criteria

- A `Recipe` model exists with the agreed initial fields.
- PostgreSQL is configured for local development.
- EF Core is configured for PostgreSQL.
- An initial migration creates the `recipes` table.
- At least one recipe is seeded.
- `GET /api/recipes` returns recipes from PostgreSQL.
- The frontend fetches and renders the recipe list.
- No create/edit/delete/search functionality is added.
- No extra frontend framework, SCSS, or unrelated dependencies are introduced.
