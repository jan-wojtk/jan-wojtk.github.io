class RingComponent extends HTMLElement {
  static attributeNames = {
    color: 'color',
    gaugeMm: 'gauge-mm',
    innerDiameterMm: 'inner-diameter-mm',
    outlineColor: 'outline-color',
    rotate180: 'rotate-180'
  };
  static observedAttributes = Object.values(this.attributeNames);
  
  // Attributes
  #color;
  #innerDiameterMm;
  #gaugeMm;
  #outlineColor;
  #rotate180;
  
  // Members
  get #styles() {
    return document.getElementById('chainmail-ring-styles');
  }
  
  constructor() {
    super();
    
    this.#color = 'sandybrown';
    this.#gaugeMm = 1.6; // 14g
    this.#innerDiameterMm = 6;
    this.#outlineColor = '#888888';
    this.#rotate180 = false;
  }
  
  connectedCallback() {
    const parser = new DOMParser();
    
    // Render template
    const partials = parser.parseFromString(`
        <div class="ring-partial ring-partial_top"><div class="ring"></div></div>
        <div class="ring-partial ring-partial_middle"><div class="ring"></div></div>
        <div class="ring-partial ring-partial_bottom"><div class="ring"></div></div>
    `, 'text/html').body.children;
    
    // const zIndexes = { 0: -100, 1: -50, 2: 0, 3: 50, 4: 100 };
    const partialCount = 10;
    const zIndexes = { 0: -100, 1: -80, 2: -60, 3: -40, 4: -20, 5: 0, 6: 20, 7: 40, 8: 60, 9: 80, 10: 100 };
    const partialsV2 = parser.parseFromString(
      Array(partialCount).fill(null).map((value, index) => {
        const zIndex = this.#rotate180 ? zIndexes[index] * -1 : zIndexes[index];
        return `
          <div class="ring-partial">
            <div class="ring" style="z-index: ${zIndex}; margin-top: -${(this.#innerDiameterMm + (this.#gaugeMm * 2))*(index)/partialCount}mm;"></div>
          </div>
        `;
      }).join(''), 'text/html'
    ).body.children;
    while(partialsV2.length > 0) this.appendChild(partialsV2[0]);
    
    // Render styles
    const outlineWidth = '.5px';
    if(!this.#styles)
      document.head.appendChild(parser.parseFromString(`
          <style id="chainmail-ring-styles">          
            chainmail-ring {
                border-color: ${this.#color};
                outline: .75px solid ${this.#outlineColor}; /* todo: reflect change from .5px to .75px in calculated css rules */
                border-radius: 50%;
                height: calc(${(this.#innerDiameterMm + (this.#gaugeMm * 2))}mm - ${outlineWidth});
                width: calc(${(this.#innerDiameterMm + (this.#gaugeMm * 2))}mm - ${outlineWidth});
            }

            chainmail-ring > .ring-partial {
                border-color: inherit;
                overflow: hidden;
                height: ${(this.#innerDiameterMm + (this.#gaugeMm * 2))/partialCount}mm;
                width: ${(this.#innerDiameterMm + (this.#gaugeMm * 2))}mm;
            }

            chainmail-ring > .ring-partial > .ring {
                border-color: inherit;
                border-radius: 50%;
                border-style: solid;
                border-width: ${this.#gaugeMm}mm;
                height: ${this.#innerDiameterMm}mm;
                outline: .5px solid ${this.#outlineColor};
                outline-offset: -${this.#gaugeMm}mm;
                width: ${this.#innerDiameterMm}mm;
            }

            chainmail-ring > .ring-partial > .ring {
                position: relative;
            }

            chainmail-ring > .ring-partial.ring-partial_top > .ring {
                z-index: 100;
            }

            chainmail-ring > .ring-partial.ring-partial_middle > .ring {
                margin-top: -${(this.#innerDiameterMm + (this.#gaugeMm * 2))/3}mm;
                z-index: 0;
            }

            chainmail-ring > .ring-partial.ring-partial_bottom > .ring {
                margin-top: -${(this.#innerDiameterMm + (this.#gaugeMm * 2))*2/3}mm;
                z-index: -100;
            }
            
            /* reverse the z-indexes of alternating rows */
            chainmail-ring.rotate-180 > .ring-partial.ring-partial_top > .ring {
                z-index: -100;
            }

            chainmail-ring.rotate-180 > .ring-partial.ring-partial_bottom > .ring {
                z-index: 100;
            }
          </style>
      `, 'text/html').head.children[0]);
    
    // Register event listeners
    this.addEventListener('click', this.handleClick);
  }
  
  disconnectedCallback() {
    // todo: maybe a tiny *ping* noise, for funsies
    console.log("Custom element removed from page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(RingComponent.attributeNames.color === name) this.#color = newValue;
    if(RingComponent.attributeNames.gaugeMm === name) this.#gaugeMm = newValue;
    if(RingComponent.attributeNames.innerDiameterMm === name) this.#innerDiameterMm = newValue;
    if(RingComponent.attributeNames.outlineColor === name) this.#outlineColor = newValue;
    if(RingComponent.attributeNames.rotate180 === name) {
      this.#rotate180 = newValue;
      
      if(this.#rotate180) this.classList.add('rotate-180');
      if(!this.#rotate180) this.classList.remove('rotate-180');
    }
  }
  
  handleClick() {
    console.log(this, arguments);
  }
}
customElements.define("chainmail-ring", RingComponent);


// ----------------------------------------------------------
// ----------------------------------------------------------
// ----------------------------------------------------------
// ----------------------------------------------------------
// ----------------------------------------------------------
// ----------------------------------------------------------

class SheetComponent extends HTMLElement {
  static attributeNames = { rows: 'rows', columns: 'columns' };
  static observedAttributes = Object.values(this.attributeNames);
  
  // Attributes
  #rows;
  #columns;
  
  // Members
  get #rowList() {
    return this.querySelectorAll('.row');
  }
  
  get #styles() {
    return document.getElementById('chainmail-sheet-styles');
  }
  
  constructor() {
    super();
    
    this.#rows = 10;
    this.#columns = 10;
  }
  
  connectedCallback() {
    const parser = new DOMParser();
    
    // Render template
    const rows = parser.parseFromString(`
        <div class="row">
          <chainmail-ring></chainmail-ring>
          <chainmail-ring></chainmail-ring>
          <chainmail-ring></chainmail-ring>
          <chainmail-ring></chainmail-ring>
        </div>
        <div class="row">
          <chainmail-ring rotate-180="true"></chainmail-ring>
          <chainmail-ring rotate-180="true"></chainmail-ring>
          <chainmail-ring rotate-180="true"></chainmail-ring>
          <chainmail-ring rotate-180="true"></chainmail-ring>
        </div>
        <div class="row">
          <chainmail-ring></chainmail-ring>
          <chainmail-ring></chainmail-ring>
          <chainmail-ring></chainmail-ring>
          <chainmail-ring></chainmail-ring>
        </div>
        <div class="row">
          <chainmail-ring rotate-180="true"></chainmail-ring>
          <chainmail-ring rotate-180="true"></chainmail-ring>
          <chainmail-ring rotate-180="true"></chainmail-ring>
          <chainmail-ring rotate-180="true"></chainmail-ring>
        </div>
        <div class="row">
          <chainmail-ring></chainmail-ring>
          <chainmail-ring></chainmail-ring>
          <chainmail-ring></chainmail-ring>
          <chainmail-ring></chainmail-ring>
        </div>
        <div class="row">
          <chainmail-ring rotate-180="true"></chainmail-ring>
          <chainmail-ring rotate-180="true"></chainmail-ring>
          <chainmail-ring rotate-180="true"></chainmail-ring>
          <chainmail-ring rotate-180="true"></chainmail-ring>
        </div>
         <div class="row">
          <chainmail-ring></chainmail-ring>
          <chainmail-ring></chainmail-ring>
          <chainmail-ring></chainmail-ring>
          <chainmail-ring></chainmail-ring>
        </div>
        <div class="row">
          <chainmail-ring rotate-180="true"></chainmail-ring>
          <chainmail-ring rotate-180="true"></chainmail-ring>
          <chainmail-ring rotate-180="true"></chainmail-ring>
          <chainmail-ring rotate-180="true"></chainmail-ring>
        </div>
    `, 'text/html').body.children;
    while(rows.length > 0) this.appendChild(rows[0]);
    
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
