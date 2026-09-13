/**
 * ============================================================================
 * AURA Modern Fashion E-Commerce - Main Script (main.js)
 * ============================================================================
 * Author: Intern Developer
 * Description: Clean, modular, and beginner-friendly JavaScript implementation
 * for the AURA clothing brand e-commerce website.
 * 
 * Features Included:
 * 1. State Management with LocalStorage (Cart & Wishlist)
 * 2. Shopping Bag Drawer (Add, Remove, Quantity adjustments, Promo discount, Free shipping)
 * 3. Wishlist Drawer (Save favorite items, remove, move to bag)
 * 4. Live Search Modal & Shop Catalog Filter
 * 5. Product Detail Page (Dynamic ?id= loading, multi-angle gallery, size & color selection)
 * 6. Interactive Customer Reviews Form (Adds reviews live on page)
 * 7. Quick View Modal & Size Guide Modal
 * 8. Responsive Navigation (Mobile hamburger menu)
 * 9. Promotional Countdown Timer & Toast Notifications
 * ============================================================================
 */

// ============================================================================
// 1. CONFIGURATION & CONSTANTS
// ============================================================================
const CONFIG = {
  storeName: "AURA",
  currencySymbol: "₹",
  freeShippingThreshold: 5000,
  promoCodes: {
    "SAVE20": 20,
    "ATELIER20": 20
  },
  storageKeys: {
    cart: "aura_cart_items",
    wishlist: "aura_wishlist_ids",
    promo: "aura_applied_promo"
  }
};

// ============================================================================
// 2. HELPER UTILITIES
// ============================================================================

/**
 * Format numeric price into Indian Rupee format (e.g., 9999 -> ₹9,999)
 */
function formatPrice(amount) {
  if (typeof amount !== "number") amount = Number(amount) || 0;
  return CONFIG.currencySymbol + amount.toLocaleString("en-IN");
}

/**
 * Read data safely from localStorage with JSON parse fallback
 */
function getStorage(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallbackValue;
  } catch (err) {
    console.warn("[AURA] Could not read localStorage:", err);
    return fallbackValue;
  }
}

/**
 * Write data safely to localStorage with JSON stringify
 */
function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("[AURA] Could not write localStorage:", err);
  }
}

/**
 * Show a floating toast notification message
 */
function showToast(message, duration = 3000) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  // Trigger animation frame for CSS transition
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Automatically dismiss after specified duration
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }, duration);
}

// ============================================================================
// 3. CART SYSTEM (Shopping Bag)
// ============================================================================

/**
 * Get all current cart items
 */
function getCart() {
  return getStorage(CONFIG.storageKeys.cart, []);
}

/**
 * Save cart items to storage and re-render the cart UI
 */
function saveCart(cartItems) {
  setStorage(CONFIG.storageKeys.cart, cartItems);
  renderCart();
  updateCartBadges();
}

/**
 * Add a product to the cart with specified size and color
 */
function addToCart(productId, size = "M", color = null, quantity = 1) {
  const product = (window.PRODUCTS || []).find(p => p.id === Number(productId));
  if (!product) return;

  const chosenColor = color || (product.colors && product.colors[0] ? product.colors[0].name : "Standard");
  const chosenSize = size || "M";

  const cart = getCart();
  // Check if identical item (same ID, size, and color) is already in the cart
  const existingItem = cart.find(item => item.id === product.id && item.size === chosenSize && item.color === chosenColor);

  if (existingItem) {
    existingItem.quantity += quantity;
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
  showToast(`Added "${product.name}" (${chosenColor} • Size ${chosenSize}) to your bag.`);
  openCart();
}

/**
 * Remove an item from the cart by its index
 */
function removeFromCart(index) {
  const cart = getCart();
  if (cart[index]) {
    const removedName = cart[index].name;
    cart.splice(index, 1);
    saveCart(cart);
    showToast(`Removed "${removedName}" from your bag.`);
  }
}

/**
 * Increase or decrease quantity of an item
 */
function adjustCartQty(index, delta) {
  const cart = getCart();
  if (cart[index]) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    saveCart(cart);
  }
}

/**
 * Get the currently applied promo code
 */
function getAppliedPromo() {
  return getStorage(CONFIG.storageKeys.promo, null);
}

/**
 * Apply a promo discount code (e.g. SAVE20)
 */
function applyPromo(inputCode) {
  const code = (inputCode || (document.getElementById("cart-promo-input") ? document.getElementById("cart-promo-input").value : "")).trim().toUpperCase();
  if (!code) {
    showToast("Please enter a discount code.");
    return;
  }

  if (CONFIG.promoCodes[code]) {
    setStorage(CONFIG.storageKeys.promo, code);
    renderCart();
    showToast(`Promo code "${code}" applied (-${CONFIG.promoCodes[code]}%).`);
  } else {
    showToast("Invalid discount code. Try 'SAVE20' or 'ATELIER20'.");
  }
}

/**
 * Remove the applied promo code
 */
function removePromo() {
  setStorage(CONFIG.storageKeys.promo, null);
  renderCart();
  showToast("Promo code removed.");
}

/**
 * Update the cart badges in the header
 */
