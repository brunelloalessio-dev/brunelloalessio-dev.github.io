import { useCallback, useEffect, useRef, useState } from "react";
import Particles from "@tsparticles/react";
import type { Container, Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

function isDark() {
  return document.documentElement.classList.contains("dark");
}

const darkColors = ["#ffffff", "#d4d4d8", "#a1a1aa"];
const lightColors = ["#09090b", "#3f3f46", "#52525b"];

export default function ParticleBackground() {
  const [init, setInit] = useState(false);
  const containerRef = useRef<Container | null>(null);
  const initialDark = useRef(true);

  useEffect(() => {
    initialDark.current = isDark();
    const initParticles = async () => {
      const engine = (await import("@tsparticles/engine")).tsParticles;
      await loadSlim(engine as unknown as Engine);
      setInit(true);
    };
    initParticles();
  }, []);

  useEffect(() => {
    const handler = () => {
      const c = containerRef.current;
      if (!c) return;
      const colors = isDark() ? darkColors : lightColors;
      c.options.particles.color.load({ value: colors });
      c.options.particles.links.color = colors[0] as any;
      c.particles.forEach((p) => {
        const picked = colors[Math.floor(Math.random() * colors.length)];
        p.color.load({ value: picked });
      });
    };
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);

  const particlesLoaded = useCallback(async (c?: Container) => {
    if (c) containerRef.current = c;
  }, []);

  if (!init) return null;

  const colors = initialDark.current ? darkColors : lightColors;

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={{
        fullScreen: false,
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        particles: {
          color: { value: colors },
          links: {
            color: colors[0],
            distance: 150,
            enable: true,
            opacity: 0.15,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.8,
            direction: "none",
            random: true,
            straight: false,
            outModes: { default: "out" },
          },
          number: {
            density: { enable: true, width: 1920, height: 1080 },
            value: 60,
          },
          opacity: {
            value: { min: 0.1, max: 0.4 },
            animation: { enable: true, speed: 0.5, sync: false },
          },
          shape: { type: "circle" },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "grab" },
          },
          modes: {
            grab: { distance: 140, links: { opacity: 0.3 } },
          },
        },
        detectRetina: true,
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}
