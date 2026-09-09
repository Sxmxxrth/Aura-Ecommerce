/*
  =============================================
  PRODUCT DETAILS PAGE CONTROLLER (product.page.js)
  =============================================
*/

import { PRODUCTS_DATA } from "../data/products.data.js";
import { cartService } from "../services/cart.service.js";
import { CartDrawerComponent } from "../components/cart-drawer.component.js";
import { ToastComponent } from "../components/toast.component.js";
import { currencyService } from "../services/currency.service.js";
import { SizeModalComponent } from "../components/size-modal.component.js";

export class ProductPage {
  static currentSize = "S";
  static currentProduct = null;

  static init() {
    const titleEl = document.getElementById("pdp-title");
    if (!titleEl) return;

    // Read ?id= parameter
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10) || 1;
    const prod = PRODUCTS_DATA.find(p => p.id === id) || PRODUCTS_DATA[0];
    ProductPage.currentProduct = prod;

    document.getElementById("pdp-title").textContent = prod.name;
    document.getElementById("pdp-category").textContent = `${prod.category.toUpperCase()} CAPSULE`;
    document.getElementById("pdp-price").textContent = currencyService.format(prod.price);
    document.getElementById("pdp-desc").textContent = prod.desc;

    const mainImg = document.getElementById("pdp-main-img");
    if (mainImg) {
      mainImg.src = prod.image;
      mainImg.alt = prod.name;
    }

    // Thumbnails Switcher
    const thumbsContainer = document.getElementById("pdp-thumbs");
    if (thumbsContainer && prod.images) {
      thumbsContainer.innerHTML = prod.images.map((img, idx) => `
        <img src="${img}" class="pdp-thumb ${idx === 0 ? 'active' : ''}" onclick="window.__aura.changeImage('${img}', this)" alt="${prod.name} Angle ${idx + 1}" />
      `).join("");
    }

    // Size Selection Handler
    document.querySelectorAll(".size-option").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".size-option").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        ProductPage.currentSize = btn.textContent.trim();
        const stockEl = document.getElementById("pdp-stock-notice");
        if (stockEl) {
          stockEl.textContent = `Atelier Stock: Limited quantities available in Size ${ProductPage.currentSize}`;
        }
      });
    });

    // Add to Bag Button
    const addBtn = document.getElementById("pdp-add-btn");
    if (addBtn) {
      addBtn.onclick = () => {
        cartService.addItem(prod, 1);
        ToastComponent.show(`Added "${prod.name}" (Size ${ProductPage.currentSize}) to your bag.`);
        CartDrawerComponent.open();
      };
    }

    // Render "Pairs Wonderfully With" cross-sell recommendations
    const relatedContainer = document.getElementById("related-products");
    if (relatedContainer) {
      const related = PRODUCTS_DATA.filter(p => p.id !== prod.id).slice(0, 3);
      relatedContainer.innerHTML = related.map(p => `
        <div class="product-card">
          <div class="product-image-wrap" style="aspect-ratio: 4/5;">
            <a href="product.html?id=${p.id}">
              <img src="${p.image}" alt="${p.name}" loading="lazy" />
            </a>
          </div>
          <div class="product-info" style="padding: 14px;">
            <span class="product-meta">${p.category}</span>
            <h4 class="product-title" style="font-size: 15px;">
              <a href="product.html?id=${p.id}">${p.name}</a>
            </h4>
            <div class="product-price" style="margin-bottom: 10px; font-size: 14px;">${currencyService.format(p.price)}</div>
            <a href="product.html?id=${p.id}" class="btn-card btn-card-outline" style="min-height: 32px; font-size: 10px;">Discover Creation</a>
          </div>
        </div>
      `).join("");
    }

    // Currency updates
    currencyService.subscribe(() => {
      if (ProductPage.currentProduct) {
        document.getElementById("pdp-price").textContent = currencyService.format(ProductPage.currentProduct.price);
      }
    });

    // Accordion tabs logic
    document.querySelectorAll(".accordion-header").forEach(hdr => {
      hdr.addEventListener("click", () => {
        const item = hdr.parentElement;
        item.classList.toggle("active");
      });
    });
  }

  static changeImage(imgSrc, thumbEl) {
    const mainImg = document.getElementById("pdp-main-img");
    if (mainImg) {
      mainImg.style.opacity = "0.4";
      setTimeout(() => {
        mainImg.src = imgSrc;
        mainImg.style.opacity = "1";
      }, 100);
    }

    document.querySelectorAll(".pdp-thumb").forEach(t => t.classList.remove("active"));
    if (thumbEl) thumbEl.classList.add("active");
  }

  static submitReview(e) {
    e.preventDefault();
    const name = document.getElementById("rev-name").value.trim();
    const comment = document.getElementById("rev-comment").value.trim();

    if (name && comment) {
      const list = document.getElementById("reviews-list");
      const item = document.createElement("div");
      item.className = "review-item";
      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <strong class="review-author">${name}</strong>
          <span style="color: var(--accent); font-size: 13px;">★★★★★</span>
        </div>
        <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.6;">"${comment}"</p>
      `;
      list.prepend(item);
      document.getElementById("review-form").reset();
      ToastComponent.show("Thank you for submitting your patron review.");
    }
  }
}
