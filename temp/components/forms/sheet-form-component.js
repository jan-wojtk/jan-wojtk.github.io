class SheetFormComponent extends BaseComponent {
  static tag = 'chainmail-sheet-form';
  
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
  
  #getWeave() {
    return this.#getActiveSheet().getAttribute(SheetComponent.attributeNames.weave);
  }

  #getActiveSheet() {
    return document.querySelector(`chainmail-sheet.chainmail-sheet--active`);
  } 
}
customElements.define(SheetFormComponent.tag, SheetFormComponent);