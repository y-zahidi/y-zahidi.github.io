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
  { title: 'About',                          hint: 'section',         kind: '#', href: '#about' },
  { title: 'Case study — Tétouan SIEM',      hint: 'section',         kind: '#', href: '#case' },
  { title: 'Blue — detection coverage',      hint: 'section · blue',   kind: '#', href: '#detect' },
  { title: 'Red — offensive arsenal',        hint: 'section · red',    kind: '#', href: '#offensive' },
  { title: 'Purple — validation loop',       hint: 'section · purple', kind: '#', href: '#purple' },
  { title: 'Projects',                       hint: 'section',         kind: '#', href: '#projects' },
  { title: 'Now — what I\'m building',       hint: 'section',         kind: '#', href: '#now' },
  { title: 'Achievements',                   hint: 'section',         kind: '#', href: '#achievements' },
  { title: 'Stack',                          hint: 'section',         kind: '#', href: '#stack' },
  { title: 'Certifications',                 hint: 'section',         kind: '#', href: '#certs' },
  { title: 'Contact',                        hint: 'section',         kind: '#', href: '#contact' },
  { title: 'home-lab-siem',                  hint: 'repo',            kind: '↗', href: 'https://github.com/y-zahidi/home-lab-siem' },
  { title: 'ctf-writeups',                   hint: 'repo',            kind: '↗', href: 'https://github.com/y-zahidi/ctf-writeups' },
  { title: 'pentest-cheatsheet',             hint: 'repo',            kind: '↗', href: 'https://github.com/y-zahidi/pentest-cheatsheet' },
  { title: 'water-stress-morocco-analytics', hint: 'repo',            kind: '↗', href: 'https://github.com/y-zahidi/water-stress-morocco-analytics' },
  { title: 'FacturationPro-Enterprise',      hint: 'repo',            kind: '↗', href: 'https://github.com/y-zahidi/FacturationPro-Enterprise' },
  { title: 'HTMLCamp',                       hint: 'repo',            kind: '↗', href: 'https://github.com/y-zahidi/HTMLCamp' },
  { title: 'Rabat-Cultural-Website',         hint: 'repo',            kind: '↗', href: 'https://github.com/y-zahidi/Rabat-Cultural-Website' },
  { title: 'GitHub profile',                 hint: 'social',          kind: '↗', href: 'https://github.com/y-zahidi' },
  { title: 'LinkedIn',                       hint: 'social',          kind: '↗', href: 'https://www.linkedin.com/in/yassir-zahidi/' },
  { title: 'Email — yassirzahidi8@gmail.com',hint: 'mail',            kind: '✉', href: 'mailto:yassirzahidi8@gmail.com' },
  { title: 'Download CV (English)',          hint: 'file',            kind: '↓', href: 'assets/cv-en.pdf' },
  { title: 'Theme · cycle (dark / midnight / paper / phosphor)', hint: 'command', kind: '…', cmd: 'theme' },
  { title: 'Cmdline · vim-style :command',                       hint: 'command', kind: '…', cmd: 'cmdline' },
  { title: 'Resume.json — raw JSON Resume schema',                hint: 'file',    kind: '↗', href: 'resume.json' },
  { title: 'humans.txt',                                          hint: 'file',    kind: '↗', href: 'humans.txt' },
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
  if (it.cmd === 'theme') { closeCmdk(); cycleTheme(); return; }
  if (it.cmd === 'cmdline') { closeCmdk(); openCmdline && openCmdline(); return; }
  if (!it.href) { closeCmdk(); return; }
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

/* ──────────────────────────────────────────────────────────
 * theme switcher (dark · midnight · paper)
 * ──────────────────────────────────────────────────────── */
const THEMES = ['dark', 'midnight', 'paper', 'phosphor'];
const themeBtn = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');

