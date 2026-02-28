/* ═══════════════════════════════════════════════════════════
   KaizenAI Agency — Interactive Scripts
   ═══════════════════════════════════════════════════════════ */

// ─── Navbar scroll effect ───────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ─── Mobile menu toggle ─────────────────────────────────
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.querySelector('.nav-links');

mobileToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ─── Animated counter ───────────────────────────────────
function animateNumber(el, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * eased);

        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ─── Intersection Observer for animations ───────────────
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');

            // Animate numbers when results section is visible
            if (entry.target.id === 'results') {
                entry.target.querySelectorAll('.result-number').forEach(el => {
                    const target = parseInt(el.dataset.target);
                    if (target) animateNumber(el, target);
                });
            }

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ─── Smooth scroll for anchor links ─────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ─── Contact form handling ──────────────────────────────
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('contact-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    try {
        // Send to webhook endpoint on dashboard
        const response = await fetch('https://dashboard.kaizenai.agency/api/webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `🔔 NEW LEAD from kaizenai.agency\n\nName: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || 'N/A'}\nMessage: ${data.message || 'No message'}`,
                source: 'website',
                priority: 'high',
            }),
        });

        if (response.ok) {
            btn.innerHTML = '<span>✅ Message Sent!</span>';
            contactForm.reset();
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 3000);
        } else {
            throw new Error('Failed to send');
        }
    } catch (err) {
        // Fallback: mailto
        const subject = encodeURIComponent(`KaizenAI Inquiry from ${data.name}`);
        const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company}\n\n${data.message}`);
        window.location.href = `mailto:maximus@kaizenai.agency?subject=${subject}&body=${body}`;
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});

// ─── Add animation CSS ──────────────────────────────────
const style = document.createElement('style');
style.textContent = `
    section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    section.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    #hero {
        opacity: 1;
        transform: none;
    }
    .service-card, .result-card, .pricing-card, .process-step, .tech-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    section.animate-in .service-card,
    section.animate-in .result-card,
    section.animate-in .pricing-card,
    section.animate-in .process-step,
    section.animate-in .tech-item {
        opacity: 1;
        transform: translateY(0);
    }
    section.animate-in .service-card:nth-child(1),
    section.animate-in .result-card:nth-child(1),
    section.animate-in .pricing-card:nth-child(1),
    section.animate-in .process-step:nth-child(1),
    section.animate-in .tech-item:nth-child(1) { transition-delay: 0.1s; }
    section.animate-in .service-card:nth-child(2),
    section.animate-in .result-card:nth-child(2),
    section.animate-in .pricing-card:nth-child(2),
    section.animate-in .process-step:nth-child(2),
    section.animate-in .tech-item:nth-child(2) { transition-delay: 0.2s; }
    section.animate-in .service-card:nth-child(3),
    section.animate-in .result-card:nth-child(3),
    section.animate-in .pricing-card:nth-child(3),
    section.animate-in .process-step:nth-child(3),
    section.animate-in .tech-item:nth-child(3) { transition-delay: 0.3s; }
    section.animate-in .result-card:nth-child(4),
    section.animate-in .process-step:nth-child(4),
    section.animate-in .tech-item:nth-child(4) { transition-delay: 0.4s; }
    section.animate-in .tech-item:nth-child(5) { transition-delay: 0.5s; }
    section.animate-in .tech-item:nth-child(6) { transition-delay: 0.6s; }
    section.animate-in .tech-item:nth-child(7) { transition-delay: 0.7s; }
    section.animate-in .tech-item:nth-child(8) { transition-delay: 0.8s; }
`;
document.head.appendChild(style);

console.log('⚡ KaizenAI Agency — loaded');
