# Kronos Watch Marketplace - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a multi-brand luxury watch marketplace with Next.js + ShadCN that feels functional like Chrono24 with Roger Dubuis luxury aesthetics, supporting light/dark/system themes.

**Architecture:** Next.js 15 App Router with static data (no backend). All watch data lives in a central `data/watches.ts` file. ShadCN components provide the UI primitives. Pages: Home, Collections (with filters), Watch Detail (with gallery), About. Theme via next-themes + CSS variables.

**Tech Stack:** Next.js 15, React 19, ShadCN UI, Tailwind CSS v4, Framer Motion, next-themes, Lucide icons, Playfair Display + Inter fonts (Google Fonts)

---

## Task 1: Project Scaffolding & ShadCN Init

**Files:**
- Create: Next.js project in `D:/Apps/Websites/TopWatches/`
- Modify: `package.json`, `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`
- Create: `components.json`

**Step 1: Create Next.js project**

Run from `D:/Apps/Websites/TopWatches/`:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --yes
```
Note: If directory not empty, clear it first (keep `docs/` and `.mcp.json`). Expected: Next.js 15 scaffolded with App Router, TypeScript, Tailwind.

**Step 2: Initialize ShadCN**

```bash
npx shadcn@latest init -d
```
Expected: `components.json` created, globals.css updated with ShadCN CSS variables.

**Step 3: Install all needed ShadCN components**

```bash
npx shadcn@latest add button card carousel dialog sheet navigation-menu badge separator tabs input select slider dropdown-menu scroll-area skeleton tooltip toggle aspect-ratio avatar
```
Expected: All components installed in `src/components/ui/`.

**Step 4: Install additional dependencies**

```bash
npm install next-themes framer-motion
```

**Step 5: Configure Google Fonts in layout**

Modify `src/app/layout.tsx` to import Playfair Display and Inter from `next/font/google`.

**Step 6: Commit**

```bash
git init && git add -A && git commit -m "feat: scaffold Next.js project with ShadCN UI components"
```

---

## Task 2: Theme System Setup

**Files:**
- Create: `src/components/theme-provider.tsx`
- Create: `src/components/theme-toggle.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Step 1: Create ThemeProvider component**

Create `src/components/theme-provider.tsx`:
```tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

**Step 2: Create ThemeToggle component**

Create `src/components/theme-toggle.tsx` using ShadCN's `dropdown-menu` and `button`. Three options: Light, Dark, System. Uses `useTheme()` from next-themes. Icons: Sun, Moon, Monitor from Lucide.

**Step 3: Wrap root layout with ThemeProvider**

Modify `src/app/layout.tsx`:
- Import ThemeProvider
- Wrap children with `<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>`
- Add `suppressHydrationWarning` to `<html>` tag
- Configure fonts: Playfair Display (variable: `--font-playfair`) and Inter (variable: `--font-inter`)

**Step 4: Configure custom CSS variables for luxury theme**

Modify `src/app/globals.css` to add gold accent color variables to both `:root` (light) and `.dark` selectors. Key additions:
- `--gold: 36 87% 38%` (champagne gold for light mode)
- `--gold: 43 62% 55%` (lighter gold for dark mode)
- Ensure background is pure white in light mode, rich dark in dark mode

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: add multi-theme system with light/dark/system toggle"
```

---

## Task 3: Watch Data & Image Collection

**Files:**
- Create: `src/data/watches.ts`
- Create: `src/data/brands.ts`
- Create: `src/lib/types.ts`

**Step 1: Define TypeScript types**

Create `src/lib/types.ts`:
```typescript
export interface Watch {
  id: string
  brand: string
  model: string
  reference: string
  price: number
  images: string[] // 3-4 Unsplash URLs per watch
  description: string
  specs: {
    movement: string
    caseMaterial: string
    caseSize: string
    waterResistance: string
    dialColor: string
    bracelet: string
    powerReserve: string
    year: number
  }
  category: "dress" | "sport" | "dive" | "chronograph" | "pilot"
  condition: "new" | "unworn" | "excellent" | "good"
  featured: boolean
}

export interface Brand {
  id: string
  name: string
  logo: string // Unsplash or placeholder
  country: string
  founded: number
  description: string
}
```

