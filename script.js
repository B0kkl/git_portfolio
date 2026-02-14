document.addEventListener('DOMContentLoaded', () => {
    // 1. Counter Animation for Dashboard Metrics
    const animateCounters = () => {
        const counters = document.querySelectorAll('.metric-value');
        const speed = 200; // Lower is faster

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            if (!target) return; // Skip if no numeric target

            const updateCount = () => {
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    const nextVal = count + inc;
                    counter.innerText = target % 1 === 0 ? Math.ceil(nextVal) : nextVal.toFixed(1);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target + (counter.getAttribute('data-target').includes('.') ? '' : '');
                    // For decimals like 99.9
                    if (target === 99.9) counter.innerText = '99.9%';
                    else if (target === 40 || target === 30 || target === 500) counter.innerText = target + '+';
                    else if (target === 85) counter.innerText = target + '%';
                }
            };
            updateCount();
        });
    };

    // 2. Intersection Observer for trigger animations
    const observerOptions = {
        threshold: 0.1
    };

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

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // 3. Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Simulated "Live Status" in console or small toast
    console.log("System Initialized: 24/7 Automated Monitoring Active.");
});
