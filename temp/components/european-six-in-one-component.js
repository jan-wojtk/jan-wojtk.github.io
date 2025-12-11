class EuropeanSixInOneComponent extends HTMLElement {
  constructor() {
    super();
  }
  
  // Attributes
  static attributeNames = { rows: 'rows', columns: 'columns', innerDiameter: "inner-diameter", awg: 'awg' };
  static observedAttributes = Object.values(EuropeanSixInOneComponent.attributeNames);
  
  #rows = 6;
  #columns = 9;
  #awg = 18;
  #innerDiameter = 8;
  
  attributeChangedCallback(name, oldValue, newValue) {
    if(EuropeanSixInOneComponent.attributeNames.rows === name) this.#rows = parseInt(newValue);
    if(EuropeanSixInOneComponent.attributeNames.columns === name) this.#columns = parseInt(newValue);
    if(EuropeanSixInOneComponent.attributeNames.awg === name) this.#onChangeAwg(newValue);
    if(EuropeanSixInOneComponent.attributeNames.innerDiameter === name) this.#onChangeInnerDiameter(newValue);
  }
  
  get #ringType() {
    return new Ring(this.#innerDiameter, this.#awg);
  }
  
  get #rowList() {
    return this.querySelectorAll('.row');
  }
  
  get #styles() {
    return document.getElementById('chainmail-sheet-european-six-in-one-styles');
  }
  
  #renderStyles() {
    const hasExistingStyles = !!this.#styles;
    const hasNewGauge = !hasExistingStyles || this.#styles.getAttribute('data-awg') !== `${this.#awg}`;
    const hasNewInnerDiameter = !hasExistingStyles || this.#styles?.getAttribute('data-inner-diameter') !== `${this.#innerDiameter}`;
    const hasNewParameter = hasNewGauge || hasNewInnerDiameter;
    
    if(hasNewParameter) {
      const parser = new DOMParser();
      const newStyles = parser.parseFromString(`
        <style id="chainmail-sheet-european-six-in-one-styles" data-awg="${this.#awg}" data-inner-diameter="${this.#innerDiameter}">
          chainmail-sheet-european-six-in-one > .row {
            display: flex;
            flex-direction:row;
          }
          
          chainmail-sheet-european-six-in-one > .row ~ .row {
            margin-top: ${this.#getRowMarginTopForRingType()};
          }
          
          chainmail-sheet-european-six-in-one > .row:nth-child(even) {
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
          '20': '-9.83386',
          '19': '-11.33386',
          '18': '-12.83386',
          '17': '-14.53386',
          '16': '-16.33386',
          '15': '-17.83386'
        } },
        '6': { awg: {
          '20': '-10.83386',
          '19': '-12.33386',
          '18': '-12.83386',
          '17': '-14.83386',
          '16': '-15.83386',
          '15': '-18.33386',
          '14': '-21.33386',
          '13': '-23.33386',
          '12': '-26.13386'
        } },
        '7': { awg: {
          '20': '-11.83386',
          '19': '-13.33386',
          '18': '-14.33386',
          '17': '-15.83386',
          '16': '-16.83386',
          '15': '-19.33386',
          '14': '-20.83386',
          '13': '-24.33386',
          '12': '-26.33386',
          '11': '-29.33386',
          '10': '-32.33386'
        } },
        '8': { awg: {
          '20': '-11.83386',
          '19': '-13.83386',
          '18': '-15.83386',
          '17': '-16.33386',
          '16': '-17.83386',
          '15': '-19.33386',
          '14': '-20.83386',
          '13': '-23.83386',
          '12': '-27.83386',
          '11': '-30.33386',
          '10': '-32.8386',
          '9': '-36.83386'
        } },
      }
    }.innerDiameter[this.#innerDiameter].awg[this.#awg];
  }
  
  #getRowMarginLeftForRingType() {
    // todo: rewrite this for readability using the Ring class
    // todo: make real formulas for these trends
    return ({
      innerDiameter: {
        '4': { awg: {
          '20': '10.8386',
          '19': '11.3386',
          '18': '11.8386',
          '17': '12.3386',
          '16': '12.8386',
          '15': '13.3386'
        } },
        '6': { awg: {
          '20': '14.8386',
          '19': '15.3386',
          '18': '15.5386',
          '17': '15.8386',
          '16': '16.5386',
          '15': '17.3386',
          '14': '17.8386',
          '13': '18.5386',
          '12': '19.4886'
        } },
        '7': { awg: {
          '20': '16.5386',
          '19': '17.0386',
          '18': '17.3386',
          '17': '17.8386',
          '16': '18.3386',
          '15': '19.2386',
          '14': '19.5386',
          '13': '20.3386',
          '12': '21.3386',
          '11': '22.3386',
          '10': '23.386'
        } },
        '8': { awg: {
          '20': '18.8386',
          '19': '18.8386',
          '18': '19.3386',
          '17': '19.8386',
          '16': '20.3386',
          '15': '21',
          '14': '21.8386',
          '13': '22.3386',
          '12': '23.3386',
          '11': '24.3386',
          '10': '25.3',
          '9': '26.3386'
        } },
      }
    }.innerDiameter[this.#innerDiameter].awg[this.#awg]);
  }
}
customElements.define("chainmail-sheet-european-six-in-one", EuropeanSixInOneComponent);
