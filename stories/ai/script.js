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

// AI Chat Interface Functionality
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');

// AI responses based on the article content
const articleResponses = [
    'AI-markedet har vokst til 279 milliarder dollar og forventes å nå 1811 milliarder innen 2030. Dette vil påvirke arbeidsmarkedet betydelig. Scroll ned for å lese artikkelen for mer informasjon! 📊',
    
    'Studiebarometeret 2024 viser at 80% av studenter bruker AI i studiene, opp fra 60% i 2023. Studenter som bruker AI bruker mindre tid på studiene. Scroll ned for å lese hele artikkelen! 📚',
    
    'IT-feltet kan bli hardt påvirket av AI-utviklingen. AI er allerede kommet langt innenfor programmering. Scroll ned for å lese mer om hvordan dette påvirker IT-studenter! 💻',
    
    '52% av amerikanske arbeidstakere er bekymret for AI sin påvirkning på jobben, mens 32% tror det vil føre til færre muligheter. Scroll ned for å se alle tallene! 📈',
    
    'AI kan endre hvordan vi jobber isteden for å erstatte arbeidere, men det krever bedre opplæring. Scroll ned for å lese mer om fremtidens arbeidsliv! 🚀',
    
    'Simen Kingsrød (21), IT-student ved Høgskolen i Østfold, bruker AI hver dag og mener det øker produktiviteten betydelig. Scroll ned for å lese hele intervjuet! 💬',
    
    'AI-verktøy er estimert til å kunne gjøre halvparten av kontorjobber billigere og bedre enn mennesker innen 5 år. Les mer ved å scrolle ned! ⏰',
    
    'Det finnes flere populære AI-modeller som GPT-4, Claude, Gemini og DeepSeek. Scroll ned for å lese artikkelen om AI sin innvirkning på arbeidsmarkedet! 🤖'
];

// Send message
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Remove welcome message if exists
    const welcomeMsg = chatMessages.querySelector('.welcome-message');
    if (welcomeMsg) welcomeMsg.remove();

    // Add user message
    addMessage('user', message);
    chatInput.value = '';

    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message ai typing';
    typingIndicator.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate AI response after delay
    setTimeout(() => {
        typingIndicator.remove();
        const randomResponse = articleResponses[Math.floor(Math.random() * articleResponses.length)];
        addMessage('ai', randomResponse);
    }, 1500 + Math.random() * 1000);
}

function addMessage(type, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    if (type === 'ai') {
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <div class="ai-name">AI Assistent</div>
                ${text}
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-bubble">${text}</div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Background video blur when article content visible
const bgVideo = document.getElementById('bg-video');
const articleHeader = document.querySelector('.article-header');
const mainContainer = document.querySelector('.container');
const videoScrollHint = document.querySelector('.video-scroll-hint');

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

// Hide video scroll hint when user scrolls down past the video
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