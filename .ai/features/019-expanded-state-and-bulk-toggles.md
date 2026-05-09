# Feature: Clear Expanded State And Bulk Toggles

## Goal

Make it immediately obvious which catalog items are expanded, and add a neat way to expand or collapse many items without adding visual clutter.

The current expanded state is too subtle because `.catalog-item[open]` uses the same border color and visual language as group/section separators. This makes an open item feel like another section divider rather than an active, selected entry. The fix should give expanded items their own treatment while keeping the page quiet and readable.

---

## Scope

### Include

- Improve the visual distinction for expanded items.
- Add subtle expand/collapse controls:
  - global controls for the whole catalog;
  - group-level controls when `groupBy` is configured;
  - no group-level controls in ungrouped mode.
- Keep native `<details>` / `<summary>` as the core interaction.
- Keep item titles themselves clickable.
- Preserve item deep-linking behavior from feature 016.
- Preserve search behavior.
- Update verification to check that the controls exist in the relevant generated modes.

### Exclude

- No redesign of the whole page.
- No modal, drawer, or separate detail page.
- No custom accordion framework.
- No dependency.
- No icon package.
- No animations beyond a very small hover/focus transition if useful.
- No change to content authoring.

---

## Expanded Item Styling

Replace the current open-state treatment:

```css
.catalog-item[open] {
    margin: var(--space-1) 0;
    padding: var(--space-2) 0;
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
}
```

with a treatment that reads as "this item is open" rather than "this is another section".

Recommended direction:

- Give open items a soft surface background.
- Add a distinct left accent rail.
- Use a border color separate from group/section dividers.
- Add modest internal padding so the expanded content feels contained.
- Keep the visual weight low; this should not become a card-heavy UI.

Suggested variables:

```css
:root {
    --color-expanded-bg: rgba(107, 83, 51, 0.055);
    --color-expanded-border: rgba(107, 83, 51, 0.28);
    --color-expanded-rail: var(--color-accent);
}

@media (prefers-color-scheme: dark) {
    :root {
        --color-expanded-bg: color-mix(in srgb, var(--color-accent) 10%, transparent);
        --color-expanded-border: color-mix(in srgb, var(--color-accent) 30%, var(--color-border));
        --color-expanded-rail: var(--color-accent);
    }
}
```

Suggested style:

```css
.catalog-item[open] {
    margin: var(--space-2) 0;
    padding: var(--space-3) var(--space-4);
    border: 1px solid var(--color-expanded-border);
    border-left: 0.25rem solid var(--color-expanded-rail);
    border-radius: 0.5rem;
    background: var(--color-expanded-bg);
}
```

Tune spacing after seeing it in the browser. The important part is the separate visual vocabulary: group boundaries stay quiet horizontal rules; expanded items get a contained, left-accented treatment.

---

## Summary Indicator

Add a small inline indicator to the summary so the collapsed/expanded state is visible even before content is read.

Do this with CSS, not generated text in every item, unless CSS proves awkward:

```css
.catalog-item-toggle {
    display: flex;
    align-items: baseline;
    gap: var(--space-2);
}

.catalog-item-toggle::before {
    content: "+";
    flex: 0 0 auto;
    color: var(--color-muted);
    font: 600 0.95rem/1 var(--font-sans);
}

.catalog-item[open] .catalog-item-toggle::before {
    content: "−";
    color: var(--color-accent);
}
```

This is intentionally not a separate "button" next to each item. It keeps the whole summary as the click target and avoids crowding the list with controls.

Use ASCII `-` instead of the minus character if the file should remain strictly ASCII.

---

## Global Expand/Collapse Controls

Add a compact control row near the search input:

```html
<div class="catalog-controls" aria-label="Catalog controls">
  <button type="button" data-expand-all>Expand all</button>
  <button type="button" data-collapse-all>Collapse all</button>
</div>
```

Placement:

- After the search input and empty-state message.
- Before the optional group nav.

Behavior:

- `Expand all` opens all currently visible items.
- `Collapse all` closes all currently visible items.
- Hidden-by-search items are not changed. This makes the controls act on "what I am looking at now".
- Updating items through these controls should not produce scroll jumps.
- After expanding all, the URL hash should remain unchanged unless a single item was explicitly opened by user click or deep link.
- After collapsing all, clear the hash if the current hash points to an item that was closed.

This likely belongs in a small `src/scripts/expand-collapse.js`, copied by the build into `dist/scripts/expand-collapse.js` and loaded after `router.js`.

Keep this script small and DOM-driven. No shared state framework.

---

