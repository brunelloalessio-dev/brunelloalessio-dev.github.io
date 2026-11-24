type OrbState = {
  el: HTMLElement;
  strength: number;
  amp: number;
  speed: number;
  invert: number;
  phase: number;
};

const CARD_SELECTOR =
  ".stagger-item, .about-card, .experience-card, .hero-photo, .card-surface, .card-action, .glass.hover-glow";

let dispose: (() => void) | null = null;
let booted = false;

/** Register once; init re-runs on every ClientRouter page load. */
export function bootSiteBackdrop() {
  if (booted) return;
  booted = true;
  document.addEventListener("astro:page-load", () => {
    initSiteBackdrop();
  });
  initSiteBackdrop();
}

export function initSiteBackdrop() {
  dispose?.();
  dispose = null;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-orb]"));
  const grid = document.querySelector<HTMLElement>("[data-site-grid]");
  if (!nodes.length) return;

  const orbs: OrbState[] = nodes.map((el, index) => ({
    el,
    strength: Number.parseFloat(el.dataset.strength || "24"),
    amp: Number.parseFloat(el.dataset.amp || "14"),
    speed: Number.parseFloat(el.dataset.speed || "0.32"),
    invert: el.dataset.invert === "true" ? -1 : 1,
    phase: index * 1.2,
  }));

  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const ac = new AbortController();
  const { signal } = ac;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let attractX = 0;
  let attractY = 0;
  let attractStrength = 0;
  let currentAttract = 0;
  let rafId = 0;
  let gridX = 50;
  let gridY = 40;
  let scrolling = false;
  let scrollIdleTimer = 0;
  let lastTick = 0;

  if (finePointer) {
    window.addEventListener(
      "pointermove",
      (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
        gridX = (event.clientX / window.innerWidth) * 100;
        gridY = (event.clientY / window.innerHeight) * 100;
      },
      { passive: true, signal },
    );

    window.addEventListener(
      "pointerleave",
      () => {
        mouseX = 0;
        mouseY = 0;
        attractStrength = 0;
      },
      { passive: true, signal },
    );

    document.addEventListener(
      "pointerover",
      (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const card = target.closest(CARD_SELECTOR);
        if (!(card instanceof HTMLElement)) return;
        const rect = card.getBoundingClientRect();
        attractX = ((rect.left + rect.width / 2) / window.innerWidth - 0.5) * 2;
        attractY = ((rect.top + rect.height / 2) / window.innerHeight - 0.5) * 2;
        attractStrength = 1;
      },
      { passive: true, signal },
    );

    document.addEventListener(
      "pointerout",
      (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const card = target.closest(CARD_SELECTOR);
        if (!card) return;
        const related = event.relatedTarget;
        if (related instanceof Node && card.contains(related)) return;
        attractStrength = 0;
      },
      { passive: true, signal },
    );
  }

  window.addEventListener(
    "scroll",
    () => {
      scrolling = true;
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        scrolling = false;
      }, 120);
    },
    { passive: true, signal },
  );

  const tick = (time: number) => {
    // Cap backdrop work while scrolling to keep wheel/trackpad smooth
    if (scrolling && time - lastTick < 32) {
      rafId = window.requestAnimationFrame(tick);
      return;
    }
    lastTick = time;

    const t = time * 0.001;
    const ease = scrolling ? 0.035 : 0.06;
    const targetX = mouseX * 0.72 + attractX * 0.55 * attractStrength;
    const targetY = mouseY * 0.72 + attractY * 0.55 * attractStrength;

    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    currentAttract += (attractStrength - currentAttract) * (scrolling ? 0.04 : 0.08);

    const motionScale = scrolling ? 0.55 : 1;

    for (const orb of orbs) {
      const floatX = Math.sin(t * orb.speed + orb.phase) * orb.amp * motionScale;
      const floatY = Math.cos(t * orb.speed * 0.85 + orb.phase) * orb.amp * motionScale;
      const pull = 1 + currentAttract * 0.35;
      const moveX = currentX * orb.strength * orb.invert * pull * motionScale;
      const moveY = currentY * orb.strength * orb.invert * pull * motionScale;
      orb.el.style.transform = `translate3d(${floatX + moveX}px, ${floatY + moveY}px, 0)`;
    }

    if (grid && !scrolling) {
      const driftX = (t * 4) % 100;
      const driftY = (t * 2.2) % 100;
      grid.style.setProperty("--grid-x", `${gridX}%`);
      grid.style.setProperty("--grid-y", `${gridY}%`);
      grid.style.setProperty("--grid-drift-x", `${driftX}px`);
      grid.style.setProperty("--grid-drift-y", `${driftY}px`);
      grid.style.opacity = String(0.12 + currentAttract * 0.06 + Math.abs(currentX) * 0.03);
    }

    rafId = window.requestAnimationFrame(tick);
  };

  rafId = window.requestAnimationFrame(tick);

  dispose = () => {
    ac.abort();
    window.cancelAnimationFrame(rafId);
    window.clearTimeout(scrollIdleTimer);
    dispose = null;
  };
}
