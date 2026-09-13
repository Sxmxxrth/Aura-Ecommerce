/**
 * ============================================================================
 * AURA Modern Fashion - Main JavaScript (main.js)
 * ============================================================================
 * Student / Intern Project: Modern Fashion E-Commerce Website
 * Author: Intern Developer
 * Description: Clean, well-structured frontend logic for shopping cart,
 * wishlist, search, product filters, dynamic product pages, reviews, and modals.
 * ============================================================================
 */

// ============================================================================
// 1. GLOBAL SETTINGS & CONFIGURATION
// ============================================================================
const CONFIG = {
  storeName: "AURA",
  currency: "₹",
  freeShippingAbove: 3000,
  promoCode: "SAVE20",
  discountPercentage: 20,
  storageKeys: {
    cart: "aura_intern_cart",
    wishlist: "aura_intern_wishlist",
    promo: "aura_intern_promo"
  }
};

// Global active states for Shop Page
let activeCategory = "all";
let currentSort = "featured";

// Global active state for Product Detail Page
let pdpSelectedSize = "M";
let pdpSelectedColor = "Default";

// ============================================================================
// 2. HELPER FUNCTIONS
// ============================================================================

// Format price with Indian Rupee symbol (e.g. 4999 -> ₹4,999)
function formatPrice(amount) {
  const num = Number(amount) || 0;
  return CONFIG.currency + num.toLocaleString("en-IN");
}

// Show a friendly popup notification (Toast)
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  // Auto remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.add("toast-hide");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Simple HTML escaping helper to prevent script injection in user reviews
function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ============================================================================
// 3. LOCAL STORAGE DATA HELPERS (CART & WISHLIST)
// ============================================================================

// Get cart array from localStorage
function getCart() {
  try {
    const data = localStorage.getItem(CONFIG.storageKeys.cart);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Could not read cart from localStorage", err);
    return [];
  }
}

// Save cart array to localStorage
function saveCart(cart) {
  try {
    localStorage.setItem(CONFIG.storageKeys.cart, JSON.stringify(cart));
  } catch (err) {
    console.error("Could not save cart to localStorage", err);
  }
}

// Get wishlist IDs array from localStorage
function getWishlist() {
  try {
    const data = localStorage.getItem(CONFIG.storageKeys.wishlist);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Could not read wishlist from localStorage", err);
    return [];
  }
}

// Save wishlist IDs array to localStorage
function saveWishlist(wishlist) {
  try {
    localStorage.setItem(CONFIG.storageKeys.wishlist, JSON.stringify(wishlist));
  } catch (err) {
    console.error("Could not save wishlist to localStorage", err);
  }
}

// Get applied promo code from localStorage
function getAppliedPromo() {
  return localStorage.getItem(CONFIG.storageKeys.promo) || null;
}

// Save applied promo code to localStorage
function saveAppliedPromo(code) {
  if (code) {
    localStorage.setItem(CONFIG.storageKeys.promo, code);
  } else {
    localStorage.removeItem(CONFIG.storageKeys.promo);
  }
}

// ============================================================================
// 4. SHOPPING CART LOGIC
// ============================================================================

// Open Cart Drawer
function openCart() {
  const drawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  if (drawer) drawer.classList.add("active");
  if (backdrop) backdrop.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent background scroll
}

// Close Cart Drawer
function closeCart() {
  const drawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  if (drawer) drawer.classList.remove("active");
  if (backdrop) backdrop.classList.remove("active");
  document.body.style.overflow = "";
}

// Add item to cart
function addToCart(productId, size = null, color = null, quantity = 1) {
  const product = (window.PRODUCTS || []).find(p => p.id === Number(productId));
  if (!product) return;

  const chosenSize = size || (product.sizes && product.sizes[0] ? product.sizes[0] : "M");
  const chosenColor = color || (product.colors && product.colors[0] ? product.colors[0].name : "Standard");

  const cart = getCart();

  // Check if same product with same size and color is already in cart
  const existingIndex = cart.findIndex(
    item => item.id === product.id && item.size === chosenSize && item.color === chosenColor
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      size: chosenSize,
      color: chosenColor,
      quantity: quantity
    });
  }

  saveCart(cart);
  updateCartBadge();
  renderCart();
  showToast(`Added "${product.name}" to cart!`);
  openCart();
}

// Update quantity of a cart item
function updateCartQuantity(index, change) {
  const cart = getCart();
  if (!cart[index]) return;

  cart[index].quantity += change;

  // Remove if quantity reaches zero
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
    showToast("Item removed from cart.");
  }

  saveCart(cart);
  updateCartBadge();
  renderCart();
}

