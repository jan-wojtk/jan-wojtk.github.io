class SheetComponent extends HTMLElement {
  static attributeNames = { rows: 'rows', columns: 'columns', innerDiameterMm: "inner-diameter-mm", gaugeMm: 'gauge-mm' };
  static observedAttributes = Object.values(this.attributeNames);
  
  // Attributes
  #rows = 10;
  #columns = 10;
  #gaugeMm = 1.02;
  #innerDiameterMm = 1.02;
  
  attributeChangedCallback(name, oldValue, newValue) {
    if(SheetComponent.attributeNames.rows === name) this.#rows = parseInt(newValue);
    if(SheetComponent.attributeNames.columns === name) this.#columns = parseInt(newValue);
    if(SheetComponent.attributeNames.gaugeMm === name) this.#gaugeMm = parseFloat(newValue);
    if(SheetComponent.attributeNames.innerDiameterMm === name) this.#innerDiameterMm = parseFloat(newValue);
  }
  
  // Members
  get #rowList() {
    return this.querySelectorAll('.row');
  }
  
  get #styles() {
    return document.getElementById('chainmail-sheet-styles');
  }
  
  constructor() {
    super();
  }
  
  connectedCallback() {
    const parser = new DOMParser();
    const gauge = 1.6;
    const innerDiameter = 6;
    const rowList = parser.parseFromString(
      Array(this.#rows).fill(null).map((value, rowIndex) => `
        <div class="row">
          ${Array(this.#columns).fill(null).map((value, index) => `
            <chainmail-ring
              gauge-mm="${gauge}"
              inner-diameter-mm="${innerDiameter}"
              rotate-180="${rowIndex%2==1}"
            ></chainmail-ring>
          `).join('')}
        </div>
      `).join(''), 'text/html'
    ).body.children;
    while(rowList.length > 0) this.appendChild(rowList[0]);
    
    // Render styles
    if(!this.#styles)
      document.head.appendChild(parser.parseFromString(`
        <style id="chainmail-sheet-styles">
          chainmail-sheet > .row {
            display: flex;
            flex-direction:row;
          }

          chainmail-sheet > .row ~ .row {
            /* -1/2 of ring width - outlineWidth * 2 */
            margin-top: calc(-4mm - 5px);
          }

          chainmail-sheet > .row:nth-child(even) {
            margin-left: calc(4.25mm + 1px); /* (about) diameter / 2  -  outer outline width */
          }
          
          /* todo: morphing overflow and border-radius is also fun
          chainmail-sheet.explode-outline-offset chainmail-ring {
            transition: outline-offset 5s ease-in-out;
            outline-offset: 1000px;
          }
          chainmail-sheet.explode-outline-offset chainmail-ring {
            transition: outline-offset 5s ease-in-out;
            outline-offset: 1000px;
          }
        </style>
      `, 'text/html').head.children[0]);
    
    //this.#appendRowToChainmail(10);
    
    // Register event listeners
    this.addEventListener('click', this.handleClick);
  }
  
  #getRow() {
    const parser = new DOMParser();
    return parser.parseFromString('<div class="row"></div>', 'text/html').body.children[0];
  }
  
  #appendRowToChainmail(ringCount = 1) {
    const row = this.#getRow();
    
    for(var i = 0; i < ringCount; i++) {
      row.appendChild(new RingComponent());
    }
    
    this.appendChild(row);
  }
  
  #addColumn() {
    var rows = this.#rowList;
    var rowCount = rows.length;
    
    if(rowCount === 0 || rowCount === 1) {
      this.#appendRowToChainmail(1);
    }
    
    if(rowCount >= 2) {
      // todo: address assumption that this condition will always pick the right rows
      // or maybe just make it more readable
      var isRowRingCountEqual = rows[0].children.length === rows[1].children.length;
      var targetRows = [];
      
      // if odd and even rows have the same ring count, it's even's turn
      // todo: make a #get* convenience method out of this (even / odd)
      if(!isRowRingCountEqual) {
        targetRows = [...rows].filter((row, index) => !!(index % 2));
      }
      
      if(isRowRingCountEqual) {
        targetRows = [...rows].filter((row, index) => !(index % 2));
      }
      
      targetRows.forEach((row) => row.appendChild(new RingComponent()));
    }
  }

  #addRow() {
    var rows = this.#rowList;
    var rowCount = rows.length;
    
    if(rowCount === 0) {
      this.#appendRowToChainmail(1);
    }
    
    if(rowCount === 1) {
      var previousRingCount = rows[0].children.length;
      
      if(previousRingCount === 1) {
        this.#appendRowToChainmail(1);
      }
      
      if(previousRingCount >= 2) {
        this.#appendRowToChainmail(previousRingCount-1);
      }
    }
    
    if(rowCount >= 2) {
      var newRowRingCount = rows[rowCount-2].children.length;
      this.#appendRowToChainmail(newRowRingCount);
    }
  }
  
  #removeRow() {
    var rows = this.#rowList;
    
    // only do this if there are 3 or more rows - to avoid a weird state
    if(rows.length >= 3) {
      var lastRow = [...rows].at(-1);
      lastRow.remove();
    }
  }
  
  #removeColumn() {
    var rows = this.#rowList;
    
    // only do this if there are 3 or more columns - to avoid a weird state
    const maxColumnCount = rows.length >= 2 ? Math.max(rows[0].children.length, rows[1].children.length) : 0;
    if(maxColumnCount >= 2) {    
      var isRowRingCountEqual = rows[0].children.length === rows[1].children.length;
      var targetRows = [];
      
      // if odd and even rows have the same ring count, it's even's turn
      // todo: make a #get* convenience method out of this (even / odd)
      if(isRowRingCountEqual) {
        targetRows = [...rows].filter((row, index) => !!(index % 2));
      }
      
      if(!isRowRingCountEqual) {
        targetRows = [...rows].filter((row, index) => !(index % 2));
      }
      
      // todo: when a row is empty, remove the row
      targetRows.forEach((row) => [...row.children].at(-1).remove());
    }
  }
  
  #clear() {
    const container = this;
    
    // google told me this makes sense and i believe it
    while (container.lastChild) {
      container.removeChild(container.lastChild);
    }
  }
}
customElements.define("chainmail-sheet", SheetComponent);
