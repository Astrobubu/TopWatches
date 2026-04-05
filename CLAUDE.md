# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Golden Planet Watches — a luxury watch e-commerce marketplace based in Dubai's Gold Souq. Built with Next.js 16 App Router, Supabase, Tailwind CSS 4, and ShadCN UI. Checkout is exclusively via WhatsApp (wa.me links). Uses the "Midnight Luxe" design preset (Obsidian `#0D0D12` / Champagne `#C9A84C`, Playfair Display + Inter + JetBrains Mono). WhatsApp number: +971 50 745 2323.

## Commands

```bash
npm run dev      # Dev server at localhost:3000 (Turbopack)
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint (eslint.config.mjs)
```

No test framework is configured.

## Architecture

**Framework:** Next.js 16 with App Router, React 19, TypeScript (strict), Turbopack bundler.

**Routing:**
- `/watches/[id]` — dynamic watch detail pages with SEO metadata
- `/blog/[slug]` — blog posts (server data fetch + client UI wrapper for i18n)
- `/locations/[slug]` — Dubai area pages (rewritten from `/luxury-watches-in-:slug` via next.config.ts)
- `/collections` — filterable watch grid (filters driven by URL search params)
- `/for-him` — men's watches (36mm and above)
- `/for-her` — women's watches (36mm and under)
- API routes under `/api/` (watches CRUD, reviews, blog, seed, import/scraping, upload)

**Data layer:** Supabase (PostgreSQL + RLS) with static fallback data in `src/data/`. Static files (`watches.ts`, `brands.ts`, `gp-stock.ts`) are the source of truth; Supabase is optional/supplementary. Environment variables in `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).

**i18n:** Custom context-based system (not next-intl). 6 locales: `en`, `zh`, `ar`, `fa`, `ru`, `pcm`. RTL for `ar`/`fa`. Translations in `src/lib/i18n/translations/*.json`. Uses `useI18n()` / `useTranslation()` hook client-side. Locale stored in localStorage key `gw-locale`. Auto-detects browser language on first visit.

**Currency:** Locale-based currency conversion via `src/lib/currency.ts`. Base prices stored in AED. Conversion: en→USD, zh→CNY, ar→AED, fa→AED, ru→RUB, pcm→NGN. Components use `formatPrice()` and `getCurrencyCode()`.

**Styling:** Tailwind CSS 4 via `@tailwindcss/postcss`. CSS variables for light/dark theming (next-themes). Global noise overlay SVG at 0.05 opacity. Radius system: `rounded-[2rem]` to `rounded-[3rem]` for containers, `rounded-2xl` for cards.

**UI components:** ShadCN (new-york style, RSC enabled) in `src/components/ui/`. 20+ shadcn components. Path alias `@/*` → `src/*`.

**Animations:** GSAP + ScrollTrigger for scroll-based animations. Always use `gsap.context()` in `useEffect` with `ctx.revert()` cleanup. Default easing: `power3.out`. Stagger: 0.08 for text, 0.15 for cards. Framer Motion also available.

## Key Component Patterns

- **Server Components by default**; add `"use client"` only for interactivity
- **Blog pattern:** Server component fetches data, passes to client wrapper (`BlogListClient`, `BlogDetailClient`) for i18n support
- **Watch card:** Displays locale-aware price via `formatPrice(watch.price, locale)`, condition badge, case size badge
- **Filter system:** URL-driven state (URLSearchParams) with multi-select for brands, categories, conditions, genders, case sizes. Price range slider. Persists in URL for shareability.
- **WhatsApp checkout:** CTA generates `wa.me/{phone}?text={encoded}` links. Bank transfer accepted with delivery upon payment confirmation.

## Key Conventions

- WhatsApp checkout + bank transfer — no cart/payment processor
- Magnetic button hover: `scale(1.03)` with `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- RTL languages (Arabic, Farsi) use Amiri/Tajawal fonts with `!important` overrides
- JSON-LD schema generation via `src/components/seo/json-ld.tsx` (Organization, Website, Article, Breadcrumb)
- Image sources: Supabase storage, Unsplash, WatchBase, Chrono24, Wikimedia, Pixabay (all in `next.config.ts` remotePatterns)
- Security headers: nosniff, DENY frame, strict-origin referrer, permissions policy
- Design spec in `GEMINI.md` — reference for aesthetic/interaction rules
- Case size filter options: 26, 28, 31, 36, 40, 41, 42, 43, 44, 45mm (no 34, 38, 39, 46)

## File Organization

- `src/app/` — Next.js App Router pages and API routes
- `src/components/layout/` — header (morphing navbar), footer, search, newsletter
- `src/components/home/` — hero, featured watches, categories, brand carousel, concierge, reviews, trust
- `src/components/watches/` — watch card, image gallery, specs, condition badge, related watches, WhatsApp order
- `src/components/collections/` — filter sidebar, sort dropdown, active filters
- `src/components/blog/` — blog list client, blog detail client (i18n wrappers)
- `src/components/seo/` — JSON-LD schema components
- `src/components/ui/` — ShadCN components
- `src/lib/i18n/` — i18n context, translations, helpers
- `src/lib/` — db queries, supabase client, types, utils, filters, currency, blog, locations, image processing
- `src/data/` — static watch catalog, brands, stock data
- `docs/` — implementation plans, design specs, SEO audit
