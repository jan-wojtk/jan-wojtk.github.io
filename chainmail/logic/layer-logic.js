class LayerLogic {
  static #layerCount = 0;
  
  static #layerList = [
    new Layer(++this.#layerCount)
  ];
  
  static GetLayerList() {
    return LayerLogic.#layerList;
  }
  
  static GetLayerById(layerId) {
    return LayerLogic.#layerList.find(x => x.id == layerId);
  }
  
  static AddNewLayer() {
    const newLayer = new Layer(++this.#layerCount);
    LayerLogic.#layerList.push(newLayer);
    return newLayer;
  }
  
  static RemoveLayer(layerToRemove) {
    if(LayerLogic.GetLayerList().length === 0) {
      throw "No layers to remove";
    }
    
    const layerIndex = LayerLogic.#layerList.findIndex(l => l.id === layerToRemove);
    LayerLogic.#layerList.splice(layerIndex, 1);
  }
  
  static SetLayerHidden(layerId, isHidden) {
    LayerLogic.GetLayerById(layerId).hidden = isHidden;
  }
}
