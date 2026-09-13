# AURA Maison — Modern Fashion E-Commerce Website

> A world-class, haute couture clothing brand storefront crafted with semantic HTML5, modular CSS3 Design Tokens, and vanilla ES6 JavaScript modules. Built to meet and exceed all specifications for the **Modern Fashion E-Commerce Website** internship requirements.

---

## 🌐 Deliverables & Live Links

- 🔗 **Live Website:** [https://sxmxxrth.github.io/Aura-Ecommerce/](https://sxmxxrth.github.io/Aura-Ecommerce/)
- 💻 **GitHub Repository:** [https://github.com/Sxmxxrth/Aura-Ecommerce](https://github.com/Sxmxxrth/Aura-Ecommerce)
- 📄 **Documentation:** Included in this comprehensive specification and architectural breakdown below.
- 📦 **Source Code:** 100% pure vanilla stack (Zero external frameworks, Zero npm dependencies, 100% native performance).

---

## 📸 Complete Page Manifest (6 Pages)

| # | Page | File | Description & Highlights |
|---|------|------|--------------------------|
| 1 | **Home** | `index.html` | Grand hero banner with promo countdown timer, curated creations grid, editorial press quotes, patron testimonials, and VIP Atelier Gazette subscription. |
| 2 | **Shop** | `shop.html` | Full catalog with real-time keyword search, capsule category filter pills (All, New Arrivals, Women, Men, Accessories), price/name sorting, and compact/large grid toggle. |
| 3 | **Product Details** | `product.html` | Dynamic PDP driven by URL parameters (`?id=`), multi-angle gallery with optical zoom preview, interactive colorway swatches, size selector with size guide modal, stock scarcity indicator, customer reviews with submission form, and mobile sticky buy bar. |
| 4 | **Collections** | `collections.html` | Curated editorial portals for **Women's Minimalist Elegance**, **Men's Modern Sartorial**, and **New Arrivals (Autumn / Winter Drop)** linking directly to filtered shop views. |
| 5 | **About Us** | `about.html` | Atelier heritage narrative, the Four Craftsmanship Pillars (Virgin Material Purity, Master Hand-Tailoring, Conscious Deceleration, Lifetime Promise), interactive stats strip, and creative director manifesto. |
| 6 | **Contact** | `contact.html` | Dedicated Client Concierge portal featuring interactive inquiry form (fittings, bespoke sizing, courier support), global salon addresses (Paris, Milan, Mumbai, New York), direct telephone/WhatsApp lines, and FAQ accordion. |

---

## ✨ Core Features Checklist

| Feature | Status | Implementation Details |
|---------|--------|------------------------|
| **Hero Banner with Promo Offer** | ✅ Complete | Dynamic announcement bar with promo code `ATELIER20`, hero countdown clock with live milliseconds/seconds ticker, and CTA buttons. |
| **Product Listing & Filters** | ✅ Complete | Category filter tabs (`all`, `new-arrivals`, `women`, `men`, `accessories`), sorting by price asc/desc & name, and result counters. |
| **Product Detail Page (PDP)** | ✅ Complete | Dynamic product loading (`?id=`), breadcrumb navigation, multi-angle thumbnails, specifications accordion, related cross-sells. |
| **Search Functionality** | ✅ Complete | Multi-modal: inline catalog search box on `shop.html` + global instant keyboard shortcut search modal (`/` or `Cmd+K`) across all pages. |
| **Add to Cart (Frontend Only)** | ✅ Complete | Slide-out reactive cart drawer, item quantity increment/decrement, size & colorway tracking, free courier meter (`₹5,000` threshold), and `ATELIER20` promo engine. |
| **Wishlist Button (Frontend Only)** | ✅ Complete | Heart icon toggle on all cards, persistent `localStorage` synchronization, and slide-out Wishlist Drawer with "Move to Bag" support. |
| **Size & Color Selection** | ✅ Complete | Interactive color swatches with visual active halos + XS to XL size buttons with an accessible modal size & fit guide. |
| **Customer Reviews Section** | ✅ Complete | Verified patron star ratings, editorial reviews, and interactive "Submit Patron Review" form with live DOM injection. |
| **Newsletter Subscription** | ✅ Complete | VIP Atelier Gazette subscription form with email validation and welcome toast. |
| **Responsive Navigation** | ✅ Complete | Sleek mobile slide-in menu, backdrop blur, hamburger toggle, and sticky glassmorphic navbar. |
| **Footer with Quick Links** | ✅ Complete | Multi-column luxury footer linking to all 6 pages, size guides, client care, and brand philosophy. |

---

## 🎨 UI & UX Craftsmanship

- **Haute Couture Minimalist Aesthetic**: Obsidian Black (`#0F1014`), Brushed Champagne Gold (`#B08D57`), Warm Alabaster Silk (`#F7F3EC`), and Museum Ivory Canvas (`#FAF8F5`).
- **Typography Pairing**: *Cormorant Garamond* (editorial serif for titles and luxury impact) paired with *Montserrat* (clean, geometric sans-serif for legibility).
- **Desktop Luxury Magnetic Cursor**: Smooth trailing ring and dot with hover scaling across interactive elements.
- **Hover Micro-Interactions**: Smooth 2nd-angle image reveals on product cards, floating "Quick View" action buttons, and elevation transitions.
- **Mobile Responsive Perfection**: Zero horizontal overflow down to 320px screen width. Optimized touch targets, sticky mobile buy bar on PDP, and fluid typography via `clamp()`.
- **Currency Standardization**: Exclusively formatted in Indian Rupees (`₹`) with localized formatting (`₹9,999`).

---

## 🏗️ Technical Architecture

```
ecommerce/
├── index.html                     # 1. Home Page
├── shop.html                      # 2. Shop Catalog & Filters
├── product.html                   # 3. Product Details Page (Dynamic)
├── collections.html               # 4. Curated Collections (Men, Women, New Arrivals)
├── about.html                     # 5. About Us & Atelier Philosophy
├── contact.html                   # 6. Contact & Client Concierge
├── assets/
│   └── images/                    # High-resolution optimized editorial photography
├── css/
│   ├── base/
│   │   ├── variables.css          # Centralized Design Tokens (colors, fonts, radii, spacing)
│   │   └── reset.css              # Box sizing, typography resets, overflow-x guards
│   ├── components/
│   │   ├── navbar.css             # Glassmorphic header, promo ticker, mobile hamburger
│   │   ├── buttons.css            # Luxury button variants (primary, secondary, outline)
│   │   ├── product-card.css       # Editorial card, hover angle swap, floating quick view
│   │   ├── cart-drawer.css        # Slide-out bag, shipping meter, promo badge
│   │   ├── wishlist-drawer.css    # Slide-out wishlist drawer
│   │   ├── search-modal.css       # Live instant search overlay
│   │   ├── quick-view.css         # Quick view modal with size/color swatches
│   │   ├── modal.css              # Size & fit guide modal
│   │   ├── cursor.css             # Desktop magnetic cursor follower
│   │   ├── toast.css              # Micro-feedback toast system
│   │   ├── marquee.css            # Infinite luxury runway ticker
│   │   └── footer.css             # Multi-column footer & newsletter
│   ├── pages/
│   │   ├── home.css               # Hero timer, runway sections, testimonials
│   │   ├── shop.css               # Layout grid, sidebar filters, chip pills
│   │   ├── product.css            # PDP gallery, optical zoom, color swatches, sticky bar
│   │   ├── collections.css        # Editorial lookbook portals
│   │   ├── about.css              # Story grid, pillars, stats, manifesto
│   │   └── contact.css            # Concierge form, salon flagships, FAQ accordion
│   └── main.css                   # Single-entry master CSS import bundle
└── js/
    ├── config/
    │   └── constants.js           # App configuration, shipping thresholds, promo codes
    ├── data/
    │   └── products.data.js       # Master catalog with prices, categories, colors, isNew
    ├── services/
    │   ├── storage.service.js     # Safe localStorage abstraction
    │   ├── currency.service.js    # Strict INR currency formatter (₹)
    │   ├── cart.service.js        # Cart state, promo codes, Pub/Sub observer
    │   └── wishlist.service.js    # Wishlist state, ID persistence, Pub/Sub observer
    ├── components/
    │   ├── navbar.component.js    # Scroll listener & mobile menu toggle
    │   ├── cart-drawer.component.js # Dynamic bag rendering & promo breakdown
    │   ├── wishlist-drawer.component.js # Saved items & "Move to Bag"
    │   ├── search-modal.component.js # Keyboard shortcuts & live search query
    │   ├── quick-view.component.js # Rapid product inspect & bag addition
    │   ├── size-modal.component.js # Interactive measurements table
    │   ├── countdown.component.js # High-precision promotional timer
    │   ├── scroll-reveal.component.js # IntersectionObserver animations
    │   └── toast.component.js     # Toast notifications
    ├── pages/
    │   ├── home.page.js           # Home cards hydration
    │   ├── shop.page.js           # Filter, sort, and search controller
    │   └── product.page.js        # PDP gallery, color swatches, reviews
    └── app.js                     # Master bootstrap & window.__aura bridge
```

---

## 🚀 Local Run Guide

1. Clone or download the repository:
   ```bash
   git clone https://github.com/Sxmxxrth/Aura-Ecommerce.git
   cd Aura-Ecommerce
   ```

2. Start any local static file server (Python 3 recommended):
   ```bash
   python3 -m http.server 8000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

---

## 💎 Test Credentials & Privilege Codes

- **Promo Code:** `ATELIER20` (Unlocks 20% discount on entire cart).
- **Complimentary Delivery:** Unlocked automatically when bag subtotal exceeds `₹5,000`.

---

© 2026 AURA Maison de Couture. Designed for the Modern Fashion E-Commerce Internship Project.
