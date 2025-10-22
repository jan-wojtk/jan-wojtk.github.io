class SelectorLogic {
    // FORM SELECTORS
    GetColorPickerSelectElement() {
        return document.getElementById('color-picker_select');
    }

    GetColorPickerPreviewElement() {
        return document.getElementById('color-picker_preview');
    }
    
    GetResetAllRingMetals() {
        return document.getElementById('reset-all-metals');
    }

    GetAddRowElement() {
        return document.getElementById('add-row');
    }

    GetAddColumnElement() {
        return document.getElementById('add-column');
    }
    
    GetRemoveRowElement() {
        return document.getElementById('remove-row');
    }

    GetRemoveColumnElement() {
        return document.getElementById('remove-column');
    }
    
    GetClearElement() {
        return document.getElementById('clear');
    }
    
    GetExplodeOutlineOffsetElement() {
        return document.getElementById('explode-outline-offset');
    }
    
    // CHAINMAIL SELECTORS
    GetChainmailContainerElement() {
        return document.getElementById('chainmail-container');
    }

    GetChainmailRowElements() {
        return document.querySelectorAll('.row');
    }
    
    GetRingContainerElements() {
        return document.querySelectorAll('.ring-container');
    }
}