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

const PREFERS_REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reading progress bar
const progress = document.getElementById('progress');
const scrollHost = document.querySelector('.frame-content');
function updateProgress() {
    if (!progress) return;
    const el = scrollHost || document.documentElement;
    const scrollTop = scrollHost ? el.scrollTop : (window.scrollY || el.scrollTop || 0);
    const max = el.scrollHeight - el.clientHeight;
    const percent = max > 0 ? (scrollTop / max) * 100 : 0;
    progress.style.width = percent + '%';
}
const progressScrollTarget = scrollHost || window;
progressScrollTarget.addEventListener('scroll', throttle(updateProgress, 24));
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
let audioUnlocked = false;
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
            audioUnlocked = true;
            try { await DynamicAudio.init(); } catch (_) { /* ignore */ }
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

/* ================ Full-screen painting frame (no positioning needed) ================ */
// Frame is now fixed full-screen, no dynamic positioning required


/* ================= Fixed overlay frame dynamic content ================= */
(function initOverlayFrames(){
    const overlay = document.querySelector('.frame-overlay');
    if(!overlay) return;
    const imgEl = overlay.querySelector('.image-frame img');
    const titleEl = overlay.querySelector('.frame-title');
    const textEl = overlay.querySelector('.frame-text');

    const targets = Array.from(document.querySelectorAll('.legend-section, .legend-card'));
    if(!targets.length) return;

    // Helper: extract data from section
    function extract(section){
        const heading = section.querySelector('h2, h3');
        const firstP = section.querySelector('p');
        const img = section.querySelector('img');
        return {
            title: heading ? heading.textContent.trim() : 'Detaljer',
            text: firstP ? firstP.textContent.trim().slice(0, 240) + (firstP.textContent.length > 240 ? '…' : '') : '',
            imgSrc: img ? img.getAttribute('src') : null,
            imgAlt: img ? (img.getAttribute('alt') || heading?.textContent || 'Illustrasjon') : 'Illustrasjon'
        };
    }

    let activeId = null;
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                const sec = entry.target;
                if(activeId === sec.id) return;
                activeId = sec.id || Math.random().toString(36).slice(2);
                const data = extract(sec);
                overlay.classList.add('frame-overlay-updating');
                if(data.imgSrc){
                    imgEl.src = data.imgSrc;
                    imgEl.alt = data.imgAlt;
                }
                titleEl.textContent = data.title;
                textEl.textContent = data.text;
                setTimeout(()=>overlay.classList.remove('frame-overlay-updating'), 500);
            }
        });
    }, { threshold: 0.45, rootMargin: '0px 0px -30% 0px' });

    targets.forEach(t => io.observe(t));
})();


/* ================= Atmospheric spooky effects ================= */
// Hero subtitle ghostly typing effect
(function initHeroTyping(){
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    const text = subtitle.textContent.trim();
    if (!text.length) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const visible = document.createElement('span');
    visible.className = 'hero-subtitle-typed';
    visible.setAttribute('aria-hidden', 'true');

    const caret = document.createElement('span');
    caret.className = 'ghost-caret';
    caret.setAttribute('aria-hidden', 'true');

    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = text;

    subtitle.textContent = '';
    subtitle.append(visible, caret, sr);

    if (reduce) {
        visible.textContent = text;
        subtitle.classList.add('typing-complete');
        return;
    }

    const chars = Array.from(text);
    let index = 0;

    function typeNext() {
        visible.textContent = chars.slice(0, index + 1).join('');
        index += 1;
        if (index < chars.length) {
            subtitle.classList.add('typing-active');
            const delay = 55 + Math.random() * 110;
            setTimeout(typeNext, delay);
        } else {
            subtitle.classList.remove('typing-active');
            subtitle.classList.add('typing-complete');
        }
    }

    subtitle.classList.add('typing-active');
    setTimeout(typeNext, 420);
})();

// Persistent fog overlay
(function initSpectralFog(){
    const host = document.querySelector('.frame-content') || document.body;
    if (!host) return;
    if (host.querySelector('.spectral-fog')) return;
    const fog = document.createElement('div');
    fog.className = 'spectral-fog';
    fog.setAttribute('aria-hidden', 'true');
    host.appendChild(fog);
})();

