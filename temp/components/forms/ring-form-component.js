class RingFormComponent extends BaseComponent {
  static tag = 'chainmail-ring-form';
  static attributeNames = { activeLayer: 'active-layer', collapsed: 'collapsed' };
  static observedAttributes = Object.values(RingFormComponent.attributeNames);
  
  get #activeLayer() { return this.getAttribute(RingFormComponent.attributeNames.activeLayer) }
  get #collapsed() { return this.getAttribute(LayerFormComponent.attributeNames.collapsed) === 'true' }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if(RingFormComponent.attributeNames.activeLayer === name) this.#onChangeLayer(newValue);
  }
  
  #onChangeLayer(newValue) {
    this.renderTemplate();
  }
  
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
      
    const collapseIcon = this.#collapsed ? '&#x25B6;' : '&#x25BC;';
      
    return `
      <fieldset class="${this.#collapsed ? 'collapsed' : ''}">
        <legend>
          <button class="chainmail-form__collapse"><span class="chainmail-form__collapse__icon" style="vertical-align: ${this.#collapsed ? 'top' : 'middle'};">${collapseIcon}</span> Ring</button>
        </legend>
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
        
        <label for="chainmail-ring-form__color">Color</label>
        <input id="chainmail-ring-form__color" type="color" value="${RingLogic.colorOnClick}"/>
        <ol class="color-list">
          ${
            ['#ffff19', '#daa520', '#f4a460', '#ffd700', '#f5f5f5', '#f1a886', '#000000', '#ff0000', '#00ff00', '#0000ff']
              .map(x => `<li><button data-color="${x}" style="background-color: ${x};"></button></li>`).join('')
          }
        </ol>
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
    }, {
      element: this.querySelector('.chainmail-form__collapse'),
      event: 'click',
      handler: this.#onClickCollapse.bind(this)
    }, {
      element: this.#colorInput,
      event: 'change',
      handler: this.#setColorByInput.bind(this)
    }, {
      elements: this.#colorListItems,
      event: 'click',
      handler: this.#setColorByList.bind(this)
    }];
  }
  
  get #colorInput() {
    return document.getElementById('chainmail-ring-form__color');
  }
  
  get #colorListItems() {
    return document.querySelectorAll('chainmail-ring-form .color-list li button');
  }
  
  #setColorByInput(event) {
    RingLogic.colorOnClick = event.target.value;
  }
  
  #setColorByList(event) {
    const newColor = event.target.getAttribute('data-color');
    RingLogic.colorOnClick = newColor;
    this.#colorInput.value = newColor;
  }
  
  #onClickCollapse(event) {
    const className = 'collapsed';
    const fieldset = event.target.closest('fieldset');
    const isFieldsetCollapsed = fieldset.classList.contains(className);
    
    if(isFieldsetCollapsed) {
      fieldset.classList.remove(className);
    } else {
      fieldset.classList.add(className);
    }
    
    this.setAttribute('collapsed', !this.#collapsed);
    this.renderTemplate();
  }
  
  #getWeave() {
    return this.#getActiveSheet().getAttribute(SheetComponent.attributeNames.weave);
  }

  #getActiveSheet() {
    return document.querySelector(`chainmail-sheet[layer="${this.#activeLayer}"]`);
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