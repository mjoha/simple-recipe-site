import type { Recipe } from "./types.js";

export function normalizeCategory(category: string | null): string {
    return category?.trim() || "Uncategorized";
}

export function matchesSearch(recipe: Recipe, searchQuery: string): boolean {
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

export function sortedCategoryKeys(categoryMap: Map<string, Recipe[]>): string[] {
    const categories = [...categoryMap.keys()].sort((left, right) => left.localeCompare(right));
    const uncategorizedIndex = categories.indexOf("Uncategorized");

    if (uncategorizedIndex >= 0) {
        categories.splice(uncategorizedIndex, 1);
        categories.push("Uncategorized");
    }

    return categories;
}
