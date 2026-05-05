# AI Development Process

## Always Follow

- `.ai/architecture.md`
- `.ai/rules.md`
- `.ai/stack.md`
- `.ai/product.md`

---

## Workflow

### 1. Understand

- Read the relevant `.ai` files before making architectural or stack decisions.
- Inspect existing code before adding new structure.
- Ask questions when a choice affects long-term maintenance, data ownership, or deployment.

---

### 2. Plan

- Keep plans small and tied to user-visible behavior.
- Update `.ai/tasks.json` when tracking multi-step work.
- Prefer vertical slices: database/API/frontend together for one small feature.

---

### 3. Backend

- Add or update controller endpoints.
- Keep controllers thin.
- Add recipe-specific services/repositories only when useful.
- Update EF Core models and migrations when persistence changes.
- Avoid adding packages until the need is clear.

Suggested commit style:

```text
feat: add recipe endpoint
```

---

### 4. Frontend

- Add semantic HTML and plain CSS.
- Add TypeScript for browser behavior.
- Call API endpoints with `fetch`.
- Keep scripts page-oriented and easy to read.

Suggested commit style:

```text
feat: add recipe list UI
```

---

### 5. Verify

- Run the app locally.
- Test API endpoints with `.http` files, `curl`, or browser requests.
- Verify frontend behavior in the browser.
- Run relevant build/test commands before finishing work.

---

### 6. Refine

- Remove template/demo code when replacing it.
- Keep naming consistent.
- Revisit whether new abstractions are actually helping.
- Leave unrelated files alone.

---

## Local Development

Typical local workflow:

```bash
docker compose up -d
dotnet run
```

For TypeScript:

```bash
npm run build
```

or:

```bash
npm run watch
```