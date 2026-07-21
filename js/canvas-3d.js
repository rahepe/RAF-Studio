/* ============================================
   RAF Studio — 3D & GSAP Interactive Engine
   Combines Three.js WebGL and GSAP ScrollTrigger
   ============================================ */

(function () {
  'use strict';

  // Check if libraries loaded correctly
  if (!window.THREE || !window.gsap || !window.ScrollTrigger) {
    console.warn('Three.js or GSAP not loaded. Running fallback animation.');
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // ─── DOM Elements ─────────────────────────────────
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  // ─── Scene Setup ──────────────────────────────────
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 8;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ─── Lights ───────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0x6366F1, 2.5); // Indigo light
  mainLight.position.set(5, 5, 5);
  scene.add(mainLight);

  const secondaryLight = new THREE.DirectionalLight(0x818CF8, 1.5);
  secondaryLight.position.set(-5, -5, 2);
  scene.add(secondaryLight);

  const pointLight = new THREE.PointLight(0xA5B4FC, 2, 10);
  pointLight.position.set(0, 0, 2);
  scene.add(pointLight);

  // ─── 3D Object Group ──────────────────────────────
  const group = new THREE.Group();
  scene.add(group);

  // Geometry: Detailed Icosahedron (facets look extremely premium)
  const geometry = new THREE.IcosahedronGeometry(1.5, 1);

  // Materials
  // 1. Faceted Glass-like physical mesh
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x050508,
    metalness: 0.9,
    roughness: 0.15,
    transmission: 0.6,
    ior: 1.5,
    thickness: 1.0,
    transparent: true,
    opacity: 0.9,
    flatShading: true,
    side: THREE.DoubleSide
  });

  // 2. Glowing Indigo Wireframe overlay
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x6366F1,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });

  const glassMesh = new THREE.Mesh(geometry, glassMaterial);
  const wireMesh = new THREE.Mesh(geometry, wireMaterial);

  // Scale wireMesh slightly larger to avoid z-fighting
  wireMesh.scale.setScalar(1.002);

  group.add(glassMesh);
  group.add(wireMesh);

  // Initial positioning for Hero
  group.position.set(2, 0.2, -1);
  group.rotation.set(0.3, 0.5, 0);

  // ─── Responsive Resize ────────────────────────────
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Responsive position adjustments
    if (window.innerWidth < 1024) {
      // Center object on mobile/tablets
      gsap.set(group.position, { x: 0, y: 1.5, z: -2 });
    } else {
      // Reset to original right-aligned layout
      gsap.set(group.position, { x: 2, y: 0.2, z: -1 });
    }
  }
  window.addEventListener('resize', handleResize);
  // Run once to initialize positioning
  if (window.innerWidth < 1024) {
    group.position.set(0, 1.5, -2);
  }

  // ─── Mouse Interaction (Parallax Tilt) ───────────
  let mouse = { x: 0, y: 0 };
  let targetRotation = { x: 0, y: 0 };

  window.addEventListener('mousemove', (e) => {
    // Normalise mouse coords (-1 to 1)
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    // Set rotation target based on mouse position
    targetRotation.x = mouse.y * 0.4;
    targetRotation.y = mouse.x * 0.4;
  });

  // ─── Scroll-driven GSAP Animations ───────────────
  // Create a timeline linked to page scroll
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut', duration: 1 },
    scrollTrigger: {
      trigger: '#main-content',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5, // Smooth lag effect on scroll
    }
  });

  // Responsive scroll configurations
  const isDesktop = window.innerWidth >= 1024;

  if (isDesktop) {
    tl.to(group.position, { x: 0, y: 0.3, z: -1.5 }, 'hero-to-problem')
      .to(group.scale, { x: 2.2, y: 2.2, z: 2.2 }, 'hero-to-problem')
      .to(wireMaterial, { opacity: 0.8, color: '#818CF8' }, 'hero-to-problem')

      .to(group.position, { x: -2.2, y: -0.5, z: -1 }, 'problem-to-services')
      .to(group.scale, { x: 1.6, y: 1.6, z: 1.6 }, 'problem-to-services')
      .to(wireMaterial, { opacity: 0.35, color: '#6366F1' }, 'problem-to-services')

      .to(group.position, { x: 0, y: -1, z: -2.5 }, 'services-to-cta')
      .to(group.scale, { x: 3.2, y: 3.2, z: 3.2 }, 'services-to-cta')
      .to(wireMaterial, { opacity: 0.9, color: '#A5B4FC' }, 'services-to-cta');
  } else {
    // Mobile scroll transitions
    tl.to(group.position, { x: 0, y: 0.2, z: -2.2 }, 'hero-to-problem')
      .to(group.scale, { x: 1.5, y: 1.5, z: 1.5 }, 'hero-to-problem')

      .to(group.position, { x: 0, y: -0.2, z: -2.5 }, 'problem-to-services')
      .to(group.scale, { x: 1.2, y: 1.2, z: 1.2 }, 'problem-to-services')

      .to(group.position, { x: 0, y: -0.6, z: -3.0 }, 'services-to-cta')
      .to(group.scale, { x: 2.2, y: 2.2, z: 2.2 }, 'services-to-cta');
  }

  // ─── Logo & Nav Interaction ──────────────────────
  // Logo interaction: Hovering over logo makes the 3D shape spin faster
  const logo = document.querySelector('.nav__logo');
  const logoDot = document.querySelector('.nav__logo-dot');
  let spinMultiplier = 1.0;

  if (logo) {
    logo.addEventListener('mouseenter', () => {
      // Fast spin 3D object
      gsap.to({ val: spinMultiplier }, {
        val: 8.0,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: function() { spinMultiplier = this.targets()[0].val; }
      });
      // Bounce logo dot
      if (logoDot) {
        gsap.to(logoDot, {
          y: -4,
          scale: 1.3,
          backgroundColor: '#818CF8',
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: 'back.out(2)'
        });
      }
    });

    logo.addEventListener('mouseleave', () => {
      // Normalise spin speed
      gsap.to({ val: spinMultiplier }, {
        val: 1.0,
        duration: 1.2,
        ease: 'power1.out',
        onUpdate: function() { spinMultiplier = this.targets()[0].val; }
      });
    });
  }

  // Primary CTA buttons hover: shape expands slightly
  document.querySelectorAll('.btn--primary, .whatsapp-fab').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(group.scale, {
        x: '+=0.2',
        y: '+=0.2',
        z: '+=0.2',
        duration: 0.4,
        ease: 'back.out(1.5)'
      });
      gsap.to(wireMaterial, { opacity: 0.9, duration: 0.3 });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(group.scale, {
        x: '-=0.2',
        y: '-=0.2',
        z: '-=0.2',
        duration: 0.4,
        ease: 'power2.out'
      });
      gsap.to(wireMaterial, { opacity: 0.45, duration: 0.3 });
    });
  });

  // ─── GSAP Page Load Entrance ──────────────────────
  window.addEventListener('load', () => {
    // Hide standard initial reveals since GSAP will handle above-the-fold elements smoother
    const heroContent = document.querySelector('.hero__content');
    const heroVisual = document.querySelector('.hero__visual');

    if (heroContent) {
      heroContent.classList.remove('reveal'); // disable CSS transform
      gsap.from(heroContent.children, {
        opacity: 0,
        y: 30,
        duration: 1.0,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2
      });
    }

    if (heroVisual) {
      heroVisual.classList.remove('reveal-right');
      gsap.from(heroVisual, {
        opacity: 0,
        x: 40,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.4
      });
    }

    // Animate navbar elements loading
    gsap.from('.nav__logo', {
      opacity: 0,
      x: -20,
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.from('.nav__link', {
      opacity: 0,
      y: -10,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      delay: 0.3
    });

    gsap.from('#nav-cta', {
      opacity: 0,
      scale: 0.9,
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: 0.7
    });
  });

  // ─── Animation Loop (60 FPS) ──────────────────────
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Constant slow rotation + mouse tilt influence
    group.rotation.y = elapsedTime * 0.15 * spinMultiplier + targetRotation.y;
    group.rotation.x = elapsedTime * 0.1 * spinMultiplier + targetRotation.x;

    // Smooth return to base rotation (damping)
    targetRotation.x += (0 - targetRotation.x) * 0.05;
    targetRotation.y += (0 - targetRotation.y) * 0.05;

    // Wave/floating effect on Y axis
    group.position.y += Math.sin(elapsedTime * 1.5) * 0.0012;

    renderer.render(scene, camera);
  }

  animate();
})();
