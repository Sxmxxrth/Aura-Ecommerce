/*
  =============================================
  WISHLIST DRAWER COMPONENT (wishlist-drawer.component.js)
  =============================================
*/

import { wishlistService } from "../services/wishlist.service.js";
import { PRODUCTS_DATA } from "../data/products.data.js";
import { cartService } from "../services/cart.service.js";
import { currencyService } from "../services/currency.service.js";
import { ToastComponent } from "./toast.component.js";
import { CartDrawerComponent } from "./cart-drawer.component.js";

export class WishlistDrawerComponent {
  static init() {
    const listEl = document.getElementById("wishlist-items-list");
    if (!listEl) return;

    const updateView = () => {
      const items = wishlistService.getItems();
      const products = PRODUCTS_DATA.filter(p => items.includes(p.id));

      if (products.length === 0) {
        listEl.innerHTML = `
          <div style="text-align: center; padding: 56px 20px; color: var(--text-muted);">
            <div style="font-size: 38px; margin-bottom: 16px; opacity: 0.6;">♡</div>
            <h4 style="font-family: var(--font-serif); font-size: 22px; color: var(--primary); margin-bottom: 8px; font-weight: 500;">Your wishlist is empty</h4>
            <p style="font-size: 13.5px; margin-bottom: 24px; line-height: 1.6; max-width: 280px; margin-left: auto; margin-right: auto;">Save your favorite runway pieces and inaugural capsules here.</p>
            <a href="shop.html" onclick="window.__aura.closeWishlist()" class="btn btn-primary" style="font-size: 11px; padding: 12px 24px;">Explore Creations →</a>
          </div>
        `;
        return;
      }

      listEl.innerHTML = products.map(prod => `
        <div class="wishlist-item">
          <img src="${prod.image}" alt="${prod.name}" />
          <div class="wishlist-item-details">
            <div class="wishlist-item-title">${prod.name}</div>
            <div class="wishlist-item-price">${currencyService.format(prod.price)}</div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <button class="wishlist-move-btn" onclick="window.__aura.moveWishlistToCart(${prod.id})">
                Move to Bag
              </button>
              <button onclick="window.__aura.toggleWishlist(${prod.id})" style="background:none; border:none; color:var(--text-muted); font-size:12px; cursor:pointer; text-decoration:underline;">
                Remove
              </button>
            </div>
          </div>
        </div>
      `).join("");
    };

    wishlistService.subscribe(updateView);
  }

  static open() {
    const drawer = document.getElementById("wishlist-drawer");
    const backdrop = document.getElementById("wishlist-backdrop");
    if (drawer) drawer.classList.add("active");
    if (backdrop) backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  static close() {
    const drawer = document.getElementById("wishlist-drawer");
    const backdrop = document.getElementById("wishlist-backdrop");
    if (drawer) drawer.classList.remove("active");
    if (backdrop) backdrop.classList.remove("active");
    document.body.style.overflow = "";
  }

  static moveToCart(productId) {
    const prod = PRODUCTS_DATA.find(p => p.id === Number(productId));
    if (prod) {
      cartService.addItem(prod, 1);
      wishlistService.toggle(prod.id);
      ToastComponent.show(`Moved "${prod.name}" to your shopping bag.`);
      WishlistDrawerComponent.close();
      CartDrawerComponent.open();
    }
  }
}
