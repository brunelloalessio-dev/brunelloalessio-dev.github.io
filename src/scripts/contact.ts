import { gsap } from "gsap";

let dispose: (() => void) | null = null;
let booted = false;

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SPARKS = ["✓", "✦", "✧", "•", "✓", "✦"];

function playActionBurst(originEl: HTMLElement) {
  if (reducedMotion()) return Promise.resolve();

  const root = document.getElementById("action-burst");
  const ring = root?.querySelector<HTMLElement>("[data-burst-ring]");
  const ringLate = root?.querySelector<HTMLElement>("[data-burst-ring-late]");
  const sparksHost = root?.querySelector<HTMLElement>("[data-burst-sparks]");
  if (!root || !ring || !ringLate || !sparksHost) return Promise.resolve();

  const rect = originEl.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  root.style.setProperty("--ab-x", `${x}px`);
  root.style.setProperty("--ab-y", `${y}px`);
  root.classList.add("is-active");
  originEl.classList.add("is-success");

  sparksHost.replaceChildren();
  const sparks = SPARKS.map((glyph) => {
    const el = document.createElement("span");
    el.className = "action-spark";
    el.textContent = glyph;
    sparksHost.appendChild(el);
    return el;
  });

  gsap.killTweensOf([ring, ringLate, ...sparks]);
  gsap.set([ring, ringLate], { scale: 0.25, opacity: 0.95 });
  gsap.set(sparks, { x: 0, y: 0, opacity: 0, scale: 0.6 });

  return new Promise<void>((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        root.classList.remove("is-active");
        sparksHost.replaceChildren();
        window.setTimeout(() => originEl.classList.remove("is-success"), 420);
        resolve();
      },
    });

    tl.to(
      ring,
      {
        scale: 6.5,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
      },
      0,
    );

    tl.to(
      ringLate,
      {
        scale: 9,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      },
      0.05,
    );

    sparks.forEach((spark, i) => {
      const angle = (-90 + (i - (sparks.length - 1) / 2) * 28) * (Math.PI / 180);
      const dist = 48 + Math.random() * 36;
      tl.fromTo(
        spark,
        { x: 0, y: 0, opacity: 0, scale: 0.5 },
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 10,
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: "power2.out",
        },
        0.04 + i * 0.03,
      );
      tl.to(
        spark,
        {
          y: `-=${18 + Math.random() * 16}`,
          opacity: 0,
          scale: 0.7,
          duration: 0.4,
          ease: "power1.in",
        },
        0.35 + i * 0.03,
      );
    });
  });
}

function flashLabel(el: HTMLElement | null, label: string, original: string) {
  if (!el) return;
  el.textContent = label;
  window.setTimeout(() => {
    el.textContent = original;
  }, 2000);
}

function initContact() {
  dispose?.();
  dispose = null;

  const copyBtn = document.getElementById("copy-email");
  const copyText = document.getElementById("copy-email-text");
  const shareBtn = document.getElementById("share-site");
  const shareText = document.getElementById("share-site-text");
  if (!copyBtn && !shareBtn) return;

  const ac = new AbortController();
  const { signal } = ac;
  const originalCopy = copyText?.textContent ?? "";
  const originalShare = shareText?.textContent ?? "";

  copyBtn?.addEventListener(
    "click",
    async () => {
      const email = copyBtn.getAttribute("data-email");
      if (!email) return;
      try {
        await navigator.clipboard.writeText(email);
        flashLabel(
          copyText,
          copyText?.getAttribute("data-copied") || "✓ Copied!",
          originalCopy,
        );
        void playActionBurst(copyBtn);
      } catch {
        // Clipboard may be blocked; ignore quietly
      }
    },
    { signal },
  );

  shareBtn?.addEventListener(
    "click",
    async () => {
      const title = shareBtn.getAttribute("data-share-title") || document.title;
      const text = shareBtn.getAttribute("data-share-text") || "";
      const url = shareBtn.getAttribute("data-share-url") || window.location.href;
      const copiedLabel = shareText?.getAttribute("data-copied") || "✓ Copied!";

      try {
        if (typeof navigator.share === "function") {
          await navigator.share({ title, text, url });
          void playActionBurst(shareBtn);
          return;
        }
      } catch (error) {
        // User cancel should not fall through to clipboard
        if (error instanceof DOMException && error.name === "AbortError") return;
      }

      try {
        await navigator.clipboard.writeText(url);
        flashLabel(shareText, copiedLabel, originalShare);
        void playActionBurst(shareBtn);
      } catch {
        // Last resort: prompt so it still works everywhere
        window.prompt("Copy link:", url);
      }
    },
    { signal },
  );

  dispose = () => {
    ac.abort();
  };
}

export function bootContact() {
  if (booted) return;
  booted = true;
  document.addEventListener("astro:page-load", initContact);
  initContact();
}
