<div align="center">

# 🌐 brunelloalessio-dev.github.io

### Alessio Brunello — Frontend Tech Lead

**Portfolio personale** | **Bilingue IT/EN** | **Web3 Aesthetic**

[![Deploy to GitHub Pages](https://github.com/brunelloalessio-dev/brunelloalessio-dev.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/brunelloalessio-dev/brunelloalessio-dev.github.io/actions/workflows/deploy.yml)
[![Astro](https://img.shields.io/badge/Astro-v7-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Codice MIT](https://img.shields.io/badge/codice-MIT-16a34a)](LICENSE)

[**🔗 Live →**](https://brunelloalessio-dev.github.io) · [**🇮🇹 Italiano**](https://brunelloalessio-dev.github.io/it/) · [**🇬🇧 English**](https://brunelloalessio-dev.github.io/en/)

</div>

---

## ✨ Overview

Portfolio personale di **Alessio Brunello**, Frontend Tech Lead con 10+ anni di esperienza nello sviluppo di applicazioni web e mobile enterprise. Il sito presenta un'estetica moderna ispirata al mondo Web3, con glassmorphism, backdrop animato e animazioni scroll.

### Caratteristiche principali

- 🌍 **Bilingue** — Italiano e Inglese con switch lingua nel navbar
- 🎨 **Web3 Aesthetic** — Dark/Light mode, glassmorphism, B/W monochrome palette
- ✨ **Backdrop animato** — Orbs e griglia parallax theme-aware
- 🌓 **Dark/Light mode** — Toggle nel navbar con persistenza localStorage
- 🎬 **Animazioni scroll** — Fade-in, stagger e parallax con GSAP + ScrollTrigger
- 💬 **Hero chat** — Intro typewriter progressive-enhancement (contenuto già nel HTML)
- 📱 **Fully responsive** — Desktop, tablet e mobile con design mobile-first
- ⚡ **Performance** — Zero JS di default (Astro Islands), GSAP solo dove serve
- 🔍 **SEO ottimizzato** — Meta tags, Open Graph, sitemap, robots.txt, hreflang + x-default
- 🚀 **Deploy automatico** — GitHub Actions su ogni push a `main`

---

## 🛠️ Tech Stack

| Categoria         | Tecnologia                                                             |
| ----------------- | ---------------------------------------------------------------------- |
| **Framework**     | [Astro v7](https://astro.build) — Static Site Generation               |
| **Styling**       | [Tailwind CSS v4](https://tailwindcss.com) — Utility-first CSS         |
| **Animazioni**    | [GSAP](https://gsap.com) + ScrollTrigger — Scroll / hero animations    |
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
│   ├── og-image.jpg                # Open Graph preview
│   └── robots.txt                  # SEO robots
├── src/
│   ├── components/
│   │   ├── Navbar.astro            # Navbar sticky glassmorphism + hamburger mobile
│   │   ├── Hero.astro              # Hero section fullscreen (chat + foto)
│   │   ├── About.astro             # Chi sono + stats
│   │   ├── Skills.astro            # Tech stack grid con icone devicon
│   │   ├── Experience.astro        # Timeline esperienza lavorativa
│   │   ├── Teaching.astro          # Formazione & sharing AI
│   │   ├── Certifications.astro    # Grid certificazioni
│   │   ├── Beyond.astro            # Oltre al codice
│   │   ├── Contact.astro           # Card contatti (email, LinkedIn, GitHub)
│   │   ├── Footer.astro            # Footer con links social
│   │   ├── SiteBackdrop.astro      # Backdrop orbs + griglia
│   │   └── BackToTop.astro         # Elevator back-to-top
│   ├── i18n/
│   │   ├── it.json                 # Testi italiani
│   │   ├── en.json                 # Testi inglesi
│   │   └── utils.ts                # Helper i18n (locale detection, translations)
│   ├── layouts/
│   │   └── Layout.astro            # Layout base (<head>, fonts, meta SEO/OG)
│   ├── pages/
│   │   ├── index.astro             # Root redirect immediato → /it/
│   │   ├── it/index.astro          # Pagina italiana
│   │   └── en/index.astro          # Pagina inglese
│   ├── scripts/                    # GSAP motion modules
│   └── styles/
│       └── global.css              # Tailwind directives + glassmorphism + glow utilities
├── docs/                           # Build output (GitHub Pages)
├── astro.config.mjs                # Astro config (i18n, sitemap, Tailwind, outDir: docs)
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
| `npm run build`   | Build di produzione in `./docs/`     |
| `npm run preview` | Preview della build di produzione    |

---

## 🚢 Deploy

GitHub Pages pubblica la cartella **`docs/`** dal branch `main` (deploy nativo `pages-build-deployment`).

Prima di pushare su `main`, rigenera l’output statico:

```bash
npm run build
git add docs
git commit -m "Rebuild docs"
```

Il workflow [Build site](.github/workflows/deploy.yml) verifica solo che `npm run build` passi (non pubblica Pages: quello lo fa già il deploy dalla cartella `docs/`).

---

## 👤 Chi sono

**Alessio Brunello** — Frontend Tech Lead presso Bludata S.r.l. con 10+ anni di esperienza.

- 🏗️ Architettura frontend enterprise con React e TypeScript
- 👥 Lead di un team frontend su progetti web e mobile
- 🤖 AI-augmented development con Cursor, Claude Code, Grok e workflow agentici
- 📱 App mobile cross-platform con React Native e Flutter
- 🎯 Piattaforma cloud-based per il settore retail specializzato, in Bludata — azienda leader in Italia

### Contatti

- 📧 orecchia.mobiletto.0h@icloud.com
- 💼 [LinkedIn](https://www.linkedin.com/in/alessio-brunello-dev)
- 🐙 [GitHub](https://github.com/brunelloalessio-dev)

---

## 📄 Licenza

Il sito è un portfolio personale, non una libreria.

- **Contenuti** (testi, CV, immagini, biografia): © Alessio Brunello, tutti i diritti riservati.
- **Codice sorgente** (Astro, componenti, stili, script, configurazione): [MIT](LICENSE).

Inter è sotto SIL Open Font License 1.1. Le icone Devicon sono MIT. I testi sono in `public/licenses/`.

---

<div align="center">
  <sub>Realizzato con ❤️ usando Astro, Tailwind CSS e GSAP</sub>
</div>
