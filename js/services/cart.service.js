/*
  =============================================
  CART SERVICE (cart.service.js)
  
  Manages shopping bag items, subtotal, and badge listeners.
  =============================================
*/

import { StorageService } from "./storage.service.js";
import { APP_CONFIG } from "../config/constants.js";

class CartService {
  constructor() {
    this.items = StorageService.get(APP_CONFIG.storageKeys.cart, []);
    this.listeners = [];
  }

  // Subscribe a component to cart changes
  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.getState());
  }

  _notify() {
    StorageService.set(APP_CONFIG.storageKeys.cart, this.items);
    const state = this.getState();
    this.listeners.forEach(cb => cb(state));
  }

  getState() {
    const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      items: this.items,
      count: totalCount,
      subtotal: subtotal
    };
  }

  addItem(product, quantity = 1) {
    const existing = this.items.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }
    this._notify();
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this._notify();
  }

  clear() {
    this.items = [];
    this._notify();
  }
}

export const cartService = new CartService();
