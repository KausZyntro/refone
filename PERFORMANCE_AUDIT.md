# Refone — Homepage Performance Audit (Phase 1: Analysis Only)

**Date:** 2026-11-12
**Scope:** Homepage `/` and the layout/components it pulls in. No code was changed in this phase.
**Stack:** Next.js 16.1.6 (App Router, Turbopack), React 19.2.3, Redux Toolkit, Axios, Firebase Auth, Swiper 12, Lottie, react-icons, react-toastify.

---

## 1. How this audit was measured

Reported baseline from the browser Network tab (development mode):

| Metric | Value |
|---|---|
| Requests | 84 |
| Transferred | 7.5 MB |
| Total resources | 30.3 MB |
| Load time | 31+ s |

To avoid guessing, findings were cross-checked against the **production build already present** in `.next/` (BUILD_ID from 2026-11-12 16:40):

- Prerendered homepage HTML: `.next/server/app/index.html` (106.6 KB)
- Homepage initial JS: every `<script src>` in that HTML, sized on disk
- Homepage CSS: every `<link rel="stylesheet">`
- Component tree + client boundaries: source under `src/`
- Image dimensions/weights: `sharp` metadata + `stat` on `public/`
- API endpoints: source inspection + `curl` against the upstream blog host

> Important distinction: the 31 s figure is **development-mode compile time**, not production TTFB. Production `/` is statically prerendered with ISR (`initialRevalidateSeconds: 60`). The production build still ships **1.54 MB of raw JS and ~7 MB of media**, so the page is slow in both modes for different reasons. Findings below separate the two.

---

## 2. Homepage entry point and component map

Route entry: `src/app/page.tsx` (route `/`)

```
src/app/layout.tsx (root)
├── ReduxProvider                "use client" — store with 8 slices
├── <Suspense fallback={null}>
│   └── Navbar                   "use client"
│       ├── AuthModal            "use client" + lottie-react + shopping-cart.json (638 KB)
│       ├── OtpModal             "use client" + lottie-react + shopping-cart.json
│       ├── ForgotPasswordModal  "use client" + lottie-react + shopping-cart.json
│       └── VerifyOTPResetPasswordModal (same)
├── {children} = src/app/page.tsx
│   ├── HeroSlider        "use client"  Swiper + 3 raw <img>
│   ├── PhoneDetail       "use client"  Swiper + 7 raw <img>
│   ├── ReelsSection      server        (awaits STATIC_REELS, console.log)
│   │   └── ReelsSlider   "use client"  Swiper + 12 <video> elements
│   ├── FeaturesBanner    server        react-icons
│   ├── HomeBlogSlider    server        4 × next/image (unoptimized)
│   ├── Testimonial       "use client"  Swiper + 5 raw <img>
│   ├── FaqSection        "use client"  useState/useEffect + 1 MB raw <img>
│   ├── AppLink           "use client"  2 priority next/image (desktop + mobile) + 2 SVG badges
│   └── HomePageSeoData   server        text only
├── Footer                "use client"   (only needs client for accordion state)
├── ToastContainer        "use client"   react-toastify
└── SnapmintLoader        imported but never rendered
```

Duplicate/dead imports in `src/app/page.tsx`: `Navbar`, `Footer`, `HeroSection`, `Image` and `styles` (`page.module.css`) are imported but unused. The root layout already renders Navbar/Footer, so these are not double-rendered, but they are dead coupling.

Notable: `src/app/(store)/page.tsx` also resolves to `/` (route group) and is shadowed by `src/app/page.tsx`. The built `app-path-routes-manifest.json` contains **both** `"/(store)/page": "/"` and `"/page": "/"`. The served homepage is `src/app/page.tsx`, so the store placeholder is dead code and a future build hazard.

---

## 3. Measured numbers

### 3.1 Initial JavaScript (production build, `/`)

21 script tags, **1,577.9 KB raw (1.54 MB)**:

