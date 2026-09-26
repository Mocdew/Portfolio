# Portfolio Build Plan

Reference site: <https://devuthman.vercel.app/>
Goal: a fast, dark, terminal-style developer portfolio with a project showcase, a built-in blog, a résumé download and a "why hire me" page. It uses the reference site's structure and feel, with our own content and code.

---

## 1. What the reference site is built with (checked in the browser)

| Signal found on the live site                                                             | Meaning                                   |
| ----------------------------------------------------------------------------------------- | ----------------------------------------- |
| `/_app/immutable/...` asset paths, `svelte-xxxx` classes, `svelte-announcer` element      | **SvelteKit**                             |
| Utility classes like `min-h-screen flex flex-col font-mono`, `md:flex`, `border-hairline` | **Tailwind CSS** with custom theme tokens |
| `geist@1.3.1` stylesheets from jsDelivr                                                   | **Geist Sans + Geist Mono** fonts         |
| Prism.js + language components (go, bash, sql, yaml, ts…)                                 | Syntax highlighting in blog posts         |
| `*.vercel.app` domain, Vercel script                                                      | **Vercel** hosting + Vercel Analytics     |
| `/blog/<slug>` routes, local posts plus dev.to links                                      | Markdown blog with an "External" tab      |
| Résumé PDF under `_app/immutable/assets`                                                  | PDF imported as a static asset            |
| Full OG/Twitter meta, `robots`, geo tags, Google verification                             | SEO done by hand in `<svelte:head>`       |

**Design features:**

- Near-black background (`#030202`), off-white text (`#e2dfdf`), one muted accent (`#d3cfcf`), thin hairline borders
- A large block-character ASCII name as the hero, with a glitch/CRT effect
- A vertical "glass" dot navigation fixed to the right edge (desktop only)
- Numbered project cards (01–18): title, language badge, one-line hook, paragraph, tech tags, GitHub/Docs links
- Informal, self-aware copy ("keep going — apparently length is a personality trait")
- Writing section with **Blog / External** tabs, date · read time · tags
- Mostly monospace type throughout

---

## 2. Stack I will use

I'm keeping the reference's core stack, which is lightweight and fits a content site, and upgrading a few parts.

### Core

| Layer           | Choice                                                         | Why                                                                                 |
| --------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Framework       | **SvelteKit 2 + Svelte 5 (runes)**                             | Same as the reference. Small bundles, file-based routing, prerenders to static HTML |
| Language        | **TypeScript**                                                 | Type-checked project/post data                                                      |
| Styling         | **Tailwind CSS v4** (`@tailwindcss/vite`)                      | Theme tokens are defined in CSS with `@theme`                                       |
| Fonts           | **Geist Sans + Geist Mono** (`geist` npm package, self-hosted) | Same look, with no third-party CDN request                                          |
| Adapter         | **`@sveltejs/adapter-vercel`** (or `adapter-static`)           | Every page is prerendered                                                           |
| Package manager | **pnpm** (npm also works)                                      |                                                                                     |
| Runtime         | **Node.js 22 LTS**                                             |                                                                                     |

### Content

| Need                    | Choice                                                                                    | Why                                                                        |
| ----------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Blog posts in Markdown  | **mdsvex**                                                                                | `.md` files that can also contain Svelte components                        |
| Frontmatter validation  | **zod**                                                                                   | The build fails on a missing date or tag instead of shipping a broken post |
| Code highlighting       | **Shiki** (build time, `github-dark` / custom theme)                                      | Replaces Prism: no client-side JS and more accurate highlighting           |
| Heading anchors / TOC   | `rehype-slug` + `rehype-autolink-headings`                                                |                                                                            |
| Read time               | `reading-time`                                                                            | The "4 min" labels                                                         |
| External posts          | **dev.to public API** (`https://dev.to/api/articles?username=...`), fetched at build time | Fills the "External" tab                                                   |
| Project data            | A typed `src/lib/data/projects.ts` array                                                  | One file to edit when adding a project                                     |
| GitHub stars (optional) | GitHub REST API at build time                                                             | Adds a star count to each card                                             |

### Visual extras

| Need                | Choice                                                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ASCII hero          | Generate once with **figlet** (font "ANSI Shadow") and paste into a `<pre>`                                                                                   |
| Glitch / CRT effect | Pure CSS: `text-shadow` RGB split, `@keyframes` jitter, scanline `repeating-linear-gradient` overlay. Disabled when the user has `prefers-reduced-motion` set |
| Icons               | **lucide-svelte** + **simple-icons** (brand logos: GitHub, X, LinkedIn, dev.to)                                                                               |
| Scroll-spy dot nav  | `IntersectionObserver` in a small Svelte component                                                                                                            |
| Page transitions    | Svelte's built-in `fade`/`fly` + the View Transitions API (`onNavigate`)                                                                                      |

### SEO, performance, analytics

