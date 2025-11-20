console.log("Gruppe JSU - Nyhetsside lastet");

// ========== READING PROGRESS BAR ==========
const progressBar = document.createElement('div');
progressBar.className = 'reading-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  progressBar.style.width = scrolled + '%';
});

// ========== DARK MODE TOGGLE (icon-only) ==========
const toggleBtn = document.getElementById('mode-toggle');
if (toggleBtn) {
  const ICONS = { dark: '🌙', light: '☀️' };
  // Helper to set button state (icon + accessibility)
  function setToggleState(isDark) {
    toggleBtn.textContent = isDark ? ICONS.light : ICONS.dark; // show icon for the opposite action
    toggleBtn.setAttribute('aria-label', isDark ? 'Bytt til lys modus' : 'Bytt til mørk modus');
    toggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  }

  // Initialize from storage
  const stored = localStorage.getItem('darkMode');
  if (stored === 'enabled') {
    document.body.classList.add('dark-mode');
    setToggleState(true);
  } else {
    setToggleState(false);
  }

  // Click toggles class and stores preference; visible label remains an icon only
  toggleBtn.addEventListener('click', () => {
    const isNowDark = document.body.classList.toggle('dark-mode');
    setToggleState(isNowDark);
    localStorage.setItem('darkMode', isNowDark ? 'enabled' : 'disabled');
  });
}

// ========== FADE IN ANIMATIONS ON SCROLL ==========
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all story cards
document.querySelectorAll('.story.card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});
