
console.log("Øyafestivalen-artikkel lastet.");

// ========== SMOOTH SCROLL FROM HERO TO MAIN ==========
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
  scrollIndicator.addEventListener('click', () => {
    document.getElementById('main').scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  });
}

// Hide scroll indicator when scrolling down
window.addEventListener('scroll', () => {
  if (scrollIndicator) {
    if (window.scrollY > 100) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.pointerEvents = 'none';
    } else {
      scrollIndicator.style.opacity = '1';
      scrollIndicator.style.pointerEvents = 'auto';
    }
  }
});

// ========== READING PROGRESS BAR + THEME OVERLAY ==========
const progressBar = document.createElement('div');
progressBar.className = 'reading-progress';
document.body.prepend(progressBar);

// Theme overlay for subtle green→red dramaturgy
const overlay = document.createElement('div');
overlay.className = 'theme-overlay';
document.body.prepend(overlay);

window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  progressBar.style.width = scrolled + '%';

  // Adjust overlay opacity; reach ~full around 70% scroll
  const ratio = Math.min(1, (height ? (winScroll / height) : 0) / 0.7);
  document.documentElement.style.setProperty('--overlay-opacity', ratio.toFixed(3));

  // Subdue the flag after leaving hero
  const hero = document.getElementById('hero');
  const flag = document.querySelector('.palestine-flag');
  if (hero && flag) {
    if (winScroll > hero.offsetHeight * 0.35) {
      flag.classList.add('flag-fade');
    } else {
      flag.classList.remove('flag-fade');
    }
  }
});

// ========== EXPANDABLE INFO BOXES ==========
document.addEventListener('click', (e) => {
  if (e.target.closest('.info-box')) {
    const box = e.target.closest('.info-box');
    box.classList.toggle('expanded');
  }
});

// ========== HIGHLIGHT KEYWORDS AUTOMATICALLY ==========
function highlightKeywords() {
  const keywords = ['boikott', 'etikk', 'KKR', 'Palestinakomiteen', 'SodaStream', 'Superstruct'];
  const article = document.querySelector('article');
  const paragraphs = article.querySelectorAll('p');
  
  paragraphs.forEach(p => {
    if (p.closest('.info-box-content') || p.closest('.byline')) return;
    
    let html = p.innerHTML;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
      html = html.replace(regex, '<span class="highlight-word" title="Nøkkelord">$1</span>');
    });
    p.innerHTML = html;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  //Kjører keyword highlighting
  highlightKeywords();
  const elements = document.querySelectorAll("p, h2, blockquote, figure");
  elements.forEach(el => el.classList.add('visible'));

  // Tag Gaza-related quotes and activism pull-quotes
  const gazaKeywords = [/\bgaza\b/i, /\bokkupasjon\b/i, /\bfolkemord\b/i];
  document.querySelectorAll('blockquote').forEach(bq => {
    const t = bq.textContent || '';
    if (gazaKeywords.some(re => re.test(t))) {
      bq.classList.add('gaza');
    }
  });
  const activismKeys = [/Palestinakomiteen/i, /BDS/i, /solidarit/i, /aktivist/i];
  document.querySelectorAll('.pull-quote').forEach(pq => {
    const t = pq.textContent || '';
    if (activismKeys.some(re => re.test(t))) {
      pq.classList.add('activism');
    }
  });

  // Subtle pulse for critical terms
  const pulseWords = ['Gaza','okkupasjon','folkemord'];
  document.querySelectorAll('.highlight-word').forEach(el => {
    const txt = (el.textContent || '').trim();
    if (pulseWords.some(w => new RegExp('^'+w+'$', 'i').test(txt))) {
      el.classList.add('pulse');
    }
  });
});