| Chunk | Raw size | Contents identified |
|---|---:|---|
| `d60517597fd1ba63.js` | 273.5 KB | Lottie `shopping-cart.json` inlined into JS |
| `982258fa3ae28c7a.js` | 307.2 KB | `lottie-web` runtime (`bodymovin`, `animationData`) |
| `3d93ed7f24150788.js` | 198.9 KB | Firebase Auth (`authDomain`, `firebase`) + Axios |
| `69be39811437728d.js` | 218.2 KB | React DOM client runtime (`createRoot`/`hydrateRoot`) |
| `7d6514a90169e63d.js` | 108.5 KB | Next.js framework runtime |
| `a6dad97d9634a72d.js` | 110.0 KB | polyfills |
| `f646682ab958601d.js` | 80.2 KB | Swiper |
| `c99728edcef203d4.js` | 47.1 KB | react-toastify |
| `ca4ec0a64baac719.js` | 25.9 KB | Swiper |
| `5cf47cf67e56f303.js` | 21.3 KB | Redux Toolkit |
| `c25542803d2891a6.js` | 19.7 KB | Swiper |
| 10 others | ~167 KB | framework/route chunks |

- **~780 KB of the initial JS is not needed to render the homepage:** Lottie (580.7 KB) + Firebase/Axios (198.9 KB).
- Swiper contributes ~125.8 KB across three chunks for four sliders.
- Toastify (47.1 KB) is loaded globally even though no toast is visible until an interaction.

### 3.2 CSS

5 render-blocking stylesheets, **59.0 KB raw** (`d8023a0b9a06e6f9` 14.0, `fbd531e43026d943` 16.8, `b44ecbd9e2c6f852` 27.2, plus two tiny). Total CSS itself is not the problem; the number of blocking files and the fact that most is injected from client components is.

### 3.3 Media (the 30.3 MB explanation)

The built homepage contains **12 `<video>` elements for 6 unique sources**:

```
/videos/1.mp4  ×2   (2.18 MB)
/videos/2.mp4  ×2   (4.86 MB)
/videos/3.mp4  ×2   (4.23 MB)
/videos/4.mp4  ×2   (3.62 MB)
pexels .mp4    ×2
pexels .mp4    ×2
```

14.4 MB of local video duplicated ≈ **28.8 MB** — this alone accounts for the reported 30.3 MB "total resources". The `reels-grid-desktop` block and the `reels-slider-mobile` Swiper block both render the full reel list; CSS hides one with `display:none`, but hidden `<video>` elements still allocate and request media.

Hero / above-the-fold images (all raw `<img>`, no dimensions, no `sizes`):

| File | Dimensions | Weight | Rendered at |
|---|---|---:|---|
| `public/discounted.png` | 2109×746 | 1381 KB | ~1250 px |
| `public/deals.png` | 1360×480 | 536 KB | ~1250 px |
| `public/sell.jpeg` | 2040×720 | 853 KB | ~1250 px |
| **Total hero** | | **2770 KB** | |

Mobile art direction is done with CSS `content: url(...)` (`src/styles/HeroSlider.css:580-587`), which loads a **second** set of images on top of the ones already in the DOM:

| File | Dimensions | Weight |
|---|---|---:|
| `discounted-mobile.png` | 1392×1130 | 1409 KB |
| `deals-mobile.png` | 370×300 | 144 KB |
| `sell-mobile.jpeg` | 555×450 | 213 KB |

Other homepage media:

| File | Weight | Notes |
|---|---:|---|
| `public/faq_hero.png` | 1003 KB | raw `<img>`, eager, below the fold |
| `public/applinkDesktop.jpeg` | 304 KB | `priority`; preloaded at **3840w** |
| `public/appLinkMobile.jpeg` | 101 KB | `priority`; hidden on desktop but preloaded |
| 4 × WordPress blog covers | 537 KB total | `next/image` with `unoptimized` |
| 7 category images | ~343 KB total | raw `<img>` |
| `public/logo-original.png` | 68 KB | optimized by next/image |

The built HTML also emits `<link rel="preload" as="image">` for **every** hero and category image, plus `useIcon.png` and `faq_hero.png`, including below-the-fold and mobile-hidden assets. `public/` totals **38 MB**, including 4.8 MB `prv.gif`, 2.3 MB `images/discount.png`, 1.7 MB `images/mothers_day_banner.png` (bundle/deploy weight; not all requested by `/`).

### 3.4 Requests (why 84)

