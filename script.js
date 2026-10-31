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

    // --- 4. Галерија: Филмска лента (Film Strip 3D Carousel) и Lightbox ---
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImage = document.getElementById('gallery-lightbox-image');
    const closeLightbox = document.querySelector('.gallery-lightbox-close');
    const previousImage = document.querySelector('.gallery-lightbox-prev');
    const nextImage = document.querySelector('.gallery-lightbox-next');
    const placeholderImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420">
            <rect width="600" height="420" fill="#d8c7b4"/>
            <path d="M0 320 L145 180 L250 275 L370 130 L600 340 V420 H0Z" fill="#b38b63" opacity=".7"/>
            <text x="300" y="235" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="28">Додадете фотографија</text>
        </svg>`)} `;

    // Собирање на сите уникатни слики за Lightbox преглед
    const allUniqueImages = [];
    document.querySelectorAll('.project-card').forEach(card => {
        card.querySelectorAll('.gallery-item').forEach(item => {
            const img = item.querySelector('img');
            if (img) {
                const src = img.getAttribute('src');
                const alt = item.dataset.galleryAlt || img.getAttribute('alt') || '';
                const lightboxIdx = allUniqueImages.length;
                item.dataset.lightboxIndex = lightboxIdx;
                allUniqueImages.push({ src, alt });

                img.addEventListener('error', () => {
                    img.src = placeholderImage;
                    img.alt = 'Место за фотографија';
                }, { once: true });
            }
        });
    });

    let activeLightboxIndex = 0;

    function openLightbox(index) {
        if (!lightbox || !lightboxImage || !allUniqueImages.length) return;
        activeLightboxIndex = (index + allUniqueImages.length) % allUniqueImages.length;
        const target = allUniqueImages[activeLightboxIndex];
        lightboxImage.src = target.src;
        lightboxImage.alt = target.alt;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeLightbox?.focus();
    }

    function closeGalleryLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function showAdjacentLightboxImage(direction) {
        openLightbox(activeLightboxIndex + direction);
    }

    closeLightbox?.addEventListener('click', closeGalleryLightbox);
    previousImage?.addEventListener('click', () => showAdjacentLightboxImage(-1));
    nextImage?.addEventListener('click', () => showAdjacentLightboxImage(1));

    lightbox?.addEventListener('click', (event) => {
        if (event.target === lightbox) closeGalleryLightbox();
    });

    document.addEventListener('keydown', (event) => {
        if (!lightbox?.classList.contains('is-open')) return;
        if (event.key === 'Escape') closeGalleryLightbox();
        if (event.key === 'ArrowLeft') showAdjacentLightboxImage(-1);
        if (event.key === 'ArrowRight') showAdjacentLightboxImage(1);
    });

    // --- Иницијализација на секој 3D кружен карусел ---
    const carouselContainers = document.querySelectorAll('.carousel-container, .filmstrip-container');

    carouselContainers.forEach(container => {
        const viewport = container.querySelector('.carousel-viewport, .filmstrip-viewport');
        const track = container.querySelector('.carousel-track, .filmstrip-track');
        const prevBtn = container.querySelector('.carousel-prev, .film-prev');
        const nextBtn = container.querySelector('.carousel-next, .film-next');
        const counterEl = container.querySelector('.carousel-counter, .filmstrip-counter');

        if (!viewport || !track) return;

        let originalItems = Array.from(track.querySelectorAll('.gallery-item'));
        const totalUnique = originalItems.length;

        // Обезбедуваме 6 позиции на тркалото за совршено континуирано 3D вртење во круг
        if (totalUnique > 0 && totalUnique < 6) {
            const neededClones = totalUnique <= 2 ? 4 : 3;
            for (let c = 0; c < neededClones; c++) {
                const orig = originalItems[c % totalUnique];
                const clone = orig.cloneNode(true);
                clone.classList.add('is-clone');
                clone.dataset.lightboxIndex = orig.dataset.lightboxIndex;
                const img = clone.querySelector('img');
                if (img) {
                    img.addEventListener('error', () => {
                        img.src = placeholderImage;
                        img.alt = 'Место за фотографија';
                    }, { once: true });
                }
                track.appendChild(clone);
            }
        }

        let allFrames = Array.from(track.querySelectorAll('.gallery-item'));
        const N = allFrames.length;
        let currentIndex = 0;

        function updateLayout() {
            const isMobile = window.innerWidth <= 768;

            // ИСПРАВЕНО: поголемо растојание по X, поголема длабочина по Z
            // и помала ротација, за страничните слики да не ја сечат централната.
            const stepX = isMobile ? 220 : 400;
            const stepZ = isMobile ? -130 : -200;
            const rotY = isMobile ? 50 : 45;
            const centerZ = isMobile ? 45 : 120;

            allFrames.forEach((frame, idx) => {
                let offset = (idx - currentIndex) % N;
                if (offset > N / 2) offset -= N;
                if (offset < -N / 2) offset += N;

                if (offset === 0) {
                    // Централна слика - најблиску до гледачот
                    frame.style.transform = `translateX(0px) translateZ(${centerZ}px) rotateY(0deg) scale(1)`;
                    frame.style.opacity = '1';
                    frame.style.filter = 'brightness(1)';
                    frame.style.zIndex = '4';
                    frame.style.pointerEvents = 'auto';
                    frame.classList.add('is-active');
                } else if (offset === 1) {
                    // Слика на десната страна на тркалото
                    frame.style.transform = `translateX(${stepX}px) translateZ(${stepZ}px) rotateY(${rotY}deg) scale(0.84)`;
                    frame.style.opacity = '0.88';
                    frame.style.filter = 'brightness(0.92)';
                    frame.style.zIndex = '3';
                    frame.style.pointerEvents = 'auto';
                    frame.classList.remove('is-active');
                } else if (offset === -1) {
                    // Слика на левата страна на тркалото
                    frame.style.transform = `translateX(${-stepX}px) translateZ(${stepZ}px) rotateY(${-rotY}deg) scale(0.84)`;
                    frame.style.opacity = '0.88';
                    frame.style.filter = 'brightness(0.92)';
                    frame.style.zIndex = '3';
                    frame.style.pointerEvents = 'auto';
                    frame.classList.remove('is-active');
                } else if (offset === 2) {
                    // Заден десен квадрант на тркалото
                    const backX = isMobile ? 260 : 520;
                    const backZ = isMobile ? -240 : -420;
                    const backRotY = isMobile ? 92 : 96;
                    frame.style.transform = `translateX(${backX}px) translateZ(${backZ}px) rotateY(${backRotY}deg) scale(0.66)`;
                    frame.style.opacity = '0.3';
                    frame.style.filter = 'brightness(0.78)';
                    frame.style.zIndex = '1';
                    frame.style.pointerEvents = 'none';
                    frame.classList.remove('is-active');
                } else if (offset === -2) {
                    // Заден лев квадрант на тркалото
                    const backX = isMobile ? 260 : 520;
                    const backZ = isMobile ? -240 : -420;
                    const backRotY = isMobile ? 92 : 96;
                    frame.style.transform = `translateX(${-backX}px) translateZ(${backZ}px) rotateY(${-backRotY}deg) scale(0.66)`;
                    frame.style.opacity = '0.3';
                    frame.style.filter = 'brightness(0.78)';
                    frame.style.zIndex = '1';
                    frame.style.pointerEvents = 'none';
                    frame.classList.remove('is-active');
                } else {
                    // Задна страна на тркалото (директно наспроти предната)
                    const farBackZ = isMobile ? -300 : -520;
                    frame.style.transform = `translateX(0px) translateZ(${farBackZ}px) rotateY(180deg) scale(0.55)`;
                    frame.style.opacity = '0';
                    frame.style.filter = 'brightness(0.7)';
                    frame.style.zIndex = '1';
                    frame.style.pointerEvents = 'none';
                    frame.classList.remove('is-active');
                }
            });

            if (counterEl) {
                const currentNum = ((currentIndex % totalUnique) + totalUnique) % totalUnique + 1;
                counterEl.innerHTML = `<span class="current-index">${currentNum}</span> / <span class="total-count">${totalUnique}</span>`;
            }
        }

        function rotate(direction) {
            currentIndex = (currentIndex + direction + N) % N;
            updateLayout();
        }

        prevBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            rotate(-1);
        });

        nextBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            rotate(1);
        });

        // Клик на слика: ако е активна отвора Lightbox, ако е странична ротира до неа
        allFrames.forEach((frame, idx) => {
            frame.addEventListener('click', (e) => {
                let offset = (idx - currentIndex) % N;
                if (offset > N / 2) offset -= N;
                if (offset < -N / 2) offset += N;

                if (offset === 0) {
                    const lbIdx = parseInt(frame.dataset.lightboxIndex, 10);
                    if (!isNaN(lbIdx)) openLightbox(lbIdx);
                } else {
                    currentIndex = idx;
                    updateLayout();
                }
            });
        });

        // Drag & Touch Swipe поддршка
        let startX = 0;
        let isDown = false;
        let hasMoved = false;

        viewport.addEventListener('mousedown', (e) => {
            isDown = true;
            hasMoved = false;
            startX = e.pageX;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            const diff = e.pageX - startX;
            if (Math.abs(diff) > 10) hasMoved = true;
        });

        window.addEventListener('mouseup', (e) => {
            if (!isDown) return;
            isDown = false;
            const diff = e.pageX - startX;
            if (hasMoved && Math.abs(diff) > 40) {
                if (diff > 0) rotate(-1);
                else rotate(1);
            }
        });

        // Touch поддршка за мобилни
        viewport.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                startX = e.touches[0].pageX;
                hasMoved = false;
            }
        }, { passive: true });

        viewport.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const diff = e.touches[0].pageX - startX;
                if (Math.abs(diff) > 10) hasMoved = true;
            }
        }, { passive: true });

        viewport.addEventListener('touchend', (e) => {
            if (hasMoved && e.changedTouches.length === 1) {
                const diff = e.changedTouches[0].pageX - startX;
                if (Math.abs(diff) > 35) {
                    if (diff > 0) rotate(-1);
                    else rotate(1);
                }
            }
        });

        // Скрол со тркалце на глувче (Mouse wheel)
        let wheelDebounce = false;
        viewport.addEventListener('wheel', (e) => {
            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (Math.abs(delta) > 15) {
                e.preventDefault();
                if (!wheelDebounce) {
                    wheelDebounce = true;
                    rotate(delta > 0 ? 1 : -1);
                    setTimeout(() => { wheelDebounce = false; }, 320);
                }
            }
        }, { passive: false });

        // Респонзивен приказ при промена на големина на прозорец
        window.addEventListener('resize', updateLayout);

        // Почетно исцртување
        updateLayout();
    });

});