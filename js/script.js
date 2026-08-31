/*
  =============================================
  AURA CLOTHING STORE - JAVASCRIPT (script.js)
  
  Simple, beginner-friendly JavaScript code.
  Handles:
  1. Product Database Array
  2. Shopping Cart (Add, Remove, Subtotal, Checkout)
  3. Wishlist (Heart Toggle)
  4. Search & Filter on Shop Page
  5. Product Detail View & Image Switcher
  6. Live Countdown Timer
  =============================================
*/

// =============================================
// 1. PRODUCT CATALOG DATABASE (Array of Objects)
// =============================================
const products = [
  {
    id: 1,
    name: "Classic Beige Trench Coat",
    category: "women",
    price: 120,
    oldPrice: 150,
    image: "assets/images/products/trench-coat-1.jpg",
    images: [
      "assets/images/products/trench-coat-1.jpg",
      "assets/images/products/trench-coat-2.jpg",
      "assets/images/products/trench-coat-3.jpg"
    ],
    desc: "A timeless, warm double-breasted coat crafted from a premium virgin wool blend. Features storm flaps, horn buttons, and an elegant relaxed drape."
  },
  {
    id: 2,
    name: "Men's Tailored Wool Blazer",
    category: "men",
    price: 140,
    oldPrice: 175,
    image: "assets/images/products/wool-blazer-1.jpg",
    images: [
      "assets/images/products/wool-blazer-1.jpg",
      "assets/images/products/wool-blazer-2.jpg"
    ],
    desc: "Sharp and versatile modern blazer with half-canvas construction that contours to your body over time for a custom fit."
  },
  {
    id: 3,
    name: "Silk Evening Slip Dress",
    category: "women",
    price: 95,
    oldPrice: 120,
    image: "assets/images/products/silk-dress-1.jpg",
    images: [
      "assets/images/products/silk-dress-1.jpg",
      "assets/images/products/silk-dress-2.jpg"
    ],
    desc: "Sculpted on the bias grain from heavyweight 22-momme Mulberry silk for an effortless liquid silhouette."
  },
  {
    id: 4,
    name: "Cozy Alpaca Knit Sweater",
    category: "women",
    price: 85,
    oldPrice: null,
    image: "assets/images/products/knit-sweater-1.jpg",
    images: [
      "assets/images/products/knit-sweater-1.jpg",
      "assets/images/products/knit-sweater-2.jpg"
    ],
    desc: "Cloud-soft turtleneck spun from hypoallergenic Peruvian Royal Alpaca and organic Pima cotton yarns."
  },
  {
    id: 5,
    name: "Casual Poplin Cotton Shirt",
    category: "men",
    price: 55,
    oldPrice: 70,
    image: "assets/images/products/poplin-shirt-1.jpg",
    images: [
      "assets/images/products/poplin-shirt-1.jpg",
      "assets/images/products/poplin-shirt-2.jpg"
    ],
    desc: "Two-ply Giza long-staple Egyptian cotton poplin with genuine mother-of-pearl buttons."
  },
  {
    id: 6,
    name: "Genuine Leather Tote Bag",
    category: "accessories",
    price: 110,
    oldPrice: 130,
    image: "assets/images/products/leather-tote-1.jpg",
    images: [
      "assets/images/products/leather-tote-1.jpg",
      "assets/images/products/leather-tote-2.jpg"
    ],
    desc: "Certified vegetable-tanned full-grain calf leather crafted with durable hand-burnished edges."
  }
];