## Group-Level Controls

When grouping is active, add small controls per group:

```html
<div class="group-heading">
  <h2>Mammals</h2>
  <div class="group-controls">
    <button type="button" data-expand-group="mammals">Expand</button>
    <button type="button" data-collapse-group="mammals">Collapse</button>
  </div>
</div>
```

Guidelines:

- Only render group controls when `groupBy` is configured.
- Do not render group controls in ungrouped mode.
- Keep labels short: `Expand` / `Collapse`, not `Expand all Mammals`.
- Use `aria-label` if needed for clarity:
  - `aria-label="Expand Mammals"`
  - `aria-label="Collapse Mammals"`
- Controls affect visible items in that group only.
- If search hides some items in the group, only visible items are changed.

Styling:

- Group heading should remain quiet.
- Controls should look like small text buttons, not heavy primary buttons.
- On narrow screens, group controls can wrap under the heading.

---

## JavaScript Behavior

Add a tiny script, for example `src/scripts/expand-collapse.js`.

Responsibilities:

- Find all `[data-catalog-item] details`.
- Wire global controls:
  - `[data-expand-all]`
  - `[data-collapse-all]`
- Wire group controls:
  - `[data-expand-group]`
  - `[data-collapse-group]`
- Only act on items that are not hidden.
- For group controls, scope to the closest `[data-group-section]`.
- Close/open by assigning `details.open = true/false`.
- Clear item hash when collapsing closes the item represented by the current hash.

Avoid dispatching custom events unless truly needed.

The existing router listens to `<details>` `toggle` events and updates the hash for normal user item toggles. Bulk operations may trigger many toggle events, so avoid hash churn:

- Preferred: teach `router.js` to ignore bulk toggle operations when a temporary flag is set, e.g. `document.documentElement.dataset.bulkToggling = "true"`.
- Simpler alternative: after bulk operation completes, explicitly restore the previous hash or clear it when appropriate.

Choose the simpler implementation that is robust in the browser.

---

## Build Script Changes

`scripts/build-site.mjs` should:

- Add global catalog controls to the generated HTML.
- Add group-level controls only when grouping is active.
- Copy `src/scripts/expand-collapse.js` to `dist/scripts/expand-collapse.js`.
- Add `<script src="./scripts/expand-collapse.js" defer></script>` to the generated HTML after `router.js`.

No item content markup changes are required beyond any attributes needed to scope group controls.

---

## CSS Changes

`src/styles/site.css` should add styles for:

- `.catalog-controls`
- `.catalog-controls button`
- `.group-heading`
- `.group-controls`
- `.group-controls button`
- expanded item state variables and styles
- summary plus/minus indicator

Buttons should:

- use the existing font stack and color variables;
- have visible focus states;
- work in dark mode;
- look secondary/subtle.

Avoid a heavy "app toolbar" feel.

---

## Search Interaction

Search continues to hide non-matching items.

Bulk controls act only on visible items:

- Search "penguin" then `Expand all` opens the visible penguin item(s), not the whole catalog.
- `Collapse all` with a query collapses visible matching items only.
- Clearing the search reveals other items in their previous state.

This behavior is predictable because controls act on the current filtered view.

---

## Router Interaction

Deep links remain item-first:

- Visiting `/#reef-octopus` opens that item and scrolls to it.
- Using `Expand all` does not change the hash to the last expanded item.
- Using `Collapse all` clears the hash if the hashed item is closed.
- Clicking a single item title still updates the hash to that item.

If implementing this requires a small router change, keep it local and documented with a short comment.

---

## Verification

After implementation, verify:

- Expanded items are visually distinct from group sections in both light and dark mode.
- Collapsed item rows still feel minimal and readable.
- The plus/minus indicator changes when an item opens/closes.
- Global `Expand all` opens all currently visible items.
- Global `Collapse all` closes all currently visible items.
- In grouped mode, group-level `Expand` / `Collapse` affects only that group.
- In ungrouped mode, no group-level controls are rendered.
- Search + expand/collapse works on visible filtered items only.
- Deep-linked items still open and scroll into view.
- Bulk expand/collapse does not cause surprising scroll jumps.
- `npm run verify` passes.

---

## Acceptance Criteria

- Users can clearly tell which items are expanded.
- Expanded item styling does not reuse the same visual language as group separators.
- Users can expand or collapse the current view globally.
- Users can expand or collapse individual groups when grouping is active.
- Controls remain subtle and do not make the page feel like an app dashboard.
- Existing search, grouping, dark mode, and item deep-linking behavior continue to work.
- No dependencies are added.
