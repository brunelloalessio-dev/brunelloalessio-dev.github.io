import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const SHOW_AFTER = 420;
const RING_LENGTH = 100;
const STREAK_COUNT = 140;

type Streak = {
  x: number;
  y: number;
  // Lateral drift away from center as we rush upward
  drift: number;
  length: number;
  width: number;
  hue: number;
  alpha: number;
  speedMul: number;
};

function createHyperspaceController(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>("[data-hyperspace-canvas]");
  const flash = root.querySelector<HTMLElement>("[data-hyperspace-flash]");
  if (!canvas || !flash) return null;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const state = { intensity: 0, opacity: 0 };
  const streaks: Streak[] = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let raf = 0;
  let running = false;

  const palette = [190, 205, 220, 235, 265, 300];

  // Traveling UP → streaks rush DOWN (opposite of scroll direction)
  const spawn = (anywhere = false): Streak => {
    const cx = width * 0.5 || 1;
    const spread = (Math.random() - 0.5) * (width * 1.15);
    const x = cx + spread;
    return {
      x,
      y: anywhere ? Math.random() * height : -20 - Math.random() * height * 0.35,
      drift: (x - cx) / Math.max(cx, 1),
      length: 18 + Math.random() * 42,
      width: 0.7 + Math.random() * 2.1,
      hue: palette[Math.floor(Math.random() * palette.length)]!,
      alpha: 0.4 + Math.random() * 0.55,
      speedMul: 0.55 + Math.random() * 1.1,
    };
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const ensureStreaks = () => {
    while (streaks.length < STREAK_COUNT) streaks.push(spawn(true));
  };

  const draw = () => {
    const cx = width * 0.5;
    const vanishY = height * 0.12;
    const speed = 6 + state.intensity * 48;
    const stretch = 0.55 + state.intensity * 4.2;
    const dark = 0.55 + state.intensity * 0.38;

    ctx.clearRect(0, 0, width, height);

    // Heavy dark wash — page almost disappears during the jump
    ctx.fillStyle = `rgba(2, 4, 12, ${dark})`;
    ctx.fillRect(0, 0, width, height);

    // Horizon glow near the top (destination / "up")
    const glow = ctx.createRadialGradient(cx, vanishY, 0, cx, vanishY, height * 0.55);
    glow.addColorStop(0, `rgba(186, 230, 253, ${0.06 + state.intensity * 0.16})`);
    glow.addColorStop(0.35, `rgba(56, 189, 248, ${0.04 + state.intensity * 0.08})`);
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    for (const streak of streaks) {
      const prevY = streak.y;
      const prevX = streak.x;
      const dy = speed * streak.speedMul;
      streak.y += dy;
      // Perspective: pull outward while falling down the viewport
      streak.x += streak.drift * dy * (0.08 + state.intensity * 0.18);

      if (streak.y - streak.length * stretch > height + 40) {
        Object.assign(streak, spawn(false));
        continue;
      }

      const trail = streak.length * stretch;
      const x2 = streak.x;
      const y2 = streak.y;
      const x1 = prevX - streak.drift * trail * 0.15;
      const y1 = prevY - trail;
      const depth = Math.min(1, Math.max(0, streak.y / height));
      const fade = 0.35 + depth * 0.65;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `hsla(${streak.hue}, 95%, ${70 + state.intensity * 16}%, ${streak.alpha * fade * (0.45 + state.intensity * 0.55)})`;
      ctx.lineWidth = streak.width * (0.8 + state.intensity * 1.6) * (0.7 + depth);
      ctx.lineCap = "round";
      ctx.stroke();
    }
  };

  const loop = () => {
    draw();
    if (running) raf = requestAnimationFrame(loop);
  };

  const start = () => {
    resize();
    streaks.length = 0;
    ensureStreaks();
    if (!running) {
      running = true;
      raf = requestAnimationFrame(loop);
    }
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
    streaks.length = 0;
    ctx.clearRect(0, 0, width, height);
  };

  return {
    root,
    flash,
    state,
    start,
    stop,
    resize,
  };
}

export function initBackToTop() {
  const button = document.getElementById("back-to-top");
  const hyperspaceRoot = document.getElementById("hyperspace");
  if (!(button instanceof HTMLButtonElement) || !hyperspaceRoot) return;

  const progress = button.querySelector<SVGCircleElement>(".elevator__progress");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hyperspace = reduceMotion ? null : createHyperspaceController(hyperspaceRoot);

  let visible = false;
  let scrolling = false;
  let launchTimer: number | undefined;
  let activeTween: gsap.core.Timeline | null = null;

  const update = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1,
    );
    const ratio = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

    if (progress) {
      progress.style.strokeDashoffset = String(RING_LENGTH * (1 - ratio));
    }

    const shouldShow = scrollTop > SHOW_AFTER;
    if (shouldShow === visible) return;

    visible = shouldShow;
    if (visible) {
      button.hidden = false;
      button.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => {
        button.classList.add("is-visible");
      });
      return;
    }

    button.classList.remove("is-visible");
    button.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      if (!button.classList.contains("is-visible")) {
        button.hidden = true;
      }
    }, 360);
  };

  const finish = (previousBehavior: string) => {
    document.documentElement.style.scrollBehavior = previousBehavior;
    scrolling = false;
    button.classList.remove("is-launching");
    if (hyperspace) {
      hyperspace.stop();
      hyperspace.root.classList.remove("is-active");
      gsap.set(hyperspace.root, { opacity: 0 });
      gsap.set(hyperspace.flash, { opacity: 0 });
      hyperspace.state.intensity = 0;
      hyperspace.state.opacity = 0;
    }
    update();
  };

  const goTop = () => {
    if (scrolling) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop <= 0) return;

    scrolling = true;
    button.classList.add("is-launching");
    window.clearTimeout(launchTimer);
    launchTimer = window.setTimeout(() => {
      button.classList.remove("is-launching");
    }, 560);

    if (reduceMotion || !hyperspace) {
      window.scrollTo(0, 0);
      scrolling = false;
      update();
      return;
    }

    activeTween?.kill();
    hyperspace.start();
    hyperspace.root.classList.add("is-active");

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    // Punchy hyperspace jump: engage → streak → arrive flash
    const duration = Math.min(1.55, Math.max(0.95, scrollTop / 2200));

    activeTween = gsap.timeline({
      defaults: { ease: "power2.out" },
      onInterrupt: () => finish(previousBehavior),
      onComplete: () => finish(previousBehavior),
    });

    activeTween
      .set(hyperspace.flash, { opacity: 0 })
      .to(hyperspace.root, { opacity: 1, duration: 0.18, ease: "power1.out" }, 0)
      .to(
        hyperspace.state,
        { intensity: 1, duration: duration * 0.55, ease: "power3.in" },
        0.05,
      )
      .to(
        window,
        {
          duration,
          scrollTo: { y: 0, autoKill: false },
          ease: "power4.inOut",
        },
        0.08,
      )
      .to(
        hyperspace.flash,
        { opacity: 0.95, duration: 0.12, ease: "power1.out" },
        duration * 0.72,
      )
      .to(
        hyperspace.flash,
        { opacity: 0, duration: 0.35, ease: "power2.out" },
        duration * 0.82,
      )
      .to(
        hyperspace.state,
        { intensity: 0, duration: 0.35, ease: "power2.out" },
        duration * 0.78,
      )
      .to(
        hyperspace.root,
        { opacity: 0, duration: 0.32, ease: "power2.out" },
        duration * 0.88,
      );
  };

  button.addEventListener("click", goTop);
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      update();
      hyperspace?.resize();
    },
    { passive: true },
  );
  update();
}
