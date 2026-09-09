/*
  =============================================
  CURRENCY SERVICE (currency.service.js)
  
  Multi-currency converter for global luxury patrons (USD, EUR, GBP).
  =============================================
*/

import { StorageService } from "./storage.service.js";

const CURRENCIES = {
  USD: { code: "USD", symbol: "$", rate: 1.00, label: "USD ($)" },
  EUR: { code: "EUR", symbol: "€", rate: 0.92, label: "EUR (€)" },
  GBP: { code: "GBP", symbol: "£", rate: 0.79, label: "GBP (£)" }
};

const STORAGE_KEY = "aura_currency_pref";

class CurrencyService {
  constructor() {
    const saved = StorageService.get(STORAGE_KEY, "USD");
    this.currentCode = CURRENCIES[saved] ? saved : "USD";
    this.listeners = [];
  }

  getCurrency() {
    return CURRENCIES[this.currentCode];
  }

  setCurrency(code) {
    if (CURRENCIES[code] && code !== this.currentCode) {
      this.currentCode = code;
      StorageService.set(STORAGE_KEY, code);
      this._notify();
    }
  }

  format(priceInUSD) {
    const curr = this.getCurrency();
    const converted = priceInUSD * curr.rate;
    return `${curr.symbol}${converted.toFixed(2)}`;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.getCurrency());
  }

  _notify() {
    const curr = this.getCurrency();
    this.listeners.forEach(cb => cb(curr));
  }
}

export const currencyService = new CurrencyService();
