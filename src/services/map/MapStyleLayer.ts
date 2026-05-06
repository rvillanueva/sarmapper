import { v4 as UUIDV4 } from 'uuid';
import type * as MapboxGL from 'mapbox-gl';

export interface MapStyleLayerSpec {
  id?: string;
  type?: string;
  source?: unknown;
  layout?: Record<string, unknown>;
  paint?: Record<string, unknown>;
  [key: string]: unknown;
}

export default class MapStyleLayer {
  id: string;
  layer: MapStyleLayerSpec;
  map: MapboxGL.Map | null;

  constructor(layer: MapStyleLayerSpec) {
    const id = layer.id || UUIDV4();
    this.id = id;
    this.layer = Object.assign(layer, { id });
    this.map = null;
  }
  addTo(map: MapboxGL.Map) {
    this.map = map;
    this.map.addLayer(Object.assign({}, this.layer) as Parameters<MapboxGL.Map['addLayer']>[0]);
  }
  remove = () => {
    if (!this.map) return;
    if (this.map.getLayer(this.id)) this.map.removeLayer(this.id);
    if (this.map.getSource(this.id)) this.map.removeSource(this.id);
  };
  toJSON() {
    return Object.assign({}, this.layer);
  }
}
