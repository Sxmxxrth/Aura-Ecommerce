/*
  =============================================
  COUNTDOWN COMPONENT (countdown.component.js)
  
  Drives the promotional offer countdown timer
  with real-time second ticks using setInterval().
  =============================================
*/

export class CountdownComponent {
  static init() {
    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minsEl = document.getElementById("cd-mins");
    const secsEl = document.getElementById("cd-secs");

    if (!daysEl) return;

    let totalSeconds = 3600 * 48; // 48 hours countdown

    const tick = () => {
      totalSeconds--;
      if (totalSeconds <= 0) totalSeconds = 3600 * 48;

      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minsEl.textContent = String(mins).padStart(2, "0");
      secsEl.textContent = String(secs).padStart(2, "0");
    };

    tick();
    setInterval(tick, 1000);
  }
}
