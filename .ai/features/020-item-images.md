# Feature: Inline Item Images With Click-To-Zoom

## Goal

Let catalog authors place images anywhere inside an item's expanded body using standard Markdown image syntax. Multiple images per item are supported. Each image renders as a small preview at the position the author wrote it; clicking opens it full-size in a tiny in-page lightbox, with a no-JS fallback that opens the file in a new tab.

The collapsed list stays text-only. This preserves the dense, scannable index while giving authors a real visual element exactly where it belongs in the prose.

---

## Scope

### Include

- A new `content/images/` folder for source images.
- Markdown image syntax inside item section bodies as the authoring surface.
- Standalone-image-line detection in the build, converted to `<figure>` markup at that exact position.
- Multiple images per item, in any sections, in any order.
- Use of the optional Markdown image title as the caption.
- Build-time copy of referenced images from `content/images/` to `dist/images/`.
- Build-time validation: file must exist, alt text must be non-empty, paths must not escape the images folder.
- A tiny in-page lightbox (`src/scripts/image-lightbox.js`) for click-to-zoom, with backdrop, Esc-to-close, click-outside-to-close.
- A no-JS fallback: the link opens the full file in a new tab.
- Lazy-loading and async decoding for performance.
- Accessibility: required alt text, focus management when the lightbox opens and closes.
- Verify-script checks for the lightbox script and the image folder when demo content uses images.

### Exclude

- No images in the collapsed summary row. The list stays text-only.
- No image processing, resizing, or format conversion at build time. Authors prepare reasonable files themselves.
- No image galleries, sliders, or carousels.
- No remote (HTTP) images. Local files only.
- No new build dependencies. The Markdown image parsing is handled by a focused regex in the existing build script.
- No CDN integration.
- No frontmatter-driven image fields. All images live inside the section bodies as Markdown.

---

## Folder Layout

```text
content/
  index.md
  items/
    african-elephant.md
    reef-octopus.md
  images/
    african-elephant.jpg
    african-elephant-trunk.jpg
    reef-octopus.jpg
```

`content/images/` is checked in. `dist/images/` is generated from it and contains only referenced files.

The convention is: filename matches item slug, with optional suffixes for additional images. The build does not enforce filenames; it only resolves what the markdown references.

Allowed extensions:

- `.jpg`, `.jpeg`
- `.png`
- `.webp`
- `.avif`
- `.gif`
- `.svg`

The build copies referenced files as-is. No transformation.

---

## Authoring: Inline Markdown Images

Images are placed using standard Markdown image syntax inside any section body. The author decides where each image appears — top of "Habitat", between two paragraphs in "Adaptation", at the end of "Reflection", anywhere.

A line that is *only* an image is rendered as a `<figure>` with click-to-zoom. The caption comes from the optional Markdown title field (the quoted string after the URL).

Example item body:

```markdown
## Habitat

African elephants prefer open savanna with reliable surface water and seasonally
shifting forage...

![A bull elephant in profile against savanna grass](african-elephant.jpg "Loxodonta africana, Kruger National Park.")

Family units are matriarchal, structured around an experienced female who
remembers...

## Adaptation

The trunk is a fused upper lip and nose, controlled by tens of thousands of
muscle bundles...

![Close-up of the trunk tip showing the two finger-like projections used for fine manipulation](african-elephant-trunk.jpg)
```

Rules:

- A "standalone image line" is a paragraph whose entire trimmed content is one Markdown image expression: `![alt](path)` or `![alt](path "caption")`.
- Lines that mix prose and an image are treated as regular text. Authors who want the image as a figure should place it on its own line, separated by blank lines.
- `path` is resolved relative to `content/images/`. Paths starting with `/` or containing `..` segments are rejected for safety.
- `alt` is required. An image with empty alt text fails the build.
- `caption` (the Markdown title) is optional. When omitted, no `<figcaption>` is rendered.
- Multiple images per item are supported simply by writing multiple image lines.
- An image may appear in any section body. The image renders inline at that position.
- Section presence, naming, and ordering remain controlled by `content/index.md` `sections:`. Images do not affect that.

---

## Layout And Display

