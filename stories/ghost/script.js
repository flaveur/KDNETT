// Dark mode toggle (mirrors index implementation)
const toggleBtn = document.getElementById('mode-toggle');
if (toggleBtn) {
    const ICONS = { dark: '🌙', light: '☀️' };
    function setToggleState(isDark) {
        toggleBtn.textContent = isDark ? ICONS.light : ICONS.dark;
        toggleBtn.setAttribute('aria-label', isDark ? 'Bytt til lys modus' : 'Bytt til mørk modus');
        toggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }
    const stored = localStorage.getItem('darkMode');
    if (stored === 'enabled') {
        document.body.classList.add('dark-mode');
        setToggleState(true);
    } else { setToggleState(false); }
    toggleBtn.addEventListener('click', () => {
        const isNowDark = document.body.classList.toggle('dark-mode');
        setToggleState(isNowDark);
        localStorage.setItem('darkMode', isNowDark ? 'enabled' : 'disabled');
    });
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

// Also observe legend sections, figures and intro for subtle reveal
const revealEls = document.querySelectorAll('.legend-section, .story-figure, .intro');
revealEls.forEach(el => {
    el.style.opacity = '0';
    fadeInObserver.observe(el);
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

/* ------------------ New UX features ------------------ */

// Throttle helper
function throttle(fn, wait) {
    let last = 0;
    return function(...args) {
        const now = Date.now();
        if (now - last >= wait) {
            last = now;
            fn.apply(this, args);
        }
    };
}

// Reading progress bar
const progress = document.getElementById('progress');
function updateProgress() {
    if (!progress) return;
    const el = document.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    const percent = (el.scrollTop / max) * 100 || 0;
    progress.style.width = percent + '%';
}
window.addEventListener('scroll', throttle(updateProgress, 16));
window.addEventListener('resize', throttle(updateProgress, 100));
updateProgress();

// Hero parallax (subtle)
const hero = document.querySelector('.hero-section');
function onParallax() {
    if (!hero) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const val = window.scrollY;
    hero.style.setProperty('--parallax', (val * 0.2) + '');
}
window.addEventListener('scroll', throttle(onParallax, 20));
onParallax();

// Lightbox for images
const imgs = Array.from(document.querySelectorAll('.story-figure img'));
if (imgs.length) {
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.setAttribute('aria-hidden', 'true');
    lb.innerHTML = `
        <button class="close" aria-label="Lukk">×</button>
        <div class="lb-content">
            <img src="" alt="" />
            <div class="caption"></div>
        </div>
    `;
    document.body.appendChild(lb);

    const lbImg = lb.querySelector('img');
    const lbCaption = lb.querySelector('.caption');
    const lbClose = lb.querySelector('.close');
    let currentIndex = 0;

    function openLightbox(idx) {
        const node = imgs[idx];
        lbImg.src = node.src;
        lbImg.alt = node.alt || '';
        lbCaption.textContent = node.nextElementSibling ? node.nextElementSibling.textContent : '';
        lb.setAttribute('aria-hidden', 'false');
        lb.style.display = 'flex';
        currentIndex = idx;
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lb.setAttribute('aria-hidden', 'true');
        lb.style.display = 'none';
        lbImg.src = '';
        document.body.style.overflow = '';
    }

    imgs.forEach((img, i) => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => { openLightbox(i); });
    });

    lbClose.addEventListener('click', closeLightbox);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    window.addEventListener('keydown', (e) => {
        if (lb.getAttribute('aria-hidden') === 'false') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') openLightbox((currentIndex + 1) % imgs.length);
            if (e.key === 'ArrowLeft') openLightbox((currentIndex - 1 + imgs.length) % imgs.length);
        }
    });
}

// Ambient audio toggle (user-gesture required)
const audioToggle = document.getElementById('audio-toggle');
let ambientAudio = null;
if (audioToggle) {
    audioToggle.addEventListener('click', async () => {
        const pressed = audioToggle.getAttribute('aria-pressed') === 'true';
        if (!ambientAudio) {
            try {
                ambientAudio = new Audio('ambient.mp3');
                ambientAudio.loop = true;
                ambientAudio.volume = 0.12;
            } catch (err) {
                console.warn('Ambient audio not available', err);
            }
        }
        if (!pressed) {
            try { await ambientAudio.play(); } catch (e) { /* ignore play errors on local file */ }
            audioToggle.setAttribute('aria-pressed', 'true');
        } else {
            if (ambientAudio) ambientAudio.pause();
            audioToggle.setAttribute('aria-pressed', 'false');
        }
    });
}

// Reader / focus mode
const readerToggle = document.getElementById('reader-toggle');
if (readerToggle) {
    function setReaderMode(on) {
        document.body.classList.toggle('reader-mode', on);
        readerToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
        localStorage.setItem('readerMode', on ? 'enabled' : 'disabled');
    }
    const storedReader = localStorage.getItem('readerMode');
    setReaderMode(storedReader === 'enabled');
    readerToggle.addEventListener('click', () => {
        const isOn = document.body.classList.toggle('reader-mode');
        readerToggle.setAttribute('aria-pressed', isOn ? 'true' : 'false');
        localStorage.setItem('readerMode', isOn ? 'enabled' : 'disabled');
    });
}

// Respect prefers-reduced-motion: reduce reveal animations
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[style]').forEach(el => el.style.animation = 'none');
}

/* ------------------ end new features ------------------ */