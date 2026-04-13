<div align="center">

# 🌐 brunelloalessio-dev.github.io

### Alessio Brunello — Frontend Tech Lead

**Portfolio personale** | **Bilingue IT/EN** | **Web3 Aesthetic**

[![Deploy to GitHub Pages](https://github.com/brunelloalessio-dev/brunelloalessio-dev.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/brunelloalessio-dev/brunelloalessio-dev.github.io/actions/workflows/deploy.yml)
[![Astro](https://img.shields.io/badge/Astro-v6-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[**🔗 Live →**](https://brunelloalessio-dev.github.io) · [**🇮🇹 Italiano**](https://brunelloalessio-dev.github.io/it/) · [**🇬🇧 English**](https://brunelloalessio-dev.github.io/en/)

</div>

---

## ✨ Overview

Portfolio personale di **Alessio Brunello**, Frontend Tech Lead con 10+ anni di esperienza nello sviluppo di applicazioni web e mobile enterprise. Il sito presenta un'estetica moderna ispirata al mondo Web3, con glassmorphism, particelle animate e animazioni scroll.

### Caratteristiche principali

- 🌍 **Bilingue** — Italiano e Inglese con switch lingua nel navbar
- 🎨 **Web3 Aesthetic** — Dark/Light mode, glassmorphism, B/W monochrome palette
- ✨ **Particelle animate** — Sfondo interattivo con tsParticles (constellation), theme-aware
- 🌓 **Dark/Light mode** — Toggle nel navbar con persistenza localStorage
- 🎬 **Animazioni scroll** — Fade-in, stagger e parallax con GSAP + ScrollTrigger
- 📱 **Fully responsive** — Desktop, tablet e mobile con design mobile-first
- ⚡ **Performance** — Zero JS di default (Astro Islands), React solo per le particelle
- 🔍 **SEO ottimizzato** — Meta tags, Open Graph, sitemap, robots.txt, hreflang
- 🚀 **Deploy automatico** — GitHub Actions su ogni push a `main`

---

## 🛠️ Tech Stack

| Categoria         | Tecnologia                                                             |
| ----------------- | ---------------------------------------------------------------------- |
| **Framework**     | [Astro v6](https://astro.build) — Static Site Generation               |
| **Styling**       | [Tailwind CSS v4](https://tailwindcss.com) — Utility-first CSS         |
| **Interattività** | [React](https://react.dev) — Islands architecture                      |
| **Particelle**    | [tsParticles](https://particles.js.org) — Animated particle background |
| **Animazioni**    | [GSAP](https://gsap.com) + ScrollTrigger — Scroll animations           |
| **Linguaggio**    | [TypeScript](https://www.typescriptlang.org) — Strict mode             |
| **Deploy**        | [GitHub Pages](https://pages.github.com) + GitHub Actions              |

---

## 📁 Struttura progetto

```
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD: build & deploy to GH Pages
├── public/
│   ├── favicon.svg                 # Favicon SVG con logo "AB"
│   ├── photo.jpg                   # Foto profilo
│   └── robots.txt                  # SEO robots
├── src/
│   ├── components/
│   │   ├── Navbar.astro            # Navbar sticky glassmorphism + hamburger mobile
│   │   ├── Hero.astro              # Hero section fullscreen
│   │   ├── About.astro             # Chi sono + stats
│   │   ├── Skills.astro            # Tech stack grid con icone devicon
│   │   ├── Experience.astro        # Timeline esperienza lavorativa
│   │   ├── Certifications.astro    # Grid certificazioni
│   │   ├── Contact.astro           # Card contatti (email, LinkedIn, GitHub)
│   │   ├── Footer.astro            # Footer con links social
│   │   └── ParticleBackground.tsx  # React island — tsParticles
│   ├── i18n/
│   │   ├── it.json                 # Testi italiani
│   │   ├── en.json                 # Testi inglesi
│   │   └── utils.ts                # Helper i18n (locale detection, translations)
│   ├── layouts/
│   │   └── Layout.astro            # Layout base (<head>, fonts, meta SEO/OG)
│   ├── pages/
│   │   ├── index.astro             # Root redirect → /it/
│   │   ├── it/index.astro          # Pagina italiana
│   │   └── en/index.astro          # Pagina inglese
│   └── styles/
│       └── global.css              # Tailwind directives + glassmorphism + glow utilities
├── astro.config.mjs                # Astro config (i18n, React, Sitemap, Tailwind)
├── tsconfig.json                   # TypeScript strict + path aliases
└── package.json
```

---

## 🚀 Setup locale

### Prerequisiti

- [Node.js](https://nodejs.org) v20+
- [npm](https://www.npmjs.com/) v9+

### Installazione

```bash
# Clona il repository
git clone https://github.com/brunelloalessio-dev/brunelloalessio-dev.github.io.git
cd brunelloalessio-dev.github.io

# Installa le dipendenze
npm install

# Avvia il dev server
npm run dev
```

### Comandi disponibili

| Comando           | Descrizione                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Avvia dev server su `localhost:4321` |
| `npm run build`   | Build di produzione in `./dist/`     |
| `npm run preview` | Preview della build di produzione    |

---

## 🚢 Deploy

Il sito viene deployato automaticamente su **GitHub Pages** ad ogni push sul branch `main` tramite [GitHub Actions](.github/workflows/deploy.yml).

Il workflow:
1. Checkout del codice
2. Setup Node.js 20 + cache npm
3. `npm ci` → `npm run build`
4. Upload e deploy dell'artifact su GitHub Pages

---

## 👤 Chi sono

**Alessio Brunello** — Frontend Tech Lead presso Bludata S.r.l. con 10+ anni di esperienza.

- 🏗️ Architettura frontend enterprise con React e TypeScript
- 👥 Lead di un team frontend su progetti web e mobile
- 🤖 AI-augmented development con Claude (agents, skills, workflows)
- 📱 App mobile cross-platform con React Native e Flutter
- 🎯 Piattaforma cloud-based per il settore retail specializzato, in Bludata — azienda leader in Italia

### Contatti

- 📧 orecchia.mobiletto.0h@icloud.com
- 💼 [LinkedIn](https://www.linkedin.com/in/alessio-brunello-dev)
- 🐙 [GitHub](https://github.com/brunelloalessio-dev)

---

## 📄 Licenza

Questo progetto è distribuito sotto licenza [MIT](LICENSE).

---

<div align="center">
  <sub>Realizzato con ❤️ usando Astro, Tailwind CSS, GSAP e tsParticles</sub>
</div>
