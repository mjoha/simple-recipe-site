const ITEM_HASH_PREFIX = "#/items/";

export function parseItemSlugFromHash(hash: string): string | null {
    if (hash.length === 0 || hash === "#") {
        return null;
    }

    if (!hash.startsWith(ITEM_HASH_PREFIX)) {
        return null;
    }

    const slug = hash.slice(ITEM_HASH_PREFIX.length).trim();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)) {
        return null;
    }

    return slug;
}

export function readSelectedItemSlug(): string | null {
    return parseItemSlugFromHash(window.location.hash);
}

export function writeItemUrl(slug: string): void {
    history.pushState({ itemSlug: slug }, "", `${ITEM_HASH_PREFIX}${slug}`);
}

export function clearItemUrl(): void {
    history.pushState({ itemSlug: null }, "", `${location.pathname}${location.search}`);
}

export function replaceItemUrlWithIndex(): void {
    history.replaceState({ itemSlug: null }, "", `${location.pathname}${location.search}`);
}

export function onItemUrlChange(handler: () => void): void {
    window.addEventListener("popstate", handler);
}
