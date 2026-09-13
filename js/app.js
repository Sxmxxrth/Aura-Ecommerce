/*
  =============================================
  APPLICATION BOOTSTRAP (app.js)
  
  Master entry point connecting services, components, and controllers.
  =============================================
*/

import { PRODUCTS_DATA } from "./data/products.data.js";
import { cartService } from "./services/cart.service.js";
import { wishlistService } from "./services/wishlist.service.js";
import { currencyService } from "./services/currency.service.js";
import { NavbarComponent } from "./components/navbar.component.js";
import { CartDrawerComponent } from "./components/cart-drawer.component.js";
import { CountdownComponent } from "./components/countdown.component.js";
import { ToastComponent } from "./components/toast.component.js";
import { SizeModalComponent } from "./components/size-modal.component.js";
import { ScrollRevealComponent } from "./components/scroll-reveal.component.js";
import { QuickViewComponent } from "./components/quick-view.component.js";
import { SearchModalComponent } from "./components/search-modal.component.js";
import { WishlistDrawerComponent } from "./components/wishlist-drawer.component.js";
import { HomePage } from "./pages/home.page.js";
import { ShopPage } from "./pages/shop.page.js";
import { ProductPage } from "./pages/product.page.js";

// Global bridge for declarative onclick handlers
window.__aura = {
  addToCart: (id, size = "M") => {
    const prod = PRODUCTS_DATA.find(p => p.id === Number(id));
    if (prod) {
      cartService.addItem(prod, 1, size);
      ToastComponent.show(`Added "${prod.name}" to your bag.`);
      CartDrawerComponent.open();
    }
  },
  removeFromCart: (index) => {
    cartService.removeItem(index);
    ToastComponent.show("Item removed from your bag.");
  },
  adjustQty: (index, delta) => {
    cartService.adjustQuantity(index, delta);
  },
  openCart: () => CartDrawerComponent.open(),
  closeCart: () => CartDrawerComponent.close(),
  applyPromo: () => {
    const input = document.getElementById("cart-promo-input");
    const code = input ? input.value : "";
    const res = cartService.applyPromo(code);
    ToastComponent.show(res.message);
  },
  removePromo: () => {
    cartService.removePromo();
    ToastComponent.show("Privilege code removed.");
  },
  toggleMobileMenu: () => NavbarComponent.toggleMobileMenu(),
  closeMobileMenu: () => NavbarComponent.closeMobileMenu(),
  openSizeGuide: () => SizeModalComponent.open(),
  closeSizeGuide: () => SizeModalComponent.close(),
  openQuickView: (id) => QuickViewComponent.open(id),
  closeQuickView: () => QuickViewComponent.close(),
  selectQuickViewSize: (size, el) => QuickViewComponent.selectSize(size, el),
  addQuickViewToBag: () => QuickViewComponent.addToBag(),
  openSearch: () => SearchModalComponent.open(),
  closeSearch: () => SearchModalComponent.close(),
  openWishlist: () => WishlistDrawerComponent.open(),
  closeWishlist: () => WishlistDrawerComponent.close(),
  moveWishlistToCart: (id) => WishlistDrawerComponent.moveToCart(id),
  checkout: () => {
    const state = cartService.getState();
    if (state.items.length === 0) {
      ToastComponent.show("Your shopping bag is empty.");
      return;
    }
    const discountInfo = state.isPromoApplied ? `\nAtelier Privilege (${state.discountPercent}% off): -${currencyService.format(state.discountAmount)}` : "";
    alert(`Thank you for acquiring from AURA Maison.\n\nAtelier Order Confirmed!\nSubtotal: ${currencyService.format(state.subtotal)}${discountInfo}\nGrand Total: ${currencyService.format(state.finalTotal)}\n\nComplimentary insured courier delivery has been initiated.`);
    cartService.clear();
    CartDrawerComponent.close();
  },
  toggleWishlist: (id) => {
    const isSaved = wishlistService.toggle(id);
    const prod = PRODUCTS_DATA.find(p => p.id === Number(id));
    const title = prod ? prod.name : "Creation";
    ToastComponent.show(isSaved ? `Saved "${title}" to Wishlist.` : `Removed "${title}" from Wishlist.`);
  },
  showWishlistAlert: () => {
    WishlistDrawerComponent.open();
  },
  filterCategory: (cat, btn) => {
    ShopPage.filterCategory(cat, btn);
  },
  changeImage: (src, el) => {
    ProductPage.changeImage(src, el);
  },
  submitReview: (e) => {
    ProductPage.submitReview(e);
  },
  subscribeNewsletter: (e) => {
    e.preventDefault();
    const input = e.target.querySelector("input[type='email']");
    if (input && input.value) {
      ToastComponent.show(`Welcome to the Atelier Circle. Privilege code ATELIER20 has been verified.`);
      input.value = "";
    }
  }
};

// Luxury Desktop Magnetic Cursor Follower
function initLuxuryCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const dot = document.createElement("div");
  dot.className = "aura-cursor-dot";
  const ring = document.createElement("div");
  ring.className = "aura-cursor-ring";
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  }, { passive: true });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Hover detection on interactive elements
  const hoverTargets = "a, button, input, select, textarea, .product-card, .size-option";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add("cursor-hover");
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove("cursor-hover");
    }
  });
}

// Initialize everything on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  NavbarComponent.init();
  CartDrawerComponent.init();
  WishlistDrawerComponent.init();
  SearchModalComponent.init();
  QuickViewComponent.init();
  CountdownComponent.init();
  SizeModalComponent.init();
  ScrollRevealComponent.init();
  initLuxuryCursor();
  HomePage.init();
  ShopPage.init();
  ProductPage.init();
});