function updateCartBadges() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cart-badge");
  if (badge) {
    badge.textContent = totalCount;
    badge.style.transform = "scale(1.3)";
    setTimeout(() => { badge.style.transform = "scale(1)"; }, 200);
  }
}

/**
 * Re-render the Cart Drawer UI
 */
function renderCart() {
  const cart = getCart();
  const listEl = document.getElementById("cart-items-list");
  const totalEl = document.getElementById("cart-total-price");
  const shippingNoticeEl = document.getElementById("cart-shipping-notice");
  const footerEl = document.getElementById("cart-drawer-footer");
  const promoWrapper = document.getElementById("cart-promo-wrapper");
  const breakdownEl = document.getElementById("cart-breakdown");

  if (!listEl) return;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const promoCode = getAppliedPromo();
  let discountAmount = 0;
  let discountPercent = 0;

  if (promoCode && CONFIG.promoCodes[promoCode]) {
    discountPercent = CONFIG.promoCodes[promoCode];
    discountAmount = Math.round((subtotal * discountPercent) / 100);
  }

  const grandTotal = Math.max(0, subtotal - discountAmount);

  // Free shipping calculation
  const freeThreshold = CONFIG.freeShippingThreshold;
  const neededForFree = freeThreshold - subtotal;
  const shippingProgress = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  if (shippingNoticeEl) {
    if (cart.length === 0) {
      shippingNoticeEl.style.display = "none";
    } else if (neededForFree <= 0) {
      shippingNoticeEl.style.display = "block";
      shippingNoticeEl.innerHTML = `
        <div class="shipping-bar-wrap">
          <div class="shipping-bar-fill" style="width: 100%;"></div>
        </div>
        <div style="margin-top: 6px; color: var(--success); font-weight: 600; font-size: 11.5px; letter-spacing: 0.5px;">
          ✦ Complimentary Free Shipping Unlocked!
        </div>
      `;
    } else {
      shippingNoticeEl.style.display = "block";
      shippingNoticeEl.innerHTML = `
        <div class="shipping-bar-wrap">
          <div class="shipping-bar-fill" style="width: ${shippingProgress}%;"></div>
        </div>
        <div style="margin-top: 6px; font-size: 11.5px; color: var(--text-secondary);">
          Add <strong style="color: var(--accent);">${formatPrice(neededForFree)}</strong> more for <strong>Free Shipping</strong>
        </div>
      `;
    }
  }

  // Render empty state
  if (cart.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 56px 20px; color: var(--text-muted);">
        <div style="font-size: 38px; margin-bottom: 16px; opacity: 0.6;">🛍️</div>
        <h4 style="font-family: var(--font-serif); font-size: 22px; color: var(--primary); margin-bottom: 8px; font-weight: 500;">Your bag is empty</h4>
        <p style="font-size: 13.5px; margin-bottom: 24px; line-height: 1.6; max-width: 280px; margin-left: auto; margin-right: auto;">
          Explore our latest collection and discover timeless fashion essentials.
        </p>
        <a href="shop.html" onclick="closeCart()" class="btn btn-primary" style="font-size: 11px; padding: 12px 24px;">Explore Catalog →</a>
      </div>
    `;
    if (footerEl) footerEl.style.display = "none";
    if (totalEl) totalEl.textContent = formatPrice(0);
    return;
  }

  // Render items list
  if (footerEl) footerEl.style.display = "block";
  listEl.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-meta" style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">
          Size: <strong style="color: var(--primary);">${item.size}</strong> • Color: <strong style="color: var(--primary);">${item.color}</strong>
        </div>
        <div class="cart-item-qty">
          <span>Qty: <strong>${item.quantity}</strong></span>
          <span style="margin: 0 6px;">•</span>
          <button onclick="adjustCartQty(${index}, -1)" style="background:none; border:none; cursor:pointer; font-weight:bold; color:var(--text-secondary); padding: 2px 6px; font-size: 14px;" aria-label="Decrease quantity">-</button>
          <button onclick="adjustCartQty(${index}, 1)" style="background:none; border:none; cursor:pointer; font-weight:bold; color:var(--text-secondary); padding: 2px 6px; font-size: 14px;" aria-label="Increase quantity">+</button>
        </div>
        <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${index})" title="Remove item" aria-label="Remove item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  `).join("");

  // Promo code UI
  if (promoWrapper) {
    promoWrapper.style.display = "block";
    if (promoCode) {
      promoWrapper.innerHTML = `
        <div class="promo-applied-badge">
          <span>✦ Code <strong>${promoCode}</strong> (-${discountPercent}%) Applied</span>
          <button onclick="removePromo()" class="promo-remove-btn" title="Remove code">✕</button>
        </div>
      `;
    } else {
      promoWrapper.innerHTML = `
        <div class="promo-input-row">
          <input type="text" id="cart-promo-input" placeholder="Promo Code (SAVE20)" aria-label="Promo Code" />
          <button onclick="applyPromo()" class="promo-apply-btn">Apply</button>
        </div>
      `;
    }
  }

  // Cost breakdown
  if (breakdownEl) {
    breakdownEl.innerHTML = `
      <div class="breakdown-row">
        <span>Subtotal</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
      ${promoCode ? `
        <div class="breakdown-row discount-row">
          <span>Special Offer (-${discountPercent}%)</span>
          <span>-${formatPrice(discountAmount)}</span>
        </div>
      ` : ""}
      <div class="breakdown-row">
        <span>Standard Courier</span>
        <span>${neededForFree <= 0 ? '<strong style="color: var(--success);">Free</strong>' : 'Free over ₹5,000'}</span>
      </div>
    `;
  }

  if (totalEl) {
    totalEl.textContent = formatPrice(grandTotal);
  }
}

