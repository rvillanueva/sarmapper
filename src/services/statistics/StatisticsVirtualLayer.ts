import {
  createRingLabelsLayer,
  createDirectionLineLayer,
  createHeatmapLayer,
} from './geometry';

export default class StatisticsVirtualLayer {
  constructor() {
    this.map = null;
    this.layers = {
      heatmap: null,
      labels: null,
      directionLine: null,
    };
    this.ipp = null;
    this.destination = null;
    this.behavior = null;
  }
  addTo(map) {
    this.map = map;
  }
  _removeLayer(key) {
    if (this.layers[key]) {
      this.layers[key].remove();
      this.layers[key] = null;
    }
  }
  _render() {
    if (!this.map) return;
    this._removeLayer('heatmap');
    this._removeLayer('directionLine');
    this._removeLayer('labels');

    if (!this.ipp || !this.behavior) return;

    const ippLngLat = this.ipp.getLngLat();
    const destLngLat = this.destination ? this.destination.getLngLat() : null;

    this.layers.heatmap = createHeatmapLayer(ippLngLat, destLngLat, this.behavior);
    this.layers.heatmap.addTo(this.map);

    if (destLngLat) {
      this.layers.directionLine = createDirectionLineLayer(ippLngLat, destLngLat);
      this.layers.directionLine.addTo(this.map);
    }

    this.layers.labels = createRingLabelsLayer(ippLngLat, this.behavior);
    this.layers.labels.addTo(this.map);
  }
  clearRings = () => {
    this.ipp = null;
    this.behavior = null;
    this._render();
  };
  clearDispersion = () => {
    this.destination = null;
    this._render();
  };
  drawRings = (ipp, behavior) => {
    this.ipp = ipp;
    this.behavior = behavior;
    this._render();
  };
  drawDispersion(ipp, destination, behavior) {
    this.ipp = ipp;
    this.destination = destination;
    this.behavior = behavior;
    this._render();
  }
}
