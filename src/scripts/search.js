(function () {
    const searchInput = document.getElementById("search-input");
    const emptyState = document.getElementById("empty-state");
    const itemElements = Array.from(document.querySelectorAll("[data-catalog-item]"));
    const groupSections = Array.from(document.querySelectorAll("[data-group-section]"));
    const groupIndex = document.getElementById("group-index");

    if (!(searchInput instanceof HTMLInputElement) || !(emptyState instanceof HTMLElement)) {
        return;
    }

    const hasGroupNav = groupIndex instanceof HTMLElement;
    const hasGroupSections = groupSections.length > 0;

    function updateGroupNavigation(visibleGroupSlugs) {
        if (!hasGroupNav) {
            return;
        }
        const buttons = Array.from(groupIndex.querySelectorAll("[data-group]"));
        for (const element of buttons) {
            const slug = element.getAttribute("data-group");
            if (!slug) {
                continue;
            }

            const enabled = visibleGroupSlugs.has(slug);
            if (enabled && element.tagName !== "A") {
                const link = document.createElement("a");
                link.className = "group-button";
                link.setAttribute("data-group", slug);
                link.setAttribute("href", `#group-${slug}`);
                link.textContent = element.textContent;
                element.replaceWith(link);
            } else if (!enabled && element.tagName !== "SPAN") {
                const span = document.createElement("span");
                span.className = "group-button group-button-disabled";
                span.setAttribute("data-group", slug);
                span.setAttribute("aria-disabled", "true");
                span.textContent = element.textContent;
                element.replaceWith(span);
            }
        }
    }

    function applyFilter() {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;
        const visibleGroups = new Set();

        for (const item of itemElements) {
            const haystack = (item.getAttribute("data-search") || "").toLowerCase();
            const isVisible = query.length === 0 || haystack.includes(query);
            item.hidden = !isVisible;

            if (isVisible) {
                visibleCount += 1;
                if (hasGroupSections) {
                    const section = item.closest("[data-group-section]");
                    if (section instanceof HTMLElement) {
                        const groupSlug = section.getAttribute("data-group-section");
                        if (groupSlug) {
                            visibleGroups.add(groupSlug);
                        }
                    }
                }
            }
        }

        if (hasGroupSections) {
            for (const section of groupSections) {
                const groupSlug = section.getAttribute("data-group-section");
                if (!groupSlug) {
                    continue;
                }
                section.hidden = !visibleGroups.has(groupSlug);
            }
        }

        emptyState.hidden = visibleCount !== 0;
        updateGroupNavigation(visibleGroups);
    }

    searchInput.addEventListener("input", applyFilter);
})();
