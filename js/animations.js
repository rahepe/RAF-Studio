/* ============================================
   RAF Studio — Animations
   IntersectionObserver-driven entrance system
   ============================================ */

(function () {
  'use strict';

  // ─── Intersection Observer Setup ────────────────
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.08,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;

        setTimeout(() => {
          el.classList.add('visible');
        }, Number(delay));

        observer.unobserve(el);
      }
    });
  }, observerOptions);

  // Observe all animatable elements
  function initReveal() {
    const revealEls = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right'
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  // ─── Stagger children ────────────────────────────
  function staggerChildren(container, selector, baseDelay = 0, step = 80) {
    const children = container.querySelectorAll(selector);
    children.forEach((child, index) => {
      child.dataset.delay = baseDelay + index * step;
    });
  }

  // ─── Counter animation ───────────────────────────
  function animateCounter(el, target, duration = 1800, suffix = '') {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(start + (target - start) * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Counter observer
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.counter, 10);
            const suffix = el.dataset.suffix || '';
            animateCounter(el, target, 1600, suffix);
            counterObs.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => counterObs.observe(el));
  }

  // ─── Process step draw animation ─────────────────
  function initProcessLine() {
    const line = document.querySelector('.process__line');
    if (!line) return;

    const lineObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            line.style.transform = 'scaleX(1)';
            lineObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    lineObs.observe(line);
  }

  // ─── Parallax subtle effect ───────────────────────
  function initParallax() {
    const orbs = document.querySelectorAll('.hero__orb');
    if (!orbs.length) return;

    let ticking = false;
    document.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          const dx = (e.clientX - cx) / cx;
          const dy = (e.clientY - cy) / cy;

          orbs.forEach((orb, i) => {
            const factor = (i + 1) * 12;
            orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ─── Init ─────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initCounters();
    initParallax();

    // Stagger grids
    const problemGrid = document.querySelector('.problem__grid');
    if (problemGrid) staggerChildren(problemGrid, '.problem__card', 100, 120);

    const benefitsGrid = document.querySelector('.benefits__grid');
    if (benefitsGrid) staggerChildren(benefitsGrid, '.benefit-card', 80, 100);

    const servicesGrid = document.querySelector('.services__grid');
    if (servicesGrid) staggerChildren(servicesGrid, '.service-card', 80, 90);

    const portfolioGrid = document.querySelector('.portfolio__grid');
    if (portfolioGrid) staggerChildren(portfolioGrid, '.portfolio-card', 80, 120);

    const processSteps = document.querySelector('.process__steps');
    if (processSteps) staggerChildren(processSteps, '.process-step', 100, 100);
  });
})();