// =============================================
// 2. STATE STORAGE (Saved in Browser LocalStorage)
// =============================================
let cart = JSON.parse(localStorage.getItem("aura_simple_cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("aura_simple_wishlist")) || [];

// Save cart array to localStorage
function saveCart() {
  localStorage.setItem("aura_simple_cart", JSON.stringify(cart));
  updateBadges();
  renderCart();
}

// Save wishlist array to localStorage
function saveWishlist() {
  localStorage.setItem("aura_simple_wishlist", JSON.stringify(wishlist));
  updateBadges();
}

// Update the counter numbers on the navbar icons
function updateBadges() {
  const cartBadge = document.getElementById("cart-badge");
  const wishBadge = document.getElementById("wishlist-badge");

  if (cartBadge) {
    // Total count of all items in cart
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalCount;
  }

  if (wishBadge) {
    wishBadge.textContent = wishlist.length;
  }
}

// =============================================
// 3. SHOPPING CART FUNCTIONS
// =============================================

// Add a product to the cart
function addToCart(productId) {
  const prod = products.find(p => p.id === Number(productId));
  if (!prod) return;

  const existingItem = cart.find(item => item.id === prod.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      quantity: 1
    });
  }

  saveCart();
  openCart();
}

// Remove an item from the cart
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

// Open the Slide-Out Cart Drawer
function openCart() {
  const drawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  if (drawer) drawer.classList.add("active");
  if (backdrop) backdrop.classList.add("active");
}

// Close the Slide-Out Cart Drawer
function closeCart() {
  const drawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  if (drawer) drawer.classList.remove("active");
  if (backdrop) backdrop.classList.remove("active");
}

// Render the items inside the Cart Drawer
function renderCart() {
  const listEl = document.getElementById("cart-items-list");
  const totalEl = document.getElementById("cart-total-price");
  if (!listEl || !totalEl) return;

  if (cart.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 40px 10px; color: #888888;">
        <p>Your shopping bag is empty.</p>
      </div>
    `;
    totalEl.textContent = "$0.00";
    return;
  }

  let subtotal = 0;

  listEl.innerHTML = cart.map((item, index) => {
    subtotal += item.price * item.quantity;
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div style="font-size: 12px; color: #777;">Qty: ${item.quantity}</div>
          <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${index})">&times;</button>
      </div>
    `;
  }).join("");

  totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

// Checkout button
function checkout() {
  if (cart.length === 0) {
    alert("Your shopping bag is empty!");
    return;
  }
  alert("🎉 Thank you! Your order has been placed successfully.");
  cart = [];
  saveCart();
  closeCart();
}

// =============================================
// 4. WISHLIST FUNCTIONS
// =============================================
function toggleWishlist(productId) {
  const id = Number(productId);
  const index = wishlist.indexOf(id);

  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(id);
  }

  saveWishlist();

  // Re-render home or shop products so hearts update
  if (document.getElementById("home-products")) renderHomeProducts();
  if (document.getElementById("shop-products")) renderShopProducts();
}

function showWishlistAlert() {
  alert(`You have ${wishlist.length} item(s) saved in your Wishlist!`);
}

// =============================================
// 5. PAGE-SPECIFIC RENDERERS
// =============================================

// Helper: creates HTML for a product card
function createProductCardHTML(prod) {
  const isSaved = wishlist.includes(prod.id);
  const heartFill = isSaved ? "#E74C3C" : "none";
  const heartStroke = isSaved ? "#E74C3C" : "#222222";

  return `
    <div class="product-card">
      <div class="product-image-wrap">
        <button class="wishlist-btn" onclick="toggleWishlist(${prod.id})" title="Wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${heartFill}" stroke="${heartStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <a href="product.html?id=${prod.id}">
          <img src="${prod.image}" alt="${prod.name}" />
        </a>
      </div>
      <div class="product-info">
        <span class="product-meta">${prod.category}</span>
        <h3 class="product-title">${prod.name}</h3>
        <div class="product-rating">★★★★★ (48)</div>
        <div class="product-price">
          $${prod.price.toFixed(2)}
          ${prod.oldPrice ? `<span class="original-price">$${prod.oldPrice.toFixed(2)}</span>` : ""}
        </div>
        <div class="product-actions">
          <button class="btn-card" onclick="addToCart(${prod.id})">Add to Bag</button>
          <a href="product.html?id=${prod.id}" class="btn-card btn-card-outline">Details</a>
        </div>
      </div>
    </div>
  `;
}

// Render first 4 products on Home page
function renderHomeProducts() {
  const container = document.getElementById("home-products");
  if (!container) return;
  container.innerHTML = products.slice(0, 4).map(createProductCardHTML).join("");
}

