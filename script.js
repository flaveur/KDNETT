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

// ========== DARK MODE TOGGLE ==========
const toggleBtn = document.getElementById('mode-toggle');

// Sjekk om dark mode er lagret i localStorage
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  toggleBtn.textContent = '☀️ Lys Modus';
}

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  
  if (document.body.classList.contains('dark-mode')) {
    toggleBtn.textContent = '☀️ Lys Modus';
    localStorage.setItem('darkMode', 'enabled');
  } else {
    toggleBtn.textContent = '🌙 Mørk Modus';
    localStorage.setItem('darkMode', 'disabled');
  }
});

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
