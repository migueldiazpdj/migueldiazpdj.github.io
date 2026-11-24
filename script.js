/* ====================================================================
   Miguel Díaz — Personal Portfolio Script (antwi.dev design system)
   Features:
   - Zero-scroll bug fix: Guarantees page opens and reloads locked at top (0,0)
   - Procedural botanical leaves (Ginkgo, Eucalyptus, Botanical Twigs, Monstera)
   - Glowing data science particles floating in the breeze (instead of flowers)
   - Ambient light scene with sun glare and subtle scroll parallax
   - Footer botanical reed & leaf bed
   - Opening animation (handwritten cursive signature, streaming paragraphs)
   - Interactive intro controls (Skip / Replay)
   - Light / Dark theme toggle
   ==================================================================== */

(function () {
  "use strict";

  // -------------------------------------------------------------------
  // 0. Immediate Scroll Lock (Never open or reload at footer)
  // -------------------------------------------------------------------
  try {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  } catch (e) {}

  if (!window.location.hash) {
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }

  // -------------------------------------------------------------------
  // 1. Theme Toggle & Persistence
  // -------------------------------------------------------------------
  const html = document.documentElement;

  function getStoredTheme() {
    try { return localStorage.getItem("theme-choice"); } catch (e) { return null; }
  }

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    html.classList.remove("light", "dark");
    html.classList.add(theme);
    html.style.colorScheme = theme;
    var themeBtn = document.querySelector(".theme-toggle");
    if (themeBtn) themeBtn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  applyTheme(getStoredTheme() || getSystemTheme());

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    if (!getStoredTheme()) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    var toggleBtn = document.querySelector(".theme-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        var current = html.classList.contains("dark") ? "dark" : "light";
        var next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem("theme-choice", next); } catch (e) {}
      });
    }

    var soundBtn = document.getElementById("sound-toggle");
    if (soundBtn) {
      soundBtn.addEventListener("click", function () {
        var isMuted = html.getAttribute("data-sound") === "muted";
        var next = isMuted ? "enabled" : "muted";
        html.setAttribute("data-sound", next);
        soundBtn.setAttribute("aria-pressed", next === "muted" ? "false" : "true");
        try { localStorage.setItem("sound-choice", next); } catch (e) {}
      });
    }
  });

  // -------------------------------------------------------------------
  // 1b. Minimalist Tactile Audio Synthesizer (Web Audio API)
  // -------------------------------------------------------------------
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function isSoundEnabled() {
    return html.getAttribute("data-sound") !== "muted";
  }

  function playMinimalistClick(variant) {
    if (!isSoundEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (variant === "toggle") {
        // Delicate harmonic chime for switches (theme / sound)
        osc.type = "sine";
        osc.frequency.setValueAtTime(640, now);
        osc.frequency.exponentialRampToValueAtTime(860, now + 0.04);
        gain.gain.setValueAtTime(0.045, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.055);
      } else {
        // Subtle tactile mechanical click (gentle camera shutter / wooden tap)
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.025);
        gain.gain.setValueAtTime(0.055, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.035);
      }
    } catch (e) {}
  }

  // Sound preference state
  function initSoundPreference() {
    let saved = null;
    try { saved = localStorage.getItem("sound-choice"); } catch (e) {}
    const state = saved || "enabled";
    html.setAttribute("data-sound", state);
    const soundBtn = document.getElementById("sound-toggle");
    if (soundBtn) soundBtn.setAttribute("aria-pressed", state === "muted" ? "false" : "true");
  }

  initSoundPreference();

  // Attach tactile sound feedback to all interactive elements
  document.addEventListener("pointerdown", function (e) {
    const target = e.target.closest("a, button, .work-item, .intro-control-btn, .sound-toggle, .theme-toggle");
    if (!target) return;

    if (target.closest(".theme-toggle") || target.closest(".sound-toggle")) {
      playMinimalistClick("toggle");
    } else {
      playMinimalistClick("soft");
    }
  }, { passive: true });

  // -------------------------------------------------------------------
  // 2. Procedural Botanical Leaf Generators (NO FLOWERS)
  // -------------------------------------------------------------------
  const LEAF_TONES = {
    sage:    { a: "#41734c", b: "#75a37f", stem: "#2e5737" },
    emerald: { a: "#245938", b: "#4e9668", stem: "#1b4229" },
    olive:   { a: "#5a6e35", b: "#829c5a", stem: "#3e4f24" },
    amber:   { a: "#ad6b21", b: "#d4903f", stem: "#7d4a13" },
    copper:  { a: "#9e4c34", b: "#c7735b", stem: "#6e3120" }
  };

  // 1. Ginkgo Biloba Leaf (Elegant fan shape with radiating veins)
  function generateGinkgoSvg(seed, toneName) {
    const tone = LEAF_TONES[toneName] || LEAF_TONES.sage;
    const gradId = "ginkgo-" + seed + "-" + Math.floor(Math.random() * 10000);

    return `
      <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="1" x2="0.8" y2="0">
            <stop offset="0%" stop-color="${tone.a}" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="${tone.b}" stop-opacity="0.85"/>
          </linearGradient>
        </defs>
        <path d="M50 95 C 49 75, 47 62, 50 50" stroke="${tone.stem}" stroke-width="2" stroke-linecap="round"/>
        <path d="M50 50 C 35 48, 12 38, 16 20 C 20 5, 42 12, 49 22 C 50 18, 51 18, 52 22 C 59 12, 81 5, 85 20 C 89 38, 66 48, 50 50 Z" fill="url(#${gradId})"/>
        <path d="M50 48 Q 38 35 25 22" stroke="${tone.b}" stroke-width="0.8" stroke-opacity="0.5" fill="none"/>
        <path d="M50 48 Q 45 32 38 18" stroke="${tone.b}" stroke-width="0.8" stroke-opacity="0.5" fill="none"/>
        <path d="M50 48 Q 55 32 63 18" stroke="${tone.b}" stroke-width="0.8" stroke-opacity="0.5" fill="none"/>
        <path d="M50 48 Q 62 35 75 22" stroke="${tone.b}" stroke-width="0.8" stroke-opacity="0.5" fill="none"/>
      </svg>
    `;
  }

  // 2. Eucalyptus Leaf (Slender, gracefully curved leaf)
  function generateEucalyptusSvg(seed, toneName) {
    const tone = LEAF_TONES[toneName] || LEAF_TONES.olive;
    const gradId = "euc-" + seed + "-" + Math.floor(Math.random() * 10000);

    return `
      <svg viewBox="0 0 100 120" fill="none" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="${gradId}" x1="0.2" y1="1" x2="0.8" y2="0">
            <stop offset="0%" stop-color="${tone.a}" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="${tone.b}" stop-opacity="0.85"/>
          </linearGradient>
        </defs>
        <path d="M50 115 C 49 90, 48 40, 52 8" stroke="${tone.stem}" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M50 95 C 24 75, 20 40, 52 8 C 80 40, 76 75, 50 95 Z" fill="url(#${gradId})"/>
        <path d="M50 90 C 49 70, 49 40, 52 14" stroke="${tone.b}" stroke-width="1.2" stroke-opacity="0.6"/>
        <path d="M50 75 Q 38 65 30 62" stroke="${tone.b}" stroke-width="0.7" stroke-opacity="0.4"/>
        <path d="M50 75 Q 62 65 70 62" stroke="${tone.b}" stroke-width="0.7" stroke-opacity="0.4"/>
        <path d="M50 55 Q 38 45 32 42" stroke="${tone.b}" stroke-width="0.7" stroke-opacity="0.4"/>
        <path d="M50 55 Q 62 45 68 42" stroke="${tone.b}" stroke-width="0.7" stroke-opacity="0.4"/>
        <path d="M51 35 Q 42 28 36 26" stroke="${tone.b}" stroke-width="0.7" stroke-opacity="0.4"/>
        <path d="M51 35 Q 60 28 66 26" stroke="${tone.b}" stroke-width="0.7" stroke-opacity="0.4"/>
      </svg>
    `;
  }

  // 3. Botanical Twig (Branch with multiple delicate leaf pairs)
  function generateBranchSvg(seed, toneName) {
    const tone = LEAF_TONES[toneName] || LEAF_TONES.emerald;
    const gradId = "br-" + seed + "-" + Math.floor(Math.random() * 10000);

    return `
      <svg viewBox="0 0 100 130" fill="none" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="${tone.a}" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="${tone.b}" stop-opacity="0.85"/>
          </linearGradient>
        </defs>
        <path d="M48 126 Q 49 70 52 10" stroke="${tone.stem}" stroke-width="2" stroke-linecap="round"/>
        <path d="M49 98 C 26 90, 16 72, 25 61 C 36 68, 47 82, 49 98 Z" fill="url(#${gradId})"/>
        <path d="M49 92 C 72 84, 82 66, 73 55 C 62 62, 51 76, 49 92 Z" fill="url(#${gradId})"/>
        <path d="M50 70 C 30 60, 20 45, 29 36 C 39 44, 48 57, 50 70 Z" fill="url(#${gradId})"/>
        <path d="M50 64 C 70 54, 80 39, 71 30 C 61 38, 52 51, 50 64 Z" fill="url(#${gradId})"/>
        <path d="M51 44 C 33 36, 26 24, 34 16 C 42 23, 49 33, 51 44 Z" fill="url(#${gradId})"/>
        <path d="M51 38 C 67 30, 74 18, 66 11 C 58 18, 52 28, 51 38 Z" fill="url(#${gradId})"/>
        <path d="M52 14 C 44 4, 47 -3, 52 -7 C 57 -3, 60 4, 52 14 Z" fill="url(#${gradId})"/>
      </svg>
    `;
  }

  // 4. Monstera Leaf (Iconic modern notched leaf)
  function generateMonsteraSvg(seed, toneName) {
    const tone = LEAF_TONES[toneName] || LEAF_TONES.sage;
    const gradId = "monstera-" + seed + "-" + Math.floor(Math.random() * 10000);

    return `
      <svg viewBox="0 0 100 110" fill="none" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="${gradId}" x1="0.2" y1="1" x2="0.8" y2="0">
            <stop offset="0%" stop-color="${tone.a}" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="${tone.b}" stop-opacity="0.85"/>
          </linearGradient>
        </defs>
        <path d="M50 108 C 50 90, 50 40, 50 12" stroke="${tone.stem}" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M50 12 C 55 12, 78 24, 82 45 C 80 50, 72 52, 68 48 C 76 58, 80 66, 75 78 C 70 80, 64 76, 62 70 C 66 82, 60 94, 50 98 C 40 94, 34 82, 38 70 C 36 76, 30 80, 25 78 C 20 66, 24 58, 32 48 C 28 52, 20 50, 18 45 C 22 24, 45 12, 50 12 Z" fill="url(#${gradId})"/>
      </svg>
    `;
  }

  function getLeafSvgByType(type, seed, tone) {
    if (type === "ginkgo") return generateGinkgoSvg(seed, tone);
    if (type === "eucalyptus") return generateEucalyptusSvg(seed, tone);
    if (type === "monstera") return generateMonsteraSvg(seed, tone);
    return generateBranchSvg(seed, tone);
  }

  // -------------------------------------------------------------------
  // 3. Populate Ambient Botanical Scene (Leaves & Data Particles)
  // -------------------------------------------------------------------
  const LEAF_CONFIG = [
    // Back layer leaves (subtle blur, deeper depth)
    { type: "ginkgo",     layer: "back",  x: 7,   y: 110, size: 170, tone: "amber",   blur: 1.8, rotate: -28, tilt: 0.95, duration: 14, delay: 0,   parallax: 0.18 },
    { type: "eucalyptus", layer: "back",  x: 89,  y: 75,  size: 210, tone: "sage",    blur: 1.2, rotate: 18,  tilt: 0.88, duration: 16, delay: -2, parallax: 0.24 },
    { type: "branch",     layer: "back",  x: 93,  y: 390, size: 150, tone: "emerald", blur: 2.2, rotate: 32,  tilt: 1.05, duration: 13, delay: -4, parallax: 0.15 },
    { type: "monstera",   layer: "back",  x: 6,   y: 530, size: 175, tone: "olive",   blur: 1.6, rotate: -14, tilt: 0.92, duration: 15, delay: -1, parallax: 0.20 },
    { type: "ginkgo",     layer: "back",  x: 91,  y: 790, size: 160, tone: "copper",  blur: 2.0, rotate: -32, tilt: 0.98, duration: 12, delay: -3, parallax: 0.14 },

    // Front layer leaves (crisper, foreground accent)
    { type: "eucalyptus", layer: "front", x: 83,  y: 220, size: 130, tone: "sage",    blur: 0.3, rotate: 40,  tilt: 0.90, duration: 11, delay: -2.5, parallax: 0.35 },
    { type: "branch",     layer: "front", x: 13,  y: 330, size: 125, tone: "emerald", blur: 0.5, rotate: -16, tilt: 1.02, duration: 13, delay: -1.2, parallax: 0.30 }
  ];

  function buildLeafElement(item, index) {
    const el = document.createElement("div");
    el.className = "bloom";
    el.style.left = item.x + "%";
    el.style.top = item.y + "px";
    el.style.setProperty("--size", item.size + "px");
    el.style.setProperty("--blur", item.blur + "px");
    el.style.setProperty("--rotate", item.rotate + "deg");
    el.style.setProperty("--tilt", item.tilt);
    el.style.setProperty("--sway-duration", item.duration + "s");
    el.style.setProperty("--sway-delay", item.delay + "s");
    el.style.setProperty("--enter-delay", (0.3 + index * 0.12) + "s");

    el.dataset.anchorY = item.y;
    el.dataset.parallax = item.parallax;

    const svgContent = getLeafSvgByType(item.type, index + 20, item.tone);

    el.innerHTML = `
      <div class="bloom-flight">
        <div class="bloom-sway">
          <div class="bloom-leaf">
            ${svgContent}
          </div>
        </div>
      </div>
    `;

    return el;
  }

  // Subtle glowing Data Particles (representing Analytics & Data Science)
  function initDataParticles() {
    const container = document.getElementById("bloom-particles");
    if (!container) return;

    const particleCoords = [
      { x: 18, y: 160, size: 8,  duration: 6, delay: 0 },
      { x: 82, y: 130, size: 10, duration: 8, delay: -2 },
      { x: 76, y: 310, size: 7,  duration: 7, delay: -1 },
      { x: 22, y: 440, size: 9,  duration: 9, delay: -3 },
      { x: 86, y: 620, size: 8,  duration: 6, delay: -1.5 },
      { x: 14, y: 720, size: 7,  duration: 8, delay: -4 }
    ];

    particleCoords.forEach(function (p) {
      const dot = document.createElement("span");
      dot.className = "data-particle";
      dot.style.left = p.x + "%";
      dot.style.top = p.y + "px";
      dot.style.width = p.size + "px";
      dot.style.height = p.size + "px";
      dot.style.setProperty("--duration", p.duration + "s");
      dot.style.setProperty("--delay", p.delay + "s");
      container.appendChild(dot);
    });
  }

  function initBloomScene() {
    const backContainer = document.getElementById("bloom-items-back");
    const frontContainer = document.getElementById("bloom-items-front");
    if (!backContainer || !frontContainer) return;

    LEAF_CONFIG.forEach(function (cfg, i) {
      const el = buildLeafElement(cfg, i);
      if (cfg.layer === "back") {
        backContainer.appendChild(el);
      } else {
        frontContainer.appendChild(el);
      }
    });

    initDataParticles();

    // Scroll Parallax Handler for subtle natural depth motion
    const blooms = document.querySelectorAll(".bloom");
    let ticking = false;

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          const scrollY = window.scrollY;
          blooms.forEach(function (b) {
            const anchor = parseFloat(b.dataset.anchorY) || 0;
            const factor = parseFloat(b.dataset.parallax) || 0.15;
            const delta = (scrollY - anchor) * factor * 0.4;
            b.style.transform = `translate(-50%, calc(-50% + ${delta.toFixed(1)}px))`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // -------------------------------------------------------------------
  // 4. Populate Footer Botanical Reed & Leaf Bed (NO FLOWERS)
  // -------------------------------------------------------------------
  function initFooterBed() {
    const bed = document.getElementById("footer-bed");
    if (!bed) return;

    const count = 11;
    const leafTypes = ["ginkgo", "eucalyptus", "branch", "monstera"];
    const tones = ["sage", "emerald", "olive", "amber", "copper"];

    for (let i = 0; i < count; i++) {
      const type = leafTypes[i % leafTypes.length];
      const tone = tones[i % tones.length];
      const xPercent = (i / (count - 1)) * 92 + 4;
      const size = 68 + (i % 4) * 14;
      const delay = (i * 0.07).toFixed(2);
      const swayDelay = (-1.7 * i).toFixed(1);

      const item = document.createElement("div");
      item.className = "bed-item";
      item.style.left = xPercent + "%";
      item.style.top = "60%";
      item.style.setProperty("--size", size + "px");
      item.style.setProperty("--delay", delay + "s");
      item.style.setProperty("--sway-delay", swayDelay + "s");

      const svg = getLeafSvgByType(type, i + 60, tone);
      item.innerHTML = `
        <div class="bed-sway">
          <div class="bloom-leaf">
            ${svg}
          </div>
        </div>
      `;

      bed.appendChild(item);
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            bed.querySelectorAll(".bed-item").forEach(function (el) {
              el.classList.add("visible");
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      observer.observe(bed);
    } else {
      bed.querySelectorAll(".bed-item").forEach(function (el) {
        el.classList.add("visible");
      });
    }
  }

  // -------------------------------------------------------------------
  // 5. Intro Animation (Handwritten Signature & Streaming Paragraphs)
  // -------------------------------------------------------------------
  let introTimers = [];

  // Floating pill: visible at the top of the page, hidden once the reader scrolls
  function updateIntroPill() {
    const pill = document.getElementById("intro-controls");
    if (!pill) return;
    const hide = html.getAttribute("data-preloader") === "done" && window.scrollY > 80;
    pill.classList.toggle("is-hidden", hide);
  }

  let pillTicking = false;
  window.addEventListener("scroll", function () {
    if (pillTicking) return;
    pillTicking = true;
    window.requestAnimationFrame(function () {
      updateIntroPill();
      pillTicking = false;
    });
  }, { passive: true });

  function clearIntroTimers() {
    introTimers.forEach(function (t) { clearTimeout(t); });
    introTimers = [];
  }

  function startIntroAnimation(isReplay) {
    clearIntroTimers();

    // STRICT SCROLL LOCK AT TOP (0,0)
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const lines = document.querySelectorAll("[data-intro-line]");
    const actionBtn = document.getElementById("intro-action-btn");
    const iconSpan = document.getElementById("intro-icon");
    const labelSpan = document.getElementById("intro-label");

    // Reset lines
    lines.forEach(function (el) {
      el.classList.remove("intro-line-visible");
    });

    html.setAttribute("data-preloader", "running");
    updateIntroPill();

    if (actionBtn && labelSpan && iconSpan) {
      iconSpan.textContent = "⏩";
      labelSpan.textContent = "Skip intro";
      actionBtn.onclick = function () {
        finishIntro();
      };
    }

    // Schedule progressive reveal
    // Step 1: Signature draws (0s - 1.6s)
    // Step 2: "hola 👋" (1.8s)
    // Step 3: Bio paragraphs (2.8s, 4.2s, 5.6s)
    const schedule = [
      { index: 0, delay: 1800 },
      { index: 1, delay: 2800 },
      { index: 2, delay: 4200 },
      { index: 3, delay: 5600 }
    ];

    schedule.forEach(function (item) {
      const t = setTimeout(function () {
        const line = document.querySelector(`[data-intro-line="${item.index}"]`);
        if (line) {
          line.classList.add("intro-line-visible");
        }
      }, item.delay);
      introTimers.push(t);
    });

    // Final finish timeout (6.6s)
    const endTimer = setTimeout(function () {
      finishIntro();
    }, 6600);
    introTimers.push(endTimer);
  }

  function finishIntro() {
    clearIntroTimers();

    const lines = document.querySelectorAll("[data-intro-line]");
    lines.forEach(function (el) {
      el.classList.add("intro-line-visible");
    });

    html.setAttribute("data-preloader", "done");
    updateIntroPill();

    try {
      sessionStorage.setItem("preloader-seen", "1");
    } catch (e) {}

    // Update bottom pill control to "Replay intro ↺"
    const actionBtn = document.getElementById("intro-action-btn");
    const iconSpan = document.getElementById("intro-icon");
    const labelSpan = document.getElementById("intro-label");

    if (actionBtn && labelSpan && iconSpan) {
      iconSpan.textContent = "↺";
      labelSpan.textContent = "Replay intro";
      actionBtn.onclick = function () {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        setTimeout(function () {
          startIntroAnimation(true);
        }, 100);
      };
    }
  }

  // -------------------------------------------------------------------
  // 7. Initialization
  // -------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", function () {
    initBloomScene();
    initFooterBed();

    // Deep link (e.g. /#projects): skip the intro and go straight to the section
    var hashTarget = null;
    try {
      hashTarget = window.location.hash ? document.querySelector(window.location.hash) : null;
    } catch (e) {}
    if (hashTarget) {
      finishIntro();
      hashTarget.scrollIntoView();
      return;
    }

    // Guarantee window is scrolled to top immediately
    window.scrollTo(0, 0);

    // Check if reduced motion is requested
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishIntro();
      return;
    }

    startIntroAnimation(false);
  });
})();
