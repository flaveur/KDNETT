// Animate bars on scroll
const observerOptions = {
    threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.bar-fill');
            bars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats');
if (statsSection) {
    observer.observe(statsSection);
}

// Background video blur when article content visible
const bgVideo = document.getElementById('bg-video');
const articleHeader = document.querySelector('.article-header');
const mainContainer = document.querySelector('.container');
const videoScrollHint = document.querySelector('.video-scroll-hint');

if (bgVideo && mainContainer) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                bgVideo.classList.add('blurred');
                if (articleHeader) articleHeader.classList.add('visible');
            } else {
                bgVideo.classList.remove('blurred');
                if (articleHeader) articleHeader.classList.remove('visible');
            }
        });
    }, { rootMargin: '0px 0px -55% 0px', threshold: 0 });
    io.observe(mainContainer);
}

// Hide video scroll hint when user scrolls down
window.addEventListener('scroll', () => {
    if (videoScrollHint) {
        const heroSection = document.querySelector('.hero-section');
        const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
        
        if (window.scrollY > heroHeight * 0.5) {
            videoScrollHint.style.opacity = '0';
            videoScrollHint.style.pointerEvents = 'none';
        } else {
            videoScrollHint.style.opacity = '1';
            videoScrollHint.style.pointerEvents = 'auto';
        }
    }
});

// Fade out video after scrolling further
window.addEventListener('scroll', () => {
    if (!mainContainer) return;
    const trigger = mainContainer.offsetTop + (window.innerHeight * 0.8);
    if (window.scrollY > trigger) {
        document.body.classList.add('video-fade-out');
    } else {
        document.body.classList.remove('video-fade-out');
    }
});
