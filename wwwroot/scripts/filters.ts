import type { IndexData, IndexedItem } from "./types.js";

function getTitle(item: IndexedItem, titleField: string): string {
    return (item.fields[titleField] ?? "").trim();
}

export function getItemInitial(item: IndexedItem, titleField: string): string {
    const trimmedTitle = getTitle(item, titleField);

    if (trimmedTitle.length === 0) {
        return "#";
    }

    const firstChar = trimmedTitle[0].toUpperCase();

    if (/^[\p{L}\p{N}]$/u.test(firstChar)) {
        return firstChar;
    }

    return "#";
}

export function matchesSearch(item: IndexedItem, indexData: IndexData, searchQuery: string): boolean {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (normalizedQuery.length === 0) {
        return true;
    }

    const searchableFields = indexData.searchFields.map((field) => {
        const fromField = item.fields[field];
        if (typeof fromField === "string") {
            return fromField;
        }

        const fromSection = item.sections[field];
        return typeof fromSection === "string" ? fromSection : "";
    });

    return searchableFields.some((field) => field.toLowerCase().includes(normalizedQuery));
}

export function groupItemsByInitial(items: IndexedItem[], titleField: string): Map<string, IndexedItem[]> {
    const itemsByInitial = new Map<string, IndexedItem[]>();

    for (const item of items) {
        const initial = getItemInitial(item, titleField);
        const existing = itemsByInitial.get(initial) ?? [];
        existing.push(item);
        itemsByInitial.set(initial, existing);
    }

    return itemsByInitial;
}

export function sortedInitialKeys(groups: Map<string, IndexedItem[]>): string[] {
    const initials = [...groups.keys()].sort((left, right) => left.localeCompare(right));
    const symbolIndex = initials.indexOf("#");

    if (symbolIndex >= 0) {
        initials.splice(symbolIndex, 1);
        initials.push("#");
    }

    return initials;
}
