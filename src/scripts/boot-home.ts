import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initBackToTop, teardownBackToTop } from "@/scripts/back-to-top";
import { initHeroChat } from "@/scripts/hero-chat";
import { initScrollMotion } from "@/scripts/scroll-motion";

let booted = false;

/** Portfolio home scripts — re-run after ClientRouter navigations. */
function runHomeBoot() {
  if (!document.getElementById("hero")) {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    teardownBackToTop();
    return;
  }
  initScrollMotion();
  initHeroChat();
  initBackToTop();
}

export function bootHomePage() {
  if (booted) return;
  booted = true;

  document.addEventListener("astro:page-load", runHomeBoot);
  runHomeBoot();
}
