import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initScrollMotion() {
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

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

  // Site-wide backdrop parallax (softer on mobile)
  const parallaxScale = isMobile ? 0.35 : 1;
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
    const speed = Number.parseFloat(el.dataset.parallax || "0.1") * parallaxScale;
    gsap.to(el, {
      y: () => speed * (isMobile ? 120 : 220),
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });
  });

  // Hero photo parallax while leaving the first viewport
  gsap.utils.toArray<HTMLElement>("[data-parallax-hero]").forEach((el) => {
    const speed = Number.parseFloat(el.dataset.parallaxHero || "0.1") * parallaxScale;
    gsap.to(el, {
      y: () => speed * (isMobile ? 60 : 120),
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  // Section fade / slide reveals
  gsap.utils.toArray<HTMLElement>(".fade-in").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      },
    );
  });

  // Staggered card grids
  gsap.utils.toArray<HTMLElement>(".stagger-grid").forEach((grid) => {
    const items = grid.querySelectorAll<HTMLElement>(".stagger-item");
    if (!items.length) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 44 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: grid,
          start: "top 85%",
          once: true,
        },
      },
    );
  });

  // About stats after main card
  const aboutStats = document.querySelectorAll<HTMLElement>("#about .about-stat");
  if (aboutStats.length) {
    gsap.fromTo(
      aboutStats,
      { opacity: 0, y: 24, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#about .about-card",
          start: "top 70%",
          once: true,
        },
      },
    );
  }

  // Experience timeline draw + card
  const timelineLine = document.querySelector<HTMLElement>("[data-timeline-line]");
  if (timelineLine) {
    gsap.fromTo(
      timelineLine,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: "top center",
        duration: 1.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#experience",
          start: "top 72%",
          once: true,
        },
      },
    );
  }

  const experienceCard = document.querySelector<HTMLElement>(".experience-card");
  if (experienceCard) {
    gsap.fromTo(
      experienceCard,
      { opacity: 0, x: isMobile ? 0 : 28, y: isMobile ? 32 : 0 },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: experienceCard,
          start: "top 85%",
          once: true,
        },
      },
    );
  }

  const experienceDot = document.querySelector<HTMLElement>("[data-timeline-dot]");
  if (experienceDot) {
    gsap.fromTo(
      experienceDot,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: "#experience",
          start: "top 72%",
          once: true,
        },
      },
    );
  }
}
