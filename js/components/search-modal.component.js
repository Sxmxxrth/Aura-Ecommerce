/*
  =============================================
  SEARCH MODAL COMPONENT (search-modal.component.js)
  =============================================
*/

import { PRODUCTS_DATA } from "../data/products.data.js";
import { currencyService } from "../services/currency.service.js";

export class SearchModalComponent {
  static init() {
    const backdrop = document.getElementById("search-modal-backdrop");
    const input = document.getElementById("search-modal-input");
    const resultsContainer = document.getElementById("search-modal-results");

    if (!backdrop || !input || !resultsContainer) return;

    // Live search listener
    input.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      SearchModalComponent.renderResults(query);
    });

    // Close on backdrop click
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) SearchModalComponent.close();
    });

    // Global keyboard shortcuts: "/" or "Cmd+K" to open search, "Escape" to close
    document.addEventListener("keydown", (e) => {
      if ((e.key === "/" || (e.metaKey && e.key.toLowerCase() === "k")) && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        SearchModalComponent.open();
      } else if (e.key === "Escape") {
        SearchModalComponent.close();
      }
    });
  }

  static open() {
    const backdrop = document.getElementById("search-modal-backdrop");
    const input = document.getElementById("search-modal-input");
    if (!backdrop || !input) return;

    backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
    input.value = "";
    SearchModalComponent.renderResults("");
    setTimeout(() => input.focus(), 100);
  }

  static close() {
    const backdrop = document.getElementById("search-modal-backdrop");
    if (backdrop) backdrop.classList.remove("active");
    document.body.style.overflow = "";
  }

  static renderResults(query) {
    const resultsContainer = document.getElementById("search-modal-results");
    if (!resultsContainer) return;

    const matched = query
      ? PRODUCTS_DATA.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
      : PRODUCTS_DATA.slice(0, 4);

    if (matched.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <div style="font-size: 28px; margin-bottom: 8px;">◈</div>
          <p style="font-size: 14px; color: var(--primary);">No creations found for "${query}"</p>
          <span style="font-size: 12px;">Try searching for "coat", "trench", "blazer", or "silk"</span>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div style="font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; padding-left: 14px;">
        ${query ? `Search Results (${matched.length})` : 'Curated Atelier Suggestions'}
      </div>
      ${matched.map(prod => `
        <a href="product.html?id=${prod.id}" class="search-result-item" onclick="window.__aura.closeSearch()">
          <img src="${prod.image}" alt="${prod.name}" class="search-result-img" />
          <div class="search-result-details">
            <span class="search-result-category">${prod.category} Capsule</span>
            <div class="search-result-title">${prod.name}</div>
            <div class="search-result-price">${currencyService.format(prod.price)}</div>
          </div>
          <span style="color: var(--accent); font-size: 18px; margin-left: 8px;">→</span>
        </a>
      `).join("")}
    `;
  }
}
