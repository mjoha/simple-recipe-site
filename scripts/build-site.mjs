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
const outputStylesPath = path.join(distDirectory, "styles", "site.css");
const outputSearchScriptPath = path.join(distDirectory, "scripts", "search.js");
const outputRouterScriptPath = path.join(distDirectory, "scripts", "router.js");

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

function toMultilineParagraphs(text) {
    if (!text) {
        return "";
    }

    return text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => `<p class="text-block-line">${escapeHtml(line)}</p>`)
        .join("\n");
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

function buildItemMarkup(item, config) {
    const title = item.fields[config.titleField] ?? "";
    const slug = item.fields[config.slugField] ?? "";
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
            return [
                `<h4>${escapeHtml(label)}</h4>`,
                "<div>",
                indentLines(toMultilineParagraphs(content), 4),
                "</div>"
            ].join("\n");
        })
        .filter((section) => section.length > 0)
        .join("\n");

    const detailChildren = indentLines([metadataMarkup, sectionsMarkup].filter((value) => value.length > 0).join("\n"), 8);

    return [
        `<li class="catalog-list-item" id="${escapeHtml(slug)}" data-catalog-item data-search="${escapeHtml(searchText)}">`,
        "    <details class=\"catalog-item\">",
        "        <summary class=\"catalog-item-toggle\">",
        `            <h3 class="catalog-item-title">${escapeHtml(title)}</h3>`,
        "        </summary>",
        "        <div class=\"catalog-item-detail\">",
        detailChildren,
        "        </div>",
        "    </details>",
        "</li>"
    ].join("\n");
}

function groupByInitial(items, titleField) {
    const groups = new Map();
    for (const item of items) {
        const title = (item.fields[titleField] ?? "").trim();
        const first = title.length > 0 ? title[0].toUpperCase() : "#";
        const initial = /^[\p{L}\p{N}]$/u.test(first) ? first : "#";
        const existing = groups.get(initial) ?? [];
        existing.push(item);
        groups.set(initial, existing);
    }
    return groups;
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

    const sourceDirectory = path.resolve(repoRoot, source);
    const files = await fs.readdir(sourceDirectory);
    const markdownFiles = files.filter((fileName) => fileName.toLowerCase().endsWith(".md")).sort((a, b) => a.localeCompare(b));
    if (markdownFiles.length === 0) {
        throw new Error(`No markdown items found in ${source}`);
    }

    const items = [];
    for (const fileName of markdownFiles) {
        const markdown = await fs.readFile(path.join(sourceDirectory, fileName), "utf-8");
        const { metadata: frontmatter, body } = parseFrontmatter(markdown, fileName);
        const parsedSections = parseSections(body, sections);
        const fields = {};
        const fieldNames = new Set([titleField, slugField, ...metadata, ...requiredFields]);
        for (const fieldName of fieldNames) {
            fields[fieldName] = frontmatter[fieldName] ?? null;
        }

        const item = { fields, sections: parsedSections };
        for (const requiredField of requiredFields) {
            if (!itemHasRequiredField(item, requiredField)) {
                throw new Error(`Item ${fileName} is missing required field "${requiredField}"`);
            }
        }
        items.push(item);
    }

    items.sort((left, right) => (left.fields[titleField] ?? "").localeCompare(right.fields[titleField] ?? ""));
    const grouped = groupByInitial(items, titleField);
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const availableLetters = new Set(alphabet.filter((letter) => grouped.has(letter)));

    const indexNav = alphabet
        .map((letter) => {
            if (!availableLetters.has(letter)) {
                return `            <span class="letter-index-button letter-index-button-disabled" aria-disabled="true" data-letter="${letter}">${letter}</span>`;
            }

            return `            <a class="letter-index-button" href="#letter-${letter}" data-letter="${letter}">${letter}</a>`;
        })
        .join("\n");

    const groupsMarkup = alphabet
        .filter((letter) => availableLetters.has(letter))
        .map((letter) => {
            const itemsForInitial = grouped.get(letter) ?? [];
            const itemMarkup = itemsForInitial
                .map((item) => buildItemMarkup(item, { titleField, slugField, metadata, sections, searchFields }))
                .join("\n");
            return [
                `                <section class="letter-section" id="letter-${letter}" data-letter-section="${letter}">`,
                `                    <h2>${letter}</h2>`,
                "                    <ul class=\"catalog-list\">",
                indentLines(itemMarkup, 24),
                "                    </ul>",
                "                </section>"
            ].join("\n");
        })
        .join("\n");

    const descriptionMarkup = description.length > 0 ? `        <p>${escapeHtml(description)}</p>\n` : "";

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
</head>
<body>
    <main>
        <h1>${escapeHtml(title)}</h1>
${descriptionMarkup}
        <input id="search-input" type="search" autocomplete="off" placeholder="Search ${escapeHtml(itemNamePlural.toLowerCase())}...">
        <p id="empty-state" hidden>No ${escapeHtml(itemNamePlural.toLowerCase())} match your search.</p>
        <nav id="letter-index" aria-label="Catalog index">
${indexNav}
        </nav>
        <section id="catalog-list-view">
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
    await fs.writeFile(outputHtmlPath, html, "utf-8");
    console.log(`Wrote static catalog HTML to ${outputHtmlPath}`);
}

await buildSite();
