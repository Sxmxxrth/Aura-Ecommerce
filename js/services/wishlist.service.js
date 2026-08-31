/*
  =============================================
  WISHLIST SERVICE (wishlist.service.js)
  
  Manages saved favorite items and heart button states.
  =============================================
*/

import { APP_CONFIG } from "../config/constants.js";
import { StorageService } from "./storage.service.js";

export class WishlistService {
  constructor() {
    this.items = StorageService.get(APP_CONFIG.STORAGE_KEYS.WISHLIST, []);
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  _notify() {
    StorageService.set(APP_CONFIG.STORAGE_KEYS.WISHLIST, this.items);
    const state = this.getState();
    this.listeners.forEach(cb => cb(state));
  }

  /**
   * Toggle product id in/out of wishlist.
   * Returns true if saved, false if removed.
   */
  toggle(productId) {
    const id = Number(productId);
    const index = this.items.indexOf(id);
    let isSaved = false;

    if (index > -1) {
      this.items.splice(index, 1);
      isSaved = false;
    } else {
      this.items.push(id);
      isSaved = true;
    }

    this._notify();
    return isSaved;
  }

  has(productId) {
    return this.items.includes(Number(productId));
  }

  getState() {
    return {
      items: [...this.items],
      count: this.items.length
    };
  }
}

export const wishlistService = new WishlistService();
