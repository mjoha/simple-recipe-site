export type AppElements = {
    status: HTMLParagraphElement;
    searchInput: HTMLInputElement;
    emptyState: HTMLParagraphElement;
    letterIndex: HTMLElement;
    recipeGroups: HTMLDivElement;
    recipeListView: HTMLElement;
};

export function getAppElements(): AppElements | null {
    const status = document.getElementById("status");
    const searchInput = document.getElementById("search-input");
    const emptyState = document.getElementById("empty-state");
    const letterIndex = document.getElementById("letter-index");
    const recipeGroups = document.getElementById("recipe-groups");
    const recipeListView = document.getElementById("recipe-list-view");

    if (
        !(status instanceof HTMLParagraphElement) ||
        !(searchInput instanceof HTMLInputElement) ||
        !(emptyState instanceof HTMLParagraphElement) ||
        !(letterIndex instanceof HTMLElement) ||
        !(recipeGroups instanceof HTMLDivElement) ||
        !(recipeListView instanceof HTMLElement)
    ) {
        return null;
    }

    return {
        status,
        searchInput,
        emptyState,
        letterIndex,
        recipeGroups,
        recipeListView
    };
}
