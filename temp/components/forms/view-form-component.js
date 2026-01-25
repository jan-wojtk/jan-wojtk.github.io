class ViewFormComponent extends BaseComponent {
  static tag = 'chainmail-view-form';
  
  get styles() {
    return `
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
    `;
  }
  
  get template() {
    return `
      <fieldset>
        <legend>View</legend>
        
        <label for="chainmail-form__zoom">Zoom</label>
        <input
          id="chainmail-form__zoom"
          list="chainmail-form__zoom-datalist"
          type="range"
          min="50"
          max="300"
          step="25"
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
        
        <label><input id="chainmail-form__dark-mode" type="checkbox" checked/>Dark Mode</label>
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
    }];
  }
  
  #setZoom(event) {
    const newValue = event.target.value;
    document.querySelector('main').style.zoom = parseInt(newValue)/100;
  }
  
  #setDarkMode(event) {
    if(event.target.checked) document.body.classList.add('dark-mode');
    if(!event.target.checked) document.body.classList.remove('dark-mode');
  }
  
  #getZoom() {
    return parseInt(parseFloat(document.querySelector('main').style.zoom) * 100);
  }
}
customElements.define(ViewFormComponent.tag, ViewFormComponent);
