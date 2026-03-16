class SheetState {
  static #sheetCount = 0;
  static #sheetList = [];
  static #activeSheet = SheetState.#sheetList[0];
  static #eventTarget = new EventTarget();
  
  static GetSheetList() {
    return SheetState.#sheetList;
  }
  
  static GetSheetById(id) {
    return SheetState.#sheetList.find(s => s.id == id);
  }
  
  static AddNewSheet(sheetConfig) {
    const newSheet = new Sheet(sheetConfig);
    newSheet.id = ++this.#sheetCount;
    SheetState.#sheetList.push(newSheet);
    
    SheetState.#eventTarget.dispatchEvent(new CustomEvent('sheet.add', { detail: newSheet }));
    SheetState.#eventTarget.dispatchEvent(new CustomEvent('sheet.add.complete', { detail: newSheet }));
    console.log('added sheet', newSheet);
    
    return newSheet;
  }
  
  static RemoveSheet(id) {
    const sheet = SheetState.GetSheetById(id);
    
    if(!sheet) {
      throw `Sheet (id: ${id}) not found. Sheet couldn't be removed.`;
    }
    
    const sheetIndex = SheetState.#sheetList.findIndex(s => s.id === sheet.id);
    SheetState.#sheetList.splice(sheetIndex, 1);
    
    SheetState.#eventTarget.dispatchEvent(new CustomEvent('sheet.remove', { detail: sheet }));
    SheetState.#eventTarget.dispatchEvent(new CustomEvent('sheet.remove.complete', { detail: sheet }));
    console.log('removed sheet', newSheet);
  }
  
  static addEventListener(eventType, handler) {
    SheetState.#eventTarget.addEventListener(eventType, handler);
  }
}