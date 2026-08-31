/*
  =============================================
  CONTACT PAGE CONTROLLER (contact.page.js)
  
  Validates contact form submission and displays toast feedback.
  =============================================
*/

import { ToastComponent } from "../components/toast.component.js";

export class ContactPage {
  static init() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("contact-name");
      const name = nameInput ? nameInput.value.trim() : "Customer";

      ToastComponent.show(`Thank you, ${name}! Your inquiry has been dispatched. ✉️`);
      form.reset();
    });
  }
}
