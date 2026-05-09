# Feature: Deep-Linkable Items Via Fragment Routing

## Goal

Restore deep-linking so a URL with an item slug opens the catalog with that item already expanded and scrolled into view.

Current behavior: every item has an `id="<slug>"` on its `<li>`, so the browser scrolls to the item, but the surrounding `<details>` stays closed. This feature adds a tiny client script that opens the matching `<details>` on load, on hash change, and updates the URL when the user toggles items.

This is intentionally a single-page, fragment-based router. It is the smallest implementation that satisfies "going to `<site>/<item-slug>` lands on the expanded item." If the project later wants per-item paths (`/item-a/`) and per-item OG tags, that can be added as a separate feature on top of this one.

---

## URL Shape

```text
/                        # index, nothing expanded
/#letter-E               # scrolls to letter section (existing)
/#emperor-penguin        # opens and scrolls to the Emperor Penguin item
```

When the user expands an item by clicking it, the URL becomes `/#<slug>` so the link is shareable.

When the user closes the only expanded item, the hash is cleared.

---

## Scope

### Include

- A new `src/scripts/router.js` that handles fragment-based item linking.
- Build script copies `src/scripts/router.js` to `dist/scripts/router.js`.
- Generated `dist/index.html` includes a `<script src="./scripts/router.js" defer></script>`.
- On initial load, if `location.hash` matches an item slug, that item's `<details>` is opened and scrolled into view.
- On `hashchange` (browser back/forward, manual edit, copying a link in another tab), behavior matches initial load.
- When the user opens a `<details>`, the URL hash is updated to its slug using `history.replaceState` (no new history entry, no scroll jump).
- When the user closes a `<details>` and no other item is open, the URL hash is cleared with `history.replaceState`.
- Multiple items can still be open at once (existing behavior). The hash always reflects the most recently toggled-open item.
- `#letter-X` continues to work for the letter index nav and is left alone.

### Exclude

- No changes to per-item HTML output, layout, or styling.
- No new dependencies.
- No TypeScript.
- No framework.
- No per-item URL paths in this feature (e.g. `/item-a/`). That is a possible later feature.
- No changes to the search box or letter nav behavior, except where they share the `<details>` elements.

---

## Implementation Notes

### Slug → element lookup

Item `<li>` elements already have `id="<slug>"`. The script can do:

```js
const item = document.getElementById(slug);
if (!item) return;
const details = item.querySelector("details");
```

If the script is fed a hash like `#letter-A`, it should ignore it (only act on slugs that resolve to an item element with a `<details>` inside).

### Avoid scroll surprises

The previous router caused two recurring problems: layout shift when expanding items below the viewport while another item above was open, and forced scroll to top when the hash was cleared. Mitigations:

- Use `history.replaceState(null, "", "#" + slug)` and `history.replaceState(null, "", location.pathname + location.search)` to mutate the URL without triggering a navigation or scroll.
- Only call `scrollIntoView` when the change came from initial load, `hashchange`, or a user click that opens an item that is currently off-screen. Do not scroll when the user toggles an already-visible item.
- Do not re-scroll when the user closes an item.

### Initial load

```js
function syncFromHash({ scroll }) {
  const slug = decodeURIComponent(location.hash.replace(/^#/, ""));
  if (!slug || slug.startsWith("letter-")) return;
  const item = document.getElementById(slug);
  if (!item) return;
  const details = item.querySelector("details");
  if (!details) return;
  details.open = true;
  if (scroll) {
    item.scrollIntoView({ block: "start" });
  }
}
```

Call with `scroll: true` on `DOMContentLoaded` and on `hashchange`.

### Toggle handler

Attach a `toggle` listener to each `<details>`:

```js
details.addEventListener("toggle", () => {
  const slug = item.id;
  if (details.open) {
    history.replaceState(null, "", "#" + slug);
  } else if (location.hash === "#" + slug) {
    history.replaceState(null, "", location.pathname + location.search);
  }
});
```

This keeps the URL in sync without polluting browser history and without causing scroll jumps.

### Interaction with search.js

`search.js` hides items that do not match the query. If the user navigates to `#some-slug` while a search query is active and the item is hidden, the script should still open the `<details>` but should not force-clear the search. A reasonable rule: open the details, attempt scroll. If the item is hidden by the current filter, the scroll will land at the next visible ancestor; that is acceptable.

If this proves confusing in practice, a follow-up feature can clear the search input on direct slug navigation. Out of scope here.

---

## Build Script Changes

`scripts/build-site.mjs`:

- Add a `sourceRouterScriptPath` and `outputRouterScriptPath`.
- Copy `src/scripts/router.js` to `dist/scripts/router.js` alongside the existing search.js copy.
- Add `<script src="./scripts/router.js" defer></script>` to the generated HTML, after the search script.

No changes to item markup are required; `id="<slug>"` is already present.

---

## Verify Script Changes

`scripts/verify-local.sh` should additionally check that:

- `dist/scripts/router.js` exists.
- `dist/index.html` references `./scripts/router.js`.

---

## Verification

After implementation, verify:

- Visiting `/#emperor-penguin` (or any valid slug) opens that item's `<details>` and scrolls to it.
- Visiting `/` shows the index with everything collapsed.
- Visiting `/#letter-E` still scrolls to the E section without opening any items.
- Clicking an item title updates the URL hash to its slug.
- Closing the last open item clears the hash.
- Browser back/forward between visited slugs behaves correctly (the corresponding item opens).
- Copying the URL of an expanded item and pasting it in a new tab lands on that item, expanded, scrolled into view.
- No unexpected scroll jumps when opening or closing items via clicks.

---

## Acceptance Criteria

- A user can share a URL with an item slug and the recipient lands on that item, expanded.
- The URL stays in sync with the current most-recently-opened item.
- No new dependencies are introduced.
- No build complexity is added beyond copying one extra JS file.
- Existing search and letter-nav behavior is unchanged.
