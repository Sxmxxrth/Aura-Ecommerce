/*
  =============================================
  PRODUCT DETAILS PAGE CONTROLLER (product.page.js)
  =============================================
*/

import { PRODUCTS_DATA } from "../data/products.data.js";
import { cartService } from "../services/cart.service.js";
import { CartDrawerComponent } from "../components/cart-drawer.component.js";
import { ToastComponent } from "../components/toast.component.js";

export class ProductPage {
  static currentSize = "M";

  static init() {
    const titleEl = document.getElementById("pdp-title");
    if (!titleEl) return;

    // Read ?id= parameter
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10) || 1;
    const prod = PRODUCTS_DATA.find(p => p.id === id) || PRODUCTS_DATA[0];

    document.getElementById("pdp-title").textContent = prod.name;
    document.getElementById("pdp-category").textContent = `Collection: ${prod.category.toUpperCase()}`;
    document.getElementById("pdp-price").textContent = `$${prod.price.toFixed(2)}`;
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
        <img src="${img}" class="pdp-thumb ${idx === 0 ? 'active' : ''}" onclick="window.__aura.changeImage('${img}', this)" alt="Angle ${idx + 1}" />
      `).join("");
    }

    // Size Selection Handler
    document.querySelectorAll(".size-option").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".size-option").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        ProductPage.currentSize = btn.textContent.trim();
      });
    });

    // Add to Bag Button
    const addBtn = document.getElementById("pdp-add-btn");
    if (addBtn) {
      addBtn.onclick = () => {
        cartService.addItem(prod, 1);
        ToastComponent.show(`Added "${prod.name}" (${ProductPage.currentSize}) to your bag! 🛍️`);
        CartDrawerComponent.open();
      };
    }
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
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <strong class="review-author">${name}</strong>
          <span style="color: var(--warning); font-size: 13px;">★★★★★</span>
        </div>
        <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.5;">"${comment}"</p>
      `;
      list.prepend(item);
      document.getElementById("review-form").reset();
      ToastComponent.show("Thank you! Your review was submitted. ⭐");
    }
  }
}
