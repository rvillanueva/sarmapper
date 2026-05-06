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
    this.statsLayer.addTo(this.map);
  }
  resize() {
    if (this.map) this.map.resize();
  }
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
      ipp.on('dragstart', () => {
        updateStore();
        this.statsLayer.clearRings();
        this.statsLayer.clearDispersion();
      });
      ipp.on('drag', () => {
        updateStore();
      });
      ipp.on('dragend', () => {
        if (this.behavior) this.statsLayer.drawRings(ipp, this.behavior);
        if (this.markers.destination && this.behavior) {
          this.statsLayer.drawDispersion(ipp, this.markers.destination, this.behavior);
        }
        updateStore();
      });
    }
    if (this.behavior) this.statsLayer.drawRings(this.markers.ipp, this.behavior);
    if (this.markers.destination && this.behavior) {
      this.statsLayer.drawDispersion(this.markers.ipp, this.markers.destination, this.behavior);
    }
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
      destination.on('dragend', () => {
        if (this.markers.ipp && this.behavior) {
          this.statsLayer.drawDispersion(this.markers.ipp, destination, this.behavior);
        }
        useAppStore.getState().setDirectionMarker([{ _id: 'direction', lngLat: destination.getLngLat() }]);
      });
    }
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