Working estimate from the built page: 21 JS + 5 CSS + 1 font + 1 document = 28; ~21 images (3 hero, 7 category, 4 blog, 2 applink, 2 store badges, logo, testimonial avatar, FAQ) = 49; 3 `img.icons8.com` icons in the navbar + 2 Pexels videos + 6 media sources = 60; mobile CSS art-direction adds 3 more; Next `<Link>` viewport prefetches add several RSC requests; development mode adds Turbopack HMR/route chunks (the saved dev DOM shows 35 chunks vs 21 in production). That lands at the reported ~84.

---

## 4. Findings

Each finding: **Problem / File / Reason / Recommended solution / Priority**.

### HIGH

#### H1 — The navbar is not server-rendered at all; it pops in after hydration
- **Problem:** The built `/` HTML contains **0** occurrences of the navbar markup. Body starts with `<template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING">`.
- **File:** `src/components/layout/Navbar.tsx` (`useSearchParams`), `src/app/layout.tsx` (`<Suspense fallback={null}>`)
- **Reason:** `useSearchParams()` inside a statically generated route forces the whole navbar subtree to bail out to client-side rendering. With `fallback={null}` there is no server placeholder, so the header (logo, search, cart, account) appears only after the 1.5 MB JS bundle loads and executes. This delays the header paint, pushes perceived LCP, and can cause layout shift.
- **Recommended solution:** Remove `useSearchParams()` from the navbar's initial render path. Read the query string from `window.location` only inside an effect, or pass the search value from a small client child that is itself wrapped in Suspense with a **static placeholder** (same dimensions) instead of `null`. Keep the navbar server-rendered so the header is in the first HTML response.
- **Priority:** High

#### H2 — Four auth modals (and Lottie + Firebase) are in the initial bundle of every page
- **Problem:** `Navbar` statically imports `AuthModal`, `OtpModal`, `ForgotPasswordModal`, `VerifyOTPResetPasswordModal`. Each imports `lottie-react` and the **638 KB `public/lottie/shopping-cart.json`**, which is bundled into JS (measured 273.5 KB chunk + 307.2 KB lottie runtime). Separately, `Navbar` imports `productAPI` from `src/services/api.ts`, which imports `firebase/auth` at module scope (198.9 KB chunk with Axios). Because the navbar is in the root layout, this cost is paid on every route.
- **File:** `src/components/layout/Navbar.tsx`, `src/components/layout/AuthModal.tsx`, `OtpModal.tsx`, `ForgotPasswordModal.tsx`, `VerifyOTPResetPasswordModal.tsx`, `src/services/api.ts`, `src/services/firebase.ts`
- **Reason:** Modals are only needed after a click ("Login / Sign Up"), but their code and animation data are downloaded, parsed, and hydrated on first paint. `api.ts` importing `firebase/auth` synchronously makes Firebase part of the initial graph of any page that uses any API helper, not just auth.
- **Recommended solution:** Move the four modals behind `next/dynamic(() => import(...), { ssr: false })` and render them only when their open state is true. Load Lottie data with `animationData={() => import(...)}`/`fetch` inside the modal instead of a static JSON import (or convert the modal illustration to a static image/SVG if the animation is not essential). Split `googleLogin` + Firebase out of `api.ts` into `services/authFirebase.ts` so Axios-only modules do not pull Firebase. Keep all behaviour and markup identical.
- **Priority:** High

#### H3 — Every reel is rendered twice; videos account for almost the entire 30.3 MB
- **Problem:** 12 `<video>` elements for 6 unique files, each with `preload="metadata"` and no poster. 14.4 MB of local MP4s is counted twice ≈ 28.8 MB.
- **File:** `src/components/home/ReelsSlider.tsx:200-213` (`reels-grid-desktop` + `reels-slider-mobile`), `src/styles/ReelsSection.css:78-86, 296-305`, `src/services/instagramService.ts`
- **Reason:** The desktop grid and the mobile Swiper are both mounted; only CSS visibility differs. `preload="metadata"` still issues media requests for every instance (including the hidden set), and `thumbnail_url` is empty, so no poster is shown. Two reels are hosted on `videos.pexels.com` (third-party DNS + TLS on the critical path).
- **Recommended solution:** Render one reel list and switch presentation with CSS (or mount the Swiper only below 1024 px with a `matchMedia` hook), so exactly 6 videos exist in the DOM. Set `preload="none"` and provide real `poster` images; load/play only on click or when the card enters the viewport. Self-host or pre-connect to the Pexels videos. Keep the same card design and interactions.
- **Priority:** High

