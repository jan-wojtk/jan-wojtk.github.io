class Ring {
  constructor(innerDiameter, awg) {
    this.innerDiameter = innerDiameter;
    this.gauge = GaugeLogic.GetGaugeByAwg(awg);
    
    this.innerDiameterMm = innerDiameter + 'mm';
    this.aspectRatio = (this.innerDiameter / this.gauge.millimeters).toFixed(2);
  }
}
