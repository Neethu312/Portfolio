/* ============================================================
   main.js — Portfolio JavaScript for Neethu O
   ============================================================ */

/* ─── 1. NAVBAR: scroll & active link ─── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  highlightNav();
});

function highlightNav() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
}

/* ─── 2. HAMBURGER MENU ─── */
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinksContainer.classList.toggle('open');
});
navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinksContainer.classList.remove('open'));
});

/* ─── 3. TYPEWRITER ─── */
const phrases = [
  'Python Full-Stack Developer',
  'Django & DRF Architect',
  'Async Pipeline Engineer',
  'REST API Specialist',
  'Multi-Tenant RBAC Expert',
  'Payment Gateway Integrator',
];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typeEl = document.getElementById('typewriter-text');

function typeWriter() {
  const current = phrases[phraseIdx];
  if (!isDeleting) {
    typeEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeWriter, 1800);
      return;
    }
  } else {
    typeEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeWriter, isDeleting ? 60 : 90);
}
typeWriter();

/* ─── 4. SCROLL-REVEAL ─── */
function addRevealClasses() {
  const targets = [
    ...document.querySelectorAll('.skill-card'),
    ...document.querySelectorAll('.project-card'),
    ...document.querySelectorAll('.stat-card'),
    ...document.querySelectorAll('.timeline-item'),
    ...document.querySelectorAll('.contact-card'),
    document.getElementById('about-text'),
    document.getElementById('contact-form'),
  ].filter(Boolean);

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 3) * 0.1}s`;
  });

  const leftTargets = [
    document.getElementById('about-avatar'),
  ].filter(Boolean);
  leftTargets.forEach(el => el.classList.add('reveal-left'));
}

function checkReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left');
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('visible');
    }
  });
}

addRevealClasses();
window.addEventListener('scroll', checkReveal);
checkReveal();

/* ─── 5. COUNTER ANIMATION ─── */
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counterEls = entry.target.querySelectorAll('[data-target]');
      counterEls.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, target);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);

const heroStats = document.getElementById('hero-stats');
if (heroStats) {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(el => {
          animateCounter(el, parseInt(el.getAttribute('data-target')), 1500);
        });
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  heroObserver.observe(heroStats);
}

/* ─── 6. PARTICLE CANVAS ─── */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x   = Math.random() * canvas.width;
    this.y   = Math.random() * canvas.height;
    this.vx  = (Math.random() - 0.5) * 0.4;
    this.vy  = (Math.random() - 0.5) * 0.4;
    this.r   = Math.random() * 1.5 + 0.5;
    const hue = Math.random() < 0.5 ? 262 : 192;
    this.color = `hsla(${hue}, 80%, 70%, ${Math.random() * 0.5 + 0.15})`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100 * 0.6;
        this.vx += dx / dist * force * 0.3;
        this.vy += dy / dist * force * 0.3;
      }
    }
    const maxSpeed = 1.5;
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > maxSpeed) { this.vx /= speed / maxSpeed; this.vy /= speed / maxSpeed; }
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(Math.floor(canvas.width / 12), 120);
  particles = Array.from({ length: count }, () => new Particle());
}
initParticles();

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const alpha = (1 - dist / 120) * 0.15;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
        ctx.lineWidth   = 1;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ─── 7. CONTACT FORM — EmailJS Integration ─── */
emailjs.init({ publicKey: 'dE2Pm9DvrJ8ERlE8S' });

function handleFormSubmit(e) {
  e.preventDefault();

  const btn      = document.getElementById('btn-submit-text');
  const successMsg = document.getElementById('form-success');
  const form     = document.getElementById('contact-form');

  // Grab values
  const templateParams = {
    from_name : document.getElementById('form-name').value,
    from_email: document.getElementById('form-email').value,
    subject   : document.getElementById('form-subject').value,
    message   : document.getElementById('form-message').value,
  };

  btn.textContent = 'Sending…';

  emailjs.send('service_5q4ppyc', 'template_ttof451', templateParams)
    .then(() => {
      btn.textContent = 'Send Message';
      successMsg.style.display = 'block';
      form.reset();
      setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
    })
    .catch((error) => {
      btn.textContent = 'Send Message';
      alert('Something went wrong. Please try again.\n' + JSON.stringify(error));
    });
}

/* ─── 8. SMOOTH NAV SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const targetId = a.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── 9. CODE CARD TILT ─── */
const codeCard = document.getElementById('code-card');
if (codeCard) {
  codeCard.addEventListener('mousemove', e => {
    const rect  = codeCard.getBoundingClientRect();
    const x     = (e.clientX - rect.left) / rect.width  - 0.5;
    const y     = (e.clientY - rect.top)  / rect.height - 0.5;
    codeCard.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
  });
  codeCard.addEventListener('mouseleave', () => {
    codeCard.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)';
  });
}
