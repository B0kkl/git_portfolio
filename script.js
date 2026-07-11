document.addEventListener('DOMContentLoaded', () => {
    // ========== 1. Dynamic Footer Year ==========
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // ========== 2. Counter Animation for Dashboard Metrics ==========
    const animateCounters = () => {
        const counters = document.querySelectorAll('.metric-value');
        const speed = 200;

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            if (!target) return;

            const updateCount = () => {
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    const nextVal = count + inc;
                    counter.innerText = target % 1 === 0 ? Math.ceil(nextVal) : nextVal.toFixed(1);
                    setTimeout(updateCount, 1);
                } else {
                    if (target === 99.9) counter.innerText = '99.9%';
                    else if (target === 40 || target === 30 || target === 500) counter.innerText = target + '+';
                    else if (target === 85) counter.innerText = target + '%';
                }
            };
            updateCount();
        });
    };

    // ========== 3. Intersection Observer for animations ==========
    const observerOptions = { threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'dashboard') {
                    animateCounters();
                }
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // ========== 4. Smooth scroll with offset for sticky header ==========
    const headerHeight = document.querySelector('header').offsetHeight;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== 5. Mobile Hamburger Menu ==========
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    const toggleMenu = () => {
        const isActive = navMenu.classList.contains('active');
        if (isActive) {
            navMenu.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            overlay.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        } else {
            navMenu.classList.add('active');
            hamburgerBtn.classList.add('active');
            overlay.classList.add('active');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
    };

    hamburgerBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Close menu when a nav link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ========== 6. Back to Top Button ==========
    const backToTopBtn = document.getElementById('back-to-top');

    const toggleBackToTop = () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ========== 7. Contact Form Validation ==========
    const form = document.getElementById('message-form');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    const showError = (input, errorEl, message) => {
        input.classList.add('error');
        errorEl.textContent = message;
    };

    const clearError = (input, errorEl) => {
        input.classList.remove('error');
        errorEl.textContent = '';
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Real-time validation on blur
    nameInput.addEventListener('blur', () => {
        if (nameInput.value.trim() === '') {
            showError(nameInput, nameError, 'Please enter your name.');
        } else if (nameInput.value.trim().length < 2) {
            showError(nameInput, nameError, 'Name must be at least 2 characters.');
        } else {
            clearError(nameInput, nameError);
        }
    });

    emailInput.addEventListener('blur', () => {
        if (emailInput.value.trim() === '') {
            showError(emailInput, emailError, 'Please enter your email.');
        } else if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, emailError, 'Please enter a valid email address.');
        } else {
            clearError(emailInput, emailError);
        }
    });

    messageInput.addEventListener('blur', () => {
        if (messageInput.value.trim() === '') {
            showError(messageInput, messageError, 'Please enter a message.');
        } else if (messageInput.value.trim().length < 10) {
            showError(messageInput, messageError, 'Message must be at least 10 characters.');
        } else {
            clearError(messageInput, messageError);
        }
    });

    // Clear errors on input
    nameInput.addEventListener('input', () => clearError(nameInput, nameError));
    emailInput.addEventListener('input', () => clearError(emailInput, emailError));
    messageInput.addEventListener('input', () => clearError(messageInput, messageError));

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate all fields
        if (nameInput.value.trim() === '' || nameInput.value.trim().length < 2) {
            showError(nameInput, nameError, 'Please enter your name (min 2 characters).');
            isValid = false;
        }

        if (emailInput.value.trim() === '' || !validateEmail(emailInput.value.trim())) {
            showError(emailInput, emailError, 'Please enter a valid email address.');
            isValid = false;
        }

        if (messageInput.value.trim() === '' || messageInput.value.trim().length < 10) {
            showError(messageInput, messageError, 'Message must be at least 10 characters.');
            isValid = false;
        }

        if (isValid) {
            // Build mailto link as fallback (can be replaced with Formspree/Netlify endpoint)
            const subject = encodeURIComponent('Portfolio Contact: ' + nameInput.value.trim());
            const body = encodeURIComponent(
                'Name: ' + nameInput.value.trim() + '\n' +
                'Email: ' + emailInput.value.trim() + '\n\n' +
                messageInput.value.trim()
            );
            window.location.href = 'mailto:hmwachikumbah@gmail.com?subject=' + subject + '&body=' + body;

            // Reset form
            form.reset();
        }
    });

    // ========== 8. Console Easter Egg ==========
    console.log('%c System Initialized: 24/7 Automated Monitoring Active. ',
        'background:#0a0e14;color:#00ffaa;padding:8px 12px;border-radius:4px;font-family:monospace;');
    console.log('%c Hussein Mwachikumba — ICT & Systems Engineer ',
        'color:#00d4ff;font-family:monospace;');
    console.log('%c github.com/B0kkl ',
        'color:#8b949e;font-family:monospace;');
});