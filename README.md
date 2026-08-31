# AURA — Modern Fashion E-Commerce Website

> A premium, responsive clothing brand storefront built with semantic HTML5, modular CSS Design Tokens, and vanilla ES6 JavaScript modules.

---

## 🌐 Live Demo & Repository

- 🔗 **Live Website:** [https://sxmxxrth.github.io/Aura-Ecommerce/](https://sxmxxrth.github.io/Aura-Ecommerce/)
- 💻 **GitHub Repository:** [https://github.com/Sxmxxrth/Aura-Ecommerce](https://github.com/Sxmxxrth/Aura-Ecommerce)

---

## 📸 Pages

| Page | Description |
|------|-------------|
| **Home** (`index.html`) | Hero banner with countdown timer, trending products, testimonials, VIP club |
| **Shop** (`shop.html`) | Full catalog with sidebar category filters and live search |
| **Product Details** (`product.html`) | Dynamic product page with image gallery, size/color selectors, reviews |
| **Collections** (`collections.html`) | Curated lookbook cards for Men, Women, and New Arrivals |

---

## ✨ Core Features

- 🎯 **Hero Banner** with promotional offer and live countdown timer
- 🛍️ **Product Listing** with category filters (Women, Men, Accessories)
- 🔍 **Live Search** — instant client-side filtering by name/description
- 🛒 **Add to Cart** — reactive slide-out shopping drawer with badge counter
- ❤️ **Wishlist** — toggle favorites with persistent localStorage
- 📏 **Size & Color Selection** — interactive swatches on product detail page
- ⭐ **Customer Reviews** — view and submit product reviews
- 📧 **Newsletter Subscription** — email signup with validation
- 📱 **Responsive Navigation** — hamburger menu on mobile, sticky on scroll
- 🔗 **Footer** with quick links and customer care

---

## 🏗️ Architecture

```
ecommerce/
├── css/
│   ├── base/
│   │   ├── variables.css          # Design Tokens (Colors, Spacing, Radii)
│   │   └── reset.css              # CSS Reset
│   ├── components/
│   │   ├── navbar.css             # Promo bar, navbar, hamburger menu
│   │   ├── buttons.css            # Reusable button variants
│   │   ├── product-card.css       # Product cards with hover zoom
│   │   ├── cart-drawer.css        # Slide-out cart drawer
│   │   ├── toast.css              # Toast notifications
│   │   └── footer.css             # Newsletter box & footer
│   ├── pages/
│   │   ├── home.css               # Hero banner & testimonials
│   │   ├── shop.css               # Filter sidebar & search
│   │   ├── product.css            # PDP gallery & review form
│   │   └── contact.css            # Contact form & FAQ
│   └── main.css                   # Master import bundle
├── js/
│   ├── config/constants.js        # App configuration & promo codes
│   ├── data/products.data.js      # Product catalog dataset
│   ├── services/
│   │   ├── storage.service.js     # Safe localStorage wrapper
│   │   ├── cart.service.js        # Cart state + Pub/Sub pattern
│   │   └── wishlist.service.js    # Wishlist state + Pub/Sub pattern
│   ├── components/
│   │   ├── navbar.component.js    # Scroll effects, badges, hamburger
│   │   ├── cart-drawer.component.js # Drawer open/close/render
│   │   ├── toast.component.js     # Notification emitter
│   │   └── countdown.component.js # Live countdown timer
│   ├── pages/
│   │   ├── home.page.js           # Home controller
│   │   ├── shop.page.js           # Search & filter controller
│   │   ├── product.page.js        # PDP gallery & swatch controller
│   │   └── contact.page.js        # Contact form controller
│   └── app.js                     # Application bootstrap
├── index.html                     # Home Page
├── shop.html                      # Shop Catalog
├── product.html                   # Product Details (Dynamic)
├── collections.html               # Lookbook Collections
├── about.html                     # About Us
└── contact.html                   # Contact & FAQs
```

---

## 🎨 Design System

All design decisions are centralized in `css/base/variables.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#111111` | Navbar, footer, dark accents |
| `--color-accent` | `#E67E22` | Buttons, highlights, active links |
| `--color-bg-body` | `#F9F9F9` | Page background |
| `--color-warning` | `#F39C12` | Star ratings, countdown, promo |

---

## 🚀 How to Run Locally

ES modules require an HTTP server (they don't work with `file://`). Use any of these:

```bash
# Option 1: Python (pre-installed on macOS/Linux)
cd ecommerce
python3 -m http.server 8000

# Option 2: Node.js
npx serve .

# Option 3: VS Code
# Install "Live Server" extension → Right-click index.html → "Open with Live Server"
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Semantic markup (`<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`) |
| **CSS3** | Custom Properties, Flexbox, Grid, Transitions, `clamp()`, `backdrop-filter` |
| **JavaScript (ES6+)** | Native ES Modules, Classes, `URLSearchParams`, `localStorage`, Pub/Sub |

**Zero dependencies.** No frameworks, no build tools, no npm packages.

---

## 📋 Key Technical Highlights

1. **Reactive Pub/Sub State Management** — `CartService` and `WishlistService` notify all subscribed UI components when state changes, enabling real-time badge updates and drawer re-renders.

2. **URL-Driven Dynamic Routing** — `product.html?id=X` dynamically loads product data using native `URLSearchParams`, powering an infinite catalog from a single template.

3. **CSS Design Token Architecture** — All visual properties are defined as custom properties in `:root`, enabling instant site-wide theming.

4. **Defensive Storage Layer** — `StorageService` wraps `localStorage` in `try/catch` blocks to gracefully handle Private Browsing mode and quota errors.

5. **Mobile-First Responsive** — Hamburger navigation, auto-fitting CSS Grid, and `clamp()` typography adapt seamlessly from 320px to 4K screens.

---

## 👤 Author

**Samarth** — Intern, Clothing Brand Website Project

---

## 📄 License

This project is submitted as part of an internship assignment. All product images are sourced from [Unsplash](https://unsplash.com) (free to use).
