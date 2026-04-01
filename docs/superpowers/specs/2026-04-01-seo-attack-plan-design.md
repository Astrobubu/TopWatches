# Golden Planet Watches - SEO Attack Plan Design Spec

**Date:** 2026-04-01
**Domain:** goldenplanetwatches.com
**Stack:** Next.js 16, React 19, Supabase, Tailwind 4, shadcn/ui
**Target Market:** Dubai, UAE (11 specific areas)

---

## 1. WhatsApp Floating Button

**Component:** `src/components/whatsapp-button.tsx`
**Placement:** Fixed bottom-left, z-50, visible on all pages
**Behavior:**
- Green (#25D366) circular button, 56px desktop / 48px mobile
- WhatsApp icon (Lucide or inline SVG)
- Pulse animation on first load (CSS keyframes, plays once)
- Click opens `https://wa.me/[SHOP_PHONE]?text=Hi%2C%20I'm%20interested%20in%20your%20luxury%20watches`
- Phone number sourced from existing `SHOP_PHONE` constant in `whatsapp-order.tsx`
- Theme-independent: always green regardless of active theme
- Does not overlap with scroll-to-top button (that's bottom-right)

**Integration:** Add to root `layout.tsx` alongside existing providers.

---

## 2. Blog System (Supabase CMS)

### 2.1 Database Schema

**Table: `blog_posts`**

```sql
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  cover_image TEXT,
  category TEXT NOT NULL DEFAULT 'news',
  tags TEXT[] DEFAULT '{}',
  author TEXT NOT NULL DEFAULT 'Golden Planet Watches',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  seo_title TEXT,
  seo_description TEXT,
  reading_time INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
```

**Categories:** guides, news, brand-spotlight, buying-tips, market-insights
**RLS:** Public read for published posts. Service role for write operations.

### 2.2 Public Pages

**`/blog` - Blog Listing**
- Grid of blog post cards (cover image, title, excerpt, date, category, reading time)
- Category filter tabs at top
- Pagination (12 posts per page)
- Featured posts pinned at top
- SEO: "Luxury Watch Blog | Golden Planet Watches Dubai"

**`/blog/[slug]` - Individual Post**
- Cover image hero
- Title, author, date, reading time, category badge
- Table of contents (auto-generated from H2/H3 headings)
- Rich HTML content with proper heading hierarchy
- Related posts section (same category, max 3)
- Share buttons (WhatsApp, X/Twitter, copy link)
- WhatsApp CTA at bottom: "Have questions? Chat with us"
- Breadcrumbs: Home > Blog > [Category] > [Post Title]
- JSON-LD: Article schema with author, datePublished, publisher
- Canonical URL: `https://goldenplanetwatches.com/blog/[slug]`

**`/guides` - Guides Hub**
- Curated grid of guide-category posts
- Organized by topic (Rolex Guides, Buying Guides, Watch Care, etc.)
- SEO: "Luxury Watch Guides | Golden Planet Watches Dubai"

### 2.3 Admin Pages

**`/manage/blog` - Blog Management**
- Table listing all posts (title, status, category, date, actions)
- Status filter (All / Draft / Published)
- Quick actions: edit, delete, toggle publish

**`/manage/blog/new` and `/manage/blog/[id]/edit` - Blog Editor**
- Rich text editor (TipTap)
  - Headings (H2, H3, H4)
  - Bold, italic, underline, strikethrough
  - Links, images (upload to Supabase Storage)
  - Ordered/unordered lists
  - Blockquotes, code blocks
  - Tables
- Sidebar fields: title, slug (auto-generated from title), excerpt, category, tags, cover image, SEO title, SEO description, status, featured toggle
- Preview button (opens post in new tab as it would appear)
- Auto-save drafts
- Reading time auto-calculated from content length

### 2.4 Data Layer

**`src/lib/blog.ts`** - Blog CRUD operations:
- `getBlogPosts(options)` - List with filtering, pagination, category
- `getBlogPost(slug)` - Single post by slug
- `createBlogPost(data)` - Create new post
- `updateBlogPost(id, data)` - Update existing post
- `deleteBlogPost(id)` - Delete post
- `getRelatedPosts(postId, category)` - Related posts for sidebar

**Caching:** ISR with 60s revalidation on listing, 300s on individual posts.

---

## 3. Location Pages (Local SEO)

### 3.1 Database Schema

**Table: `location_pages`**

```sql
CREATE TABLE location_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  area_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  hero_image TEXT,
  intro_text TEXT NOT NULL,
  why_buy_here TEXT NOT NULL,
  landmarks JSONB DEFAULT '[]',
  faqs JSONB DEFAULT '[]',
  map_embed TEXT,
  nearby_areas TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**landmarks JSONB format:**
```json
[
  { "name": "Dubai Mall", "description": "Home to one of the largest watch retail spaces...", "image": "url" },
  { "name": "Burj Khalifa", "description": "...", "image": "url" }
]
```

**faqs JSONB format:**
```json
[
  { "question": "Where can I buy authentic Rolex in Downtown Dubai?", "answer": "..." },
  { "question": "Is it safe to buy pre-owned watches in Dubai?", "answer": "..." }
]
```

### 3.2 Target Areas (11 Pages)

| Area | Slug | Key Landmarks |
|------|------|--------------|
| Deira | deira | Gold Souk, Deira City Centre, Spice Souk |
| Downtown Dubai | downtown-dubai | Dubai Mall, Burj Khalifa, Dubai Fountain |
| Jumeirah | jumeirah | Jumeirah Beach, Madinat Jumeirah, Burj Al Arab |
| Palm Jumeirah | palm-jumeirah | Atlantis, The Pointe, Nakheel Mall |
| Dubai Marina | dubai-marina | Marina Mall, JBR Walk, Ain Dubai |
| JBR | jbr | The Walk, Bluewaters Island, Ain Dubai |
| Business Bay | business-bay | Bay Avenue, Executive Towers, Dubai Canal |
| DIFC | difc | Gate Village, DIFC Mall, Art Galleries |
| Al Barsha | al-barsha | Mall of the Emirates, Al Barsha Pond Park |
| Bur Dubai | bur-dubai | Dubai Museum, Al Fahidi, Textile Souk |
| Karama | karama | Karama Market, Karama Centre |

### 3.3 Page Structure

**URL:** `/luxury-watches-in-[slug]`

**Layout (1500-2000 words):**
1. **Hero** - Area photo background, H1: "Luxury Watches in [Area], Dubai", breadcrumb
2. **Introduction** (200-300 words) - Why this area is significant for luxury watch buyers
3. **Why Buy Here** (300-400 words) - Area-specific reasons (proximity to luxury malls, tourist hub, etc.)
4. **Local Landmarks** - Carousel/grid of 3-5 landmarks with relevance to luxury lifestyle
5. **Featured Watches** - Dynamic section pulling 4-6 watches from main DB, with "View All" link to /collections
6. **Customer Testimonials** - Google reviews (existing integration), or area-specific quotes
7. **FAQ Accordion** (5-8 questions) - Locally relevant, keyword-rich Q&A
8. **Google Map Embed** - Showing the area with pin for Golden Planet Watches
9. **Internal Links** - Related areas, relevant blog posts, guides
10. **WhatsApp CTA** - "Chat with our specialist about watches in [Area]"

**SEO per page:**
- Title: "Buy Luxury Watches in [Area], Dubai | Golden Planet Watches"
- Meta: "Explore authentic pre-owned & new luxury watches in [Area], Dubai. Rolex, Patek Philippe, AP & more. Free delivery. WhatsApp us today."
- JSON-LD: LocalBusiness + Product schema
- Canonical: `https://goldenplanetwatches.com/luxury-watches-in-[slug]`
- FAQ schema for the accordion

### 3.4 Internal Linking Strategy

Every location page links to:
- 2-3 nearby area pages ("Also serving nearby: [Area 1], [Area 2]")
- 2-3 relevant blog posts
- The guides hub
- Brand collection pages
- /collections with area-specific pre-filter

---

## 4. Guide Pages (Initial Content)

These are blog posts with `category: "guides"`, featured on `/guides`:

| Guide | Slug | Target Keywords |
|-------|------|----------------|
| Rolex Reference Numbers Explained | rolex-reference-numbers | rolex reference number meaning, rolex model numbers |
| Rolex Serial Numbers: Complete Guide | rolex-serial-numbers | rolex serial number lookup, rolex serial number check |
| Watch Warranty Guide | watch-warranties | luxury watch warranty, rolex warranty dubai |
| Sell Your Watch | sell-your-watch | sell rolex dubai, sell luxury watch dubai |
| How to Spot a Fake Rolex | spot-fake-rolex | fake rolex vs real, authenticate rolex dubai |
| Best Luxury Watches Under AED 50K | best-watches-under-50k | affordable luxury watches dubai |
| Investment Watches 2026 | investment-watches-2026 | best watches to invest in, rolex investment |

**`/sell-your-watch`** gets its own standalone route (not under /blog) with a WhatsApp CTA form for selling.

---

## 5. Technical SEO Infrastructure

### 5.1 Files to Create

**`public/robots.txt`**
```
User-agent: *
Allow: /
Disallow: /manage/
Disallow: /api/

Sitemap: https://goldenplanetwatches.com/sitemap.xml
```

**`public/llms.txt`**
```
# Golden Planet Watches
# Luxury watch marketplace in Dubai, UAE

> Golden Planet Watches is a luxury watch dealer established in 2010, offering authenticated pre-owned and new timepieces from brands including Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, TAG Heuer, and IWC.

## Pages
- /: Homepage with featured watches and brand catalog
- /collections: Full watch catalog with filters
- /blog: Luxury watch articles, guides, and market insights
- /guides: Educational watch guides
- /about: About Golden Planet Watches
- /condition-guide: Watch condition grading system
- /luxury-watches-in-*: Location-specific pages for Dubai areas
```

**`src/app/sitemap.ts`** - Dynamic sitemap generation
- All static pages
- All watch detail pages (`/watches/[id]`)
- All blog posts (`/blog/[slug]`)
- All location pages (`/luxury-watches-in-[slug]`)
- Proper lastmod, changefreq, priority values

### 5.2 Schema Markup (JSON-LD)

**Every page:** Organization schema in layout
**Homepage:** WebSite + LocalBusiness + ItemList (featured watches)
**Watch pages:** Product schema (name, brand, price, condition, image, availability)
**Blog posts:** Article schema (headline, author, datePublished, publisher, image)
**Location pages:** LocalBusiness + Place + FAQPage schema
**Guides hub:** CollectionPage schema

### 5.3 Meta Tags

Every page gets:
- `<title>` - Unique, keyword-rich, under 60 chars
- `<meta name="description">` - Unique, compelling, under 160 chars
- `<link rel="canonical">` - Self-referencing canonical
- Open Graph: og:title, og:description, og:image, og:url, og:type
- Twitter Card: twitter:card, twitter:title, twitter:description, twitter:image
- `<meta name="robots" content="index, follow">`

### 5.4 Breadcrumbs

All pages get breadcrumb navigation + BreadcrumbList JSON-LD:
- Home > Collections > [Watch Brand] > [Watch Model]
- Home > Blog > [Category] > [Post Title]
- Home > Luxury Watches in [Area]
- Home > Guides > [Guide Title]

---

## 6. Component Architecture

### New Components
- `src/components/whatsapp-button.tsx` - Floating WhatsApp button
- `src/components/blog/blog-card.tsx` - Blog post card for listings
- `src/components/blog/blog-content.tsx` - Rich content renderer
- `src/components/blog/table-of-contents.tsx` - Auto-generated TOC
- `src/components/blog/share-buttons.tsx` - Social share buttons
- `src/components/blog/related-posts.tsx` - Related posts section
- `src/components/blog/blog-editor.tsx` - TipTap rich text editor (admin)
- `src/components/location/location-hero.tsx` - Location page hero
- `src/components/location/landmarks-section.tsx` - Landmarks carousel
- `src/components/location/faq-accordion.tsx` - FAQ with schema
- `src/components/seo/json-ld.tsx` - Reusable JSON-LD component
- `src/components/seo/breadcrumbs.tsx` - Breadcrumb navigation

### New Pages
- `src/app/blog/page.tsx` - Blog listing
- `src/app/blog/[slug]/page.tsx` - Blog post detail
- `src/app/guides/page.tsx` - Guides hub
- `src/app/sell-your-watch/page.tsx` - Sell your watch page
- `src/app/luxury-watches-in-[slug]/page.tsx` - Location pages (dynamic)
- `src/app/manage/blog/page.tsx` - Blog admin listing
- `src/app/manage/blog/new/page.tsx` - New blog post editor
- `src/app/manage/blog/[id]/edit/page.tsx` - Edit blog post
- `src/app/sitemap.ts` - Dynamic sitemap
- `src/app/robots.ts` - Dynamic robots.txt (or static in public/)

### New Lib Files
- `src/lib/blog.ts` - Blog CRUD operations
- `src/lib/locations.ts` - Location page operations
- `src/lib/seo.ts` - SEO helpers (generate metadata, schema, etc.)

---

## 7. Implementation Phases

**Phase 1:** WhatsApp button + robots.txt + llms.txt + sitemap + JSON-LD schemas (quick wins)
**Phase 2:** Blog system (database + data layer + public pages + admin)
**Phase 3:** Location pages (database + content generation + pages)
**Phase 4:** Guide content creation (write the actual guide posts)
**Phase 5:** Technical SEO fixes from audit results + internal linking web

---

## 8. Dependencies

- **TipTap** (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-*`) - Rich text editor
- No other new dependencies needed. Everything else uses existing stack (shadcn/ui, Supabase, Tailwind, Lucide).

---

## 9. Non-Goals (Explicitly Out of Scope)

- Payment processing / e-commerce checkout (WhatsApp remains the transaction channel)
- User authentication / accounts for blog commenting
- Multi-language blog content (UI chrome is translated, content is English-only initially)
- Email newsletter integration with blog (existing newsletter form stays as-is)
- Blog post scheduling (publish now or save as draft, no future scheduling)
- Blog analytics dashboard (use Vercel Analytics or Google Analytics externally)
