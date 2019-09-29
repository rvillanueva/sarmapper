import mapboxgl from 'mapbox-gl';
import config from '../config/env';
import LngLat from '../services/LngLat';
import InitialPlanningMarker from '../services/InitialPlanningMarker';
import DestinationMarker from '../services/DestinationMarker';
import {updateIPPMarker, updateDestinationMarker} from '../actions/markerActions';
import {updateMapCenter} from '../actions/mapActions';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import StatisticsVirtualLayer from './StatisticsVirtualLayer';

mapboxgl.accessToken = config.mapboxPublicKey;

export default class SearchMap {
  constructor() {
    this.map = null;
    this.statsLayer = new StatisticsVirtualLayer();
    this.markers = {
      ipp: null,
      destination: null
    }
  }
  load(lngLat) {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: new LngLat(lngLat).toJSON(),
      zoom: 10
    });
    this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    this.map.addControl(new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    }));
    this.statsLayer.addTo(this.map);
  }
  setIPPMarker = lngLat => {
    lngLat = new LngLat(lngLat);
    if(this.markers.ipp) {
      this.markers.ipp.setLngLat(lngLat.toJSON());
    } else {
      this.markers.ipp = new InitialPlanningMarker({
        id: 'ipp',
        className: 'ipp-marker',
        draggable: true
      })
      this.markers.ipp.setLngLat(lngLat.toJSON());
      this.markers.ipp.addTo(this.map);
      this.statsLayer.applyIPPMarkerListeners(this.markers.destination);
      this.markers.ipp.on('dragstart', () => {
        updateIPPMarker(this.markers.ipp);
      });
      this.markers.ipp.on('dragend', () => {
        updateIPPMarker(this.markers.ipp);
      });
    }
    updateIPPMarker(this.markers.ipp);
  }
  clearIPPMarker = () => {
    if(this.markers.ipp) this.markers.ipp.remove();
    this.markers.ipp = null;
  }
  flyTo = lngLat => {
    lngLat = new LngLat(lngLat);
    this.map.flyTo(lngLat.toJSON());
    updateMapCenter(lngLat.toJSON());
  }
  setDestinationMarker(lngLat) {
    lngLat = new LngLat(lngLat);
    if(this.markers.destination) {
      this.markers.destination.setLngLat(lngLat.toJSON());
    } else {
      this.markers.destination = new DestinationMarker({
        id: 'destination',
        className: 'destinationMarker',
        draggable: true
      });
      this.markers.destination.setLngLat(lngLat.toJSON());
      this.markers.destination.addTo(this.map);
      this.statsLayer.applyDestinationMarkerListeners(this.markers.destination);
      this.markers.destination.on('dragstart', () => {
        this.clearDispersion();
      });
      this.markers.destination.on('dragend', (evt) => {
        const lngLat = new LngLat(this.markers.destination.getLngLat());
        updateDestinationMarker(lngLat);
      });
    }
    updateDestinationMarker(this.markers.destination);
    this.drawDispersion();
  }
  clearDestinationMarker() {
    if(this.markers.destination) {
      this.markers.destination.remove();
    }
    this.markers.destination = null;
    updateDestinationMarker(null);
  }
}
