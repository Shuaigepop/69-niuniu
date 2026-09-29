document.addEventListener('DOMContentLoaded', () => {

    // ===== Floating particles =====
    const particlesContainer = document.getElementById('particles');
    const PARTICLE_COUNT = 15;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 4 + 2;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${Math.random() * 100}%`;
        p.style.animationDuration = `${Math.random() * 12 + 8}s`;
        p.style.animationDelay = `${Math.random() * 10}s`;
        if (particlesContainer) particlesContainer.appendChild(p);
    }

    // ===== Accordion =====
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            accordionItems.forEach(other => other.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // ===== Scroll-triggered fade-in =====
    const sections = document.querySelectorAll('.content-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    sections.forEach(section => observer.observe(section));

    // ===== i18n Language Logic =====
    
    // Mapping for language names and icons
    const langInfo = {
        "zh-CN": { text: "简体中文", icon: "🇨🇳" },
        "zh-TW": { text: "繁體中文", icon: "🇹🇼" },
        "en": { text: "English", icon: "🇬🇧" },
        "ms": { text: "Bahasa Melayu", icon: "🇲🇾" },
        "id": { text: "Bahasa Indonesia", icon: "🇮🇩" },
        "vi": { text: "Tiếng Việt", icon: "🇻🇳" },
        "th": { text: "ภาษาไทย", icon: "🇹🇭" }
    };

    let currentLang = localStorage.getItem('niuniu_lang') || 'zh-CN';
    
    const applyLanguage = (lang) => {
        if (!translations[lang]) return;
        
        // Update DOM texts
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const isHtml = el.getAttribute('data-i18n-html') === 'true';
            
            if (translations[lang][key]) {
                if (isHtml) {
                    el.innerHTML = translations[lang][key];
                } else {
                    el.innerText = translations[lang][key];
                }
            }
        });

        // Update document title separately since it's in <head>
        if (translations[lang]["page_title"]) {
            document.title = "69 NiuNiu - " + translations[lang]["page_title"];
        }

        // Update Switcher UI
        const currentLangText = document.getElementById('current-lang-text');
        const currentLangIcon = document.getElementById('current-lang-icon');
        if (currentLangText && langInfo[lang]) currentLangText.innerText = langInfo[lang].text;
        if (currentLangIcon && langInfo[lang]) currentLangIcon.innerText = langInfo[lang].icon;

        // Update active class on options
        document.querySelectorAll('.lang-option').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Save preference
        localStorage.setItem('niuniu_lang', lang);
        currentLang = lang;
        
        // Trigger font adjustments for certain languages (optional polish)
        document.body.className = `lang-${lang}`;
    };

    // Initialize Language
    applyLanguage(currentLang);

    // Language Switcher Events
    const langSwitcher = document.querySelector('.lang-switcher');
    const langBtn = document.getElementById('lang-btn');
    
    if (langBtn && langSwitcher) {
        // Toggle Dropdown
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langSwitcher.classList.toggle('open');
        });

        // Handle Option Click
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedLang = e.currentTarget.getAttribute('data-lang');
                applyLanguage(selectedLang);
                langSwitcher.classList.remove('open');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', () => {
            langSwitcher.classList.remove('open');
        });
    }

});