// Elusive shadow apparition that drifts at the edge of vision
(function initShadowApparition(){
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const host = document.querySelector('.frame-content') || document.body;
    if (!host) return;

    let apparition = document.getElementById('shadow-apparition');
    if (!apparition) {
        apparition = document.createElement('div');
        apparition.id = 'shadow-apparition';
        apparition.setAttribute('aria-hidden', 'true');
        host.appendChild(apparition);
    }

    let isVisible = false;
    let hideTimer = null;

    const hide = () => {
        if (!isVisible) return;
        apparition.classList.remove('visible');
        isVisible = false;
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
    };

    const show = () => {
        if (isVisible) return;
        isVisible = true;
        const dir = Math.random() > 0.5 ? 'left' : 'right';
        apparition.style.left = '';
        apparition.style.right = '';
        if (dir === 'left') {
            apparition.style.left = '5%';
        } else {
            apparition.style.right = '5%';
        }
        const topVh = 22 + Math.random() * 46; // between 22vh and 68vh
        apparition.style.top = `${topVh}vh`;
        apparition.classList.add('visible');
        hideTimer = setTimeout(hide, 3800 + Math.random() * 2600);
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && Math.random() < 0.45) {
                show();
            }
        });
    }, { threshold: 0.55, rootMargin: '0px 0px -25% 0px' });

    document.querySelectorAll('.legend-section, .legend-card, .intro').forEach(el => observer.observe(el));

    window.addEventListener('scroll', throttle(() => {
        if (isVisible && Math.random() > 0.6) {
            hide();
        }
    }, 1200));

    window.addEventListener('pointermove', throttle(() => {
        if (isVisible && Math.random() > 0.8) {
            hide();
        }
    }, 800));
})();

/* ================= Narrative immersion upgrades ================= */

// Ghost typing effect for narrative paragraphs
(function initGhostTypingBlocks(){
    const nodes = Array.from(document.querySelectorAll('.ghost-typing'));
    if (!nodes.length) return;

    if (PREFERS_REDUCED_MOTION) {
        nodes.forEach(node => node.classList.add('is-visible'));
        return;
    }

    const typed = new WeakSet();

    nodes.forEach(node => {
        const original = node.textContent.trim();
        node.dataset.ghostOriginal = original;
        node.textContent = '';
    });

    function typeElement(el) {
        if (typed.has(el)) return;
        typed.add(el);
        const text = el.dataset.ghostOriginal || '';
        if (!text.length) return;
        const chars = Array.from(text);
        let index = 0;

        function step() {
            el.textContent += chars[index];
            index += 1;
            if (index < chars.length) {
                const delay = 35 + Math.random() * 70;
                setTimeout(step, delay);
            }
        }

        step();
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                const delay = Number(entry.target.dataset.ghostDelay || 0);
                if (delay > 0) {
                    setTimeout(() => typeElement(entry.target), delay);
                } else {
                    typeElement(entry.target);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.65, rootMargin: '0px 0px -25% 0px' });

    nodes.forEach(node => observer.observe(node));
})();

