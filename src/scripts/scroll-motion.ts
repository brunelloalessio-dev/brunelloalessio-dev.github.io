import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScrollMotion() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lite = document.documentElement.classList.contains("fx-lite");
  const isMobile = lite || window.matchMedia("(max-width: 767px)").matches;
  const promote = !lite;

  if (reduceMotion) {
    gsap.set([".fade-in", ".stagger-item", ".about-stat", ".experience-card"], {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      clearProps: "transform,filter",
    });
    return;
  }

  ScrollTrigger.config({
    ignoreMobileResize: true,
    limitCallbacks: true,
  });

  // Soft parallax only on desktop — scrub lag avoids 1:1 scroll stutter
  if (!isMobile) {
    gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
      const speed = Number.parseFloat(el.dataset.parallax || "0.1");
      gsap.to(el, {
        y: speed * 120,
        ease: "none",
        force3D: promote,
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-parallax-hero]").forEach((el) => {
      const speed = Number.parseFloat(el.dataset.parallaxHero || "0.1");
      gsap.to(el, {
        y: speed * 70,
        ease: "none",
        force3D: promote,
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });
    });
  }

  // Lighter reveals — less travel, fewer paint spikes while scrolling
  gsap.utils.toArray<HTMLElement>(".fade-in").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: "power2.out",
        force3D: promote,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
          fastScrollEnd: true,
        },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>(".stagger-grid").forEach((grid) => {
    const items = grid.querySelectorAll<HTMLElement>(".stagger-item");
    if (!items.length) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.05,
        ease: "power2.out",
        force3D: promote,
        scrollTrigger: {
          trigger: grid,
          start: "top 88%",
          once: true,
          fastScrollEnd: true,
        },
      },
    );
  });

  const aboutStats = document.querySelectorAll<HTMLElement>("#about .about-stat");
  if (aboutStats.length) {
    gsap.fromTo(
      aboutStats,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        force3D: promote,
        scrollTrigger: {
          trigger: "#about .about-card",
          start: "top 72%",
          once: true,
          fastScrollEnd: true,
        },
      },
    );
  }

  const timelineLine = document.querySelector<HTMLElement>("[data-timeline-line]");
  if (timelineLine) {
    gsap.fromTo(
      timelineLine,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: "top center",
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#experience",
          start: "top 75%",
          once: true,
          fastScrollEnd: true,
        },
      },
    );
  }

  document.querySelectorAll<HTMLElement>(".experience-card").forEach((experienceCard) => {
    gsap.fromTo(
      experienceCard,
      { opacity: 0, y: isMobile ? 18 : 0, x: isMobile ? 0 : 16 },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        force3D: promote,
        scrollTrigger: {
          trigger: experienceCard,
          start: "top 88%",
          once: true,
          fastScrollEnd: true,
        },
      },
    );
  });

  document.querySelectorAll<HTMLElement>("[data-timeline-dot]").forEach((experienceDot) => {
    gsap.fromTo(
      experienceDot,
      { scale: 0.6, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#experience",
          start: "top 75%",
          once: true,
          fastScrollEnd: true,
        },
      },
    );
  });
}