#### H4 — The hero ships 2.7 MB of unoptimized images and doubles it on mobile
- **Problem:** Three raw `<img>` tags (1.38 MB + 536 KB + 853 KB) with no `width`/`height`/`sizes`, no `fetchpriority`, and no responsive variants. On mobile, `content: url(...)` in CSS replaces the source but the desktop files are already being fetched; mobile adds 1.77 MB on top.
- **File:** `src/components/home/HeroSlider.tsx:60-87`, `src/styles/HeroSlider.css:580-587`, `public/*.png|jpeg`
- **Reason:** PNG screenshots for photographic banners, served at full resolution, with no encoder optimization or art direction. This is the LCP element. The CSS `content` trick cannot cancel the original request and is unsupported/inconsistent across browsers.
- **Recommended solution:** Re-export the three banners as WebP/AVIF at ~1600 px (desktop) and ~800 px (mobile), targeting <150 KB each; use `next/image` with `priority` on the first slide only, explicit `sizes="(max-width: 768px) 100vw, 1250px"`, and render separate desktop/mobile elements with `<picture>` semantics instead of CSS `content`. Do not alter the visual design; only the delivery format/size changes.
- **Priority:** High

#### H5 — The homepage render waits on an external WordPress call that fetches 100 posts to show 4
- **Problem:** `Home()` awaits `blogService.getBlogs()` before returning any JSX; the request is `https://refones.com?_embed&per_page=100&page=1` with `revalidate: 60`. During the audit the endpoint returned a **10-byte plain-text body (`helo world`)** with HTTP 200, so `response.json()` throws and `getBlogs()` silently returns `[]` — the "Recent Articles" section renders empty. `console.log("this is blog detail", blogs.slice(0,4))` also prints full post objects into server logs.
- **File:** `src/app/page.tsx:18`, `src/services/blogService.ts:9-40`
- **Reason:** Blocking the whole page (including hero) on a remote CMS call; requesting `_embed` + 100 posts returns a very large payload for 4 cards; for ISR the page cannot be regenerated until that host responds. Failure is swallowed, hiding a broken blog feed.
- **Recommended solution:** Request only what is rendered (`per_page=4`, `_fields`/`_embed` limited) and add a timeout. Move the blog section into its own async server component wrapped in `<Suspense>` with a skeleton so the hero streams immediately. Do not silently swallow errors — log with context and keep a cached fallback list. Verify the correct REST base URL via `NEXT_BLOG_BASE_URL` (site root currently is not a JSON API). Also correct the ISR window if 60 s is not intentional.
- **Priority:** High

#### H6 — The static homepage HTML is served as a skeleton and is filled in by an inline script
- **Problem:** Built `index.html` for `/` starts the body with `<div class="home-skeletor">…` inside a suspended boundary; the real content is streamed later in the same document and swapped by `$RC(...)`. The meaningful markup is not what the browser paints first.
- **File:** `src/app/loading.tsx` (root-level), `src/app/page.tsx`
- **Reason:** A root `loading.tsx` creates a Suspense boundary around every route, and the homepage's blocking blog fetch makes the prerender suspend, so the shell is emitted as a fallback. The loading file also statically imports **9 global CSS files** used by the homepage (`HeroSlider.css`, `PhoneDetail.css`, `ReelsSection.css`, `FeaturesBanner.css`, `HomeBlogSlider.module.css`, `Testimonial.css`, `FAQSection.css`, `AppLink.css`, `SkeletonLoader.css`), coupling the app-wide loading boundary to homepage styles. On a 1.5 MB JS budget, revealing content is gated by that script/hydration path, delaying LCP.
- **Recommended solution:** Remove the blocking fetch from the page (see H5) so the homepage prerenders with real content and no boundary. If a skeleton is still desired, scope it to the blog section only, not the route root. Move skeleton to `src/app/(home)/loading.tsx` if a route-level fallback is required.
- **Priority:** High

