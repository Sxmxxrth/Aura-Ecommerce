/*
  =============================================
  NAVBAR COMPONENT (navbar.component.js)
  =============================================
*/

import { cartService } from "../services/cart.service.js";
import { wishlistService } from "../services/wishlist.service.js";

export class NavbarComponent {
  static init() {
    const cartBadge = document.getElementById("cart-badge");
    const wishBadge = document.getElementById("wishlist-badge");

    // Keep badges in sync with service updates
    cartService.subscribe(state => {
      if (cartBadge) cartBadge.textContent = state.count;
    });

    wishlistService.subscribe(ids => {
      if (wishBadge) wishBadge.textContent = ids.length;
    });
  }
}
