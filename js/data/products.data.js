/*
  =============================================
  PRODUCT CATALOG DATA (products.data.js)
  =============================================
*/

export const PRODUCTS_DATA = [
  {
    id: 1,
    name: "Classic Beige Trench Coat",
    category: "women",
    isNew: true,
    price: 9999,
    oldPrice: 12499,
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
    desc: "A timeless, warm double-breasted coat crafted from a premium virgin wool blend. Features storm flaps, horn buttons, and an elegant relaxed drape."
  },
  {
    id: 2,
    name: "Men's Tailored Wool Blazer",
    category: "men",
    isNew: false,
    price: 11499,
    oldPrice: 14499,
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
    desc: "Sharp and versatile modern blazer with half-canvas construction that contours to your body over time for a custom fit."
  },
  {
    id: 3,
    name: "Silk Evening Slip Dress",
    category: "women",
    isNew: true,
    price: 7999,
    oldPrice: 9999,
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
    desc: "Sculpted on the bias grain from heavyweight 22-momme Mulberry silk for an effortless liquid silhouette."
  },
  {
    id: 4,
    name: "Cozy Alpaca Knit Sweater",
    category: "women",
    isNew: true,
    price: 6999,
    oldPrice: null,
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
    desc: "Cloud-soft turtleneck spun from hypoallergenic Peruvian Royal Alpaca and organic Pima cotton yarns."
  },
  {
    id: 5,
    name: "Casual Poplin Cotton Shirt",
    category: "men",
    isNew: false,
    price: 4499,
    oldPrice: 5799,
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
    desc: "Two-ply Giza long-staple Egyptian cotton poplin with genuine mother-of-pearl buttons."
  },
  {
    id: 6,
    name: "Genuine Leather Tote Bag",
    category: "accessories",
    isNew: true,
    price: 8999,
    oldPrice: 10799,
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
    desc: "Certified vegetable-tanned full-grain calf leather crafted with durable hand-burnished edges."
  }
];
