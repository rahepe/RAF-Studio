/* ============================================
   RAF IA Solutions — Hero Network
   Canvas: uma rede de nós que se conectam por proximidade e reagem
   ao mouse — a "viagem" da tela até o mundo digital conectado.
   Substitui o antigo mockup estático de laptop abrindo/fechando.
   ============================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-network');
  if (!canvas || !canvas.getContext) return;

  const ctx = ctx2d(canvas);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ACCENT = '99,102,241';
  const ACCENT_LIGHT = '129,140,248';

  const NODE_COUNT = 42;
  const LINK_DIST = 150;
  const MOUSE_DIST = 170;
  const DEVICE_RATIO = 0.16; // fração de nós que viram pequenos "ícones de tela"

  let width = 0;
  let height = 0;
  let nodes = [];
  const mouse = { x: null, y: null };

  function ctx2d(c) {
    return c.getContext('2d');
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 1,
      isDevice: Math.random() < DEVICE_RATIO,
    }));
  }

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);

    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = width + 20;
      if (n.x > width + 20) n.x = -20;
      if (n.y < -20) n.y = height + 20;
      if (n.y > height + 20) n.y = -20;
    });

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < LINK_DIST) {
          ctx.strokeStyle = `rgba(${ACCENT_LIGHT},${(1 - dist / LINK_DIST) * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      if (mouse.x !== null) {
        const dist = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dist < MOUSE_DIST) {
          ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / MOUSE_DIST) * 0.45})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach((n) => {
      if (n.isDevice) {
        const w = n.r * 3.4;
        const h = w * 0.72;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.strokeStyle = `rgba(${ACCENT},0.9)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(n.x - w / 2, n.y - h / 2, w, h, 2);
        else ctx.rect(n.x - w / 2, n.y - h / 2, w, h);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(${ACCENT_LIGHT},0.9)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    if (!reduceMotion) requestAnimationFrame(drawFrame);
  }

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  function onMouseLeave() {
    mouse.x = null;
    mouse.y = null;
  }

  document.addEventListener('DOMContentLoaded', () => {
    resize();
    makeNodes();
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', () => {
      resize();
      makeNodes();
    });
    drawFrame();
  });
})();
