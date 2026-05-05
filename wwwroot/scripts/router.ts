const RECIPE_HASH_PREFIX = "#/recipes/";

export function parseRecipeIdFromHash(hash: string): number | null {
    if (hash.length === 0 || hash === "#") {
        return null;
    }

    if (!hash.startsWith(RECIPE_HASH_PREFIX)) {
        return null;
    }

    const idPart = hash.slice(RECIPE_HASH_PREFIX.length);
    const parsed = Number.parseInt(idPart, 10);

    if (!Number.isInteger(parsed) || parsed <= 0) {
        return null;
    }

    return parsed;
}

export function readSelectedRecipeId(): number | null {
    return parseRecipeIdFromHash(window.location.hash);
}

export function writeRecipeHash(id: number): void {
    window.location.hash = `${RECIPE_HASH_PREFIX}${id}`;
}

export function clearRecipeHash(): void {
    window.location.hash = "";
}

export function onHashChange(handler: () => void): void {
    window.addEventListener("hashchange", handler);
}
