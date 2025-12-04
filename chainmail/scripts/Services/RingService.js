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
        
        ring.onmousedown = RingLogic.#onClick;
        ring.oncontextmenu = RingLogic.#onContextMenu;
        ring.onmouseover = RingLogic.#onMouseOver;
        
        return ring;
    }
    
    static #onClick(event) {
        event.preventDefault();
        var ringContainer = event.target.closest('.ring-container');
        ringContainer.style['border-color'] = RingLogic.#selectorLogic.GetColorPickerPreviewElement().value;
    }
    
    static #onContextMenu(event) {
        event.preventDefault();
        var ringContainer = event.target.closest('.ring-container');
        ringContainer.style['border-color'] = '';
    }
    
    static #onMouseOver(event) {
        event.preventDefault();
        var ringContainer = event.target.closest('.ring-container');

        if(event.buttons === 1) {            
            ringContainer.style['border-color'] = RingLogic.#selectorLogic.GetColorPickerPreviewElement().value;
        }
        
        if(event.buttons === 2) {
            ringContainer.style['border-color'] = '';
        }
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