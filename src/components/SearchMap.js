import React from 'react';
import mapbox from 'mapbox-gl';
import config from '../config/env';
import Map from '../services/Map';
import InitialPlanningPoint from '../services/InitialPlanningPoint';
import BehaviorProfiles from '../services/Behaviors';

mapbox.accessToken = config.mapboxPublicKey;

export default class SearchMap extends React.Component {
  constructor() {
    super();
    this.map = new Map();
    this.profiler = new BehaviorProfiles();
    this.ipp = null;
    this.ippMarker = null;

    this.map.on('load', () => this.setIPP(this.props.ipp));
    this.map.on('move', evt => this.props.updateMapCenter(this.map.getCenter()));
  }
  componentDidMount = () => {
    this.props.setMapRef(this.map);
    this.handleBehaviorChange();
    this.map.load('map', this.props.ipp);
  }
  componentDidUpdate = (prevProps) => {
    if(this.props.behavior !== prevProps.behavior) {
      this.handleBehaviorChange();
    }
    if(!this.props.ipp) {
      this.clearIPP();
    } else if(prevProps.ipp !== this.props.ipp) {
      this.setIPP(this.props.ipp);
    }
  }
  clearIPP = () => {
    if(this.ippMarker) {
      this.map.removeMarkerById(this.ippMarker._id);
    }
    this.ipp = null;
    this.ippMarker = null;
    this.redrawAnnotations();
  }
  moveTo = lngLat => {
    this.map.moveTo(lngLat);
  }
  setIPP = (lngLat) => {
    if(!this.ipp) {
      this.ipp = new InitialPlanningPoint(lngLat, this.props.behavior);
    } else {
      this.ipp.setLngLat(lngLat);
    }
    if(!this.ippMarker) {
      const marker = this.map.addMarker('ipp', this.ipp.getLngLat());
      this.ippMarker = marker;
      this.ippMarker.marker.on('dragstart', () => this.clearRings());
      this.ippMarker.marker.on('dragend', (evt) => {
        const lngLat = this.ippMarker.marker.getLngLat()
        this.props.setIPP(lngLat);
        this.setIPP(lngLat);
        this.drawRings()
      });
    }
    this.redrawAnnotations();
  }
  handleBehaviorChange = () => {
    if(this.ipp) {
      this.ipp.setBehavior(this.props.behavior);
    }
    this.redrawAnnotations();
  }
  clearRings() {
    this.map.clearLayersByType('ringCollection');
    this.map.clearLayersByType('labelCollection');
  }
  drawRings() {
    const ringCollectionLayer = this.ipp.getRangeRingCollectionLayer();
    const labelCollectionLayer = this.ipp.getLabelCollectionLayer();
    this.map.addLayer('ringCollection', ringCollectionLayer);
    this.map.addLayer('labelCollection', labelCollectionLayer);
  }
  drawIPP() {
    this.map.updateMarkerById(this.ippMarker._id, {
      lngLat: this.ipp.getLngLat()
    });
  }
  redrawAnnotations() {
    this.clearRings();
    if(this.ipp) {
      this.drawIPP();
      this.drawRings();
    }
  }
  render() {
    return <div id="map" />;
  }
}
