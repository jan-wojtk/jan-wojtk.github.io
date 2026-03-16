// Todo - make a component that
//  - Presents a list of layers
//  - Presents a list of fields
//  - On click, changes list of fields to corresponding input (show/hide)
//  - Presents inputs that reflect the current sheet
//  - Presents a back button that changes input to list of fields (show/hide)
class SheetFieldsComponent extends BaseComponent {
  static tag = 'chainmail-sheet-fields';
  static attributeNames = { };
  static observedAttributes = Object.values(SheetFieldsComponent.attributeNames);
  
  get template() {
    let sheets = SheetState.GetSheetList();
    
    if(sheets.length == 0) {
      SheetLogic.AddNewSheet();
      sheets = SheetState.GetSheetList();
    }
    
    return `
      <ol id="chainmail-sheet-fields__sheet-list" class="button-list">
        <li id="chainmail-sheet-fields__sheet-list__add-new"><button style="background: transparent; color: #cccccc;">+</button></li>
        ${sheets.map((s, index) => `
          <li><button style="background: ${s.color};"></button></li>
        `).join('')}
      </ol>
    `;
  }
  
  get styles() {
    return `
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
    }];
  }
  
  #onClickAddNewSheet() {
    SheetLogic.AddNewSheet();
  }
}
customElements.define(SheetFieldsComponent.tag, SheetFieldsComponent);