### MEDIUM

#### M1 — All seven homepage sections hydrate immediately, including everything below the fold
- **Problem:** `HeroSlider`, `PhoneDetail`, `ReelsSection/ReelsSlider`, `Testimonial`, `FaqSection`, `AppLink`, `Footer` are all client components in the first payload; there is no `next/dynamic` or visibility gating on the homepage.
- **File:** `src/app/page.tsx`, `src/components/home/*`, `src/components/layout/Footer.tsx`
- **Reason:** Swiper instances for the testimonial slider and the reels Swiper initialize on load even though they are below the fold; slideshow timers (`autoplay` 3 s / 4 s / 8 s) start immediately and keep running, competing with LCP work.
- **Recommended solution:** Keep the server shell and lazily mount interactive islands: `dynamic(() => import(...))` for below-fold sliders, or an IntersectionObserver wrapper that mounts Swiper only when near the viewport. Keep the same DOM/CSS so nothing moves visually; render a static first slide server-side where possible.
- **Priority:** Medium

#### M2 — `AppLink` uses `priority` on two below-the-fold, mutually hidden images
- **Problem:** Both desktop (4250×1500) and mobile images are marked `priority`; the build emits preloads at `w=3840` and `w=750`, competing with the hero, while only one is visible.
- **File:** `src/components/home/AppLink.tsx:10-31`, `src/styles/AppLink.css:25-33`
- **Reason:** `priority` means "this is the LCP image". Here it is the last section of the page, and one of the two is always `display:none`.
- **Recommended solution:** Remove `priority` from both, add `loading="lazy"`, provide `sizes`, and shrink the source to the real display size (≤1360 px wide). Use one `<picture>`/art-directed image instead of two `<Image>` elements.
- **Priority:** Medium

#### M3 — Raw `<img>` for categories, testimonials and FAQ: no dimensions, no lazy loading, oversized files
- **Problem:** 7 category images, 5 testimonial avatars and the 1 MB `faq_hero.png` are plain `<img>`; no `width`/`height` → CLS; all are eager; nothing is compressed/resized per viewport.
- **File:** `src/components/home/PhoneDetail.tsx:113`, `src/components/home/Testimonial.tsx:69`, `src/components/home/FaqSection.tsx:137`
- **Reason:** Next/Image's resizing, format negotiation and lazy-loading are bypassed. `faq_hero.png` at 1326×1187 / 1 MB is the heaviest single below-fold asset and is also preloaded by the build.
- **Recommended solution:** Replace with `next/image` (explicit `width`/`height` or `fill` + aspect-ratio container, `sizes`, default lazy). Re-export `faq_hero.png` as WebP/AVIF at its rendered width. Keep layout identical.
- **Priority:** Medium

