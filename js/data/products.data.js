/*
  =============================================
  PRODUCT CATALOG DATA (products.data.js)
  
  Our central mock database of clothing products.
  Uses local self-contained assets in assets/images/
  =============================================
*/

export const PRODUCTS_DATA = [
  {
    id: 1,
    name: "Classic Beige Trench Coat",
    category: "women",
    isNew: true,
    price: 120,
    oldPrice: 150,
    rating: 5,
    reviewCount: 48,
    image: "assets/images/products/trench-coat-1.jpg",
    images: [
      "assets/images/products/trench-coat-1.jpg",
      "assets/images/products/trench-coat-2.jpg",
      "assets/images/products/trench-coat-3.jpg"
    ],
    description: "A timeless, warm double-breasted coat crafted from a premium virgin wool blend. Features storm flaps, horn buttons, and an elegant relaxed drape.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Oatmeal Camel", hex: "#C5A880" },
      { name: "Noir Black", hex: "#111111" },
      { name: "Chalk Cream", hex: "#EBE6DD" }
    ]
  },
  {
    id: 2,
    name: "Men's Tailored Wool Blazer",
    category: "men",
    isNew: true,
    price: 140,
    oldPrice: 175,
    rating: 5,
    reviewCount: 34,
    image: "assets/images/products/wool-blazer-1.jpg",
    images: [
      "assets/images/products/wool-blazer-1.jpg",
      "assets/images/products/wool-blazer-2.jpg"
    ],
    description: "Sharp and versatile modern blazer with half-canvas construction that contours to your body over time for a custom fit.",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Charcoal Slate", hex: "#2C302E" },
      { name: "Pure Onyx", hex: "#111111" }
    ]
  },
  {
    id: 3,
    name: "Silk Evening Slip Dress",
    category: "women",
    isNew: false,
    price: 95,
    oldPrice: 120,
    rating: 5,
    reviewCount: 62,
    image: "assets/images/products/silk-dress-1.jpg",
    images: [
      "assets/images/products/silk-dress-1.jpg",
      "assets/images/products/silk-dress-2.jpg"
    ],
    description: "Sculpted on the bias grain from heavyweight 22-momme Mulberry silk for an effortless liquid silhouette.",
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Champagne Pearl", hex: "#E8DFC5" },
      { name: "Emerald Forest", hex: "#16382C" },
      { name: "Noir Sheen", hex: "#111111" }
    ]
  },
  {
    id: 4,
    name: "Cozy Alpaca Knit Sweater",
    category: "women",
    isNew: true,
    price: 85,
    oldPrice: null,
    rating: 5,
    reviewCount: 29,
    image: "assets/images/products/knit-sweater-1.jpg",
    images: [
      "assets/images/products/knit-sweater-1.jpg",
      "assets/images/products/knit-sweater-2.jpg"
    ],
    description: "Cloud-soft turtleneck spun from hypoallergenic Peruvian Royal Alpaca and organic Pima cotton yarns.",
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Raw Ecru", hex: "#F3EFE6" },
      { name: "Warm Terracotta", hex: "#B86B53" }
    ]
  },
  {
    id: 5,
    name: "Casual Poplin Cotton Shirt",
    category: "men",
    isNew: false,
    price: 55,
    oldPrice: 70,
    rating: 5,
    reviewCount: 53,
    image: "assets/images/products/poplin-shirt-1.jpg",
    images: [
      "assets/images/products/poplin-shirt-1.jpg",
      "assets/images/products/poplin-shirt-2.jpg"
    ],
    description: "Two-ply Giza long-staple Egyptian cotton poplin with genuine mother-of-pearl buttons.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Optic White", hex: "#FFFFFF" },
      { name: "French Sky Blue", hex: "#ADC2D1" }
    ]
  },
  {
    id: 6,
    name: "Genuine Leather Tote Bag",
    category: "accessories",
    isNew: false,
    price: 110,
    oldPrice: 130,
    rating: 5,
    reviewCount: 78,
    image: "assets/images/products/leather-tote-1.jpg",
    images: [
      "assets/images/products/leather-tote-1.jpg",
      "assets/images/products/leather-tote-2.jpg"
    ],
    description: "Certified vegetable-tanned full-grain calf leather crafted with durable hand-burnished edges.",
    sizes: ["One Size"],
    colors: [
      { name: "Cognac Tan", hex: "#8A4927" },
      { name: "Pitch Black", hex: "#111111" }
    ]
  }
];
