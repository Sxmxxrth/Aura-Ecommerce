/*
  =============================================
  CART DRAWER COMPONENT (cart-drawer.component.js)
  =============================================
*/

import { cartService } from "../services/cart.service.js";
import { APP_CONFIG } from "../config/constants.js";

export class CartDrawerComponent {
  static init() {
    const listEl = document.getElementById("cart-items-list");
    const totalEl = document.getElementById("cart-total-price");
    const shippingNoticeEl = document.getElementById("cart-shipping-notice");

    cartService.subscribe(state => {
      if (!listEl || !totalEl) return;

      // Free shipping computation
      const needed = APP_CONFIG.freeShippingThreshold - state.subtotal;
      if (shippingNoticeEl) {
        if (state.items.length === 0) {
          shippingNoticeEl.style.display = "none";
        } else if (needed <= 0) {
          shippingNoticeEl.style.display = "block";
          shippingNoticeEl.innerHTML = `<span style="color: var(--success); font-weight: 700;">🎉 Free Shipping Unlocked!</span>`;
        } else {
          shippingNoticeEl.style.display = "block";
          shippingNoticeEl.innerHTML = `Add <strong style="color: var(--accent);">$${needed.toFixed(2)}</strong> more for <strong>FREE Shipping</strong>!`;
        }
      }

      if (state.items.length === 0) {
        listEl.innerHTML = `
          <div style="text-align: center; padding: 48px 16px; color: var(--text-muted);">
            <div style="font-size: 40px; margin-bottom: 12px;">🛍️</div>
            <h4 style="color: var(--text-main); margin-bottom: 6px;">Your bag is empty</h4>
            <p style="font-size: 13px; margin-bottom: 20px;">Looks like you haven't added any items yet.</p>
            <a href="shop.html" onclick="window.__aura.closeCart()" class="btn btn-primary" style="font-size: 13px; padding: 10px 20px;">Start Shopping →</a>
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
            <div class="cart-item-qty">Qty: <strong>${item.quantity}</strong></div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
          <button class="cart-item-remove" onclick="window.__aura.removeFromCart(${index})" title="Remove item" aria-label="Remove item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
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
    document.body.style.overflow = "hidden";
  }

  static close() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("drawer-backdrop");
    if (drawer) drawer.classList.remove("active");
    if (backdrop) backdrop.classList.remove("active");
    document.body.style.overflow = "";
  }
}
