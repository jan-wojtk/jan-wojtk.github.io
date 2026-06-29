class ChainmailLogic {
    #selectorLogic = new SelectorLogic();
    #ringLogic = new RingLogic();
    #parser = new DOMParser();
    
    AddRow() {
        this.#addRow();
    }
    
    AddColumn() {
        this.#addColumn();
    }
    
    RemoveRow() {
        this.#removeRow();
    }
    
    RemoveColumn() {
        this.#removeColumn();
    }
    
    ResetAllRingMetals() {
        var rings = this.#selectorLogic.GetRingContainerElements();
        rings.forEach(ring => this.#ringLogic.ResetRingMetal(ring));
    }
    
    Clear() {
        this.#clear();
    }
    
    #addColumn() {
        var rows = this.#selectorLogic.GetChainmailRowElements();
        var rowCount = rows.length;
        
        if(rowCount === 0 || rowCount === 1) {
            this.#appendRowToChainmail(1);
        }
        
        if(rowCount >= 2) {
            // todo: address assumption that this condition will always pick the right rows
            // or maybe just make it more readable
            var isRowRingCountEqual = rows[0].children.length === rows[1].children.length;
            var targetRows = [];
            
            // if odd and even rows have the same ring count, it's even's turn
            // todo: make a #get* convenience method out of this (even / odd)
            if(!isRowRingCountEqual) {
                targetRows = [...rows].filter((row, index) => !!(index % 2));
            }
            
            if(isRowRingCountEqual) {
                targetRows = [...rows].filter((row, index) => !(index % 2));
            }
            
            targetRows.forEach((row) => row.appendChild(this.#ringLogic.GetRing()));
        }
    }

    #addRow() {
        var rows = this.#selectorLogic.GetChainmailRowElements();
        var rowCount = rows.length;
        
        if(rowCount === 0) {
            this.#appendRowToChainmail(1);
        }
        
        if(rowCount === 1) {
            var previousRingCount = rows[0].children.length;
            
            if(previousRingCount === 1) {
                this.#appendRowToChainmail(1);
            }
            
            if(previousRingCount >= 2) {
                this.#appendRowToChainmail(previousRingCount-1);
            }
        }
        
        if(rowCount >= 2) {
            var newRowRingCount = rows[rowCount-2].children.length;
            this.#appendRowToChainmail(newRowRingCount);
        }
    }
    
    #removeRow() {
        var rows = this.#selectorLogic.GetChainmailRowElements();
        
        // only do this if there are 3 or more rows - to avoid a weird state
        if(rows.length >= 3) {
            var lastRow = [...rows].at(-1);
            lastRow.remove();
        }
    }
    
    #removeColumn() {
        var rows = this.#selectorLogic.GetChainmailRowElements();
        
        // only do this if there are 3 or more columns - to avoid a weird state
        const maxColumnCount = rows.length >= 2 ? Math.max(rows[0].children.length, rows[1].children.length) : 0;
        if(maxColumnCount >= 2) {        
            var isRowRingCountEqual = rows[0].children.length === rows[1].children.length;
            var targetRows = [];
            
            // if odd and even rows have the same ring count, it's even's turn
            // todo: make a #get* convenience method out of this (even / odd)
            if(isRowRingCountEqual) {
                targetRows = [...rows].filter((row, index) => !!(index % 2));
            }
            
            if(!isRowRingCountEqual) {
                targetRows = [...rows].filter((row, index) => !(index % 2));
            }
            
            // todo: when a row is empty, remove the row
            targetRows.forEach((row) => [...row.children].at(-1).remove());
        }
    }
    
    #appendRowToChainmail(ringCount = 1) {
        const row = this.#getRow();
        
        for(var i = 0; i < ringCount; i++) {
            row.appendChild(this.#ringLogic.GetRing());
        }
        
        this.#selectorLogic.GetChainmailContainerElement().appendChild(row);
    }
    
    #getRow() {
        const template = this.#getRowTemplate();
        
        return this.#parser.parseFromString(template, 'text/html').body.children[0];
    }
    
    #getRowTemplate(ringCount = 1) {
        return `
            <div class="row"></div>
        `;
    }
    
    #clear() {
        const container = this.#selectorLogic.GetChainmailContainerElement();
        
        // google told me this makes sense and i believe it
        while (container.lastChild) {
          container.removeChild(container.lastChild);
        }
    }
}