**Step 2: Browse Unsplash for watch images**

Use Claude-in-Chrome to browse unsplash.com and collect direct image URLs for luxury watches. Need 15-20 watches x 3-4 images = ~60-80 images. Search terms:
- "rolex watch", "luxury watch face", "watch movement"
- "patek philippe", "audemars piguet royal oak"
- "omega speedmaster", "cartier watch", "tag heuer"
- "luxury watch on wrist", "watch dial closeup"

Use Unsplash source URLs: `https://images.unsplash.com/photo-XXXXX?w=800&q=80`

**Step 3: Create watch data file**

Create `src/data/watches.ts` with 18 watches across 7 brands. Each watch has:
- Unique ID (slug format)
- 3-4 real Unsplash image URLs
- Realistic price, specs, description
- Category and condition tags

**Step 4: Create brands data file**

Create `src/data/brands.ts` with 7 brands: Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, TAG Heuer, IWC.

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: add watch and brand mock data with Unsplash images"
```

---

## Task 4: Layout Components (Header + Footer)

**Files:**
- Create: `src/components/layout/header.tsx`
- Create: `src/components/layout/footer.tsx`
- Create: `src/components/layout/search-bar.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Build the Header**

Create `src/components/layout/header.tsx`:
- Sticky top navigation bar
- Left: "KRONOS" logo in Playfair Display serif font
- Center: Search bar (prominent, Chrono24-style) using ShadCN `input`
- Right: Nav links (Collections, About), ThemeToggle, shopping bag icon, heart icon
- Mobile: hamburger menu using ShadCN `sheet` for slide-out nav
- Use ShadCN `navigation-menu` for desktop nav links
- Clean white background in light mode, dark in dark mode
- Subtle bottom border

**Step 2: Build the Search Bar**

Create `src/components/layout/search-bar.tsx`:
- Search icon + input with placeholder "Search 600+ luxury watches..."
- Rounded, elegant styling
- Keyboard shortcut hint (Ctrl+K)

**Step 3: Build the Footer**

Create `src/components/layout/footer.tsx`:
- 4-column grid: Company, Collections, Support, Legal
- Bottom bar: copyright, social icons (Instagram, Twitter, Facebook)
- Newsletter signup with email input and CTA button
- ShadCN `separator` between sections
- ShadCN `input` + `button` for newsletter

**Step 4: Wire into root layout**

Modify `src/app/layout.tsx` to include Header and Footer wrapping `{children}`.

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: add header with search, footer with newsletter"
```

---

## Task 5: Homepage

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/components/home/hero-section.tsx`
- Create: `src/components/home/brand-carousel.tsx`
- Create: `src/components/home/featured-watches.tsx`
- Create: `src/components/home/categories-section.tsx`
- Create: `src/components/home/trust-section.tsx`
- Create: `src/components/watches/watch-card.tsx`

**Step 1: Build WatchCard component**

Create `src/components/watches/watch-card.tsx`:
- Reusable card using ShadCN `card`
- Watch image with `aspect-ratio` (4:5)
- Brand name (uppercase, small, muted)
- Model name (bold)
- Price formatted with commas
- Condition badge using ShadCN `badge`
- Hover effect: subtle scale and shadow
- Link to `/watches/[id]`

**Step 2: Build Hero Section**

Create `src/components/home/hero-section.tsx`:
- Full-width section with large background image (Unsplash luxury watch)
- Overlay with text: "Discover Exceptional Timepieces" headline in Playfair Display
- Subtext: "The world's most trusted luxury watch marketplace"
- Two CTA buttons: "Explore Collection" (primary gold), "Sell Your Watch" (outline)
- Subtle Framer Motion fade-in animation

**Step 3: Build Brand Carousel**

