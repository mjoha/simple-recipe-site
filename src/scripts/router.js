(function () {
    const items = Array.from(document.querySelectorAll("[data-catalog-item]"));
    if (items.length === 0) {
        return;
    }

    /** @type {string[]} */
    const openOrder = [];
    let applyingHash = false;

    function decodeHashFragment() {
        const raw = location.hash.replace(/^#/, "");
        if (!raw) {
            return "";
        }
        try {
            return decodeURIComponent(raw);
        } catch {
            return raw;
        }
    }

    function getItemSlugFromHash() {
        const slug = decodeHashFragment();
        if (!slug || slug.startsWith("letter-")) {
            return null;
        }
        return slug;
    }

    function hashEqualsSlug(slug) {
        if (!slug || !location.hash) {
            return false;
        }
        return decodeHashFragment() === slug;
    }

    function removeSlugFromOrder(slug) {
        const index = openOrder.indexOf(slug);
        if (index >= 0) {
            openOrder.splice(index, 1);
        }
    }

    function pushSlugOpen(slug) {
        removeSlugFromOrder(slug);
        openOrder.push(slug);
    }

    function replaceHashFromOpenOrder() {
        const top = openOrder[openOrder.length - 1];
        if (top) {
            history.replaceState(null, "", `#${top}`);
        } else {
            history.replaceState(null, "", `${location.pathname}${location.search}`);
        }
    }

    function itemIntersectsViewport(item) {
        const rect = item.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const vw = window.innerWidth || document.documentElement.clientWidth;
        return rect.bottom > 0 && rect.top < vh && rect.right > 0 && rect.left < vw;
    }

    function syncFromHash(options) {
        const scroll = Boolean(options && options.scroll);
        const slug = getItemSlugFromHash();
        if (!slug) {
            return;
        }
        const item = document.getElementById(slug);
        if (!item || !item.hasAttribute("data-catalog-item")) {
            return;
        }
        const details = item.querySelector("details");
        if (!(details instanceof HTMLDetailsElement)) {
            return;
        }
        applyingHash = true;
        try {
            details.open = true;
        } finally {
            applyingHash = false;
        }
        pushSlugOpen(slug);
        if (scroll) {
            item.scrollIntoView({ block: "start" });
        }
    }

    function collapseAllCatalogItems() {
        applyingHash = true;
        try {
            for (const item of items) {
                const details = item.querySelector("details");
                if (details instanceof HTMLDetailsElement) {
                    details.open = false;
                }
            }
            openOrder.length = 0;
        } finally {
            applyingHash = false;
        }
    }

    function onHashChange() {
        const slug = getItemSlugFromHash();
        if (slug) {
            syncFromHash({ scroll: true });
            return;
        }
        const raw = decodeHashFragment();
        if (!raw) {
            collapseAllCatalogItems();
        }
    }

    for (const item of items) {
        const details = item.querySelector("details");
        if (!(details instanceof HTMLDetailsElement)) {
            continue;
        }
        const slug = item.id;
        if (!slug) {
            continue;
        }
        details.addEventListener("toggle", () => {
            if (applyingHash) {
                return;
            }
            if (details.open) {
                pushSlugOpen(slug);
                history.replaceState(null, "", `#${slug}`);
                if (!itemIntersectsViewport(item)) {
                    item.scrollIntoView({ block: "start" });
                }
            } else {
                removeSlugFromOrder(slug);
                if (hashEqualsSlug(slug)) {
                    replaceHashFromOpenOrder();
                }
            }
        });
    }

    function init() {
        const slug = getItemSlugFromHash();
        if (slug) {
            syncFromHash({ scroll: true });
        } else {
            openOrder.length = 0;
        }
        window.addEventListener("hashchange", onHashChange);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
