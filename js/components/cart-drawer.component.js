/*
  =============================================
  CART DRAWER COMPONENT (cart-drawer.component.js)
  =============================================
*/

import { cartService } from "../services/cart.service.js";
import { APP_CONFIG } from "../config/constants.js";
import { currencyService } from "../services/currency.service.js";
import { ToastComponent } from "./toast.component.js";

export class CartDrawerComponent {
  static init() {
    const listEl = document.getElementById("cart-items-list");
    const totalEl = document.getElementById("cart-total-price");
    const shippingNoticeEl = document.getElementById("cart-shipping-notice");
    const footerEl = document.getElementById("cart-drawer-footer");

    const updateView = (state) => {
      if (!listEl) return;

      const threshold = APP_CONFIG.freeShippingThreshold;
      const needed = threshold - state.subtotal;
      const progressPercent = Math.min(100, Math.round((state.subtotal / threshold) * 100));

      const promoWrapper = document.getElementById("cart-promo-wrapper");
      const breakdownEl = document.getElementById("cart-breakdown");

      if (shippingNoticeEl) {
        if (state.items.length === 0) {
          shippingNoticeEl.style.display = "none";
        } else if (needed <= 0) {
          shippingNoticeEl.style.display = "block";
          shippingNoticeEl.innerHTML = `
            <div class="shipping-bar-wrap">
              <div class="shipping-bar-fill" style="width: 100%;"></div>
            </div>
            <div style="margin-top: 6px; color: var(--success); font-weight: 600; font-size: 11.5px; letter-spacing: 0.5px;">
              ✦ Complimentary Insured Courier Unlocked
            </div>
          `;
        } else {
          shippingNoticeEl.style.display = "block";
          shippingNoticeEl.innerHTML = `
            <div class="shipping-bar-wrap">
              <div class="shipping-bar-fill" style="width: ${progressPercent}%;"></div>
            </div>
            <div style="margin-top: 6px; font-size: 11.5px; color: var(--text-secondary);">
              Add <strong style="color: var(--accent);">${currencyService.format(needed)}</strong> more for <strong>Complimentary Delivery</strong>
            </div>
          `;
        }
      }

      if (state.items.length === 0) {
        listEl.innerHTML = `
          <div style="text-align: center; padding: 56px 20px; color: var(--text-muted);">
            <div style="font-size: 38px; margin-bottom: 16px; opacity: 0.6;">◈</div>
            <h4 style="font-family: var(--font-serif); font-size: 22px; color: var(--primary); margin-bottom: 8px; font-weight: 500;">Your bag is empty</h4>
            <p style="font-size: 13.5px; margin-bottom: 24px; line-height: 1.6; max-width: 280px; margin-left: auto; margin-right: auto;">Explore our latest capsule selections and discover architectural tailoring.</p>
            <a href="shop.html" onclick="window.__aura.closeCart()" class="btn btn-primary" style="font-size: 11px; padding: 12px 24px;">Explore Catalog →</a>
          </div>
        `;
        if (footerEl) footerEl.style.display = "none";
        if (totalEl) totalEl.textContent = "₹0";
        if (promoWrapper) {
          promoWrapper.innerHTML = '';
          promoWrapper.style.display = 'none';
        }
        if (breakdownEl) breakdownEl.innerHTML = '';
        return;
      }

      if (footerEl) footerEl.style.display = "block";
      if (promoWrapper) promoWrapper.style.display = "block";

      listEl.innerHTML = state.items.map((item, index) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div class="cart-item-details">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-meta" style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">
              Size: <strong style="color: var(--primary);">${item.size || 'M'}</strong> • Color: <strong style="color: var(--primary);">${item.color || 'Signature'}</strong>
            </div>
            <div class="cart-item-qty">
              <span>Qty: <strong>${item.quantity}</strong></span>
              <span style="margin: 0 6px;">•</span>
              <button onclick="window.__aura.adjustQty(${index}, -1)" style="background:none; border:none; cursor:pointer; font-weight:bold; color:var(--text-secondary); padding: 2px 6px; font-size: 14px;" aria-label="Decrease quantity">-</button>
              <button onclick="window.__aura.adjustQty(${index}, 1)" style="background:none; border:none; cursor:pointer; font-weight:bold; color:var(--text-secondary); padding: 2px 6px; font-size: 14px;" aria-label="Increase quantity">+</button>
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

      if (promoWrapper) {
        if (state.isPromoApplied) {
          promoWrapper.innerHTML = `
            <div class="promo-applied-badge">
              <span>✦ Privilege Code <strong>${state.promoCode}</strong> (-${state.discountPercent}%) Applied</span>
              <button onclick="window.__aura.removePromo()" class="promo-remove-btn" title="Remove code">✕</button>
            </div>
          `;
        } else {
          promoWrapper.innerHTML = `
            <div class="promo-input-row">
              <input type="text" id="cart-promo-input" placeholder="Privilege Code (ATELIER20)" aria-label="Privilege Code" />
              <button onclick="window.__aura.applyPromo()" class="promo-apply-btn">Apply</button>
            </div>
          `;
        }
      }

      if (breakdownEl) {
        breakdownEl.innerHTML = `
          <div class="breakdown-row">
            <span>Subtotal</span>
            <span>${currencyService.format(state.subtotal)}</span>
          </div>
          ${state.isPromoApplied ? `
            <div class="breakdown-row discount-row">
              <span>Atelier Privilege (-${state.discountPercent}%)</span>
              <span>-${currencyService.format(state.discountAmount)}</span>
            </div>
          ` : ""}
          <div class="breakdown-row">
            <span>Insured Courier</span>
            <span>${needed <= 0 ? '<strong style="color: var(--success);">Complimentary</strong>' : 'Calculated at Checkout'}</span>
          </div>
        `;
      }

      if (totalEl) {
        totalEl.textContent = currencyService.format(state.finalTotal);
      }
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
