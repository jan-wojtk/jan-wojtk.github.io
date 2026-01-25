class LayerFormComponent extends BaseComponent {
  static tag = 'chainmail-layer-form';
  static attributeNames = { activeLayer: 'active-layer', collapsed: 'collapsed' };
  static observedAttributes = Object.values(LayerFormComponent.attributeNames);
  
  get #layerList() { return this.querySelectorAll('tr.layer-table__layer'); }
  get #activeLayer() { return parseInt(this.getAttribute(LayerFormComponent.attributeNames.activeLayer)) }
  get #collapsed() { return this.getAttribute(LayerFormComponent.attributeNames.collapsed) === 'true' }
  
  get template() {
    const layerList = LayerLogic.GetLayerList();
    const isSingleLayer = layerList.length === 1;
    const collapseIcon = this.#collapsed ? '&#x25B6;' : '&#x25BC;';
    
    return `
      <fieldset class="${this.#collapsed ? 'collapsed' : ''}">
        <legend>
          <button class="chainmail-form__collapse"><span class="chainmail-form__collapse__icon" style="vertical-align: ${this.#collapsed ? 'top' : 'middle'};">${collapseIcon}</span> Layer</button>
        </legend>
        <table>
          <tbody>
            ${
              layerList.map((l, index) => `
                <tr class="layer-table__layer ${this.#activeLayer === l.id ? 'layer-table__layer--active' : ''}" data-layer="${l.id}">
                  <td class="layer-table__visibility"><button title="show/hide">${l.hidden ? '&#x1F441' : '&#x1F441'}</button></td>
                  <td class="layer-table__name"><button>${l.name}</button></td>
                  <td class="layer-table__remove"><button ${isSingleLayer ? 'disabled' : ''}>&#10006;</button></td>
                </tr>
              `).join('')
            }
            <tr>
              <td id="layer-table__add-new" colspan="3">
                <button style="border-right: 0px; border-top: 1px solid #eeeeee; padding: 10px; text-align: center;">
                  &plus; Add New Layer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </fieldset>
    `;
  }
  
  
  get styles() {
    return `
      chainmail-layer-form > fieldset > table {
        border-collapse: collapse;
        color: #eeeeee;
        font-size: 14px;
        margin-top: .5em;
        width: 100%;
      }
      
      chainmail-layer-form > fieldset > table tr.layer-table__layer.layer-table__layer--active {
        background: #444444;
      }
      
      chainmail-layer-form > fieldset > table td,
      chainmail-layer-form > fieldset > table th {
        border-right: 1px solid #cccccc;
        height: 1.5em;
        padding: 0;
        text-align: left;
      }
      
      chainmail-layer-form > fieldset > table tbody td {
        border-top: 0px solid #cccccc;
        border-right: 0px solid #cccccc;
      }
      
      chainmail-form table .layer-table__visibility,
      chainmail-form table .layer-table__remove {
        border-left: 0px solid #cccccc;
        font-size: 22px;
        max-width: 14px;
        text-align: center;
      }
      
      
      chainmail-layer-form > fieldset > table tbody td:last-child  {
        border-top: 0px solid #cccccc;
        border-right: 0px solid #cccccc;
      }
      
      chainmail-layer-form > fieldset > table td:last-child,
      chainmail-layer-form > fieldset > table th:last-child {
        border-right: 0px;
      }
      
      chainmail-layer-form > fieldset > table td button {
        background: transparent;
        border: 0;
        color: inherit;
        height: 100%;
        width: 100%;
      }
    `;
  }
  
  get eventListeners() {
    return [{
      element: document.getElementById('layer-table__add-new'),
      event: 'click',
      handler: this.#onClickAddNew.bind(this)
    }, {
      elements: document.querySelectorAll('.layer-table__visibility > button'),
      event: 'click',
      handler: this.#onClickLayerVisibility.bind(this)
    }, {
      elements: document.querySelectorAll('.layer-table__name > button'),
      event: 'click',
      handler: this.#onClickLayerName.bind(this)
    }, {
      elements: document.querySelectorAll('.layer-table__remove > button'),
      event: 'click',
      handler: this.#onClickLayerRemove.bind(this)
    }, {
      element: this.querySelector('.chainmail-form__collapse'),
      event: 'click',
      handler: this.#onClickCollapse.bind(this)
    }];
  }
  
  #onClickAddNew(event) {
    const parser = new DOMParser();
    const newLayer = LayerLogic.AddNewLayer();
    
    document.querySelector('main').appendChild(
       parser.parseFromString(`
        <chainmail-sheet
          color="sandybrown"
          rows="15"
          columns="10"
          awg="18"
          inner-diameter="4"
          weave="European Four-In-One"
          layer="${newLayer.id}"
        ></chainmail-sheet>
      `, 'text/html').body.children[0]
    );
    
    this.#setActiveLayer(newLayer.id);
    this.renderTemplate();
  }
  
  #onClickLayerVisibility() {
    const layerId = this.#getEventLayer(event);
    const sheet = this.#getLayerSheet(layerId);
    const isHidden = sheet.getAttribute('hidden') === '';
    
    if(isHidden) {
      sheet.removeAttribute('hidden');
    } else {
      sheet.setAttribute('hidden', '');
    }
  }
  
  
  #onClickLayerName(event) {
    const newActiveLayer = this.#getEventLayer(event);
    this.#setActiveLayer(newActiveLayer);
    this.renderTemplate();
  }
  
  #onClickLayerRemove(event) {
    const layerId = this.#getEventLayer(event);
    this.#getLayerSheet(layerId).remove();
    LayerLogic.RemoveLayer(layerId);
    this.#resetActiveLayer();
    this.renderTemplate();
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
  
  #getEventLayer(event) {
    return parseInt(event.target.closest('tr').getAttribute('data-layer'));
  }
  
  #setActiveLayer(newActiveLayer) {
    if(newActiveLayer !== this.#activeLayer) {
      this.setAttribute(LayerFormComponent.attributeNames.activeLayer, newActiveLayer);
    }
  }
  
  #resetActiveLayer() {
    const newResetLayer = LayerLogic.GetLayerList()[0].id;
    this.setAttribute(LayerFormComponent.attributeNames.activeLayer, newResetLayer);
  }
  
  #getLayerSheet(layerId) {
    return document.querySelector(`chainmail-sheet[layer="${layerId}"]`);
  }
}
customElements.define(LayerFormComponent.tag, LayerFormComponent);