type OrbState = {
  el: HTMLElement;
  strength: number;
  amp: number;
  speed: number;
  invert: number;
  phase: number;
};

const CARD_SELECTOR =
  ".stagger-item, .about-card, .experience-card, .hero-photo, .glass.hover-glow";

export function initSiteBackdrop() {
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

  if (finePointer) {
    window.addEventListener(
      "pointermove",
      (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
        gridX = (event.clientX / window.innerWidth) * 100;
        gridY = (event.clientY / window.innerHeight) * 100;
      },
      { passive: true },
    );

    window.addEventListener(
      "pointerleave",
      () => {
        mouseX = 0;
        mouseY = 0;
        attractStrength = 0;
      },
      { passive: true },
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
      { passive: true },
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
      { passive: true },
    );
  }

  const tick = (time: number) => {
    const t = time * 0.001;
    const targetX = mouseX * 0.72 + attractX * 0.55 * attractStrength;
    const targetY = mouseY * 0.72 + attractY * 0.55 * attractStrength;

    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    currentAttract += (attractStrength - currentAttract) * 0.08;

    for (const orb of orbs) {
      const floatX = Math.sin(t * orb.speed + orb.phase) * orb.amp;
      const floatY = Math.cos(t * orb.speed * 0.85 + orb.phase) * orb.amp;
      const pull = 1 + currentAttract * 0.35;
      const moveX = currentX * orb.strength * orb.invert * pull;
      const moveY = currentY * orb.strength * orb.invert * pull;
      orb.el.style.transform = `translate3d(${floatX + moveX}px, ${floatY + moveY}px, 0)`;
    }

    if (grid) {
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

  window.addEventListener(
    "pagehide",
    () => {
      window.cancelAnimationFrame(rafId);
    },
    { once: true },
  );
}
