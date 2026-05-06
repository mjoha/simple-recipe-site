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

export function renderInlineRecipeDetail(container: HTMLElement, recipe: Recipe): void {
    const detail = document.createElement("div");
    detail.className = "recipe-inline-detail";
    detail.id = `recipe-expanded-${recipe.id}`;



    const meta = document.createElement("p");
    const metaParts: string[] = [];

    if (recipe.category?.trim()) {
        metaParts.push(recipe.category.trim());
    }

    if (recipe.servings) {
        metaParts.push(`${recipe.servings} servings`);
    }
    if (recipe.prepMinutes) {
        metaParts.push(`${recipe.prepMinutes} min prep`);
    }
    if (recipe.cookMinutes) {
        metaParts.push(`${recipe.cookMinutes} min cook`);
    }

    if (metaParts.length > 0) {
        meta.textContent = metaParts.join(" · ");
        detail.append(meta);
    }



    if (recipe.description) {
        const description = document.createElement("p");
        description.textContent = recipe.description;
        detail.appendChild(description);
    }

    const ingredientsHeading = document.createElement("h4");
    ingredientsHeading.textContent = "Ingredients";
    const ingredientsBlock = document.createElement("div");
    appendMultilineText(ingredientsBlock, recipe.ingredients);

    const instructionsHeading = document.createElement("h4");
    instructionsHeading.textContent = "Instructions";
    const instructionsBlock = document.createElement("div");
    appendMultilineText(instructionsBlock, recipe.instructions);

    detail.append(ingredientsHeading, ingredientsBlock, instructionsHeading, instructionsBlock);

    if (recipe.source) {
        const source = document.createElement("p");
        source.textContent = `Source: ${recipe.source}`;
        detail.appendChild(source);
    }

    container.appendChild(detail);
}
