class RingComponent extends HTMLElement {
  get #sheetId() { return parseInt(this.getAttribute('sheet-id')) }
  get #sheet() { return SheetLogic.GetSheetById(this.#sheetId) }
  
  constructor() {
    super();
  }
  
  // Attributes
  static attributeNames = {
    color: 'color',
    rotate180: 'rotate-180',
    sheetId: 'sheet-id'
  };
  static observedAttributes = Object.values(RingComponent.attributeNames);
  #getSheetAttribute(attribute) {
    return this.closest('chainmail-sheet').getAttribute(attribute);
  }
  get #color() { return this.getAttribute(RingComponent.attributeNames.color) || this.#getSheetAttribute(SheetComponent.attributeNames.color) }
  get #rotate180() { return this.getAttribute(RingComponent.attributeNames.rotate180) === 'true' }
  
  // Attribute Callbacks
  attributeChangedCallback(name, oldValue, newValue) {
    if(RingComponent.attributeNames.color === name) this.#onChangeColor(newValue);
    if(RingComponent.attributeNames.rotate180 === name) this.#onChangeRotate180(newValue);
  }
  
  // Attribute Setters
  #onChangeRotate180(newValue) { }
  
  #onChangeAwg(newValue) {
    this.#renderStyles();
  }
  
  #onChangeInnerDiameter(newValue) {
    this.#renderStyles();
  }
  
  #onChangeColor(newValue) {
    this.style.borderColor = this.#color;
  }
  
  // Members
  #sliceCount = 15;
  
  get #ring() {
    const sheet = this.#sheet;
    return new Ring(sheet.innerDiameter, sheet.awg);
  }
  
  get #styles() {
    return document.querySelector(`.chainmail-ring-styles[sheet-id="${this.#sheetId}"]`);
  }
  
  #renderStyles() {
    const sheet = this.#sheet;
    const ring = this.#ring;
    const hasExistingStyles = !!this.#styles;
    const hasNewLayer = !hasExistingStyles || this.#styles.getAttribute('sheet-id') !== `${sheet.id}`;
    const hasNewGauge = !hasExistingStyles || this.#styles.getAttribute('data-awg') !== `${sheet.awg}`;
    const hasNewInnerDiameter = !hasExistingStyles || this.#styles.getAttribute('data-inner-diameter') !== `${sheet.innerDiameter}`;
    const hasNewParameter = hasNewLayer || hasNewGauge || hasNewInnerDiameter;
    
    if(hasNewParameter) {
      const parser = new DOMParser();
      
      const outlineWidth = '1';
      const newStyles = parser.parseFromString(`
        <style class="chainmail-ring-styles" data-inner-diameter="${sheet.innerDiameter}" data-awg="${sheet.awg}" sheet-id="${sheet.id}">          
          chainmail-ring[sheet-id="${sheet.id}"] {
            border-color: inherit;
            border-radius: 50%;
            cursor: pointer;
            height: ${ring.innerDiameter + (ring.gauge.millimeters * 2)}mm;
            overflow: hidden;
            width: ${ring.innerDiameter + (ring.gauge.millimeters * 2)}mm;
          }

          chainmail-ring[sheet-id="${sheet.id}"] > .ring-slice {
            border-color: inherit;
            overflow: hidden;
            height: ${100/this.#sliceCount}%;
            width: 100%;
          }

          chainmail-ring[sheet-id="${sheet.id}"] > .ring-slice > .ring {
            border: ${ring.gauge.mm} solid;
            border-color: inherit;
            border-radius: 50%;
            height: ${sheet.innerDiameter}mm;
            outline: ${outlineWidth}px solid #666666b0;
            outline-offset: -${outlineWidth}px;
            position: relative;
            width: ${sheet.innerDiameter}mm;
          }
          
          chainmail-ring[sheet-id="${sheet.id}"] > .ring-slice > .ring > .ring__inner-outline {
            outline: ${outlineWidth}px solid #666666b0;
            border-radius: 50%;
            height: 100%;
            width: 100%;
          }
          
          @media (hover: hover) {
            chainmail-ring[sheet-id="${sheet.id}"]:hover {
              border-color: lightcoral !important;
            }
          }
        </style>
      `, 'text/html').head.children[0];

      if(!hasExistingStyles) document.head.appendChild(newStyles);
      else this.#styles.replaceWith(newStyles);
    }
  }
  
  #renderTemplate() {
    const parser = new DOMParser();
    const zIndexMax = this.#sliceCount * 100;
    const zIndexMin = -zIndexMax;
    const zIndexIncrement = (-zIndexMin + zIndexMax) / this.#sliceCount;
    
    let template = '';
    for(let i = 0; i < this.#sliceCount; i++) {
      // Avoid zIndex conflicts by using 1 instead of 0 (because 0 === -0 but 1 !== -1)
      let zIndex = (zIndexMin + (zIndexIncrement * i)) || 1;
      
      // Rotate ring 180deg without using rotate (avoid due to stacking context)
      if(this.#rotate180) zIndex = zIndex * -1;
      
      template += `
        <div class="ring-slice">
          <div class="ring" style="top: -${100*i}%; z-index: ${zIndex};">
            <div class="ring__inner-outline">
            </div>
          </div>
        </div>
      `;
    }
    const slices = parser.parseFromString(template, 'text/html').body.children;
    this.replaceChildren(...slices);
  }
  
  connectedCallback() {
    this.#renderStyles();
    this.#renderTemplate();
  }
  
  
}
customElements.define("chainmail-ring", RingComponent);
