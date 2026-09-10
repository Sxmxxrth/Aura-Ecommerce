/*
  =============================================
  CART DRAWER COMPONENT (cart-drawer.component.js)
  =============================================
*/

import { cartService } from "../services/cart.service.js";
import { APP_CONFIG } from "../config/constants.js";
import { currencyService } from "../services/currency.service.js";

export class CartDrawerComponent {
  static init() {
    const listEl = document.getElementById("cart-items-list");
    const totalEl = document.getElementById("cart-total-price");
    const shippingNoticeEl = document.getElementById("cart-shipping-notice");

    const updateView = (state) => {
      if (!listEl || !totalEl) return;

      const threshold = APP_CONFIG.freeShippingThreshold;
      const needed = threshold - state.subtotal;

      if (shippingNoticeEl) {
        if (state.items.length === 0) {
          shippingNoticeEl.style.display = "none";
        } else if (needed <= 0) {
          shippingNoticeEl.style.display = "block";
          shippingNoticeEl.innerHTML = `<span style="color: var(--success); font-weight: 600;">Complimentary Worldwide Courier Unlocked</span>`;
        } else {
          shippingNoticeEl.style.display = "block";
          shippingNoticeEl.innerHTML = `Add <strong style="color: var(--accent);">${currencyService.format(needed)}</strong> more for <strong>Complimentary Delivery</strong>`;
        }
      }

      if (state.items.length === 0) {
        listEl.innerHTML = `
          <div style="text-align: center; padding: 56px 20px; color: var(--text-muted);">
            <div style="font-size: 36px; margin-bottom: 16px; opacity: 0.6;">◈</div>
            <h4 style="font-family: var(--font-serif); font-size: 20px; color: var(--primary); margin-bottom: 8px;">Your bag is empty</h4>
            <p style="font-size: 13.5px; margin-bottom: 24px; line-height: 1.6;">Explore our latest capsule selections and discover architectural tailoring.</p>
            <a href="shop.html" onclick="window.__aura.closeCart()" class="btn btn-primary" style="font-size: 11px; padding: 12px 24px;">Explore Catalog →</a>
          </div>
        `;
        totalEl.textContent = "₹0";
        return;
      }

      listEl.innerHTML = state.items.map((item, index) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div class="cart-item-details">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-qty">
              <span>Qty: <strong>${item.quantity}</strong></span>
              <span style="margin: 0 6px;">•</span>
              <button onclick="window.__aura.adjustQty(${index}, -1)" style="background:none; border:none; cursor:pointer; font-weight:bold; color:var(--text-secondary); padding: 0 4px;" aria-label="Decrease quantity">-</button>
              <button onclick="window.__aura.adjustQty(${index}, 1)" style="background:none; border:none; cursor:pointer; font-weight:bold; color:var(--text-secondary); padding: 0 4px;" aria-label="Increase quantity">+</button>
            </div>
            <div class="cart-item-price">${currencyService.format(item.price * item.quantity)}</div>
          </div>
          <button class="cart-item-remove" onclick="window.__aura.removeFromCart(${index})" title="Remove creation" aria-label="Remove creation">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `).join("");

      totalEl.textContent = currencyService.format(state.subtotal);
    };

    cartService.subscribe(updateView);
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
