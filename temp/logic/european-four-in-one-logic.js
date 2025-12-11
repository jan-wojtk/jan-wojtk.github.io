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
    new Ring(4, 17),
    new Ring(4, 16),
    //new Ring(4, 15),
    
    new Ring(6, 20),
    new Ring(6, 19),
    new Ring(6, 18),
    new Ring(6, 17),
    new Ring(6, 16),
    new Ring(6, 15),
    new Ring(6, 14),
    new Ring(6, 13),
    new Ring(6, 12),
    
    new Ring(7, 20),
    new Ring(7, 19),
    new Ring(7, 18),
    new Ring(7, 17),
    new Ring(7, 16),
    new Ring(7, 15),
    new Ring(7, 14),
    new Ring(7, 13),
    new Ring(7, 12),
    new Ring(7, 11),
    //new Ring(7, 10),
    
    new Ring(8, 20),
    new Ring(8, 19),
    new Ring(8, 18),
    new Ring(8, 17),
    new Ring(8, 16),
    new Ring(8, 15),
    new Ring(8, 14),
    new Ring(8, 13),
    new Ring(8, 12),
    new Ring(8, 11),
    new Ring(8, 10),
    new Ring(8, 9),
  ];
}