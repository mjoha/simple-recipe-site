import { existsSync } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const indexConfigPath = path.join(repoRoot, "content", "index.md");
const distDirectory = path.join(repoRoot, "dist");
const outputHtmlPath = path.join(distDirectory, "index.html");
const sourceStylesPath = path.join(repoRoot, "src", "styles", "site.css");
const sourceSearchScriptPath = path.join(repoRoot, "src", "scripts", "search.js");
const sourceRouterScriptPath = path.join(repoRoot, "src", "scripts", "router.js");
const sourceExpandCollapseScriptPath = path.join(repoRoot, "src", "scripts", "expand-collapse.js");
const sourceImageLightboxScriptPath = path.join(repoRoot, "src", "scripts", "image-lightbox.js");
const contentImagesRoot = path.join(repoRoot, "content", "images");
const outputStylesPath = path.join(distDirectory, "styles", "site.css");
const outputSearchScriptPath = path.join(distDirectory, "scripts", "search.js");
const outputRouterScriptPath = path.join(distDirectory, "scripts", "router.js");
const outputExpandCollapseScriptPath = path.join(distDirectory, "scripts", "expand-collapse.js");
const outputImageLightboxScriptPath = path.join(distDirectory, "scripts", "image-lightbox.js");

const ALLOWED_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"]);

function parseFrontmatter(markdown, filePath) {
    if (!markdown.startsWith("---\n")) {
        throw new Error(`Missing frontmatter in ${filePath}`);
    }

    const endIndex = markdown.indexOf("\n---\n", 4);
    if (endIndex < 0) {
        throw new Error(`Unterminated frontmatter in ${filePath}`);
    }

    const frontmatterRaw = markdown.slice(4, endIndex).trim();
    const body = markdown.slice(endIndex + 5).trim();
    const metadata = {};

    for (const line of frontmatterRaw.split("\n")) {
        const separatorIndex = line.indexOf(":");
        if (separatorIndex < 0) {
            throw new Error(`Malformed frontmatter line in ${filePath}: "${line}"`);
        }

        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim();
        metadata[key] = value.length === 0 ? null : value;
    }

    return { metadata, body };
}

function parseCsvList(value) {
    if (typeof value !== "string" || value.trim().length === 0) {
        return [];
    }

    return value
        .split(",")
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
}

function parseSections(body, allowedSections) {
    const sections = {};
    const normalizedBody = body.replace(/\r\n/g, "\n");
    const headingPattern = /^##\s+(.+)$/gm;
    const headings = [];
    let match;

    while ((match = headingPattern.exec(normalizedBody)) !== null) {
        headings.push({ heading: match[1].trim(), index: match.index, end: headingPattern.lastIndex });
    }

    for (let index = 0; index < headings.length; index += 1) {
        const current = headings[index];
        const next = headings[index + 1];
        const normalizedHeading = current.heading.toLowerCase().replace(/\s+/g, "");
        const sectionName = allowedSections.find((section) => section.toLowerCase() === normalizedHeading);
        if (!sectionName) {
            continue;
        }

        const contentEnd = next ? next.index : normalizedBody.length;
        const content = normalizedBody.slice(current.end, contentEnd).trim();
        sections[sectionName] = content.length > 0 ? content : null;
    }

    return sections;
}

