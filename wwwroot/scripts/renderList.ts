import { groupItemsByInitial, sortedInitialKeys } from "./filters.js";
import { renderInlineItemDetail } from "./renderDetail.js";
import type { IndexData, IndexedItem } from "./types.js";

type RenderListArgs = {
    container: HTMLElement;
    letterIndex: HTMLElement;
    indexData: IndexData;
    items: IndexedItem[];
    expandedItemIds: ReadonlySet<number>;
    onToggleItem: (itemId: number) => void;
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function renderItemListEntry(
    item: IndexedItem,
    indexData: IndexData,
    expandedItemIds: ReadonlySet<number>,
    onToggleItem: (itemId: number) => void
): HTMLLIElement {
    const listItem = document.createElement("li");
    listItem.className = "recipe-list-item";
    listItem.id = `item-${item.id}`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "recipe-button";
    button.addEventListener("click", () => onToggleItem(item.id));

    const title = document.createElement("h3");
    title.className = "recipe-title";
    title.textContent = item.fields[indexData.titleField] ?? "";

    button.appendChild(title);
    listItem.appendChild(button);

    if (expandedItemIds.has(item.id)) {
        listItem.classList.add("recipe-list-item-expanded");
        renderInlineItemDetail(listItem, item, indexData);
    }

    return listItem;
}

export function renderItemGroups({ container, letterIndex, indexData, items, expandedItemIds, onToggleItem }: RenderListArgs): void {
    container.replaceChildren();
    letterIndex.replaceChildren();
    const itemsByInitial = groupItemsByInitial(items, indexData.titleField);
    const initials = sortedInitialKeys(itemsByInitial);

    const availableInitials = new Set(initials);

    for (const letter of ALPHABET) {
        const letterButton = document.createElement("button");
        letterButton.type = "button";
        letterButton.className = "letter-index-button";
        letterButton.textContent = letter;

        if (!availableInitials.has(letter)) {
            letterButton.disabled = true;
        } else {
            letterButton.addEventListener("click", () => {
                document.getElementById(`initial-${letter}`)?.scrollIntoView({ block: "start" });
            });
        }

        letterIndex.appendChild(letterButton);
    }

    for (const initial of initials) {
        const initialSection = document.createElement("section");
        initialSection.className = "category-section";
        initialSection.id = `initial-${initial}`;

        const heading = document.createElement("h2");
        heading.textContent = initial;

        const list = document.createElement("ul");
        list.className = "recipe-list";

        const initialItems = itemsByInitial.get(initial) ?? [];
        initialItems.sort((left, right) => (left.fields[indexData.titleField] ?? "").localeCompare(right.fields[indexData.titleField] ?? ""));

        for (const item of initialItems) {
            list.appendChild(renderItemListEntry(item, indexData, expandedItemIds, onToggleItem));
        }

        initialSection.append(heading, list);
        container.appendChild(initialSection);
    }
}