const applyTheme = (name) => {
  if (!THEMES.includes(name)) name = 'midnight';
  document.documentElement.setAttribute('data-theme', name);
  if (themeLabel) themeLabel.textContent = name;
  try { localStorage.setItem('yz.theme', name); } catch (_) {}
};
const currentTheme = () => document.documentElement.getAttribute('data-theme') || 'midnight';
const cycleTheme = () => {
  const cur = currentTheme();
  const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
  applyTheme(next);
};
// boot
(() => {
  let saved;
  try { saved = localStorage.getItem('yz.theme'); } catch (_) {}
  applyTheme(saved || 'midnight');
})();
themeBtn && themeBtn.addEventListener('click', cycleTheme);

/* ──────────────────────────────────────────────────────────
 * vim-style keyboard navigation: g{h,a,c,d,p,n,s,r,m}, t, p, ?
 * ──────────────────────────────────────────────────────── */
const ROUTES = {
  h: { kind: 'top' },
  a: { id: '#about' },
  c: { id: '#case' },
  d: { id: '#detect' },     // blue
  o: { id: '#offensive' },  // red
  u: { id: '#purple' },     // purple
  p: { id: '#projects' },
  n: { id: '#now' },
  w: { id: '#achievements' },
  s: { id: '#stack' },
  r: { id: '#certs' },
  m: { id: '#contact' },
};
let gPending = false;
let gTimer = null;
const isTyping = (target) => {
  const t = target.tagName;
  return target.isContentEditable || t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT';
};
const goRoute = (route) => {
  if (route.kind === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  const el = document.querySelector(route.id);
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); history.pushState(null, '', route.id); }
};
window.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (isTyping(e.target)) return;
  if (cmdk && !cmdk.hidden) return;
  const k = e.key;
  if (gPending) {
    gPending = false; clearTimeout(gTimer);
    const route = ROUTES[k.toLowerCase()];
    if (route) { e.preventDefault(); goRoute(route); }
    return;
  }
  if (k === 'g' || k === 'G') { gPending = true; gTimer = setTimeout(() => { gPending = false; }, 900); return; }
  if (k === 't' || k === 'T') { e.preventDefault(); cycleTheme(); return; }
  if (k === '?') { e.preventDefault(); openHelp(); return; }
  if (k === 'p' && !e.shiftKey) { /* don't override print, just hint */ }
});

/* ──────────────────────────────────────────────────────────
 * keyboard help modal (?)
 * ──────────────────────────────────────────────────────── */
const kHelp = document.getElementById('kHelp');
const openHelp = () => {
  if (!kHelp) return;
  kHelp.hidden = false;
  document.body.style.overflow = 'hidden';
};
const closeHelp = () => {
  if (!kHelp) return;
  kHelp.hidden = true;
  document.body.style.overflow = '';
};
kHelp && kHelp.addEventListener('click', (e) => { if (e.target.dataset.khelpClose !== undefined) closeHelp(); });
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && kHelp && !kHelp.hidden) { e.preventDefault(); closeHelp(); }
});

/* ──────────────────────────────────────────────────────────
 * scroll-spy: highlight active section in side indicator
 * ──────────────────────────────────────────────────────── */
const indicator = document.getElementById('sectionIndicator');
if (indicator) {
  const items = Array.from(indicator.querySelectorAll('li'));
  const map = new Map(items.map((li) => [li.dataset.target, li]));
  const targets = items.map((li) => document.querySelector(li.dataset.target)).filter(Boolean);
  const setActive = (id) => {
    items.forEach((li) => li.classList.toggle('active', li.dataset.target === id));
  };
  const spy = new IntersectionObserver((entries) => {
    // pick the entry closest to the top that is intersecting
    const visible = entries.filter((en) => en.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length) setActive('#' + visible[0].target.id);
  }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });
  targets.forEach((t) => spy.observe(t));
  items.forEach((li) => li.addEventListener('click', () => {
    const t = document.querySelector(li.dataset.target);
    if (t) { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); history.pushState(null, '', li.dataset.target); }
  }));
}

/* ──────────────────────────────────────────────────────────
 * MITRE ATT&CK matrix — render + hover/focus rule preview
 * ──────────────────────────────────────────────────────── */
