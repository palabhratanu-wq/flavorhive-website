/* ============================================================
   FlavorHive — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Navbar scroll effect ---------- */
  const navbar = document.getElementById('navbar');

  function handleNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbar, { passive: true });
  handleNavbar(); // run on load

  /* ---------- Mobile menu toggle ---------- */
  const menuBtn   = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen  = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  menuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.toggle('hidden');
    iconOpen.classList.toggle('hidden', !isHidden);
    iconClose.classList.toggle('hidden', isHidden);
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
    });
  });

  /* ---------- Scroll-reveal animations ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Respect the animation-delay set inline
          const delay = entry.target.style.animationDelay;
          if (delay) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, parseFloat(delay) * 1000);
          } else {
            entry.target.classList.add('visible');
          }
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- Active nav link highlighting ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.style.color = '#f59e0b';
            } else {
              link.style.color = '';
            }
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => sectionObserver.observe(s));

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contact-form');

  // Create toast element
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.innerHTML = `
    <svg class="w-5 h-5 text-saffron-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color:#fbbf24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
    <span>Thanks! We'll be in touch within 24 hours.</span>
  `;
  document.body.appendChild(toast);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Show toast
    toast.classList.add('show');
    // Reset form
    form.reset();
    // Hide toast after 4s
    setTimeout(() => toast.classList.remove('show'), 4000);
  });

  /* ---------- Back-to-top button ---------- */
  const btt = document.createElement('button');
  btt.id = 'back-to-top';
  btt.setAttribute('aria-label', 'Back to top');
  btt.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>`;
  document.body.appendChild(btt);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btt.classList.add('visible');
    } else {
      btt.classList.remove('visible');
    }
  }, { passive: true });

  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Smooth number counter animation for stats ---------- */
  function animateCounter(el, target, suffix = '') {
    const duration = 1600;
    const start = performance.now();
    const startVal = 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const current = Math.round(startVal + (target - startVal) * ease);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // Trigger counters when hero stats enter viewport
  const statEls = document.querySelectorAll('[data-count]');
  if (statEls.length) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCounter(el, parseInt(el.dataset.count), el.dataset.suffix || '');
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statEls.forEach(el => counterObserver.observe(el));
  }

})();
