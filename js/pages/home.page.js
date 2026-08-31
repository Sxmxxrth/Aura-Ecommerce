/*
  =============================================
  HOME PAGE CONTROLLER (home.page.js)
  
  Controls rendering and interactions for index.html.
  =============================================
*/

import { PRODUCTS_DATA } from "../data/products.data.js";
import { wishlistService } from "../services/wishlist.service.js";

export class HomePage {
  static init() {
    const container = document.getElementById("home-products");
    if (!container) return;

    HomePage.render(PRODUCTS_DATA.slice(0, 4));

    // Re-render when wishlist updates (so heart icons update live!)
    wishlistService.subscribe(() => {
      HomePage.render(PRODUCTS_DATA.slice(0, 4));
    });
  }

  static render(products) {
    const container = document.getElementById("home-products");
    if (!container) return;

    container.innerHTML = products.map(prod => {
      const isSaved = wishlistService.has(prod.id);
      return `
        <div class="product-card">
          <div class="product-image-wrap" style="position: relative;">
            <button 
              class="product-wishlist-btn" 
              onclick="window.__auraApp.toggleWishlist(${prod.id})" 
              title="Save to Wishlist"
              style="position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.9); width: 34px; height: 34px; border-radius: 999px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.1); z-index: 2;"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? '#E74C3C' : 'none'}" stroke="${isSaved ? '#E74C3C' : '#222222'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <div class="product-rating">${'★'.repeat(Math.round(prod.rating))} (${prod.reviewCount})</div>
            <div class="product-price">
              $${prod.price.toFixed(2)}
              ${prod.oldPrice ? `<span class="original-price">$${prod.oldPrice.toFixed(2)}</span>` : ''}
            </div>
            <div class="product-actions">
              <button class="btn-card" onclick="window.__auraApp.addToCart(${prod.id})">Add to Bag</button>
              <a href="product.html?id=${prod.id}" class="btn-card btn-card-outline">Details</a>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }
}
