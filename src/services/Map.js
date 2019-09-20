import mapboxgl from 'mapbox-gl';
import config from '../config/env';
import UUIDV4 from 'uuid/v4';
import LngLat from './LngLat';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = config.mapboxPublicKey;

export default class Map {
  constructor() {
    this.map = null;
    this.emitter = null;
    this.layers = [];
    this.listeners = [];
    this.markers = [];
  }
  on(evtName, cb) {
    this.listeners.push({
      evtName,
      cb
    })
  }
  handleEvt(evtName, data) {
    return this.listeners.forEach(listener => {
      if(listener.evtName === evtName) {
        listener.cb(data);
      }
    })
  }
  moveTo = lngLat => {
    lngLat = new LngLat(lngLat);
    this.map.flyTo({
      center: lngLat.toJSON()
    });
  }
  load = (containerId, lngLat) => {
    this.map = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: new LngLat(lngLat).toJSON(),
      zoom: 10
    });
    this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    this.map.addControl(new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    }));
    this.map.on('style.load', () => this.handleEvt('load'));
    this.map.on('move', evt => this.handleEvt('move', evt));
  }
  addMarker = (type, lngLat) => {
    lngLat = new LngLat(lngLat);
    const el = document.createElement('div');
    el.className = 'ipp-marker';
    const id = UUIDV4();
    const marker = new mapboxgl.Marker({
      id,
      draggable: true,
      element: el
    });
    marker.setLngLat(lngLat.toJSON());
    marker.addTo(this.map);
    const markerData = {
      _id: id,
      type,
      marker
    };
    this.markers.push(markerData);
    return markerData;
  }
  updateMarkerById(id, data) {
    const markerData = this.markers.filter(marker => marker._id === id)[0];
    if(markerData) markerData.marker.setLngLat(data.lngLat.toJSON());
  }
  removeMarkerById(id) {
    this.markers = this.markers.filter(marker => {
      if(marker._id === id) {
        marker.marker.remove();
        return false;
      }
      return true;
    })
  }
  addLayer(type, layerData) {
    const id = UUIDV4();
    const layer = this.map.addLayer(Object.assign({}, layerData, {id}));
    const layerTracker = {
      _id: id,
      type,
      layer
    };

    this.layers.push(layerTracker);
    return layerTracker;
  }
  clearLayersByType(type) {
    this.layers = this.layers.filter(layer => {
      if(layer.type === type) {
        this.map.removeLayer(layer._id);
        return false;
      }
      return true;
    })
  }
  getCenter() {
    return this.map.getCenter();
  }
}