#### M4 — Cart summary API call fires on every page load for logged-in users
- **Problem:** `useEffect(() => { if (user?.id) dispatch(fetchCartSummary(user.id)) }, …)` in the navbar runs a `POST checkout/summary` on every route, only to render a badge count.
- **File:** `src/components/layout/Navbar.tsx:59-63`, `src/redux/features/cartSlice.ts`, `src/services/api.ts` (`fetchCartSummary`)
- **Reason:** Extra API request on every navigation/refresh (not duplicate per se, but unnecessary on pages that don't use the cart). It also duplicates work when the cart page fetches the same summary.
- **Recommended solution:** Persist the badge count (localStorage/Redux persist) and refresh it after cart mutations, or fetch it lazily when the cart icon is hovered/focused. Cache the summary for the session and reuse it on `/cart`. Keep the badge behaviour identical.
- **Priority:** Medium

#### M5 — Swiper is bundled per slider, with overlapping module sets and CSS
- **Problem:** Four homepage sliders import `swiper/react`; `swiper/css`, `navigation`, `pagination`, `effect-fade` are imported in multiple components. Swiper is ~126 KB across three chunks.
- **File:** `HeroSlider.tsx`, `PhoneDetail.tsx`, `Testimonial.tsx`, `ReelsSlider.tsx`
- **Reason:** Duplicated module/CSS imports and four independently initialized Swiper instances; `EffectFade` is only used by the hero but the CSS is loaded globally. Below-fold sliders also initialize immediately (see M1).
- **Recommended solution:** Import Swiper core once in a shared client wrapper, import only the modules each slider uses, and lazily mount below-fold sliders. Consider replacing the static testimonial/category carousels with CSS scroll-snap to drop two Swiper instances without changing the UI.
- **Priority:** Medium

#### M6 — Image config is missing modern formats and quality control
- **Problem:** `next.config.ts` has no `images.formats` (AVIF/WebP), no `qualities`, and `refones.com` is absent from `remotePatterns`, which is why blog images use `unoptimized`.
- **File:** `next.config.ts`
- **Reason:** Optimized images are served as WebP by default only when enabled; AVIF is smaller. Without the blog host in `remotePatterns`, the 4 remote covers are served full-size (~537 KB for cards ~300 px wide).
- **Recommended solution:** Add `images: { formats: ['image/avif','image/webp'], qualities: [60, 75], remotePatterns: [... refones.com /blogs/wp-content/uploads/**] }`, then remove `unoptimized` from `HomeBlogSlider` and add `sizes`.
- **Priority:** Medium

#### M7 — Third-party assets in the header without preconnect or dimensions
- **Problem:** The navbar loads three icons from `img.icons8.com`; two reels come from `videos.pexels.com`; the hero/blog images come from `refones.com` and Cloudflare R2. No `preconnect`/`dns-prefetch` for any of these.
- **File:** `src/components/layout/Navbar.tsx:353-364`, `src/services/instagramService.ts:73-90`
- **Reason:** Extra DNS + TLS handshakes on the critical path; icons8 `<img>` tags have no dimensions (CLS risk).
- **Recommended solution:** Replace the three icons8 images with local SVGs or `react-icons` (already installed). Add `preconnect` only for hosts actually used above the fold; avoid preconnecting to Pexels if videos become click-to-load.
- **Priority:** Medium

#### M8 — `react-icons` barrel imports slow development and bloat the dev graph
- **Problem:** The saved dev DOM shows separate chunks for `react-icons/fa`, `fa6`, `fi`, `lia`, `lu`, `hi`. Dev homepage load is 31 s with 35 route chunks.
- **File:** `Navbar.tsx`, `FeaturesBanner.tsx`, `HeroSlider.tsx`, `Footer.tsx`, `ReelsSlider.tsx`
- **Reason:** Barrel-file imports (`import { FaX } from "react-icons/fa"`) force the bundler to walk thousands of icon modules in dev. Production tree-shakes them, so this is primarily a DX/build-time problem, but it also prevents effective `optimizePackageImports` tuning.
- **Recommended solution:** Add `experimental.optimizePackageImports: ['react-icons/fa','react-icons/fa6','react-icons/fi','react-icons/lia','react-icons/hi2']` or switch to per-icon paths (`react-icons/fa/FaX`) in the hot components. No UI change.
- **Priority:** Medium

#### M9 — Global client providers and a global toast host
- **Problem:** `ReduxProvider` wraps the whole app (store with 8 slices) and `ToastContainer` ships react-toastify (47.1 KB) on first load; `SnapmintLoader` is imported in the root layout but never rendered.
- **File:** `src/app/layout.tsx:1-51`, `src/redux/store.ts`
- **Reason:** Every page pays for all reducers and the toast runtime even when unused. The unused `SnapmintLoader` import keeps a dead module reference in the server graph.
- **Recommended solution:** Remove the unused import. Code-split the toast host or mount `ToastContainer` only where toasts can fire; consider lazy-loading reducers that are only needed in account/cart flows (`auth`, `cart` are needed globally for the navbar). Keep behaviour identical.
- **Priority:** Medium

#### M10 — Root `loading.tsx` imports homepage-only CSS globally
- **Problem:** `src/app/loading.tsx` imports 9 homepage stylesheets at the app root, so every route's loading boundary loads CSS for the homepage skeleton.
- **File:** `src/app/loading.tsx:1-10`
- **Reason:** Route-level loading UI should not own global page-section styles; this also makes the homepage CSS part of the shared boundary instead of the route.
- **Recommended solution:** Co-locate the skeleton with `src/app/page.tsx` (or a route group) and import only `SkeletonLoader.css` plus the minimal layout styles. Remove the unused commented skeleton markup.
- **Priority:** Medium

### LOW

#### L1 — Dead code and debug artifacts around the homepage
- **Problem:** `src/app/page.tsx` imports `Navbar`, `Footer`, `HeroSection`, `Image` and `styles` but never uses them. `console.log` in `page.tsx` and `ReelsSection.tsx`. `src/app/(store)/page.tsx` shadows `/`. `Footer-old.tsx`, `CategoryIcons.tsx`, `ProductSlider.tsx`, `PhoneDetailSlider.tsx` are unused. `page-dom.html` (175 KB) and `test-api.js` (hard-coded API URL) are checked in. `striptags` is installed but unused.
- **File:** listed above
- **Reason:** Confuses the route graph, adds dead references, prints full post objects to server logs, and risks accidental inclusion later. Not a direct runtime cost today.
- **Recommended solution:** Remove unused imports and statements, delete the shadow route and artifacts, and prune unused dependencies in a separate cleanup commit.
- **Priority:** Low

#### L2 — `AppLink` and `Footer` are client components without a client-only requirement
- **Problem:** `AppLink` has no state/effects; `Footer` only needs state for the mobile accordion.
- **File:** `src/components/home/AppLink.tsx:1`, `src/components/layout/Footer.tsx:1`
- **Reason:** Shipping markup through the client bundle and hydrating it adds JS for no interactivity. `Footer` also renders every link twice in the payload (server HTML + client boundary).
- **Recommended solution:** Convert `AppLink` to a server component. Split the footer accordion into a tiny client `FooterSection` and keep the rest of the footer server-rendered.
- **Priority:** Low

#### L3 — Public asset directory is 38 MB with unused heavy files
- **Problem:** `prv.gif` 4.8 MB, `images/discount.png` 2.3 MB, `images/mothers_day_banner.png` 1.7 MB, `images/globe.png` 1.6 MB, plus mobile banner duplicates.
- **File:** `public/`
- **Reason:** Deploy size and accidental usage risk; `prv.gif` and `discount.png` are not referenced in `src/`.
- **Recommended solution:** Confirm references, delete unused files, and compress the remainder. Do not remove anything referenced by the UI.
- **Priority:** Low

#### L4 — Long-running autoplay timers in below-fold sliders
- **Problem:** Testimonials autoplay every 3 s, categories every 4 s, hero every 8 s, all from page load.
- **File:** `Testimonial.tsx:55`, `PhoneDetail.tsx:76`, `HeroSlider.tsx:47`
- **Reason:** Continuous timers and style/layout work while the user is still on the hero; on low-end mobile this competes with hydration.
- **Recommended solution:** Pause autoplay until the slider is in the viewport (Swiper supports `pauseOnMouseEnter`, but add an intersection-based start), or disable autoplay for below-fold sliders.
- **Priority:** Low

#### L5 — No explicit caching headers for static media
- **Problem:** `next.config.ts` only sets `Cross-Origin-Opener-Policy`; no long-lived caching for `/videos`, `/images`.
- **File:** `next.config.ts:20-31`
- **Reason:** Next serves `public/` with conditional caching by default, but explicit immutable caching for versioned media improves repeat visits.
- **Recommended solution:** Add `Cache-Control: public, max-age=31536000, immutable` for hashed assets and a shorter policy for stable media filenames (only after confirming filenames are versioned, otherwise this defeats updates).
- **Priority:** Low

---

## 5. Duplicate / redundant request catalog

| # | Request | Duplicated where | Cause | Fix |
|---|---|---|---|---|
| 1 | `/videos/1-4.mp4` (+2 Pexels) | 2× each | desktop grid + mobile Swiper both mounted | render one list (H3) |
| 2 | Hero desktop images | 2× on mobile | `<img src>` + CSS `content: url(mobile)` | `<picture>` art direction (H4) |
| 3 | Applink images | desktop + mobile both preloaded | two `priority` images always in DOM | single `<picture>`, no priority (M2) |
| 4 | Blog list fetch | repeats per ISR regeneration | `revalidate: 60` + `per_page=100` | limit fields/rows, longer ISR (H5) |
| 5 | Cart summary `POST checkout/summary` | every page load + cart page | navbar effect | cache/persist badge (M4) |
| 6 | Category images | preload + `<img>` | build emits preload for every raw image | only preload the true LCP (M3) |
| 7 | Product detail data | server fetch + client refetch | `ProductDetailTestPage` dispatches `fetchProductById` when `initialProduct` is null; `RelatedProductsSection` fetches again | verify `initialProduct` always arrives; cache related lookups (app-wide, not `/`) |
| 8 | Swiper CSS/modules | imported in 4 components | no shared wrapper | shared client slider entry (M5) |

---

## 6. What is already fine (do not change in the next phase)

- **Fonts:** `next/font/google` self-hosts `Outfit` (single woff2, preloaded). No Google Fonts request, no FOIT.
- **Route caching:** `/` is statically prerendered with ISR (60 s); TTFB in production is not the bottleneck.
- **Logo:** rendered through `next/image` with explicit dimensions.
- **Search:** debounced 500 ms, aborted on new input, cached per query, limited to 5 results — this is implemented correctly.
- **Geolocation:** only runs on explicit user action (city selector), not on load.
- **Dynamic imports:** already used for `RelatedProductsSection` and the Lottie instance inside `ExchangeForm` — the pattern exists and can be reused for the navbar modals.
- **CSS volume:** 59 KB across 5 files is not excessive; the problem is blocking count and ownership, not raw size.

---

## 7. Recommended order for Phase 2 (not started)

1. **Remove the Lottie + Firebase initial-JS cost** (H2) — dynamic modals, lazy animation data, split Firebase out of `api.ts`. Expected: ~780 KB less parsed JS on every page, no visual change.
2. **Fix the navbar CSR bailout** (H1) — server-render the header so it paints with the first HTML.
3. **De-duplicate reels** (H3) — 6 videos instead of 12, `preload="none"` + posters. Expected: ~28 MB less "total resources".
4. **Optimize hero + FAQ + category images** (H4, M2, M3, M6) — WebP/AVIF via `next/image`, real `sizes`, no `priority` below the fold.
5. **De-block the homepage from WordPress** (H5, H6) — limit payload, stream the blog section, remove root `loading.tsx` coupling.
6. **Lazy-mount below-fold sliders and stop global toast/redux overhead** (M1, M5, M9).
7. **Cleanup** (L1-L5) in a final, behaviour-neutral commit.

Guardrails for the next phase: keep the same markup hierarchy and CSS so the UI is pixel-identical; keep every section, link and interaction; change delivery (formats, sizes, loading strategy, boundaries) rather than design; verify with a production build (`npm run build && npm start`) and a fresh Network tab capture against the baseline below.

---

## 8. Baseline to beat (re-capture after Phase 2)

| Metric | Baseline (dev) | Baseline (production build) |
|---|---|---|
| Requests | 84 | ~60-84 |
| Transferred | 7.5 MB | measure |
| Total resources | 30.3 MB | 30.3 MB (video-dominated) |
| Initial JS (raw) | 35 dev chunks | 1,577.9 KB / 21 chunks |
| Initial CSS (raw) | — | 59.0 KB / 5 files |
| Homepage LCP element | hero banner | `discounted.png` (1.38 MB) |
| `<video>` elements | 12 | 12 |

### Reproduction commands

```bash
# List and size the homepage's initial JS
node -e "const fs=require('fs');const h=fs.readFileSync('.next/server/app/index.html','utf8');for(const m of h.matchAll(/<script[^>]*src=\"([^\"]+)\"/g))console.log(fs.statSync('.next'+m[1].replace('/_next','')).size,m[1])"

# Count video elements on the homepage
grep -o '<video' .next/server/app/index.html | wc -l

# Check whether the navbar is server-rendered
grep -c 'nav-utility' .next/server/app/index.html

# Identify heavy chunks by marker strings
for f in .next/static/chunks/*.js; do grep -lq 'bodymovin' "$f" && echo "lottie runtime: $f"; done
```
