import type * as MapboxGL from 'mapbox-gl';
import {
  createRingsLayer,
  createRingLabelsLayer,
  createDispersionLinesLayer,
  createDirectionLineLayer,
} from './geometry';
import type MapStyleLayer from '../map/MapStyleLayer';
import type MapMarker from '../map/MapMarker';
import type { BehaviorData } from './StatisticalBehavior';

interface Layers {
  rings: MapStyleLayer | null;
  labels: MapStyleLayer | null;
  dispersionLines: MapStyleLayer | null;
  directionLine: MapStyleLayer | null;
}

export default class StatisticsVirtualLayer {
  map: MapboxGL.Map | null;
  layers: Layers;

  constructor() {
    this.map = null;
    this.layers = {
      rings: null,
      labels: null,
      dispersionLines: null,
      directionLine: null,
    };
  }
  addTo(map: MapboxGL.Map) {
    this.map = map;
  }
  clearRings() {
    if (!this.map) return null;
    if (this.layers.rings) {
      this.layers.rings.remove();
      this.layers.rings = null;
    }
    if (this.layers.labels) {
      this.layers.labels.remove();
      this.layers.labels = null;
    }
  }
  clearDispersion = () => {
    if (!this.map) return null;
    if (this.layers.dispersionLines) {
      this.layers.dispersionLines.remove();
      this.layers.dispersionLines = null;
    }
    if (this.layers.directionLine) {
      this.layers.directionLine.remove();
      this.layers.directionLine = null;
    }
  };
  drawRings = (ipp: MapMarker, behavior: BehaviorData) => {
    if (!this.map) return null;
    this.clearRings();
    this.layers.rings = createRingsLayer(ipp.getLngLat(), behavior);
    this.layers.labels = createRingLabelsLayer(ipp.getLngLat(), behavior);
    this.layers.rings.addTo(this.map);
    this.layers.labels.addTo(this.map);
  };
  drawDispersion(ipp: MapMarker, destination: MapMarker, behavior: BehaviorData) {
    if (!this.map) return null;
    this.clearDispersion();
    this.layers.dispersionLines = createDispersionLinesLayer(ipp.getLngLat(), destination.getLngLat(), behavior);
    this.layers.directionLine = createDirectionLineLayer(ipp.getLngLat(), destination.getLngLat());
    this.layers.dispersionLines.addTo(this.map);
    this.layers.directionLine.addTo(this.map);
  }
}