const toggleBtn = document.getElementById("toggle-mode");
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".timeline-item");
  const timeline = document.querySelector(".timeline");

  // Respect OS-level reduced-motion and an optional `no-effects` class on <body>
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const effectsDisabled = document.body.classList.contains('no-effects') || prefersReduced;

  let isDragging = false;
  let startX;
  let scrollLeft;
  // For momentum
  let prevX = 0;
  let prevTime = 0;
  let velocity = 0;

  // Klikk for å scrolle til seksjon
  items.forEach(item => {
    item.addEventListener("click", (e) => {
      if (!isDragging) {
        const targetId = item.getAttribute("data-target");
        if (targetId) {
          const section = document.getElementById(targetId);
          if (section) {
            section.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
            return;
          }
          const anchor = document.querySelector('[id="' + targetId + '"]');
          if (anchor) {
            anchor.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
            return;
          }
        }
      }
    });
  });

  // Dra-funksjonalitet for timeline (med valgfri momentum)
  if (timeline) {
    timeline.style.cursor = "grab";

    timeline.addEventListener("mousedown", (e) => {
      isDragging = true;
      timeline.style.cursor = "grabbing";
      startX = e.pageX - timeline.offsetLeft;
      scrollLeft = timeline.scrollLeft;
      prevX = e.pageX;
      prevTime = Date.now();
    });

    timeline.addEventListener("mouseleave", () => {
      isDragging = false;
      timeline.style.cursor = "grab";
    });

    timeline.addEventListener("mouseup", (e) => {
      isDragging = false;
      timeline.style.cursor = "grab";
      // calculate velocity and start momentum if allowed
      const now = Date.now();
      const dx = e.pageX - prevX;
      const dt = Math.max(1, now - prevTime);
      velocity = dx / dt; // px per ms
      if (!effectsDisabled && Math.abs(velocity) > 0.02) {
        startMomentum(velocity);
      }
    });

    timeline.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - timeline.offsetLeft;
      const walk = (x - startX) * 2; // Multipliser for raskere scrolling
      timeline.scrollLeft = scrollLeft - walk;
      // capture for velocity
      const now = Date.now();
      if (now - prevTime > 8) {
        prevX = e.pageX;
        prevTime = now;
      }
    });

    // Touch-støtte for mobil
    timeline.addEventListener("touchstart", (e) => {
      isDragging = true;
      startX = e.touches[0].pageX - timeline.offsetLeft;
      scrollLeft = timeline.scrollLeft;
      prevX = e.touches[0].pageX;
      prevTime = Date.now();
    });

    timeline.addEventListener("touchend", (e) => {
      isDragging = false;
      const now = Date.now();
      const dx = (e.changedTouches && e.changedTouches[0]) ? (e.changedTouches[0].pageX - prevX) : 0;
      const dt = Math.max(1, now - prevTime);
      velocity = dx / dt;
      if (!effectsDisabled && Math.abs(velocity) > 0.02) {
        startMomentum(velocity);
      }
    });

    timeline.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - timeline.offsetLeft;
      const walk = (x - startX) * 2;
      timeline.scrollLeft = scrollLeft - walk;
      const now = Date.now();
      if (now - prevTime > 8) {
        prevX = e.touches[0].pageX;
        prevTime = now;
      }
    });

    // Wheel-to-horizontal scroll (desktop)
    if (!effectsDisabled) {
      timeline.addEventListener('wheel', (e) => {
        // If vertical scroll, convert to horizontal for timeline
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          timeline.scrollLeft += e.deltaY;
        }
      }, { passive: false });
    }

    // Keyboard navigation (left/right)
    document.addEventListener('keydown', (e) => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') {
        scrollToNextItem();
      } else if (e.key === 'ArrowLeft') {
        scrollToPrevItem();
      }
    });

    // Create simple left/right controls
    function createControls() {
      const wrapper = document.createElement('div');
      wrapper.className = 'timeline-controls';
      const prev = document.createElement('button');
      prev.className = 'timeline-control-btn';
      prev.type = 'button';
      prev.innerText = '←';
      const next = document.createElement('button');
      next.className = 'timeline-control-btn';
      next.type = 'button';
      next.innerText = '→';
      prev.addEventListener('click', scrollToPrevItem);
      next.addEventListener('click', scrollToNextItem);
      wrapper.appendChild(prev);
      wrapper.appendChild(next);
      timeline.parentElement.style.position = 'relative';
      timeline.parentElement.appendChild(wrapper);
    }

    // Tooltip preview
    const tooltip = document.createElement('div');
    tooltip.className = 'timeline-tooltip';
    document.body.appendChild(tooltip);

    items.forEach(item => {
      item.setAttribute('tabindex', '0');
      item.addEventListener('mouseenter', (ev) => {
        const preview = item.getAttribute('data-preview') || (item.querySelector('p') ? item.querySelector('p').innerText : item.textContent);
        tooltip.innerText = preview.trim().slice(0, 300);
        const rect = item.getBoundingClientRect();
        const top = rect.top - 12;
        const left = Math.min(rect.left, window.innerWidth - 380);
        // Positioning: wait for layout then place
        requestAnimationFrame(() => {
          tooltip.style.top = (top - tooltip.offsetHeight) + 'px';
          tooltip.style.left = (left) + 'px';
          tooltip.classList.add('visible');
        });
      });
      item.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
      item.addEventListener('focus', () => { item.classList.add('focused'); });
      item.addEventListener('blur', () => { item.classList.remove('focused'); });
    });

    // Snap to closest item after scroll ends
    let scrollTimer;
    timeline.addEventListener('scroll', () => {
      // Live update centered class while scrolling for a smoother feel
      if (!effectsDisabled) updateCenteredOnScroll();
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (!effectsDisabled) snapToClosest();
      }, 120);
    });

    function snapToClosest() {
      const center = timeline.scrollLeft + timeline.clientWidth / 2;
      let closest = null;
      let closestDistance = Infinity;
      items.forEach(it => {
        const rect = it.getBoundingClientRect();
        const itCenter = timeline.scrollLeft + (rect.left - timeline.getBoundingClientRect().left) + rect.width / 2;
        const dist = Math.abs(itCenter - center);
        if (dist < closestDistance) {
          closestDistance = dist;
          closest = it;
        }
      });
      if (closest) {
        smoothScrollToItem(closest);
      }
    }

    function updateCenteredOnScroll() {
      const center = timeline.scrollLeft + timeline.clientWidth / 2;
      items.forEach(it => {
        const rect = it.getBoundingClientRect();
        const itCenter = timeline.scrollLeft + (rect.left - timeline.getBoundingClientRect().left) + rect.width / 2;
        const dist = Math.abs(itCenter - center);
        if (dist < rect.width * 0.6) {
          it.classList.add('centered');
        } else {
          it.classList.remove('centered');
        }
      });
    }

    function smoothScrollToItem(el) {
      const rect = el.getBoundingClientRect();
      const timelineRect = timeline.getBoundingClientRect();
      const offset = (rect.left + rect.width/2) - (timelineRect.left + timelineRect.width/2);
      timeline.scrollBy({ left: offset, behavior: prefersReduced ? 'auto' : 'smooth' });
      // update active classes
      items.forEach(i => i.classList.remove('centered'));
      el.classList.add('centered');
    }

    function scrollToNextItem() {
      const visibleCenter = timeline.scrollLeft + timeline.clientWidth / 2;
      let next = null;
      let candidate = Infinity;
      items.forEach(it => {
        const left = it.offsetLeft + it.offsetWidth/2;
        if (left > visibleCenter && left < candidate) { candidate = left; next = it; }
      });
      if (next) smoothScrollToItem(next);
    }

    function scrollToPrevItem() {
      const visibleCenter = timeline.scrollLeft + timeline.clientWidth / 2;
      let prev = null;
      let candidate = -Infinity;
      items.forEach(it => {
        const left = it.offsetLeft + it.offsetWidth/2;
        if (left < visibleCenter && left > candidate) { candidate = left; prev = it; }
      });
      if (prev) smoothScrollToItem(prev);
    }

    function startMomentum(initialVel) {
      // initialVel is px/ms — scale to px/frame
      let v = initialVel * 30; // tuning factor
      function step() {
        v *= 0.95; // decay
        if (Math.abs(v) < 0.4) return;
        timeline.scrollLeft -= v;
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    createControls();
  }

  // Marker aktiv del når man scroller
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    items.forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("data-target") === current) {
        item.classList.add("active");
      }
    });
  });
});

