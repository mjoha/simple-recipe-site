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

    const title = document.createElement("h3");
    title.textContent = recipe.title;
    detail.appendChild(title);

    const meta = document.createElement("p");
    const metaParts: string[] = [];

    if (recipe.category?.trim()) {
        metaParts.push(recipe.category.trim());
    }

    if (recipe.difficulty?.trim()) {
        metaParts.push(recipe.difficulty.trim());
    }
    if (recipe.timeEstimate?.trim()) {
        metaParts.push(recipe.timeEstimate.trim());
    }

    if (metaParts.length > 0) {
        meta.textContent = metaParts.join(" · ");
        detail.append(meta);
    }

    if (recipe.introduction) {
        const introduction = document.createElement("p");
        introduction.textContent = recipe.introduction;
        detail.appendChild(introduction);
    }

    if (recipe.objective) {
        const objectiveHeading = document.createElement("h4");
        objectiveHeading.textContent = "Objective";
        const objectiveText = document.createElement("p");
        objectiveText.textContent = recipe.objective;
        detail.append(objectiveHeading, objectiveText);
    }

    const ingredientsHeading = document.createElement("h4");
    ingredientsHeading.textContent = "Ingredients";
    const ingredientsBlock = document.createElement("div");
    appendMultilineText(ingredientsBlock, recipe.ingredients);

    let preparationHeading: HTMLElement | null = null;
    let preparationBlock: HTMLElement | null = null;
    if (recipe.preparation) {
        preparationHeading = document.createElement("h4");
        preparationHeading.textContent = "Preparation";
        preparationBlock = document.createElement("div");
        appendMultilineText(preparationBlock, recipe.preparation);
    }

    const executionHeading = document.createElement("h4");
    executionHeading.textContent = "Execution";
    const executionBlock = document.createElement("div");
    appendMultilineText(executionBlock, recipe.execution);

    detail.append(ingredientsHeading, ingredientsBlock);
    if (preparationHeading && preparationBlock) {
        detail.append(preparationHeading, preparationBlock);
    }
    detail.append(executionHeading, executionBlock);

    if (recipe.reflection) {
        const reflectionHeading = document.createElement("h4");
        reflectionHeading.textContent = "Reflection";
        const reflectionBlock = document.createElement("div");
        appendMultilineText(reflectionBlock, recipe.reflection);
        detail.append(reflectionHeading, reflectionBlock);
    }

    if (recipe.variation) {
        const variationHeading = document.createElement("h4");
        variationHeading.textContent = "Variation";
        const variationBlock = document.createElement("div");
        appendMultilineText(variationBlock, recipe.variation);
        detail.append(variationHeading, variationBlock);
    }

    if (recipe.source) {
        const source = document.createElement("p");
        source.textContent = `Source: ${recipe.source}`;
        detail.appendChild(source);
    }

    container.appendChild(detail);
}
