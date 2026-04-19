// ============================================
// Advanced AI Portfolio JavaScript
// ============================================

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }
    }, 1500);
});

// ============================================
// Custom Cursor
// ============================================
const cursor = document.createElement('div');
cursor.className = 'cursor';
document.body.appendChild(cursor);

const cursorDot = document.createElement('div');
cursorDot.className = 'cursor-dot';
document.body.appendChild(cursorDot);

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    cursorX += dx * 0.1;
    cursorY += dy * 0.1;
    cursor.style.left = cursorX - 10 + 'px';
    cursor.style.top = cursorY - 10 + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover effects
document.querySelectorAll('a, button, .skill-tag, .project-card, .stat, .timeline-content, .education-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ============================================
// Particle Network Background (Neural Network Visualization)
// ============================================
const particleCanvas = document.getElementById('particleCanvas');
if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.color = `rgba(0, 212, 255, ${Math.random() * 0.5 + 0.2})`;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > particleCanvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > particleCanvas.height) this.vy *= -1;

            // Attract to mouse
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                this.x += dx * 0.01;
                this.y += dy * 0.01;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00d4ff';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function initParticles() {
        particles = [];
        const particleCount = Math.floor((particleCanvas.width * particleCanvas.height) / 15000);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.4;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // Draw connection to mouse
            const dx = mouseX - particles[i].x;
            const dy = mouseY - particles[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                const opacity = (1 - distance / 150) * 0.6;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(181, 55, 242, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        animationId = requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// ============================================
// Matrix Rain Effect
// ============================================
const matrixCanvas = document.getElementById('matrixCanvas');
if (matrixCanvas) {
    const mctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = matrixCanvas.width / fontSize;
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    function drawMatrix() {
        mctx.fillStyle = 'rgba(5, 8, 22, 0.05)';
        mctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        mctx.fillStyle = '#00d4ff';
        mctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            mctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 50);

    window.addEventListener('resize', () => {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    });
}

// ============================================
// Smooth scrolling for navigation links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// Mobile navigation toggle
// ============================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// ============================================
// Navbar scroll effect
// ============================================
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        navbar.style.background = 'rgba(10, 14, 39, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 212, 255, 0.2)';
    } else {
        navbar.style.background = 'rgba(10, 14, 39, 0.85)';
        navbar.style.boxShadow = 'none';
    }
});

// ============================================
// Back to top button
// ============================================
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Typing effect for hero title with rotating text
// ============================================
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const phrases = [
        'AI Engineer | Building Production-Grade AI Systems',
        'Machine Learning Specialist | RAG Pipelines & LLMs',
        'Data Engineer | Scalable Cloud Architectures',
        'NLP Expert | Semantic Search & Embeddings',
        'Full-Stack AI Developer | Python | PostgreSQL | AWS'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (isPaused) {
            setTimeout(() => {
                isPaused = false;
                typeEffect();
            }, 2000);
            return;
        }

        if (!isDeleting) {
            heroTitle.innerHTML = currentPhrase.substring(0, charIndex + 1) + '<span class="typing-cursor">|</span>';
            charIndex++;

            if (charIndex === currentPhrase.length) {
                isPaused = true;
                isDeleting = true;
            }
        } else {
            heroTitle.innerHTML = currentPhrase.substring(0, charIndex - 1) + '<span class="typing-cursor">|</span>';
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
        }

        const typingSpeed = isDeleting ? 30 : 60;
        setTimeout(typeEffect, typingSpeed);
    }

    setTimeout(typeEffect, 1000);
}

// Add typing cursor style
const typingCursorStyle = document.createElement('style');
typingCursorStyle.textContent = `
    .typing-cursor {
        color: #00d4ff;
        animation: blink 0.8s infinite;
        font-weight: 700;
    }
`;
document.head.appendChild(typingCursorStyle);

// ============================================
// Intersection Observer for scroll animations
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const animateElements = document.querySelectorAll('.project-card, .education-card, .stat, .skill-category');
animateElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px) scale(0.95)';
    element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(element);
});

// Timeline animations with stagger
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 150);
            timelineObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.timeline-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    timelineObserver.observe(item);
});

// ============================================
// 3D Tilt effect for project cards
// ============================================
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ============================================
// Magnetic button effect
// ============================================
document.querySelectorAll('.btn, .email-button').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) translateY(-3px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ============================================
// Counter animation for stats
// ============================================
function animateCounter(element, target, duration = 2000, decimals = 0) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            if (decimals > 0) {
                element.textContent = start.toFixed(decimals);
            } else {
                element.textContent = Math.floor(start) + '+';
            }
            requestAnimationFrame(updateCounter);
        } else {
            if (decimals > 0) {
                element.textContent = target.toFixed(decimals);
            } else {
                element.textContent = target + '+';
            }
        }
    }
    updateCounter();
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(number => {
                const text = number.textContent;
                const isFloat = text.includes('.');
                const target = parseFloat(text);

                if (isFloat) {
                    number.textContent = '0.00';
                    animateCounter(number, target, 2000, 2);
                } else {
                    number.textContent = '0';
                    animateCounter(number, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ============================================
// Active nav link highlighting
// ============================================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}
window.addEventListener('scroll', updateActiveNavLink);

// ============================================
// Text Scramble Effect
// ============================================
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span style="color: #00d4ff;">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Apply scramble effect to section titles when they come into view
const scrambleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const title = entry.target;
            const originalText = title.textContent.replace('{ ', '').replace(' }', '').trim();
            const scrambler = new TextScramble(title);
            scrambler.setText(originalText);
            scrambleObserver.unobserve(title);
        }
    });
}, { threshold: 0.5 });

// ============================================
// Parallax effect for hero section
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    const profileImage = document.querySelector('.profile-image-container');

    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }

    if (profileImage && scrolled < window.innerHeight) {
        profileImage.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

// ============================================
// Console Easter eggs for AI theme
// ============================================
console.log('%c╔══════════════════════════════════════════════╗', 'color: #00d4ff; font-weight: bold;');
console.log('%c║   SRIYA POTHULA - AI ENGINEER PORTFOLIO     ║', 'color: #00d4ff; font-weight: bold; font-size: 14px;');
console.log('%c╚══════════════════════════════════════════════╝', 'color: #00d4ff; font-weight: bold;');
console.log('%c> Initializing neural networks...', 'color: #00ff9d; font-family: monospace;');
console.log('%c> Loading AI models...', 'color: #00ff9d; font-family: monospace;');
console.log('%c> System ready. Welcome, explorer! 🤖', 'color: #b537f2; font-family: monospace; font-size: 14px;');
console.log('%c> Contact: sriyasriya569@gmail.com', 'color: #ff006e; font-family: monospace;');
console.log('%c\n💡 Built with Python, LLMs, RAG, Streamlit, and lots of coffee ☕', 'color: #fee140; font-style: italic;');

// ============================================
// Konami code easter egg
// ============================================
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            document.body.style.animation = 'gradientShift 3s ease infinite';
            console.log('%c🎉 KONAMI CODE ACTIVATED! AI POWER UNLOCKED! 🚀', 'color: #ff006e; font-size: 20px; font-weight: bold;');
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// ============================================
// Smooth page load animations
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 1800);
    }
});
