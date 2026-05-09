# Feature: Configurable Item Grouping

## Goal

Replace the hardcoded A-Z grouping with a grouping axis defined in `content/index.md`. The build script should produce the same single-page index, but the section headings and the in-page navigation chips should reflect the grouping the catalog author chose, not the first letter of the title.

This pushes one of the last opinionated bits of the build into config, where it belongs. It also opens the door to catalogs where alphabetical grouping is meaningless (animals by class, recipes by course, tools by purpose, books by genre).

---

## Why

The current build hardcodes "group by first letter of `titleField`". That is one valid grouping; it is not the only one. Concrete examples that motivate this change:

- A field guide of marine animals where grouping by `class` (Mammalia, Cephalopoda, Aves, ...) is more useful than A-Z.
- A cookbook where grouping by `course` (Breakfast, Mains, Sides, Desserts) tells the reader more than alphabetical order.
- A list of tools where grouping by `purpose` is the natural cut.

In every case, the *layout* (single page, search, group nav, expandable items) is right. The *grouping rule* is wrong.

---

## Scope

### Include

- New optional fields in `content/index.md` frontmatter:
  - `groupBy`: name of a frontmatter field on items to group by. If absent, items are not grouped at all — they render as a single flat list sorted by `titleField`, with no group navigation.
  - `groupOrder`: optional comma-separated list of group labels in the desired order. If absent, groups are ordered alphabetically. Ignored when `groupBy` is absent.
