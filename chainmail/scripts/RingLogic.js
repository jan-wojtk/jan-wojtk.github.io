class RingLogic {
    static #selectorLogic = new SelectorLogic();
    #parser = new DOMParser();
    
    GetRing() {
        return this.#getRing();
    }
    
    ResetRingMetal(ring) {
        ring.style['border-color'] = '';
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
        ringContainer.style['border-color'] = RingLogic.#selectorLogic.GetColorPickerPreviewElement().value;
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
}