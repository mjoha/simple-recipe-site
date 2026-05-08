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

Current product direction has no backend runtime.

- Add or update collection config/content under `content/`.
- Update site build scripts when schema/authoring rules evolve.
- Avoid introducing backend/database dependencies unless explicitly requested.

Suggested commit style:

```text
feat: add recipe endpoint
```

---

### 4. Frontend

- Add semantic HTML and plain CSS.
- Prefer generated static HTML over runtime rendering.
- Use native browser behavior before adding JavaScript.
- Keep any browser JavaScript tiny and optional.

Suggested commit style:

```text
feat: add recipe list UI
```

---

### 5. Verify

- Use `npm run verify` for short-lived agent validation.
- Use `npm run dev` only for interactive long-running local development.
- Agents should not kill unrelated processes. If the app port is already in use, report it and ask the user to stop the existing dev server.
- Test static endpoints with `curl` or browser requests.
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

Human interactive workflow:

```bash
npm run dev
```

Agent/local smoke-test workflow:

```bash
npm run verify
```

`npm run verify` owns the app process it starts and cleans it up when finished. It should fail rather than killing unknown processes if the configured app port is already in use.

For one-off site builds:

```bash
npm run build
```