| Need                                   | Choice                                                    |
| -------------------------------------- | --------------------------------------------------------- |
| Meta / OG / Twitter tags               | Reusable `<Seo />` component                              |
| Dynamic OG images per post             | **`@ethercorps/sveltekit-og`** (Satori-based)             |
| `sitemap.xml`, `rss.xml`, `robots.txt` | Prerendered `+server.ts` endpoints                        |
| Analytics                              | **`@vercel/analytics`** + **`@vercel/speed-insights`**    |
| Images                                 | `@sveltejs/enhanced-img` (AVIF/WebP, sized at build time) |

### Quality and tooling

| Need              | Choice                                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| Lint / format     | ESLint (flat config, `eslint-plugin-svelte`) + Prettier (`prettier-plugin-svelte`, `prettier-plugin-tailwindcss`) |
| Type check        | `svelte-check`                                                                                                    |
| Unit tests        | **Vitest** (content loaders, helpers)                                                                             |
| E2E / smoke       | **Playwright** (home renders, every post route returns 200, no console errors)                                    |
| Accessibility     | `@axe-core/playwright` inside the E2E run                                                                         |
| CI                | **GitHub Actions**: install → lint → check → test → build                                                         |
| Hosting           | **Vercel**: preview deploy on every PR, production on `main`                                                      |
| Domain (optional) | Custom domain added through Vercel DNS                                                                            |

### Optional (not needed for v1)

- **Contact form:** SvelteKit form action + **Resend** for email + **Cloudflare Turnstile** for spam protection
- **View counter / likes:** **Upstash Redis** (free tier) through a `+server.ts` endpoint
- **Comments:** **Giscus** (GitHub Discussions)

---

## 3. Adapting it to you (my recommendation)

The reference is a Go backend portfolio. Your work (credit scoring engine, house prices, cluster analysis, NLP, neural-network classification, African scoring) is **data science / ML**, so I'd keep the layout and change the content:

- **Hero tagline:** e.g. "Data scientist. I build models that ship, not just notebooks."
- **Project cards** show metrics the way the reference shows benchmarks: _"AUC 0.87 on 30k applicants"_, _"RMSE ↓18% vs baseline"_. Numbers are more convincing than adjectives.
- **Card links:** GitHub · Live demo (Streamlit / Flask app) · Notebook (nbviewer or a rendered blog post)
- **Tag set:** Python, pandas, scikit-learn, XGBoost, PyTorch/TensorFlow, SQL, Flask, Streamlit
- **Blog:** write-ups of projects ("How I built a credit scorecard from scratch"), with Shiki highlighting for Python/SQL
- Optionally, **embed charts** in posts: export Plotly/matplotlib figures as SVG, or render interactive ones with a small Svelte + Observable Plot component

---

## 4. Project structure

```
portfolio/
├─ src/
│  ├─ app.html
│  ├─ app.css                  # Tailwind import + @theme tokens + CRT/glitch CSS
│  ├─ lib/
│  │  ├─ components/
│  │  │  ├─ AsciiHero.svelte
│  │  │  ├─ DotNav.svelte       # fixed right-side scroll-spy nav
│  │  │  ├─ ProjectCard.svelte
│  │  │  ├─ PostList.svelte     # Blog / External tabs
│  │  │  ├─ Tag.svelte
│  │  │  ├─ Seo.svelte
│  │  │  └─ Footer.svelte
│  │  ├─ data/
│  │  │  ├─ projects.ts        # typed project list
│  │  │  └─ site.ts            # name, socials, résumé path
│  │  ├─ server/
│  │  │  ├─ posts.ts           # glob-import .md, validate with zod
│  │  │  └─ devto.ts           # fetch external posts at build
│  │  └─ assets/resume.pdf
│  ├─ content/blog/*.md        # posts
│  └─ routes/
│     ├─ +layout.svelte / +layout.ts   # export const prerender = true
│     ├─ +page.svelte / +page.server.ts   # hero, projects, writing
│     ├─ why-hire-me/+page.svelte
│     ├─ blog/[slug]/+page.svelte / +page.server.ts
│     ├─ og/[slug]/+server.ts
│     ├─ rss.xml/+server.ts
│     └─ sitemap.xml/+server.ts
├─ static/ (favicon, robots.txt)
├─ tests/ (playwright)
├─ svelte.config.js  (mdsvex + shiki + rehype)
├─ vite.config.ts
└─ .github/workflows/ci.yml
```

---

## 5. Build phases

### Phase 0: Setup (≈½ day)

1. `pnpm dlx sv create portfolio` → SvelteKit minimal, TypeScript, with the Tailwind, ESLint, Prettier, Vitest and Playwright add-ons
2. Add `adapter-vercel`, set `prerender = true` in the root layout
3. Create the GitHub repo and connect it to Vercel so preview deploys work from the first commit
4. **Done when:** the empty site is live on a `*.vercel.app` URL

### Phase 1: Design system (≈½ day)

