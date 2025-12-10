class FormComponent extends HTMLElement {
  
  // Members
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
    const gauges = GaugeLogic.GetGauges();
    const innerDiameters = [4, 6, 7, 8];
    const newTemplate = `
      <fieldset>
        <legend>Sheet</legend>
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
              const isValidRingType = EuropeanFourInOneLogic.IsValidRingType(innerDiameter, this.#getAwg());
              
              return `
                <option
                  value="${innerDiameter}"
                  ${innerDiameter === this.#getInnerDiameter() ? 'selected' : ''}
                  ${!isValidRingType ? ' disabled' : ''}
                  ${!isValidRingType ? ` title="Can't complete a European Four-In-One sheet with AWG ${this.#getAwg()}g and Inner Diameter ${innerDiameter}"` : ''}
                >${innerDiameter}mm</option>
              `;
            }).join('')
          }
        </select>
        
        <label for="chainmail-form__gauge">Gauge (AWG)</label>
        <select id="chainmail-form__gauge">
          ${
            gauges.map(gauge => {
              const isValidRingType = EuropeanFourInOneLogic.IsValidRingType(this.#getInnerDiameter(), gauge.awg);
              
              return `
                <option
                  value="${gauge.awg}"
                  ${gauge.awg === this.#getAwg() ? 'selected' : ''}
                  ${!isValidRingType ? 'disabled' : ''}
                  ${!isValidRingType ? ` title="Can't complete a European Four-In-One sheet with AWG ${gauge.awg}g and Inner Diameter ${this.#getInnerDiameter()}"` : ''}
                >${gauge.awgGauge} (${gauge.mm})</option>
              `
            }).join('')
          }
        </select>
      </fieldset>
      
      <fieldset>
        <legend>View</legend>
        <label for="chainmail-form__zoom">Zoom</label>
        <input id="chainmail-form__zoom" type="number" min="50" max="300" step="10" value="200" />
        
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
    this.appendChild(parser.parseFromString(this.#getInnerDiameterIcon(), 'text/html').body.children[0]);
    this.appendChild(parser.parseFromString(this.#getGaugeIcon(), 'text/html').body.children[0]);
    
    this.#registerEventListeners();
  }
  
  #registerEventListeners() {
    // Register Event Listeners
    this.#gaugeSelect.addEventListener('change', this.#setGauge.bind(this));
    this.#innerDiameterSelect.addEventListener('change', this.#setInnerDiameter.bind(this));
    this.#rowsInput.addEventListener('change', this.#setRows);
    this.#columnsInput.addEventListener('change', this.#setColumns);
    this.#zoomInput.addEventListener('change', this.#setZoom);
    this.#darkModeCheckbox.addEventListener('change', this.#setDarkMode);
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
  
  #setGauge(event) {
    const newValue = event.target.value;
    document.querySelector('chainmail-sheet').setAttribute(SheetComponent.attributeNames.awg, newValue);
    this.#renderTemplate();
  }
  
  #setInnerDiameter(event) {
    const newValue = event.target.value;
    document.querySelector('chainmail-sheet').setAttribute(SheetComponent.attributeNames.innerDiameter, newValue);
    this.#renderTemplate();
  }
  
  #setRows(event) {
    const newValue = event.target.value;
    document.querySelector('chainmail-sheet').setAttribute(SheetComponent.attributeNames.rows, newValue);
  }
  
  #setColumns(event) {
    const newValue = event.target.value;
    document.querySelector('chainmail-sheet').setAttribute(SheetComponent.attributeNames.columns, newValue);
  }
  
  #setZoom(event) {
    const newValue = event.target.value;
    document.querySelector('body > main').style.zoom = parseInt(newValue)/100;
  }
  
  #setDarkMode(event) {
    if(event.target.checked) document.body.classList.add('dark-mode');
    if(!event.target.checked) document.body.classList.remove('dark-mode');
  }
  
  #getInnerDiameter() {
    return parseInt(document.querySelector('chainmail-sheet').getAttribute(SheetComponent.attributeNames.innerDiameter));
  }
  
  #getAwg() {
    return parseInt(document.querySelector('chainmail-sheet').getAttribute(SheetComponent.attributeNames.awg));
  }
  
  #getGaugeIcon() {
    return `
      <div style="border-radius: 50%; display: flex; align-items: center; height: 24px; width: 30px;">
        <div style="border: 8px solid gray; border-radius: 50%; display: flex; align-items: center; height: 59.375%; width: 59.375%; margin: 0 auto;">
          <div id="double-arrow" style="display: flex; align-items: center; margin-left: -8px;">          
            <div id="double-arrow__left" style="border-right: 3px solid yellow; border-top: 2px solid transparent; border-bottom: 2px solid transparent; width: 0; height: 0;"></div>
            <div id="double-arrow__line" style="background-color: yellow; height: 1px; width: 2px;"></div>
            <div id="double-arrow__right" style="border-left: 3px solid yellow; border-top: 2px solid transparent; border-bottom: 2px solid transparent; width: 0; height: 0;"></div>
          </div>
        </div>
      </div>
    `;
  }
  
  #getInnerDiameterIcon() {
    return `
      <div style="border-radius: 50%; display: flex; align-items: center; height: 64px; width: 64px;">
        <div style="border: 13px solid gray; border-radius: 50%; height: 38px; width: 38px; margin: 0 auto; outline: 5px solid yellow; outline-offset: -13px;"></div>
      </div>
    `;
  }
}
customElements.define("chainmail-form", FormComponent);