Create `src/components/home/brand-carousel.tsx`:
- Using ShadCN `carousel` with embla
- Horizontal scroll of brand names/logos
- Each brand links to `/collections?brand=xxx`
- Auto-play optional

**Step 4: Build Featured Watches Grid**

Create `src/components/home/featured-watches.tsx`:
- Section heading: "Featured Timepieces"
- 4-column responsive grid (1 col mobile, 2 tablet, 4 desktop)
- 8 featured watches using WatchCard
- "View All" link to `/collections`

**Step 5: Build Categories Section**

Create `src/components/home/categories-section.tsx`:
- Section heading: "Browse by Category"
- 4 category cards in a grid: Dress, Sport, Dive, Chronograph
- Each card: large image, category name overlay, link to `/collections?category=xxx`

**Step 6: Build Trust Section**

Create `src/components/home/trust-section.tsx`:
- 3-column grid with icons (Shield, Truck, RotateCcw from Lucide)
- "Certified Authentic" - Every watch verified
- "Worldwide Shipping" - Insured delivery
- "Easy Returns" - 14-day return policy

**Step 7: Assemble Homepage**

Wire all sections in `src/app/page.tsx`: Hero → Brands → Featured → Categories → Trust

**Step 8: Commit**

```bash
git add -A && git commit -m "feat: build homepage with hero, brands, featured watches, categories, trust"
```

---

## Task 6: Collections Page

**Files:**
- Create: `src/app/collections/page.tsx`
- Create: `src/components/collections/filter-sidebar.tsx`
- Create: `src/components/collections/sort-dropdown.tsx`
- Create: `src/components/collections/active-filters.tsx`
- Create: `src/components/collections/watch-grid.tsx`

**Step 1: Build Filter Sidebar**

Create `src/components/collections/filter-sidebar.tsx`:
- Desktop: left sidebar (280px wide)
- Mobile: ShadCN `sheet` triggered by filter button
- Filter sections using ShadCN `accordion` or collapsible divs:
  - Brand: checkboxes for each brand
  - Price Range: ShadCN `slider` (min/max)
  - Case Size: checkboxes (< 38mm, 38-41mm, 42-44mm, 45mm+)
  - Movement: checkboxes (Automatic, Manual, Quartz)
  - Condition: checkboxes (New, Unworn, Excellent, Good)
  - Category: checkboxes (Dress, Sport, Dive, Chronograph, Pilot)
- Uses URL search params for filter state (functional without backend)

**Step 2: Build Sort Dropdown**

Create `src/components/collections/sort-dropdown.tsx`:
- ShadCN `select` with options: Featured, Price Low-High, Price High-Low, Newest, Brand A-Z

**Step 3: Build Active Filters Bar**

Create `src/components/collections/active-filters.tsx`:
- Row of ShadCN `badge` components showing active filters
- Each badge has an X to remove the filter
- "Clear All" button

**Step 4: Build Watch Grid**

Create `src/components/collections/watch-grid.tsx`:
- Responsive grid using WatchCard
- Shows result count: "Showing 18 watches"
- Grid/list view toggle (optional)

**Step 5: Assemble Collections Page**

