/*
  =============================================
  SIZE GUIDE MODAL COMPONENT (size-modal.component.js)
  =============================================
*/

export class SizeModalComponent {
  static init() {
    let backdrop = document.getElementById("size-modal-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "size-modal-backdrop";
      backdrop.className = "modal-backdrop";
      backdrop.onclick = (e) => {
        if (e.target === backdrop) SizeModalComponent.close();
      };

      backdrop.innerHTML = `
        <div class="modal-dialog">
          <button class="modal-close-btn" onclick="window.__aura.closeSizeGuide()" aria-label="Close Size Guide">&times;</button>
          <h3 class="modal-title">Atelier Measurement &amp; Sizing</h3>
          <p class="modal-subtitle">All garments are sculpted according to traditional Parisian tailoring specifications.</p>
          
          <div class="size-table-wrap">
            <table class="size-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (in/cm)</th>
                  <th>Waist (in/cm)</th>
                  <th>Shoulder (in/cm)</th>
                  <th>Length (in/cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>XS</strong></td>
                  <td>34" / 86 cm</td>
                  <td>28" / 71 cm</td>
                  <td>16.5" / 42 cm</td>
                  <td>39" / 99 cm</td>
                </tr>
                <tr>
                  <td><strong>S</strong></td>
                  <td>36" / 91 cm</td>
                  <td>30" / 76 cm</td>
                  <td>17.0" / 43 cm</td>
                  <td>40" / 101 cm</td>
                </tr>
                <tr>
                  <td><strong>M</strong></td>
                  <td>38" / 96 cm</td>
                  <td>32" / 81 cm</td>
                  <td>17.5" / 44 cm</td>
                  <td>41" / 104 cm</td>
                </tr>
                <tr>
                  <td><strong>L</strong></td>
                  <td>41" / 104 cm</td>
                  <td>35" / 89 cm</td>
                  <td>18.2" / 46 cm</td>
                  <td>42" / 106 cm</td>
                </tr>
                <tr>
                  <td><strong>XL</strong></td>
                  <td>44" / 112 cm</td>
                  <td>38" / 96 cm</td>
                  <td>19.0" / 48 cm</td>
                  <td>43" / 109 cm</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="size-guide-tip">
            <strong>Bespoke Fit Advice:</strong> If you are between sizes or desire an oversized runway silhouette for outerwear, our master tailors recommend selecting the larger size. Complimentary returns and size exchanges are included on all orders.
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);
    }
  }

  static open() {
    SizeModalComponent.init();
    const backdrop = document.getElementById("size-modal-backdrop");
    if (backdrop) backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  static close() {
    const backdrop = document.getElementById("size-modal-backdrop");
    if (backdrop) backdrop.classList.remove("active");
    document.body.style.overflow = "";
  }
}
