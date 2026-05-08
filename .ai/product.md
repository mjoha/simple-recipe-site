# Product

## Vision

A minimalistic static Markdown catalog generator that feels like a digital field notebook: simple, personal, warm, and easy to use.

The project should make it easy to author, build, browse, and share curated entries without turning into a heavy platform.

---

## Product Principles

- Keep the experience calm, readable, and uncluttered.
- Prefer fast pages and simple interactions over feature-heavy UI.
- Make entries easy to browse and find by title, metadata, and simple in-page search.
- Treat authored entries as long-lived content that should remain easy to export or migrate.
- Add features incrementally only when they support the core static catalog experience.

---

## Core Flow

Author Markdown -> build site -> browse index -> open entry -> read/share.

Secondary flows:

- Filter entries with in-page search.
- Jump by letter navigation.
- Share direct links to generated entry anchors.

---

## Content Model

An entry should include:

- Title
- Slug
- Optional metadata fields
- Authored section content

Avoid over-designing schema features early. Keep frontmatter and section rules simple and evolve only with clear usage.

---

## Non-Goals For Now

- No user accounts.
- No social feed or public discovery.
- No heavy CMS or plugin system.
- No backend/database runtime.
- No frontend framework.