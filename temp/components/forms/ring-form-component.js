class RingFormComponent extends BaseComponent {
  static tag = 'chainmail-ring-form';
  static attributeNames = { activeLayer: 'active-layer', collapsed: 'collapsed' };
  static observedAttributes = Object.values(RingFormComponent.attributeNames);
  static #activeSheetObserver = null;
  
  get #activeLayer() { return this.getAttribute(RingFormComponent.attributeNames.activeLayer) }
  get #collapsed() { return this.getAttribute(LayerFormComponent.attributeNames.collapsed) === 'true' }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if(RingFormComponent.attributeNames.activeLayer === name) this.#onChangeLayer(newValue);
  }
  
  #onChangeLayer(newValue) {
    if(RingFormComponent.#activeSheetObserver !== null) RingFormComponent.#activeSheetObserver.disconnect();
    
    RingFormComponent.#activeSheetObserver = new MutationObserver((mutationList) => {
      const activeSheetWeaveChange = mutationList.find(m => m.attributeName === SheetComponent.attributeNames.weave);
      
      if(activeSheetWeaveChange) {
        this.renderTemplate();
      }
    });
    
    RingFormComponent.#activeSheetObserver.observe(this.#getActiveSheet(), {attributes: true});
    this.renderTemplate();
  }
  
  get template() {
    const currentAwg = this.#getAwg();
    const currentInnerDiameter = this.#getInnerDiameter();
    
    // todo: move this into a factory
    const currentWeaveName = this.#getWeave();
    const currentWeaveLogic = 
      WeaveLogic.IsEuropeanFourInOne(currentWeaveName) ? EuropeanFourInOneLogic
      : WeaveLogic.IsEuropeanSixInOne(currentWeaveName) ? EuropeanSixInOneLogic
      : null;
    
    const validRingTypes = currentWeaveLogic.GetValidRingTypes();
    const validRingTypesByInnerDiameter = Object.groupBy(validRingTypes, (x) => x.innerDiameter);
    
    const collapseIcon = this.#collapsed ? '&#x25B6;' : '&#x25BC;';
    return `
      <fieldset class="${this.#collapsed ? 'collapsed' : ''}">
        <legend>
          <button class="chainmail-form__collapse"><span class="chainmail-form__collapse__icon" style="vertical-align: ${this.#collapsed ? 'top' : 'middle'};">${collapseIcon}</span> Ring</button>
        </legend>
        
        <label for="chainmail-form__aspect-ratio">Inner Diameter / Gauge (mm)</label>
        <select id="chainmail-form__aspect-ratio">
          ${Object.keys(validRingTypesByInnerDiameter).map(innerDiameter => `
            <optgroup label="${innerDiameter}mm">
              ${validRingTypesByInnerDiameter[innerDiameter].map(ring => `                
                <option
                  data-awg="${ring.gauge.awg}"
                  data-inner-diameter="${innerDiameter}"
                  title="Aspect Ratio ${ring.aspectRatio}"
                  ${ring.gauge.awg == currentAwg && innerDiameter == currentInnerDiameter ? 'selected' : ''}
                >${innerDiameter}mm / ${ring.gauge.awgGauge} (${ring.gauge.mm})</option>
              `).join('')}
            </optgroup>
          `).join('')}
        </select>
        
        <label for="chainmail-ring-form__color">Color (on click)</label>
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
      element: this.#aspectRatioSelect,
      event: 'change',
      handler: this.#setAspectRatio.bind(this)
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
  
  get #aspectRatioSelect() {
    return document.getElementById('chainmail-form__aspect-ratio');
  }
  
  #setAspectRatio(event) {
    const awg = event.target.selectedOptions[0].getAttribute('data-awg');
    const innerDiameter = event.target.selectedOptions[0].getAttribute('data-inner-diameter');
    
    this.#getActiveSheet().setAttribute(SheetComponent.attributeNames.awg, awg);
    this.#getActiveSheet().setAttribute(SheetComponent.attributeNames.innerDiameter, innerDiameter);
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
  
  #getActiveSheet() {
    return document.querySelector(`chainmail-sheet[layer="${this.#activeLayer}"]`);
  }
  
  #getWeave() {
    return this.#getActiveSheet().getAttribute(SheetComponent.attributeNames.weave);
  }
  
  #getInnerDiameter() {
    return parseInt(this.#getActiveSheet().getAttribute(SheetComponent.attributeNames.innerDiameter));
  }
  
  #getAwg() {
    return parseInt(this.#getActiveSheet().getAttribute(SheetComponent.attributeNames.awg));
  }
  
  #onWeaveChange() {
    
  }
}
customElements.define(RingFormComponent.tag, RingFormComponent);