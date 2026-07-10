// assets/js/main.js
// الوحدة الرئيسية - جميع الوظائف التفاعلية
;(function() {
    'use strict';

    // ===== Loading Screen =====
    const loading = document.getElementById('loading-screen');
    const progressBar = loading.querySelector('.loading-progress span');
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            loading.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }
        progressBar.style.width = progress + '%';
    }, 200);
    document.body.style.overflow = 'hidden';

    // ===== Custom Cursor =====
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, .btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            follower.style.transform = 'translate(-50%, -50%) scale(1.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // ===== Header Scroll Effect =====
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 100);
    });

    // ===== Mobile Menu =====
    const menuToggle = document.getElementById('menuToggle');
    const navList = document.querySelector('.nav-list');
    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('open');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('open');
        });
    });

    // ===== Scroll Progress =====
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = progress + '%';
    });

    // ===== Smooth Anchor + Active Link =====
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ===== Scroll Reveal Animations =====
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => revealObserver.observe(el));

    // ===== Project Filter & Gallery =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectsGrid = document.getElementById('projectsGrid');
    
    function renderProjects(category = 'all') {
        const filtered = category === 'all' ? projectsData : projectsData.filter(p => p.category === category);
        projectsGrid.innerHTML = filtered.map(project => `
            <div class="project-card glass" data-category="${project.category}">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-links">
                        <a href="${project.live}" target="_blank" rel="noopener">عرض مباشر</a>
                        <a href="${project.github}" target="_blank" rel="noopener">GitHub</a>
                        <a href="${project.caseStudy}">دراسة حالة</a>
                    </div>
                </div>
            </div>
        `).join('');
        document.querySelectorAll('.project-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        });
    }
    renderProjects();

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(btn.dataset.filter);
        });
    });

    // ===== Number Counter =====
    const statNumbers = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                let current = 0;
                const increment = Math.ceil(target / 60);
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = current;
                }, 25);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(num => counterObserver.observe(num));

    // ===== FAQ Accordion =====
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            item.classList.toggle('active');
            document.querySelectorAll('.faq-item.active').forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
        });
    });

    // ===== Tilt Cards (Hero) =====
    // ملاحظة: تم استبدال البطاقة بالكتاب، لكن نترك الكود لتعميم الاستخدام
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (x - centerX) / 10;
            card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0)';
        });
    });

    // ===== Magnetic Buttons =====
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ===== Contact Form =====
    const form = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            showToast('يرجى ملء جميع الحقول', 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('يرجى إدخال بريد إلكتروني صحيح', 'error');
            return;
        }

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        await new Promise(resolve => setTimeout(resolve, 2000));
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        showToast('تم إرسال رسالتك بنجاح! سأتواصل معك قريباً.', 'success');
        form.reset();
    });

    function showToast(msg, type) {
        toast.textContent = msg;
        toast.className = 'toast ' + type;
        setTimeout(() => {
            toast.className = 'toast';
        }, 4000);
    }

    // ===== Back to Top Button =====
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 300);
    });

    // ===== Particles Background (Hero) =====
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = 'rgba(69, 162, 158, 0.6)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(100, Math.floor(canvas.width * canvas.height / 9000));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.strokeStyle = `rgba(69, 162, 158, ${1 - dist / 150})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        animationId = requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // =============================================
    // ===== كود الكتاب ثلاثي الأبعاد (3D Book) =====
    // =============================================

    // عناصر الكتاب
    const book = document.querySelector('.book');
    const pages = document.querySelectorAll('.page');
    const prevBtn = document.querySelector('.book-nav.prev');
    const nextBtn = document.querySelector('.book-nav.next');
    const currentPageEl = document.querySelector('.current-page');
    const totalPagesEl = document.querySelector('.total-pages');

    if (book && pages.length > 0) {

        let currentPage = 0;
        const totalPages = pages.length;
        let isAnimating = false;

        if (totalPagesEl) {
            totalPagesEl.textContent = `/ ${totalPages}`;
        }

        function updateUI() {
            if (currentPageEl) {
                currentPageEl.textContent = currentPage + 1;
            }
            if (prevBtn) {
                const isFirst = (currentPage === 0);
                prevBtn.disabled = isFirst;
                prevBtn.style.opacity = isFirst ? '0.4' : '1';
                prevBtn.style.cursor = isFirst ? 'default' : 'pointer';
            }
            if (nextBtn) {
                const isLast = (currentPage === totalPages);
                nextBtn.disabled = isLast;
                nextBtn.style.opacity = isLast ? '0.4' : '1';
                nextBtn.style.cursor = isLast ? 'default' : 'pointer';
            }
            pages.forEach((page, index) => {
                if (page.classList.contains('flipped')) {
                    page.style.zIndex = 10 + index;
                } else {
                    page.style.zIndex = 2 - index;
                }
            });
        }

        function flipPage(direction) {
            if (isAnimating) return;

            const newPage = currentPage + direction;
            if (newPage < 0 || newPage > totalPages) return;
            if (direction === -1 && currentPage === 0) return;
            if (direction === 1 && currentPage === totalPages) return;

            isAnimating = true;

            const pageIndex = (direction === 1) ? currentPage : currentPage - 1;
            if (pageIndex < 0 || pageIndex >= totalPages) {
                isAnimating = false;
                return;
            }

            const page = pages[pageIndex];

            if (direction === 1) {
                page.classList.add('flipped');
            } else {
                page.classList.remove('flipped');
            }

            currentPage = newPage;
            updateUI();

            setTimeout(() => {
                isAnimating = false;
            }, 850);
        }

        // ربط الأزرار
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                flipPage(1);
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                flipPage(-1);
            });
        }

        // التنقل بالأسهم
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                if (e.key === 'ArrowLeft') {
                    flipPage(1);  // RTL
                } else {
                    flipPage(-1);
                }
            }
        });

        // السحب بالماوس واللمس
        let startX = 0;
        let isDragging = false;
        const bookContainer = document.querySelector('.book-container');

        if (bookContainer) {
            const handleStart = (clientX) => {
                startX = clientX;
                isDragging = true;
            };
            const handleMove = (clientX) => {
                if (!isDragging) return;
                const deltaX = clientX - startX;
                if (Math.abs(deltaX) > 40) {
                    if (deltaX < 0) {
                        flipPage(1);
                    } else {
                        flipPage(-1);
                    }
                    isDragging = false;
                    startX = 0;
                }
            };
            const handleEnd = () => {
                isDragging = false;
                startX = 0;
            };

            bookContainer.addEventListener('mousedown', (e) => handleStart(e.clientX));
            document.addEventListener('mousemove', (e) => handleMove(e.clientX));
            document.addEventListener('mouseup', handleEnd);

            bookContainer.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientX), { passive: true });
            document.addEventListener('touchmove', (e) => {
                if (isDragging) handleMove(e.touches[0].clientX);
            }, { passive: true });
            document.addEventListener('touchend', handleEnd, { passive: true });
        }

        // النقر على الصفحة
        pages.forEach((page, index) => {
            page.addEventListener('click', (e) => {
                if (e.target.closest('a') || e.target.closest('.btn-preview') || e.target.closest('.btn-details')) {
                    return;
                }
                if (!page.classList.contains('flipped')) {
                    if (currentPage <= index) {
                        flipPage(1);
                    }
                } else {
                    if (currentPage > index + 1) {
                        flipPage(-1);
                    }
                }
            });
        });

        // تأثير الإمالة
        if (bookContainer) {
            let tiltTimeout;
            bookContainer.addEventListener('mousemove', (e) => {
                clearTimeout(tiltTimeout);
                const rect = bookContainer.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                book.style.transform = `rotateY(${x * 5}deg) rotateX(${-y * 3}deg)`;
            });
            bookContainer.addEventListener('mouseleave', () => {
                tiltTimeout = setTimeout(() => {
                    book.style.transform = 'rotateY(-4deg) rotateX(2deg)';
                }, 100);
            });
        }

        updateUI();

        // فتح الصفحة الأولى بعد 1.5 ثانية
        setTimeout(() => {
            if (totalPages > 0) {
                flipPage(1);
            }
        }, 1500);

        // منع تحديد النص أثناء السحب
        document.addEventListener('selectstart', (e) => {
            if (isDragging) e.preventDefault();
        });

        console.log('📖 3D Portfolio Book ready!');
    }

})();