// Photo development reveal
(function initPhotoDevelopment(){
    const photos = Array.from(document.querySelectorAll('img.photo-develop'));
    if (!photos.length) return;
    if (PREFERS_REDUCED_MOTION) {
        photos.forEach(img => img.classList.add('developed'));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('developed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.35, rootMargin: '-10% 0px -15% 0px' });

    photos.forEach(img => observer.observe(img));
})();

// Web Audio soundscape controller
const DynamicAudio = (() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let ctx = null;
    let master = null;
    let seanceOscillator = null;
    let seanceGain = null;
    let intensityLevel = 'low';

    const INTENSITY_GAIN = {
        low: 0.24,
        medium: 0.32,
        high: 0.42
    };

    async function init() {
        if (!AudioContext) return null;
        if (!ctx) {
            ctx = new AudioContext();
            master = ctx.createGain();
            master.gain.value = INTENSITY_GAIN[intensityLevel];
            master.connect(ctx.destination);
        }
        if (ctx.state === 'suspended') {
            try { await ctx.resume(); } catch (_) { /* ignore */ }
        }
        return ctx;
    }

    function ensureContext() {
        return ctx && master;
    }

    function createGain(value) {
        const gain = ctx.createGain();
        gain.gain.value = value;
        gain.connect(master);
        return gain;
    }

    async function playChime(type = 'bell') {
        if (!audioUnlocked) return;
        await init();
        if (!ensureContext()) return;
        const osc = ctx.createOscillator();
        const gain = createGain(0.0001);
        const now = ctx.currentTime;
        osc.type = 'sine';
        osc.frequency.value = type === 'echo' ? 640 : 880;
        gain.gain.exponentialRampToValueAtTime(0.24, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 1.8);
    }

    async function setIntensity(level = 'low') {
        intensityLevel = level;
        if (!ensureContext()) return;
        const target = INTENSITY_GAIN[level] || INTENSITY_GAIN.low;
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(target, ctx.currentTime, 0.6);
    }

    async function setSeance(active) {
        if (!audioUnlocked) return;
        await init();
        if (!ensureContext()) return;
        if (active) {
            if (seanceOscillator) return;
            seanceOscillator = ctx.createOscillator();
            seanceGain = createGain(0.0001);
            seanceOscillator.type = 'sawtooth';
            seanceOscillator.frequency.value = 112;
            seanceGain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 1.2);
            seanceOscillator.connect(seanceGain);
            seanceOscillator.start();
        } else if (seanceOscillator && seanceGain) {
            const now = ctx.currentTime;
            seanceGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
            seanceOscillator.stop(now + 0.9);
            seanceOscillator = null;
            seanceGain = null;
        }
    }

    function reset() {
        if (seanceOscillator && seanceGain && ctx) {
            const now = ctx.currentTime;
            seanceGain.gain.linearRampToValueAtTime(0.0001, now + 0.4);
            seanceOscillator.stop(now + 0.45);
        }
        seanceOscillator = null;
        seanceGain = null;
    }

    return {
        init,
        playChime,
        setIntensity,
        setSeance,
        reset
    };
})();

// Update vignette focus to follow pointer and scroll depth
(function initCandleFocus(){
    if (!document.querySelector('.candle-vignette')) return;

    const root = document.documentElement;

    if (PREFERS_REDUCED_MOTION) {
        root.style.setProperty('--focus-x', '50%');
        root.style.setProperty('--focus-y', '30%');
        return;
    }

    const updatePointer = throttle((evt) => {
        const x = (evt.clientX / window.innerWidth) * 100;
        const y = (evt.clientY / window.innerHeight) * 100;
        root.style.setProperty('--focus-x', `${x.toFixed(1)}%`);
        root.style.setProperty('--focus-y', `${y.toFixed(1)}%`);
    }, 60);

    document.addEventListener('pointermove', updatePointer);

    const host = scrollHost || window;
    const updateFromScroll = throttle(() => {
        const hero = document.querySelector('.hero-section');
        if (!hero) return;
        const rect = hero.getBoundingClientRect();
        const relative = ((rect.bottom / window.innerHeight) * 100);
        const clamped = Math.max(8, Math.min(84, relative));
        root.style.setProperty('--focus-y', `${clamped.toFixed(1)}%`);
    }, 160);

    host.addEventListener('scroll', updateFromScroll);
    updateFromScroll();
})();

// Section driven atmospheric cues
(function initAtmosphereObserver(){
    if (!('IntersectionObserver' in window)) return;
    const targets = Array.from(document.querySelectorAll('[data-location], [data-intensity], [data-chime]'));
    if (!targets.length) return;

    const fog = document.querySelector('.spectral-fog');
    const LOCATION_HUE = {
        fredriksten: '150deg',
        vaerne: '120deg',
        struten: '210deg',
        praktisk: '45deg'
    };

    function setClassPrefix(prefix) {
        const remove = [];
        document.body.classList.forEach(cls => {
            if (cls.startsWith(prefix)) remove.push(cls);
        });
        remove.forEach(cls => document.body.classList.remove(cls));
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const { location, intensity, chime } = el.dataset;

            if (location) {
                setClassPrefix('location-');
                document.body.classList.add(`location-${location}`);
                const hue = LOCATION_HUE[location];
                if (hue) {
                    document.documentElement.style.setProperty('--ambient-hue', hue);
                }
            }

            if (intensity) {
                setClassPrefix('intensity-');
                document.body.classList.add(`intensity-${intensity}`);
                DynamicAudio.setIntensity(intensity);
                if (fog) {
                    const opacity = intensity === 'high' ? 0.32 : intensity === 'medium' ? 0.24 : 0.16;
                    fog.style.opacity = opacity.toString();
                }
            }

            if (chime) {
                DynamicAudio.playChime(chime);
            }
        });
    }, { threshold: 0.6, rootMargin: '-10% 0px -30% 0px' });

    targets.forEach(target => observer.observe(target));
})();

