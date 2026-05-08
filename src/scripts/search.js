(function () {
    const searchInput = document.getElementById("search-input");
    const emptyState = document.getElementById("empty-state");
    const itemElements = Array.from(document.querySelectorAll("[data-catalog-item]"));
    const letterSections = Array.from(document.querySelectorAll("[data-letter-section]"));
    const letterIndex = document.getElementById("letter-index");

    if (!(searchInput instanceof HTMLInputElement) || !(emptyState instanceof HTMLElement) || !(letterIndex instanceof HTMLElement)) {
        return;
    }

    function updateLetterNavigation(visibleLetters) {
        const letterButtons = Array.from(letterIndex.querySelectorAll("[data-letter]"));
        for (const element of letterButtons) {
            const letter = element.getAttribute("data-letter");
            if (!letter) {
                continue;
            }

            const enabled = visibleLetters.has(letter);
            if (enabled && element.tagName !== "A") {
                const link = document.createElement("a");
                link.className = "letter-index-button";
                link.setAttribute("data-letter", letter);
                link.setAttribute("href", `#letter-${letter}`);
                link.textContent = letter;
                element.replaceWith(link);
            } else if (!enabled && element.tagName !== "SPAN") {
                const span = document.createElement("span");
                span.className = "letter-index-button letter-index-button-disabled";
                span.setAttribute("data-letter", letter);
                span.setAttribute("aria-disabled", "true");
                span.textContent = letter;
                element.replaceWith(span);
            }
        }
    }

    function applyFilter() {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;
        const visibleLetters = new Set();

        for (const item of itemElements) {
            const haystack = (item.getAttribute("data-search") || "").toLowerCase();
            const isVisible = query.length === 0 || haystack.includes(query);
            item.hidden = !isVisible;

            if (isVisible) {
                visibleCount += 1;
                const section = item.closest("[data-letter-section]");
                if (section instanceof HTMLElement) {
                    const letter = section.getAttribute("data-letter-section");
                    if (letter) {
                        visibleLetters.add(letter);
                    }
                }
            }
        }

        for (const section of letterSections) {
            const letter = section.getAttribute("data-letter-section");
            if (!letter) {
                continue;
            }
            section.hidden = !visibleLetters.has(letter);
        }

        emptyState.hidden = visibleCount !== 0;
        updateLetterNavigation(visibleLetters);
    }

    searchInput.addEventListener("input", applyFilter);
})();
