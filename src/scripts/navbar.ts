import { gsap } from "gsap";
import { navigate } from "astro:transitions/client";

let dispose: (() => void) | null = null;
let booted = false;
let animating = false;

const DESKTOP_MQ = "(min-width: 768px)";
const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setMenuOpen(mobileMenu: HTMLElement | null, btn: HTMLElement | null, open: boolean) {
  mobileMenu?.classList.toggle("nav-open", open);
  btn?.setAttribute("aria-expanded", open ? "true" : "false");
  document.body.classList.toggle("nav-menu-open", open);

  const navbar = document.getElementById("navbar");
  if (!btn || !navbar) return;

  const tip = open
    ? navbar.dataset.tipMenuClose
    : navbar.dataset.tipMenuOpen;
  if (tip) {
    btn.setAttribute("aria-label", tip);
    btn.dataset.tooltip = tip;
    const tipEl = btn.querySelector(".nav-tip");
    if (tipEl) tipEl.textContent = tip;
  }
}

function syncThemeTooltip() {
  const navbar = document.getElementById("navbar");
  const themeToggle = document.getElementById("theme-toggle");
  if (!navbar || !themeToggle) return;

  const isDark = document.documentElement.classList.contains("dark");
  const tip = isDark ? navbar.dataset.tipThemeLight : navbar.dataset.tipThemeDark;
  if (!tip) return;

  themeToggle.setAttribute("aria-label", tip);
  themeToggle.dataset.tooltip = tip;
  const tipEl = themeToggle.querySelector(".nav-tip");
  if (tipEl) tipEl.textContent = tip;
}

function originFromEl(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function playThemeRadiance(origin: { x: number; y: number }, mode: "light" | "dark") {
  const root = document.getElementById("theme-radiance");
  const burst = root?.querySelector<HTMLElement>("[data-theme-burst]");
  const glow = root?.querySelector<HTMLElement>("[data-theme-glow]");
  if (!root || !burst || !glow) return Promise.resolve();

  if (reducedMotion()) return Promise.resolve();

  // Always use the warm light look: expand = turn on, collapse = turn off
  root.dataset.mode = "light";
  root.style.setProperty("--tr-x", `${origin.x}px`);
  root.style.setProperty("--tr-y", `${origin.y}px`);
  root.classList.add("is-active");

  gsap.killTweensOf([burst, glow]);

  const turningOff = mode === "dark";

  if (turningOff) {
    // Light fills the page, then retracts into the bulb
    gsap.set(burst, {
      scale: 1,
      opacity: 1,
      width: "280vmax",
      height: "280vmax",
    });
    gsap.set(glow, { scale: 2.4, opacity: 0.55 });
  } else {
    // Light sparks at the bulb and floods the page
    gsap.set(burst, {
      scale: 0.02,
      opacity: 1,
      width: 12,
      height: 12,
    });
    gsap.set(glow, { scale: 0.3, opacity: 0.9 });
  }

  return new Promise<void>((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        root.classList.remove("is-active");
        gsap.set([burst, glow], { clearProps: "all" });
        resolve();
      },
    });

    if (turningOff) {
      tl.to(
        glow,
        {
          scale: 0.15,
          opacity: 0,
          duration: 0.65,
          ease: "power3.in",
        },
        0,
      );

      tl.to(
        burst,
        {
          width: 10,
          height: 10,
          scale: 1,
          duration: 0.8,
          ease: "power3.in",
        },
        0,
      );

      tl.to(
        burst,
        {
          opacity: 0,
          duration: 0.2,
          ease: "power1.in",
        },
        0.62,
      );
    } else {
      tl.to(
        glow,
        {
          scale: 3.2,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
        },
        0,
      );

      tl.to(
        burst,
        {
          width: "280vmax",
          height: "280vmax",
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
        },
        0,
      );

      tl.to(
        burst,
        {
          opacity: 0,
          duration: 0.45,
          ease: "power1.in",
        },
        0.4,
      );
    }
  });
}

