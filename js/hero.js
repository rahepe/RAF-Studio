/* ============================================
   RAF Studio — Hero Motion
   GSAP: magnetic buttons + headline reveal
   (The opening-laptop visual is pure CSS — see main.css)
   ============================================ */

(function () {
  'use strict';

  // ─── Magnetic Button Effect (desktop pointers only) ──
  function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const magneticBtns = document.querySelectorAll('.btn--primary, .btn--secondary, .btn--ghost, #nav-cta');

    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.3, ease: 'power2.out' });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1.1, 0.4)' });
      });
    });
  }

  // ─── Headline Split Reveal ───────────────────────────
  function initHeadlineReveals() {
    const headline = document.querySelector('.hero__headline');
    if (!headline) return;

    // Wrap each line (split on <br>) in a masked, translated span
    const lines = headline.innerHTML.split('<br>');
    headline.innerHTML = lines
      .map(
        (line) =>
          `<div class="split-line-wrapper" style="overflow:hidden; display:block;"><span class="split-line-content" style="display:inline-block; transform:translateY(110%); opacity:0;">${line}</span></div>`
      )
      .join('');

    gsap
      .timeline({ delay: 0.3 })
      .to('.split-line-content', { y: 0, opacity: 1, duration: 1.1, stagger: 0.18, ease: 'power4.out' })
      .to('.hero__subheadline', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .to('.hero__actions .btn', { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, '-=0.5');
  }

  // ─── Scroll-linked lid close ─────────────────────────
  // Laptop opens on load; as the hero scrolls away the lid closes and the
  // device recedes, pulling attention down to the rest of the site.
  function initScrollClose() {
    const lid = document.querySelector('.device__screen');
    const device = document.querySelector('.device');
    const hero = document.getElementById('hero');
    if (!lid || !device || !hero) return;

    const CLOSE_DEG = 74;     // how far the lid folds shut at full scroll
    const FADE_TO = 0.5;      // device opacity at full scroll
    let target = 0;
    let current = 0;

    function computeTarget() {
      // close within a screen-and-a-bit of scroll so the fold is visible
      // while the laptop is still on screen (not after it has scrolled away)
      const range = window.innerHeight * 0.7;
      target = Math.min(Math.max(window.scrollY / range, 0), 1);
    }

    function render() {
      // lerp toward target = "scrub" smoothing (feels tied to the scrollbar)
      current += (target - current) * 0.1;
      if (Math.abs(target - current) < 0.0005) current = target;
      lid.style.transform = `rotateX(${-(current * CLOSE_DEG)}deg)`;
      device.style.opacity = String(1 - current * (1 - FADE_TO));
      requestAnimationFrame(render);
    }

    // Take over the lid once the CSS open animation has finished
    let started = false;
    function takeOver() {
      if (started) return;
      started = true;
      lid.style.animation = 'none';
      lid.style.transform = 'rotateX(0deg)';
      window.addEventListener('scroll', computeTarget, { passive: true });
      window.addEventListener('resize', computeTarget);
      computeTarget();
      render();
    }

    lid.addEventListener('animationend', (e) => {
      if (e.animationName === 'lidOpen') takeOver();
    });
    setTimeout(takeOver, 2200); // fallback if animationend is missed
  }

  // ─── Init ────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    // GSAP-driven flourishes (skipped gracefully if the CDN fails to load)
    if (window.gsap) {
      gsap.set('.hero__subheadline, .hero__actions .btn', { opacity: 0, y: 15 });
      initHeadlineReveals();
      initMagneticButtons();
    }
    // Core UX — pure DOM/CSS, always runs
    initScrollClose();
  });
})();
