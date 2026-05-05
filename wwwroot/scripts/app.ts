import { fetchRecipes } from "./api.js";
import { getAppElements } from "./dom.js";
import { matchesSearch } from "./filters.js";
import { renderRecipeDetail } from "./renderDetail.js";
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

function renderListState(statusOverride?: string): void {
    const filteredRecipes = allRecipes.filter((recipe) => matchesSearch(recipe, currentSearchQuery));

    renderRecipeGroups({
        container: elements.recipeGroups,
        recipes: filteredRecipes,
        onSelectRecipe: (recipeId) => writeRecipeHash(recipeId)
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
    elements.recipeDetailView.hidden = true;
    elements.searchInput.hidden = false;
}

function renderDetailState(recipe: Recipe): void {
    renderRecipeDetail(elements.recipeDetail, recipe);
    elements.recipeListView.hidden = true;
    elements.recipeDetailView.hidden = false;
    elements.searchInput.hidden = true;
    elements.status.textContent = "";
}

function renderFromHash(): void {
    const selectedRecipeId = readSelectedRecipeId();

    if (selectedRecipeId === null) {
        renderListState();
        return;
    }

    const selectedRecipe = allRecipes.find((recipe) => recipe.id === selectedRecipeId);

    if (!selectedRecipe) {
        renderListState("Recipe not found.");
        return;
    }

    renderDetailState(selectedRecipe);
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
            if (readSelectedRecipeId() !== null) {
                clearRecipeHash();
                return;
            }

            renderListState();
        });

        elements.backButton.addEventListener("click", () => {
            clearRecipeHash();
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
