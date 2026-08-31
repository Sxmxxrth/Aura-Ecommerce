/*
  =============================================
  CART SERVICE (cart.service.js)
  
  Single Source of Truth for the shopping bag.
  - Adds, updates, and removes items
  - Calculates subtotal, discounts, tax, shipping
  - Emits updates to all subscribed UI components
  =============================================
*/

import { APP_CONFIG } from "../config/constants.js";
import { StorageService } from "./storage.service.js";

export class CartService {
  constructor() {
    this.items = StorageService.get(APP_CONFIG.STORAGE_KEYS.CART, []);
    this.listeners = [];
  }

  /**
   * Subscribe to cart changes.
   * UI components use this to auto-update when cart changes!
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  _notify() {
    StorageService.set(APP_CONFIG.STORAGE_KEYS.CART, this.items);
    const state = this.getState();
    this.listeners.forEach(cb => cb(state));
  }

  /**
   * Add a product to the cart.
   */
  addItem(product, size = "M", color = "Default", quantity = 1) {
    if (!product) return;

    const existingIndex = this.items.findIndex(
      item => item.id === product.id && item.size === size && item.color === color
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        color,
        quantity
      });
    }

    this._notify();
  }

  /**
   * Remove item by index in the array.
   */
  removeItem(index) {
    if (this.items[index]) {
      this.items.splice(index, 1);
      this._notify();
    }
  }

  /**
   * Clear all items (used after checkout).
   */
  clear() {
    this.items = [];
    this._notify();
  }

  /**
   * Compute full totals and state.
   */
  getState() {
    const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const shipping = subtotal >= APP_CONFIG.FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : APP_CONFIG.STANDARD_SHIPPING_FEE;
    const tax = subtotal * APP_CONFIG.TAX_RATE;
    const total = subtotal + shipping + tax;

    return {
      items: [...this.items],
      count,
      subtotal,
      shipping,
      tax,
      total
    };
  }
}

export const cartService = new CartService();
