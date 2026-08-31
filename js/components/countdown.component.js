/*
  =============================================
  COUNTDOWN TIMER COMPONENT (countdown.component.js)
  =============================================
*/

export class CountdownComponent {
  static init() {
    const daysEl = document.getElementById("cd-days");
    if (!daysEl) return;

    let totalSecs = 3600 * 48; // 48 hours

    setInterval(() => {
      totalSecs--;
      if (totalSecs <= 0) totalSecs = 3600 * 48;

      const days = Math.floor(totalSecs / (3600 * 24));
      const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;

      document.getElementById("cd-days").textContent = String(days).padStart(2, "0");
      document.getElementById("cd-hours").textContent = String(hours).padStart(2, "0");
      document.getElementById("cd-mins").textContent = String(mins).padStart(2, "0");
      document.getElementById("cd-secs").textContent = String(secs).padStart(2, "0");
    }, 1000);
  }
}