const TACTICS = [
  { name: 'Initial Access', techs: [
    { id: 'T1078',   name: 'Valid Accounts',           state: 'covered', rule: { engine: 'wazuh', tag: 'custom-rule', title: 'Impossible-travel sign-in', body:
`<rule id="100210" level="10">
  <if_group>authentication_failures</if_group>
  <same_source_ip />
  <same_user />
  <different_geoip />
  <description>Impossible-travel sign-in: same user, two countries < 1h</description>
  <mitre><id>T1078</id><tactic>Initial Access</tactic></mitre>
</rule>` } },
    { id: 'T1133',   name: 'External Remote Services', state: 'covered', rule: { engine: 'wazuh', tag: 'fortigate-vpn', title: 'FortiGate VPN brute-force', body:
`<rule id="100204" level="9">
  <if_sid>4651</if_sid>
  <field name="action">login_failed</field>
  <description>FortiGate SSL-VPN: 5 failed logins from same IP in 60s</description>
  <mitre><id>T1133</id></mitre>
</rule>` } },
    { id: 'T1566.002', name: 'Phishing: link',         state: 'planned' },
  ] },
  { name: 'Execution', techs: [
    { id: 'T1059.001', name: 'PowerShell',             state: 'covered', rule: { engine: 'wazuh', tag: 'sysmon', title: 'Suspicious encoded PowerShell', body:
`<rule id="100311" level="12">
  <if_group>sysmon_event1</if_group>
  <field name="win.eventdata.commandLine" type="pcre2">(?i)-enc(odedcommand)? [A-Za-z0-9+/=]{60,}</field>
  <description>PowerShell with long base64 encoded command</description>
  <mitre><id>T1059.001</id></mitre>
</rule>` } },
    { id: 'T1059.003', name: 'cmd.exe',                state: 'covered', rule: { engine: 'wazuh', tag: 'sysmon', title: 'Living-off-the-land cmd chain', body:
`<rule id="100315" level="9">
  <if_group>sysmon_event1</if_group>
  <field name="win.eventdata.commandLine" type="pcre2">(?i)cmd\\.exe.*(/c|/k).*&amp;&amp;.*(net|whoami|tasklist|systeminfo)</field>
  <description>cmd.exe chained recon commands</description>
  <mitre><id>T1059.003</id></mitre>
</rule>` } },
    { id: 'T1106',     name: 'Native API',             state: 'planned' },
  ] },
  { name: 'Persistence', techs: [
    { id: 'T1547.001', name: 'Run keys',               state: 'covered', rule: { engine: 'wazuh', tag: 'sysmon', title: 'New autorun registry key', body:
`<rule id="100412" level="10">
  <if_group>sysmon_event13</if_group>
  <field name="win.eventdata.targetObject" type="pcre2">(?i)\\\\Software\\\\Microsoft\\\\Windows\\\\CurrentVersion\\\\Run\\\\</field>
  <description>Sysmon: registry value set under Run key</description>
  <mitre><id>T1547.001</id></mitre>
</rule>` } },
    { id: 'T1543.003', name: 'Windows service',        state: 'planned' },
  ] },
  { name: 'Defense Evasion', techs: [
    { id: 'T1027',     name: 'Obfuscated files',       state: 'covered', rule: { engine: 'suricata', tag: 'et-policy', title: 'High-entropy executable download', body:
`alert http any any -> $HOME_NET any (
  msg:"ET POLICY high-entropy PE downloaded";
  flow:established,to_client; file_data;
  filemd5:!whitelist.list; classtype:policy-violation; sid:9001234; rev:1;
)` } },
    { id: 'T1112',     name: 'Modify Registry',        state: 'covered', rule: { engine: 'wazuh', tag: 'sysmon', title: 'Defender disabled via registry', body:
`<rule id="100501" level="14">
  <if_group>sysmon_event13</if_group>
  <field name="win.eventdata.targetObject" type="pcre2">(?i)DisableAntiSpyware|DisableRealtimeMonitoring</field>
  <description>Defender real-time protection disabled</description>
  <mitre><id>T1112</id></mitre>
</rule>` } },
  ] },
  { name: 'Credential Access', techs: [
    { id: 'T1003.001', name: 'LSASS memory',           state: 'covered', rule: { engine: 'wazuh', tag: 'sysmon', title: 'Suspicious access to LSASS', body:
`<rule id="100620" level="14">
  <if_group>sysmon_event10</if_group>
  <field name="win.eventdata.targetImage">C:\\\\Windows\\\\System32\\\\lsass.exe</field>
  <field name="win.eventdata.grantedAccess" type="pcre2">0x10|0x1410|0x1010</field>
  <description>Process opened LSASS with credential-dump access mask</description>
  <mitre><id>T1003.001</id></mitre>
</rule>` } },
    { id: 'T1110',     name: 'Brute force',            state: 'covered', rule: { engine: 'wazuh', tag: 'auth', title: 'SSH brute-force from single IP', body:
`<rule id="5712" level="10">
  <if_matched_sid>5710</if_matched_sid>
  <same_source_ip />
  <description>sshd: 8 failed logins from same source within 120s</description>
  <mitre><id>T1110</id></mitre>
</rule>` } },
  ] },
  { name: 'Discovery', techs: [
    { id: 'T1087',     name: 'Account discovery',      state: 'planned' },
    { id: 'T1018',     name: 'Remote system discovery',state: 'planned' },
  ] },
  { name: 'Lateral Movement', techs: [
    { id: 'T1021.001', name: 'RDP',                    state: 'covered', rule: { engine: 'wazuh', tag: 'win-security', title: 'RDP from non-corporate IP', body:
`<rule id="100710" level="10">
  <if_sid>60103</if_sid>
  <field name="win.eventdata.LogonType">10</field>
  <srcip>!10.0.0.0/8</srcip>
  <description>Successful RDP logon from outside the corporate range</description>
  <mitre><id>T1021.001</id></mitre>
</rule>` } },
    { id: 'T1021.002', name: 'SMB / Admin shares',     state: 'planned' },
  ] },
  { name: 'Exfiltration / C2', techs: [
    { id: 'T1071.001', name: 'Web protocols (C2)',     state: 'covered', rule: { engine: 'suricata', tag: 'et-trojan', title: 'Beaconing to known C2', body:
`alert http $HOME_NET any -> any any (
  msg:"ET TROJAN beacon with abuse.ch C2 hostname";
  flow:established,to_server; http.host; pcre:"/abuseintel\\.example\\.tld$/i";
  classtype:trojan-activity; sid:9001500; rev:2;
)` } },
    { id: 'T1041',     name: 'Exfiltration over C2',   state: 'planned' },
    { id: 'T1567',     name: 'Web service exfil',      state: 'out' },
  ] },
];

