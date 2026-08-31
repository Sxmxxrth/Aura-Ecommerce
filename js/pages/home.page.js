/*
  =============================================
  HOME PAGE CONTROLLER (home.page.js)
  =============================================
*/

import { PRODUCTS_DATA } from "../data/products.data.js";
import { wishlistService } from "../services/wishlist.service.js";

export class HomePage {
  static init() {
    const container = document.getElementById("home-products");
    if (!container) return;

    HomePage.render();

    wishlistService.subscribe(() => {
      HomePage.render();
    });
  }

  static render() {
    const container = document.getElementById("home-products");
    if (!container) return;

    container.innerHTML = PRODUCTS_DATA.slice(0, 4).map(prod => {
      const isSaved = wishlistService.has(prod.id);
      const heartFill = isSaved ? "#E74C3C" : "none";
      const heartStroke = isSaved ? "#E74C3C" : "#222222";

      return `
        <div class="product-card">
          <div class="product-image-wrap">
            <button class="wishlist-btn" onclick="window.__aura.toggleWishlist(${prod.id})" title="Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${heartFill}" stroke="${heartStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <a href="product.html?id=${prod.id}">
              <img src="${prod.image}" alt="${prod.name}" />
            </a>
          </div>
          <div class="product-info">
            <span class="product-meta">${prod.category}</span>
            <h3 class="product-title">${prod.name}</h3>
            <div class="product-rating">★★★★★ (48)</div>
            <div class="product-price">
              $${prod.price.toFixed(2)}
              ${prod.oldPrice ? `<span class="original-price">$${prod.oldPrice.toFixed(2)}</span>` : ""}
            </div>
            <div class="product-actions">
              <button class="btn-card" onclick="window.__aura.addToCart(${prod.id})">Add to Bag</button>
              <a href="product.html?id=${prod.id}" class="btn-card btn-card-outline">Details</a>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }
}
