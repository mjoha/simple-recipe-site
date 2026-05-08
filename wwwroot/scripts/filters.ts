import type { Recipe } from "./types.js";

export function getRecipeInitial(recipe: Recipe): string {
    const trimmedTitle = recipe.title.trim();

    if (trimmedTitle.length === 0) {
        return "#";
    }

    const firstChar = trimmedTitle[0].toUpperCase();

    if (/^[\p{L}\p{N}]$/u.test(firstChar)) {
        return firstChar;
    }

    return "#";
}

export function matchesSearch(recipe: Recipe, searchQuery: string): boolean {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (normalizedQuery.length === 0) {
        return true;
    }

    const searchableFields = [
        recipe.title,
        recipe.introduction ?? "",
        recipe.objective ?? "",
        recipe.category ?? "",
        recipe.ingredients,
        recipe.preparation ?? "",
        recipe.execution,
        recipe.reflection ?? "",
        recipe.variation ?? "",
        recipe.timeEstimate ?? "",
        recipe.difficulty ?? "",
        recipe.source ?? ""
    ];

    return searchableFields.some((field) => field.toLowerCase().includes(normalizedQuery));
}

export function groupRecipesByInitial(recipes: Recipe[]): Map<string, Recipe[]> {
    const recipesByInitial = new Map<string, Recipe[]>();

    for (const recipe of recipes) {
        const initial = getRecipeInitial(recipe);
        const existing = recipesByInitial.get(initial) ?? [];
        existing.push(recipe);
        recipesByInitial.set(initial, existing);
    }

    return recipesByInitial;
}

export function sortedInitialKeys(groups: Map<string, Recipe[]>): string[] {
    const initials = [...groups.keys()].sort((left, right) => left.localeCompare(right));
    const symbolIndex = initials.indexOf("#");

    if (symbolIndex >= 0) {
        initials.splice(symbolIndex, 1);
        initials.push("#");
    }

    return initials;
}
