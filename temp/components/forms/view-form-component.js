class ViewFormComponent extends BaseComponent {
  static tag = 'chainmail-view-form';
  
  get template() {
    return `
      <fieldset>
        <legend>View</legend>
        
        <label for="chainmail-form__zoom">Zoom</label>
        <input
          id="chainmail-form__zoom"
          type="number"
          min="50"
          max="300"
          step="10"
          value="${this.#getZoom()}"
        />
        
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
