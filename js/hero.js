/* ============================================
   RAF Studio — Hero Motion
   GSAP: magnetic buttons + headline reveal
   (The network visual lives in js/network-canvas.js)
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

  // ─── Init ────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    // GSAP-driven flourishes (skipped gracefully if the CDN fails to load)
    if (window.gsap) {
      gsap.set('.hero__subheadline, .hero__actions .btn', { opacity: 0, y: 15 });
      initHeadlineReveals();
      initMagneticButtons();
    }
  });
})();
