/* ============================================================
   CRITIX CLIENT — INTERACTIVE SCRIPTS
   Particle grid, scroll reveals, parallax, mouse tracking
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ─── Particle / Grid Canvas ───
  initCanvas();

  // ─── Scroll Reveal ───
  initScrollReveal();

  // ─── Navbar scroll effect ───
  initNavbar();

  // ─── Feature card mouse tracking glow ───
  initCardGlow();

  // ─── Smooth scroll for anchor links ───
  initSmoothScroll();

  // ─── Mobile nav toggle ───
  initMobileNav();

  // ─── Typing effect in hero ───
  initTypingEffect();
});

/* ──────────────────────────────────────────
   CANVAS – Subtle grid + floating particles
   ────────────────────────────────────────── */
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, particles, mouse;
  const PARTICLE_COUNT = 60;
  const CONNECT_DIST = 130;

  mouse = { x: -1000, y: -1000 };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.5,
        opacity: Math.random() * 0.4 + 0.1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Draw subtle grid
    ctx.strokeStyle = 'rgba(255,255,255,0.015)';
    ctx.lineWidth = 1;
    const gridSize = 60;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Subtle mouse attraction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        p.vx += dx * 0.00004;
        p.vy += dy * 0.00004;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      // Damping
      p.vx *= 0.999;
      p.vy *= 0.999;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 26, 255, ${p.opacity})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const ddx = p.x - p2.x;
        const ddy = p.y - p2.y;
        const d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < CONNECT_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 26, 255, ${0.06 * (1 - d / CONNECT_DIST)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

  resize();
  createParticles();
  draw();
}

/* ──────────────────────────────────────────
   SCROLL REVEAL – IntersectionObserver
   ────────────────────────────────────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger children if parent has data-stagger
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────────
   NAVBAR – scroll-based background
   ────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ──────────────────────────────────────────
   CARD GLOW – mouse-tracking radial gradient
   ────────────────────────────────────────── */
function initCardGlow() {
  const cards = document.querySelectorAll('.feature-card, .download-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });
}

/* ──────────────────────────────────────────
   SMOOTH SCROLL – anchor links
   ────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        // Close mobile nav if open
        document.querySelector('.nav-links')?.classList.remove('open');
        document.querySelector('.nav-toggle')?.classList.remove('active');

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ──────────────────────────────────────────
   MOBILE NAV
   ────────────────────────────────────────── */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
}

/* ──────────────────────────────────────────
   TYPING EFFECT – for hero subtitle rotation
   ────────────────────────────────────────── */
function initTypingEffect() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const words = [
    'rendimiento.',
    'personalización.',
    'estabilidad.',
    'estilo.'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let pause = false;

  function tick() {
    const current = words[wordIndex];

    if (pause) {
      pause = false;
      setTimeout(tick, 1500);
      return;
    }

    if (deleting) {
      charIndex--;
      el.textContent = current.substring(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 40);
    } else {
      charIndex++;
      el.textContent = current.substring(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        pause = true;
        setTimeout(tick, 100);
        return;
      }
      setTimeout(tick, 80);
    }
  }

  setTimeout(tick, 800);
}

/* ──────────────────────────────────────────
   COUNTER ANIMATION – for stats
   ────────────────────────────────────────── */
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const suffix = el.dataset.suffix || '';

  function step() {
    start += increment;
    if (start >= target) {
      el.textContent = target + suffix;
      return;
    }
    el.textContent = Math.floor(start) + suffix;
    requestAnimationFrame(step);
  }
  step();
}
