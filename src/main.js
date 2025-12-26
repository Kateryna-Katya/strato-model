/**
 * STRATO-MODEL.BLOG 
 * Core Engine v1.1
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. ИКОНКИ (LUCIDE) ===
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // === 2. МОБИЛЬНОЕ МЕНЮ ===
    const burger = document.querySelector('.burger');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-link');

    const toggleMenu = () => {
        if (!burger || !menuOverlay) return;
        burger.classList.toggle('burger--active');
        menuOverlay.classList.toggle('menu-overlay--active');
        document.body.style.overflow = burger.classList.contains('burger--active') ? 'hidden' : '';
    };

    burger?.addEventListener('click', toggleMenu);
    menuLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // === 3. АНИМАЦИИ GSAP (HERO & REVEAL) ===
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Появление Hero сразу при загрузке
    tl.to(".hero__badge, .hero__title, .hero__descr, .hero__btns", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        delay: 0.2
    })
    .from(".hero__card", {
        scale: 0.9,
        rotateY: 20,
        opacity: 0,
        duration: 1.5
    }, "-=1");

    // Появление остальных секций при скролле
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.to(entry.target, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power3.out"
                });
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, { threshold: 0.1 });
    document.querySelectorAll('.reveal:not(.hero *)').forEach(el => {
        gsap.set(el, { opacity: 0, y: 50 });
        revealObserver.observe(el);
    });

    // === 4. ПАРАЛЛАКС И МАГНИТНЫЕ ЭФФЕКТЫ ===
    document.addEventListener("mousemove", (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5);
        const yPos = (clientY / window.innerHeight - 0.5);

        // Карточка в Hero
        const heroCard = document.querySelector(".hero__card");
        if (heroCard) {
            gsap.to(heroCard, { rotateY: xPos * 30, rotateX: -yPos * 30, duration: 1 });
        }

        // Рамка в About
        const aboutAccent = document.querySelector('.image-accent');
        if (aboutAccent) {
            gsap.to(aboutAccent, { x: xPos * 40, y: yPos * 40, duration: 1.5 });
        }

        // Плавающие элементы
        document.querySelectorAll(".float-element").forEach(el => {
            const speed = el.getAttribute("data-speed") || 2;
            gsap.to(el, { x: xPos * 60 * speed, y: yPos * 60 * speed, duration: 1.5 });
        });
    });

    // Магнитные кнопки
    document.querySelectorAll(".magnetic").forEach(el => {
        el.addEventListener("mousemove", function(e) {
            const pos = this.getBoundingClientRect();
            const x = e.clientX - pos.left - pos.width / 2;
            const y = e.clientY - pos.top - pos.height / 2;
            gsap.to(this, { x: x * 0.4, y: y * 0.4, duration: 0.6 });
        });
        el.addEventListener("mouseleave", function() {
            gsap.to(this, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
        });
    });

    // === 5. ВАЛИДАЦИЯ ТЕЛЕФОНА (ТОЛЬКО ЦИФРЫ) ===
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // === 6. КАПЧА И ФОРМА ОБРАТНОЙ СВЯЗИ ===
    const captchaLabel = document.getElementById('captchaLabel');
    const captchaInput = document.getElementById('captchaInput');
    const mainForm = document.getElementById('mainForm');
    let captchaResult = 0;

    const generateCaptcha = () => {
        if (!captchaLabel) return;
        const n1 = Math.floor(Math.random() * 10);
        const n2 = Math.floor(Math.random() * 6);
        captchaResult = n1 + n2;
        captchaLabel.textContent = `${n1} + ${n2} = ?`;
    };

    generateCaptcha();

    mainForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (parseInt(captchaInput.value) !== captchaResult) {
            alert('Ошибка капчи. Попробуйте еще раз.');
            generateCaptcha();
            captchaInput.value = '';
            return;
        }

        const btn = mainForm.querySelector('button');
        const successBox = document.getElementById('formSuccess');
        
        btn.disabled = true;
        btn.innerText = 'Отправка...';

        // Имитация AJAX
        setTimeout(() => {
            mainForm.reset();
            successBox?.classList.remove('hidden');
            btn.innerText = 'Заявка принята';
            generateCaptcha();
            setTimeout(() => {
                successBox?.classList.add('hidden');
                btn.disabled = false;
                btn.innerText = 'Отправить запрос';
            }, 5000);
        }, 1500);
    });

    // === 7. COOKIE POPUP (LOGIC) ===
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptBtn = document.getElementById('acceptCookies');

    if (cookiePopup && !localStorage.getItem('strato_cookie_consent')) {
        setTimeout(() => {
            cookiePopup.classList.add('cookie-popup--active');
        }, 3000);
    }

    acceptBtn?.addEventListener('click', () => {
        localStorage.setItem('strato_cookie_consent', 'true');
        cookiePopup.classList.remove('cookie-popup--active');
    });

    // === 8. ПЛАВНЫЙ СКРОЛЛ ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});