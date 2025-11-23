// Video playback controls with optimization
const video = document.getElementById('iphone-video');
const playButton = document.getElementById('play-button');

if (video && playButton) {
    // Sett volum til 50%
    video.volume = 0.5;
    
    // Optimaliser videokvalitet basert på nettverkshastighet
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection && connection.effectiveType) {
            // Reduser kvalitet på tregere forbindelser
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                video.style.filter = 'blur(0.5px)'; // Soft blur for å skjule lavere kvalitet
            }
        }
    }

    // Lazy load - start kun når bruker scroller til video
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Videoen er synlig, start avspilling
                if (video.readyState >= 2) {
                    video.play().catch(err => console.log('Autoplay blokkert:', err));
                }
                observer.unobserve(video); // Stop observering etter første gang
            }
        });
    }, {
        threshold: 0.5, // Start når 50% av videoen er synlig
        rootMargin: '50px' // Start litt før videoen er helt synlig
    });
    
    observer.observe(video);

    // Pause video når den ikke er synlig for å spare ressurser
    const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && !video.paused) {
                video.pause();
            }
        });
    }, {
        threshold: 0
    });
    
    visibilityObserver.observe(video);

    // Klikk på videoen for å pause/play
    video.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    // Vis play-knappen når videoen er pauset
    video.addEventListener('pause', () => {
        playButton.style.display = 'flex';
    });

    // Skjul play-knappen når videoen spiller
    video.addEventListener('play', () => {
        playButton.style.display = 'none';
    });

    // Klikk-handler for play-knappen
    playButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
    
    // Optimaliser for mobile enheter
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        // Reduser kvalitet på mobile
        video.style.maxWidth = '100%';
        video.style.height = 'auto';
    }
}

// Smooth scroll for any navigation if needed
document.addEventListener('DOMContentLoaded', function() {
    console.log('Skjermtid artikkel lastet');

    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeControls = lightbox ? lightbox.querySelectorAll('[data-close-overlay]') : [];
    let lastActiveElement = null;

    const closeLightbox = () => {
        if (!lightbox) {
            return;
        }
        lightbox.setAttribute('hidden', '');
        lightboxImage.src = '';
        lightboxCaption.textContent = '';
        document.body.classList.remove('lightbox-open');
        if (lastActiveElement) {
            lastActiveElement.focus({ preventScroll: true });
            lastActiveElement = null;
        }
    };

    const openLightbox = (trigger, src, altText) => {
        if (!lightbox || !lightboxImage) {
            return;
        }
        lastActiveElement = trigger;
        lightboxImage.src = src;
        lightboxImage.alt = altText || '';
        if (lightboxCaption) {
            lightboxCaption.textContent = altText || '';
        }
        lightbox.removeAttribute('hidden');
        document.body.classList.add('lightbox-open');
        const focusTarget = lightbox.querySelector('.lightbox-close');
        if (focusTarget) {
            focusTarget.focus({ preventScroll: true });
        }
    };

    const placeholders = document.querySelectorAll('.screentime-placeholder.has-image');
    placeholders.forEach((placeholder) => {
        const imageElement = placeholder.querySelector('img');
        const src = placeholder.getAttribute('data-lightbox') || (imageElement ? imageElement.src : '');
        if (!src) {
            return;
        }

        const altText = imageElement ? imageElement.alt : '';

        placeholder.addEventListener('click', () => {
            openLightbox(placeholder, src, altText);
        });

        placeholder.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(placeholder, src, altText);
            }
        });
    });

    closeControls.forEach((control) => {
        control.addEventListener('click', closeLightbox);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && document.body.classList.contains('lightbox-open')) {
            closeLightbox();
        }
    });
});