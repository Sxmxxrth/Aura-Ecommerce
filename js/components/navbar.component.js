/*
  =============================================
  NAVBAR COMPONENT (navbar.component.js)
  
  Controls sticky scroll effects and keeps cart/wishlist
  counter badges in sync with the service layers.
  =============================================
*/

import { cartService } from "../services/cart.service.js";
import { wishlistService } from "../services/wishlist.service.js";

export class NavbarComponent {
  static init() {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      window.addEventListener("scroll", () => {
        navbar.classList.toggle("is-scrolled", window.scrollY > 20);
      });
    }

    // Mobile hamburger menu toggle
    const hamburger = document.getElementById("hamburger-btn");
    const navLinks = document.getElementById("nav-links");
    if (hamburger && navLinks) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("mobile-open");
      });

      // Close menu when a nav link is clicked
      navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          hamburger.classList.remove("active");
          navLinks.classList.remove("mobile-open");
        });
      });
    }

    const cartBadge = document.getElementById("cart-badge");
    const wishlistBadge = document.getElementById("wishlist-badge");

    // Sync initial counts on page load
    if (cartBadge) cartBadge.textContent = cartService.getState().count;
    if (wishlistBadge) wishlistBadge.textContent = wishlistService.getState().count;

    // Reactively update whenever cart state changes
    cartService.subscribe(state => {
      if (cartBadge) cartBadge.textContent = state.count;
    });

    // Reactively update whenever wishlist state changes
    wishlistService.subscribe(state => {
      if (wishlistBadge) wishlistBadge.textContent = state.count;
    });
  }
}
