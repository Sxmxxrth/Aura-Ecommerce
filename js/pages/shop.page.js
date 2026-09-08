/*
  =============================================
  SHOP PAGE CONTROLLER (shop.page.js)
  =============================================
*/

import { PRODUCTS_DATA } from "../data/products.data.js";
import { wishlistService } from "../services/wishlist.service.js";

export class ShopPage {
  static category = "all";

  static init() {
    const container = document.getElementById("shop-products");
    if (!container) return;

    // Read ?category= from URL if present
    const params = new URLSearchParams(window.location.search);
    if (params.has("category")) {
      const cat = params.get("category").toLowerCase();
      ShopPage.category = cat;
      const targetBtn = document.querySelector(`.filter-btn[data-category="${cat}"]`);
      if (targetBtn) {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        targetBtn.classList.add("active");
      }
    }

    ShopPage.render();

    // Listen to search input
    const searchInput = document.getElementById("search-box");
    if (searchInput) {
      searchInput.addEventListener("input", () => ShopPage.render());
    }

    wishlistService.subscribe(() => {
      ShopPage.render();
    });
  }

  static filterCategory(categoryName, clickedBtn) {
    ShopPage.category = categoryName;
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    if (clickedBtn) clickedBtn.classList.add("active");
    ShopPage.render();
  }

  static render() {
    const container = document.getElementById("shop-products");
    if (!container) return;

    const searchInput = document.getElementById("search-box");
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

    const filtered = PRODUCTS_DATA.filter(prod => {
      const matchCat = (ShopPage.category === "all" || prod.category === ShopPage.category);
      const matchSearch = prod.name.toLowerCase().includes(query) || prod.desc.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });

    const countEl = document.getElementById("shop-product-count");
    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} product${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: white; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
          <h3 style="color: var(--primary); margin-bottom: 6px;">No products found</h3>
          <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 16px;">Try adjusting your search terms or clearing the filter.</p>
          <button class="btn btn-secondary" onclick="window.__aura.filterCategory('all', document.querySelector('.filter-btn[data-category=\\'all\\']'))">View All Products</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(prod => {
      const isSaved = wishlistService.has(prod.id);
      const heartFill = isSaved ? "#EF4444" : "none";
      const heartStroke = isSaved ? "#EF4444" : "#121418";

      return `
        <div class="product-card">
          <div class="product-image-wrap">
            <span class="product-badge">${prod.oldPrice ? 'Sale' : 'New'}</span>
            <button class="wishlist-btn" onclick="window.__aura.toggleWishlist(${prod.id})" title="${isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}" aria-label="Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${heartFill}" stroke="${heartStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <a href="product.html?id=${prod.id}">
              <img src="${prod.image}" alt="${prod.name}" loading="lazy" />
            </a>
          </div>
          <div class="product-info">
            <span class="product-meta">${prod.category}</span>
            <h3 class="product-title">
              <a href="product.html?id=${prod.id}">${prod.name}</a>
            </h3>
            <div class="product-rating">★★★★★ <span>(48)</span></div>
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
