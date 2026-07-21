/* ============================================
   RAF Studio — Smooth Inertia Scroll Engine
   Pure Vanilla JS scroll momentum for desktop
   ============================================ */

(function () {
  'use strict';

  // Disable smooth scroll on mobile/touch devices for native performance
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) {
    document.documentElement.classList.add('is-touch');
    return;
  }

  document.documentElement.classList.add('is-desktop');

  // DOM Elements
  const wrapper = document.getElementById('smooth-wrapper');
  const content = document.getElementById('smooth-content');
  if (!wrapper || !content) return;

  // Variables
  let targetY = 0;
  let currentY = 0;
  const ease = 0.085; // Scroll momentum speed (lower = smoother/slower)

  // Style initialization
  function initStyles() {
    wrapper.style.position = 'fixed';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.width = '100%';
    wrapper.style.height = '100vh';
    wrapper.style.overflow = 'hidden';

    content.style.width = '100%';
    content.style.position = 'relative';
    content.style.willChange = 'transform';
  }

  // Set body height to match scrollable content
  function resizeBody() {
    const contentHeight = content.getBoundingClientRect().height;
    document.body.style.height = `${contentHeight}px`;
  }

  // Handle actual window scroll event
  function onScroll() {
    targetY = window.scrollY;
  }

  // Animation Loop
  function tick() {
    // Lerp calculation
    currentY += (targetY - currentY) * ease;

    // Apply transformation (translate3d for subpixel antialiasing & GPU acceleration)
    content.style.transform = `translate3d(0, -${Math.round(currentY * 100) / 100}px, 0)`;

    // Notify GSAP ScrollTrigger about the scroll update
    if (window.ScrollTrigger) {
      window.ScrollTrigger.update();
    }

    // Next frame
    requestAnimationFrame(tick);
  }

  // Setup Event Listeners
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', resizeBody);

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    initStyles();
    // Wait for images and layouts to load before measuring height
    setTimeout(() => {
      resizeBody();
      currentY = targetY = window.scrollY;
      tick();
    }, 200);

    // Re-check after full window load
    window.addEventListener('load', () => {
      resizeBody();
    });
  });

})();
