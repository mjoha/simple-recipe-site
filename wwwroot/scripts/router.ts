const RECIPE_HASH_PREFIX = "#/recipes/";

export function parseRecipeIdFromHash(hash: string): number | null {
    if (hash.length === 0 || hash === "#") {
        return null;
    }

    if (!hash.startsWith(RECIPE_HASH_PREFIX)) {
        return null;
    }

    const idPart = hash.slice(RECIPE_HASH_PREFIX.length);
    if (!/^\d+$/.test(idPart)) {
        return null;
    }

    const parsed = Number.parseInt(idPart, 10);

    if (!Number.isInteger(parsed) || parsed <= 0) {
        return null;
    }

    return parsed;
}

export function readSelectedRecipeId(): number | null {
    return parseRecipeIdFromHash(window.location.hash);
}

export function writeRecipeUrl(id: number): void {
    history.pushState({ recipeId: id }, "", `${RECIPE_HASH_PREFIX}${id}`);
}

export function clearRecipeUrl(): void {
    history.pushState({ recipeId: null }, "", `${location.pathname}${location.search}`);
}

export function replaceRecipeUrlWithIndex(): void {
    history.replaceState({ recipeId: null }, "", `${location.pathname}${location.search}`);
}

export function onRecipeUrlChange(handler: () => void): void {
    window.addEventListener("popstate", handler);
}