function readRequiredConfigField(config, fieldName) {
    const value = config[fieldName];
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(`Missing required config field "${fieldName}" in content/index.md`);
    }
    return value.trim();
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function toHeadingLabel(value) {
    return value
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function parseStandaloneMarkdownImage(trimmedLine) {
    const match = trimmedLine.match(/^!\[([^\]]*)\]\(\s*(\S+)(?:\s+"([^"]*)")?\s*\)$/);
    if (!match) {
        return null;
    }
    return {
        alt: match[1],
        path: match[2],
        caption: match[3] !== undefined ? match[3] : null
    };
}

function assertValidImageRelativePath(relativePath, itemFileName, lineText) {
    const trimmed = relativePath.trim();
    if (!trimmed) {
        throw new Error(`${itemFileName}: image path is empty in "${lineText}"`);
    }
    if (trimmed.startsWith("/") || trimmed.startsWith("\\")) {
        throw new Error(`${itemFileName}: image path must be relative to content/images (no leading slash): "${lineText}"`);
    }
    const segments = trimmed.replace(/\\/g, "/").split("/");
    if (segments.some((segment) => segment === "..")) {
        throw new Error(`${itemFileName}: image path must not contain "..": "${lineText}"`);
    }
}

function resolveImageForBuild(relativePath, imagesRoot, itemFileName, lineText) {
    assertValidImageRelativePath(relativePath, itemFileName, lineText);
    const normalizedInput = relativePath.trim().replace(/\\/g, "/");
    const absoluteSource = path.resolve(imagesRoot, ...normalizedInput.split("/"));
    const relativeFromRoot = path.relative(imagesRoot, absoluteSource);
    if (relativeFromRoot.startsWith("..") || path.isAbsolute(relativeFromRoot)) {
        throw new Error(`${itemFileName}: image path escapes content/images: "${lineText}"`);
    }
    const posixRel = relativeFromRoot.split(path.sep).join("/");
    const ext = path.extname(posixRel).toLowerCase();
    if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
        throw new Error(
            `${itemFileName}: unsupported image extension "${ext}" in "${lineText}" (allowed: ${[...ALLOWED_IMAGE_EXTENSIONS].sort().join(", ")})`
        );
    }
    return { absoluteSource, posixRel };
}

function buildFigureMarkup(webPath, alt, caption) {
    const captionBlock =
        caption && caption.trim().length > 0
            ? `\n    <figcaption class="catalog-item-image-caption">${escapeHtml(caption.trim())}</figcaption>`
            : "";
    return [
        `<figure class="catalog-item-image">`,
        `  <a href="${escapeHtml(webPath)}" class="catalog-item-image-link" data-image-zoom target="_blank" rel="noopener">`,
        `    <img src="${escapeHtml(webPath)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">`,
        `  </a>${captionBlock}`,
        `</figure>`
    ].join("\n");
}

function sectionBodyToHtml(sectionText, itemFileName, referencedImages) {
    if (!sectionText) {
        return "";
    }

    const lines = sectionText.replace(/\r\n/g, "\n").split("\n");
    const blocks = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length === 0) {
            continue;
        }

        const imageMatch = parseStandaloneMarkdownImage(trimmed);
        if (imageMatch) {
            const alt = imageMatch.alt.trim();
            if (!alt) {
                throw new Error(`${itemFileName}: image alt text is required (non-empty): "${trimmed}"`);
            }
            const { absoluteSource, posixRel } = resolveImageForBuild(imageMatch.path, contentImagesRoot, itemFileName, trimmed);
            if (!existsSync(absoluteSource)) {
                throw new Error(
                    `${itemFileName}: image file not found for "${trimmed}" (expected content/images/${posixRel})`
                );
            }
            referencedImages.add(posixRel);
            const webPath = `./images/${posixRel}`;
            blocks.push(buildFigureMarkup(webPath, alt, imageMatch.caption));
            continue;
        }

        blocks.push(`<p class="text-block-line">${escapeHtml(trimmed)}</p>`);
    }

    return blocks.join("\n");
}

function indentLines(text, spaces) {
    const prefix = " ".repeat(spaces);
    return text
        .split("\n")
        .map((line) => (line.length > 0 ? `${prefix}${line}` : line))
        .join("\n");
}

function buildSearchText(item, config) {
    const values = [];

    for (const fieldName of config.searchFields) {
        const fieldValue = item.fields[fieldName];
        if (typeof fieldValue === "string" && fieldValue.trim().length > 0) {
            values.push(fieldValue.trim());
            continue;
        }

        const sectionValue = item.sections[fieldName];
        if (typeof sectionValue === "string" && sectionValue.trim().length > 0) {
            values.push(sectionValue.trim());
        }
    }

    return values.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}