const matrix = document.getElementById('attMatrix');
const rpEl = document.getElementById('rulePreview');
const rpTitle = document.getElementById('rpTitle');
const rpTag = document.getElementById('rpTag');
const rpBody = document.getElementById('rpBody');

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const renderMatrix = () => {
  if (!matrix) return;
  matrix.innerHTML = '';
  TACTICS.forEach((tac) => {
    const col = document.createElement('div');
    col.className = 'tactic';
    const h = document.createElement('p');
    h.className = 'tactic-name';
    h.textContent = tac.name;
    col.appendChild(h);
    const ul = document.createElement('ul');
    tac.techs.forEach((t) => {
      const li = document.createElement('li');
      li.className = 'ttp';
      li.dataset.state = t.state;
      li.dataset.id = t.id;
      li.tabIndex = 0;
      li.setAttribute('role', 'button');
      li.setAttribute('aria-label', `${t.id} ${t.name} — ${t.state}`);
      li.innerHTML = `<span class="ttp-id">${t.id}</span><span class="ttp-name">${t.name}</span>`;
      const show = () => showRule(t);
      li.addEventListener('mouseenter', show);
      li.addEventListener('focus', show);
      li.addEventListener('click', show);
      ul.appendChild(li);
    });
    col.appendChild(ul);
    matrix.appendChild(col);
  });
};

