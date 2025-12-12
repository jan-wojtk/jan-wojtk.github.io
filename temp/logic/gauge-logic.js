class GaugeLogic {
  static #gauges = [
    new Gauge(9, 2.91),
    new Gauge(10, 2.59),
    new Gauge(11, 2.31),
    new Gauge(12, 2.05),
    new Gauge(13, 1.83),
    new Gauge(14, 1.63),
    new Gauge(15, 1.45),
    new Gauge(16, 1.29),
    new Gauge(17, 1.15),
    new Gauge(18, 1.02),
    new Gauge(19, 0.912),
    new Gauge(20, 0.812),
  ];
  
  static GetGauges() {
    return GaugeLogic.#gauges;
  }
  
  static GetGaugeByAwg(awg) {
    return GaugeLogic.#gauges.find(x => x.awg === awg); 
  }
}