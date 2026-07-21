/* ============================================
   RAF Studio — Interactive WebGL Visualizer
   Faceted Glassmorphic 3D Mockup with Cursor Tracking
   ============================================ */

(function () {
  'use strict';

  // Check WebGL and library support
  if (!window.THREE || !window.gsap) return;

  const container = document.getElementById('hero-interactive-container');
  const canvas = document.getElementById('hero-3d-canvas');
  const fallbackImg = document.getElementById('hero-fallback-image');
  if (!container || !canvas) return;

  // Verify WebGL availability
  function detectWebGL() {
    try {
      const canvasCheck = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvasCheck.getContext('webgl') || canvasCheck.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!detectWebGL()) {
    console.warn("WebGL not supported. Using high-quality static fallback image.");
    canvas.style.display = 'none';
    return;
  }

  // Fade out fallback image once WebGL is confirmed and running
  function startWebGLTransition() {
    if (fallbackImg) {
      gsap.to(fallbackImg, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => {
          fallbackImg.style.display = 'none';
        }
      });
    }
  }

  // ─── Scene Setup ──────────────────────────────────
  const scene = new THREE.Scene();

  // Dimensions based on parent container
  let width = container.clientWidth;
  let height = container.clientHeight || (width * 9 / 16);

  // Camera
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.z = 7;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ─── Lights ───────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambientLight);

  // Moving highlight light that tracks cursor
  const cursorLight = new THREE.PointLight(0x818CF8, 4, 15);
  cursorLight.position.set(2, 2, 4);
  scene.add(cursorLight);

  // Accent indigo lights
  const accentLight1 = new THREE.DirectionalLight(0x6366F1, 2);
  accentLight1.position.set(5, 5, 2);
  scene.add(accentLight1);

  const accentLight2 = new THREE.DirectionalLight(0x4F46E5, 1);
  accentLight2.position.set(-5, -3, 1);
  scene.add(accentLight2);

  // ─── Creating 3D Glassmorphic Device ─────────────
  const group = new THREE.Group();
  scene.add(group);

  // 1. Tablet Frame / Base Plate
  const frameGeom = new THREE.BoxGeometry(3.2, 1.8, 0.08);

  // Translucent premium glass material
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.08,
    metalness: 0.1,
    transmission: 0.9, // high refraction
    ior: 1.52,         // glass index of refraction
    thickness: 0.6,
    transparent: true,
    opacity: 0.95,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  const deviceFrame = new THREE.Mesh(frameGeom, glassMaterial);
  group.add(deviceFrame);

  // 2. Embedded Mock UI Elements (Geometric representation of a website layout)
  const uiGroup = new THREE.Group();
  uiGroup.position.z = 0.05; // float slightly in front of glass plate
  group.add(uiGroup);

  // Header line
  const headerGeom = new THREE.BoxGeometry(2.8, 0.15, 0.02);
  const headerMat = new THREE.MeshStandardMaterial({ color: 0x6366F1, roughness: 0.2 });
  const header = new THREE.Mesh(headerGeom, headerMat);
  header.position.set(0, 0.65, 0);
  uiGroup.add(header);

  // Main UI Card block
  const heroCardGeom = new THREE.BoxGeometry(1.2, 0.8, 0.02);
  const heroCardMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, transparent: true, opacity: 0.8 });
  const heroCard = new THREE.Mesh(heroCardGeom, heroCardMat);
  heroCard.position.set(-0.7, 0.05, 0);
  uiGroup.add(heroCard);

  // Visual/Mock graph blocks (3 columns on right)
  const colGeom = new THREE.BoxGeometry(0.35, 0.5, 0.02);
  const colMat = new THREE.MeshStandardMaterial({ color: 0x818CF8, roughness: 0.3 });
  
  for (let i = 0; i < 3; i++) {
    const col = new THREE.Mesh(colGeom, colMat);
    col.position.set(0.3 + i * 0.45, 0.1, 0);
    uiGroup.add(col);
  }

  // Bottom action bar
  const bottomBarGeom = new THREE.BoxGeometry(2.8, 0.1, 0.02);
  const bottomBarMat = new THREE.MeshStandardMaterial({ color: 0x6366F1, roughness: 0.2 });
  const bottomBar = new THREE.Mesh(bottomBarGeom, bottomBarMat);
  bottomBar.position.set(0, -0.6, 0);
  uiGroup.add(bottomBar);

  // 3. Floating Sparkle Particles around the device
  const particleCount = 24;
  const particles = [];
  const particleGroup = new THREE.Group();
  scene.add(particleGroup);

  const particleGeom = new THREE.SphereGeometry(0.04, 8, 8);
  const particleMat = new THREE.MeshBasicMaterial({ color: 0xA5B4FC, transparent: true, opacity: 0.8 });

  for (let i = 0; i < particleCount; i++) {
    const p = new THREE.Mesh(particleGeom, particleMat);
    // Random position in sphere around device
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = 2.5 + Math.random() * 2.0;

    p.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi) - 1
    );

    // Store velocities for animated floating
    p.userData = {
      speedY: 0.002 + Math.random() * 0.004,
      amplitude: 0.1 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
      baseY: p.position.y
    };

    particleGroup.add(p);
    particles.push(p);
  }

  // ─── Interaction (Mouse Tilt) ─────────────────────
  let mouse = { x: 0, y: 0 };
  let targetRotation = { x: 0, y: 0 };
  let currentRotation = { x: 0, y: 0 };

  window.addEventListener('mousemove', (e) => {
    // Get mouse coordinates relative to container center
    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    mouse.x = (e.clientX - cx) / (rect.width / 2);
    mouse.y = -(e.clientY - cy) / (rect.height / 2);

    // Calculate rotation targets
    targetRotation.x = mouse.y * 0.45;
    targetRotation.y = mouse.x * 0.55;

    // Move dynamic point light
    cursorLight.position.x = mouse.x * 4;
    cursorLight.position.y = mouse.y * 3;
  });

  // ─── Responsive Resize ────────────────────────────
  function handleResize() {
    width = container.clientWidth;
    height = container.clientHeight || (width * 9 / 16);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  window.addEventListener('resize', handleResize);
  handleResize();

  // ─── Magnetic Button Effect (GSAP) ───────────────
  function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn--primary, .btn--secondary, .btn--ghost, #nav-cta');
    
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Pull button towards cursor slightly
        gsap.to(btn, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      btn.addEventListener('mouseleave', () => {
        // Return to center
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1.1, 0.4)'
        });
      });
    });
  }

  // ─── GSAP Text Splitting Reveal ───────────────────
  function initHeadlineReveals() {
    const headline = document.querySelector('.hero__headline');
    if (!headline) return;

    // Simple text wrapping for high-end mask reveals
    const innerHTML = headline.innerHTML;
    // We wrap linebreaks in split divs
    const lines = innerHTML.split('<br>');
    let formattedText = '';

    lines.forEach(line => {
      formattedText += `<div class="split-line-wrapper" style="overflow:hidden; display:block;"><span class="split-line-content" style="display:inline-block; transform:translateY(110%); opacity:0;">${line}</span></div>`;
    });

    headline.innerHTML = formattedText;

    // GSAP reveal timeline
    gsap.timeline({ delay: 0.3 })
      .to('.split-line-content', {
        y: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.18,
        ease: 'power4.out'
      })
      .to('.hero__subheadline', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.6')
      .to('.hero__actions .btn', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out'
      }, '-=0.5');
  }

  // ─── Animation Loop (60 FPS) ──────────────────────
  const clock = new THREE.Clock();
  let firstFrame = true;

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Lerp rotation for elastic, smooth motion
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;

    // Apply rotation + constant gentle orbit float
    group.rotation.x = currentRotation.x + Math.sin(elapsedTime * 0.5) * 0.06;
    group.rotation.y = currentRotation.y + Math.cos(elapsedTime * 0.6) * 0.08;

    // Base floating translation
    group.position.y = Math.sin(elapsedTime * 1.2) * 0.08;

    // Animate particle floaters
    particles.forEach(p => {
      p.userData.phase += p.userData.speedY;
      p.position.y = p.userData.baseY + Math.sin(p.userData.phase) * p.userData.amplitude;
      p.rotation.y += 0.01;
    });

    renderer.render(scene, camera);

    // Hide fallback image on first successful WebGL frame rendering
    if (firstFrame) {
      startWebGLTransition();
      firstFrame = false;
    }
  }

  // ─── Initialize ──────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    // Hide buttons initially for clean GSAP entry
    gsap.set('.hero__subheadline, .hero__actions .btn', { opacity: 0, y: 15 });

    initHeadlineReveals();
    initMagneticButtons();

    // Small delay to ensure client container has height before rendering
    setTimeout(() => {
      animate();
    }, 150);
  });

})();