const showRule = (t) => {
  if (!rpEl) return;
  if (t.state !== 'covered' || !t.rule) {
    rpEl.classList.remove('live');
    rpTitle.textContent = `${t.id} — ${t.name}`;
    rpTag.textContent = t.state === 'planned' ? 'planned · backlog' : 'out of scope';
    rpBody.innerHTML = `<code>// no rule yet — ${escapeHtml(t.name)} is on the backlog.\n// follow home-lab-siem for updates.</code>`;
    return;
  }
  rpEl.classList.add('live');
  rpTitle.textContent = `${t.id} — ${t.rule.title}`;
  rpTag.textContent = `${t.rule.engine} · ${t.rule.tag}`;
  rpBody.innerHTML = `<code>${escapeHtml(t.rule.body)}</code>`;
};

renderMatrix();

// auto-rotate through covered techniques every 4.5s when section visible
if (matrix && rpEl) {
  const covered = TACTICS.flatMap((t) => t.techs).filter((t) => t.state === 'covered');
  let idx = 0;
  let timer = null;
  let inView = false;
  let userInteracted = false;
  matrix.addEventListener('mouseenter', () => { userInteracted = true; });
  matrix.addEventListener('focusin', () => { userInteracted = true; });
  const tick = () => {
    if (!inView || userInteracted) return;
    showRule(covered[idx % covered.length]);
    idx++;
  };
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      inView = e.isIntersecting;
      if (inView && !timer) {
        showRule(covered[0]);
        idx = 1;
        timer = setInterval(tick, 4500);
      } else if (!inView && timer) {
        clearInterval(timer); timer = null;
      }
    });
  }, { threshold: 0.25 });
  obs.observe(matrix);
}

/* ──────────────────────────────────────────────────────────
 * scroll-to-top FAB
 * ──────────────────────────────────────────────────────── */
const totop = document.createElement('button');
totop.className = 'totop';
totop.type = 'button';
totop.setAttribute('aria-label', 'Back to top');
totop.innerHTML = '↑';
totop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(totop);
window.addEventListener('scroll', () => {
  totop.classList.toggle('visible', window.scrollY > 800);
}, { passive: true });

/* ──────────────────────────────────────────────────────────
 * ?print → switch to print preview automatically
 * ──────────────────────────────────────────────────────── */
const params = new URLSearchParams(location.search);
if (params.has('print') || params.has('cv')) {
  // give the page a tick to render then trigger print
  document.documentElement.setAttribute('data-theme', 'paper');
  setTimeout(() => { window.print(); }, 600);
}

/* ──────────────────────────────────────────────────────────
 * SOC boot overlay (one-time, skippable, prefers-reduced-motion respected)
 * ──────────────────────────────────────────────────────── */
(() => {
  const boot = document.getElementById('boot');
  const log  = document.getElementById('bootLog');
  if (!boot || !log) return;
  if (prefersReducedMotion) return;
  let seen = false;
  try { seen = localStorage.getItem('yz.boot') === '1'; } catch (_) {}
  if (seen) return;
  const p = new URLSearchParams(location.search);
  if (p.has('print') || p.has('cv')) return;

  const lines = [
    { t: 'ok',   k: '[ ok  ]', m: 'kernel: yz-soc 6.5.0 · booting blue+red+purple init' },
    { t: 'ok',   k: '[ ok  ]', m: 'wazuh-manager.service started · 6213 rules loaded' },
    { t: 'ok',   k: '[ ok  ]', m: 'suricata.service started · 14k+ ETOpen sids' },
    { t: 'ok',   k: '[ ok  ]', m: 'sysmon-collector · logman started' },
    { t: 'ok',   k: '[ ok  ]', m: 'misp.feed.sync — 142 IOCs in 380ms' },
    { t: 'ok',   k: '[ ok  ]', m: 'fortigate-syslog · link up' },
    { t: 'warn', k: '[warn ]', m: 'lab-segment.dc01 · simulated lsass-dump expected at +30s' },
    { t: 'ok',   k: '[ ok  ]', m: 'atomic-red-team scheduled · 22 tests in rotation' },
    { t: 'ok',   k: '[ ok  ]', m: 'sigma-pipeline · 14 rules compiled → wazuh + splunk' },
    { t: 'done', k: '[done ]', m: 'soc operational — mttd<60s · mttr<5min · posture: blue+red+purple' },
  ];
  boot.hidden = false; boot.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
  let i = 0;
  let cancelled = false;
  const close = () => {
    if (cancelled) return; cancelled = true;
    boot.hidden = true; boot.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    try { localStorage.setItem('yz.boot', '1'); } catch (_) {}
  };
  const next = () => {
    if (cancelled) return;
    if (i >= lines.length) { setTimeout(close, 320); return; }
    const ln = lines[i++];
    const li = document.createElement('li');
    li.className = ln.t;
    li.innerHTML = `<b>${ln.k}</b> ${ln.m}`;
    log.appendChild(li);
    setTimeout(next, 130 + Math.random() * 90);
  };
  next();
  const skip = (e) => {
    if (e && e.type === 'keydown' && e.key !== 'Escape' && e.key !== ' ' && e.key !== 'Enter') return;
    close();
  };
  boot.addEventListener('click', skip, { once: true });
  window.addEventListener('keydown', skip);
})();

