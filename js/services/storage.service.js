/*
  =============================================
  STORAGE SERVICE (storage.service.js)
  
  Safe wrapper around localStorage.
  Handles JSON serialization, parsing, and errors
  (e.g., if the user is in private browsing mode).
  =============================================
*/

export class StorageService {
  /**
   * Read data from localStorage safely.
   */
  static get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      console.warn(`[StorageService] Could not read "${key}":`, err);
      return fallback;
    }
  }

  /**
   * Save data into localStorage safely.
   */
  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`[StorageService] Could not save "${key}":`, err);
    }
  }

  /**
   * Remove a key from localStorage.
   */
  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn(`[StorageService] Could not remove "${key}":`, err);
    }
  }
}
