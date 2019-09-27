import mapboxgl from 'mapbox-gl';
import config from '../config/env';
import LngLat from '../services/LngLat';
import DirectionPoint from '../services/DirectionPoint';
import InitialPlanningPoint from '../services/InitialPlanningPoint';
import store from '../store';
import {updateMapCenter} from '../actions/mapActions';
import {setIPPMarker, setDirectionMarker, clearDirectionMarker} from '../actions/markerActions';
import UUIDV4 from 'uuid/v4';

const {dispatch} = store;
mapboxgl.accessToken = config.mapboxPublicKey;

export default class SearchMap {
  constructor() {
    this.map = null

    this.ipp = null;
    this.direction = null;

    this.rings = null;
    this.labels = null;
    this.dispersionLines = null;
    this.directionLine = null;
  }
  load(containerId, lngLat) {
    this.map = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: new LngLat(lngLat).toJSON(),
      zoom: 10
    });
    this.map.on('load', () => {
      dispatch(setIPPMarker(this.map.getCenter()))
    });
    this.map.on('move', evt => dispatch(updateMapCenter(this.map.getCenter())));

  }
  setIPPMarker = lngLat => {
    lngLat = new LngLat(lngLat);
    if(this.ipp) {
      this.ipp.setLngLat(lngLat.toJSON());
    } else {
      const el = document.createElement('div');
      el.className = 'ipp-marker';
      this.ipp = new mapboxgl.Marker({
        id: 'ipp',
        draggable: true,
        element: el
      });
      this.ipp.setLngLat(lngLat.toJSON());
      this.ipp.addTo(this.map)
      this.ipp.on('dragstart', () => {
        this.clearRings();
        this.clearDispersion();
      });
      this.ipp.on('dragend', (evt) => {
        const lngLat = this.ipp.getLngLat()
        setIPPMarker(lngLat);
        this.drawRings();
        this.drawDispersion();
      });
    }
    this.drawRings();
    this.drawDispersion();
  }
  clearIPP = () => {
    if(this.ipp) this.ipp.remove();
    this.ipp = null;
    this.clearRings();
  }
  flyTo = lngLat => {
    lngLat = new LngLat(lngLat);
    this.map.flyTo(lngLat.toJSON());
  }
  setDirectionMarker(lngLat) {
    lngLat = new LngLat(lngLat);
    if(this.direction) {
      this.direction.setLngLat(lngLat.toJSON());
    } else {
      const el = document.createElement('div');
      el.className = 'direction-marker';
      this.direction = new mapboxgl.Marker({
        id: 'direction',
        draggable: true,
        element: el
      });
      this.direction.setLngLat(lngLat.toJSON());
      this.direction.addTo(this.map)
      this.direction.on('dragstart', () => {
        this.clearDispersion();
      });
      this.direction.on('dragend', (evt) => {
        setDirectionMarker(lngLat);
        this.drawDispersion();
      });
    }
    this.drawDispersion();
  }
  setBehavior = behavior => {
    this.behavior = behavior;
    this.drawRings();
    this.drawDispersion();
  }
  addLayer(layer) {
    if(!layer.id) layer.id = UUIDV4();
    return {
      layer: this.map.addLayer(layer),
      remove: () => this.removeLayer(layer.id)
    }
  }
  removeLayer(id) {
    this.map.removeLayer(id);
    this.map.removeSource(id);
  }
  clearRings() {
    if(this.rings) {
      this.rings.remove();
      this.rings = null;
    }
    if(this.labels) {
      this.labels.remove();
      this.labels = null;
    }
  }
  clearDispersion = () => {
    if(this.dispersion) {
      this.dispersion.remove();
      this.dispersion = null;
    }
    if(this.directionLine) {
      this.directionLine.remove();
      this.directionLine = null;
    }
  }
  clearDirectionMarker = () => {
    this.clearDispersion();
    if(this.direction) {
      this.direction.remove();
      this.direction = null;
    }
  }
  clearIPPMarker = () => {
    this.clearRings();
    clearDirectionMarker();
    this.clearDispersion();
    if(this.ipp) {
      this.ipp.remove();
      this.ipp = null;
    }
  }
  drawRings = () => {
    if(!this.ipp) return;
    this.clearRings();
    const ipp = new InitialPlanningPoint(this.ipp.getLngLat(), this.behavior);
    const ringCollectionLayer = ipp.getRangeRingCollectionLayer();
    const labelCollectionLayer = ipp.getLabelCollectionLayer();
    this.rings = this.addLayer(ringCollectionLayer);
    this.labels = this.addLayer(labelCollectionLayer);
  }
  drawDispersion() {
    this.clearDispersion();
    if(this.direction && this.ipp) {
      const direction = new DirectionPoint(this.direction.getLngLat());
      const dispersionCollectionLayer = direction.getDispersionCollectionLayer(this.ipp.getLngLat(), this.behavior);
      const directionLineLayer = direction.getDirectionLineLayer(this.ipp.getLngLat());
      this.dispersion = this.addLayer(dispersionCollectionLayer);
      this.directionLine = this.addLayer(directionLineLayer);
    }
  }
}
