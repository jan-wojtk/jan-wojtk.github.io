class FormComponent extends BaseComponent {
  static tag = "chainmail-form";
  
  get styles() {
    return `
      chainmail-form {
        display: flex;
        flex-direction: column;
      }
      
      chainmail-view-form {
        margin-top: auto;
      }
      
      chainmail-form fieldset {
        border: 0;
        border-top: 1px dashed #cccccc;
        display:block;
        padding: 0;
      }
      
      /* intended to separate fieldsets that follow fieldsets */
      chainmail-form > * {
        display: block;
        margin-bottom: 1em;
      }
      
      chainmail-form fieldset > legend {
        font-size: 18px;
        font-weight: bold;
        padding: 0;
      }
      
      chainmail-form fieldset > label {
        display:block;
        font-size: 14px;
        font-weight: bold;
        margin-top: .5em;
      }
      
      chainmail-form fieldset > label::after {
        content: "\\A";
        display: block;
        font-size: 0;
        white-space: pre-wrap;
      }
      
      chainmail-form fieldset > label ~ input,
      chainmail-form fieldset > label ~ select {
        height: 2em;
        width: 100%;
      }
      
      /* Collapse styles */
      .chainmail-form__collapse {
        background: inherit;
        border: 0;
        color: inherit;
        font-size: inherit;
        font-weight: inherit;
        margin-left: -6px;
        text-decoration: inherit;
      }
      
      .chainmail-form__colapse__icon {
        display: inline-block;
        font-size: .75em;
        text-align: left;
        width: 15px;
      }
      
      fieldset.collapsed > *:not(legend) {
        display: none !important;
      }
      
      /* Form buttons */
      chainmail-form fieldset button:disabled {
        cursor: not-allowed;
      }
      
      chainmail-form fieldset button:not(:disabled):hover {
        background: rgba(0, 0, 0, .1);
        cursor: pointer;
      }
      
      .dark-mode chainmail-form fieldset button:not(:disabled):hover {
        background: rgba(255, 255, 255, .1);
      }
    `;
  }
  
  get template() {
    return `
      <chainmail-layer-form active-layer="1" collapsed="true"></chainmail-layer-form>
      <chainmail-sheet-form active-layer="1" collapsed="true"></chainmail-sheet-form>
      <chainmail-ring-form active-layer="1" collapsed="true"></chainmail-ring-form>
      <chainmail-view-form collapsed="false"></chainmail-view-form>
    `;
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    const observer = new MutationObserver((mutationList) => {
      const activeLayerChange = mutationList.find(m => m.attributeName === LayerFormComponent.attributeNames.activeLayer);
      
      if(activeLayerChange) {
        const newActiveLayer = activeLayerChange.target.getAttribute(LayerFormComponent.attributeNames.activeLayer);
        
        this.#sheetForm.setAttribute(SheetFormComponent.attributeNames.activeLayer, newActiveLayer);
        this.#ringForm.setAttribute(RingFormComponent.attributeNames.activeLayer, newActiveLayer);
      }
    });
    
    observer.observe(this.#layerForm, {attributes: true});
  }
  
  get #layerForm() {
    return this.querySelector('chainmail-layer-form');
  }
  
  get #sheetForm() {
    return this.querySelector('chainmail-sheet-form');
  }
  
  get #ringForm() {
    return this.querySelector('chainmail-ring-form');
  }
  
  get #viewForm() {
    return this.querySelector('chainmail-view-form');    
  }
}
customElements.define(FormComponent.tag, FormComponent);
