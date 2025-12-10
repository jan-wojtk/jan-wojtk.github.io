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
  #outlineColor = '#888888';
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
  get #ringType() {
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
      
      const partialCount = 10;
      const outlineWidth = '.75';
      const newStyles = parser.parseFromString(`
        <style id="chainmail-ring-styles" data-inner-diameter="${this.#innerDiameter}" data-awg="${this.#awg}">          
          chainmail-ring {
            border-color: ${this.#color};
            border-radius: 50%;
            cursor: pointer;
            height: calc(${(this.#ringType.innerDiameter + (this.#ringType.gauge.millimeters * 2))}mm - ${outlineWidth}px);
            margin-right: ${outlineWidth * 2}px;
            outline: .75px solid ${this.#outlineColor}; /* todo: reflect change from .5px to .75px in calculated css rules */
            overflow: hidden;
            width: calc(${(this.#ringType.innerDiameter + (this.#ringType.gauge.millimeters * 2))}mm - ${outlineWidth}px);
          }

          chainmail-ring > .ring-partial {
            border-color: inherit;
            overflow: hidden;
            height: ${100/partialCount}%;
            width: 100%;
          }

          chainmail-ring > .ring-partial > .ring {
            border: ${this.#ringType.gauge.mm} solid;
            border-color: inherit;
            border-radius: 50%;
            height: ${this.#innerDiameter}mm;
            outline: ${outlineWidth}px solid ${this.#outlineColor};
            outline-offset: -${this.#ringType.gauge.mm};
            position: relative;
            width: ${this.#innerDiameter}mm;
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
  
  connectedCallback() {
    const parser = new DOMParser();
    
    // Render template (todo, write logic for the z-index values)
    // Remember to avoid zIndex conflicts by using 1 instead of 0 (such as: 0 === -0 but 1 !== -1)
    const partialCount = 10;
    //const zIndexes3 = { 0: -100, 1: 1, 2: 100 };
    //const zIndexes5 = { 0: -100, 1: -50, 2: 1, 3: 50, 4: 100 };
    const zIndexes10 = { 0: -100, 1: -80, 2: -60, 3: -40, 4: -20, 5: 1, 6: 20, 7: 40, 8: 60, 9: 80, 10: 100 };
    const partialsV2 = parser.parseFromString(
      Array(partialCount).fill(null).map((value, index) => {
        let zIndex = zIndexes10[index];
        
        if(this.#rotate180) {
          zIndex = zIndex * -1;
        }
        
        return `
          <div class="ring-partial">
            <div class="ring"
              style="
                top: -${100*index}%;
                z-index: ${zIndex};
              "
            ></div>
          </div>
        `;
      }).join(''), 'text/html'
    ).body.children;
    while(partialsV2.length > 0) this.appendChild(partialsV2[0]);
    
    // Render styles
    this.#renderStyles();
    
    // Register event listeners
    this.addEventListener('click', this.handleClick);
  }
  
  // Event Listeners
  handleClick() {
    console.log(this, arguments);
  }
}
customElements.define("chainmail-ring", RingComponent);
