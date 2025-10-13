// todo: consider making this non-static. maybe toss in some render methods.
class FormLogic {
    static #chainmailLogic = new ChainmailLogic();

    static RegisterEventListeners() {
        FormLogic.#getColorPickerSelectElement().onchange = FormLogic.#onChangeColorPickerSelect;
        FormLogic.#getAddRowElement().onclick = FormLogic.#onClickAddRow;
        FormLogic.#getAddColumnElement().onclick = FormLogic.#onClickAddColumn;
        FormLogic.#getClearElement().onclick = FormLogic.#onClickClear;
    }
    
    static #onChangeColorPickerSelect(event) {
        var newValue = _getColorPickerSelectElement().value;
        _getColorPickerPreviewElement().value = newValue;
    }
    
    static #onClickAddRow() {
        FormLogic.#chainmailLogic.AddRow();
    }

    static #onClickAddColumn() {
        FormLogic.#chainmailLogic.AddColumn();
    }
    
    static #onClickClear() {
        FormLogic.#chainmailLogic.Clear();
    }

    static #getColorPickerSelectElement() {
        return document.getElementById('color-picker_select');
    }

    static #getColorPickerPreviewElement() {
        return document.getElementById('color-picker_preview');
    }

    static #getAddRowElement() {
        return document.getElementById('add-row');
    }

    static #getAddColumnElement() {
        return document.getElementById('add-column');
    }
    
    static #getClearElement() {
        return document.getElementById('clear');
    }
}

/*
  form action wishlist:
    - click and drag to change metals as you hover
    - toggle corner rings (those ones with only one connection, stragglers)
    - zoom out
*/
