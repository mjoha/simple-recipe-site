# Feature: Harden Recipe Read Slice

## Goal

Fix the review findings from the PostgreSQL recipe read-model implementation without adding new product behavior.

This feature should make the existing read-only recipe slice safer, cleaner, and easier to maintain.

---

## User Outcome

As a developer, I can keep using the same local workflow, but the project avoids known footguns:

- Recipe content is rendered safely in the frontend.
- EF local tooling is restorable in the standard .NET location.
- The database schema uses consistent snake_case column names.
- Local development database settings are not baked into default app configuration.

---

## Scope

### Include

- Replace frontend `innerHTML` recipe rendering with DOM node creation and `textContent`.
- Move the .NET local tool manifest to the standard `.config/dotnet-tools.json` location.
- Ensure `dotnet tool restore` can restore `dotnet-ef`.
- Configure the `Recipe.Id` column as `id` in PostgreSQL.
- Update or recreate the initial migration so the `recipes` table uses `id`, not `Id`.
- Keep the existing seed recipe.
- Move the local PostgreSQL connection string out of `appsettings.json`.
- Keep the local PostgreSQL connection string in `appsettings.Development.json` or document an environment-variable alternative.
- Verify the existing read-only recipe flow still works.

### Exclude

- No new recipe fields.
- No recipe create/edit/delete endpoints.
- No recipe forms.
- No search.
- No auth.
- No image handling.
- No frontend framework.
- No SCSS.
- No broad styling redesign.

---

## Frontend Safety Requirement

The frontend must not render recipe data with `innerHTML`.

Avoid this pattern:

```typescript
listItem.innerHTML = `
  <h3>${recipe.title}</h3>
  <p>${recipe.description ?? ""}</p>
`;
```

Use DOM APIs instead:

```typescript
const title = document.createElement("h3");
title.textContent = recipe.title;

const description = document.createElement("p");
description.textContent = recipe.description ?? "";

listItem.append(title, description);
```

This matters because recipe content will eventually come from user-editable data.

---

## Tooling Requirement

The .NET local tool manifest should live at:

```text
.config/dotnet-tools.json
```

After the change, this should work:

```bash
dotnet tool restore
dotnet ef --version
```

Do not require a globally installed `dotnet-ef` for normal local development.

---

## Database Requirement

The `recipes` table should use consistent snake_case column names.

Expected primary key column:

```text
id
```

Not:

```text
Id
```

Configure this explicitly in EF Core, for example with:

```csharp
entity.Property(recipe => recipe.Id).HasColumnName("id");
```

Because the app is still early and not deployed, it is acceptable to recreate the initial migration instead of adding a follow-up rename migration, if that keeps the history cleaner.

---

## Configuration Requirement

`appsettings.json` should not contain the local development PostgreSQL connection string.

Keep local development settings in:

```text
appsettings.Development.json
```

or use environment variables.

It is acceptable for `appsettings.Development.json` to contain local-only Docker credentials such as `recipe_app` / `recipe_app`.

---

## Verification

After implementation, verify:

- `dotnet tool restore` succeeds.
- `dotnet ef --version` works through the local tool manifest.
- `docker compose up -d` starts PostgreSQL.
- The database can be reset or migrated cleanly.
- `dotnet ef database update` succeeds.
- `npm run build` succeeds.
- `dotnet build` succeeds.
- `npm run dev` starts the local app.
- `http://localhost:5002/api/recipes` returns the seeded recipe.
- `http://localhost:5002/` renders the recipe list.
- Frontend recipe rendering does not use `innerHTML`.

If the existing Docker volume already contains the old `Id` column migration, document the reset command needed for local development.

---

## Acceptance Criteria

- No recipe data is rendered with `innerHTML`.
- `.config/dotnet-tools.json` exists and contains `dotnet-ef`.
- The old root-level `dotnet-tools.json` is removed.
- EF maps `Recipe.Id` to the `id` column.
- The initial migration creates `recipes.id`.
- `appsettings.json` does not include the local PostgreSQL connection string.
- The seeded recipe still exists.
- The frontend still fetches and renders recipes.
- The feature adds no new product behavior beyond the fixes listed above.
