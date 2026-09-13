/**
 * ============================================================================
 * AURA Modern Fashion - Product Data (products.js)
 * ============================================================================
 * Student / Intern Project: Modern Fashion E-Commerce Website
 * Description: Product catalog containing items for Men, Women, and Accessories.
 * ============================================================================
 */

const PRODUCTS = [
  {
    id: 1,
    name: "Classic Beige Trench Coat",
    category: "women",
    isNew: true,
    price: 4999,
    oldPrice: 6499,
    rating: 5,
    reviewsCount: 38,
    image: "assets/images/products/trench-coat-1.jpg",
    images: [
      "assets/images/products/trench-coat-1.jpg",
      "assets/images/products/trench-coat-2.jpg",
      "assets/images/products/trench-coat-3.jpg"
    ],
    colors: [
      { name: "Beige", hex: "#D7C9AA" },
      { name: "Black", hex: "#1F1F1F" },
      { name: "Olive", hex: "#555A4A" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    desc: "A classic double-breasted trench coat made from a warm, durable wool blend. Features storm flaps, adjustable belt, buttoned pockets, and a relaxed modern fit perfect for daily layering."
  },
  {
    id: 2,
    name: "Men's Tailored Wool Blazer",
    category: "men",
    isNew: false,
    price: 5499,
    oldPrice: 6999,
    rating: 5,
    reviewsCount: 27,
    image: "assets/images/products/wool-blazer-1.jpg",
    images: [
      "assets/images/products/wool-blazer-1.jpg",
      "assets/images/products/wool-blazer-2.jpg"
    ],
    colors: [
      { name: "Charcoal Grey", hex: "#3A3D40" },
      { name: "Navy Blue", hex: "#1C2434" },
      { name: "Brown", hex: "#4A3B32" }
    ],
    sizes: ["S", "M", "L", "XL"],
    desc: "A sharp modern blazer crafted with premium fabric for a comfortable tailored fit. Great for office wear, business meetings, and semi-formal evening events."
  },
  {
    id: 3,
    name: "Elegant Silk Slip Dress",
    category: "women",
    isNew: true,
    price: 3499,
    oldPrice: 4499,
    rating: 5,
    reviewsCount: 42,
    image: "assets/images/products/silk-dress-1.jpg",
    images: [
      "assets/images/products/silk-dress-1.jpg",
      "assets/images/products/silk-dress-2.jpg"
    ],
    colors: [
      { name: "Champagne Gold", hex: "#E8D8B8" },
      { name: "Classic Black", hex: "#151515" },
      { name: "Emerald Green", hex: "#234E3F" }
    ],
    sizes: ["XS", "S", "M", "L"],
    desc: "An elegant slip dress crafted from lightweight, silky fabric that drapes effortlessly. Features adjustable spaghetti straps and a flattering V-neck cut."
  },
  {
    id: 4,
    name: "Cozy Knit Turtleneck Sweater",
    category: "women",
    isNew: true,
    price: 2499,
    oldPrice: 3299,
    rating: 5,
    reviewsCount: 19,
    image: "assets/images/products/knit-sweater-1.jpg",
    images: [
      "assets/images/products/knit-sweater-1.jpg",
      "assets/images/products/knit-sweater-2.jpg"
    ],
    colors: [
      { name: "Cream White", hex: "#F3EDE2" },
      { name: "Heather Grey", hex: "#9E9E9E" },
      { name: "Warm Tan", hex: "#B58A63" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    desc: "A soft, chunky knit turtleneck sweater designed for cold days. Features ribbed cuffs and hem with a relaxed, cozy feel that pairs easily with denim and skirts."
  },
  {
    id: 5,
    name: "Men's Casual Poplin Cotton Shirt",
    category: "men",
    isNew: false,
    price: 1999,
    oldPrice: 2499,
    rating: 4,
    reviewsCount: 31,
    image: "assets/images/products/poplin-shirt-1.jpg",
    images: [
      "assets/images/products/poplin-shirt-1.jpg",
      "assets/images/products/poplin-shirt-2.jpg"
    ],
    colors: [
      { name: "Crisp White", hex: "#F8F9FA" },
      { name: "Sky Blue", hex: "#B8C9D9" },
      { name: "Dark Navy", hex: "#233142" }
    ],
    sizes: ["S", "M", "L", "XL"],
    desc: "Breathable 100% poplin cotton shirt with a clean button-down collar. Lightweight, easy to iron, and versatile for both casual weekend outings and everyday work."
  },
  {
    id: 6,
    name: "Genuine Leather Everyday Tote",
    category: "accessories",
    isNew: true,
    price: 3999,
    oldPrice: 4999,
    rating: 5,
    reviewsCount: 25,
    image: "assets/images/products/leather-tote-1.jpg",
    images: [
      "assets/images/products/leather-tote-1.jpg",
      "assets/images/products/leather-tote-2.jpg"
    ],
    colors: [
      { name: "Cognac Brown", hex: "#874421" },
      { name: "Midnight Black", hex: "#1C1C1C" },
      { name: "Tuscan Tan", hex: "#C1A380" }
    ],
    sizes: ["One Size"],
    desc: "A spacious genuine leather tote bag with reinforced handles, magnetic closure, and multiple interior organizer pockets. Easily fits a 14-inch laptop and daily essentials."
  }
];

// Attach to window so it is easily accessible in main.js
if (typeof window !== "undefined") {
  window.PRODUCTS = PRODUCTS;
}
