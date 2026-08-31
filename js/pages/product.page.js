/*
  =============================================
  PRODUCT DETAILS PAGE CONTROLLER (product.page.js)
  =============================================
*/

import { PRODUCTS_DATA } from "../data/products.data.js";
import { cartService } from "../services/cart.service.js";
import { CartDrawerComponent } from "../components/cart-drawer.component.js";

export class ProductPage {
  static init() {
    const titleEl = document.getElementById("pdp-title");
    if (!titleEl) return;

    // Read ?id= parameter
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10) || 1;
    const prod = PRODUCTS_DATA.find(p => p.id === id) || PRODUCTS_DATA[0];

    document.getElementById("pdp-title").textContent = prod.name;
    document.getElementById("pdp-category").textContent = `CATEGORY: ${prod.category.toUpperCase()}`;
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
        <img src="${img}" class="pdp-thumb ${idx === 0 ? 'active' : ''}" onclick="window.__aura.changeImage('${img}', this)" alt="Angle" />
      `).join("");
    }

    // Add to Bag Button
    const addBtn = document.getElementById("pdp-add-btn");
    if (addBtn) {
      addBtn.onclick = () => {
        cartService.addItem(prod, 1);
        CartDrawerComponent.open();
      };
    }
  }

  static changeImage(imgSrc, thumbEl) {
    const mainImg = document.getElementById("pdp-main-img");
    if (mainImg) mainImg.src = imgSrc;

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
        <strong>${name}</strong> <span style="color: #F39C12;">★★★★★</span>
        <p style="margin-top: 4px; color: #555;">"${comment}"</p>
      `;
      list.prepend(item);
      document.getElementById("review-form").reset();
      alert("Thank you! Your review has been added. ⭐");
    }
  }
}