/**
 * Open the Cart Drawer
 */
function openCart() {
  const drawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  if (drawer) drawer.classList.add("active");
  if (backdrop) backdrop.classList.add("active");
  document.body.style.overflow = "hidden";
}

/**
 * Close the Cart Drawer
 */
function closeCart() {
  const drawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  if (drawer) drawer.classList.remove("active");
  if (backdrop) backdrop.classList.remove("active");
  document.body.style.overflow = "";
}

/**
 * Checkout simulation
 */
function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast("Your shopping bag is empty.");
    return;
  }
  const promo = getAppliedPromo();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promo && CONFIG.promoCodes[promo] ? Math.round((subtotal * CONFIG.promoCodes[promo]) / 100) : 0;
  const total = subtotal - discount;

  alert(`Thank you for shopping with AURA!\n\nOrder Confirmed!\nItems: ${cart.length}\nTotal: ${formatPrice(total)}\n\nYour package will be delivered within 3-5 business days.`);
  saveCart([]);
  removePromo();
  closeCart();
}

// ============================================================================
// 4. WISHLIST SYSTEM
// ============================================================================

/**
 * Get wishlist product IDs
 */
function getWishlist() {
  return getStorage(CONFIG.storageKeys.wishlist, []);
}

/**
 * Save wishlist product IDs
 */
function saveWishlist(ids) {
  setStorage(CONFIG.storageKeys.wishlist, ids);
  updateWishlistBadges();
  renderWishlist();
  updateWishlistButtons();
}

/**
 * Check if a product is in the wishlist
 */
function isInWishlist(productId) {
  return getWishlist().includes(Number(productId));
}

/**
 * Toggle product in wishlist
 */
function toggleWishlist(productId) {
  const id = Number(productId);
  let wishlist = getWishlist();
  const exists = wishlist.includes(id);

  if (exists) {
    wishlist = wishlist.filter(item => item !== id);
    showToast("Removed from wishlist.");
  } else {
    wishlist.push(id);
    const prod = (window.PRODUCTS || []).find(p => p.id === id);
    showToast(`Added "${prod ? prod.name : 'Product'}" to wishlist.`);
  }

  saveWishlist(wishlist);
}

/**
 * Update wishlist badges in the header
 */
function updateWishlistBadges() {
  const wishlist = getWishlist();
  const badge = document.getElementById("wishlist-badge");
  if (badge) {
    badge.textContent = wishlist.length;
    badge.style.transform = "scale(1.3)";
    setTimeout(() => { badge.style.transform = "scale(1)"; }, 200);
  }
}

/**
 * Update heart icon fill states across visible product cards
 */
function updateWishlistButtons() {
  const wishlist = getWishlist();
  document.querySelectorAll("[data-wishlist-id]").forEach(btn => {
    const id = Number(btn.getAttribute("data-wishlist-id"));
    const isSaved = wishlist.includes(id);
    const svg = btn.querySelector("svg");
    if (svg) {
      svg.setAttribute("fill", isSaved ? "#A93226" : "none");
      svg.setAttribute("stroke", isSaved ? "#A93226" : "currentColor");
    }
  });
}

/**
 * Render Wishlist Drawer
 */
