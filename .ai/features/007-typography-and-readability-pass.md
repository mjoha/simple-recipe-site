# Feature: Typography And Readability Pass

## Goal

Make the recipe index feel world-class in typography, color, spacing, and readability while keeping the app minimal and plain.

This is not a redesign into a glossy product. It should feel like a carefully typeset digital recipe book: quiet, warm, precise, and effortless to read.

---

## User Outcome

As a user, I can browse and read recipes comfortably for an extended period.

The page should feel intentional and polished without adding images, decoration, animation, or UI framework complexity.

---

## Scope

### Include

- Rework typography across the page.
- Rework the color palette.
- Improve line length, spacing, and hierarchy.
- Improve the recipe index readability.
- Improve expanded recipe readability.
- Improve search input styling and focus states.
- Improve letter index styling and active/available/unavailable states.
- Add or improve accessibility-focused visual states:
  - focus-visible
  - hover
  - selected/expanded recipe
  - disabled/unavailable index letters
- Use CSS custom properties for the palette, typography, and spacing scale.
- Keep styling in plain CSS.
- Keep the UI minimal.

### Exclude

- No frontend framework.
- No CSS framework.
- No SCSS.
- No images.
- No icons unless Unicode/text is sufficient.
- No animations beyond subtle state changes if truly useful.
- No backend changes.
- No database changes.
- No new recipe behavior.
- No layout-heavy dashboard/card redesign.

---

## Design Direction

The design should feel like:

- A well-typeset cookbook index.
- Calm and text-first.
- Warm without becoming beige/muddy.
- Crisp enough to feel modern.
- Highly readable on desktop and mobile.

Avoid:

- Generic SaaS styling.
- Overly decorative script fonts.
- Low contrast.
- Heavy shadows.
- Bright saturated accent colors.
- Large rounded cards everywhere.
- “AI purple” palettes.

---

## Font Strategy

Prefer high-quality local/system font stacks first. Avoid adding external font loading unless there is a strong reason.

Suggested direction:

- Use a refined serif for recipe/content text.
- Use a clean humanist sans or small-caps-like treatment for metadata and controls if needed.
- Keep the number of font families low.

Example acceptable stacks:

```css
--font-serif: Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif;
--font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

If external fonts are proposed, they must be justified and kept to at most two families/weights. Do not add a dependency or build step for fonts.

---

## Color Direction

Create a small cohesive palette using CSS variables.

The palette should include:

- Page background.
- Main text.
- Muted text.
- Soft border.
- Subtle surface.
- Accent.
- Accent hover/focus.
- Focus ring.

The palette should be warm and readable, but not washed out.

Accessibility requirement:

- Body text must have strong contrast against the background.
- Interactive text/buttons must remain clearly readable.
- Focus states must be visible.

---

## Layout And Readability

Tune the page for reading:

- Use a comfortable max width for the main content.
- Use a narrower measure for expanded recipe text if needed.
- Use line-height appropriate for long-form recipe reading.
- Make headings distinct without being loud.
- Ensure ingredients and instructions are easy to scan.
- Preserve enough whitespace between letter sections.
- Avoid cramped recipe titles.

The current app is intentionally single-column. Keep that unless a small responsive adjustment clearly improves readability.

---

## Recipe Index Requirements

The collapsed index should be fast to scan.

Improve:

- Recipe title hierarchy.
- Letter headings.
- Space between letter sections.
- Available/unavailable letter index styling.
- Expanded recipe visual treatment.

Expanded recipes should feel connected to the title that opened them, not like separate cards.

---

## Interaction States

Interactive elements must be visibly interactive.

Include:

- `:hover` states for recipe titles/buttons and available letter index entries.
- `:focus-visible` states for search input, recipe buttons, and letter controls.
- A clear expanded recipe state.
- Unavailable letters should look inactive and should not appear clickable.

If current clickable elements are `div`s, consider whether they should become semantic `button`s in this feature. Prefer semantic controls if doing so does not add complexity.

---

## Implementation Notes

- Keep all styling in `wwwroot/styles/site.css`.
- It is acceptable to reorganize the CSS file around:
  - variables
  - base
  - layout
  - controls
  - recipe index
  - expanded recipe
- Do not make unrelated TypeScript changes unless needed for semantic controls or state classes.
- Do not change API or data model.

---

## Verification

After implementation, verify:

- `npm run build` succeeds.
- `dotnet build` succeeds.
- `npm run verify` succeeds.
- The page remains usable on a narrow mobile viewport.
- The page remains comfortable on desktop.
- Search input has a visible focus state.
- Letter index available/unavailable states are visually clear.
- Recipe titles are clearly clickable.
- Expanded recipe content is easy to read.
- No external framework, CSS framework, SCSS, or image dependency was added.

---

## Acceptance Criteria

- The app has a cohesive typography system.
- The app has a cohesive color system using CSS variables.
- Recipe browsing and expanded reading are materially more readable.
- Interactive/focus states are accessible and visible.
- The UI remains minimal and text-first.
- No backend, database, or behavior changes are introduced except small semantic HTML/TypeScript adjustments if needed for accessibility.
