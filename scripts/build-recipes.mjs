import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const recipesDirectory = path.join(repoRoot, "content", "recipes");
const outputPath = path.join(repoRoot, "wwwroot", "data", "recipes.json");

const requiredFields = ["title", "slug", "ingredients", "execution"];
const sectionToField = new Map([
    ["introduction", "introduction"],
    ["objective", "objective"],
    ["ingredients", "ingredients"],
    ["preparation", "preparation"],
    ["execution", "execution"],
    ["reflection", "reflection"],
    ["variation", "variation"]
]);

function parseFrontmatter(markdown, filePath) {
    if (!markdown.startsWith("---\n")) {
        throw new Error(`Missing frontmatter in ${filePath}`);
    }

    const endIndex = markdown.indexOf("\n---\n", 4);
    if (endIndex < 0) {
        throw new Error(`Unterminated frontmatter in ${filePath}`);
    }

    const frontmatterRaw = markdown.slice(4, endIndex).trim();
    const body = markdown.slice(endIndex + 5);
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

function parseSections(body) {
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
        const sectionName = current.heading.toLowerCase();
        const mappedField = sectionToField.get(sectionName);

        if (!mappedField) {
            continue;
        }

        const contentEnd = next ? next.index : normalizedBody.length;
        const content = normalizedBody.slice(current.end, contentEnd).trim();
        sections[mappedField] = content.length === 0 ? null : content;
    }

    return sections;
}

function assertRequired(recipe, filePath) {
    for (const field of requiredFields) {
        const value = recipe[field];
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new Error(`Recipe ${filePath} is missing required field "${field}"`);
        }
    }
}

async function buildRecipes() {
    const files = await fs.readdir(recipesDirectory);
    const markdownFiles = files
        .filter((fileName) => fileName.toLowerCase().endsWith(".md"))
        .sort((left, right) => left.localeCompare(right));

    if (markdownFiles.length === 0) {
        throw new Error("No markdown recipes found in content/recipes");
    }

    const recipes = [];
    for (const fileName of markdownFiles) {
        const filePath = path.join(recipesDirectory, fileName);
        const markdown = await fs.readFile(filePath, "utf-8");
        const { metadata, body } = parseFrontmatter(markdown, fileName);
        const sections = parseSections(body);

        const recipe = {
            title: metadata.title ?? null,
            slug: metadata.slug ?? null,
            category: metadata.category ?? null,
            difficulty: metadata.difficulty ?? null,
            timeEstimate: metadata.timeEstimate ?? null,
            source: metadata.source ?? null,
            introduction: sections.introduction ?? null,
            objective: sections.objective ?? null,
            ingredients: sections.ingredients ?? null,
            preparation: sections.preparation ?? null,
            execution: sections.execution ?? null,
            reflection: sections.reflection ?? null,
            variation: sections.variation ?? null
        };

        assertRequired(recipe, fileName);
        recipes.push(recipe);
    }

    recipes.sort((left, right) => left.title.localeCompare(right.title));
    const withDeterministicIds = recipes.map((recipe, index) => ({ id: index + 1, ...recipe }));

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, `${JSON.stringify(withDeterministicIds, null, 2)}\n`, "utf-8");
    console.log(`Wrote ${withDeterministicIds.length} recipes to ${outputPath}`);
}

await buildRecipes();
