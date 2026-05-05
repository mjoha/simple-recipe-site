# Architecture

## Overall

Minimal monolithic application.

- ASP.NET Core serves the API and the static frontend.
- Controllers expose HTTP endpoints.
- PostgreSQL stores recipe data.
- Frontend is plain HTML, CSS, and TypeScript with no client framework.
- Keep the system easy to run locally, deploy, and maintain.

---

## Suggested Structure

At the start, keep the default .NET project layout and add structure only when needed:

```text
/
  Program.cs
  appsettings.json
  appsettings.Development.json
  Controllers/
    RecipesController.cs
  Recipes/
    Recipe.cs
    RecipeService.cs
    RecipeRepository.cs
  Data/
    AppDbContext.cs
  wwwroot/
    index.html
    styles/
      site.css
    scripts/
      app.ts
```

The exact structure can evolve. Prefer clarity over strict layering.

---

## Backend Boundaries

Controllers:

- Handle routing, request/response models, validation, and status codes.
- Delegate meaningful work to recipe-specific services or repositories.
- Should stay small and readable.

Recipe/domain code:

- Owns recipe behavior, data shaping, and persistence coordination.
- Keep it close to the feature until duplication or complexity justifies shared abstractions.

Data access:

- Use PostgreSQL.
- Use EF Core for data access and migrations.
- Keep schema evolution incremental.
- Avoid designing a large generic database layer before the app needs it.

---

## API Shape

Prefer stable, boring REST-style endpoints:

- `GET /api/recipes`
- `GET /api/recipes/{id}`
- `POST /api/recipes`
- `PUT /api/recipes/{id}`
- `DELETE /api/recipes/{id}`

Search can start simple:

- `GET /api/recipes?query=...`

Only add specialized endpoints when the UI needs them.

---

## Frontend Architecture

- Static pages and assets served from `wwwroot`.
- Use semantic HTML and progressive enhancement.
- Keep TypeScript modules small and page-oriented.
- Use `fetch` to call `/api/...` endpoints.
- Avoid client-side routing until there is a strong reason.

---

## Database

Initial likely tables:

- `recipes`
- `recipe_ingredients` if ingredients need structure
- `recipe_steps` if instructions need structure
- optional `tags` or `categories`

Start with a simple schema. A text-based ingredients/instructions model is acceptable early if it keeps the app moving.

---

## Rules

- Keep the app monolithic.
- Prefer simple files and explicit code.
- Do not introduce frontend frameworks.
- Do not introduce a service/repository abstraction for every class by default.
- Add shared infrastructure only after repeated need appears.