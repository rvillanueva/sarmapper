import mapboxgl from './mapboxgl';
import LngLat from '../services/LngLat';
import InitialPlanningMarker from '../services/InitialPlanningMarker';
import DestinationMarker from '../services/DestinationMarker';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import StatisticsVirtualLayer from './statistics/StatisticsVirtualLayer';
import EventEmitter from 'events';
import { useAppStore } from '../store/appStore';
import { DEFAULT_MAP_STYLE } from './map/mapStyles';

export default class SearchMap extends EventEmitter {
  constructor() {
    super();
    this.map = null;
    this.statsLayer = new StatisticsVirtualLayer();
    this.markers = {
      ipp: null,
      destination: null
    }
  }
  load(containerId, lngLat) {
    this.map = new mapboxgl.Map({
      container: containerId,
      style: DEFAULT_MAP_STYLE.url,
      center: new LngLat(lngLat).toJSON(),
      zoom: 10
    });
    this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    this.map.addControl(new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    }));
    this.map.on('load', data => this.emit('load', data));
    this.map.on('move', data => this.emit('move', data))
    this.map.on('contextmenu', evt => {
      if(evt.originalEvent && typeof evt.originalEvent.preventDefault === 'function') {
        evt.originalEvent.preventDefault();
      }
      this.emit('contextmenu', { lngLat: evt.lngLat, point: evt.point, originalEvent: evt.originalEvent });
    });
    this._attachLongPressHandler();
    this.statsLayer.addTo(this.map);
  }
  _attachLongPressHandler() {
    if(!this.map) return;
    const container = this.map.getContainer();
    let pressTimer = null;
    let pressStart = null;
    const cancel = () => {
      if(pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
      pressStart = null;
    };
    const isOnInteractive = (target) => {
      if(!target || typeof target.closest !== 'function') return false;
      return Boolean(target.closest('.mapboxgl-marker, .mapboxgl-ctrl, .mapboxgl-popup, .sar-map-context-menu'));
    };
    container.addEventListener('touchstart', (e) => {
      if(e.touches.length !== 1) { cancel(); return; }
      if(isOnInteractive(e.target)) return;
      const t = e.touches[0];
      pressStart = { x: t.clientX, y: t.clientY };
      pressTimer = setTimeout(() => {
        if(!pressStart || !this.map) return;
        const rect = container.getBoundingClientRect();
        const point = { x: pressStart.x - rect.left, y: pressStart.y - rect.top };
        const lngLat = this.map.unproject([point.x, point.y]);
        this.emit('contextmenu', { lngLat, point, originalEvent: e });
        pressTimer = null;
      }, 500);
    }, { passive: true });
    container.addEventListener('touchmove', (e) => {
      if(!pressTimer || !pressStart) return;
      const t = e.touches[0];
      if(Math.hypot(t.clientX - pressStart.x, t.clientY - pressStart.y) > 10) cancel();
    }, { passive: true });
    container.addEventListener('touchend', cancel);
    container.addEventListener('touchcancel', cancel);
  }
  resize() {
    if(this.map) this.map.resize();
  }
  setIPPMarker = lngLat => {
    lngLat = new LngLat(lngLat);
    const { setIppMarker } = useAppStore.getState();
    const updateStore = () => {
      setIppMarker([{ _id: 'ipp', lngLat: this.markers.ipp.getLngLat() }]);
    };
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
      this.markers.ipp.on('dragstart', () => {
        updateStore();
        this.statsLayer.clearRings();
        this.statsLayer.clearDispersion();
      });
      this.markers.ipp.on('drag', () => {
        updateStore();
      })
      this.markers.ipp.on('dragend', () => {
        this.statsLayer.drawRings(this.markers.ipp, this.behavior);
        if(this.markers.destination) this.statsLayer.drawDispersion(this.markers.ipp, this.markers.destination, this.behavior);
        updateStore();
      });
    }
    this.statsLayer.drawRings(this.markers.ipp, this.behavior);
    if(this.markers.destination) this.statsLayer.drawDispersion(this.markers.ipp, this.markers.destination, this.behavior);
    updateStore();
  }
  clearIPPMarker = () => {
    if(this.markers.ipp) this.markers.ipp.remove();
    this.markers.ipp = null;
    this.statsLayer.clearRings();
    this.statsLayer.clearDispersion();
    useAppStore.getState().clearIppMarker();
  }
  flyTo = lngLat => {
    lngLat = new LngLat(lngLat);
    this.map.flyTo({
      center: lngLat.toJSON()
    });
    useAppStore.getState().setMapCenter(lngLat.toJSON());
  }
  getLngLat() {
    if(this.map) return this.map.getCenter();
  }
  setDestinationMarker(lngLat) {
    lngLat = new LngLat(lngLat);
    if(this.markers.destination) {
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
      this.markers.destination.on('dragend', (evt) => {
        if(this.markers.ipp) this.statsLayer.drawDispersion(this.markers.ipp, this.markers.destination, this.behavior);
        useAppStore.getState().setDirectionMarker([{ _id: 'direction', lngLat: this.markers.destination.getLngLat() }]);
      });
    }
    useAppStore.getState().setDirectionMarker([{ _id: 'direction', lngLat: this.markers.destination.getLngLat() }]);
    if(this.markers.ipp) this.statsLayer.drawDispersion(this.markers.ipp, this.markers.destination, this.behavior);
  }
  clearDestinationMarker() {
    if(this.markers.destination) {
      this.markers.destination.remove();
    }
    this.markers.destination = null;
    this.statsLayer.clearDispersion();
    useAppStore.getState().clearDirectionMarker();
  }
  setBehavior(behavior) {
    this.behavior = behavior;
    useAppStore.getState().setBehavior(behavior.toJSON());
    if(this.markers.ipp && this.markers.destination) this.statsLayer.drawDispersion(this.markers.ipp, this.markers.destination, this.behavior);
    if(this.markers.ipp) this.statsLayer.drawRings(this.markers.ipp, this.behavior);
  }
  setMapStyle = (styleUrl) => {
    if(!this.map) return;
    this.map.once('style.load', () => {
      if(this.markers.ipp && this.behavior) this.statsLayer.drawRings(this.markers.ipp, this.behavior);
      if(this.markers.ipp && this.markers.destination && this.behavior) {
        this.statsLayer.drawDispersion(this.markers.ipp, this.markers.destination, this.behavior);
      }
    });
    this.map.setStyle(styleUrl);
  }
}
