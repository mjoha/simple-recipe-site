import type { Recipe } from "./types.js";

export async function fetchRecipes(): Promise<Recipe[]> {
    const response = await fetch("/data/recipes.json");

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.json() as Promise<Recipe[]>;
}
