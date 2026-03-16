class SheetComponent extends HTMLElement {
  get #id() { return parseInt(this.getAttribute('data-id')) }
  get #sheet() { return SheetLogic.GetSheetById(this.#id) }
    
  get #ringType() {
    return new Ring(this.#sheet.innerDiameter, this.#sheet.awg);
  }
  
  get #rowList() {
    return this.querySelectorAll('.row');
  }
  
  get #styles() {
    const selector = `.chainmail-sheet-styles[data-id="${this.#sheet.id}"]`;
    const result = document.querySelector(selector);
    
    return result;
  }
  
  #renderStyles() {
    const sheet = this.#sheet;
    const hasExistingStyles = !!this.#styles;
    const hasNewColor = !hasExistingStyles || this.#styles.getAttribute('data-color') !== `${sheet.color}`;
    const hasNewWeave = !hasExistingStyles || this.#styles.getAttribute('data-weave') !== `${sheet.weave}`;
    const hasNewGauge = !hasExistingStyles || this.#styles.getAttribute('data-awg') !== `${sheet.awg}`;
    const hasNewInnerDiameter = !hasExistingStyles || this.#styles?.getAttribute('data-inner-diameter') !== `${sheet.innerDiameter}`;
    const hasNewLayer = !hasExistingStyles || this.#styles?.getAttribute('data-id') !== `${sheet.id}`;
    const hasNewParameter = hasNewColor || hasNewWeave || hasNewGauge || hasNewInnerDiameter || hasNewLayer;
    
    if(hasNewParameter) {
      const parser = new DOMParser();
      const newStyles = parser.parseFromString(`
        <style class="chainmail-sheet-styles" data-color="${sheet.color}" data-weave="${sheet.weave}" data-awg="${sheet.awg}" data-inner-diameter="${sheet.innerDiameter}" data-id="${sheet.id}">
          chainmail-sheet[data-id="${sheet.id}"] {
            border-color: ${sheet.color};
            display: inline-flex;
            flex-direction: column;
            left: 50%;
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%); /* this makes the ring slices very apparent, in a bad way */
            z-index: ${1000 - sheet.id}; /*in any case, avoid negatives or else hover breaks*/
          }
          
          chainmail-sheet[data-id="${sheet.id}"] > .row {
            border-color: inherit;
            display: inline-flex;
          }
          
          chainmail-sheet[data-id="${sheet.id}"] > .row ~ .row {
            margin-top: ${this.#getRowMarginTop()}mm;
          }
          
          chainmail-sheet[data-id="${sheet.id}"] > .row:nth-child(even) {
            margin-left: ${((sheet.innerDiameter + (GaugeLogic.GetGaugeByAwg(sheet.awg).millimeters * 2)) / 2)}mm;
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
    this.#setAllRingAttributes(RingComponent.attributeNames.awg, this.#sheet.awg);
  }
  
  #onChangeInnerDiameter(newValue) {
    this.#renderStyles();
    this.#setAllRingAttributes(RingComponent.attributeNames.innerDiameter, this.#sheet.innerDiameter);
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
    const sheet = this.#sheet;
    // Add rows as needed
    while(sheet.rows > (this.#rowList.length || 0)) {
      const row = document.createElement('div');
      row.setAttribute('class', 'row');
      this.appendChild(row);
    }
    
    // Remove rows as needed
    while(sheet.rows < (this.#rowList.length || 0)) {
      this.lastElementChild.remove();
    }
    
    // Review each row's contents
    const baseRing = this.#getNewRing();
    for(let i = 0; i < this.#rowList.length; i++) {
      const row = this.#rowList[i];
      const isOddRow = i % 2 == 0;
      const expectedRingCount = isOddRow ? Math.ceil(sheet.columns/2) : Math.floor(sheet.columns/2);
      
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
    const sheet = this.#sheet;
    const gaugeMm = GaugeLogic.GetGaugeByAwg(sheet.awg).millimeters;
    const innerDiameter = sheet.innerDiameter;
    const totalDiameter = (2 * gaugeMm) + innerDiameter;
    
    if(WeaveLogic.IsEuropeanFourInOne(sheet.weave)) return (totalDiameter * -1.57) + (innerDiameter * 1.509);
    if(WeaveLogic.IsEuropeanSixInOne(sheet.weave)) return this.#getRowMarginTopForEuropeanSixInOne(innerDiameter, totalDiameter);
  }
  
  #getRowMarginTopForEuropeanSixInOne(innerDiameter, totalDiameter) {
    // Choose accurate static values for 4mm, use a function for the others
    if(innerDiameter == 4) {
      return {
        '20': '-4.652',
        '19': '-4.868',
        '18': '-5.064'
      }[this.#sheet.awg];
    }
    
    return (totalDiameter * -1.097) + (innerDiameter * .3837);
  }
  
  #getNewRing() {
    const sheet = this.#sheet;
    const parser = new DOMParser();
    const ring = parser.parseFromString(`
      <chainmail-ring
        sheet-id="${sheet.id}"
      ></chainmail-ring>
    `, 'text/html').body.children[0];
    
    return ring;
  }
}
customElements.define("chainmail-sheet", SheetComponent);