/* ──────────────────────────────────────────────────────────
 * Live ops widget — clock + uptime + rotating IOC + theme echo
 * ──────────────────────────────────────────────────────── */
(() => {
  const root = document.getElementById('liveops');
  if (!root) return;
  const clock = document.getElementById('loClock');
  const uptime = document.getElementById('loUptime');
  const ioc = document.getElementById('loIoc');
  const themeEcho = document.getElementById('loTheme');
  const x = document.getElementById('liveopsX');
  const start = Date.now();
  try { if (localStorage.getItem('yz.liveops') === '0') root.classList.add('hidden'); } catch (_) {}
  const fmtUp = (ms) => {
    const s = Math.floor(ms / 1000);
    if (s < 60) return s + 's';
    const m = Math.floor(s / 60), sr = s % 60;
    if (m < 60) return m + 'm ' + sr + 's';
    const h = Math.floor(m / 60), mr = m % 60;
    return h + 'h ' + mr + 'm';
  };
  const iocs = [
    'sha256:c4f3…d18a (mimikatz)',
    'ip:185.234.218.41 (c2)',
    'domain:abuseintel.example.tld',
    'sha1:1a9f…2b3c (cobaltstrike)',
    'sid:2008193 · ET malware',
    'cve:CVE-2024-3094 (xz-utils)',
    'sha256:88a3…fe09 (lsass.dmp)',
    'ip:23.94.190.232 (scanner)',
    'tld:.zip phishing kit',
    'cve:CVE-2024-21762 (fortios)',
  ];
  let iocIdx = Math.floor(Math.random() * iocs.length);
  const tickClock = () => {
    const d = new Date();
    const z = (n) => String(n).padStart(2, '0');
    if (clock) clock.textContent = z(d.getHours()) + ':' + z(d.getMinutes()) + ':' + z(d.getSeconds());
    if (uptime) uptime.textContent = fmtUp(Date.now() - start);
    if (themeEcho) themeEcho.textContent = currentTheme();
  };
  const tickIoc = () => { if (ioc) ioc.textContent = iocs[iocIdx++ % iocs.length]; };
  tickClock(); tickIoc();
  setInterval(tickClock, 1000);
  setInterval(tickIoc, 4500);
  x && x.addEventListener('click', () => {
    root.classList.add('hidden');
    try { localStorage.setItem('yz.liveops', '0'); } catch (_) {}
  });
})();

/* ──────────────────────────────────────────────────────────
 * Threat-intel ticker — duplicate track for seamless scroll
 * ──────────────────────────────────────────────────────── */
(() => {
  const track = document.getElementById('tkTrack');
  if (!track) return;
  const html = track.innerHTML;
  track.innerHTML = html + html;
})();

/* ──────────────────────────────────────────────────────────
 * Vim-style cmdline — `:` to open, ex commands
 * ──────────────────────────────────────────────────────── */
