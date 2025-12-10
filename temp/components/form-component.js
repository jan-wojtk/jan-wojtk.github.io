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
          <option value="20">20g (.812mm)</option>
          <option value="19">19g (.912mm)</option>
          <option value="18" selected>18g (1.02mm)</option>
          <option value="17">17g (1.15mm)</option>
          <option value="16">16g (1.29mm)</option>
          <option value="15">15g (1.45mm)</option>
          <option value="14">14g (1.63mm)</option>
          <option value="13">13g (1.83mm)</option>
          <option value="12">12g (2.05mm)</option>
          <option value="11">11g (2.31mm)</option>
          <option value="10">10g (2.59mm)</option>
          <option value="9">9g (2.91mm)</option>
        </select>
        
        <label for="chainmail-form__inner-diameter">Inner Diameter</label>
        <select id="chainmail-form__inner-diameter">
          <option value="4" selected>4mm</option>
          <option value="6">6mm</option>
          <option value="7">7mm</option>
          <option value="8">8mm</option>
        </select>
      </fieldset>
      
      <fieldset>
        <legend>View</legend>
        <label for="chainmail-form__zoom">Zoom</label>
        <input id="chainmail-form__zoom" type="number" min="50" max="300" step="10" value="200" />
        
        <label><input id="chainmail-form__dark-mode" type="checkbox" checked/>Dark Mode</label>
      </fieldset>
    `;
    const fieldsets = parser.parseFromString(template, 'text/html').body.children;
    while(fieldsets.length > 0) this.appendChild(fieldsets[0]);
    
    // Render styles
    this.#renderStyles();
      
      
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
    document.querySelector('chainmail-sheet').setAttribute(SheetComponent.attributeNames.awg, newValue);
  }
  
  #setInnerDiameter(event) {
    const newValue = event.target.value;
    document.querySelector('chainmail-sheet').setAttribute(SheetComponent.attributeNames.innerDiameter, newValue);
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
}
customElements.define("chainmail-form", FormComponent);