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
      
      label {
        display:block;
        font-size: 14px;
        font-weight: bold;
        margin-top: .5em;
      }
      
      label::after {
        content: "\\A";
        display: block;
        font-size: 0;
        white-space: pre-wrap;
      }
      
      label ~ input,
      label ~ select {
        box-sizing: border-box;
        height: 2em;
        width: 100%;
      }
      
      /* Color inputs */
      .color-list {
        display: flex;
        flex-wrap: wrap;
        list-style-type: none;
        margin: 0;
        padding: 0;
      }
      
      .color-list > li {
        border: 1px solid #cccccc;
        border-radius: 3px;
        height: 20px;
        margin-top: 5px;
        margin-right: 5px;
        width: 20px;
      }
      
      .color-list > li > button {
        border: 0;
        height: 100%;
        margin: 0;
        padding: 0;
        width: 100%;
      }
      
      button:disabled {
        cursor: not-allowed;
      }
      
      button:not(:disabled):hover {
        background: rgba(0, 0, 0, .1);
        cursor: pointer;
      }
      
      .dark-mode button:not(:disabled):hover {
        background: rgba(255, 255, 255, .1);
      }
    `;
  }
  
  get template() {
    return `
      <chainmail-layer-form active-layer="1" collapsed="true"></chainmail-layer-form>
      <hr style="width: 90%; border-color: #888888;" />
      <ol class="button-list" style="font-size: 1.25em; justify-content: space-between;">
        <li><button><span>Weave<span></button></li>
        <li><button><span>Ring</span></button></li>
        <li><button><span>Size</button></li>
        <li><button><span>Color</span></button></li>
      </ol>
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
