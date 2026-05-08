# Product

## Vision

A minimalistic authored index site that feels like a digital field notebook: simple, personal, warm, and easy to use.

The app should make it easy to preserve, browse, search, and share curated markdown entries without turning into a heavy platform.

---

## Product Principles

- Keep the experience calm, readable, and uncluttered.
- Prefer fast pages and simple interactions over feature-heavy UI.
- Make entries easy to find by title, metadata, and free-text search.
- Treat authored entries as long-lived content that should remain easy to export or migrate.
- Add features incrementally only when they support the core indexed reference experience.

---

## Core Flow

Browse index -> open entry -> read/share/save.

Secondary flows:

- Search recipes.
- Add or edit recipes.
- Categorize recipes.
- Share a recipe link.

---

## Initial Recipe Data

A recipe should likely include:

- Title
- Short description or family note
- Ingredients
- Instructions
- Category or tags
- Prep/cook time, if useful
- Servings, if useful
- Source or attribution, if useful

Avoid designing the full data model upfront. Start with the smallest useful recipe shape and evolve it.

---

## Non-Goals For Now

- No user accounts initially unless explicitly needed.
- No social feed or public discovery.
- No complex meal planning.
- No heavy CMS.
- No frontend framework unless the app genuinely outgrows vanilla TypeScript.