/*
  =============================================
  SHOP PAGE CONTROLLER (shop.page.js)
  =============================================
*/

import { PRODUCTS_DATA } from "../data/products.data.js";
import { wishlistService } from "../services/wishlist.service.js";
import { currencyService } from "../services/currency.service.js";

export class ShopPage {
  static category = "all";
  static sortBy = "featured";
  static isDense = false;

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

    // Sort select handler
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        ShopPage.sortBy = e.target.value;
        ShopPage.render();
      });
    }

    // Grid toggle button
    const gridToggle = document.getElementById("grid-toggle-btn");
    if (gridToggle) {
      gridToggle.addEventListener("click", () => {
        ShopPage.isDense = !ShopPage.isDense;
        container.classList.toggle("grid-dense", ShopPage.isDense);
        gridToggle.textContent = ShopPage.isDense ? "⊞ View Large" : "▦ View Compact";
      });
    }

    wishlistService.subscribe(() => {
      ShopPage.render();
    });

    currencyService.subscribe(() => {
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

    let filtered = PRODUCTS_DATA.filter(prod => {
      let matchCat = false;
      if (ShopPage.category === "all") {
        matchCat = true;
      } else if (ShopPage.category === "new-arrivals" || ShopPage.category === "new") {
        matchCat = !!prod.isNew;
      } else {
        matchCat = (prod.category === ShopPage.category);
      }
      const matchSearch = prod.name.toLowerCase().includes(query) || prod.desc.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });

    // Sorting
    if (ShopPage.sortBy === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (ShopPage.sortBy === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (ShopPage.sortBy === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    const countEl = document.getElementById("shop-product-count");
    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} creation${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 70px 20px; background: white; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <div style="font-size: 38px; margin-bottom: 14px; opacity: 0.8;">◈</div>
          <h3 style="color: var(--primary); font-family: var(--font-serif); font-size: 22px; margin-bottom: 8px;">No creations match your search</h3>
          <p style="color: var(--text-muted); font-size: 13.5px; margin-bottom: 20px;">Try adjusting your keyword filter or exploring our complete catalog.</p>
          <button class="btn btn-secondary" onclick="window.__aura.filterCategory('all', document.querySelector('.filter-btn[data-category=\\'all\\']'))">View All Creations</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(prod => {
      const isSaved = wishlistService.has(prod.id);
      const heartFill = isSaved ? "#A93226" : "none";
      const heartStroke = isSaved ? "#A93226" : "#0F1014";
      const secondaryImg = prod.images && prod.images.length > 1 ? prod.images[1] : prod.image;

      const formattedPrice = currencyService.format(prod.price);
      const formattedOldPrice = prod.oldPrice ? currencyService.format(prod.oldPrice) : null;

      return `
        <div class="product-card reveal-on-scroll">
          <div class="product-image-wrap">
            <span class="product-badge">${prod.oldPrice ? 'Atelier Sale' : 'New Edition'}</span>
            <button class="wishlist-btn" onclick="window.__aura.toggleWishlist(${prod.id})" title="${isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}" aria-label="Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${heartFill}" stroke="${heartStroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <a href="product.html?id=${prod.id}">
              <img class="product-img-primary" src="${prod.image}" alt="${prod.name} Primary View" loading="lazy" />
              <img class="product-img-secondary" src="${secondaryImg}" alt="${prod.name} Secondary View" loading="lazy" />
            </a>
            <button class="product-quick-view-btn" onclick="window.__aura.openQuickView(${prod.id})" aria-label="Quick View ${prod.name}">
              Quick View
            </button>
          </div>
          <div class="product-info">
            <span class="product-meta">${prod.category} Capsule</span>
            <h3 class="product-title">
              <a href="product.html?id=${prod.id}">${prod.name}</a>
            </h3>
            <div class="product-rating">★★★★★ <span>(48)</span></div>
            <div class="product-price">
              ${formattedPrice}
              ${formattedOldPrice ? `<span class="original-price">${formattedOldPrice}</span>` : ""}
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
