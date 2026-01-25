class SheetFormComponent extends BaseComponent {
  static tag = 'chainmail-sheet-form';
  static attributeNames = { activeLayer: 'active-layer' };
  static observedAttributes = Object.values(SheetFormComponent.attributeNames);
  
  get #activeLayer() { return this.getAttribute(SheetFormComponent.attributeNames.activeLayer) }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if(SheetFormComponent.attributeNames.activeLayer === name) this.#onChangeLayer(newValue);
  }
  
  #onChangeLayer(newValue) {
    console.log('sheet form changed layer', this.#activeLayer);
  }
  
  get styles() {
    return `
      chainmail-sheet-form .color-list {
        display: flex;
        flex-wrap: wrap;
        list-style-type: none;
        margin: 0;
        padding: 0;
      }
      
      chainmail-sheet-form .color-list > li {
        border: 1px solid #cccccc;
        border-radius: 3px;
        height: 20px;
        margin-top: 5px;
        margin-right: 5px;
        width: 20px;
      }
      
      chainmail-sheet-form .color-list > li > button {
        border: 0;
        height: 100%;
        margin: 0;
        padding: 0;
        width: 100%;
      }
    `;
  }
  
  get template() {
    const layerList = LayerLogic.GetLayerList();
    const weaves = WeaveLogic.GetWeaves();
    
    return `
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
        
        <label for="chainmail-sheet-form__color">Color</label>
        <input id="chainmail-sheet-form__color" type="color" />
        <ol class="color-list">
          ${
            ['#ffff19', '#daa520', '#f4a460', '#ffd700', '#f5f5f5', '#f1a886', '#000000', '#ff0000', '#00ff00', '#0000ff']
              .map(x => `<li><button data-color="${x}" style="background-color: ${x};"></button></li>`).join('')
          }
        </ol>
      </fieldset>
    `;
  }
  
  get eventListeners() {
    return [{
      element: this.#weaveSelect,
      event: 'change',
      handler: this.#setWeave.bind(this)
    }, {
      element: this.#rowsInput,
      event: 'change',
      handler: this.#setRows.bind(this)
    }, {
      element: this.#columnsInput,
      event: 'change',
      handler: this.#setColumns.bind(this)
    }, {
      element: this.#colorInput,
      event: 'change',
      handler: this.#setColorByInput.bind(this)
    }, {
      elements: this.#colorListItems,
      event: 'click',
      handler: this.#setColorByList.bind(this)
    }];
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
  
  get #colorInput() {
    return document.getElementById('chainmail-sheet-form__color');
  }
  
  get #colorListItems() {
    return document.querySelectorAll('chainmail-sheet-form .color-list li button');
  }
     
  #setWeave(event) {
    const newValue = event.target.value;
    const sheet = this.#getActiveSheet();
    sheet.setAttribute(SheetComponent.attributeNames.awg, 18);
    sheet.setAttribute(SheetComponent.attributeNames.innerDiameter, 4);
    sheet.setAttribute(SheetComponent.attributeNames.weave, newValue);
  }
  
  #setRows(event) {
    const newValue = event.target.value;
    this.#getActiveSheet().setAttribute(SheetComponent.attributeNames.rows, newValue);
  }
  
  #setColumns(event) {
    const newValue = event.target.value;
    this.#getActiveSheet().setAttribute(SheetComponent.attributeNames.columns, newValue);
  }
  
  #setColorByInput(event) {
    this.#getActiveSheet().setAttribute('color', event.target.value);
  }
  
  #setColorByList(event) {
    const newColor = event.target.getAttribute('data-color');
    this.#getActiveSheet().setAttribute('color', newColor);
    this.#colorInput.value = newColor;
  }
  
  #getWeave() {
    return this.#getActiveSheet().getAttribute(SheetComponent.attributeNames.weave);
  }

  #getActiveSheet() {
    return document.querySelector(`chainmail-sheet[layer="${this.#activeLayer}"]`);
  } 
}
customElements.define(SheetFormComponent.tag, SheetFormComponent);