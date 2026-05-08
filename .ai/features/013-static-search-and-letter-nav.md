# Feature: Static Search And Full Letter Navigation

## Goal

Improve the generated static catalog UX by adding simple client-side search, rendering the full alphabet in the letter navigation, and removing the item-count status line.

Keep the site generated/static-first. Search should be a tiny plain JavaScript enhancement, not a return to TypeScript or runtime catalog rendering.

---

## User Outcome

As a reader, I can:

- search/filter the generated catalog in place
- see the full alphabet in the letter navigation
- tell which letters have matching items
- avoid visual clutter from an item-count line under the intro/search area

---

## Scope

### Include

- Add a search input to the generated `dist/index.html`.
- Add a tiny plain JavaScript search enhancement.
- Generate searchable data attributes on item elements.
- Filter generated item elements client-side.
- Hide empty letter sections during search.
- Update letter navigation during search.
- Render all alphabet letters in the letter navigation.
- Render unavailable letters as disabled/grey/inactive.
- Remove the current `x entries` status/count line from generated HTML.
- Add a simple no-results message for search.
- Keep native `<details>` / `<summary>` expansion.
- Keep normal anchor links for letter navigation.
- Keep GitHub Pages compatible relative paths.
- Update verification if needed.

### Exclude

- No TypeScript.
- No frontend framework.
- No generated JSON runtime rendering.
- No client-side router.
- No backend.
- No database.
- No search dependency/library.
- No fuzzy search.
- No complex scoring/ranking.

---

## Search Requirements

Add one small JavaScript file, for example:

```text
src/scripts/search.js
```

Requirements:

- Plain JavaScript only.
- No build step.
- No dependencies.
- Loaded with `defer`.
- Works against generated HTML.
- Filters items by text in a generated `data-search` attribute.
- Case-insensitive.
- Trims whitespace.
- Empty search shows all items and all available letter sections.
- Non-empty search hides non-matching items.
- Non-empty search hides letter sections with no visible matching items.
- Shows a clear no-results message when nothing matches.

Example generated item:

```html
<li class="catalog-list-item" data-search="scrambled eggs eggs butter salt objective execution">
  ...
</li>
```

Search should not fetch data.

---

## Full Alphabet Navigation

The generated letter navigation should include all letters:

```text
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
```

Behavior:

- Letters with visible matching items are links/buttons.
- Letters without visible matching items are disabled/inactive.
- During search, disabled state should update based on visible matches.
- Disabled letters should not look clickable.
- Disabled letters should be accessible, for example:

```html
<span class="letter-index-button letter-index-button-disabled" aria-disabled="true">Q</span>
```

or equivalent.

If item titles can begin with non-A-Z characters, handle `#` or other initials separately only if the current content requires it. Keep A-Z as the main navigation.

---

## Remove Count/Status Line

Remove the generated line like:

```html
<p id="status">3 entries</p>
```

Do not replace it with another persistent count.

Allowed:

- A no-results message that is hidden by default and only appears when search has no matches.

Example:

```html
<p id="empty-state" hidden>No items match your search.</p>
```

---

## Generated HTML Requirements

The generated page should roughly contain:

```html
<h1>Catalog</h1>
<p>Optional description...</p>

<label for="search-input">Search</label>
<input id="search-input" type="search" autocomplete="off">

<p id="empty-state" hidden>No items match your search.</p>

<nav id="letter-index" aria-label="Catalog index">
  ...
</nav>

<section id="letter-A" data-letter-section="A">
  ...
</section>
```

Use semantic controls and visible or visually hidden labels as appropriate.

---

## Styling Requirements

Update CSS for:

- search input if needed
- no-results message
- active/available letters
- disabled letters
- hidden sections/items

Disabled letters should be visibly muted and non-interactive.

Keep the current typographic direction intact.

---

## Build Script Requirements

Update `scripts/build-site.mjs` so it:

- generates the search input
- generates `data-search` attributes
- generates full A-Z letter navigation
- generates disabled letters for unavailable initials
- removes the item-count status line
- includes `./scripts/search.js` if search is implemented

Keep the build script understandable.

---

## Verification

After implementation, verify:

- `npm run build` succeeds.
- `npm run verify` succeeds.
- generated `dist/index.html` contains the search input.
- generated `dist/index.html` does not contain the persistent item count/status line.
- generated letter nav contains all A-Z letters.
- unavailable letters are disabled/grey.
- search filters visible items.
- search updates letter availability.
- no-results message appears when appropriate.
- item expansion via `<details>` still works.
- GitHub Pages relative paths are preserved.

---

## Acceptance Criteria

- Search is available via tiny plain JavaScript.
- No TypeScript or runtime JSON rendering is reintroduced.
- All A-Z letters are rendered in the navigation.
- Letters without matching visible items are disabled.
- The persistent `x items` status/count line is removed.
- Existing static generated catalog layout remains intact.
