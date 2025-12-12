class RingComponent extends HTMLElement {
  constructor() {
    super();
  }
  
  // Attributes
  static attributeNames = {
    color: 'color',
    awg: 'awg',
    innerDiameter: 'inner-diameter',
    outlineColor: 'outline-color',
    rotate180: 'rotate-180'
  };
  static observedAttributes = Object.values(RingComponent.attributeNames);
  
  #color = 'sandybrown';
  #innerDiameter = 4;
  #awg = 18;
  #outlineColor = '#666666';// light mode: '#888888';
  #rotate180 = false;
  
  // Attribute Callbacks
  attributeChangedCallback(name, oldValue, newValue) {
    if(RingComponent.attributeNames.color === name) this.#color = newValue;
    if(RingComponent.attributeNames.awg === name) this.#onChangeAwg(newValue);
    if(RingComponent.attributeNames.innerDiameter === name) this.#onChangeInnerDiameter(newValue);
    if(RingComponent.attributeNames.outlineColor === name) this.#outlineColor = newValue;
    if(RingComponent.attributeNames.rotate180 === name) this.#onChangeRotate180(newValue);
  }
  
  // Attribute Setters
  #onChangeRotate180(newValue) {
    this.#rotate180 = newValue === "true"; // casting string to boolean
  }
  
  #onChangeAwg(newValue) {
    this.#awg = parseInt(newValue);
    this.#renderStyles();
  }
  
  #onChangeInnerDiameter(newValue) {
    this.#innerDiameter = parseInt(newValue);
    this.#renderStyles();
  }
  
  // Members
  #sliceCount = 25;
  
  get #ring() {
    return new Ring(this.#innerDiameter, this.#awg);
  }
  
  get #styles() {
    return document.getElementById('chainmail-ring-styles');
  }
  
  #renderStyles() {
    // newValue should be a Node of the tag Styles
    const hasExistingStyles = !!this.#styles;
    const hasNewGauge = !hasExistingStyles || this.#styles.getAttribute('data-awg') !== `${this.#awg}`;
    const hasNewInnerDiameter = !hasExistingStyles || this.#styles.getAttribute('data-inner-diameter') !== `${this.#innerDiameter}`;
    const hasNewParameter = hasNewGauge || hasNewInnerDiameter;
    
    if(hasNewParameter) {
      const parser = new DOMParser();
      
      const outlineWidth = '.75';
      const newStyles = parser.parseFromString(`
        <style id="chainmail-ring-styles" data-inner-diameter="${this.#innerDiameter}" data-awg="${this.#awg}">          
          chainmail-ring {
            border-color: ${this.#color};
            border-radius: 50%;
            cursor: pointer;
            height: ${this.#ring.innerDiameter + (this.#ring.gauge.millimeters * 2)}mm;
            overflow: hidden;
            width: ${this.#ring.innerDiameter + (this.#ring.gauge.millimeters * 2)}mm;
          }

          chainmail-ring > .ring-slice {
            border-color: inherit;
            overflow: hidden;
            height: ${100/this.#sliceCount}%;
            width: 100%;
          }

          chainmail-ring > .ring-slice > .ring {
            border: ${this.#ring.gauge.mm} solid;
            border-color: inherit;
            border-radius: 50%;
            height: ${this.#innerDiameter}mm;
            outline: ${outlineWidth}px solid ${this.#outlineColor};
            outline-offset: -${outlineWidth}px;
            position: relative;
            width: ${this.#innerDiameter}mm;
          }
          
          chainmail-ring > .ring-slice > .ring > .ring__inner-outline {
            outline: ${outlineWidth}px solid ${this.#outlineColor};
            border-radius: 50%;
            height: 100%;
            width: 100%;
          }
          
          chainmail-ring:hover {
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
    
    // Register event listeners
    this.addEventListener('click', this.handleClick);
  }
  
  // Event Listeners
  handleClick() {
    console.log(this, arguments);
  }
}
customElements.define("chainmail-ring", RingComponent);
