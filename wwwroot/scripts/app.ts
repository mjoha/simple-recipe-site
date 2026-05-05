type Recipe = {
    id: number;
    title: string;
    description: string | null;
    category: string | null;
    servings: number | null;
};

const statusElement = document.getElementById("status");
const recipesListElement = document.getElementById("recipes-list");

async function loadRecipes(): Promise<void> {
    if (!statusElement || !recipesListElement) {
        return;
    }

    statusElement.textContent = "Loading recipes...";

    try {
        const response = await fetch("/api/recipes");

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        const recipes: Recipe[] = await response.json();

        recipesListElement.replaceChildren();

        if (recipes.length === 0) {
            statusElement.textContent = "No recipes found.";
            return;
        }

        for (const recipe of recipes) {
            const listItem = document.createElement("li");
            const servingsText = recipe.servings ? `${recipe.servings}` : "N/A";
            const categoryText = recipe.category ?? "Uncategorized";
            const titleElement = document.createElement("h3");
            titleElement.textContent = recipe.title;

            const descriptionElement = document.createElement("p");
            descriptionElement.textContent = recipe.description ?? "";

            const categoryElement = document.createElement("p");
            const categoryLabel = document.createElement("strong");
            categoryLabel.textContent = "Category:";
            categoryElement.append(categoryLabel, ` ${categoryText}`);

            const servingsElement = document.createElement("p");
            const servingsLabel = document.createElement("strong");
            servingsLabel.textContent = "Servings:";
            servingsElement.append(servingsLabel, ` ${servingsText}`);

            listItem.append(titleElement, descriptionElement, categoryElement, servingsElement);

            recipesListElement.appendChild(listItem);
        }

        statusElement.textContent = "Recipes loaded.";
    } catch {
        statusElement.textContent = "Could not load recipes.";
    }
}

void loadRecipes();
