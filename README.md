# Modern Fashion E-Commerce Website — AURA Clothing Brand

> **Internship Assignment Submission**  
> **Role:** Frontend Web Development Intern  
> **Project Title:** Modern Fashion E-commerce Website  
> **Objective:** Build a premium clothing brand website with a strong focus on product presentation, modern UI, and shopping experience.

---

## 🌐 Project Deliverables & Repository Links

- 🔗 **GitHub Repository:** [https://github.com/Sxmxxrth/Aura-Ecommerce](https://github.com/Sxmxxrth/Aura-Ecommerce)
- 🌐 **Live Website:** [https://sxmxxrth.github.io/Aura-Ecommerce/](https://sxmxxrth.github.io/Aura-Ecommerce/)
- 📄 **Documentation:** Complete technical specification and feature guide provided below.
- 📦 **Source Code:** 100% Pure Vanilla Web Stack (Semantic HTML5, Clean Modular CSS3, Vanilla ES6 JavaScript). Zero third-party runtime frameworks or build dependencies.

---

## 📁 Professional Project File Structure

```
ecommerce/
├── index.html                  # 1. Home Page
├── shop.html                   # 2. Shop Catalog & Filtering Page
├── product.html                # 3. Product Details Page (Dynamic via ?id=)
├── collections.html            # 4. Curated Collections Page
├── about.html                  # 5. About Us & Brand Philosophy Page
├── contact.html                # 6. Contact & Customer Support Page
├── README.md                   # Complete Project Documentation & Assignment Report
├── css/
│   ├── style.css               # Clean, comprehensive master stylesheet
│   └── main.css                # Import forwarder for style.css
├── js/
│   ├── products.js             # Product catalog data array (clean, beginner-friendly)
│   └── main.js                 # Complete frontend application logic (Cart, Wishlist, PDP, Modals)
└── assets/
    └── images/
        ├── hero-banner.jpg     # Hero banner background
        ├── collections/        # Curated collection imagery (women, men, new-arrivals)
        └── products/           # Multi-angle garment photography (trench, blazer, silk, knit, etc.)
```

---

## 📄 Pages Manifest (All 6 Pages Included)

| # | Page Name | File Path | Key Features & Implementation |
|---|-----------|-----------|-------------------------------|
| 1 | **Home** | `index.html` | Top announcement bar, sticky navigation, hero banner with promotional offer, 48-hour promotional countdown timer, trust badges, infinite scrolling marquee, featured products grid, customer testimonials, and newsletter subscription form. |
| 2 | **Shop** | `shop.html` | Full 6-item product catalog with live search input, category filter buttons (**All**, **New Arrivals**, **Women**, **Men**, **Accessories**), sort dropdown (Featured, Price: Low to High, Price: High to Low, Name: A to Z), grid density toggle (compact/normal), and real-time counter. |
| 3 | **Product Details** | `product.html` | Dynamically loads garment details via URL parameter (`?id=1` to `?id=6`), breadcrumb trail, multi-angle thumbnail gallery, interactive color swatches, size selection buttons with size guide modal trigger, stock indicator, accordion specifications, related products, verified patron reviews, interactive review submission form, and mobile sticky purchase bar. |
| 4 | **Collections** | `collections.html` | Themed editorial portals for **Women's Minimalist Elegance**, **Men's Modern Sartorial**, and **New Arrivals (Autumn / Winter Drop)** with direct links to filtered shop views. |
| 5 | **About Us** | `about.html` | Brand origin story, 4 core craftsmanship pillars (Material Purity, Master Tailoring, Conscious Deceleration, Lifetime Guarantee), and sustainable atelier metrics. |
| 6 | **Contact** | `contact.html` | Client concierge inquiry form with validation and live toast confirmation, global flagship salon addresses (Paris, Mumbai, New York), direct support lines, and an interactive FAQ accordion. |

---

## ✅ Core Features Checklist

| # | Feature Requirement | Status | Technical Implementation |
|---|---------------------|--------|--------------------------|
| 1 | **Hero Banner with Promo Offer** | ✅ Complete | Banner with seasonal headline, call-to-action buttons, trust indicators, and a live 48-hour countdown timer (`#cd-days`, `#cd-hours`, `#cd-mins`, `#cd-secs`). |
| 2 | **Product Listing with Category Filters** | ✅ Complete | Interactive category filtering (**All**, **New Arrivals**, **Women**, **Men**, **Accessories**), dynamic URL parameter detection (`?category=women`), and sort options. |
| 3 | **Product Detail Page (PDP)** | ✅ Complete | Dynamic loading based on `?id=`, interactive thumbnail image switcher, color swatch picker, size selector, and related cross-sell items. |
| 4 | **Search Functionality (Frontend)** | ✅ Complete | Dual-mode search: inline catalog search filter on `shop.html` + global instant keyboard shortcut search modal (`/` or `Cmd+K`) across all pages. |
| 5 | **Add to Cart (Frontend Only)** | ✅ Complete | Slide-out cart drawer with item count badge, quantity increment/decrement, remove button, `localStorage` persistence, free shipping progress bar (`₹5,000` threshold), and promo discount code engine (`SAVE20` / `ATELIER20` for 20% off). |
| 6 | **Wishlist Button (Frontend Only)** | ✅ Complete | Heart toggle button on all product cards and PDP, persistent `localStorage` synchronization, count badge, slide-out Wishlist Drawer, and "Move to Bag" button. |
| 7 | **Size and Color Selection** | ✅ Complete | Interactive color swatches with active ring highlights and size buttons (XS to XL) available on both PDP and the Quick View modal. |
| 8 | **Customer Reviews Section** | ✅ Complete | Star rating breakdown, verified patron reviews list, and a working submission form (`submitReview`) that dynamically prepends new reviews to the list with toast feedback. |
| 9 | **Newsletter Subscription** | ✅ Complete | Email input form with format validation, promo code confirmation, and auto-dismissing toast notifications. |
| 10 | **Responsive Navigation** | ✅ Complete | Desktop horizontal navigation bar and mobile hamburger toggle menu with smooth slide-in navigation drawer and backdrop. |
| 11 | **Footer with Quick Links** | ✅ Complete | 3-column structured footer with links to all 6 pages, client care services, size guide modal trigger, social badges, and copyright statement. |

---

## 🎨 UI Design & Styling Details

- **Minimalist Fashion Palette:** Clean obsidian black (`#0F1014`), brushed gold/bronze (`#B08D57`), museum warm ivory (`#FAF8F5`), and gallery white (`#FFFFFF`).
- **Typography Pairing:** Classic serif *Cormorant Garamond* for titles and editorial elegance, paired with geometric sans-serif *Montserrat* for readable body text.
- **Native Browser Cursor:** Standard, clean, and responsive browser cursor everywhere (custom lagging magnetic cursor removed to ensure natural accessibility and zero mouse latency).
- **Product Card Hover Effects:** Secondary angle dissolve effect on hover, smooth card elevation, and quick-action overlay buttons.
- **Mobile Responsive:** 100% responsive across desktop, tablet, and mobile devices (tested down to 320px width) with zero horizontal overflow.
- **Currency:** Standardized in Indian Rupees (`₹`) formatted with `toLocaleString("en-IN")`.

---

## 🛠️ Technologies & Code Simplicity

- **HTML5:** Clean, semantic structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`) with proper ARIA accessibility attributes.
- **CSS3:** Built using CSS variables (Design Tokens), Flexbox, and CSS Grid layouts. No complex CSS frameworks needed.
- **JavaScript (Vanilla ES6):** 
  - Written in a clear, beginner-friendly, and well-commented style that is easy to understand and explain during an assignment evaluation.
  - Avoids over-engineered abstractions, external build tools, or CORS-prone module imports.
  - Can be run directly by opening any HTML file in a web browser (`file:///...`) or via any local web server.

---

## 🚀 How to Run the Website Locally

### Method 1: Direct File Opening (Simplest)
1. Clone or download this repository:
   ```bash
   git clone https://github.com/Sxmxxrth/Aura-Ecommerce.git
   cd Aura-Ecommerce
   ```
2. Double-click `index.html` to open it directly in Google Chrome, Safari, Firefox, or Microsoft Edge.
3. Everything (products, cart, wishlist, search, modals, reviews) works 100% out of the box!

### Method 2: Local HTTP Server (Optional)
If you prefer running a local server:
- **Using Python 3:**
  ```bash
  python3 -m http.server 8000
  ```
  Open `http://localhost:8000` in your browser.
- **Using VS Code:** Install the "Live Server" extension, right-click `index.html`, and select "Open with Live Server".

---

## 🏷️ Test Coupons & Promo Codes
- Code: `SAVE20` — Gives 20% discount on entire cart.
- Code: `ATELIER20` — Gives 20% discount on entire cart.
- Free shipping automatically applies on orders over `₹5,000`.

---

## 👨‍💻 Author & Submission Note
This project was developed as an internship assignment fulfilling all requirements for the **Modern Fashion E-commerce Website** brief.