let openCmdline, closeCmdline;
(() => {
  const cl = document.getElementById('cmdline');
  const inp = document.getElementById('cmdlineInput');
  const hint = document.getElementById('cmdlineHint');
  if (!cl || !inp) return;
  const setHint = (s) => {
    if (!hint) return;
    hint.textContent = '';
    hint.appendChild(document.createTextNode(s));
  };
  const COMMANDS = {
    'help':       () => setHint('cmds: theme [name] · about · case · blue · red · purple · projects · now · achievements · stack · certs · contact · cv · print · reset · flag · q'),
    'theme':      (a) => { if (a && THEMES.includes(a)) applyTheme(a); else cycleTheme(); setHint('theme → ' + currentTheme()); },
    'about':      () => goRoute({ id: '#about' }),
    'case':       () => goRoute({ id: '#case' }),
    'detect':     () => goRoute({ id: '#detect' }),
    'blue':       () => goRoute({ id: '#detect' }),
    'offensive':  () => goRoute({ id: '#offensive' }),
    'red':        () => goRoute({ id: '#offensive' }),
    'purple':     () => goRoute({ id: '#purple' }),
    'projects':   () => goRoute({ id: '#projects' }),
    'now':        () => goRoute({ id: '#now' }),
    'achievements': () => goRoute({ id: '#achievements' }),
    'wall':       () => goRoute({ id: '#achievements' }),
    'stack':      () => goRoute({ id: '#stack' }),
    'certs':      () => goRoute({ id: '#certs' }),
    'contact':    () => goRoute({ id: '#contact' }),
    'mail':       () => { location.href = 'mailto:yassirzahidi8@gmail.com'; },
    'cv':         () => window.open('assets/cv-en.pdf', '_blank', 'noopener'),
    'print':      () => window.print(),
    'flag':       () => setHint('YZ{cmdline_3rd_flag_purple_loop_ftw}'),
    'reset':      () => { try { ['yz.theme','yz.boot','yz.liveops'].forEach((k) => localStorage.removeItem(k)); } catch (_) {} setHint('reset — reload to replay boot'); },
    'q':          () => closeCmdline(),
    'quit':       () => closeCmdline(),
  };
  openCmdline = () => {
    cl.hidden = false; inp.value = ''; setHint('type help');
    setTimeout(() => inp.focus(), 0);
  };
  closeCmdline = () => { cl.hidden = true; };
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); closeCmdline(); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      const raw = inp.value.trim();
      if (!raw) { closeCmdline(); return; }
      const [name, ...rest] = raw.split(/\s+/);
      const cmd = COMMANDS[name.toLowerCase()];
      if (cmd) { cmd(rest[0]); if (!['help', 'theme', 'flag', 'reset'].includes(name.toLowerCase())) closeCmdline(); }
      else { setHint('not a command: ' + name); }
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const q = inp.value.toLowerCase();
      const match = Object.keys(COMMANDS).find((c) => c.startsWith(q));
      if (match) inp.value = match;
    }
  });
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (isTyping(e.target)) return;
    if (cmdk && !cmdk.hidden) return;
    if (e.key === ':') { e.preventDefault(); openCmdline(); }
  });
})();

/* ──────────────────────────────────────────────────────────
 * War-room overlay — Konami unlock ↑↑↓↓←→←→ba
 * ──────────────────────────────────────────────────────── */
(() => {
  const wr = document.getElementById('warroom');
  if (!wr) return;
  const open = () => { wr.hidden = false; wr.removeAttribute('aria-hidden'); document.body.style.overflow = 'hidden'; };
  const close = () => { wr.hidden = true; wr.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
  wr.querySelectorAll('[data-wr-close]').forEach((b) => b.addEventListener('click', close));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !wr.hidden) { e.preventDefault(); close(); }
  });
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let i = 0;
  window.addEventListener('keydown', (e) => {
    if (isTyping(e.target)) return;
    const wanted = seq[i];
    const k = (e.key.length === 1 ? e.key.toLowerCase() : e.key);
    if (k === wanted) {
      i++;
      if (i === seq.length) { i = 0; open(); }
    } else { i = (k === seq[0] ? 1 : 0); }
  });
})();
