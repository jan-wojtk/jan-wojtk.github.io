class RingLogic {
    #parser = new DOMParser();
    
    GetRing() {
        return this.#getRing();
    }
    
    #getRing() {
        const template = this.#getTemplate();
        const ring = this.#parser.parseFromString(template, 'text/html').body.children[0];
        
        ring.onclick = RingLogic.#onClick;
        ring.oncontextmenu = RingLogic.#onContextMenu;
        
        return ring;
    }
    
    static #onClick(event) {
        var ringContainer = event.target.closest('.ring-container');
        ringContainer.style['border-color'] = RingLogic.#getColorPickerPreviewElement().value;
    }
    
    static #onContextMenu(event) {
        event.preventDefault();
        var ringContainer = event.target.closest('.ring-container');
        ringContainer.style['border-color'] = '';
    }
    
    #getTemplate() {
        // todo: apply default metal
        return `
            <div class="ring-container">
                <div class="ring-partial ring-partial_top"><div class="ring"></div></div>
                <div class="ring-partial ring-partial_middle"><div class="ring"></div></div>
                <div class="ring-partial ring-partial_bottom"><div class="ring"></div></div>
            </div>    
        `;
    }
    
    // avoid ciclical depedencies by directly accessing this form element here
    // todo: figure out how to avoid this
    static #getColorPickerPreviewElement() {
        return document.getElementById('color-picker_preview');
    }
}