/*
  =============================================
  CART SERVICE (cart.service.js)
  
  Manages shopping bag items, subtotal, promo privilege codes, and badge listeners.
  =============================================
*/

import { StorageService } from "./storage.service.js";
import { APP_CONFIG } from "../config/constants.js";

const PROMO_STORAGE_KEY = "aura_promo_v3";

class CartService {
  constructor() {
    this.items = StorageService.get(APP_CONFIG.storageKeys.cart, []);
    this.appliedPromo = StorageService.get(PROMO_STORAGE_KEY, null);
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.getState());
  }

  _notify() {
    StorageService.set(APP_CONFIG.storageKeys.cart, this.items);
    StorageService.set(PROMO_STORAGE_KEY, this.appliedPromo);
    const state = this.getState();
    this.listeners.forEach(cb => cb(state));
  }

  getState() {
    const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    let discountAmount = 0;
    let isPromoApplied = false;

    if (this.appliedPromo && this.appliedPromo.toUpperCase() === APP_CONFIG.promoCode.toUpperCase()) {
      isPromoApplied = true;
      discountAmount = Math.round((subtotal * APP_CONFIG.discountPercent) / 100);
    }

    const finalTotal = Math.max(0, subtotal - discountAmount);

    return {
      items: this.items,
      count: totalCount,
      subtotal: subtotal,
      promoCode: this.appliedPromo,
      isPromoApplied: isPromoApplied,
      discountPercent: isPromoApplied ? APP_CONFIG.discountPercent : 0,
      discountAmount: discountAmount,
      finalTotal: finalTotal
    };
  }

  addItem(product, quantity = 1, size = "M", color = null) {
    const selectedColor = color || (product.colors && product.colors[0] ? product.colors[0].name : "Signature");
    const existing = this.items.find(i => i.id === product.id && i.size === size && i.color === selectedColor);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        size: size,
        color: selectedColor,
        quantity: quantity
      });
    }
    this._notify();
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this._notify();
  }

  adjustQuantity(index, delta) {
    if (this.items[index]) {
      this.items[index].quantity += delta;
      if (this.items[index].quantity <= 0) {
        this.items.splice(index, 1);
      }
      this._notify();
    }
  }

  applyPromo(code) {
    if (!code) return { success: false, message: "Please enter a valid code." };
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === APP_CONFIG.promoCode.toUpperCase()) {
      this.appliedPromo = cleanCode;
      this._notify();
      return { success: true, message: `Privilege code ${cleanCode} applied (-20%).` };
    }
    return { success: false, message: "Invalid privilege code. Use 'ATELIER20'." };
  }

  removePromo() {
    this.appliedPromo = null;
    this._notify();
  }

  clear() {
    this.items = [];
    this._notify();
  }
}

export const cartService = new CartService();
