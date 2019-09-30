import {
  createRingsLayer,
  createRingLabelsLayer,
  createDispersionLinesLayer,
  createDirectionLineLayer
} from './statisticsStyleLayers';

export default class StatisticsVirtualLayer {
  constructor() {
    this.map = null;
    this.layers = {
      rings: null,
      labels: null,
      dispersionLines: null,
      directionLine: null
    }
    this.behavior = null;
    this.ipp = null;
    this.destination = null;
  }
  addTo(map) {
    this.map = map;
  }
  applyIPPMarkerListeners(ipp) {
    if(!this.map) return null;
    ipp.on('dragend', evt => {
      this.drawRings();
      this.drawDispersion();
    })
    this.ipp = ipp;
  }
  applyDestinationMarkerListeners(destination) {
    destination.on('dragend', evt => {
      this.drawRings();
      this.drawDispersion();
    })
    this.destination = destination;
  }
  setBehavior(behavior) {
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
    if(this.layers.dispersionLines) {
      this.layers.dispersionLines.remove();
      this.layers.dispersionLines = null;
    }
    if(this.layers.directionLine) {
      this.layers.directionLine.remove();
      this.layers.directionLine = null;
    }
  }
  drawRings = () => {
    if(!this.map) return null;
    if(!this.ipp) return null;
    this.clearRings();
    this.layers.rings = createRingsLayer(this.ipp, this.behavior);
    this.layers.labels = createRingLabelsLayer(this.ipp, this.behavior);
    this.layers.rings.addTo(this.map);
    this.layers.labels.addTo(this.map);
  }
  drawDispersion() {
    if(!this.map) return null;
    this.clearDispersion();
    this.layers.dispersionLines = createDispersionLinesLayer(this.ipp.getLngLat(), this.behavior);
    this.layers.directionLine = createDirectionLineLayer(this.ipp, this.destination);
    this.layers.dispersionLines.addTo(this.map);
    this.layers.directionLine.addTo(this.map);
  }
}
