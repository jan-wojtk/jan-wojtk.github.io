class SheetComponent extends HTMLElement {
  constructor() {
    super();
  }
  
  // Attributes
  static attributeNames = {
    rows: 'rows',
    columns: 'columns',
    innerDiameter: "inner-diameter",
    awg: 'awg',
    weave: 'weave',
    layer: 'layer',
    color: 'color'
  };
  static observedAttributes = Object.values(SheetComponent.attributeNames);
  
  get #color() { return this.getAttribute(SheetComponent.attributeNames.color) }
  get #rows() { return parseInt(this.getAttribute(SheetComponent.attributeNames.rows)) }// = 10;
  get #columns() { return parseInt(this.getAttribute(SheetComponent.attributeNames.columns)) }// = 10;
  get #awg() { return parseInt(this.getAttribute(SheetComponent.attributeNames.awg)) }// = 18;
  get #innerDiameter() { return parseInt(this.getAttribute(SheetComponent.attributeNames.innerDiameter)) }// = 4;
  get #weave() { return this.getAttribute(SheetComponent.attributeNames.weave) }// = 'European Four-In-One';
  get #layer() { return parseInt(this.getAttribute(SheetComponent.attributeNames.layer)) }// = 1;
  
  attributeChangedCallback(name, oldValue, newValue) {
    if(SheetComponent.attributeNames.color === name) this.#onChangeColor(newValue);
    if(SheetComponent.attributeNames.rows === name) this.#onChangeRows(newValue);
    if(SheetComponent.attributeNames.columns === name) this.#onChangeColumns(newValue);
    if(SheetComponent.attributeNames.awg === name) this.#onChangeAwg(newValue);
    if(SheetComponent.attributeNames.innerDiameter === name) this.#onChangeInnerDiameter(newValue);
    if(SheetComponent.attributeNames.weave === name) this.#onChangeWeave(newValue);
    if(SheetComponent.attributeNames.layer === name) this.#renderStyles();
  }
  
  get #ringType() {
    return new Ring(this.#innerDiameter, this.#awg);
  }
  
  get #rowList() {
    return this.querySelectorAll('.row');
  }
  
  get #styles() {
    const selector = `.chainmail-sheet-styles[data-layer="${this.#layer}"]`;
    const result = document.querySelector(selector);
    
    return result;
  }
  
  #renderStyles() {
    const hasExistingStyles = !!this.#styles;
    const hasNewColor = !hasExistingStyles || this.#styles.getAttribute('data-color') !== `${this.#color}`;
    const hasNewWeave = !hasExistingStyles || this.#styles.getAttribute('data-weave') !== `${this.#weave}`;
    const hasNewGauge = !hasExistingStyles || this.#styles.getAttribute('data-awg') !== `${this.#awg}`;
    const hasNewInnerDiameter = !hasExistingStyles || this.#styles?.getAttribute('data-inner-diameter') !== `${this.#innerDiameter}`;
    const hasNewLayer = !hasExistingStyles || this.#styles?.getAttribute('data-layer') !== `${this.#layer}`;
    const hasNewParameter = hasNewColor || hasNewWeave || hasNewGauge || hasNewInnerDiameter || hasNewLayer;
    
    if(hasNewParameter) {
      const parser = new DOMParser();
      const newStyles = parser.parseFromString(`
        <style class="chainmail-sheet-styles" data-color="${this.#color}" data-weave="${this.#weave}" data-awg="${this.#awg}" data-inner-diameter="${this.#innerDiameter}" data-layer="${this.#layer}">
          chainmail-sheet[layer="${this.#layer}"] {
            border-color: ${this.#color};
            position: absolute;
            z-index: ${1000 - this.#layer}; /*in any case, avoid negatives or else hover breaks*/
          }
          
          chainmail-sheet[layer="${this.#layer}"] > .row {
            border-color: inherit;
            display: flex;
            flex-direction:row;
          }
          
          chainmail-sheet[layer="${this.#layer}"] > .row ~ .row {
            margin-top: ${this.#getRowMarginTop()};
          }
          
          chainmail-sheet[layer="${this.#layer}"] > .row:nth-child(even) {
            margin-left: ${((this.#innerDiameter + (GaugeLogic.GetGaugeByAwg(this.#awg).millimeters * 2)) / 2)}mm;
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
  
  #onChangeAwg(newValue) {
    this.#renderStyles();
    this.#setAllRingAttributes(RingComponent.attributeNames.awg, this.#awg);
  }
  
  #onChangeInnerDiameter(newValue) {
    this.#renderStyles();
    this.#setAllRingAttributes(RingComponent.attributeNames.innerDiameter, this.#innerDiameter);
  }
  
  #onChangeWeave(newValue) {
    this.#renderStyles();
  }
  
  #onChangeLayer(newValue) {
    this.#renderStyles();
  }
  
  #onChangeColor(newValue) {
    this.#renderStyles();
  }
  
  #onChangeRows() {
    this.#renderTemplate();
  }
  
  #onChangeColumns() {
    this.#renderTemplate();
  }
  
  #renderTemplate() {
    // Add rows as needed
    while(this.#rows > (this.#rowList.length || 0)) {
      const row = document.createElement('div');
      row.setAttribute('class', 'row');
      this.appendChild(row);
    }
    
    // Remove rows as needed
    while(this.#rows < (this.#rowList.length || 0)) {
      this.lastElementChild.remove();
    }
    
    // Review each row's contents
    const baseRing = this.#getNewRing();
    for(let i = 0; i < this.#rowList.length; i++) {
      const row = this.#rowList[i];
      const isOddRow = i % 2 == 0;
      const expectedRingCount = isOddRow ? Math.ceil(this.#columns/2) : Math.floor(this.#columns/2);
      
      while(expectedRingCount > (row.children.length || 0)) {
        const newRing = baseRing.cloneNode(true);
        newRing.setAttribute('rotate-180', !isOddRow);
        row.appendChild(newRing);
      }
      
      while(expectedRingCount < (row.children.length || 0)) {
        row.lastElementChild.remove();
      }
    }
  }
  
  connectedCallback() {
    this.#renderStyles();
    this.#renderTemplate();
    
    // Register event listeners
    this.addEventListener('click', this.handleClick);
  }
  
  #getRowMarginTop() {
    if(WeaveLogic.IsEuropeanFourInOne(this.#weave)) return this.#getRowMarginTopForEuropeanFourInOne();
    if(WeaveLogic.IsEuropeanSixInOne(this.#weave)) return this.#getRowMarginTopForEuropeanSixInOne();
  }
  
  #getRowMarginTopForEuropeanFourInOne() {
    // todo: rewrite this for readability using the Ring class
    // todo: make real formulas for these trends
    return {
      innerDiameter: {
        '4': { awg: {
          '20': '-9.83386',
          '19': '-11.33386',
          '18': '-13.03386',
          '17': '-13.53386',
          '16': '-15.33386',
          '15': '-17.33386',
          '14': '-19.53386',
        } },
        '6': { awg: {
          '20': '-10.83386',
          '19': '-11.83386',
          '18': '-12.83386',
          '17': '-14.33386',
          '16': '-15.83386',
          '15': '-17.83386',
          '14': '-19.83386',
          '13': '-22.33386',
          '12': '-25.13386',
          '11': '-28.13386',
        } },
        '7': { awg: {
          '20': '-11.33386',
          '19': '-12.33386',
          '18': '-13.3386',
          '17': '-14.83386',
          '16': '-16.33386',
          '15': '-18.03386',
          '14': '-20.33386',
          '13': '-22.83386',
          '12': '-24.83386',
          '11': '-28.33386',
          '10': '-32.33386',
        } },
        '8': { awg: {
          '20': '-11.83386',
          '19': '-13.33386',
          '18': '-13.83386',
          '17': '-15.33386',
          '16': '-16.83386',
          '15': '-18.83386',
          '14': '-20.83386',
          '13': '-22.83386',
          '12': '-25.33386',
          '11': '-28.83386',
          '10': '-31.8386',
          '9': '-36.33386'
        } },
      }
    }.innerDiameter[this.#innerDiameter].awg[this.#awg];
  }
  
  #getRowMarginTopForEuropeanSixInOne() {
    // todo: rewrite this for readability using the Ring class
    // todo: make real formulas for these trends
    return {
      innerDiameter: {
        '4': { awg: {
          '20': '-17.5386',
          '19': '-18.35386',
          '18': '-19.1386',
        } },
      }
    }.innerDiameter[this.#innerDiameter].awg[this.#awg];
  }
  
  #getNewRing() {
    const parser = new DOMParser();
    const ring = parser.parseFromString(`
      <chainmail-ring
        awg="${this.#awg}"
        inner-diameter="${this.#innerDiameter}"
        layer="${this.#layer}"
      ></chainmail-ring>
    `, 'text/html').body.children[0];
    
    return ring;
  }
}
customElements.define("chainmail-sheet", SheetComponent);
