class SheetComponent extends HTMLElement {
  constructor() {
    super();
  }
  
  // Attributes
  static attributeNames = { rows: 'rows', columns: 'columns', innerDiameter: "inner-diameter", awg: 'awg', weave: 'weave' };
  static observedAttributes = Object.values(SheetComponent.attributeNames);
  
  #rows = 10;
  #columns = 10;
  #awg = 18;
  #innerDiameter = 4;
  #weave = 'European Four-In-One';
  
  attributeChangedCallback(name, oldValue, newValue) {
    if(SheetComponent.attributeNames.rows === name) this.#rows = parseInt(newValue);
    if(SheetComponent.attributeNames.columns === name) this.#columns = parseInt(newValue);
    if(SheetComponent.attributeNames.awg === name) this.#onChangeAwg(newValue);
    if(SheetComponent.attributeNames.innerDiameter === name) this.#onChangeInnerDiameter(newValue);
    if(SheetComponent.attributeNames.weave === name) this.#onChangeWeave(newValue);
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
    const hasNewWeave = !hasExistingStyles || this.#styles.getAttribute('data-weave') !== `${this.#weave}`;
    const hasNewGauge = !hasExistingStyles || this.#styles.getAttribute('data-awg') !== `${this.#awg}`;
    const hasNewInnerDiameter = !hasExistingStyles || this.#styles?.getAttribute('data-inner-diameter') !== `${this.#innerDiameter}`;
    const hasNewParameter = hasNewWeave || hasNewGauge || hasNewInnerDiameter;
    
    if(hasNewParameter) {
      const parser = new DOMParser();
      const newStyles = parser.parseFromString(`
        <style id="chainmail-sheet-styles" data-weave="${this.#weave}" data-awg="${this.#awg}" data-inner-diameter="${this.#innerDiameter}">
          chainmail-sheet > .row {
            display: flex;
            flex-direction:row;
          }
          
          chainmail-sheet > .row ~ .row {
            margin-top: ${this.#getRowMarginTop()};
          }
          
          chainmail-sheet > .row:nth-child(even) {
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
    this.#awg = parseInt(newValue);
    this.#renderStyles();
    this.#setAllRingAttributes(RingComponent.attributeNames.awg, this.#awg);
  }
  
  #onChangeInnerDiameter(newValue) {
    this.#innerDiameter = parseInt(newValue);
    this.#renderStyles();
    this.#setAllRingAttributes(RingComponent.attributeNames.innerDiameter, this.#innerDiameter);
  }
  
  #onChangeWeave(newValue) {
    this.#weave = newValue;
    this.#renderStyles();
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
}
customElements.define("chainmail-sheet", SheetComponent);
