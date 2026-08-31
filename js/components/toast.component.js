/*
  =============================================
  TOAST COMPONENT (toast.component.js)
  
  Creates non-blocking floating alert banners.
  =============================================
*/

export class ToastComponent {
  static show(message) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
    container.appendChild(toast);

    // Trigger smooth enter transition
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}
