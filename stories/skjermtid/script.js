// Video autoplay når bruker scroller ned til den
const video = document.getElementById('iphone-video');
const playButton = document.getElementById('play-button');
let hasPlayed = false;

// Funksjon for å spille videoen
function playVideo() {
    video.play().then(() => {
        // Videoen startet, skjul play-knappen
        playButton.style.display = 'none';
        hasPlayed = true;
    }).catch((error) => {
        console.log('Autoplay blokkert:', error);
    });
}

// Intersection Observer for å detektere når videoen er synlig
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Hvis videoen er synlig (minst 50% av den) og ikke har spilt enda
        if (entry.isIntersecting && !hasPlayed) {
            // Prøv å spille videoen automatisk
            playVideo();
        }
    });
}, {
    threshold: 0.5 // Trigger når 50% av videoen er synlig
});

// Klikk-handler for play-knappen
playButton.addEventListener('click', () => {
    playVideo();
});

// Start observering av videoen
observer.observe(video);