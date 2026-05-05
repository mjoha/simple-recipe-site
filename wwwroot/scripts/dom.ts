export type AppElements = {
    status: HTMLParagraphElement;
    searchInput: HTMLInputElement;
    emptyState: HTMLParagraphElement;
    recipeGroups: HTMLDivElement;
    recipeListView: HTMLElement;
    recipeDetailView: HTMLElement;
    recipeDetail: HTMLElement;
    backButton: HTMLButtonElement;
};

export function getAppElements(): AppElements | null {
    const status = document.getElementById("status");
    const searchInput = document.getElementById("search-input");
    const emptyState = document.getElementById("empty-state");
    const recipeGroups = document.getElementById("recipe-groups");
    const recipeListView = document.getElementById("recipe-list-view");
    const recipeDetailView = document.getElementById("recipe-detail-view");
    const recipeDetail = document.getElementById("recipe-detail");
    const backButton = document.getElementById("back-button");

    if (
        !(status instanceof HTMLParagraphElement) ||
        !(searchInput instanceof HTMLInputElement) ||
        !(emptyState instanceof HTMLParagraphElement) ||
        !(recipeGroups instanceof HTMLDivElement) ||
        !(recipeListView instanceof HTMLElement) ||
        !(recipeDetailView instanceof HTMLElement) ||
        !(recipeDetail instanceof HTMLElement) ||
        !(backButton instanceof HTMLButtonElement)
    ) {
        return null;
    }

    return {
        status,
        searchInput,
        emptyState,
        recipeGroups,
        recipeListView,
        recipeDetailView,
        recipeDetail,
        backButton
    };
}
