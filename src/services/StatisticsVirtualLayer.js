import StatisticsStyleLayerFactory from './StatisticsStyleLayerFactory';

export default class StatisticsVirtualLayer {
  constructor() {
    this.map = null;
    this.layers = {
      rings: null,
      labels: null,
      dispersionLines: null,
      directionLine: null
    }
    this.styleLayerFactory = new StatisticsStyleLayerFactory();
  }
  addTo(map) {
    this.map = map;
  }
  applyIPPMarkerListeners(ipp) {
    if(!this.map) return null;
    ipp.on('dragend', evt => {
      this.drawRings(ipp);
      this.drawDispersion(ipp);
    })
  }
  applyDestinationMarkerListeners(destination) {
    destination.on('dragend', evt => {
      this.drawRings(destination);
      this.drawDispersion(destination);
    })
  }
  handleBehaviorChange(behavior) {
    this.behavior = behavior;
  }
  clearRings() {
    if(!this.map) return null;
    if(this.layers.rings) {
      this.layers.rings.remove();
      this.layers.rings = null;
    }
    if(this.layers.labels) {
      this.layers.labels.remove();
      this.layers.labels = null;
    }
  }
  clearDispersion = () => {
    if(!this.map) return null;
    if(this.markers.dispersion) {
      this.markers.dispersion.remove();
      this.markers.dispersion = null;
    }
    if(this.layers.directionLine) {
      this.layers.directionLine.remove();
      this.layers.directionLine = null;
    }
  }
  drawRings = (ipp, behavior) => {
    if(!this.map) return null;
    this.clearRings();
    this.layers.rings = this.styleLayerFactory.createRingsLayer(ipp, behavior);
    this.layers.labels = this.styleLayerFactory.createLabelsLayer(ipp, behavior);
    this.layers.rings.addTo(this.map);
    this.layers.labels.addTo(this.map);
  }
  drawDispersion(ipp, destination, behavior) {
    if(!this.map) return null;
    this.clearDispersion();
    this.layers.dispersionLines = this.styleLayerFactory.createDispersionLinesLayer(ipp.getLngLat(), behavior);
    this.layers.directionLine = this.styleLayerFactory.createDirectionLineLayer(ipp, destination);
    this.layers.dispersionLines.addTo(this.map);
    this.layers.directionLine.addTo(this.map);
  }
}
