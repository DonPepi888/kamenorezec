document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Мобилно мени - Отварање / Затворање ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('#nav-menu a');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Затворање на менито при клик на некој од линковите
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });


    // --- 2. Работа со Cookie Banner (localStorage) ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (localStorage.getItem('cookiesAccepted') === 'true') {
        if (cookieBanner) {
            cookieBanner.style.display = 'none';
        }
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            if (cookieBanner) {
                cookieBanner.style.display = 'none';
            }
        });
    }


    // --- 3. Скрол ефект на хедерот (Сенка при скролање) ---
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
            }
        }
    });

});