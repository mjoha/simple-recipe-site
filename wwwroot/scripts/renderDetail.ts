import type { IndexData, IndexedItem } from "./types.js";

function appendMultilineText(parent: HTMLElement, text: string): void {
    const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    for (const line of lines) {
        const lineElement = document.createElement("p");
        lineElement.className = "text-block-line";
        lineElement.textContent = line;
        parent.appendChild(lineElement);
    }
}

function toHeadingLabel(value: string): string {
    return value
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function renderInlineItemDetail(container: HTMLElement, item: IndexedItem, indexData: IndexData): void {
    const detail = document.createElement("div");
    detail.className = "recipe-inline-detail";
    detail.id = `item-expanded-${item.id}`;

    const title = document.createElement("h3");
    title.textContent = item.fields[indexData.titleField] ?? "";
    detail.appendChild(title);

    const meta = document.createElement("p");
    const metaParts: string[] = [];

    for (const field of indexData.metadata) {
        const value = item.fields[field]?.trim();
        if (value) {
            metaParts.push(value);
        }
    }

    if (metaParts.length > 0) {
        meta.textContent = metaParts.join(" · ");
        detail.append(meta);
    }

    for (const sectionName of indexData.sections) {
        const sectionContent = item.sections[sectionName]?.trim();
        if (!sectionContent) {
            continue;
        }

        const sectionHeading = document.createElement("h4");
        sectionHeading.textContent = toHeadingLabel(sectionName);
        const sectionBlock = document.createElement("div");
        appendMultilineText(sectionBlock, sectionContent);
        detail.append(sectionHeading, sectionBlock);
    }

    container.appendChild(detail);
}
