import { fetchRecipes } from "./api.js";
import { getAppElements } from "./dom.js";
import { matchesSearch } from "./filters.js";
import { renderRecipeGroups } from "./renderList.js";
import { clearRecipeHash, onHashChange, readSelectedRecipeId, writeRecipeHash } from "./router.js";
import type { Recipe } from "./types.js";

const appElements = getAppElements();

if (!appElements) {
    throw new Error("Missing required DOM elements.");
}
const elements = appElements;

let allRecipes: Recipe[] = [];
let currentSearchQuery = "";

function renderIndexState(statusOverride?: string): void {
    const filteredRecipes = allRecipes.filter((recipe) => matchesSearch(recipe, currentSearchQuery));
    const selectedRecipeId = readSelectedRecipeId();
    const expandedRecipeId = filteredRecipes.some((recipe) => recipe.id === selectedRecipeId) ? selectedRecipeId : null;

    renderRecipeGroups({
        container: elements.recipeGroups,
        letterIndex: elements.letterIndex,
        recipes: filteredRecipes,
        expandedRecipeId,
        onToggleRecipe: (recipeId) => {
            if (readSelectedRecipeId() === recipeId) {
                clearRecipeHash();
                return;
            }
            writeRecipeHash(recipeId);
        }
    });

    if (statusOverride) {
        elements.emptyState.hidden = filteredRecipes.length !== 0;
        elements.status.textContent = statusOverride;
    } else if (filteredRecipes.length === 0) {
        elements.emptyState.hidden = false;
        elements.status.textContent = "";
    } else {
        elements.emptyState.hidden = true;
        elements.status.textContent = `${filteredRecipes.length} recipe${filteredRecipes.length === 1 ? "" : "s"} found`;
    }

    elements.recipeListView.hidden = false;
    elements.searchInput.hidden = false;
}

function renderFromHash(): void {
    const selectedRecipeId = readSelectedRecipeId();

    if (selectedRecipeId === null) {
        renderIndexState();
        return;
    }

    const selectedRecipe = allRecipes.find((recipe) => recipe.id === selectedRecipeId);

    if (!selectedRecipe) {
        clearRecipeHash();
        renderIndexState("Recipe not found.");
        return;
    }

    renderIndexState();
}

async function loadRecipes(): Promise<void> {
    elements.status.textContent = "Loading recipes...";

    try {
        allRecipes = await fetchRecipes();
        currentSearchQuery = "";
        elements.searchInput.value = "";

        if (allRecipes.length === 0) {
            elements.status.textContent = "No recipes found.";
            return;
        }

        elements.searchInput.addEventListener("input", () => {
            currentSearchQuery = elements.searchInput.value;
            const selectedRecipeId = readSelectedRecipeId();
            if (selectedRecipeId !== null && !allRecipes.some((recipe) => recipe.id === selectedRecipeId && matchesSearch(recipe, currentSearchQuery))) {
                clearRecipeHash();
                return;
            }

            renderIndexState();
        });

        onHashChange(() => {
            renderFromHash();
        });

        renderFromHash();
    } catch {
        elements.status.textContent = "Could not load recipes.";
    }
}

void loadRecipes();