// Remove item from cart
function removeFromCart(index) {
  const cart = getCart();
  if (!cart[index]) return;

  const itemName = cart[index].name;
  cart.splice(index, 1);
  saveCart(cart);
  updateCartBadge();
  renderCart();
  showToast(`Removed "${itemName}" from cart.`);
}

// Apply promo code (SAVE20 or ATELIER20)
function applyPromo() {
  const input = document.getElementById("cart-promo-input");
  if (!input) return;

  const code = input.value.trim().toUpperCase();
  if (code === CONFIG.promoCode || code === "ATELIER20") {
    saveAppliedPromo(code);
    renderCart();
    showToast(`Promo code "${code}" applied! 20% discount added.`);
  } else {
    showToast("Invalid code. Try using SAVE20 for 20% off!");
  }
}

// Remove applied promo code
function removePromo() {
  saveAppliedPromo(null);
  renderCart();
  showToast("Promo code removed.");
}

// Clear entire cart
function clearCart() {
  saveCart([]);
  saveAppliedPromo(null);
  updateCartBadge();
  renderCart();
}

// Update cart counter badge in navbar
function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;

  const cart = getCart();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? "inline-flex" : "none";
}

// Render the cart drawer contents
function renderCart() {
  const list = document.getElementById("cart-items-list");
  const shippingNotice = document.getElementById("cart-shipping-notice");
  const promoWrapper = document.getElementById("cart-promo-wrapper");
  const breakdown = document.getElementById("cart-breakdown");
  const totalEl = document.getElementById("cart-total-price");
  const footer = document.getElementById("cart-drawer-footer");

  if (!list) return;

  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const promoCode = getAppliedPromo();

  // If cart is empty
  if (cart.length === 0) {
    list.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-cart-icon">🛒</div>
        <h3>Your shopping cart is empty</h3>
        <p>Looks like you haven't added any clothing items yet.</p>
        <a href="shop.html" class="btn btn-primary" onclick="closeCart()">Browse Shop</a>
      </div>
    `;

    if (shippingNotice) shippingNotice.innerHTML = "";
    if (footer) footer.style.display = "none";
    if (totalEl) totalEl.textContent = "₹0";
    return;
  }

  // Cart has items: Show footer
  if (footer) footer.style.display = "block";

  // Free shipping progress calculation
  if (shippingNotice) {
    const diff = CONFIG.freeShippingAbove - subtotal;
    const progressPercent = Math.min(100, Math.round((subtotal / CONFIG.freeShippingAbove) * 100));

    if (diff <= 0) {
      shippingNotice.innerHTML = `
        <div class="shipping-bar-wrap">
          <div class="shipping-bar-fill" style="width: 100%;"></div>
        </div>
        <div class="shipping-text unlocked">🎉 Congratulations! You have unlocked FREE Delivery!</div>
      `;
    } else {
      shippingNotice.innerHTML = `
        <div class="shipping-bar-wrap">
          <div class="shipping-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>
        <div class="shipping-text">
          Add <strong>${formatPrice(diff)}</strong> more for <strong>FREE Delivery</strong>
        </div>
      `;
    }
  }

  // Render items list
  list.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-meta">Size: <strong>${item.size}</strong> • Color: <strong>${item.color}</strong></div>
        <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
        <div class="cart-item-actions">
          <div class="qty-control">
            <button type="button" onclick="updateCartQuantity(${index}, -1)" aria-label="Decrease quantity">-</button>
            <span>${item.quantity}</span>
            <button type="button" onclick="updateCartQuantity(${index}, 1)" aria-label="Increase quantity">+</button>
          </div>
          <button type="button" class="cart-item-remove-btn" onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    </div>
  `).join("");

  // Calculate discount & totals
  let discountAmount = 0;
  if (promoCode) {
    discountAmount = Math.round((subtotal * CONFIG.discountPercentage) / 100);
  }
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Promo code section
  if (promoWrapper) {
    if (promoCode) {
      promoWrapper.innerHTML = `
        <div class="promo-applied-badge">
          <span>🏷️ Code <strong>${escapeHtml(promoCode)}</strong> (-${CONFIG.discountPercentage}%) Applied</span>
          <button type="button" onclick="removePromo()" class="promo-remove-btn" title="Remove promo code">✕</button>
        </div>
      `;
    } else {
      promoWrapper.innerHTML = `
        <div class="promo-input-row">
          <input type="text" id="cart-promo-input" placeholder="Promo code (SAVE20)" aria-label="Promo code" onkeydown="if(event.key==='Enter'){event.preventDefault();applyPromo();}" />
          <button type="button" onclick="applyPromo()" class="btn btn-secondary promo-apply-btn">Apply</button>
        </div>
      `;
    }
  }

  // Cost breakdown
  if (breakdown) {
    const isFreeShipping = subtotal >= CONFIG.freeShippingAbove;
    breakdown.innerHTML = `
      <div class="breakdown-row">
        <span>Subtotal</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
      ${promoCode ? `
        <div class="breakdown-row discount">
          <span>Discount (${CONFIG.discountPercentage}%)</span>
          <span>-${formatPrice(discountAmount)}</span>
        </div>
      ` : ""}
      <div class="breakdown-row">
        <span>Estimated Delivery</span>
        <span>${isFreeShipping ? '<strong style="color: #16a34a;">FREE</strong>' : formatPrice(199)}</span>
      </div>
    `;
  }

  // Final total
  if (totalEl) {
    totalEl.textContent = formatPrice(finalTotal);
  }
}

