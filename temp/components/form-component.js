class FormComponent extends HTMLElement {
  
  // Members
  #activeLayer = 1;
  
  get #styles() {
    return document.getElementById('chainmail-form-styles');
  }
  
  #renderStyles() {
    const hasExistingStyles = !!this.#styles;
    const hasNewParameter = !hasExistingStyles;
    
    if(hasNewParameter) {
      const parser = new DOMParser();
      const newStyles = parser.parseFromString(`
          <style id="chainmail-form-styles">
            chainmail-form > fieldset {
              border: 0;
              border-top: 1px dashed #cccccc;
              display:block;
              padding: 0;
            }
            
            chainmail-form > fieldset ~ fieldset {
              margin-top: 2em;
            }
            
            chainmail-form > fieldset > table {
              border-collapse: collapse;
              color: #cccccc;
              width: 100%;
            }
            
            chainmail-form > fieldset > table td, chainmail-form > fieldset > table th {
              border-right: 1px solid #cccccc;
              text-align: left;
            }
            
            chainmail-form > fieldset > table tbody td {
              border-top: 0px solid #cccccc;
              border-right: 0px solid #cccccc;
            }
            
            chainmail-form table .layer-table__visibility, chainmail-form table .layer-table__remove {
              border-left: 0px solid #cccccc;
              font-size: 22px;
              max-width: 14px;
              padding-bottom: 4px; /* todo: figure out how to align vertically */
              text-align: center;
            }
            
            chainmail-form > fieldset > table tbody td:last-child  {
              border-top: 0px solid #cccccc;
              border-right: 0px solid #cccccc;
            }
            
            chainmail-form > fieldset > table td:last-child, chainmail-form > fieldset > table th:last-child {
              border-right: 0px;
            }
            
            chainmail-form > fieldset > legend {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: .5em;
            }
            
            chainmail-form > fieldset > label {
              display:block;
              font-size: 14px;
              font-weight: bold;
              margin-top: .5em;
            }
            
            chainmail-form > fieldset > label::after {
              content: "\\A";
              display: block;
              font-size: 0;
              white-space: pre-wrap;
            }
            
            chainmail-form > fieldset > label ~ input,
            chainmail-form > fieldset > label ~ select {
              height: 2em;
              width: 100%;
            }
          </style>
        `, 'text/html').head.children[0];
      
      if(!hasExistingStyles) document.head.appendChild(newStyles);
      else this.#styles.replaceWith(newStyles);
    }
  }
  
  #renderTemplate() {
    const parser = new DOMParser();
    const weaves = WeaveLogic.GetWeaves();
    const gauges = GaugeLogic.GetGauges();
    const innerDiameters = [4, 6, 7, 8];
    
    const currentWeaveName = this.#getWeave();
    const currentAwg = this.#getAwg();
    const currentInnerDiameter = this.#getInnerDiameter();
    const layerList = LayerLogic.GetLayerList();

    // todo: move this into a factory
    const currentWeaveLogic = 
      WeaveLogic.IsEuropeanFourInOne(currentWeaveName) ? EuropeanFourInOneLogic
      : WeaveLogic.IsEuropeanSixInOne(currentWeaveName) ? EuropeanSixInOneLogic
      : null;
    
    const newTemplate = `
      <fieldset>
        <legend>Layer</legend>
        <table>
          <tbody>
            ${
              layerList.map(l => `
                <tr>
                  <td class="layer-table__visibility" class="lay">${l.hidden ? 'hidden' : '&#x1F441'}</td>
                  <td>${l.name}</td>
                  <td class="layer-table__remove">&#10006;</td>
                </tr>
              `).join('')
            }
            <tr>
              <td colspan="3" style="border-right: 0px; text-align: center;">&plus; Add New Layer</td>
            </tr>
          </tbody>
        </table>
      </fieldset>
      <fieldset>
        <legend>Sheet</legend>
        <label for="chainmail-form__weave">Weave</label>
        <select id="chainmail-form__weave">
          ${
            weaves.map(weave => `
              <option
                value="${weave.name}"
                ${weave.name === this.#getWeave() ? 'selected' : ''}
              >${weave.name}</option>
            `).join('')
          }
        </select>
        
        <label for="chainmail-form__columns">Columns</label>
        <input id="chainmail-form__columns" type="number" min="2" step="1" value="10" />
        
        <label for="chainmail-form__rows">Rows</label>
        <input id="chainmail-form__rows" type="number" min="2" step="1" value="6" />
      </fieldset>
      
      <fieldset>
        <legend>Ring</legend>
        <label for="chainmail-form__inner-diameter">Inner Diameter</label>
        <select id="chainmail-form__inner-diameter">
          ${
            innerDiameters.map(innerDiameter => {
              const isValidRingType = currentWeaveLogic.IsValidRingType(innerDiameter, this.#getAwg());
              
              return `
                <option
                  value="${innerDiameter}"
                  ${innerDiameter === this.#getInnerDiameter() ? 'selected' : ''}
                  ${!isValidRingType ? ' disabled' : ''}
                  ${!isValidRingType ? ` title="Can't complete a ${currentWeaveName} with AWG ${this.#getAwg()}g and Inner Diameter ${innerDiameter}"` : ''}
                >${innerDiameter}mm</option>
              `;
            }).join('')
          }
        </select>
        
        <label for="chainmail-form__gauge">Gauge (AWG)</label>
        <select id="chainmail-form__gauge">
          ${
            gauges.map(gauge => {
              const isValidRingType = currentWeaveLogic.IsValidRingType(this.#getInnerDiameter(), gauge.awg);
              
              return `
                <option
                  value="${gauge.awg}"
                  ${gauge.awg === this.#getAwg() ? 'selected' : ''}
                  ${!isValidRingType ? 'disabled' : ''}
                  ${!isValidRingType ? ` title="Can't complete a ${currentWeaveName} with AWG ${gauge.awg}g and Inner Diameter ${this.#getInnerDiameter()}"` : ''}
                >${gauge.awgGauge} (${gauge.mm})</option>
              `
            }).join('')
          }
        </select>
      </fieldset>
      
      <fieldset>
        <legend>View</legend>
        <label for="chainmail-form__zoom">Zoom</label>
        <input id="chainmail-form__zoom" type="number" min="50" max="300" step="10" value="${this.#getZoom()}" />
        
        <label><input id="chainmail-form__dark-mode" type="checkbox" checked/>Dark Mode</label>
      </fieldset>
    `;
    
    const fieldsets = parser.parseFromString(newTemplate, 'text/html').body.children;
    const hasExistingTemplate = !!this.children.length > 0;
    if(!hasExistingTemplate) { 
      this.replaceChildren(...fieldsets);    
    } else {
      this.replaceChildren(...fieldsets);
    }
    
    this.#registerEventListeners();
  }
  
  #registerEventListeners() {
    // Register Event Listeners
    this.#weaveSelect.addEventListener('change', this.#setWeave.bind(this));
    this.#gaugeSelect.addEventListener('change', this.#setGauge.bind(this));
    this.#innerDiameterSelect.addEventListener('change', this.#setInnerDiameter.bind(this));
    this.#rowsInput.addEventListener('change', this.#setRows);
    this.#columnsInput.addEventListener('change', this.#setColumns);
    this.#zoomInput.addEventListener('change', this.#setZoom);
    this.#darkModeCheckbox.addEventListener('change', this.#setDarkMode);
  }
  
  get #weaveSelect() {
    return document.getElementById('chainmail-form__weave');
  }
  
  get #rowsInput() {
    return document.getElementById('chainmail-form__rows');
  }
  
  get #columnsInput() {
    return document.getElementById('chainmail-form__columns');
  }
  
  get #innerDiameterSelect() {
    return document.getElementById('chainmail-form__inner-diameter');
  }
  
  get #gaugeSelect() {
    return document.getElementById('chainmail-form__gauge');
  }
  
  get #zoomInput() {
    return document.getElementById('chainmail-form__zoom');
  }
  
  get #darkModeCheckbox() {
    return document.getElementById('chainmail-form__dark-mode');  
  }
  
  connectedCallback() {
    // Render styles
    this.#renderTemplate();
    this.#renderStyles();
  }
  
  #getActiveSheet() {
    return document.querySelector(`chainmail-sheet[layer="${this.#activeLayer}"]`);
  }
  
  #setWeave(event) {
    const newValue = event.target.value;
    const sheet = this.#getActiveSheet();
    sheet.setAttribute(SheetComponent.attributeNames.awg, 18);
    sheet.setAttribute(SheetComponent.attributeNames.innerDiameter, 4);
    sheet.setAttribute(SheetComponent.attributeNames.weave, newValue);
    this.#renderTemplate();
  }
  
  #setGauge(event) {
    const newValue = event.target.value;
    this.#getActiveSheet().setAttribute(SheetComponent.attributeNames.awg, newValue);
    this.#renderTemplate();
  }
  
  #setInnerDiameter(event) {
    const newValue = event.target.value;
    this.#getActiveSheet().setAttribute(SheetComponent.attributeNames.innerDiameter, newValue);
    this.#renderTemplate();
  }
  
  #setRows(event) {
    const newValue = event.target.value;
    this.#getActiveSheet().setAttribute(SheetComponent.attributeNames.rows, newValue);
  }
  
  #setColumns(event) {
    const newValue = event.target.value;
    this.#getActiveSheet().setAttribute(SheetComponent.attributeNames.columns, newValue);
  }
  
  #setZoom(event) {
    const newValue = event.target.value;
    document.querySelector('body > main').style.zoom = parseInt(newValue)/100;
  }
  
  #setDarkMode(event) {
    if(event.target.checked) document.body.classList.add('dark-mode');
    if(!event.target.checked) document.body.classList.remove('dark-mode');
  }
  
  #getWeave() {
    return this.#getActiveSheet().getAttribute(SheetComponent.attributeNames.weave);
  }
  
  #getInnerDiameter() {
    return parseInt(this.#getActiveSheet().getAttribute(SheetComponent.attributeNames.innerDiameter));
  }
  
  #getAwg() {
    return parseInt(this.#getActiveSheet().getAttribute(SheetComponent.attributeNames.awg));
  }
  
  #getZoom() {
    return parseInt(parseFloat(document.querySelector('main').style.zoom) * 100);
  }
}
customElements.define("chainmail-form", FormComponent);