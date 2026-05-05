import { normalizeCategory, sortedCategoryKeys } from "./filters.js";
import type { Recipe } from "./types.js";

type RenderListArgs = {
    container: HTMLElement;
    recipes: Recipe[];
    onSelectRecipe: (recipeId: number) => void;
};

function renderRecipeListItem(recipe: Recipe, onSelectRecipe: (recipeId: number) => void): HTMLLIElement {
    const listItem = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "recipe-button";
    button.addEventListener("click", () => onSelectRecipe(recipe.id));

    const title = document.createElement("p");
    title.className = "recipe-title";
    title.textContent = recipe.title;

    button.appendChild(title);
    listItem.appendChild(button);
    return listItem;
}

export function renderRecipeGroups({ container, recipes, onSelectRecipe }: RenderListArgs): void {
    container.replaceChildren();
    const recipesByCategory = new Map<string, Recipe[]>();

    for (const recipe of recipes) {
        const category = normalizeCategory(recipe.category);
        const existing = recipesByCategory.get(category) ?? [];
        existing.push(recipe);
        recipesByCategory.set(category, existing);
    }

    for (const category of sortedCategoryKeys(recipesByCategory)) {
        const categorySection = document.createElement("section");
        categorySection.className = "category-section";

        const heading = document.createElement("h2");
        heading.textContent = category;

        const list = document.createElement("ul");
        list.className = "recipe-list";

        const categoryRecipes = recipesByCategory.get(category) ?? [];
        categoryRecipes.sort((left, right) => left.title.localeCompare(right.title));

        for (const recipe of categoryRecipes) {
            list.appendChild(renderRecipeListItem(recipe, onSelectRecipe));
        }

        categorySection.append(heading, list);
        container.appendChild(categorySection);
    }
}
