(() => {
    'use strict';

    const form = document.getElementById('leadForm');
    const success = document.getElementById('formSuccess');
    const submitBtn = form.querySelector('.submit-btn');

    const validators = {
        name: (v) => v.trim().length >= 2 || 'Bitte geben Sie Ihren Namen an.',
        betrieb: (v) => v.trim().length >= 2 || 'Bitte geben Sie Ihren Betrieb an.',
        telefon: (v) => /^[+\d][\d\s\-/()]{6,}$/.test(v.trim()) || 'Bitte eine gültige Telefonnummer eingeben.',
        email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Bitte eine gültige E-Mail-Adresse eingeben.',
    };

    const showError = (field, message) => {
        const wrap = field.closest('.field');
        wrap.classList.add('invalid');
        const errEl = wrap.querySelector('.field-error');
        if (errEl) errEl.textContent = message;
    };

    const clearError = (field) => {
        const wrap = field.closest('.field');
        wrap.classList.remove('invalid');
        const errEl = wrap.querySelector('.field-error');
        if (errEl) errEl.textContent = '';
    };

    const validateField = (field) => {
        const validator = validators[field.name];
        if (!validator) return true;
        const result = validator(field.value);
        if (result === true) {
            clearError(field);
            return true;
        }
        showError(field, result);
        return false;
    };

    form.querySelectorAll('input').forEach((input) => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.closest('.field').classList.contains('invalid')) {
                validateField(input);
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fields = Array.from(form.querySelectorAll('input'));
        const allValid = fields.map(validateField).every(Boolean);

        if (!allValid) {
            const firstInvalid = form.querySelector('.field.invalid input');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        submitBtn.classList.add('loading');
        const labelEl = submitBtn.querySelector('.btn-label');
        const originalLabel = labelEl.textContent;
        labelEl.textContent = 'Wird gesendet';

        await new Promise((r) => setTimeout(r, 1200));

        form.classList.add('hidden');
        success.classList.add('active');

        submitBtn.classList.remove('loading');
        labelEl.textContent = originalLabel;

        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    const revealTargets = document.querySelectorAll('.benefit-card, .section-head, .cta-inner');
    revealTargets.forEach((el) => el.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => entry.target.classList.add('visible'), i * 90);
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
        );
        revealTargets.forEach((el) => io.observe(el));
    } else {
        revealTargets.forEach((el) => el.classList.add('visible'));
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                const firstInput = target.querySelector('input');
                if (firstInput) setTimeout(() => firstInput.focus(), 600);
            }
        });
    });

    document.querySelectorAll('.bg-glow').forEach((glow, idx) => {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * (idx === 0 ? 30 : -30);
            const y = (e.clientY / window.innerHeight - 0.5) * (idx === 0 ? 30 : -30);
            glow.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
})();