function applyTheme(newTheme: "light" | "dark") {
  document.documentElement.classList.remove("dark", "light");
  document.documentElement.classList.add(newTheme);
  localStorage.setItem("theme", newTheme);
  window.dispatchEvent(new CustomEvent("themechange", { detail: newTheme }));
}

async function handleThemeToggle(
  themeToggle: HTMLElement,
  updateThemeIcons: () => void,
) {
  if (animating) return;
  const isDark = document.documentElement.classList.contains("dark");
  const newTheme = isDark ? "light" : "dark";
  const origin = originFromEl(themeToggle);

  animating = true;
  themeToggle.classList.add("is-busy");

  const icon = isDark
    ? document.getElementById("icon-sun")
    : document.getElementById("icon-moon");

  if (icon && !reducedMotion()) {
    gsap.fromTo(
      icon,
      { rotate: 0, scale: 1 },
      {
        rotate: newTheme === "light" ? 90 : -40,
        scale: 1.2,
        duration: 0.35,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      },
    );
  }

  const radiance = playThemeRadiance(origin, newTheme);

  // Light on: flip mid-expand. Lights out: flip ASAP so darkness is revealed
  // as the warm disc retracts into the bulb.
  if (reducedMotion()) {
    applyTheme(newTheme);
    updateThemeIcons();
    syncThemeTooltip();
  } else {
    const flipAt = newTheme === "dark" ? 40 : 120;
    await new Promise((r) => setTimeout(r, flipAt));
    applyTheme(newTheme);
    updateThemeIcons();
    syncThemeTooltip();
  }

  await radiance;
  themeToggle.classList.remove("is-busy");
  animating = false;
}

const LANG_CHARS: Record<string, string> = {
  it: "ABCDEFGHIJKLMNOPQRSTUVWXYZÀÈÉÌÒÙ",
  en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};

const LANG_WORDS: Record<string, string[]> = {
  it: ["IT", "CIAO", "SI", "ITALIANO", "LEGGI", "QUI"],
  en: ["EN", "HI", "YES", "ENGLISH", "READ", "HERE"],
};

function pickChar(pool: string) {
  return pool[Math.floor(Math.random() * pool.length)] ?? "A";
}

function playLangLetterStream(targetLocale: string) {
  const root = document.getElementById("lang-warp");
  const stream = root?.querySelector<HTMLElement>("[data-lang-stream]");
  if (!root || !stream) return Promise.resolve();

  const locale = targetLocale === "en" ? "en" : "it";
  const chars = LANG_CHARS[locale];
  const words = LANG_WORDS[locale];
  const count = window.innerWidth < 640 ? 22 : 34;

  stream.replaceChildren();
  root.classList.add("is-active");

  const letters: HTMLSpanElement[] = [];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "lang-letter";
    // Sprinkle full words among single glyphs
    el.textContent =
      i % 7 === 0
        ? (words[Math.floor(Math.random() * words.length)] ?? locale.toUpperCase())
        : pickChar(chars);
    stream.appendChild(el);
    letters.push(el);
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  return new Promise<void>((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        root.classList.remove("is-active");
        stream.replaceChildren();
        resolve();
      },
    });

    letters.forEach((el) => {
      const fromLeft = Math.random() > 0.42;
      const y = vh * (0.06 + Math.random() * 0.88);
      const size = 0.8 + Math.random() * 2.2;
      const drift = (Math.random() - 0.5) * vh * 0.22;
      const duration = 0.7 + Math.random() * 0.5;
      const delay = Math.random() * 0.32;
      const startX = fromLeft ? -100 - Math.random() * 140 : vw + 100 + Math.random() * 140;
      const endX = fromLeft ? vw + 100 + Math.random() * 120 : -100 - Math.random() * 120;
      const midX = startX + (endX - startX) * (0.45 + Math.random() * 0.15);
      const peak = 0.45 + Math.random() * 0.5;
      const rot = (Math.random() - 0.5) * 56;

      gsap.set(el, {
        x: startX,
        y,
        fontSize: `${size}rem`,
        opacity: 0,
        rotate: rot * 0.35,
        force3D: true,
      });

      tl.to(
        el,
        {
          x: midX,
          y: y + drift * 0.55,
          opacity: peak,
          rotate: rot,
          duration: duration * 0.45,
          ease: "power2.out",
        },
        delay,
      );

      tl.to(
        el,
        {
          x: endX,
          y: y + drift,
          opacity: 0,
          rotate: rot * 1.25,
          duration: duration * 0.55,
          ease: "power1.in",
        },
        delay + duration * 0.45,
      );
    });
  });
}

