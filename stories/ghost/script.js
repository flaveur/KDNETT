// Jumpscare Ghost - triggers at 50% scroll
let jumpscareTriggered = false;

window.addEventListener('scroll', () => {
    if (jumpscareTriggered) return;
    
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    
    // Trigger jumpscare when user scrolls to approximately middle of page
    if (scrollPercent >= 45 && scrollPercent <= 55) {
        jumpscareTriggered = true;
        triggerJumpscare();
    }
});

function triggerJumpscare() {
    const jumpscareGhost = document.querySelector('.jumpscare-ghost');
    jumpscareGhost.classList.add('active');
    
    // Optional: Play a "Boo!" sound effect (uncomment if you add audio)
    // const audio = new Audio('boo-sound.mp3');
    // audio.play();
    
    // Remove after animation completes
    setTimeout(() => {
        jumpscareGhost.classList.remove('active');
    }, 800);
}

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

// Enhanced hover effects on legend cards
const legendCards = document.querySelectorAll('.legend-card');
legendCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Timeline hover effects
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

// Highlight click effect
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
        50% { transform: scale(1.15); box-shadow: 0 0 20px rgba(14, 201, 166, 0.6); }
    }
`;
document.head.appendChild(style);