// Checkout alert button
function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }

  const promoCode = getAppliedPromo();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promoCode ? Math.round((subtotal * CONFIG.discountPercentage) / 100) : 0;
  const total = subtotal - discount;

  alert(
    `Order Placed Successfully!\n\n` +
    `Items count: ${cart.length}\n` +
    `Subtotal: ${formatPrice(subtotal)}\n` +
    (promoCode ? `Discount (-20%): -${formatPrice(discount)}\n` : "") +
    `Final Total: ${formatPrice(total)}\n\n` +
    `Thank you for shopping with AURA Clothing!`
  );

  clearCart();
  closeCart();
}

// ============================================================================
// 5. WISHLIST LOGIC
// ============================================================================

// Open Wishlist Drawer
function openWishlist() {
  const drawer = document.getElementById("wishlist-drawer");
  const backdrop = document.getElementById("wishlist-backdrop");
  if (drawer) drawer.classList.add("active");
  if (backdrop) backdrop.classList.add("active");
  document.body.style.overflow = "hidden";
  renderWishlist();
}

// Close Wishlist Drawer
function closeWishlist() {
  const drawer = document.getElementById("wishlist-drawer");
  const backdrop = document.getElementById("wishlist-backdrop");
  if (drawer) drawer.classList.remove("active");
  if (backdrop) backdrop.classList.remove("active");
  document.body.style.overflow = "";
}

// Check if a product ID is in wishlist
function isInWishlist(id) {
  const list = getWishlist();
  return list.includes(Number(id));
}

// Toggle product in/out of wishlist
function toggleWishlist(productId) {
  const id = Number(productId);
  let list = getWishlist();
  const product = (window.PRODUCTS || []).find(p => p.id === id);
  const productName = product ? product.name : "Product";

  if (list.includes(id)) {
    list = list.filter(item => item !== id);
    showToast(`Removed "${productName}" from wishlist.`);
  } else {
    list.push(id);
    showToast(`Saved "${productName}" to wishlist!`);
  }

  saveWishlist(list);
  updateWishlistBadge();
  updateWishlistHeartIcons();
  renderWishlist();
}

// Move wishlist item to cart
function moveWishlistToCart(productId) {
  const product = (window.PRODUCTS || []).find(p => p.id === Number(productId));
  if (product) {
    addToCart(product.id);
    toggleWishlist(product.id); // remove from wishlist
    closeWishlist();
  }
}

// Update wishlist counter badge in navbar
function updateWishlistBadge() {
  const badge = document.getElementById("wishlist-badge");
  if (!badge) return;

  const list = getWishlist();
  badge.textContent = list.length;
  badge.style.display = list.length > 0 ? "inline-flex" : "none";
}

// Update heart icons across cards on the page
function updateWishlistHeartIcons() {
  const list = getWishlist();
  document.querySelectorAll("[data-wishlist-id]").forEach(btn => {
    const id = Number(btn.getAttribute("data-wishlist-id"));
    const isSaved = list.includes(id);
    btn.classList.toggle("active", isSaved);
    const svg = btn.querySelector("svg");
    if (svg) {
      svg.setAttribute("fill", isSaved ? "#ef4444" : "none");
      svg.setAttribute("stroke", isSaved ? "#ef4444" : "currentColor");
    }
  });
}

