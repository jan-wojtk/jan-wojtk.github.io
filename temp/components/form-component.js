class FormComponent extends HTMLElement {
  
  // Members
  get #styles() {
    return document.getElementById('chainmail-form-styles');
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
    const parser = new DOMParser();
    const template = `
      <fieldset>
        <legend>Sheet</legend>
        <label for="chainmail-form__columns">Columns</label>
        <input id="chainmail-form__columns" type="number" min="2" step="1" value="10" />
        
        <label for="chainmail-form__rows">Rows</label>
        <input id="chainmail-form__rows" type="number" min="2" step="1" value="6" />
      </fieldset>
      
      <fieldset>
        <legend>Ring</legend>
        <label for="chainmail-form__gauge">Gauge (AWG)</label>
        <select id="chainmail-form__gauge">
          <option value=".812">20g (.812mm)</option>
          <option value=".912">19g (.912mm)</option>
          <option value="1.02">18g (1.02mm)</option>
          <option value="1.15">17g (1.15mm)</option>
          <option value="1.29">16g (1.29mm)</option>
          <option value="1.45">15g (1.45mm)</option>
          <option value="1.63">14g (1.63mm)</option>
          <option value="1.83">13g (1.83mm)</option>
          <option value="2.05">12g (2.05mm)</option>
          <option value="2.31">11g (2.31mm)</option>
          <option value="2.59">10g (2.59mm)</option>
        </select>
        
        <label for="chainmail-form__inner-diameter">Inner Diameter</label>
        <select id="chainmail-form__inner-diameter">
          <option value="4">4mm</option>
          <option value="6">6mm</option>
          <option value="7">7mm</option>
          <option value="8">8mm</option>
        </select>
      </fieldset>
      
      <fieldset>
        <legend>View</legend>
        <label for="chainmail-form__zoom">Zoom</label>
        <input id="chainmail-form__zoom" type="number" min=".5" max="3" step=".01" value="1" />
        
        <label><input id="chainmail-form__dark-mode" type="checkbox"/>Dark Mode</label>
      </fieldset>
    `;
    const fieldsets = parser.parseFromString(template, 'text/html').body.children;
    while(fieldsets.length > 0) this.appendChild(fieldsets[0]);
    
    // Render styles
    if(!this.#styles)
      document.head.appendChild(parser.parseFromString(`
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
      `, 'text/html').head.children[0]);
      
      // Register Event Listeners
      this.#gaugeSelect.addEventListener('change', this.#setGauge);
      this.#innerDiameterSelect.addEventListener('change', this.#setInnerDiameter);
      this.#rowsInput.addEventListener('change', this.#setRows);
      this.#columnsInput.addEventListener('change', this.#setColumns);
      this.#zoomInput.addEventListener('change', this.#setZoom);
      this.#darkModeCheckbox.addEventListener('change', this.#setDarkMode);
  }
  
  #setGauge(event) {
    const newValue = event.target.value;
    document.querySelector('chainmail-sheet').setAttribute(SheetComponent.attributeNames.gaugeMm, newValue);
  }
  
  #setInnerDiameter(event) {
    const newValue = event.target.value;
    document.querySelector('chainmail-sheet').setAttribute(SheetComponent.attributeNames.innerDiameterMm, newValue);
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
    document.querySelector('body > main').style.zoom = newValue;
  }
  
  #setDarkMode() {
    
  }
}
customElements.define("chainmail-form", FormComponent);