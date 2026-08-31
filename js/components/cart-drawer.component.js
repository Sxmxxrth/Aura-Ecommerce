/*
  =============================================
  CART DRAWER COMPONENT (cart-drawer.component.js)
  
  Controls the slide-out shopping drawer:
  - Opening / Closing drawer
  - Rendering cart items list dynamically
  - Removing items & calculating subtotal
  =============================================
*/

import { cartService } from "../services/cart.service.js";

export class CartDrawerComponent {
  static init() {
    const backdrop = document.getElementById("drawer-backdrop");
    const openBtns = document.querySelectorAll(".open-cart-btn");
    const closeBtns = document.querySelectorAll(".close-cart-btn");

    openBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        CartDrawerComponent.open();
      });
    });

    closeBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        CartDrawerComponent.close();
      });
    });

    if (backdrop) {
      backdrop.addEventListener("click", () => CartDrawerComponent.close());
    }

    // Subscribe to cart changes so drawer re-renders automatically
    cartService.subscribe(() => {
      CartDrawerComponent.render();
    });

    // Initial render
    CartDrawerComponent.render();
  }

  static open() {
    const backdrop = document.getElementById("drawer-backdrop");
    const drawer = document.getElementById("cart-drawer");
    if (backdrop) backdrop.classList.add("active");
    if (drawer) drawer.classList.add("active");
    document.body.style.overflow = "hidden"; // Stop background scroll
  }

  static close() {
    const backdrop = document.getElementById("drawer-backdrop");
    const drawer = document.getElementById("cart-drawer");
    if (backdrop) backdrop.classList.remove("active");
    if (drawer) drawer.classList.remove("active");
    document.body.style.overflow = "";
  }

  static render() {
    const listEl = document.getElementById("cart-items-list");
    const totalEl = document.getElementById("cart-total-price");
    if (!listEl || !totalEl) return;

    const state = cartService.getState();

    if (state.items.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: #888888;">
          <div style="font-size: 36px; margin-bottom: 8px;">🛍️</div>
          <p>Your shopping bag is empty.</p>
        </div>
      `;
      totalEl.textContent = "$0.00";
      return;
    }

    listEl.innerHTML = state.items.map((item, index) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-meta">Size: ${item.size} • Qty: ${item.quantity}</div>
          <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
        <button class="cart-item-remove" title="Remove item" onclick="window.__auraApp.removeItem(${index})">&times;</button>
      </div>
    `).join("");

    totalEl.textContent = `$${state.total.toFixed(2)}`;
  }
}
