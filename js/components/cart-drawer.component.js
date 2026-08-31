/*
  =============================================
  CART DRAWER COMPONENT (cart-drawer.component.js)
  =============================================
*/

import { cartService } from "../services/cart.service.js";

export class CartDrawerComponent {
  static init() {
    const listEl = document.getElementById("cart-items-list");
    const totalEl = document.getElementById("cart-total-price");

    cartService.subscribe(state => {
      if (!listEl || !totalEl) return;

      if (state.items.length === 0) {
        listEl.innerHTML = `
          <div style="text-align: center; padding: 40px 10px; color: #888888;">
            <p>Your shopping bag is empty.</p>
          </div>
        `;
        totalEl.textContent = "$0.00";
        return;
      }

      listEl.innerHTML = state.items.map((item, index) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div class="cart-item-details">
            <div class="cart-item-title">${item.name}</div>
            <div style="font-size: 12px; color: #777;">Qty: ${item.quantity}</div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
          <button class="cart-item-remove" onclick="window.__aura.removeFromCart(${index})">&times;</button>
        </div>
      `).join("");

      totalEl.textContent = `$${state.subtotal.toFixed(2)}`;
    });
  }

  static open() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("drawer-backdrop");
    if (drawer) drawer.classList.add("active");
    if (backdrop) backdrop.classList.add("active");
  }

  static close() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("drawer-backdrop");
    if (drawer) drawer.classList.remove("active");
    if (backdrop) backdrop.classList.remove("active");
  }
}
