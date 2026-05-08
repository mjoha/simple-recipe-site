import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const indexConfigPath = path.join(repoRoot, "content", "index.md");

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

    return value.split(",").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
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
        sections[sectionName] = content.length === 0 ? null : content;
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

function assertRequiredItemFields(item, requiredFields, fileName) {
    for (const field of requiredFields) {
        const inFields = item.fields[field];
        const inSections = item.sections[field];
        const candidate = typeof inFields === "string" && inFields.trim().length > 0 ? inFields : inSections;
        if (typeof candidate !== "string" || candidate.trim().length === 0) {
            throw new Error(`Item ${fileName} is missing required field "${field}"`);
        }
    }
}

async function buildIndex() {
    const rawConfig = await fs.readFile(indexConfigPath, "utf-8");
    const { metadata: config, body: description } = parseFrontmatter(rawConfig, "content/index.md");

    const source = readRequiredConfigField(config, "source");
    const output = readRequiredConfigField(config, "output");
    const title = readRequiredConfigField(config, "title");
    const itemName = readRequiredConfigField(config, "itemName");
    const itemNamePlural = readRequiredConfigField(config, "itemNamePlural");
    const titleField = readRequiredConfigField(config, "titleField");
    const slugField = readRequiredConfigField(config, "slugField");

    const requiredFields = parseCsvList(config.requiredFields);
    const searchFields = parseCsvList(config.searchFields);
    const sections = parseCsvList(config.sections);
    const metadataFields = parseCsvList(config.metadata);

    const sourceDirectory = path.resolve(repoRoot, source);
    const outputPath = path.resolve(repoRoot, output);

    const files = await fs.readdir(sourceDirectory);
    const markdownFiles = files.filter((fileName) => fileName.toLowerCase().endsWith(".md")).sort((a, b) => a.localeCompare(b));

    if (markdownFiles.length === 0) {
        throw new Error(`No markdown items found in ${source}`);
    }

    const items = [];
    for (const fileName of markdownFiles) {
        const absolutePath = path.join(sourceDirectory, fileName);
        const markdown = await fs.readFile(absolutePath, "utf-8");
        const { metadata, body } = parseFrontmatter(markdown, fileName);
        const parsedSections = parseSections(body, sections);

        const fields = {};
        const fieldNames = new Set([titleField, slugField, ...metadataFields, ...searchFields, ...requiredFields]);
        for (const fieldName of fieldNames) {
            fields[fieldName] = metadata[fieldName] ?? null;
        }

        const item = { fields, sections: parsedSections };
        assertRequiredItemFields(item, requiredFields, fileName);
        items.push(item);
    }

    items.sort((left, right) => (left.fields[titleField] ?? "").localeCompare(right.fields[titleField] ?? ""));
    const withIds = items.map((item, index) => ({ id: index + 1, ...item }));

    const indexData = {
        title,
        itemName,
        itemNamePlural,
        description: description.length > 0 ? description : null,
        titleField,
        slugField,
        searchFields,
        sections,
        metadata: metadataFields,
        items: withIds
    };

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, `${JSON.stringify(indexData, null, 2)}\n`, "utf-8");
    console.log(`Wrote ${withIds.length} items to ${outputPath}`);
}

await buildIndex();
