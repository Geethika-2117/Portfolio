/* ============================================
   Nav active-state + smooth scroll
============================================ */
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const sectionIdToLinkMap = {};
navLinks.forEach(link => {
  const sectionId = link.getAttribute('href').substring(1);
  sectionIdToLinkMap[sectionId] = link;
});

const navObserverOptions = { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 };
const navObserverCallback = (entries) => {
  entries.forEach(entry => {
    const link = sectionIdToLinkMap[entry.target.id];
    if (link && entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
};
const navObserver = new IntersectionObserver(navObserverCallback, navObserverOptions);
sections.forEach(section => navObserver.observe(section));

navLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    document.querySelector('header').classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ============================================
   Mobile nav toggle
============================================ */
const navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', () => {
  const header = document.querySelector('header');
  const isOpen = header.classList.toggle('menu-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

/* ============================================
   Hero typing effect
============================================ */
const roles = ['Software Engineer', 'AI Developer', 'Machine Learning Enthusiast'];
const typedEl = document.getElementById('typedRole');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 80);
}
typeLoop();

/* ============================================
   Scroll reveal animations
============================================ */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

/* ============================================
   Achievement counter animation
============================================ */
const statNumbers = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1400;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNumbers.forEach(el => counterObserver.observe(el));

/* ============================================
   Contact form (EmailJS)
============================================ */
const form = document.getElementById('contactForm');
const modal = document.getElementById('successModal');
const closeBtn = document.querySelector('.close-button');

form.addEventListener('submit', function (event) {
  event.preventDefault();
  emailjs.sendForm('service_4mcjojf', 'template_15oy37e', this)
    .then(() => {
      modal.style.display = 'block';
      form.reset();
    }, (error) => {
      alert('Failed to send message: ' + JSON.stringify(error));
    });
});

closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });