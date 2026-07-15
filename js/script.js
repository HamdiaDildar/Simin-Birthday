/* =========================================================================
   HAPPY BIRTHDAY — LUXURY EDITION — script.js
   All the interactivity for the site lives here. The CONFIG object at the
   top holds every value you're likely to want to change: dates, name,
   memories, map pins, etc. Edit those first before touching anything below.
   ========================================================================= */

/* -------------------------------------------------------------------------
   0. CONFIG — edit me!
   ------------------------------------------------------------------------- */
const CONFIG = {
  // When you two met. Used by the Friendship Timer section. Format: YYYY-MM-DD
  friendshipStart: "2014-08-01",

  // Her birthday. The countdown automatically rolls to next year once it
  // passes, so you only ever need to set month/day (year can be anything).
  // Format: "YYYY-MM-DDTHH:MM:SS"
  birthdayDate: "2002-07-23T00:00:00",

  // Her name — used in a few personalized spots (title, hero, letter).
  friendName: "Simin",

  // "Memory of the Day" random generator — edit freely, add as many as you like.
  memories: [
    "That time we laughed so hard in public we got stared at — and didn't care.",
    "The trip we almost didn't take, and ended up being unforgettable.",
    "The night we talked until 4am about absolutely everything.",
    "That birthday we celebrated in the most chaotic, perfect way.",
    "The random Tuesday that somehow became a core memory.",
    "Add your own favorite memory here — edit CONFIG.memories in script.js."
  ],

  // Confetti / firework color palette (kept on-theme: maroon + gold + ivory)
  palette: ["#d4af64", "#e8cd96", "#7d1a2b", "#f6f1e6", "#a9823f"]
};

/* -------------------------------------------------------------------------
   Utilities
   ------------------------------------------------------------------------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const rand = (min, max) => Math.random() * (max - min) + min;
const pad2 = (n) => String(Math.max(0, Math.floor(n))).padStart(2, "0");

document.addEventListener("DOMContentLoaded", () => {
  restoreDraftIfAny();
  initLoader();
  initCursor();
  initScrollProgress();
  initParticleCanvas();
  initSparkleField();
  initRevealOnScroll();
  initHeroConfetti();
  initFriendshipCounter();
  initCountdown();
  initMemoryOfDay();
  initLightbox();
  initFlipTouch();
  initCarousel();
  initInteractiveCake();
  initGiftBox();
  initGuestbook();
  initEasterEgg();
  initThemeToggle();
  initEditMode();
  initBackToTop();
  initHorsesParallax();
  initEndingFinale();
});

/* -------------------------------------------------------------------------
   1. PAGE LOADER
   ------------------------------------------------------------------------- */
function initLoader() {
  const loader = $("#loader");
  if (!loader) return;
  const hide = () => loader.classList.add("loader-hide");
  // Hide once everything has loaded, but never make people wait more than 2.2s
  window.addEventListener("load", () => setTimeout(hide, 500));
  setTimeout(hide, 2200);
}

/* -------------------------------------------------------------------------
   2. CUSTOM CURSOR (desktop only — CSS hides it on touch devices)
   ------------------------------------------------------------------------- */
function initCursor() {
  const dot = $("#cursor-dot");
  const ring = $("#cursor-ring");
  if (!dot || !ring) return;
  let rx = 0, ry = 0, mx = 0, my = 0;

  window.addEventListener("mousemove", (e) => {
    dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    mx = e.clientX; my = e.clientY;
  });

  (function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();

  const hoverables = "a, button, .masonry-item, .flip-card, input, textarea, .polaroid, .swatch";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverables)) document.body.classList.add("cursor-hover");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverables)) document.body.classList.remove("cursor-hover");
  });
}

/* -------------------------------------------------------------------------
   3. SCROLL PROGRESS BAR
   ------------------------------------------------------------------------- */
function initScrollProgress() {
  const bar = $("#scroll-progress-bar");
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = `${scrolled}%`;
  };
  document.addEventListener("scroll", update, { passive: true });
  update();
}

/* -------------------------------------------------------------------------
   4. PARTICLE CANVAS (soft floating gold particles / starry depth)
   ------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = $("#particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function makeParticles() {
    const count = Math.min(70, Math.floor((w * h) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: rand(0.6, 2.2),
      vy: rand(-0.12, -0.35),
      vx: rand(-0.08, 0.08),
      alpha: rand(0.15, 0.6)
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.y += p.vy; p.x += p.vx;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,205,150,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  resize();
  makeParticles();
  tick();
  window.addEventListener("resize", () => { resize(); makeParticles(); });

  // gently increase presence as user scrolls deeper (starry-night bonus feature)
  document.addEventListener("scroll", () => {
    const depth = Math.min(1, window.scrollY / (document.body.scrollHeight * 0.5));
    canvas.style.opacity = (0.35 + depth * 0.5).toFixed(2);
  }, { passive: true });
}

/* -------------------------------------------------------------------------
   5. SPARKLE FIELD (small CSS-driven twinkles scattered across the page)
   ------------------------------------------------------------------------- */
function initSparkleField() {
  const field = $(".sparkle-field");
  if (!field) return;
  const n = 26;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.style.left = `${rand(0, 100)}%`;
    s.style.top = `${rand(0, 100)}%`;
    s.style.animationDelay = `${rand(0, 6)}s`;
    s.style.animationDuration = `${rand(4, 8)}s`;
    field.appendChild(s);
  }
}

/* -------------------------------------------------------------------------
   6. REVEAL ON SCROLL (IntersectionObserver)
   ------------------------------------------------------------------------- */
function initRevealOnScroll() {
  const genericSelectors = [
    ".eyebrow", ".section-title", ".section-lead",
    ".masonry-item", ".flip-flower-card", ".kurdish-card", ".horse-card",
    ".brand-card", ".perfume-card", ".icon-card", ".flip-card",
    ".gratitude-card", ".timeline-item", ".polaroid", ".bucket-item", ".swatch"
  ];
  genericSelectors.forEach((sel) => $$(sel).forEach((el) => el.classList.add("reveal")));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 0.07}s`;
    observer.observe(el);
  });

  // Letter paragraphs + ending lines use their own in-view CSS hooks
  const soft = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve && observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  $$(".letter-para, .ending-line").forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.35}s`;
    soft.observe(el);
  });
}

/* -------------------------------------------------------------------------
   7. CONFETTI ENGINE (reusable — hero load, cake blow, ending finale)
   ------------------------------------------------------------------------- */
function burstConfetti(container, count = 90, durationRange = [2600, 4600]) {
  if (!container) return;
  const shapes = ["50%", "2px"]; // circles + little squares
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    const size = rand(6, 12);
    piece.style.width = `${size}px`;
    piece.style.height = `${size * rand(0.4, 1)}px`;
    piece.style.left = `${rand(0, 100)}%`;
    piece.style.background = CONFIG.palette[Math.floor(rand(0, CONFIG.palette.length))];
    piece.style.borderRadius = shapes[Math.floor(rand(0, shapes.length))];
    piece.style.animationDuration = `${rand(durationRange[0], durationRange[1])}ms`;
    piece.style.animationDelay = `${rand(0, 500)}ms`;
    piece.style.transform = `rotate(${rand(0, 360)}deg)`;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), durationRange[1] + 800);
  }
}

function initHeroConfetti() {
  burstConfetti($("#hero-confetti"), 110, [3000, 5200]);
}

/* -------------------------------------------------------------------------
   8. FRIENDSHIP TIMER — counts up years / months / days since CONFIG.friendshipStart
   ------------------------------------------------------------------------- */
function initFriendshipCounter() {
  const section = $("#friendship-timer");
  if (!section) return;

  const start = new Date(CONFIG.friendshipStart);
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) { years -= 1; months += 12; }

  const totalDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));

  const animateNumber = (el, target, duration = 1400) => {
    const startTime = performance.now();
    const step = (t) => {
      const progress = Math.min(1, (t - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
  };

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateNumber($("#count-years"), years);
        animateNumber($("#count-months"), months);
        animateNumber($("#count-days"), days);
        animateNumber($("#count-total-days"), totalDays, 2000);
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });
  observer.observe(section);
}

/* -------------------------------------------------------------------------
   9. BIRTHDAY COUNTDOWN — auto-rolls to next year once the date passes
   ------------------------------------------------------------------------- */
function initCountdown() {
  const els = {
    days: $("#cd-days"), hours: $("#cd-hours"),
    minutes: $("#cd-minutes"), seconds: $("#cd-seconds"),
    arrived: $("#countdown-arrived")
  };
  if (!els.days) return;

  function nextBirthday() {
    const configured = new Date(CONFIG.birthdayDate);
    const now = new Date();
    let target = new Date(now.getFullYear(), configured.getMonth(), configured.getDate(),
                           configured.getHours(), configured.getMinutes(), configured.getSeconds());
    if (target < now) target.setFullYear(target.getFullYear() + 1);
    return target;
  }

  function tick() {
    const target = nextBirthday();
    const diff = target - new Date();
    if (diff <= 0) {
      els.arrived.classList.remove("hidden");
      ["days","hours","minutes","seconds"].forEach((k) => els[k].textContent = "00");
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    els.days.textContent = pad2(d);
    els.hours.textContent = pad2(h);
    els.minutes.textContent = pad2(m);
    els.seconds.textContent = pad2(s);
  }
  tick();
  setInterval(tick, 1000);
}

/* -------------------------------------------------------------------------
   10. MEMORY OF THE DAY
   ------------------------------------------------------------------------- */
function initMemoryOfDay() {
  const btn = $("#motd-btn");
  const text = $("#motd-text");
  if (!btn || !text) return;
  let lastIndex = -1;
  btn.addEventListener("click", () => {
    let idx;
    do { idx = Math.floor(rand(0, CONFIG.memories.length)); } while (idx === lastIndex && CONFIG.memories.length > 1);
    lastIndex = idx;
    text.style.opacity = 0;
    setTimeout(() => {
      text.textContent = CONFIG.memories[idx];
      text.style.transition = "opacity .5s ease";
      text.style.opacity = 1;
    }, 220);
  });
}

/* -------------------------------------------------------------------------
   11. MASONRY LIGHTBOX
   ------------------------------------------------------------------------- */
function initLightbox() {
  const items = $$(".masonry-item");
  const lightbox = $("#lightbox");
  if (!items.length || !lightbox) return;

  const imgEl = $("#lightbox-img");
  const capEl = $("#lightbox-caption");
  let current = 0;

  function open(index) {
    current = index;
    render();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function close() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function render() {
    const el = items[current];
    const src = el.querySelector("img").getAttribute("src");
    imgEl.src = src;
    imgEl.alt = el.querySelector("img").alt || "";
    capEl.textContent = el.dataset.caption || "";
  }
  function nav(delta) {
    current = (current + delta + items.length) % items.length;
    render();
  }

  items.forEach((el, i) => el.addEventListener("click", () => open(i)));
  $(".lightbox-close").addEventListener("click", close);
  $(".lightbox-prev").addEventListener("click", () => nav(-1));
  $(".lightbox-next").addEventListener("click", () => nav(1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") nav(-1);
    if (e.key === "ArrowRight") nav(1);
  });
}

/* -------------------------------------------------------------------------
   12. FLIP CARDS — tap-to-flip fallback for touch devices
   ------------------------------------------------------------------------- */
function initFlipTouch() {
  if (!("ontouchstart" in window)) return;
  $$(".flip-card").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("flipped"));
  });
}

/* -------------------------------------------------------------------------
   13. POLAROID CAROUSEL
   ------------------------------------------------------------------------- */
function initCarousel() {
  const track = $("#carousel-track");
  const carousel = $("#polaroid-carousel");
  if (!track || !carousel) return;
  const slides = $$(".carousel-slide", track);
  let index = 0;
  let autoTimer;

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
  }
  $(".carousel-prev", carousel).addEventListener("click", () => go(index - 1));
  $(".carousel-next", carousel).addEventListener("click", () => go(index + 1));

  function startAuto() { autoTimer = setInterval(() => go(index + 1), 4500); }
  function stopAuto() { clearInterval(autoTimer); }
  startAuto();
  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);
}

/* -------------------------------------------------------------------------
   15. INTERACTIVE BIRTHDAY CAKE
   ------------------------------------------------------------------------- */
function initInteractiveCake() {
  const candles = $$(".ic-candle");
  const lightAllBtn = $("#light-all-btn");
  const blowBtn = $("#blow-btn");
  const confettiLayer = $("#cake-confetti");
  const sfxBlow = $("#sfx-blow");
  const sfxBirthday = $("#sfx-birthday");
  if (!candles.length) return;

  candles.forEach((c) => {
    c.addEventListener("click", () => {
      const lit = c.dataset.lit === "true";
      c.dataset.lit = lit ? "false" : "true";
    });
  });

  lightAllBtn && lightAllBtn.addEventListener("click", () => {
    candles.forEach((c, i) => setTimeout(() => { c.dataset.lit = "true"; }, i * 180));
    safePlay(sfxBirthday);
  });

  blowBtn && blowBtn.addEventListener("click", () => {
    const anyLit = candles.some((c) => c.dataset.lit === "true");
    if (!anyLit) { candles.forEach((c) => (c.dataset.lit = "true")); }
    setTimeout(() => {
      candles.forEach((c) => (c.dataset.lit = "false"));
      burstConfetti(confettiLayer, 70, [1800, 3000]);
      safePlay(sfxBlow);
    }, anyLit ? 0 : 500);
  });
}

function safePlay(audioEl) {
  if (!audioEl) return;
  const p = audioEl.play();
  if (p && p.catch) p.catch(() => {/* file missing or autoplay blocked — silently ignore */});
}

/* -------------------------------------------------------------------------
   16. GIFT BOX
   ------------------------------------------------------------------------- */
function initGiftBox() {
  const box = $("#gift-box");
  const message = $("#gift-message");
  const chime = $("#sfx-chime");
  if (!box) return;
  box.addEventListener("click", () => {
    box.classList.toggle("open");
    message.classList.toggle("hidden");
    if (box.classList.contains("open")) safePlay(chime);
  });
}

/* -------------------------------------------------------------------------
   17. DIGITAL GUESTBOOK (persisted in localStorage on this browser/device)
   ------------------------------------------------------------------------- */
function initGuestbook() {
  const form = $("#guestbook-form");
  const list = $("#guestbook-entries");
  if (!form || !list) return;
  const STORAGE_KEY = "birthdaySiteGuestbook";

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }
  function save(entries) { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }

  function render() {
    const entries = load();
    list.innerHTML = "";
    entries.slice().reverse().forEach((entry) => {
      const div = document.createElement("div");
      div.className = "guestbook-entry";
      const date = new Date(entry.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
      div.innerHTML = `<span class="gb-date">${date}</span><span class="gb-name">${escapeHTML(entry.name)}</span><p>${escapeHTML(entry.message)}</p>`;
      list.appendChild(div);
    });
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#gb-name").value.trim();
    const message = $("#gb-message").value.trim();
    if (!name || !message) return;
    const entries = load();
    entries.push({ name, message, date: new Date().toISOString() });
    save(entries);
    form.reset();
    render();
  });

  render();
}

/* -------------------------------------------------------------------------
   18. EASTER EGG — click the footer heart 5 times to reveal a secret note
   ------------------------------------------------------------------------- */
function initEasterEgg() {
  const trigger = $("#easter-egg-trigger");
  const modal = $("#easter-egg-modal");
  const closeBtn = $(".easter-close");
  if (!trigger || !modal) return;
  let count = 0, resetTimer;

  trigger.addEventListener("click", () => {
    count++;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => (count = 0), 1800);
    if (count >= 5) {
      modal.classList.remove("hidden");
      count = 0;
      burstConfetti(modal, 40, [1600, 2600]);
    }
  });
  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });
}

/* -------------------------------------------------------------------------
   19. DARK / LIGHT THEME TOGGLE
   ------------------------------------------------------------------------- */
function initThemeToggle() {
  const btn = $("#theme-toggle");
  if (!btn) return;
  const saved = localStorage.getItem("birthdaySiteTheme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    if (next === "dark") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("birthdaySiteTheme", next);
  });
}

/* -------------------------------------------------------------------------
   20. EDIT MODE — inline text/photo editing, PIN-protected, exportable
   -------------------------------------------------------------------------
   How it works:
   - Everything inside #editable-root (the hero, all sections, the footer,
     and the easter-egg modal) is what you can edit and what gets exported.
   - The pencil icon opens a PIN prompt. The first time you use it, you set
     the PIN; every time after, you need it — including on the deployed
     site, since the PIN's hash is stored on <body data-pin-hash> which
     travels with the exported file. This isn't bank-grade security (it's
     a client-side hash, viewable in devtools by anyone determined enough)
     but it's enough to keep a casual visitor like Simin out of edit mode.
   - While editing, text becomes click-to-type and photos get a small
     "✎ Change" badge that opens a file picker (swaps the image to a
     data-URL, no server needed). Edits autosave as a draft to this
     browser's localStorage so a refresh doesn't lose your progress.
   - "Done" locks editing and downloads a complete, self-contained
     index.html with your edits baked in — that's the file you deploy /
     send. The page also stays locked for any other visitor by default.
   ------------------------------------------------------------------------- */
const DRAFT_KEY = "birthdaySiteDraftHTML";

// Shown in a freshly-added photo slot until you upload a real image.
const BLANK_PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">' +
  '<rect width="100%" height="100%" fill="#2a0810"/>' +
  '<text x="50%" y="50%" fill="#d4af64" font-size="26" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">+ Add Photo</text>' +
  "</svg>"
);

// Fallback templates used only if a gallery section has been emptied out
// completely and there's nothing left to clone from.
const GALLERY_SKELETONS = {
  memories: () => {
    const f = document.createElement("figure");
    f.className = "masonry-item"; f.dataset.caption = "";
    const img = document.createElement("img"); img.loading = "lazy"; img.alt = "Memory";
    f.appendChild(img);
    return f;
  },
  flowers: () => {
    const d = document.createElement("div");
    d.className = "flip-flower-card";
    d.innerHTML = '<img loading="lazy" alt="Flower"><div class="flower-info"><h3>New Flower</h3><p>Add a description.</p></div>';
    return d;
  },
  kurdish: () => {
    const f = document.createElement("figure");
    f.className = "kurdish-card";
    f.innerHTML = '<img loading="lazy" alt="Kurdish dress"><figcaption>New Photo</figcaption>';
    return f;
  },
  horses: () => {
    const f = document.createElement("figure");
    f.className = "horse-card";
    f.innerHTML = '<img loading="lazy" alt="Horse">';
    return f;
  },
  brands: () => {
    const d = document.createElement("div");
    d.className = "brand-card";
    d.innerHTML = '<div class="brand-logo"><img loading="lazy" alt="Brand logo"></div><img class="brand-image" loading="lazy" alt="Brand"><h3>New Brand</h3><p>Add a description.</p>';
    return d;
  },
  perfumes: () => {
    const d = document.createElement("div");
    d.className = "perfume-card";
    d.innerHTML = '<img loading="lazy" alt="Perfume"><h3>New Perfume</h3><p class="fragrance-family">Fragrance family</p>';
    return d;
  },
  polaroids: () => {
    const d = document.createElement("div");
    d.className = "polaroid";
    d.innerHTML = '<img loading="lazy" alt="Polaroid"><p>New memory</p>';
    return d;
  }
};

function simpleHash(str) {
  // Not cryptographic — just enough friction to keep casual visitors out.
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

// Shows a small "message + Undo" toast for a few seconds. No blocking dialogs
// (native confirm() can be flaky across browsers), so deleting a photo is a
// single click, and undoing is just as easy.
function showUndoToast(message, onUndo) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  const text = document.createElement("span");
  text.textContent = message;
  const undoBtn = document.createElement("button");
  undoBtn.type = "button";
  undoBtn.textContent = "Undo";
  let undone = false;
  undoBtn.addEventListener("click", () => {
    undone = true;
    onUndo();
    remove();
  });
  toast.appendChild(text);
  toast.appendChild(undoBtn);
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));

  function remove() {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 350);
  }
  setTimeout(() => { if (!undone) remove(); }, 5000);
}

function getPinHash() {
  return document.body.dataset.pinHash || localStorage.getItem("sitePinHash") || "";
}
function setPinHash(hash) {
  document.body.dataset.pinHash = hash;
  localStorage.setItem("sitePinHash", hash);
}

function restoreDraftIfAny() {
  const root = document.getElementById("editable-root");
  const saved = localStorage.getItem(DRAFT_KEY);
  if (root && saved) root.innerHTML = saved;
}

function cleanNodeForExport(node) {
  node.querySelectorAll("[contenteditable]").forEach((el) => el.removeAttribute("contenteditable"));
  node.querySelectorAll(".img-edit-badge, .item-delete-badge, .caption-edit-badge, .gallery-add-tile").forEach((el) => el.remove());
  node.querySelectorAll(".confetti-piece, .firework-particle").forEach((el) => el.remove());
  const gb = node.querySelector("#guestbook-entries");
  if (gb) gb.innerHTML = "";
  return node;
}

function saveDraft() {
  const root = document.getElementById("editable-root");
  if (!root) return;
  const clone = cleanNodeForExport(root.cloneNode(true));
  localStorage.setItem(DRAFT_KEY, clone.innerHTML);
}

let draftSaveTimer = null;
function scheduleDraftSave() {
  clearTimeout(draftSaveTimer);
  draftSaveTimer = setTimeout(saveDraft, 700);
}

function initEditMode() {
  const editToggle = $("#edit-toggle");
  const editableRoot = $("#editable-root");
  const pinModal = $("#pin-modal");
  const pinTitle = $("#pin-modal-title");
  const pinSub = $("#pin-modal-sub");
  const pinInput = $("#pin-input");
  const pinConfirmInput = $("#pin-confirm-input");
  const pinError = $("#pin-error");
  const pinConfirmBtn = $("#pin-confirm-btn");
  const pinCloseBtn = $("#pin-modal-close");
  const toolbar = $("#edit-toolbar");
  const doneBtn = $("#edit-done-btn");
  const cancelBtn = $("#edit-cancel-btn");
  const fileInput = $("#image-upload-input");
  if (!editToggle || !editableRoot) return;

  let mode = "setup"; // or "verify"
  let currentEditImg = null;

  function openPinModal(nextMode) {
    mode = nextMode;
    pinInput.value = ""; pinConfirmInput.value = ""; pinError.classList.add("hidden");
    if (mode === "setup") {
      pinTitle.textContent = "✦ Set an Edit PIN ✦";
      pinSub.textContent = "This protects the page so only you can edit it again — remember it!";
      pinConfirmInput.classList.remove("hidden");
    } else {
      pinTitle.textContent = "✦ Enter Your PIN ✦";
      pinSub.textContent = "Editing is locked. Enter your PIN to continue.";
      pinConfirmInput.classList.add("hidden");
    }
    pinModal.classList.remove("hidden");
    pinInput.focus();
  }
  function closePinModal() { pinModal.classList.add("hidden"); }

  pinConfirmBtn.addEventListener("click", () => {
    const val = pinInput.value.trim();
    if (mode === "setup") {
      const confirmVal = pinConfirmInput.value.trim();
      if (val.length < 4 || val !== confirmVal) {
        pinError.textContent = val.length < 4 ? "PIN must be at least 4 characters." : "PINs didn't match — try again.";
        pinError.classList.remove("hidden");
        return;
      }
      setPinHash(simpleHash(val));
      closePinModal();
      enterEditMode();
    } else {
      if (simpleHash(val) !== getPinHash()) {
        pinError.textContent = "Incorrect PIN — try again.";
        pinError.classList.remove("hidden");
        return;
      }
      closePinModal();
      enterEditMode();
    }
  });
  pinCloseBtn.addEventListener("click", closePinModal);
  pinModal.addEventListener("click", (e) => { if (e.target === pinModal) closePinModal(); });
  pinInput.addEventListener("keydown", (e) => { if (e.key === "Enter") pinConfirmBtn.click(); });
  pinConfirmInput.addEventListener("keydown", (e) => { if (e.key === "Enter") pinConfirmBtn.click(); });

  function makeTextEditable() {
    const selector = "h1,h2,h3,h4,p,blockquote,figcaption,li,.timeline-date";
    $$(selector, editableRoot).forEach((el) => {
      if (el.closest("#guestbook-entries")) return; // don't let visitor wishes be hand-edited
      el.setAttribute("contenteditable", "true");
    });
  }

  function makeImagesEditable() {
    $$("img", editableRoot).forEach((img) => {
      const parent = img.parentElement;
      if (!parent || parent.querySelector(".img-edit-badge")) return;
      if (getComputedStyle(parent).position === "static") parent.style.position = "relative";
      const badge = document.createElement("button");
      badge.type = "button";
      badge.className = "img-edit-badge";
      badge.innerHTML = "✎ Change";
      badge.addEventListener("click", (e) => {
        e.preventDefault(); e.stopPropagation();
        currentEditImg = img;
        fileInput.click();
      });
      parent.appendChild(badge);
    });
  }

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file || !currentEditImg) return;
    const reader = new FileReader();
    reader.onload = () => { currentEditImg.src = reader.result; scheduleDraftSave(); };
    reader.readAsDataURL(file);
    fileInput.value = "";
  });

  editableRoot.addEventListener("input", (e) => {
    if (e.target.closest("[contenteditable='true']")) scheduleDraftSave();
  }, true);

  // ---- Add / remove photos within any [data-gallery] section ----
  function addDeleteBadge(item) {
    if (item.querySelector(":scope > .item-delete-badge")) return;
    if (getComputedStyle(item).position === "static") item.style.position = "relative";
    const del = document.createElement("button");
    del.type = "button";
    del.className = "item-delete-badge";
    del.innerHTML = "✕";
    del.title = "Remove this photo";
    del.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const parent = item.parentElement;
      const nextSibling = item.nextSibling;
      item.remove();
      scheduleDraftSave();
      showUndoToast("Photo removed", () => {
        if (nextSibling && nextSibling.parentElement === parent) parent.insertBefore(item, nextSibling);
        else parent.appendChild(item);
        scheduleDraftSave();
      });
    });
    item.appendChild(del);
  }

  function addCaptionBadgeIfMasonry(item) {
    if (!item.classList.contains("masonry-item")) return;
    if (item.querySelector(":scope > .caption-edit-badge")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "caption-edit-badge";
    btn.innerHTML = "✎ Caption";
    btn.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      const next = prompt("Caption for this photo (leave blank for none):", item.dataset.caption || "");
      if (next !== null) { item.dataset.caption = next; scheduleDraftSave(); }
    });
    item.appendChild(btn);
  }

  function addGalleryItem(container) {
    const addTile = container.querySelector(".gallery-add-tile");
    const items = Array.from(container.children).filter((c) => c !== addTile);
    const template = items[items.length - 1];
    const galleryType = container.dataset.gallery;
    let clone;
    if (template) {
      clone = template.cloneNode(true);
      clone.querySelectorAll(".img-edit-badge, .item-delete-badge, .caption-edit-badge").forEach((b) => b.remove());
    } else if (GALLERY_SKELETONS[galleryType]) {
      clone = GALLERY_SKELETONS[galleryType]();
    } else {
      return;
    }
    const img = clone.querySelector("img");
    if (img) img.src = BLANK_PLACEHOLDER;
    if (clone.dataset && "caption" in clone.dataset) clone.dataset.caption = "";
    container.insertBefore(clone, addTile);
    makeImagesEditable();
    addDeleteBadge(clone);
    addCaptionBadgeIfMasonry(clone);
    scheduleDraftSave();
    // Jump straight into picking the real photo for this new slot
    if (img) { currentEditImg = img; fileInput.click(); }
  }

  function makeGalleriesEditable() {
    $$("[data-gallery]", editableRoot).forEach((container) => {
      if (!container.querySelector(".gallery-add-tile")) {
        const addTile = document.createElement("button");
        addTile.type = "button";
        addTile.className = "gallery-add-tile";
        addTile.innerHTML = "+<span>Add Photo</span>";
        addTile.addEventListener("click", () => addGalleryItem(container));
        container.appendChild(addTile);
      }
      Array.from(container.children).forEach((item) => {
        if (item.classList.contains("gallery-add-tile")) return;
        addDeleteBadge(item);
        addCaptionBadgeIfMasonry(item);
      });
    });
  }

  function enterEditMode() {
    document.body.classList.add("edit-mode");
    makeTextEditable();
    makeImagesEditable();
    makeGalleriesEditable();
    toolbar.classList.remove("hidden");
    requestAnimationFrame(() => toolbar.classList.add("open"));
  }

  function pauseEditMode() {
    document.body.classList.remove("edit-mode");
    $$("[contenteditable]", editableRoot).forEach((el) => el.removeAttribute("contenteditable"));
    toolbar.classList.remove("open");
    setTimeout(() => toolbar.classList.add("hidden"), 400);
    saveDraft();
  }

  editToggle.addEventListener("click", () => {
    if (document.body.classList.contains("edit-mode")) { pauseEditMode(); return; }
    openPinModal(getPinHash() ? "verify" : "setup");
  });
  cancelBtn.addEventListener("click", pauseEditMode);

  doneBtn.addEventListener("click", () => {
    const ok = confirm("Lock editing and download the final file to send to Simin?");
    if (!ok) return;
    exportFinalSite();
    pauseEditMode();
  });

  function exportFinalSite() {
    const docClone = document.documentElement.cloneNode(true);
    const rootClone = docClone.querySelector("#editable-root");
    if (rootClone) cleanNodeForExport(rootClone);
    const bodyClone = docClone.querySelector("body");
    if (bodyClone) {
      bodyClone.classList.remove("edit-mode", "cursor-hover");
      const loader = bodyClone.querySelector("#loader");
      if (loader) loader.classList.remove("loader-hide");
      const tb = bodyClone.querySelector("#edit-toolbar");
      if (tb) { tb.classList.add("hidden"); tb.classList.remove("open"); }
      const pm = bodyClone.querySelector("#pin-modal");
      if (pm) pm.classList.add("hidden");
    }
    const finalHTML = "<!DOCTYPE html>\n" + docClone.outerHTML;
    const blob = new Blob([finalHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "index.html";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    alert("Your final page has been downloaded. Replace index.html in your project with this file, then share the link with Simin. You can still edit later — click the pencil icon and enter your PIN.");
  }
}

/* -------------------------------------------------------------------------
   21. BACK TO TOP
   ------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = $("#back-to-top");
  if (!btn) return;
  document.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > window.innerHeight * 0.6);
  }, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* -------------------------------------------------------------------------
   22. HORSES PARALLAX
   ------------------------------------------------------------------------- */
function initHorsesParallax() {
  const section = $("#horses");
  const bg = $(".horses-parallax-bg");
  if (!section || !bg) return;
  document.addEventListener("scroll", () => {
    const rect = section.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    bg.style.transform = `translateY(${(progress - 0.5) * 60}px)`;
  }, { passive: true });
}

/* -------------------------------------------------------------------------
   23. ENDING FINALE — fireworks + confetti, triggered on view + replay button
   ------------------------------------------------------------------------- */
function initEndingFinale() {
  const section = $("#ending");
  const fireworksLayer = $("#fireworks-layer");
  const confettiLayer = $("#ending-confetti");
  const replayBtn = $("#replay-fireworks");
  if (!section) return;

  function launchFirework() {
    const x = rand(15, 85);
    const y = rand(15, 55);
    const color = CONFIG.palette[Math.floor(rand(0, CONFIG.palette.length))];
    const particleCount = 22;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement("span");
      p.className = "firework-particle";
      p.style.left = `${x}%`;
      p.style.top = `${y}%`;
      p.style.background = color;
      p.style.boxShadow = `0 0 8px 2px ${color}`;
      const angle = (Math.PI * 2 * i) / particleCount;
      const dist = rand(60, 140);
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      p.style.transition = "transform 1.1s cubic-bezier(.22,1,.36,1), opacity 1.1s ease";
      fireworksLayer.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${dx}px, ${dy}px)`;
        p.style.opacity = "0";
      });
      setTimeout(() => p.remove(), 1300);
    }
  }

  function celebrate() {
    burstConfetti(confettiLayer, 100, [3000, 5000]);
    let count = 0;
    const interval = setInterval(() => {
      launchFirework();
      count++;
      if (count >= 6) clearInterval(interval);
    }, 500);
  }

  let played = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !played) {
        played = true;
        celebrate();
      }
    });
  }, { threshold: 0.5 });
  observer.observe(section);

  replayBtn && replayBtn.addEventListener("click", celebrate);
}
