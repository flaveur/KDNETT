// Parallax effect for moon
document.addEventListener('mousemove', (e) => {
    const moon = document.querySelector('.moon');
    if (moon) {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        moon.style.transform = `translate(${x}px, ${y}px)`;
    }
});

// Random ghost appearance
const floatingGhost = document.querySelector('.floating-ghost');
setInterval(() => {
    if (floatingGhost) {
        const randomBottom = Math.random() * 50 + 10;
        const randomRight = Math.random() * 30 + 5;
        floatingGhost.style.bottom = randomBottom + '%';
        floatingGhost.style.right = randomRight + '%';
    }
}, 8000);

// Spooky hover effects on legend cards
const legendCards = document.querySelectorAll('.legend-card');
legendCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 20px 50px rgba(83, 52, 131, 0.7), 0 0 30px rgba(255, 215, 0, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 15px 40px rgba(83, 52, 131, 0.5)';
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 1s ease-out forwards';
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const sightings = document.querySelectorAll('.sighting');
sightings.forEach(sighting => {
    sighting.style.opacity = '0';
    fadeInObserver.observe(sighting);
});

// Eerie sound effect on hover (visual feedback)
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(10px)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

// Mysterious glow effect on highlights
const highlights = document.querySelectorAll('.highlight');
highlights.forEach(highlight => {
    highlight.addEventListener('click', function() {
        this.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            this.style.animation = '';
        }, 500);
    });
});

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
    }
`;
document.head.appendChild(style);