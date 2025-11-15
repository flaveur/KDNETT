
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
  // Kjør keyword highlighting
  highlightKeywords();
  const elements = document.querySelectorAll("p, h2, blockquote, figure");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));
});

const toggleBtn = document.getElementById("toggle-mode");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});


document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".timeline-item");
  const timeline = document.querySelector(".timeline");
  let isDragging = false;
  let startX;
  let scrollLeft;

  // Klikk for å scrolle til seksjon
  items.forEach(item => {
    item.addEventListener("click", (e) => {
      if (!isDragging) {
        const targetId = item.getAttribute("data-target");
        const section = document.getElementById(targetId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  // Dra-funksjonalitet for timeline
  if (timeline) {
    timeline.style.cursor = "grab";

    timeline.addEventListener("mousedown", (e) => {
      isDragging = true;
      timeline.style.cursor = "grabbing";
      startX = e.pageX - timeline.offsetLeft;
      scrollLeft = timeline.scrollLeft;
    });

    timeline.addEventListener("mouseleave", () => {
      isDragging = false;
      timeline.style.cursor = "grab";
    });

    timeline.addEventListener("mouseup", () => {
      isDragging = false;
      timeline.style.cursor = "grab";
    });

    timeline.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - timeline.offsetLeft;
      const walk = (x - startX) * 2; // Multipliser for raskere scrolling
      timeline.scrollLeft = scrollLeft - walk;
    });

    // Touch-støtte for mobil
    timeline.addEventListener("touchstart", (e) => {
      isDragging = true;
      startX = e.touches[0].pageX - timeline.offsetLeft;
      scrollLeft = timeline.scrollLeft;
    });

    timeline.addEventListener("touchend", () => {
      isDragging = false;
    });

    timeline.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - timeline.offsetLeft;
      const walk = (x - startX) * 2;
      timeline.scrollLeft = scrollLeft - walk;
    });
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

