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
import { HomePage } from "./pages/home.page.js";
import { ShopPage } from "./pages/shop.page.js";
import { ProductPage } from "./pages/product.page.js";

// Global bridge for declarative onclick handlers
window.__aura = {
  addToCart: (id) => {
    const prod = PRODUCTS_DATA.find(p => p.id === Number(id));
    if (prod) {
      cartService.addItem(prod, 1);
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
  toggleMobileMenu: () => NavbarComponent.toggleMobileMenu(),
  closeMobileMenu: () => NavbarComponent.closeMobileMenu(),
  openSizeGuide: () => SizeModalComponent.open(),
  closeSizeGuide: () => SizeModalComponent.close(),
  checkout: () => {
    const state = cartService.getState();
    if (state.items.length === 0) {
      ToastComponent.show("Your shopping bag is empty.");
      return;
    }
    alert(`Thank you for acquiring from AURA Maison.\n\nAtelier Order Confirmed! Total: ${currencyService.format(state.subtotal)}\nComplimentary insured courier delivery has been initiated.`);
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
    const count = wishlistService.getCount();
    ToastComponent.show(`You have ${count} creation${count === 1 ? '' : 's'} saved in your Wishlist.`);
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
  SizeModalComponent.init();
  ScrollRevealComponent.init();
  HomePage.init();
  ShopPage.init();
  ProductPage.init();
});