// Render wishlist items in the wishlist drawer
function renderWishlist() {
  const listEl = document.getElementById("wishlist-items-list");
  if (!listEl) return;

  const savedIds = getWishlist();
  const products = (window.PRODUCTS || []).filter(p => savedIds.includes(p.id));

  if (products.length === 0) {
    listEl.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-cart-icon">🤍</div>
        <h3>Your wishlist is empty</h3>
        <p>Save items you like by clicking the heart icon on any product.</p>
        <a href="shop.html" class="btn btn-primary" onclick="closeWishlist()">Explore Shop</a>
      </div>
    `;
    return;
  }

  listEl.innerHTML = products.map(prod => `
    <div class="cart-item">
      <img src="${prod.image}" alt="${prod.name}" class="cart-item-img" />
      <div class="cart-item-info">
        <h4 class="cart-item-title">${prod.name}</h4>
        <div class="cart-item-price">${formatPrice(prod.price)}</div>
        <div class="cart-item-actions" style="margin-top: 8px;">
          <button type="button" class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;" onclick="moveWishlistToCart(${prod.id})">
            Move to Cart
          </button>
          <button type="button" class="cart-item-remove-btn" onclick="toggleWishlist(${prod.id})">
            Remove
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// ============================================================================
// 6. SEARCH MODAL FUNCTIONALITY
// ============================================================================

// Open Search Modal
function openSearch() {
  const modal = document.getElementById("search-modal-backdrop");
  const input = document.getElementById("search-modal-input");
  if (modal) modal.classList.add("active");
  if (input) {
    input.value = "";
    setTimeout(() => input.focus(), 100);
  }
  document.body.style.overflow = "hidden";
  renderSearchResults("");
}

// Close Search Modal
function closeSearch() {
  const modal = document.getElementById("search-modal-backdrop");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";
}

// Filter and render search results inside search modal
function renderSearchResults(query) {
  const resultsContainer = document.getElementById("search-modal-results");
  if (!resultsContainer) return;

  const cleanQuery = query.toLowerCase().trim();
  const all = window.PRODUCTS || [];

  const matched = cleanQuery
    ? all.filter(p => p.name.toLowerCase().includes(cleanQuery) || p.desc.toLowerCase().includes(cleanQuery) || p.category.toLowerCase().includes(cleanQuery))
    : all.slice(0, 4); // Show top 4 items if empty query

  if (matched.length === 0) {
    resultsContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <p style="font-size: 15px; color: var(--text-dark); margin-bottom: 4px;">No products found for "${escapeHtml(query)}"</p>
        <span style="font-size: 13px;">Try searching for "trench", "blazer", "shirt", or "sweater".</span>
      </div>
    `;
    return;
  }

  resultsContainer.innerHTML = matched.map(prod => `
    <div class="search-result-item" onclick="window.location.href='product.html?id=${prod.id}'">
      <img src="${prod.image}" alt="${prod.name}" />
      <div class="search-result-info">
        <h4>${prod.name}</h4>
        <span class="search-result-category">${prod.category.toUpperCase()}</span>
        <div class="search-result-price">${formatPrice(prod.price)}</div>
      </div>
      <span class="search-result-arrow">→</span>
    </div>
  `).join("");
}

// ============================================================================
// 7. QUICK VIEW MODAL
// ============================================================================

let qvSelectedSize = "M";
let qvSelectedColor = "Default";
let qvCurrentProduct = null;

// Open Quick View Modal
function openQuickView(productId) {
  const product = (window.PRODUCTS || []).find(p => p.id === Number(productId));
  if (!product) return;

  qvCurrentProduct = product;
  qvSelectedSize = product.sizes && product.sizes[0] ? product.sizes[0] : "M";
  qvSelectedColor = product.colors && product.colors[0] ? product.colors[0].name : "Standard";

  const modal = document.getElementById("quick-view-backdrop");
  const content = document.getElementById("quick-view-content");
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="quick-view-modal-grid">
      <div class="quick-view-image-wrap">
        <img src="${product.image}" alt="${product.name}" id="qv-main-img" />
      </div>
      <div class="quick-view-details">
        <span class="product-category-tag">${product.category.toUpperCase()}</span>
        <h2 class="quick-view-title">${product.name}</h2>
        <div class="product-price" style="font-size: 20px; margin: 8px 0 14px;">
          ${formatPrice(product.price)}
          ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ""}
        </div>
        <p class="quick-view-desc">${product.desc}</p>

        <!-- Color Selector -->
        <div class="option-block">
          <label>Color: <strong id="qv-color-label">${qvSelectedColor}</strong></label>
          <div class="color-options-row">
            ${(product.colors || []).map((c, idx) => `
              <button type="button" class="color-swatch ${idx === 0 ? 'active' : ''}" 
                      style="background-color: ${c.hex};" 
                      title="${c.name}"
                      onclick="selectQuickViewColor('${c.name}', this)">
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Size Selector -->
        <div class="option-block">
          <label>Size: <strong id="qv-size-label">${qvSelectedSize}</strong></label>
          <div class="size-options-row">
            ${(product.sizes || ["XS", "S", "M", "L", "XL"]).map((s, idx) => `
              <button type="button" class="size-btn ${idx === 0 ? 'active' : ''}" 
                      onclick="selectQuickViewSize('${s}', this)">
                ${s}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Actions -->
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn btn-primary" style="flex: 1;" onclick="addQuickViewToCart()">
            Add to Cart
          </button>
          <a href="product.html?id=${product.id}" class="btn btn-secondary">
            View Details
          </a>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Select size in Quick View
function selectQuickViewSize(size, btn) {
  qvSelectedSize = size;
  const label = document.getElementById("qv-size-label");
  if (label) label.textContent = size;
  const parent = btn ? btn.parentElement : null;
  if (parent) {
    parent.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  }
}

// Select color in Quick View
function selectQuickViewColor(color, btn) {
  qvSelectedColor = color;
  const label = document.getElementById("qv-color-label");
  if (label) label.textContent = color;
  const parent = btn ? btn.parentElement : null;
  if (parent) {
    parent.querySelectorAll(".color-swatch").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  }
}

// Add from Quick View to Cart
function addQuickViewToCart() {
  if (!qvCurrentProduct) return;
  addToCart(qvCurrentProduct.id, qvSelectedSize, qvSelectedColor);
  closeQuickView();
}

// Close Quick View
function closeQuickView() {
  const modal = document.getElementById("quick-view-backdrop");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";
  qvCurrentProduct = null;
}

// ============================================================================
// 8. SIZE GUIDE & MOBILE MENU MODALS
// ============================================================================

// Open Size Guide Modal
function openSizeGuide() {
  const modal = document.getElementById("size-modal-backdrop");
  if (modal) modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close Size Guide Modal
function closeSizeGuide() {
  const modal = document.getElementById("size-modal-backdrop");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";
}

// Mobile Hamburger Menu Toggle
function toggleMobileMenu() {
  const nav = document.getElementById("nav-links");
  const backdrop = document.getElementById("nav-backdrop");
  if (nav) nav.classList.toggle("active");
  if (backdrop) backdrop.classList.toggle("active");
}

// Close Mobile Menu
function closeMobileMenu() {
  const nav = document.getElementById("nav-links");
  const backdrop = document.getElementById("nav-backdrop");
  if (nav) nav.classList.remove("active");
  if (backdrop) backdrop.classList.remove("active");
}

// ============================================================================
// 9. PROMOTIONAL COUNTDOWN TIMER
// ============================================================================

// Sets up a clean 48-hour countdown timer on the Home page
function initCountdownTimer() {
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");
  const secsEl = document.getElementById("cd-secs");

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // 48 hours in the future
  const targetTime = new Date().getTime() + (48 * 60 * 60 * 1000);

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetTime - now;

    if (distance <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minsEl.textContent = String(minutes).padStart(2, "0");
    secsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// ============================================================================
// 10. PRODUCT CARD TEMPLATE (USED ON HOME & SHOP PAGES)
// ============================================================================

// Creates standard product card HTML
function createProductCardHtml(product) {
  const isSaved = isInWishlist(product.id);
  const heartColor = isSaved ? "#ef4444" : "currentColor";
  const heartFill = isSaved ? "#ef4444" : "none";
  const secondaryImage = product.images && product.images.length > 1 ? product.images[1] : product.image;

  return `
    <div class="product-card">
      <div class="product-image-container">
        ${product.oldPrice ? '<span class="badge badge-sale">Sale</span>' : (product.isNew ? '<span class="badge badge-new">New</span>' : '')}
        
        <button type="button" class="wishlist-btn ${isSaved ? 'active' : ''}" 
                data-wishlist-id="${product.id}" 
                onclick="toggleWishlist(${product.id})" 
                aria-label="Save to Wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${heartFill}" stroke="${heartColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" class="product-img-primary" loading="lazy" />
          <img src="${secondaryImage}" alt="${product.name} back view" class="product-img-secondary" loading="lazy" />
        </a>

        <button type="button" class="quick-view-hover-btn" onclick="openQuickView(${product.id})">
          Quick View
        </button>
      </div>

      <div class="product-info">
        <span class="product-category">${product.category.toUpperCase()}</span>
        <h3 class="product-name">
          <a href="product.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="product-rating">
          ★★★★★ <span>(${product.reviewsCount || 24})</span>
        </div>
        <div class="product-price">
          ${formatPrice(product.price)}
          ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ""}
        </div>
        <div class="product-actions">
          <button type="button" class="btn btn-primary" onclick="addToCart(${product.id})">
            Add to Cart
          </button>
          <a href="product.html?id=${product.id}" class="btn btn-secondary">
            Details
          </a>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// 11. PAGE-SPECIFIC INITIALIZATIONS
// ============================================================================

// 1. Home Page Init
function initHomePage() {
  const container = document.getElementById("home-products");
  if (!container) return;

  const products = window.PRODUCTS || [];
  container.innerHTML = products.slice(0, 4).map(createProductCardHtml).join("");
  initCountdownTimer();
}

// 2. Shop Page Init
function initShopPage() {
  const container = document.getElementById("shop-products");
  if (!container) return;

  // Check URL category parameter (?category=women, men, new-arrivals)
  const params = new URLSearchParams(window.location.search);
  if (params.has("category")) {
    let cat = params.get("category").toLowerCase();
    if (cat === "new") cat = "new-arrivals";
    activeCategory = cat;

    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    const activeBtn = document.querySelector(`.filter-btn[data-category="${cat}"]`);
    if (activeBtn) activeBtn.classList.add("active");
  }

  // Search input listener
  const searchInput = document.getElementById("search-box");
  if (searchInput) {
    searchInput.addEventListener("input", () => renderShopProducts());
  }

  // Sort dropdown listener
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderShopProducts();
    });
  }

  // Grid density toggle
  const gridBtn = document.getElementById("grid-toggle-btn");
  if (gridBtn) {
    gridBtn.addEventListener("click", () => {
      container.classList.toggle("grid-compact");
      gridBtn.textContent = container.classList.contains("grid-compact") ? "▦ Normal Grid" : "▦ Compact Grid";
    });
  }

  renderShopProducts();
}

// Filter category on Shop Page
function filterCategory(categoryName, btn) {
  activeCategory = categoryName;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderShopProducts();
}

// Reset filters on Shop Page
function resetShopFilters() {
  activeCategory = "all";
  currentSort = "featured";
  const searchInput = document.getElementById("search-box");
  if (searchInput) searchInput.value = "";
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) sortSelect.value = "featured";
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  const allBtn = document.querySelector('.filter-btn[data-category="all"]');
  if (allBtn) allBtn.classList.add("active");
  renderShopProducts();
}

// Render filtered and sorted products on Shop Page
function renderShopProducts() {
  const container = document.getElementById("shop-products");
  const countEl = document.getElementById("shop-product-count");
  if (!container) return;

  const searchInput = document.getElementById("search-box");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const allProducts = window.PRODUCTS || [];

  let filtered = allProducts.filter(p => {
    let matchesCategory = false;
    if (activeCategory === "all") {
      matchesCategory = true;
    } else if (activeCategory === "new-arrivals" || activeCategory === "new") {
      matchesCategory = !!p.isNew;
    } else {
      matchesCategory = p.category.toLowerCase() === activeCategory.toLowerCase();
    }

    const matchesSearch = p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  // Sorting
  if (currentSort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} product${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div style="font-size: 32px; margin-bottom: 12px;">🔍</div>
        <h3 style="margin-bottom: 8px;">No products found</h3>
        <p style="color: #64748b; margin-bottom: 16px;">Try adjusting your search terms or filters.</p>
        <button type="button" class="btn btn-secondary" onclick="resetShopFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(createProductCardHtml).join("");
}

// 3. Product Detail Page Init
function initProductPage() {
  const titleEl = document.getElementById("pdp-title");
  if (!titleEl) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10) || 1;
  const product = (window.PRODUCTS || []).find(p => p.id === id) || (window.PRODUCTS || [])[0];

  if (!product) return;

  // Hydrate text details
  document.getElementById("pdp-title").textContent = product.name;
  document.getElementById("pdp-category").textContent = product.category.toUpperCase();
  document.getElementById("pdp-price").textContent = formatPrice(product.price);
  document.getElementById("pdp-desc").textContent = product.desc;

  // Breadcrumbs
  const bcCat = document.getElementById("pdp-breadcrumb-cat");
  const bcName = document.getElementById("pdp-breadcrumb-name");
  if (bcCat) bcCat.textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
  if (bcName) bcName.textContent = product.name;

  // Main image
  const mainImg = document.getElementById("pdp-main-img");
  if (mainImg) {
    mainImg.src = product.image;
    mainImg.alt = product.name;
  }

  // Thumbnails gallery
  const thumbsContainer = document.getElementById("pdp-thumbs");
  if (thumbsContainer && product.images) {
    thumbsContainer.innerHTML = product.images.map((img, idx) => `
      <img src="${img}" alt="${product.name} angle ${idx + 1}" 
           class="pdp-thumb ${idx === 0 ? 'active' : ''}" 
           onclick="changePdpImage('${img}', this)" />
    `).join("");
  }

  // Color selection
  const colorContainer = document.getElementById("pdp-color-selector");
  const colorLabel = document.getElementById("pdp-selected-color");
  pdpSelectedColor = product.colors && product.colors[0] ? product.colors[0].name : "Standard";
  if (colorLabel) colorLabel.textContent = pdpSelectedColor;

  if (colorContainer && product.colors) {
    colorContainer.innerHTML = product.colors.map((c, idx) => `
      <button type="button" class="color-swatch ${idx === 0 ? 'active' : ''}" 
              style="background-color: ${c.hex};" 
              title="${c.name}"
              onclick="selectPdpColor('${c.name}', this)">
      </button>
    `).join("");
  }

  // Size selection
  const sizeContainer = document.getElementById("pdp-size-selector") || document.querySelector(".size-selector");
  const availableSizes = product.sizes || ["XS", "S", "M", "L", "XL"];
  pdpSelectedSize = availableSizes[0];

  if (sizeContainer) {
    sizeContainer.innerHTML = availableSizes.map((s, idx) => `
      <button type="button" class="size-btn ${idx === 0 ? 'active' : ''}" 
              onclick="selectPdpSize('${s}', this)">
        ${s}
      </button>
    `).join("");
  }

  const stockNotice = document.getElementById("pdp-stock-notice");
  if (stockNotice) {
    stockNotice.textContent = `In Stock: Limited quantities available in Size ${pdpSelectedSize}`;
  }

  // Add to Cart button on PDP
  const addBtn = document.getElementById("pdp-add-btn");
  if (addBtn) {
    addBtn.onclick = () => {
      addToCart(product.id, pdpSelectedSize, pdpSelectedColor);
    };
  }

  // Mobile sticky buy bar updates
  const stickyName = document.getElementById("sticky-bar-name");
  const stickyPrice = document.getElementById("sticky-bar-price");
  if (stickyName) stickyName.textContent = product.name;
  if (stickyPrice) stickyPrice.textContent = formatPrice(product.price);

  // Show sticky bar on scroll
  const stickyBar = document.getElementById("mobile-sticky-bar");
  if (addBtn && stickyBar) {
    window.addEventListener("scroll", () => {
      const rect = addBtn.getBoundingClientRect();
      if (rect.bottom < 0) {
        stickyBar.classList.add("visible");
      } else {
        stickyBar.classList.remove("visible");
      }
    }, { passive: true });
  }

  // Related products recommendation
  const relatedContainer = document.getElementById("related-products");
  if (relatedContainer) {
    const related = (window.PRODUCTS || []).filter(p => p.id !== product.id).slice(0, 3);
    relatedContainer.innerHTML = related.map(createProductCardHtml).join("");
  }

  // Accordion specifications toggle
  document.querySelectorAll(".accordion-header").forEach(hdr => {
    hdr.addEventListener("click", () => {
      const parent = hdr.parentElement;
      parent.classList.toggle("active");
    });
  });
}

// Switch main image when thumbnail is clicked
function changePdpImage(src, thumb) {
  const main = document.getElementById("pdp-main-img");
  if (main) main.src = src;
  document.querySelectorAll(".pdp-thumb").forEach(t => t.classList.remove("active"));
  if (thumb) thumb.classList.add("active");
}

// Select size on PDP
function selectPdpSize(size, btn) {
  pdpSelectedSize = size;
  const parent = btn ? btn.parentElement : null;
  if (parent) {
    parent.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  }
  const stockNotice = document.getElementById("pdp-stock-notice");
  if (stockNotice) {
    stockNotice.textContent = `In Stock: Limited quantities available in Size ${pdpSelectedSize}`;
  }
}

// Select color on PDP
function selectPdpColor(color, btn) {
  pdpSelectedColor = color;
  const label = document.getElementById("pdp-selected-color");
  if (label) label.textContent = color;
  const parent = btn ? btn.parentElement : null;
  if (parent) {
    parent.querySelectorAll(".color-swatch").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  }
}

// Submit a customer review
function submitReview(event) {
  event.preventDefault();
  const nameInput = document.getElementById("rev-name");
  const commentInput = document.getElementById("rev-comment");

  if (!nameInput || !commentInput) return;

  const name = nameInput.value.trim();
  const comment = commentInput.value.trim();

  if (name && comment) {
    const list = document.getElementById("reviews-list");
    if (list) {
      const item = document.createElement("div");
      item.className = "review-item";
      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <strong class="review-author">${escapeHtml(name)}</strong>
          <span style="color: #f59e0b; font-size: 13px;">★★★★★</span>
        </div>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6;">"${escapeHtml(comment)}"</p>
      `;
      list.prepend(item);
    }

    showToast("Thank you! Your review has been submitted.");
    nameInput.value = "";
    commentInput.value = "";
  }
}

// Submit contact form on Contact page
function submitContact(event) {
  event.preventDefault();
  const name = document.getElementById("contact-name") ? document.getElementById("contact-name").value : "there";
  showToast(`Thank you, ${name}! Your message has been sent. We'll reply soon.`);
  event.target.reset();
}

// Submit newsletter subscription
function subscribeNewsletter(event) {
  event.preventDefault();
  const input = event.target.querySelector("input[type='email']");
  if (input && input.value) {
    showToast(`Welcome! Use code SAVE20 for 20% off your first order.`);
    input.value = "";
  }
}

// ============================================================================
// 12. INITIALIZATION ON DOM READY
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Update badges on load
  updateCartBadge();
  updateWishlistBadge();
  updateWishlistHeartIcons();
  renderCart();

  // Initialize active page
  initHomePage();
  initShopPage();
  initProductPage();

  // Search modal key shortcuts (/ or Cmd+K)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSearch();
      closeCart();
      closeWishlist();
      closeQuickView();
      closeSizeGuide();
      closeMobileMenu();
    } else if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      e.preventDefault();
      openSearch();
    }
  });

  // Live input filter inside Search Modal
  const modalSearchInput = document.getElementById("search-modal-input");
  if (modalSearchInput) {
    modalSearchInput.addEventListener("input", (e) => {
      renderSearchResults(e.target.value);
    });
  }
});