function itemHasRequiredField(item, fieldName) {
    const fieldValue = item.fields[fieldName];
    if (typeof fieldValue === "string" && fieldValue.trim().length > 0) {
        return true;
    }

    const sectionValue = item.sections[fieldName];
    return typeof sectionValue === "string" && sectionValue.trim().length > 0;
}

const OTHER_GROUP_LABEL = "Other";

function slugifyGroupLabel(label) {
    return label
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

function assertUniqueGroupSlugs(orderedLabels) {
    const slugToLabel = new Map();
    for (const label of orderedLabels) {
        const slug = slugifyGroupLabel(label);
        if (slug.length === 0) {
            throw new Error(`Group label "${label}" slugifies to an empty id; use a non-empty label.`);
        }
        if (slugToLabel.has(slug)) {
            throw new Error(
                `Group slug collision: labels "${slugToLabel.get(slug)}" and "${label}" both map to id "group-${slug}". Rename one of the groups.`
            );
        }
        slugToLabel.set(slug, label);
    }
}

/**
 * @param {Map<string, unknown[]>} groupMap
 * @param {string[]} groupOrderList
 */
function orderGroupLabels(groupMap, groupOrderList) {
    const labels = [...groupMap.keys()];

    function pinOtherLast(keys) {
        const nonOther = keys.filter((key) => key !== OTHER_GROUP_LABEL).sort((a, b) => a.localeCompare(b));
        if (keys.includes(OTHER_GROUP_LABEL)) {
            return [...nonOther, OTHER_GROUP_LABEL];
        }
        return nonOther;
    }

    if (groupOrderList.length === 0) {
        return pinOtherLast(labels);
    }

    const ordered = [];
    const seen = new Set();
    for (const label of groupOrderList) {
        const itemsForLabel = groupMap.get(label);
        if (itemsForLabel && itemsForLabel.length > 0) {
            ordered.push(label);
            seen.add(label);
        }
    }
    const leftover = labels.filter((label) => !seen.has(label));
    return [...ordered, ...pinOtherLast(leftover)];
}

/**
 * @returns {Map<string, unknown[]> | null}
 */
function groupItems(items, groupByField) {
    if (!groupByField || typeof groupByField !== "string" || groupByField.trim().length === 0) {
        return null;
    }
    const field = groupByField.trim();
    const map = new Map();
    for (const item of items) {
        const raw = item.fields[field];
        const key = typeof raw === "string" && raw.trim().length > 0 ? raw.trim() : OTHER_GROUP_LABEL;
        const existing = map.get(key) ?? [];
        existing.push(item);
        map.set(key, existing);
    }
    return map;
}

function buildItemMarkup(item, config, referencedImages) {
    const title = item.fields[config.titleField] ?? "";
    const slug = item.fields[config.slugField] ?? "";
    const itemFileName = item._sourceFile ?? "unknown-item.md";
    const searchText = buildSearchText(item, config);
    const metadataValues = config.metadata
        .map((field) => item.fields[field]?.trim() ?? "")
        .filter((value) => value.length > 0);
    const metadataMarkup = metadataValues.length > 0 ? `<p>${metadataValues.map((value) => escapeHtml(value)).join(" · ")}</p>` : "";

    const sectionsMarkup = config.sections
        .map((sectionName) => {
            const content = item.sections[sectionName]?.trim();
            if (!content) {
                return "";
            }

            const label = toHeadingLabel(sectionName);
            const bodyHtml = sectionBodyToHtml(content, itemFileName, referencedImages);
            return [
                `<h4>${escapeHtml(label)}</h4>`,
                "<div>",
                indentLines(bodyHtml, 4),
                "</div>"
            ].join("\n");
        })
        .filter((section) => section.length > 0)
        .join("\n");

    const detailChildren = indentLines([metadataMarkup, sectionsMarkup].filter((value) => value.length > 0).join("\n"), 8);

    return [
        `<li class="catalog-list-item" id="${escapeHtml(slug)}" data-catalog-item data-search="${escapeHtml(searchText)}">`,
        '    <details class="catalog-item">',
        '        <summary class="catalog-item-toggle">',
        `            <h3 class="catalog-item-title">${escapeHtml(title)}</h3>`,
        "        </summary>",
        '        <div class="catalog-item-detail">',
        detailChildren,
        "        </div>",
        "    </details>",
        "</li>"
    ].join("\n");
}

async function buildSite() {
    const rawConfig = await fs.readFile(indexConfigPath, "utf-8");
    const { metadata: config, body: description } = parseFrontmatter(rawConfig, "content/index.md");

    const title = readRequiredConfigField(config, "title");
    const itemNamePlural = readRequiredConfigField(config, "itemNamePlural");
    const source = readRequiredConfigField(config, "source");
    const titleField = readRequiredConfigField(config, "titleField");
    const slugField = readRequiredConfigField(config, "slugField");
    const requiredFields = parseCsvList(config.requiredFields);
    const searchFields = parseCsvList(config.searchFields);
    const sections = parseCsvList(config.sections);
    const metadata = parseCsvList(config.metadata);
    const groupByRaw = typeof config.groupBy === "string" ? config.groupBy.trim() : "";
    const groupByField = groupByRaw.length > 0 ? groupByRaw : null;
    const groupOrderList = groupByField ? parseCsvList(config.groupOrder) : [];

    const sourceDirectory = path.resolve(repoRoot, source);
    const files = await fs.readdir(sourceDirectory);
    const markdownFiles = files.filter((fileName) => fileName.toLowerCase().endsWith(".md")).sort((a, b) => a.localeCompare(b));
    if (markdownFiles.length === 0) {
        throw new Error(`No markdown items found in ${source}`);
    }

    const fieldNames = new Set([titleField, slugField, ...metadata, ...requiredFields]);
    if (groupByField) {
        fieldNames.add(groupByField);
    }

    const items = [];
    for (const fileName of markdownFiles) {
        const markdown = await fs.readFile(path.join(sourceDirectory, fileName), "utf-8");
        const { metadata: frontmatter, body } = parseFrontmatter(markdown, fileName);
        const parsedSections = parseSections(body, sections);
        const fields = {};
        for (const fieldName of fieldNames) {
            fields[fieldName] = frontmatter[fieldName] ?? null;
        }

        const item = { fields, sections: parsedSections };
        for (const requiredField of requiredFields) {
            if (!itemHasRequiredField(item, requiredField)) {
                throw new Error(`Item ${fileName} is missing required field "${requiredField}"`);
            }
        }
        items.push({ ...item, _sourceFile: fileName });
    }

    items.sort((left, right) => (left.fields[titleField] ?? "").localeCompare(right.fields[titleField] ?? ""));

    const itemConfig = { titleField, slugField, metadata, sections, searchFields };
    const referencedImages = new Set();

    const groupMap = groupItems(items, groupByField);
    let indexNav = "";
    let groupsMarkup = "";

    if (groupMap) {
        const orderedLabels = orderGroupLabels(groupMap, groupOrderList);
        assertUniqueGroupSlugs(orderedLabels);

        indexNav = orderedLabels
            .map((label) => {
                const slug = slugifyGroupLabel(label);
                return `            <a class="group-button" href="#group-${escapeHtml(slug)}" data-group="${escapeHtml(slug)}">${escapeHtml(label)}</a>`;
            })
            .join("\n");

        groupsMarkup = orderedLabels
            .map((label) => {
                const slug = slugifyGroupLabel(label);
                const itemsForGroup = groupMap.get(label) ?? [];
                const itemMarkup = itemsForGroup.map((item) => buildItemMarkup(item, itemConfig, referencedImages)).join("\n");
                const groupHeadingLabel = escapeHtml(label);
                return [
                    `                <section class="group-section" id="group-${escapeHtml(slug)}" data-group-section="${escapeHtml(slug)}">`,
                    `                    <div class="group-heading">`,
                    `                        <h2>${groupHeadingLabel}</h2>`,
                    `                        <div class="group-controls">`,
                    `                            <button type="button" data-expand-group="${escapeHtml(slug)}" aria-label="Expand ${groupHeadingLabel}">Expand</button>`,
                    `                            <button type="button" data-collapse-group="${escapeHtml(slug)}" aria-label="Collapse ${groupHeadingLabel}">Collapse</button>`,
                    `                        </div>`,
                    `                    </div>`,
                    '                    <ul class="catalog-list">',
                    indentLines(itemMarkup, 24),
                    "                    </ul>",
                    "                </section>"
                ].join("\n");
            })
            .join("\n");
    } else {
        const itemMarkup = items.map((item) => buildItemMarkup(item, itemConfig, referencedImages)).join("\n");
        groupsMarkup = [
            "                <ul class=\"catalog-list\">",
            indentLines(itemMarkup, 16),
            "                </ul>"
        ].join("\n");
    }

    const descriptionMarkup = description.length > 0 ? `        <p>${escapeHtml(description)}</p>\n` : "";
    const catalogToolbarMarkup = `        <div class="catalog-toolbar">
            <div class="catalog-toolbar-search">
                <input id="search-input" type="search" autocomplete="off" placeholder="Search ${escapeHtml(itemNamePlural.toLowerCase())}...">
            </div>
            <div class="catalog-controls" aria-label="Catalog controls">
                <button type="button" data-expand-all>Expand all</button>
                <button type="button" data-collapse-all>Collapse all</button>
            </div>
        </div>
`;
    const navMarkup = groupMap
        ? `        <nav id="group-index" aria-label="Catalog index">
${indexNav}
        </nav>
`
        : "";

    const html = `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light dark">
    <meta name="theme-color" content="#f8f5ef" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#1c1814" media="(prefers-color-scheme: dark)">
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="./styles/site.css">
    <script src="./scripts/search.js" defer></script>
    <script src="./scripts/router.js" defer></script>
    <script src="./scripts/expand-collapse.js" defer></script>
    <script src="./scripts/image-lightbox.js" defer></script>
</head>
<body>
    <main>
        <h1>${escapeHtml(title)}</h1>
${descriptionMarkup}
${catalogToolbarMarkup}        <p id="empty-state" hidden>No ${escapeHtml(itemNamePlural.toLowerCase())} match your search.</p>
${navMarkup}        <section id="catalog-list-view">
            <div id="catalog-groups">
${groupsMarkup}
            </div>
        </section>
    </main>
</body>
</html>
`;

    await fs.mkdir(path.dirname(outputHtmlPath), { recursive: true });
    await fs.mkdir(path.dirname(outputStylesPath), { recursive: true });
    await fs.mkdir(path.dirname(outputSearchScriptPath), { recursive: true });
    await fs.copyFile(sourceStylesPath, outputStylesPath);
    await fs.copyFile(sourceSearchScriptPath, outputSearchScriptPath);
    await fs.copyFile(sourceRouterScriptPath, outputRouterScriptPath);
    await fs.copyFile(sourceExpandCollapseScriptPath, outputExpandCollapseScriptPath);
    await fs.copyFile(sourceImageLightboxScriptPath, outputImageLightboxScriptPath);

    for (const posixRel of referencedImages) {
        const sourcePath = path.join(contentImagesRoot, ...posixRel.split("/"));
        const destPath = path.join(distDirectory, "images", ...posixRel.split("/"));
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.copyFile(sourcePath, destPath);
    }

    await fs.writeFile(outputHtmlPath, html, "utf-8");
    console.log(`Wrote static catalog HTML to ${outputHtmlPath}`);
}

await buildSite();
