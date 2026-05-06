import mapboxgl from './mapboxgl';
import LngLat from '../services/LngLat';
import InitialPlanningMarker from '../services/InitialPlanningMarker';
import DestinationMarker from '../services/DestinationMarker';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import StatisticsVirtualLayer from './statistics/StatisticsVirtualLayer';
import EventEmitter from 'events';
import { useAppStore } from '../store/appStore';

export const MAP_STYLES = {
  outdoors: { id: 'outdoors', label: 'Topo', url: 'mapbox://styles/mapbox/outdoors-v11' },
  satellite: { id: 'satellite', label: 'Satellite', url: 'mapbox://styles/mapbox/satellite-streets-v12' },
  streets: { id: 'streets', label: 'Streets', url: 'mapbox://styles/mapbox/streets-v12' },
  dark: { id: 'dark', label: 'Dark', url: 'mapbox://styles/mapbox/dark-v11' }
} as const;

export type MapStyleId = keyof typeof MAP_STYLES;

export default class SearchMap extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
    this.map = null;
    this.statsLayer = new StatisticsVirtualLayer();
    this.markers = {
      ipp: null,
      destination: null
    };
    this.style = 'outdoors';
    this.placingMode = null; // null | 'ipp' | 'direction'
  }
  load(containerId, lngLat) {
    this.map = new mapboxgl.Map({
      container: containerId,
      style: MAP_STYLES[this.style].url,
      center: new LngLat(lngLat).toJSON(),
      zoom: 10
    });
    this.map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-left');
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: false,
        showAccuracyCircle: true
      }),
      'top-left'
    );
    this.map.addControl(new mapboxgl.FullscreenControl(), 'top-left');
    this.map.addControl(new mapboxgl.ScaleControl({ unit: 'imperial' }), 'bottom-right');
    this.map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        collapsed: true,
        placeholder: 'Search location'
      })
    );

    this.map.on('load', (data) => this.emit('load', data));
    this.map.on('move', (data) => this.emit('move', data));
    this.map.on('mousemove', (evt) => this.emit('mousemove', evt));
    this.map.on('contextmenu', (evt) => {
      this.emit('contextmenu', evt);
    });
    this.map.on('click', (evt) => {
      if (this.placingMode === 'ipp') {
        this.setIPPMarker(evt.lngLat);
        this.setPlacingMode(null);
      } else if (this.placingMode === 'direction') {
        this.setDestinationMarker(evt.lngLat);
        this.setPlacingMode(null);
      }
      this.emit('click', evt);
    });
    this.map.on('style.load', () => {
      // After a style switch, custom sources/layers are wiped.
      // Reset references and redraw whatever was active.
      this.statsLayer.markStyleReset();
      if (this.markers.ipp) this.statsLayer.drawRings(this.markers.ipp, this.behavior);
      if (this.markers.ipp && this.markers.destination)
        this.statsLayer.drawDispersion(this.markers.ipp, this.markers.destination, this.behavior);
      this.emit('style.load', this.style);
    });
    this.statsLayer.addTo(this.map);
  }
  resize() {
    if (this.map) this.map.resize();
  }
  setMapStyle = (styleKey: MapStyleId) => {
    if (!this.map || !MAP_STYLES[styleKey]) return;
    // Clear current style-bound layers before switching
    this.statsLayer.clearRings();
    this.statsLayer.clearDispersion();
    this.style = styleKey;
    this.map.setStyle(MAP_STYLES[styleKey].url);
    this.emit('style.change', styleKey);
  };
  getMapStyle() {
    return this.style;
  }
  setPlacingMode = (mode: null | 'ipp' | 'direction') => {
    this.placingMode = mode;
    if (this.map) {
      const canvas = this.map.getCanvas();
      canvas.style.cursor = mode ? 'crosshair' : '';
    }
    this.emit('placing.change', mode);
  };
  getPlacingMode() {
    return this.placingMode;
  }
  setIPPMarker = (lngLat) => {
    lngLat = new LngLat(lngLat);
    const { setIppMarker } = useAppStore.getState();
    const updateStore = () => {
      setIppMarker([{ _id: 'ipp', lngLat: this.markers.ipp.getLngLat() }]);
    };
    if (this.markers.ipp) {
      this.markers.ipp.setLngLat(lngLat.toJSON());
    } else {
      this.markers.ipp = new InitialPlanningMarker({
        id: 'ipp',
        className: 'ipp-marker',
        draggable: true
      });
      this.markers.ipp.setLngLat(lngLat.toJSON());
      this.markers.ipp.addTo(this.map);
      this.markers.ipp.on('dragstart', () => {
        updateStore();
        this.statsLayer.clearRings();
        this.statsLayer.clearDispersion();
      });
      this.markers.ipp.on('drag', () => {
        updateStore();
      });
      this.markers.ipp.on('dragend', () => {
        this.statsLayer.drawRings(this.markers.ipp, this.behavior);
        if (this.markers.destination)
          this.statsLayer.drawDispersion(this.markers.ipp, this.markers.destination, this.behavior);
        updateStore();
      });
    }
    this.statsLayer.drawRings(this.markers.ipp, this.behavior);
    if (this.markers.destination)
      this.statsLayer.drawDispersion(this.markers.ipp, this.markers.destination, this.behavior);
    updateStore();
  };
  clearIPPMarker = () => {
    if (this.markers.ipp) this.markers.ipp.remove();
    this.markers.ipp = null;
    this.statsLayer.clearRings();
    this.statsLayer.clearDispersion();
    useAppStore.getState().clearIppMarker();
  };
  flyTo = (lngLat) => {
    lngLat = new LngLat(lngLat);
    if (!this.map) return;
    this.map.flyTo({
      center: lngLat.toJSON()
    });
    useAppStore.getState().setMapCenter(lngLat.toJSON());
  };
  getLngLat() {
    if (this.map) return this.map.getCenter();
  }
  setDestinationMarker = (lngLat) => {
    lngLat = new LngLat(lngLat);
    if (this.markers.destination) {
      this.markers.destination.setLngLat(lngLat.toJSON());
    } else {
      this.markers.destination = new DestinationMarker({
        id: 'destination',
        className: 'destination-marker',
        draggable: true
      });
      this.markers.destination.setLngLat(lngLat.toJSON());
      this.markers.destination.addTo(this.map);
      this.markers.destination.on('dragstart', () => {
        this.statsLayer.clearDispersion();
      });
      this.markers.destination.on('drag', () => {
        useAppStore
          .getState()
          .setDirectionMarker([{ _id: 'direction', lngLat: this.markers.destination.getLngLat() }]);
      });
      this.markers.destination.on('dragend', () => {
        if (this.markers.ipp)
          this.statsLayer.drawDispersion(this.markers.ipp, this.markers.destination, this.behavior);
        useAppStore
          .getState()
          .setDirectionMarker([{ _id: 'direction', lngLat: this.markers.destination.getLngLat() }]);
      });
    }
    useAppStore
      .getState()
      .setDirectionMarker([{ _id: 'direction', lngLat: this.markers.destination.getLngLat() }]);
    if (this.markers.ipp)
      this.statsLayer.drawDispersion(this.markers.ipp, this.markers.destination, this.behavior);
  };
  clearDestinationMarker = () => {
    if (this.markers.destination) {
      this.markers.destination.remove();
    }
    this.markers.destination = null;
    this.statsLayer.clearDispersion();
    useAppStore.getState().clearDirectionMarker();
  };
  clearAll = () => {
    this.clearIPPMarker();
    this.clearDestinationMarker();
  };
  setBehavior(behavior) {
    this.behavior = behavior;
    useAppStore.getState().setBehavior(behavior.toJSON());
    if (this.markers.ipp && this.markers.destination)
      this.statsLayer.drawDispersion(this.markers.ipp, this.markers.destination, this.behavior);
    if (this.markers.ipp) this.statsLayer.drawRings(this.markers.ipp, this.behavior);
  }
}