async function handleLangSwitch(link: HTMLAnchorElement) {
  if (animating) return;
  const href = link.getAttribute("href");
  if (!href) return;

  if (reducedMotion()) {
    navigate(href);
    return;
  }

  const target = (link.dataset.targetLocale || "it").toLowerCase();

  animating = true;
  link.classList.add("is-busy");

  await playLangLetterStream(target);

  navigate(href);
  link.classList.remove("is-busy");
  animating = false;
}

function initNavbar() {
  dispose?.();
  dispose = null;
  animating = false;

  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const themeToggle = document.getElementById("theme-toggle");
  const iconSun = document.getElementById("icon-sun");
  const iconMoon = document.getElementById("icon-moon");
  const langSwitch = document.getElementById("lang-switch") as HTMLAnchorElement | null;
  const ac = new AbortController();
  const { signal } = ac;
  let isOpen = false;
  let navScrollTicking = false;

  const updateThemeIcons = () => {
    const isDark = document.documentElement.classList.contains("dark");
    iconSun?.classList.toggle("hidden", !isDark);
    iconMoon?.classList.toggle("hidden", isDark);
  };

  updateThemeIcons();
  syncThemeTooltip();
  setMenuOpen(mobileMenu, mobileMenuBtn, false);

  themeToggle?.addEventListener(
    "click",
    () => {
      void handleThemeToggle(themeToggle, updateThemeIcons);
    },
    { signal },
  );

  langSwitch?.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      void handleLangSwitch(langSwitch);
    },
    { signal },
  );

  const syncNavbarScroll = () => {
    navScrollTicking = false;
    navbar.classList.toggle("is-scrolled", window.scrollY > 50);
  };

  window.addEventListener(
    "scroll",
    () => {
      if (navScrollTicking) return;
      navScrollTicking = true;
      window.requestAnimationFrame(syncNavbarScroll);
    },
    { passive: true, signal },
  );
  syncNavbarScroll();

  const closeIfDesktop = () => {
    if (!window.matchMedia(DESKTOP_MQ).matches) return;
    if (!isOpen) return;
    isOpen = false;
    setMenuOpen(mobileMenu, mobileMenuBtn, false);
  };

  window.addEventListener("resize", closeIfDesktop, { signal });
  closeIfDesktop();

  mobileMenuBtn?.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      // Desktop tabs visible → burger must never open
      if (window.matchMedia(DESKTOP_MQ).matches) return;
      isOpen = !isOpen;
      setMenuOpen(mobileMenu, mobileMenuBtn, isOpen);
    },
    { signal },
  );

  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener(
      "click",
      () => {
        isOpen = false;
        setMenuOpen(mobileMenu, mobileMenuBtn, false);
      },
      { signal },
    );
  });

  dispose = () => {
    ac.abort();
    setMenuOpen(mobileMenu, mobileMenuBtn, false);
    animating = false;
  };
}

export function bootNavbar() {
  if (booted) return;
  booted = true;
  // Immediate init: relying only on astro:page-load left the burger dead
  // when the first page-load fired before this module registered.
  document.addEventListener("astro:page-load", initNavbar);
  initNavbar();
}
