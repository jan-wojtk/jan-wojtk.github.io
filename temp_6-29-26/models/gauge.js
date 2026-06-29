class Gauge  {
  constructor(awg, millimeters) {
    this.awg = awg;
    this.millimeters = millimeters;
    
    this.awgGauge = this.awg + 'g';
    this.mm = this.millimeters + 'mm';
  }
}
