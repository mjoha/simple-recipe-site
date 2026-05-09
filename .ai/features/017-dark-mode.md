# Feature: Dark Mode Via `prefers-color-scheme`

## Goal

Render the catalog in a dark palette when the user's operating system is set to dark mode, and in the existing light palette otherwise. No toggle, no persistence, no JavaScript.

The current stylesheet already drives every color through CSS variables, so dark mode is implemented by overriding those variables under `@media (prefers-color-scheme: dark)`. The existing layout, typography, and spacing stay exactly the same.

---

## Scope

### Include

- A dark palette defined as a `@media (prefers-color-scheme: dark)` override of the existing CSS variables in `src/styles/site.css`.
- A `<meta name="color-scheme" content="light dark">` tag in the generated HTML so native form controls (the search input, focus rings, scrollbars) match.
- A `<meta name="theme-color">` pair so the browser chrome on mobile matches each scheme.
- A small adjustment to `scripts/build-site.mjs` to emit those meta tags.
- Visual verification that all states (default, hover, focus, disabled, expanded item) remain legible in dark mode.

### Exclude

- No user-facing theme toggle.
- No `localStorage` or persisted preference.
- No JavaScript.
- No new files (the dark palette lives next to the light palette in `site.css`).
- No icon, favicon, or image changes.
- No layout, typography, or spacing changes.
- No new build dependencies.

---

## Palette Direction

The light palette is warm, cream/paper-like. The dark palette should feel like its night counterpart: warm-toned dark, not blue-cool, not pure black. Use a deep brown background, a soft off-white body text, and a slightly desaturated version of the existing accent.

Suggested starting values (tune to taste, but stay in this temperature):

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1c1814;
    --color-text: #ece4d4;
    --color-muted: #a89b85;
    --color-border: #3a3127;
    --color-surface: #25201a;
    --color-accent: #d6b07a;
    --color-accent-hover: #e7c594;
    --color-focus: #e0bd87;
    --color-disabled: #5b5246;
  }
}
```

Constraints:

- Body text on background must meet WCAG AA contrast (≥ 4.5:1 for normal text).
- The disabled letter color must look clearly disabled but not invisible.
- Focus rings must be visible against the dark background.
- The expanded-item top/bottom borders must be visible without being harsh.

---

## Meta Tags

`scripts/build-site.mjs` should add the following inside `<head>` of the generated HTML, ahead of the stylesheet link:

```html
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#f8f5ef" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#1c1814" media="(prefers-color-scheme: dark)">
```

`color-scheme` lets the browser render native UI (form fields, scrollbars, focus rings) in the matching scheme. `theme-color` updates the mobile browser address bar to match.

If the chosen dark background hex differs from the example above, update the second `theme-color` value to match.

---

## State Coverage Checklist

When verifying dark mode in the browser, walk through each of these and confirm legibility:

- Site title and description
- Search input default, placeholder, focused, and with a query
- Empty-state message
- Letter index: enabled, hover, focus, disabled
- Letter section heading and underline
- Item title, hover, focus
- Expanded item top/bottom borders
- Item section headings (Introduction, Objective, etc.)
- Item body paragraphs

If any state looks washed out or hard to read, adjust the corresponding variable rather than introducing one-off color rules.

---

## Build Script Changes

`scripts/build-site.mjs`:

- Add the three meta tags above to the generated HTML head, between the existing `<meta name="viewport">` line and the `<link rel="stylesheet">` line.
- No other changes.

The build output is still a single `dist/index.html` plus copied assets.

---

## Verify Script Changes

`scripts/verify-local.sh` should additionally check that:

- `dist/index.html` contains `name="color-scheme"`.
- `dist/index.html` contains both `media="(prefers-color-scheme: light)"` and `media="(prefers-color-scheme: dark)"`.
- `dist/styles/site.css` contains `prefers-color-scheme: dark`.

---

## Verification

After implementation, verify:

- With OS in light mode, the site looks identical to before this feature.
- With OS in dark mode, the site renders in the warm dark palette without layout or font shifts.
- Toggling OS theme while the page is open updates the colors immediately (no reload required).
- Mobile browser address bar color matches the active scheme.
- Search input, scrollbar, and any native UI render in the correct scheme.
- All text in the State Coverage Checklist is legible in both schemes.

---

## Acceptance Criteria

- The site has a usable, on-brand dark palette that activates automatically.
- No JavaScript is added.
- No new files are added.
- The light experience is byte-for-byte unchanged in shape, only the head gains three meta tags.
- WCAG AA contrast is met for body text in both schemes.
- A future "manual toggle" feature can be layered on top of this one without rework, by adding a `[data-theme]` attribute selector that mirrors the existing media query block.
