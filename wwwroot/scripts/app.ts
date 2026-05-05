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

            listItem.innerHTML = `
                <h3>${recipe.title}</h3>
                <p>${recipe.description ?? ""}</p>
                <p><strong>Category:</strong> ${categoryText}</p>
                <p><strong>Servings:</strong> ${servingsText}</p>
            `;

            recipesListElement.appendChild(listItem);
        }

        statusElement.textContent = "Recipes loaded.";
    } catch {
        statusElement.textContent = "Could not load recipes.";
    }
}

void loadRecipes();
