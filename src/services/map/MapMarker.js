import mapboxgl from 'mapbox-gl';
import config from '../config/env';
import UUIDV4 from 'uuid/v4';

mapboxgl.accessToken = config.mapboxPublicKey;

export default class MapMarker {
  constructor(markerOptions) {
    this.map = null;
    this.markerOptions = markerOptions;
  }
  getOptions() {
    return this.markerOptions;
  }
  _init() {
    const markerOptions = this.getOptions();
    const el = document.createElement('div');
    el.className = markerOptions.className || '';
     this.id = markerOptions.id || UUIDV4();
     return new mapboxgl.Marker({
      ...markerOptions,
      id: this.id,
      element: el
    });
  }
  addTo(map) {
    this.map = map;
    this.marker.addTo(map);
  }
  remove() {
    this.marker.remove();
  }
  on = this.marker.on;
  setLngLat = this.marker.setLngLat;
  getLngLat = this.marker.getLngLat;
}
