class FormComponent extends BaseComponent {
  static tag = "chainmail-form";
  
  get styles() {
    return `
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
        margin-bottom: .5em;
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
    `;
  }
  
  get template() {
    return `
      <chainmail-layer-form></chainmail-layer-form>
      <chainmail-sheet-form></chainmail-sheet-form>
      <chainmail-ring-form></chainmail-ring-form>
      <chainmail-view-form></chainmail-view-form>
    `;
  }
}
customElements.define(FormComponent.tag, FormComponent);
