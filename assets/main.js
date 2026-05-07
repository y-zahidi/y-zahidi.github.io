// year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// fade-in on scroll
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.section, .proj, .cert, .stack-card, .contact-card').forEach((el) => {
  el.classList.add('fade-in');
  io.observe(el);
});

// smooth scroll for hash links (most browsers handle it via CSS, but be explicit)
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (ev) => {
    const id = a.getAttribute('href');
    if (id.length > 1 && document.querySelector(id)) {
      ev.preventDefault();
      document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
    }
  });
});
