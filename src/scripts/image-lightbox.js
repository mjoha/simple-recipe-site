(function () {
    const zoomLinks = document.querySelectorAll("[data-catalog-item] a[data-image-zoom]");
    if (zoomLinks.length === 0) {
        return;
    }

    let lastFocused = null;

    function closeLightbox(overlay, onKeyDown) {
        document.removeEventListener("keydown", onKeyDown);
        document.body.style.overflow = "";
        overlay.remove();
        if (lastFocused instanceof HTMLElement) {
            lastFocused.focus();
        }
        lastFocused = null;
    }

    function openLightbox(link) {
        const thumb = link.querySelector("img");
        if (!(thumb instanceof HTMLImageElement)) {
            return;
        }

        lastFocused = link;

        const overlay = document.createElement("div");
        overlay.className = "image-lightbox-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-label", "Enlarged image");

        const frame = document.createElement("div");
        frame.className = "image-lightbox-frame";

        const enlarged = document.createElement("img");
        enlarged.src = thumb.currentSrc || thumb.src;
        enlarged.alt = thumb.alt;

        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "image-lightbox-close";
        closeBtn.setAttribute("aria-label", "Close");
        closeBtn.textContent = "\u00d7";

        frame.appendChild(enlarged);
        frame.appendChild(closeBtn);
        overlay.appendChild(frame);
        document.body.appendChild(overlay);
        document.body.style.overflow = "hidden";

        function onKeyDown(event) {
            if (event.key === "Escape") {
                event.preventDefault();
                closeLightbox(overlay, onKeyDown);
            }
        }

        document.addEventListener("keydown", onKeyDown);

        overlay.addEventListener("click", () => {
            closeLightbox(overlay, onKeyDown);
        });
        frame.addEventListener("click", (event) => {
            event.stopPropagation();
        });
        closeBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            closeLightbox(overlay, onKeyDown);
        });

        closeBtn.focus();
    }

    for (const link of zoomLinks) {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            openLightbox(link);
        });
    }
})();
