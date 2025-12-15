class RingFormComponent extends BaseComponent {
  static tag = 'chainmail-ring-form';
  
  get template() {
    const gauges = GaugeLogic.GetGauges();
    const innerDiameters = [4, 6, 7, 8];
    
    const currentAwg = this.#getAwg();
    const currentInnerDiameter = this.#getInnerDiameter();
    
    // todo: move this into a factory
    const currentWeaveName = this.#getWeave();
    const currentWeaveLogic = 
      WeaveLogic.IsEuropeanFourInOne(currentWeaveName) ? EuropeanFourInOneLogic
      : WeaveLogic.IsEuropeanSixInOne(currentWeaveName) ? EuropeanSixInOneLogic
      : null;
      
    return `
      <fieldset>
        <legend>Ring</legend>
        <label for="chainmail-form__inner-diameter">Inner Diameter</label>
        <select id="chainmail-form__inner-diameter">
          ${
            innerDiameters.map(innerDiameter => {
              const isValidRingType = currentWeaveLogic.IsValidRingType(innerDiameter, this.#getAwg());
              
              return `
                <option
                  value="${innerDiameter}"
                  ${innerDiameter === this.#getInnerDiameter() ? 'selected' : ''}
                  ${!isValidRingType ? ' disabled' : ''}
                  ${!isValidRingType ? ` title="Can't complete a ${currentWeaveName} with AWG ${this.#getAwg()}g and Inner Diameter ${innerDiameter}"` : ''}
                >${innerDiameter}mm</option>
              `;
            }).join('')
          }
        </select>
        
        <label for="chainmail-form__gauge">Gauge (AWG)</label>
        <select id="chainmail-form__gauge">
          ${
            gauges.map(gauge => {
              const isValidRingType = currentWeaveLogic.IsValidRingType(this.#getInnerDiameter(), gauge.awg);
              
              return `
                <option
                  value="${gauge.awg}"
                  ${gauge.awg === this.#getAwg() ? 'selected' : ''}
                  ${!isValidRingType ? 'disabled' : ''}
                  ${!isValidRingType ? ` title="Can't complete a ${currentWeaveName} with AWG ${gauge.awg}g and Inner Diameter ${this.#getInnerDiameter()}"` : ''}
                >${gauge.awgGauge} (${gauge.mm})</option>
              `
            }).join('')
          }
        </select>
      </fieldset>
    `;
  }
  
  get eventListeners() {
    return [{      
      element: this.#gaugeSelect,
      event: 'change',
      handler: this.#setGauge.bind(this)
    }, {      
      element: this.#innerDiameterSelect,
      event: 'change',
      handler: this.#setInnerDiameter.bind(this)
    }];
  }
  
  get #weaveSelect() {
    return document.getElementById('chainmail-form__weave');
  }
    
  #setWeave(event) {
    const newValue = event.target.value;
    const sheet = this.#getActiveSheet();
    sheet.setAttribute(SheetComponent.attributeNames.awg, 18);
    sheet.setAttribute(SheetComponent.attributeNames.innerDiameter, 4);
    sheet.setAttribute(SheetComponent.attributeNames.weave, newValue);
  }
  
  #getWeave() {
    return this.#getActiveSheet().getAttribute(SheetComponent.attributeNames.weave);
  }

  #getActiveSheet() {
    return document.querySelector(`chainmail-sheet.chainmail-sheet--active`);
  }
  
  get #innerDiameterSelect() {
    return document.getElementById('chainmail-form__inner-diameter');
  }
  
  get #gaugeSelect() {
    return document.getElementById('chainmail-form__gauge');
  }
  
  #setGauge(event) {
    const newValue = event.target.value;
    this.#getActiveSheet().setAttribute(SheetComponent.attributeNames.awg, newValue);
  }
  
  #setInnerDiameter(event) {
    const newValue = event.target.value;
    this.#getActiveSheet().setAttribute(SheetComponent.attributeNames.innerDiameter, newValue);
  }
  
  #getInnerDiameter() {
    return parseInt(this.#getActiveSheet().getAttribute(SheetComponent.attributeNames.innerDiameter));
  }
  
  #getAwg() {
    return parseInt(this.#getActiveSheet().getAttribute(SheetComponent.attributeNames.awg));
  }
}
customElements.define(RingFormComponent.tag, RingFormComponent);