Each standalone Markdown image line becomes a `<figure>` at the exact position the author wrote it inside the rendered section body. The collapsed `<summary>` row stays text-only.

Generated markup for one image:

```html
<figure class="catalog-item-image">
  <a href="./images/african-elephant.jpg"
     class="catalog-item-image-link"
     data-image-zoom
     target="_blank"
     rel="noopener">
    <img src="./images/african-elephant.jpg"
         alt="A bull elephant in profile against savanna grass"
         loading="lazy"
         decoding="async">
  </a>
  <figcaption class="catalog-item-image-caption">
    Loxodonta africana, Kruger National Park.
  </figcaption>
</figure>
```

Notes:

- The `<a>` is the click target for the lightbox script and the no-JS fallback. With JS, the script intercepts the click and opens the lightbox. Without JS, the link opens the full image in a new tab.
- `target="_blank"` and `rel="noopener"` are present for the no-JS path; the JS handler calls `event.preventDefault()` so they have no effect when JS is enabled.
- `loading="lazy"` and `decoding="async"` are essential for catalogs with many images.
- If the Markdown title is empty or omitted, the `<figcaption>` is skipped entirely.
- Image previews stay within the existing item content width and are constrained vertically so they do not dominate the section.

The image must not appear in the collapsed `<summary>` row.

---

## Lightbox Behavior

Add a tiny `src/scripts/image-lightbox.js`. The build copies it to `dist/scripts/image-lightbox.js` and includes it after the other scripts in the generated HTML.

Responsibilities:

- Listen for clicks on `[data-image-zoom]` inside `[data-catalog-item]`.
- On click: prevent default, open an overlay containing the full image and an accessible close affordance.
- The overlay should:
  - cover the viewport with a tinted backdrop using existing color variables;
  - center the image, sized to fit within the viewport (`max-width: min(96vw, 1400px)`, `max-height: 92vh`);
  - close on `Esc`, on click outside the image, and on clicking a small dismiss control;
  - move focus into the overlay on open and return focus to the originating link on close;
  - expose `role="dialog"` and `aria-modal="true"`;
  - be removed from the DOM after closing (no zombie overlays).
- The script should not run if no `[data-image-zoom]` elements exist.
- The script handles any number of images per item; the same handler is reused.

This is intentionally simple; do not depend on any library.

---

## Build Script Changes

`scripts/build-site.mjs` should:

- When converting a section body to paragraphs, detect lines whose entire trimmed content matches a Markdown image expression and emit `<figure>` markup at that position instead of `<p>`.
- Parse `![alt](path)` and `![alt](path "caption")` with a focused regex. Reject paths that start with `/`, contain `..`, or are empty.
- Resolve each `path` against `content/images/`. Fail the build with a clear error if the file does not exist, if the extension is not in the allowed list, or if `alt` is empty. Errors should cite the item filename and the offending line.
- Track the set of referenced image paths across all items in a Set so each file is copied at most once.
- After all items are processed, copy each referenced image from `content/images/<path>` to `dist/images/<path>`, creating subdirectories as needed.
- Copy `src/scripts/image-lightbox.js` to `dist/scripts/image-lightbox.js`.
- Add `<script src="./scripts/image-lightbox.js" defer></script>` to the generated HTML, after the other scripts.

Do not copy unreferenced files from `content/images/`. This avoids shipping orphans on every build.

The same image referenced by multiple items is fine; the file is copied once.

---

## CSS Changes

`src/styles/site.css` should add:

