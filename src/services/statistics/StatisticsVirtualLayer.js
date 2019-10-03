import {
  createRingsLayer,
  createRingLabelsLayer,
  createDispersionLinesLayer,
  createDirectionLineLayer
} from './geometry';

export default class StatisticsVirtualLayer {
  constructor() {
    this.map = null;
    this.layers = {
      rings: null,
      labels: null,
      dispersionLines: null,
      directionLine: null
    }
  }
  addTo(map) {
    this.map = map;
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
    if(this.layers.dispersionLines) {
      this.layers.dispersionLines.remove();
      this.layers.dispersionLines = null;
    }
    if(this.layers.directionLine) {
      this.layers.directionLine.remove();
      this.layers.directionLine = null;
    }
  }
  drawRings = (ipp, behavior) => {
    if(!this.map) return null;
    this.clearRings();
    this.layers.rings = createRingsLayer(ipp.getLngLat(), behavior);
    this.layers.labels = createRingLabelsLayer(ipp.getLngLat(), behavior);
    this.layers.rings.addTo(this.map);
    this.layers.labels.addTo(this.map);
  }
  drawDispersion(ipp, destination, behavior) {
    if(!this.map) return null;
    this.clearDispersion();
    this.layers.dispersionLines = createDispersionLinesLayer(ipp.getLngLat(), destination.getLngLat(), behavior);
    this.layers.directionLine = createDirectionLineLayer(ipp.getLngLat(), destination.getLngLat());
    this.layers.dispersionLines.addTo(this.map);
    this.layers.directionLine.addTo(this.map);
  }
}
