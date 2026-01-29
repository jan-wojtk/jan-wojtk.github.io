class RingComponent extends HTMLElement {
  constructor() {
    super();
  }
  
  // Attributes
  static attributeNames = {
    awg: 'awg',
    color: 'color',
    innerDiameter: 'inner-diameter',
    outlineColor: 'outline-color',
    rotate180: 'rotate-180',
    layer: 'layer'
  };
  static observedAttributes = Object.values(RingComponent.attributeNames);
  
  get #awg() { return parseInt(this.getAttribute(RingComponent.attributeNames.awg)) } ;// = 18;
  get #color() { return this.getAttribute(RingComponent.attributeNames.color) || this.#getSheetAttribute(SheetComponent.attributeNames.color) }
  get #innerDiameter() { return parseInt(this.getAttribute(RingComponent.attributeNames.innerDiameter)) } // = 4;
  get #outlineColor() { return this.getAttribute(RingComponent.attributeNames.outlineColor) || '#666666' }// light mode: '#888888';
  get #rotate180() { return this.getAttribute(RingComponent.attributeNames.rotate180) === 'true' }// = false;
  get #layer() { return parseInt(this.getAttribute(RingComponent.attributeNames.layer)); }
  
  // Attribute Callbacks
  attributeChangedCallback(name, oldValue, newValue) {
    if(RingComponent.attributeNames.awg === name) this.#onChangeAwg(newValue);
    if(RingComponent.attributeNames.color === name) this.#onChangeColor(newValue);
    if(RingComponent.attributeNames.innerDiameter === name) this.#onChangeInnerDiameter(newValue);
    if(RingComponent.attributeNames.outlineColor === name) this.#outlineColor = newValue;
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
  #sliceCount = 25;
  
  get #ring() {
    return new Ring(this.#innerDiameter, this.#awg);
  }
  
  get #styles() {
    return document.querySelector(`.chainmail-ring-styles[layer="${this.#layer}"]`);
  }
  
  #renderStyles() {
    // newValue should be a Node of the tag Styles
    const hasExistingStyles = !!this.#styles;
    const hasNewLayer = !hasExistingStyles || this.#styles.getAttribute('data-layer') !== `${this.#layer}`;
    const hasNewGauge = !hasExistingStyles || this.#styles.getAttribute('data-awg') !== `${this.#awg}`;
    const hasNewInnerDiameter = !hasExistingStyles || this.#styles.getAttribute('data-inner-diameter') !== `${this.#innerDiameter}`;
    const hasNewParameter = hasNewLayer || hasNewGauge || hasNewInnerDiameter;
    
    if(hasNewParameter) {
      const parser = new DOMParser();
      
      const outlineWidth = '.75';
      const newStyles = parser.parseFromString(`
        <style class="chainmail-ring-styles" data-inner-diameter="${this.#innerDiameter}" data-awg="${this.#awg}" data-layer="${this.#layer}">          
          chainmail-ring[layer="${this.#layer}"] {
            border-color: inherit;
            border-radius: 50%;
            cursor: pointer;
            height: ${this.#ring.innerDiameter + (this.#ring.gauge.millimeters * 2)}mm;
            overflow: hidden;
            width: ${this.#ring.innerDiameter + (this.#ring.gauge.millimeters * 2)}mm;
          }

          chainmail-ring[layer="${this.#layer}"] > .ring-slice {
            border-color: inherit;
            overflow: hidden;
            height: ${100/this.#sliceCount}%;
            width: 100%;
          }

          chainmail-ring[layer="${this.#layer}"] > .ring-slice > .ring {
            border: ${this.#ring.gauge.mm} solid;
            border-color: inherit;
            border-radius: 50%;
            height: ${this.#innerDiameter}mm;
            outline: ${outlineWidth}px solid ${this.#outlineColor};
            outline-offset: -${outlineWidth}px;
            position: relative;
            width: ${this.#innerDiameter}mm;
          }
          
          chainmail-ring[layer="${this.#layer}"] > .ring-slice > .ring > .ring__inner-outline {
            outline: ${outlineWidth}px solid ${this.#outlineColor};
            border-radius: 50%;
            height: 100%;
            width: 100%;
          }
          
          chainmail-ring[layer="${this.#layer}"]:hover {
            border-color: lightcoral !important;
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
    
    this.addEventListener('click', this.handleClick);
    this.addEventListener('contextmenu', this.handleContextMenu)
  }
  
  handleClick() {
    this.setAttribute('color', RingLogic.colorOnClick);
  }
  
  handleContextMenu() {
    event.preventDefault();
    this.removeAttribute('color', RingLogic.colorOnClick);
  }
  
  #getSheetAttribute(attribute) {
    return this.closest('chainmail-sheet').getAttribute(attribute);
  }
}
customElements.define("chainmail-ring", RingComponent);
