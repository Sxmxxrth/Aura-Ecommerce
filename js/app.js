/*
  =============================================
  APPLICATION BOOTSTRAP (app.js)
  
  Master entry point that initializes UI components and pages.
  =============================================
*/

import { PRODUCTS_DATA } from "./data/products.data.js";
import { cartService } from "./services/cart.service.js";
import { wishlistService } from "./services/wishlist.service.js";
import { NavbarComponent } from "./components/navbar.component.js";
import { CartDrawerComponent } from "./components/cart-drawer.component.js";
import { CountdownComponent } from "./components/countdown.component.js";
import { HomePage } from "./pages/home.page.js";
import { ShopPage } from "./pages/shop.page.js";
import { ProductPage } from "./pages/product.page.js";

// Global bridge for HTML onclick handlers
window.__aura = {
  addToCart: (id) => {
    const prod = PRODUCTS_DATA.find(p => p.id === Number(id));
    if (prod) {
      cartService.addItem(prod, 1);
      CartDrawerComponent.open();
    }
  },
  removeFromCart: (index) => {
    cartService.removeItem(index);
  },
  openCart: () => CartDrawerComponent.open(),
  closeCart: () => CartDrawerComponent.close(),
  checkout: () => {
    const state = cartService.getState();
    if (state.items.length === 0) {
      alert("Your shopping bag is empty!");
      return;
    }
    alert(`🎉 Thank you! Order placed successfully. Total: $${state.subtotal.toFixed(2)}`);
    cartService.clear();
    CartDrawerComponent.close();
  },
  toggleWishlist: (id) => {
    wishlistService.toggle(id);
  },
  showWishlistAlert: () => {
    alert(`You have ${wishlistService.getCount()} item(s) in your Wishlist! ❤️`);
  },
  filterCategory: (cat, btn) => {
    ShopPage.filterCategory(cat, btn);
  },
  changeImage: (src, el) => {
    ProductPage.changeImage(src, el);
  },
  submitReview: (e) => {
    ProductPage.submitReview(e);
  }
};

// Initialize everything on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  NavbarComponent.init();
  CartDrawerComponent.init();
  CountdownComponent.init();
  HomePage.init();
  ShopPage.init();
  ProductPage.init();
});
