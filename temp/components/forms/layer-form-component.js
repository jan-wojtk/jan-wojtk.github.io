class LayerFormComponent extends BaseComponent {
  static tag = 'chainmail-layer-form';
  
  #activeLayer = 1;
  
  #getActiveSheet() {
    return document.querySelector(`chainmail-sheet.chainmail-sheet--active`);
  }
  
  get template() {
    const layerList = LayerLogic.GetLayerList();
    
    return `
      <fieldset>
        <legend>Layer</legend>
        <table>
          <tbody>
            ${
              layerList.map(l => `
                <tr class="layer-table__layer">
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
  
  get eventListeners() {
    return [{
      element: document.getElementById('layer-table__add-new'),
      event: 'click',
      handler: console.log
    }, {
      elements: document.querySelectorAll('.layer-table__layer'),
      event: 'click',
      handler: console.log
    }];
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
        background: #444444;
        cursor: pointer;
      }
      
      chainmail-layer-form > fieldset #layer-table__add-new:hover {
        background: #444444;
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
}
customElements.define(LayerFormComponent.tag, LayerFormComponent);