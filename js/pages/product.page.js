/*
  =============================================
  PRODUCT DETAILS PAGE CONTROLLER (product.page.js)
  
  Loads product by URL query param (?id=1), handles
  thumbnail clicks, size/color choices, and review submission.
  =============================================
*/

import { PRODUCTS_DATA } from "../data/products.data.js";
import { ToastComponent } from "../components/toast.component.js";

export class ProductPage {
  static init() {
    const titleEl = document.getElementById("pdp-title");
    if (!titleEl) return;

    // Read ?id= from URL
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10) || 1;
    const product = PRODUCTS_DATA.find(p => p.id === id) || PRODUCTS_DATA[0];

    ProductPage.product = product;
    ProductPage.selectedSize = product.sizes[0];
    ProductPage.selectedColor = product.colors[0].name;

    ProductPage.renderDetails();
    ProductPage.bindEvents();
  }

  static renderDetails() {
    const { product } = ProductPage;

    document.getElementById("pdp-title").textContent = product.name;
    document.getElementById("pdp-category").textContent = `CATEGORY: ${product.category.toUpperCase()}`;
    document.getElementById("pdp-price").textContent = `$${product.price.toFixed(2)}`;
    document.getElementById("pdp-desc").textContent = product.description;

    const mainImg = document.getElementById("pdp-main-img");
    if (mainImg) {
      mainImg.src = product.image;
      mainImg.alt = product.name;
    }

    // Render image gallery thumbnails
    const thumbsContainer = document.getElementById("pdp-thumbs");
    if (thumbsContainer && product.images) {
      thumbsContainer.innerHTML = product.images.map((img, idx) => `
        <img src="${img}" class="pdp-thumb ${idx === 0 ? 'active' : ''}" alt="${product.name} angle ${idx + 1}" />
      `).join("");

      thumbsContainer.querySelectorAll(".pdp-thumb").forEach(thumb => {
        thumb.addEventListener("click", () => {
          thumbsContainer.querySelectorAll(".pdp-thumb").forEach(t => t.classList.remove("active"));
          thumb.classList.add("active");
          mainImg.src = thumb.src;
        });
      });
    }

    // Render size buttons
    const sizeContainer = document.getElementById("pdp-sizes");
    if (sizeContainer) {
      sizeContainer.innerHTML = product.sizes.map((sz, idx) => `
        <button class="size-option ${idx === 0 ? 'active' : ''}" data-size="${sz}">${sz}</button>
      `).join("");

      sizeContainer.querySelectorAll(".size-option").forEach(btn => {
        btn.addEventListener("click", () => {
          sizeContainer.querySelectorAll(".size-option").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          ProductPage.selectedSize = btn.dataset.size;
        });
      });
    }

    // Render color swatches
    const colorContainer = document.getElementById("pdp-colors");
    if (colorContainer) {
      colorContainer.innerHTML = product.colors.map((col, idx) => `
        <div class="color-option ${idx === 0 ? 'active' : ''}" style="background-color: ${col.hex};" title="${col.name}" data-color="${col.name}"></div>
      `).join("");

      colorContainer.querySelectorAll(".color-option").forEach(swatch => {
        swatch.addEventListener("click", () => {
          colorContainer.querySelectorAll(".color-option").forEach(s => s.classList.remove("active"));
          swatch.classList.add("active");
          ProductPage.selectedColor = swatch.dataset.color;
        });
      });
    }
  }

  static bindEvents() {
    const addBtn = document.getElementById("pdp-add-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        window.__auraApp.addToCart(ProductPage.product.id, ProductPage.selectedSize, ProductPage.selectedColor);
      });
    }

    const reviewForm = document.getElementById("review-form");
    if (reviewForm) {
      reviewForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const author = document.getElementById("rev-name").value.trim();
        const comment = document.getElementById("rev-comment").value.trim();

        if (author && comment) {
          const list = document.getElementById("reviews-list");
          const item = document.createElement("div");
          item.className = "review-item";
          item.innerHTML = `
            <strong>${author}</strong> <span style="color: var(--color-warning);">★★★★★</span>
            <p style="margin-top: 4px; color: var(--color-text-secondary);">"${comment}"</p>
          `;
          list.prepend(item);
          ToastComponent.show("Thank you! Your review has been submitted. ⭐");
          reviewForm.reset();
        }
      });
    }
  }
}
