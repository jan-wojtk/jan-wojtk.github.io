class WeaveLogic {
  static #weaves = {
    EuropeanFourInOne: new Weave('European Four-In-One'),
    EuropeanSixInOne: new Weave('European Six-In-One'),
  }
  
  static GetWeaves() {
    return Object.values(WeaveLogic.#weaves);
  }
  
  static GetWeaveByName(name) {
    return Object.values(WeaveLogic.Weaves).find(x => x.name === name)
  }
  
  static IsEqual(weaveOne, weaveTwo) {
    return weaveOne?.name === weaveTwo?.name;
  }
  
  static IsEuropeanFourInOne(weaveName) {
    return weaveName === WeaveLogic.#weaves.EuropeanFourInOne.name;
  }
  
  static IsEuropeanSixInOne(weaveName) {
    return weaveName === WeaveLogic.#weaves.EuropeanSixInOne.name;
  }
}
