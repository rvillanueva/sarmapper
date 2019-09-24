import React from 'react';
import mapbox from 'mapbox-gl';
import config from '../config/env';
import Map from '../services/Map';
import LngLat from '../services/LngLat';
import DirectionPoint from '../services/DirectionPoint';
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
    this.directionPoint = null;

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
    if(!this.props.directionPoint) {
      this.clearDirectionPoint();
      this.clearDispersion();
    } else if(prevProps.directionPoint !== this.props.directionPoint) {
      this.setDirectionPoint(this.props.directionPoint);
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
      this.ippMarker.marker.on('dragstart', () => {
        this.clearRings();
        this.clearDispersion();
      });
      this.ippMarker.marker.on('dragend', (evt) => {
        const lngLat = this.ippMarker.marker.getLngLat()
        this.props.setIPP(lngLat);
        this.setIPP(lngLat);
        this.redrawAnnotations();
      });
    }
    this.redrawAnnotations();
  }
  setDirectionPoint(lngLat) {
    lngLat = new LngLat(lngLat);
    if(!lngLat) {
      this.clearDirectionPoint();
    } else if(!this.directionPoint) {
      this.directionPoint = new DirectionPoint(lngLat);
      this.directionPointMarker = this.map.addMarker('directionOfTravel', lngLat);
      this.directionPointMarker.marker.on('dragstart', () =>this.clearDispersion());
      this.directionPointMarker.marker.on('dragend', evt => {
        const lngLat = this.directionPointMarker.marker.getLngLat();
        this.directionPoint.setLngLat(lngLat);
        this.props.updateDirectionPoint(lngLat);
        this.redrawAnnotations();
      });

    } else {
      this.map.updateMarkerById(this.directionPointMarker._id, {
        lngLat
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
  clearDirectionPoint() {
    if(this.directionPoint) {
      this.map.removeMarkerById(this.directionPointMarker._id);
      this.directionPoint = null;
      this.directionPointMarker = null;
    }
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
  drawDispersion() {
    if(this.directionPoint) {
      const dispersionCollectionLayer = this.directionPoint.getDispersionCollectionLayer(this.ipp.getLngLat(), this.props.behavior);
      const directionLineLayer = this.directionPoint.getDirectionLineLayer(this.ipp.getLngLat());
      this.map.addLayer('dispersionCollection', dispersionCollectionLayer);
      this.map.addLayer('directionLine', directionLineLayer);
    }
  }
  clearDispersion = () => {
    this.map.clearLayersByType('dispersionCollection');
    this.map.clearLayersByType('directionLine');
  }
  drawIPP() {
    this.map.updateMarkerById(this.ippMarker._id, {
      lngLat: this.ipp.getLngLat()
    });
  }
  redrawAnnotations = () => {
    this.clearRings();
    this.clearDispersion();
    if(this.ipp) {
      this.drawIPP();
      this.drawDispersion();
      this.drawRings();
    }
  }
  render() {
    return <div id="map" />;
  }
}
