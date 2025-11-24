const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add("visible");
            });
        }, { threshold: 0.2 });

        document.querySelectorAll("p, .legend-card, img, .text-frame, .intro, .legend-section").forEach(el => {
            el.classList.add("fade-in");
            observer.observe(el);
        });

        /* Temperaturfall effekt */
        document.querySelectorAll("[data-location]").forEach(el => {
            el.addEventListener("mouseenter", () => {
                document.body.style.filter = "brightness(0.95)";
            });
            el.addEventListener("mouseleave", () => {
                document.body.style.filter = "brightness(1)";
            });
        });

