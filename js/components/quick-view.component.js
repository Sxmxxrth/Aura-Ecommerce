/*
  =============================================
  QUICK VIEW COMPONENT (quick-view.component.js)
  =============================================
*/

import { PRODUCTS_DATA } from "../data/products.data.js";
import { cartService } from "../services/cart.service.js";
import { currencyService } from "../services/currency.service.js";
import { ToastComponent } from "./toast.component.js";
import { CartDrawerComponent } from "./cart-drawer.component.js";

export class QuickViewComponent {
  static currentProduct = null;
  static selectedSize = "M";
  static selectedColor = "Signature";

  static init() {
    // Backdrop close handler
    const backdrop = document.getElementById("quick-view-backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) QuickViewComponent.close();
      });
    }

    // Escape key listener
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        QuickViewComponent.close();
      }
    });
  }

  static open(productId) {
    const prod = PRODUCTS_DATA.find(p => p.id === Number(productId));
    if (!prod) return;

    QuickViewComponent.currentProduct = prod;
    QuickViewComponent.selectedSize = "M";
    QuickViewComponent.selectedColor = (prod.colors && prod.colors.length > 0) ? prod.colors[0].name : "Signature";

    const backdrop = document.getElementById("quick-view-backdrop");
    const container = document.getElementById("quick-view-content");
    if (!backdrop || !container) return;

    const formattedPrice = currencyService.format(prod.price);
    const formattedOldPrice = prod.oldPrice ? currencyService.format(prod.oldPrice) : null;

    container.innerHTML = `
      <div class="quick-view-gallery">
        <img src="${prod.image}" alt="${prod.name}" />
      </div>
      <div class="quick-view-info">
        <span class="quick-view-meta">${prod.category} Capsule</span>
        <h2 class="quick-view-title">${prod.name}</h2>
        <div class="quick-view-price">
          <span>${formattedPrice}</span>
          ${formattedOldPrice ? `<span class="original-price">${formattedOldPrice}</span>` : ""}
        </div>
        <p class="quick-view-desc">${prod.desc}</p>
        
        <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; display: flex; justify-content: space-between;">
          <span>Select Colorway</span>
          <span id="quick-view-color-label" style="color: var(--primary); text-transform: none;">${QuickViewComponent.selectedColor}</span>
        </div>
        <div class="color-selector" style="display: flex; gap: 10px; margin-bottom: 14px;">
          ${(prod.colors || []).map((c, idx) => `
            <button type="button" class="color-swatch-btn ${idx === 0 ? 'active' : ''}" 
                    data-color="${c.name}" 
                    title="${c.name}" 
                    onclick="window.__aura.selectQuickViewColor('${c.name}', this)">
              <span class="color-swatch-inner" style="background-color: ${c.hex};"></span>
            </button>
          `).join("")}
        </div>

        <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
          Select Size
        </div>
        <div class="quick-view-sizes">
          ${["XS", "S", "M", "L", "XL"].map(size => `
            <button class="quick-view-size-btn ${size === 'M' ? 'active' : ''}" onclick="window.__aura.selectQuickViewSize('${size}', this)">
              ${size}
            </button>
          `).join("")}
        </div>

        <div class="quick-view-actions">
          <button class="btn btn-primary" onclick="window.__aura.addQuickViewToBag()">
            Add to Bag • ${formattedPrice}
          </button>
          <a href="product.html?id=${prod.id}" class="btn btn-secondary" style="flex: 0 0 auto; padding: 12px 18px;">
            Full Details →
          </a>
        </div>
      </div>
    `;

    backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  static selectSize(size, btnEl) {
    QuickViewComponent.selectedSize = size;
    document.querySelectorAll(".quick-view-size-btn").forEach(b => b.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");
  }

  static selectColor(color, btnEl) {
    QuickViewComponent.selectedColor = color;
    const label = document.getElementById("quick-view-color-label");
    if (label) label.textContent = color;
    const parent = btnEl ? btnEl.parentElement : null;
    if (parent) {
      parent.querySelectorAll(".color-swatch-btn").forEach(b => b.classList.remove("active"));
      btnEl.classList.add("active");
    }
  }

  static addToBag() {
    if (!QuickViewComponent.currentProduct) return;
    const prod = QuickViewComponent.currentProduct;
    cartService.addItem(prod, 1, QuickViewComponent.selectedSize, QuickViewComponent.selectedColor);
    ToastComponent.show(`Added "${prod.name}" (${QuickViewComponent.selectedColor} • Size ${QuickViewComponent.selectedSize}) to your bag.`);
    QuickViewComponent.close();
    CartDrawerComponent.open();
  }

  static close() {
    const backdrop = document.getElementById("quick-view-backdrop");
    if (backdrop) backdrop.classList.remove("active");
    document.body.style.overflow = "";
    QuickViewComponent.currentProduct = null;
  }
}
