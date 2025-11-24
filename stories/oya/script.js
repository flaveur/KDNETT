
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

// ========== THEME OVERLAY ==========
// Theme overlay for subtle green→red dramaturgy
const overlay = document.createElement('div');
overlay.className = 'theme-overlay';
document.body.prepend(overlay);

window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

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

