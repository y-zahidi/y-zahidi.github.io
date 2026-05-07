/* ──────────────────────────────────────────────────────────
 * portfolio · y-zahidi.github.io
 * vanilla JS, no build, no deps.
 * ──────────────────────────────────────────────────────── */

// year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// reduced-motion check
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── fade-in on scroll ─────────────────────────────────── */
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.section, .stats-strip, .stat, .proj, .cert, .stack-card, .contact-card, .now-card, .case-meta, .case-arch')
  .forEach((el) => { el.classList.add('fade-in'); io.observe(el); });

/* ── smooth scroll for hash links ──────────────────────── */
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

/* ── scroll progress bar ───────────────────────────────── */
const progress = document.getElementById('scrollProgress');
if (progress) {
  let ticking = false;
  const update = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop || document.body.scrollTop);
    const height = (h.scrollHeight - h.clientHeight) || 1;
    progress.style.width = Math.min(100, (scrolled / height) * 100) + '%';
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ── animated stat counters ────────────────────────────── */
const fmt = (n, prefix, suffix) => `${prefix || ''}${n}${suffix || ''}`;
const counterIo = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const el = e.target;
    counterIo.unobserve(el);
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (prefersReducedMotion || isNaN(target)) { el.textContent = fmt(target, prefix, suffix); continue; }
    const dur = 1100;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = fmt(Math.round(target * eased), prefix, suffix);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}, { threshold: 0.4 });
document.querySelectorAll('.stat-num').forEach((el) => counterIo.observe(el));

/* ── hero terminal: typewriter sequence ────────────────── */
const termBody = document.getElementById('termBody');
if (termBody) {
  const targets = Array.from(termBody.querySelectorAll('[data-typed]'))
    .map((el) => ({ el, text: el.dataset.typed }));
  targets.forEach((t) => { t.el.textContent = ''; });

  const typeOne = (target) => new Promise((resolve) => {
    if (prefersReducedMotion) { target.el.textContent = target.text; target.el.classList.add('done'); resolve(); return; }
    target.el.classList.add('typed');
    const text = target.text;
    let i = 0;
    const speed = text.length > 60 ? 12 : 22;
    const step = () => {
      target.el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(step, speed);
      else { target.el.classList.remove('typed'); target.el.classList.add('done'); resolve(); }
    };
    step();
  });

  const pause = (ms) => new Promise((r) => setTimeout(r, ms));

  (async () => {
    await pause(prefersReducedMotion ? 0 : 350);
    for (const t of targets) {
      const isCommand = t.el.classList.contains('typed') || /^\s*\$/.test(t.el.parentElement.textContent || '');
      await typeOne(t);
      await pause(prefersReducedMotion ? 0 : (isCommand ? 90 : 240));
    }
  })();
}

/* ── command palette (cmd+K / ctrl+K) ──────────────────── */
const cmdk = document.getElementById('cmdk');
const cmdkInput = document.getElementById('cmdkInput');
const cmdkList = document.getElementById('cmdkList');
const cmdkTrigger = document.getElementById('cmdkTrigger');

