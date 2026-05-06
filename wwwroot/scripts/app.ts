import { fetchRecipes } from "./api.js";
import { getAppElements } from "./dom.js";
import { matchesSearch } from "./filters.js";
import { renderRecipeGroups } from "./renderList.js";
import { clearRecipeUrl, onRecipeUrlChange, readSelectedRecipeId, replaceRecipeUrlWithIndex, writeRecipeUrl } from "./router.js";
import type { Recipe } from "./types.js";

const appElements = getAppElements();

if (!appElements) {
    throw new Error("Missing required DOM elements.");
}
const elements = appElements;

let allRecipes: Recipe[] = [];
let currentSearchQuery = "";
let expandedRecipeIds = new Set<number>();

function renderIndexState(statusOverride?: string): void {
    const filteredRecipes = allRecipes.filter((recipe) => matchesSearch(recipe, currentSearchQuery));
    const filteredRecipeIds = new Set(filteredRecipes.map((recipe) => recipe.id));
    expandedRecipeIds = new Set([...expandedRecipeIds].filter((recipeId) => filteredRecipeIds.has(recipeId)));

    renderRecipeGroups({
        container: elements.recipeGroups,
        letterIndex: elements.letterIndex,
        recipes: filteredRecipes,
        expandedRecipeIds,
        onToggleRecipe: (recipeId) => {
            if (expandedRecipeIds.has(recipeId)) {
                expandedRecipeIds.delete(recipeId);
                if (readSelectedRecipeId() === recipeId) {
                    clearRecipeUrl();
                }
                renderIndexState();
                return;
            }

            expandedRecipeIds.add(recipeId);
            writeRecipeUrl(recipeId);
            renderIndexState();
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

function scrollToRecipe(recipeId: number): void {
    requestAnimationFrame(() => {
        document.getElementById(`recipe-${recipeId}`)?.scrollIntoView({ block: "start" });
    });
}

function renderFromUrl(options: { scrollToRecipe: boolean } = { scrollToRecipe: false }): void {
    const selectedRecipeId = readSelectedRecipeId();

    if (selectedRecipeId === null) {
        expandedRecipeIds = new Set();
        renderIndexState();
        return;
    }

    const selectedRecipe = allRecipes.find((recipe) => recipe.id === selectedRecipeId);

    if (!selectedRecipe) {
        replaceRecipeUrlWithIndex();
        expandedRecipeIds = new Set();
        renderIndexState("Recipe not found.");
        return;
    }

    expandedRecipeIds = new Set([selectedRecipe.id]);
    renderIndexState();

    if (options.scrollToRecipe) {
        scrollToRecipe(selectedRecipe.id);
    }
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
                clearRecipeUrl();
            }

            renderIndexState();
        });

        onRecipeUrlChange(() => {
            renderFromUrl();
        });

        renderFromUrl({ scrollToRecipe: readSelectedRecipeId() !== null });
    } catch {
        elements.status.textContent = "Could not load recipes.";
    }
}

void loadRecipes();