```css
.catalog-item-image {
    margin: 0 0 var(--space-3);
    padding: 0;
}

.catalog-item-image-link {
    display: inline-block;
    cursor: zoom-in;
}

.catalog-item-image img {
    display: block;
    width: 100%;
    max-width: 28rem;
    max-height: 22rem;
    height: auto;
    object-fit: cover;
    border: 1px solid var(--color-border);
    border-radius: 0.4rem;
}

.catalog-item-image-link:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 3px;
    border-radius: 0.45rem;
}

.catalog-item-image-caption {
    margin: var(--space-2) 0 0;
    max-width: 28rem;
    font: italic 0.92rem/1.45 var(--font-serif);
    color: var(--color-muted);
}

.image-lightbox-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: grid;
    place-items: center;
    padding: var(--space-4);
    background: rgba(20, 16, 10, 0.82);
    backdrop-filter: blur(2px);
}

.image-lightbox-frame {
    position: relative;
    max-width: min(96vw, 1400px);
    max-height: 92vh;
}

.image-lightbox-frame img {
    display: block;
    max-width: 100%;
    max-height: 92vh;
    height: auto;
    object-fit: contain;
    border-radius: 0.4rem;
}

.image-lightbox-close {
    position: absolute;
    top: -0.6rem;
    right: -0.6rem;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text);
    font: 600 1rem/1 var(--font-sans);
    cursor: pointer;
}

.image-lightbox-close:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
}
```

The dark palette already overrides the relevant variables; no separate dark-mode block should be required for the lightbox. The backdrop color may be adjusted for dark mode if it looks off.

---

## Verify Script Changes

`scripts/verify-local.sh` should additionally:

- Confirm `dist/scripts/image-lightbox.js` exists.
- Confirm `dist/index.html` references `./scripts/image-lightbox.js`.
- If the demo content references at least one image, confirm `dist/images/` exists and contains the expected file(s).
- Confirm that catalogs without any image markdown still build and verify cleanly (no required image folder).

---

## Accessibility

- Empty alt text causes a build failure with a clear message. This forces authors to describe their images.
- The lightbox uses `role="dialog"` and `aria-modal="true"`.
- Focus moves into the overlay on open and returns to the originating link on close.
- The lightbox closes on `Esc`.
- Image links carry a visible focus ring.
- Captions are linked to their image by virtue of being inside the same `<figure>` element.

---

## Performance

- All images use `loading="lazy"` and `decoding="async"`.
- The lightbox displays the same file as the preview; it does not re-fetch a higher-resolution variant.
- The build does not optimize images. Document the recommendation in the README to upload reasonably-sized files.

---

## Documentation

Update:

- `README.md`: short section on adding images. Cover folder location, Markdown syntax (with the title-as-caption convention), required alt text, multiple-images-per-item, click-to-zoom behavior.
- `.ai/architecture.md`: note the new asset folder and that referenced images are copied at build time.
- `.ai/product.md`: images are part of supported per-item content, placed inline by the author.
- One existing example item (e.g. `african-elephant.md`) should reference at least one image, and ideally a second one in a different section, so the demo content shows the feature off.

---

## Verification

After implementation, verify:

- An item with no image markdown renders exactly as before. No empty `<figure>` blocks.
- An item with a Markdown image line renders a sized `<figure>` at that position in the section body, with caption when the title is present and without when it is absent.
- An item with multiple Markdown image lines, in different sections, renders each at its own position.
- A line that mixes prose and an image is rendered as a paragraph, not a figure.
- Clicking any image preview opens the lightbox, centered, with the full file loaded.
- Pressing `Esc`, clicking the backdrop, or clicking the close control all dismiss the lightbox.
- Focus returns to the originating link after the lightbox closes.
- With JS disabled, clicking any preview opens the full image in a new tab.
- A Markdown image with empty alt causes the build to fail with a clear error.
- A Markdown image whose path does not exist under `content/images/` causes the build to fail with a clear error.
- A Markdown image whose path starts with `/` or contains `..` causes the build to fail with a clear error.
- The same image referenced by multiple items is copied once.
- `npm run verify` passes with the demo image(s) present.
- Dark mode renders previews and the lightbox cleanly.

---

## Acceptance Criteria

- Authors can place any number of images anywhere inside an item's section bodies using plain Markdown image syntax.
- The Markdown title is used as the figure caption when present.
- Images are stored under `content/images/`. Only referenced images are copied to `dist/images/`.
- The collapsed list stays text-only.
- The expanded body renders each image as a sized preview with optional caption, at the exact authored position.
- Click-to-zoom works via a tiny in-page lightbox, with a clean no-JS fallback.
- Required alt text is enforced at build time.
- No new dependencies are introduced.
- Existing features (search, grouping, deep linking, dark mode, expand/collapse) continue to work unchanged.