// Current category filter on shop page
let currentCategory = "all";

// Render products on Shop page with search and category filters
function renderShopProducts() {
  const container = document.getElementById("shop-products");
  if (!container) return;

  const searchInput = document.getElementById("search-box");
  const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const filtered = products.filter(prod => {
    const matchesCategory = (currentCategory === "all" || prod.category === currentCategory);
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery) || 
                          prod.desc.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: white; border-radius: 8px; border: 1px solid #EAEAEA;">
        <h3>No products found</h3>
        <p style="color: #777; margin-top: 8px;">Try searching for another keyword or selecting a different category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(createProductCardHTML).join("");
}

// Category filter button click handler
function filterByCategory(categoryName, clickedBtn) {
  currentCategory = categoryName;

  // Highlight the clicked button
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  if (clickedBtn) clickedBtn.classList.add("active");

  renderShopProducts();
}

// Product Details Page Loader
function loadProductDetails() {
  const titleEl = document.getElementById("pdp-title");
  if (!titleEl) return;

  // Read ?id= from URL
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10) || 1;
  const prod = products.find(p => p.id === id) || products[0];

  document.getElementById("pdp-title").textContent = prod.name;
  document.getElementById("pdp-category").textContent = `CATEGORY: ${prod.category.toUpperCase()}`;
  document.getElementById("pdp-price").textContent = `$${prod.price.toFixed(2)}`;
  document.getElementById("pdp-desc").textContent = prod.desc;

  const mainImg = document.getElementById("pdp-main-img");
  if (mainImg) {
    mainImg.src = prod.image;
    mainImg.alt = prod.name;
  }

  // Thumbnails
  const thumbsContainer = document.getElementById("pdp-thumbs");
  if (thumbsContainer && prod.images) {
    thumbsContainer.innerHTML = prod.images.map((img, idx) => `
      <img src="${img}" class="pdp-thumb ${idx === 0 ? 'active' : ''}" onclick="changePDPImage('${img}', this)" alt="Angle" />
    `).join("");
  }

  // Add to Bag Button on PDP
  const addBtn = document.getElementById("pdp-add-btn");
  if (addBtn) {
    addBtn.onclick = () => addToCart(prod.id);
  }
}

// Switch main photo when clicking thumbnails
function changePDPImage(imgSrc, thumbElement) {
  const mainImg = document.getElementById("pdp-main-img");
  if (mainImg) mainImg.src = imgSrc;

  document.querySelectorAll(".pdp-thumb").forEach(t => t.classList.remove("active"));
  if (thumbElement) thumbElement.classList.add("active");
}

// Submit a review on PDP
function submitReview(e) {
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

// 6. COUNTDOWN TIMER
function startCountdown() {
  const daysEl = document.getElementById("cd-days");
  if (!daysEl) return;

  let totalSecs = 3600 * 48; // 48 hours

  setInterval(() => {
    totalSecs--;
    if (totalSecs <= 0) totalSecs = 3600 * 48;

    const days = Math.floor(totalSecs / (3600 * 24));
    const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    document.getElementById("cd-days").textContent = String(days).padStart(2, "0");
    document.getElementById("cd-hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("cd-mins").textContent = String(mins).padStart(2, "0");
    document.getElementById("cd-secs").textContent = String(secs).padStart(2, "0");
  }, 1000);
}

// =============================================
// 7. INITIALIZE ON PAGE LOAD
// =============================================
document.addEventListener("DOMContentLoaded", () => {
  updateBadges();
  renderCart();
  startCountdown();
  renderHomeProducts();

  // If on shop page: check for ?category= in URL
  if (document.getElementById("shop-products")) {
    const params = new URLSearchParams(window.location.search);
    if (params.has("category")) {
      const cat = params.get("category").toLowerCase();
      const targetBtn = document.querySelector(`.filter-btn[data-category="${cat}"]`);
      filterByCategory(cat, targetBtn);
    } else {
      renderShopProducts();
    }
  }

  // If on product details page:
  if (document.getElementById("pdp-title")) {
    loadProductDetails();
  }
});
