# Kronos - Luxury Watch Marketplace Design

## Overview
A multi-brand luxury watch marketplace inspired by Chrono24's functionality with Roger Dubuis's luxury aesthetic. Functional-first design with a luxury feel. White/cream base with proper multi-theme support (light/dark/system).

## Stack
- Next.js 15 (App Router)
- ShadCN UI components
- Tailwind CSS v4
- Framer Motion (subtle animations)
- next-themes (multi-theme support: light, dark, system)
- Lucide icons

## Design Language

### Typography
- Headings: serif font (Playfair Display) for luxury feel
- Body: clean sans-serif (Inter) for readability/functionality
- Uppercase tracking for section labels and brand names

### Color System (Multi-theme)
**Light theme (default):**
- Background: white (#FFFFFF) with warm off-white sections (#FAFAF8)
- Text: near-black (#0A0A0A) primary, muted gray (#6B7280) secondary
- Accent: champagne gold (#B8860B) for CTAs and highlights
- Cards: white with subtle border (#E5E5E5)

**Dark theme:**
- Background: rich dark (#09090B) with slightly lighter sections (#18181B)
- Text: off-white (#FAFAFA) primary, muted (#A1A1AA) secondary
- Accent: lighter gold (#D4A847) for CTAs
- Cards: dark (#1C1C1E) with subtle border (#27272A)

### Layout Principles
- Generous whitespace - luxury breathing room
- Max-width 1400px content area
- Large hero imagery (cinematic)
- Grid-based product layouts (responsive: 1/2/3/4 columns)
- Functional search and filtering (Chrono24-style)

## Pages

### 1. Homepage (`/`)
- **Sticky header**: Logo, search bar (prominent), nav links, theme toggle, cart icon
- **Hero section**: Full-width banner with featured watch, tagline, CTA
- **Brand carousel**: Horizontal scroll of brand logos (Rolex, Patek, AP, Omega, Cartier, etc.)
- **Featured watches grid**: 8 watches in a responsive grid with price, brand, model
- **Categories section**: Watch categories (Dress, Sport, Dive, Chronograph)
- **Trust/Why Kronos section**: Authentication guarantee, worldwide shipping, returns
- **Newsletter signup**: Email input with CTA
- **Footer**: Links, social icons, copyright

### 2. Collections Page (`/collections`)
- **Filter sidebar/sheet**: Brand, price range, case size, movement type, condition
- **Sort dropdown**: Price low/high, newest, popular
- **Product grid**: All watches with pagination
- **Active filter badges**: Show applied filters

### 3. Watch Detail Page (`/watches/[id]`)
- **Image gallery**: Main image + 3-4 thumbnails, click to enlarge (dialog)
- **Watch info**: Brand, model, reference, price
- **Specs table**: Movement, case material, case size, water resistance, dial color, bracelet
- **Action buttons**: Add to cart, wishlist, share
- **Related watches**: Horizontal scroll of similar watches

### 4. About Page (`/about`)
- **Hero**: Cinematic watch imagery
- **Our Story**: Brand narrative
- **Trust pillars**: Authentication, insurance, returns
- **Statistics**: Watches sold, brands, countries

## ShadCN Components Needed
- button, card, carousel, dialog, sheet, navigation-menu
- badge, separator, tabs, input, select, slider
- dropdown-menu, scroll-area, skeleton, tooltip, toggle
- avatar (for brand logos), aspect-ratio (for watch images)

## Watch Data (Mock)
15-20 watches across brands:
- Rolex (Submariner, Daytona, GMT-Master II, Datejust)
- Patek Philippe (Nautilus, Calatrava, Aquanaut)
- Audemars Piguet (Royal Oak, Royal Oak Offshore)
- Omega (Speedmaster, Seamaster, Constellation)
- Cartier (Santos, Tank)
- TAG Heuer (Carrera, Monaco)
- IWC (Portugieser, Big Pilot)

Each watch: 3-4 Unsplash images, name, brand, price, specs, description.

## Image Strategy
- Source from Unsplash API (luxury watch photography)
- Use next/image with proper sizing
- Placeholder blur for loading states
- Aspect ratio consistent across grid

## Theme System
- next-themes with ShadCN's built-in dark mode support
- CSS variables for all colors
- Theme toggle in header (sun/moon/system)
- Persistent preference in localStorage
