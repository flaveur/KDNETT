/* ------------------- DARK MODE ------------------- */
const toggle = document.getElementById("mode-toggle");
toggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    toggle.textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
});

/* Light mode endrer noen farger */
const lightStyles = `
.light-mode {
    --bg: #f4f4f4;
    --text: #111;
}
.light-mode h2, 
.light-mode h3 {
    color: #7a0011;
}
`;
document.head.insertAdjacentHTML("beforeend", `<style>${lightStyles}</style>`);

/* ------------------- FADE-IN SCROLL ------------------- */
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
    });
}, { threshold: 0.2 });

document.querySelectorAll(".fade-in, p, .legend-card, img").forEach(el => {
    el.classList.add("fade-in");
    observer.observe(el);
});


/* ------------------- SUBTIL TEMPERATURFALL-EFFEKT ------------------- */
document.querySelectorAll("[data-location]").forEach(el => {
    el.addEventListener("mouseenter", () => {
        document.body.style.filter = "brightness(0.95)";
    });
    el.addEventListener("mouseleave", () => {
        document.body.style.filter = "brightness(1)";
    });
});


