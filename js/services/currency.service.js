/*
  =============================================
  CURRENCY SERVICE (currency.service.js)
  
  INR-only currency formatter for Indian luxury patrons.
  =============================================
*/

class CurrencyService {
  constructor() {
    this.listeners = [];
  }

  getCurrency() {
    return { code: "INR", symbol: "₹", rate: 1, label: "INR (₹)" };
  }

  format(price) {
    return "₹" + price.toLocaleString("en-IN");
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
