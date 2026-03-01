class BaseComponent extends HTMLElement {
  
  // ✅ a name to be used as prefixes
  // ✅ a template to be rendered
  // ✅ a stylesheet to be rendered
  // attributes
  // attributes that trigger style rerender
  // attributes that trigger template rerenders
  // attributes that should be used for render cacheing
  connectedCallback() {
    this.renderStyles();
    this.renderTemplate();
  }
  
  get template() {
    // console.log('"get template()" not defined by component.');
    return ``;
  }
  
  get styles() {
    // console.log('"get styles()" not defined by component.');
    return ``;
  }
  
  get eventListeners() {
    // console.log('"get eventListeners()" not defined by component.');
    return [];
  }
  
  get #stylesId() {
    return `${this.constructor.tag}-styles`;
  }
  
  renderStyles() {
    const parser = new DOMParser();
    const existingStyles = document.getElementById(this.#stylesId);
    const newStyles = parser.parseFromString(
      `<style id="${this.#stylesId}">
        ${this.styles}
      </style>`
    , 'text/html').head.children[0];
    
    if(existingStyles) {
      existingStyles.replaceChild(newStyles);
    } else {
      document.head.appendChild(newStyles);
    }
  }
  
  renderTemplate() {
    const parser = new DOMParser();
    const newTemplateList = parser.parseFromString(this.template, 'text/html').body.children;
    
    this.replaceChildren(...newTemplateList);
    this.registerEventListeners();
  }
  
  registerEventListeners() {
    this.eventListeners.forEach(ev => {
      if(ev.element)
        ev.element.addEventListener(ev.event, ev.handler);
      if(ev.elements?.length > 0) // Notably, don't use Array.isArray here because NodeList isn't an array
        ev.elements.forEach(el => el.addEventListener(ev.event, ev.handler));
    });
  }
}
