import { groupRecipesByInitial, sortedInitialKeys } from "./filters.js";
import { renderInlineRecipeDetail } from "./renderDetail.js";
import type { Recipe } from "./types.js";

type RenderListArgs = {
    container: HTMLElement;
    letterIndex: HTMLElement;
    recipes: Recipe[];
    expandedRecipeIds: ReadonlySet<number>;
    onToggleRecipe: (recipeId: number) => void;
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function renderRecipeListItem(
    recipe: Recipe,
    expandedRecipeIds: ReadonlySet<number>,
    onToggleRecipe: (recipeId: number) => void
): HTMLLIElement {
    const listItem = document.createElement("li");
    listItem.className = "recipe-list-item";
    listItem.id = `recipe-${recipe.id}`;
    const button = document.createElement("div");
    button.className = "recipe-button";
    button.addEventListener("click", () => onToggleRecipe(recipe.id));

    const title = document.createElement("h3");
    title.className = "recipe-title";
    title.textContent = recipe.title;

    button.appendChild(title);
    listItem.appendChild(button);

    if (expandedRecipeIds.has(recipe.id)) {
        listItem.classList.add("recipe-list-item-expanded");
        renderInlineRecipeDetail(listItem, recipe);
    }

    return listItem;
}

export function renderRecipeGroups({ container, letterIndex, recipes, expandedRecipeIds, onToggleRecipe }: RenderListArgs): void {
    container.replaceChildren();
    letterIndex.replaceChildren();
    const recipesByInitial = groupRecipesByInitial(recipes);
    const initials = sortedInitialKeys(recipesByInitial);

    const availableInitials = new Set(initials);

    for (const letter of ALPHABET) {
        const letterButton = document.createElement("div");
        letterButton.className = "letter-index-button";
        letterButton.textContent = letter;

        if (!availableInitials.has(letter)) {
            letterButton.style.opacity = "0.45";
            letterButton.style.cursor = "default";
        } else {
            letterButton.addEventListener("click", () => {
                document.getElementById(`initial-${letter}`)?.scrollIntoView({ block: "start" });
            });
        }

        letterIndex.appendChild(letterButton);
    }

    for (const initial of initials) {
        const initialSection = document.createElement("section");
        initialSection.className = "category-section";
        initialSection.id = `initial-${initial}`;

        const heading = document.createElement("h2");
        heading.textContent = initial;

        const list = document.createElement("ul");
        list.className = "recipe-list";

        const initialRecipes = recipesByInitial.get(initial) ?? [];
        initialRecipes.sort((left, right) => left.title.localeCompare(right.title));

        for (const recipe of initialRecipes) {
            list.appendChild(renderRecipeListItem(recipe, expandedRecipeIds, onToggleRecipe));
        }

        initialSection.append(heading, list);
        container.appendChild(initialSection);
    }
}
