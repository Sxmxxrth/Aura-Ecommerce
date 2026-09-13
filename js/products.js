/**
 * ============================================================================
 * AURA Modern Fashion E-Commerce - Product Catalog Data (products.js)
 * ============================================================================
 * Author: Intern Developer
 * Description: Defines the catalog of products for the AURA clothing brand.
 * Each product contains details such as ID, name, category, pricing, images,
 * available colors, sizes, customer ratings, and descriptions.
 * ============================================================================
 */

const PRODUCTS = [
  {
    id: 1,
    name: "Classic Beige Trench Coat",
    category: "women",
    isNew: true,
    price: 9999,
    oldPrice: 12499,
    rating: 5,
    reviewsCount: 48,
    image: "assets/images/products/trench-coat-1.jpg",
    images: [
      "assets/images/products/trench-coat-1.jpg",
      "assets/images/products/trench-coat-2.jpg",
      "assets/images/products/trench-coat-3.jpg"
    ],
    colors: [
      { name: "Camel Beige", hex: "#C8AD8D" },
      { name: "Obsidian Noir", hex: "#1F1F1F" },
      { name: "Sage Khaki", hex: "#707361" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    desc: "A timeless double-breasted trench coat crafted from a premium Italian virgin wool blend. Features classic storm flaps, horn buttons, and an elegant relaxed drape that layers effortlessly over seasonal outfits."
  },
  {
    id: 2,
    name: "Men's Tailored Wool Blazer",
    category: "men",
    isNew: false,
    price: 11499,
    oldPrice: 14499,
    rating: 5,
    reviewsCount: 36,
    image: "assets/images/products/wool-blazer-1.jpg",
    images: [
      "assets/images/products/wool-blazer-1.jpg",
      "assets/images/products/wool-blazer-2.jpg"
    ],
    colors: [
      { name: "Charcoal Slate", hex: "#37393D" },
      { name: "Midnight Navy", hex: "#1E2530" },
      { name: "Deep Truffle", hex: "#4A3B32" }
    ],
    sizes: ["S", "M", "L", "XL"],
    desc: "A sharp and versatile modern blazer with half-canvas construction that contours naturally to your body over time for a bespoke, comfortable fit."
  },
  {
    id: 3,
    name: "Silk Evening Slip Dress",
    category: "women",
    isNew: true,
    price: 7999,
    oldPrice: 9999,
    rating: 5,
    reviewsCount: 52,
    image: "assets/images/products/silk-dress-1.jpg",
    images: [
      "assets/images/products/silk-dress-1.jpg",
      "assets/images/products/silk-dress-2.jpg"
    ],
    colors: [
      { name: "Champagne Gold", hex: "#D8C59D" },
      { name: "Noir Onyx", hex: "#151515" },
      { name: "Emerald Forest", hex: "#213E33" }
    ],
    sizes: ["XS", "S", "M", "L"],
    desc: "Sculpted on the bias grain from heavyweight 22-momme Mulberry silk for an effortless liquid drape and luxurious evening silhouette."
  },
  {
    id: 4,
    name: "Cozy Alpaca Knit Sweater",
    category: "women",
    isNew: true,
    price: 6999,
    oldPrice: null,
    rating: 5,
    reviewsCount: 29,
    image: "assets/images/products/knit-sweater-1.jpg",
    images: [
      "assets/images/products/knit-sweater-1.jpg",
      "assets/images/products/knit-sweater-2.jpg"
    ],
    colors: [
      { name: "Alabaster Cream", hex: "#EDE6D6" },
      { name: "Heather Ash", hex: "#949494" },
      { name: "Warm Camel", hex: "#B58A63" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    desc: "A cloud-soft turtleneck spun from hypoallergenic Peruvian Royal Alpaca and organic cotton yarns for unmatched warmth and gentle skin comfort."
  },
  {
    id: 5,
    name: "Casual Poplin Cotton Shirt",
    category: "men",
    isNew: false,
    price: 4499,
    oldPrice: 5799,
    rating: 5,
    reviewsCount: 41,
    image: "assets/images/products/poplin-shirt-1.jpg",
    images: [
      "assets/images/products/poplin-shirt-1.jpg",
      "assets/images/products/poplin-shirt-2.jpg"
    ],
    colors: [
      { name: "Crisp White", hex: "#F8F9FA" },
      { name: "Sky Azure", hex: "#B8C9D9" },
      { name: "French Navy", hex: "#233142" }
    ],
    sizes: ["S", "M", "L", "XL"],
    desc: "Tailored from two-ply Giza long-staple Egyptian cotton poplin with genuine mother-of-pearl buttons and clean, durable single-needle stitching."
  },
  {
    id: 6,
    name: "Genuine Leather Tote Bag",
    category: "accessories",
    isNew: true,
    price: 8999,
    oldPrice: 10799,
    rating: 5,
    reviewsCount: 33,
    image: "assets/images/products/leather-tote-1.jpg",
    images: [
      "assets/images/products/leather-tote-1.jpg",
      "assets/images/products/leather-tote-2.jpg"
    ],
    colors: [
      { name: "Cognac Amber", hex: "#874421" },
      { name: "Midnight Black", hex: "#1C1C1C" },
      { name: "Tuscan Sand", hex: "#C1A380" }
    ],
    sizes: ["One Size"],
    desc: "Certified vegetable-tanned full-grain calf leather handcrafted with durable hand-burnished edges, reinforced handles, and spacious compartments."
  }
];

// Attach to window object for global accessibility across scripts
if (typeof window !== "undefined") {
  window.PRODUCTS = PRODUCTS;
}
