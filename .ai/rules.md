# Rules

## General

- Follow `.ai/architecture.md`, `.ai/stack.md`, and `.ai/product.md`.
- Keep implementation minimal and iterative.
- Prefer boring, maintainable solutions over clever abstractions.
- Add dependencies only when they remove real complexity.
- Avoid framework churn and upgrade-heavy tooling.

---

## Structure

- Keep related code close together.
- Do not create global services or generic infrastructure prematurely.
- Use feature folders when a feature grows beyond one or two files.
- Keep `Program.cs` focused on startup, dependency registration, middleware, and endpoint/controller registration.

---

## API

- Use ASP.NET Core controllers.
- Prefer `/api/...` routes for JSON endpoints.
- Controllers should be thin.
- Put business logic in recipe-specific code when it grows beyond simple request handling.
- Return appropriate HTTP status codes instead of encoding errors only in response bodies.

---

## Database

- PostgreSQL is the production database.
- Use EF Core for data access and migrations.
- Evolve the schema incrementally.
- Do not design the full schema upfront.
- Do not mix database access styles without a clear reason.
- Keep data portable and understandable.

---

## UI

- Use semantic HTML.
- Use plain CSS.
- Do not add SCSS.
- Use TypeScript for browser behavior.
- Keep client-side state minimal and local to the page.
- Avoid frontend frameworks, routers, global state libraries, CSS frameworks, and component libraries for now.

---

## Naming

- Controllers: `RecipesController`, `CategoriesController`.
- API request/response models: `CreateRecipeRequest`, `RecipeResponse`.
- Domain/data models: clear singular names such as `Recipe`.
- Frontend files: simple lowercase names such as `site.css`, `app.ts`, `recipes.ts`.

---

## Anti-Patterns

- No premature microservices.
- No frontend framework by default.
- No generic repository/service layer unless it earns its place.
- No complex build pipeline for static assets.
- No auth, image storage, queues, or background jobs until explicitly needed.