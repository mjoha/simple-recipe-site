type Recipe = {
    id: number;
    title: string;
    description: string | null;
    ingredients: string;
    instructions: string;
    category: string | null;
    servings: number | null;
    prepMinutes: number | null;
    cookMinutes: number | null;
    source: string | null;
};

const statusElement = document.getElementById("status");
const searchInputElement = document.getElementById("search-input") as HTMLInputElement | null;
const emptyStateElement = document.getElementById("empty-state");
const recipeGroupsElement = document.getElementById("recipe-groups");
const recipeListViewElement = document.getElementById("recipe-list-view");
const recipeDetailViewElement = document.getElementById("recipe-detail-view");
const recipeDetailElement = document.getElementById("recipe-detail");
const backButtonElement = document.getElementById("back-button");

let allRecipes: Recipe[] = [];
let selectedRecipeId: number | null = null;
let currentSearchQuery = "";

function normalizeCategory(category: string | null): string {
    return category?.trim() || "Uncategorized";
}

function totalTimeText(recipe: Recipe): string | null {
    const total = (recipe.prepMinutes ?? 0) + (recipe.cookMinutes ?? 0);
    return total > 0 ? `${total} min total` : null;
}

function matchesSearch(recipe: Recipe, searchQuery: string): boolean {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (normalizedQuery.length === 0) {
        return true;
    }

    const searchableFields = [
        recipe.title,
        recipe.description ?? "",
        recipe.category ?? "",
        recipe.ingredients,
        recipe.instructions,
        recipe.source ?? ""
    ];

    return searchableFields.some((field) => field.toLowerCase().includes(normalizedQuery));
}

function sortedCategoryKeys(categoryMap: Map<string, Recipe[]>): string[] {
    const categories = [...categoryMap.keys()].sort((left, right) => left.localeCompare(right));
    const uncategorizedIndex = categories.indexOf("Uncategorized");

    if (uncategorizedIndex >= 0) {
        categories.splice(uncategorizedIndex, 1);
        categories.push("Uncategorized");
    }

    return categories;
}

function renderRecipeListItem(recipe: Recipe): HTMLLIElement {
    const listItem = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "recipe-button";
    button.addEventListener("click", () => {
        selectedRecipeId = recipe.id;
        renderApp();
    });

    const title = document.createElement("p");
    title.className = "recipe-title";
    title.textContent = recipe.title;

    button.appendChild(title);

    listItem.appendChild(button);
    return listItem;
}

function appendMultilineText(parent: HTMLElement, text: string): void {
    const lines = text.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);

    for (const line of lines) {
        const lineElement = document.createElement("p");
        lineElement.className = "text-block-line";
        lineElement.textContent = line;
        parent.appendChild(lineElement);
    }
}

function renderRecipeDetail(recipe: Recipe): void {
    if (!recipeDetailElement || !recipeListViewElement || !recipeDetailViewElement || !statusElement || !searchInputElement) {
        return;
    }

    recipeDetailElement.replaceChildren();

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

    recipeDetailElement.append(title, meta);

    if (recipe.description) {
        const description = document.createElement("p");
        description.textContent = recipe.description;
        recipeDetailElement.appendChild(description);
    }

    const ingredientsHeading = document.createElement("h3");
    ingredientsHeading.textContent = "Ingredients";
    const ingredientsBlock = document.createElement("div");
    appendMultilineText(ingredientsBlock, recipe.ingredients);

    const instructionsHeading = document.createElement("h3");
    instructionsHeading.textContent = "Instructions";
    const instructionsBlock = document.createElement("div");
    appendMultilineText(instructionsBlock, recipe.instructions);

    recipeDetailElement.append(ingredientsHeading, ingredientsBlock, instructionsHeading, instructionsBlock);

    if (recipe.source) {
        const source = document.createElement("p");
        source.textContent = `Source: ${recipe.source}`;
        recipeDetailElement.appendChild(source);
    }

    recipeListViewElement.hidden = true;
    recipeDetailViewElement.hidden = false;
    searchInputElement.hidden = true;
    statusElement.textContent = "";
}

function renderRecipeGroups(): void {
    if (!recipeGroupsElement || !emptyStateElement || !statusElement || !recipeListViewElement || !recipeDetailViewElement || !searchInputElement) {
        return;
    }

    const filteredRecipes = allRecipes.filter((recipe) => matchesSearch(recipe, currentSearchQuery));
    recipeGroupsElement.replaceChildren();

    if (filteredRecipes.length === 0) {
        emptyStateElement.hidden = false;
        statusElement.textContent = "";
    } else {
        emptyStateElement.hidden = true;
        statusElement.textContent = `${filteredRecipes.length} recipe${filteredRecipes.length === 1 ? "" : "s"} found`;
    }

    const recipesByCategory = new Map<string, Recipe[]>();

    for (const recipe of filteredRecipes) {
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

        const recipes = recipesByCategory.get(category) ?? [];
        recipes.sort((left, right) => left.title.localeCompare(right.title));

        for (const recipe of recipes) {
            list.appendChild(renderRecipeListItem(recipe));
        }

        categorySection.append(heading, list);
        recipeGroupsElement.appendChild(categorySection);
    }

    recipeListViewElement.hidden = false;
    recipeDetailViewElement.hidden = true;
    searchInputElement.hidden = false;
}

function renderApp(): void {
    if (selectedRecipeId === null) {
        renderRecipeGroups();
        return;
    }

    const selectedRecipe = allRecipes.find((recipe) => recipe.id === selectedRecipeId);
    if (!selectedRecipe) {
        selectedRecipeId = null;
        renderRecipeGroups();
        return;
    }

    renderRecipeDetail(selectedRecipe);
}

async function loadRecipes(): Promise<void> {
    if (!statusElement || !searchInputElement || !backButtonElement) {
        return;
    }

    statusElement.textContent = "Loading recipes...";

    try {
        const response = await fetch("/api/recipes");

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        allRecipes = await response.json();
        selectedRecipeId = null;
        currentSearchQuery = "";
        searchInputElement.value = "";

        if (allRecipes.length === 0) {
            statusElement.textContent = "No recipes found.";
            return;
        }

        searchInputElement.addEventListener("input", () => {
            currentSearchQuery = searchInputElement.value;
            selectedRecipeId = null;
            renderApp();
        });

        backButtonElement.addEventListener("click", () => {
            selectedRecipeId = null;
            renderApp();
        });

        renderApp();
    } catch {
        statusElement.textContent = "Could not load recipes.";
    }
}

void loadRecipes();
