/*
  =============================================
  APPLICATION CONFIGURATION (constants.js)
  
  Central place for global constants, storage keys,
  shipping rules, and promo voucher definitions.
  =============================================
*/

export const APP_CONFIG = {
  STORE_NAME: "AURA CLOTHING CO.",
  CURRENCY_SYMBOL: "$",
  FREE_SHIPPING_THRESHOLD: 100, // Orders $100+ get free shipping
  STANDARD_SHIPPING_FEE: 15,
  TAX_RATE: 0.08, // 8% sales tax

  STORAGE_KEYS: {
    CART: "aura_cart_v2",
    WISHLIST: "aura_wishlist_v2"
  },

  PROMO_CODES: {
    TEEN20: { discount: 0.20, label: "20% Exclusive Discount" },
    WELCOME10: { discount: 0.10, label: "10% Welcome Discount" }
  }
};
