/* ===== 69 NiuNiu — Premium Animations Engine ===== */

(function () {
    'use strict';

    // ============ 1. GOLD PARTICLE SYSTEM ============
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 50;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedY = -(Math.random() * 0.3 + 0.1);
                this.speedX = (Math.random() - 0.5) * 0.2;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.fadeDir = Math.random() > 0.5 ? 0.003 : -0.003;
                // Gold color variations
                const golds = ['255,239,184', '214,160,48', '180,130,30'];
                this.color = golds[Math.floor(Math.random() * golds.length)];
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += this.fadeDir;
                if (this.opacity <= 0.05 || this.opacity >= 0.6) this.fadeDir *= -1;
                if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                    this.reset();
                    this.y = canvas.height + 10;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ============ 2. STAGGERED ENTRY ANIMATIONS ============
    const staggerItems = document.querySelectorAll('.stagger-item');
    
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find all siblings in the same parent that are stagger-items
                const parent = entry.target.parentElement;
                const siblings = parent.querySelectorAll('.stagger-item');
                let delay = 0;
                siblings.forEach(sib => {
                    if (!sib.classList.contains('visible')) {
                        setTimeout(() => {
                            sib.classList.add('visible');
                        }, delay);
                        delay += 100; // 100ms stagger
                    }
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    staggerItems.forEach(item => staggerObserver.observe(item));

    // ============ 3. COUNTUP ANIMATION ============
    const countupTargets = document.querySelectorAll('.countup-target');
    
    const countupObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                if (isNaN(target)) return;
                
                let current = 0;
                const duration = 1200; // ms
                const stepTime = 30;
                const steps = duration / stepTime;
                const increment = target / steps;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    // Preserve the suffix text (e.g., "倍" or "点")
                    const suffix = el.querySelector('span');
                    if (suffix) {
                        el.childNodes[0].textContent = Math.round(current);
                    } else {
                        el.textContent = Math.round(current);
                    }
                }, stepTime);
                
                countupObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    countupTargets.forEach(el => countupObserver.observe(el));

    // ============ 4. SECTION FADE-IN ============
    const sections = document.querySelectorAll('.content-section');
    
    // Add base hidden state
    sections.forEach(sec => {
        sec.style.opacity = '0';
        sec.style.transform = 'translateY(30px)';
        sec.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    sections.forEach(sec => sectionObserver.observe(sec));



})();
