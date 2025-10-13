class ChainmailLogic {
    #ringLogic = new RingLogic();
    #parser = new DOMParser();
    
    AddRow() {
        this.#addRow();
    }
    
    AddColumn() {
        this.#addColumn();
    }
    
    Clear() {
        this.#clear();
    }
    
    #addColumn() {
        var rows = this.#getChainmailRowElements();
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
        var rows = this.#getChainmailRowElements();
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
    
    #appendRowToChainmail(ringCount = 1) {
        const row = this.#getRow();
        
        for(var i = 0; i < ringCount; i++) {
            row.appendChild(this.#ringLogic.GetRing());
        }
        
        this.#getChainmailContainerElement().appendChild(row);
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
        const container = this.#getChainmailContainerElement();
        
        // google told me this makes sense and i believe it
        while (container.lastChild) {
          container.removeChild(container.lastChild);
        }
    }
    
    // todo: make constants out of selector strings
    #getRingContainerElements() {
        return document.querySelectorAll('.ring-container');
    }

    #getChainmailRowElements() {
        return document.querySelectorAll('.row');
    }

    #getChainmailContainerElement() {
        return document.getElementById('chainmail-container');
    }
}