Create `src/app/collections/page.tsx`:
- Layout: sidebar left + main content right
- Top bar: result count, sort dropdown, filter toggle (mobile)
- Client component for filter state management using URL search params
- Filter + sort logic operates on the static watch data

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: build collections page with filters, sort, and grid"
```

---

## Task 7: Watch Detail Page

**Files:**
- Create: `src/app/watches/[id]/page.tsx`
- Create: `src/components/watches/image-gallery.tsx`
- Create: `src/components/watches/watch-specs.tsx`
- Create: `src/components/watches/related-watches.tsx`

**Step 1: Build Image Gallery**

Create `src/components/watches/image-gallery.tsx`:
- Main large image (takes ~60% width on desktop)
- Thumbnail strip below (3-4 thumbnails)
- Click thumbnail to swap main image
- Click main image to open ShadCN `dialog` with full-size view
- Smooth transitions with Framer Motion

**Step 2: Build Watch Specs Table**

Create `src/components/watches/watch-specs.tsx`:
- Clean specs table using ShadCN `separator` between rows
- Rows: Movement, Case Material, Case Size, Water Resistance, Dial Color, Bracelet, Power Reserve, Year
- Two-column layout: label (muted) + value

**Step 3: Build Related Watches**

Create `src/components/watches/related-watches.tsx`:
- ShadCN `carousel` with WatchCard components
- Shows 4-6 watches from same brand or category
- "View All" link

**Step 4: Assemble Watch Detail Page**

Create `src/app/watches/[id]/page.tsx`:
- Static generation with `generateStaticParams` from watch data
- Layout: Image gallery left (60%) + info right (40%) on desktop, stacked on mobile
- Breadcrumb: Home > Collections > Brand > Model
- Brand name (uppercase muted), Model name (large serif heading), Reference
- Price (large, bold)
- Two buttons: "Add to Cart" (primary gold), "Add to Wishlist" (outline with heart icon)
- ShadCN `tabs` for: Description | Specifications
- Related watches section at bottom

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: build watch detail page with gallery, specs, related"
```

---

## Task 8: About Page

**Files:**
- Create: `src/app/about/page.tsx`

**Step 1: Build About Page**

Create `src/app/about/page.tsx`:
- Hero section with cinematic watch image and "Our Story" heading
- Brand narrative paragraph (2-3 paragraphs about Kronos)
- Trust pillars section (reuse trust section from homepage or create variant)
- Statistics bar: "10,000+ Watches Sold" | "50+ Brands" | "120+ Countries"
- Framer Motion scroll-triggered animations

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: build about page with story and trust pillars"
```

---

## Task 9: Image Collection via Browser

**Files:**
- Modify: `src/data/watches.ts` (update image URLs)

**Step 1: Browse Unsplash for watch images**

Use Claude-in-Chrome to navigate to unsplash.com and search for luxury watch images. Collect ~60-80 direct image URLs for all 18 watches. Target queries:
- "luxury watch" (general)
- "rolex submariner", "rolex daytona"
- "watch face closeup", "watch on wrist"
- "watch movement mechanism"
- "gold watch", "steel watch", "leather strap watch"

Use the Unsplash source URL format: `https://images.unsplash.com/photo-{ID}?w=800&q=80`

**Step 2: Update watch data with real URLs**

Replace placeholder image URLs in `src/data/watches.ts` with real Unsplash URLs.

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add real Unsplash watch images to all product data"
```

---

## Task 10: Polish, Animations & Responsive

**Files:**
- Modify: Various component files
- Create: `src/components/ui/fade-in.tsx` (Framer Motion wrapper)

**Step 1: Add Framer Motion fade-in wrapper**

Create `src/components/ui/fade-in.tsx`:
- Reusable component that fades in children on scroll
- Uses `useInView` from framer-motion
- Apply to homepage sections, about page sections

**Step 2: Responsive audit**

Test all pages at mobile (375px), tablet (768px), desktop (1280px), wide (1440px):
- Header collapses to hamburger on mobile
- Watch grid adjusts columns
- Filter sidebar becomes sheet on mobile
- Image gallery stacks on mobile
- Typography scales appropriately

**Step 3: Add loading states**

Add ShadCN `skeleton` components for:
- Watch cards while images load
- Watch detail page image loading

**Step 4: Final polish**

- Hover states on all interactive elements
- Focus states for accessibility
- Smooth scroll behavior
- Proper meta tags and page titles

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: add animations, responsive polish, loading states"
```

---

## Task 11: Final Review & Build Verification

**Step 1: Run build**

```bash
npm run build
```
Expected: No build errors, all pages statically generated.

**Step 2: Run dev server and visually verify**

```bash
npm run dev
```
Check all 4 pages in browser. Toggle themes. Test responsive. Verify images load.

**Step 3: Final commit**

```bash
git add -A && git commit -m "chore: final build verification and cleanup"
```
