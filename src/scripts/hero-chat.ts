import { gsap } from "gsap";

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

async function typeInto(el: HTMLElement, text: string, msPerChar: number) {
  el.textContent = "";
  for (let i = 1; i <= text.length; i += 1) {
    el.textContent = text.slice(0, i);
    await wait(msPerChar);
  }
}

let heroRunId = 0;

function startPhotoFloat(isMobile: boolean) {
  const floatEl = document.querySelector<HTMLElement>(".hero-photo-float");
  if (!floatEl) return;

  gsap.killTweensOf(floatEl);
  gsap.to(floatEl, {
    y: isMobile ? -8 : -14,
    duration: isMobile ? 3.2 : 3.6,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
  gsap.to(floatEl, {
    rotate: isMobile ? 1.2 : 1.8,
    duration: isMobile ? 4.4 : 5,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
}

function revealStaticHero() {
  gsap.set(
    [
      "[data-chat-header]",
      "[data-chat-text]",
      "[data-chat-photo]",
      "[data-chat-followup]",
      "[data-chat-scroll]",
      "[data-chat-sent]",
      "[data-chat-tagline]",
    ],
    { opacity: 1, clearProps: "transform,filter" },
  );
  gsap.set("[data-chat-typing]", { opacity: 0, display: "none" });
  gsap.set("[data-chat-caret]", { opacity: 0 });

  document.querySelectorAll<HTMLElement>("[data-chat-line]").forEach((line) => {
    line.textContent = line.dataset.full || "";
  });

  const tagline = document.querySelector<HTMLElement>("[data-chat-tagline]");
  if (tagline) tagline.textContent = tagline.dataset.full || "";
}

export async function initHeroChat() {
  const runId = ++heroRunId;
  const stillActive = () => runId === heroRunId;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  const header = document.querySelector<HTMLElement>("[data-chat-header]");
  const typing = document.querySelector<HTMLElement>("[data-chat-typing]");
  const textBubble = document.querySelector<HTMLElement>("[data-chat-text]");
  const caret = document.querySelector<HTMLElement>("[data-chat-caret]");
  const sent = document.querySelector<HTMLElement>("[data-chat-sent]");
  const tagline = document.querySelector<HTMLElement>("[data-chat-tagline]");
  const photoBubble = document.querySelector<HTMLElement>("[data-chat-photo]");
  const photoFrame = document.querySelector<HTMLElement>(".hero-photo-frame");
  const photoAura = document.querySelector<HTMLElement>(".hero-photo-aura");
  const followup = document.querySelector<HTMLElement>("[data-chat-followup]");
  const scrollHint = document.querySelector<HTMLElement>("[data-chat-scroll]");
  const lines = Array.from(document.querySelectorAll<HTMLElement>("[data-chat-line]"));

  if (!textBubble || !photoBubble || lines.length === 0) return;

  const shouldAnimate =
    !reduceMotion && document.documentElement.classList.contains("hero-chat-pending");

  if (!shouldAnimate) {
    document.documentElement.classList.remove("hero-chat-pending");
    revealStaticHero();
    startPhotoFloat(isMobile);
    return;
  }

  const msPerChar = isMobile ? 26 : 20;

  // Progressive enhancement: full copy is in the HTML for SEO / no-JS.
  // First visit only — clear and replay the chat intro.
  document.documentElement.classList.remove("hero-chat-pending");
  try {
    sessionStorage.setItem("heroChatPlayed", "1");
  } catch (_) {}

  lines.forEach((line) => {
    line.style.visibility = "visible";
    line.textContent = "";
  });
  if (tagline) {
    tagline.style.visibility = "visible";
    tagline.textContent = "";
  }

  gsap.set(
    [header, textBubble, photoBubble, followup, scrollHint, sent, tagline].filter(Boolean),
    { opacity: 0 },
  );

  // 1) Online + typing
  if (header) gsap.to(header, { opacity: 1, duration: 0.4, ease: "power2.out" });
  if (typing) {
    typing.style.display = "inline-flex";
    gsap.fromTo(typing, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
    await wait(650);
    if (!stillActive()) return;
    gsap.to(typing, {
      opacity: 0,
      duration: 0.22,
      onComplete: () => {
        typing.style.display = "none";
      },
    });
  }

  // 2) Text bubble + typewriter (greeting, name, role)
  gsap.fromTo(
    textBubble,
    { opacity: 0, y: 16, scale: 0.97 },
    { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" },
  );
  await wait(150);
  if (!stillActive()) return;

  for (const line of lines) {
    if (!stillActive()) return;
    const isRoleLine = line.dataset.chatLine === "2";
    if (isRoleLine && caret) gsap.set(caret, { opacity: 1 });
    await typeInto(line, line.dataset.full || "", msPerChar);
    await wait(100);
  }
  if (!stillActive()) return;

  // 3) Tagline typed inside the same chat bubble
  if (tagline) {
    gsap.to(tagline, { opacity: 1, duration: 0.25 });
    await typeInto(tagline, tagline.dataset.full || "", Math.max(10, msPerChar - 6));
  }
  if (!stillActive()) return;

  if (caret) gsap.to(caret, { opacity: 0, duration: 0.2 });
  if (sent) gsap.to(sent, { opacity: 1, duration: 0.35, ease: "power2.out" });
  await wait(320);
  if (!stillActive()) return;

  // 4) Photo appears on the right
  gsap.fromTo(
    photoBubble,
    {
      opacity: 0,
      x: isMobile ? 0 : 42,
      y: isMobile ? 28 : 0,
      scale: 0.86,
      rotate: isMobile ? -2 : 3,
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      duration: 0.85,
      ease: "power3.out",
    },
  );

  if (photoFrame) {
    gsap.fromTo(
      photoFrame,
      { filter: "blur(12px)", scale: 1.06 },
      { filter: "blur(0px)", scale: 1, duration: 1, ease: "power2.out", delay: 0.05 },
    );
  }

  if (photoAura) {
    gsap.fromTo(
      photoAura,
      { opacity: 0, scale: 0.72 },
      { opacity: 0.72, scale: 1, duration: 0.9, ease: "power2.out", delay: 0.12 },
    );
  }

  await wait(700);
  if (!stillActive()) return;
  startPhotoFloat(isMobile);

  // 5) CTAs + scroll hint
  if (followup) {
    gsap.fromTo(
      followup,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" },
    );
  }
  if (scrollHint) {
    gsap.to(scrollHint, { opacity: 1, duration: 0.45, delay: 0.15 });
  }
}
