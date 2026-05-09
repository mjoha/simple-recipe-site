(function () {
    function setBulkToggling(active) {
        if (active) {
            document.documentElement.dataset.bulkToggling = "true";
        } else {
            delete document.documentElement.dataset.bulkToggling;
        }
    }

    function visibleCatalogItems(root) {
        const scope = root ?? document;
        return Array.from(scope.querySelectorAll("[data-catalog-item]")).filter(
            (node) => node instanceof HTMLElement && !node.hidden
        );
    }

    function expandItems(items) {
        setBulkToggling(true);
        try {
            for (const li of items) {
                const details = li.querySelector("details");
                if (details instanceof HTMLDetailsElement) {
                    details.open = true;
                }
            }
        } finally {
            setBulkToggling(false);
        }
    }

    function clearHashIfCollapsedVisibleTarget() {
        const raw = location.hash.replace(/^#/, "");
        if (!raw || raw.startsWith("group-")) {
            return;
        }
        let slug = raw;
        try {
            slug = decodeURIComponent(raw);
        } catch {
            /* keep raw */
        }
        const el = document.getElementById(slug);
        if (!(el instanceof HTMLElement) || !el.hasAttribute("data-catalog-item")) {
            return;
        }
        if (el.hidden) {
            return;
        }
        const details = el.querySelector("details");
        if (details instanceof HTMLDetailsElement && !details.open) {
            history.replaceState(null, "", `${location.pathname}${location.search}`);
        }
    }

    function collapseItems(items) {
        setBulkToggling(true);
        try {
            for (const li of items) {
                const details = li.querySelector("details");
                if (details instanceof HTMLDetailsElement) {
                    details.open = false;
                }
            }
        } finally {
            setBulkToggling(false);
        }
        clearHashIfCollapsedVisibleTarget();
    }

    const expandAll = document.querySelector("[data-expand-all]");
    const collapseAll = document.querySelector("[data-collapse-all]");

    if (expandAll instanceof HTMLButtonElement) {
        expandAll.addEventListener("click", () => {
            expandItems(visibleCatalogItems());
        });
    }

    if (collapseAll instanceof HTMLButtonElement) {
        collapseAll.addEventListener("click", () => {
            collapseItems(visibleCatalogItems());
        });
    }

    for (const button of document.querySelectorAll("[data-expand-group]")) {
        if (!(button instanceof HTMLButtonElement)) {
            continue;
        }
        if (!button.getAttribute("data-expand-group")) {
            continue;
        }
        button.addEventListener("click", () => {
            const section = button.closest("[data-group-section]");
            if (!(section instanceof HTMLElement)) {
                return;
            }
            expandItems(visibleCatalogItems(section));
        });
    }

    for (const button of document.querySelectorAll("[data-collapse-group]")) {
        if (!(button instanceof HTMLButtonElement)) {
            continue;
        }
        if (!button.getAttribute("data-collapse-group")) {
            continue;
        }
        button.addEventListener("click", () => {
            const section = button.closest("[data-group-section]");
            if (!(section instanceof HTMLElement)) {
                return;
            }
            collapseItems(visibleCatalogItems(section));
        });
    }
})();
