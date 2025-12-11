class Weave {
  constructor(name) {
    this.name = name;
  }
}

class WeaveLogic {
  static #europeanFourInOneName = 'European Four-In-One';
  static #europeanSixInOneName = 'European Six-In-One';
  
  static GetWeaves() {
    return [
      new Weave(WeaveLogic.#europeanFourInOneName),
      new Weave(WeaveLogic.#europeanSixInOneName)
    ];
  }
  
  static IsEuropeanFourInOne(weaveName) {
    return weaveName === WeaveLogic.#europeanFourInOneName;
  }
  
  static IsEuropeanSixInOne(weaveName) {
    return weaveName === WeaveLogic.#europeanSixInOneName;
  }
}