// ============================================================================
// 13. GLOBAL BRIDGES (Supports inline onclick handlers on all pages)
// ============================================================================
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.openCart = openCart;
window.closeCart = closeCart;
window.applyPromo = applyPromo;
window.removePromo = removePromo;
window.checkout = checkout;

window.toggleWishlist = toggleWishlist;
window.openWishlist = openWishlist;
window.closeWishlist = closeWishlist;
window.moveWishlistToCart = moveWishlistToCart;

window.openSearch = openSearch;
window.closeSearch = closeSearch;

window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.selectQuickViewSize = selectQuickViewSize;
window.selectQuickViewColor = selectQuickViewColor;
window.addQuickViewToCart = addQuickViewToCart;

window.openSizeGuide = openSizeGuide;
window.closeSizeGuide = closeSizeGuide;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;

window.filterCategory = filterCategory;
window.resetShopFilters = resetShopFilters;
window.changePdpImage = changePdpImage;
window.selectPdpSize = selectPdpSize;
window.selectPdpColor = selectPdpColor;
window.submitReview = submitReview;
window.submitContact = submitContact;
window.subscribeNewsletter = subscribeNewsletter;

// Also attach to window.__aura for backwards compatibility
window.__aura = {
  addToCart,
  removeFromCart,
  adjustQty: updateCartQuantity,
  openCart,
  closeCart,
  applyPromo,
  removePromo,
  checkout,
  toggleWishlist,
  openWishlist,
  closeWishlist,
  moveWishlistToCart,
  openSearch,
  closeSearch,
  openQuickView,
  closeQuickView,
  selectQuickViewSize,
  selectQuickViewColor,
  addQuickViewToBag: addQuickViewToCart,
  openSizeGuide,
  closeSizeGuide,
  toggleMobileMenu,
  closeMobileMenu,
  filterCategory,
  resetShopFilters,
  changeImage: changePdpImage,
  submitReview,
  subscribeNewsletter,
  submitContact
};
