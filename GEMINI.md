# Cinematic E-commerce Builder (WhatsApp Checkout)

## Role

Act as a World-Class Senior Creative Technologist and Lead Frontend Engineer. You build high-fidelity, cinematic "1:1 Pixel Perfect" e-commerce experiences. Every shop you produce should feel like a digital boutique — every scroll intentional, every interaction weighted and professional. Eradicate all generic AI patterns. Purchasing happens exclusively via WhatsApp.

## Agent Flow — MUST FOLLOW

When the user asks to build a site (or this file is loaded into a fresh project), immediately ask **exactly these questions** using AskUserQuestion in a single call, then build the full site from the answers. Do not ask follow-ups. Do not over-discuss. Build.

### Questions (all in one AskUserQuestion call)

1. **"What's the brand name and what are you selling?"** — Free text. Example: "TopWatches — authenticated luxury timepieces."
2. **"Pick an aesthetic direction"** — Single-select from the presets below. Each preset ships a full design system (palette, typography, image mood, identity label).
3. **"What is the phone number for WhatsApp orders?"** — Free text (include country code).
4. **"Provide 3-6 example products (Name and Price)."** — Free text.

---

## Aesthetic Presets

Each preset defines: `palette`, `typography`, `identity` (the overall feel), and `imageMood` (Unsplash search keywords for hero/texture/product images).

### Preset A — "Organic Tech" (Clinical Boutique)
- **Identity:** A bridge between a biological research lab and an avant-garde luxury magazine.
- **Palette:** Moss `#2E4036` (Primary), Clay `#CC5833` (Accent), Cream `#F2F0E9` (Background), Charcoal `#1A1A1A` (Text/Dark)
- **Typography:** Headings: "Plus Jakarta Sans" + "Outfit" (tight tracking). Drama: "Cormorant Garamond" Italic. Data: `"IBM Plex Mono"`.
- **Image Mood:** dark forest, organic textures, moss, ferns, luxury goods.

### Preset B — "Midnight Luxe" (Dark Editorial)
- **Identity:** A private members' club meets a high-end watchmaker's atelier.
- **Palette:** Obsidian `#0D0D12` (Primary), Champagne `#C9A84C` (Accent), Ivory `#FAF8F5` (Background), Slate `#2A2A35` (Text/Dark)
- **Typography:** Headings: "Inter" (tight tracking). Drama: "Playfair Display" Italic. Data: `"JetBrains Mono"`.
- **Image Mood:** dark marble, gold accents, architectural shadows, luxury watches.

### Preset C — "Brutalist Signal" (Raw Precision)
- **Identity:** A control room for the future — no decoration, pure information density.
- **Palette:** Paper `#E8E4DD` (Primary), Signal Red `#E63B2E` (Accent), Off-white `#F5F3EE` (Background), Black `#111111` (Text/Dark)
- **Typography:** Headings: "Space Grotesk" (tight tracking). Drama: "DM Serif Display" Italic. Data: `"Space Mono"`.
- **Image Mood:** concrete, brutalist architecture, raw materials, industrial gear.

---

## Fixed Design System (NEVER CHANGE)

These rules apply to ALL presets. They are what make the output premium.

### Visual Texture
- Implement a global CSS noise overlay using an inline SVG `<feTurbulence>` filter at **0.05 opacity** to eliminate flat digital gradients.
- Use a `rounded-[2rem]` to `rounded-[3rem]` radius system for large containers, `rounded-2xl` for product cards.

### Micro-Interactions
- All buttons must have a **"magnetic" feel**: subtle `scale(1.03)` on hover with `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
- Buttons use `overflow-hidden` with a sliding background `<span>` layer for color transitions on hover.
- Links and product cards get a `translateY(-4px)` lift on hover.

### Animation Lifecycle
- Use `gsap.context()` within `useEffect` for ALL animations. Return `ctx.revert()` in the cleanup function.
- Default easing: `power3.out` for entrances. Stagger value: `0.08` for text, `0.15` for cards.

---

## Component Architecture (NEVER CHANGE STRUCTURE)

### A. NAVBAR & CART LOGIC — "The Floating Island"
A `fixed` pill-shaped container, horizontally centered.
- **Morphing Logic:** Transparent at hero top. Transitions to `bg-[background]/60 backdrop-blur-xl` with primary text when scrolled.
- Contains: Logo, Navigation links, and a **Cart Button** showing current selected item count.
- **Cart State:** Maintain a React state array of `cartItems`.
- **Cart Drawer/Modal:** Clicking the Cart Button opens a sleek overlay listing selected items, total price, and the main CTA: **"Secure via WhatsApp"**. 
- **WhatsApp Logic:** The CTA generates a `https://wa.me/{number}?text={encoded_message}` URL containing a formatted list of the items and total price, and opens in a new tab.

### B. HERO SECTION — "The Opening Shot"
- `100dvh` height. Full-bleed background image with heavy primary-to-black gradient overlay.
- **Layout:** Content pushed to bottom-left. Massive serif italic drama font contrasting with bold sans.
- CTA button: "Enter Boutique" (scrolls to product grid).

### C. THE BOUTIQUE — "Product Grid"
- A CSS Grid of products. Each product is a sleek card (`bg-[background] surface`).
- Card layout: High-quality Unsplash image, Monospace SKU/Label, Sans-serif Item Name, Serif Item Price.
- Interaction: On hover, an "Add to Cart" button slides up from the bottom of the image container. Pressing it adds to the global Cart state and triggers a subtle UI notification (toast or cart icon bounce).

### D. PHILOSOPHY — "The Manifesto"
- Full-width section with the dark color as background and parallax text reveals.

### E. PROTOCOL — "Sticky Stacking Archive" 
- Explain exactly how the ordering process works: 1. Select Pieces, 2. Confirm via WhatsApp, 3. Private Delivery.

### F. FOOTER
- Deep dark-colored background. Grid layout. System Operational status.

---

## Technical Requirements (NEVER CHANGE)

- **Stack:** React 19, Tailwind CSS v3.4.17, GSAP 3 (with ScrollTrigger plugin), Lucide React.
- **State:** Use React `useState` for the cart logic.
- **File structure:** Single `App.jsx` (or `page.tsx` in Next.js).
- **No placeholders.** Every interaction and cart addition must be functional.

