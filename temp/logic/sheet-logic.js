class SheetLogic {
  static GetSheetList() {
    return SheetState.GetSheetList();
  }
  
  static GetSheetById(id) {
    return SheetState.GetSheetById(id);
  }
  
  static AddNewSheet() {
    const sheetList = SheetState.GetSheetList();
    const sheetCount = sheetList.length;
    
    const color = ['#ffff19', '#cccccc', '#daa520', '#f4a460', '#ffd700', '#f5f5f5', '#f1a886'][(sheetList.length - 1) % 7];
    const rows = (3 * sheetCount) + 11;
    const columns = (3 * sheetCount) + 21;
    
    return SheetState.AddNewSheet({
      color,
      rows,
      columns,
      awg: 18,
      innerDiameter: 4,
      weave: 'European Four-In-One'
    });
  }
  
  static RemoveSheet(id) {
    SheetState.RemoveSheet(id);
  }
}
