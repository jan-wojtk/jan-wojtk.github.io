class SheetsComponent extends BaseComponent {
  static tag = 'chainmail-sheets';
  static attributeNames = { };
  static observedAttributes = Object.values(SheetsComponent.attributeNames);
  
  get template() {
    const sheets = SheetLogic.GetSheetList();
    
    return `
      ${sheets.map((s, index) => `
        <chainmail-sheet data-id="${s.id}"></chainmail-sheet>
      `).join('')}
    `;
  }
  
  get styles() {
    return `
      chainmail-sheets {
        display: block;
        position: relative;
      }
      
      chainmail-sheet-fields {
        
      }
      
      .button-list {
        display: flex;
        flex-direction: row;
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

      .button-list > li {
        align-items: center;
        border: 5px solid #666666;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        padding: 0;
        margin: .25em;
      }

      .button-list > li > button {
        background: transparent;
        border: 0;
        color: #cccccc;
        cursor: pointer;
        font-size: 1.5em;
        height: 2.5em;
        margin: 0;
        padding: 0;
        width: 2.5em;
      }
      
      .button-list > li > button > span {
        font-size: .75em;
      }
    `;
  }
  
  get eventListeners() {
    return [{
      element: document.getElementById('chainmail-sheet-fields__sheet-list__add-new'),
      event: 'click',
      handler: this.#onClickAddNewSheet.bind(this)
    }, {
      state: SheetState,
      event: 'sheet.add',
      handler: this.#onAddNewSheet.bind(this)
    }, {
      state: SheetState,
      event: 'sheet.add.complete',
      handler: this.#onChange.bind(this)
    }];
  }
  
  #onClickAddNewSheet() {
    SheetLogic.AddNewSheet();
  }
  
  #onAddNewSheet(event) {
    const parser = new DOMParser();
    const sheet = parser.parseFromString(`<chainmail-sheet data-id="${event.detail.id}"></chainmail-sheet>`, 'text/html').body.children[0];
    
    this.appendChild(sheet);
  }
  
  #onChange() {
    const sheetElements = [...this.querySelectorAll('chainmail-sheet')];
    const maxHeight = Math.max(...sheetElements.map(x => x.clientHeight)) || 0;
    const maxWidth = Math.max(...sheetElements.map(x => x.clientWidth)) || 0;
    
    this.style.setProperty('height', maxHeight + 'px');
    this.style.setProperty('width', maxWidth + 'px');
  }
}
customElements.define(SheetsComponent.tag, SheetsComponent);
