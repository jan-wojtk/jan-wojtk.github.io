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
  #color = 'sandybrown';
  #innerDiameterMm = 6;
  #gaugeMm = 1.6; // 14g
  #outlineColor = '#888888';
  #rotate180 = false;
  
  // Attribute Change Callback (override)
  attributeChangedCallback(name, oldValue, newValue) {
    if(RingComponent.attributeNames.color === name) this.#color = newValue;
    if(RingComponent.attributeNames.gaugeMm === name) this.#gaugeMm = parseFloat(newValue);
    if(RingComponent.attributeNames.innerDiameterMm === name) this.#innerDiameterMm = parseFloat(newValue);
    if(RingComponent.attributeNames.outlineColor === name) this.#outlineColor = newValue;
    if(RingComponent.attributeNames.rotate180 === name) this.#setRotate180(newValue)
  }
  
  // Attribute Setters
  #setRotate180(newValue) {
    this.#rotate180 = newValue === "true"; // todo, clarify casting
  }
  
  // Members
  get #styles() {
    return document.getElementById('chainmail-ring-styles');
  }
  
  constructor() {
    super();
  }
  
  connectedCallback() {
    const parser = new DOMParser();
    
    // Render template
    const partialCount = 3;
    const zIndexes3 = { 0: -100, 1: 0, 2: 100 };
    //const zIndexes5 = { 0: -100, 1: -50, 2: 0, 3: 50, 4: 100 };
    //const zIndexes10 = { 0: -100, 1: -80, 2: -60, 3: -40, 4: -20, 5: 0, 6: 20, 7: 40, 8: 60, 9: 80, 10: 100 };
    const partialsV2 = parser.parseFromString(
      Array(partialCount).fill(null).map((value, index) => {
        const zIndex = this.#rotate180 ? zIndexes3[index] * -1 : zIndexes3[index];
        
        return `
          <div class="ring-partial">
            <div class="ring"
              style="
                z-index: ${zIndex};
                margin-top: -${(this.#innerDiameterMm + (this.#gaugeMm * 2))*(index)/partialCount}mm;
              "
            ></div>
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
            border-radius: 50%;
            height: calc(${(this.#innerDiameterMm + (this.#gaugeMm * 2))}mm - ${outlineWidth});
            outline: .75px solid ${this.#outlineColor}; /* todo: reflect change from .5px to .75px in calculated css rules */
            overflow: hidden;
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
        </style>
      `, 'text/html').head.children[0]);
    
    // Register event listeners
    this.addEventListener('click', this.handleClick);
  }
  
  // Event Listeners
  handleClick() {
    console.log(this, arguments);
  }
}
customElements.define("chainmail-ring", RingComponent);