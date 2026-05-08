import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const indexConfigPath = path.join(repoRoot, "content", "index.md");
const outputHtmlPath = path.join(repoRoot, "wwwroot", "index.html");

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
        .join("");
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
    const metadataValues = config.metadata
        .map((field) => item.fields[field]?.trim() ?? "")
        .filter((value) => value.length > 0);
    const metadataMarkup =
        metadataValues.length > 0 ? `<p>${metadataValues.map((value) => escapeHtml(value)).join(" · ")}</p>` : "";

    const sectionsMarkup = config.sections
        .map((sectionName) => {
            const content = item.sections[sectionName]?.trim();
            if (!content) {
                return "";
            }

            const label = toHeadingLabel(sectionName);
            return `<h4>${escapeHtml(label)}</h4><div>${toMultilineParagraphs(content)}</div>`;
        })
        .join("");

    return `<li class="recipe-list-item" id="${escapeHtml(slug)}"><details class="catalog-item"><summary class="recipe-button"><h3 class="recipe-title">${escapeHtml(
        title
    )}</h3></summary><div class="recipe-inline-detail">${metadataMarkup}${sectionsMarkup}</div></details></li>`;
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
    const initials = [...grouped.keys()].sort((left, right) => left.localeCompare(right));

    const indexNav = initials
        .map((initial) => `<a class="letter-index-button" href="#letter-${encodeURIComponent(initial)}">${escapeHtml(initial)}</a>`)
        .join("");

    const groupsMarkup = initials
        .map((initial) => {
            const itemsForInitial = grouped.get(initial) ?? [];
            const itemMarkup = itemsForInitial.map((item) => buildItemMarkup(item, { titleField, slugField, metadata, sections })).join("");
            return `<section class="category-section" id="letter-${encodeURIComponent(initial)}"><h2>${escapeHtml(initial)}</h2><ul class="recipe-list">${itemMarkup}</ul></section>`;
        })
        .join("");

    const descriptionMarkup = description.length > 0 ? `<p>${escapeHtml(description)}</p>` : "";

    const html = `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="./styles/site.css">
</head>
<body>
    <main>
        <h1>${escapeHtml(title)}</h1>
        ${descriptionMarkup}
        <p id="status">${items.length} ${escapeHtml(itemNamePlural.toLowerCase())}</p>
        <nav id="letter-index" aria-label="Catalog index">${indexNav}</nav>
        <section id="recipe-list-view">
            <div id="recipe-groups">${groupsMarkup}</div>
        </section>
    </main>
</body>
</html>
`;

    await fs.mkdir(path.dirname(outputHtmlPath), { recursive: true });
    await fs.writeFile(outputHtmlPath, html, "utf-8");
    console.log(`Wrote static catalog HTML to ${outputHtmlPath}`);
}

await buildSite();