// Highlight the section currently in focus for easier reading
(function initReadingFocus(){
    if (!('IntersectionObserver' in window)) return;
    const sections = Array.from(document.querySelectorAll('.intro, .legend-section, .legend-card'));
    if (!sections.length) return;

    const allowLift = !PREFERS_REDUCED_MOTION;
    sections.forEach(section => {
        section.style.transition = allowLift
            ? 'background 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease'
            : 'background 0.3s ease, box-shadow 0.3s ease';
    });

    let active = null;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting) {
                if (active && active !== el) {
                    active.classList.remove('reading-focus');
                }
                el.classList.add('reading-focus');
                active = el;
            } else if (active === el) {
                el.classList.remove('reading-focus');
                active = null;
            }
        });
    }, { threshold: 0.55, rootMargin: '-10% 0px -35% 0px' });

    sections.forEach(section => observer.observe(section));
})();

// Footstep tracker tied to scroll depth
(function initFootsteps(){
    const track = document.querySelector('.spirit-footsteps');
    if (!track) return;
    const root = document.documentElement;

    const update = throttle(() => {
        const el = scrollHost || document.documentElement;
        const scrollTop = scrollHost ? el.scrollTop : (window.scrollY || el.scrollTop || 0);
        const max = el.scrollHeight - el.clientHeight;
        const percent = max > 0 ? (scrollTop / max) : 0;
        root.style.setProperty('--footstep-progress', `${(percent * 82).toFixed(2)}%`);
    }, 80);

    (scrollHost || window).addEventListener('scroll', update);
    update();
})();

// Séance toggle and overlay handling
(function initSeanceToggle(){
    const button = document.getElementById('seance-toggle');
    const overlay = document.querySelector('.seance-overlay');
    if (!button || !overlay) return;

    button.addEventListener('click', async () => {
        const active = button.getAttribute('aria-pressed') === 'true';
        const next = !active;
        button.setAttribute('aria-pressed', next ? 'true' : 'false');
        overlay.setAttribute('aria-hidden', next ? 'false' : 'true');
        document.body.classList.toggle('seance-mode', next);
        if (next) {
            audioUnlocked = true;
            await DynamicAudio.init();
            DynamicAudio.setSeance(true);
        } else {
            DynamicAudio.setSeance(false);
        }
    });
})();

// Lightbox ectoplasm veil toggle with keyboard shortcut
(function enhanceLightbox(){
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    const content = lightbox.querySelector('.lb-content');
    if (!content) return;

    let veil = content.querySelector('.ectoplasm-veil');
    if (!veil) {
        veil = document.createElement('div');
        veil.className = 'ectoplasm-veil';
        veil.setAttribute('aria-hidden', 'true');
        content.appendChild(veil);
    }

    function toggleVeil() {
        const isOpen = lightbox.getAttribute('aria-hidden') === 'false';
        if (!isOpen) return;
        const next = !veil.classList.contains('visible');
        veil.classList.toggle('visible', next);
        if (next) {
            DynamicAudio.playChime('echo');
        }
    }

    window.addEventListener('keydown', (evt) => {
        if (typeof evt.key === 'string' && evt.key.toLowerCase() === 'g') {
            toggleVeil();
        }
    });
})();

// Reader mode should silence séance effects
(function syncReaderModeAudio(){
    const readerToggleButton = document.getElementById('reader-toggle');
    if (!readerToggleButton) return;
    function disengageSeance() {
        const seanceBtn = document.getElementById('seance-toggle');
        if (seanceBtn) {
            seanceBtn.setAttribute('aria-pressed', 'false');
        }
        const overlay = document.querySelector('.seance-overlay');
        if (overlay) {
            overlay.setAttribute('aria-hidden', 'true');
        }
        document.body.classList.remove('seance-mode');
        DynamicAudio.setSeance(false);
    }

    if (document.body.classList.contains('reader-mode')) {
        disengageSeance();
    }

    readerToggleButton.addEventListener('click', () => {
        if (document.body.classList.contains('reader-mode')) {
            disengageSeance();
        }
    });
})();
