import mapboxgl from './mapboxgl';
import LngLat, { type LngLatInput } from '../services/LngLat';
import InitialPlanningMarker from '../services/InitialPlanningMarker';
import DestinationMarker from '../services/DestinationMarker';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import StatisticsVirtualLayer from './statistics/StatisticsVirtualLayer';
import EventEmitter from 'events';
import { useAppStore } from '../store/appStore';
import { DEFAULT_MAP_STYLE } from './map/mapStyles';
import type StatisticalBehavior from './statistics/StatisticalBehavior';
import type MapMarker from './map/MapMarker';

interface Markers {
  ipp: MapMarker | null;
  destination: MapMarker | null;
}

export default class SearchMap extends EventEmitter {
  map: mapboxgl.Map | null;
  statsLayer: StatisticsVirtualLayer;
  markers: Markers;
  behavior?: StatisticalBehavior;
  _touchActive = false;
  _contextmenuEmittedDuringTouch = false;

  constructor() {
    super();
    this.map = null;
    this.statsLayer = new StatisticsVirtualLayer();
    this.markers = {
      ipp: null,
      destination: null,
    };
  }
  load(containerId: string, lngLat: LngLatInput) {
    this.map = new mapboxgl.Map({
      container: containerId,
      style: DEFAULT_MAP_STYLE.url,
      center: new LngLat(lngLat).toJSON(),
      zoom: 10,
    });
    this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    this.map.addControl(new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    }) as unknown as mapboxgl.IControl);
    this.map.on('load', data => this.emit('load', data));
    this.map.on('move', data => this.emit('move', data));
    this.map.on('contextmenu', evt => {
      if (evt.originalEvent && typeof evt.originalEvent.preventDefault === 'function') {
        evt.originalEvent.preventDefault();
      }
      // Android Chrome fires a native contextmenu during a long-press touch in addition
      // to our custom long-press timer. Dedupe so only one emission reaches listeners.
      if(this._touchActive) {
        if(this._contextmenuEmittedDuringTouch) return;
        this._contextmenuEmittedDuringTouch = true;
      }
      this.emit('contextmenu', { lngLat: evt.lngLat, point: evt.point, originalEvent: evt.originalEvent });
    });
    this._attachLongPressHandler();
    this.statsLayer.addTo(this.map);
  }
  _attachLongPressHandler() {
    if (!this.map) return;
    const container = this.map.getContainer();
    let pressTimer: ReturnType<typeof setTimeout> | null = null;
    let pressStart: { x: number; y: number } | null = null;
    const cancel = () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
      pressStart = null;
      this._touchActive = false;
      this._contextmenuEmittedDuringTouch = false;
    };
    const isOnInteractive = (target: EventTarget | null) => {
      if (!target || !(target instanceof Element)) return false;
      return Boolean(target.closest('.mapboxgl-marker, .mapboxgl-ctrl, .mapboxgl-popup, .sar-map-context-menu'));
    };
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) { cancel(); return; }
      if (isOnInteractive(e.target)) return;
      const t = e.touches[0];
      this._touchActive = true;
      this._contextmenuEmittedDuringTouch = false;
      pressStart = { x: t.clientX, y: t.clientY };
      pressTimer = setTimeout(() => {
        pressTimer = null;
        if (!pressStart || !this.map) return;
        if (this._contextmenuEmittedDuringTouch) return;
        this._contextmenuEmittedDuringTouch = true;
        const rect = container.getBoundingClientRect();
        const point = { x: pressStart.x - rect.left, y: pressStart.y - rect.top };
        const lngLat = this.map.unproject([point.x, point.y]);
        this.emit('contextmenu', { lngLat, point, originalEvent: e });
      }, 500);
    }, { passive: true });
    container.addEventListener('touchmove', (e) => {
      if (!pressTimer || !pressStart) return;
      const t = e.touches[0];
      if (Math.hypot(t.clientX - pressStart.x, t.clientY - pressStart.y) > 10) cancel();
    }, { passive: true });
    container.addEventListener('touchend', cancel);
    container.addEventListener('touchcancel', cancel);
  }
  resize() {
    if (this.map) this.map.resize();
  }
  _updateDirectionRotation = () => {
    if (!this.markers.ipp || !this.markers.destination) return;
    const ippPos = this.markers.ipp.getLngLat();
    const destPos = this.markers.destination.getLngLat();
    const bearing = new LngLat(destPos).getBearingTo(ippPos);
    this.markers.destination.setRotation(bearing);
  };
  setIPPMarker = (lngLat: LngLatInput) => {
    const next = new LngLat(lngLat);
    const { setIppMarker } = useAppStore.getState();
    const updateStore = () => {
      if (this.markers.ipp) {
        setIppMarker([{ _id: 'ipp', lngLat: this.markers.ipp.getLngLat() }]);
      }
    };
    if (this.markers.ipp) {
      this.markers.ipp.setLngLat(next.toJSON());
    } else {
      const ipp = new InitialPlanningMarker({
        id: 'ipp',
        className: 'ipp-marker',
        draggable: true,
      });
      this.markers.ipp = ipp;
      ipp.setLngLat(next.toJSON());
      if (this.map) ipp.addTo(this.map);
      let dragStartIpp: { lng: number; lat: number } | null = null;
      let dragStartDest: { lng: number; lat: number } | null = null;
      ipp.on('dragstart', () => {
        const ippPos = ipp.getLngLat();
        dragStartIpp = { lng: ippPos.lng, lat: ippPos.lat };
        if (this.markers.destination) {
          const destPos = this.markers.destination.getLngLat();
          dragStartDest = { lng: destPos.lng, lat: destPos.lat };
        } else {
          dragStartDest = null;
        }
        updateStore();
        this.statsLayer.clearRings();
        this.statsLayer.clearDispersion();
      });
      ipp.on('drag', () => {
        if (this.markers.destination && dragStartIpp && dragStartDest) {
          const ippPos = ipp.getLngLat();
          this.markers.destination.setLngLat({
            lng: dragStartDest.lng + (ippPos.lng - dragStartIpp.lng),
            lat: dragStartDest.lat + (ippPos.lat - dragStartIpp.lat),
          });
        }
        this._updateDirectionRotation();
        updateStore();
      });
      ipp.on('dragend', () => {
        if (this.behavior) this.statsLayer.drawRings(ipp, this.behavior);
        if (this.markers.destination && this.behavior) {
          this.statsLayer.drawDispersion(ipp, this.markers.destination, this.behavior);
        }
        if (this.markers.destination) {
          useAppStore.getState().setDirectionMarker([{ _id: 'direction', lngLat: this.markers.destination.getLngLat() }]);
        }
        dragStartIpp = null;
        dragStartDest = null;
        updateStore();
      });
    }
    if (this.behavior) this.statsLayer.drawRings(this.markers.ipp, this.behavior);
    if (this.markers.destination && this.behavior) {
      this.statsLayer.drawDispersion(this.markers.ipp, this.markers.destination, this.behavior);
    }
    this._updateDirectionRotation();
    updateStore();
  };
  clearIPPMarker = () => {
    if (this.markers.ipp) this.markers.ipp.remove();
    this.markers.ipp = null;
    this.statsLayer.clearRings();
    this.statsLayer.clearDispersion();
    useAppStore.getState().clearIppMarker();
  };
  flyTo = (lngLat: LngLatInput) => {
    const next = new LngLat(lngLat);
    if (this.map) {
      this.map.flyTo({
        center: next.toJSON(),
      });
    }
    useAppStore.getState().setMapCenter(next.toJSON());
  };
  getLngLat() {
    if (this.map) return this.map.getCenter();
  }
  setDestinationMarker(lngLat: LngLatInput) {
    const next = new LngLat(lngLat);
    if (this.markers.destination) {
      this.markers.destination.setLngLat(next.toJSON());
    } else {
      const destination = new DestinationMarker({
        id: 'destination',
        className: 'destination-marker',
        draggable: true,
      });
      this.markers.destination = destination;
      destination.setLngLat(next.toJSON());
      if (this.map) destination.addTo(this.map);
      destination.on('dragstart', () => {
        this.statsLayer.clearDispersion();
      });
      destination.on('drag', () => {
        this._updateDirectionRotation();
      });
      destination.on('dragend', () => {
        if (this.markers.ipp && this.behavior) {
          this.statsLayer.drawDispersion(this.markers.ipp, destination, this.behavior);
        }
        this._updateDirectionRotation();
        useAppStore.getState().setDirectionMarker([{ _id: 'direction', lngLat: destination.getLngLat() }]);
      });
    }
    this._updateDirectionRotation();
    useAppStore.getState().setDirectionMarker([{ _id: 'direction', lngLat: this.markers.destination.getLngLat() }]);
    if (this.markers.ipp && this.behavior) {
      this.statsLayer.drawDispersion(this.markers.ipp, this.markers.destination, this.behavior);
    }
  }
  clearDestinationMarker() {
    if (this.markers.destination) {
      this.markers.destination.remove();
    }
    this.markers.destination = null;
    this.statsLayer.clearDispersion();
    useAppStore.getState().clearDirectionMarker();
  }
  setBehavior(behavior: StatisticalBehavior) {
    this.behavior = behavior;
    useAppStore.getState().setBehavior(behavior.toJSON());
    if (this.markers.ipp && this.markers.destination) {
      this.statsLayer.drawDispersion(this.markers.ipp, this.markers.destination, this.behavior);
    }
    if (this.markers.ipp) this.statsLayer.drawRings(this.markers.ipp, this.behavior);
  }
  setMapStyle = (styleUrl: string) => {
    if (!this.map) return;
    this.map.once('style.load', () => {
      if (this.markers.ipp && this.behavior) this.statsLayer.drawRings(this.markers.ipp, this.behavior);
      if (this.markers.ipp && this.markers.destination && this.behavior) {
        this.statsLayer.drawDispersion(this.markers.ipp, this.markers.destination, this.behavior);
      }
    });
    this.map.setStyle(styleUrl);
  };
}
