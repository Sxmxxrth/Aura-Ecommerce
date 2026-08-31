/*
  =============================================
  STORAGE SERVICE (storage.service.js)
  
  Safe wrapper around browser localStorage.
  =============================================
*/

export class StorageService {
  static get(key, fallback = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`[StorageService] Failed to read ${key}:`, e);
      return fallback;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[StorageService] Failed to write ${key}:`, e);
    }
  }
}
