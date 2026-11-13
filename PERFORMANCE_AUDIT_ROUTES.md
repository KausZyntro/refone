# Route-wise performance audit

Scope: all App Router page routes other than / and /product/[id]/[slug]. Those protected pages and their dependencies were left untouched.

## Route inventory

| Route | Rendering and performance notes |
|---|---|
| / | Protected. Existing homepage; not modified. A route-group page at src/app/(store)/page.tsx also resolves to /; left untouched. |
| /product/[id]/[slug] | Protected. Existing product detail; not modified. |
| /about-us | Static content; now rendered as a Server Component. |
| /allProduct | Interactive product listing. Removed a redundant default-query fetch, avoids refetching filters already in Redux, and lazy-loads card images. |
| /animate | GSAP animation page. Kept client-side because its animation lifecycle is essential to the route. |
| /assesment-result | Static result page; now rendered as a Server Component. |
| /assessment-history | Authenticated Redux data and filtering; kept client-side. |
| /blog | Fetches the full archive. Requests only card fields, keeps all posts, and loads later WordPress pages concurrently. Blog cards render on the server; only image fallback state remains client-side. |
| /blog/[slug] | Server-rendered detail and metadata. Shared fetch is request-cached. |
| /buyback-request | Server-rendered static content with a small client image-fallback island. |
| /careers | Server-rendered static content with a small client smooth-scroll button. |
| /cart | Cart state and summary retained client-side. |
| /checkout | Cart, address, and payment flow retained client-side. |
| /contact-us | Contact form behavior retained. |
| /exchange-phone | Multi-step exchange form retained client-side. |
| /exchange-phone/success | Countdown and redirect behavior retained client-side. |
| /faq | Search and accordion state retained client-side. |
| /my-account | Authenticated dashboard retained client-side. |
| /my-orders | Authenticated order fetch and filters retained client-side. |
| /order-success | Redux order-state reset retained. |
| /our-story | Static content; now rendered as a Server Component. |
| /privacy-policy | Static content; now rendered as a Server Component. |
| /productDetailtest | Interactive product test route retained. |
| /profile/address | Server wrapper with authenticated address management retained. |
| /return-policy | Static content; now rendered as a Server Component. |
| /scan | Server redirect retained. |
| /server-busy | Fallback page retained. |
| /terms-conditions | Static content; now rendered as a Server Component. |
| /warranty-info | Static content; now rendered as a Server Component. |

The project has 30 page.tsx files and 29 distinct route patterns because the two root page files share /. The App Router also exposes /robots.txt, /sitemap.xml, /blog-sitemap.xml, and /blog-images/[...path] as metadata or route-handler endpoints.

## Findings and changes

- The baseline production build succeeded. It reported WordPress archive responses of 9,117,877 bytes and 2,314,893 bytes for pages 1 and 2. Next skipped caching both responses because each exceeded its 2 MB data-cache limit.
- The archive now uses WordPress _fields and limited _embed relations so cards do not fetch full post content. All posts remain present in the listing.
- The archive previously fetched later pages sequentially. Later pages now load concurrently, with failed pages logged while successful pages remain available.
- A blog card previously received each full post as a client-component prop. It now renders on the server and passes only image strings to its small error-fallback client island; cover images use responsive Next Image optimization.
- /allProduct previously normalized its empty filter state into ?page=1, which triggered another product fetch. The URL updater now compares parsed filters before navigating.
- Static information pages no longer ship page-level client hydration.
- Global Next Image AVIF/WebP formats and image host rules already exist. The shared root layout and protected-route bundle were not changed.

## Production build and payload comparison

The baseline and final production builds completed. Page JavaScript was measured from each prerendered HTML file by summing its referenced chunks in raw and gzip form.

| Route | HTML before -> after | Initial JS gzip before -> after |
|---|---:|---:|
| /about-us | 60.4 -> 68.2 KB | 234.5 -> 231.8 KB |
| /allProduct | 53.3 -> 53.3 KB | 237.5 -> 237.1 KB |
| /buyback-request | 65.6 -> 82.6 KB | 235.4 -> 232.1 KB |
| /careers | 59.7 -> 68.4 KB | 233.8 -> 232.1 KB |
| /blog | 9,994.4 -> 553.8 KB (-94.5%) | 233.2 -> 232.2 KB |
| /terms-conditions | 57.2 -> 61.0 KB | 233.7 -> 231.8 KB |

Server-rendered page content increases HTML slightly while removing page-level hydration. The shared root layout accounts for most remaining JavaScript, so it was left unchanged to protect the excluded routes. The /allProduct changes target network calls and image scheduling rather than bundle size.

## Verification limits

The final production build passed. HTTP smoke checks returned 200 for all 26 static non-protected routes and for a real blog article. A generated optimized blog image URL also returned 200 as image/jpeg (200,599 bytes). Browser LCP/FCP/CLS, Lighthouse, browser-console, and authenticated API flows were not measured because Chrome DevTools Protocol and a signed-in test account were unavailable.