const ITEMS = [
  { title: 'About',                          hint: 'section', kind: '#', href: '#about' },
  { title: 'Case study — Tétouan SIEM',      hint: 'section', kind: '#', href: '#case' },
  { title: 'Projects',                       hint: 'section', kind: '#', href: '#projects' },
  { title: 'Now — what I\'m building',       hint: 'section', kind: '#', href: '#now' },
  { title: 'Stack',                          hint: 'section', kind: '#', href: '#stack' },
  { title: 'Certifications',                 hint: 'section', kind: '#', href: '#certs' },
  { title: 'Contact',                        hint: 'section', kind: '#', href: '#contact' },
  { title: 'home-lab-siem',                  hint: 'repo',    kind: '↗', href: 'https://github.com/y-zahidi/home-lab-siem' },
  { title: 'ctf-writeups',                   hint: 'repo',    kind: '↗', href: 'https://github.com/y-zahidi/ctf-writeups' },
  { title: 'pentest-cheatsheet',             hint: 'repo',    kind: '↗', href: 'https://github.com/y-zahidi/pentest-cheatsheet' },
  { title: 'water-stress-morocco-analytics', hint: 'repo',    kind: '↗', href: 'https://github.com/y-zahidi/water-stress-morocco-analytics' },
  { title: 'FacturationPro-Enterprise',      hint: 'repo',    kind: '↗', href: 'https://github.com/y-zahidi/FacturationPro-Enterprise' },
  { title: 'HTMLCamp',                       hint: 'repo',    kind: '↗', href: 'https://github.com/y-zahidi/HTMLCamp' },
  { title: 'Rabat-Cultural-Website',         hint: 'repo',    kind: '↗', href: 'https://github.com/y-zahidi/Rabat-Cultural-Website' },
  { title: 'GitHub profile',                 hint: 'social',  kind: '↗', href: 'https://github.com/y-zahidi' },
  { title: 'LinkedIn',                       hint: 'social',  kind: '↗', href: 'https://www.linkedin.com/in/yassir-zahidi/' },
  { title: 'Email — yassirzahidi8@gmail.com',hint: 'mail',    kind: '✉', href: 'mailto:yassirzahidi8@gmail.com' },
  { title: 'Download CV (English)',          hint: 'file',    kind: '↓', href: 'assets/cv-en.pdf' },
];

let active = 0;
let filtered = ITEMS.slice();

const renderList = () => {
  cmdkList.innerHTML = '';
  if (!filtered.length) {
    const li = document.createElement('li');
    li.className = 'cmdk-empty';
    li.textContent = 'no match. try "siem", "github", "now"…';
    cmdkList.appendChild(li);
    return;
  }
  filtered.forEach((it, i) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', i === active ? 'true' : 'false');
    li.dataset.i = i;
    li.innerHTML = `<span class="ck-icon">${it.kind}</span><span class="ck-title">${it.title}</span><span class="ck-hint">${it.hint}</span>`;
    li.addEventListener('mouseenter', () => { active = i; updateActive(); });
    li.addEventListener('click', () => go(it));
    cmdkList.appendChild(li);
  });
};
const updateActive = () => {
  Array.from(cmdkList.children).forEach((li, i) => {
    if (li.classList.contains('cmdk-empty')) return;
    li.setAttribute('aria-selected', i === active ? 'true' : 'false');
  });
  const cur = cmdkList.querySelector('[aria-selected="true"]');
  if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest' });
};
const filter = (q) => {
  q = q.trim().toLowerCase();
  filtered = !q ? ITEMS.slice() : ITEMS.filter((it) =>
    it.title.toLowerCase().includes(q) || it.hint.toLowerCase().includes(q));
  active = 0; renderList();
};
const openCmdk = () => {
  cmdk.hidden = false; cmdkInput.value = ''; filter('');
  setTimeout(() => cmdkInput.focus(), 10);
  document.body.style.overflow = 'hidden';
};
const closeCmdk = () => {
  cmdk.hidden = true; document.body.style.overflow = '';
  cmdkTrigger && cmdkTrigger.focus();
};
const go = (it) => {
  if (!it) return;
  if (it.href.startsWith('#')) {
    closeCmdk();
    const target = document.querySelector(it.href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', it.href);
  } else {
    window.open(it.href, it.href.startsWith('mailto:') ? '_self' : '_blank', 'noopener');
    closeCmdk();
  }
};

cmdkTrigger && cmdkTrigger.addEventListener('click', openCmdk);
cmdk && cmdk.addEventListener('click', (e) => { if (e.target.dataset.cmdkClose !== undefined) closeCmdk(); });
cmdkInput && cmdkInput.addEventListener('input', (e) => filter(e.target.value));
cmdkInput && cmdkInput.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(filtered.length - 1, active + 1); updateActive(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(0, active - 1); updateActive(); }
  else if (e.key === 'Enter') { e.preventDefault(); go(filtered[active]); }
  else if (e.key === 'Escape') { e.preventDefault(); closeCmdk(); }
});

window.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (cmdk.hidden) openCmdk(); else closeCmdk();
  }
});
