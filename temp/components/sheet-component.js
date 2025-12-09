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
            margin-top: ${this.#getRowMarginTopForAspectRatio(this.#gaugeMm, this.#innerDiameterMm)};
          }
          
          chainmail-sheet > .row:nth-child(even) {
            margin-left: ${this.#getRowMarginLeftForAspectRatio(this.#gaugeMm, this.#innerDiameterMm)};
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
  
  #getGaugeForGaugeMm(gaugeMm) {
    // todo: move this to a lookup class / constants file
    return {
      '0.812': '20g',
      '0.912': '19g',
      '1.02': '18g',
      '1.15': '17g',
      '1.29': '16g',
      '1.45': '15g',
      '1.63': '14g',
      '1.83': '13g',
      '2.05': '12g',
      '2.31': '11g',
      '2.59': '10g',
      '2.91': '9g',
    }[gaugeMm];
  }
  
  #getRowMarginTopForAspectRatio(gaugeMm, innerDiameterMm) {
    const gauge = this.#getGaugeForGaugeMm(gaugeMm);
    
    // todo: make real formulas for these trends
    return {
      innerDiameter: {
        '4': { gauge: {
          '20g': '-9.83386',
          '19g': '-11.33386',
          '18g': '-12.83386',
          '17g': '-14.53386',
          '16g': '-16.33386',
          '15g': '-17.83386'
        } },
        '6': { gauge: {
          '20g': '-10.83386',
          '19g': '-12.33386',
          '18g': '-12.83386',
          '17g': '-14.83386',
          '16g': '-15.83386',
          '15g': '-18.33386',
          '14g': '-21.33386',
          '13g': '-23.33386',
          '12g': '-26.13386'
        } },
        '7': { gauge: {
          '20g': '-11.83386',
          '19g': '-13.33386',
          '18g': '-14.33386',
          '17g': '-15.83386',
          '16g': '-16.83386',
          '15g': '-19.33386',
          '14g': '-20.83386',
          '13g': '-24.33386',
          '12g': '-26.33386',
          '11g': '-29.33386',
          '10g': '-32.33386'
        } },
        '8': { gauge: {
          '20g': '-11.83386',
          '19g': '-13.83386',
          '18g': '-15.83386',
          '17g': '-16.33386',
          '16g': '-17.83386',
          '15g': '-19.33386',
          '14g': '-20.83386',
          '13g': '-23.83386',
          '12g': '-27.83386',
          '11g': '-30.33386',
          '10g': '-32.8386',
          '9g': '-36.83386'
        } },
      }
    }.innerDiameter[innerDiameterMm].gauge[gauge];
  }
  
  #getRowMarginLeftForAspectRatio(gaugeMm, innerDiameterMm) {
    const gauge = this.#getGaugeForGaugeMm(gaugeMm);
    
    // todo: make real formulas for these trends
    return ({
      innerDiameter: {
        '4': { gauge: {
          '20g': '10.8386',
          '19g': '11.3386',
          '18g': '11.8386',
          '17g': '12.3386',
          '16g': '12.8386',
          '15g': '13.3386'
        } },
        '6': { gauge: {
          '20g': '14.8386',
          '19g': '15.3386',
          '18g': '15.5386',
          '17g': '15.8386',
          '16g': '16.5386',
          '15g': '17.3386',
          '14g': '17.8386',
          '13g': '18.5386',
          '12g': '19.4886'
        } },
        '7': { gauge: {
          '20g': '16.5386',
          '19g': '17.0386',
          '18g': '17.3386',
          '17g': '17.8386',
          '16g': '18.3386',
          '15g': '19.2386',
          '14g': '19.5386',
          '13g': '20.3386',
          '12g': '21.3386',
          '11g': '22.3386',
          '10g': '23.386'
        } },
        '8': { gauge: {
          '20g': '18.8386',
          '19g': '18.8386',
          '18g': '19.3386',
          '17g': '19.8386',
          '16g': '20.3386',
          '15g': '21',
          '14g': '21.8386',
          '13g': '22.3386',
          '12g': '23.3386',
          '11g': '24.3386',
          '10g': '25.3',
          '9g': '26.3386'
        } },
      }
    }.innerDiameter[innerDiameterMm].gauge[gauge]);
  }
}
customElements.define("chainmail-sheet", SheetComponent);