1. Install Geist and define `@theme` tokens: `--color-bg #030202`, `--color-fg #e2dfdf`, `--color-muted`, `--color-hairline`, `--color-accent`, `--font-mono`, `--font-sans`
2. Base styles: monospace body, hairline borders, selection color, focus rings, scrollbar
3. CRT/scanline overlay + glitch keyframes, disabled under `prefers-reduced-motion`
4. **Done when:** a test page shows the typography, tags, a card and a button in the final look

### Phase 2: Home page (≈1–2 days)

1. `AsciiHero`: figlet name in `<pre aria-hidden>` with a visually hidden `<h1>` for screen readers and SEO; role line; three-line intro; CTA links (Why hire me · Projects · Résumé); social icons
2. `DotNav`: fixed right, glass background (`backdrop-blur`), dots scroll-spy the `#hero / #projects / #writing` sections, tooltip labels, hidden below `md`
3. Projects section: "Honest bit" intro box → `ProjectCard` list generated from `projects.ts` (index number, title, language badge, hook, description, tags, links, optional "private" badge) → "More on GitHub →"
4. Writing section: tabs (Blog | External), counts in the header ("· 7 posts · 5 external")
5. Footer
6. **Done when:** the home page matches the reference layout on desktop and mobile (375px) with no horizontal scroll

### Phase 3: Blog (≈1–2 days)

1. mdsvex + Shiki + rehype plugins in `svelte.config.js`
2. `posts.ts`: `import.meta.glob('/src/content/blog/*.md', { eager: true })` → zod-validated frontmatter (`title, description, date, tags, draft`) → sorted, read time added
3. `blog/[slug]` page: title, date · read time · tags, prose styling (Tailwind Typography plugin, recolored to the theme), code-block copy button, back link, previous/next post
4. `devto.ts`: fetch at build, map to the same shape, flag as `external`
5. RSS + sitemap endpoints; per-post OG image
6. **Done when:** two sample posts render with highlighted code, and the RSS feed and sitemap validate

### Phase 4: Secondary pages (≈½ day)

1. `/why-hire-me`: short, specific proof points (metrics, shipped work, how you work)
2. Résumé: import the PDF so it gets a hashed URL, with `download` + open-in-new-tab links
3. Custom `+error.svelte` 404 in the terminal style ("command not found")

### Phase 5: SEO, performance, accessibility (≈½ day)

1. `Seo` component on every route (title, description, canonical, OG, Twitter)
2. `@vercel/analytics` + speed insights
3. Run Lighthouse; target **≥ 95** on all four categories
4. axe check: color contrast on muted text, keyboard reachability of the dot nav and tabs, skip link

### Phase 6: Tests and CI (≈½ day)

1. Vitest: post loader (sorting, draft filtering, zod errors), read-time helper
2. Playwright: home loads, every nav link resolves, every `/blog/*` returns 200, tabs switch, no console errors, axe passes
3. GitHub Actions workflow runs lint → `svelte-check` → vitest → build → playwright

### Phase 7: Content and launch (ongoing)

1. Write the real project entries with metrics and links
2. Publish 2–3 initial posts
3. Custom domain, Google Search Console verification, submit the sitemap
4. Share on LinkedIn / X / dev.to

**Estimated total for v1:** about 5–7 focused days.

---

## 6. Data shapes

```ts
// src/lib/data/projects.ts
export type Project = {
	slug: string;
	title: string;
	language: 'Python' | 'SQL' | 'R' | 'TypeScript' | string;
	hook: string; // one-line lead, e.g. "Credit decisions you can explain."
	description: string; // 2–4 sentences, include a metric
	tags: string[];
	links: { github?: string; demo?: string; docs?: string; notebook?: string };
	private?: boolean;
	featured?: boolean;
};
```

```md
---
title: How I Built a Credit Scorecard From Scratch
description: WoE binning, logistic regression, and turning log-odds into points.
date: 2026-10-01
tags: [python, credit-risk]
draft: false
---
```

---

## 7. Checklist before launch

- [ ] Every project card has a working link and at least one concrete number
- [ ] Résumé PDF is current
- [ ] OG image previews correctly (check with opengraph.xyz or the LinkedIn Post Inspector)
- [ ] Mobile: no horizontal scroll, dot nav hidden, ASCII hero scales down (or switches to a smaller figlet font)
- [ ] `prefers-reduced-motion` turns off the glitch effect
- [ ] Lighthouse ≥ 95, axe has no violations
- [ ] 404 page works
- [ ] Analytics receiving events

---

## 8. Commands (quick reference)

```bash
pnpm dlx sv create portfolio
pnpm add -D mdsvex shiki rehype-slug rehype-autolink-headings @sveltejs/adapter-vercel @tailwindcss/typography @sveltejs/enhanced-img
pnpm add geist zod reading-time lucide-svelte simple-icons @vercel/analytics @vercel/speed-insights
pnpm dlx figlet -f "ANSI Shadow" "YOURNAME"
pnpm dev
pnpm build && pnpm preview
```
