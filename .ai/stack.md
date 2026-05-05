# Stack

## Core

- ASP.NET Core using controllers.
- .NET 10 currently installed and used by the project.
- PostgreSQL for persistent storage.
- Plain HTML, simple CSS, and TypeScript for frontend behavior.
- No frontend framework by default.

---

## Backend

- Use ASP.NET Core MVC/Web API controllers.
- Keep controllers thin: HTTP concerns, validation, status codes, and delegation.
- Keep domain/application logic outside controllers when it grows beyond simple CRUD.
- Prefer built-in .NET features before adding packages.

- Use EF Core for PostgreSQL access and migrations.
- Keep EF Core usage straightforward and explicit.
- Do not add Dapper or another data access style unless there is a clear, specific reason.

---

## Frontend

- Static assets served by ASP.NET Core, likely from `wwwroot`.
- Use semantic HTML.
- Use plain CSS.
- Do not add SCSS.
- Use TypeScript for browser code.
- Avoid React, Vue, Svelte, client-side routers, global state libraries, and component frameworks for now.

---

## Dev Environment

- WSL Ubuntu.
- Project files should stay under `/home/...`, not `/mnt/c/...`.
- Docker or Docker Compose for local PostgreSQL.
- `psql` for direct database inspection.
- Node/npm only for TypeScript tooling.

---

## Deployment Direction

- Deploy one ASP.NET Core app that serves both the API and static frontend assets.
- Use a managed PostgreSQL database or a simple Docker-based deployment.
- Keep environment-specific configuration in environment variables or appsettings files.
- Avoid splitting frontend and backend deployment until there is a real need.

---

## Future, Not Yet

- Authentication.
- Recipe image upload/storage.
- Full-text search tuning.
- Import/export.
- Public/private sharing rules.
- Automated test suite beyond focused coverage.