/* ============================================
   RAF Studio — Main JavaScript
   Navigation, scroll, FAQ, interactions
   ============================================ */

(function () {
  'use strict';

  const WHATSAPP = 'https://wa.me/5555991057186';

  // ─── Navigation ───────────────────────────────────
  function initNav() {
    const nav = document.getElementById('nav');
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('nav-mobile-menu');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    if (!nav) return;

    // Scroll state
    function onScroll() {
      const scrolled = window.scrollY > 40;
      nav.classList.toggle('scrolled', scrolled);

      // Progress bar
      const progress = document.getElementById('scroll-progress');
      if (progress) {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
        progress.style.width = pct + '%';
      }

      // Back to top
      const backToTop = document.getElementById('back-to-top');
      if (backToTop) {
        backToTop.classList.toggle('visible', window.scrollY > 400);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load

    // Hamburger toggle
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        hamburger.setAttribute('aria-expanded', isOpen);
      });

      mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  // ─── Smooth Scroll ────────────────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
          10
        ) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  // ─── Back to Top ──────────────────────────────────
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── FAQ Accordion ────────────────────────────────
  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach((item) => {
      const trigger = item.querySelector('.faq-item__trigger');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all
        items.forEach((i) => {
          i.classList.remove('open');
          const body = i.querySelector('.faq-item__body');
          if (body) body.style.maxHeight = null;
        });

        // Open clicked if was closed
        if (!isOpen) {
          item.classList.add('open');
          const body = item.querySelector('.faq-item__body');
          if (body) {
            body.style.maxHeight = body.scrollHeight + 'px';
          }
        }
      });
    });
  }

  // ─── WhatsApp links ───────────────────────────────
  function initWhatsAppLinks() {
    document.querySelectorAll('[data-whatsapp]').forEach((el) => {
      const msg = el.dataset.whatsapp || '';
      const url = msg
        ? `${WHATSAPP}?text=${encodeURIComponent(msg)}`
        : WHATSAPP;
      el.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(url, '_blank');
      });
    });
  }

  // ─── Active nav link on scroll ────────────────────
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.style.color =
                link.getAttribute('href') === '#' + entry.target.id
                  ? 'rgba(255,255,255,0.95)'
                  : '';
            });
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    sections.forEach((s) => obs.observe(s));
  }

  // ─── Hover cursor glow on cards (desktop only) ────
  function initCardGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.service-card, .benefit-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(99,102,241,0.06), transparent 70%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.background = '';
      });
    });
  }

  // ─── Init ─────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initSmoothScroll();
    initBackToTop();
    initFAQ();
    initWhatsAppLinks();
    initActiveNav();
    initCardGlow();
  });
})();
