/* =========================================================
   Frist — page interactions
   Keeps it restrained: scroll nav state, reveal on scroll,
   subtle mouse-driven hero glow.
   ========================================================= */

(() => {
  const nav = document.getElementById('nav');
  const hero = document.querySelector('.hero');
  const glow = document.querySelector('.hero__glow');

  /* ---------- Nav background on scroll ---------- */
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Hero glow follows the cursor (very subtle) ---------- */
  if (hero && glow && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let raf = null;
    let targetX = 50, targetY = 35;
    let currentX = 50, currentY = 35;

    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      glow.style.left = currentX + '%';
      glow.style.top = currentY + '%';
      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    };

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 100;
      targetY = ((e.clientY - rect.top) / rect.height) * 100;
      if (!raf) raf = requestAnimationFrame(tick);
    });

    hero.addEventListener('mouseleave', () => {
      targetX = 50; targetY = 35;
      if (!raf) raf = requestAnimationFrame(tick);
    });
  }

  /* ---------- Smooth-scroll offset for fixed nav ---------- */
  const navHeight = () => (nav ? nav.offsetHeight : 0);
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight() - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
