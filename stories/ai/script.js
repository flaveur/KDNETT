     //  Animate bars on scroll
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

    // Scroll to top button
    const scrollIndicator = document.querySelector('.scroll-indicator');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollIndicator.classList.add('visible');
        } else {
            scrollIndicator.classList.remove('visible');
        }
    });

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Add hover effects to QA items
    const qaItems = document.querySelectorAll('.qa-item');
    qaItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.background = '#eef2ff';
            setTimeout(() => {
                this.style.background = 'white';
            }, 300);
        });
    });

// Background video blur when article content visible
const bgVideo = document.getElementById('bg-video');
const articleHeader = document.querySelector('.article-header');
const mainContainer = document.querySelector('.container');
if (bgVideo && mainContainer) {
    try {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // when container (article) comes into view, blur the video and show header
                    bgVideo.classList.add('blurred');
                    if (articleHeader) articleHeader.classList.add('visible');
                } else {
                    bgVideo.classList.remove('blurred');
                    if (articleHeader) articleHeader.classList.remove('visible');
                }
            });
        }, { rootMargin: '0px 0px -55% 0px', threshold: 0 });
        io.observe(mainContainer);
    } catch (e) {
        // fallback: on scroll check position
        window.addEventListener('scroll', () => {
            const rect = mainContainer.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                bgVideo.classList.add('blurred');
                if (articleHeader) articleHeader.classList.add('visible');
            } else {
                bgVideo.classList.remove('blurred');
                if (articleHeader) articleHeader.classList.remove('visible');
            }
        });
    }
}

// Fade out video after user scrolls further (approx half page beyond article start)
window.addEventListener('scroll', () => {
    if (!mainContainer) return;
    const trigger = mainContainer.offsetTop + (window.innerHeight * 0.8);
    if (window.scrollY > trigger) {
        document.body.classList.add('video-fade-out');
    } else {
        document.body.classList.remove('video-fade-out');
    }
});