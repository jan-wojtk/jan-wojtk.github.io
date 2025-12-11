class SheetComponent extends HTMLElement {
  constructor() {
    super();
  }
  
  // Attributes
  static attributeNames = { rows: 'rows', columns: 'columns', innerDiameter: "inner-diameter", awg: 'awg' };
  static observedAttributes = Object.values(SheetComponent.attributeNames);
  
  #rows = 10;
  #columns = 10;
  #awg = 18;
  #innerDiameter = 4;
  
  attributeChangedCallback(name, oldValue, newValue) {
    if(SheetComponent.attributeNames.rows === name) this.#rows = parseInt(newValue);
    if(SheetComponent.attributeNames.columns === name) this.#columns = parseInt(newValue);
    if(SheetComponent.attributeNames.awg === name) this.#onChangeAwg(newValue);
    if(SheetComponent.attributeNames.innerDiameter === name) this.#onChangeInnerDiameter(newValue);
  }
  
  get #ringType() {
    return new Ring(this.#innerDiameter, this.#awg);
  }
  
  get #rowList() {
    return this.querySelectorAll('.row');
  }
  
  get #styles() {
    return document.getElementById('chainmail-sheet-styles');
  }
  
  #renderStyles() {
    const hasExistingStyles = !!this.#styles;
    const hasNewGauge = !hasExistingStyles || this.#styles.getAttribute('data-awg') !== `${this.#awg}`;
    const hasNewInnerDiameter = !hasExistingStyles || this.#styles?.getAttribute('data-inner-diameter') !== `${this.#innerDiameter}`;
    const hasNewParameter = hasNewGauge || hasNewInnerDiameter;
    
    if(hasNewParameter) {
      const parser = new DOMParser();
      const newStyles = parser.parseFromString(`
        <style id="chainmail-sheet-styles" data-awg="${this.#awg}" data-inner-diameter="${this.#innerDiameter}">
          chainmail-sheet > .row {
            display: flex;
            flex-direction:row;
          }
          
          chainmail-sheet > .row ~ .row {
            margin-top: ${this.#getRowMarginTopForRingType()};
          }
          
          chainmail-sheet > .row:nth-child(even) {
            margin-left: ${this.#getRowMarginLeftForRingType()};
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
    this.#awg = parseInt(newValue);
    this.#renderStyles();
    this.#setAllRingAttributes(RingComponent.attributeNames.awg, this.#awg);
  }
  
  #onChangeInnerDiameter(newValue) {
    this.#innerDiameter = parseInt(newValue);
    this.#renderStyles();
    this.#setAllRingAttributes(RingComponent.attributeNames.innerDiameter, this.#innerDiameter);
  }
  
  connectedCallback() {
    const parser = new DOMParser();
    
    // Todo: replace Array.fill iteration for readability
    const rowList = parser.parseFromString(
      Array(this.#rows).fill(null).map((value, rowIndex) => `
        <div class="row">
          ${Array(this.#columns).fill(null).map((value, index) => `
            <chainmail-ring
              awg="${this.#awg}"
              inner-diameter="${this.#innerDiameter}"
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
  
  #getRowMarginTopForRingType() {
    // todo: rewrite this for readability using the Ring class
    // todo: make real formulas for these trends
    return {
      innerDiameter: {
        '4': { awg: {
          '20': '-11.83386',
          '19': '-13.33386',
          '18': '-14.33386',
          '17': '-16.53386',
          '16': '-17.33386',
          '15': '-19.83386'
        } },
        '6': { awg: {
          '20': '-12.83386',
          '19': '-14.33386',
          '18': '-14.83386',
          '17': '-16.83386',
          '16': '-17.83386',
          '15': '-20.33386',
          '14': '-23.33386',
          '13': '-25.33386',
          '12': '-28.13386'
        } },
        '7': { awg: {
          '20': '-13.83386',
          '19': '-14.83386',
          '18': '-15.83386',
          '17': '-17.83386',
          '16': '-18.83386',
          '15': '-21.33386',
          '14': '-22.83386',
          '13': '-26.33386',
          '12': '-28.33386',
          '11': '-31.33386',
          '10': '-34.33386'
        } },
        '8': { awg: {
          '20': '-13.83386',
          '19': '-15.83386',
          '18': '-16.83386',
          '17': '-18.33386',
          '16': '-19.83386',
          '15': '-21.33386',
          '14': '-22.83386',
          '13': '-25.83386',
          '12': '-29.83386',
          '11': '-32.33386',
          '10': '-34.8386',
          '9': '-38.83386'
        } },
      }
    }.innerDiameter[this.#innerDiameter].awg[this.#awg];
  }
  
  #getRowMarginLeftForRingType() {
    // todo: rewrite this for readability using the Ring class
    // todo: make real formulas for these trends
    // todo: add .5 to each
    return ({
      innerDiameter: {
        '4': { awg: {
          '20': '11.3386',
          '19': '11.8386',
          '18': '12.0386',
          '17': '12.8386',
          '16': '13.3386',
          '15': '13.8386'
        } },
        '6': { awg: {
          '20': '15.3386',
          '19': '15.8386',
          '18': '16.0386',
          '17': '16.3386',
          '16': '17.0386',
          '15': '17.8386',
          '14': '18.3386',
          '13': '19.0386',
          '12': '19.9886'
        } },
        '7': { awg: {
          '20': '17.0386',
          '19': '17.5386',
          '18': '17.8386',
          '17': '18.3386',
          '16': '18.8386',
          '15': '19.7386',
          '14': '20.0386',
          '13': '20.8386',
          '12': '21.8386',
          '11': '22.8386',
          '10': '23.886'
        } },
        '8': { awg: {
          '20': '19.3386',
          '19': '19.3386',
          '18': '19.8386',
          '17': '20.3386',
          '16': '20.8386',
          '15': '21.5',
          '14': '22.3386',
          '13': '22.8386',
          '12': '23.8386',
          '11': '24.8386',
          '10': '25.8',
          '9': '26.8386'
        } },
      }
    }.innerDiameter[this.#innerDiameter].awg[this.#awg]);
  }
}
customElements.define("chainmail-sheet", SheetComponent);
