let dispose: (() => void) | null = null;
let booted = false;

function initNavbar() {
  dispose?.();
  dispose = null;

  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const themeToggle = document.getElementById("theme-toggle");
  const iconSun = document.getElementById("icon-sun");
  const iconMoon = document.getElementById("icon-moon");
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

  themeToggle?.addEventListener(
    "click",
    () => {
      const isDark = document.documentElement.classList.contains("dark");
      const newTheme = isDark ? "light" : "dark";
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeIcons();
      window.dispatchEvent(new CustomEvent("themechange", { detail: newTheme }));
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

  mobileMenuBtn?.addEventListener(
    "click",
    () => {
      isOpen = !isOpen;
      mobileMenu?.classList.toggle("nav-open", isOpen);
    },
    { signal },
  );

  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener(
      "click",
      () => {
        isOpen = false;
        mobileMenu?.classList.remove("nav-open");
      },
      { signal },
    );
  });

  dispose = () => {
    ac.abort();
  };
}

export function bootNavbar() {
  if (booted) return;
  booted = true;
  document.addEventListener("astro:page-load", initNavbar);
}
