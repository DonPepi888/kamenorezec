document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Работа со Cookie Banner (Зачувување во localStorage) ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    // Проверка дали корисникот веќе ги прифатил колачињата
    if (localStorage.getItem('cookiesAccepted') === 'true') {
        if (cookieBanner) {
            cookieBanner.style.display = 'none';
        }
    }

    // Со клик на копчето, сокриј го банерот и запиши во прелистувачот
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            if (cookieBanner) {
                cookieBanner.style.display = 'none';
            }
        });
    }


    // --- 2. Мобилно мени - Затворање по клик на линк ---
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('#nav-menu a');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Кога ќе се кликне линк од менито на мобилен, затвори го менито
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });


    // --- 3. Скрол ефект на хедерот (Сенка при скролање) ---
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
        }
    });

});