- Build script: replace the hardcoded letter-grouping logic with a generic grouping step driven by these fields. When `groupBy` is absent, skip group section markup and the group nav entirely.
- Build script: emit a generic group navigation in place of the letter nav when grouping is configured, using the actual group labels.
- Build script: items missing the `groupBy` field land in an "Other" group, listed last by default.
- Generated HTML: rename letter-specific markup (`letter-section`, `letter-index`, `letter-index-button`, etc.) to generic equivalents (`group-section`, `group-index`, `group-button`). DOM ids change from `letter-X` to `group-<slug>`.
- `src/scripts/search.js`: track and update group sections / group nav when present; degrade gracefully when there are no groups (filter items only).
- `src/scripts/router.js`: ignore `#group-*` hashes (already ignores any hash that doesn't resolve to an item id, but make this explicit).
- `src/styles/site.css`: rename letter-related class selectors to group-related ones. Allow longer chip labels to wrap.
- `scripts/verify-local.sh`: replace the strict "26 letter buttons" check with a "catalog list exists, and ≥1 group section + ≥1 group button when grouping is configured" check.
- Update `content/index.md` to demonstrate `groupBy` (e.g. group the existing example items by an obvious field).

### Exclude

- No multi-axis grouping in this feature (only one `groupBy` field at a time).
- No client-side regrouping.
- No tabbed views.
- No comparison view, sort modes, random entry, or other follow-up UX features.
- No new build dependencies.
- No backend or persistent state.
- No content-shape changes beyond optionally adding the field used for grouping (which is normal frontmatter and was already supported under `metadata`).

---

## Config Shape

`content/index.md` frontmatter gains two optional fields:

```yaml
title: Recipes
itemNamePlural: Recipes
source: content/items
titleField: title
slugField: slug
requiredFields: title, slug
searchFields: title
sections: introduction, objective, ingredients, preparation, execution, reflection, variation
metadata: kind, region

# New:
groupBy: kind
groupOrder: Mammals, Cephalopods, Birds
```

Behavior:

- `groupBy` absent → no grouping. The catalog renders as one flat list sorted by `titleField`. No group navigation is emitted. `groupOrder` is ignored if present.
- `groupBy` present → group by the exact value of that frontmatter field on each item. Items missing the field go into an "Other" group.
- `groupOrder` absent → groups ordered alphabetically by label, with "Other" pinned last when applicable.
- `groupOrder` present → groups appear in the given order. Any group label that exists in items but is missing from `groupOrder` is appended at the end in alphabetical order. Any label in `groupOrder` that has no items is omitted.

Within a group (or in the flat list when ungrouped), items are sorted by `titleField` as today.

`groupBy` value matching is case-sensitive on the raw frontmatter value, but display preserves the original casing seen in items (or the casing used in `groupOrder`, when provided). Trim whitespace.

---

## DOM and Markup Changes

### Before

```html
<nav id="letter-index" aria-label="Catalog index">
  <a class="letter-index-button" href="#letter-A" data-letter="A">A</a>
  <span class="letter-index-button letter-index-button-disabled" data-letter="B">B</span>
  ...
</nav>
<section class="letter-section" id="letter-A" data-letter-section="A">
  <h2>A</h2>
  <ul class="catalog-list">...</ul>
</section>
```

### After

```html
<nav id="group-index" aria-label="Catalog index">
  <a class="group-button" href="#group-mammals" data-group="mammals">Mammals</a>
  <a class="group-button" href="#group-cephalopods" data-group="cephalopods">Cephalopods</a>
  <a class="group-button" href="#group-birds" data-group="birds">Birds</a>
</nav>
<section class="group-section" id="group-mammals" data-group-section="mammals">
  <h2>Mammals</h2>
  <ul class="catalog-list">...</ul>
</section>
```

The full A-Z "always show every letter, disabled if empty" pattern only made sense for alphabetical grouping. Drop it. For arbitrary grouping, only show the groups that actually have items, with disabled-via-search behavior unchanged (handled by `search.js`).

When `groupBy` is absent, the build emits no group nav and no group sections at all — just the search input and a single `<ul class="catalog-list">` of items. Document this in the README so authors understand the two modes.

### Group slug

`group-<slug>` ids should be derived from the group label using a simple slugify:

- lowercase
- replace whitespace with `-`
- strip characters outside `[a-z0-9-]`

e.g. `Salads & Sides` → `group-salads-sides`.

Slug collisions across groups should be detected at build time and produce a clear error.

---

## Script Changes

### `scripts/build-site.mjs`

- Add `groupBy` and `groupOrder` to the parsed config (both optional).
- Replace `groupByInitial(items, titleField)` with a generic `groupItems(items, { groupBy })` that:
  - returns `Map<groupLabel, item[]>` when `groupBy` is set, keyed by `item.fields[groupBy]?.trim() || "Other"`;
  - returns `null` (or an empty map handled the same way) when `groupBy` is absent, signaling "render flat".
- Add `orderGroups(labels, { groupOrder })` that returns the labels in the configured order.
- When grouping is active, generate the group nav and group sections from the ordered labels.
- When grouping is inactive, generate a single `<ul class="catalog-list">` of items sorted by `titleField`, with no group nav and no `<section class="group-section">` wrappers.
- Drop the A-Z disabled-letter loop entirely.

### `src/scripts/search.js`

- Rename `letterSections` to `groupSections`, `letterIndex` to `groupIndex`, etc.
- Read `data-group-section` / `data-group` attributes instead of `data-letter*`.
- Disabled state uses `.group-button-disabled` instead of `.letter-index-button-disabled`.
- Filter items as today.
- When group sections / group nav exist: recompute the visible-group set, hide empty group sections, mark inactive nav chips disabled.
- When neither group sections nor a group nav are present (ungrouped mode): only filter items and toggle the empty-state message. Do not error.

### `src/scripts/router.js`

- Update the explicit "skip `#letter-*`" rule to "skip `#group-*`". The fallback "skip if no item matches the id" already handles this, but the explicit rule keeps the script self-documenting.

### `src/styles/site.css`

- Rename `.letter-index`, `.letter-index-button`, `.letter-index-button-disabled`, `.letter-section` to `.group-index`, `.group-button`, `.group-button-disabled`, `.group-section`.
- Allow group buttons to grow with their label: drop the `min-width: 2rem` hard floor or replace it with `min-width: 2rem` plus generous horizontal padding so two-character labels still feel equal-weight while long labels read fine.
- Verify wrapping behavior on narrow viewports.

### `scripts/verify-local.sh`

- Replace the "26 `data-letter` buttons" check with structural checks that work in both modes:
  - `dist/index.html` always contains a `<ul class="catalog-list">` with at least one `<li`.
  - When the sample `content/index.md` has `groupBy` set: at least one `class="group-section"` and at least one `class="group-button"` exist in `dist/index.html`.
  - When `groupBy` is absent: no `class="group-section"` and no `id="group-index"` should appear.
- Keep all other checks (search input, details elements, no `id="status"`, css/js asset presence).

---

## Example: Update Sample Content

To demonstrate the feature with the existing sample items, set:

```yaml
groupBy: kind
groupOrder: Mammals, Cephalopods, Birds
```

And add `kind:` to each item's frontmatter (Bottlenose Dolphin → Mammals, Reef Octopus → Cephalopods, Emperor Penguin → Birds, Scrambled Eggs → ... probably remove from this sample or add a `kind: Recipe` and put it in its own group).

The sample content's job is to demonstrate the generator, so it should make the new feature obvious at a glance.

---

## Docs

Update:

- `README.md`: short paragraph on `groupBy` / `groupOrder` with an example.
- `.ai/architecture.md`: note that the catalog is grouped by a configurable axis, not hardcoded A-Z.
- `.ai/product.md`: note that grouping is a config decision, not a built-in opinion.
- `content/index.md`: include the new fields in the demonstration config.

---

## Verification

After implementation, verify:

- With `groupBy` absent, the site renders as a single flat list of items sorted by `titleField`, with no group nav and no group section wrappers.
- With `groupBy: kind`, the site renders sections in the order given by `groupOrder`, with item counts per group matching item frontmatter.
- Items missing the `groupBy` field appear in an "Other" group at the end.
- Group nav chips link to `#group-<slug>` and scroll to the right section.
- Clicking an item still expands it; permalinks (feature 016) still work in both modes.
- Search filters items in both modes. In grouped mode, it also hides empty group sections and marks nav chips disabled.
- A `groupOrder` value with a label that has no matching items renders nothing extra (the label is silently dropped).
- A label that exists in items but is missing from `groupOrder` is appended after the listed groups, in alphabetical order.
- `npm run verify` passes.

---

## Acceptance Criteria

- Catalog authors can choose what items are grouped by from `content/index.md`.
- The default behavior, with no `groupBy` configured, is a flat unsegmented list sorted by `titleField`. No grouping markup is emitted.
- The DOM, CSS classes, and JS variable names speak in terms of "group", not "letter".
- The build still produces a single static `dist/index.html` plus copied assets.
- No new dependencies are introduced.
- Existing features (search, deep linking, dark mode) continue to work in both grouped and ungrouped modes.
