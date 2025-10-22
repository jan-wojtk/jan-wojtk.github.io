// todo: consider making this non-static. maybe toss in some render methods.
class FormLogic {
    static #selectorLogic = new SelectorLogic();
    static #chainmailLogic = new ChainmailLogic();

    static RegisterEventListeners() {
        FormLogic.#selectorLogic.GetColorPickerSelectElement().onchange = FormLogic.#onChangeColorPickerSelect;
        FormLogic.#selectorLogic.GetAddRowElement().onclick = FormLogic.#onClickAddRow;
        FormLogic.#selectorLogic.GetRemoveRowElement().onclick = FormLogic.#onClickRemoveRow;
        FormLogic.#selectorLogic.GetAddColumnElement().onclick = FormLogic.#onClickAddColumn;
        FormLogic.#selectorLogic.GetRemoveColumnElement().onclick = FormLogic.#onClickRemoveColumn;
        FormLogic.#selectorLogic.GetResetAllRingMetals().onclick = FormLogic.#onClickResetAllMetals;
        FormLogic.#selectorLogic.GetClearElement().onclick = FormLogic.#onClickClear;
        FormLogic.#selectorLogic.GetExplodeOutlineOffsetElement().onclick = FormLogic.#onClickExplodeOutlineOffset;
    }
    
    static #onChangeColorPickerSelect(event) {
        var newValue = FormLogic.#selectorLogic.GetColorPickerSelectElement().value;
        FormLogic.#selectorLogic.GetColorPickerPreviewElement().value = newValue;
    }
    
    static #onClickResetAllMetals() {
        FormLogic.#chainmailLogic.ResetAllRingMetals();
    }
    
    static #onClickAddRow() {
        FormLogic.#chainmailLogic.AddRow();
    }

    static #onClickAddColumn() {
        FormLogic.#chainmailLogic.AddColumn();
    }
    
    static #onClickRemoveRow() {
        FormLogic.#chainmailLogic.RemoveRow();
    }

    static #onClickRemoveColumn() {
        FormLogic.#chainmailLogic.RemoveColumn();
    }
    
    static #onClickClear() {
        FormLogic.#chainmailLogic.Clear();
    }
    
    static #onClickExplodeOutlineOffset() {
        FormLogic.#selectorLogic.GetChainmailContainerElement().classList.add('explode-outline-offset');
        
        setTimeout(() => {
            FormLogic.#selectorLogic.GetChainmailContainerElement().classList.remove('explode-outline-offset');
        }, 5000);
    }
}

/*
  form action wishlist:
    - click and drag to change metals as you hover
    - toggle corner rings (those ones with only one connection, stragglers)
    - zoom out
    - history
    - full spectrum color picker, with "recent colors" list
*/
