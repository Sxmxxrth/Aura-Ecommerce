/*
  =============================================
  WISHLIST SERVICE (wishlist.service.js)
  
  Manages saved wishlist IDs and badge synchronization.
  =============================================
*/

import { StorageService } from "./storage.service.js";
import { APP_CONFIG } from "../config/constants.js";

class WishlistService {
  constructor() {
    this.ids = StorageService.get(APP_CONFIG.storageKeys.wishlist, []);
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.ids);
  }

  _notify() {
    StorageService.set(APP_CONFIG.storageKeys.wishlist, this.ids);
    this.listeners.forEach(cb => cb(this.ids));
  }

  has(id) {
    return this.ids.includes(Number(id));
  }

  toggle(id) {
    const numId = Number(id);
    const index = this.ids.indexOf(numId);
    if (index > -1) {
      this.ids.splice(index, 1);
    } else {
      this.ids.push(numId);
    }
    this._notify();
    return this.has(numId);
  }

  getCount() {
    return this.ids.length;
  }
}

export const wishlistService = new WishlistService();
