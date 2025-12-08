class SheetComponent extends HTMLElement {
  constructor() {
    super();
  }
  
  // Attributes
  static attributeNames = { rows: 'rows', columns: 'columns', innerDiameterMm: "inner-diameter-mm", gaugeMm: 'gauge-mm' };
  static observedAttributes = Object.values(this.attributeNames);
  
  #rows = 10;
  #columns = 10;
  #gaugeMm = 1.02;
  #innerDiameterMm = 4;
  
  attributeChangedCallback(name, oldValue, newValue) {
    if(SheetComponent.attributeNames.rows === name) this.#rows = parseInt(newValue);
    if(SheetComponent.attributeNames.columns === name) this.#columns = parseInt(newValue);
    if(SheetComponent.attributeNames.gaugeMm === name) this.#onChangeGauge(newValue);
    if(SheetComponent.attributeNames.innerDiameterMm === name) this.#onChangeInnerDiameter(newValue);
  }
  
  get #rowList() {
    return this.querySelectorAll('.row');
  }
  
  get #styles() {
    return document.getElementById('chainmail-sheet-styles');
  }
  
  #renderStyles() {
    const hasExistingStyles = !!this.#styles;
    const hasNewGauge = !hasExistingStyles || this.#styles.getAttribute('data-gauge-mm') !== `${this.#gaugeMm}`;
    const hasNewInnerDiameter = !hasExistingStyles || this.#styles?.getAttribute('data-inner-diameter-mm') !== `${this.#innerDiameterMm}`;
    const hasNewParameter = hasNewGauge || hasNewInnerDiameter;
    
    if(hasNewParameter) {
      const parser = new DOMParser();
      const newStyles = parser.parseFromString(`
        <style id="chainmail-sheet-styles" data-gauge-mm="${this.#gaugeMm}" data-inner-diameter-mm="${this.#innerDiameterMm}">
          chainmail-sheet > .row {
            display: flex;
            flex-direction:row;
          }
          
          chainmail-sheet > .row ~ .row {
            margin-top: -12.83386; /*calc(-4mm - 5px);*/
          }
          
          chainmail-sheet > .row:nth-child(even) {
            margin-left: 11.8386;/*calc(4.25mm + 1px);*/ /* (about) diameter / 2  -  outer outline width */
          }
        </style>
      `, 'text/html').head.children[0];
      
      if(!hasExistingStyles) document.head.appendChild(newStyles);
      else this.#styles.replaceWith(newStyles);
    }
  }
  
  #setAllRingAttributes(attributeName, newValue) {
    this.#rowList.forEach(row => {
      row.querySelectorAll('chainmail-ring').forEach(ring => {
        ring.setAttribute(attributeName, newValue)
      });
    });
  }
  
  #onChangeGauge(newValue) {
    this.#gaugeMm = parseFloat(newValue);
    this.#renderStyles();
    this.#setAllRingAttributes(RingComponent.attributeNames.gaugeMm, this.#gaugeMm);
  }
  
  #onChangeInnerDiameter(newValue) {
    this.#innerDiameterMm = parseFloat(newValue);
    this.#renderStyles();
    this.#setAllRingAttributes(RingComponent.attributeNames.innerDiameterMm, this.#innerDiameterMm);
  }
  
  connectedCallback() {
    const parser = new DOMParser();
    
    const rowList = parser.parseFromString(
      Array(this.#rows).fill(null).map((value, rowIndex) => `
        <div class="row">
          ${Array(this.#columns).fill(null).map((value, index) => `
            <chainmail-ring
              gauge-mm="${this.#gaugeMm}"
              inner-diameter-mm="${this.#innerDiameterMm}"
              rotate-180="${rowIndex%2==1}"
            ></chainmail-ring>
          `).join('')}
        </div>
      `).join(''), 'text/html'
    ).body.children;
    while(rowList.length > 0) this.appendChild(rowList[0]);
    
    // Render styles
    this.#renderStyles();
    
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
