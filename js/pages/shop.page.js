/*
  =============================================
  SHOP PAGE CONTROLLER (shop.page.js)
  
  Handles live search, category filtering, and product rendering.
  =============================================
*/

import { PRODUCTS_DATA } from "../data/products.data.js";
import { wishlistService } from "../services/wishlist.service.js";

export class ShopPage {
  static init() {
    const container = document.getElementById("shop-products");
    if (!container) return;

    ShopPage.state = {
      category: "all",
      searchQuery: ""
    };

    // Read URL param if user navigated via collections link (e.g. ?category=women)
    const params = new URLSearchParams(window.location.search);
    if (params.has("category")) {
      ShopPage.state.category = params.get("category").toLowerCase();
    }

    ShopPage.bindEvents();
    ShopPage.applyFilters();

    wishlistService.subscribe(() => {
      ShopPage.applyFilters();
    });
  }

  static bindEvents() {
    const searchInput = document.getElementById("search-box");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        ShopPage.state.searchQuery = e.target.value.toLowerCase().trim();
        ShopPage.applyFilters();
      });
    }

    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
      // Highlight initial active category
      if (btn.dataset.category === ShopPage.state.category) {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      }

      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        ShopPage.state.category = btn.dataset.category || "all";
        ShopPage.applyFilters();
      });
    });
  }

  static applyFilters() {
    let list = [...PRODUCTS_DATA];

    if (ShopPage.state.category !== "all") {
      list = list.filter(p => p.category === ShopPage.state.category);
    }

    if (ShopPage.state.searchQuery) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(ShopPage.state.searchQuery) ||
        p.description.toLowerCase().includes(ShopPage.state.searchQuery)
      );
    }

    ShopPage.render(list);
  }

  static render(products) {
    const container = document.getElementById("shop-products");
    if (!container) return;

    if (products.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: white; border-radius: var(--radius-md); border: 1px solid #EEEEEE;">
          <h3>No items found</h3>
          <p style="margin-top: 8px; color: #888888;">Try searching for another keyword or selecting a different category.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(prod => {
      const isSaved = wishlistService.has(prod.id);
      return `
        <div class="product-card">
          <div class="product-image-wrap" style="position: relative;">
            <button 
              class="product-wishlist-btn" 
              onclick="window.__auraApp.toggleWishlist(${prod.id})" 
              title="Save to Wishlist"
              style="position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.9); width: 34px; height: 34px; border-radius: 999px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); z-index: 2;"
            >
              ${isSaved ? '❤️' : '🤍'}
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
