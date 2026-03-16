class Sheet {
  constructor(sheetConfig) {
    // todo: consider throwing if certain required fields are excluded
    this.id = sheetConfig.id ?? -1;
    this.weave = sheetConfig.weave ?? "European Four-In-One";
    this.awg = sheetConfig.awg ?? 18;
    this.innerDiameter = sheetConfig.innerDiameter ?? 4;
    this.columns = sheetConfig.columns ?? 21;
    this.rows = sheetConfig.rows ?? 11;
    this.color = sheetConfig.color ?? "#f4a460";
    this.hidden = sheetConfig.hidden ?? false;
  }
}
