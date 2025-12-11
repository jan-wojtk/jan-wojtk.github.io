class EuropeanFourInOneLogic {
  constructor(innerDiameter, awg) {
    this.RingType = new Ring(innerDiameter, awg);
  }
  
  static IsValidRingType(innerDiameter, awg) {
    return EuropeanFourInOneLogic.#validRingTypes.find(validRing => {
      return validRing.gauge.awg === awg
          && validRing.innerDiameter === innerDiameter;
    });
  }
  
  static #validRingTypes = [
    new Ring(4, 20),
    new Ring(4, 19),
    new Ring(4, 18),
  ];
}