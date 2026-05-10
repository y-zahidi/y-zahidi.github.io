/**
 * portfolio-counter-fix.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Drop this into y-zahidi.github.io/assets/ and add one line in index.html:
 *   <script src="assets/counter-fix.js" defer></script>
 *
 * It replaces the broken animated counters with a robust version.
 * Values to display (update as your projects grow):
 * ─────────────────────────────────────────────────────────────────────────────
 */

const COUNTER_DATA = {
  "production projects shipped":   { value: 7,     suffix: "" },
  "cybersecurity certifications":  { value: 13,    suffix: "" },
  "incidents triaged at alten":    { value: 50,    suffix: "+" },
  "records in water-stress":       { value: 68000, suffix: "" },
  "to spin up the siem lab":       { value: 3,     suffix: " min" },
};

function animateCounter(el, target, suffix = "", duration = 1600) {
  const start    = performance.now();
  const startVal = 0;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutQuart(progress);
    const current  = Math.floor(startVal + (target - startVal) * eased);

    el.textContent = current.toLocaleString() + (progress === 1 ? suffix : "");
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function initCounters() {
  // Find all elements whose text content is "0" and are near a label
  // Try multiple selector strategies to handle different HTML structures
  const strategies = [
    // Strategy 1: data-target attribute
    () => document.querySelectorAll("[data-target]"),
    // Strategy 2: .stat-number, .counter, .count class
    () => document.querySelectorAll(".stat-number, .counter, .count, .stat"),
    // Strategy 3: any element containing only "0" adjacent to a description
    () => {
      const candidates = [];
      document.querySelectorAll("span, p, div, h2, h3").forEach(el => {
        if (el.textContent.trim() === "0" && el.children.length === 0) {
          candidates.push(el);
        }
      });
      return candidates;
    },
  ];

  let targets = [];
  for (const s of strategies) {
    const found = s();
    if (found && found.length > 0) {
      targets = Array.from(found);
      break;
    }
  }

  if (targets.length === 0) {
    // Fallback: try to find the stats section and patch it directly
    patchStatsSectionDirectly();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      // Get target value from data-target or from nearby text
      let targetVal = parseInt(el.dataset.target, 10);
      let suffix    = el.dataset.suffix || "";

      if (!targetVal) {
        // try to match by nearby label text
        const label = (el.nextElementSibling?.textContent || el.parentElement?.textContent || "").toLowerCase();
        for (const [key, data] of Object.entries(COUNTER_DATA)) {
          if (label.includes(key.split(" ")[0]) || label.includes(key.split(" ")[1] || "")) {
            targetVal = data.value;
            suffix    = data.suffix;
            break;
          }
        }
      }

      if (targetVal) animateCounter(el, targetVal, suffix);
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  targets.forEach(el => observer.observe(el));
}

function patchStatsSectionDirectly() {
  // Last resort: find the stats grid by structure
  // The portfolio shows: [number][label] pairs
  // Walk all text nodes looking for lone "0" values
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        return node.textContent.trim() === "0"
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      }
    }
  );

  const zeroNodes = [];
  while (walker.nextNode()) {
    zeroNodes.push(walker.currentNode);
  }

  if (zeroNodes.length === 0) return;

  // Map zero nodes to counter data by their sibling/parent text
  const dataEntries = Object.entries(COUNTER_DATA);
  let matchIndex = 0;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  zeroNodes.forEach((node, i) => {
    const el = node.parentElement;
    if (!el) return;

    // assign a counter target in order of appearance
    const [, data] = dataEntries[matchIndex % dataEntries.length];
    matchIndex++;

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      animateCounter(el, data.value, data.suffix);
      io.unobserve(el);
    }, { threshold: 0.3 });

    io.observe(el);
  });
}

// ── init ─────────────────────────────────────────────────────────────────────
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCounters);
} else {
  initCounters();
}
