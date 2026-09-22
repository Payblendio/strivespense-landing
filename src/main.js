/**
 * Strivespence landing — particle orb + UI interactions
 */

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* —— Year —— */
const yearEl = document.querySelector("[data-year]");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* —— Nav scroll state —— */
const nav = document.querySelector("[data-nav]");
const onScrollNav = () => {
  if (!nav) return;
  nav.classList.toggle("is-scrolled", window.scrollY > 24);
};
onScrollNav();
window.addEventListener("scroll", onScrollNav, { passive: true });

/* —— Mobile drawer —— */
const menuToggle = document.querySelector("[data-menu-toggle]");
const drawer = document.querySelector("[data-drawer]");
menuToggle?.addEventListener("click", () => {
  const open = drawer?.hasAttribute("hidden");
  if (!drawer) return;
  if (open) drawer.removeAttribute("hidden");
  else drawer.setAttribute("hidden", "");
});
drawer?.querySelectorAll("[data-drawer-link]").forEach((link) => {
  link.addEventListener("click", () => drawer.setAttribute("hidden", ""));
});

/* —— Reveal on scroll —— */
const reveals = document.querySelectorAll("[data-reveal]");
if (prefersReducedMotion) {
  reveals.forEach((el) => el.classList.add("is-visible"));
} else if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

/* —— Stat counters —— */
function animateCount(el, target, duration = 1400) {
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const countEls = document.querySelectorAll("[data-count]");
if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const cio = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.getAttribute("data-count") || "0");
        animateCount(el, target);
        cio.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  countEls.forEach((el) => cio.observe(el));
} else {
  countEls.forEach((el) => {
    el.textContent = el.getAttribute("data-count") || "0";
  });
}

/* —— Bioluminescent particle sphere —— */
function initOrb() {
  const canvas = document.querySelector("[data-orb]");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  let cx = 0;
  let cy = 0;
  let radius = 0;
  let raf = 0;
  let rotY = 0;
  let rotX = 0.35;

  /** @type {{ x: number; y: number; z: number; size: number; pink: boolean }[]} */
  let particles = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w * 0.5;
    cy = h * 0.42;
    radius = Math.min(w, h) * 0.22;
    seedParticles();
  }

  function seedParticles() {
    const count = prefersReducedMotion ? 180 : 520;
    particles = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      const r = radius * (0.72 + Math.random() * 0.28);
      particles.push({
        x: r * Math.sin(theta) * Math.cos(phi),
        y: r * Math.sin(theta) * Math.sin(phi),
        z: r * Math.cos(theta),
        size: 0.6 + Math.random() * 1.6,
        pink: Math.random() > 0.88,
      });
    }
  }

  function project(p, ry, rx) {
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);
    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);

    let x = p.x * cosY - p.z * sinY;
    let z = p.x * sinY + p.z * cosY;
    let y = p.y * cosX - z * sinX;
    z = p.y * sinX + z * cosX;

    const perspective = 520;
    const scale = perspective / (perspective + z + radius);
    return {
      sx: cx + x * scale,
      sy: cy + y * scale,
      scale,
      depth: z,
    };
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);

    if (!prefersReducedMotion) {
      rotY += 0.0032;
      rotX = 0.32 + Math.sin(rotY * 0.45) * 0.08;
    }

    const sorted = particles
      .map((p) => ({ p, q: project(p, rotY, rotX) }))
      .sort((a, b) => a.q.depth - b.q.depth);

    for (const { p, q } of sorted) {
      const alpha = 0.25 + ((q.depth + radius) / (radius * 2)) * 0.65;
      const size = p.size * q.scale;
      if (p.pink) {
        ctx.fillStyle = `rgba(253, 233, 255, ${alpha * 0.9})`;
      } else {
        const cool = q.depth > 0;
        ctx.fillStyle = cool
          ? `rgba(20, 184, 166, ${alpha})`
          : `rgba(237, 255, 254, ${alpha * 0.85})`;
      }
      ctx.beginPath();
      ctx.arc(q.sx, q.sy, size, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);
  raf = requestAnimationFrame(frame);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(frame);
    }
  });
}

initOrb();
