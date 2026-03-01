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
            display: inline-flex;
            flex-direction: column;
            position: relative;
            z-index: ${1000 - this.#layer}; /*in any case, avoid negatives or else hover breaks*/
          }
          
          chainmail-sheet[layer="${this.#layer}"] > .row {
            border-color: inherit;
            display: inline-flex;
          }
          
          chainmail-sheet[layer="${this.#layer}"] > .row ~ .row {
            margin-top: ${this.#getRowMarginTop()}mm;
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
    this.addEventListener('contextmenu', this.handleContextMenu);
    this.addEventListener('pointermove', this.handlePointerMove);
    this.addEventListener('touchmove', this.handleTouchMove);
  }
  
  handleClick(event) {
    event.preventDefault();
    
    this.#applyColorChange(event.clientX, event.clientY, true, false);
  }
  
  handleContextMenu(event) {
    event.preventDefault();
    
    this.#applyColorChange(event.clientX, event.clientY, false, true);
  }
  
  handlePointerMove(event) {
    event.preventDefault();
    
    // Gather info based on pointerType
    const isAdd = event.buttons === 1 || event.pointerType === 'touch';
    const isRemove = event.buttons === 2;
    
    this.#applyColorChange(event.clientX, event.clientY, isAdd, isRemove);
  }
  
  handleTouchMove(event) {
    event.preventDefault();
    const touch = event.touches[0];
    
    this.#applyColorChange(touch.clientX, touch.clientY, true, false);
  }
  
  #applyColorChange(clientX, clientY, isAdd, isRemove) {
    const element = document.elementFromPoint(clientX, clientY);
    const ring = element?.closest('chainmail-ring');
    
    if(ring) {
      if(isAdd) {
        ring.setAttribute('color', RingLogic.colorOnClick);
      } else if (isRemove) {
        ring.removeAttribute('color');
      }
    }
  }
  
  #getRowMarginTop() {
    const gaugeMm = GaugeLogic.GetGaugeByAwg(this.#awg).millimeters;
    const innerDiameter = this.#innerDiameter;
    const totalDiameter = (2 * gaugeMm) + innerDiameter;
    
    if(WeaveLogic.IsEuropeanFourInOne(this.#weave)) return (totalDiameter * -1.57) + (innerDiameter * 1.509);
    if(WeaveLogic.IsEuropeanSixInOne(this.#weave)) return this.#getRowMarginTopForEuropeanSixInOne(innerDiameter, totalDiameter);
  }
  
  #getRowMarginTopForEuropeanSixInOne(innerDiameter, totalDiameter) {
    // Choose accurate static values for 4mm, use a function for the others
    if(innerDiameter == 4) {
      return {
        '20': '-4.652',
        '19': '-4.868',
        '18': '-5.064'
      }[this.#awg];
    }
    
    return (totalDiameter * -1.097) + (innerDiameter * .3837);
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
