/*
  =============================================
  PRODUCT CATALOG DATA (products.data.js)
  
  Our central mock database of clothing products.
  Each object holds the product id, name, category,
  prices, images, sizes, and colors.
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
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80"
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
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80"
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
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=800&q=80"
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
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80"
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
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80"
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
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Certified vegetable-tanned full-grain calf leather crafted with durable hand-burnished edges.",
    sizes: ["One Size"],
    colors: [
      { name: "Cognac Tan", hex: "#8A4927" },
      { name: "Pitch Black", hex: "#111111" }
    ]
  }
];
