/*
  =============================================
  NAVBAR COMPONENT (navbar.component.js)
  =============================================
*/

import { cartService } from "../services/cart.service.js";
import { wishlistService } from "../services/wishlist.service.js";

export class NavbarComponent {
  static init() {
    const navbar = document.querySelector(".navbar");
    const cartBadge = document.getElementById("cart-badge");
    const wishBadge = document.getElementById("wishlist-badge");
    const navLinks = document.getElementById("nav-links");
    const backdrop = document.getElementById("nav-backdrop");

    // Sticky scroll styling
    window.addEventListener("scroll", () => {
      if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 20);
      }
    });

    // Close mobile nav when clicking any link
    if (navLinks) {
      navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => NavbarComponent.closeMobileMenu());
      });
    }

    // Close mobile nav when clicking backdrop
    if (backdrop) {
      backdrop.addEventListener("click", () => NavbarComponent.closeMobileMenu());
    }

    // Keep badges in sync with service updates
    cartService.subscribe(state => {
      if (cartBadge) {
        cartBadge.textContent = state.count;
        cartBadge.style.transform = "scale(1.3)";
        setTimeout(() => { cartBadge.style.transform = "scale(1)"; }, 200);
      }
    });

    wishlistService.subscribe(ids => {
      if (wishBadge) {
        wishBadge.textContent = ids.length;
        wishBadge.style.transform = "scale(1.3)";
        setTimeout(() => { wishBadge.style.transform = "scale(1)"; }, 200);
      }
    });
  }

  static toggleMobileMenu() {
    const navLinks = document.getElementById("nav-links");
    const hamburger = document.getElementById("hamburger-btn");
    const backdrop = document.getElementById("nav-backdrop");

    if (navLinks && hamburger) {
      const isOpen = navLinks.classList.toggle("mobile-open");
      hamburger.classList.toggle("active", isOpen);
      if (backdrop) backdrop.classList.toggle("active", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    }
  }

  static closeMobileMenu() {
    const navLinks = document.getElementById("nav-links");
    const hamburger = document.getElementById("hamburger-btn");
    const backdrop = document.getElementById("nav-backdrop");

    if (navLinks) navLinks.classList.remove("mobile-open");
    if (hamburger) hamburger.classList.remove("active");
    if (backdrop) backdrop.classList.remove("active");
    document.body.style.overflow = "";
  }
}
