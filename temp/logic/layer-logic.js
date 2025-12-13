class LayerLogic {
  static #layerList = [
    new Layer('Layer 1')
  ];
  
  static GetLayerList() {
    return LayerLogic.#layerList;
  }
  
  static AddNewLayer() {
    LayerLogic.#layerList.push(new Layer(`Layer ${LayerLogic.GetLayerList().length + 1}`));
  }
  
  static RemoveLayer(layerToRemove) {
    if(LayerLogic.GetLayerList().length === 0) {
      throw "No layers to remove";
    }
    
    const layerIndex = LayerLogic.#layerList.findIndex(l => l.name === layerToRemove.name);
    LayerLogic.#layerList.splice(layerIndex, 1);
  }
}
