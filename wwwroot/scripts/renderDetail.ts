import { normalizeCategory } from "./filters.js";
import type { Recipe } from "./types.js";

function appendMultilineText(parent: HTMLElement, text: string): void {
    const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    for (const line of lines) {
        const lineElement = document.createElement("p");
        lineElement.className = "text-block-line";
        lineElement.textContent = line;
        parent.appendChild(lineElement);
    }
}

export function renderRecipeDetail(container: HTMLElement, recipe: Recipe): void {
    container.replaceChildren();

    const title = document.createElement("h2");
    title.textContent = recipe.title;

    const meta = document.createElement("p");
    const metaParts: string[] = [normalizeCategory(recipe.category)];

    if (recipe.servings) {
        metaParts.push(`${recipe.servings} servings`);
    }
    if (recipe.prepMinutes) {
        metaParts.push(`${recipe.prepMinutes} min prep`);
    }
    if (recipe.cookMinutes) {
        metaParts.push(`${recipe.cookMinutes} min cook`);
    }

    meta.textContent = metaParts.join(" · ");
    container.append(title, meta);

    if (recipe.description) {
        const description = document.createElement("p");
        description.textContent = recipe.description;
        container.appendChild(description);
    }

    const ingredientsHeading = document.createElement("h3");
    ingredientsHeading.textContent = "Ingredients";
    const ingredientsBlock = document.createElement("div");
    appendMultilineText(ingredientsBlock, recipe.ingredients);

    const instructionsHeading = document.createElement("h3");
    instructionsHeading.textContent = "Instructions";
    const instructionsBlock = document.createElement("div");
    appendMultilineText(instructionsBlock, recipe.instructions);

    container.append(ingredientsHeading, ingredientsBlock, instructionsHeading, instructionsBlock);

    if (recipe.source) {
        const source = document.createElement("p");
        source.textContent = `Source: ${recipe.source}`;
        container.appendChild(source);
    }
}
