
// Video autoplay når bruker scroller ned til den
const video = document.getElementById('iphone-video');
let hasPlayed = false;

// Intersection Observer for å detektere når videoen er synlig
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Hvis videoen er synlig (minst 50% av den) og ikke har spilt enda
        if (entry.isIntersecting && !hasPlayed) {
            video.play();
            hasPlayed = true;
        }
    });
}, {
    threshold: 0.5 // Trigger når 50% av videoen er synlig
});

// Start observering av videoen
observer.observe(video);