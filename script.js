/* ========================================
   KARLA WOLLINGER REPRESENTAÇÕES
   JavaScript - Interatividade
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Loader ---
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 800);
    });
    // Fallback: hide loader after 3s max
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 3000);

    // --- Navbar Scroll ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlight
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- Mobile Menu ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- Scroll Animations (AOS-like) ---
    const animatedElements = document.querySelectorAll('[data-aos]');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // --- Hero Particles ---
    const particlesContainer = document.getElementById('particles');

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 8 + 6}s`;
        particle.style.animationDelay = `${Math.random() * 3}s`;
        particlesContainer.appendChild(particle);

        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }

    // Create initial particles
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createParticle(), i * 300);
    }
    // Continue creating particles
    setInterval(createParticle, 2000);

    // --- Counter Animation ---
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(el, target) {
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = Math.floor(eased * (target - start) + start);
            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    // --- Product Filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.produto-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.4s ease-out forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // --- Contact Form -> WhatsApp ---
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const tipo = document.getElementById('tipo').value;
        const empresa = document.getElementById('empresa').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();

        if (!nome || !telefone || !mensagem) {
            return;
        }

        const tipoLabel = tipo === 'empresa' ? 'Empresa (CNPJ)' : 'Pessoa Física (CPF)';

        let text = `Olá! Gostaria de fazer um orçamento.\n\n`;
        text += `*Nome:* ${nome}\n`;
        text += `*Telefone:* ${telefone}\n`;
        text += `*Tipo:* ${tipoLabel}\n`;
        if (empresa) text += `*Empresa:* ${empresa}\n`;
        text += `\n*Produtos desejados:*\n${mensagem}`;

        const encoded = encodeURIComponent(text);
        window.open(`https://wa.me/554198593242?text=${encoded}`, '_blank', 'noopener,noreferrer');
    });

    // --- Phone mask ---
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 6) {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        } else if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else if (value.length > 0) {
            value = `(${value}`;
        }
        e.target.value = value;
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- WhatsApp button visibility ---
    const whatsappFloat = document.getElementById('whatsappFloat');
    let whatsappVisible = false;

    function toggleWhatsapp() {
        if (window.scrollY > 400 && !whatsappVisible) {
            whatsappFloat.style.display = 'flex';
            whatsappFloat.style.animation = 'fadeInUp 0.4s ease-out';
            whatsappVisible = true;
        } else if (window.scrollY <= 400 && whatsappVisible) {
            whatsappFloat.style.display = 'none';
            whatsappVisible = false;
        }
    }

    whatsappFloat.style.display = 'none';
    window.addEventListener('scroll', toggleWhatsapp, { passive: true });

});

/* Simple fadeInUp for filter animation */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
