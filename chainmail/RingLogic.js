class RingLogic {
    #parser = new DOMParser();
    
    GetRing() {
        return this.#getRing();
    }
    
    #getRing() {
        const template = this.#getTemplate();
        const ring = this.#parser.parseFromString(template, 'text/html').body.children[0];
        
        ring.onclick = this.#onClick;
        ring.oncontextmenu = this.#onContextMenu;
        
        return ring;
    }
    
    #onClick(event) {
        var ringContainer = event.target.closest('.ring-container');
        ringContainer.style['border-color'] = _getColorPickerSelectElement().value;
    }
    
    #onContextMenu(event) {
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