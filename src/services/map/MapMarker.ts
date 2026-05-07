import mapboxgl from 'mapbox-gl';
import config from '../../config/env';
import { v4 as UUIDV4 } from 'uuid';

mapboxgl.accessToken = config.mapboxPublicKey;

export interface MarkerOptions {
  id?: string;
  className?: string;
  draggable?: boolean;
  innerHTML?: string;
  rotationAlignment?: 'map' | 'viewport' | 'auto';
  [key: string]: unknown;
}

export default class MapMarker {
  map: mapboxgl.Map | null;
  markerOptions: MarkerOptions;
  marker: mapboxgl.Marker;
  el!: HTMLElement;
  id!: string;
  on: mapboxgl.Marker['on'];
  setLngLat: mapboxgl.Marker['setLngLat'];
  getLngLat: mapboxgl.Marker['getLngLat'];
  setRotation: mapboxgl.Marker['setRotation'];

  constructor(markerOptions: MarkerOptions) {
    this.map = null;
    this.markerOptions = markerOptions;
    this.marker = this._init();
    this.on = this.marker.on.bind(this.marker);
    this.setLngLat = this.marker.setLngLat.bind(this.marker);
    this.getLngLat = this.marker.getLngLat.bind(this.marker);
    this.setRotation = this.marker.setRotation.bind(this.marker);
  }
  getOptions(): MarkerOptions {
    return this.markerOptions;
  }
  _init() {
    const markerOptions = this.getOptions();
    const el = document.createElement('div');
    el.className = markerOptions.className || '';
    if (markerOptions.innerHTML) {
      el.innerHTML = markerOptions.innerHTML;
    }
    this.el = el;
    this.id = markerOptions.id || UUIDV4();
    return new mapboxgl.Marker({
      ...markerOptions,
      element: el,
    } as mapboxgl.MarkerOptions);
  }
  addTo(map: mapboxgl.Map) {
    this.map = map;
    this.marker.addTo(map);
  }
  remove() {
    this.marker.remove();
  }
}
