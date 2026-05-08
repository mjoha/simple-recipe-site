import { fetchIndex } from "./api.js";
import { getAppElements } from "./dom.js";
import { matchesSearch } from "./filters.js";
import { renderItemGroups } from "./renderList.js";
import { clearItemUrl, onItemUrlChange, readSelectedItemSlug, replaceItemUrlWithIndex, writeItemUrl } from "./router.js";
import type { IndexData, IndexedItem } from "./types.js";

const appElements = getAppElements();

if (!appElements) {
    throw new Error("Missing required DOM elements.");
}
const elements = appElements;

let indexData: IndexData | null = null;
let allItems: IndexedItem[] = [];
let currentSearchQuery = "";
let expandedItemIds = new Set<number>();

function renderIndexState(statusOverride?: string): void {
    const currentIndexData = indexData;
    if (!currentIndexData) {
        return;
    }

    const filteredItems = allItems.filter((item) => matchesSearch(item, currentIndexData, currentSearchQuery));
    const filteredItemIds = new Set(filteredItems.map((item) => item.id));
    expandedItemIds = new Set([...expandedItemIds].filter((itemId) => filteredItemIds.has(itemId)));

    renderItemGroups({
        container: elements.recipeGroups,
        letterIndex: elements.letterIndex,
        indexData: currentIndexData,
        items: filteredItems,
        expandedItemIds,
        onToggleItem: (itemId) => {
            const item = allItems.find((candidate) => candidate.id === itemId);
            if (!item) {
                return;
            }

            const itemSlug = item.fields[currentIndexData.slugField];
            if (!itemSlug) {
                return;
            }

            if (expandedItemIds.has(itemId)) {
                expandedItemIds.delete(itemId);
                if (readSelectedItemSlug() === itemSlug) {
                    clearItemUrl();
                }
                renderIndexState();
                return;
            }

            expandedItemIds.add(itemId);
            writeItemUrl(itemSlug);
            renderIndexState();
        }
    });

    if (statusOverride) {
        elements.emptyState.hidden = filteredItems.length !== 0;
        elements.status.textContent = statusOverride;
    } else if (filteredItems.length === 0) {
        elements.emptyState.hidden = false;
        elements.status.textContent = "";
    } else {
        elements.emptyState.hidden = true;
        elements.status.textContent = `${filteredItems.length} ${currentIndexData.itemName.toLowerCase()}${filteredItems.length === 1 ? "" : "s"} found`;
    }

    elements.recipeListView.hidden = false;
    elements.searchInput.hidden = false;
}

function scrollToItem(itemId: number): void {
    requestAnimationFrame(() => {
        document.getElementById(`item-${itemId}`)?.scrollIntoView({ block: "start" });
    });
}

function renderFromUrl(options: { scrollToItem: boolean } = { scrollToItem: false }): void {
    const currentIndexData = indexData;
    if (!currentIndexData) {
        return;
    }
    const selectedItemSlug = readSelectedItemSlug();

    if (selectedItemSlug === null) {
        expandedItemIds = new Set();
        renderIndexState();
        return;
    }

    const selectedItem = allItems.find((item) => item.fields[currentIndexData.slugField] === selectedItemSlug);

    if (!selectedItem) {
        replaceItemUrlWithIndex();
        expandedItemIds = new Set();
        renderIndexState(`${currentIndexData.itemName} not found.`);
        return;
    }

    expandedItemIds = new Set([selectedItem.id]);
    renderIndexState();

    if (options.scrollToItem) {
        scrollToItem(selectedItem.id);
    }
}

async function loadIndex(): Promise<void> {
    elements.status.textContent = "Loading index...";

    try {
        indexData = await fetchIndex();
        allItems = indexData.items;
        currentSearchQuery = "";
        elements.searchInput.value = "";

        const pageTitle = indexData.title.trim();
        if (pageTitle.length > 0) {
            document.title = pageTitle;
            const headingElement = document.querySelector("h1");
            if (headingElement) {
                headingElement.textContent = pageTitle;
            }
        }
        elements.searchInput.placeholder = `Search ${indexData.itemNamePlural.toLowerCase()}...`;
        elements.emptyState.textContent = `No ${indexData.itemNamePlural.toLowerCase()} match your search.`;

        if (allItems.length === 0) {
            elements.status.textContent = `No ${indexData.itemNamePlural.toLowerCase()} found.`;
            return;
        }

        elements.searchInput.addEventListener("input", () => {
            const currentIndexData = indexData;
            if (!currentIndexData) {
                return;
            }
            currentSearchQuery = elements.searchInput.value;
            const selectedItemSlug = readSelectedItemSlug();
            if (
                selectedItemSlug !== null &&
                !allItems.some(
                    (item) => item.fields[currentIndexData.slugField] === selectedItemSlug && matchesSearch(item, currentIndexData, currentSearchQuery)
                )
            ) {
                clearItemUrl();
            }

            renderIndexState();
        });

        onItemUrlChange(() => {
            renderFromUrl();
        });

        renderFromUrl({ scrollToItem: readSelectedItemSlug() !== null });
    } catch {
        elements.status.textContent = "Could not load index data.";
    }
}

void loadIndex();
