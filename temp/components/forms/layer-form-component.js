class LayerFormComponent extends BaseComponent {
  static tag = 'chainmail-layer-form';
  static attributeNames = { activeLayer: 'active-layer' };
  static observedAttributes = Object.values(LayerFormComponent.attributeNames);
  
  get #layerList() { return this.querySelectorAll('tr.layer-table__layer'); }
  get #activeLayer() { return parseInt(this.getAttribute(LayerFormComponent.attributeNames.activeLayer)) }
  
  get template() {
    const layerList = LayerLogic.GetLayerList();
    
    return `
      <fieldset>
        <legend>Layer</legend>
        <table>
          <tbody>
            ${
              layerList.map((l, index) => `
                <tr class="layer-table__layer ${this.#activeLayer === (index + 1) ? 'layer-table__layer--active' : ''}" data-layer="${index + 1}">
                  <td class="layer-table__visibility">${l.hidden ? 'hidden' : '&#x1F441'}</td>
                  <td class="layer-table__name">${l.name}</td>
                  <td class="layer-table__remove">&#10006;</td>
                </tr>
              `).join('')
            }
            <tr>
              <td id="layer-table__add-new" colspan="3" style="border-right: 0px; border-top: 1px solid #eeeeee; padding: 10px; text-align: center;">&plus; Add New Layer</td>
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
        width: 100%;
      }
      
      chainmail-layer-form > fieldset > table tr.layer-table__layer {
        cursor: pointer;
      }
      
      chainmail-layer-form > fieldset > table tr.layer-table__layer.layer-table__layer--active {
        background: #444444;
      }
      
      chainmail-layer-form > fieldset tbody tr:hover {
        background: #3a3a3a;
        cursor: pointer;
      }
      
      chainmail-layer-form > fieldset > table td,
      chainmail-layer-form > fieldset > table th {
        border-right: 1px solid #cccccc;
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
        padding-bottom: 4px; /* todo: figure out how to align vertically */
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
    `;
  }
  
  get eventListeners() {
    return [{
      element: document.getElementById('layer-table__add-new'),
      event: 'click',
      handler: this.#onClickAddNew.bind(this)
    }, {
      elements: document.querySelectorAll('.layer-table__layer'),
      event: 'click',
      handler: this.#onClickLayer.bind(this)
    }];
  }
  
  #onClickAddNew(event) {
    const parser = new DOMParser();
    document.querySelector('main').appendChild(
       parser.parseFromString(`
        <chainmail-sheet
          color="sandybrown"
          rows="15"
          columns="10"
          awg="18"
          inner-diameter="4"
          weave="European Four-In-One"
          layer="${LayerLogic.GetLayerList().length + 1}"
        ></chainmail-sheet>
      `, 'text/html').body.children[0]
    );
    
    LayerLogic.AddNewLayer();
    this.#setActiveLayer(LayerLogic.GetLayerList().length);
    this.renderTemplate();
  }
  
  #onClickLayer(event) {
    const newActiveLayer = parseInt(event.target.closest('tr').getAttribute('data-layer'));
    this.#setActiveLayer(newActiveLayer);
    this.renderTemplate();
  }
  
  #setActiveLayer(newActiveLayer) {
    if(parseInt(newActiveLayer) !== this.#activeLayer) {
      this.setAttribute(LayerFormComponent.attributeNames.activeLayer, newActiveLayer);
    }
  }
}
customElements.define(LayerFormComponent.tag, LayerFormComponent);