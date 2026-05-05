# Feature: Baseline Project Structure

## Goal

Create the simplest useful baseline for the recipe site.

By the end of this feature, the app should have the correct initial structure for a minimal ASP.NET Core controller app that serves both:

- A JSON API endpoint.
- A static frontend page.

No database, recipe data, auth, or real product features should be added yet.

---

## User Outcome

As a developer, I can run one local command and verify that:

- The backend API responds.
- The frontend loads in the browser.
- The project structure matches the intended stack.

The frontend can simply show `Hello world`.

The API can simply return a small JSON response from the recipes route, such as:

```json
{
  "message": "Recipes API ready"
}
```

---

## Scope

### Include

- Remove the generated WeatherForecast sample controller/model.
- Add a minimal `RecipesController` endpoint, for example `GET /api/recipes`.
- Add static frontend files under `wwwroot`.
- Serve `wwwroot/index.html` from the ASP.NET Core app.
- Add plain CSS.
- Add TypeScript source for browser behavior.
- Add minimal TypeScript build tooling if needed.
- Add a simple local command for running the app.
- Update the `.http` file to call the new API endpoint.
- Add `.gitignore` entries for generated build output if missing.

### Exclude

- No PostgreSQL setup.
- No EF Core models, migrations, or DbContext yet.
- No recipe CRUD.
- No seed/sample recipe data.
- No frontend framework.
- No SCSS.
- No authentication.
- No deployment configuration.

---

## Expected Structure

Use this as the target shape unless the existing project requires a small adjustment:

```text
/
  Program.cs
  simple-recipe-site.csproj
  simple-recipe-site.http
  package.json
  tsconfig.json
  Controllers/
    RecipesController.cs
  wwwroot/
    index.html
    styles/
      site.css
    scripts/
      app.ts
      app.js
```

Notes:

- `app.ts` is the TypeScript source.
- `app.js` is the browser-consumable compiled output.
- Keep TypeScript tooling minimal.
- Do not add bundlers unless plain `tsc` is not enough.

---

## Backend Requirements

- Use ASP.NET Core controllers.
- Route the API under `/api`.
- Add `RecipesController`.
- Keep the controller intentionally tiny.
- `Program.cs` should remain focused on app startup:
  - register controllers
  - enable static files
  - map controllers
  - serve the default frontend page

Suggested API:

```text
GET /api/recipes
```

Suggested response:

```json
{
  "message": "Recipes API ready"
}
```

---

## Frontend Requirements

- `wwwroot/index.html` should load successfully at the app root.
- The visible page can be very simple and say `Hello world`.
- Use semantic HTML.
- Load `styles/site.css`.
- Load `scripts/app.js`.
- TypeScript may enhance the page minimally, for example by writing a short status message into the DOM.

---

## Local Run Requirement

There should be one simple command to run the app locally after dependencies are installed.

Preferred command:

```bash
dotnet run --launch-profile http
```

If TypeScript compilation is needed before running, add a small npm script for it, but keep local usage clear. For example:

```bash
npm run dev
```

where `npm run dev` builds TypeScript and then starts the ASP.NET Core app.

Do not require PostgreSQL or Docker for this feature.

---

## Verification

After implementation, verify:

- `dotnet build` succeeds.
- TypeScript build succeeds, if TypeScript tooling is added.
- Running the local command starts the app.
- Opening `http://localhost:5002/` shows the frontend `Hello world` page.
- Calling `http://localhost:5002/api/recipes` returns JSON.
- The old WeatherForecast endpoint and model are gone.

---

## Acceptance Criteria

- The app has no WeatherForecast sample code.
- The API has a minimal `/api/recipes` endpoint.
- The frontend root page renders.
- The project uses plain CSS and TypeScript with no frontend framework.
- The app can be run locally without PostgreSQL.
- The feature does not introduce recipe-specific data or persistence yet.
