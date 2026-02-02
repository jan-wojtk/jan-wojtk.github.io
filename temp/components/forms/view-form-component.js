class ViewFormComponent extends BaseComponent {
  static tag = 'chainmail-view-form';
  static attributeNames = { collapsed: 'collapsed' };
  static observedAttributes = Object.values(LayerFormComponent.attributeNames);
  
  get #collapsed() { return this.getAttribute(LayerFormComponent.attributeNames.collapsed) === 'true' }
  
  get styles() {
    return `
      #chainmail-form__zoom {
          margin: 0;
      }
      
      #chainmail-form__zoom-datalist {
        display:flex;
        font-size: .9em;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        writing-mode: vertical-lr;
      }
      
      #chainmail-form__zoom-datalist option {
        padding: 0;
      }
      
      .dark-mode #chainmail-form__zoom-datalist {
        color: white;
      }
      
      #chainmail-form__dark-mode, #chainmail-form__stat-overlay {
        margin-left: 0;
      }
    `;
  }
  
  get template() {
    const collapseIcon = this.#collapsed ? '&#x25B6;' : '&#x25BC;';
    
    return `
      <fieldset class="${this.#collapsed ? 'collapsed' : ''}">
        <legend>
          <button class="chainmail-form__collapse"><span class="chainmail-form__collapse__icon" style="vertical-align: ${this.#collapsed ? 'top' : 'middle'};">${collapseIcon}</span> View</button>
        </legend>
        
        <label for="chainmail-form__zoom">Zoom</label>
        <input
          id="chainmail-form__zoom"
          list="chainmail-form__zoom-datalist"
          type="range"
          min="50"
          max="300"
          step="5"
          value="200"
        />
        <datalist id="chainmail-form__zoom-datalist">
          <option value="50" label="50"></option>
          <option value="100" label="100"></option>
          <option value="150" label="150"></option>
          <option value="200" label="200"></option>
          <option value="250" label="250"></option>
          <option value="300" label="300"></option>
        </datalist>
        
        <label><input id="chainmail-form__dark-mode" type="checkbox" checked />Dark Mode</label>
        <label><input id="chainmail-form__stat-overlay" type="checkbox" checked />Stat Overlay</label>
      </fieldset>
    `;
  }
  
  get eventListeners() {
    return [{
      element: document.getElementById('chainmail-form__zoom'),
      event: 'change',
      handler: this.#setZoom.bind(this)
    }, {
      element: document.getElementById('chainmail-form__dark-mode'),
      event: 'change',
      handler: this.#setDarkMode.bind(this)
    }, {
      element: this.querySelector('.chainmail-form__collapse'),
      event: 'click',
      handler: this.#onClickCollapse.bind(this)
    }, {
      element: document.getElementById('chainmail-form__stat-overlay'),
      event: 'click',
      handler: this.#setStatOverlay.bind(this)
    }];
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
  
  #setZoom(event) {
    const newValue = event.target.value;
    document.querySelector('main').style.zoom = parseInt(newValue)/100;
  }
  
  #setDarkMode(event) {
    if(event.target.checked) document.body.classList.add('dark-mode');
    if(!event.target.checked) document.body.classList.remove('dark-mode');
  }
  
  #setStatOverlay(event) {
    const statOverlay = document.getElementById('stat-overlay');
    if(event.target.checked) statOverlay.removeAttribute('hidden');
    if(!event.target.checked) statOverlay.setAttribute('hidden', '');
  }
  
  #getZoom() {
    return parseInt(parseFloat(document.querySelector('main').style.zoom) * 100);
  }
}
customElements.define(ViewFormComponent.tag, ViewFormComponent);
