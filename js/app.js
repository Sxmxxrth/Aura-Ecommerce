/*
  =============================================
  APPLICATION BOOTSTRAP (app.js)
  
  Master entry point that connects the services,
  components, and view controllers.
  =============================================
*/

import { PRODUCTS_DATA } from "./data/products.data.js";
import { cartService } from "./services/cart.service.js";
import { wishlistService } from "./services/wishlist.service.js";
import { NavbarComponent } from "./components/navbar.component.js";
import { CartDrawerComponent } from "./components/cart-drawer.component.js";
import { CountdownComponent } from "./components/countdown.component.js";
import { ToastComponent } from "./components/toast.component.js";
import { HomePage } from "./pages/home.page.js";
import { ShopPage } from "./pages/shop.page.js";
import { ProductPage } from "./pages/product.page.js";
import { ContactPage } from "./pages/contact.page.js";

class App {
  static init() {
    // 1. Initialize persistent UI components
    NavbarComponent.init();
    CartDrawerComponent.init();
    CountdownComponent.init();

    // 2. Initialize active page controller
    HomePage.init();
    ShopPage.init();
    ProductPage.init();
    ContactPage.init();

    console.log("%c[AURA E-Commerce] App initialized successfully.", "color: #E67E22; font-weight: bold;");
  }

  // Global helper methods exposed to window.__auraApp for inline HTML button triggers
  static addToCart(productId, size = "M", color = "Default") {
    const product = PRODUCTS_DATA.find(p => p.id === Number(productId));
    if (product) {
      cartService.addItem(product, size, color, 1);
      ToastComponent.show(`Added "${product.name}" to your bag! 🛍️`);
      CartDrawerComponent.open();
    }
  }

  static toggleWishlist(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === Number(productId));
    if (!product) return;

    const isSaved = wishlistService.toggle(productId);
    ToastComponent.show(isSaved ? `Saved "${product.name}" to Wishlist! ❤️` : `Removed from Wishlist 🤍`);
  }

  static removeItem(index) {
    cartService.removeItem(index);
    ToastComponent.show("Item removed from bag.");
  }

  static checkout() {
    const state = cartService.getState();
    if (state.items.length === 0) return;

    alert(`🎉 Order Confirmed! Total: $${state.total.toFixed(2)}\nThank you for shopping with AURA.`);
    cartService.clear();
    CartDrawerComponent.close();
  }
}

// Attach to window namespace for declarative onclick handlers
window.__auraApp = App;

// Bootstrap on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