function renderWishlist() {
  const listEl = document.getElementById("wishlist-items-list");
  if (!listEl) return;

  const wishlist = getWishlist();
  const products = (window.PRODUCTS || []).filter(p => wishlist.includes(p.id));

  if (products.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 56px 20px; color: var(--text-muted);">
        <div style="font-size: 38px; margin-bottom: 16px; opacity: 0.6;">♡</div>
        <h4 style="font-family: var(--font-serif); font-size: 22px; color: var(--primary); margin-bottom: 8px; font-weight: 500;">Your wishlist is empty</h4>
        <p style="font-size: 13.5px; margin-bottom: 24px; line-height: 1.6; max-width: 280px; margin-left: auto; margin-right: auto;">
          Save your favorite pieces here to shop later.
        </p>
        <a href="shop.html" onclick="closeWishlist()" class="btn btn-primary" style="font-size: 11px; padding: 12px 24px;">Browse Products →</a>
      </div>
    `;
    return;
  }

  listEl.innerHTML = products.map(prod => `
    <div class="wishlist-item">
      <img src="${prod.image}" alt="${prod.name}" />
      <div class="wishlist-item-details">
        <div class="wishlist-item-title">${prod.name}</div>
        <div class="wishlist-item-price">${formatPrice(prod.price)}</div>
        <div style="display: flex; gap: 8px; align-items: center; margin-top: 4px;">
          <button class="wishlist-move-btn" onclick="moveWishlistToCart(${prod.id})">
            Move to Bag
          </button>
          <button onclick="toggleWishlist(${prod.id})" style="background:none; border:none; color:var(--text-muted); font-size:12px; cursor:pointer; text-decoration:underline;">
            Remove
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

/**
 * Move item from wishlist to cart
 */
function moveWishlistToCart(productId) {
  const prod = (window.PRODUCTS || []).find(p => p.id === Number(productId));
  if (prod) {
    addToCart(prod.id, "M");
    toggleWishlist(prod.id);
  }
}

/**
 * Open Wishlist Drawer
 */
function openWishlist() {
  const drawer = document.getElementById("wishlist-drawer");
  const backdrop = document.getElementById("wishlist-backdrop");
  if (drawer) drawer.classList.add("active");
  if (backdrop) backdrop.classList.add("active");
  document.body.style.overflow = "hidden";
}

/**
 * Close Wishlist Drawer
 */
function closeWishlist() {
  const drawer = document.getElementById("wishlist-drawer");
  const backdrop = document.getElementById("wishlist-backdrop");
  if (drawer) drawer.classList.remove("active");
  if (backdrop) backdrop.classList.remove("active");
  document.body.style.overflow = "";
}

// ============================================================================
// 5. LIVE SEARCH & SEARCH MODAL
// ============================================================================

/**
 * Open Search Modal
 */
function openSearch() {
  const backdrop = document.getElementById("search-modal-backdrop");
  const input = document.getElementById("search-modal-input");
  if (!backdrop || !input) return;

  backdrop.classList.add("active");
  document.body.style.overflow = "hidden";
  input.value = "";
  renderSearchResults("");
  setTimeout(() => input.focus(), 100);
}

/**
 * Close Search Modal
 */
function closeSearch() {
  const backdrop = document.getElementById("search-modal-backdrop");
  if (backdrop) backdrop.classList.remove("active");
  document.body.style.overflow = "";
}

/**
 * Render results in search modal
 */
function renderSearchResults(query) {
  const resultsContainer = document.getElementById("search-modal-results");
  if (!resultsContainer) return;

  const cleanQuery = query.toLowerCase().trim();
  const allProducts = window.PRODUCTS || [];

  const matched = cleanQuery
    ? allProducts.filter(p => p.name.toLowerCase().includes(cleanQuery) || p.desc.toLowerCase().includes(cleanQuery) || p.category.toLowerCase().includes(cleanQuery))
    : allProducts.slice(0, 4);

  if (matched.length === 0) {
    resultsContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <div style="font-size: 28px; margin-bottom: 8px;">🔍</div>
        <p style="font-size: 14px; color: var(--primary);">No results found for "${query}"</p>
        <span style="font-size: 12px;">Try searching for "coat", "trench", "blazer", or "silk"</span>
      </div>
    `;
    return;
  }

  resultsContainer.innerHTML = `
    <div style="font-size: 10.5px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px; padding-left: 10px;">
      ${cleanQuery ? `Search Results (${matched.length})` : 'Popular Recommendations'}
    </div>
    ${matched.map(prod => `
      <a href="product.html?id=${prod.id}" class="search-result-item" onclick="closeSearch()">
        <img src="${prod.image}" alt="${prod.name}" class="search-result-img" />
        <div class="search-result-details">
          <span class="search-result-category">${prod.category}</span>
          <div class="search-result-title">${prod.name}</div>
          <div class="search-result-price">${formatPrice(prod.price)}</div>
        </div>
        <span style="color: var(--accent); font-size: 18px; margin-left: 8px;">→</span>
      </a>
    `).join("")}
  `;
}

// ============================================================================
// 6. QUICK VIEW MODAL
// ============================================================================
let quickViewActiveProduct = null;
let quickViewSelectedSize = "M";
let quickViewSelectedColor = "Standard";

/**
 * Open Quick View Modal for a product
 */
function openQuickView(productId) {
  const prod = (window.PRODUCTS || []).find(p => p.id === Number(productId));
  if (!prod) return;

  quickViewActiveProduct = prod;
  quickViewSelectedSize = (prod.sizes && prod.sizes[0]) ? prod.sizes[0] : "M";
  quickViewSelectedColor = (prod.colors && prod.colors[0]) ? prod.colors[0].name : "Standard";

  const backdrop = document.getElementById("quick-view-backdrop");
  const container = document.getElementById("quick-view-content");
  if (!backdrop || !container) return;

  container.innerHTML = `
    <div class="quick-view-gallery">
      <img src="${prod.image}" alt="${prod.name}" />
    </div>
    <div class="quick-view-info">
      <span class="quick-view-meta">${prod.category.toUpperCase()}</span>
      <h2 class="quick-view-title">${prod.name}</h2>
      <div class="quick-view-price">
        <span>${formatPrice(prod.price)}</span>
        ${prod.oldPrice ? `<span class="original-price">${formatPrice(prod.oldPrice)}</span>` : ""}
      </div>
      <p class="quick-view-desc">${prod.desc}</p>
      
      <!-- Color Selection -->
      <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 6px; display: flex; justify-content: space-between;">
        <span>Select Color</span>
        <span id="quick-view-color-label" style="color: var(--primary); text-transform: none;">${quickViewSelectedColor}</span>
      </div>
      <div class="color-selector" style="display: flex; gap: 10px; margin-bottom: 14px;">
        ${(prod.colors || []).map((c, idx) => `
          <button type="button" class="color-swatch-btn ${idx === 0 ? 'active' : ''}" 
                  data-color="${c.name}" 
                  title="${c.name}" 
                  onclick="selectQuickViewColor('${c.name}', this)">
            <span class="color-swatch-inner" style="background-color: ${c.hex};"></span>
          </button>
        `).join("")}
      </div>

      <!-- Size Selection -->
      <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 8px;">
        Select Size
      </div>
      <div class="quick-view-sizes">
        ${(prod.sizes || ["XS", "S", "M", "L", "XL"]).map((size, idx) => `
          <button class="quick-view-size-btn ${idx === 0 ? 'active' : ''}" onclick="selectQuickViewSize('${size}', this)">
            ${size}
          </button>
        `).join("")}
      </div>

      <!-- Actions -->
      <div class="quick-view-actions">
        <button class="btn btn-primary" onclick="addQuickViewToCart()">
          Add to Bag • ${formatPrice(prod.price)}
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

function selectQuickViewColor(colorName, btnEl) {
  quickViewSelectedColor = colorName;
  const label = document.getElementById("quick-view-color-label");
  if (label) label.textContent = colorName;
  if (btnEl && btnEl.parentElement) {
    btnEl.parentElement.querySelectorAll(".color-swatch-btn").forEach(b => b.classList.remove("active"));
    btnEl.classList.add("active");
  }
}

function selectQuickViewSize(sizeName, btnEl) {
  quickViewSelectedSize = sizeName;
  if (btnEl && btnEl.parentElement) {
    btnEl.parentElement.querySelectorAll(".quick-view-size-btn").forEach(b => b.classList.remove("active"));
    btnEl.classList.add("active");
  }
}

function addQuickViewToCart() {
  if (!quickViewActiveProduct) return;
  addToCart(quickViewActiveProduct.id, quickViewSelectedSize, quickViewSelectedColor);
  closeQuickView();
}

function closeQuickView() {
  const backdrop = document.getElementById("quick-view-backdrop");
  if (backdrop) backdrop.classList.remove("active");
  document.body.style.overflow = "";
  quickViewActiveProduct = null;
}

// ============================================================================
// 7. SIZE GUIDE MODAL
// ============================================================================
function openSizeGuide() {
  let backdrop = document.getElementById("size-modal-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "size-modal-backdrop";
    backdrop.className = "modal-backdrop";
    backdrop.onclick = (e) => { if (e.target === backdrop) closeSizeGuide(); };
    backdrop.innerHTML = `
      <div class="modal-dialog">
        <button class="modal-close-btn" onclick="closeSizeGuide()" aria-label="Close Size Guide">&times;</button>
        <h3 class="modal-title">Garment Sizing Guide</h3>
        <p class="modal-subtitle">Use these measurements as a general guide to find your ideal fit.</p>
        
        <div class="size-table-wrap">
          <table class="size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest</th>
                <th>Waist</th>
                <th>Shoulder</th>
                <th>Length</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><strong>XS</strong></td><td>34" / 86 cm</td><td>28" / 71 cm</td><td>16.5" / 42 cm</td><td>39" / 99 cm</td></tr>
              <tr><td><strong>S</strong></td><td>36" / 91 cm</td><td>30" / 76 cm</td><td>17.0" / 43 cm</td><td>40" / 101 cm</td></tr>
              <tr><td><strong>M</strong></td><td>38" / 96 cm</td><td>32" / 81 cm</td><td>17.5" / 44 cm</td><td>41" / 104 cm</td></tr>
              <tr><td><strong>L</strong></td><td>41" / 104 cm</td><td>35" / 89 cm</td><td>18.0" / 46 cm</td><td>42" / 107 cm</td></tr>
              <tr><td><strong>XL</strong></td><td>44" / 112 cm</td><td>38" / 96 cm</td><td>18.5" / 47 cm</td><td>43" / 109 cm</td></tr>
            </tbody>
          </table>
        </div>
        <p style="font-size: 12px; color: var(--text-muted); margin-top: 14px;">
          ✦ Fits true to standard sizing. If between sizes, we recommend sizing up for a relaxed fit.
        </p>
      </div>
    `;
    document.body.appendChild(backdrop);
  }
  backdrop.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeSizeGuide() {
  const backdrop = document.getElementById("size-modal-backdrop");
  if (backdrop) backdrop.classList.remove("active");
  document.body.style.overflow = "";
}

// ============================================================================
// 8. MOBILE NAVIGATION MENU
// ============================================================================
function toggleMobileMenu() {
  const navLinks = document.getElementById("nav-links");
  const hamburger = document.getElementById("hamburger-btn");
  const backdrop = document.getElementById("nav-backdrop");

  if (navLinks && hamburger) {
    const isOpen = navLinks.classList.toggle("mobile-open");
    hamburger.classList.toggle("active", isOpen);
    if (backdrop) backdrop.classList.toggle("active", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  }
}

function closeMobileMenu() {
  const navLinks = document.getElementById("nav-links");
  const hamburger = document.getElementById("hamburger-btn");
  const backdrop = document.getElementById("nav-backdrop");

  if (navLinks) navLinks.classList.remove("mobile-open");
  if (hamburger) hamburger.classList.remove("active");
  if (backdrop) backdrop.classList.remove("active");
  document.body.style.overflow = "";
}

// ============================================================================
// 9. PROMOTIONAL COUNTDOWN TIMER
// ============================================================================
function initCountdown() {
  const daysEl = document.getElementById("cd-days");
  if (!daysEl) return;

  let totalSecs = 3600 * 48; // 48 hours countdown

  setInterval(() => {
    totalSecs--;
    if (totalSecs <= 0) totalSecs = 3600 * 48;

    const days = Math.floor(totalSecs / (3600 * 24));
    const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const cdDays = document.getElementById("cd-days");
    const cdHours = document.getElementById("cd-hours");
    const cdMins = document.getElementById("cd-mins");
    const cdSecs = document.getElementById("cd-secs");

    if (cdDays) cdDays.textContent = String(days).padStart(2, "0");
    if (cdHours) cdHours.textContent = String(hours).padStart(2, "0");
    if (cdMins) cdMins.textContent = String(mins).padStart(2, "0");
    if (cdSecs) cdSecs.textContent = String(secs).padStart(2, "0");
  }, 1000);
}

// ============================================================================
// 10. PRODUCT CARD TEMPLATE GENERATOR
// ============================================================================
function createProductCardHTML(prod) {
  const isSaved = isInWishlist(prod.id);
  const heartFill = isSaved ? "#A93226" : "none";
  const heartStroke = isSaved ? "#A93226" : "currentColor";
  const secondaryImg = (prod.images && prod.images.length > 1) ? prod.images[1] : prod.image;

  return `
    <div class="product-card">
      <div class="product-image-wrap">
        <span class="product-badge">${prod.oldPrice ? 'Sale' : (prod.isNew ? 'New Arrival' : 'Classic')}</span>
        <button class="wishlist-btn" data-wishlist-id="${prod.id}" onclick="toggleWishlist(${prod.id})" title="${isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}" aria-label="Wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${heartFill}" stroke="${heartStroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <a href="product.html?id=${prod.id}">
          <img class="product-img-primary" src="${prod.image}" alt="${prod.name}" loading="lazy" />
          <img class="product-img-secondary" src="${secondaryImg}" alt="${prod.name} Alternate View" loading="lazy" />
        </a>
        <button class="product-quick-view-btn" onclick="openQuickView(${prod.id})" aria-label="Quick View ${prod.name}">
          Quick View
        </button>
      </div>
      <div class="product-info">
        <span class="product-meta">${prod.category}</span>
        <h3 class="product-title">
          <a href="product.html?id=${prod.id}">${prod.name}</a>
        </h3>
        <div class="product-rating">★★★★★ <span>(${prod.reviewsCount || 40})</span></div>
        <div class="product-price">
          ${formatPrice(prod.price)}
          ${prod.oldPrice ? `<span class="original-price">${formatPrice(prod.oldPrice)}</span>` : ""}
        </div>
        <div class="product-actions">
          <button class="btn-card" onclick="addToCart(${prod.id})">Add to Bag</button>
          <a href="product.html?id=${prod.id}" class="btn-card btn-card-outline">Details</a>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// 11. PAGE: HOME PAGE
// ============================================================================
function initHomePage() {
  const container = document.getElementById("home-products");
  if (!container) return;

  const featured = (window.PRODUCTS || []).slice(0, 4);
  container.innerHTML = featured.map(createProductCardHTML).join("");
}

// ============================================================================
// 12. PAGE: SHOP PAGE (Catalog, Filtering, Sorting)
// ============================================================================
let shopActiveCategory = "all";
let shopSortBy = "featured";
let shopIsDense = false;

function initShopPage() {
  const container = document.getElementById("shop-products");
  if (!container) return;

  // Read ?category= query parameter from URL (e.g. shop.html?category=women)
  const params = new URLSearchParams(window.location.search);
  if (params.has("category")) {
    const cat = params.get("category").toLowerCase();
    shopActiveCategory = cat;
    const targetBtn = document.querySelector(`.filter-btn[data-category="${cat}"]`);
    if (targetBtn) {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      targetBtn.classList.add("active");
    }
  }

  renderShop();

  // Search input live filtering
  const searchInput = document.getElementById("search-box");
  if (searchInput) {
    searchInput.addEventListener("input", () => renderShop());
  }

  // Sort dropdown
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      shopSortBy = e.target.value;
      renderShop();
    });
  }

  // Grid view compact toggle
  const gridToggle = document.getElementById("grid-toggle-btn");
  if (gridToggle) {
    gridToggle.addEventListener("click", () => {
      shopIsDense = !shopIsDense;
      container.classList.toggle("grid-dense", shopIsDense);
      gridToggle.textContent = shopIsDense ? "⊞ View Normal" : "▦ View Compact";
    });
  }
}

function filterCategory(categoryName, clickedBtn) {
  shopActiveCategory = categoryName;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  if (clickedBtn) clickedBtn.classList.add("active");
  renderShop();
}

function renderShop() {
  const container = document.getElementById("shop-products");
  if (!container) return;

  const searchInput = document.getElementById("search-box");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  let list = (window.PRODUCTS || []).filter(prod => {
    let matchCat = false;
    if (shopActiveCategory === "all") {
      matchCat = true;
    } else if (shopActiveCategory === "new-arrivals" || shopActiveCategory === "new") {
      matchCat = Boolean(prod.isNew);
    } else {
      matchCat = (prod.category === shopActiveCategory);
    }
    const matchSearch = prod.name.toLowerCase().includes(query) || prod.desc.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  // Sorting
  if (shopSortBy === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (shopSortBy === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (shopSortBy === "name-asc") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Update product count label
  const countEl = document.getElementById("shop-product-count");
  if (countEl) {
    countEl.textContent = `Showing ${list.length} creations`;
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <p style="font-size: 16px; margin-bottom: 8px; color: var(--primary);">No products found matching your criteria.</p>
        <button class="btn btn-secondary" onclick="filterCategory('all', document.querySelector('[data-category=all]'))" style="margin-top: 10px;">
          Reset Filters
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(createProductCardHTML).join("");
}

// ============================================================================
// 13. PAGE: PRODUCT DETAIL PAGE (PDP)
// ============================================================================
let pdpCurrentSize = "S";
let pdpCurrentColor = "Camel Beige";
let pdpCurrentProduct = null;

function initProductPage() {
  const titleEl = document.getElementById("pdp-title");
  if (!titleEl) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10) || 1;
  const prod = (window.PRODUCTS || []).find(p => p.id === id) || (window.PRODUCTS || [])[0];
  if (!prod) return;

  pdpCurrentProduct = prod;

  // Title, Category, Price, Desc
  titleEl.textContent = prod.name;
  const catEl = document.getElementById("pdp-category");
  if (catEl) catEl.textContent = `${prod.category.toUpperCase()} CAPSULE`;
  
  const priceEl = document.getElementById("pdp-price");
  if (priceEl) priceEl.textContent = formatPrice(prod.price);

  const descEl = document.getElementById("pdp-desc");
  if (descEl) descEl.textContent = prod.desc;

  // Breadcrumbs
  const bcCat = document.getElementById("pdp-breadcrumb-cat");
  const bcName = document.getElementById("pdp-breadcrumb-name");
  if (bcCat) bcCat.textContent = `${prod.category} Capsule`;
  if (bcName) bcName.textContent = prod.name;

  // Main Image
  const mainImg = document.getElementById("pdp-main-img");
  if (mainImg) {
    mainImg.src = prod.image;
    mainImg.alt = prod.name;
  }

  // Thumbnails
  const thumbsContainer = document.getElementById("pdp-thumbs");
  if (thumbsContainer && prod.images) {
    thumbsContainer.innerHTML = prod.images.map((img, idx) => `
      <img src="${img}" class="pdp-thumb ${idx === 0 ? 'active' : ''}" onclick="changePdpImage('${img}', this)" alt="${prod.name} Angle ${idx + 1}" />
    `).join("");
  }

  // Color Swatches
  pdpCurrentColor = (prod.colors && prod.colors[0]) ? prod.colors[0].name : "Standard";
  const colorLabel = document.getElementById("pdp-selected-color");
  if (colorLabel) colorLabel.textContent = pdpCurrentColor;

  const colorContainer = document.getElementById("pdp-color-selector");
  if (colorContainer && prod.colors) {
    colorContainer.innerHTML = prod.colors.map((c, idx) => `
      <button type="button" class="color-swatch-btn ${idx === 0 ? 'active' : ''}" 
              data-color="${c.name}" 
              title="${c.name}" 
              aria-label="Select color ${c.name}">
        <span class="color-swatch-inner" style="background-color: ${c.hex};"></span>
      </button>
    `).join("");

    colorContainer.querySelectorAll(".color-swatch-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        colorContainer.querySelectorAll(".color-swatch-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        pdpCurrentColor = btn.getAttribute("data-color");
        if (colorLabel) colorLabel.textContent = pdpCurrentColor;
      });
    });
  }

  // Sizing buttons
  document.querySelectorAll(".size-option").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".size-option").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      pdpCurrentSize = btn.textContent.trim();
      const stockEl = document.getElementById("pdp-stock-notice");
      if (stockEl) {
        stockEl.textContent = `Atelier Stock: Limited quantities available in Size ${pdpCurrentSize}`;
      }
    });
  });

  // Add to Bag Button
  const addBtn = document.getElementById("pdp-add-btn");
  if (addBtn) {
    addBtn.onclick = () => {
      addToCart(prod.id, pdpCurrentSize, pdpCurrentColor);
    };
  }

  // Mobile Sticky Bar
  const stickyName = document.getElementById("sticky-bar-name");
  const stickyPrice = document.getElementById("sticky-bar-price");
  const stickyBar = document.getElementById("mobile-sticky-bar");
  if (stickyName) stickyName.textContent = prod.name;
  if (stickyPrice) stickyPrice.textContent = formatPrice(prod.price);

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

  // Related Cross-Sell Products
  const relatedContainer = document.getElementById("related-products");
  if (relatedContainer) {
    const related = (window.PRODUCTS || []).filter(p => p.id !== prod.id).slice(0, 3);
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
          <div class="product-price" style="margin-bottom: 10px; font-size: 14px;">${formatPrice(p.price)}</div>
          <a href="product.html?id=${p.id}" class="btn-card btn-card-outline" style="min-height: 32px; font-size: 10px;">Discover Creation</a>
        </div>
      </div>
    `).join("");
  }

  // Accordion toggles
  document.querySelectorAll(".accordion-header").forEach(hdr => {
    hdr.addEventListener("click", () => {
      const item = hdr.parentElement;
      item.classList.toggle("active");
    });
  });
}

function changePdpImage(src, thumbEl) {
  const mainImg = document.getElementById("pdp-main-img");
  if (mainImg) {
    mainImg.style.opacity = "0.4";
    setTimeout(() => {
      mainImg.src = src;
      mainImg.style.opacity = "1";
    }, 100);
  }
  document.querySelectorAll(".pdp-thumb").forEach(t => t.classList.remove("active"));
  if (thumbEl) thumbEl.classList.add("active");
}

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
          <strong class="review-author">${name}</strong>
          <span style="color: var(--accent); font-size: 13px;">★★★★★</span>
        </div>
        <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.6;">"${comment}"</p>
      `;
      list.prepend(item);
    }
    document.getElementById("review-form").reset();
    showToast("Thank you for submitting your verified customer review!");
  }
}

// ============================================================================
// 14. FORMS: NEWSLETTER & CONTACT
// ============================================================================
function subscribeNewsletter(event) {
  event.preventDefault();
  const input = event.target.querySelector("input[type='email']");
  if (input && input.value) {
    showToast(`Welcome! Promo code SAVE20 has been activated for your account.`);
    input.value = "";
  }
}

function submitContact(event) {
  event.preventDefault();
  const name = document.getElementById("contact-name") ? document.getElementById("contact-name").value : "Valued Customer";
  showToast(`Thank you, ${name}! Your inquiry has reached our concierge team.`);
  event.target.reset();
}

// ============================================================================
// 15. GLOBAL BRIDGE (For inline HTML onclick handlers)
// ============================================================================
window.__aura = {
  addToCart,
  removeFromCart,
  adjustQty: adjustCartQty,
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
  selectQuickViewColor,
  selectQuickViewSize,
  addQuickViewToBag: addQuickViewToCart,
  openSizeGuide,
  closeSizeGuide,
  toggleMobileMenu,
  closeMobileMenu,
  filterCategory,
  changeImage: changePdpImage,
  submitReview,
  subscribeNewsletter,
  submitContact
};

// Also expose core functions on window for direct access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.adjustCartQty = adjustCartQty;
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
window.selectQuickViewColor = selectQuickViewColor;
window.selectQuickViewSize = selectQuickViewSize;
window.addQuickViewToCart = addQuickViewToCart;
window.openSizeGuide = openSizeGuide;
window.closeSizeGuide = closeSizeGuide;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.filterCategory = filterCategory;
window.changePdpImage = changePdpImage;
window.submitReview = submitReview;
window.subscribeNewsletter = subscribeNewsletter;
window.submitContact = submitContact;

// ============================================================================
// 16. INITIALIZATION ON DOM CONTENT LOADED
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Sync state and badges
  renderCart();
  updateCartBadges();
  renderWishlist();
  updateWishlistBadges();

  // Initialize countdown timer if present
  initCountdown();

  // Page-specific setup
  initHomePage();
  initShopPage();
  initProductPage();

  // Sticky navbar shadow on scroll
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 20);
    }
  }, { passive: true });

  // Close mobile nav on backdrop click
  const navBackdrop = document.getElementById("nav-backdrop");
  if (navBackdrop) {
    navBackdrop.addEventListener("click", closeMobileMenu);
  }

  // Close modals on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSearch();
      closeQuickView();
      closeSizeGuide();
      closeCart();
      closeWishlist();
      closeMobileMenu();
    } else if ((e.key === "/" || (e.metaKey && e.key.toLowerCase() === "k")) && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openSearch();
    }
  });

  // Search input typing listener in search modal
  const searchModalInput = document.getElementById("search-modal-input");
  if (searchModalInput) {
    searchModalInput.addEventListener("input", (e) => {
      renderSearchResults(e.target.value);
    });
  }

  // Search modal backdrop click to close
  const searchBackdrop = document.getElementById("search-modal-backdrop");
  if (searchBackdrop) {
    searchBackdrop.addEventListener("click", (e) => {
      if (e.target === searchBackdrop) closeSearch();
    });
  }

  // Quick view backdrop click to close
  const quickViewBackdrop = document.getElementById("quick-view-backdrop");
  if (quickViewBackdrop) {
    quickViewBackdrop.addEventListener("click", (e) => {
      if (e.target === quickViewBackdrop) closeQuickView();
    });
  }
});
