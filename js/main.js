document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. Mobile Navigation ─── */

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  /* ─── 2. Navbar Scroll Effect ─── */

  const navbar = document.querySelector('.navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ─── 3. Smooth Scroll ─── */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });

      if (navToggle && navLinks) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  });

  /* ─── 4. Scroll Reveal ─── */

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ─── 5. Active Nav Link ─── */

  const sectionIds = [
    'hero', 'problems', 'services', 'portfolio',
    'process', 'team', 'testimonials', 'faq', 'cta-final'
  ];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    let currentId = '';
    const offset = 120;

    sections.forEach((section) => {
      const top = section.offsetTop - offset;
      if (window.scrollY >= top) {
        currentId = section.id;
      }
    });

    navAnchors.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
    });
  }

  /* ─── 6. Stats Counter ─── */

  const heroStats = document.querySelector('.hero-stats');
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const duration = 2000;

    statNumbers.forEach((el) => {
      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals, 10) || 0;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - (1 - progress) * (1 - progress); // ease-out quad

        const current = eased * target;
        el.textContent = current.toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toFixed(decimals);
        }
      }

      requestAnimationFrame(step);
    });
  }

  if (heroStats) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    statsObserver.observe(heroStats);
  }

  /* ─── 7. Testimonial Carousel ─── */

  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');

  if (track) {
    const slides = track.children;
    const total = slides.length;
    let current = 0;
    let autoTimer = null;

    function goTo(index) {
      current = ((index % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    }

    function stopAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); startAuto(); });
    });

    const carousel = track.closest('.testimonial-carousel') || track.parentElement;
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAuto);
      carousel.addEventListener('mouseleave', startAuto);
    }

    goTo(0);
    startAuto();
  }

  /* ─── 8. FAQ Accordion ─── */

  document.querySelectorAll('.faq-item .faq-question').forEach((question) => {
    question.addEventListener('click', () => {
      const parent = question.closest('.faq-item');
      const isActive = parent.classList.contains('active');
      const answer = parent.querySelector('.faq-answer');

      // Close all
      document.querySelectorAll('.faq-item.active').forEach((item) => {
        item.classList.remove('active');
        const ans = item.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });

      // Open clicked (if it wasn't already open)
      if (!isActive) {
        parent.classList.add('active');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ─── 9. Contact Form ─── */

  const contactForm = document.getElementById('contact-form');

  function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.textContent = (isError ? '✗ ' : '✓ ') + message;

    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      padding: '16px 28px',
      background: '#ffffff',
      border: `3px solid ${isError ? '#ff4d4d' : '#2d2d2d'}`,
      borderRadius: '30px 10px 30px 10px / 10px 30px 10px 30px',
      color: '#2d2d2d',
      fontFamily: 'Kalam, cursive',
      fontWeight: '700',
      fontSize: '15px',
      boxShadow: `4px 4px 0px 0px ${isError ? '#ff4d4d' : '#2d2d2d'}`,
      zIndex: '10000',
      opacity: '0',
      transform: 'translateY(20px)',
      transition: 'opacity 0.3s, transform 0.3s'
    });

    document.body.appendChild(toast);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 3500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const required = contactForm.querySelectorAll('[required]');
      let valid = true;

      required.forEach((field) => {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });

      if (!valid) {
        showToast('Please fill in all required fields.', true);
        return;
      }

      showToast('Message sent! We\'ll be in touch soon.');
      contactForm.reset();
    });
  }

  /* ─── 10. Parallax — REMOVED ─── */

  /* ─── 11. Back to Top ─── */

  const backToTop = document.querySelector('.back-to-top');

  function handleBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }

  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── 12. Card Jiggle on Hover ─── */

  const jiggleCards = document.querySelectorAll(
    '.problem-card, .service-card, .team-card, .portfolio-card'
  );

  jiggleCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      const angle = (Math.random() * 4 - 2).toFixed(2); // -2 to 2 deg
      card.style.transform = `rotate(${angle}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─── Unified Scroll Handler ─── */

  function onScroll() {
    handleNavbarScroll();
    updateActiveNav();
    handleBackToTop();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
